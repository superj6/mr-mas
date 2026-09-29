# Stick reel generator (`studio/src/reel/`)

This folder draws the stick-figure reels: rough, data-driven animatics used to judge flow and dialogue before any
pixel work. Each reel is a 1280×720, 24 fps Remotion composition built from a JSON timeline in `show/reel/`.

- **One reel per timeline.** Examples: the season outline reels `reel-ep01` … `reel-ep12`, and the Act Four v5 dialogue reel `reel-ep01-act4-v5`.
- **Episode reels (new, 2026-09-26).** A whole episode plays on one timeline: the cold open, the intro slot, the card, the acts, the tag and the credits. The real intro video is spliced in with its own sound, a temp bed runs for each sequence, and a render mode builds the chapters in parallel.

All commands below run from `studio/`, unless a line says otherwise.

## Files

| File | What it does |
|---|---|
| `schema.ts` | The writers' JSON contract and its normalisation, plus `timeEpisode()` (frame layout). `timeEpisode(ep, head)` takes the title-card length; it defaults to 72 frames and is 0 for a chapter inside an episode. |
| `Reel.tsx` | The layout: the picture inset, the amber notes margin, the dialogue strip and the timeline bar. With an optional `clock` prop, a reel becomes a chapter of an episode (see below). Without it, the output is unchanged. |
| `Stage.tsx`, `Figure.tsx`, `Sets.tsx`, `look.ts` | The picture: sets, figures, cards and styles. |
| `registry.ts` | Registers one composition per `data/*.json`, plus `reel-season` and `reel-ep01-full` (the older hand-stitched pilot). It also registers **`reel-<key>` for every synced manifest** and **`reel-episode` for a manifest passed as input props**. |
| `episode.ts` | **New.** Turns a manifest into an `EpisodePlan`: the chapters on one clock, the two-row bar, name reveals carried across chapters, and the audio plan. |
| `EpisodeReel.tsx` | **New.** The episode composition. Title, video slot and reviewer slate are drawn here; reel and card chapters are `Reel` with a clock. |
| `sync.mjs` | Copies and lints `show/reel/*.json` into `data/` (the bundle reads `data/`; never edit it). It now recognises `*.manifest.json` and lints each as a manifest. **Since 2026-09-27 it also reads one level of subfolders** (for example `show/reel/ep01-full/*.json`): those files land in `data/` flat under their own names, so a timeline's key is still its basename, and a flat file wins a name clash (the sync prints a `!` line). |
| `tools/episode.mjs` | **New.** The episode renderer: plan, parallel segments, splice, concat, mix and mux. |
| `tools/mixer.mjs` | **New.** The episode mixer (Node only). It runs inside `episode.mjs`, or on its own from a `plan.json`. |
| `examples/ep01-full-v1.manifest.json` | **New.** A test manifest for all of Ep1, built from today's material (see its `_about`). |

The older single-reel scripts still work as before:

- `bash src/dev/reel/render_all.sh [keys]` renders to `out/season/reels/`.
- `node src/dev/reel/stills.mjs <compId> <dir> --sheet` makes a contact sheet.
- `npx remotion studio src/dev/reel/entry.tsx` opens the studio. Run `node src/reel/sync.mjs --watch` alongside it.

## Episode reels: quick start

```sh
# 1. see the plan: chapters, clocks, beds, warnings (bundles on the first run, about 30 s)
node src/reel/tools/episode.mjs src/reel/examples/ep01-full-v1.manifest.json --plan

# 2. render the whole episode: chapters in parallel, then concat, mix and mux
node src/reel/tools/episode.mjs src/reel/examples/ep01-full-v1.manifest.json --jobs 3 --conc 4
#    -> out/ep01/reel/ep01-full-v1.mp4 (+ -chapters.json, -measure.json); work files in studio/out/reel-work/ep01-full-v1/

# 3. after a fix to one chapter, run step 2 again: only the changed chapter's segments re-render
# 4. a preview of only some chapters, back to back
node src/reel/tools/episode.mjs <manifest> --only act3,act4
```

**Options:**

