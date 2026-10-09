# Ep2 v1: the cast (`ep1.1_her.wav`)

> **Status: the voice plan for the one-go build, 2026-10-08, updated after the script review (its log is at the end of [script-v1.md](script-v1.md#review-log-script-review)). Nothing is recorded yet.** Every speaking role in [script-v1.md](script-v1.md) and its beat plans ([beat-plan/](beat-plan/)), with its voice: Ep1's ElevenLabs cast where the role exists ([voices-el.md](../../../ep01/production/full-v3/voices-el.md); [cast-el.json](../../../../../audio/ep01/v3-el/cast-el.json), read, never edited), MARIO on Kokoro, and a shortlist of 3–4 ElevenLabs **library** voices to audition for every new role. Ep2's own cast file is `audio/ep02/cast-el.json` (the pipeline's copy of Ep1's, its starting point; the voice pass adds each new role's pick to it from this page).
>
> **The firm rules** (LEARNINGS S6, S7; guardrails §5–§6): library voices only (ElevenLabs premade voices, or shared Voice Library voices called by `voice_id`: each a voice its owner made of their own voice). **No cloning, no voice design from anyone's audio, no "sounds like" prompt, no laugh mimicry, no voice chosen or directed to resemble a real person.** One film: Mas is Jeremy; MARIO keeps his Kokoro voice, matched into the room. No two roles share a voice. Nobody here has listened: the shortlists are a screen by the library's own words and a pitch measure of each preview; the pick is made by measurement with a written reason (Ep1's method, voices-el §AA), and the human listen goes on the delivery note.

**Contents:** [1. Every speaking role](#1-every-speaking-role) · [2. Ep1's cast, carried over](#2-ep1s-cast-carried-over) · [3. New roles: the shortlists](#3-new-roles-the-shortlists) · [4. Devices and treatments](#4-devices-and-treatments) · [5. Names and respellings](#5-names-and-respellings) · [6. How to cast and record](#6-how-to-cast-and-record) · [7. Roles with no voice in Ep2](#7-roles-with-no-voice-in-ep2)

---

## 1. Every speaking role

All 173 lines of the beat plans (159 spoken, 14 V.O.), by speaker. `who` is the beat plan's speaker id; the line ids are the plan's.

| Role | `who` | Lines | Scenes | Voice | Status |
|---|---|---|---|---|---|
| **MAS** (spoken) | `mas` | 29 (e2-a1-0001 … e2-a4-0034) | 4, 6, 7 (his recorded voice), 8, 9, 13, 14, 15, 17, 18, 19 | **Jeremy** (EL) | carried |
| **MAS** (V.O.) | `mas` (`vo`) | 14 (e2-vo-01 … e2-vo-14) | 4, 4B, 8, 12, 15, 17, 18, 19, 20, 23 | **Jeremy**, V.O. settings | carried |
| **GERG** | `gerg` | 15 | 1, 4, 9, 19 | Marcus (EL) | carried |
| **NOLE** | `nole` | 15 | 4, 20 | Ryan - Confident and Bold (EL) | carried |
| **GHOST-NOLE** | `ghost-nole` | 4 (one cut from his own take) | 4 | Nole's voice + the ghost treatment | carried |
| **TERB** | `terb` | 7 | 4A, 18 | Ethan (EL) | carried |
| **TASYA** | `tasya` | 4 | 7 | Tyler Kurk (EL) | carried |
| **RIMA** | `rima` | 13 | 9, 10 (O.S.), 11 | Mia (EL) | carried |
| **CHATGTP** (and VOICE 5) | `chatgtp` | 8 (one sung) | 9, 11 | Maya (EL), Ep1's direction unchanged | carried |
| **ALYI** | `alyi` | 5 (one cut from Ep1's take) | 15 (F2.2) | Louis (EL); Ep1's own take for "Six years and eleven months." | carried |
| **NELEH** | `neleh` | 2 | 18 | Alexandra (EL), through the podcast chain | carried |
| **RADNUS** | `radnus` | 1 | 19 | Dylan Malc (EL) | carried |
| **STAFFER** | `staffer` | 5 | 4, 13, 19 | Avery (EL; Ep1's tiled employee) | carried |
| **MARIO** | `mario` | 6 | 18 | **Kokoro** `am_liam` (a-liam-earnest), matched | carried (Kokoro) |
| **SELBEEP** | `selbeep` | 4 | 1 | shortlist §3.1 | **new** |
| **XEL** | `xel` | 7 | 6 | shortlist §3.2 | **new** |
| **THE HUMANIST** | `humanist` | 3 | 7 | shortlist §3.3 | **new** |
| **the DEMO ENGINEER** | `engineer` | 9 | 9, 11 | shortlist §3.4 | **new** |
| **VOICE 1–4** | `voice1`–`voice4` | 1 each (`Hi.` · `Hi!` · `hi?` · `Hi…`) | 9 | shortlists §3.5 | **new** |
| **STAFFER 2** | `staffer2` | 1 | 13 | shortlist §3.6 | **new** |
| **the TV REPORTER** | `reporter` | 1 | 13 | shortlist §3.7 | **new** |
| **BUKAJ** | `bukaj` | 2 | 14 | shortlist §3.8 | **new** |
| **EKIEL** | `ekiel` | 3 | 15 (F2.2), 18 | shortlist §3.9 | **new** |
| **the CROWD** (the chant) | `crowd` | 1 (layered) | 15 (F2.2) | 8–12 layered library reads, §3.10 | **new** |
| **THE FORECASTER** | `forecaster` | 4 | 17 | shortlist §3.11 | **new** |
| **the DRIVER** | `driver` | 2 | 17 | shortlist §3.12 | **new** |
| **HARAS** | `haras` | 4 | 19 | shortlist §3.13 | **new** |

**Also in the episode's sound, outside the beat plans:** the intro's cold-open line, "her", read by **Jeremy** (the intro pipeline, `audio/intro/ep02/`; voices-el §Y's fit, re-done for this word); the ENGINEER's nervous laugh (9.03), a separate take in his voice, laid by the sound pass.

---

## 2. Ep1's cast, carried over

The voices, ids and settings are Ep1's, exactly (cast-el.json; voices-el §2, §R, §AB, §AD–§AF). Model `eleven_multilingual_v2` for every role. Similarity 0.75 and speaker boost on throughout. **Change nothing** in a carried voice's settings or direction; where Ep2 needs a new read (a new line), it is a new take at the same settings.

| Role | Library voice (`voice_id`) | Stability / style / speed | Ep2 direction (only what's new) |
|---|---|---|---|
| **MAS** | Jeremy - Warm, Trustworthy, Sincere (`EwzF7Z2UMSib9JaKx0Kg`; Ep1's set A, candidate C) | spoken 0.60 / 0 / 0.95 · **V.O. 0.65 / 0 / 0.85** | Lane 105–125 Hz. Spoken level, unhurried, no smile in it; the ELPPA call (8.06) his one full sentence of terms; **his ordinary lines unhurried, about 140 wpm (W18), and the call to legal (17.09) level and quicker than he ever talks, about 180**, the one time he hurries. **Two new kinds of line (script review, P9):** the open floor's chosen strip lines, `congratulations.` and `need anything?` (14.07–14.08), said aloud as the dialogue box types them (a voiced adventure game's convention; plain, meant); and "which half?" (19.10), his Ep1 precision question, dry. V.O. close and dry, 110–130 wpm (lines e2-vo-01 … 14; each delivery note is in the plan), **except V.O. 9 (17.10), "everyone who signed. the post. everyone who signed.", read faster than he thinks** (about 145 wpm against his usual 110–130, his rattled tell: each item a new call, not louder). His lowercase lines are sent in sentence case so the voice reads them as speech (Ep1's rule). His recorded voice in sc 7 (`e2-a1-0047`) is a cut of sc 6's take, through the phone chain |
| **GERG** | Marcus - Bright, Upbeat and Clear (`y0s2ExEMuum3muUnA6Zd`) | 0.40 / 0.15 / 1.00 | The Move 37 correction, now in two parts around the staffer's whisper (`e2-a1-0023`, 13 words; `e2-a1-0056`, 30 words): cheerful and literal, never smug, **unhurried for him** (the plan sits at about 183 wpm, inside W18's band, against his Ep1 211): a correction, not a read-out; record each part whole. "He signed it. He's just not here." quiet. The call (19.09–19.10) through the call chain when we're on Mas; "The half on the beanbags." literal and helpful, quick on "which half?" |
| **NOLE** | Ryan - Confident and Bold (`ya031zGCAxyRGrvB3or9`) | 0.35 / 0.20 / 1.05 | Bursts. "That's why." and "You kept them." quiet; "Nobody wrote that move…" hushed, a man at a séance; "One player in ten thousand…" a fear, not a boast; "I forwarded that…" quick, defensive; "MINDDEEP had that in 2016." loud again |
| **GHOST-NOLE** | the same voice | the same | The ghost treatment (§4). "Yup" (`e2-a1-0002`) and "…Yup." (`e2-a1-0018`) on different seeds. `e2-a1-0026` is cut from `e2-a1-0014`'s take ("billions" … "year") |
| **TERB** | Ethan - Calm, Optimistic and Clear (`Pcfg2Zc6kmNWQ9ji3J5F`) | 0.55 / 0 / 1.05 | The Mar 8 finding (`e2-a1-0032`) read word for word and weighted, both halves together, no view in the voice |
| **TASYA** | Tyler Kurk - Smooth, Pleasant and Clear (`raMcNf2S8wCmuaBcyI6E`) | 0.50 / 0.10 / 0.90 | Warm, unhurried; "A tenant." O.S. |
| **RIMA** | Mia - Clear, Smooth, Professional (`rCuVrCHOUMY3OwyJBJym`) | 0.55 / 0.05 / 0.92 | Composed throughout; THE PLAN's six lines O.S. as if running her first slides in her head; "…and that's the demo." after a bar's hold |
| **CHATGTP** (and VOICE 5) | Maya - The Upbeat Creator (`Y2pP8eXRDH19yyV1Tslt`) | 0.40 / 0.25 / 1.08 | **Ep1's approved voice and Ep1's direction, reused unchanged** (the programmatic stand-in for the ear check; D-30, D-49): no "breathy", "husky", "sultry" or film-referencing word in any prompt, setting note or take name. VOICE 5's `Hey.` (`e2-a2-0016`) is this voice, so the slot paused in sc 17 is the voice heard on stage. "Great question! … favorite things." recorded whole (the engineer's "Thanks." comes in over "favorite"). "one wo-o-ord." (`e2-a2-0030`) in three parts through the intro's sung-vocal pipeline, not TTS. **After the pause (17.19) CHATGTP has no spoken line in Ep2**: the garden's bubbles are text and a chip blip; Ep3 decides its speaking voice |
| **ALYI** | Louis - Deep, Profound and Thoughtful (`8x8Otoub1daqoxY72hug`) | 0.60 / 0 / 0.78 | Three new lines in F2.2: "You're not chanting." (delighted), "Then I'll feel it for both of us." (laughing), "Someone should." (quiet; fallback, Ep1's take `e1-a1-5-15`, reused); and the chant's first "FEEL THE AGI!". Warm, his Ep1 register; **no direction toward mysticism or intensity**. `e2-a3-0008` is **Ep1's own take** `e1-a1-5-13`, cut "Six" … "months" (`audio/ep01/v3-el/ep01-v35/act1/wav/e1-a1-5-13__alyi-A.wav`, about 2.0 s), copied into `audio/ep02/` and played far off; Ep1's file is read, never edited |
| **NELEH** | Alexandra - Confident, Clear and Steady (`3dzJXoCYueSQiptQ6euE`; her Ep1 A voice) | 0.55 / 0 / 0.95 (voices-el §AE–§AF) | Her two lines (`e2-a4-0001`, `e2-a4-0002`) are her own transcript's words with name swaps: recorded whole, then **ASR-verified against the text** (the stand-in for the audio check). **Ep1's settings unchanged; no processing or direction toward anyone's timbre.** Through the podcast-player chain (§4); the player on screen carries no show name |
| **RADNUS** | Dylan Malc - Calm & Educational (`PMWmvqAOXhLm54FLpmYS`) | 0.55 / 0.05 / 0.90 | Quick, gracious, along the hedge; his smile holds after "as a guest." with no V.O. over it |
| **STAFFER** | Avery - Healthcare & Clinical Education (`w25dAwxibNES1hcDBvXx`; Ep1's tiled employee) | 0.50 / 0 / 0.95 | "What's that?" whispered (4.20), and "So somebody did write it." whispered to Gerg (4.22: she hears "people's games" as "people wrote it"); three plain staff reads (13, 19), the first peeling a flyer's corner |
| **MARIO** | **Kokoro** `am_liam` (Kokoro-82M stock), the `a-liam-earnest` preset (`audio/voices/cast.json`) | Ep1's Kokoro settings | The showrunner kept his Kokoro voice ("i actually liked dario's kokoro voice more"). "We agree. I underlined 'inherently.'" with a small beat before "inherently.", the word the joke turns on (planned 2.6 s). Matched into the EL room: the takes' format (48 kHz / 24-bit mono, −16 LUFS, −1.5 dBTP, dry, 0.35 s room-tone handles), the room, chain and EQ of voices-el §AB3; **within about 1 dB of EKIEL**, who answers him in the same pane |

**On file, silent in Ep2:** ADELINA (Gracy, `biKKUtquxxZTxOnPw4Tk`), MADA (Alex - Smooth, Balanced and Clear, `S9UjcNYIwfBOtZiDnIQT`), REMUHCS (Marc Laurent, `o0t0Wz5oSDuuCV6p7rba`): no line in Ep2 (§7).

---

## 3. New roles: the shortlists

**Where the candidates come from.** Every voice below is from the shared Voice Library pool Ep1's cast pass screened (`audio/ep01/v3-el/casting/shortlist.json`: 2,111 voices screened, red flags removed by `cast_el.py`: any name or description that names or evokes a real person, a celebrity, an impression, a sound-alike, a real assistant product, an accent, an age or health register, or a price). Preview pitch is Ep1's measurement of each library preview (`casting/measure.json`, pYIN; a screen only, never a pick). **None is a voice Ep1 cast or auditioned, and no voice sits on two shortlists** (checked against `cast-el.json`).

**For each role, the voice pass re-runs the screen with the role's own filters** (`tools/el_audition.py screen`, Ep1 §AA1) before rendering: the words in each role's "Never" column, plus "like", "sound-alike", "parody", "impression", "celebrity", "famous". A candidate that fails it is replaced from the same pool and the replacement is logged.

### 3.1 SELBEEP · 4 lines (sc 1)

**Brief:** a proud showman presenting to a room; bright, pleased with himself; never a carnival barker. **Lane:** 120–150 Hz. **Separate from:** Gerg (Marcus, about 143–152 Hz), who volleys with him at 0.25 s: aim at least 1.5 st apart, or a clearly different timbre. **Never:** an impression of anyone; a "trailer voice".

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Ray - Energetic, Enthusiastic and Clear | `z3FNMrCvtM1IHj84qvbr` | professional · middle-aged · upbeat | 123.5 Hz | "a natural enthusiasm… product demos": a showman at a preview; 2.5 st under Gerg |
| Charles - Social Media, TV & Commercial | `S9GPGBaMND8XWwwzxQXp` | high quality · young · confident | 130.1 Hz | "bold, charismatic… energy, clarity": the pride |
| The Pharaoh 3 - Energetic, Lively & Cheerful | `Qziuou6kCJ2R3w53L2Zs` | professional · young · casual | 129.4 Hz | "youthful, dynamic, cheerful, spontaneous" |
| Andy - Upbeat, Positive and Comfy | `PSqRw3ln34TxQZrTS6Wt` | professional · middle-aged · upbeat | 100.9 Hz | "naturally persuasive, confident yet approachable"; the lower option, far from Gerg |

### 3.2 XEL · 7 lines (sc 6)

**Brief:** **a calm, earnest interviewer** who asks long questions; warm, careful, curious. **Pick a timbre clearly unlike the real host's** (D-34); **no direction toward stillness, slowness or pauses**: the pauses are the edit's (the mic-meter cuts), not a performance. **Lane:** 95–130 Hz, away from the real host's (one candidate deliberately above it). **Separate from:** Mas (Jeremy, about 114 Hz), who alternates with him in one locked frame. **Never:** a Russian or any other accent; a deep monotone; "podcaster" impressions.

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Asher | `tMvyQtpCVQ0DkixuYm6J` | high quality · middle-aged · casual | 126.4 Hz | "warm, clear, conversational… natural pacing, friendly authority… podcasts"; 1.8 st over Mas |
| Kirt - Podcast Host | `qCwgiN0GsIAYwAJ1nYvZ` | high quality · middle-aged · pleasant | 121.4 Hz | "smooth, upbeat… pleasant, friendly tone": brighter and warmer than a monotone |
| Alex | `6sWNMlBf4TdebygSxQGj` | professional · middle-aged · professional | 98.3 Hz | "ideal for podcasts… tech content… sounds intelligent"; 2.6 st under Mas |
| Alex Wright - Clear and Cheerful | `GzE4TcXfh9rYCU9gVgPp` | high quality · middle-aged · confident | 147.3 Hz | above the lane on purpose: "friendly, approachable, warm", the furthest from the real host's register |

### 3.3 THE HUMANIST · 3 lines (sc 7)

**Brief:** soft, polite, a little caught out; a man moving boxes into someone else's basement. **Neutral American accent** (the real man's accent is not the joke; no accent humour, GR §6). **Lane:** 110–135 Hz. **Separate from:** Tasya (Tyler Kurk, 116–202 Hz on his Ep1 lines).

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Bill - Persuasive Calm & Friendly | `sR8sxaLJeFSh308Gi6HS` | professional · young · calm | 113.6 Hz | calm and friendly, a polite ask |
| Joseff Novak - Calm and Professional | `3TStB8f3X3To0Uj5R7RK` | high quality · young · calm | 106.9 Hz | "clear, friendly, professional" |
| Kyle - Clear, Balanced and Neutral | `GhkQkxbimoIykF4iGYqh` | high quality · young · calm | 114.6 Hz | "a clear, neutral voice" |
| Luis - Relaxed, Calm and Polished | `WGINef1wh4Hi6O62bfO8` | professional · young · relaxed | 112.6 Hz | "inquisitive… some breathiness": the caught-out edge (check the breath stays light) |

### 3.4 The DEMO ENGINEER · 9 lines (sc 9, 11) + his laugh

**Brief:** presenter-bright, nervous under it; a generic composite (headset, `DEMO` lanyard), nobody real. His laugh (9.03) recorded as a **separate take** in his own voice (never a laugh modelled on anyone's); it stops on Gerg's "laugh.". The two lines after the stream (11.15) are read off mic, to Rima beside him: lower and closer, statements ("Mas just posted. One word." · "'Her.' Like the movie. The guy and his computer."). **Lane:** 125–160 Hz. **Separate from:** CHATGTP (Maya, 238–281 Hz), Rima (Mia, about 170 Hz), and Gerg (Marcus, 143–152 Hz) in the wings.

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Ryan - Articulate, Friendly and Youthful | `qHR09fcvu6SoDtFzqFvm` | professional · young · casual | 125.7 Hz | "articulate, upbeat… explainer videos": a presenter; 2.2 st under Gerg |
| Adam - Engaging, Friendly and Bright | `s3TPKV1kjDlVtZbl4Ksh` | high quality · young · confident | 135.5 Hz | "clarity and confident expression": bright on stage |
| Eon - Clear and Optimistic | `TMxtmWOrUT1sk26Pe4aA` | professional · middle-aged · chill | 121.7 Hz | "relatable and friendly… warm, natural charm"; the low option |
| Jason - Warm, Confident and Natural | `3sfGn775ryaDXhFWHwBg` | professional · young · calm | 137.0 Hz | "perfect for… demos… natural pacing" (check timbre against Gerg) |

### 3.5 VOICE 1–4 · one hello each (sc 9)

**Brief:** four distinct product voices on a settings panel, each saying hello in a different tone, spread across lanes so the fifth (CHATGTP's Maya, about 250 Hz) is the bright one. **None imitates anyone, and none sounds like a real assistant product** (the screen already removed those). **VOICE 4's `Hi…` is soft and trailing, never breathy or sultry.**

| Slot | Read | Lane | Candidates (`voice_id`, preview F0) |
|---|---|---|---|
| VOICE 1 | `Hi.` level, low | 85–110 Hz | Tucker - Deep, Mature and Calm (`2Dn9vl2stwtaHkhE8iIb`, 108.8 Hz) · Peter - Audiobook Narrator (`B6vvITCUlHjDGhWvQQmI`, 94.2 Hz) · Alexander - Clear, Steady and Refined (`hIru3zkEJ3dBYHTbMy2V`, 84.9 Hz) |
| VOICE 2 | `Hi!` bright | 140–155 Hz | Drew - Casual, Curious & Fun (`q0IMILNRPxOgtBTS4taI`, 152.1 Hz) · Aidan - Social Media Influencer (`EOVAuWqgSZN2Oel78Psj`, 145.2 Hz) · Brad - Welcoming & Casual (`f5HLTX707KIM4SzJYzSz`, 142.7 Hz) |
| VOICE 3 | `hi?` a question, neutral | 110–160 Hz | Neutral Conversational Narrator (quick pace) (`ugwPvux61IszIA7kBQza`, 158.3 Hz; designed to feel gender-neutral) · Quinn - Comforting & Approachable (`wDfT0ggsNp2Lh21D10SV`, 111.3 Hz; androgynous) · Luna (`JjFExtCYfBGn1nn478bh`, 140.3 Hz; "neutral"; check the accent screen, the library says "English") |
| VOICE 4 | `Hi…` soft | 200–215 Hz | Sha - Warm, Inviting Narrator (`9GiYR5zXBWwc0khQNQA8`, 207.7 Hz) · Sarah Eve - Inviting and Friendly (`nf4MCGNSdM0hxM95ZBQR`, 210.1 Hz) · Kaylin - Warm, Expressive and Calm (`9q9xpGHwmkXdA4JI72IU`, 215.1 Hz) |

**Pick:** the four that are furthest apart from each other and from Maya (pitch and the 2–5 kHz presence), each at least 2 st from its neighbours.

### 3.6 STAFFER 2 · 1 line (sc 13)

**Brief:** a second plain staff read, smoothing tape on a pillar; never mocked. **Separate from:** the STAFFER (Avery, about 169 Hz) in the same two-shot: aim at least 2 st apart.

| Candidate | `voice_id` | Library labels | Preview F0 |
|---|---|---|---|
| Sarah - Casual & Modern | `uG1JFy6xppqckhHCs2KG` | professional · young · casual | 213.8 Hz (4 st over Avery) |
| Kristen - Friendly and Casual BFF | `Awx8TeMHHpDzbm42nIB6` | professional · young · casual | 218.8 Hz |
| Jessa - Easygoing and Effortless | `yj30vwTGJxSHezdAGsv9` | high quality · young · casual | 221.4 Hz |
| Jessi - Friendly, Smooth, and Soft | `09AoN6tYyW3VSTQqCo7C` | professional · young · pleasant | 194.9 Hz |

### 3.7 The TV REPORTER (O.S.) · 1 line (sc 13)

**Brief:** a press-conference question off a TV, through the TV chain (§4); generic, unnamed, never drawn. **Separate from:** the two staffers in the room.

| Candidate | `voice_id` | Library labels | Preview F0 |
|---|---|---|---|
| Eryn - Genuine, Friendly and Natural | `kdnRe2koJdOK4Ovxn2DI` | high quality · middle-aged · casual | 174.7 Hz |
| Leslie - Open, Strong and Approachable | `5Bd4WV6UTiSunxizNai6` | professional · middle-aged · confident | 221.4 Hz |
| Katherine - Professional, Clear, Warm | `CaJGGnGTRWSly2yoC75U` | professional · middle-aged · confident | 218.8 Hz |

### 3.8 BUKAJ · 2 lines (sc 14)

**Brief:** soft, exact, warm; a scientist who'd like a week before anyone asks for a schedule. **Lane:** 110–135 Hz. **Separate from:** Mas (Jeremy, about 114 Hz), in the same two-shot: the shortlist sits either side of him.

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Jacob - Soft Comfort | `Dgd9MUMSyPeTgbbDIZ0t` | high quality · young · gentle | 96.1 Hz | "warm, gentle… calm, steady"; 2.9 st under Mas |
| Scypher | `a6sKd2pET9A8uwzfI5Yr` | high quality · young · calm | 104.5 Hz | "soft, gentle, reflective" |
| Antoine | `edRtkKm7qEwZ8pH9ggtf` | professional · young · calm | 126.8 Hz | "rich, calm… warm, conversational"; 1.8 st over Mas |
| Kenneth - Storyteller | `8z82LG47qQ2qjeeQB8lk` | professional · young · calm | 108.2 Hz | "very clear diction… measured pace": the exactness |

### 3.9 EKIEL · 3 lines (F2.2, sc 18)

**Brief:** quiet, dry, squinting; says the hard thing plainly. **Neutral accent** (the real man's accent is not used). **Lane:** 110–140 Hz. **Separate from:** MARIO (Kokoro `am_liam`) in the right pane (and within about 1 dB of him in level), and ALYI (Louis, about 88 Hz) in F2.2.

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Mike Belkowski | `USXpAZuBZ22GqtSpuKoQ` | professional · middle-aged · professional | 120.0 Hz | "calm, steady… clear articulation and measured pacing" |
| Sawyer - Calm, Measured and Serious | `UQoLnPXvf18gaKpLzfb8` | high quality · middle-aged · calm | 105.1 Hz | "calm, measured and serious" |
| Dexter – Customer Support Pro | `Smxkoz0xiOoHo5WcSskf` | professional · middle-aged · professional | 108.2 Hz | "calm, confident" |
| Brandon | `QzclONYwRWvec152I3wf` | professional · young · chill | 107.5 Hz | "laid-back… dry": the dryness (check its "subtle sarcasm" doesn't read; he is never sarcastic) |

### 3.10 The CROWD · the chant (F2.2)

**Brief:** a holiday-party room joining Alyi's "FEEL THE AGI!", building from one voice to all: **8–12 layered library reads** of "Feel the A.G.I.! Feel the A.G.I.!", mixed men and women, each on its own seed and offset (40–180 ms), ducked under Alyi's lead; warm and giddy, **never a hymn or a rally**. These twelve are distinct from every principal and from each other:

Chris - Friendly conversational guide (`gScUm0AQVZBQ1uUp8KvE`) · Jake – Informative and Energetic (`hxPRa8HUuKYsm1kiWDEi`) · Joe Inglewood - Magnetic and Captivating (`UpphzPau5vxibPYV2NeV`) · Larry - Easygoing Customer Care Agent (`tgfcQY9SGvn3GfmnNWIi`) · Sam - Support Agent (`scOwDtmlUjD3prqpp97I`) · Eleila - Narrator (`e5LtAIHV5cnnDfMmCZYr`) · Gutentag (`TuRE87hoehQxHAhbCMR2`) · Lori - Happy, Sweet and Compassionate (`TbMNBJ27fH2U0VgpSNko`) · Kristen - Natural, Upbeat and Focused (`dfeOmy6Uay63tNhyO99j`) · Lauren - Friendly Customer Care Agent (`3liN8q8YoeB9Hk6AboKe`) · Lyan - Friendly Female Authentic UGC (`OHbs18UsFunlwffsTLNn`) · Larry – High-Energy Social Media Voice (`fIGaHjfrR8KmMy0vGEVJ`).

### 3.11 THE FORECASTER · 4 lines (sc 17)

**Brief:** conversational, precise, kind; a man who talks in medians, and who refuses without needing a number. His refusal is principled: no smugness, no martyrdom. **Lane:** 110–140 Hz. **Separate from:** Mas (Jeremy, about 114 Hz) beside him, and the DRIVER.

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Jack John - Conversational and Upbeat | `7EzWGsX10sAS4c9m9cPf` | high quality · middle-aged · professional | 137.0 Hz | "natural, conversational… confident and professional, yet conversational"; 3.2 st over Mas |
| Brandon - Casual, Youthful and Kind | `BvZBJROETmG9wGXEdSqX` | professional · young · casual | 105.7 Hz | "engaging, friendly, conversational", and kind |
| Josh - Warm, Smooth and Steady | `ZoiZ8fuDWInAcwPXaVeq` | high quality · young · casual | 105.7 Hz | "designed for natural back-and-forth dialogue" |
| Arthur – Casual Conversational American Male Narrator | `sfJopaWaOtauCD3HKX6Q` | high quality · young · casual | 112.0 Hz | "laid-back, friendly… relatable" (near Mas's pitch: check timbre) |

### 3.12 The DRIVER · 2 lines (sc 17)

**Brief:** an everyday voice through a car window, impatient but not angry; the honk joke is his. **Separate from:** the Forecaster and Mas.

| Candidate | `voice_id` | Library labels | Preview F0 |
|---|---|---|---|
| Matt - Natural, Chatty, Friendly | `pwMBn0SsmN1220Aorv15` | professional · middle-aged · casual | 98.6 Hz |
| Jerry B. - Authentic, Clear & Engaging | `J9NvviOEdVm6E7Hwdpdj` | high quality · middle-aged · casual | 139.4 Hz |
| Armando - Forthright and Stentorian | `TWUKKXAylkYxxlPe4gx0` | professional · young · casual | 137.4 Hz (a slight hoarseness) |
| Tony - Middle-aged with American accent | `hP72SDESIJq2YuAblBqz` | professional · middle-aged · calm | 98.0 Hz |

### 3.13 HARAS · 4 lines (sc 19)

**Brief:** pleasant, precise, brisk; she starts with the easy questions and says "Upside." without irony. **Neutral accent: never the real CFO's.** **Lane:** 165–200 Hz. **Separate from:** Gerg (Marcus) in the two-shot.

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Klara - Tech Executive & Scientist | `KLdWtAstZMPBbfqaBs59` | professional · middle-aged · confident | 168.7 Hz | "crisp, articulate… executive confidence" |
| Hannah - Neutral, Polished and Helpful | `Hh0rE70WfnSFN80K8uJC` | professional · young · professional | 194.9 Hz | "neutral, polished" |
| Jo - Warm, Smooth and Reassuring | `jemqINv7N9LKUclcLQnU` | professional · middle-aged · professional | 179.8 Hz | "warm, approachable… clear articulation": the pleasantness |
| Athena - Clear, Professional, Human | `Qin2NRfiKVQMJLxnoZaY` | professional · young · professional | 194.9 Hz | "professional yet convincingly human" |

---

## 4. Devices and treatments

The beat plans' line `tag` names the chain; the mix pass owns the settings (Ep1's chains where they exist).

| Tag | What it is | Lines |
|---|---|---|
| *(none)* | in the room, dry, the scene's room tone under it | most |
| `os` | off screen, in the same room | the Selbeep and Gerg O.S. lines, the staffers' whispers at the stone (4.20, 4.22), "we keep everything." (an L-cut), "A tenant.", THE PLAN's O.S. lines |
| `ghost` | the ghost treatment: a short dark reverb, a chip doubler a hair late | GHOST-NOLE |
| `phone` | a phone's small speaker (band-passed copy of the take) | Mas's recorded voice on Tasya's phone (7.01) |
| `call` | a phone call (the speaker in frame stays dry; the far end band-passed) | Mas to ELPPA (8.06), to LEGAL (17.09); Gerg's call (19.09–19.10), "which half?" included |
| `podcast` | the boardroom TV's podcast player: a small-speaker band-pass, then the room | NELEH (18.03–18.04) |
| `tv` | the lobby TV | the REPORTER (13.05) |
| `far` | Ep1's take, far off, as if down a corridor | ALYI's "Six years and eleven months." (15.03) |
| `sung` | the intro's sung-vocal pipeline (three parts), not TTS | CHATGTP's "one wo-o-ord." (11.05) |
| `chant` | 8–12 layered reads | the CROWD (15.06) |
| `offmic` | close and dry, lower, after the headset comes off | the ENGINEER (11.15) |

---

## 5. Names and respellings

Only the text **sent** to a voice changes; the lines keep the script's spelling (Ep1's rule). Ep1's respellings carry over (`respell` in cast-el.json). New ones are proposals until a forced-choice ASR check (`tools/pron_check.py`'s method, voices-el §P4) picks them.

| Name | Said in | Send as | Status |
|---|---|---|---|
| Mas / MAS | Terb (4A.03), the Engineer (11.15), the Staffer (19.06), Neleh (18.04) | "Moss" | Ep1 |
| Manalt | Terb's reading (4A.02) | "Man-alt" ("Mr." stays "Mister") | Ep1 |
| ALYI / alyi | XEL (6.04, 6.06), Mas (6.07) | "Al-yee" | Ep1 |
| NopeAI / NOPEAI | XEL (6.01; NOPEAI in the script since the script review, as every other quote), Neleh (18.04) | "Nope A.I." | Ep1 |
| MINDDEEP | Nole (4.24) | "Mind Deep" | **new**; check it isn't run together |
| CHATGTP | Neleh (18.03) | "Chat G-T-P" | Ep1 |
| AROS | Selbeep (1.02) | "Ah-ross" | **new**; check against "arrows" and "Eros" |
| RETTIWT | Neleh (18.03) | "Rett-twit" | **new**; the joke is the "twit" |
| Ekiel | Mario (18.11; Kokoro: its own IPA, as Ep1's Kokoro respellings) | "Eh-keel" | **new**; check |
| haras | (nobody says it since the script review: V.O. 13 now says "she", with Haras in frame) | "Hah-rahs", if a later line needs it | on file; **must not be heard as "harass" or "Harris"** (SIRRAH is Harris) |
| AGI | Alyi and the crowd (15.06) | "A.G.I." (the letters) | **new**; the chant sent in sentence case ("Feel the A.G.I.!"), the screen keeps capitals |
| ELSE | Nole (4.18) | "else" (sentence case; the stress is a reading note, not capitals) | **new** |

---

## 6. How to cast and record

1. **Screen** each new role with its own filters (§3) from Ep1's pool, and keep the shortlist here unless a candidate fails (log the replacement and why).
2. **Audition** each candidate on the role's own lines (all of them: these roles are short), dressed as the episode's takes (−16 LUFS, dry), at speed 1.0, then the top two at a speed fitted to the brief's pace on the episode's seeds (Ep1 §AA2).
3. **Measure in the scene** (`el_audition.py scene`): the role's lane; semitones apart from each voice it alternates with; the 2–5 kHz presence; the timbre distance (mean MFCCs); p(en) for the accent screen (under 0.985 fails); clipped tails; ASR recall. **Pick** the voice with no penalty, with a written reason, into `audio/ep02/cast-el.json` (the role, `voice_id`, library name, source, why, settings, what it measured).
4. **Record the takes** for every line (`el_render.py` per segment, under `audio/ep02/`: the pipeline reads ElevenLabs takes as `lines-A*.json` anywhere there, and Kokoro takes as `audio/ep02/v1/<seg>/lines-v1.json`), the carried roles at Ep1's settings, the new ones at their picked settings. **Long reads recorded whole and cut by the lock; cut-offs recorded complete** (CHATGTP's "…one of my favorite things."; Haras's "And profit?"); the three cuts made from their source takes (§2). Dialogue −16 LUFS, V.O. −18 LUFS at the take.
5. **Re-run the plan** (`python3 show/episodes/ep02/production/v1/beat-plan/_build.py --write`): each take row under `audio/ep02/` (`**/lines*.json`) with the line's id and its audible in/out replaces the planning length, and each scene re-fits around the takes.

**Budget** (Ep1 billed about 55 credits per 100 characters on `eleven_multilingual_v2`): the episode's takes are about 7,600 characters of text (MARIO is Kokoro and costs nothing) ≈ **4,200 credits** at one read each; the new roles' auditions, about 2,100 characters × 3.5 voices ≈ **4,000 credits**; the crowd, about 12 short reads; retakes on a bad read add about a fifth. This is the manifest's resource ask (§10): ElevenLabs credits for the auditions and the takes.

**For an ear first** (the delivery note's human list): VOICE 5 / CHATGTP by ear (it must sound like no real actress and no film character); V.O. 9's speed (rattled, never panicked); "which half?" dry, not a gag reading; Neleh's two lines against the podcast audio; whether XEL reads clearly unlike the real host; the crowd's chant (warm, never a rally).

---

## 7. Roles with no voice in Ep2

| Role | Why |
|---|---|
| **RUMPT** | **Not voiced in Ep2** (D-33). His real words are the broadcasts' lower thirds with the neutral text blip (`blip_text_neutral`); his invented business is wordless. The episode that first voices him logs the conflict as a decision, gets the guardrails owner's update, runs a blind resemblance check, and lists a human performer as a resource ask |
| **REMUHCS** | No line (D-50): the presser's button is an aide's wordless tenth sticker. Marc Laurent stays on file |
| **ADELINA · MADA · OMIS** | On screen, silent (Adelina's lanyard; Mada's minutes; Omis's nameplate) |
| **LEGAL** | A grey tile, never named, never heard (17.08–17.09) |
| **DOT · MIT KOOC · THE SLEEVE · the VISITOR · the news-desk HOST · IRIS** | Wordless by design |
| **THE ORB** | Its chimes and servo only (SFX) |
| **the actress in the "her" story** | Never drawn, voiced or named |
