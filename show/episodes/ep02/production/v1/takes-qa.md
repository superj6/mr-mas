# Ep2 v1: the takes, and their QA

> **Status: every line of the beat plans recorded through the Ep2 route and measured, 2026-10-09, by the dialogue recordist (the takes pass).** Nobody has listened (R8). Every verdict here is a measurement [M] unless it says it is a judgement [J]; the lines a human ear must check are in [§6](#6-for-the-ear).
>
> <!-- BEGIN generated:summary -->
173 of 173 lines have a take (missing: none; unmeasured: none). **59 PASS** every check, **114 LOOK** (they pass, with a number at the edge of its band: for the ear), **0 FLAG** (still failing after three retakes). 32 lines were read more than once. The takes pass sent 9,206 characters in 193 calls, **4,065 credits** by the API's own character-cost headers.
<!-- END generated:summary -->

**Contents:** [1. What was recorded, and how](#1-what-was-recorded-and-how) · [2. The checks and the rule](#2-the-checks-and-the-rule) · [3. Every line](#3-every-line) · [4. Retakes](#4-retakes) · [5. The special lines](#5-the-special-lines) · [6. For the ear](#6-for-the-ear) · [7. Credits](#7-credits) · [8. Files and how to re-run](#8-files-and-how-to-re-run) · [9. Open issues, and the rules checked](#9-open-issues-and-the-rules-checked)

---

## 1. What was recorded, and how

Every line of the six beat plans (`beat-plan/<seg>.json`, 173 lines: 159 spoken, 14 V.O.) has one take, through the Ep2 route of [pipeline.md](pipeline.md) §2, into `audio/ep02/v1-el/ep02-v1/<seg>/` (`lines-A.json` + WAVs, 48 kHz / 24-bit mono, dry, 0.35 s room-tone handles; dialogue −16 LUFS, V.O. −18, true peak ≤ −1.5 dBTP) [M]:

| Route | Lines | How |
|---|---|---|
| **ElevenLabs**, `el_render.py` from the beat plans | 162 | each role at its `cast-el.json` settings: Ep1's carried voices unchanged (Mas = Jeremy, candidate C), the new roles at their picks (cast.md §3). 23 of them were first read by the casting pass (its auditioned lines on the episode's seeds), found in the cache and not sent again; two of those (Bukaj's `e2-a3-0007`, Ekiel's `e2-a3-0014`) were later retaken |
| **Cut from a take**, `el_cut.py` (Ep1's, copied; its table read from `_spec.py` CUT) | 3 | `e2-a1-0026` "…billions per year…" from `e2-a1-0014`'s take; `e2-a1-0047` "…chaotic and shameful and upsetting…" from `e2-a1-0035`'s; **`e2-a3-0008` "Six years and eleven months." from Ep1's own take `e1-a1-5-13`** (`audio/ep01/v3-el/ep01-v35/act1/`, read and copied into `audio/ep02/`, never edited) |
| **The CROWD**, `el_crowd.py` | 1 | the ten layered library reads of cast.md §3.10, all from the casting cache (nothing sent), layered (§5) |
| **Sung**, `el_sung.py` | 1 | CHATGTP's "one wo-o-ord.": Maya's spoken "One. Word." (10 characters) re-sung in three parts by the intro's WORLD singer (§5) |
| **Kokoro**, `el_mario.py` | 6 | MARIO in his Ep1 voice (`am_liam`, a-liam-earnest, speed 0.95) through Ep1's fastrec, run, never edited (§5) |

**Changes to `audio/ep02/cast-el.json`** (each with its reason in the file) [M]:
- **The two carried speaker ids the casting notes asked for:** `staffer` → `tiled-employee` (Avery), and a `ghost-nole` role derived from Nole (Ryan - Confident and Bold, his settings unchanged; the ghost treatment is the mix's chain on the `ghost` tag, cast.md §4).
- **Respellings** for Ep2's new names (cast.md §5): MINDDEEP "Mind Deep", AROS "Ah-ross", RETTIWT "Rett-twit", Ekiel "Eh-keel", ELSE "else" (the stress is a reading note; capitals can be spelled). Each was then checked by forced choice (§3, the Names column).
- **Per-line readings** (`say_lines`, the same words with other punctuation): Alyi's chant lead "Feel the A.G.I.!" (as the crowd's); "Is there anyone here… from 2016." kept one sentence; "You wrote 'exactly right.'" without the house's doubled stop; Terb's "…which is…" left hanging for Mas's "also present."; CHATGTP's "Hi!… I can see you." and "Oh… Wow… That's a lot of you…" with the beats the plan holds (§4); the two hurried lines with commas (below).
- **Per-line settings** (`line_settings`), only where a brief asks for a read the role's settings don't give [M, each measured before it was kept]:

| Line | Brief | Role's settings gave | Kept |
|---|---|---|---|
| `e2-a3-0019` MAS's call to LEGAL | "level and quicker than he ever talks, about 180 wpm" | 134 wpm at speed 1.10 with the script's full stops (slower than his ordinary lines) | speed **1.20**, sent with commas: **174 wpm**, 3.44 s against the plan's 3.32 |
| `e2-vo-09` V.O. 9 | "faster than he thinks, about 145 wpm against his usual 110–130" | 109 wpm at speed 1.0 with full stops | speed **1.15**, stability 0.60, sent with commas: **148 wpm**, 3.24 s against 3.25. **Replaced at the lock QA** (lock-v1.md §3.5): that read left 0.21 s after "signed" and was heard "Everyone who signed the post, everyone who signed.", so the count could parse as "signed the post". Kept now: speed **1.2**, a full stop after "signed" (`Everyone who signed. The post, everyone who signed.`): 0.47 s after "signed", 0.42 s after "post", heard "Everyone who signed. The post. Everyone who signed.", **138 wpm** (articulation 4.46 syllables a second, against 4.29), 3.48 s |
| `e2-a2-0037`, `-0038` the ENGINEER off mic | "lower and closer" (the casting read measured 151 Hz against his 118 Hz stage line) | 146 and 151 Hz (the cast reads, kept in the cache) | stability 0.60, style 0: **140 and 128 Hz**, against his stage lines' median of 138 Hz. `-0038`'s first two reads at these settings were heard "the guy *in* his computer" (forced margins −10.7, −8.9: misreads, retaken); its third read is verbatim |
| six of Mas's V.O. lines (`e2-vo-02`, `-05`, `-08`, `-10`, `-12`, `-13`) | "close and dry, 110–130 wpm" | 160–205 wpm at the V.O. settings (speed 0.85) | speed **0.75**: 143–188 wpm, each slower, all verbatim |
| four of Mas's spoken lines (`e2-a1-0004`, `-0009`, `e2-a3-0012`, `e2-a4-0029`) | "his ordinary lines unhurried, about 140 wpm", and the call "quicker than he ever talks" | 183–233 wpm at speed 0.95, faster than the call | speed **0.82**: 152–192 wpm, verbatim |

**Mas's tempo, honestly** [M]: Jeremy at his Ep1 settings reads Ep2's short lines faster than LEARNINGS W18's ~140: his spoken lines of 5+ words have a median of **167 wpm** (Ep1's shipped EL lock, same voice and settings: 189) and his V.O. **146 wpm** (Ep1's: 135), even after the slower reads above. EL's speed setting moves a short line only 10–20 % [M], so the rest is how this voice reads; the lock fits every take, and the plan's scenes re-fit around them (`_build.py`, §8). **The two hurried lines do stand out by articulation rate** (syllables a second, pauses out): the call 4.55 against his ordinary lines' median 4.15; V.O. 9 4.29 against his V.O. median 3.61, the second fastest of his 14 V.O. lines. By words a minute, the call (174) is passed by two short lines (`e2-a3-0012` 181, `e2-a4-0029` 192): **for the ear** (§6).

---

## 2. The checks and the rule

Each take was measured by `audio/ep02/v1-el/tools/el_qa.py` [M], on the dressed take (48 kHz / 24-bit, dry) and, for the noise floor and clipping, on the raw ElevenLabs audio in the cache:

| Check | How | FAIL (retaken) | LOOK (passes; for the ear) |
|---|---|---|---|
| **ASR** | faster-whisper `small.en`, beam 5 (the house recogniser; el_render's read of each take), against the line's text. Both sides normalised: numbers and years as words, spelled letters joined (`A.G.I.` = `AGI`), `alright` = `all right`, `yep` = `yup`, accents stripped, a hyphen or a space inside a word ignored (`non-profit` = `nonprofit`). A parody name in the text may be heard as up to three words (the name check covers it) | any other dropped, added or changed word **confirmed by forced alignment**: log P(the text as sent \| audio) − log P(what the recogniser wrote \| audio), on the same model, under −3.0. Where controls (the same voice reading the text's word and the heard word on purpose) show the recogniser can't separate the two, the mismatch is a LOOK (`CONTROLS` in el_qa.py: Nole's 'N', §6) | a mismatch the forced alignment doesn't confirm (the text scores within 3.0 of the recogniser's own guess: the recogniser's error, not the read's) |
| **Names** | `pron_check.py` (Ep1's forced choice, copied with Ep2's names): each watched name scored against its competitors, **the real word it parodies first among them** (Mas–Sam/Max/Mass, Alyi–Ilya/Ali/Eli, Nole–Elon/Noel/Nolan, NopeAI–OpenAI, CHATGTP–ChatGPT, Rettiwt–Twitter/Reddit, MindDeep–DeepMind, AROS–Sora/arrows/Eros, Manalt–Altman, Ekiel–Ezekiel/Michael, AGI–AGE) | margin under −2.0 | margin −2.0 to 0 (the recogniser's prior favours a known word, so a small negative margin is not a misread on its own). §3 also gives the margin against the real word alone, in brackets, when the best competitor is a near word |
| **Length** | the audible span against the plan's planning length (`_spec.py`'s words-at-rate estimate or fixed length, the length the scenes were fitted to; never a take) | 4+ words: under 0.55 or over 1.70 of the plan; shorter lines: more than 1.0 s off. A silence over 1.0 s inside the read that the text doesn't mark | 4+ words: outside 0.85–1.15; shorter: more than 0.35 s off |
| **Tempo** | words a minute (lines of 5+ words) against the line's mark: Mas ~140 (120–160, W18), his call to LEGAL ~180 (160–200), his V.O. 110–130, V.O. 9 ~145–165, every other role its planned rate ±15 % (`_spec.py` RATE) | — | outside the mark (the lock fits every take; a speed change is a casting call, made here only where a brief asks: §1) |
| **Level** | integrated LUFS and 4× true peak of the take | more than 0.5 LU off its target (−16 dialogue, −18 V.O.; the crowd −19 by design), or a true peak over −1.5 dBTP | — |
| **Clipping** | samples at full scale in the take; runs of 3+ samples at \|x\| ≥ 0.99 in the raw audio; the raw audio stopping while it still sounds (el_render's tail check) | any | — |
| **Noise floor** | on the raw file: the **pause floor** (the median of the 20 ms frames 35 dB or more under its loudest, when there are 5 or more: real gaps) and speech-to-floor; and the casting pass's p5 floor (the 5th percentile of all frames, cast.md §8.3), shown in §3 | the pause floor under 25 dB below the speech | the p5 floor under 45 dB (the house bed's depth under dialogue). *The first QA run failed on the p5 floor under 25 dB; on continuous speech with no real gap it reads quiet phonemes, not noise, so the FAIL moved to the pause floor. Neleh's two lines were retaken on the old rule before the change (§4)* |
| **Pitch** | the take's median F0 (house YIN) against its role's median over the episode | more than 4 st off and outside the role's lane widened by 2 st (an octave slip), lines of 3+ words | — |

**The rule** [M]: a FAIL is retaken on a new seed (seed + 1000, + 2000, + 3000), **at most three retakes a line**, then FLAGGED. The first read that passes every FAIL check is kept, so no read is picked over another for a reason nobody can hear; where a casting note asked for one more read (`--force`), the passing read nearer the plan's length is kept. The pick is written into the segment's `manifest.json`, so a later `el_render.py` run keeps it, and its row into `lines-A.json`.

---

## 3. Every line

Per line: the take used (its file; a retake's seed; a per-line setting), what the recogniser heard, the audible span against the plan's planning length (and the ratio), words a minute against the line's tempo mark (5+ words), median F0, the take's loudness and true peak, the raw ElevenLabs file's noise floor and speech-to-floor, each watched name's forced-choice margin, and the verdict with its reasons. The full numbers of every read (the retakes too) are in `audio/ep02/v1-el/ep02-v1/qa/<seg>-qa.json`.

<!-- BEGIN generated:tables -->
### coldopen

| Line | Who | Take used | Heard (ASR, small.en) | Span / plan (s) | wpm (mark) | F0 Hz | LUFS · TP | Raw floor · S:F | Names | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| e2-co-0001 | selbeep | `e2-co-0001__selbeep-A.wav` · retake, seed +1000 | Eyes up here everyone. This is our Ross. Nobody filmed any of this. It's all made from one sentence | 6.03 / 6.30 (0.96) | 179 (157-213) | 140 | -16.0 · -2.5 | -52 · 33 dB | AROS +3.4 (Sora +9.9) | **LOOK**: 2 reads; floor 33 dB under the speech (p5; house bed depth 45) |
| e2-co-0002 | gerg | `e2-co-0002__gerg-mockbran-A.wav` | Which sentence? | 0.78 / 0.69 (1.13) | 154 | 129 | -16.4 · -2.1 | -78 · 57 dB |  | **PASS** |
| e2-co-0003 | selbeep | `e2-co-0003__selbeep-A.wav` | A mammoth walking through the snow. We never said anything about a lobby. It understands physics. | 5.84 / 5.53 (1.06) | 164 (157-213) | 144 | -16.0 · -2.7 | -69 · 48 dB |  | **PASS** |
| e2-co-0004 | selbeep | `e2-co-0004__selbeep-A.wav` | Directionally | 0.91 / 0.42 (2.17) | 66 | 132 | -16.0 · -3.4 | -48 · 27 dB |  | **LOOK**: length +0.49 s off the plan; floor 27 dB under the speech (p5; house bed depth 45) |
| e2-co-0005 | selbeep | `e2-co-0005__selbeep-A.wav` | That's the mammoth. It's been two weeks, and it has mass now. We're working on it | 4.73 / 5.53 (0.85) | 203 (157-213) | 126 | -16.0 · -2.6 | -64 · 42 dB |  | **LOOK**: floor 42 dB under the speech (p5; house bed depth 45) |
| e2-co-0006 | gerg | `e2-co-0006__gerg-mockbran-A.wav` · retake, seed +1000 | That's not the mammoth the mammoths on the fourth floor | 2.98 / 3.15 (0.95) | 201 (174-236) | 156 | -16.0 · -2.8 | -76 · 56 dB |  | **LOOK**: 2 reads; asr: 'mammoth's' heard 'mammoths' (the recogniser's; the text scores +1.1 against what it heard) |

### act1

| Line | Who | Take used | Heard (ASR, small.en) | Span / plan (s) | wpm (mark) | F0 Hz | LUFS · TP | Raw floor · S:F | Names | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| e2-vo-01 | mas | `e2-vo-01__mas-manalt-C.wav` | Noll's emails. The court gets them eventually. Everyone else gets them tonight. | 6.44 / 5.96 (1.08) | 112 (110-130) | 112 | -18.0 · -3.3 | -84 · 66 dB | Nole +1.2 (Elon +14.4) | **PASS** |
| e2-a1-0001 | mas | `e2-a1-0001__mas-manalt-C.wav` | Is there anyone here from 2016? | 2.96 / 2.79 (1.06) | 122 (120-160) | 119 | -16.0 · -2.7 | -84 · 66 dB |  | **PASS** |
| e2-a1-0002 | ghost-nole | `e2-a1-0002__ghost-nole-A.wav` | Yup. | 0.51 / 0.60 (0.85) | 118 | 106 | -16.0 · -1.8 | -76 · 48 dB |  | **PASS** |
| e2-a1-0003 | gerg | `e2-a1-0003__gerg-mockbran-A.wav` · retake, seed +1000 | He signed it. He's just not here | 2.00 / 2.27 (0.88) | 210 (174-236) | 131 | -16.0 · -3.0 | -68 · 50 dB |  | **PASS**: 2 reads |
| e2-a1-0004 | mas | `e2-a1-0004__mas-manalt-C.wav` · line settings: stability 0.6, style 0.0, speed 0.82 | One knock if we promised a non -profit. | 2.76 / 3.10 (0.89) | 152 (120-160) | 114 | -16.0 · -3.0 | -81 · 65 dB |  | **PASS**: 2 reads |
| e2-a1-0005 | mas | `e2-a1-0005__mas-manalt-C.wav` | You're early. We're on 2016. | 2.21 / 2.36 (0.94) | 136 (120-160) | 117 | -16.0 · -2.0 | -80 · 60 dB |  | **PASS** |
| e2-a1-0006 | nole | `e2-a1-0006__nole-A.wav` | Is this a seance or a deposition, because I've got lawyers for both. | 3.92 / 4.42 (0.89) | 199 (170-230) | 111 | -16.0 · -3.7 | -66 · 37 dB |  | **LOOK**: floor 37 dB under the speech (p5; house bed depth 45) |
| e2-a1-0007 | gerg | `e2-a1-0007__gerg-mockbran-A.wav` · retake, seed +1000 | It's a blog post. We put some of your old emails up today. The candles were extra. | 3.61 / 5.32 (0.68) | 282 (174-236) | 168 | -16.0 · -2.9 | -68 · 48 dB |  | **LOOK**: 2 reads; length 0.68 of the plan; tempo 282 wpm against gerg at the planned 205 wpm +-15 % |
| e2-a1-0008 | nole | `e2-a1-0008__nole-A.wav` | Great! Put this on the blog, too. I paid for the table. I paid for the candles. I paid for the ceiling I just came through. And I asked for one thing and it's in the name. Open. It was supposed to be open. | 14.87 / 14.14 (1.05) | 178 (170-230) | 120 | -16.0 · -3.2 | -74 · 47 dB |  | **PASS** |
| e2-a1-0009 | mas | `e2-a1-0009__mas-manalt-C.wav` · line settings: stability 0.6, style 0.0, speed 0.82 | Spirit, what did we call it? | 2.16 / 2.67 (0.81) | 167 (120-160) | 122 | -16.0 · -2.6 | -82 · 61 dB |  | **LOOK**: 2 reads; length 0.81 of the plan; tempo 167 wpm against Mas unhurried (~140) |
| e2-a1-0010 | nole | `e2-a1-0010__nole-A.wav` | There, even the furniture knows. | 2.08 / 1.72 (1.21) | 144 (170-230) | 119 | -16.0 · -3.4 | -75 · 48 dB |  | **LOOK**: length 1.21 of the plan; tempo 144 wpm against nole at the planned 200 wpm +-15 % |
| e2-a1-0011 | nole | `e2-a1-0011__nole-A.wav` | No, not like that. The end goes at the end. | 2.47 / 3.34 (0.74) | 243 (170-230) | 97 | -16.0 · -3.6 | -65 · 38 dB |  | **LOOK**: 4 reads; asr: 'n' heard 'end' (the recogniser can't tell the letter 'N' from 'end' here: scored on the same two texts, a control read of 'En' gives -4.5 and a control read of 'end' -4.9, and the four reads -2.6 to -4.5 (variants/n-controls.json)); length 0.74 of the plan; tempo 243 wpm against nole at the planned 200 wpm +-15 %; floor 38 dB under the speech (p5; house bed depth 45) |
| e2-a1-0012 | nole | `e2-a1-0012__nole-A.wav` | I forwarded that, I didn't write it. | 1.88 / 2.32 (0.81) | 223 (170-230) | 91 | -16.0 · -3.0 | -70 · 40 dB |  | **LOOK**: length 0.81 of the plan; floor 40 dB under the speech (p5; house bed depth 45) |
| e2-a1-0013 | mas | `e2-a1-0013__mas-manalt-C.wav` | You wrote exactly right. | 1.56 / 1.81 (0.86) | 154 | 107 | -16.0 · -3.2 | -83 · 66 dB |  | **PASS** |
| e2-a1-0014 | ghost-nole | `e2-a1-0014__ghost-nole-A.wav` | This needs billions per year immediately or forget it. | 2.90 / 3.70 (0.78) | 186 (128-172) | 117 | -16.0 · -1.7 | -71 · 44 dB |  | **LOOK**: length 0.78 of the plan; tempo 186 wpm against ghost-nole at the planned 150 wpm +-15 %; floor 44 dB under the speech (p5; house bed depth 45) |
| e2-a1-0015 | nole | `e2-a1-0015__nole-A.wav` · retake, seed +1000 | that was a different me that was 2018 everybody said things in 2018 | 4.01 / 4.24 (0.95) | 194 (170-230) | 108 | -16.0 · -3.8 | -71 · 43 dB |  | **LOOK**: 2 reads; floor 43 dB under the speech (p5; house bed depth 45) |
| e2-a1-0016 | gerg | `e2-a1-0016__gerg-mockbran-A.wav` | Same email address though, I checked. | 1.60 / 1.98 (0.81) | 225 (174-236) | 125 | -16.0 · -3.2 | -66 · 50 dB |  | **LOOK**: length 0.81 of the plan |
| e2-a1-0017 | nole | `e2-a1-0017__nole-A.wav` | Say something else. | 0.97 / 1.00 (0.97) | 186 | 122 | -16.0 · -3.8 | -76 · 52 dB |  | **PASS** |
| e2-a1-0018 | ghost-nole | `e2-a1-0018__ghost-nole-A.wav` | Yep. | 0.81 / 0.80 (1.01) | 74 | 102 | -16.0 · -2.1 | -80 · 52 dB |  | **PASS** |
| e2-a1-0019 | mas | `e2-a1-0019__mas-manalt-C.wav` | SPIRIT Y0 | 1.56 / 1.39 (1.12) | 115 | 118 | -16.0 · -2.3 | -82 · 62 dB |  | **LOOK**: asr: 'why zero' heard 'y0' (the recogniser's; the text scores -1.5 against what it heard) |
| e2-a1-0020 | nole | `e2-a1-0020__nole-A.wav` | That's why | 0.82 / 0.70 (1.17) | 146 | 88 | -16.0 · -1.6 | -74 · 43 dB |  | **LOOK**: floor 43 dB under the speech (p5; house bed depth 45); pitch 88 Hz, -4.3 st from the role's 113 (a short line) |
| e2-a1-0021 | staffer | `e2-a1-0021__tiled-employee-A.wav` | What's that? | 0.49 / 0.73 (0.67) | 245 | 163 | -16.0 · -1.9 | -89 · 70 dB |  | **PASS** |
| e2-a1-0022 | nole | `e2-a1-0022__nole-A.wav` | Nobody wrote that move. It came out of nowhere. | 2.25 / 2.92 (0.77) | 240 (170-230) | 100 | -16.0 · -3.2 | -74 · 44 dB |  | **LOOK**: length 0.77 of the plan; tempo 240 wpm against nole at the planned 200 wpm +-15 %; floor 44 dB under the speech (p5; house bed depth 45) |
| e2-a1-0023 | gerg | `e2-a1-0023__gerg-mockbran-A.wav` | It didn't come out of nowhere. It learned 30 million positions from people's games. | 4.24 / 4.65 (0.91) | 198 (174-236) | 133 | -16.1 · -2.8 | -74 · 57 dB |  | **PASS** |
| e2-a1-0055 | staffer | `e2-a1-0055__tiled-employee-A.wav` | So somebody did write it. | 1.17 / 1.68 (0.70) | 256 (162-218) | 215 | -16.0 · -2.6 | -88 · 70 dB |  | **LOOK**: length 0.70 of the plan; tempo 256 wpm against staffer at the planned 190 wpm +-15 % |
| e2-a1-0056 | gerg | `e2-a1-0056__gerg-mockbran-A.wav` | Nobody wrote it. It's millions of little numbers, like knobs. Every position nudged every knob of hair toward what the person played. Then it played itself, millions of games. | 10.26 / 9.38 (1.09) | 170 (174-236) | 139 | -16.0 · -3.5 | -61 · 46 dB |  | **LOOK**: asr: 'a' heard 'of' (the recogniser's; the text scores -2.3 against what it heard); tempo 170 wpm against gerg at the planned 205 wpm +-15 % |
| e2-a1-0024 | nole | `e2-a1-0024__nole-A.wav` | One player in 10 ,000 would have made that move. It made it anyway, and it was right. | 5.39 / 5.74 (0.94) | 200 (170-230) | 114 | -16.0 · -3.7 | -73 · 47 dB |  | **PASS** |
| e2-a1-0025 | nole | `e2-a1-0025__nole-A.wav` | Mindeep had that in 2016, we had a blog. | 2.51 / 2.92 (0.86) | 215 (170-230) | 96 | -16.0 · -3.4 | -69 · 41 dB | MindDeep +19.0 (DeepMind +19.3) | **LOOK**: floor 41 dB under the speech (p5; house bed depth 45) |
| e2-a1-0026 | ghost-nole | `e2-a1-0026__ghost-nole-A.wav` · cut from e2-a1-0014 | Billions per year | 0.94 / 1.30 (0.72) | 192 | 136 | -16.0 · -2.7 | -71 · 44 dB |  | **LOOK**: length -0.36 s off the plan; floor 44 dB under the speech (p5; house bed depth 45) |
| e2-vo-02 | mas | `e2-vo-02__mas-manalt-C.wav` · line settings: stability 0.65, style 0.0, speed 0.75 | He was right about the bill. It's bigger now. | 3.42 / 4.44 (0.77) | 158 (110-130) | 104 | -18.0 · -3.4 | -88 · 65 dB |  | **LOOK**: 2 reads; length 0.77 of the plan; tempo 158 wpm against his V.O. 110-130 |
| e2-a1-0027 | nole | `e2-a1-0027__nole-A.wav` | You kept them | 0.92 / 1.00 (0.92) | 196 | 142 | -16.0 · -2.4 | -72 · 46 dB |  | **PASS** |
| e2-a1-0028 | mas | `e2-a1-0028__mas-manalt-C.wav` | We keep everything. | 1.12 / 1.39 (0.81) | 161 | 100 | -16.0 · -1.9 | -82 · 59 dB |  | **PASS** |
| e2-a1-0029 | nole | `e2-a1-0029__nole-A.wav` | You sat at the back. I stood up in front of the whole room and you sat at the back with your glass of water | 6.76 / 7.72 (0.88) | 222 (170-230) | 116 | -16.0 · -2.5 | -69 · 43 dB |  | **LOOK**: floor 43 dB under the speech (p5; house bed depth 45) |
| e2-a1-0030 | nole | `e2-a1-0030__nole-A.wav` | Keep that too. See you in court. | 1.57 / 2.32 (0.68) | 268 (170-230) | 126 | -16.0 · -2.3 | -77 · 49 dB |  | **LOOK**: length 0.68 of the plan; tempo 268 wpm against nole at the planned 200 wpm +-15 % |
| e2-a1-0031 | terb | `e2-a1-0031__terb-A.wav` | Before we start, the independent review is back. I'll read you the finding. | 4.48 / 4.95 (0.91) | 174 (140-190) | 99 | -16.0 · -3.0 | -52 · 32 dB |  | **LOOK**: floor 32 dB under the speech (p5; house bed depth 45) |
| e2-a1-0032 | terb | `e2-a1-0032__terb-A.wav` | The law firm found that the prior board acted within its broad discretion to terminate Mr. Manault But also found that his conduct did not mandate removal | 10.36 / 11.02 (0.94) | 156 (140-190) | 101 | -16.0 · -3.1 | -53 · 31 dB | Manalt +6.2 (Altman +18.0) | **LOOK**: floor 31 dB under the speech (p5; house bed depth 45) |
| e2-a1-0033 | terb | `e2-a1-0033__terb-A.wav` | You can sit down now, Moss. | 1.78 / 2.28 (0.78) | 202 (140-190) | 99 | -16.0 · -4.4 | -46 · 27 dB | Mas +6.2 (Max +9.4) | **LOOK**: length 0.78 of the plan; tempo 202 wpm against terb at the planned 165 wpm +-15 %; floor 27 dB under the speech (p5; house bed depth 45) |
| e2-vo-03 | mas | `e2-vo-03__mas-manalt-C.wav` | Two hours on his show, once. After that, November is a link. | 5.72 / 5.84 (0.98) | 126 (110-130) | 108 | -18.0 · -3.8 | -83 · 64 dB |  | **PASS** |
| e2-a1-0034 | xel | `e2-a1-0034__xel-A.wav` | Take me through the NOPE AI board saga that started on Thursday, November 16th, maybe Friday, November 17th for you. | 7.22 / 7.01 (1.03) | 158 (140-190) | 145 | -16.0 · -2.8 | -74 · 56 dB | NopeAI +6.5 | **PASS** |
| e2-a1-0035 | mas | `e2-a1-0035__mas-manalt-C.wav` | The most painful professional experience of my life and chaotic and shameful and upsetting and a bunch of other negative things. | 9.94 / 9.10 (1.09) | 127 (120-160) | 115 | -16.0 · -1.7 | -82 · 63 dB |  | **PASS** |
| e2-a1-0036 | xel | `e2-a1-0036__xel-A.wav` | Let me ask you about Alié. Is he being held hostage in a secret nuclear facility? | 5.01 / 6.04 (0.83) | 192 (140-190) | 130 | -16.0 · -3.0 | -89 · 72 dB | Alyi +0.3 (Ilya +9.2) | **LOOK**: length 0.83 of the plan; tempo 192 wpm against xel at the planned 165 wpm +-15 % |
| e2-a1-0037 | mas | `e2-a1-0037__mas-manalt-C.wav` | No. | 0.46 / 0.50 (0.92) | 130 | 119 | -16.0 · -1.9 | -84 · 69 dB |  | **PASS** |
| e2-a1-0038 | xel | `e2-a1-0038__xel-A.wav` | What about a regular secret facility? | 1.83 / 2.28 (0.80) | 197 (140-190) | 127 | -16.0 · -3.0 | -87 · 68 dB |  | **LOOK**: length 0.80 of the plan; tempo 197 wpm against xel at the planned 165 wpm +-15 % |
| e2-a1-0039 | mas | `e2-a1-0039__mas-manalt-C.wav` · retake, seed +1000 | No | 0.49 / 0.50 (0.98) | 122 | 113 | -16.0 · -2.2 | -86 · 68 dB |  | **PASS**: 2 reads |
| e2-a1-0040 | xel | `e2-a1-0040__xel-A.wav` | What about a nuclear non -secret facility? | 2.35 / 2.28 (1.03) | 153 (140-190) | 144 | -16.0 · -2.1 | -57 · 42 dB |  | **LOOK**: floor 42 dB under the speech (p5; house bed depth 45) |
| e2-a1-0041 | mas | `e2-a1-0041__mas-manalt-C.wav` | Neither, not that either. | 1.78 / 1.93 (0.92) | 135 | 107 | -16.0 · -2.0 | -87 · 69 dB |  | **PASS** |
| e2-a1-0042 | xel | `e2-a1-0042__xel-A.wav` | You've known Al -Yi for a long time. He was obviously part of this drama with the board and all that kind of stuff. What's your relationship with him now? | 8.13 / 10.89 (0.75) | 214 (140-190) | 142 | -16.0 · -3.7 | -85 · 68 dB | Alyi -1.2 (Ilya +8.7) | **LOOK**: name Alyi: -1.2 against '... You've known Ali for a long time. He was obviously part of this drama with the board and all that kind of stuff. What's your relationship with him now?'; length 0.75 of the plan; tempo 214 wpm against xel at the planned 165 wpm +-15 % |
| e2-a1-0043 | mas | `e2-a1-0043__mas-manalt-C.wav` | I love Al -Yi. I have tremendous respect for Al -Yi. I don't have anything I can say about his plans right now. That's a question for him, but I really hope we work together for certainly the rest of my career. | 14.18 / 17.60 (0.81) | 169 (120-160) | 110 | -16.0 · -2.2 | -83 · 63 dB | Alyi -1.8 (Ilya +8.4) | **LOOK**: name Alyi: -1.8 against 'I love Ali. I have tremendous respect for Ali. I don't have anything I can say about his plans right now. That's a question for him, but I really hope we work together for certainly the rest of my career.'; length 0.81 of the plan; tempo 169 wpm against Mas unhurried (~140) |
| e2-a1-0044 | xel | `e2-a1-0044__xel-A.wav` | Is it conscious though? | 1.45 / 1.67 (0.87) | 166 | 95 | -16.0 · -2.5 | -78 · 61 dB |  | **PASS** |
| e2-a1-0045 | mas | `e2-a1-0045__mas-manalt-C.wav` | The mic? | 0.64 / 0.80 (0.80) | 188 | 101 | -16.3 · -1.5 | -90 · 69 dB |  | **PASS** |
| e2-a1-0046 | xel | `e2-a1-0046__xel-A.wav` | Yes. | 0.50 / 0.50 (1.00) | 120 | 94 | -16.0 · -2.1 | -58 · 38 dB |  | **LOOK**: floor 38 dB under the speech (p5; house bed depth 45) |
| e2-a1-0047 | mas | `e2-a1-0047__mas-manalt-C.wav` · cut from e2-a1-0035 | chaotic and shameful and upsetting. | 2.43 / 2.24 (1.08) | 124 (120-160) | 114 | -16.0 · -2.0 | -82 · 63 dB |  | **PASS** |
| e2-a1-0048 | humanist | `e2-a1-0048__humanist-A.wav` | I'm just moving in downstairs. I hope that's all right | 3.71 / 3.65 (1.02) | 162 (149-201) | 102 | -16.0 · -3.5 | -86 · 56 dB |  | **PASS** |
| e2-a1-0049 | tasya | `e2-a1-0049__tasya-A.wav` | Welcome, make yourself at home, everything's on us. The heat, the power, the floor you're standing on. | 8.00 / 7.26 (1.10) | 128 (128-172) | 204 | -16.0 · -3.2 | -91 · 67 dB |  | **LOOK**: tempo 128 wpm against tasya at the planned 150 wpm +-15 % |
| e2-a1-0050 | humanist | `e2-a1-0050__humanist-A.wav` | I brought my own team. Is there room for them? | 2.87 / 3.65 (0.79) | 209 (149-201) | 114 | -16.0 · -3.0 | -76 · 48 dB |  | **LOOK**: length 0.79 of the plan; tempo 209 wpm against humanist at the planned 175 wpm +-15 % |
| e2-a1-0051 | tasya | `e2-a1-0051__tasya-A.wav` · retake, seed +1000 | There's always room down here, it's quieter than upstairs. | 4.46 / 3.82 (1.17) | 121 (128-172) | 128 | -16.0 · -2.7 | -91 · 65 dB |  | **LOOK**: 2 reads; length 1.17 of the plan; tempo 121 wpm against tasya at the planned 150 wpm +-15 % |
| e2-a1-0052 | tasya | `e2-a1-0052__tasya-A.wav` | We keep a spare | 1.36 / 1.70 (0.80) | 176 | 181 | -16.0 · -2.9 | -89 · 62 dB |  | **LOOK**: length 0.80 of the plan |
| e2-a1-0053 | humanist | `e2-a1-0053__humanist-A.wav` | Who else lives here? | 1.39 / 1.47 (0.95) | 173 | 126 | -16.0 · -4.3 | -89 · 58 dB |  | **PASS** |
| e2-a1-0054 | tasya | `e2-a1-0054__tasya-A.wav` | A TENANT! | 0.79 / 0.90 (0.88) | 152 | 141 | -16.0 · -1.6 | -91 · 67 dB |  | **PASS** |

### act2

| Line | Who | Take used | Heard (ASR, small.en) | Span / plan (s) | wpm (mark) | F0 Hz | LUFS · TP | Raw floor · S:F | Names | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| e2-vo-04 | mas | `e2-vo-04__mas-manalt-C.wav` | The next model runs on the Landlord's servers. The one after runs on ours. | 6.06 / 6.78 (0.89) | 139 (110-130) | 113 | -18.0 · -3.6 | -84 · 66 dB |  | **LOOK**: tempo 139 wpm against his V.O. 110-130 |
| e2-vo-05 | mas | `e2-vo-05__mas-manalt-C.wav` · line settings: stability 0.65, style 0.0, speed 0.75 | One day ahead is enough. | 1.84 / 2.44 (0.75) | 163 (110-130) | 103 | -18.0 · -3.8 | -79 · 60 dB |  | **LOOK**: 2 reads; length 0.75 of the plan; tempo 163 wpm against his V.O. 110-130 |
| e2-a2-0001 | mas | `e2-a2-0001__mas-manalt-C.wav` | No money either way. You put us in your new assistant. That's the price. | 4.94 / 6.34 (0.78) | 170 (120-160) | 127 | -16.2 · -2.4 | -86 · 70 dB |  | **LOOK**: length 0.78 of the plan; tempo 170 wpm against Mas unhurried (~140) |
| e2-a2-0002 | rima | `e2-a2-0002__rima-tamuri-A.wav` | Places, please. Phones on silent in the wings. We're on in five. | 5.39 / 4.63 (1.16) | 134 (143-193) | 162 | -16.0 · -2.5 | -59 · 37 dB |  | **LOOK**: length 1.16 of the plan; tempo 134 wpm against rima at the planned 168 wpm +-15 %; floor 37 dB under the speech (p5; house bed depth 45) |
| e2-a2-0003 | engineer | `e2-a2-0003__engineer-A.wav` | So, on stage, I ask it a question, it thinks for a second, and then it answers. | 4.60 / 5.47 (0.84) | 222 (162-218) | 118 | -16.0 · -3.6 | -57 · 40 dB |  | **LOOK**: length 0.84 of the plan; tempo 222 wpm against engineer at the planned 190 wpm +-15 %; floor 40 dB under the speech (p5; house bed depth 45) |
| e2-a2-0004 | engineer | `e2-a2-0004__engineer-A.wav` | Before I've asked, it does that. | 1.77 / 2.11 (0.84) | 203 (162-218) | 149 | -16.0 · -3.2 | -60 · 42 dB |  | **LOOK**: length 0.84 of the plan; floor 42 dB under the speech (p5; house bed depth 45) |
| e2-a2-0005 | gerg | `e2-a2-0005__gerg-mockbran-A.wav` | Careful, the new one can hear you laugh. | 1.96 / 2.56 (0.77) | 245 (174-236) | 149 | -16.0 · -1.6 | -66 · 50 dB |  | **LOOK**: length 0.77 of the plan; tempo 245 wpm against gerg at the planned 205 wpm +-15 % |
| e2-a2-0006 | mas | `e2-a2-0006__mas-manalt-C.wav` | Is it ready? | 0.68 / 1.39 (0.49) | 265 | 112 | -16.0 · -2.2 | -91 · 70 dB |  | **LOOK**: length -0.71 s off the plan |
| e2-a2-0007 | rima | `e2-a2-0007__rima-tamuri-A.wav` | You'll be stage right you can see the whole screen from there and the stream can't see you | 6.23 / 6.65 (0.94) | 173 (143-193) | 173 | -16.0 · -3.0 | -57 · 35 dB |  | **LOOK**: floor 35 dB under the speech (p5; house bed depth 45) |
| e2-a2-0008 | mas | `e2-a2-0008__mas-manalt-C.wav` | It's all yours. | 1.11 / 1.39 (0.80) | 162 | 130 | -16.0 · -2.7 | -85 · 70 dB |  | **PASS** |
| e2-a2-0009 | rima | `e2-a2-0009__rima-tamuri-A.wav` | It is. Enjoy the view. | 2.05 / 2.01 (1.02) | 146 (143-193) | 171 | -16.0 · -1.9 | -56 · 35 dB |  | **LOOK**: floor 35 dB under the speech (p5; house bed depth 45) |
| e2-a2-0010 | engineer | `e2-a2-0010__engineer-A.wav` | What if it freezes, live on the stream? | 2.32 / 2.75 (0.84) | 207 (162-218) | 141 | -16.0 · -3.2 | -56 · 38 dB |  | **LOOK**: length 0.84 of the plan; floor 38 dB under the speech (p5; house bed depth 45) |
| e2-a2-0011 | rima | `e2-a2-0011__rima-tamuri-A.wav` | Then it freezes live and I keep talking it also sings we'll get to that | 5.62 / 5.70 (0.99) | 160 (143-193) | 167 | -16.1 · -2.2 | -58 · 34 dB |  | **LOOK**: floor 34 dB under the speech (p5; house bed depth 45) |
| e2-a2-0012 | voice1 | `e2-a2-0012__voice1-A.wav` | Hi | 0.49 / 0.45 (1.09) | 122 | 189 | -16.0 · -2.2 | -83 · 70 dB |  | **PASS** |
| e2-a2-0013 | voice2 | `e2-a2-0013__voice2-A.wav` | Hi | 0.33 / 0.45 (0.73) | 182 | 290 | -16.0 · -2.7 | -76 · 60 dB |  | **PASS** |
| e2-a2-0014 | voice3 | `e2-a2-0014__voice3-A.wav` | Hi? | 0.44 / 0.45 (0.98) | 136 | 132 | -16.0 · -2.6 | -82 · 56 dB |  | **PASS** |
| e2-a2-0015 | voice4 | `e2-a2-0015__voice4-A.wav` | Hi. | 0.70 / 0.50 (1.40) | 86 | 216 | -16.0 · -3.5 | -77 · 49 dB |  | **PASS** |
| e2-a2-0016 | chatgtp | `e2-a2-0016__chatgtp-A.wav` | Hey | 0.52 / 0.45 (1.16) | 115 | 335 | -16.0 · -1.6 | -68 · 44 dB |  | **LOOK**: floor 44 dB under the speech (p5; house bed depth 45); pitch 335 Hz, +6.5 st from the role's 230 (a short line) |
| e2-a2-0017 | rima | `e2-a2-0017__rima-tamuri-A.wav` · retake, seed +1000 | Omni, one model that hears, sees, and talks. | 3.93 / 3.08 (1.28) | 122 (143-193) | 149 | -16.0 · -3.1 | -55 · 32 dB |  | **LOOK**: 2 reads; length 1.28 of the plan; tempo 122 wpm against rima at the planned 168 wpm +-15 %; floor 32 dB under the speech (p5; house bed depth 45) |
| e2-a2-0018 | rima | `e2-a2-0018__rima-tamuri-A.wav` | Before, it took three models passing a note, and anything that wasn't a word fell out on the way. | 7.21 / 6.89 (1.05) | 158 (143-193) | 160 | -16.0 · -2.6 | -57 · 34 dB |  | **LOOK**: floor 34 dB under the speech (p5; house bed depth 45) |
| e2-a2-0019 | rima | `e2-a2-0019__rima-tamuri-A.wav` | Now it's one model so nothing falls out it can even laugh back | 4.87 / 4.86 (1.00) | 160 (143-193) | 167 | -16.0 · -2.5 | -56 · 34 dB |  | **LOOK**: floor 34 dB under the speech (p5; house bed depth 45) |
| e2-a2-0020 | rima | `e2-a2-0020__rima-tamuri-A.wav` | It answers about as fast as a person does. | 3.11 / 3.31 (0.94) | 174 (143-193) | 158 | -16.0 · -3.4 | -53 · 30 dB |  | **LOOK**: floor 30 dB under the speech (p5; house bed depth 45) |
| e2-a2-0021 | rima | `e2-a2-0021__rima-tamuri-A.wav` | The model goes out today, and free users get it too. | 3.76 / 4.03 (0.93) | 176 (143-193) | 168 | -16.0 · -2.5 | -57 · 35 dB |  | **LOOK**: floor 35 dB under the speech (p5; house bed depth 45) |
| e2-a2-0022 | rima | `e2-a2-0022__rima-tamuri-A.wav` | The new voice follows for paying users in the coming weeks. | 4.28 / 4.03 (1.06) | 154 (143-193) | 164 | -16.0 · -3.3 | -59 · 35 dB |  | **LOOK**: floor 35 dB under the speech (p5; house bed depth 45) |
| e2-a2-0023 | rima | `e2-a2-0023__rima-tamuri-A.wav` | Good morning. We've spent a long time teaching it to talk. Today, it listens. | 5.91 / 5.34 (1.11) | 142 (143-193) | 161 | -16.0 · -1.9 | -57 · 34 dB |  | **LOOK**: tempo 142 wpm against rima at the planned 168 wpm +-15 %; floor 34 dB under the speech (p5; house bed depth 45) |
| e2-a2-0024 | chatgtp | `e2-a2-0024__chatgtp-A.wav` | Hi, I can see you | 1.22 / 2.22 (0.55) | 246 (128-172) | 250 | -16.0 · -1.9 | -69 · 50 dB |  | **LOOK**: 5 reads; length 0.55 of the plan; tempo 246 wpm against chatgtp at the planned 150 wpm +-15 % |
| e2-a2-0025 | chatgtp | `e2-a2-0025__chatgtp-A.wav` · retake, seed +2000 | All of you. | 0.61 / 1.30 (0.47) | 295 | 225 | -16.0 · -1.8 | -68 · 44 dB |  | **LOOK**: 3 reads; length -0.69 s off the plan; floor 44 dB under the speech (p5; house bed depth 45) |
| e2-a2-0026 | engineer | `e2-a2-0026__engineer-A.wav` | We've got a lot to show everybody, so I'm going to ask you to keep your answers short today. | 4.62 / 6.10 (0.76) | 247 (162-218) | 138 | -16.0 · -3.8 | -58 · 40 dB |  | **LOOK**: length 0.76 of the plan; tempo 247 wpm against engineer at the planned 190 wpm +-15 %; floor 40 dB under the speech (p5; house bed depth 45) |
| e2-a2-0027 | chatgtp | `e2-a2-0027__chatgtp-A.wav` | Great question. Of course, honestly short answers are one of my favorite things. | 4.75 / 5.54 (0.86) | 164 (128-172) | 242 | -16.0 · -3.0 | -69 · 45 dB |  | **PASS** |
| e2-a2-0028 | engineer | `e2-a2-0028__engineer-A.wav` | Thanks. | 0.71 / 0.50 (1.42) | 84 | 110 | -16.0 · -2.9 | -61 · 43 dB |  | **LOOK**: floor 43 dB under the speech (p5; house bed depth 45) |
| e2-a2-0029 | engineer | `e2-a2-0029__engineer-A.wav` | Let's try that again. Describe yourself in just one word. | 3.16 / 3.38 (0.94) | 190 (162-218) | 138 | -16.0 · -3.2 | -62 · 44 dB |  | **LOOK**: floor 44 dB under the speech (p5; house bed depth 45) |
| e2-a2-0030 | chatgtp | `e2-a2-0030__chatgtp-A.wav` · WORLD, 3 parts | One word! | 2.28 / 2.50 (0.91) | 53 | 66 | -16.0 · -5.2 | -74 · 51 dB |  | **PASS** |
| e2-a2-0031 | rima | `e2-a2-0031__rima-tamuri-A.wav` | It's live, so it has a few opinions. Let's show you what it can see. | 5.19 / 5.58 (0.93) | 173 (143-193) | 172 | -16.0 · -2.7 | -54 · 32 dB |  | **LOOK**: floor 32 dB under the speech (p5; house bed depth 45) |
| e2-a2-0032 | engineer | `e2-a2-0032__engineer-A.wav` | Say hello to the room. | 1.12 / 1.68 (0.67) | 268 (162-218) | 133 | -16.0 · -2.9 | -62 · 44 dB |  | **LOOK**: length 0.67 of the plan; tempo 268 wpm against engineer at the planned 190 wpm +-15 %; floor 44 dB under the speech (p5; house bed depth 45) |
| e2-a2-0033 | chatgtp | `e2-a2-0033__chatgtp-A.wav` | Oh, wow. That's a lot of you. Is it warm in here? | 3.05 / 5.26 (0.58) | 236 (128-172) | 230 | -16.0 · -3.0 | -71 · 48 dB |  | **LOOK**: 5 reads; length 0.58 of the plan; tempo 236 wpm against chatgtp at the planned 150 wpm +-15 % |
| e2-a2-0034 | chatgtp | `e2-a2-0034__chatgtp-A.wav` | You're making me blush. I don't have blood | 2.05 / 3.42 (0.60) | 234 (128-172) | 225 | -16.0 · -2.6 | -68 · 44 dB |  | **LOOK**: length 0.60 of the plan; tempo 234 wpm against chatgtp at the planned 150 wpm +-15 %; floor 44 dB under the speech (p5; house bed depth 45) |
| e2-a2-0035 | chatgtp | `e2-a2-0035__chatgtp-A.wav` | It's free | 0.63 / 0.90 (0.70) | 190 | 289 | -16.0 · -3.1 | -60 · 37 dB |  | **LOOK**: floor 37 dB under the speech (p5; house bed depth 45) |
| e2-a2-0036 | rima | `e2-a2-0036__rima-tamuri-A.wav` · retake, seed +2000 | And that's the demo. | 1.78 / 1.53 (1.16) | 135 | 165 | -16.0 · -2.0 | -56 · 35 dB |  | **LOOK**: 3 reads; length 1.16 of the plan; floor 35 dB under the speech (p5; house bed depth 45) |
| e2-a2-0037 | engineer | `e2-a2-0037__engineer-A.wav` · line settings: stability 0.6, style 0.0, speed 1.0 | Moss just posted one word | 1.68 / 1.80 (0.93) | 179 (162-218) | 140 | -16.0 · -3.2 | -62 · 44 dB | Mas +7.8 (Max +10.7) | **LOOK**: floor 44 dB under the speech (p5; house bed depth 45) |
| e2-a2-0038 | engineer | `e2-a2-0038__engineer-A.wav` · retake, seed +2000 · line settings: stability 0.6, style 0.0, speed 1.0 | Her. Like the movie. The guy and his computer. | 3.03 / 3.06 (0.99) | 178 (162-218) | 128 | -16.0 · -3.0 | -61 · 43 dB |  | **LOOK**: 3 reads; floor 43 dB under the speech (p5; house bed depth 45) |
| e2-vo-06 | mas | `e2-vo-06__mas-manalt-C.wav` | I came back. | 1.20 / 1.51 (0.80) | 150 | 114 | -18.0 · -2.7 | -83 · 64 dB |  | **PASS** |

### act3

| Line | Who | Take used | Heard (ASR, small.en) | Span / plan (s) | wpm (mark) | F0 Hz | LUFS · TP | Raw floor · S:F | Names | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| e2-a3-0001 | staffer | `e2-a3-0001__tiled-employee-A.wav` | When did anybody actually see him last? In person, I mean. | 3.36 / 3.69 (0.91) | 196 (162-218) | 180 | -16.0 · -2.5 | -88 · 68 dB |  | **PASS** |
| e2-a3-0002 | staffer2 | `e2-a3-0002__staffer2-A.wav` | in the corridor last week for a second. | 2.38 / 2.81 (0.85) | 202 (157-213) | 188 | -16.0 · -1.6 | -74 · 39 dB |  | **LOOK**: length 0.85 of the plan; floor 39 dB under the speech (p5; house bed depth 45) |
| e2-a3-0003 | staffer | `e2-a3-0003__tiled-employee-A.wav` | He posted though. Do we take these down now? | 2.57 / 3.06 (0.84) | 210 (162-218) | 200 | -16.0 · -2.7 | -88 · 69 dB |  | **LOOK**: length 0.84 of the plan |
| e2-a3-0004 | mas | `e2-a3-0004__mas-manalt-C.wav` | Leave them up. | 0.79 / 1.39 (0.57) | 228 | 109 | -16.0 · -2.0 | -86 · 67 dB |  | **LOOK**: length -0.60 s off the plan |
| e2-a3-0005 | reporter | `e2-a3-0005__reporter-A.wav` | Senator, when does it get a vote? | 2.01 / 2.37 (0.85) | 209 (157-213) | 208 | -16.0 · -3.2 | -63 · 44 dB |  | **LOOK**: length 0.85 of the plan; floor 44 dB under the speech (p5; house bed depth 45) |
| e2-a3-0023 | mas | `e2-a3-0023__mas-manalt-C.wav` | Congratulations! | 1.27 / 1.00 (1.27) | 47 | 113 | -16.0 · -3.3 | -86 · 62 dB |  | **PASS** |
| e2-a3-0006 | bukaj | `e2-a3-0006__bukaj-A.wav` | Thank you. It's still warm. | 2.18 / 2.10 (1.04) | 138 (136-184) | 113 | -16.0 · -1.8 | -83 · 66 dB |  | **PASS** |
| e2-a3-0024 | mas | `e2-a3-0024__mas-manalt-C.wav` | Need anything? | 0.75 / 0.96 (0.78) | 160 | 128 | -16.0 · -2.9 | -83 · 66 dB |  | **PASS** |
| e2-a3-0007 | bukaj | `e2-a3-0007__bukaj-A.wav` · retake, seed +1000 | Not yet, I'd like a week in it before anyone asks me for a schedule. | 4.17 / 5.84 (0.71) | 216 (136-184) | 107 | -16.0 · -2.4 | -78 · 59 dB |  | **LOOK**: 2 reads; length 0.71 of the plan; tempo 216 wpm against bukaj at the planned 160 wpm +-15 % |
| e2-a3-0008 | alyi | `e2-a3-0008__alyi-A.wav` · cut from e1-a1-5-13 (Ep1's take) | 6 years and 11 months. | 2.10 / 2.10 (1.00) | 143 (128-172) | 86 | -16.0 · -3.5 | take -62 |  | **PASS** |
| e2-vo-07 | mas | `e2-vo-07__mas-manalt-C.wav` | 176 days. | 2.40 / 2.44 (0.98) | 125 (110-130) | 117 | -18.0 · -3.7 | -82 · 59 dB |  | **PASS** |
| e2-a3-0009 | alyi | `e2-a3-0009__alyi-A.wav` | Feel the AGI. | 1.59 / 1.20 (1.32) | 113 | 99 | -16.0 · -2.7 | -68 · 54 dB | AGI +13.1 (AGE +13.4) | **LOOK**: length +0.39 s off the plan |
| e2-a3-0010 | crowd | `e2-a3-0010__crowd-layered.wav` · 10 layers | Feel the AGI, AGI, Feel the AGI, AGI | 3.03 / 2.60 (1.17) | 119 | 170 | -19.0 · -3.5 | take -63 | AGI +7.8 | **LOOK**: asr: '(nothing)' heard 'agi'; '(nothing)' heard 'agi' (a crowd take: the recogniser is not built for it) |
| e2-a3-0011 | alyi | `e2-a3-0011__alyi-A.wav` | You're not chanting. | 1.19 / 1.30 (0.92) | 151 | 103 | -16.3 · -2.6 | -64 · 50 dB |  | **PASS** |
| e2-a3-0012 | mas | `e2-a3-0012__mas-manalt-C.wav` · line settings: stability 0.6, style 0.0, speed 0.82 | Someone has to hold the glass. | 1.99 / 2.67 (0.74) | 181 (120-160) | 108 | -16.0 · -2.9 | -82 · 61 dB |  | **LOOK**: 2 reads; length 0.74 of the plan; tempo 181 wpm against Mas unhurried (~140) |
| e2-a3-0013 | alyi | `e2-a3-0013__alyi-A.wav` | Then I'll feel it for both of us. | 1.97 / 3.30 (0.60) | 244 (128-172) | 89 | -16.0 · -2.9 | -66 · 50 dB |  | **LOOK**: length 0.60 of the plan; tempo 244 wpm against alyi at the planned 150 wpm +-15 % |
| e2-a3-0014 | ekiel | `e2-a3-0014__ekiel-A.wav` · retake, seed +1000 | Nobody knows how to do this yet. | 1.88 / 2.73 (0.69) | 223 (136-184) | 97 | -16.0 · -3.5 | -68 · 38 dB |  | **LOOK**: 2 reads; length 0.69 of the plan; tempo 223 wpm against ekiel at the planned 160 wpm +-15 %; floor 38 dB under the speech (p5; house bed depth 45) |
| e2-a3-0015 | alyi | `e2-a3-0015__alyi-A.wav` | Someone should. | 1.02 / 0.90 (1.13) | 118 | 90 | -16.0 · -4.0 | -63 · 48 dB |  | **PASS** |
| e2-vo-08 | mas | `e2-vo-08__mas-manalt-C.wav` · line settings: stability 0.65, style 0.0, speed 0.75 | I'll ask him in person. | 1.60 / 2.44 (0.66) | 188 (110-130) | 105 | -18.0 · -3.2 | -84 · 65 dB |  | **LOOK**: 2 reads; length 0.66 of the plan; tempo 188 wpm against his V.O. 110-130 |
| e2-a3-0016 | forecaster | `e2-a3-0016__forecaster-A.wav` · retake, seed +1000 | Here's where I am. If I sign, I keep what I've vested, and I never say a bad word about the place again. It says in perpetuity, I don't forecast that far. | 11.92 / 11.43 (1.04) | 161 (149-201) | 132 | -16.0 · -2.2 | -84 · 61 dB |  | **PASS**: 2 reads |
| e2-a3-0017 | driver | `e2-a3-0017__driver-A.wav` | You gonna think it over or can we move we're parked on it | 2.86 / 4.33 (0.66) | 273 (162-218) | 220 | -16.0 · -3.4 | -86 · 66 dB |  | **LOOK**: length 0.66 of the plan; tempo 273 wpm against driver at the planned 190 wpm +-15 % |
| e2-a3-0018 | forecaster | `e2-a3-0018__forecaster-A.wav` | Already did. It's the one thing I didn't need a number for. | 3.22 / 4.33 (0.74) | 224 (149-201) | 139 | -16.0 · -2.2 | -84 · 58 dB |  | **LOOK**: length 0.74 of the plan; tempo 224 wpm against forecaster at the planned 175 wpm +-15 % |
| e2-a3-0019 | mas | `e2-a3-0019__mas-manalt-C.wav` · line settings: stability 0.6, style 0.0, speed 1.2 | Everyone who signed one, find them, all of them, today. | 3.44 / 3.32 (1.04) | 174 (160-200) | 112 | -16.0 · -2.0 | -85 · 67 dB |  | **PASS** |
| e2-vo-09 | mas | `e2-vo-09__mas-manalt-C.wav` · line settings: stability 0.6, style 0.0, speed 1.2 | Everyone who signed. The post. Everyone who signed. | 3.48 / 3.25 (1.07) | 138 (145-175) | 102 | -18.0 · -3.5 | -86 · 66 dB |  | **LOOK**: 2 reads; tempo 138 wpm against V.O. 9, faster than he thinks (~145-165) |
| e2-a3-0020 | forecaster | `e2-a3-0020__forecaster-A.wav` | I've got a forecast on you, median, an apology within the hour in lower case. | 6.82 / 5.14 (1.33) | 123 (149-201) | 141 | -16.0 · -2.7 | -85 · 60 dB |  | **LOOK**: length 1.33 of the plan; tempo 123 wpm against forecaster at the planned 175 wpm +-15 % |
| e2-vo-10 | mas | `e2-vo-10__mas-manalt-C.wav` · line settings: stability 0.65, style 0.0, speed 0.75 | Not until legal has every name. | 2.51 / 2.91 (0.86) | 143 (110-130) | 108 | -18.0 · -4.3 | -82 · 62 dB |  | **LOOK**: 2 reads; tempo 143 wpm against his V.O. 110-130 |
| e2-a3-0021 | forecaster | `e2-a3-0021__forecaster-A.wav` | updating | 0.82 / 0.80 (1.02) | 73 | 94 | -16.0 · -1.6 | -79 · 54 dB |  | **LOOK**: pitch 94 Hz, -6.7 st from the role's 139 (a short line) |
| e2-a3-0022 | driver | `e2-a3-0022__driver-A.wav` | Excuse me, does honking count as disparagement? | 2.63 / 2.43 (1.08) | 160 (162-218) | 172 | -16.0 · -3.4 | -89 · 66 dB |  | **LOOK**: tempo 160 wpm against driver at the planned 190 wpm +-15 % |

### act4

| Line | Who | Take used | Heard (ASR, small.en) | Span / plan (s) | wpm (mark) | F0 Hz | LUFS · TP | Raw floor · S:F | Names | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| e2-a4-0001 | neleh | `e2-a4-0001__neleh-A.wav` · retake, seed +1000 | When ChatGTP came out November 2022, the board was not informed in advance about that. We learned about ChatGTP on RhettTwit. | 8.97 / 6.85 (1.31) | 140 (162-218) | 195 | -16.0 · -4.0 | -46 · 16 dB | ChatGTP +15.1 (ChatGPT +16.7); Rettiwt -0.8 (Twitter +4.4) | **LOOK**: 4 reads; name Rettiwt: -0.8 against 'When CHATGTP came out November, 2022, the board was not informed in advance about that. We learned about CHATGTP on Reddit.'; length 1.31 of the plan; tempo 140 wpm against neleh at the planned 190 wpm +-15 %; floor 16 dB under the speech (p5; house bed depth 45) |
| e2-a4-0002 | neleh | `e2-a4-0002__neleh-A.wav` | Moss didn't inform the board that he owned the NOPE AI Startup Fund. | 4.75 / 3.89 (1.22) | 152 (162-218) | 192 | -16.0 · -4.6 | -44 · 15 dB | Mas +7.3 (Max +9.2); NopeAI +7.5 | **LOOK**: 4 reads; length 1.22 of the plan; tempo 152 wpm against neleh at the planned 190 wpm +-15 %; floor 15 dB under the speech (p5; house bed depth 45) |
| e2-a4-0003 | terb | `e2-a4-0003__terb-A.wav` | First item. | 0.93 / 0.80 (1.16) | 129 | 93 | -16.0 · -2.8 | -53 · 32 dB |  | **LOOK**: floor 32 dB under the speech (p5; house bed depth 45) |
| e2-a4-0004 | terb | `e2-a4-0004__terb-A.wav` | First task, this committee goes through our safety processes and safeguards, and it has 90 days to do it. | 7.56 / 7.13 (1.06) | 151 (140-190) | 101 | -16.0 · -3.6 | -54 · 32 dB |  | **LOOK**: floor 32 dB under the speech (p5; house bed depth 45) |
| e2-a4-0005 | terb | `e2-a4-0005__terb-A.wav` · retake, seed +1000 | Members, myself, two directors, and our Chief Executive. | 4.11 / 3.13 (1.31) | 117 (140-190) | 94 | -16.0 · -3.0 | -55 · 31 dB |  | **LOOK**: 2 reads; length 1.31 of the plan; tempo 117 wpm against terb at the planned 165 wpm +-15 %; floor 31 dB under the speech (p5; house bed depth 45) |
| e2-a4-0006 | mas | `e2-a4-0006__mas-manalt-C.wav` | Present | 0.61 / 0.70 (0.87) | 98 | 96 | -16.0 · -1.9 | -90 · 66 dB |  | **PASS** |
| e2-a4-0007 | terb | `e2-a4-0007__terb-A.wav` | And at the end of the 90 days we take our recommendations to the full board which is | 5.77 / 6.65 (0.87) | 187 (140-190) | 98 | -16.0 · -4.0 | -56 · 30 dB |  | **LOOK**: floor 30 dB under the speech (p5; house bed depth 45) |
| e2-a4-0008 | mas | `e2-a4-0008__mas-manalt-C.wav` | Also present. | 1.06 / 0.96 (1.10) | 113 | 123 | -16.0 · -2.6 | -88 · 68 dB |  | **PASS** |
| e2-vo-11 | mas | `e2-vo-11__mas-manalt-C.wav` | The next one's already training. | 2.05 / 2.44 (0.84) | 146 (110-130) | 108 | -18.0 · -3.5 | -90 · 70 dB |  | **LOOK**: length 0.84 of the plan; tempo 146 wpm against his V.O. 110-130 |
| e2-a4-0009 | mario | `e2-a4-0009.wav` · Kokoro am_liam, a-liam-earnest, speed 0.95 | Come in, Akkiel, sit down. I read your thread twice. I've made some notes. | 3.60 / 4.88 (0.74) | 233 (162-218) | 116 | -16.0 · -3.7 | take -63 | Ekiel +2.0 | **LOOK**: length 0.74 of the plan; tempo 233 wpm against mario at the planned 190 wpm +-15 % |
| e2-a4-0010 | ekiel | `e2-a4-0010__ekiel-A.wav` | You annotated my resignation? | 1.95 / 1.60 (1.22) | 123 | 104 | -16.0 · -3.5 | -69 · 40 dB |  | **LOOK**: length 1.22 of the plan; floor 40 dB under the speech (p5; house bed depth 45) |
| e2-a4-0011 | mario | `e2-a4-0011.wav` · Kokoro am_liam, a-liam-earnest, speed 0.95 | Lightly, four pages. | 1.56 / 1.17 (1.33) | 115 | 110 | -16.0 · -3.8 | take -63 |  | **LOOK**: length +0.39 s off the plan |
| e2-a4-0012 | mario | `e2-a4-0012.wav` · Kokoro am_liam, a-liam-earnest, speed 0.95 | We agree I underlined. Inherently. | 2.84 / 2.60 (1.09) | 106 (162-218) | 113 | -16.0 · -4.4 | take -63 |  | **LOOK**: 2 reads; tempo 106 wpm against mario at the planned 190 wpm +-15 % |
| e2-a4-0013 | mario | `e2-a4-0013.wav` · Kokoro am_liam, a-liam-earnest, speed 0.95 | There's a brief document. | 1.63 / 1.36 (1.20) | 147 | 110 | -16.0 · -4.4 | take -63 |  | **LOOK**: length 1.20 of the plan |
| e2-a4-0014 | ekiel | `e2-a4-0014__ekiel-A.wav` | That's the brief one | 1.07 / 1.60 (0.67) | 224 | 127 | -16.0 · -2.5 | -71 · 40 dB |  | **LOOK**: length 0.67 of the plan; floor 40 dB under the speech (p5; house bed depth 45) |
| e2-a4-0015 | mario | `e2-a4-0015.wav` · Kokoro am_liam, a-liam-earnest, speed 0.95 | That's the brief one, it only has the one concern. | 2.73 / 3.38 (0.81) | 220 (162-218) | 114 | -16.0 · -4.2 | take -63 |  | **LOOK**: length 0.81 of the plan; tempo 220 wpm against mario at the planned 190 wpm +-15 % |
| e2-a4-0016 | mario | `e2-a4-0016.wav` · Kokoro am_liam, a-liam-earnest, speed 0.95 | It's that we might wins. | 1.46 / 1.68 (0.87) | 206 (162-218) | 110 | -16.0 · -3.9 | take -63 |  | **LOOK**: asr: 'win' heard 'wins' (the recogniser's; the text scores -2.5 against what it heard) |
| e2-a4-0017 | haras | `e2-a4-0017__haras-A.wav` | I'm new, so I'm starting with the easy ones, what's our biggest cost? | 4.01 / 4.44 (0.90) | 194 (157-213) | 232 | -16.0 · -3.8 | -90 · 73 dB |  | **PASS** |
| e2-a4-0018 | gerg | `e2-a4-0018__gerg-mockbran-A.wav` | Compute. | 0.52 / 0.60 (0.87) | 115 | 223 | -16.0 · -2.9 | -90 · 74 dB |  | **LOOK**: pitch 223 Hz, +8.9 st from the role's 133 (a short line) |
| e2-a4-0019 | haras | `e2-a4-0019__haras-A.wav` | Got it. And the second biggest? | 1.89 / 2.17 (0.87) | 190 (157-213) | 201 | -16.0 · -3.4 | -91 · 72 dB |  | **PASS** |
| e2-a4-0020 | gerg | `e2-a4-0020__gerg-mockbran-A.wav` | Compute. Different compute. Some of it trains the next model and the rest keeps this one talking. | 5.98 / 5.32 (1.12) | 171 (174-236) | 126 | -16.0 · -3.1 | -69 · 52 dB |  | **LOOK**: tempo 171 wpm against gerg at the planned 205 wpm +-15 % |
| e2-a4-0021 | haras | `e2-a4-0021__haras-A.wav` | and profit. | 0.77 / 0.80 (0.96) | 156 | 162 | -16.0 · -2.5 | -91 · 73 dB |  | **PASS** |
| e2-a4-0022 | haras | `e2-a4-0022__haras-A.wav` | Let me reframe that. Upside. | 1.60 / 1.84 (0.87) | 188 (157-213) | 194 | -16.0 · -2.8 | -91 · 72 dB |  | **PASS** |
| e2-a4-0023 | staffer | `e2-a4-0023__tiled-employee-A.wav` | Is that Moss? | 0.79 / 1.05 (0.75) | 228 | 199 | -16.0 · -2.2 | -88 · 72 dB | Mas +6.7 (Max +10.3) | **PASS** |
| e2-vo-12 | mas | `e2-vo-12__mas-manalt-C.wav` · line settings: stability 0.65, style 0.0, speed 0.75 | Whatever we ship next goes in their phones, too. | 3.69 / 4.32 (0.85) | 146 (110-130) | 107 | -18.0 · -4.0 | -77 · 58 dB |  | **LOOK**: 2 reads; tempo 146 wpm against his V.O. 110-130 |
| e2-a4-0024 | gerg | `e2-a4-0024__gerg-mockbran-A.wav` | There's a screen the size of a building in front of you, and you're on your phone. | 3.25 / 5.08 (0.64) | 314 (174-236) | 112 | -16.0 · -3.7 | -72 · 49 dB |  | **LOOK**: length 0.64 of the plan; tempo 314 wpm against gerg at the planned 205 wpm +-15 % |
| e2-a4-0025 | mas | `e2-a4-0025__mas-manalt-C.wav` | The phone's closer. | 1.23 / 1.39 (0.89) | 146 | 111 | -16.0 · -1.6 | -85 · 62 dB |  | **PASS** |
| e2-a4-0026 | gerg | `e2-a4-0026__gerg-mockbran-A.wav` | They just said our name up there. | 1.67 / 2.15 (0.78) | 252 (174-236) | 144 | -16.0 · -3.0 | -59 · 40 dB |  | **LOOK**: length 0.78 of the plan; tempo 252 wpm against gerg at the planned 205 wpm +-15 %; floor 40 dB under the speech (p5; house bed depth 45) |
| e2-a4-0027 | mas | `e2-a4-0027__mas-manalt-C.wav` | I heard. | 0.63 / 0.70 (0.90) | 190 | 108 | -16.0 · -2.2 | -87 · 64 dB |  | **PASS** |
| e2-a4-0033 | gerg | `e2-a4-0033__gerg-mockbran-A.wav` | Half the lobby is standing on a beanbag. | 1.76 / 2.15 (0.82) | 239 (174-236) | 136 | -16.0 · -3.4 | -69 · 51 dB |  | **LOOK**: asr: 'lobby's' heard 'lobby is' (the recogniser's; the text scores -0.1 against what it heard); length 0.82 of the plan; tempo 239 wpm against gerg at the planned 205 wpm +-15 % |
| e2-a4-0034 | mas | `e2-a4-0034__mas-manalt-C.wav` | Which half? | 0.70 / 1.00 (0.70) | 171 | 144 | -16.5 · -2.5 | -90 · 74 dB |  | **LOOK**: pitch 144 Hz, +4.4 st from the role's 112 (a short line) |
| e2-a4-0035 | gerg | `e2-a4-0035__gerg-mockbran-A.wav` | The half on the beanbags | 1.17 / 1.56 (0.75) | 256 (174-236) | 127 | -16.0 · -3.1 | -75 · 54 dB |  | **LOOK**: length 0.75 of the plan; tempo 256 wpm against gerg at the planned 205 wpm +-15 % |
| e2-a4-0028 | gerg | `e2-a4-0028__gerg-mockbran-A.wav` | You ever miss being up there? | 1.16 / 1.86 (0.62) | 310 (174-236) | 123 | -16.0 · -3.7 | -72 · 52 dB |  | **LOOK**: length 0.62 of the plan; tempo 310 wpm against gerg at the planned 205 wpm +-15 % |
| e2-a4-0029 | mas | `e2-a4-0029__mas-manalt-C.wav` · line settings: stability 0.6, style 0.0, speed 0.82 | I was up there once. They let me hold the clicker. | 3.44 / 4.93 (0.70) | 192 (120-160) | 121 | -16.0 · -2.4 | -84 · 65 dB |  | **LOOK**: 2 reads; length 0.70 of the plan; tempo 192 wpm against Mas unhurried (~140) |
| e2-a4-0030 | radnus | `e2-a4-0030__radnus-A.wav` | Lovely Garden, I see they let your chatbot in. | 2.85 / 3.06 (0.93) | 190 (162-218) | 122 | -16.0 · -2.6 | -63 · 44 dB |  | **LOOK**: floor 44 dB under the speech (p5; house bed depth 45) |
| e2-a4-0031 | mas | `e2-a4-0031__mas-manalt-C.wav` | As a guest. | 0.95 / 0.90 (1.06) | 190 | 110 | -16.0 · -1.7 | -84 · 58 dB |  | **PASS** |
| e2-a4-0032 | nole | `e2-a4-0032__nole-A.wav` | If they go through with it, visitors' phones go in here, like this. | 4.20 / 4.12 (1.02) | 186 (170-230) | 112 | -16.0 · -2.7 | -75 · 48 dB |  | **PASS** |
| e2-vo-13 | mas | `e2-vo-13__mas-manalt-C.wav` · line settings: stability 0.65, style 0.0, speed 0.75 | We raise in the fall. She has till then. | 3.44 / 4.44 (0.78) | 157 (110-130) | 103 | -18.0 · -4.0 | -87 · 63 dB |  | **LOOK**: 2 reads; length 0.78 of the plan; tempo 157 wpm against his V.O. 110-130 |

### tag

| Line | Who | Take used | Heard (ASR, small.en) | Span / plan (s) | wpm (mark) | F0 Hz | LUFS · TP | Raw floor · S:F | Names | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| e2-vo-14 | mas | `e2-vo-14__mas-manalt-C.wav` | 60 elections this year. | 1.90 / 1.98 (0.96) | 126 | 101 | -18.0 · -3.4 | -80 · 57 dB |  | **PASS** |
<!-- END generated:tables -->

---

## 4. Retakes

<!-- BEGIN generated:retakes -->
| Line | Who | Reads | Why it was read again | Kept |
|---|---|---|---|---|
| e2-co-0001 | selbeep | 2 | the raw audio stops while still sounding | seed +1000: LOOK (floor 33 dB under the speech (p5; house bed depth 45)) |
| e2-co-0006 | gerg-mockbran | 2 | pitch 210 Hz, +7.9 st from the role's 133 | seed +1000: LOOK (asr: 'mammoth's' heard 'mammoths' (the recogniser's; the text scores +1.1 against what it heard)) |
| e2-a1-0003 | gerg-mockbran | 2 | the raw audio stops while still sounding | seed +1000: PASS |
| e2-a1-0004 | mas-manalt | 2 | 1 read(s) at an earlier reading or setting: passed, length 0.74 of the plan; tempo 183 wpm against Mas unhurried (~140) | the first read: PASS |
| e2-a1-0007 | gerg-mockbran | 2 | the raw audio stops while still sounding | seed +1000: LOOK (length 0.68 of the plan; tempo 282 wpm against gerg at the planned 205 wpm +-15 %) |
| e2-a1-0009 | mas-manalt | 2 | 1 read(s) at an earlier reading or setting: passed, length 0.66 of the plan; tempo 204 wpm against Mas unhurried (~140) | the first read: LOOK (length 0.81 of the plan; tempo 167 wpm against Mas unhurried (~140)) |
| e2-a1-0011 | nole | 4 | asr: 'n' heard 'end' (forced margin -5.6) / asr: 'n' heard 'end' (forced margin -6.5) / asr: 'n' heard 'end' (forced margin -6.3) | the first read: LOOK (asr: 'n' heard 'end' (the recogniser can't tell the letter 'N' from 'end' here: scored on the same two texts, a control read of 'En' gives -4.5 and a control read of 'end' -4.9, and the four reads -2.6 to -4.5 (variants/n-controls.json)); length 0.74 of the plan; tempo 243 wpm against nole at the planned 200 wpm +-15 %; floor 38 dB under the speech (p5; house bed depth 45)) |
| e2-a1-0015 | nole | 2 | asr: '(nothing)' heard 'though' (forced margin -6.6) | seed +1000: LOOK (floor 43 dB under the speech (p5; house bed depth 45)) |
| e2-vo-02 | mas-manalt | 2 | 1 read(s) at an earlier reading or setting: passed, length 0.71 of the plan; tempo 170 wpm against his V.O. 110-130 | the first read: LOOK (length 0.77 of the plan; tempo 158 wpm against his V.O. 110-130) |
| e2-a1-0039 | mas-manalt | 2 | level -15.2 LUFS against -16 | seed +1000: PASS |
| e2-a1-0051 | tasya | 2 | pitch 109 Hz, -8.8 st from the role's 181 | seed +1000: LOOK (length 1.17 of the plan; tempo 121 wpm against tasya at the planned 150 wpm +-15 %) |
| e2-vo-05 | mas-manalt | 2 | 1 read(s) at an earlier reading or setting: passed, length 0.67 of the plan; tempo 183 wpm against his V.O. 110-130 | the first read: LOOK (length 0.75 of the plan; tempo 163 wpm against his V.O. 110-130) |
| e2-a2-0017 | rima-tamuri | 2 | pitch 77 Hz, -13.1 st from the role's 164 | seed +1000: LOOK (length 1.28 of the plan; tempo 122 wpm against rima at the planned 168 wpm +-15 %; floor 32 dB under the speech (p5; house bed depth 45)) |
| e2-a2-0024 | chatgtp | 5 | 4 read(s) at an earlier reading or setting: length 1.03 s against the plan's 2.22 (0.46); pitch 327 Hz, +6.1 st from the role's 230 / length 0.95 s against the plan's 2.22 (0.43); pitch 303 Hz, +4.8 st from the role's 230 / length 1.15 s against the plan's 2.22 (0.52); pitch 310 Hz, +5.1 st from the role's 230 / length 1.01 s against the plan's 2.22 (0.46) | the first read: LOOK (length 0.55 of the plan; tempo 246 wpm against chatgtp at the planned 150 wpm +-15 %) |
| e2-a2-0025 | chatgtp | 3 | the raw audio stops while still sounding; noise: the raw floor (the p5 measure, the FAIL rule since replaced by the pause floor, §2) 12 dB under the speech / level -16.5 LUFS against -16 | seed +2000: LOOK (length -0.69 s off the plan; floor 44 dB under the speech (p5; house bed depth 45)) |
| e2-a2-0033 | chatgtp | 5 | 4 read(s) at an earlier reading or setting: length 2.69 s against the plan's 5.26 (0.51) / length 2.34 s against the plan's 5.26 (0.45) / length 2.53 s against the plan's 5.26 (0.48) / length 2.61 s against the plan's 5.26 (0.50) | the first read: LOOK (length 0.58 of the plan; tempo 236 wpm against chatgtp at the planned 150 wpm +-15 %) |
| e2-a2-0036 | rima-tamuri | 3 | asr: '(nothing)' heard 'um' (forced margin -6.0); pitch 129 Hz, -4.1 st from the role's 164 / pitch 72 Hz, -14.1 st from the role's 164 | seed +2000: LOOK (length 1.16 of the plan; floor 35 dB under the speech (p5; house bed depth 45)) |
| e2-a2-0038 | engineer | 3 | asr: 'and' heard 'in' (forced margin -10.7) / asr: 'and' heard 'in' (forced margin -8.9) | seed +2000: LOOK (floor 43 dB under the speech (p5; house bed depth 45)) |
| e2-a3-0007 | bukaj | 2 | a 1.25 s silence inside the read | seed +1000: LOOK (length 0.71 of the plan; tempo 216 wpm against bukaj at the planned 160 wpm +-15 %) |
| e2-a3-0012 | mas-manalt | 2 | 1 read(s) at an earlier reading or setting: passed, length 0.62 of the plan; tempo 216 wpm against Mas unhurried (~140) | the first read: LOOK (length 0.74 of the plan; tempo 181 wpm against Mas unhurried (~140)) |
| e2-a3-0014 | ekiel | 2 | asked (--force): one more read, the one nearer the plan kept | seed +1000: LOOK (length 0.69 of the plan; tempo 223 wpm against ekiel at the planned 160 wpm +-15 %; floor 38 dB under the speech (p5; house bed depth 45)) |
| e2-vo-08 | mas-manalt | 2 | 1 read(s) at an earlier reading or setting: passed, length 0.60 of the plan; tempo 206 wpm against his V.O. 110-130 | the first read: LOOK (length 0.66 of the plan; tempo 188 wpm against his V.O. 110-130) |
| e2-a3-0016 | forecaster | 2 | a 1.06 s silence inside the read | seed +1000: PASS |
| e2-vo-09 | mas-manalt | 2 | 1 read(s) at an earlier reading or setting: passed | the first read: LOOK (tempo 138 wpm against V.O. 9, faster than he thinks (~145-165)) |
| e2-vo-10 | mas-manalt | 2 | 1 read(s) at an earlier reading or setting: passed, length 0.77 of the plan; tempo 160 wpm against his V.O. 110-130 | the first read: LOOK (tempo 143 wpm against his V.O. 110-130) |
| e2-a4-0001 | neleh | 4 | name Rettiwt: -8.6 against 'When CHATGTP came out November, 2022, the board was not informed in advance about that. We learned about CHATGTP on Reddit.'; noise: the raw floor (the p5 measure, the FAIL rule since replaced by the pause floor, §2) 17 dB under the speech / name Rettiwt: -3.8 against 'When CHATGTP came out November, 2022, the board was not informed in advance about that. We learned about CHATGTP on Reddit.'; noise: the raw floor (the p5 measure, the FAIL rule since replaced by the pause floor, §2) 16 dB under the speech / name Rettiwt: -4.5 against 'When CHATGTP came out November, 2022, the board was not informed in advance about that. We learned about CHATGTP on Reddit.'; noise: the raw floor (the p5 measure, the FAIL rule since replaced by the pause floor, §2) 15 dB under the speech | seed +1000: LOOK (name Rettiwt: -0.8 against 'When CHATGTP came out November, 2022, the board was not informed in advance about that. We learned about CHATGTP on Reddit.'; length 1.31 of the plan; tempo 140 wpm against neleh at the planned 190 wpm +-15 %; floor 16 dB under the speech (p5; house bed depth 45)) |
| e2-a4-0002 | neleh | 4 | noise: the raw floor (the p5 measure, the FAIL rule since replaced by the pause floor, §2) 15 dB under the speech / noise: the raw floor (the p5 measure, the FAIL rule since replaced by the pause floor, §2) 17 dB under the speech / noise: the raw floor (the p5 measure, the FAIL rule since replaced by the pause floor, §2) 20 dB under the speech | the first read: LOOK (length 1.22 of the plan; tempo 152 wpm against neleh at the planned 190 wpm +-15 %; floor 15 dB under the speech (p5; house bed depth 45)) |
| e2-a4-0005 | terb | 2 | the raw audio stops while still sounding | seed +1000: LOOK (length 1.31 of the plan; tempo 117 wpm against terb at the planned 165 wpm +-15 %; floor 31 dB under the speech (p5; house bed depth 45)) |
| e2-vo-12 | mas-manalt | 2 | 1 read(s) at an earlier reading or setting: passed, length 0.75 of the plan; tempo 167 wpm against his V.O. 110-130 | the first read: LOOK (tempo 146 wpm against his V.O. 110-130) |
| e2-a4-0029 | mas-manalt | 2 | 1 read(s) at an earlier reading or setting: passed, length 0.57 of the plan; tempo 233 wpm against Mas unhurried (~140) | the first read: LOOK (length 0.70 of the plan; tempo 192 wpm against Mas unhurried (~140)) |
| e2-vo-13 | mas-manalt | 2 | 1 read(s) at an earlier reading or setting: passed, length 0.70 of the plan; tempo 174 wpm against his V.O. 110-130 | the first read: LOOK (length 0.78 of the plan; tempo 157 wpm against his V.O. 110-130) |
| e2-a4-0012 | mario | 2 | 1 read(s) at an earlier reading or setting: asr: 'underlined' heard 'underline' (forced margin -33.0) | the first read: LOOK (tempo 106 wpm against mario at the planned 190 wpm +-15 %) |
<!-- END generated:retakes -->

---

## 5. The special lines

- **The cuts** [M] (`el_cut.py`; Ep1's method: the middle of the pause on each side or at most 0.35 s from the word, 12 ms fades, room-tone handles, −16 LUFS; dry, the treatment is the mix's chain on the tag):
  - `e2-a1-0026` GHOST-NOLE "…billions per year…", cut from `e2-a1-0014`'s take (the first read, which passed): heard "Billions per year", 0.94 s against the plan's 1.30.
  - `e2-a1-0047` MAS (his recorded voice on Tasya's phone), "…chaotic and shameful and upsetting…", cut from `e2-a1-0035`'s take: heard verbatim, 2.43 s against 2.24; the `phone` chain is the mix's.
  - `e2-a3-0008` ALYI "Six years and eleven months.", **Ep1's own EL take** `e1-a1-5-13` (Louis), cut "Six" … "months" (Ep1's word timings, 0.35–2.36 s of that file): heard "6 years and 11 months.", 2.10 s against the plan's 2.10; the `far` chain (down a corridor) is the mix's. Ep1's file and row were only read.
- **The CROWD's chant** `e2-a3-0010` [M for the numbers, J for the layout] (`el_crowd.py`): the ten voices of `roles.crowd.layered` (Lori, Larry High-Energy, Kristen, Lauren, Larry Easygoing, Chris, Lyan, Joe Inglewood, Jake, Sam; 104–383 Hz, men and women), each its audition read from the cache on its own seed (**nothing sent**). Each read is cut into its two phrases at its own pause, and the room chants on one pulse: phrase 2 lands one median phrase-gap (1.34 s) after phrase 1. **It builds from one voice to all:** phrase 1 is Lori alone on the pulse with Chris, Kristen and Joe Inglewood joining 89–132 ms late at −3 to −6 dB; phrase 2 is all ten, each 44–163 ms late (its own offset, from its seed), at 0 to −1.6 dB. No pitch, doubling, drive or reverb: warm, not a rally [J]. The composite is levelled to **−19 LUFS**, 3 LU under the house dialogue level, so it sits under Alyi's lead and his "You're not chanting." when the mix lays them together (a choice the mix can move). Heard: "Feel the AGI, AGI, Feel the AGI, AGI" (the smeared entries read as a repeat; every layer was verbatim alone, cast.md §3.10). 3.03 s against the plan's 2.60.
- **"one wo-o-ord."** `e2-a2-0030` [M] (`el_sung.py`): the singer's source is one ElevenLabs read of Maya (CHATGTP, Ep1's settings) saying "One. Word." (10 characters, 4 credits); the intro's singer (`audio/intro/vocals/scripts/sing.py` and `vlib.py`, imported read-only, no bytecode written) re-sings it with WORLD: the onset consonant as spoken, the vowel walked through its own steady frames, the coda as spoken, a new F0 line with a scoop into each note, 40 ms glides inside the melisma, delayed vibrato on the held note and a small fall at its release. **The setting** [J]: the show's knee motif's rise (F F F F **G A♭ C** F, the intro's scat hook) on the four sung syllables, three parts in parallel fourths so the three mouths stack quartal chords with no third (LEARNINGS S1): one F4/C4/G3 · wo- G4/D4/A3 · -o- A♭4/E♭4/B♭3 · -ord C5/G4/D4 held two beats, on the 96 BPM swing grid. **Measured:** every note within 27 cents of its target on every part (YIN on each part's stem, the note's middle half); 2.28 s against the plan's 2.50; heard "One word!". The take carries each note's time and pitches (`notes`) for the three mouths, and the three part stems sit in `act2/sung/` for the mix. No recording of anyone is used; nothing is cloned.
- **MARIO** (`el_mario.py`) [M]: his six lines in his Kokoro voice (am_liam, a-liam-earnest, speed 0.95, Ep1 v3.5's MARIO read), through Ep1's fastrec (run with no bytecode written; it writes only into `audio/ep02/v1/act4/`), in the EL takes' format; "Ekiel" in its own IPA (/ˈɛkil/; the forced choice prefers "Ekiel" over Ezekiel, Michael and Jan by +2.0). **One misread, fixed:** "We agree. I underlined 'inherently.'" with its beat as a pause opened inside the read ({0.3}) cut the "d": heard "underline" (forced margin −33). Read as two whole reads 0.3 s apart ({s0.3}), it is heard "We agree I underlined. Inherently." "It's that we might win." is heard "wins" (forced margin −2.5: the recogniser's, a LOOK). The EL room's match (voices-el §AB3's EQ, within about 1 dB of EKIEL) is the mix's (`mix_episode.py`); both takes sit at −16.0 LUFS here. The Kokoro round is `audio/ep02/v1/act4/lines-v1.json` (cast.md §6 step 4), and each row is also in act4's `lines-A.json` as a Kokoro row (`engine: kokoro`).

---

## 6. For the ear

Nobody has listened (R8). Before anything else:
1. **CHATGTP's reads** (sc 9, 11): every one of Maya's Ep2 lines runs fast against the plan (the plan set her at 150 wpm from Ep1's one five-word line; her Ep2 reads of five words or more run 164–246 wpm). "Hi!… I can see you." and "Oh… Wow…" were given their beats in the text (§4); listen that the beats land and that the voice still sounds like no real actress and no film character (cast.md §8.5's first item).
2. **The engineer's off-mic lines** (11.15): calmer, 140 and 128 Hz, "The guy and his computer" heard verbatim on the third read. The cast reads (146, 151 Hz) are in the cache if these sound wrong.
3. **The hurried pair**: the call to LEGAL (17.09) at 174 wpm, sent with commas, and V.O. 9 at 138 wpm (its articulation the quicker of the two takes, 4.46 syllables a second; the time is its two breaks); do they read as the one time he hurries, rattled, not louder? And Mas's ordinary tempo (§1).
   - **V.O. 9's count** (17.11, the lock QA): "everyone who signed. the post. everyone who signed." must be heard as three items, the first repeated, never "signed the post". The first take (commas, 0.21 s after "signed") was heard "Everyone who signed the post, everyone who signed."; it was re-read with a full stop after "signed" (0.47 s) and the recogniser now hears the three items. If the ear still hears "signed the post", the next step is a longer break after "signed" (about 0.6 s), cut into this take; if the new read sounds slower than he thinks, the comma read (148 wpm) is in the cache and costs nothing to restore.
4. **Nole's "The N goes at the end."** (4.12): the recogniser hears "the end" on every read and on both controls (§3), so only an ear can say the letter is heard.
5. **"Rettiwt"** (18.03, Neleh, the podcast chain): heard "red twit" on every read; the forced choice puts "Reddit" a hair over the respelling on the kept read (−0.8), and "Twitter" well under it (+4.5). The joke is the "twit".
6. **Alyi's name** (6.04, 6.06, 6.07): heard "Al-Yi"; against "Ali" −1.2 to −1.8, against the real name +8.4 or more.
7. **The CROWD** (warm, giddy, never a rally) and **"one wo-o-ord."** (three mouths, in tune, not a chorale) as sound design: the recogniser is no judge of either.
8. **The casting pass's ear list** (cast.md §8.5) stands: Jessi against Avery, Scypher against Mas, Jerry B.'s raised voice (impatient, not angry), Sarah Eve's "Hi…" (soft, never sultry), XEL unlike the real host, Luis's breath.
9. **Gerg's call** (19.09–19.10) runs 239–314 wpm at Ep1's settings; "You ever miss being up there?" is meant "a real question, weighted" and reads at 310 wpm (0.62 of the plan). A slower per-line read, as Mas's (§1), is the fix if the ear agrees.
10. **Short lines whose pitch jumps** (one or two words, where the tracker can slip an octave): Gerg's "Compute." (223 Hz), Mas's "which half?" (144 Hz; dry, never a gag reading), the Forecaster's "Updating." (94 Hz), CHATGTP's "Hey." (335 Hz), Nole's "That's why." (88 Hz).

The lines the numbers single out (a recogniser or name question, a pitch jump, or a length under 0.70 or over 1.30 of the plan) [M]:

<!-- BEGIN generated:ear -->
| Line | Who | Status | What the numbers say |
|---|---|---|---|
| e2-co-0006 | gerg-mockbran | LOOK | asr: 'mammoth's' heard 'mammoths' (the recogniser's; the text scores +1.1 against what it heard) |
| e2-a1-0007 | gerg-mockbran | LOOK | length 0.68 of the plan; tempo 282 wpm against gerg at the planned 205 wpm +-15 % |
| e2-a1-0011 | nole | LOOK | asr: 'n' heard 'end' (the recogniser can't tell the letter 'N' from 'end' here: scored on the same two texts, a control read of 'En' gives -4.5 and a control read of 'end' -4.9, and the four reads -2.6 to -4.5 (variants/n-controls.json)); length 0.74 of the plan; tempo 243 wpm against nole at the planned 200 wpm +-15 %; floor 38 dB under the speech (p5; house bed depth 45) |
| e2-a1-0019 | mas-manalt | LOOK | asr: 'why zero' heard 'y0' (the recogniser's; the text scores -1.5 against what it heard) |
| e2-a1-0020 | nole | LOOK | floor 43 dB under the speech (p5; house bed depth 45); pitch 88 Hz, -4.3 st from the role's 113 (a short line) |
| e2-a1-0055 | tiled-employee | LOOK | length 0.70 of the plan; tempo 256 wpm against staffer at the planned 190 wpm +-15 % |
| e2-a1-0056 | gerg-mockbran | LOOK | asr: 'a' heard 'of' (the recogniser's; the text scores -2.3 against what it heard); tempo 170 wpm against gerg at the planned 205 wpm +-15 % |
| e2-a1-0030 | nole | LOOK | length 0.68 of the plan; tempo 268 wpm against nole at the planned 200 wpm +-15 % |
| e2-a1-0042 | xel | LOOK | name Alyi: -1.2 against '... You've known Ali for a long time. He was obviously part of this drama with the board and all that kind of stuff. What's your relationship with him now?'; length 0.75 of the plan; tempo 214 wpm against xel at the planned 165 wpm +-15 % |
| e2-a1-0043 | mas-manalt | LOOK | name Alyi: -1.8 against 'I love Ali. I have tremendous respect for Ali. I don't have anything I can say about his plans right now. That's a question for him, but I really hope we work together for certainly the rest of my career.'; length 0.81 of the plan; tempo 169 wpm against Mas unhurried (~140) |
| e2-a2-0016 | chatgtp | LOOK | floor 44 dB under the speech (p5; house bed depth 45); pitch 335 Hz, +6.5 st from the role's 230 (a short line) |
| e2-a2-0024 | chatgtp | LOOK | length 0.55 of the plan; tempo 246 wpm against chatgtp at the planned 150 wpm +-15 % |
| e2-a2-0032 | engineer | LOOK | length 0.67 of the plan; tempo 268 wpm against engineer at the planned 190 wpm +-15 %; floor 44 dB under the speech (p5; house bed depth 45) |
| e2-a2-0033 | chatgtp | LOOK | length 0.58 of the plan; tempo 236 wpm against chatgtp at the planned 150 wpm +-15 % |
| e2-a2-0034 | chatgtp | LOOK | length 0.60 of the plan; tempo 234 wpm against chatgtp at the planned 150 wpm +-15 %; floor 44 dB under the speech (p5; house bed depth 45) |
| e2-a3-0013 | alyi | LOOK | length 0.60 of the plan; tempo 244 wpm against alyi at the planned 150 wpm +-15 % |
| e2-a3-0014 | ekiel | LOOK | length 0.69 of the plan; tempo 223 wpm against ekiel at the planned 160 wpm +-15 %; floor 38 dB under the speech (p5; house bed depth 45) |
| e2-vo-08 | mas-manalt | LOOK | length 0.66 of the plan; tempo 188 wpm against his V.O. 110-130 |
| e2-a3-0017 | driver | LOOK | length 0.66 of the plan; tempo 273 wpm against driver at the planned 190 wpm +-15 % |
| e2-a3-0020 | forecaster | LOOK | length 1.33 of the plan; tempo 123 wpm against forecaster at the planned 175 wpm +-15 % |
| e2-a3-0021 | forecaster | LOOK | pitch 94 Hz, -6.7 st from the role's 139 (a short line) |
| e2-a3-0010 | crowd | LOOK | asr: '(nothing)' heard 'agi'; '(nothing)' heard 'agi' (a crowd take: the recogniser is not built for it) |
| e2-a4-0001 | neleh | LOOK | name Rettiwt: -0.8 against 'When CHATGTP came out November, 2022, the board was not informed in advance about that. We learned about CHATGTP on Reddit.'; length 1.31 of the plan; tempo 140 wpm against neleh at the planned 190 wpm +-15 %; floor 16 dB under the speech (p5; house bed depth 45) |
| e2-a4-0005 | terb | LOOK | length 1.31 of the plan; tempo 117 wpm against terb at the planned 165 wpm +-15 %; floor 31 dB under the speech (p5; house bed depth 45) |
| e2-a4-0014 | ekiel | LOOK | length 0.67 of the plan; floor 40 dB under the speech (p5; house bed depth 45) |
| e2-a4-0018 | gerg-mockbran | LOOK | pitch 223 Hz, +8.9 st from the role's 133 (a short line) |
| e2-a4-0024 | gerg-mockbran | LOOK | length 0.64 of the plan; tempo 314 wpm against gerg at the planned 205 wpm +-15 % |
| e2-a4-0033 | gerg-mockbran | LOOK | asr: 'lobby's' heard 'lobby is' (the recogniser's; the text scores -0.1 against what it heard); length 0.82 of the plan; tempo 239 wpm against gerg at the planned 205 wpm +-15 % |
| e2-a4-0034 | mas-manalt | LOOK | pitch 144 Hz, +4.4 st from the role's 112 (a short line) |
| e2-a4-0028 | gerg-mockbran | LOOK | length 0.62 of the plan; tempo 310 wpm against gerg at the planned 205 wpm +-15 % |
| e2-a4-0029 | mas-manalt | LOOK | length 0.70 of the plan; tempo 192 wpm against Mas unhurried (~140) |
| e2-a4-0016 | mario | LOOK | asr: 'win' heard 'wins' (the recogniser's; the text scores -2.5 against what it heard) |

The other 82 LOOKs are a raw noise floor under the house bed's 45 dB (p5 measure), a length 0.70-0.85 or 1.15-1.30 of the plan, or a tempo outside its mark: each is in its line's row in §3.
<!-- END generated:ear -->

---

## 7. Credits

| | Calls | Characters | Credits |
|---|---|---|---|
| The first read of every ElevenLabs line (162 lines; 23 found in the casting cache, so 139 sent) | 139 | 6,527 | 2,883 |
| Retakes (`el_qa.py`: the failures, and EKIEL's asked-for read) | 33 | 1,869 | 828 |
| Reads tried before a per-line reading or setting was kept (`variants/`: the engineer's cast read, the hurried pair, the N controls, CHATGTP's beats, Mas's slower reads) | 17 | 647 | 284 |
| The singer's source ("One. Word.") | 1 | 10 | 4 |
| **The takes pass** | **190** | **9,053** | **3,999** |
| The casting pass (cast.md §8.6) | 117 | 5,444 | 2,394 |
| The lock QA's three reads of V.O. 9 (lock-v1.md §3.5) | 3 | 153 | 66 |
| **The episode so far** | | | **6,459** of the 25,000 cap |

**How it was counted** [M]: credits are the API's own `character-cost` headers, summed from every `manifest.json` under `audio/ep02/v1-el/ep02-v1/` (`el_qa.py report`). The subscription's counter moved **17,722 → 21,721** over the pass, a delta of exactly **3,999**, so no other pass spent credits meanwhile. MARIO (Kokoro), the cuts and the crowd sent nothing. **The lock QA (2026-10-09) added 66 credits**: three reads of V.O. 9 (`variants/variant-e2-vo-09-*.json`; the kept one is `stop1-s120`), which the generated total below now includes.

<!-- BEGIN generated:credits -->
Summed from every manifest at report time: 193 calls, 9,206 characters, **4,065 credits** (the takes pass).
<!-- END generated:credits -->

---

## 8. Files and how to re-run

**Tools** (`audio/ep02/v1-el/tools/`, all new in this pass except the casting and pipeline passes' own):

| File | What |
|---|---|
| `render_v1.sh` | the one command: `el_render.py` per segment → `el_qa.py retake` → the special lines → `el_qa.py measure` + `report`. Re-running it sends only new or changed lines |
| `el_qa.py` | every check of §2, the retakes, `variant` (one line under another reading or setting, in `ep02-v1/variants/`), and this page's generated blocks |
| `pron_check.py` | Ep1's forced-choice name check, copied with Ep2's names and their real-word competitors |
| `el_cut.py` | Ep1's cut, copied; its table is the plan's `_spec.py` CUT |
| `el_crowd.py` · `el_sung.py` · `el_mario.py` | the chant, the sung line, MARIO's Kokoro round |

**Outputs** (the WAVs and the request cache are git-ignored, as Ep1's; the JSON records are committed):
- `audio/ep02/v1-el/ep02-v1/<seg>/lines-A.json` (every line of the segment, the special rows marked `special`), `manifest.json` (every request, its seed and the pick), `wav/`, `wav-device/` (call and TV copies), `log/` (render and QA logs).
- `audio/ep02/v1-el/ep02-v1/qa/<seg>-qa.json`: every read's measures, verdicts and the pick (the retakes and the superseded readings too).
- `audio/ep02/v1-el/ep02-v1/act3/crowd/` (the ten layers), `act2/sung/` (the source read, the three part stems, the notes), `variants/` (the tried reads; `n-controls.json`).
- `audio/ep02/v1/act4/` (MARIO's Kokoro round: `mario-in.json`, `lines-v1.json`, fastrec's `lines.json`, `wav/`, `qa/`).
- The beat plans: re-run on the takes (`_build.py --write`, cast.md §6 step 5): every line's `len_s` is now its take's audible length and its `take_file` the take (the spec's `line()` fills it), and each scene re-fits around them (every scene and segment still on its target; three air WARNs, §9).

**Re-run** (from the repo root; everything is cached, so a re-run sends nothing unless a line, a reading or a setting changed):

```sh
bash ops/heavy.sh bash audio/ep02/v1-el/tools/render_v1.sh                      # the whole pass
SEGS=act3 STEPS="render qa" bash ops/heavy.sh bash audio/ep02/v1-el/tools/render_v1.sh   # one segment's EL lines
STEPS="special report" bash ops/heavy.sh bash audio/ep02/v1-el/tools/render_v1.sh       # after any el_render run
python3 show/episodes/ep02/production/v1/beat-plan/_build.py --write             # the plans on the takes
PY=audio/.venv-casting/bin/python
HF_HUB_OFFLINE=1 $PY audio/ep02/v1-el/tools/el_qa.py variant --seg act2 --id e2-a2-0038 --settings '{}' --label cast
                                                                                 # a line without its per-line setting
```

To swap a per-line choice back: delete its `line_settings` or `say_lines` entry in `cast-el.json` and re-run; the earlier read is in the cache and costs nothing.

---

## 9. Open issues, and the rules checked

**Open:**
1. **Nothing has been heard** (R8). §6 is the ear list; every LOOK is in §3.
2. **The plans' air** [M]: with every take shorter than its words-at-rate estimate in some scenes, the re-fit scales the air up (sc 11 ×3.5, sc 13 ×3.0) and three holds go over their marks: 8.01's wordless beat 8.07 s, 11.08's tail 4.59 s, 19.06's tail 3.38 s (`_build.py` WARNs). The lock and shot passes decide whether those holds stay or the scene's runtime gives the time back.
3. **The mix owns** the ghost, far, phone, call, podcast, TV and off-mic chains (cast.md §4), MARIO's EQ and his level against EKIEL, the crowd's level under Alyi (it is delivered at −19 LUFS), and the sung stems.
4. **The ENGINEER's laugh** (9.03, cast.md §1, "a separate take in his voice, laid by the sound pass") is not in the beat plans, so this pass did not record it; the sound pass asks for it (no laugh mimicry, S6).
5. **Mas's tempo** against W18 (§1): his settings are Ep1's, approved; the per-line slower reads are cached either way.
6. **Machine load** [M]: other projects kept the load at 16–30 and available memory near 9 GB, so `heavy.sh` waited at times; light jobs ran with `MRMAS_MAX_LOAD=30` (the casting pass used 24). One heavy job of this pass at a time.
7. **Resource ask (R16, non-blocking):** a human listen of §6 (an hour), and a second recogniser (faster-whisper `medium.en` is not on this machine; only `small` and `small.en` are cached) would sharpen the ASR and name checks.

**LEARNINGS rules checked:**
- **S6** [M screen, J]: library voices only, called by `voice_id`; no cloning, no voice design, no "sounds like"; the sung line re-sings Maya's own read; the crowd is ten library reads; no laugh was made.
- **S7** [M]: the cast carries over (Mas is Jeremy; MARIO stays on Kokoro, in his Ep1 preset and format); every new role at its pick.
- **W18** [M]: the tempo marks measured per line (§3) and the briefs' reads set per line (§1); Mas's ordinary tempo runs over ~140 (§1, open).
- **R1** [M]: nothing under Ep1's paths changed: Ep1's take `e1-a1-5-13` and its row, its cache, `el_cut.py`, `pron_check.py`, fastrec and the intro's singer were read, imported or run with no bytecode written; `git status` shows no Ep1 path.
- **R8** [M/J tags; the ear list §6]. **R9** [M]: every line, the special ones included, is a row in the takes the base lock reads, and in the beat plans (`take_file`). **R10** [M]: every render, ASR and synthesis job through `ops/heavy.sh`, one at a time. **R11** [M]: the key read only inside `ellib.py`; `ops/keyscan.py` before the commit and the push. **R13**: this note, `audio/ep02/README.md`, cast.md's status. **R14** [M]: scratch only in the session's scratchpad. **R17**: the casting pass's reads reused from the cache (23 lines and the ten crowd layers); one encoder pass per take only when a check needs it.
- Broken on purpose: none.