| Option | What it does |
|---|---|
| `--out F.mp4` | The output file. The default is `out/epNN/reel/<key>.mp4` (org plan §2). |
| `--work DIR` | Where the bundle, segments, `plan.json`, `mix.wav` and `mix-qa.json` go. The default is `studio/out/reel-work/<key>/`, which is git-ignored. |
| `--jobs N` | Segments rendered at once (default 3). |
| `--conc N` | Remotion browser tabs per render (default 4). |
| `--seg S` | The longest segment, in seconds (default 90). Long chapters are split so the jobs stay balanced. |
| `--plan` | Prints the plan and stops. It bundles into `--work` if needed, and writes nothing to `out/`. |
| `--no-mix` | Picture only, with a silent track. |
| `--mix-only` | Remixes onto the last picture. |
| `--no-sync` | Skips `sync.mjs`. Otherwise it runs first and rewrites `data/`. |
| `--force` | Ignores cached segments. |
| `--scale X` | 1 is 1280×720. 1.5 is 1920×1080, the 1080p maximum. |

**Where a manifest lives:**

- **In `show/reel/<key>.manifest.json`.** `sync.mjs` copies it, and the studio then shows `reel-<key>`. `episode.mjs <key>` finds it by key.
- **In a subfolder, for example `show/reel/ep01-full/ep01-full-v2.manifest.json`** (Ep1's episode reel v2 and its segment timelines). `sync.mjs` copies it and the timelines beside it, and the studio shows `reel-ep01-full-v2`. `episode.mjs` looks up a bare key only in `show/reel/`, so pass this one by path.
- **Anywhere else**, for example the example manifest here or a draft in `show/episodes/ep01/production/`. Pass it by path. The tool hands it to the bundle as input props, and the composition is called `reel-episode`. Nothing is written to `data/`.

## The manifest

```jsonc
{
  "kind": "episode-manifest", "key": "ep01-full-v1", "episode": 1, "title": "ep1.0_research_preview.md",
  "variant": "…", "dateSpan": "…", "runtimeMin": 22,
  "titleCard": 3,            // the reel's own title slate, in s (0 = none)
  "actCards": "margin",      // margin = an act card at the top of the notes for actCardSec (it adds no runtime)
                             // slate  = also a reviewer slate of slateSec (1.5 s) before each ACT ONE…FIVE chapter
                             //          (it adds runtime; keep it out of flow reviews); off = none
  "actCardSec": 4, "known": [],                    // ids named before the first chapter
  "chapters": [
    {"id": "coldopen", "label": "COLD OPEN", "sub": "sc 1-4", "from": "ep01-full-part1", "acts": ["COLD OPEN"]},
    {"id": "intro", "kind": "video", "src": "out/season/intro/intro-ep1-V1-1080p.mp4", "in": 0, "dur": 30, "fit": "full",
     "audio": {"own": true, "src": "audio/intro/mix/intro-ep1-mix-V1-chipchamber.wav", "gain": -3, "tail": 0.3}},
    {"id": "card", "from": "ep01-full-part1", "beats": ["card.01"]},
    {"id": "act4", "from": "ep01-act4-v5", "audio": {"src": "audio/reel/ep01-act4-v5/mix.wav", "in": 3.0}},
    {"id": "credits", "kind": "card", "dur": 12, "onscreen": ["…"], "caption": "…"}
  ],
  "beds": [ {"chapter": "act2", "beat": "13.01", "cue": "MM-19", "src": "audio/ost/…-underscore.wav", "loop": [0, 20]},
            {"chapter": "act2", "beat": "15.01", "cue": "MM-20", "pad": {"chords": ["Dbmaj9#11", "Gm7b5"], "bpm": 66}} ],
  "mix": {"lufs": null, "floor": -50, "ceiling": -1, "duck": -10, "bedLufs": -26, "xfade": 2.0, "dialogueGain": -3}
}
```

**Chapters** play in order. The kind is inferred when it's left out: `from` means reel, `src` means video, otherwise card.

- **reel.** A synced timeline (`from` is a `show/reel/` key). It can be sliced:
  - `acts: [...]`, `beats: [ids]`, `range: {first, last}` and `exclude: [ids]` pick the beats;
  - `durs: {beatId: s}` overrides a beat's length.

  Each chapter keeps its own mode. A dialogue reel (recorded takes) and an old caption reel can sit side by side.
- **card.** An in-show card made from the manifest: `onscreen`, `caption`, `dur` and `cues`.
- **video.** A real file in a slot.
  - `fit: "full"` (the default): the tool transcodes the file full-frame into the reel. The studio shows a labelled stand-in frame with the notes and bar.
  - `fit: "inset"`: the tool copies the file into the bundle's `public/`, and it plays inside the picture frame while the notes and bar keep running. Checked with stills only (see Verified).

**A chapter's sound:**

| Setting | What plays |
|---|---|
| `audio: {src, in, gain}` | The chapter's own premix (for example Act Four's `mix.wav` from 3.000 s, which is its title card). |
| `audio: {own: true, src?, gain, tail}` | The video's own sound. `src` can point at the master WAV it was encoded from. Cut in and out hard, with a 30 ms de-click; `tail` lets the ring run on into the next chapter. |
| a dialogue reel with no `audio` | The mixer lays every take from the timeline's `lines[].audio`, at `beatStart + t − in`, dual mono at `dialogueGain`. The bed ducks under them. |
| anything else | The temp bed. |

