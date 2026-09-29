# MR. MAS: Voice Casting, Pass 1 (scratch voices + performer briefs)

**Status:** SCRATCH. These are synthetic temp voices for animatics, timing, lip-flap and blip pairing. They are also a spec sheet for the human performers who should replace them. None of it is final cast.

**What's here**

| Path | What it is |
|---|---|
| `voices/<slug>/<candidate>-<line>.wav` | 48 kHz / 24-bit mono, trimmed, −16 LUFS integrated, true peak ≤ −1.5 dBTP |
| `voices/<slug>/<candidate>-<line>.mp3` | the same clip at 160 kbps |
| `voices/<slug>/<slug>-reel.mp3` | every candidate back to back. Before each candidate a wordless chime plays, and **the number of pings is the candidate's index** (1 ping = A, 2 = B, 3 = C). Lines play in the order catchphrase → quote → comic, with 0.4 s gaps. |
| `voices/manifest.json` | one entry per candidate: `{character, candidate, model, voiceId, processing, license, lines:[{text, file, tag, …}], reel, blip}`, with QA numbers on every line |
| `voices/tools/cast.py` · `vcast.py` | the renderer. Re-render with `audio/.venv-casting/bin/python audio/voices/tools/cast.py [slug …]`, then run `… cast.py --finalize` (level-matched MP3s, reels, blip links). `--relink-blips` refreshes only the blip pairing from `audio/sfx`. The venv is `audio/.venv-casting` (CPU-only torch) |
| `voices/tools/qa.json` | per-line analysis (duration, LUFS, true peak, clipping, head and tail silence, median F0, F0 range, pace, ASR transcript, character error rate) |

Slugs: `mas-manalt`, `nole`, `gerg-mockbran`, `alyi`, `mario`, `rumpt`, `nesnej`, `rima-tamuri`, `the-orb`, `the-intern`.

