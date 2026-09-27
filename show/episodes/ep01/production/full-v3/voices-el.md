# Ep1 v3: the ElevenLabs voice pass (`v3-voices-el`, track A4, 2026-09-27)

> **Status: CASTING AND SAMPLE DONE, for the lead's A/B.** The whole-episode render waits for the script lock.
>
> **Nobody has listened to any of this.** Every statement below is a measurement: duration, pace, pitch, silence at the head and tail, loudness, and what a speech recogniser heard. Whether a voice is natural, funny, or right for the character is still a call for an ear.
>
> **Showrunner, 2026-09-27:** "we can also try a pass using elevenlabs samples"

**In short:**
- **The cast:** all 29 speaking roles in Ep1 have library voices, and the 3 derived voices (the clone and the two deepfakes) come from their base voices by processing. Each of the six principals has two candidates: set A and set B.
- **The sample:** the 69 lines of the lead's v3 sample, each rendered in both sets. They come with fastrec-format lines JSON and retimed copies of the sample timeline.
- **Auditions:** five candidates each for the principals, and one line for each of the 23 other roles.
- **Characters:** 10,054 sent and **5,522 billed**, against the 25,000 budget. The subscription went from 0 to 5,522 of 131,000.
- **Model:** `eleven_multilingual_v2` for everyone. I tested `eleven_v3` and didn't use it (§6).
- **Decisions for you:** listed in §8.

---

## 1. How the hard rules were kept

- **Nothing was cloned or designed:**
  - Every voice is an ElevenLabs premade voice or a shared Voice Library voice, called by `voice_id` straight from text-to-speech.
  - Nothing called instant cloning, professional cloning, voice design (text-to-voice) or speech-to-speech.
  - No audio of anyone was uploaded or used as a reference.
  - `voice_slots_used` was 0 before and after, so nothing was added to the account's voices.
- **No voice was chosen for sounding like anyone.** The screen ([tools/cast_el.py](../../../../../audio/ep01/v3-el/tools/cast_el.py)) removed voices before ranking. It pulled 2,111 American-English library voices and dropped 933 of them. A voice was dropped if its name or description:
  - names or evokes a real person, a celebrity, an impression, a parody or a soundalike (246);
  - mentions a real assistant product or its voice names;
  - mentions any accent other than General American, or an ethnicity (278);
  - has an age, health or banned register: raspy, gravelly, elderly, ASMR, whisper, breathy, seductive, cartoon or child (424, with the descriptive labels another 103);
  - costs more than one credit per character (224).

  The counts are flags, and one voice can carry several.
- **Picks came from the house briefs only:** [CASTING.md](../../../../../audio/voices/CASTING.md), the Act Four briefs in `cast_a4.py`, the character files and [mas-inner-voice §9](../../../../bible/mas-inner-voice.md). They were compared against the briefs' pitch lanes and pace bands, never against any real voice.
- **House rules 3 and 4 carry over:**
  - no accent play;
  - no age or health coding (NEDIB is a middle-aged, rasp-free voice at speed 1.0, never slowed);
  - real `[V]` quotes are voiced by the character's generic voice, as in Kokoro.
- **The key** is read from `.env` inside [tools/ellib.py](../../../../../audio/ep01/v3-el/tools/ellib.py). It is never printed, logged or written, and never on a command line. Before hand-off, every output and scratch file was scanned for the key value, and there were no matches.

## 2. The cast

The full record is [audio/ep01/v3-el/cast-el.json](../../../../../audio/ep01/v3-el/cast-el.json). For every candidate it holds the role, `voice_id`, library name, source, why it fits, settings, model, the library's own labels and description, and what it measured.

**Settings:** similarity 0.75 and speaker boost on for everyone. `spd` is the v2 speed setting.

### 2.1 The principals (A and B)