The bed is **gated off** under any chapter that brings its own sound. `bed: true` or `false` overrides that.

**Beds** give one temp cue per sequence.

- **Where one starts.** Each bed is anchored to `{chapter, beat | seq, at}` (or `atEp: "12:31"`), and it runs until the next bed (or `until`).
- **What plays:**
  - an OST render (`src`), looped on its `.cue.json` loop points, or on `loop: [a, b]`;
  - or, for a cue with no render yet, a programmatic pad (`pad: {chords, bpm, barsPerChord}`, using reelbed.py's F-minor chord table). It is labelled "temp pad (MM-xx not rendered)" in the margin.
  - `pad: {type: "room"}` is a room-tone stand-in for a stretch where the script has no music.
- **Level.** Each bed is matched to `lufs` (default `mix.bedLufs`, −26 LUFS un-ducked). `gain` adds on top.
- **Joins.** A bed crossfades (equal power, `xfade` s, centred on its anchor) into the next. `stop: "hard"` ends it with a 20 ms cut; `stop: "fade"` fades it.
- **Loops.**
  - The loop period is exactly `b − a`. After each wrap, the previous pass's own tail (the material after `b`, up to 1 s) crossfades out while the new pass starts at `a`.
  - A loop that ends on a designed rest has no tail, so it is butt-spliced.
  - This is the fix for audit-v5-stick §4.1's short wraps, in this mixer only; `bed.py` isn't changed.

**The mix:**

- **Floor.** A room-tone floor at `mix.floor` (−50 LUFS) runs wherever the bed runs, so a rest inside a cue never becomes digital black. Nothing plays under the title slate.
- **Master.** `mix.lufs: null` (the default) leaves the sum as it is, so a premixed chapter and the intro keep their mastered levels. A number normalises the whole episode to it.
- **Limiter.** A look-ahead limiter holds the sample peak at `ceiling`.

## What the tool does

1. **Sync and bundle.** It runs `sync.mjs`, then `remotion bundle src/dev/reel/entry.tsx`. The bundle is reused while the code and data hash are unchanged.
2. **Plan.** `selectComposition('reel-episode')` with the manifest as input props. The plan comes back from the same TypeScript the picture uses, so picture and sound share one clock. It is written to `<work>/plan.json`.
3. **Segments.** Each chapter is cut into segments of at most `--seg` seconds, as frame ranges of the one episode composition.
   - `--jobs` `remotion render --frames=a-b --muted` processes run at once, longest first.
   - A full-frame video slot is transcoded by the bundled ffmpeg with Remotion's own x264 settings (crf 18, yuv420p, 90 kHz timescale).
   - Each segment is cached under a key of: the code hash, the episode layout (chapter clocks, bar rows, bed labels, names), the chapter's own data, and its frame range.
4. **Mix.** `tools/mixer.mjs` runs as its own process alongside the picture, writing `mix.wav` and `mix-qa.json`.
5. **Concat and mux.** The segments are stream-copied together; the tool checks that the frame count equals the plan's. The mix is muxed as AAC 192k.
6. **Sidecars.**
   - `<out>-chapters.json`: the chapter start and end times, the source and the sound of each (this stands in for chapter markers, since the bundled ffmpeg can't write them).
   - `<out>-measure.json`: the wall time of each step and each segment, and the speed.

## Verified (2026-09-26, prep-stick pass, 16:44–18:30)

Nothing here was watched or listened to. These are measurements. The machine has 14 cores and was shared with other passes the whole time (load average 16–43).

**Existing reels are unchanged.**
- **Stills.** I bundled the code before and after the change, then rendered 112 stills from each: `reel-ep02`, `reel-ep01-act4-v5`, `reel-ep01-full`, `reel-ep01`, `reel-ep01-full-part1` and `reel-season` (title frames, beat frames, the last frame). **All 112 were byte-identical (md5).** The composition list (ids and durations) was identical too.
- **Full re-renders**, with the command `render_all.sh` uses (`npx remotion render <bundle> <id> <out> --concurrency=4`), written to scratch. I compared the H.264 streams (`-map 0:v -c copy -f h264`, then md5):
  - `reel-ep02` with the old code, with the new code, and the existing `out/season/reels/ep02.mp4` (06:58): **the three video streams are bit-identical** (12,332,068 bytes, md5 `2ed88fb5…`).
  - `reel-ep01-act4-v5` with the new code and the existing `out/ep01/act4/reel/ep01-act4-v5.mp4` (15:16): **bit-identical video streams** (12,515 frames, 25,644,616 bytes, md5 `9209e4d4…`). The render logged one Chrome "Target closed" error, which Remotion recovered from (exit 0, every frame present).
- **The composition list** with the new code has every old id and duration, plus `reel-<key>` for a synced manifest. That registration was tested in a scratch copy of the studio sources, not in the real `data/` (no manifest is synced yet).

**The Ep1 test manifest** (`examples/ep01-full-v1.manifest.json`), rendered end to end into scratch with `--jobs 3 --conc 4 --seg 90`:

| | Measured |
|---|---|
| Length | 21:27.0, 30,887 frames, in 10 chapters and 20 segments |
| Wall, cold start | 1,391.9 s: bundle 32.5, plan 1.5, render 1,298.8, concat 1.1, mux 57.2 (the mix, 79.6 s, ran alongside the render) |
| **Speed** | **55.5 s of reel per minute of wall time, end to end**; 59.5 s of reel per minute of the render step |
| Per segment | each long stick-reel segment (65–90 s) rendered at 15–25 s of reel per minute, 3 at once (the short title and card segments are dominated by the render start-up of about 7–15 s); the intro transcode ran at 98 s per minute (30 s in 18.3 s) |
| File | 101.1 MB (1280×720 H.264 plus AAC 192k) |
| Decode | 30,887 frames, **0 decode errors** (PyAV full decode); video and audio both 1,286.958 s |
| Intro splice | the 720 intro frames inside the episode file decode **identical (md5 per frame)** to the transcoded slot; its first frame and its last (`verified: human`) land on the planned episode frames 1032 and 1751 |

For comparison, the ordinary one-process renders above ran at 23.5 s of reel per minute (`reel-ep02`, 172 s in 440 s, two other renders beside it) and 22.9 (`reel-ep01-act4-v5`, 521.5 s in 1,368.7 s, with the two others beside it for its first 7 min). The speed-up is running several renders at once, each on its own frame range of one composition, which the tool does for you. On an idle machine all of these should be faster; I didn't measure one.

**After a fix to one chapter**, only its segments re-render (they're cached by content). For example, Act Two (3:56.5) is 3 segments, about 4 min of render at the rates above, plus about 1 min of concat and mux.

**The mix of that manifest:**
- Act Four −17.0 LUFS (its own mix, untouched). The intro −17.0 (−14 as mastered, less the −3 dB trim). The bed chapters about −26.
- The whole episode is −20.3 LUFS with a −4.3 dB peak. **ffmpeg's `loudnorm` agrees: −20.30 LUFS integrated, −4.30 dBTP true peak** (the mixer's own JS meter said −20.255 and a −4.3 dBFS sample peak).
- The only digital silence of 0.5 s or more is the 3 s title slate.
- The mixer took 60–80 s for 21:27.

**`fit: "inset"`.** A scratch manifest (a 2 s card, then the intro with `fit: "inset"`) planned and staged the master into the bundle's `public/reel-media/`. Six stills show the intro playing inside the picture frame with the notes and bar running, and the chapter's last frame is the intro's `verified: human` frame. **Only stills were rendered**, not a full video.

## Not verified / open

- Nobody has watched or listened to an episode reel. The crossfade, duck and pad levels are measured only.
- **`fit: "inset"`** was checked with stills only. `OffthreadVideo` on the 1080p master will render more slowly than a stick chapter; that wasn't measured.
- **Rooms and SFX per beat** (`room`, `sounds`) aren't laid by this mixer. A chapter with recorded takes but no premix gets takes plus beds only. Act Four brings its own premix, which has them.
- **Loudness** is measured in JS and agreed with `loudnorm` on the whole episode (above). The limiter works on the sample peak, not the true peak.
- **Chapter markers** aren't embedded in the MP4; they're in the sidecar JSON.
- **Act Four's premix is tied to its timeline.** The chapter plays `audio/reel/ep01-act4-v5/mix.wav` from 3.000 s, which is right only while `show/reel/ep01-act4-v5.json` keeps the beat lengths that mix was built on. If the Act Four pass re-times the reel, it has to rebuild `mix.wav` too; its own pipeline does both.
- **The example manifest's cold open, Acts One–Three and tag** come from the old caption timelines (`ep01-full-part1/-part2`). Their text predates the conversation and scene-craft passes, and they have no takes. Replace each chapter's `from` as its new stick plan and takes land.
- **The Act Three bed in the example** (the MM-14 temp pad) runs on to the tag in the plan. It's gated off under Act Four, so it's heard only up to the Act Four cut. Add `"until": {"chapter": "act4"}` if a cleaner plan is wanted.
- **The credits** are a 12 s placeholder until an outro proposal is chosen (SHOWRUNNER-NOTES #1).
- **The −3 dB intro trim** and the bed levels are proposals for an ear to confirm.

## Handoff: building the real Ep1 episode reel

The generator is ready. The remaining gaps are content. The survey behind this work is `needs.md` from the prep-stick pass; its session-scratch copy may not last, so the points that matter are repeated here.

1. **For each of the cold open, Acts One–Three and the tag: a stick shot plan plus recorded takes.** Build a dialogue-reel timeline the way Act Four's was built (`audio/reel/ep01-act4-v5/build_timeline.py` → `show/reel/ep01-act4-v5.json`, with `lines[].audio` pointing at takes). Name each one `show/reel/ep01-<chapter>-v1.json` so `sync.mjs` picks it up.
2. **Point the manifest at them.** Copy `examples/ep01-full-v1.manifest.json` and change each chapter's `from`. A dialogue chapter with no `audio` gets its takes laid automatically, over the temp bed, which ducks under them.
   - Keep the working manifest in `show/reel/ep01-full-v1.manifest.json` (flat, so the studio shows `reel-ep01-full-v1`), or in `show/episodes/ep01/production/` and pass it by path.
3. **Render** with `node src/reel/tools/episode.mjs <manifest> --jobs 3 --conc 4` (run from `studio/`). The output goes to `out/ep01/reel/<key>.mp4` (org plan §2). `--plan` writes nothing to `out/`.
4. **Swap in real music** as OST renders land: change a bed's `pad` to a `src`. Eight cues outside Act Four had no render at 16:30: MM-03, -04, -12, -14, -15, -16, -17 and -20.
5. **Credits:** replace the placeholder chapter once an outro proposal is chosen (`show/production/OUTRO-PROPOSALS.md`).

**How `needs.md` §2.2 ended up:**

| Item | Status |
|---|---|
| A manifest that sync and the registry understand | Done: `*.manifest.json` or `"kind": "episode-manifest"` |
| Title card length per reel (`timeEpisode(ep, head)`) | Done in the TS. `bed.py` and `report.py` in `audio/reel/ep01-act4-v5/` still assume 72 frames; that's correct for a standalone reel. |
| Mode per chapter | Done |
| One episode clock, a two-row bar, `EP` clock in the notes | Done |
| Name reveals across chapters | Done (`known`, carried chapter to chapter) |
| Act-Four-only strings | The `(+12:31 = episode)` note and the "(proposed)" runtime are replaced in an episode reel. A standalone reel still shows them, unchanged. |
| A video slot | Done: `fit: "full"` (rendered) and `fit: "inset"` (stills only) |
| Figure marks for the generic Ep1 speakers | Not done (optional for a stick reel) |
| Per-sequence beds, the loop-wrap fix, fallback pads | Done in `tools/mixer.mjs` (JS), not as a Python `seqbed.py` |
| An episode render script | Done: `tools/episode.mjs` |

**How to re-check that the existing reels are unchanged** (run from `studio/`; `B` is a scratch folder):

```sh
npx remotion bundle src/dev/reel/entry.tsx --out-dir $B/bundle --bundle-cache=false --log=error
npx remotion render $B/bundle reel-ep02 $B/ep02.mp4 --concurrency=4 --muted --log=error
FFD=node_modules/@remotion/compositor-linux-x64-gnu
for f in $B/ep02.mp4 ../out/season/reels/ep02.mp4; do LD_LIBRARY_PATH=$FFD $FFD/ffmpeg -v error -i $f -map 0:v -c copy -f h264 - | md5sum; done
```

The two sums match as long as nothing has changed `ep02`'s timeline or the shared drawing code since `out/season/reels/ep02.mp4` was rendered.
