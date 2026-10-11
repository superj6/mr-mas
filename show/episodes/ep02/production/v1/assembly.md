# Ep2 v1: the full episode film (`ep1.1_her.wav`, the final assembly, 2026-10-11)

> **Status: v1 FINAL ASSEMBLY, MEASURED (2026-10-11, after every act was final): ONE film, `out/ep02/v1/ep02-v1.mp4`, 23:31.00 (33,864 frames; the story 22:44.00, 32,736 frames),** carrying every fix since the last assembly (f89f33e): the final fix round (Act Four 0294e5c, the tag b54b847, Act Three eade31a), the lock owner's last fixes (f1666cf: V.O. 6, the garden's 19.17 cut, the tag's caption) and the three cleanup passes (09426eb Act Two; 01e2fb0 the cold open, the intro and Act One; 4c940d6 Act Three, Act Four and the tag). It has nine titled chapters, each starting on its lock's `ep_in_frames`. Every QA check passes: 0 decode errors, 0 A/V lag in every chapter, 0 codec bursts, **−15.81 LUFS, −1.11 dBTP on the encoded film** (no 10 s window over −1.0), at most 1 flash in any second, 0 red flashes. **Nothing was fixed:** the assembly needed no gain change, no de-click and no tool change.
>
> **Re-assembled once more the same day (05:15–05:27), after the last picture fix** (fixes-v1.md, "Last picture fix: the Forecaster at the rail"). In Act Three's sc 17 the Forecaster sat in the air in front of the bridge's rail. He now sits on the walkway at the rail's foot (17.14 and 17.15 until he stands, film 16:38:05–16:48:12). The new film's picture differs from the first build only there; its sound is byte-identical (all 66,143 AAC packets); the duration, chapters, decode, loudness, true peak, seams, edge frames and transcript are the same. **New md5 `2a6affb88c14f25ff3735935639bc15a`** (§1, §3).
>
> **Nothing here was watched in real time or listened to [R8].** Every number is measured from the files [M]. I looked at stills only [J]: 82 frames at 1080p decoded from this film, at least one per scene and every changed shot (§5). §7 lists what a human must check.