| Role | Set | Library voice (source) | Stability / style / speed | Sample median F0 (lane) | Why, in a line |
|---|---|---|---|---|---|
| **MAS** | A | Giovanni - Tranquil, Clever and Educated (shared, professional) | 0.55 / 0 / 0.86; **V.O. 0.60 / 0 / 0.82** | 120 Hz talk, 122 V.O. (105–125) | In the audition it was the only read that paused between the V.O.'s sentences, with the narrowest range (3–9 st). In the sample its V.O. runs 131 wpm, near the brief's 110–130. |
| | B | Evan - Calm, Grounded & Reflective (shared, high-quality) | 0.55 / 0 / 0.84; V.O. 0.60 / 0 / 0.78 | 107 / 114 Hz | A warm, lower, grounded voice. It had the cleanest ASR in the audition, but it's quicker: its V.O. runs 186 wpm in the sample. |
| **GERG** | A | Marcus - Bright, Upbeat and Clear (shared, HQ) | 0.40 / 0.15 / 1.00 | 143 Hz (125–160) | The fastest articulation in the audition (6.3 syll/s) and bright; 3 st above Mas A in the sample. |
| | B | Ryan - Clear, Fast and Conversational (shared, prof.) | 0.40 / 0.15 / 1.10 | 123 Hz | Quick and conversational, nearer the Kokoro Gerg's register. |
| **ALYI** | A | Louis - Deep, Profound and Thoughtful (shared, prof.) | 0.60 / 0 / 0.78 | 88 Hz (80–105) | Low, with the longest comma pause of the five (0.93 s). |
| | B | Brent (shared, prof.) | 0.60 / 0 / 0.82 | 101 Hz | The slowest (136 wpm) and lowest in the audition. Its range is wide (16 st). |
| **RIMA** | A | Mia - Clear, Smooth, Professional (shared, prof.) | 0.55 / 0.05 / 0.92 | 170 Hz (160–200) | The slowest articulation (3.7 syll/s) with a controlled range, sitting 3.6 st under Neleh A. |
| | B | Harper - Confident, Clear and Cool (shared, HQ) | 0.55 / 0.05 / 0.88 | 186 Hz | The brighter option, 1.9 st over Neleh B. Hope measured well too, but sat within 0.5 st of both Neleh picks. |
| **NELEH** | A | Alexandra - Confident, Clear and Steady (shared, prof.) | 0.55 / 0 / 0.95 | 209 Hz (165–200) | The evenest read of the five (range 5.5 st on the sample): "precise, even". |
| | B | Victoria - Intake Professional (shared, prof.) | 0.55 / 0 / 1.00 | 175 Hz | "Highly articulate and composed ... patient". |
| **TASYA** | A | Tyler Kurk - Smooth, Pleasant and Clear (shared, HQ) | 0.50 / 0.10 / 0.90 | 159 Hz (130–150), but 116 and 202 on his two lines | The only audition read inside his pace band (133 wpm), with even phrase gaps. |
| | B | Eric - Smooth, Trustworthy (**premade**) | 0.50 / 0.10 / 0.80 | 149 Hz | A warm tenor at 147–151 Hz on both lines. |

### 2.2 Everyone else (one voice each; set A and set B both use it)

Pitch is measured on the role's audition line (`auditions/`); MADA and CHATGTP are measured in the sample.