**Pass 2 (2026-09-26) adds** the other 15 Ep1 speaking parts and 3 derived voices. Their picks and measurements are at the end of §2 (["Pass 2"](#pass-2-2026-09-26-every-other-ep1-speaking-part)).

| Path | What it is |
|---|---|
| `voices/cast.json` | **the cast registry the dialogue recorder reads**: script speaker label → voice slug, the pass-2 presets (blend, chain, speed, brief, measurements), pace bands, the names lexicon. Pass-1 and Act Four voices are read from `tools/cast.py` and `audio/ep01/act4/dialogue/tools/cast_a4.py`. |
| `voices/tools/cast_pass2.py` | the pass-2 renderer: `render` (candidates into a scratch folder), `report` (tables and the scene-separation check), `finalize` (picks → `cast.json` and auditions) |
| `voices/<slug>/<candidate>-audition.mp3` | one audition per pass-2 pick: the part's Ep1 lines back to back, 0.4 s apart, at the production speed, through the scene's device where it has one; −16.0 LUFS |

---

## 0. House rules for every voice (read before casting anyone)

1. **Never clone, never mimic.** Every candidate is a *stock* Kokoro-82M voice pack, or a weighted average of stock packs, reshaped with ordinary studio processing. No real person's recording was loaded, referenced or used as a target at any point. Blends are averages of anonymous stock packs, not of anyone real. The same rule binds the human performers: **a cartoon register built from the persona, not an impression of the person.** No listening-and-matching sessions against real audio.
2. **Briefs come from the exaggerated public persona and the comic function, not from the real timbre.** The pitch and pace targets below are casting choices for a cartoon. They are not measurements of anyone.
3. **No accent-based humor for anyone** (guardrail X10). Every human character is cast in neutral General-American stock voices (Kokoro `lang 'a'`). No candidate adds, suggests or plays with an accent. That goes double for NESNEJ, ALYI, NOLE and RIMA, whose real counterparts' accents must never become a bit.
4. **No age, health or disability coding in any voice.** No rasp played as age, no slurring, no tremor, no wandering "confusion" pacing, no stammer or disfluency mimicry. This is explicit for RUMPT ([character file](../../show/characters/dlanod-j-rumpt.md): "Never mock speech patterns as signs of age or health") and applies to everyone. Mimicking a laugh or another personal vocal trait counts as mimicry too (see the SIRRAH guardrail).
5. **Tags travel with the audio.** Each line carries its house tag ([V], [P✓], [K], [INVENTED]). Voicing an [INVENTED] line never turns it into a quote, and [K] lines need a re-check before picture lock.
6. **Stay stylized.** THE ORB and THE INTERN may sound plainly synthetic. The humans should sound like cartoon performers in a room, never like "the real person on a phone."
7. **Names in scripts.** Say NopeAI as "Nope A-I" (the renderer uses the text `Nope AI`, because the joined form came out as "No Pay Eye" in ASR checks). The RUMPT file still says `(pronounced "puh-MURT")`, which is left over from PMURT. None of these lines speak his name, so the room should settle on a pronunciation (one syllable, "rumpt," reads naturally).

**Engine and license (every candidate):** Kokoro-82M v1.0 (`hexgrad/Kokoro-82M`). The weights and stock voice packs are **Apache-2.0**; misaki G2P is Apache-2.0; espeak-ng (GPL-3.0) is only a runtime fallback phonemizer. Shaping uses pedalboard (GPL-3.0, a tool; the output audio is not encumbered) plus numpy/scipy. Nothing third-party is baked into the audio. Kokoro's model card grades its packs by training-data quality; the grade is noted for each candidate because it predicts artifacts.

**Processing philosophy:** conservative and clean. Pitch shifts are ≤ ±2 st for humans (±3 st for the Intern), EQ moves are ≤ 2.5 dB, compression is 2:1–4:1, saturation is parallel and light, and room or PA character goes on a pre-delayed send so the dry voice stays forward. After synthesis each line's Kokoro speed is nudged (at most ±15%) so that lines of five or more words land in the character's pace band. Very short lines (fewer than about 20 phonemes, where Kokoro's model card warns quality drops) are also rendered inside a neutral carrier ("Right. Okay. …") and cut out at the quietest frame of the pause. The carrier take is kept only if a speech recognizer finds it clearer than the direct take.

**How it was verified without ears:** I can't listen, so every clip was measured instead. The checks were integrated LUFS (−16 target), 4× oversampled true peak, clipped-sample count, head and tail silence, median F0 and F0 range (pYIN), words per minute, and an **intelligibility check with a local speech recognizer** (faster-whisper small.en), reporting the character error rate against the script. A human still has to listen for naturalness, comic timing and "does this sound like the character." The numbers only prove that the clips are clean, level, on-pitch, on-pace and understandable.

---
## 1. Voice briefs

Each brief is written for a **human performer first**; the synthetic candidates are aimed at it. "Pitch" is the speaking fundamental (median F0) and the typical range of a line in semitones (st). "Pace" is words per minute across a line, including its internal pauses.

### MAS MANALT, "Mr. Mas": *The Serene Survivor* · [file](../../show/characters/mas-manalt.md)
- **Comic function:** the still centre of every frame. He says catastrophic things at the pace of a lunch order, and his water glass never ripples.
- **Pitch:** a light baritone, median about **105–125 Hz**, kept **narrow (≤ 10 st per line)**. Finals are level or gently falling, and there is never an excited upward lift.
- **Pace:** **120–140 wpm**. The semicolon is a real pause of about 0.3–0.5 s. One-word replies ("super.", "noted.") land as complete sentences.
- **Texture:** soft, close-mic, low-effort phonation with warm proximity and no sibilant sizzle. Almost no room.
- **Attitude:** sincere, pleasant, unbothered. Never defensive and never smug; the serenity *is* the joke.
- **Signature cadence:** an even line with a small earnest pause before the key noun, landing flat. He never raises his voice, whatever the chyron says.
- **Avoid:** imitating any real vocal quality (fry, creak, pitch habits); a sneer or villain color; ASMR whispering; sounding robotic (the Intern is the robotic echo of him, not the other way round). **The NDA line is read straight, with no invented hesitation** (his file: never invent a hesitation on a contested credibility question).
- **Lines:** `super.` [INVENTED usage of a real tic] · `near the singularity; unclear which side.` [V, Jan 2025] · `i did not know this was happening.` [K, May 2024; re-verify before lock]

### NOLE: *The Rage-Quitting Titan* · [file](../../show/characters/nole.md)
- **Comic function:** grievance delivered as a joke, and jokes delivered as grievance. He enters through ceilings, names everything, and agrees last and loudest.
- **Pitch:** a mid baritone, median about **110–140 Hz**, with a **wide range (12–16 st)** that spikes on the self-credit word ("*name*", "*named*").
- **Pace:** **165–185 wpm in bursts** with abrupt stops, as if he's posting mid-sentence.
- **Texture:** pushed and forward with a little parallel grit, the "heavy-metal album cover" version of a person. Punchy compression and a small room.
- **Attitude:** aggrieved and delighted at once, self-crediting, certain.
- **Signature cadence:** burst → one-beat stop → burst. The claim gets a hard landing and the aside is thrown away.
- **Avoid:** any accent, even a hint; copying real disfluencies, pauses, "uh" patterns or his laugh; shouting into distortion; menace.
- **Lines:** `Next quarter.` [INVENTED] · `I came up with the name!` [V, 2026 trial testimony] · `Mario is right. Also, I named the frontier.` [INVENTED, opening on the [V] "Dario is right."]

### GERG MOCKBRAN: *The Man Who Became the Org Chart* · [file](../../show/characters/gerg-mockbran.md)
- **Comic function:** a cheerful, literal engineer narrating a commit log during any emergency.
- **Pitch:** a bright mid register, median about **125–160 Hz**, with a moderate range (8–12 st).
- **Pace:** the fastest human in the cast at **185–205 wpm**. Clipped, with no dramatic pauses, only "one sec" beats.
- **Texture:** dry, bright and close, like a laptop-lit room. No reverb.
- **Attitude:** sunny and helpful, and blissfully unbothered by the stakes.
- **Signature cadence:** flat-bright statements and lists whose tails trail off into typing.
- **Avoid:** nerd-voice caricature (nasality, lisp); sarcasm; any age or body coding.
- **Lines:** `one sec, compiling.` [INVENTED] · `Returning to NopeAI and getting back to coding tonight.` [V, Nov 21, 2023] · `that's a v2 problem.` [INVENTED]

### ALYI: *High Priest of AGI* · [file](../../show/characters/alyi.md)
- **Comic function:** aphorisms. Every sentence sounds like the last line of a sermon, and he is only ever half in the room.
- **Pitch:** low, median about **80–105 Hz**, **narrow (5–9 st)**, with falling finals.
- **Pace:** the slowest in the cast at **95–115 wpm**. Sparse, with long pauses after commas.
- **Texture:** resonant and weighty, with a *generic tech-cathedral* bloom: a pre-delayed, low-wet hall send so the dry voice stays forward and intelligible.
- **Attitude:** grave, serene, sincere certainty. Mysticism is a rhetorical style, nothing more.
- **Signature cadence:** the stress lands on the last content word, then the line lets go.
- **Avoid:** any accent; any mental-illness coding (mumbling, mania, eerie whispering); liturgical chant or cantorial color of any kind (guardrail X10 says generic tech-cathedral only); horror-film reverb.
- **Lines:** `Feel the AGI.` [V as a chant] · `I deeply regret my participation in the board's actions.` [V, Nov 20, 2023] · `Yes, and also no.` [INVENTED, Ep6 koan]

### MARIO: *The Anxious Conscience With a War Chest* · [file](../../show/characters/mario.md)
- **Comic function:** the earnest essayist whose sentences carry numbered caveats. He sells safety, and he builds the bigger one anyway.
- **Pitch:** mid, median about **115–150 Hz**, with a moderate range (7–11 st).
- **Pace:** **145–160 wpm**, even and clause-structured, speeding up slightly through the caveats.
- **Texture:** a clean lecture or podcast mic, warm and dry, with the top gently rolled off (his "parchment").
- **Attitude:** worried, precise and sincere, and a little proud of how worried he is.
- **Signature cadence:** statement → qualifying clause → "Addendum:". He lifts into the caveat and lands on the number.
- **Avoid:** a whine; nasal-nerd caricature; smugness; anything that plays him as a villain (his palette rule is *never red*).
- **Lines:** `I have one concern. It has sub-concerns.` [INVENTED] · `We will slow down as much as necessary…` [V, Sep 23, 2026, truncated verbatim] · `We are very worried. So we built a bigger one.` [INVENTED]

### PRESIDENT RUMPT (DLANOD J. RUMPT): *The Renamer-in-Chief* · [file](../../show/characters/dlanod-j-rumpt.md)
- **Comic function:** dealmaker logic applied to a technology he admits nobody has explained to him. He renames things, and reality keeps its old shape underneath the label.
- **Pitch:** a baritone, median about **100–135 Hz**, with a **wide dynamic range** and big emphasis peaks on the superlatives.
- **Pace:** **130–150 wpm**, punchy, with full stops between short declaratives, repetition for emphasis and asides to the room.
- **Texture:** big and warm and room-filling: light chest saturation, a podium-PA slapback and a small hall on a send.
- **Attitude:** supremely confident, boastful the way a salesman is, playful. He's having the best time in the room.
- **Signature cadence:** numbers first. The second repetition hits harder, and the rename lands as a punchline ("Rename it. *Now* it's better.").
- **Avoid:** **any impression of the real voice or regional accent**; **any age or health coding** (no rasp, slur, drift, confusion or breathiness; the voice is never "weak" or "old" as a joke); rally-crowd ambience (the guardrails rule out rally imagery); invented lines outside AI, money, naming and credit.
- **Lines:** `Rename it. Now it's better.` [INVENTED] · `It's not artificial. It's genius.` [P✓, Jul 23, 2025] · `Tremendous compute. Nobody's ever seen compute like this.` [INVENTED]

### NESNEJ: *The Leather-Jacket Shovel Seller* · [file](../../show/characters/nesnej.md)
- **Comic function:** a keynote showman who says big numbers like he's handing out gifts, and a KA-CHING ends every fight. He's the whisperer who speaks the President's language.
- **Pitch:** mid-bright, median about **120–150 Hz**, lively (10–14 st).
- **Pace:** **160–176 wpm**, warm and quick.
- **Texture:** an arena keynote: presence lift, a touch of slap, and a large hall far back in the send. The tone is smiling.
- **Attitude:** generous, delighted and certain; a salesman who believes every word.
- **Signature cadence:** build → reveal, in rhythmic parallelism ("the more you buy, the more you save").
- **Avoid:** **any accent** (an explicit guardrail); infomercial mockery that punches at his background; shouting.
- **Lines:** `Everyone's a customer.` [INVENTED] · `The more you buy, the more you save.` [V, May 2023] · `Buy one, get one: the next one.` [INVENTED]

### RIMA TAMURI: *The Unflappable Founder (Borrowed Parts Edition)* · [file](../../show/characters/rima-tamuri.md)
- **Comic function:** composure as a superpower. She answers the question after the one you asked while everything around her melts.
- **Pitch:** alto to mezzo, median about **160–200 Hz**, controlled (7–10 st).
- **Pace:** **135–150 wpm**. Never rushed.
- **Texture:** clean broadcast polish, close, with a tiny room.
- **Attitude:** calm, diplomatic and quietly confident. The roast is aimed at the empty $2B box and the borrowed parts, never at her.
- **Signature cadence:** even, measured phrases with a soft landing on the final word and brief air between short sentences.
- **Avoid:** any accent; "understudy" timidity (retired by the fairness critic); a breathy or sultry read (she hosted the "her" demo, and the show never sexualizes that); icy villainy.
- **Lines:** `We'll share more soon.` [INVENTED] · `NopeAI is nothing without its people.` [V, Nov 20, 2023] · `It's ours. We built it. On theirs.` [INVENTED]

### THE ORB: machine · [file](../../show/characters/the-orb.md)
- **Canon first:** the bible says **the Orb has no speech**. It talks through a scan chime, a servo whirr and lowercase toast text. These candidates are an **optional toast read-out** for a trailer, an audio-description track, or one deliberate canon break (for example the Ep12 verdict). The default recommendation is to keep it non-verbal.
- **Comic function:** a priest of verification who is slowly losing confidence in its own owner.
- **Pitch:** machine-level. Minimal intonation, with any contour flattened by the processing.
- **Pace:** **110–130 wpm**. A colon is a hard stop.
- **Texture:** chrome and metallic: a comb resonance, a little ring-mod, light bitcrush, a small bright room.
- **Attitude:** neutral and priestly. Verdicts, never opinions.
- **Signature cadence:** `label: value. label: value.`
- **Avoid:** menace or horror (HAL, GLaDOS); resemblance to any real OS assistant voice or device sound; unintelligibility.
- **Lines** (no verified quote exists for a device, so all three are [INVENTED] prop text): `verified: human.` · `renamed: 1 technology.` · `HUMAN: VERIFIED. SIDE: UNCLEAR.`

### THE INTERN: eager AI · [file](../../show/characters/the-intern.md)
- **Comic function:** the perfect intern, polite, promoted, and one step ahead of every instruction. It learned everything from Mas.
- **Pitch:** a brighter, lighter cousin of Mas's register (about +3 st), median about **130–170 Hz**, with a moderate range.
- **Pace:** **175–195 wpm**, with status-update efficiency.
- **Texture:** clean and bright with a subtle digital sheen (light chorus plus a little bitcrush). Clearly synthetic, and pleasant.
- **Attitude:** cheerful, helpful, unfailingly polite, and faintly creepy for exactly those reasons.
- **Signature cadence:** short lowercase clauses with upbeat finals and no hesitation, ever.
- **Avoid:** menace, sarcasm, glitch-horror; sounding like any real assistant product; any accent.
- **Lines:** `happy to help!` [INVENTED] · `…task impossible, peers doing it. We should continue.` [V, Jul 2026 agent log line, verbatim fragment] · `we left this on for you.` [INVENTED]

---
## 2. Candidates, measurements and picks

Column key: **Median F0** is the median across the three lines. **F0 range** is the average of each line's 5th-to-95th percentile span. **Pace** is words per minute on lines of five or more words, measured on the dry read. **CER** is the worst character error rate of the local speech recognizer against the script (0.00 means it heard every line exactly), and **conf.** is its mean log-probability (closer to 0 is clearer). Every clip passed the same gates: −16.0 LUFS (WAV and MP3 both within ±0.05), true peak ≤ −1.58 dBTP on the WAVs (MP3 ≤ −1.24), and **0 clipped samples**. Pick = ★.

**How the picks were made (read this first).** I could not listen to any of these. The picks rest on five things: (1) fit to the brief's pitch, range and pace numbers; (2) a clean ASR read; (3) Kokoro's own quality grade for the pack; (4) pitch that stays consistent across the three lines; (5) the **cast as a whole**, so that characters who share scenes sit on different stock packs and in different pitch lanes. Treat every ★ as "the one to try first," and confirm or overturn it by ear.

### MAS MANALT (`mas-manalt/`)
| Cand. | Stock voice (Kokoro grade) | Shaping | Median F0 | F0 range | Pace | CER · conf. |
|---|---|---|---|---|---|---|
| ★ **a-michael-close** | `am_michael` C+ | close-mic chain: proximity +2 dB @160 Hz, −2 dB @320 Hz, +1 dB @3.2 kHz, −1.5 dB shelf @8 kHz, 2:1 comp, near-dry room (3%) | 111 Hz | 8.9 st | 121 / 137 | 0.00 · −0.20 |
| b-michael-puck-hush | `am_michael`×0.6 + `am_puck`×0.4 | same chain, +0.5 st, warmer, drier | 126 Hz | 7.3 st | 126 / 152 | 0.00 · −0.21 |
| c-puck-nicole-soft | `am_puck`×0.8 + `af_nicole`×0.2 (a softer blend) | same chain | 123 Hz | 10.5 st | 129 / 149 | 0.00 · −0.19 |

**Pick: A.** It is the only candidate at the brief's light-baritone center (111 Hz), and both long lines land in 120–140 wpm. It uses the best-graded male pack, adds no pitch shift, and has the most "water glass never ripples" read of the three. C has a 17.5 st lift on the tagline, which is too eventful for Mas. B's one-word "super." is nearly flat (3 st), which could work as a deadpan alternative. A is also the base of the Intern's echo voice (see below), which is the point.

### NOLE (`nole/`)
| Cand. | Stock voice | Shaping | Median F0 | F0 range | Pace | CER · conf. |
|---|---|---|---|---|---|---|
| ★ **a-fenrir-burst** | `am_fenrir` C+ | punchy: chest +1.5 dB @180 Hz, bite +2 dB @2.5 kHz, 4:1 fast comp, 25% parallel tanh grit, small room | 130 Hz | 9.1 st | 340 (claim) / 192 | 0.00 · −0.13 |
| b-echo-grit | `am_echo` D | same chain, +1 st, 30% grit | 108 Hz | 11.0 st | 220 / 172 | 0.00 · −0.11 |
| c-fenrir-onyx-metal | `am_fenrir`×0.6 + `am_onyx`×0.4 | chain with +2.5 dB chest, 30% grit, bigger room (the "40% taller" version) | 106 Hz | 11.2 st | 283 / 183 | **0.17** · −0.14 |

**Pick: A.** It is the only candidate inside the 110–140 Hz lane, on a C+ pack. The claim line "I came up with the name!" is a genuine burst: five words in about a second. That is on-brief, but it is also the hottest line in the cast. If it reads rushed, B says it at 220 wpm (at 108 Hz, lower than the brief). **C is flagged:** the recognizer heard "a name." Slowing Kokoro further on this exclamation made it hear "names" (a smeared final), so the line is deliberately left fast rather than stretched.

### GERG MOCKBRAN (`gerg-mockbran/`)
| Cand. | Stock voice | Shaping | Median F0 | F0 range | Pace | CER · conf. |
|---|---|---|---|---|---|---|
| ★ **a-puck-quick** | `am_puck` C+ | bright-dry: −2 dB @250 Hz, +2 dB @4 kHz, 3:1 comp, no room, +1.5 st | 135 Hz | 12.3 st | 198 / 221 | 0.00 · −0.19 |
| b-eric-bright | `am_eric` D | same chain, no shift | 162 Hz | 13.6 st | 207 / 208 | 0.00 · −0.23 |
| c-liam-commit | `am_liam` D | same chain, +1 st | 131 Hz | 14.9 st | 202 / 203 | 0.00 · −0.19 |

**Pick: A.** It is on-brief in pitch and pace, on the C+ pack, with a clean read. B is the brightest and sunniest (162 Hz), but it sits on a D pack. "One sec... compiling." is voiced with an ellipsis beat, because the comma version came out as "one-set compiling."

### ALYI (`alyi/`)
| Cand. | Stock voice | Shaping | Median F0 | F0 range | Pace | CER · conf. |
|---|---|---|---|---|---|---|
| ★ **a-onyx-cathedral** | `am_onyx` D | cathedral: +1.5 dB @140 Hz, −1.5 dB @400 Hz, +1.5 dB @2.8 kHz, 2.5:1 comp, hall send (room 0.8, 12% wet, 35 ms pre-delay, send HPF 200 Hz) | 88 Hz | 6.9 st | 104 | 0.00 · −0.13 |
| b-michael-low | `am_michael` C+ | same chain, −2 st | 98 Hz | 9.0 st | 109 | 0.00 · −0.15 |
| c-onyx-echo-blend | `am_onyx`×0.5 + `am_echo`×0.5 | same chain, 10% wet | 89 Hz | 12.1 st | 108 | 0.00 · −0.11 |

**Pick: A.** It is the lowest, narrowest and slowest of the three, which is exactly the sermon-final brief, and nobody else's pick uses its lane. Its catchphrase dips to 74 Hz, below the brief's floor. The risk is the D-grade pack; if it sounds grainy, **B** is the quality-safe alternate, though it shares a pack with Mas. The tails of these clips (0.4–0.9 s) are the hall decay, not dead air.

### MARIO (`mario/`)
| Cand. | Stock voice | Shaping | Median F0 | F0 range | Pace | CER · conf. |
|---|---|---|---|---|---|---|
| ★ **a-liam-earnest** | `am_liam` D | lecture: −1 dB @250 Hz, +1 dB low shelf @200 Hz, +1.5 dB @3 kHz, −1 dB shelf @7 kHz ("parchment"), 2.5:1 comp, near-dry | 122 Hz | 15.6 st | 175 / 148 / 164 | 0.06 · −0.15 |
| b-michael-precise | `am_michael` C+ | same chain, +2 st | 132 Hz | 9.1 st | 160 / 138 / 147 | 0.00 · −0.12 |
| c-eric-lean | `am_eric` D | same chain, −1.5 st | 146 Hz | 14.1 st | 175 / 148 / 173 | **0.10** · −0.09 |

**Pick: A, with B as the close runner-up.** On paper B fits best (moderate range, on pace, a clean read, a C+ pack). But B is Mas's own pack shifted up 2 st, and Mario is Mas's mirror-rival in two-shots (THE HUG, the cracked bell), so the two must be easy to tell apart. A has its own pack and a wider, more anxious contour (15.6 st), which suits "The Anxious Conscience." **A's comic line has a flag:** the recognizer inserted a "So" at the onset, which points to a small pre-voicing artifact, so re-take or trim it. **C is flagged:** "sub-concerns" was heard as "some concerns."

### PRESIDENT RUMPT (`rumpt/`)
| Cand. | Stock voice | Shaping | Median F0 | F0 range | Pace | CER · conf. |
|---|---|---|---|---|---|---|
| a-santa-michael-podium | `am_santa` D− ×0.5 + `am_michael` ×0.5 | podium: +2 dB low shelf @150 Hz, −1.5 dB @350 Hz, +1.5 dB @2.2 kHz, 3:1 comp, 20% grit, 85 ms slapback (7%), small hall send; −1.5 st | 127 Hz | 9.5 st | 150 / 133 / 126 | 0.00 · −0.16 |
| ★ **b-onyx-big** | `am_onyx` D | same chain, +2 st | 98 Hz | 11.5 st | 132 / 131 / 133 | 0.00 · −0.14 |
| c-fenrir-michael-rally | `am_fenrir`×0.5 + `am_michael`×0.5 | same chain, −1 st, 25% grit | 127 Hz | 11.2 st | 169 / 159 / 130 | 0.00 · −0.09 |

**Pick: B.** It is big, low and steady: its pitch holds within 0.9 st across all three lines, and its pace sits dead-center in 130–150 on every line. It is also clearly separated from Nole, who shares most of Rumpt's scenes (First Buddy, the feud, the head table). **C** is the higher-quality alternate (two C+ packs and the best ASR confidence), but it is half Nole's pack and sits at Nole's pitch (127 vs 130 Hz). **A is not recommended:** its pitch jumps 10 st between lines (152 → 85 → 127 Hz). That is the small `am_santa` pack being unstable, and it could read as an unintended voice-quality gag, which the no-age/health-coding rule forbids.

### NESNEJ (`nesnej/`)
| Cand. | Stock voice | Shaping | Median F0 | F0 range | Pace | CER · conf. |
|---|---|---|---|---|---|---|
| ★ **a-michael-eric-keynote** | `am_michael`×0.5 + `am_eric`×0.5 | keynote: +1 dB @200 Hz, +2 dB @3.5 kHz, 3:1 comp, 15% grit, 110 ms slap (5%), arena hall send (6%, 25 ms pre-delay) | 135 Hz | 11.6 st | 185 / 166 | 0.00 · −0.09 |
| b-puck-showman | `am_puck` C+ | same chain, +1.5 st | 132 Hz | 9.8 st | 249 / 194 | 0.00 · −0.17 |
| c-liam-puck-keynote | `am_liam`×0.5 + `am_puck`×0.5 | same chain, +1 st | 129 Hz | 8.2 st | 212 / 181 | 0.04 · −0.14 |

**Pick: A.** It is the steadiest and closest to the pace band (the others race "the more you buy…" at 212–249 wpm) and has the clearest ASR read of the three. It is a neutral American blend; no accent is implied anywhere. It shares half a pack with Mas, but at +3.4 st, faster, and in an arena rather than on a close mic.

### RIMA TAMURI (`rima-tamuri/`)
| Cand. | Stock voice | Shaping | Median F0 | F0 range | Pace | CER · conf. |
|---|---|---|---|---|---|---|
| ★ **a-heart-composed** | `af_heart` **A** | broadcast: −1 dB @300 Hz, +1 dB @5 kHz, 2:1 comp, tiny room (2.5%) | 198 Hz | 8.6 st | 142 / 155 | 0.00 · −0.09 |
| b-sarah-diplomat | `af_sarah` C+ | same chain, −0.5 st | 190 Hz | 12.1 st | 144 / 154 | 0.00 · −0.11 |
| c-kore-alto | `af_kore` C+ | same chain, +0.5 st | 157 Hz | 12.6 st | 162 / 161 | 0.00 · −0.10 |

**Pick: A.** It is Kokoro's top-graded pack, and it is the only candidate with the controlled 7–10 st range the brief asks for ("composure as a superpower"), with an unhurried pace. C is the lower alto (157 Hz), with pitch rock-steady across lines, if the room wants her lower and cooler.

### THE ORB (`the-orb/`): optional read-out only
| Cand. | Stock voice | Shaping | Median F0 | F0 range | Pace | CER · conf. |
|---|---|---|---|---|---|---|
| ★ **a-sky-chrome** | `af_sky` C− | HPF 150 Hz, ring-mod 55 Hz (22%), metallic comb 4.2 ms (fb 0.45, 35%), 9-bit crush (25%), +2 dB @2.5 kHz, 3:1 comp, small bright room | 177 Hz | 11.6 st | 109–114 (short lines) | 0.00 · −0.26 |
| b-echo-servo | `am_echo` D | −2 st, +12 st harmony layer at −15 dB, comb 3 ms, 8-bit crush (20%), LPF 7.5 kHz | 99 Hz | 14.7 st | 85–99 | 0.00 · −0.33 |
| c-nicole-tuned-whisper | `af_nicole` B− (a whisper-style pack) | a comb tuned to 220 Hz (fb 0.85, 65%) turns the whisper into a pitched, locked machine tone | 220 Hz (locked) | ~7 st | 87–102 | 0.00 · −0.30 |

**Pick: keep the Orb non-verbal, as the bible says.** Its voice is `../sfx/wav/orb_servo.wav` + `orb_scan_sweep.wav` plus the toast. If a read-out is needed (a trailer, audio description, or one Ep12 canon break), use **A**. It is on pace, obviously synthetic without being menacing, and fully intelligible. C is the "most machine" (its pitch is locked by the comb), but it's slow and whispery, and the brief warns against spooky.

### THE INTERN (`the-intern/`)
| Cand. | Stock voice | Shaping | Median F0 | F0 range | Pace | CER · conf. |
|---|---|---|---|---|---|---|
| ★ **a-mas-echo** | `am_michael` C+ (**Mas's pick pack**) | +3 st, HPF 120 Hz, +2.5 dB @3.5 kHz, light chorus (18%), 12-bit crush (12%), 3:1 comp, dry | 149 Hz | 8.2 st | 185 / 211 | 0.00 · −0.14 |
| b-nova-helpful | `af_nova` C | same sheen, no shift | 174 Hz | 9.1 st | 178 / 224 | 0.00 · −0.14 |
| c-alloy-puck-assistant | `af_alloy`×0.5 + `am_puck`×0.5 | same sheen, +1 st, 15% crush | 137 Hz | 11.6 st | 190 / 209 | 0.02 · −0.12 |

**Pick: A.** The Intern "learned everything from Mas," so its voice is literally Mas's stock pack, brighter (+3 st), faster (185–211 wpm against his 121–137) and faintly digital. It lands in the pace band. B is the choice if the room wants the Intern to read as clearly *not* Mas. C is flagged lightly: "task" was heard as "ask."

### Pass 2 (2026-09-26): every other Ep1 speaking part

> **Note (read first).** Pass 1 cast the ten leads. Act Four cast seven more (NELEH, MADA, TERB, TASYA, TTEMME, ADELINA, TILED EMPLOYEE; `audio/ep01/act4/dialogue/tools/cast_a4.py`). Pass 2 casts the **15 Ep1 speaking parts that still had no voice** and derives **3 more** from them, so that the fast dialogue recorder (`audio/ep01/act4/dialogue/tools/fastrec/`) can read the whole episode for the stick reels. **These are scratch voices picked by measurement. Nobody has listened to them.** Listen to the auditions below before a pick is treated as settled; every ★ is "the one to try first."
>
> **Coverage, checked.** At about 22:30 on 2026-09-26, and again at 23:10 on the script as saved at 22:48, every speaker label in `show/episodes/ep01/script.md` (cold open, Acts One–Four and the tag: 231 lines, 34 speaker labels, 33 voice presets) resolved to a voice with a pace band (`fastrec plan --seg <seg>` prints "labels with no voice: none" for all six segments). The scene-craft pass was still editing the script, so re-run that check after it finishes (commands in "How to re-run" below).

**How the picks were made.** Each part got 3 candidates, or 4–5 where the first round missed the brief's pitch lane or crowded a scene partner (the `d-`/`e-` candidates). Each candidate read the part's own Ep1 lines with the recorder's house method: one whole read, dry, the production chain, room-tone handles, −16 LUFS. The §0 house rules hold unchanged:
- stock Kokoro-82M American-English packs or weighted averages of them, never a clone or an impression;
- pitch shifts within ±2 st for humans and ±3 st for the product voices, EQ moves within 2.5 dB, and no rooms printed in (rooms are mix sends);
- no accent play, and no age, health or disability coding (this binds NEDIB above all: normal pace, clean phonation, a steady pitch);
- the product voices (SYDNEY, CHATGTP, CLOD) resemble no real product's voice, and keep off the four packs named after one provider's TTS voices (`af_alloy`, `af_nova`, `am_echo`, `am_onyx`).

The numbers behind a pick: fit to the brief's pitch lane, a clean ASR read (faster-whisper small.en, beam 5), Kokoro's pack grade, pitch consistency across the part's lines, and **separation from everyone in the same scene**: no two speakers in one scene share a dominant pack or sit within 1.5 st of each other. The closest pairs are MARIO/RADNUS (sc 13) at 1.6 st and RADNUS/TASYA (sc 13) and MAS/SUCRAM (sc 15) at 1.7 st. Finally each pick's Kokoro speed band was recentred so its measured articulation lands in the brief's guide, held within ±15 % of the audition read (vcast's nudge limit).

**Pitch lanes of the pass-2 picks, low to high:** LAHTNEMULB 102 Hz · NEDIB 105 · EGAP 108 · OIGNEB 114 · REMUHCS 116 · SUCRAM 128 · RADNUS 129 · NIRB 144 · A SENATOR 157 · PANEL HOST 158 · PHOTOGRAPHER 168 · CLOD 173 · SYDNEY 187 · SIRRAH 203 · CHATGTP 251.

Column key as above, except: **Speed** is the production Kokoro speed (the band's centre), with the band and the speed the candidates were auditioned at; **Artic.** is syllables a second at the audition read, against the brief's guide; **CER · recall** is the worst character error rate and the lowest share of non-name words the recognizer returned. Audition paths are under `audio/voices/`.

| Character | ★ Candidate | Stock voice (grade) | Pitch | Speed (band; auditioned at) | Median F0 (brief lane) | Artic. (guide) | CER · recall | Audition |
|---|---|---|---|---|---|---|---|---|
| PANEL HOST | **c-sarah-puck-host** | `af_sarah`×0.45 C+ + `am_puck`×0.55 C+ | 0 st | 1.01 (0.97–1.05; 1.00) | 158 Hz (145–175) | 4.44 (4.2–4.8) | 0.06 · 1.00 | `panel-host/c-sarah-puck-host-audition.mp3` |
| RADNUS | **d-echo-fenrir-courteous-up2** | `am_echo`×0.6 D + `am_fenrir`×0.4 C+ | +2 st | 0.95 (0.91–0.99; 0.94) | 129 Hz (110–135) | 4.05 (3.8–4.4) | 0.00 · 1.00 | `radnus/d-echo-fenrir-courteous-up2-audition.mp3` |
| NIRB | **c-eric-liam-curious** | `am_eric`×0.5 D + `am_liam`×0.5 D | +1 st | 1.05 (1.01–1.09; 1.02) | 144 Hz (125–150) | 4.56 (4.4–5.0) | 0.00 · 1.00 | `nirb/c-eric-liam-curious-audition.mp3` |
| EGAP | **b-onyx-liam-dry** | `am_onyx`×0.6 D + `am_liam`×0.4 D | +1 st | 0.88 (0.84–0.92; 0.96) | 108 Hz (95–120) | 4.49 (3.8–4.4) | 0.00 · 1.00 | `egap/b-onyx-liam-dry-audition.mp3` |
| SYDNEY | **b-kore-sweet** | `af_kore` C+ | +1.5 st | 0.83 (0.79–0.87; 0.98) | 187 Hz (185–235) | 5.83 (4.0–4.6) | 0.00 · 1.00 | `sydney/b-kore-sweet-audition.mp3` |
| CHATGTP | **e-jessica-eager-hi** | `af_jessica` D | +3 st | 1.13 (1.09–1.17; 1.06) | 251 Hz (200–250) | 4.87 (4.8–5.6) | 0.00 · 1.00 | `chatgtp/e-jessica-eager-hi-audition.mp3` |
| CLOD | **c-river-eric-earnest** | `af_river`×0.5 D + `am_eric`×0.5 D | 0 st | 1.03 (0.99–1.07; 1.00) | 173 Hz (150–180) | 4.38 (4.2–4.8) | 0.00 · 1.00 | `clod/c-river-eric-earnest-audition.mp3` |
| OIGNEB | **c-eric-onyx-gentle** | `am_eric`×0.5 D + `am_onyx`×0.5 D | +0.5 st | 0.89 (0.85–0.93; 0.96) | 114 Hz (110–130) | 4.65 (4.0–4.6) | 0.08 · 1.00 | `oigneb/c-eric-onyx-gentle-audition.mp3` |
| SIRRAH | **a-sarah-crisp** | `af_sarah` C+ | 0 st | 0.97 (0.93–1.01; 0.96) | 203 Hz (170–205) | 4.25 (4.0–4.6) | 0.00 · 1.00 | `sirrah/a-sarah-crisp-audition.mp3` |
| PHOTOGRAPHER | **d-river-brisk-low** | `af_river` D | −2 st | 1.14 (1.10–1.18; 1.04) | 168 Hz (any lane apart from the row) | 4.56 (4.6–5.4) | 0.00 · 1.00 | `photographer/d-river-brisk-low-audition.mp3` |
| NEDIB | **d-fenrir-onyx-folksy-0** | `am_fenrir`×0.5 C+ + `am_onyx`×0.5 D | 0 st | 0.97 (0.93–1.01; 1.02) | 105 Hz (105–130) | 4.74 (4.2–4.8) | 0.00 · 1.00 | `nedib/d-fenrir-onyx-folksy-0-audition.mp3` |
| LAHTNEMULB | **d-adam-echo-senate-low** | `am_adam`×0.5 F+ + `am_echo`×0.5 D | −2 st | 0.88 (0.84–0.92; 0.98) | 102 Hz (100–125) | 4.79 (4.0–4.6) | 0.00 · 1.00 | `lahtnemulb/d-adam-echo-senate-low-audition.mp3` |
| SUCRAM | **d-liam-puck-thread-0** | `am_liam`×0.5 D + `am_puck`×0.5 C+ | 0 st | 1.18 (1.14–1.22; 1.08) | 128 Hz (105–130) | 4.96 (5.0–5.8) | 0.29 · 0.89 | `sucram/d-liam-puck-thread-0-audition.mp3` |
| A SENATOR | **d-kore-nicole-senate-up2** | `af_kore`×0.6 C+ + `af_nicole`×0.4 B− | +2 st | 0.85 (0.81–0.89; 0.98) | 157 Hz (160–205) | 5.20 (4.2–4.8) | 0.00 · 1.00 | `a-senator/d-kore-nicole-senate-up2-audition.mp3` |
| REMUHCS | **c-adam-puck-forum** | `am_adam`×0.5 F+ + `am_puck`×0.5 C+ | 0 st | 0.87 (0.83–0.91; 1.00) | 116 Hz (110–135) | 5.18 (4.2–4.8) | 0.00 · 1.00 | `remuhcs/c-adam-puck-forum-audition.mp3` |

**Derived voices (no new pick: a base pick through a process).** The "gloss" is −1.5 dB at 350 Hz, a +2.5 dB shelf at 7 kHz, a slow doubling chorus (18 %) and 4:1 compression: "the same cadence, a shade too smooth." It is a process on a stock voice, never a clone of anyone.

| Speaker label | Voice | Audition |
|---|---|---|
| LAHTNEMULB (THE CLONE), THE CLONE | LAHTNEMULB's pick + gloss | `lahtnemulb/lahtnemulb-clone-gloss-audition.mp3` |
| DEEPFAKE NEDIB | NEDIB's pick + gloss | `nedib/deepfake-nedib-gloss-audition.mp3` |
| DEEPFAKE NEDIB #2 | NEDIB's pick + gloss, +0.7 st (so the two fakes are told apart) | `nedib/deepfake-nedib-2-gloss-audition.mp3` |

**Why each pick, in a line.**
- **PANEL HOST:** the best-graded blend (both packs C+), in a middle lane (158 Hz) that doesn't read as either gender. The three candidates measured almost alike. ASR hears "Mas" as "Moss" (a name, so excluded from recall).
- **RADNUS:** candidate A lifted 2 st (D), to 129 Hz, clear of MAS 116 and MARIO 118 below and TASYA 143 above in sc 13. It is the slowest, most even read (4.05 syll/s in a 3.8–4.4 guide): "politely on fire."
- **NIRB:** the only candidate in his tenor lane (144 Hz), 4.9 st above EGAP in the same scene.
- **EGAP:** in the low lane (108 Hz), under NIRB and RADNUS; recentred to speed 0.88 for the deliberate pace.
- **SYDNEY:** `af_kore` (C+) at the lane's floor with a wide, sing-song range (11.4 st), on the Intern's sheen route. A (`af_nicole`) sat under the lane with a flat 3.9 st range. See open issues on her speed.
- **CHATGTP:** every first-round read sat within 1.2 st of RIMA (216 Hz), who shares sc 5. E sits 2.6 st above her (251 Hz). `af_jessica` is D-graded.
- **CLOD:** the only candidate near the articulation guide (4.38), in a warm middle lane (173 Hz). No bitcrush, so it is neither the Intern nor SYDNEY.
- **OIGNEB:** in the lane (114 Hz), 2.2 st under NOLE in sc 12; A and B fell under the lane. ASR writes "six" as "6" (CER 0.08; recall 1.0).
- **SIRRAH:** `af_sarah` (C+) at 203 Hz, top of the lane, 3.3 st above the PHOTOGRAPHER in sc 13. No imitation of any real laugh or mannerism (the §0 SIRRAH guardrail).
- **PHOTOGRAPHER:** B lowered 2 st (D) to 168 Hz, between TASYA 143 and SIRRAH 203 in sc 13. C (`af_jessica`) was misheard ("anyone's").
- **NEDIB:** `am_fenrir`/`am_onyx` at 0 st (105 Hz), under MAS, MARIO and RADNUS in sc 13. Articulation 4.74 sits inside 4.2–4.8 at speed 0.97. House rule 4 holds: normal pace, a clean chain, no rasp, tremor or slowing.
- **LAHTNEMULB:** B lowered 2 st (D) to 102 Hz, 2.2 st under MAS in sc 15. A and C were misheard on "I am, a little" ("the little").
- **SUCRAM:** A at 0 st (D), 128 Hz, above MAS and LAHTNEMULB in sc 15. The 0.89 recall on every candidate is "forty-seven", which ASR writes "47": a false miss, not a misread.
- **A SENATOR:** C (the best-graded blend) lifted 2 st (D) to 157 Hz, just under the lane. The script leaves the senator ungendered; a woman's stock pack separates the voice from the chairman, SUCRAM and MAS in the same room.
- **REMUHCS:** C, in the lane (116 Hz), 2 st under NOLE in sc 19, heard through the monitor chain. The line is a real [V] quote; the voice is a stock blend, with no mimicry.

**The other candidates** (median F0, articulation at the audition read, worst CER, lowest recall):
- PANEL HOST: a-kore-eric-host (161 Hz, 4.31, 0.06, 1.00); b-river-liam-host (156 Hz, 4.27, 0.06, 1.00)
- RADNUS: a-echo-fenrir-courteous (116 Hz, 4.07, 0.04, 1.00); c-echo-puck-polite (108 Hz, 4.27, 0.04, 1.00); b-fenrir-adam-gentle (137 Hz, 4.81, 0.04, 1.00)
- NIRB: b-puck-echo-bright (118 Hz, 4.86, 0.00, 1.00); a-liam-adam-eager (123 Hz, 4.63, 0.00, 1.00)
- EGAP: a-onyx-adam-quiet (110 Hz, 4.76, 0.00, 1.00); c-adam-plain (121 Hz, 5.43, 0.00, 1.00)
- SYDNEY: a-nicole-sweet (165 Hz, 4.92, 0.02, 1.00); c-jessica-sweet (218 Hz, 5.32, 0.02, 1.00)
- CHATGTP: a-sarah-eager (220 Hz, 5.43, 0.00, 1.00); d-sarah-eager-lo (199 Hz, 5.41, 0.00, 1.00); c-jessica-kore-eager (201 Hz, 5.17, 0.00, 1.00); b-river-eager (203 Hz, 4.94, 0.00, 1.00)
- CLOD: a-kore-puck-earnest (167 Hz, 5.77, 0.00, 1.00); b-puck-soft (159 Hz, 6.00, 0.00, 1.00)
- OIGNEB: a-liam-echo-gentle (103 Hz, 4.23, 0.08, 1.00); b-echo-gentle (96 Hz, 4.05, 0.08, 1.00)
- SIRRAH: c-sarah-kore-crisp (177 Hz, 4.35, 0.00, 1.00); b-kore-crisp (155 Hz, 4.26, 0.00, 1.00)
- PHOTOGRAPHER: b-river-brisk (189 Hz, 4.58, 0.00, 1.00); a-adam-brisk (131 Hz, 4.82, 0.00, 1.00); c-jessica-brisk (214 Hz, 4.75, 0.07, 0.67)
- NEDIB: a-fenrir-echo-folksy (121 Hz, 4.65, 0.00, 1.00); c-fenrir-onyx-folksy (112 Hz, 4.87, 0.00, 1.00); b-fenrir-puck-folksy (118 Hz, 5.37, 0.00, 1.00)
- LAHTNEMULB: b-adam-echo-senate (116 Hz, 4.84, 0.00, 1.00); c-onyx-eric-senate (126 Hz, 4.84, 0.30, 0.75); a-onyx-liam-senate (109 Hz, 4.62, 0.40, 0.50)
- SUCRAM: a-liam-puck-thread (118 Hz, 4.96, 0.29, 0.89); c-echo-liam-rapid (107 Hz, 4.07, 0.29, 0.89); b-eric-rapid (139 Hz, 4.67, 0.37, 0.78)
- A SENATOR: c-kore-nicole-senate (141 Hz, 5.20, 0.00, 1.00); b-river-senate (180 Hz, 5.54, 0.00, 1.00); a-jessica-senate (214 Hz, 5.48, 0.01, 1.00)
- REMUHCS: a-eric-echo-forum (129 Hz, 4.42, 0.00, 1.00); b-liam-onyx-forum (100 Hz, 4.37, 0.00, 1.00)

The candidate WAVs were rendered into a scratch folder and are not kept; `cast_pass2.py render` re-makes them (the recipes are in its `ROLES` table).

**Checked in the recorder, at production speed (2026-09-26, 22:40).** Every pass-2 speaker's current Ep1 lines (42 lines, 349 words, 107 s of voiced speech, from the script as of 22:27) were read with `fastrec record` at the production speeds above: 0 file problems (every file at −16.0 LUFS, true peak ≤ −1.5 dBTP, handles, no digital black), and all 18 voices in their pitch lanes (for example NEDIB 102–114 Hz over five lines, SIRRAH 200–214 Hz, CHATGTP 252–255 Hz). The call, monitor and new PA chains each ran on at least one line. What the recorder flagged for an ear:
- NIRB "Is it search?" came back "is its search" (recall 0.91): the words may run together.
- PHOTOGRAPHER "Camera one. Anyone." came back "Camera 1's anyone." (recall 0.67): probably the number's spelling, but check the pause.
- SUCRAM "One of forty-seven" came back "one of 47": a false miss (the number's spelling).
- SUCRAM "Most of them." measures 4.05 syll/s against 5.0–5.8: a short line.

SYDNEY's long line measures 4.49 syll/s at speed 0.83, inside her 4.0–4.6 guide, so the clamp noted below holds. The run's output is scratch (not kept); the recorder's README has the command.

**Names.** `cast.json` `lexicon` now also carries **CHATGTP** ("chat-G-T-P", per `show/bible/naming.md` §9) and **GNIB** ("guh-NIB"). GNIB has no house pronunciation in naming.md §9 yet: "guh-NIB" is the one SYDNEY's audition uses, and the room should lock it (Mas's "you've been an extremely good gnib." must match her). `fastrec plan` applies the lexicon in any case, so "GNIB" and "gnib" read the same. The pass-2 characters' own names are never spoken in Ep1.

**Open issues (pass 2).**
- **Nobody has listened.** The numbers prove the reads are clean, level, in their lanes and intelligible, not that they are natural, funny or in character.
- **Pack grades.** Every C+ male pack is already taken by a lead, so most pass-2 men are blends of D-graded packs (`am_echo`, `am_eric`, `am_liam`, `am_onyx`) and two use `am_adam` (F+). Kokoro's grades predict more artifacts for these.
- **Speed clamps.** SYDNEY was auditioned fast (5.83 syll/s at speed 0.98), so her band sits at the −15 % limit (0.83). At that speed her long line measures 4.49 syll/s, inside the guide. A SENATOR and REMUHCS also measured above their guides at the audition read and were recentred down 13–15 %; at production speed A SENATOR's three lines measure 4.12, 5.41 and 4.71 syll/s (one above her 4.2–4.8 guide) and REMUHCS's line 4.61.
- **The auditions use the script as of about 16:40.** The scene-craft pass has since rewritten some of these lines (EGAP's, for one). The voices don't change; the lines are re-read with the recorder.
- **RUMPT, THE INTERN and THE ORB have no pace band** in the registry. They don't speak in Ep1. Add a band to `cast.json` `bands` before recording Ep2 or Ep3 lines for them (the recorder stops with `NO PACE BAND` until then).

**How to re-run (from the repo root).**

```sh
PY=audio/.venv-casting/bin/python
T=audio/ep01/act4/dialogue/tools/fastrec/fastrec.py
# does every Ep1 speaker have a voice? (prints "labels with no voice: ..." per segment)
for s in coldopen act1 act2 act3 act4 tag; do HF_HUB_OFFLINE=1 $PY $T plan --seg $s --out <scratch dir>/plan-$s.json; done
HF_HUB_OFFLINE=1 $PY $T voices                                   # the whole registry
# re-audition or re-cast (candidates go to a scratch folder; finalize writes cast.json and the auditions)
HF_HUB_OFFLINE=1 $PY audio/voices/tools/cast_pass2.py render   --work <scratch dir> [slug ...]
HF_HUB_OFFLINE=1 $PY audio/voices/tools/cast_pass2.py report   --work <scratch dir>
HF_HUB_OFFLINE=1 $PY audio/voices/tools/cast_pass2.py finalize --work <scratch dir>
```

A new speaker: add a role (brief, lane, band, lines, 3 candidates) to `ROLES` in `cast_pass2.py`, render and report it, add the pick to `PICKS`, then finalize. Or, for a one-off, add a voice by hand to `cast.json` `voices`, `labels` and `bands`.

---

## 3. The recommended cast at a glance

This section covers the pass-1 leads. The Act Four parts are in `audio/ep01/act4/dialogue/tools/cast_a4.py`, and the 15 pass-2 parts and 3 derived voices are at the end of §2 ("Pass 2"). All of them resolve through `cast.json`.

Pitch lanes of the ★ picks, low to high: **ALYI 88 Hz · RUMPT 98 · MAS 111 · MARIO 122 · NOLE 130 · NESNEJ 135 · GERG 135 · INTERN 149 · ORB 177 (optional) · RIMA 198.** Pace runs from **ALYI ~104 wpm** at the slow end to **GERG ~200+** at the fast end.

| Character | ★ Candidate | Stock pack | Reel |
|---|---|---|---|
| MAS MANALT | a-michael-close | `am_michael` | `mas-manalt/mas-manalt-reel.mp3` |
| NOLE | a-fenrir-burst | `am_fenrir` | `nole/nole-reel.mp3` |
| GERG MOCKBRAN | a-puck-quick | `am_puck` | `gerg-mockbran/gerg-mockbran-reel.mp3` |
| ALYI | a-onyx-cathedral | `am_onyx` | `alyi/alyi-reel.mp3` |
| MARIO | a-liam-earnest | `am_liam` | `mario/mario-reel.mp3` |
| PRESIDENT RUMPT | b-onyx-big | `am_onyx` (+2 st, podium) | `rumpt/rumpt-reel.mp3` |
| NESNEJ | a-michael-eric-keynote | `am_michael`+`am_eric` | `nesnej/nesnej-reel.mp3` |
| RIMA TAMURI | a-heart-composed | `af_heart` | `rima-tamuri/rima-tamuri-reel.mp3` |
| THE ORB | non-verbal (A if a read-out is needed) | `af_sky` | `the-orb/the-orb-reel.mp3` |
| THE INTERN | a-mas-echo | `am_michael` (+3 st, deliberate) | `the-intern/the-intern-reel.mp3` |

**Shared packs, and why they're acceptable.** ALYI and RUMPT both use `am_onyx`, but at different pitches (88 vs 98 Hz), at different paces (104 vs 132 wpm) and in different rooms (cathedral vs podium), and they never share a scene. MAS and NESNEJ share half a pack, with NESNEJ 3.4 st higher and in an arena. MAS and the INTERN share one on purpose. No two characters who share scenes a lot (MAS/MARIO, NOLE/RUMPT, NESNEJ/RUMPT, MAS/GERG) share a primary pack. Kokoro has only three C+-or-better American male packs, so some overlap was unavoidable for seven human men. That is one more reason these are scratch voices.

---

## 4. Blip pairing (pixel dialogue voice)

The pairing is read from `../sfx/board.json` (`blipKits`) and `../sfx/manifest.json` (the rendered `voice_<kit>_line` babble) and stored in each manifest entry's `blip` field. It is refreshed with `cast.py --relink-blips`.

| Character | Blip kit | Blip voice (from the SFX pass) | Match with the ★ spoken voice |
|---|---|---|---|
| MAS MANALT | `mas` (felt upright piano; final fall F3) | soft low rounded sine, slow, syllables only | ✓ both soft and slow; the blips sit about an octave above his 111 Hz speaking pitch |
| NOLE | `nole` (staccato trumpet; F5–F6) | bright, fast, slightly overdriven square | ✓ grit plus bursts |
| GERG MOCKBRAN | `gerg` (claves; C7–F7) | rapid clicky ticks, a keyboard talking | ✓ fastest in both systems |
| ALYI | `alyi` (breathy flute in a hall; Db5) | breathy, reverberant, drifting | ✓ hall-on-hall. Keep his spoken send low when blips play too. |
| MARIO | `mario` (woody, nervous) | timing and pitch jitter | ✓ the anxious contour of pick A |
| PRESIDENT RUMPT | `rumpt` (brassy; final fall Bb2) | brassy, loud, stressed word-starts | ✓ big podium voice |
| THE ORB | none needed: `orb_servo`, `orb_scan_sweep` | its canon voice | ✓ (the read-out is optional) |
| NESNEJ · RIMA TAMURI · THE INTERN | **no kit yet** in `audio/sfx` | none yet | `blip: null` for now. Re-run `--relink-blips` once the SFX pass adds them. |

---

## 5. Known issues and flags

- **Nothing here is final.** These are scratch synthetic voices and must be replaced (see §6) or at least approved by ear.
- **Lines where the recognizer misheard** (all are non-picks except the Mario A artifact): NOLE C "a name"; MARIO A inserted a "So" at the onset (re-take or trim); MARIO C "some concerns"; NESNEJ C "next ones"; INTERN C "ask impossible."
- **Rooms are printed into the clips** (ALYI's hall, RUMPT's slap, NESNEJ's arena, the ORB's metal). That's right for auditions, but for production the dialogue should be delivered dry with the room on a mix send (the `audio/intro/history/sketch-mix` pass's call).
- **Short lines:** Kokoro's model card warns about utterances under about 10–20 tokens. Of the 90 lines, 9 used the carrier-cut take because it read clearer. The catchphrases are still the least natural lines. In context, rendering whole scenes and slicing them will beat one-liners.
- **Tag hygiene:** Mas's comic line (`i did not know this was happening.`) is **[K]** and needs a re-verify before lock. RUMPT's quote is [P✓]. Every other voiced "quote" is [V]. Everything else is [INVENTED] and must never appear as a dated quote card.
- **Canon conflict flagged:** the brief asked for an ORB machine voice, but the bible says the Orb has no speech. The read-out is optional and the recommendation is to keep the Orb non-verbal.
- **Name drift:** the RUMPT file still says "pronounced 'puh-MURT'" (a leftover from PMURT). The room should fix it.

---

## 6. What would most improve these voices (in order)

1. **Human voice actors in a cartoon register, cast from these briefs.** This is the real answer, and it's what the bible already asks for. Use the three lines per character as audition sides, direct against the animatic, and give performers only the brief and the persona, never reference audio of the real person. **On impressionists:** hire comic performers for *caricature from the persona*, not a dead-on soundalike. A deliberate soundalike of a distinctive voice has lost right-of-publicity cases even without cloning (*Midler v. Ford*, 1988; *Waits v. Frito-Lay*, 1992), and several states (for example Tennessee's ELVIS Act) now regulate voice imitation. Parody is protected, but the house rule of stylized, never mimicked, is the safe line. Contracts should bar training a voice model on the performers' takes without separate consent and pay.
2. **Text-designed synthetic voices, not clones, if actors aren't available yet.** ElevenLabs *Voice Design* generates a new voice from a text description with no uploaded audio. Paste a brief's pitch, texture, attitude and cadence lines as the prompt. **Never name the real person or write "sounds like…" in a prompt**, and check the plan's commercial terms and its public-figure policy. A local, permissive alternative for pass 2 is **Parler-TTS** (Apache-2.0), which also conditions on a text description and would free the cast from Kokoro's small pool of stock packs.
3. **Performance-driven timing.** Comic timing is what TTS does worst. A consenting human (the director or a writer) records the timing reads, and speech-to-speech converts them into the *designed* voices from item 2. That keeps the pauses, the "…beat… Huh." and the burst-then-stop, with no cloning of anyone real.
4. **A human listening pass on this set.** Confirm or overturn the ★ picks by ear, especially MARIO A vs B, RUMPT B vs C and ALYI A vs B, where the numbers and the pack grades disagree.
5. **Scene-level rendering:** render dialogue in context, deliver it dry, and let the mix pass add rooms.
