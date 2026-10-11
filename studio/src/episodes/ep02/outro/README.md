# Ep2's outro (`outro-b-ep2`): the Orb's verdict, in Ep1's format, with Ep2's credits

**Status (2026-10-10, the titles pass; then the episode review's fixes pass, the same day): built, rendered, looked at full size, checked.** Nobody has watched or listened to it yet [R8].

**The fixes pass (2026-10-10; [fixes-v1.md](../../../../../show/episodes/ep02/production/v1/fixes-v1.md#outro-the-fixes-pass-2026-10-10)):**
- **The verdict is Ep1's wording, `viewer: human ✓`** (was `viewer: verified: human`, the double colon the review flagged).
- **No product is named on screen.** The two tools chips on 5.1 and 5.2 (`tools: claude code · remotion · elevenlabs · kokoro-82m` / `blender · veo 3.1 fast via runway · ffmpeg`) are cut, as OUTRO-PROPOSALS §1.1 asks ("On screen it names no product"); the tools are named in the release description (LEARNINGS M4; `production/v1/assembly.md` §8.2). Mario's row reads `am_liam` (no `(kokoro)`).
- **Page 2 is the header chip and the cast alone,** centred on the Orb's eye line (it sat at the top over the tools); the second scan's fan is fitted to the cast's own angles (`scene.ts FAN2`). The toast ticks on 5.1 and 5.2 went with the chips (`audio/mix.py`); the score is unchanged (only its bar 5 labels).
- **Held for the showrunner:** the voice-cast page itself (26 rows, 491 characters, held 5.5 s: a page to pause on, not to read in order). The agreed outro is the model credit and `prompt: jgon`; every other row is the showrunner's call (SHOWRUNNER-NOTES 3-4).

**The ask:**
- Ep2's credits, in Ep1's outro format:
  - the voice cast, by role and library voice name;
  - the tools (since the fixes pass: in the release description, not on screen);
  - "by Opus 5.5" (Ep1's `art · script · music · voices · edit: opus 5.5`, `prompt: jgon`).
- The E02-14 score: the knee whole in Ep2's colour (manifest §6).
- No stinger (proposal D-17).

**The model:** Ep1's outro B (`studio/src/dev/outro/b/`, read, never edited). This folder is an Ep2 copy, so Ep1's `outro-b-ep1` and every file in `out/ep01/outro/` are untouched [M: sha1].

**Outputs** (`out/ep02/v1/outro/`; the manifest plays the mp4 and the WAV at −1 dB):
- `outro-b-ep2.mp4`: 360 f, 15.000 s, 1920 × 1080, H.264 + AAC.
- `outro-b-ep2.wav`: the mix; the WAVs are git-ignored, and `-music` / `-sfx` are the stems.
- `outro-b-ep2-keyframes.png`.
- `outro-b-ep2-key-credits.png` (o170) and `outro-b-ep2-key-cast.png` (o330).
- `qa/`: `qa.json`, `mix-report.json`, `flash.json`, and the text crops.

## What's on screen

| Outro frame · bar.beat | Picture | Sound |
|---|---|---|
| o0 · 1.1 | Cut to black. The Orb, close, frame-right, steps up in 3 palette steps. | Drone F1+C2; felt F4 |
| o9 | Header: `mr. mas · ep1.1_her.wav` | tick |
| o15–19 | The iris turns to the lens. | servo (the intro's) |
| o30–54 | The scan. Tokens lead the cone, and the credits resolve into type behind it. | the scan shhk, sweep and grains; no music |
| o60 · 2.1 / o75 · 2.2 | The chips land: `art · script · music · voices · edit: opus 5.5`, then `prompt: jgon`. | **The knee, swung. The title's wordless vocal pad sings the flat line, F F F F, and stops before the leap.** |
| o90–112 · 2.3 | The iris narrows one step per note. | celesta + chip: G A♭ C F |
| o120 · 3.1 | `viewer: human ✓` (Ep1's wording); the lens lights. | chime (C7) |
| o135 · 3.2 | | the verdict F5 → C6 over the open fifth |
| o150 · 3.3 | The lamp goes out; the iris returns to its toast (a plain week). | servo, softer |
| o180–186 · 4.1 | The toast steps down three rungs and clears: the page turns. | the felt fifth, pp |
| o186 | Header: `voices · role: library voice` | tick |
| o190–214 | The second scan sweeps the cast (two columns, centred on the Orb's eye line). | shhk, sweep, grains; no score onset |
| o214–344 · 5.1 | The cast page held for reading; nothing lands (no tools on screen since the fixes pass). | The celesta plays the flat line once more, pp, with no voice; a soft swung bed under the reading |
| o315 · 6.2 | glint | |
| o330 · 6.3 | | celesta F6 over vibes C6, pp (Ep1's button) |
| o345 · 6.4 | Cut to black; 15 f of black while the fifth releases | |

**The cast:**
- Column A is Ep1's cast: mas: jeremy · gerg: marcus · nole: ryan (confident) · rima: mia · chatgtp: maya · alyi: louis · tasya: tyler kurk · terb: ethan · neleh: alexandra · radnus: dylan malc · staffer: avery · mario: am_liam (Kokoro-82M's stock voice; the vendor is not named on screen).
- Column B is Ep2's new roles: selbeep: the pharaoh 3 · xel: alex wright · the humanist: luis · demo engineer: ryan (articulate) · voices 1-2: alexander, brad · voices 3-4: quinn, sarah eve · staffer 2: jessi · tv reporter: katherine · bukaj: scypher · ekiel: dexter · the forecaster: jack john · the driver: jerry b. · haras: hannah · the crowd: ten library voices.
- Every name is the voice the takes record (`audio/ep02/v1-el/ep02-v1/<seg>/lines-A.json`). The two Ryans keep their library descriptor. The crowd's ten are listed in cast.md §3.10.

**Why it's 15.0 s, not Ep1's 10.1:**
- Ep1's 3-bar plain week leaves no room for a cast list. A second page in the same grammar holds the list for 5.5 s once it has resolved (the fixes pass: the list alone, no tools).
- 15.0 s is the top of the showrunner's 6–15 s and half the intro.
- `build_timeline.py` reads the outro's length from `outro-b-ep2.wav`, so the next lock rebuild carries 15.0 s into the episode clock. The manifest says 10.125 until then.

## Measured [M]

- **Text** (`tools/preview.ts check`, on the rendered pixels):
  - Every row sits clear of the Orb (the rightmost ends at x 281; was 292 with the tools chips), and no two rows overlap.
  - Every row is on screen for at least 0.25 s + 0.05 s a character (P15).
  - Page 1 (96 characters with Ep1's verdict; was 104), read in order at 16 characters a second, finishes 1.0 s before the page turns (was 0.5 s). The verdict reads from o121, 2.46 s.
  - Page 2 (491 characters; was 597) holds 5.5 s from fully resolved (o213 to the cut). That is a credits page, read by pausing: reading it in order would take 31 s (was 37).
- **The encode against the exact frames:** max error 5 of 255 over every row (31 rows; was 7 over 33). Contrast 5.9:1 (the role names, C5 on black) to 17.7:1.
- **Flash:** 0 flashes; it passes.
- **Loudness** (`qa/mix-report.json`):
  - Page 1 (o0–180) is set to Ep1's outro over the same frames: −15.32 LUFS against Ep1's −15.29.
  - Page 2 sits at −18.2, a quieter bed under reading. The file measures −16.55 LUFS-I (Ep1's −16.02).
  - True peak −3.15 dBTP. The limiter takes at most 1.8 dB, on transients only (Ep1: 2.2). (The fixes pass's re-render: every loudness number here the same to the 0.01 dB; the limiter's most 1.81 dB, was 1.79.)
  - Momentary maximum −11.0, short-term p95 −14.6 (the featured-cue limits are −11 and −13).
  - By bar (I / M max): 1 −18.1/−11.4, 2 −14.3/−12.6, 3 −14.4/−11.0, 4 −19.2/−15.0, 5 −17.7/−15.0, 6 −18.3/−15.6. The knee and the verdict are level, as in Ep1.
  - The vocal pad's flat line plays 1 LU over the leap that answers it.
- **The score (E02-14, `audio/track.py`):**
  - Album −16.01 LUFS.
  - The engine's no-third window from 3.2 on raised no flag.
  - Its one marker warning is 2.2 (the pad sings that F; the engine has no onset there). (5.2's, the celesta's pp F, went with the tools chip's mark in the fixes pass.)
  - Its "KNEE not found" warning is expected: the flat line is the pad's, outside the engine.

## Re-render

```sh
bash studio/src/episodes/ep02/outro/tools/render.sh $S/outro    # in the background; heavy steps take ops/heavy.sh slots, ~3 min
```

`render.sh` runs these steps in order:
1. The picture: Remotion `outro-b-ep2`.
2. The score: `audio/track.py` (the OST engine, read-only; `OST_WORKERS=2`).
3. The vocal pad: `audio/vocal.py` (the intro's singer: Kokoro-82M stock voices re-sung through WORLD, the title PAD's recipe, F3 B♭3 C4 F4. It reads the vocal pass's syllable cache and writes nothing under `audio/`).
4. The mix: `audio/mix.py`.
5. The mux.
6. Decoding every frame of the encoded mp4, then the text checks: `tools/preview.ts check`.
7. `tools/sheets.py`, then `flash_seg.py`.

**To change a credit:** edit `timeline.ts` (`CREDITS`, `CAST_A`, `CAST_B`, `VERDICT`) and re-render. (There is no `TOOLS` list since the fixes pass; `qa.py` and `lock_report.py` read the words from `timeline.ts` and cope without one.) Keep the Orb's voice: lowercase, `field: value`, with ` · ` between fields. The shared 7-px face has a–z, 0–9 and `. , : ; ' " - / ( ) _ * + = ! ? $ · ✓`. Then re-run `check`: every row must end before x 365.

## Choices, and for a human

- **The verdict is `viewer: human ✓`**, Ep1's aired wording (the fixes pass; the titles pass had `viewer: verified: human` from the proposal). The ladder first changes in Ep6 (OUTRO-PROPOSALS §3).
- **No tools on screen** (the fixes pass). OUTRO-PROPOSALS §1.1 keeps the picture to parody names; §10 leaves on-screen tool names to legal and the showrunner. If the showrunner wants them back, they return as a chip pair on 5.1 and 5.2 (git history: the titles pass's `TOOLS` and its ticks in `audio/mix.py`).
- **Watch and listen for:**
  - whether the paused voice reads, with the pad stopping on 2.3;
  - whether the cast page's 5.5 s feels long enough or should be longer;
  - whether the celesta's flat line on 5.1 lands as a memory, not a repeat.