| Role | Library voice (source) | Speed | F0 measured (lane) | Why |
|---|---|---|---|---|
| MADA | Alex - Smooth, Balanced and Clear (prof.) | 0.90, stability 0.7 | 105 (115–130) | A neutral American voice; high stability for the canned sameness |
| CHATGTP | Maya - The Upbeat Creator (prof.) | 1.08, style 0.25 | 238–281 (200–250) | Bright and crisp, 4 st over Rima B. A creator's voice, no assistant product's |
| MARIO | Caleb - Youthful, Quirky and Clear (prof., labelled "anxious") | 1.00 | 128 (115–150) | One of the six "anxious" voices in the library; clear |
| TTEMME | Sean - Expressive and Conversational (HQ) | 1.00 | 129 (122–160) | Casual, warm, relatable; the headset is a mix chain |
| TERB | Ethan - Calm, Optimistic and Clear (prof.) | 1.05 | 109 (95–115) | A brisk, level, narrow preview (5.8 st) |
| RADNUS | Dylan Malc - Calm & Educational (prof.) | 0.90 | 135 (110–135) | "A warm, soft-spoken voice ... gentle, sincere" |
| ADELINA | Gracy - Clear, Articulate and Steady (prof.) | 1.00 | 223 (175–215) | Warm, friendly, steady |
| TILED EMPLOYEE | Avery - Healthcare & Clinical Education (prof.) | 0.95 | 169 (135–175) | Calm and clear; 2.6 st under Neleh A. It **replaced** Kai, which measured 202 Hz and 348 wpm |
| NEDIB | Johnny - Friendly, Optimistic and Warm (HQ) | 1.00 | 126 (105–130) | Warm and conversational, middle-aged, no rasp. House rule 4 |
| DEEPFAKE NEDIB, #2 | Nedib's voice, stability 0.85, the house **gloss** (#2 +0.7 st) | — | 133, 123 | A process on our generic voice, as in Kokoro |
| SYDNEY | Layla (prof.) | 0.90, style 0.15 | 296 (185–235) | "Naturally soft ... calm, friendly"; the sheen is a mix chain |
| SUCRAM | Mark - Natural Conversations (HQ) | 1.12 | 115 (105–130) | Casual and natural, sped up for the point-by-point pace |
| SIRRAH | Marie - Professional & Warm (prof.) | 0.95 | 230 (170–205) | Articulate, crisp, patient |
| NOLE | Ryan - Confident and Bold (prof.) | 1.05, stability 0.35, style 0.2 | 95 (110–140) | The widest preview range (15.9 st), for the bursts |
| LAHTNEMULB | Will – Grounded Narrator (HQ) | 0.92 | 98 (100–125) | Formal, steady, clear |
| LAHTNEMULB (THE CLONE) | his voice, stability 0.85, gloss, **+2 st** (as Kokoro's audit-v2 #26) | — | 127 | The two men sit 4.5 st apart |
| A SENATOR | Clara – Corporate & Training Trusted Professional (HQ) | 0.95 | 167 (160–205) | Calm, clear, courteous |
| PHOTOGRAPHER | Christina - Natural and Conversational (HQ) | 1.08 | 185 (any) | "A friendly, real vibe" |
| NIRB | Arlo – Engaging Real-World Storyteller (HQ) | 1.05 | 157 (125–150) | Bright and youthful. It **replaced** Ryan - Explainer, which measured 108 Hz, 1.3 st from Egap |
| EGAP | Declan - Serious & Straightforward (prof.) | 0.90 | 101 (95–120) | Low, serious, level |
| OIGNEB | CJ - Articulate & Educational (HQ) | 0.92 | 113 (110–130) | "A calm and articulate teacherly voice" |
| REMUHCS | Marc Laurent - Confident and Engaging (HQ) | 0.95 | 119 (110–135) | Warm, clear host; the monitor chain comes later |
| PANEL HOST | River - Relaxed, Neutral, Informative (**premade**, gender "neutral") | 1.00 | 165 (145–175) | Never gendered, per the brief |
| NESNEJ | Bryan - Polished, Measured and Engaging (HQ) | 1.05, style 0.2 | 107 (120–150) | Warm, confident, "natural charisma"; the arena is a send |
| CLOD | Alex - Friendly & Professional (prof., "gender-fluid") | 1.00 | 198 (150–180) | Warm and approachable; 2 st over Mario, who dictates to it |

**Sources:**
- "prof." is a shared professional voice clone that the voice's owner made of their own voice; "HQ" is a shared high-quality instant voice, also the owner's own.
- **No two roles share a voice.**
- **Names:** the lines keep the script's spelling, but the text sent to the voice uses the house lexicon's respellings, listed in `respell` in `cast-el.json`:
  - Mas /mɑs/ is sent as "Moss", Gerg /ɡɜɹɡ/ as "Gurg" and Alyi /ˈælji/ as "Al-yee";
  - NopeAI as "Nope A.I.", v2 as "V two", and Nole as "Knoll";
  - GNIB, CHATGTP, Yrral, Ttemme, Tasya and Neleh have entries ready for the full episode.
- **Mas's lowercase lines** are sent in sentence case, so the voice reads them as speech.

## 3. Characters spent

| Run | Calls | Characters sent | Billed (the `character-cost` header) |
|---|---|---|---|
| Model probes (v3, v2, text-to-dialogue) | 3 | 65 | 35 |
| Principals' audition (5 × 6 roles, 7 lines) | 35 | 2,395 | 1,315 |
| `eleven_v3` comparison (6 lines) | 6 | 294 | 162 |
| **The sample, sets A and B**, with 22 retakes | 156 | 5,956 | 3,272 |
| Supporting auditions (24 lines; 1 retake, 2 voice swaps, 1 respelling) | 28 | 1,344 | 738 |
| **Total** | **228** | **10,054** | **5,522** |

- **The rate:** this account was billed about 55 credits per 100 characters sent on `eleven_multilingual_v2`. The subscription's own count agrees: 5,522.
- **The log:** [usage.json](../../../../../audio/ep01/v3-el/usage.json) has the subscription before and after, and every run.

## 4. The sample: files and how to A/B it

All paths below are under `audio/ep01/v3-el/`. The WAVs and the cache are git-ignored; the JSON is tracked.

| File | What |
|---|---|
| `sample/lines-A.json`, `sample/lines-B.json` | **The lines JSON, one per set** (69 rows each) in the fastrec format: `id`, `text`, `spoken_as`, `file`, `duration_s`, `pace.audible_in_s` / `audible_out_s`, `words` [{w, t0, t1}], `qa` and `voice`, plus `el` {voice, model, settings, seed, request key} and `kokoro_ref` (the Kokoro take it replaces, with its numbers) |
| `sample/wav/<id>__<role>-<A\|B>.wav` | The takes: 48 kHz / 24-bit mono, **−18 LUFS integrated**, true peak ≤ −1.5 dBTP, dry, with a 0.35 s room-tone handle each side and a −62 dBFS room-tone bed (the fastrec file shape) |
| `sample/wav-device/*.call.wav` | **Gerg's 11 call lines in sc 29**, through a copy of the house call filter, because the Kokoro takes printed that chain in. `file_device` in the lines JSON points to them; `file` stays dry |
| `sample/ep01-v3-sample-el-A.json`, `-B.json` | **Retimed copies** of the lead's `show/reel/trials/ep01-v3-sample.json` with the EL takes swapped in. The gaps between lines are kept, and timed items move with their line. The original is untouched. Made by `tools/retime.py` |
| `auditions/principals/lines-{A..E}.json` + `wav/` | The five-candidate audition of each principal (7 lines). This is the file to listen to when choosing A or B, or neither |
| `auditions/lines-A.json` + `wav/` | One Ep1 line for each of the 23 other roles, including the three derived voices |
| `cast-el.json`, `usage.json`, `casting/` | The cast; the spend; the screen's shortlist and the preview measurements |

**Word timings:**
- They come from ElevenLabs' with-timestamps alignment and are clamped to the audible span.
- Against faster-whisper's word starts, the median disagreement is 0.09 s per take (worst 0.35 s).
- The `words` array has one entry per written word. "Low-key" is one word, as in Kokoro.

**Level-match before judging:**
- The brief asked for −18 LUFS per take, and the EL takes are there.
- The Kokoro sample's dialogue takes are at −16 LUFS; its V.O. is at −18.
- Played as they are, Kokoro's dialogue is 2 dB louder, and the louder voice tends to win an A/B. Add +2 dB to the EL dialogue rows, the ones with `kind: "dialogue"`, or take 2 dB off Kokoro's.

**Same timeline or retimed:**
- **Swapped into the sample at Kokoro's times,** the lines would overlap:
  - Set A: 8 lines run into the next line (2 of them by 0.05 s or less), and 4 run past their beat's end. The worst is V.O. `v3s-02`, which runs 2.5 s into "it's a preview.".
  - Set B: 4 overlaps, 1 of them marginal.
- **The retimed copies** keep every gap. Set A runs **348.0 s** against Kokoro's 332.9 s (+15.1 s); set B runs **327.8 s** (−5.1 s).

## 5. What the measurements say

### 5.1 Per role

Voiced time is the sum of the audible spans. The wpm figure is the median over lines of five or more words; shorter lines are too short to measure pace.

| Set | Role | Lines | Median F0, EL (Kokoro) | F0 spread across lines | Median range per line | wpm, EL (Kokoro) | Voiced time, EL (Kokoro) |
|---|---|---|---|---|---|---|---|
| A | Mas, talk | 17 | 120 Hz (113) | 103–139 | 9.9 st | 197 (208) | 19.4 s (20.4) |
| A | **Mas, V.O.** | 12 | 122 (117) | 110–137 | 11.6 | **131 (172)** | **42.4 (32.5)** |
| A | Gerg | 19 | 143 (127) | 123–179 | 14.0 | 204 (200) | 50.4 (51.8) |
| A | Rima | 8 | 170 (208) | 163–177 | 9.8 | 146 (174) | 33.9 (27.0) |
| A | Neleh | 5 | 209 (162) | 194–232 | 5.5 | 243 (225) | 12.6 (13.7) |
| A | Alyi | 3 | 88 (87) | 86–102 | 13.7 | 194 (183) | 7.8 (7.8) |
| A | Tasya | 2 | 159 (148) | **116–202** | 13.2 | 159 (200) | 8.7 (6.9) |
| B | Mas, talk | 17 | 107 (113) | 94–129 | 10.0 | 222 (208) | 17.5 (20.4) |
| B | Mas, V.O. | 12 | 114 (117) | 94–134 | 13.1 | 186 (172) | 30.8 (32.5) |
| B | Gerg | 19 | 123 (127) | 105–174 | 12.6 | 228 (200) | 47.4 (51.8) |
| B | Rima | 8 | 186 (208) | 169–215 | 8.9 | 145 (174) | 30.4 (27.0) |
| B | Neleh | 5 | 175 (162) | 172–192 | 9.4 | 202 (225) | 14.4 (13.7) |
| B | Alyi | 3 | 101 (87) | **69**–107 | 13.9 | 192 (183) | 8.4 (7.8) |
| B | Tasya | 2 | 149 (148) | 147–151 | 11.7 | 224 (200) | 6.2 (6.9) |
| both | Chatgtp / Mada | 2 / 1 | 259 (253) / 105 (117) | | | | 3.1 (2.9) / 0.8 (0.9) |

**What the table shows:**
- **Mas's inner voice (set A) is the biggest difference from Kokoro.**
  - It runs 131 wpm, against Kokoro's 172 and his talk's 197. That is the guide's "slower than he talks to people", one point over the top of its 110–130 wpm band.
  - The time goes into pauses between his sentences (up to 0.94 s in `v3s-01`), not into slow words (3.6 syll/s).
  - That is +10 s of voice over 12 lines. Set B's inner voice is quicker than Kokoro's.
- **Rima A and B are slower than Kokoro** (about 145 wpm against 174). That's her brief's "never rushed" (135–150), and it adds about 3–7 s.
- **Gerg:**
  - Set A matches Kokoro's pace (204 against 200 wpm) and sits higher and brighter (143 Hz).
  - Set B is faster (228 wpm) and at Kokoro's pitch.
- **Neleh and Rima swap pitch order against Kokoro.**
  - In set A, Rima (170 Hz) sits under Neleh (209 Hz); in Kokoro, Rima was the higher (208 against 162).
  - The separation holds: 3.6 st in set A, 1.1 st in set B, where timbre has to carry it.
- **Silence at the head and tail:**
  - Every take has 0.35–0.50 s of room tone before the first sound: the handle plus the voice's own onset.
  - Each has 0.35–0.86 s after the last sound.
  - No take starts or ends in digital silence.
- **The files are clean:**
  - every take is at −18.0 LUFS (−18.4 to −18.0);
  - true peak ≤ −1.50 dBTP;
  - no clipped samples.

### 5.2 Retakes the renderer made on its own

These all come from measurement, and the renderer keeps the better-measured take of each pair. 22 sample takes were re-sent:
- **The audio stopped while still sounding (5):** the last 20 ms above −45 dB.
- **ASR recall was under 0.8 (5):** for example, "It's the pill." became "It's the bill."
- **Pitch outliers (11):** a take more than 4 st off the role's typical pitch and outside its lane. For example, Mas's "leave it open." first came back at 257 Hz and the retake measured 123 Hz; Rima B's "Nobody asked one." went from 367 Hz to 169 Hz.
- **One retake I asked for** (`a5-29-03`, set B).

The supporting auditions had 4 more calls: 1 retake, 2 voice swaps and 1 respelling.

### 5.3 Worth an ear first (the measurements can't settle these)

1. **"Macrosoft" (`a5-29-08`, `a5-29-09`):** the recogniser writes "Microsoft" for all four EL takes, and for the Kokoro takes too. That points at the recogniser's prior, but only an ear can confirm the parody name comes through.
2. **"the badge was a joke." (`a5-29-01`):** A was heard as "batch" and B as "band"; Kokoro's take was heard as "badge". It may be under-articulated.
3. **Gerg's name in Mas's voice (`v3s-10`, set A):** heard as "Kirk never waits to be asked." The Kokoro takes were heard as "Jurg" and "Jerg".
4. **Tasya A (Tyler Kurk)** measured 202 Hz on "Don't get up, Mas…" but 116 Hz on "Yes. You first…". Two takes of the first line both came back at about 202 Hz, and the same voice measured 136 Hz on that line in the audition, with "Mahs". His pitch is inconsistent between lines, so listen to both.
5. **Alyi B (Brent), "Someone should." (`e1-a1-5-15`):** 69 Hz, and both takes are the same. That may be creak.
6. **Gerg B, "Sorry, one sec…" (`a5-29-03`):** the only take left whose raw audio stops while still sounding (−26 dB, 10 ms before the end, on "compiling"). Both retakes were heard as "I've got **to** build compiling", so the first take was kept.
7. **Small word changes the recogniser heard:**
   - "not the other way **round**" came back as "**around**" (Neleh, both sets);
   - "That's **going to** cost us" as "**gonna**" (Rima B);
   - "alyi **asks**" as "**asked**" (Mas A, `v3s-03`).

   If the voice really said them, each is a free re-dress away from a `--retake`.
8. **Supporting voices outside their lanes on one line:** NOLE at 95 Hz and NESNEJ at 107 Hz sit under their lanes, and SIRRAH at 230, SYDNEY at 296 and CLOD at 198 sit above theirs. MARIO (128), NEDIB (126) and RADNUS (135) are all within 1 st of each other, and they share sc 13, so timbre has to separate them. SYDNEY's "2022" was heard as "2020 to".
9. **"Mr. Manalt"** has no house pronunciation, and the recogniser heard "Menalt" and "Minolt". Add one to `respell` once the room settles it.

## 6. Model: why `eleven_multilingual_v2`, not `eleven_v3`

The account can use `eleven_v3`, the most expressive model. I tested it on six of the same lines, with Mas A and Gerg A at the same speeds as the v2 takes.

| | `eleven_v3` | `eleven_multilingual_v2` |
|---|---|---|
| Takes whose audio stopped while still sounding | 3 of 6 | 0 of 6 |
| Mas V.O. `v3s-02`, voiced | 4.0 s (164 wpm) | 6.6 s (101 wpm) |
| Mas "it's a preview." / "leave it open." | 0.66 s / 0.60 s | 0.87 s / 0.93 s |
| Gerg `e1-a1-5-03` | 183 wpm | 230 wpm |
| Speed control | not tested: at the same setting it ran faster than v2 for Mas and slower for Gerg | honoured, 0.7–1.2 |
| Word timings against ASR, median per take | 0.04 s | 0.09 s (both usable) |

**The result:** v3 ran the wrong way for both briefs. It made Mas faster and Gerg slower, and half its takes stopped while still sounding. ElevenLabs' own guidance is that v3 is less stable on short prompts, and most of our lines are short single lines.

**Where v3 could still help:** its text-to-dialogue endpoint renders a whole exchange in context. One probe returned per-speaker time segments, so it could be split into per-line takes. That's the scene-level rendering CASTING.md §6 recommends. It would need its own test, and a render key per exchange rather than per line.

## 7. The whole episode, later (after the script lock)

**The tool:** [tools/el_render.py](../../../../../audio/ep01/v3-el/tools/el_render.py). It reads any lines file:
- a stick or reel timeline, such as `show/reel/ep01-v3/ep01-v3-<seg>.json`;
- a fastrec lines JSON, such as `audio/ep01/v3/<seg>/lines.json`;
- or a beat plan (rows with their own text).

**Resuming:**
- Every request is cached by its key: voice, model, settings, text as sent, and seed (from the line id and the voice). The cache is `audio/ep01/v3-el/cache/`, and it's git-ignored.
- **A line whose key hasn't changed is never sent again.** Only new or changed lines cost characters.
- `--max-chars` stops a run before it overspends.
- A changed dressing only re-dresses locally (`--redress`, free).

```sh
PY=audio/.venv-casting/bin/python; T=audio/ep01/v3-el/tools/el_render.py
# 1. check coverage and cost (no API calls): every speaker must resolve to a role
for s in coldopen act1 act2 act3 act4 tag; do HF_HUB_OFFLINE=1 $PY $T plan --lines show/reel/ep01-v3/ep01-v3-$s.json --sets A; done
# 2. render one set, segment by segment (resumable; re-run after any script change)
for s in coldopen act1 act2 act3 act4 tag; do
  HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T render --lines show/reel/ep01-v3/ep01-v3-$s.json \
      --out audio/ep01/v3-el/$s --sets A --max-chars 6000 --retry-bad 1 --retry-pitch; done
# 3. a listening note on a line: one new take, keep the better-measured one
HF_HUB_OFFLINE=1 $PY $T render --lines show/reel/ep01-v3/ep01-v3-act4.json --out audio/ep01/v3-el/act4 --sets A --retake a5-29-01
# 4. a retimed copy of the lock for the EL mix (gaps kept; the lock itself is untouched)
$PY audio/ep01/v3-el/tools/retime.py --timeline show/reel/ep01-v3/ep01-v3-act4.json \
    --lines audio/ep01/v3-el/act4/lines-A.json --out audio/ep01/v3-el/act4/ep01-v3-act4-el-A.json
```

**Coverage and cost, checked on the lock as saved at 12:19 (no API calls):**
- All six segments resolve: 226 rows, every speaker cast. I added the lock's short ids (`host`, `clone`, `senator`, `deepfake`, `deepfake-2`) to `labels`.
- One set is **9,418 characters sent, about 5,200 credits** at today's rate. Both sets are about 10,400 credits, and about 11,500 with the 10 % of retakes the sample needed.
- The account has 125,478 credits left this cycle.
- Unchanged sample lines are reused for free wherever the lock keeps their id and text.

**What the full render should also do:**
1. **Pick the set per principal first.** Set A for Mas, then set B for Rima, is fine: sets are just the candidate letter per role.
2. **Keep the dressing dry.** Rooms, the headset (TTEMME), the monitor (REMUHCS), the PA (PANEL HOST) and SYDNEY's sheen belong to the mix, as in Kokoro. Only the call lines get a printed device copy, and the dry file stays the default.
3. **Level-match EL dialogue to −16 LUFS** in the mix if the Kokoro mix stays at −16. Or ask for `target_lufs` in `cast-el.json` to change, which is a free re-dress.
4. **Expect longer V.O. with Mas A.** The sample's 12 V.O. lines run +10 s against Kokoro. Across the lock's V.O. lines that's roughly +20 to +25 s, which the lock has to absorb or the V.O. speed (0.82) has to come up.

## 8. To decide

1. **Mas: A (Giovanni) or B (Evan), or neither.**
   - A measures closest to the V.O. brief: 131 wpm, pauses between thoughts, a narrow range.
   - B is warmer and lower, but its V.O. is quicker than Kokoro's.
   - The five-way audition is in `auditions/principals/`.
2. **Gerg, Alyi, Rima, Neleh, Tasya: A or B each.** Tasya A's pitch jumps between his two lines (item 4 in §5.3).
3. **"Macrosoft" and "badge":** these need an ear. If either is wrong, use a respelling or a `--retake`.
4. **Level:** match the EL dialogue to the Kokoro −16 LUFS for the A/B, or leave all takes at −18 as briefed.
5. **Timeline:** judge the A/B on the retimed copies (`sample/ep01-v3-sample-el-A.json`, `-B.json`), or at Kokoro's positions with the overlaps listed in §4.
6. **Later, optional:** whether to test v3 text-to-dialogue on one scene (a few hundred characters) before the full render.

---

**Files written by this pass** (nothing else was touched; nothing was committed):
- `audio/ep01/v3-el/`:
  - `cast-el.json` and `usage.json`;
  - `tools/` (`ellib.py`, `elaudio.py`, `el_render.py`, `retime.py`, `cast_el.py`);
  - `sample/`, `auditions/` and `casting/`;
  - `cache/` (git-ignored).
- `show/episodes/ep01/production/full-v3/voices-el.md` (this file).
- Scratch went to the session scratchpad under `v3-voices-el/`: the full 2,111-voice pool, the preview MP3s, and the audition and v3 test renders.
