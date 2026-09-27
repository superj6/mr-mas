# Ep1 v3: the full episode films (`v3-assemble`, track F, 2026-09-27)

> **Status: BUILT AND MEASURED, both films.** Track F of [PLAN.md](PLAN.md), under the showrunner's "i want you to just do a full episode attempt with your best judgement… i liked the orb outro… we can also try a pass using elevenlabs samples".
>
> **Nothing here was watched or heard.** Every number below is measured from the files. I looked at stills: the card's frames, both contact sheets, Kokoro-against-EL stills of six moments, and ten frames of the intro around its flash reading. Whether any cut, seam or line plays needs a person. Nothing was committed.

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
| 2 | Intro | `out/intro/intro-ep1-V1-1080p.mp4` | its own mix, `audio/intro-mix/intro-ep1-mix-V1-chipchamber.wav`, **−3 dB** (the manifest) | 0:30.67 · 30.00 | 0:30.04 · 30.00 |
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
   - **The same tool on the intro file alone** (not the re-encode) also gives 4 at frame 221. The intro's own audit reported "at most 2" (out/intro/reports/pic.md) with a different method.
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
