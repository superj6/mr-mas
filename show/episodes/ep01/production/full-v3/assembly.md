# Ep1 v3 → v3.5: the full episode films (`v3-assemble`, track F, 2026-09-27 and 28)

> **Status: v3.5 FINAL (v3.5b) BUILT AND MEASURED (2026-09-29): ONE film, `out/ep01/full-v3/ep01-v35.mp4`, 23:31.58. §Z below is the current state.** §Y (v3.4), §X (v3.3), §W (v3.2), §V (v3.1) and the v3 round are the record. The v3.4 films are kept. Track F of [PLAN.md](PLAN.md) (§8, step 7).
>
> **Nothing here was watched or heard.** Every number below is measured from the files. I looked at stills only.

## Z. v3.5 FINAL, v3.5b (2026-09-29, the `finish` pass)

**The film:** `out/ep01/full-v3/ep01-v35.mp4`: **23:31.58** (33,878 frames), 138.9 MB, H.264 High CRF 18 + AAC-LC 256 kb/s (**libfdk_aac**), nine titled chapters.
- **v3.5b** (SHOWRUNNER-NOTES 00000A; lock-v35.md §10): the usage flash (Act One +2.0 s), the racks (Act Two +5.0 s), the Sep 25 launch party with Alyi (Act Three +10.0 s), step four's payoff and Neleh's new line (Act Four +3.3 s), the two new V.O. lines, and the Saturday phones. The EL story is **32,811 frames** (Act One 10,995 · Two 4,968 · Three 3,514 · Four 11,953; cold open 583 and tag 798 unchanged).
- **v3.5b fix** (2026-09-29; lock-v35.md §11): MADA (O.S.) "There is no step four." before the clack in S4.02, over the sheet's blank 4. line, and NELEH's "Step two." in the board's post (S3.03, lip-synced in her call window, before the click). Act Four 11,953 → **11,991** (+38 f, +1.58 s); the EL story **32,849 frames**. Nothing else in the film moved.
- **Voices:** the ElevenLabs cast (set A; SIRRAH recast as Ida), **MARIO on his Kokoro takes** (10 lines, with voices-el.md §AB3's EQ and −0.5 dB in the mix).
- **The lock:** the EL-timed v3.5 lock, `show/reel/ep01-v35-el/` (key `ep01-v35-el-stick`, 8893509).
- **Intro:** the flash-fixed picture with the EL master (`audio/intro/mix/intro-ep1-mix-V1-chipchamber-el.wav`) at −3 dB. **Card:** 2 s. **Outro:** B, `mix-v35-el/outro-mix.wav` at −1 dB with the 0.75 s hum hold (2.0 s of hum alone).
- **Records:** `assembly/el-v35-assembly.json`, `el-v35-qa.json`, `seam-frames-el-v35.json`; the transcript [assembly/transcript-v35.txt](assembly/transcript-v35.txt) (258 lines); the contact sheet `out/ep01/full-v3/ep01-v35-sheet.png` (141 frames, one every 10 s). The sound: sound.md §Y.
- **The 2026-09-28 build (23:09.67, 33,352 frames) is superseded;** this file replaced it at the same path.

### Z.1 Chapter times

| # | Chapter | Start · length |
|---|---|---|
| 1 | Cold open | 0:00.00 · 24.29 |
| 2 | Intro | 0:24.29 · 30.00 |
| 3 | ep1.0_research_preview.md | 0:54.29 · 2.00 |
| 4 | Act One · research preview | 0:56.29 · 7:38.13 |
| 5 | Act Two · the regulate-me tour | 8:34.42 · 3:27.00 |
| 6 | Act Three · verified: human | 12:01.42 · 2:26.42 |
| 7 | Act Four · five days, told twice | 14:27.83 · 8:19.63 |
| 8 | Tag · december (with the 0.75 s hum hold) | 22:47.46 · 34.00 |
| 9 | Outro · credits | 23:21.46 · 10.13 |

**As YouTube timestamps** (paste into the description). YouTube needs every chapter to be at least 10 s, so the 2 s card rides with the intro:

```
00:00 Cold open
00:24 Intro
00:56 Act One · research preview
08:34 Act Two · the regulate-me tour
12:01 Act Three · verified: human
14:27 Act Four · five days, told twice
22:47 Tag · december
23:21 Outro · credits
```

### Z.2 The EL pictures (`picture-el/`, on `assembly/el-v35/`)

- **v3.5b:** Acts One to Four are the picture passes' v3.5b renders (633ad95, 9e9d63f, 04c0c94, f0d2e86: silent), muxed here with the v3.5b mixes (libfdk_aac); the cold open and the tag are unchanged (the tag re-muxed with its new mix). Every picture lock (`LOCK=v35 el_lock.sh act1 act2 act3 act4 tag`) now passes every check, the length against the new mix included. S7.13's hourglass is at 10754 (lock-v35.md §10). The notes below are the first v3.5 build's.
- **Takes and locks:** `el_takes.py --lock v35` (MARIO's 10 rows keep their Kokoro mouth tracks: act1 3, act2 6, act4 1); Tasya's TV cut (v33-a4-0002) carried by `el_cutmouths_carry.py v33 v35 act4`; `LOCK=v35 el_lock.sh`. Every check passes, re-run with the final mixes (the mix lengths match: 583 · 10,947 · 4,848 · 3,274 · 11,873 · 798 frames).
- **Act One (10,947 f):** `check` lists **"11.04: overlay on 244 frames"**; the render laid the 3D CLOD on 244 frames (0 missing, 0 refused). **The tear macro** at 3670–3729 (`picstills` from the EL renderer, `tear.py --start 3670`), 60 browser frames spliced.
- **Act Three (3,274 f):** 5 GLYPH frames from the EL Remotion bundle (`bundle_el.mjs`); the plain frames either side are identical.
- **Act Four (11,873 f):** 28 GLYPH frames and **the S7.13 hourglass, 264 f** (`hourglass_el.py --s713 10675 --back-at 170`; a5-30-18 ends at k169); 164 browser frames, 0 missing.
- **The cold open and the tag are v3.4's EL renders, kept:** their v3.5 EL locks are the v3.4 ones apart from the music-cue strings and the tag's `epIn` (neither is drawn), and no code they use changed since (render.ts's overlay hook is byte-identical without a declaration; duel-split and senate aren't in them).
- **Renders:** 0 stand-ins, 0 failed layouts. Every picture is re-muxed with its `mix-v35-el/` mix (libfdk_aac).
- **Flash per picture** (`flash_seg.py`): cold open 1, Act One 2, Act Two 1, Act Three 0, Act Four 1, tag 0; red 0. All pass (limit 3).
- **Looked at** (decoded stills): the tear macro (k58), CLOD's clay in the pane (10062, 10200), the hourglass in context and shattered, the war room's 2 AM and the invitation.

### Z.3 QA (measured, v3.5b)

| Check | ep01-v35 |
|---|---|
| **Full decode** | **0 error lines**, 33,878 frames |
| **A/V lag per chapter** | **0 samples in all nine** (correlation 0.9997–1.0). The untitled hum hold reads 1,100 samples: one period of the vault's F1 hum (22.9 ms), a correlation ambiguity on a steady tone; it is sample-continuous with the tag and the chapters either side read 0 |
| **Codec fidelity** (decoded vs source) | **0 bursts in every chapter**; worst difference 0.144 (Act Four) |
| **Integrated loudness** | **−16.08 LUFS** |
| **True peak** | **−1.29 dBTP** (Act Four) |
| Chapters (LUFS-I) | cold open −16.0 · intro −17.0 · card −36.0 · acts −16.0 · tag −17.1 · outro −17.2 |
| Digital zero / holes (under −60 dBFS, 0.3 s) | **none / none** |
| **Flashes** (the whole film) | **max 3 in 1 s** (the cold open's freeze, 0:12.42, at the limit, as every EL round; the picture's own reading is 1); red 0. **Pass** |
| Chapters · edge frames | nine, matching the assembly to the millisecond · at most 0.67 of 255 (the hum-gap still) |
| Audio vs picture length | +5.33 ms (the AAC tail) |

**Seams:**

| Join | At | Step (200 ms RMS) | |
|---|---|---|---|
| cold open → intro | 0:24.29 | −11.3 dB | designed |
| intro → card | 0:54.29 | +0.5 | the card's room led in |
| **card → Act One** | 0:56.29 | **+20.2** | the designed downbeat |
| Act One → Two | 8:34.42 | +0.4 | |
| Act Two → Three | 12:01.42 | +1.0 | |
| Act Three → Four | 14:27.83 | +0.9 | |
| Act Four → tag | 22:45.88 | −1.5 | the ring-out's fade |
| tag → hum | 23:19.12 | +0.2 | continuous |
| **hum → outro** | 23:19.88 | **+12.6** | the first hit, 6 dB down |

Every sample jump is under 0.01.

### Z.4 How to rebuild v3.5

From the repo root. `PY=audio/.venv-casting/bin/python`, `A=show/episodes/ep01/production/full-v3/assembly`, `S` = your scratch folder. Every heavy step through `ops/heavy.sh`, one at a time.

```sh
$PY $A/tools/el_takes.py --lock v35 && $PY $A/tools/el_cutmouths_carry.py v33 v35 act4 && LOCK=v35 bash $A/tools/el_lock.sh
export ELDIR=$PWD/$A/el-v35; cd studio
for s in act1 act2 act3 act4; do node ../$A/tools/build_el.mjs $s $S/r-$s-el.cjs && node $S/r-$s-el.cjs check; done   # act1: "11.04: overlay on 244 frames"
node $S/r-act1-el.cjs picstills $S/tearpics $(seq 3670 3729)
$PY src/dev/genvideo/runway/tear.py --pics $S/tearpics --png $S/glyph-act1 --start 3670
node ../$A/tools/bundle_el.mjs $S/bundle
BUNDLE=$S/bundle node $S/r-act3-el.cjs glyphs $S/glyph-act3 2
BUNDLE=$S/bundle node $S/r-act4-el.cjs glyphs $S/glyph-act4 2 --opt hourglass=false
cd .. && $PY $A/tools/hourglass_el.py --scratch $S/hg --out $S/hg-out --png $S/glyph-act4 --s713 10754 --back-at 170 && cd studio   # (v3.5b; the first build: 10675)
for s in act1 act2 act3 act4; do GLYPH_DIR=$S/glyph-$s SEGDIR=$S X264_THREADS=1 node $S/r-$s-el.cjs picture ../out/ep01/full-v3/picture-el/$s.mp4 --jobs 2 --no-audio; done
cd ..   # (the finish pass ran the block above as one heavy job; then flash_seg.py on each picture, then a -c:v copy mux with mix-v35-el/<seg>-mix.wav)
$PY audio/reel/ep01-v3/mix_episode.py --all --variant el --lock v35 --rebuild-stems      # sound.md §Y (re-runs itself through heavy.sh)
ASM_SCRATCH=$S bash ops/heavy.sh $PY $A/tools/assemble.py el-v35                          # -> out/ep01/full-v3/ep01-v35.mp4 (about 3 min)
ASM_SCRATCH=$S bash ops/heavy.sh $PY $A/tools/qa.py el-v35                                # -> el-v35-qa.json, transcript-v35.txt, the sheet (about 2 min)
bash ops/heavy.sh $PY $A/tools/seam_frames.py el-v35
```

- **Tool changes:** `assemble.py` has the `el-v35` variant (film `ep01-v35`, label v3.5); `assemble.py` and `qa.py` take their scratch folder from `ASM_SCRATCH` (the default was another session's scratch). v3.5b: `assemble.py` holds the episode's audio in float32 (half the memory), and the v3.5b mix was run a segment at a time (`mix_episode.py act1 card`, then `act2`, `act3`, `act4`, `tag`: each reads the last run's report for the guard and the head gains) to keep memory pressure down.
- **Disk:** after the film passed, the v3.4 EL mixes (`mix-v34-el/`, 338 MB), the v3.4 EL stems (`audio/reel/ep01-v3/v34/el/`, 131 MB) and the v3.4 EL pictures were deleted, with the bundle, GLYPH PNGs and render chunks. The v3.4 films are kept. 34 GB free at the end.

### Z.5 One command per changed act: `ops/rebuild-act.sh`

`ops/rebuild-act.sh <act> [--from STEP] [--only STEP]` rebuilds one changed act end to end with the tools above, in order, each heavy step through `ops/heavy.sh`, one at a time:

| Step | What it runs |
|---|---|
| `lock` | `build_timeline.py` (the base lock), `el_lock.py <act> --lock v35 --fixed S7.13` (the act first: `--fixed` swallows what follows), `el_takes.py`, `el_lock.sh <act> tag` |
| `score` | `audio/ost/tracks/e01-v3-<act>/track.py --render` (EL: `--el`, or `--variant el` for Acts Three and Four), `OST_WORKERS=2` |
| `mix` | `stems.py --lock v35 --variant el` (one block, card to tag), then `mix_episode.py <act> <the next chapter>` (its head ramps from this act's gain; Act One takes the card), then `el_lock.sh <act>` (every check, the new mix's length included) |
| `picture` | `build_el.mjs` + `check`; Act One's tear macro (7.02 + 28, from the lock), Acts Three and Four's GLYPH frames from `bundle_el.mjs`, Act Four's hourglass (`--s713` and `--back-at` read from the lock); `picture --no-audio`; `flash_seg.py` |
| `mux` | the picture with `mix-v35-el/<act>-mix.wav` (`-c:v copy`, libfdk_aac) |
| `film` | `assemble.py el-v35`, `qa.py el-v35`, `seam_frames.py el-v35` |

- **It doesn't** write lines, record takes, or draw shots: those come first (takes.py / record.sh / render_v35.sh; the act's `shots.ts`).
- **Act One's EL lock is never rebuilt by `el_lock.py`:** it carries hand-placed V.O. (voices-el.md §AD). The script stops there. Splice the beat by hand (lock-v35.md §10), then `ops/rebuild-act.sh act1 --from score`.
- `SCRATCH=<dir>` sets its scratch folder (default `/tmp/rebuild-<act>-<pid>`); `LOCK=` another lock.

## Y. v3.4 (2026-09-28): the record (superseded by §Z; its films are kept)

**The films:**

| | Kokoro voices (primary) | ElevenLabs voices (set A) |
|---|---|---|
| **File** | `out/ep01/full-v3/ep01-v34.mp4` | `out/ep01/full-v3/ep01-v34-el.mp4` |
| **Length** | **20:54.63** (30,111 frames) | **20:57.71** (30,185 frames) |
| Size | 122.8 MB | 121.8 MB |
| Intro audio | the original master (`intro-ep1-mix-V1-chipchamber.wav`), −3 dB | **the EL master** (`intro-ep1-mix-V1-chipchamber-el.wav`, Jeremy's line; `audio/ep01/v3-el/intro/intro-el.json`), −3 dB |
| Sheet · transcript (231 lines) | `ep01-v34-sheet.png` · [transcript-v34.txt](assembly/transcript-v34.txt) | `ep01-v34-el-sheet.png` · [transcript-v34-el.txt](assembly/transcript-v34-el.txt) |
| Records | `assembly/kokoro-v34-{assembly,qa}.json` | `assembly/el-v34-{assembly,qa}.json`, `el-v34-pictures.json` |

- **Built as v3.3** (§X), with the v3.4 manifests, pictures and mixes:
  - the mixes are `mix-v34/` and `mix-v34-el/` (2b29991);
  - the flash-fixed intro and the 2 s card;
  - `outro-mix.wav` at −1 dB with the 0.75 s hum hold (hum gain +2.72 / +2.80 dB; residual 1.2e-7);
  - nine titled chapters.
- **The v3.3 films and their hum-gap files were deleted** after both v3.4 films passed.
- **The cold open's temp-audio pointer:** `lock/coldopen.json`, `pixel/coldopen/data.ts` and the v3.3 records now name `mix-v34[-el]/coldopen-mix.wav`, which is byte-identical (md5 adf243dd… / 6e2b6c50…), as the lead asked.

### Y.1 The AAC encoder: a real fault, found and fixed

- **The first v3.4 Kokoro build measured +0.38 dBTP.** I traced it to one sample at −1.0 in Act Two, inside a 6.7 ms burst in the right channel. The source mix there peaks at −5.2 dBFS.
- **So I added a check to `qa.py`:** every chapter's decoded audio against its source, sample for sample. A burst is a run more than 0.2 of full scale off the source.
- **The bundled ffmpeg's native `aac` encoder writes these bursts:**
  - Kokoro: Act Two at 8:02.1 (6.7 ms, off by 0.94) and 8:41.7 (3.4 ms, 0.46); Act Four at 20:03.9 (4.8 ms, 0.62); single samples in the intro and Act Three.
  - EL: Act One at 1:35.0 (2.2 ms) and 5:35.2 (3.6 ms); Act Four at 11:46.7 (2.6 ms) and 18:40.2 (2.3 ms).
  - The same encoder on Act Two's mix alone gives a 4.3 ms burst at another place. **libfdk_aac on the same input stays within 0.063, with none.**
  - The records are in `assembly/{kokoro,el}-v34-qa-nativeaac.json`.
- **The films are now encoded with `libfdk_aac`,** still AAC-LC 256 kb/s at 48 kHz (`assemble.py`, `AAC`).
  - Measured: **0 bursts in every chapter of both films.** The worst difference from the source is 0.108 (Kokoro) and 0.136 (EL), which is coding noise.
  - The EL segment pictures were re-muxed with it too.
- **The earlier rounds' films (v3–v3.3) were all encoded with the native encoder,** so they likely carried such bursts too. They're deleted; the v3.4 films are the first measured clean.

### Y.2 Chapter times

| # | Chapter | Kokoro start · length | EL start · length |
|---|---|---|---|
| 1 | Cold open | 0:00.00 · 26.67 | 0:00.00 · 24.29 |
| 2 | Intro | 0:26.67 · 30.00 | 0:24.29 · 30.00 |
| 3 | ep1.0_research_preview.md | 0:56.67 · 2.00 | 0:54.29 · 2.00 |
| 4 | Act One · research preview | 0:58.67 · 5:37.54 | 0:56.29 · 5:43.33 |
| 5 | Act Two · the regulate-me tour | 6:36.21 · 3:01.21 | 6:39.62 · 2:50.17 |
| 6 | Act Three · verified: human | 9:37.42 · 2:05.29 | 9:29.79 · 2:03.92 |
| 7 | Act Four · five days, told twice | 11:42.71 · 8:27.79 | 11:33.71 · 8:39.88 |
| 8 | Tag · december (with the 0.75 s hum hold) | 20:10.50 · 34.00 | 20:13.58 · 34.00 |
| 9 | Outro · credits | 20:44.50 · 10.13 | 20:47.58 · 10.13 |

### Y.3 The EL pictures for v3.4

All six are on `show/reel/ep01-v34-el/` (93f0431) with `audio/ep01/v3-el/ep01-v34/`, under `assembly/el-v34/`.

- **Frames:** cold open 583, Act One 8,240, Act Two 4,084, Act Three 2,974, Act Four 12,477, tag 798.
- **The locks:** re-run with the final mixes; every check passes. Act Four has 43 on-camera mouths, as Kokoro.
- **Tasya's TV cut (v33-a4-0002):** v3.4 has no EL cut-mouths file of its own. The take's audio and words are identical to v3.3's, sample for sample, so `tools/el_cutmouths_carry.py` carries v3.3's mouth track into `assembly/el-v34/act4-cut-mouths.json`, and `el_lock.sh` lays it.
- **Splices:**
  - Act Three: 5 GLYPH frames.
  - Act Four: 28 GLYPH frames and the hourglass (S7.13, 264 f, `--s713 11171 --back-at 170`). Both host checks hold.
  - **The tag: no splice** (the duck is cut), 0 browser frames.
- **Renders:** 0 stand-ins, 0 failed layouts.
- **The voLine fix:** at S1.02 the new V.O. types through to "…more compute." before the cut.
- **Flash per picture:** cold open 1, Act One 2, Act Two 1, Act Three 0, Act Four 1, tag 0; red 0. All pass.
- **Looked at, EL beside Kokoro:** S1.02 at k60, 150 and 175; S7.13's shatter; the tag's 32.01 and 32.03. They match, except that the EL S1.02 runs 12 frames longer, on its longer V.O.

### Y.4 QA (both films)

| Check | Kokoro v3.4 | EL v3.4 |
|---|---|---|
| **Full decode** | **0 error lines**, 30,111 frames | **0 error lines**, 30,185 frames |
| **A/V lag per chapter** | **0 samples in all nine** (0.9997–1.0) | **0 in all nine** |
| **Codec fidelity** (decoded vs source) | **0 bursts**; worst difference 0.108 | **0 bursts**; worst 0.136 |
| **Integrated loudness** | **−16.08 LUFS** | **−16.07 LUFS** |
| **True peak** | **−1.06 dBTP** (the tag) | **−1.26 dBTP** |
| Chapters (LUFS-I) | cold open −16.0 · intro −17.0 · card −36.5 · acts −16.0 · tag −17.3 · outro −17.2 | −16.0 · −17.0 · −36.3 · −16.0 · −17.2 · −17.2 |
| Digital zero / holes | **none / none** | **none / none** |
| **Flashes** | **max 2 in 1 s** (the cold open's freeze, 0:14.5); red 0. **Pass** | **max 3** (the freeze, 0:12.4, at the limit, as every EL round); red 0. **Pass** |
| Chapters · edge frames | nine, matching to the millisecond · at most 0.67 of 255 (the hum-gap still) | the same |

**Seams:**

| Join | Kokoro at · step | EL at · step | |
|---|---|---|---|
| cold open → intro | 0:26.67 · −11.3 dB | 0:24.29 · −11.3 | designed |
| intro → card | 0:56.67 · +0.4 | 0:54.29 · +0.5 | |
| **card → Act One** | 0:58.67 · **+21.0** | 0:56.29 · **+21.1** | the designed downbeat |
| Act One → Two | 6:36.21 · +0.3 | 6:39.62 · +0.9 | |
| Act Two → Three | 9:37.42 · +1.8 | 9:29.79 · +0.7 | |
| Act Three → Four | 11:42.71 · +0.5 | 11:33.71 · +1.4 | |
| Act Four → tag | 20:10.50 · −0.7 | 20:13.58 · −0.5 | |
| tag → hum | 20:43.75 · −0.7 | 20:46.83 · +0.2 | continuous |
| **hum → outro** | 20:44.50 · **+12.8** | 20:47.58 · **+12.7** | the first hit, 6 dB down |

Every sample jump is under 0.01.

## X. v3.3 (2026-09-28): the record (superseded by §Y; its films were deleted)

**The films:**

| | Kokoro voices (primary) | ElevenLabs voices (set A) |
|---|---|---|
| **File** | `out/ep01/full-v3/ep01-v33.mp4` | `out/ep01/full-v3/ep01-v33-el.mp4` |
| **Length** | **21:12.17** (30,532 frames) | **21:12.46** (30,539 frames) |
| Size | 126.2 MB | 125.2 MB |
| Contact sheet (every 10 s) | `ep01-v33-sheet.png` (128) | `ep01-v33-el-sheet.png` (128) |
| Transcript (235 lines) | [assembly/transcript-v33.txt](assembly/transcript-v33.txt) | [assembly/transcript-v33-el.txt](assembly/transcript-v33-el.txt) |
| Records | `assembly/kokoro-v33-{assembly,qa}.json` | `assembly/el-v33-{assembly,qa}.json`, `el-v33-pictures.json` |
| The hum gap's files | `out/ep01/full-v3/assembly-v33/` | `out/ep01/full-v3/assembly-v33-el/` |

- **Built exactly as v3.2** (§W), with the v3.3 manifests, pictures and mixes:
  - the mixes are `mix-v33/` (08:40) and `mix-v33-el/` (08:34), committed in b04344e;
  - the flash-fixed intro at −3 dB, and the 2 s card;
  - `outro-mix.wav` at −1 dB, with the 0.75 s hum hold (hum gain fitted +2.79 / +2.83 dB; the residual against `outro-mix.wav` is 1.2e-7);
  - nine titled chapters.
- **The Kokoro pictures** are the shot passes' v3.3 finals. Act Four is the re-render, at 12,138 frames.
- **The v3.2 films** (`ep01-v32.mp4`, `ep01-v32-el.mp4`) and my v3.2 hum-gap files were **deleted** after both v3.3 films passed. `picture-el/` now holds only v3.3 renders.

**The micro-pass (09:25–09:40), the films rebuilt to the same paths:**
- **Kokoro Act Two and Three** are the shot passes' re-renders (f57bddb): 17.11's close-up and thicker curve, 22.04's post collapse, Kram's plate dropped at v31-18.00. Frame counts are unchanged.
- **The EL Act Two and Act Three** were re-rendered from the `el-v33` locks. `check` passes with 0 stand-ins; Act Three's 5 GLYPH frames were re-drawn and its host check holds. Both are muxed with their EL mixes.
  - **Flash:** Act Two 3 (at 13.14's cut in, the same reading as before; the EL film reads 2 there), Act Three 0. Both pass.
- **Act Four's mixes** are the re-entry-swell remix (`mix-v33/act4-mix.wav` 09:25, `mix-v33-el/act4-mix.wav` 09:27); the EL Act Four picture was re-muxed with its new mix.
- **Re-measured:** both films are the same lengths (30,532 / 30,539 f) with **0 decode errors** and **0-sample A/V lag in every chapter**.
  - Loudness **−16.08 / −16.10 LUFS**, true peak **−1.12 / −1.40 dBTP**.
  - No digital zero or holes.
  - **Flashes max 2 / 3**, both passing, at the cold open's freeze; red 0.
  - The seams are unchanged: Act Four → tag +0.9 / −1.2 dB, and every other join as in §X.3.
  - The chapters match to the millisecond.
  - The edge frames are 0.67 of 255 at most (the hum-gap still).
  - The tables below are the rebuilt films' numbers, except the true peaks in §X.3, which are now −1.12 / −1.40.

### X.1 Chapter times

| # | Chapter | Kokoro start · length | EL start · length |
|---|---|---|---|
| 1 | Cold open | 0:00.00 · 26.67 | 0:00.00 · 24.29 |
| 2 | Intro | 0:26.67 · 30.00 | 0:24.29 · 30.00 |
| 3 | ep1.0_research_preview.md | 0:56.67 · 2.00 | 0:54.29 · 2.00 |
| 4 | Act One · research preview | 0:58.67 · 5:30.58 | 0:56.29 · 5:35.79 |
| 5 | Act Two · the regulate-me tour | 6:29.25 · 3:10.54 | 6:32.08 · 3:00.83 |
| 6 | Act Three · verified: human | 9:39.79 · 2:13.42 | 9:32.92 · 2:09.75 |
| 7 | Act Four · five days, told twice | 11:53.21 · 8:25.75 | 11:42.67 · 8:36.58 |
| 8 | Tag · december (with the 0.75 s hum hold) | 20:18.96 · 43.08 | 20:19.25 · 43.08 |
| 9 | Outro · credits | 21:02.04 · 10.13 | 21:02.33 · 10.13 |

### X.2 The EL pictures for v3.3

All six segments are on `show/reel/ep01-v33-el/` (a170aaa) with `audio/ep01/v3-el/ep01-v33/`, all under `assembly/el-v33/`.

- **The takes and locks:** `el_takes.py --lock v33`, then `LOCK=v33 el_lock.sh`.
  - Act Four also reads the Act Four pass's `lines-A-cut-mouths.json` (Tasya's TV cut, v33-a4-0002), laid after my takes.
  - The employee's line (v33-a4-0001) has its own mouth track, and S7.02's `push` mark resolves.
  - The locks were re-run with the final mixes: every check passes, and each segment equals its mix.
  - Act Four has 44 on-camera mouths, as Kokoro.
- **Frames:** cold open 583, Act One 8,059, Act Two 4,340, Act Three 3,114, Act Four 12,398, tag 1,016.
- **Splices:**
  - Act Three: 5 GLYPH frames. Act Four: 28 GLYPH frames and the hourglass (S7.13, 264 f, `--s713 11204 --back-at 170`).
  - The tag: the demo's 217 frames at 62–278 (32.01 is 62 f and the insert 233 f), with no host layer.
  - Both GLYPH checks hold: plain frames identical, nothing outside the room area differs.
- **Renders:** 0 stand-ins, 0 failed layouts, 0 stand-in marks. Each is muxed with its final EL mix.
- **Flashes, per picture:** cold open 1, Act One 2, Act Two 3, Act Three 0, Act Four 1, tag 0; red 0. All pass.
  - Act Two's 3 is at 13.14's cut in (the class photo). I compared it frame by frame with the Kokoro picture: it's the same drawing, and the Kokoro picture reads 1 there.
  - So the extra 2 come from the encode's noise on a busy dither, as at the cold open's freeze.
- **Looked at** (EL beside Kokoro): S7.02 (the employee's push), S7.02b (Tasya's TV clip), the Remove dialog, S7.13's shatter and aftermath, and 13.13 → 13.14. EL and Kokoro match at every one.

### X.3 QA (both films)

| Check | Kokoro v3.3 | EL v3.3 |
|---|---|---|
| **Full decode** | **0 error lines**, 30,532 frames | **0 error lines**, 30,539 frames |
| **A/V lag per chapter** | **0 samples in all nine** (correlation 0.9997–1.0) | **0 in all nine** |
| The hum gap's correlation | peaks at 1,100 samples: a false reading on a steady tone (§W.3); the join is continuous | the same |
| A/V, the total | the audio runs 4.0 ms past the last frame (AAC padding) | 11.0 ms |
| **Chapter edge frames** against their sources | 0.00–0.13 of 255 on the story chapters; the intro 0.24; the hum-gap still 0.67 | the same |
| **Integrated loudness** | **−16.08 LUFS** | **−16.10 LUFS** |
| **True peak** | **−1.12 dBTP** (the tag; −1.05 before the micro-pass) | **−1.40 dBTP** |
| Chapters (LUFS-I) | cold open −16.1 · intro −17.1 · card −36.0 · acts −16.0 · tag −17.5 · outro −17.2 | −16.0 · −17.1 · −36.1 · −16.0 · −17.6 · −17.2 |
| Digital zero / holes | **none / none** | **none / none** |
| **Flashes, whole film** | **max 2 in 1 s** (the cold open's freeze, 0:14.5); red 0. **Pass** | **max 3** (the freeze, 0:12.4, at the limit; the picture alone reads 1); Act Two 2 in the film; red 0. **Pass** |
| Chapters | nine, titled, matching the assembly to the millisecond | the same |

**Seams** (200 ms RMS step, momentary loudness over 400 ms):

| Join | Kokoro at | Step (dB) | Momentary (LUFS) | EL at | Step | |
|---|---|---|---|---|---|---|
| cold open → intro | 0:26.67 | −11.3 | −15.9 → −30.4 | 0:24.29 | −11.3 | the rewind collapsing into the intro (designed) |
| intro → card | 0:56.67 | +0.5 | −28.8 → −36.7 | 0:54.29 | +0.5 | |
| **card → Act One** | 0:58.67 | **+19.6** | −33.4 → −13.4 | 0:56.29 | **+20.1** | the designed downbeat |
| Act One → Two | 6:29.25 | −0.1 | −36.0 → −32.9 | 6:32.08 | 0.0 | |
| Act Two → Three | 9:39.79 | +1.5 | −38.2 → −33.2 | 9:32.92 | +0.6 | |
| Act Three → Four | 11:53.21 | +0.9 | −31.0 → −30.1 | 11:42.67 | +0.5 | |
| Act Four → tag | 20:18.96 | +0.9 | −25.6 → −24.1 | 20:19.25 | −1.2 | |
| tag → hum gap | 21:01.29 | −0.3 | −33.8 → −34.7 | 21:01.58 | −0.5 | the hum, continuous |
| **hum → outro** | 21:02.04 | **+12.7** | −34.5 → −21.2 | 21:02.33 | **+12.7** | the first hit, 6 dB down |

Every sample jump is under 0.01.

### X.4 Watch these first

Kokoro / EL:
1. **The end:** the tag's black and the hum alone from 21:00.0 / 21:00.3, then the outro at 21:02.0 / 21:02.3.
2. **The card → Act One downbeat** at 0:58.7 / 0:56.3.
3. **Act Four's new beats:**
   - the employee's push, S7.02, at 18:24.7 / 18:21.1;
   - Tasya's TV clip, S7.02b, at 18:30.6 / 18:27.7.
4. **Act Two's class-photo cut,** 13.14, at 7:32.6 / 7:32.4 (the EL picture's flash reading there is 3; the EL film's is 2).
5. **The cold open's freeze flash,** 0:14.5 / 0:12.4.

### X.5 How to rebuild v3.3

As §V.6 and §W.6, with `v33`. Act Four's EL lock picks up `audio/ep01/v3-el/ep01-v33/act4/lines-A-cut-mouths.json` by itself (`el_lock.sh`).

## W. v3.2 (2026-09-28): the record (superseded by §X; its films were deleted)

**The films:**

| | Kokoro voices (primary) | ElevenLabs voices (set A) |
|---|---|---|
| **File** | `out/ep01/full-v3/ep01-v32.mp4` | `out/ep01/full-v3/ep01-v32-el.mp4` |
| **Length** | **21:24.54** (30,829 frames) | **21:27.08** (30,890 frames) |
| Size | 127.2 MB (video 532 kb/s) | 126.8 MB (video 526 kb/s) |
| Contact sheet (every 10 s) | `out/ep01/full-v3/ep01-v32-sheet.png` (129 frames) | `out/ep01/full-v3/ep01-v32-el-sheet.png` (129) |
| Transcript (episode timecodes, 235 lines) | [assembly/transcript-v32.txt](assembly/transcript-v32.txt) | [assembly/transcript-v32-el.txt](assembly/transcript-v32-el.txt) |
| Records | `assembly/kokoro-v32-assembly.json`, `-qa.json` | `assembly/el-v32-assembly.json`, `-qa.json`, `el-v32-pictures.json` |

- **Both films:**
  - 1920 × 1080, 24 fps, H.264 High (CRF 18, `-tune animation`), AAC 256 kb/s at 48 kHz;
  - nine titled chapters (Act Four: "five days, told twice");
  - the flash-fixed intro.
- **The sound** is the final v3.2 mixes as they are (`mix-v32/`, 05:30–05:31, and `mix-v32-el/`, 05:35–05:36), plus the intro's own master at −3 dB.
- **The outro** plays the sound pass's `outro-mix.wav` at the manifest's −1 dB, not `outro-b-v3.wav` (sound.md §V). It's the full outro length, 10.125 s.
- **The v3.1 films** (`ep01-v31.mp4`, `ep01-v31-el.mp4`) were **deleted** after both v3.2 films passed QA, as the lead asked. Their contact sheets are still on disk.

### W.1 The tag → outro seam: 2 s of hum alone

The sound pass's option (sound.md §V: "hold 0.75 s of black before the outro, and play `tag-tail`'s hum under it"), done in `assemble.py` (`hum_gap`):

1. **Picture:** 18 frames (0.75 s) of the tag's own last frame (the black of 33.05), held, between the tag and the outro. It's part of the **Tag** chapter; the Outro chapter starts after it.
   - The film's tag-last frame and the held frames differ by 1/255 at most: the same black.
2. **Sound under it:** the stem `audio/reel/ep01-v3/v32/tag-tail.wav` (EL: `el/tag-tail.flac`), its first 0.75 s, at the tag's level.
   - It continues the tag mix: the last 200 ms of the tag and the first 200 ms of the hum are −36.0 / −35.9 dBFS in Kokoro, and −35.2 / −35.9 in EL. The sample jump is 0.0007.
3. **The outro's audio is re-laid so the hum continues, not restarts.** `outro-mix.wav` is the outro master (first hit −6 dB, 150 ms fade-in) plus the stem's first 2 s under a hold-then-fade envelope.
   - `assemble.py` re-makes the master part with `mix_episode.py`'s own formula and subtracts it: the residual is 1.2e-7, so it matches exactly.
   - It fits the hum's gain: +2.77 dB (EL +2.81), the tag's.
   - It lays the stem from 0.75 s on under the outro's head, with the same envelope in hum time, so the hum still ends 2.0 s after the tag's last frame.
   - The join into the outro is continuous (sample jump 0.0001).
   - The re-laid files are `out/ep01/full-v3/assembly-v32[-el]/{tag-hum.wav, outro.wav, tag-last.png}`.
4. **The result:** from the tag's black at 21:12.4 / 21:15.0, **2.0 s of the vault's hum alone**, measured at about −36 dBFS, then the outro's first hit.
   - The outro still comes in **+12.7 dB** over the hum (momentary −34.5 → −21.2 LUFS), where v3.1 stepped +20.5.
   - The first hit is 6 dB down, and the full level comes 0.85 s later.

### W.2 The EL pictures for v3.2

The same method as v3.1 (§V.2), on `show/reel/ep01-v32-el/` and `audio/ep01/v3-el/ep01-v32/`, all under `assembly/el-v32/`. No shots pass's file was touched.

- **The takes:** `el_takes.py --lock v32`, 235 rows. The 224 non-V.O. rows each have a mouth track.
- **The locks:** `LOCK=v32 el_lock.sh`. It now computes the `--ep-in` values from the EL timelines.
  - **Frames:** cold open 583, Act One 8,039, Act Two 4,398, Act Three 3,330, Act Four 12,519, tag 992. Each equals its final EL mix.
  - Every check passes. Act Four was re-locked once its EL mix existed; before that, its plan's temp track failed the length check.
  - Act Four has 44 on-camera mouths, and the one silence is 5.12 s.
- **The Runway splices:**
  - **S7.13:** 264 frames, the hourglass at k128–263 (EL frames 11453–11588). Built with `hourglass_el.py --s713 11325 --back-at 170`, 136 PNGs.
  - **The tag's demo:** 233 frames from tag frame 62 (the splice at 62–278).
    - It's built with `insert.py`, then the tag pass's current `tag/tools/splice.ts` on the EL lock.
    - The splice laid **no host layer on any frame** (`with_host_layer 0`, no V.O.), as v3.2 cut "those are stills.".
- **GLYPH frames:** Act Three 5, Act Four 28. Remotion's plain frames are identical to Node's, and nothing outside the room area differs.
- **Renders:** 0 stand-ins, 0 failed layouts, 0 stand-in marks. Browser frames spliced: Act Three 5, Act Four 164, tag 217. Each file is muxed with its final EL mix.
- **Flashes, per picture:** cold open 1, Act One 2, Act Two 1, Acts Three and Four 0, tag 0; red 0. All pass.
- **Looked at:** EL beside Kokoro at the same shot frame.
  - Act Four: S1.02, S1.07, the Remove dialog before and on the click, and S7.13 k130, 173, 245 and 262.
  - The tag: 32.01 k61, the insert at i0, 180 and 216, the layout at i217, and 32.02 k0.
  - EL and Kokoro match at every one. The chat turns 3 frames later in EL's hourglass, on the EL line's end. The demo's stills carry no V.O. in either film.

### W.3 QA (measured, both films)

| Check | Kokoro v3.2 | EL v3.2 |
|---|---|---|
| **Full decode** | **0 error lines**, 30,829 frames | **0 error lines**, 30,890 frames |
| **A/V per chapter** (8 s cross-correlation with each source) | **lag 0 samples** in all nine chapters | **0** in all nine |
| A/V, the hum gap | the correlation peaks at 1,100 samples. That's a false reading on a steady 87 Hz tone (1,100 samples is two periods of it); the join samples are continuous by construction (§W.1) | the same |
| **Chapter edge frames** against their sources (mean abs diff /255) | 0.00–0.13 on the story chapters; the intro 0.01–0.24; the hum gap 0.67, the PNG still through the encode; a one-frame shift would read 0.7–38.5 | the same |
| **Integrated loudness** | **−16.09 LUFS** | **−16.10 LUFS** |
| **True peak** | **−1.10 dBTP**, in the tag (the AAC's overshoot on the mix's −1.44) | **−1.35 dBTP** |
| Chapters (LUFS-I) | cold open −16.1 · intro −17.1 · card −36.0 · the four acts −16.0 · tag −17.5 · outro −17.2 | −16.0 · −17.1 · −36.4 · −16.0 · −17.5 · −17.2 |
| **Digital zero** over 5 ms / holes under −60 dBFS for 0.3 s | **none / none** | **none / none** |
| **The one silence** (Remove click → buzz) | 12:29.8–12:34.8 (5.08 s), room tone at about −50 dBFS in every 250 ms, **0 zero samples** | 12:20.5–12:25.6 (5.12 s), the same |
| **Flashes, whole film** | **max 2 in 1 s** (the cold open's freeze, 0:14.5); red 0. **Pass** | **max 3** (the same freeze, 0:12.4, at the limit, as v3.1: the re-encode's noise on a designed flash that reads 1 in the picture alone); red 0. **Pass** |
| Flashes per chapter | cold open 2, intro 1, Acts One, Two and Four 1, the rest 0 | cold open 3, Act Two 2 (7:30.0), intro, Acts One and Four 1, the rest 0 |
| Chapters | nine, titled; the tag's includes the hum gap; they match the assembly to the millisecond | the same |

**Seams** (the decoded film; 200 ms RMS, momentary loudness over 400 ms):

| Join | Kokoro at | Step (dB) | Momentary (LUFS) | EL at | Step | What it is |
|---|---|---|---|---|---|---|
| cold open → intro | 0:26.67 | −11.3 | −15.8 → −30.4 | 0:24.29 | −11.3 | the rewind's whirr cut on the collapse into the intro's first bar (designed) |
| intro → card | 0:56.67 | +0.5 | −28.8 → −36.8 | 0:54.29 | +0.5 | the ring-out into the card's room (led under) |
| **card → Act One** | 0:58.67 | **+18.6** | −33.1 → −14.2 | 0:56.29 | **+20.7** | **the designed downbeat** (sound.md §V: composer X's hard cut on the downbeat, out of the card) |
| Act One → Two | 6:28.42 | −0.4 | −35.9 → −32.7 | 6:31.25 | +0.6 | |
| Act Two → Three | 9:41.46 | +0.7 | −38.0 → −34.0 | 9:34.50 | −0.1 | |
| Act Three → Four | 12:03.88 | −0.1 | −31.3 → −30.8 | 11:53.25 | +0.3 | |
| Act Four → tag | 20:32.33 | +0.4 | −25.6 → −24.5 | 20:34.88 | +1.2 | |
| tag → hum gap | 21:13.67 | +0.1 | −34.6 → −34.7 | 21:16.21 | −0.7 | the hum, continuous |
| **hum → outro** | 21:14.42 | **+12.7** | −34.5 → −21.2 | 21:16.96 | **+12.7** | the outro's first hit, 6 dB down (§W.1) |

### W.4 Watch these first

Timecodes are Kokoro / EL.

1. **The end:** the tag's black and the hum at 21:12.4 / 21:15.0 → the outro at 21:14.4 / 21:17.0. Do 2 s of hum alone, then the first hit at −6 dB, land as an ending?
2. **The card → Act One downbeat** at 0:58.7 / 0:56.3, +18.6 / +20.7 dB. It's designed; is it a jolt?
3. **Act Four's shock:**
   - the Remove dialog at 12:27.9 / 12:18.6;
   - the silence, 12:29.8–12:34.8 / 12:20.5–12:25.6.
4. **The Runway inserts:**
   - the hourglass, 19:48.4–19:54.1 / 19:50.5–19:56.1;
   - the Elgoog demo, 20:34.9–20:44.6 / 20:37.5–20:47.2, now with no V.O. over its stills.
5. **The cold open into the intro:** 0:26.7 / 0:24.3.
6. **The inner voice** (now at dialogue level; all lines are in the transcripts):

   | Line | Shot | Kokoro | EL | Text |
   |---|---|---|---|---|
   | v3-vo-03 | 5.04 | 1:35.04 | 1:36.29 | she's right. it will break. i don't know which part yet. |
   | v3-vo-05 | 5.11 | 2:42.46 | 2:47.58 | i know. i still read it twice. |
   | e1-a3-18-04 | 18.06 | 10:05.46 | 9:58.21 | i made it for everyone else. |
   | v3-vo-18 | S1.02 | 12:14.46 | 12:03.83 | gerg's not on it. alyi set it up. probably just the budget. |
   | a5-26a-01 | S2.01 | 12:46.88 | 12:37.54 | i don't keep score. |
   | v3-vo-20 | S5.03 | 16:27.29 | 16:20.83 | four hundred and six… |
   | v3-vo-24 | 32.03 | 20:49.38 | 20:51.92 | it looks calmer than me. |

7. **The cold open's freeze flash,** 0:14.5 / 0:12.4. It's the film's only flash reading over 1, and it passes.

### W.5 What's left

1. **The two designed steps** (card → Act One, and the outro's first hit) are for an ear.
2. **The EL cold open's flash reads 3, at the limit** (§W.3). It's re-encode noise on a designed flash; it passes.
3. **The EL mouths** are built, not voice-timed, as in v3 and v3.1.

### W.6 How to rebuild v3.2

As §V.6, with `v32` in place of `v31`:

```sh
$PY $A/tools/el_takes.py --lock v32 && LOCK=v32 bash $A/tools/el_lock.sh           # re-run act4 once mix-v32-el/act4-mix.wav exists
export ELDIR=$PWD/$A/el-v32   # then build_el / bundle_el / glyphs / hourglass_el.py --s713 11325 --back-at 170 / insert.py + splice.ts / picture, as §V.6
bash ops/heavy.sh $PY $A/tools/assemble.py kokoro-v32 && bash ops/heavy.sh $PY $A/tools/assemble.py el-v32    # incl. the hum gap (§W.1)
bash ops/heavy.sh $PY $A/tools/qa.py kokoro-v32 && bash ops/heavy.sh $PY $A/tools/qa.py el-v32
bash ops/heavy.sh $PY $A/tools/seam_frames.py kokoro-v32 el-v32
```

- `qa.py` now reads the audio as float32 and measures the true peak in 30 s blocks. The whole-film 4× oversample had been killed at the 8 GB scope (exit 137).

## V. v3.1 (2026-09-28): the record (superseded by §W; its films were deleted)

**The films:**

| | Kokoro voices (primary) | ElevenLabs voices (set A, Mas recast) |
|---|---|---|
| **File** | `out/ep01/full-v3/ep01-v31.mp4` | `out/ep01/full-v3/ep01-v31-el.mp4` |
| **Length** | **21:51.71** (31,481 frames) | **21:59.08** (31,658 frames) |
| Size | 129.0 MB (video 525 kb/s) | 129.3 MB (video 521 kb/s) |
| Contact sheet (one frame every 10 s) | `out/ep01/full-v3/ep01-v31-sheet.png` (132 frames) | `out/ep01/full-v3/ep01-v31-el-sheet.png` (132) |
| Transcript (episode timecodes, 251 lines) | [assembly/transcript-v31.txt](assembly/transcript-v31.txt) | [assembly/transcript-v31-el.txt](assembly/transcript-v31-el.txt) |
| Build and QA records | `assembly/kokoro-v31-assembly.json`, `-qa.json` | `assembly/el-v31-assembly.json`, `-qa.json`; `assembly/el-v31-pictures.json` |

- **Both films:** 1920 × 1080, 24 fps, H.264 High (CRF 18, `-tune animation`, a keyframe on every chapter's first frame), AAC-LC 256 kb/s at 48 kHz stereo, nine titled chapters.
- **Act Four's chapter title** is "Act Four · five days, told twice".
- **Built as in v3** (§2.3 below), with the v3.1 manifests (`show/reel/ep01-v31[-el]/`) and the v3.1 mixes (`out/ep01/full-v3/mix-v31[-el]/`). Nothing is added to the mixes: every chapter plays its final mix as it is, with the score fades the sound pass put at each head. The intro and the outro play their own masters at the manifest's −3 dB and −1 dB.

### V.1 The chapters

| # | Chapter | Picture | Kokoro start · length | EL start · length |
|---|---|---|---|---|
| 1 | Cold open | `picture[-el]/coldopen.mp4` | 0:00.00 · 26.67 | 0:00.00 · 24.29 |
| 2 | Intro | **`out/season/intro/intro-ep1-V1-1080p-flashfix.mp4`** (the manifest's) | 0:26.67 · 30.00 | 0:24.29 · 30.00 |
| 3 | ep1.0_research_preview.md | `picture/card.mp4` (both) | 0:56.67 · 2.00 | 0:54.29 · 2.00 |
| 4 | Act One · research preview | `…/act1.mp4` | 0:58.67 · 5:37.46 | 0:56.29 · 5:45.42 |
| 5 | Act Two · the regulate-me tour | `…/act2.mp4` | 6:36.12 · 3:21.25 | 6:41.71 · 3:13.54 |
| 6 | Act Three · verified: human | `…/act3.mp4` | 9:57.38 · 2:25.13 | 9:55.25 · 2:23.17 |
| 7 | Act Four · five days, told twice | `…/act4.mp4` | 12:22.50 · 8:37.75 | 12:18.42 · 8:49.21 |
| 8 | Tag · december | `…/tag.mp4` | 21:00.25 · 0:41.33 | 21:07.62 · 0:41.33 |
| 9 | Outro · credits | `out/ep01/outro/outro-b-v3.mp4` | 21:41.58 · 10.13 | 21:48.96 · 10.13 |

The Kokoro pictures are the shot passes' final v3.1 renders, as they are. The EL pictures are this pass's (§V.2).

### V.2 The EL pictures for v3.1

The same method as v3 (§2.2), on the v3.1 EL lock `show/reel/ep01-v31-el/` and the v3.1 EL takes `audio/ep01/v3-el/ep01-v31/`. Everything is written under `assembly/el-v31/`; no shots pass's `data.ts` or `lock/` file was touched.

1. **The takes** (`el_takes.py --lock v31`): 251 rows. Each has the Kokoro v3.1 take's camera fields; each of the 223 non-V.O. rows has a mouth track.
2. **The locks** (`LOCK=v31 el_lock.sh`): every check passes in all six. The EL `--ep-in` values are the EL v3.1 episode's (cold open 583 + intro 720 + card 48).

   | | Cold open | Act One | Act Two | Act Three | Act Four | Tag |
   |---|---|---|---|---|---|---|
   | Frames | 583 | 8,290 | 4,645 | 3,436 | 12,701 | 992 |
   | Each equals its EL v3.1 mix | yes | yes | yes | yes | yes | yes |

   - Act Four keeps 44 on-camera mouths, as Kokoro.
   - The one silence (the Remove click → the buzz) is 5.12 s on the EL lock (Kokoro 5.08 s).
   - **The Runway beats keep their frames:** S7.13 is 264 f and v31-32.01d 233 f in both locks, at tag frame 62 in both.
   - The lock's decisions match the Kokoro locks'.
3. **Renderers:** `ELDIR=assembly/el-v31 build_el.mjs <seg>` for each segment. `check` gives 0 stand-ins and 0 problems in all six.
4. **The GLYPH frames:** `bundle_el.mjs` (all six `data.ts` redirected), then `glyphs`. Act Three has 5 (at 567–571); Act Four has 28 (at 666–693, run with `--opt hourglass=false`, as the shots pass). The host's check holds for both: plain frames identical, nothing outside the room area differs.
5. **Act Four's Runway hourglass** (`tools/hourglass_el.py`): the runway pass's `hourglass.py`, imported unchanged, with its borrowed Act Four frames (the band, the pixel aftermath, the in-context lead) drawn by the EL renderer.
   - Its arguments are `--s713 11445` (S7.13 on the EL lock) and `--back-at 170`. Ttemme's "Chat, we're so back." ends at k169 in EL, against k166 in Kokoro, so the chat turns 3 frames later.
   - It made the 136 PNGs, k128–263.
6. **The tag's Runway demo:**
   - `insert.py --variants a --no-chip --png … --png-offset 62` makes the 233 frames.
   - The runway pass's `tag/tools/splice.ts` then bakes the host layer in. It's built with `build_el.mjs tag … --entry …/splice.ts`, so it runs on the EL lock and the V.O. "those are stills." sits on the EL clock (42 frames carry it, 232–273).
   - 217 frames splice at 62–278, as in Kokoro.
7. **Renders** (`--jobs 2`, through `ops/heavy.sh`), then muxed with the final EL mixes:
   - 0 stand-ins, 0 failed layouts, 0 stand-in marks.
   - Browser frames spliced: Act Three 5, Act Four 164 (28 + 136), tag 217.
   - Video and audio are the same length in every file.
8. **Flashes, per EL picture** (`tools/flash_seg.py`, the house method, streamed):
   - the cold open 1 (the freeze), Acts One and Two 1, Act Three 0, Act Four 0, the tag 0;
   - red 0 everywhere;
   - all pass.
9. **Intermediates:** every PNG, the Remotion bundle and the render chunks were deleted after use.

### V.3 QA (measured, both films)

| Check | Kokoro v3.1 | EL v3.1 |
|---|---|---|
| **Full decode** | **0 error lines**, 31,481 frames | **0 error lines**, 31,658 frames |
| Streams | video 1311.708 s; AAC 1311.708 s | video 1319.083 s; AAC 1319.083 s |
| **A/V per chapter** (cross-correlation with each chapter's source over 8 s) | **lag 0 samples in all nine** (correlation 0.9997–1.0) | **0 in all nine** |
| **Chapter edge frames** against their source pictures (mean abs diff /255) | 0.00–0.13 on the story chapters and the card, 0.01–0.24 on the flash-fixed intro; a one-frame shift would read 0.7–38.5 | the same |
| **Integrated loudness** | **−16.06 LUFS** | **−16.08 LUFS** |
| **True peak** | **−1.43 dBTP** | **−1.23 dBTP** |
| Chapters (LUFS-I) | cold open −16.1 · intro −17.1 · card −36.2 · acts −16.0 · tag −16.5 · outro −17.0 | −16.0 · −17.1 · −36.1 · acts −16.0 to −16.1 · tag −16.6 · outro −17.0 |
| **Digital zero** (runs over 5 ms) | **none** (the v3 hole at Act Three's black is fixed in the mix) | **none** |
| Holes under −60 dBFS for 0.3 s or more | none | none |
| **The one silence** (Remove click → buzz) | 12:48.4–12:53.5 (5.1 s): room tone at **−49.0 LUFS**, 50 ms windows −48.5 to −51.5 dBFS, **0 zero samples** | 12:45.6–12:50.8: −48.9 LUFS, −48.5 / −51.6, 0 zeros |
| **Flashes, the whole film** | **max 2 in 1 s** (the cold open's freeze, 0:14.5); red 0. **Pass** | **max 3 in 1 s** (the same freeze, 0:12.4, at the limit); red 0. **Pass** |
| Flashes per chapter | cold open 2, intro 1 (it read 4 in v3: the flash fix works), acts ≤ 1, Act Four 0, tag 0, outro 0 | cold open 3, intro 1, Act Two 2 (7:48.0), others ≤ 1 |
| Largest single-frame luminance step | 0.653, in the intro | the same |
| Chapters | nine, titled, matching the assembly to the millisecond | the same |

- **The flash at the cold open's freeze** is the designed 3-frame flash on the cut into 2.01.
  - **The EL picture measures 1 there on its own, and 3 in the film.** I compared the two frame for frame: they differ by 0.2–0.45 of 255, the re-encode's noise. That noise splits the measure's runs on the phone insert's busy dither just after the cut (frames 313–315), so it counts two extra transitions.
  - **So the reading sits at the threshold, not the picture.** It still passes (≤ 3). A certified analyser is the real test.

**Seams** (the decoded film; 200 ms RMS either side, momentary loudness over 400 ms):

| Join | Kokoro at | Step (dB) | Momentary before → after (LUFS) | EL at | Step | What it is |
|---|---|---|---|---|---|---|
| cold open → intro | 0:26.67 | −11.3 | −15.8 → −30.4 | 0:24.29 | −11.3 | the rewind's whirr cut on the collapse, into the intro's quiet first bar (designed) |
| intro → card | 0:56.67 | +0.5 | −28.8 → −36.7 | 0:54.29 | +0.5 | the ring-out into the card's room (led under, as v3) |
| card → Act One | 0:58.67 | +0.4 | −34.0 → −28.5 | 0:56.29 | +0.2 | the bullpen rising |
| **Act One → Act Two** | 6:36.12 | **+0.4** | −35.8 → −32.7 | 6:41.71 | +0.4 | v3's +20.3 dB entry is gone (the new score and the sound pass's head fades) |
| **Act Two → Act Three** | 9:57.38 | **+0.9** | −38.2 → −33.5 | 9:55.25 | +1.5 | v3's +21.1 dB is gone |
| Act Three → Act Four | 12:22.50 | +0.4 | −31.8 → −30.8 | 12:18.42 | +0.4 | continuous |
| Act Four → tag | 21:00.25 | +0.6 | −24.1 → −24.4 | 21:07.62 | +1.0 | continuous |
| **tag → outro** | 21:41.58 | **+20.5** | −33.9 → −13.9 | 21:48.96 | **+19.8** | the vault's hum under black, then the outro's master opening at −14.8 dBFS: **the one big step left** |

- **Every sample jump is under 0.01.** No seam needed a crossfade beyond the intro → card lead-in.

**Looked at** (stills only, EL beside Kokoro at the same shot frame, decoded from the renders):
- Act Four's new opening: S1.01, v31-S1.01b, S1.02 (the V.O. typing), S1.07 (Alyi's lit tile on his line, then the freeze), v31-S1.08d (the Remove dialog, before and on the click), S1.09 and S1.11.
- The hourglass splice at S7.13 k120, 130, 150, 173 (the shatter), 200, 245 and 262, and S8.01's first frame.
- The tag's splice: 32.01 k61, the insert at i0, 60, 118, 180 (the V.O.), 216, 217 (the layout's two-shot), and 32.02 k0.
- The cold open's rewind, k0–74.
- The EL contact sheet.
- **What they show:** EL and Kokoro draw the same state at every moment compared. The only difference seen is the chat turning 3 frames later in the EL hourglass, on the EL line's end.

### V.4 Watch these first

Timecodes are Kokoro / EL.

1. **Act Four's opening, the shock:**
   - Vegas at 12:22.5 / 12:18.4, and the V.O. over JOIN at 12:33.1 / 12:29.0;
   - Alyi's sentence at 12:41.3 / 12:37.6;
   - **the hard cut to the Remove dialog** at 12:46.5 / 12:43.8;
   - **the one silence**, 12:48.4–12:53.5 / 12:45.6–12:50.8, then the buzz and "super.";
   - THE PLAN on the board's side from 13:08.9 / 13:05.5.
2. **The Runway inserts:**
   - the hourglass, 20:13.7–20:19.4 / 20:20.6–20:26.3 (the shatter at k173);
   - the tag's Elgoog demo, 21:02.8–21:12.5 / 21:10.2–21:19.9, with "those are stills." at 21:09.8 / 21:17.2.
3. **The seams:**
   - the cold open collapsing into the intro, 0:26.7 / 0:24.3;
   - the card, 0:56.7 / 0:54.3;
   - **the tag → outro step (+20 dB)**, 21:41.6 / 21:49.0.
4. **The cold open's freeze flash,** 0:14.5 / 0:12.4: the film's only flash reading above 1 (§V.3).
5. **The inner voice** (28 lines; all are in the transcripts):

   | Line | Shot | Kokoro | EL | Text |
   |---|---|---|---|---|
   | v3-vo-01 | 5.02 | 1:02.83 | 1:00.46 | gerg wants to ship it. rima wants it quiet… (shares the screen with `NOV 30, 2022`) |
   | v3-vo-03 | 5.04 | 1:37.38 | 1:40.12 | she's right. it will break. i don't know which part yet. |
   | v3-vo-06 | 6.01 | 2:55.04 | 3:02.58 | someone noticed. |
   | v3-vo-10 | 11.03 | 5:46.96 | 5:52.67 | mario used to sit where gerg sits. he left to build a careful one. |
   | v31-vo-01 | 13.01 | 6:37.12 | 6:42.71 | four companies, one table… (shares the screen with the White House rail) |
   | v31-vo-02 | 14.01 | 7:52.92 | 7:56.12 | her mouth is a beat late. the voice isn't hers. (shares the screen with `MAY 12, 2023`) |
   | v31-vo-04 | 18.02 | 10:10.58 | 10:08.38 | my other company. it tells people from machines. |
   | e1-a3-18-04 | 18.06 | 10:23.88 | 10:22.25 | i made it for everyone else. |
   | v31-vo-05 | v31-19.03 | 10:46.21 | 10:43.83 | i've had mine up since may. (the hands runner) |
   | v31-vo-06 | v31-20.07 | 11:27.71 | 11:25.88 | neleh's on our board. she quoted us. (shares the screen with `OCT 2023`) |
   | v3-vo-18 | S1.02 | 12:33.08 | 12:29.00 | gerg's not on it. alyi set it up. probably just the budget. |
   | a5-26a-01 | S2.01 | 13:01.29 | 12:58.50 | i don't keep score. |
   | v3-vo-20 | S5.03 | 16:51.12 | 16:49.42 | four hundred and six… |
   | v3-vo-23 | S5.09b | 18:00.08 | 18:01.00 | gerg never waits to be asked. |
   | v3-vo-24 | 32.03 | 21:17.29 | 21:24.67 | it looks calmer than me. |

6. **In the EL film, the lip-sync** (mouths from the EL words and G2P, as v3): Alyi's line on his lit tile (12:37.6), Tasya in the lobby with Sydney, and Rima's "We'll say we will." (voices-el.md flags its creaky register).

### V.5 What's left, or to decide

1. **The tag → outro step:** +20 dB from the vault's hum into the outro master's first note. It's the only big level change left in either film. Options: a shorter black, or the outro's first 100 ms eased in. It's an ear's call.
2. **The flash reading at the cold open's freeze in the EL film** is 3, at the limit. It's the re-encode's noise on a designed flash, and the picture's own reading is 1. It passes.
3. **The V.O. over a date rail:** at v3-vo-01, v31-vo-01, v31-vo-02 and v31-vo-06, in both locks. That's the lock's timing.
4. **The EL mouths** are built, not voice-timed, as in v3.
5. **The old v3 films** (`ep01-v3.mp4`, `ep01-v3-el.mp4`, 234 MB) are still on disk. PLAN §5.8 moves the Drive copies to the trash; the local files are the lead's call.

### V.6 How to rebuild v3.1

From the repo root. `PY=audio/.venv-casting/bin/python`, `A=show/episodes/ep01/production/full-v3/assembly`, `S` = a scratch folder. Every heavy step goes through `ops/heavy.sh`, one at a time.

```sh
# the EL pictures
$PY $A/tools/el_takes.py --lock v31                      # assembly/el-v31/<seg>-takes.json
LOCK=v31 bash $A/tools/el_lock.sh                        # assembly/el-v31/lock-<seg>.json + data-<seg>.ts
export ELDIR=$PWD/$A/el-v31; cd studio
for s in coldopen act1 act2 act3 act4 tag; do node ../$A/tools/build_el.mjs $s $S/r-$s-el.cjs && node $S/r-$s-el.cjs check; done
bash ../ops/heavy.sh node ../$A/tools/bundle_el.mjs $S/bundle
BUNDLE=$S/bundle bash ../ops/heavy.sh node $S/r-act3-el.cjs glyphs $S/glyph-act3 2
BUNDLE=$S/bundle bash ../ops/heavy.sh node $S/r-act4-el.cjs glyphs $S/glyph-act4 2 --opt hourglass=false
cd .. && bash ops/heavy.sh $PY $A/tools/hourglass_el.py --scratch $S/hg --out $S/hg-out --png $S/glyph-act4 --s713 11445 --back-at 170
bash ops/heavy.sh $PY studio/src/dev/genvideo/runway/insert.py --scratch $S/rw --out $S/rw-out --variants a --no-chip --png $S/glyph-demo --png-offset 62
cd studio && node ../$A/tools/build_el.mjs tag $S/splice-el.cjs --entry src/episodes/ep01/pixel/tag/tools/splice.ts
bash ../ops/heavy.sh node $S/splice-el.cjs $S/glyph-demo $S/glyph-tag
for s in coldopen act1 act2 act3 act4 tag; do G=; [ -d $S/glyph-$s ] && G=$S/glyph-$s
  GLYPH_DIR=$G SEGDIR=$S X264_THREADS=1 bash ../ops/heavy.sh node $S/r-$s-el.cjs picture ../out/ep01/full-v3/picture-el/$s.mp4 --jobs 2 --no-audio; done
cd ..   # then mux each picture-el/<seg>.mp4 with out/ep01/full-v3/mix-v31-el/<seg>-mix.wav (-c:v copy, AAC)
#   ALWAYS pass the picture-el/ output: an EL renderer's default output is the Kokoro picture's path.
#   The --s713 and --back-at values come from assembly/el-v31/lock-act4.json (S7.13's s; a5-30-18's e + 1).

# the films and their QA
bash ops/heavy.sh $PY $A/tools/assemble.py kokoro-v31 && bash ops/heavy.sh $PY $A/tools/assemble.py el-v31
bash ops/heavy.sh $PY $A/tools/qa.py kokoro-v31 && bash ops/heavy.sh $PY $A/tools/qa.py el-v31
$PY $A/tools/seam_frames.py kokoro-v31 el-v31                                    # -> assembly/seam-frames-kokoro-v31-el-v31.json
$PY $A/tools/flash_seg.py out/ep01/full-v3/picture-el/*.mp4                     # the per-picture flash check
```

**Disk:** the two v3.1 films are 248 MB and the EL pictures 110 MB. About 5.6 GB was free at the end.

---

# The v3 round (2026-09-27): the record

**The films:**

| | Kokoro voices | ElevenLabs voices (set A) |
|---|---|---|
| **File** | `out/ep01/full-v3/ep01-v3.mp4` | `out/ep01/full-v3/ep01-v3-el.mp4` |
| **Length** | **21:25.75** (30,858 frames) | **21:48.58** (31,406 frames) |
| Size | 121.6 MB (video 494 kb/s) | 123.5 MB (video 492 kb/s) |
| Contact sheet (one frame every 10 s) | `out/ep01/full-v3/ep01-v3-sheet.png` (129 frames) | `out/ep01/full-v3/ep01-v3-el-sheet.png` (131) |
| Transcript (episode timecodes) | [assembly/transcript.txt](assembly/transcript.txt) | [assembly/transcript-el.txt](assembly/transcript-el.txt) |
| Build and QA records | `assembly/kokoro-assembly.json`, `assembly/kokoro-qa.json` | `assembly/el-assembly.json`, `assembly/el-qa.json` |

- **Both films:** 1920 × 1080, 24 fps, H.264 High (CRF 18, `-tune animation`, a keyframe on every chapter's first frame), AAC-LC 256 kb/s at 48 kHz stereo, nine titled chapters.
- **The other files this pass made:**
  - the filename card, `out/ep01/full-v3/picture/card.mp4`;
  - the six EL pictures, `out/ep01/full-v3/picture-el/<seg>.mp4` (with `.srt` and `.render.json`), each muxed with its final EL mix.
- **Where things are:**
  - the card's segment: `assembly/card/`;
  - the EL locks and takes: `assembly/el/`;
  - the tools: `assembly/tools/`.

---

## 1. The chapters

In the manifest's order. Start times are episode time.

| # | Chapter title | Picture | Sound | Kokoro start · length | EL start · length |
|---|---|---|---|---|---|
| 1 | Cold open | `picture[-el]/coldopen.mp4` | `mix[-el]/coldopen-mix.wav` | 0:00.00 · 30.67 | 0:00.00 · 30.04 |
| 2 | Intro | `out/season/intro/intro-ep1-V1-1080p.mp4` | its own mix, `audio/intro/mix/intro-ep1-mix-V1-chipchamber.wav`, **−3 dB** (the manifest) | 0:30.67 · 30.00 | 0:30.04 · 30.00 |
| 3 | ep1.0_research_preview.md | `picture/card.mp4` (both) | `mix[-el]/card-mix.wav` | 1:00.67 · 2.00 | 1:00.04 · 2.00 |
| 4 | Act One · research preview | `picture[-el]/act1.mp4` | `mix[-el]/act1-mix.wav` | 1:02.67 · 5:22.50 | 1:02.04 · 5:37.46 |
| 5 | Act Two · the regulate-me tour | `…/act2.mp4` | `…/act2-mix.wav` | 6:25.17 · 3:24.75 | 6:39.50 · 3:17.21 |
| 6 | Act Three · verified: human | `…/act3.mp4` | `…/act3-mix.wav` | 9:49.92 · 2:08.04 | 9:56.71 · 2:05.33 |
| 7 | Act Four · the blip, told twice | `…/act4.mp4` | `…/act4-mix.wav` | 11:57.96 · 8:43.79 | 12:02.04 · 9:02.71 |
| 8 | Tag · december | `…/tag.mp4` | `…/tag-mix.wav` | 20:41.75 · 0:33.88 | 21:04.75 · 0:33.71 |
| 9 | Outro · credits | `out/ep01/outro/outro-b-v3.mp4` | its own master, `outro-b-v3.wav`, **−1 dB** (the manifest) | 21:15.62 · 10.13 | 21:38.46 · 10.13 |

- **Where the sources come from:**
  - The Kokoro pictures are the shot passes' renders, as they are.
  - The mixes are the v3-sound pass's finals (the Kokoro ones written at 14:39, the EL ones at 14:42). Each is its picture's exact length.
- **Measured against the lock:** the Kokoro film's story (20:43.6) plus the intro, card and outro is 21:25.75. That's the lock's 21:25.8. The EL film is 22.8 s longer, all of it in the voices (voices-el.md §P3).

## 2. How it was built

### 2.1 The filename card (step 1)

- **What it is:** a one-beat pixel segment. The timeline is [assembly/card/timeline.json](assembly/card/timeline.json), the layout is `assembly/card/shots.ts`, and the lock (`data.ts`, `lock.json`) is lock.py's.
- **The picture, 2.0 s (48 f), the whole 480 × 270 frame:**
  - black (`N0`), with a solid block cursor alone for 4 frames;
  - then `ep1.0_research_preview.md` types on at 2 characters a frame (frames 4–16), in the show's 14 px display face (the plates' `bigText`), in paper `P2` on an `N2` shadow, centred;
  - then the cursor blinks on 8s: on 17–24, off 25–32, on 33–40, off 41–47. The cut to Act One lands on an off.
  - No disclaimer, no band rule (SHOWRUNNER-NOTES 3).
- **Stills looked at:** frames 0, 5, 10, 16, 20, 28, 36 and 47.
- **The sound is the v3-sound pass's `card-mix.wav`** (−36.1 LUFS): room tone at −38, with the bullpen leading Act One's first cut by 0.6 s (the script's J-cut). The brief's −45 LUFS was the fallback for "no room tone". This one is the room tone, and it runs continuously into Act One's bullpen: the card → Act One seam steps only +1.0 dB. Setting the card to −45 would have made a 10 dB step there.
- **The intro's ring-out** doesn't reach the card. Its master is exactly 30.000 s, and it fades to −55 dBFS over its last 100 ms. So the card's room is led in under that fade (§2.3).
- **Never digital zero:** the card's loudest zero run is 1 sample, at its first sample. The room fades in over 1.25 ms.

### 2.2 The EL pictures (step 2)

Each segment is re-locked on its EL timeline with the pixel pipeline's own `tools/lock.py`, with the flags its shots pass used. **No shots pass's `data.ts` or `lock/` file was touched.** The EL locks are written with lock.py's `--out-ts` / `--out-json` into `assembly/el/`.

1. **The takes** (`tools/el_takes.py`, light):
   - **The problem:** the EL takes carry no mouth track, and their on-camera, mode and device fields differ from the Kokoro takes' on 72 of 228 rows (for example the monitor, blueprint and reflection lines).
   - **What it writes:** `assembly/el/<seg>-takes.json`. The EL take's file, length and words, and the Kokoro take's camera fields (the same row the Kokoro lock read), so every line is framed exactly as in the Kokoro picture.
   - **The mouths:** a mouth track for every non-V.O. take (204 of them), by the house method: `coldopen/tools/mouths.py`'s `mouth_cues`, imported, not edited. It uses the EL take's word spans and its WAV's envelope.
   - **The phonemes:** from misaki's G2P (Kokoro's own front end). 35 words (mostly the parody names) take the Kokoro takes' phonemes. Two words fall back to a letter guess: "back—and" and "Gtp-4".
2. **The locks** (`tools/el_lock.sh`, light):
   - It passes `--timeline show/reel/ep01-v3-el/ep01-v3-el-<seg>.json --takes assembly/el/<seg>-takes.json --mix out/ep01/full-v3/mix-el/<seg>-mix.wav`, with the EL episode's `--ep-in`; Act Four also gets its `--plan pixel/act4/plan.json`.
   - **Every check passes in all six:**
     - the lengths are 721, 8,099, 4,733, 3,008, 13,025 and 809 frames, each equal to its EL mix;
     - every on-camera mouth has a track (Act Four: 44, as Kokoro);
     - Act Four's Cancel-to-buzz silence is 3.71 s, as Kokoro.
   - **The decisions against the Kokoro locks' are the same.** Only three read-floor numbers moved by a few frames.
3. **The renderers** (`tools/build_el.mjs`): the pipeline's own bundle (the segment's `shots.ts` + `tools/render.ts`), with one esbuild redirect: the shots' `./data` import resolves to `assembly/el/data-<seg>.ts`. It fails if the redirect didn't happen.
   - **`check`:** 0 stand-ins, 0 layout problems, 0 unresolved marks in all six.
   - **The lock's own notes, as in Kokoro:** the V.O. shares the screen with a date rail at v3-vo-01, v3-vo-11 and v3-vo-17.
4. **The GLYPH frames** (Act Three's 5, Act Four's 28): `tools/bundle_el.mjs` builds a Remotion bundle of `pixel/entry.tsx` with the same redirect (a webpack `NormalModuleReplacementPlugin`; all six `data.ts` redirected). Then the renderers' `glyphs` mode draws them.
   - **The host's check** holds for both acts: the plain frames either side are identical, Node against Remotion; nothing outside the room area differs on the GLYPH frames.
   - **They sit on the EL frames:** Act Four 1173–1200 (Kokoro 1146–1173), Act Three 357–361.
5. **The renders:** `picture-el/<seg>.mp4` (`--jobs 2`, `X264_THREADS=1`, through heavy.sh), then re-muxed with the final EL mixes.
   - **Frames:** 721 + 8,099 + 4,733 + 3,008 + 13,025 + 809.
   - **The record:** 0 stand-ins, 0 failed layouts; GLYPH spliced 5 and 28, 0 stand-in marks.
   - **Video and audio lengths agree** in every file.
6. **Looked at:**
   - the six EL contact sheets (Act One at full size);
   - Kokoro against EL stills at the same story moment: 5.04 on Rima's line, 13.09, S1.06 mid-V.O. and on the click, S4.02 at the clack and on Alyi's line, and 32.04.
   - The layouts drew the same states on the EL marks (the arrow on JOIN at the click, the phone at the clack). The V.O. typed through in the new timing.

### 2.3 The films (step 3, `tools/assemble.py`)

- **Picture:** the nine chapter pictures, decoded and concatenated frame for frame (the concat filter), then re-encoded once. Nothing is trimmed, padded or moved.
  - **Each chapter's first and last frame match the same frame of its source:** a mean absolute difference of 0.00–0.13 of 255 for the pixel chapters and 0.86–1.37 for the intro (its detail, through the re-encode). Where the neighbouring frame differs, it measures far off (Act Two's first frame 0.01 against 38.5), so a one-frame shift would show (`assembly/seam-frames.json`).
- **Sound:** one 48 kHz track, built sample-exact. Each chapter is exactly its picture's frames × 2,000 samples; the script refuses to pad or trim.
  - **The story chapters and the card play the sound pass's mixes as they are, back to back.** That pass built them on one clock, with its 2 s seam ramps, so those joins stay bit-exact.
  - **The intro and the outro** play their own masters at the manifest's gains.
  - **The manifest's intro "tail: 0.3"** was a ring-out past the picture. The master has none (it's exactly 30.000 s and already faded), so there was nothing to extend. The stick mixer's 0.3 s fade-out, a side effect of that field, isn't applied twice.
- **Seams:**
  - **At intro → card**, the one place two chapters' room tones meet across a gap, the card's own first 0.3 s of room tone (time-reversed, equal-power in) is laid under the intro's last 0.3 s. So the room is already there when the ring-out ends. The 200 ms before the seam goes from −44.6 to −38.2 dBFS, against −37.7 after.
  - **No other seam needed a crossfade or a de-click:** every sample jump is under 0.01.
- **Chapters:** the nine titled chapters come from an ffconcat chapter list. The bundled ffmpeg has no ffmetadata demuxer. Read back, they match the assembly to the millisecond.

## 3. QA (measured, both films)

| Check | Kokoro | EL |
|---|---|---|
| **Full decode** (`ffmpeg -v error`, video and audio) | **0 error lines**, 30,858 frames decoded | **0 error lines**, 31,406 |
| Streams | H.264 30,858 frames = 1285.750 s; AAC 1285.750 s | 31,406 frames = 1308.583 s; AAC 1308.583 s |
| **A/V, the total** | the decoded audio runs 10.0 ms past the last frame (AAC's last-frame padding, under a quarter of a picture frame) | 3.4 ms |
| **A/V, per chapter** | each chapter's audio, cross-correlated with its source over 8 s: **lag 0 samples in all nine** (correlation 0.9997–1.0) | **0 samples in all nine** |
| **Integrated loudness** | **−16.07 LUFS** | **−16.09 LUFS** |
| **True peak** (4× oversampled, the decoded AAC) | **−1.40 dBTP** | **−1.20 dBTP** |
| Chapters' loudness (LUFS-I) | cold open −16.0, intro −17.1, card −36.1, acts −16.0 (all four), tag −17.1, outro −17.0 | cold open −16.0, intro −17.1, card −36.0, acts −16.0 to −16.1, tag −17.0, outro −17.0 |
| Chapters' true peaks | −4.5, −4.2, −23.9, −1.5, −2.0, −1.4, −1.7, −1.5, −4.1 | −3.1, −4.2, −24.0, −1.2, −1.7, −1.4, −1.5, −1.3, −4.1 |
| Chapters' loudest 3 s | −12.7 (the tag) to −14.8 LUFS (the outro), card −36.1 | −12.2 (the tag) to −14.8, card −36.0 |
| **Digital-zero runs over 5 ms** | **one, inside Act Three: 107.5 ms at 11:55.71** (§5.2) | **one: 92.5 ms at 11:59.79** |
| Holes (under −60 dBFS for 0.3 s or more) | the same place, 0.30 s | the same, 0.30 s |
| **The Cancel-click silence** | 12:45.62 → 12:49.33 (3.71 s): **room tone at −48.9 LUFS**, loudest 50 ms −48.5 dBFS, quietest −51.5, **0 zero samples** | 12:50.83 → 12:54.54: −48.9 LUFS, −48.6 / −51.5, 0 zeros |
| **Photosensitivity** (flashcheck.py's method on the whole film) | **max 4 flashes in 1 s, in the intro at 0:39.88: over the limit of 3** (§5.1). Everywhere else: at most 1 (the cold open's freeze, 6:03.6 in Act One, 6:36.5 in Act Two); red flashes 0 | **4, in the intro at 0:39.25**. Everywhere else at most 2 (Act Four at 13:13.4); red 0 |
| Largest single-frame step of mean luminance | 0.668, in the intro (0:35.67) | the same (0:35.04) |
| Transcript | 228 lines + the intro, card and outro, at their first sound | 228 + 3 |
| Contact sheet | 129 frames, every 10 s, timecode and chapter under each | 131 |

**Seams** (the decoded film, 200 ms RMS either side of the join, and momentary loudness over 400 ms):

| Join | Kokoro at | Step (dB) | Momentary before → after (LUFS) | EL at | Step | What it is |
|---|---|---|---|---|---|---|
| cold open → intro | 0:30.67 | −11.7 | −16.8 → −30.4 | 0:30.04 | −11.8 | the smash to the intro: the 1993 alert and MM-06 cut to the intro's quiet first bar (designed) |
| intro → card | 1:00.67 | +0.5 | −28.8 → −36.5 | 1:00.04 | +0.5 | the ring-out into the card's room, now led under (§2.3) |
| card → Act One | 1:02.67 | +1.0 | −34.3 → −32.1 | 1:02.04 | +1.6 | the bullpen rising (the J-cut) |
| **Act One → Act Two** | 6:25.17 | **+20.3** | −35.9 → −15.4 | 6:39.50 | **+20.5** | the act-out black, then MM-19 and the White House on the first frame |
| **Act Two → Act Three** | 9:49.92 | **+21.1** | −37.9 → −16.2 | 9:56.71 | **+21.8** | the black, then the felt's D♭ bloom |
| Act Three → Act Four | 11:57.96 | +0.9 | −32.1 → −30.7 | 12:02.04 | +0.8 | the crane pre-lap, continuous |
| Act Four → tag | 20:41.75 | −1.1 | −23.5 → −25.5 | 21:04.75 | −0.2 | the pedal's ring-out, continuous |
| **tag → outro** | 21:15.62 | **+20.5** | −33.9 → −13.9 | 21:38.46 | **+19.5** | the vault's hum under black, then the outro's opening at its master's level |

- **The two act-break steps** are the scores' designed entries. The sound pass flagged them for an ear (sound.md §7.1).
- **The tag → outro step** is the outro master's first 100 ms at −14.8 dBFS (−15.8 after the −1 dB) over the tag's hum. The hum stops under that entry: the script's "the hum rings on into the outro" is met only in that nothing cuts to silence.

## 4. Watch these first

Kokoro timecode, then EL.

1. **The seams:**
   - cold open → intro: 0:30.67 / 0:30.04;
   - intro → card → Act One: 1:00.67 → 1:02.67 / 1:00.04 → 1:02.04. The card's typing, and whether the room under the intro's last 0.3 s reads;
   - the act breaks: 6:25.17 / 6:39.50 and 9:49.92 / 9:56.71, the +20 dB entries;
   - Act Three → Act Four: 11:57.96 / 12:02.04, just after the 23.04 dead stop (§5.2);
   - the tag → outro: 21:15.62 / 21:38.46.
2. **The Cancel click's silence:** 12:45.6–12:49.3 / 12:50.8–12:54.5. It holds 3.7 s on room tone at −49 LUFS. Does it read as the room holding its breath, or as a fault?
3. **The V.O. moments** (Mas's inner voice, typed above the band):

   | Line | Shot | Kokoro | EL | Text |
   |---|---|---|---|---|
   | v3-vo-01 | 5.02 | 1:06.83 | 1:06.21 | gerg wants to ship it. rima wants it quiet. alyi wants to know… (shares the screen with `NOV 30, 2022`) |
   | v3-vo-03 | 5.04 | 1:41.38 | 1:46.12 | she's right. it will break. i don't know which part yet. (EL: 6.6 s against Kokoro's 3.2) |
   | v3-vo-04 | v3-5.06b | 2:00.75 | 2:09.29 | alyi asks that about everything we build… |
   | v3-vo-06 | 6.01 | 2:54.67 | 3:06.58 | someone noticed. |
   | v3-vo-10 | 11.03 | 5:28.92 | 5:43.04 | mario used to sit where gerg sits… |
   | v3-vo-11 | 13.01 | 6:26.17 | 6:40.50 | four companies, one table… (shares the screen with the White House rail) |
   | v3-vo-12 / 13 | 13.09 / 13.11 | 7:15.79 / 7:22.29 | 7:28.46 / 7:34.96 | he's not wrong. · i'll turn when he finishes the sentence. |
   | e1-a3-18-04 | 18.06 | 10:08.33 | 10:15.04 | i made it for everyone else. |
   | v3-vo-15 | 20.06 | 10:59.88 | 11:05.46 | gerg types louder when he's happy… (over the loud keys) |
   | v3-vo-17 | S1.01 | 11:59.75 | 12:03.83 | the race is tomorrow. the board wants noon today. (shares the screen with the Vegas rail) |
   | v3-vo-18 | S1.06 | 12:31.04 | 12:35.12 | gerg's not on it. alyi set it up. probably just the budget. (the arrow's check of the icons) |
   | a5-26a-01 | S2.01 | 12:57.17 | 13:02.17 | i don't keep score. |
   | v3-vo-20 | S5.03 | 16:38.12 | 16:45.38 | four hundred and six… (the count) |
   | v3-vo-22 / 23 | S5.09-back | 17:39.42 / 17:46.04 | 17:50.04 / 17:57.08 | he's typing like it's launch night. · gerg never waits to be asked. (then the keys stop on the cut) |
   | v3-vo-24 | 32.03 | 20:51.00 | 21:14.00 | it looks calmer than me. |

   All 24 are in the transcripts.
4. **The intro at 0:39.9 / 0:39.3** (intro frames 221–224, the whip into the Woodrose): the flash reading (§5.1).
5. **In the EL film, the lip-sync:** the mouths are built from the takes' words and G2P phonemes, not from the voice's own phoneme timing. For example Rima at 5.04 (1:39–1:53), Alyi's reflection in S4.02, Tasya at S4.13 and S7.02.

## 5. What to fix, or decide

1. **The intro reads 4 flashes in one second, against a limit of 3.**
   - **Where:** intro frames 221–224, the whip smear from the 2014 WHY COMBINATOR throne into the Woodrose (film 0:39.88 / 0:39.25). I looked at frames 216–227: the frame's mean pixel value stays at 0.19–0.20 through the smear and then cuts to 0.11 on the Woodrose.
   - **What the tool is counting:** bright streaks moving across a dark ground, over at least 25 % of the 16 × 9 block grid, in alternating directions on consecutive frames.
   - **The same tool on the intro file alone** (not the re-encode) also gives 4 at frame 221. The intro's own audit reported "at most 2" (out/season/intro/reports/pic.md) with a different method.
   - **Whose call:** it's the final intro, so the intro owner's, and a certified analyser (PEAT or Harding) is the real test. If it has to go under 3: hold the smear's middle frames on 2s, or make it a straight cut. **The rest of both films is at most 2.**
2. **A digital-zero run inside Act Three**, at 23.04's act-out black: THE CLOCK's dead stop, 11:55.71 / 11:59.79. It's 160 ms in the mix (156 ms in EL), and 107 / 93 ms after AAC.
   - The sound pass marks the black as designed, but it's true digital zero, not room tone.
   - **For the sound pass:** a −60 dBFS room floor under those 160 ms would remove it without changing the stop.
3. **The act breaks' +20 dB entries** (Acts Two and Three) and **the outro's +20 dB entry over the tag's hum:** measured and designed, for an ear.
4. **The EL mouths** come from a pipeline built for Kokoro's phoneme-timed takes. They were only checked by the lock's checks and in stills, never watched.
5. **The V.O. over a date rail** (v3-vo-01, 11 and 17) is the lock's timing in both films. The stagger is the lock owner's call.
6. **The Kokoro pictures' own audio** (`picture/<seg>.mp4`) is still the shot passes' stick-mix temp track. The films don't use it. The EL pictures and the card carry their final mixes.

## 6. How to rebuild

From the repo root. `PY=audio/.venv-casting/bin/python`, `A=show/episodes/ep01/production/full-v3/assembly`, `S` = a scratch folder.

```sh
# the card (light; re-render only if shots.ts or timeline.json changes)
python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg card --timeline $A/card/timeline.json --no-takes \
    --mix out/ep01/full-v3/mix/card-mix.wav --mix-offset 0 --ep-in 1456 --label CARD --out-json $A/card/lock.json --out-ts $A/card/data.ts
cd studio && node src/episodes/ep01/pixel/tools/build.mjs --entry ../$A/card/render.ts $S/r-card.cjs && node $S/r-card.cjs check
X264_THREADS=1 SEGDIR=$S bash ../ops/heavy.sh node $S/r-card.cjs picture ../out/ep01/full-v3/picture/card.mp4 --jobs 1 && cd ..

# the EL pictures (after the EL timelines, the EL takes or any shots.ts change)
$PY $A/tools/el_takes.py                                   # assembly/el/<seg>-takes.json (mouth tracks; seconds)
bash $A/tools/el_lock.sh                                   # assembly/el/lock-<seg>.json + data-<seg>.ts (every check)
cd studio
for s in coldopen act1 act2 act3 act4 tag; do node ../$A/tools/build_el.mjs $s $S/r-$s-el.cjs && node $S/r-$s-el.cjs check; done
bash ../ops/heavy.sh node ../$A/tools/bundle_el.mjs $S/bundle-el          # the Remotion bundle on the EL locks (GLYPH)
for s in act3 act4; do BUNDLE=$S/bundle-el bash ../ops/heavy.sh node $S/r-$s-el.cjs glyphs $S/glyph-$s-el 2; done
for s in coldopen act1 act2 act3 act4 tag; do G=; [ -d $S/glyph-$s-el ] && G=$S/glyph-$s-el
  GLYPH_DIR=$G SEGDIR=$S X264_THREADS=1 bash ../ops/heavy.sh node $S/r-$s-el.cjs picture ../out/ep01/full-v3/picture-el/$s.mp4 --jobs 2; done
cd ..
#   (ALWAYS pass the picture-el/ output: an EL renderer's default output is the Kokoro picture's path)

# the films and their QA (about 3 min each to build, 2.5 min each to measure)
bash ops/heavy.sh $PY $A/tools/assemble.py kokoro          # -> out/ep01/full-v3/ep01-v3.mp4 + assembly/kokoro-assembly.json
bash ops/heavy.sh $PY $A/tools/assemble.py el              # -> ep01-v3-el.mp4
bash ops/heavy.sh $PY $A/tools/qa.py kokoro                # -> assembly/kokoro-qa.json, transcript.txt, the contact sheet
bash ops/heavy.sh $PY $A/tools/qa.py el
$PY $A/tools/seam_frames.py                                # -> assembly/seam-frames.json (the chapters' edge frames)
```

- **A new mix only:** re-run `assemble.py` and `qa.py`. The pictures don't change.
- **A re-timed EL lock:** re-run everything from `el_takes.py`. `el_lock.sh`'s `--ep-in` table is the EL episode's frames; update it if a segment's length changes.
- **`assemble.py --dry`** checks every length and prints the seams without encoding.

**Disk:**
- The films are 245 MB together, and the EL pictures 104 MB.
- Every intermediate was deleted: the 370 MB episode WAVs, the Remotion bundle, the GLYPH PNGs and the render chunks.
- 11 GB free at the end.