**Contents:** [1. The film](#1-the-film) · [2. Chapters](#2-chapters) · [3. How it was built](#3-how-it-was-built) · [4. QA](#4-qa-measured) · [5. Looked at](#5-looked-at-j) · [6. The other passes' notes](#6-the-other-passes-notes-and-what-the-assembly-did) · [7. For a human](#7-for-a-human) · [8. Open issues and asks](#8-open-issues-and-asks) · [9. How to rebuild](#9-how-to-rebuild) · [10. Files](#10-files) · [11. LEARNINGS rules checked](#11-learnings-rules-checked)

## 1. The film

- **File:** `out/ep02/v1/ep02-v1.mp4` (git-ignored). **23:31.00** (33,864 frames at 24 fps), 136,523,617 bytes, md5 `2a6affb88c14f25ff3735935639bc15a` (re-assembled after the last picture fix, 2026-10-11 05:15). (This assembly's first build, fb0efde, was 136,520,076 bytes, md5 `7b16e457842649420bd81b73b7c79866`, the same film but for the Forecaster's pose in 17.14–17.15. The 2026-10-10 film was 23:41.00, 34,104 frames, md5 `580764171286…`; the first assembly, e2bce00, `39d06afa6c4d…`.)
- **Video:** H.264 High, CRF 18, `-tune animation`, 1920 × 1080, 24 fps, with a keyframe on every chapter's first frame.
- **Audio:** AAC-LC 256 kb/s, 48 kHz stereo, encoded with **libfdk_aac** (`assemble.py`'s `AAC`; the film's metadata is stripped by `-map_metadata -1`, so the file carries no encoder tag).
- **Chapters:** nine titled chapters, each matching the assembly to the millisecond (§2).
- **The lock:** the EL-timed v1 lock (`show/reel/ep02-v1-el/`) and its pixel locks (`production/v1/lock/<seg>.json`): every chapter starts on its lock's `meta.ep_in_frames` (0, 2088, 10824, 17520, 25200, 32616) and on lock-v1.md's episode clock.
- **Voices:** the ElevenLabs cast (set A), with MARIO on his Kokoro takes.
- **The chapters' sources** (each one's length, head md5 and mtime are in `assembly/v1-assembly.json`):
  - **The picture:** each segment's per-scene concat, as the fixers left it: the cold open (2026-10-09, cached since), the card (10-10), Act One 03:45, Act Two 03:41, Act Three 05:12 (the last picture fix: sc 17 re-rendered, 13–15 cached), Act Four 03:56, the tag 02:48 (2026-10-11). Every scene is current: `scenekeys` on each segment's renderer, built from today's code, reports every scene cached as the index, except sc 11 and sc 15, which differ only in the `glyph` part (a key built without GLYPH frames; their renders splice them in, as in every earlier assembly).
  - **The sound:** the mixes from `mix_episode.py` (the cold open 03:27 with the cleanup pass's lighter note 4; Act One 10-10 21:07 with its +1.0 LU trim, `seg_trim_lu`; Act Two 01:55, Act Three 01:56, Act Four 02:30, the tag and `outro-mix.wav` 02:56; the card 10-10).
  - **The intro:** the Ep2 picture variant as the cleanup pass re-rendered it (`out/ep02/v1/intro/intro-ep2-V1-1080p.mp4`, 03:38: the idle pointer hidden while he types and resting on Post in the bookend; Alyi's card `EFFIGIES: 1`) under Ep1's aired master and line (`audio/intro/ep02/intro-ep2-mix-V1-chipchamber.wav`, a byte copy of Ep1's), at the manifest's −3 dB. **The typed quote is Ep1's exactly** ("near the singularity;" / "unclear which side."), checked on the film's f1403 and f1430 (§5).
  - **The card:** `out/ep02/v1/picture/card.mp4` (48 f).
  - **The outro:** outro B as the outro's fixes pass left it (a05d9d2): 15.0 s, page 1 the credits and `viewer: human ✓`, page 2 the voice cast alone. It plays `outro-mix.wav` at −1 dB.
- **Records** (in `production/v1/assembly/`):
  - `v1-assembly.json`: every input, its length, its head md5 and the seams;
  - `v1-qa.json`;
  - `seam-frames-v1.json`;
  - the transcript, [assembly/transcript-film.txt](assembly/transcript-film.txt) (175 lines and 215 on-screen texts, on the film's clock);
  - the contact sheet, `out/ep02/v1/ep02-v1-sheet.png` (142 frames, one every 10 s with the episode timecode and the chapter; committed, as Ep1's are).

## 2. Chapters

| # | Chapter | Start · length | Frames |
|---|---|---|---|
| 1 | Cold open | 0:00.00 · 55.00 | 1,320 |
| 2 | Intro | 0:55.00 · 30.00 | 720 |
| 3 | ep1.1_her.wav | 1:25.00 · 2.00 | 48 |
| 4 | Act One · the séance | 1:27.00 · 6:04.00 | 8,736 |
| 5 | Act Two · stage right | 7:31.00 · 4:39.00 | 6,696 |
| 6 | Act Three · leave them up | 12:10.00 · 5:20.00 | 7,680 |
| 7 | Act Four · as a guest | 17:30.00 · 5:09.00 | 7,416 |
| 8 | Tag · august | 22:39.00 · 37.00 | 888 |
| 9 | Outro · credits | 23:16.00 · 15.00 | 360 |
| | **End** | **23:31.00** | **33,864** |

**The final chapter list, as YouTube timestamps** (paste into the description). YouTube needs every chapter to be 10 s or longer, so the 2 s card rides with the intro (32 s), as in Ep1. Every other chapter is 15 s or more, and every start falls on a whole second.

```
00:00 Cold open
00:55 Intro
01:27 Act One · the séance
07:31 Act Two · stage right
12:10 Act Three · leave them up
17:30 Act Four · as a guest
22:39 Tag · august
23:16 Outro · credits
```

The titles are the episode's act subtitles as the film's chapter metadata carries them (`assemble.py` TITLES; Act Two has been "stage right" since D-97, was "her"), already checked for spoilers ([proposal.md](proposal.md#marketing-pre-check-m1), D-16, D-45, D-97; LEARNINGS M1). None names Alyi's departure, the white room or a turn's outcome. Against the 2026-10-10 film, only Act Four (−10 s, the 19.17 cut) and so the tag and the outro (10 s earlier) moved.

## 3. How it was built

**The final assembly (this pass, 2026-10-11 04:07–04:26),** after every act was final (the last fixer's commit, 4c940d6, at 04:05). Every heavy step went through `ops/heavy.sh`, one at a time; free memory was 22 GB, so the default 8 GB scope was kept.

1. **The dry run [M]:** `ops/rebuild-act.sh --ep 2 tag --only film --dry-run`: `assemble.py v1`, 27 inputs, 0 missing. Then `assemble.py v1 --dry`: every chapter's sound is exactly its picture's length (the tool refuses to pad or trim), 33,864 frames, sample peak −1.50 dBFS, the longest digital-zero run 0.25 ms.
2. **The pictures were checked current [M]:** each segment's renderer built (`build.mjs`) and `scenekeys` run on the cold open, the card, Acts One to Four and the tag (§1).
3. **The film:** `assemble.py v1` (400.4 s). The picture is decoded and concatenated frame for frame, then encoded once; the sound is built sample-exact in numpy, the intro at −3 dB, the outro at −1 dB, the card's room led in under the intro's last 0.3 s.
   - **No seam needed a de-click [M].** The two joins with a separately mastered side (the intro, the outro) jump 0.00089 and 0.00034 in the PCM, under the tool's 0.01 threshold. The story joins are sample-continuous out of the mixer, which renders each act's head from the act before it; Act Four → tag's 0.01089 is that continuous signal's own step (§4).
4. **Measured:** `qa.py v1` (251.7 s: the transcript, a full decode, the streams and chapters, the audio against every source, the flash check streamed at 160 × 90, the contact sheet) and `seam_frames.py v1`. Both ran detached (`setsid -w … < /dev/null`, §9).
5. **Cross-checks beyond `qa.py` [M]:** a second loudness and true-peak meter (the bundled ffmpeg's `loudnorm` analysis) on the whole film, Act Three and the tag; a 10 s-window true peak (4×) over the decoded film; every join's sample step against its own signal's steps (§4).
6. **Ep1 [M]:** `sha1sum -c ops/reorg/ep01-final.sha1`: **31 OK**; `git status` shows no change under any Ep1 path. This pass changed no code.

**Nothing was fixed.** The encoded film's true peak is under −1.0 dBTP everywhere, every seam is continuous or designed, every still is clean. **No act's picture, lock, takes, score or mix was touched.**

**The re-assembly after the last picture fix (2026-10-11 05:15–05:27) [M].** Act Three's picture was re-made (sc 17 re-rendered; 13, 14 and 15 from the cache under their keys; the act concatenated without re-encoding; fixes-v1.md), then the film once more with `ops/rebuild-act.sh --ep 2 act3 --only film` (its dry run: 27 inputs, 0 missing), through `ops/heavy.sh` with `MRMAS_HEAVY_MEM_MAX=6G` (free memory was 3–4 GB): `assemble.py v1` (411.3 s), `qa.py v1` (279.5 s), `seam_frames.py v1`. Against the first build, kept in scratch:
- **The sound:** all 66,143 AAC packets byte-identical (bytes and timestamps), so every loudness, true-peak, codec, A/V and seam number is the same. `qa.py` measures them unchanged: −15.81 LUFS, −1.11 dBTP, 0 bursts, 0 lag; the seams' steps and jumps as §4.
- **The picture:** every frame was decoded from both films, area-averaged to the native 480 × 270 and compared. Above encoder noise (any channel off by more than 24 levels) they differ at **exactly 248 frames, film f23957–24204** (Act Three f6437–6684, 17.14 and 17.15 until he stands), all inside native (364, 51)–(395, 114), the far walkway's right end. The 18 frames before and the 40 after move by encoder noise only (at most 15 levels; the encoder's references). **The other 33,558 frames decode identically.** `seam-frames-v1.json` is byte-identical: every chapter's edge frames as before.
- **`transcript-film.txt` is byte-identical.** `v1-assembly.json` changes only its build time, encode time, Act Three's head md5 and the byte count; `v1-qa.json` its times, the byte count and bit rates, and the flash count's transitions (§4).
- **The contact sheet:** one tile changed (16:40:00, the night wide, the Forecaster now sat on the walkway). The tile after it (16:50:00) moved by encoder noise only.

**No hum hold at the tag → outro seam [J]** (the first assembly's decision, kept): Ep2's tag ends on Mas's face, and the cut to the outro's black is the downbeat (proposal seam 30; shots-tag.md 23.09; E02-13's cue sheet: "every voice stops dead … no ring-out"). The tag's room still carries across: `outro-mix.wav` lays the tag-tail stem under the outro's first 2 s. The seam measures +0.1 dB, with a sample jump of 0.0003.

## 4. QA (measured)

| Check | ep02-v1, the final assembly (2026-10-11; the same after the re-assembly at 05:15 unless noted) |
|---|---|
| **Duration** | **23:31.00**: video 33,864 frames = 1411.000 s (expected 23:31.00 ✓); the story 22:44.00 (32,736 f: the cold open, the four acts and the tag; 1,320 + 8,736 + 6,696 + 7,680 + 7,416 + 888) ✓ |
| **Chapter starts against the locks** | all nine match the assembly (`chapters_match_assembly`); the six story chapters start on their pixel locks' `ep_in_frames` and on lock-v1.md's episode clock (00:00:00, 01:27:00, 07:31:00, 12:10:00, 17:30:00, 22:39:00) |
| **Full decode** | **0 error lines**, exit 0, 33,864 frames decoded (36.9 s; the re-assembly 36.5 s) |
| **Streams** | video H.264 High 1920 × 1080 24/1, 33,864 packets, 1411.000 s · audio AAC-LC (libfdk_aac) 48 kHz stereo 256 kb/s, 66,143 packets, stream 1411.000 s; decoded 67,728,384 samples = 1411.008 s, **+8.0 ms** against the picture (the AAC tail; 10-10: +13.33, Ep1 +5.33) |
| **A/V lag per chapter** | **0 samples in all nine** (correlation 0.9997–1.0) |
| **Codec fidelity** (decoded against source, sample for sample) | **0 bursts in every chapter** (a burst is a run more than 0.2 of full scale off the source). Worst difference 0.129, in Act One (Ep1: 0.144) |
| **Integrated loudness** | **−15.81 LUFS** (`loudnorm`: −15.81), inside −16 ± 0.5. Act One's mix carries the mixer's +1.0 LU trim (`seg_trim_lu`); the story chapters otherwise sit at −16.0 |
| **True peak, the encoded film** (4× oversampled) | **−1.11 dBTP** (Act Three; `loudnorm`: −1.12), sample peak −1.47 dBFS. **All 142 ten-second windows ≤ −1.11 dBTP; 0 over −1.0.** The hottest: −1.11 (12:30–12:40), −1.21 (13:10–13:20), then −1.46 (the tag at 22:50, Act One at 6:40, Act Two at 10:30) and −1.47 (Act Four at 17:30) |
| Chapters (LUFS-I) | cold open −16.02 · intro −17.02 (Ep1's aired master) · card −21.18 · Act One −15.02 · Two −16.03 · Three −16.06 · Four −16.02 · tag −16.02 · outro −17.76 |
| Chapters (true peak, dBTP, encoded) | −1.87 · −4.25 · −8.25 · −1.46 · −1.46 · **−1.11** · −1.47 · −1.46 · −4.13 |
| **The codec against the mixes** (true peak, mix QA → encoded) | cold open −1.82 → −1.87 · card −8.23 → −8.25 · Act One −1.37 → −1.46 · Two −1.45 → −1.46 · **Three −1.11 → −1.11** · Four −1.47 → −1.47 · **tag −1.45 → −1.46**. libfdk_aac at 256 kb/s raised no chapter's true peak (the feared ~0.3 dB did not occur), so no gain fix was needed |
| Max short-term | −11.6 LUFS (Act Three) |
| Digital zero over 5 ms / holes (under −60 dBFS for 0.3 s or more) | **none / none** |
| **Flashes** (the whole film, streamed, 160 × 90) | **max 1 in any second** (the intro at 0:59.92, Act Three at 13:27.54), no 1 s window with 2 or more; **red 0**; 96 transitions (**97** after the re-assembly: the 17.14 → 17.15 cut from the night to the afternoon, f24005 at 16:40.21, now counts as one brightening transition at 160 × 90, because the sitting Forecaster covers fewer of the dark wide's blocks; a single step, no flash pair; Act Three's own flash check at native scale counts sc 17's transitions unchanged, 8 and 8). **Pass** (limit 3) |
| Largest mean-luminance step | 0.653 at 1:00.00: the intro's own cut at f120, the value Ep1 aired at its intro's f120 |
| Edge frames (`seam_frames.py`) | every chapter's first and last frame against its source: at most 0.15 of 255 (the cold open's first) |

**Seams** (on the decoded film; `qa.py`'s 200 ms RMS either side, and the sample step across the join):

| Join | At | Step (200 ms RMS) | Sample jump | |
|---|---|---|---|---|
| cold open → intro | 0:55.00 | **−11.6 dB** (−19.2 → −30.8 dBFS) | 0.0005 | the knee's note 4, 3 dB lighter since the cleanup pass, into the intro's quiet open; **Ep1's size** (Ep1 aired −11.3 / −11.7; the 10-10 film −14.8) |
| intro → card | 1:25.00 | +0.6 | 0.0 | the card's room led in |
| card → Act One | 1:27.00 | +0.8 | 0.0056 | continuous (the séance's pre-lap under the card) |
| Act One → Two | 7:31.00 | +12.7 | 0.0012 | the act-out black against the Water Line's act-in hit, already softened 7 dB (sound-v1.md §7) |
| Act Two → Three | 12:10.00 | −3.0 | 0.0028 | the midpoint's designed stop, then THE CLOCK |
| Act Three → Four | 17:30.00 | −3.2 | 0.0052 | the DREAD ringing into the black, then the quartet's pre-lap and the beacon (10-10: 0.0126; the act3 mix re-run since) |
| **Act Four → tag** | **22:39.00** | +0.2 | **0.0110** | continuous; **for an ear** (§7) |
| tag → outro | 23:16.00 | +0.1 | 0.0003 | the cut on the downbeat; the tag's room under the outro's first 2 s |

- **The steps match the mix's own seam measurements** (`audio/reel/ep02-v1/mix-qa/el/loudness-report.json`, 03:28) to 0.1 dB: +0.8, +12.8, −3.0, −3.2, +0.2; so the assembly adds nothing at the seams.
- **Act Four → tag, the flagged 0.0109 [M]:** on the decoded film the step across the join is 0.0110. In the 10 ms either side the signal's own steps reach 0.0342 (p99 0.0247), and over ±0.5 s 26% of its sample steps are larger than the join's. The second difference at the join (a click's signature) is 0.0047, under its ±50 ms neighbourhood's p99 of 0.0083. It is a continuous signal, not a click; the mixer renders the tag's head from Act Four's tail. Whether it sounds clean is for an ear.
- **Picture continuity:** `seam_frames.py` puts every chapter's first and last frame within 0.15 of 255 of its source, and I looked at every join's two frames (§5).

## 5. Looked at [J]

82 frames at 1920 × 1080, decoded from this film (seek to the whole second before, then count frames, as `seam_frames.py` does), viewed as 2 × 2 sheets and the text-critical ones at full size. **No blocker:** no broken or black frame where picture should be, no wrong or missing shot, no stray artifact, no text cut off, nothing against the FIRM guardrails.

- **One or more per scene:**
  - the cold open f660, 1105, 1319;
  - Act One sc 4 f4400 (and 4.01 f2088, 4.04 f2563/2588), 4A f7116, 4B f7648/7688, sc 6 f8700, sc 7 f10071, 10105, 10311, 10823;
  - Act Two sc 8 f10824, 11232, 11328; sc 9 f12734, 13074; sc 10 f13728, 14166; sc 11 f14724, 14809, 14914, 14934, 15420; sc 12 f16823, 16924, 16999, 17084, 17137, 17519;
  - Act Three sc 13 f17520, 17940; sc 14 f18620, 18665, 18770, 19008; sc 15 f19730, 19800, 20904; sc 17 f23676, 25199;
  - Act Four sc 18 f25200, 26352, 26770; sc 19 f28980, 29786, 30068, 30069; sc 20 f31080, 31130, 31166, 31204; sc 22 f32000, 32160, 32390, 32615;
  - the tag sc 23 f32616, 33060, 33256, 33347, 33406, 33436, 33451, 33503.
- **The changed shots:** 4.04 (`RE: NOLE · 2016` / `"YUP"` beside Alyi's email), 4B.01 (the V.O. in the wood margin, clear of the card), 7.03–7.04 (Tasya's clasped hands on forearms, the ring hand), 8.03 (the V.O. on the shadowed shoulder), 9.04b ("everyone gets it free." typed whole), 9.06 (the panel with no `SINCE SEP 2023`), 10.07 (`MAY 13` inside the border), 11.04's three cuts (the wide, the screen close on the gush, the engineer's single on "Thanks.", the wide again), 12.03 (Alyi's open eyes, the banner's words out of focus; checked at full size), 12.05 (`TOP STORIES`: `OMNI` first, `ELGOOG'S KEYNOTE` second), 12.06 (the standard phone hand), 14.03–14.04 (the thumb on its diagonal, `> lunch?` clear), 15.02 (Alyi's post under the `thread` bar), 18.11 (`MARIO` / `EX-NOPEAI` plated over the split, no `212` on any lanyard; full size), 19.15 (the phone held from behind, the lawn post whole), the garden's cut (f30068 `GUEST` walked in → f30069 Mas outside the hedge), 20.07 (the wide, his shoe on Haras's tape, `SEP` written beside `UPSIDE`), 22.02 and 22.07 (the re-toned ISS plate), 23.06 (the whole lower third on one row, "perfectly on AI" included), 23.07–23.08 (the low flat pump; the balloon's string taut out of the top of frame; nobody behind the podium; no raised arm, no fist).
- **The intro:** f1320 (its first frame), f1360 (typing, no pointer), f1403 (the quote typed: "near the singularity;" / "unclear which side.", Ep1's exactly), f1430 (the pointer on Post), f1645 and f1650 (Alyi's card: `ALYI` / `FEELS THE AGI.` / `EFFIGIES: 1`), f2032 (the bookend, the pointer resting on Post, `verified: human`), f2039.
- **The card:** f2040 (the cursor alone, at the name's left edge), f2045 (`ep` and the cursor), f2087 (the full name).
- **The outro:** f33504 (black and the Orb), f33624 (page 1: `mr. mas · ep1.1_her.wav`, `art · script · music · voices · edit: opus 5.5`, `prompt: jgon`, `viewer: human ✓`), f33754 (page 2: `voices · role: library voice` and the cast in two columns, no tools), f33863 (black).
- **Every join's two frames:** 1319/1320, 2039/2040, 2087/2088, 10823/10824, 17519/17520, 25199/25200, 32615/32616, 33503/33504: the cold open's door → the intro's dark room; the intro's toast → the card; the card → the séance wide; Act One's black → Mas's back at the monitor; Act Two's Mas at the window → the lobby (`176`); Act Three's black → the lighthouse; Act Four's white room → the tag's desk (`GUEST` on the wall); the tag's last frame (Mas's face) → the outro's black.
- **The contact sheet** (all 142 frames): every chapter in order; the only black tile is 7:30:00, Act One's designed act-out.
- **The re-assembly (the last picture fix):** film f23957, 23981, 24004 (the night wide), 24005, 24120 (asleep in the afternoon, beside the post), 24193, 24204 (his head up) and 24205 (standing where he sat) at 1080p, with 8x-native crops, and the new sheet's 16:40:00 tile. He sits on the far walkway at the rail's foot, on its road side, knees up, head bowed, nothing of him on or over the rail. No blocker.
- **The frame:** every story chapter is drawn on the house frame, its lower band the dark V.O. and rail band (the cold open's f660 against its own source: 0.15 of 255), not black left by the assembly.
- **Taste, not blockers (no action):** none new. The fixers' own human checks stand (§7).

## 6. The other passes' notes, and what the assembly did

| Note | Done |
|---|---|
| Lock owner (f1666cf): "The assembly (after the cleanup pass): `assemble.py v1`, `qa.py v1` and `seam_frames.py v1`. The ear should check the act4 → tag join at 22:39:00 (sample jump 0.0109)" | **Done** (§3). The join measures 0.0110 on the decoded film, a continuous signal by every measure (§4); it stays on the ear list (§7) |
| Cleanup, the cold open / intro / Act One (01e2fb0): "the orchestrator re-assembles once after the three cleanup fixers land"; the seam −11.62 dB on a test join; the intro re-rendered; its quote unchanged | **Done.** The film measures **−11.6 dB** at 0:55.00 (sample jump 0.0005). The re-rendered intro is in the film (its head md5 `5d63ab82e053` → `7664efe9785a`, the 03:38 file), and the quote reads Ep1's on the film (§5) |
| Cleanup, Act Two (09426eb) and Act Three / Four / tag (4c940d6): "The film is not re-assembled here" | **Done.** Every changed shot looked at in the film (§5); the transcript carries `SEP` (21:39:10) and `MARIO · EX-NOPEAI` (18:34:03), and no `212` and no `SINCE SEP 2023` |
| The transcript: V.O. 6 now "everyone gets it free."; the tag's caption "…perfectly on AI…"; 20.07's `SEP`; 18.11's plate | **All in `transcript-film.txt`**, which agrees with the lock's `transcript-v1.txt` row for row (394 rows, every timecode and text the same; the only differences are `lock_report.py`'s delivery tags, such as `(call)` and `(ghost)`, and the intro row's wording). Every line once, in time order: 175 lines (the two repeated texts, Nole's "Yup" and Mas's "no.", are distinct script lines, at their own times in both files) |
| The act contact sheets and the scene caches; 22.07's plate squared in Blender | Not the assembly's (the picture passes'); untouched |
| The intro master at `audio/intro/ep02/intro-ep2-mix-V1-chipchamber.wav` | Used from there, at −3 dB, as the manifest says |
| The last picture fix (Act Three sc 17, the Forecaster at the rail): re-assemble once | **Done** (§3): the picture differs only at 17.14–17.15 and the sound is byte-identical; new md5 `2a6affb8…` |

## 7. For a human

Nobody has watched or listened. In order, with the final film's timecodes (MM:SS:FF):

1. **Watch the whole film once at speed.** No measurement covers whether it plays as a story.
2. **The seams by ear:**
   - cold open → intro at 00:55:00 (−11.6 dB, Ep1's size since note 4 is 3 dB lighter): does the smash still land as a cut, not a fade?
   - Act One → Two at 07:31:00 (+12.7 dB, the Water Line's hit);
   - Act Two → Three at 12:10:00 (−3.0 dB: the midpoint's stop, then THE CLOCK);
   - Act Three → Four at 17:30:00 (−3.2 dB);
   - **Act Four → tag at 22:39:00** (+0.2 dB; the 0.0110 step measured continuous, no de-click laid): is it clean?
   - tag → outro at 23:16:00 (the cut on the downbeat, no hold). If it wants air, the fix is the lock's (a beat of black at the tag's end), not a held frame.
3. **The intro:** the pointer hidden while he types (00:55:23–00:59:09), shown as his hand takes the mouse (00:59:10) and resting on Post in the bookend (01:24:09–01:24:22): does it read at speed? Alyi's card `EFFIGIES: 1` (01:07:15–01:09:03): a joke with no hint about his leaving? Is the ESC keycap legible (01:04:16–01:05:13)?
4. **The fixers' checks, at the film's times:**
   - 4.04 (01:44:12–01:49:01): does `RE: NOLE · 2016` make the rising ghost Nole's at a glance?
   - 4B.01 (05:13:00–05:21:23): the V.O. in three rows in the wood margin, his thought and not a caption?
   - 7.02–7.06 (06:49:06–07:20:07): Tasya's clasped hands and the ring hand at speed.
   - 8.03 (07:43:00–07:50:11): the shoulder's rim fading toward the frame's foot, invisible or a step?
   - 9.04b (08:46:14–08:51:22): the 2.2 s look, then "everyone gets it free." (08:48:18): a decision already made, not a slogan?
   - 11.04 (10:11:15–10:24:21): wide, the screen on the gush, the one-second single on "Thanks." (10:21:04), the wide on the laugh.
   - 12.03 (11:39:06–11:42:15): Alyi's open eyes warm; the out-of-focus banner a party banner, not censorship. Does anything in sc 12 still offer a reason he left (W8)?
   - 12.05–12.06 (11:43:16–11:56:05): `NOPEAI · TRENDING` read beside `OMNI`; the thumb rising with the post.
   - 14.03–14.04 (12:52:19–13:03:01) and 19.15 (20:39:07–20:42:20): the hands at speed.
   - **The Forecaster at the rail** (the last picture fix): 17.14's night wide (16:38:05–16:40:04) and 17.15 until he stands (16:40:05–16:48:12). Does he read as a man asleep on the walkway against the rail (knees up, head bowed)? Does his head coming up at 16:48:01, half a second before he stands at 16:48:13, read as waking?
   - 18.11 (18:33:23–18:42:07): `MARIO · EX-NOPEAI` read in its 2.4 s, enough with the `SAFETY` lamp to place the lighthouse?
   - The garden (19.16 → 19.18 at 20:52:21): does "as a guest." (20:58:09) land without the flower beds; arrival, turn and aftermath, not a detour?
   - 20.07 (21:35:22–21:40:18): his shoe stopping Haras's tape and `SEP` (21:39:10, 1.4 s): one plan made an action, not a gag?
   - 22.01–22.08 (22:01:00–22:34:04): the re-toned ISS plate in the 3D, or pasted? 22.07's still narrows with the wall (a Blender pass, before lock?).
   - The tag's lower third (23:01:21–23:07:11): read in its 4.15 s, and does "perfectly on AI" make the danger the fakes? Is 23.07's quicker pumping (23:07:12–23:12:09) clear before the hook?
5. **The outro:** does the vocal pad's flat line (from 23:18:12) stopping before the leap (23:19:18) read as the paused voice? Is the cast page's 5.5 s (23:23:18 to the cut at 23:30:09) enough as a page to pause on?
6. **The sound pass's ear list** (sound-v1.md §9), at the final film's times:
   - the synthesized crowds: the demo house's laughs in sc 11 (09:55:00–11:29:23); the lobby's cheer and the stream's roar in sc 19 (19:06:00–21:08:23); the party chant (Alyi's lead 14:11:08, the room 14:13:00), with the motive flashback's room dip and score ride under it;
   - the ENGINEER's laugh under Gerg's "Careful. The new one can hear you laugh." (08:30:20);
   - Alyi's far "Six years and eleven months." (13:45:21);
   - Rima's "and that's the demo." (10:58:15);
   - **the crosscut call** (19.09–19.10, 19:59:01–20:20:17; its lines from 20:00:23): does it read as a phone call, and is Gerg's "You ever miss being up there?" (20:14:20) heard over the cheering lobby?
7. **The true peak** is −1.11 dBTP (Act Three, unchanged by the codec), inside −1.0 with 0.11 dB to spare (Ep1: −1.29). A platform's re-encode can add a little. If the release wants more headroom, it comes from Act Three's limiter, not from the assembly.

## 8. Open issues and asks

1. **For the lock pass (a record only; the film reads every length from the files):** the EL manifest `show/reel/ep02-v1-el/ep02-v1-el.manifest.json` still says the outro's `dur` is 10.125 (the base manifest says 15.0); the film's outro is 15.000 s.
2. **For the release pass** (`production/v1/release.md`, not yet written; LEARNINGS M3–M5): the description carries the chapters (§2), the Salamander Grand Piano attribution (CC BY 3.0; Act Three's score), the credit, "library voices, none cloned", and the tools by name (Claude Code; Remotion; Blender; FFmpeg; ElevenLabs and Kokoro-82M, the library voices; Veo 3.1 Fast via Runway, the cold open's mammoth insert, no person, face or hand). **For the showrunner:** the outro's voice-cast page (held 5.5 s) is the titles pass's addition; keep it, or move the cast to the description too.
3. **For the sound pass (a record only):** sound-v1.md §7's seam table and its "Reading the seams" paragraph predate the fixes passes (Act Two → Three +7.3, Act Three → Four −2.5, cold open → intro −14.8). The mix QA and this film measure −3.0, −3.2 and −11.6.
4. **Untracked render by-products, not this pass's:** `out/ep02/v1/picture/<seg>.mp4.render.json` and `<seg>.srt` and the scene cache `out/ep02/v1/scenes/` are untracked and not ignored. Whether they belong in `.gitignore` is for the pipeline's owner.
5. **Resource asks (R16, non-blocking):** human viewers and listeners for §7 (the one thing no pass here can supply); a recorded crowd library, if the synthesized crowds read thin (sound-v1.md §13).

## 9. How to rebuild

From the repo root. `PY=audio/.venv-casting/bin/python`, `A=show/episodes/ep02/production/v1/assembly`, `S` = your scratch folder. Every heavy step goes through `ops/heavy.sh`, one at a time.

```sh
SCRATCH=$S ops/rebuild-act.sh --ep 2 tag --only film --dry-run       # every input assemble.py reads (27), 0 missing
ASM_SCRATCH=$S bash ops/heavy.sh $PY $A/tools/assemble.py v1 --dry    # every length, every seam, no encode
ASM_SCRATCH=$S setsid -w bash ops/heavy.sh $PY $A/tools/assemble.py v1 < /dev/null   # -> out/ep02/v1/ep02-v1.mp4 (about 7 min)
ASM_SCRATCH=$S setsid -w bash ops/heavy.sh $PY $A/tools/qa.py v1 < /dev/null         # -> v1-qa.json, transcript-film.txt, the sheet (about 4 min)
setsid -w bash ops/heavy.sh $PY $A/tools/seam_frames.py v1 < /dev/null               # -> seam-frames-v1.json
# or, after a changed act: ops/rebuild-act.sh --ep 2 <act> --only film
# the pictures current: (cd studio && node src/episodes/ep02/pixel/tools/build.mjs <seg> $S/r-<seg>.cjs && node $S/r-<seg>.cjs scenekeys)
# a second meter: ffmpeg -i out/ep02/v1/ep02-v1.mp4 -map 0:a -af loudnorm=print_format=json -f null -   (input_i, input_tp)
```

- **Gotcha:** run as a background job, `heavy.sh`'s memory-capped scope stopped at once (exit 147) until it was detached from the terminal (`setsid … < /dev/null`). Use `setsid -w`: plain `setsid` forks when the caller leads its process group and returns at once, so a following step would start before the first is done.
- **Stills from the film:** the bundled ffmpeg has no `select` filter and no `rawvideo` muxer. Seek to the whole second before the frame (`-ss <s> -frames:v <n>`, `-f image2pipe -c:v rawvideo`) and take the last frame, as `seam_frames.py` does.

## 10. Files

- **This pass (the final assembly):**
  - changed: this file; `assembly/v1-assembly.json`, `assembly/v1-qa.json`, `assembly/seam-frames-v1.json`, `assembly/transcript-film.txt`; `out/ep02/v1/ep02-v1-sheet.png`; [pipeline.md](pipeline.md) §7.1 (the film's length and Act Two's title); fixes-v1.md (its final-assembly section);
  - generated, not committed: `out/ep02/v1/ep02-v1.mp4` (git-ignored).
- **The re-assembly after the last picture fix:** changed this file, `assembly/v1-assembly.json`, `assembly/v1-qa.json` and `out/ep02/v1/ep02-v1-sheet.png`; `seam-frames-v1.json` and `transcript-film.txt` were rewritten byte-identical. The picture change itself is Act Three's (fixes-v1.md).
- **Untouched:** every Ep1 path (`sha1sum -c ops/reorg/ep01-final.sha1`: 31 OK); all code (the assembly tools included); the locks, manifests, pictures, takes, score and mixes; `out/season/intro/` and `audio/intro/mix/`.
- **Earlier passes:** the first assembly (e2bce00) wrote this file, the records and the sheet, and changed `assemble.py` (v1's transcript is `transcript-film.txt`; `hum_gap=None`), `qa.py` (the outro's two rows from its `timeline.ts`) and `scene_cut.py` (the repo root 7 folders up); it rendered the card. The 2026-10-10 final assembly (f89f33e) rebuilt that film byte for byte.

## 11. LEARNINGS rules checked

- **S8** [M]: measured on the decoded film: −15.81 LUFS and −1.11 dBTP (a second meter agrees: −15.81, −1.12); 0 decode errors and 0 A/V lag; 0 codec bursts with libfdk_aac.
- **P15** [M]: at most 1 flash in any second over the whole film, 0 red.
- **P16** [M, J]: the frame around the acts: the cold open hands off to the Ep2 intro; the card is the filename alone, 2 s; the outro is B, with `art · script · music · voices · edit: opus 5.5` / `prompt: jgon`, and no disclaimer, terms line or pointer.
- **P1** [M]: 1080p.
- **P5** [J]: the stills of §5.
- **M1** [J]: the chapter titles are spoiler-free (§2).
- **M4** [M]: the chapters are at least 10 s, with the card folded into the intro.
- **R1** [M]: no Ep1 path or shared file touched; Ep1's final sha1 is unchanged (31 OK).
- **R8**: every claim is tagged, and §7 lists what a human must check.
- **R10**: every heavy job went through `ops/heavy.sh`, one at a time; the flash check is streamed.
- **R11**: keyscan before the commit and the push.
- **R13**: this note.
- **R14**: scratch only in this session's scratchpad.
- **Broken on purpose:** none.
- **Changed from the pipeline's plan:** the hum hold (§3, with its reason; since the first assembly).
