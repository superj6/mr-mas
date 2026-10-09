# Ep2 v1: the cast (`ep1.1_her.wav`)

> **Status: the voice plan for the one-go build, 2026-10-08, updated after the script review (its log is at the end of [script-v1.md](script-v1.md#review-log-script-review)). Nothing is recorded yet.** **Cast on 2026-10-09:** every new role in §3 is auditioned and picked by measurement ([§8](#8-the-casting-pass-2026-10-09)), into `audio/ep02/cast-el.json`; each pick's auditioned lines are its film takes, already cached. **Recorded on 2026-10-09** (the takes pass): every line of the beat plans has its take, measured and retaken where it failed, with the per-line readings and settings the briefs asked for: [takes-qa.md](takes-qa.md). Every speaking role in [script-v1.md](script-v1.md) and its beat plans ([beat-plan/](beat-plan/)), with its voice: Ep1's ElevenLabs cast where the role exists ([voices-el.md](../../../ep01/production/full-v3/voices-el.md); [cast-el.json](../../../../../audio/ep01/v3-el/cast-el.json), read, never edited), MARIO on Kokoro, and a shortlist of 3–4 ElevenLabs **library** voices to audition for every new role. Ep2's own cast file is `audio/ep02/cast-el.json` (the pipeline's copy of Ep1's, its starting point; the voice pass adds each new role's pick to it from this page).
>
> **The firm rules** (LEARNINGS S6, S7; guardrails §5–§6): library voices only (ElevenLabs premade voices, or shared Voice Library voices called by `voice_id`: each a voice its owner made of their own voice). **No cloning, no voice design from anyone's audio, no "sounds like" prompt, no laugh mimicry, no voice chosen or directed to resemble a real person.** One film: Mas is Jeremy; MARIO keeps his Kokoro voice, matched into the room. No two roles share a voice. Nobody here has listened: the shortlists are a screen by the library's own words and a pitch measure of each preview; the pick is made by measurement with a written reason (Ep1's method, voices-el §AA), and the human listen goes on the delivery note.

**Contents:** [1. Every speaking role](#1-every-speaking-role) · [2. Ep1's cast, carried over](#2-ep1s-cast-carried-over) · [3. New roles: the shortlists](#3-new-roles-the-shortlists) · [4. Devices and treatments](#4-devices-and-treatments) · [5. Names and respellings](#5-names-and-respellings) · [6. How to cast and record](#6-how-to-cast-and-record) · [7. Roles with no voice in Ep2](#7-roles-with-no-voice-in-ep2) · [8. The casting pass](#8-the-casting-pass-2026-10-09)

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
| **SELBEEP** | `selbeep` | 4 | 1 | **The Pharaoh 3 - Energetic, Lively & Cheerful** (EL; §3.1) | **cast** |
| **XEL** | `xel` | 7 | 6 | **Alex Wright - Clear and Cheerful** (EL; §3.2) | **cast** |
| **THE HUMANIST** | `humanist` | 3 | 7 | **Luis - Relaxed, Calm and Polished** (EL, speed 0.80; §3.3) | **cast** |
| **the DEMO ENGINEER** | `engineer` | 9 | 9, 11 | **Ryan - Articulate, Friendly and Youthful** (EL; §3.4) | **cast** |
| **VOICE 1–4** | `voice1`–`voice4` | 1 each (`Hi.` · `Hi!` · `hi?` · `Hi…`) | 9 | **Alexander · Brad · Quinn · Sarah Eve** (EL; §3.5) | **cast** |
| **STAFFER 2** | `staffer2` | 1 | 13 | **Jessi - Friendly, Smooth, and Soft** (EL; §3.6) | **cast** |
| **the TV REPORTER** | `reporter` | 1 | 13 | **Katherine - Professional, Clear, Warm** (EL; §3.7) | **cast** |
| **BUKAJ** | `bukaj` | 2 | 14 | **Scypher** (EL, speed 0.85; §3.8) | **cast** |
| **EKIEL** | `ekiel` | 3 | 15 (F2.2), 18 | **Dexter – Customer Support Pro** (EL, speed 0.80; §3.9) | **cast** |
| **the CROWD** (the chant) | `crowd` | 1 (layered) | 15 (F2.2) | **10 layered library reads** (EL; §3.10) | **cast** |
| **THE FORECASTER** | `forecaster` | 4 | 17 | **Jack John - Conversational and Upbeat** (EL, speed 0.80; §3.11) | **cast** |
| **the DRIVER** | `driver` | 2 | 17 | **Jerry B. - Authentic, Clear & Engaging** (EL; §3.12) | **cast** |
| **HARAS** | `haras` | 4 | 19 | **Hannah - Neutral, Polished and Helpful** (EL; §3.13) | **cast** |

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

**The picks (the casting pass, 2026-10-09).** Each candidate read one or two of the role's real lines from the beat plans through the Ep2 EL route, on the episode's own seeds, dressed as the episode's takes (−16 LUFS, dry). The pick is by measurement, with its numbers and reason under each shortlist below; [§8](#8-the-casting-pass-2026-10-09) has the method, the definitions and the rule. **Nobody has listened** (R8). Every pick's auditioned lines are its film takes: they are cached, and the takes pass sends nothing for them ([M] an `el_render.py --dry-run` on the 25 lines: "chars that a real run would send: 0").

| Role | Cast (library voice, `voice_id`) | Stability / style / speed | Measured on its takes | Next in line (cached) |
|---|---|---|---|---|
| SELBEEP | **The Pharaoh 3 - Energetic, Lively & Cheerful** (`Qziuou6kCJ2R3w53L2Zs`) | 0.40 / 0.15 / 1.0 | 135 Hz; 1.7 st under Gerg, timbre 51 from him; 184 wpm (0.95 of the plan) | Charles |
| XEL | **Alex Wright - Clear and Cheerful** (`GzE4TcXfh9rYCU9gVgPp`) | 0.55 / 0.05 / 1.0 | 129 Hz; 2.1 st over Mas (the only one past 1.5); 194 wpm | Kirt |
| THE HUMANIST | **Luis - Relaxed, Calm and Polished** (`WGINef1wh4Hi6O62bfO8`) | 0.50 / 0.05 / **0.80** | 113 Hz; 3.0 st under Tasya; 185 wpm at 0.80 (0.89 of the plan) | Bill |
| THE DEMO ENGINEER | **Ryan - Articulate, Friendly and Youthful** (`qHR09fcvu6SoDtFzqFvm`) | 0.40 / 0.15 / 1.0 | 134 Hz; 1.9 st under Gerg, 3.2 under Rima; the only verbatim "The guy and his computer" | Adam |
| VOICE 1 · 2 · 3 · 4 | **Alexander** (`hIru3zkEJ3dBYHTbMy2V`) · **Brad** (`f5HLTX707KIM4SzJYzSz`) · **Quinn** (`wDfT0ggsNp2Lh21D10SV`) · **Sarah Eve** (`nf4MCGNSdM0hxM95ZBQR`) | 0.55 / 0 · 0.45 / 0.20 · 0.50 / 0.05 · 0.60 / 0, all 1.0 | 88 · 147 · 131 · 217 Hz, with Maya's 258: every neighbour gap at least 2.0 st | Tucker · Drew · Luna · Kaylin |
| STAFFER 2 | **Jessi - Friendly, Smooth, and Soft** (`09AoN6tYyW3VSTQqCo7C`) | 0.50 / 0 / 1.0 | 188 Hz; 2.2 st over Avery, 1.7 under the reporter | Kristen |
| THE TV REPORTER | **Katherine - Professional, Clear, Warm** (`CaJGGnGTRWSly2yoC75U`) | 0.50 / 0.05 / 1.0 | 208 Hz; 3.9 st over Avery; the question rises; verbatim through the TV chain | Leslie |
| BUKAJ | **Scypher** (`a6sKd2pET9A8uwzfI5Yr`) | 0.60 / 0 / **0.85** | 110 Hz; 0.7 st under Mas but timbre 46 from him (4.8× Mas's own spread); 165 wpm at 0.85 | Kenneth |
| EKIEL | **Dexter – Customer Support Pro** (`Smxkoz0xiOoHo5WcSskf`) | 0.60 / 0 / **0.80** | 110 Hz; 1.4 st under MARIO (timbre 62), 3.7 over Alyi | Mike Belkowski |
| THE CROWD | **10 voices** (§3.10) | 0.40 / 0.20 / 1.0 | every one reads "A.G.I." as letters, cleanly; 104–383 Hz | — |
| THE FORECASTER | **Jack John - Conversational and Upbeat** (`7EzWGsX10sAS4c9m9cPf`) | 0.50 / 0.05 / **0.80** | 137 Hz; 3.2 st over Mas, 6.1 under the Driver; 173 wpm at 0.80 (0.99 of the plan) | Arthur |
| THE DRIVER | **Jerry B. - Authentic, Clear & Engaging** (`J9NvviOEdVm6E7Hwdpdj`) | 0.45 / 0.10 / 1.0 | 195 Hz (a raised voice); 9.3 st over Mas, 6.5 over the Forecaster; 216 wpm | Tony |
| HARAS | **Hannah - Neutral, Polished and Helpful** (`Hh0rE70WfnSFN80K8uJC`) | 0.50 / 0.05 / 1.0 | 212 Hz; 6.1 st over Gerg; 191 wpm; the cleanest floor (72 dB) | Klara |

Similarity 0.75 and speaker boost throughout, `eleven_multilingual_v2`. Each table below: **Score** is the sum of the penalties (lower is better); **vs X** is semitones from that voice's median and the mean-MFCC timbre distance; **speed** is the round the film would use; **length / plan** is the audible length against the beat plan's planning length (geometric mean over the lines); **floor / S:F** is the raw ElevenLabs file's noise floor (dBFS) and how far under the speech it sits; **CPP** is the cepstral peak prominence (dB; lower is breathier). §8.3 defines each one.

### 3.1 SELBEEP · 4 lines (sc 1)

**Brief:** a proud showman presenting to a room; bright, pleased with himself; never a carnival barker. **Lane:** 120–150 Hz. **Separate from:** Gerg (Marcus, about 143–152 Hz), who volleys with him at 0.25 s: aim at least 1.5 st apart, or a clearly different timbre. **Never:** an impression of anyone; a "trailer voice".

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Ray - Energetic, Enthusiastic and Clear | `z3FNMrCvtM1IHj84qvbr` | professional · middle-aged · upbeat | 123.5 Hz | "a natural enthusiasm… product demos": a showman at a preview; 2.5 st under Gerg |
| Charles - Social Media, TV & Commercial | `S9GPGBaMND8XWwwzxQXp` | high quality · young · confident | 130.1 Hz | "bold, charismatic… energy, clarity": the pride |
| The Pharaoh 3 - Energetic, Lively & Cheerful | `Qziuou6kCJ2R3w53L2Zs` | professional · young · casual | 129.4 Hz | "youthful, dynamic, cheerful, spontaneous" |
| Andy - Upbeat, Positive and Comfy | `PSqRw3ln34TxQZrTS6Wt` | professional · middle-aged · upbeat | 100.9 Hz | "naturally persuasive, confident yet approachable"; the lower option, far from Gerg |

**The audition** (`e2-co-0003` "A mammoth walking through the snow…", `e2-co-0005` "That's the mammoth…"; 0.40 / 0.15 / 1.0):

| Rank | Voice | Score | F0 (Hz) | vs gerg | speed | wpm | length / plan | ASR | p(en) | floor / S:F | CPP | penalties, brief |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **The Pharaoh 3 - Energetic, Lively & Cheerful** | 0.54 | 134.9 | -1.7 st / 51 | 1 | 184 | 0.95 | verbatim | 0.997 | -64 / 42 dB | 18.59 | noise 0.54 |
| 2 | Charles - Social Media, TV & Commercial  | 0.65 | 119.9 | -3.8 st / 31 | 1 | 214 | 0.82 | verbatim | 0.998 | -87 / 67 dB | 19.5 | lane 0.01, pace 0.63; narrow range |
| 3 | Ray - Energetic, Enthusiatic and Clear | 1.72 | 129.0 | -2.5 st / 26 | 1 | 216 | 0.81 | verbatim | 1.000 | -60 / 40 dB | 18.93 | noise 1.02, pace 0.7 |
| 4 | Andy - Upbeat, Positive and Comfy | 4.53 | 113.6 | -4.7 st / 35 | 1 | 216 | 0.81 | verbatim | 0.998 | -54 / 31 dB | 18.02 | lane 0.95, noise 2.8, pace 0.78 |

**Cast: The Pharaoh 3 - Energetic, Lively & Cheerful.** The lowest score; the one penalty is a light floor (speech 42 dB over it). At 135 Hz he sits inside the lane, 1.7 st under Gerg, with a timbre distance of 51 from him (3.3× Marcus's own take-to-take spread of 15.6), so the 0.25 s volley stays two voices in both pitch and timbre. He has the widest range of the four (15.7 st, a showman's lift) and reads at the plan's pace at speed 1.0 (184 wpm). Verbatim; p(en) 0.997. Charles reads a flat 6 st, Ray's timbre is the nearest to Gerg's (26), and Andy sits under the lane with the noisiest floor.

### 3.2 XEL · 7 lines (sc 6)

**Brief:** **a calm, earnest interviewer** who asks long questions; warm, careful, curious. **Pick a timbre clearly unlike the real host's** (D-34); **no direction toward stillness, slowness or pauses**: the pauses are the edit's (the mic-meter cuts), not a performance. **Lane:** 95–130 Hz, away from the real host's (one candidate deliberately above it). **Separate from:** Mas (Jeremy, about 114 Hz), who alternates with him in one locked frame. **Never:** a Russian or any other accent; a deep monotone; "podcaster" impressions.

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Asher | `tMvyQtpCVQ0DkixuYm6J` | high quality · middle-aged · casual | 126.4 Hz | "warm, clear, conversational… natural pacing, friendly authority… podcasts"; 1.8 st over Mas |
| Kirt - Podcast Host | `qCwgiN0GsIAYwAJ1nYvZ` | high quality · middle-aged · pleasant | 121.4 Hz | "smooth, upbeat… pleasant, friendly tone": brighter and warmer than a monotone |
| Alex | `6sWNMlBf4TdebygSxQGj` | professional · middle-aged · professional | 98.3 Hz | "ideal for podcasts… tech content… sounds intelligent"; 2.6 st under Mas |
| Alex Wright - Clear and Cheerful | `GzE4TcXfh9rYCU9gVgPp` | high quality · middle-aged · confident | 147.3 Hz | above the lane on purpose: "friendly, approachable, warm", the furthest from the real host's register |

**The audition** (`e2-a1-0036` "Let me ask you about ALYI…", `e2-a1-0038` "What about a regular secret facility?"; 0.55 / 0.05 / 1.0):

| Rank | Voice | Score | F0 (Hz) | vs mas | speed | wpm | length / plan | ASR | p(en) | floor / S:F | CPP | penalties, brief |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Alex Wright - Clear and Cheerful** | 0.67 | 128.5 | +2.1 st / 32 | 1 | 194 | 0.82 | verbatim | 0.994 | -87 / 68 dB | 19.83 | pace 0.67 |
| 2 | Kirt - Podcast Host | 2.36 | 118.2 | +0.7 st / 48 | 1 | 211 | 0.75 | verbatim | 0.998 | -68 / 52 dB | 18.13 | separation 0.82, pace 1.53 |
| 3 | Asher | 2.58 | 117.3 | +0.5 st / 46 | 1 | 212 | 0.74 | verbatim | 0.998 | -76 / 56 dB | 17.91 | separation 0.97, pace 1.62 |
| 4 | Alex | 3.45 | 112.7 | -0.1 st / 27 | 1 | 223 | 0.71 | verbatim | 0.999 | -68 / 45 dB | 18.25 | separation 1.35, pace 2.1 |

**Cast: Alex Wright - Clear and Cheerful.** The only candidate with no separation shortfall. At 129 Hz he is 2.1 st over Mas in the locked frame they share; Kirt, Asher and Alex sit 0.1–0.7 st from him. He is the candidate this page put above the real host's register on purpose, and his reads span 12.4 st (no monotone). At speed 1.0 he reads 194 wpm (0.82 of the plan). He stays at 1.0: the brief rules out any direction toward slowness, and the pauses are the edit's. Verbatim; p(en) 0.994; the cleanest floor of the four (68 dB).

### 3.3 THE HUMANIST · 3 lines (sc 7)

**Brief:** soft, polite, a little caught out; a man moving boxes into someone else's basement. **Neutral American accent** (the real man's accent is not the joke; no accent humour, GR §6). **Lane:** 110–135 Hz. **Separate from:** Tasya (Tyler Kurk, 116–202 Hz on his Ep1 lines).

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Bill - Persuasive Calm & Friendly | `sR8sxaLJeFSh308Gi6HS` | professional · young · calm | 113.6 Hz | calm and friendly, a polite ask |
| Joseff Novak - Calm and Professional | `3TStB8f3X3To0Uj5R7RK` | high quality · young · calm | 106.9 Hz | "clear, friendly, professional" |
| ~~Kyle - Clear, Balanced and Neutral~~ | `GhkQkxbimoIykF4iGYqh` | high quality · young · calm | 114.6 Hz | **screened out**: the library describes it by ethnicity ("Young white man…"; Ep1 §AC2 passed such voices over) |
| Grey - Soft, Calm and Conversational (the replacement) | `rt7umfgRH4xBjSnI23My` | professional · young · casual | 112.0 Hz | "Nice Simple Guy"; from the live library (Ep1's saved pool had no passing voice in the lane with the brief's words): in the lane, the most brief words ("soft", "calm") |
| Luis - Relaxed, Calm and Polished | `WGINef1wh4Hi6O62bfO8` | professional · young · relaxed | 112.6 Hz | "inquisitive… some breathiness": the caught-out edge (check the breath stays light) |

**The audition** (`e2-a1-0048` "I'm just moving in downstairs…", `e2-a1-0050` "I brought my own team…"; 0.50 / 0.05; round 1 at 1.0, where all four read 0.61–0.71 of the plan, then the top two at 0.80):

| Rank | Voice | Score | F0 (Hz) | vs tasya | speed | wpm | length / plan | ASR | p(en) | floor / S:F | CPP | penalties, brief |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Luis - Relaxed, Calm and Polished** | 0.00 | 112.6 | -3.0 st / 40 | 0.8 | 185 | 0.89 | verbatim | 0.990 | -76 / 48 dB | 18.21 |  |
| 2 | Bill - Persuasive Calm & Friendly | 1.77 | 111.5 | -3.2 st / 54 | 0.8 | 210 | 0.79 | verbatim | 0.991 | -65 / 41 dB | 20.57 | noise 0.74, pace 1.03 |
| 3 | Joseff Novak - Calm and Professional | 3.72 | 112.5 | -3.0 st / 60 | 1 | 270 | 0.61 | verbatim | 0.995 | -80 / 61 dB | 20.77 | pace 3.72 |
| 4 | Grey - Soft, Calm and Conversational | 5.70 | 113.3 | -2.9 st / 54 | 1 | 259 | 0.64 | verbatim | 0.989 | -58 / 33 dB | 16.87 | noise 2.42, pace 3.28 |

**Cast: Luis - Relaxed, Calm and Polished, at speed 0.80.** Score 0 with his round-2 takes. At 113 Hz he sits inside the lane, 3.0 st under Tasya (timbre 40). At 0.80 he reads 185 wpm, 0.89 of the plan. The library's "some breathiness" was checked: his CPP is 18.2 dB, inside the field's 16.9–20.8, so he is no breathier than the others and the breath stays light. p(en) 0.990 (neutral American). Verbatim once the recogniser's "alright" is read as "all right". Bill is next: at 0.80 he is still fast (0.79 of the plan), with a noisier floor. Grey measured fast and noisy.

### 3.4 The DEMO ENGINEER · 9 lines (sc 9, 11) + his laugh

**Brief:** presenter-bright, nervous under it; a generic composite (headset, `DEMO` lanyard), nobody real. His laugh (9.03) recorded as a **separate take** in his own voice (never a laugh modelled on anyone's); it stops on Gerg's "laugh.". The two lines after the stream (11.15) are read off mic, to Rima beside him: lower and closer, statements ("Mas just posted. One word." · "'Her.' Like the movie. The guy and his computer."). **Lane:** 125–160 Hz. **Separate from:** CHATGTP (Maya, 238–281 Hz), Rima (Mia, about 170 Hz), and Gerg (Marcus, 143–152 Hz) in the wings.

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Ryan - Articulate, Friendly and Youthful | `qHR09fcvu6SoDtFzqFvm` | professional · young · casual | 125.7 Hz | "articulate, upbeat… explainer videos": a presenter; 2.2 st under Gerg |
| Adam - Engaging, Friendly and Bright | `s3TPKV1kjDlVtZbl4Ksh` | high quality · young · confident | 135.5 Hz | "clarity and confident expression": bright on stage |
| Eon - Clear and Optimistic | `TMxtmWOrUT1sk26Pe4aA` | professional · middle-aged · chill | 121.7 Hz | "relatable and friendly… warm, natural charm"; the low option |
| Jason - Warm, Confident and Natural | `3sfGn775ryaDXhFWHwBg` | professional · young · calm | 137.0 Hz | "perfect for… demos… natural pacing" (check timbre against Gerg) |

**The audition** (`e2-a2-0003` "So on stage, I ask it a question…", the presenter; `e2-a2-0038` "'Her.' Like the movie. The guy and his computer.", off mic; 0.40 / 0.15 / 1.0):

| Rank | Voice | Score | F0 (Hz) | vs chatgtp | vs rima | vs gerg | speed | wpm | length / plan | ASR | p(en) | floor / S:F | CPP | penalties, brief |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Ryan - Articulate, Friendly and Youthful** | 0.94 | 133.5 | -11.4 st / 58 | -3.2 st / 50 | -1.9 st / 38 | 1 | 202 | 0.90 | verbatim | 0.999 | -57 / 40 dB | 17.45 | noise 0.94; off-mic line not lower |
| 2 | Adam - Engaging, Friendly and Bright | 2.82 | 127.4 | -12.2 st / 62 | -4.0 st / 48 | -2.7 st / 31 | 1 | 230 | 0.80 | 0.89 | 0.996 | -69 / 47 dB | 18.02 | clean 2, pace 0.82; ASR not verbatim |
| 3 | Eon - Clear and Optimistic | 5.77 | 121.3 | -13.1 st / 62 | -4.9 st / 42 | -3.6 st / 23 | 1 | 249 | 0.75 | 0.89 | 0.993 | -64 / 36 dB | 19.88 | lane 0.51, clean 2, noise 1.7, pace 1.56; ASR not verbatim |
| 4 | Jason - Warm, Confident and Natural | 6.03 | 140.7 | -10.5 st / 56 | -2.3 st / 53 | -1.0 st / 30 | 1 | 215 | 0.86 | 0.89 | 0.994 | -61 / 36 dB | 16.57 | clean 4, noise 1.86, pace 0.17; off-mic line not lower, ASR not verbatim |

**Cast: Ryan - Articulate, Friendly and Youthful.** He gave the only clean read of the off-mic line: the recogniser heard the other three as "the guy *in* his computer". At 134 Hz he sits inside the lane, 1.9 st under Gerg in the wings (timbre 38), 3.2 st under Rima and 11.4 st under CHATGTP. He reads 202 wpm at 1.0 (0.90 of the plan); p(en) 0.999; a light floor penalty (40 dB). **For the takes pass:** his off-mic line read higher (151 Hz) than his stage line (118 Hz), against the brief's "lower and closer". A calmer per-line read for `e2-a2-0037`/`-0038` (`line_settings`) is the fix, if the ear agrees. His laugh (9.03) is a separate take and was not auditioned.

### 3.5 VOICE 1–4 · one hello each (sc 9)

**Brief:** four distinct product voices on a settings panel, each saying hello in a different tone, spread across lanes so the fifth (CHATGTP's Maya, about 250 Hz) is the bright one. **None imitates anyone, and none sounds like a real assistant product** (the screen already removed those). **VOICE 4's `Hi…` is soft and trailing, never breathy or sultry.**

| Slot | Read | Lane | Candidates (`voice_id`, preview F0) |
|---|---|---|---|
| VOICE 1 | `Hi.` level, low | 85–110 Hz | Tucker - Deep, Mature and Calm (`2Dn9vl2stwtaHkhE8iIb`, 108.8 Hz) · Peter - Audiobook Narrator (`B6vvITCUlHjDGhWvQQmI`, 94.2 Hz) · Alexander - Clear, Steady and Refined (`hIru3zkEJ3dBYHTbMy2V`, 84.9 Hz) |
| VOICE 2 | `Hi!` bright | 140–155 Hz | Drew - Casual, Curious & Fun (`q0IMILNRPxOgtBTS4taI`, 152.1 Hz) · Aidan - Social Media Influencer (`EOVAuWqgSZN2Oel78Psj`, 145.2 Hz) · Brad - Welcoming & Casual (`f5HLTX707KIM4SzJYzSz`, 142.7 Hz) |
| VOICE 3 | `hi?` a question, neutral | 110–160 Hz | Neutral Conversational Narrator (quick pace) (`ugwPvux61IszIA7kBQza`, 158.3 Hz; designed to feel gender-neutral) · Quinn - Comforting & Approachable (`wDfT0ggsNp2Lh21D10SV`, 111.3 Hz; androgynous) · Luna (`JjFExtCYfBGn1nn478bh`, 140.3 Hz; "neutral"; check the accent screen, the library says "English") |
| VOICE 4 | `Hi…` soft | 200–215 Hz | Sha - Warm, Inviting Narrator (`9GiYR5zXBWwc0khQNQA8`, 207.7 Hz) · Sarah Eve - Inviting and Friendly (`nf4MCGNSdM0hxM95ZBQR`, 210.1 Hz) · Kaylin - Warm, Expressive and Calm (`9q9xpGHwmkXdA4JI72IU`, 215.1 Hz) |

**Pick:** the four that are furthest apart from each other and from Maya (pitch and the 2–5 kHz presence), each at least 2 st from its neighbours.

**The audition** (each slot's own line; settings 0.55 / 0 · 0.45 / 0.20 · 0.50 / 0.05 · 0.60 / 0, speed 1.0; VOICE 4's line sent as "Hi...", because the house text rule would drop the trailing ellipsis, and the trail is the read: `say_lines`). One syllable defeats the house pitch tracker, which jumped an octave on several reads (Brad at 290 Hz against a 143 Hz preview). So the F0 here is the same tracker searched inside each voice's own range, its library preview ×/÷1.8, and "rise" is the pitch across the word. No accent measure is possible on one syllable.

| Slot | Voice | Score | F0 on the take (Hz) | Preview F0 | Rise across the word (st) | 2–5 kHz presence | Length | ASR | floor / S:F | CPP |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Alexander - Clear, Steady and Refined** | 0.00 | 88.0 | 84.9 | −3.2 | −15.8 dB | 0.49 s | verbatim | −83 / 70 dB | 14.79 |
| 1 | Tucker - Deep, Mature and Calm | 4.12 | 67.0 | 108.8 | +4.8 | −13.5 dB | 0.40 s | verbatim | −93 / 74 dB | 13.76 |
| 1 | Peter - Audiobook Narrator | 4.30 | 114.3 | 94.2 | −1.4 | −13.6 dB | 0.55 s | verbatim (tail clipped) | −62 / 37 dB | 15.61 |
| 2 | **Brad - Welcoming & Casual** | 0.00 | 146.8 | 142.7 | −8.9 | −8.2 dB | 0.33 s | verbatim | −76 / 60 dB | 18.83 |
| 2 | Drew - Casual, Curious & Fun | 0.01 | 139.9 | 152.1 | −1.6 | −8.9 dB | 0.43 s | verbatim | −85 / 68 dB | 24.6 |
| 2 | Aidan - Social Media Influencer | 0.18 | 156.6 | 145.2 | −8.1 | −12.3 dB | 0.36 s | verbatim | −87 / 72 dB | 23.33 |
| 3 | **Quinn - Comforting & Approachable** | 0.00 | 130.8 | 111.3 | +4.4 | −23.8 dB | 0.44 s | verbatim | −82 / 56 dB | 19.62 |
| 3 | Luna | 3.66 | 176.1 | 140.3 | +5.3 | −13.9 dB | 0.42 s | "Aye." | −90 / 73 dB | 25.65 |
| 3 | Neutral Conversational Narrator (quick pace) | 9.35 | 185.0 | 158.3 | +0.2 | −24.9 dB | 0.67 s | verbatim | −48 / 11 dB | 15.05 |
| 4 | **Sarah Eve - Inviting and Friendly** | 0.18 | 217.3 | 210.1 | +1.0 | −13.8 dB | 0.70 s | verbatim | −77 / 49 dB | 18.4 |
| 4 | Kaylin - Warm, Expressive and Calm | 3.78 | 267.4 | 215.1 | −9.1 | −19.3 dB | 0.36 s | verbatim | −70 / 50 dB | 16.62 |
| 4 | Sha - Warm, Inviting Narrator | 8.22 | 326.2 | 207.7 | −4.1 | −16.8 dB | 0.63 s | verbatim | −51 / 40 dB | 21.61 |

**Cast, jointly: VOICE 1 Alexander, VOICE 2 Brad, VOICE 3 Quinn, VOICE 4 Sarah Eve.** Sorted by pitch with VOICE 5 (Maya, 258 Hz), the five sit at 88 · 131 · 147 · 217 · 258 Hz, with neighbour gaps of 6.9, 2.0, 6.8 and 3.0 st. Of the 81 combinations, this one has the fewest points (lane, clean takes, each slot's brief) and every gap at least 2 st. Where the gap is tightest (Quinn to Brad, 2.0 st), the presence differs by 15.6 dB (Quinn among the darkest of the twelve, Brad the brightest), so the two read apart. Quinn's "hi?" rises 4.4 st (a question). Sarah Eve's "Hi…" trails for 0.70 s at CPP 18.4 dB, not breathy, and a 4 st range: soft, never sultry. Alexander is the low, level slot. Next in line: Drew for VOICE 2 (as good alone, but 1.2 st from Quinn); Tucker creaked to 67 Hz; Luna was heard as "Aye"; Kaylin and Sha crowd Maya. Brad's library text ("a pleasant digital AI assistant") is generic; no product or person is named.

### 3.6 STAFFER 2 · 1 line (sc 13)

**Brief:** a second plain staff read, smoothing tape on a pillar; never mocked. **Separate from:** the STAFFER (Avery, about 169 Hz) in the same two-shot: aim at least 2 st apart.

| Candidate | `voice_id` | Library labels | Preview F0 |
|---|---|---|---|
| Sarah - Casual & Modern | `uG1JFy6xppqckhHCs2KG` | professional · young · casual | 213.8 Hz (4 st over Avery) |
| Kristen - Friendly and Casual BFF | `Awx8TeMHHpDzbm42nIB6` | professional · young · casual | 218.8 Hz |
| Jessa - Easygoing and Effortless | `yj30vwTGJxSHezdAGsv9` | high quality · young · casual | 221.4 Hz |
| Jessi - Friendly, Smooth, and Soft | `09AoN6tYyW3VSTQqCo7C` | professional · young · pleasant | 194.9 Hz |

**The audition** (`e2-a3-0002` "In the corridor, last week. For a second."; 0.50 / 0 / 1.0; ranked jointly with the reporter, each against the other's pick):

| Rank | Voice | Score | F0 (Hz) | vs staffer | vs reporter | speed | wpm | length / plan | ASR | p(en) | floor / S:F | CPP | penalties, brief |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Jessi - Friendly, Smooth, and Soft** | 1.44 | 187.9 | +2.2 st / 27 | -1.7 st / 52 | 1 | 202 | 0.85 | verbatim | 0.997 | -74 / 39 dB | 15.81 | noise 1.16, pace 0.28 |
| 2 | Kristen - Friendly and Casual BFF | 1.56 | 221.1 | +5.0 st / 47 | +1.1 st / 29 | 1 | 219 | 0.78 | verbatim | 0.996 | -63 / 48 dB | 20.2 | separation 0.41, pace 1.15 |
| 3 | Jessa - Easygoing and Effortless | 2.80 | 178.7 | +1.3 st / 30 | -2.6 st / 42 | 1 | 240 | 0.71 | verbatim | 0.997 | -86 / 63 dB | 22.19 | separation 0.7, pace 2.1 |
| 4 | Sarah - Casual & Modern | 3.29 | 181.1 | +1.5 st / 30 | -2.4 st / 55 | 1 | 257 | 0.67 | verbatim | 0.999 | -86 / 52 dB | 19.14 | separation 0.47, pace 2.81 |

**Cast: Jessi - Friendly, Smooth, and Soft** (with Katherine as the reporter, the pair with the lowest score). At 188 Hz she is 2.2 st over Avery, which is what the two-shot asks, and 1.7 st under the reporter. She reads 202 wpm (0.85 of the plan); verbatim; p(en) 0.997; a light floor penalty (39 dB). **For the ear:** her timbre is the nearest to Avery's of the four (distance 27). If the two staffers blur into one, Kristen is the cached alternative (5.0 st over Avery, distance 47), at the cost of sitting 1.1 st from the reporter.

### 3.7 The TV REPORTER (O.S.) · 1 line (sc 13)

**Brief:** a press-conference question off a TV, through the TV chain (§4); generic, unnamed, never drawn. **Separate from:** the two staffers in the room.

| Candidate | `voice_id` | Library labels | Preview F0 |
|---|---|---|---|
| Eryn - Genuine, Friendly and Natural | `kdnRe2koJdOK4Ovxn2DI` | high quality · middle-aged · casual | 174.7 Hz |
| Leslie - Open, Strong and Approachable | `5Bd4WV6UTiSunxizNai6` | professional · middle-aged · confident | 221.4 Hz |
| Katherine - Professional, Clear, Warm | `CaJGGnGTRWSly2yoC75U` | professional · middle-aged · confident | 218.8 Hz |

**The audition** (`e2-a3-0005` "Senator, when does it get a vote?", dry and through the TV chain; 0.50 / 0.05 / 1.0):

| Rank | Voice | Score | F0 (Hz) | vs staffer | vs staffer2 | speed | wpm | length / plan | ASR | p(en) | floor / S:F | CPP | penalties, brief |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Katherine - Professional, Clear, Warm** | 0.44 | 207.6 | +3.9 st / 50 | +1.7 st / 52 | 1 | 209 | 0.85 | verbatim | 0.998 | -63 / 44 dB | 19.91 | noise 0.18, pace 0.26 |
| 2 | Leslie - Open, Strong and Approachable | 1.95 | 260.1 | +7.8 st / 51 | +5.6 st / 64 | 1 | 246 | 0.72 | verbatim | 0.998 | -76 / 56 dB | 21.43 | pace 1.95; question lands flat |
| 3 | Eryn - Genuine, Friendly and Natural | 5.76 | 232.1 | +5.8 st / 69 | +3.7 st / 72 | 1 | 353 | 0.50 | verbatim | 0.998 | -76 / 54 dB | 22.8 | pace 5.76; question lands flat |

**Cast: Katherine - Professional, Clear, Warm.** At 208 Hz she is 3.9 st over Avery and 1.7 st over Jessi, with a timbre distance of about 50 from both. The question rises on its last syllable (+1.7 st), and the TV-chain copy is recognised verbatim. 209 wpm (0.85 of the plan); p(en) 0.998. Leslie's question lands flat; Eryn read at 353 wpm.

### 3.8 BUKAJ · 2 lines (sc 14)

**Brief:** soft, exact, warm; a scientist who'd like a week before anyone asks for a schedule. **Lane:** 110–135 Hz. **Separate from:** Mas (Jeremy, about 114 Hz), in the same two-shot: the shortlist sits either side of him.

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Jacob - Soft Comfort | `Dgd9MUMSyPeTgbbDIZ0t` | high quality · young · gentle | 96.1 Hz | "warm, gentle… calm, steady"; 2.9 st under Mas |
| Scypher | `a6sKd2pET9A8uwzfI5Yr` | high quality · young · calm | 104.5 Hz | "soft, gentle, reflective" |
| Antoine | `edRtkKm7qEwZ8pH9ggtf` | professional · young · calm | 126.8 Hz | "rich, calm… warm, conversational"; 1.8 st over Mas |
| Kenneth - Storyteller | `8z82LG47qQ2qjeeQB8lk` | professional · young · calm | 108.2 Hz | "very clear diction… measured pace": the exactness |

**The audition** (`e2-a3-0006` "Thank you. It's still warm.", `e2-a3-0007` "Not yet. I'd like a week in it…"; 0.60 / 0; round 1 at 1.0, then the top two at 0.85 and 0.80):

| Rank | Voice | Score | F0 (Hz) | vs mas | speed | wpm | length / plan | ASR | p(en) | floor / S:F | CPP | penalties, brief |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Scypher** | 0.93 | 109.5 | -0.7 st / 46 | 0.85 | 165 | 0.91 | verbatim | 0.995 | -80 / 60 dB | 17.23 | lane 0.09, separation 0.84; bright, not soft |
| 2 | Kenneth - Storyteller | 2.94 | 94.4 | -3.2 st / 41 | 0.8 | 179 | 0.85 | verbatim | 0.992 | -88 / 65 dB | 16.91 | lane 2.65, pace 0.29; bright, not soft |
| 3 | Jacob - Soft Comfort | 4.54 | 106.5 | -1.1 st / 53 | 1 | 241 | 0.62 | verbatim | 0.999 | -73 / 45 dB | 20.66 | lane 0.55, separation 0.37, noise 0.02, pace 3.6; bright, not soft |
| 4 | Antoine  | 10.54 | 138.1 | +3.4 st / 35 | 1 | 203 | 0.73 | verbatim | 0.996 | -45 / 13 dB | 16.34 | lane 0.4, clean 2, noise 6.34, pace 1.8 |

**Cast: Scypher, at speed 0.85.** The lowest score. At 110 Hz he sits 0.1 st under the lane, and at 0.85 he reads 165 wpm (0.91 of the plan). Verbatim; p(en) 0.995. He has the cleanest floor of the four (60 dB) and a narrow 7.8 st range (soft, exact). He sits only 0.7 st under Mas in pitch, but his timbre is 46 from Mas's, 4.8× Mas's own spread (9.6). **For the ear:** if the two-shot blurs them, Kenneth is next (3.2 st under Mas, under the lane, cached at 0.80). Antoine was out on noise: his raw floor is 13 dB under his speech, and he clipped a tail. (All four tripped the "soft" proxy, presence over −14 dB: these voices are brighter than Ep1's men; it broke no tie.)

### 3.9 EKIEL · 3 lines (F2.2, sc 18)

**Brief:** quiet, dry, squinting; says the hard thing plainly. **Neutral accent** (the real man's accent is not used). **Lane:** 110–140 Hz. **Separate from:** MARIO (Kokoro `am_liam`) in the right pane (and within about 1 dB of him in level), and ALYI (Louis, about 88 Hz) in F2.2.

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Mike Belkowski | `USXpAZuBZ22GqtSpuKoQ` | professional · middle-aged · professional | 120.0 Hz | "calm, steady… clear articulation and measured pacing" |
| Sawyer - Calm, Measured and Serious | `UQoLnPXvf18gaKpLzfb8` | high quality · middle-aged · calm | 105.1 Hz | "calm, measured and serious" |
| Dexter – Customer Support Pro | `Smxkoz0xiOoHo5WcSskf` | professional · middle-aged · professional | 108.2 Hz | "calm, confident" |
| Brandon | `QzclONYwRWvec152I3wf` | professional · young · chill | 107.5 Hz | "laid-back… dry": the dryness (check its "subtle sarcasm" doesn't read; he is never sarcastic) |

**The audition** (`e2-a3-0014` "Nobody knows how to do this yet.", F2.2; `e2-a4-0010` "You annotated my resignation?", sc 18; 0.60 / 0; round 1 at 1.0, then the top two at 0.80):

| Rank | Voice | Score | F0 (Hz) | vs mario | vs alyi | speed | wpm | length / plan | ASR | p(en) | floor / S:F | CPP | penalties, brief |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Dexter – Customer Support Pro** | 2.43 | 110.4 | -1.4 st / 62 | +3.7 st / 33 | 0.8 | 200 | 0.82 | verbatim | 0.996 | -67 / 36 dB | 18.95 | separation 0.07, noise 1.8, pace 0.56 |
| 2 | Mike Belkowski | 4.16 | 102.0 | -2.8 st / 59 | +2.3 st / 38 | 0.8 | 172 | 0.91 | verbatim | 0.990 | -59 / 31 dB | 21.0 | lane 1.3, noise 2.86 |
| 3 | Brandon | 6.31 | 115.8 | -0.6 st / 50 | +4.5 st / 51 | 1 | 201 | 0.79 | verbatim | 0.997 | -47 / 23 dB | 18.06 | separation 0.9, noise 4.46, pace 0.95; wide swings |
| 4 | Sawyer - Calm, Measured and Serious | 6.89 | 90.9 | -4.8 st / 48 | +0.3 st / 50 | 1 | 221 | 0.73 | verbatim | 0.994 | -90 / 66 dB | 15.48 | lane 3.3, separation 1.7, pace 1.89; wide swings |

**Cast: Dexter – Customer Support Pro, at speed 0.80.** The lowest score. At 110 Hz he sits inside the lane, 1.4 st under MARIO's Kokoro takes (120 Hz), but with a timbre distance of 62 from him, 12× Mario's own spread (5.1). He sits 3.7 st over Alyi. Verbatim; p(en) 0.996; an 8.9 st range (dry, not swinging). His one weakness is the floor (36 dB under his speech). EL's speed setting moved his two lines in opposite directions: at 0.80 "Nobody knows…" still ran quick (1.52 s against the plan's 2.73) and "You annotated…" slow (1.95 s against 1.6). The lock fits them, or one retake of `e2-a3-0014` if the ear wants it quieter. Brandon, the "subtle sarcasm" check, had the noisiest floor (23 dB) and the widest swings. Mike sits under the lane with a noisier floor. The level match to MARIO (within about 1 dB) is the mix's (§2).

### 3.10 The CROWD · the chant (F2.2)

**Brief:** a holiday-party room joining Alyi's "FEEL THE AGI!", building from one voice to all: **8–12 layered library reads** of "Feel the A.G.I.! Feel the A.G.I.!", mixed men and women, each on its own seed and offset (40–180 ms), ducked under Alyi's lead; warm and giddy, **never a hymn or a rally**. These twelve are distinct from every principal and from each other:

Chris - Friendly conversational guide (`gScUm0AQVZBQ1uUp8KvE`) · Jake – Informative and Energetic (`hxPRa8HUuKYsm1kiWDEi`) · Joe Inglewood - Magnetic and Captivating (`UpphzPau5vxibPYV2NeV`) · Larry - Easygoing Customer Care Agent (`tgfcQY9SGvn3GfmnNWIi`) · Sam - Support Agent (`scOwDtmlUjD3prqpp97I`) · Eleila - Narrator (`e5LtAIHV5cnnDfMmCZYr`) · Gutentag (`TuRE87hoehQxHAhbCMR2`) · Lori - Happy, Sweet and Compassionate (`TbMNBJ27fH2U0VgpSNko`) · Kristen - Natural, Upbeat and Focused (`dfeOmy6Uay63tNhyO99j`) · Lauren - Friendly Customer Care Agent (`3liN8q8YoeB9Hk6AboKe`) · Lyan - Friendly Female Authentic UGC (`OHbs18UsFunlwffsTLNn`) · Larry – High-Energy Social Media Voice (`fIGaHjfrR8KmMy0vGEVJ`).

**The audition** (`e2-a3-0010`, sent as "Feel the A.G.I.! Feel the A.G.I.!" (§5; `say_lines`), each voice on its own seed; 0.40 / 0.20 / 1.0):

| Rank | Voice | Score | F0 (Hz) | speed | wpm | length / plan | ASR | p(en) | floor / S:F | CPP | penalties, brief |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Lori - Happy, Sweet and Compassionate** | 0.00 | 292.4 | 1 | 159 | 0.87 | verbatim | 0.988 | -76 / 58 dB | 23.44 |  |
| 2 | **Larry - High-Energy Social Media Voice for Reels & Shorts** | 0.00 | 218.4 | 1 | 149 | 0.93 | verbatim | 0.988 | -86 / 61 dB | 24.5 |  |
| 3 | **Kristen - Natural, Upbeat and Focused** | 0.06 | 220.8 | 1 | 91 | 1.51 | verbatim | 0.984 | -66 / 49 dB | 23.37 | accent 0.06 |
| 4 | **Lauren - Friendly Customer Care Agent** | 0.35 | 273.6 | 1 | 124 | 1.11 | verbatim | 0.982 | -91 / 70 dB | 19.77 | accent 0.35 |
| 5 | **Larry - Easygoing Customer Care Agent** | 0.65 | 184.2 | 1 | 167 | 0.83 | verbatim | 0.979 | -71 / 48 dB | 22.34 | accent 0.65 |
| 6 | **Chris - Friendly conversational guide** | 0.75 | 118.6 | 1 | 210 | 0.66 | verbatim | 0.982 | -70 / 43 dB | 18.08 | accent 0.33, noise 0.42 |
| 7 | **Lyan - Friendly Female Authentic UGC** | 1.10 | 383.3 | 1 | 206 | 0.67 | verbatim | 0.974 | -79 / 64 dB | 21.21 | accent 1.1 |
| 8 | **Joe Inglewood - Magnetic and Captivating** | 1.63 | 133.6 | 1 | 161 | 0.86 | verbatim | 0.969 | -80 / 58 dB | 21.3 | accent 1.63 |
| 9 | **Jake – Informative and Energetic** | 1.82 | 103.9 | 1 | 144 | 0.96 | verbatim | 0.980 | -62 / 38 dB | 26.62 | accent 0.52, noise 1.3 |
| 10 | Eleila - Narrator | 2.00 | 102.3 | 1 | 192 | 0.72 | 0.67 | 0.990 | -87 / 68 dB | 24.92 | clean 2; ASR not verbatim |
| 11 | **Sam - Support Agent** | 2.53 | 175.3 | 1 | 122 | 1.13 | verbatim | 0.966 | -60 / 42 dB | 24.01 | accent 1.93, noise 0.6 |
| 12 | Gutentag | 4.28 | 109.4 | 1 | 184 | 0.75 | verbatim | 0.984 | -55 / 34 dB | 17.59 | accent 0.1, clean 2, noise 2.18 |

**Cast: ten layered voices** (in bold): Lori, Larry (High-Energy), Kristen, Lauren, Larry (Easygoing), Chris, Lyan, Joe Inglewood, Jake and Sam, from 104 to 383 Hz, men and women. Each reads the chant cleanly as letters, with no clipped tail and p(en) of at least 0.95. Ep1's 0.985 bar was set on sentences; on two seconds of a spelled acronym all twelve read 0.966–0.990, so for the chant p(en) is a gate at 0.95 and otherwise reported. Out: Eleila, heard as "A-G-E", and Gutentag, whose tail was cut. `cast-el.json` lists the ten as `roles.crowd.layered`. `el_render.py` renders only candidate A per set, so the layering (40–180 ms offsets, ducked under Alyi's lead) is the voice pass's step, and it finds each of the ten reads in the cache. "Warm and giddy, never a rally" is for the ear.

### 3.11 THE FORECASTER · 4 lines (sc 17)

**Brief:** conversational, precise, kind; a man who talks in medians, and who refuses without needing a number. His refusal is principled: no smugness, no martyrdom. **Lane:** 110–140 Hz. **Separate from:** Mas (Jeremy, about 114 Hz) beside him, and the DRIVER.

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Jack John - Conversational and Upbeat | `7EzWGsX10sAS4c9m9cPf` | high quality · middle-aged · professional | 137.0 Hz | "natural, conversational… confident and professional, yet conversational"; 3.2 st over Mas |
| Brandon - Casual, Youthful and Kind | `BvZBJROETmG9wGXEdSqX` | professional · young · casual | 105.7 Hz | "engaging, friendly, conversational", and kind |
| Josh - Warm, Smooth and Steady | `ZoiZ8fuDWInAcwPXaVeq` | high quality · young · casual | 105.7 Hz | "designed for natural back-and-forth dialogue" |
| Arthur – Casual Conversational American Male Narrator | `sfJopaWaOtauCD3HKX6Q` | high quality · young · casual | 112.0 Hz | "laid-back, friendly… relatable" (near Mas's pitch: check timbre) |

**The audition** (`e2-a3-0018` "Already did. It's the one thing I didn't need a number for." (the keep list), `e2-a3-0020` "I've got a forecast on you…"; 0.50 / 0.05; round 1 at 1.0, then Jack John at 0.80; Arthur was already inside the band at 1.0; ranked jointly with the Driver):

| Rank | Voice | Score | F0 (Hz) | vs mas | vs driver | speed | wpm | length / plan | ASR | p(en) | floor / S:F | CPP | penalties, brief |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Jack John - Conversational and Upbeat** | 0.00 | 136.8 | +3.2 st / 59 | -6.1 st / 59 | 0.8 | 173 | 0.99 | verbatim | 0.996 | -81 / 58 dB | 18.06 |  |
| 2 | Arthur – Casual Conversational American Male Narrator | 2.24 | 96.6 | -2.8 st / 54 | -12.1 st / 79 | 1 | 184 | 0.92 | verbatim | 0.996 | -81 / 57 dB | 19.33 | lane 2.24 |
| 3 | Brandon - Casual, Youthful and Kind | 2.77 | 102.3 | -1.8 st / 42 | -11.1 st / 39 | 1 | 221 | 0.75 | 0.93 | 0.994 | -90 / 71 dB | 16.36 | lane 1.25, pace 1.52; not conversational pace, ASR not verbatim |
| 4 | Josh - Warm, Smooth and Steady | 3.54 | 104.2 | -1.5 st / 52 | -10.8 st / 67 | 1 | 246 | 0.68 | verbatim | 0.996 | -71 / 46 dB | 19.79 | lane 0.94, pace 2.6; not conversational pace |

**Cast: Jack John - Conversational and Upbeat, at speed 0.80** (with Jerry B. as the Driver). Score 0. At 137 Hz he sits inside the lane, 3.2 st over Mas and 6.1 st under the Driver. At 0.80 he reads 173 wpm, 0.99 of the plan; at 1.0 he ran 222. Verbatim on both lines, the keep-list line included; p(en) 0.996; a clean floor (58 dB). His library text ("…human like recording possible") was read: it is not a resemblance claim. Arthur, Brandon and Josh all sit under the lane (97–104 Hz).

### 3.12 The DRIVER · 2 lines (sc 17)

**Brief:** an everyday voice through a car window, impatient but not angry; the honk joke is his. **Separate from:** the Forecaster and Mas.

| Candidate | `voice_id` | Library labels | Preview F0 |
|---|---|---|---|
| Matt - Natural, Chatty, Friendly | `pwMBn0SsmN1220Aorv15` | professional · middle-aged · casual | 98.6 Hz |
| Jerry B. - Authentic, Clear & Engaging | `J9NvviOEdVm6E7Hwdpdj` | high quality · middle-aged · casual | 139.4 Hz |
| Armando - Forthright and Stentorian | `TWUKKXAylkYxxlPe4gx0` | professional · young · casual | 137.4 Hz (a slight hoarseness) |
| Tony - Middle-aged with American accent | `hP72SDESIJq2YuAblBqz` | professional · middle-aged · calm | 98.0 Hz |

**The audition** (`e2-a3-0017` "You gonna think it over, or can we move?…", `e2-a3-0022` "Excuse me. Does honking count as disparagement?"; 0.45 / 0.10 / 1.0):

| Rank | Voice | Score | F0 (Hz) | vs forecaster | vs mas | speed | wpm | length / plan | ASR | p(en) | floor / S:F | CPP | penalties, brief |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Jerry B. - Authentic, Clear & Engaging** | 0.29 | 194.5 | +6.5 st / 59 | +9.3 st / 35 | 1 | 216 | 0.85 | verbatim | 0.993 | -86 / 66 dB | 18.98 | pace 0.29 |
| 2 | Tony - Middle-aged with American accent  | 0.53 | 107.5 | -3.8 st / 68 | -1.0 st / 59 | 1 | 163 | 1.10 | verbatim | 0.993 | -86 / 70 dB | 14.62 | separation 0.53; not impatient |
| 3 | Matt - Natural, Chatty, Friendly | 1.06 | 119.5 | -1.9 st / 41 | +0.9 st / 42 | 1 | 175 | 1.06 | verbatim | 0.997 | -70 / 43 dB | 18.34 | separation 0.64, noise 0.42 |
| 4 | Armando - Forthright and Stentorian | 3.38 | 138.6 | +0.6 st / 45 | +3.4 st / 33 | 1 | 237 | 0.76 | verbatim | 0.996 | -68 / 40 dB | 17.23 | separation 0.88, noise 1.08, pace 1.42 |

**Cast: Jerry B. - Authentic, Clear & Engaging.** The three men in sc 17 sit far apart: at 195 Hz he is 9.3 st over Mas and 6.5 st over the Forecaster. He reads 216 wpm (impatient; 0.85 of the plan); verbatim; p(en) 0.993; a clean floor (66 dB). **For the ear:** his reads sit 5.7 st over his library preview (139 Hz). That is a raised voice through a car window, and it has to read impatient, not angry. Tony (too slow for impatience at 163 wpm) and Matt (0.9 st from Mas) are the cached alternatives.

### 3.13 HARAS · 4 lines (sc 19)

**Brief:** pleasant, precise, brisk; she starts with the easy questions and says "Upside." without irony. **Neutral accent: never the real CFO's.** **Lane:** 165–200 Hz. **Separate from:** Gerg (Marcus) in the two-shot.

| Candidate | `voice_id` | Library labels | Preview F0 | Why it's here |
|---|---|---|---|---|
| Klara - Tech Executive & Scientist | `KLdWtAstZMPBbfqaBs59` | professional · middle-aged · confident | 168.7 Hz | "crisp, articulate… executive confidence" |
| Hannah - Neutral, Polished and Helpful | `Hh0rE70WfnSFN80K8uJC` | professional · young · professional | 194.9 Hz | "neutral, polished" |
| Jo - Warm, Smooth and Reassuring | `jemqINv7N9LKUclcLQnU` | professional · middle-aged · professional | 179.8 Hz | "warm, approachable… clear articulation": the pleasantness |
| Athena - Clear, Professional, Human | `Qin2NRfiKVQMJLxnoZaY` | professional · young · professional | 194.9 Hz | "professional yet convincingly human" |

**The audition** (`e2-a4-0017` "I'm new, so I'm starting with the easy ones…", `e2-a4-0022` "Let me reframe that. Upside."; 0.50 / 0.05 / 1.0):

| Rank | Voice | Score | F0 (Hz) | vs gerg | speed | wpm | length / plan | ASR | p(en) | floor / S:F | CPP | penalties, brief |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Hannah - Neutral, Polished and Helpful** | 1.02 | 212.1 | +6.1 st / 50 | 1 | 191 | 0.89 | verbatim | 0.999 | -90 / 72 dB | 19.12 | lane 1.02 |
| 2 | Klara - Tech Executive & Scientist | 1.21 | 204.6 | +5.5 st / 38 | 1 | 211 | 0.80 | verbatim | 1.000 | -81 / 47 dB | 14.82 | lane 0.39, pace 0.82 |
| 3 | Jo - Warm, Smooth and Reassuring | 3.88 | 191.7 | +4.3 st / 39 | 1 | 216 | 0.79 | verbatim | 1.000 | -65 / 31 dB | 18.59 | noise 2.88, pace 1 |
| 4 | Athena - Clear, Professional, Human | 4.93 | 254.8 | +9.3 st / 37 | 1 | 209 | 0.81 | verbatim | 1.000 | -79 / 60 dB | 20.84 | lane 4.19, pace 0.73 |

**Cast: Hannah - Neutral, Polished and Helpful.** The lowest score; the one penalty is the lane, at 212 Hz, 1.0 st over 165–200. She sits 6.1 st over Gerg in the two-shot. She reads 191 wpm, 0.89 of the plan: brisk, no hurry. Verbatim; p(en) 0.999 (neutral American); the cleanest floor of the four (72 dB). Klara was close (1.21) but faster than the plan, breathier (CPP 14.8) and noisier.

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
| AGI | Alyi and the crowd (15.06) | "A.G.I." (the letters) | **checked for the crowd** (§3.10): sent as "Feel the A.G.I.! Feel the A.G.I.!" (`say_lines.e2-a3-0010`), 11 of 12 voices were heard saying the letters ("AGI"), one "A-G-E"; Alyi's own line (`e2-a3-0009`) is the takes pass's; the screen keeps capitals |
| ELSE | Nole (4.18) | "else" (sentence case; the stress is a reading note, not capitals) | **new** |

---

## 6. How to cast and record

1. **Screen** each new role with its own filters (§3) from Ep1's pool, and keep the shortlist here unless a candidate fails (log the replacement and why). **Done 2026-10-09** (§8.1): 68 voices checked against the live library, one replaced.
2. **Audition** each candidate on the role's own lines (all of them: these roles are short), dressed as the episode's takes (−16 LUFS, dry), at speed 1.0, then the top two at a speed fitted to the brief's pace on the episode's seeds (Ep1 §AA2). **Done 2026-10-09** (§8.2), on one or two lines per candidate rather than all, to stay under 4,000 credits. Round 2 was rendered for the four roles whose leaders read outside the pace band at 1.0.
3. **Measure in the scene** (`el_audition.py scene`): the role's lane; semitones apart from each voice it alternates with; the 2–5 kHz presence; the timbre distance (mean MFCCs); p(en) for the accent screen (under 0.985 fails); clipped tails; ASR recall. **Pick** the voice with no penalty, with a written reason, into `audio/ep02/cast-el.json` (the role, `voice_id`, library name, source, why, settings, what it measured). **Done 2026-10-09** (§3, §8.3–§8.4; `el_audition.py cast`).
4. **Record the takes** for every line (`el_render.py` per segment, under `audio/ep02/`: the pipeline reads ElevenLabs takes as `lines-A*.json` anywhere there, and Kokoro takes as `audio/ep02/v1/<seg>/lines-v1.json`), the carried roles at Ep1's settings, the new ones at their picked settings. **Long reads recorded whole and cut by the lock; cut-offs recorded complete** (CHATGTP's "…one of my favorite things."; Haras's "And profit?"); the three cuts made from their source takes (§2). Dialogue −16 LUFS, V.O. −18 LUFS at the take.
5. **Re-run the plan** (`python3 show/episodes/ep02/production/v1/beat-plan/_build.py --write`): each take row under `audio/ep02/` (`**/lines*.json`) with the line's id and its audible in/out replaces the planning length, and each scene re-fits around the takes.

**Budget** (Ep1 billed about 55 credits per 100 characters on `eleven_multilingual_v2`): the episode's takes are about 7,600 characters of text (MARIO is Kokoro and costs nothing) ≈ **4,200 credits** at one read each; the new roles' auditions, about 2,100 characters × 3.5 voices ≈ **4,000 credits**; the crowd, about 12 short reads; retakes on a bad read add about a fifth. This is the manifest's resource ask (§10): ElevenLabs credits for the auditions and the takes. **Spent on the auditions: 2,394 credits** (5,444 characters, 117 calls, 0.44 credits a character; §8.6), against the 4,000 estimate. The picks' 25 auditioned lines and the nine other crowd reads are cached: 1,441 characters (about 630 credits) the takes pass won't send.

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

---

## 8. The casting pass (2026-10-09)

The handoff note for the casting pass (R13). **What changed:** `audio/ep02/cast-el.json` gained 16 roles (one per new speaker id in the beat plans: `selbeep`, `xel`, `humanist`, `engineer`, `voice1`–`voice4`, `staffer2`, `reporter`, `bukaj`, `ekiel`, `crowd`, `forecaster`, `driver`, `haras`), their labels and two per-line readings (`say_lines`); this page's §1, §3, §5, §6 and §8; the tool `audio/ep02/v1-el/tools/el_audition.py` (a copy of Ep1's method with Ep2's tables) and its record `audio/ep02/v1-el/auditions/index.json`. Nothing under Ep1's paths changed: Ep1's red-flag screen and Ep1's takes were only read (imported with no bytecode written). Every claim is [M] measured from the files, unless marked [J] judged. **Nobody has listened.**

### 8.1 The screen

- **68 voices** (the 67 on the shortlists and one replacement) were checked against the live library through the free listing, matched by `voice_id` [M]. All 68 are still listed. The checks: Ep1's red flags (`cast_el.py`: a real person, a celebrity, an impression, an accent, an age or health register, a price, the category, the locale); the role's own "Never" words; sound-alike, soundalike, parody, impression, celebrity and famous; an ethnicity label; "like" used as a resemblance ("sounds like", "like <Name>", "<word>-like"); a voice already on file in `cast-el.json`; a voice on two shortlists.
- **One failed: Kyle** (THE HUMANIST), described as "Young white man…". Ep1 §AC2 passed over voices described by ethnicity. Ep1's saved pool held no passing voice in the lane with the brief's words, so the replacement came from the live listing, using the pool's own filters (English, American, male, young or middle-aged, conversational). It is the one in the lane with the most of the brief's words, less the words against it, after the registers the brief rules out (sports, coaching, radio, narration, deep, energetic): **Grey - Soft, Calm and Conversational** (112 Hz preview). Three earlier automatic choices were refused and are not used: a "Football Commentator" (a sports register), a voice whose preview sat 2.5 st under the lane, and an "international English" voice (an accent). The rules that refused them are in the tool.
- **Six descriptions use "like" in another sense** and were kept (contexts in the index): "human like recording" (Jack John), "use cases like customer service" (Josh), "feels like catching up with a good friend" (Arthur), "content like TikToks" (Jake), "platforms like phone IVRs" (Larry), "industries like ecommerce" (Lauren).
- **This page's own checks, measured:** Luis's "some breathiness" (CPP within the field, §3.3); Brandon's "subtle sarcasm" (the widest swings and the noisiest floor of the four, §3.9); Antoine's "slight, natural rasp" (a floor 13 dB under his speech, §3.8); Jason against Gerg (1.0 st, the nearest of the four in pitch; timbre 30; §3.4).

### 8.2 The reads

- **Round 1** [M]: 103 takes, one per candidate per audition line (§3 lists the lines), at the role's settings and speed 1.0, on `eleven_multilingual_v2`. Each used the episode's own seed (`seed_of(line id, voice id)`) and the text exactly as the takes pass sends it: the house respellings ("Al-yee"), VOICE 4's "Hi..." and the chant's "Feel the A.G.I.!" (`say_lines`). Each was rendered and dressed by `el_render.render_take`, the takes pass's own code: 48 kHz / 24-bit, −16 LUFS, −1.5 dBTP, dry, 0.35 s room-tone handles. The picks' takes are therefore the film's takes.
- **Round 2** (Ep1 §AA2) [M]: the top two of the four roles whose leaders read outside ±15 % of the plan at 1.0, at speed = (length / plan) / 0.95, rounded to 0.05, within 0.80–1.00. That gave Luis and Bill 0.80, Scypher 0.85, Kenneth 0.80, Dexter and Mike 0.80, and Jack John 0.80; Arthur was already inside the band. 14 takes.
- **Kept at speed 1.0** [J]: XEL, by his brief (no direction toward slowness), at 0.82 of the plan. Staffer 2, the reporter and the Driver sit at 0.85, the band's edge, and their briefs are brisk.
- **EL's speed is not an even time-stretch** [M]: at 0.80, Dexter's "Nobody knows how to do this yet." came out shorter than at 1.0 (1.52 s against 1.55) while his other line grew 27 %. So length / plan is the geometric mean over a voice's lines, and the lock fits each take.

### 8.3 The measures

| Measure | How | Scale, where it matters |
|---|---|---|
| ASR recall | faster-whisper `small.en` (the house recogniser), beam 5, word timestamps; the share of the line's words heard, names excepted; blind to apostrophes, spelled letters joined ("A .G .I." = "AGI"), "alright" = "all right" | under 0.9 is a bad take. To spare a saturated shared machine, each voice's takes were joined with 1.5 s of silence, and voices of different roles were packed into clips of at most 28 s (never the same line twice in a clip; the four "hi"s kept apart). Each word went back to its take by time: 117 takes in 30 recogniser passes (SELBEEP's four voices one by one, then packed) |
| p(en) | faster-whisper `small` language ID (one encoder pass) over the voice's takes joined | Ep1's accent screen: 1 point per 0.01 under 0.985. None on one-syllable reads. The chant gates at 0.95 (§3.10) |
| F0 | the house YIN (`f0_fast`), median per take; per voice the geometric mean | one-word slot reads: YIN searched within the voice's preview ×/÷1.8 (§3.5) |
| separation | semitones between medians; timbre = the distance between mean MFCCs (c1–c19, 0–8 kHz, active frames) | a voice's own take-to-take spread (odd against even takes) is the yardstick: Marcus 15.6, Mia 14.0, Louis 11.0, Jeremy 9.6, Tyler Kurk 9.3, Kokoro am_liam 5.1 |
| the scene's voices | Ep1's EL v3.5 takes of the carried voices (the same ids and settings in Ep2), dry or O.S., up to 24 spread over the episode; MARIO his Kokoro takes | Gerg 149.1 Hz (20 takes) · Mas 113.7 (24) · Tasya 133.9 (17) · Rima 160.8 (13) · CHATGTP 257.9 (2) · the Staffer 165.8 (2) · Alyi 89.3 (18) · MARIO 119.9 (10) |
| pace | the audible span (−40 dB re the loudest 10 ms) against the beat plan's `len_s`, the builder's words-at-rate estimate at the role's planned rate (`_spec.py` `RATE`); wpm beside it | ±15 % is the band |
| loudness and noise floor | on the **raw** ElevenLabs file, before the dressing: integrated LUFS (the picks −17 to −32), true peak; floor = the 5th percentile of 20 ms frame RMS (dBFS); S:F = the median of the frames within 20 dB of the loudest, minus the floor | 45 dB is the house bed's depth under the dialogue (−62 dBFS under −16 LUFS): a floor less than that under the speech is louder than the bed it sits on. Every dressed take is −16 LUFS and ≤ −1.5 dBTP by construction |
| CPP | cepstral peak prominence (the 60–330 Hz quefrency peak over the cepstrum's regression line), median over the loud frames | a breathiness proxy, lower is breathier; the field ran 13.8–26.6 dB |
| clipped tail | the raw file stops while still sounding (over −45 dB re its peak) | a bad take |
| final, rise | the last 0.25 s of loud voiced speech against the take's median; for one word, its last third against its first | a question rises; a statement falls |

### 8.4 The ranking rule

**Score** (lower is better) = **lane** (1 per semitone outside) + **separation** (1 per semitone short of the gap §3 asks from each voice in the scene; for SELBEEP and the ENGINEER against Gerg, where §3 allows "or a clearly different timbre", nothing if the timbre distance is at least 1.5× Marcus's own spread, else half) + **accent** (1 per 0.01 under 0.985) + **clean** (2 per clipped tail and 2 per take under 0.9 recall, per line) + **noise** (1 per 5 dB that S:F falls under 45) + **pace** (1 per 10 % outside ±15 % of the plan, from the round the film would use; none for the slots and the crowd).

**Ties** go to the brief's measurable qualities (1 point each; the list is in `el_audition.py brief_points`), then to timbre (the larger of the smaller distances).

**Joint picks:** the four slots with Maya, over all 81 combinations: every neighbour gap at least 2 st, then the widest smallest gap, then presence. STAFFER 2 with the reporter, and the FORECASTER with the DRIVER: every pair, each scored against the other.

**Changes from Ep1's rule** [J]:
- Pace is in the score, where Ep1 kept it out because speed is a setting. EL applies speed unevenly (§8.2), so a voice that needs less of it keeps its own read; round 2 measured the leaders at their fitted speeds.
- The noise term is new.
- The slot pitch, the letter join and the chant's p(en) gate (§3.5, §3.10) answer measurement faults found in this pass, and are written down where they apply.

### 8.5 For an ear first

1. **Jessi against Avery** (sc 13): the nearest timbre of the four (27). Kristen is the cached alternative.
2. **Scypher against Mas** (sc 14): 0.7 st apart, with timbre 46 between them. Kenneth is next.
3. **Jerry B.'s raised register** (sc 17): 5.7 st over his preview, and it must read impatient, not angry. Tony and Matt are the alternatives.
4. **Dexter's "Nobody knows how to do this yet."**: still quick at 0.80. One retake if it should be quieter.
5. **Ryan's off-mic lines** (11.15): they read higher than his stage line, against "lower and closer". A per-line read is the fix.
6. **The four hellos against Maya** (9.06): four products, none a real assistant. Sarah Eve's trail must be soft, never sultry.
7. **XEL clearly unlike the real host** (cast.md §6's list): Alex Wright, cheerful, 129 Hz, a 12 st range, 194 wpm.
8. **Luis's breath** (sc 7), and the HUMANIST's neutral American.
9. **The crowd's chant** (F2.2): ten voices, warm and giddy, never a rally.
10. **Each pick in its scene, once the takes are in the lock**: the mix sets the levels (EKIEL within about 1 dB of MARIO).

### 8.6 Credits

| | Characters sent | Credits billed |
|---|---|---|
| Round 1 (103 takes) | 4,793 | 2,108 |
| Round 2 (14 takes) | 651 | 286 |
| **Total (117 calls)** | **5,444** | **2,394** |

The cap was 4,000 credits; the pass spent 2,394 [M].

**By role:** SELBEEP 316, the FORECASTER 300, the HUMANIST 264, BUKAJ 252, the ENGINEER 220, XEL 212, the DRIVER 188, the CROWD 180, HARAS 168, EKIEL 162, STAFFER 2 72, the REPORTER 45, the four VOICES 15.

**How it was counted:**
- Credits are the API's own `character-cost` headers, 0.44 a character.
- One call (Charles, `e2-co-0003`, 43 credits) was sent and cached by the first render run, which was stopped before its manifest was saved. It is counted from its log line.
- The subscription's counter moved 15,328 → 17,722 of 131,000 over the pass, a delta of exactly 2,394, so no other pass spent credits meanwhile.

### 8.7 Files, and how to redo or swap

- **The tool:** `audio/ep02/v1-el/tools/el_audition.py`. Its docstring has every command.
- **The record:** `audio/ep02/v1-el/auditions/index.json`. It holds the screen, every take's measures, the scene's voices, the rankings, the picks with their reasons, and the credits.
- **The takes:** `audio/ep02/v1-el/auditions/<role>/wav/` and `manifest.json` (WAVs git-ignored). The requests are in `audio/ep02/v1-el/cache/` (git-ignored) and the previews in `cache/audition-previews/`. No `lines*.json` is written under `auditions/`, so neither the base lock nor the beat-plan builder reads an audition as a take.
- **The cast:** `audio/ep02/cast-el.json` `roles.<speaker id>`:
  - candidate A is the pick; B and on are the others in rank order;
  - each candidate carries `measured_audition`, with the round-2 takes under `measured_audition.round2`;
  - each candidate's `settings` are the ones its auditioned lines are cached at;
  - also added: `cast_ep2`, the labels, `say_lines.e2-a2-0015` and `say_lines.e2-a3-0010`.
- **To swap** a role to its next voice: `set_cand.A.<role> = "B"`. The auditioned lines are cached at B's settings; the role's other lines are new takes either way.
- **To redo** (from the repo root; everything is cached, so re-running sends nothing):

```sh
PY=audio/.venv-casting/bin/python; T=audio/ep02/v1-el/tools/el_audition.py
$PY $T screen                                                                   # free listing calls
HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T render --max-credits 3000              # round 1
HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T measure                                # recognition, p(en), floors, CPP
HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T scene                                  # the scene's voices, timbre
HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T pick
HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T round2 --roles humanist,bukaj,ekiel,forecaster
HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T measure --roles humanist,bukaj,ekiel,forecaster
HF_HUB_OFFLINE=1 bash ops/heavy.sh $PY $T pick
$PY $T cast && $PY $T report && $PY $T credits
```

### 8.8 Open items, and the rules checked

- **For the takes pass:**
  - the CROWD's layering (§3.10);
  - labels for two carried speaker ids the beat plans use, which `cast-el.json` doesn't map yet: `staffer` (the TILED EMPLOYEE, Avery) and `ghost-nole` (Nole's voice, with the ghost treatment);
  - the ENGINEER's off-mic read (§3.4);
  - EKIEL's quick line (§3.9).
  - *All four done by the takes pass ([takes-qa.md](takes-qa.md) §1, §5): the chant layered from the ten cached reads; `staffer` and `ghost-nole` mapped; the off-mic lines at a calmer per-line setting (140 and 128 Hz against his stage median 138); EKIEL's line read once more, the read nearer the plan kept (1.88 s against 2.73).*
- **Machine load** [M]: the measurement shared a machine saturated by other projects (load 20–60; one run died at 01:47 under another project's memory pressure and was re-run behind heavy.sh's memory guard). Every job went through `ops/heavy.sh`, one at a time. These light jobs ran with `MRMAS_MAX_LOAD=24`, as the pipeline pass did for its small tests (pipeline.md §10.7).
- **LEARNINGS:**
  - **S6** [M screen, J pick]: library voices only, called by `voice_id`; no cloning, design, reference audio or "sounds like"; nothing chosen for resembling anyone.
  - **S7** [M]: 3–4 library voices per new principal, picked by measurement with a written reason.
  - **R1** [M]: `git status` shows no Ep1 path touched.
  - **R8**: nothing heard; the ear list is §8.5.
  - **R10** [M].
  - **R11** [M]: the key scan before every commit and push.
  - **R13**: this note, and `audio/ep02/README.md`.
  - **R14** [M]: scratch only in the session scratchpad.
  - **R17** [M]: one encoder pass per packed clip; the picks' takes are cached for the takes pass.
  - **GR §5–§6**: no accent asked for; neutral American where the brief says so.
  - Broken on purpose: none.

