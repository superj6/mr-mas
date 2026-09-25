# Ep1 · Act Four · Dialogue (casting + recording) · draft 3.1

*Dialogue director + recordist, 2026-09-25, updated for script **draft 3.1** (the POV pass, after its table read) of [script.md](../../script.md#act-four--the-blip-told-twice), per [pov-changes.md](pov-changes.md) §1–2 with its §7 defaults ("super." through their speaker, as written; "i don't keep score.", with the fallback recorded as an alternate). The first pass (draft 2) is carried: every line whose words and take did not change keeps its file. **Scratch synthetic voices** (Kokoro-82M stock packs): every take is measured and picked by numbers, and nobody has listened. A human ear pass is still the first thing the next stage needs (§10).*

| | |
|---|---|
| **Lines** | 55 rows in draft 3.1 order · **43 dialogue** (78.0 s) + **5 MAS (V.O.)** (11.7 s, 24 words) voiced in the cut · 7 post pop-ups (unvoiced by house rule; scratch reads in `optional/`) |
| **This pass** | 18 rows changed (§0): 5 new V.O. lines + the guardrails fallback, the laptop-speaker "super." (derived, with a clean copy), the "mostly." re-take, and restaged rows; 58 new takes; 1 line retired ("the hearts were sincere.") |
| **Speakers** | 12 voiced + MAS's V.O. lane · silent by design: THE ORB, THE QUIET VOTE, BUKAJ, MADA's tile-avalanche beat, and Mas's portrait in pass one |
| **Audio** | [`../../../../../audio/ep01/act4/dialogue/`](../../../../../audio/ep01/act4/dialogue/) · `wav/<id>.wav` 48 kHz/24-bit mono · `mp3/<id>.mp3` 160k · `fallback/` (the V.O. alternate wording) · `clean/` (the unprocessed laptop line) · `retired/` (cut and superseded files) · [`lines.json`](../../../../../audio/ep01/act4/dialogue/lines.json) · [`act4-dialogue-reel.mp3`](../../../../../audio/ep01/act4/dialogue/act4-dialogue-reel.mp3) (129 s listening reel, script order, not picture timing) |
| **Levels** | DRY (no reverb/slap). Integrated loudness per line: **dialogue −16.0 LUFS**, **MAS (V.O.) −18.0** (2 LU under: "slightly lower"), **the laptop-speaker line −22.0** ("quieter than the room"). True peak ≤ −1.5 dBTP, 0 clipped samples, 30 ms head / 80 ms tail; MP3s level-matched to ±0.1 LU. Each row's target is `qa.target_lufs`; all checked by `tools/final_cast.py` |
| **Engine** | Kokoro-82M v1.0, lang 'a' (General American) stock packs; misaki G2P; pedalboard EQ/comp. No cloning, no reference audio, no accent. Tools in `audio/ep01/act4/dialogue/tools/` |

**QA gate:** every row passes format, level (to its own target), true-peak, clipping, MP3 level-match, staging-field and mouth-track checks. 4 speech-recognition differences remain, none a misread:
- a4-27-17: ASR CER 0.086 ('The first and last time I ever wear one of these.'): optional pop-up read; the recognizer hears a leading 'The', most likely a pre-voiced onset like the ones seen on the direct one-word Mas takes. Check by ear before using it in the animatic
- a4-29-09: ASR CER 0.15 ('Has anyone read the charter?'): expected: the line is cut inside 'char-' and the recognizer completes the word
- a4-30-11: ASR CER 0.143 ('I am deeply pleased by this result, after about 72 very intense hours of work.'): optional pop-up read; the recognizer writes '72' for the spoken 'seventy-two'
- a4-31-03: ASR CER 0.021 ('I love and respect Ali. I harbor zero ill will towards him.'): the recognizer spells ALYI (/ˈælji/) as 'Ali'; everything else is exact

---

## 0. What changed for draft 3.1

Diffed line by line: draft 3.1's Act Four dialogue against the draft-2 `lines.json`, and against pov-changes §1.

| Id | Sc | Line | Change | What was done |
|---|---|---|---|---|
| `a4-26a-vo1` | 26A | i don't keep score. | new V.O. (D2) | Recorded in the V.O. voice (8 takes, t05 delivered). The guardrails fallback "i don't keep things." is recorded too (8 takes) and rides on the row as `fallback` (`fallback/a4-26a-vo1.wav`). Default per §7 ruling 2: score |
| `a4-26a-vo2` | 26A | the meeting ended early. | new V.O. (D4) | Recorded (8 takes). These words were draft 3's sc 26 line `a4-26-vo1`; that id is retired from sc 26 (it was never recorded here) |
| `a4-27-00` | 27 | super. | new, derived | No new read: `a4-26-01`'s delivered take through a small laptop-speaker filter (§4), -22 LUFS. The untouched copy is in `clean/`. No portrait, no mouth |
| `a4-29-vo1` | 29 | i put the phone down. | new V.O. (D5) | Recorded (8 takes). Replaces draft 3's "i kept quiet." |
| `a4-29-vo2` | 29 | the badge was a joke. | new V.O. (D3) | Recorded (8 takes). Replaces draft 3's "the hearts were sincere."; it now comes before the letter |
| `a4-29-03` | 29 | mostly. | re-take | 10 new takes read after the new account (§4); t04 delivered. The draft-2 take is archived in `retired/` |
| `a4-29-vo3` | 29 | gerg never waits to be asked. | new V.O. (D8) | Recorded (8 takes). pov-changes says "no re-read", but this stage had never recorded it (only the editor's scratch existed), so it was recorded now; the word track gives the frame for "asked" (the door's first step) |
| `a4-29-02` | 29 | the hearts were sincere. | **cut** | "the hearts were sincere." (draft 2, on-mic): removed from `lines.json`; files in `retired/` |
| `a4-30-12` | 30 | okay. | restaged | Same words, same take. It now plays off his face, over the `[ECU]` of his hands: `mouth: []`, no lip-sync |
| `a4-29-01` | 29 | "NopeAI is nothing without its people" | hold | Rima's post is now legible on the phone inside the `[ECU]` for its full 2 bars: `popup_hold_beats` 8 |
| `a4-26-01`, `a4-27-05`, `a4-27-12`, `a4-27-14`, `a4-27-21`, `a4-29-07`, `a4-29-08`, `a4-30-01`, `a4-30-03`, `a4-30-06` | | | restaged | Same words and take; the delivery note and shot follow draft 3.1 (e.g. the all-hands line plays in a `[W]` with no portrait; NELEH's "The company is calling us." is in the boardroom `[2S]`; TASYA's "Everyone is welcome." comes ≥ 1 beat after the V.O. with no music; "leave it open." comes at once, with no eyelines; ALYI's post plays in the doorway `[P2]` with Mas) |
| every row | | | new fields | `kind`, `side`, `pov`, `shot`, `lip_sync`, `status` (§9). Lines with no visible mouth (V.O., O.S., his voice through their speaker, off-face) now carry `mouth: []`; O.S. rows that had cues lost them (`a4-29-07`, `a4-30-04`, `a4-30-07`) |

**Unchanged:** every other line keeps its words, take, file and mouth cues: THE PLAN's two lines, sc 26's "super.", all of pass one's spoken lines, the Gerg exchange, NELEH's "char—", sc 30 except "okay.", and sc 31. Real lines and their tags are untouched.

## 1. House rules applied

- **Never clone, never mimic.** Stock Kokoro packs or averages of them only; every brief was written from the character file's persona and comic function, never from the real person's voice (script header; guardrails §5 'Voices'; CASTING.md §0).
- **No accent humour; no age, health or disability coding.** Every voice is a General-American pack. A creak/fry detector runs on every take and penalises it (fry reads as age coding, and the Mas brief rules it out). No delivered line trips it.
- **The V.O. is Mas's alone and never heard in the world** (pov-and-framing §1.3, §4.6). It is the same performer as on camera, closer; every line is [INVENTED] and tagged with its device; its text stays lowercase, full stops only. Nothing here gives the Orb (or anyone) a reaction to it: "mostly." is read as an answer to the Orb's look, not to the V.O.
- **A voice on their call, never a caption** (§6.2). In pass one Mas is heard only through the board's laptop speaker, processed from the line he already said on his side; it types in the dialogue box with no portrait (`side: none`).
- **Tags travel with the audio.** Each row carries its script tag. [V] lines are spoken verbatim with the parody-name swap; [INVENTED] lines never go on a dated card. [V/K] (TASYA 'below/above/around') and GERG's two re-fetch flags are carried, not resolved.
- **Posts are pop-ups, never speeches.** The 7 pop-up posts are unvoiced in the cut (`kind: post`); scratch reads sit in `optional/`. The posts the script has *spoken* (TASYA 'read aloud with pleasure', ALYI 'read from the doorway') and Mas's memo are voiced (`kind: dialogue`).
- **Mas's text stays lowercase** in `text`; pronunciation overrides live in `spoken_as` only (NopeAI → 'Nope AI', ALYI → /ˈælji/ 'AL-yee', '~72' → 'about seventy-two', '&' → 'and').

## 2. Cast

Lane numbers are measured on the **delivered** lines (`qa/final_cast.json`): median F0, mean per-line F0 range (5th-95th pct), words per minute on lines of 3+ words (pauses included). The laptop-speaker row is a copy of `a4-26-01` and has no lane of its own.

| Character | Scenes | Lines | Voice (preset ID) | Text description | Median F0 · range · pace | Why this voice |
|---|---|---|---|---|---|---|
| ALYI (CASTING.md ★) | 27, 30 | 5 (18.4 s) | `am_onyx` · a-onyx-cathedral  | low, slow, weighty baritone, falling sermon finals; (hall added in the mix, generic tech cathedral) | 84.1 Hz · 13.0 st · 137, 99, 106, 108, 109 wpm | CASTING.md pick. Lowest lane in the act, 3.5 st under TERB, the slowest pace. His cathedral hall is now a mix send (numbers under Mix notes). |
| TERB (**new (pass 1)**) | 30 | 3 (3.2 s) | `am_echo` · b-echo-brisk  | tall, dark, brisk baritone, crisp 2 kHz edge, procedural and unbothered | 103.2 Hz · 12.2 st · 186 wpm | The only candidate in a tall-baritone lane (~100 Hz on 'Which room is on fire?'); am_fenrir came out at 150 Hz and turned 'Ah.' into 'Bye.'. Darkest timbre of the act's men after ALYI: MFCC distance 48 from MAS and 59 from MADA, his two calm-off neighbours. |
| MAS MANALT (CASTING.md ★) | 26, 29, 30, 31 | 9 (15.6 s) | `am_michael` · a-michael-close  | soft light baritone, close-mic, level finals, lunch-order pace; never raised, never smug | 111.0 Hz · 9.0 st · 146, 146, 148, 128 wpm | CASTING.md pick, unchanged except the room removed. The still centre: every one-word line was cast from 6-11 takes for a level or gently falling final, in his lane and free of creak. |
| MAS MANALT (V.O.) (**new (this pass)**) | 26A, 29 | 5 (11.7 s) | `am_michael` · a-michael-close · vo-close | the same voice, closer and softer: intimate close mic, dry, a touch slower, slightly lower; told, never performed | 111.9 Hz · 8.4 st · 120, 114, 149, 142, 133 wpm | The same performer and pack as his scenes (pov-and-framing §5.1), told closer and softer: the vo-close chain (more proximity, the presence lift taken out, a softer top, gentler levelling), no room, each line paced 8-20% slower than his own on-camera read of the same words (the bible's 110-125 vs 125-135 wpm, as a ratio; §3), and delivered 2 LU under dialogue. Takes were scored for an understated read (narrow range, level or gently falling finals, nothing steeper than -5 st). |
| MARIO (CASTING.md ★) | 27 | 2 (4.9 s) | `am_liam` · a-liam-earnest  | earnest mid baritone, lecture mic with a rolled-off top, clause-structured, anxious contour | 114.8 Hz · 13.1 st · 150, 159 wpm | CASTING.md pick, dry. His lighthouse exchange is with ADELINA, ~10 st below her. |
| MADA (**new (pass 1)**) | 25, 27, 30 | 3 (3.3 s) | `am_adam` · b-adam-grey  | neutral, muted-grey mid baritone, flat dynamics, a canned courteous non-answer | 123.5 Hz · 7.5 st · – wpm | Flattest 'Good question.' of three (8-9 st vs 16-22 for the echo-based ones) and the only pack with no conflict: am_echo is TERB's, in the same scene. Placed +1.5 st so the calm-off is two men: ~1.5-2 st apart in pitch, with the timbre (MFCC 27) doing the rest. One master read, chosen as a pair with Mas's echo. |
| TTEMME (**new (pass 1)**) | 27 | 2 (3.4 s) | `am_fenrir` · d-fenrir-headset  | affable light mid voice through a headset mic (bass rolled off, forward presence), streamer patter | 136.8 Hz · 10.4 st · 183, 158 wpm | Round 2: every eric-based TTEMME sat 10-17 MFCC units from TASYA in the same boardroom; am_fenrir in a headset chain sits 36 away. +2 st (the house max) keeps him above MADA, but they remain the act's closest pair (§6); the headset texture is the separation. One-episode cameo, so sharing NOLE's pack is harmless (they never share a scene). |
| GERG MOCKBRAN (CASTING.md ★) | 29, 31 | 3 (4.1 s) | `am_puck` · a-puck-quick  | bright quick tenor-baritone, dry laptop-room close mic, sunny and literal, fastest in the cast | 141.4 Hz · 6.5 st · 170, 190, 247 wpm | CASTING.md pick, dry. Fastest human in the act; bright and dry against TASYA's warm and slow in sc 29. |
| TILED EMPLOYEE (**new (pass 1)**) | 27 | 1 (1.4 s) | `af_nova` · a-nova-plain  | plain clean mid female voice, earnest question | 146.4 Hz · 7.4 st · 211 wpm | Follows RIMA directly (sc 27): the largest distance from her with a clean ASR read (af_alloy was heard as 'Is this a cool?'). Placed -1.5 st: 6 st under RIMA, 3 st under NELEH (two lines earlier), and the take that finally lifts on 'coup?'. |
| TASYA (**new (pass 1)**) | 27, 29, 30 | 4 (8.8 s) | `am_eric` · b-eric-warm  | warm, soft-onset light baritone with a smile in the air band, measured and gently amused; no accent colour | 150.9 Hz · 13.0 st · 140, 132, 138 wpm | Pace sat in band on every line (130-140 wpm) and warm_smile reads soft; the most periodic, smoothest voice in the act. Pure eric keeps it off every other act-four pack except TTEMME's round 1 (which is why TTEMME moved). His read-aloud post uses a tail-carrier take: every plain read ended in creak on 'team'. |
| NELEH (**new (pass 1)**) | 25, 27, 29 | 7 (9.2 s) | `af_aoede` · c-aoede-precise  | cool, even mezzo, crisp consonants, precise and polite; questions barely lift | 174.6 Hz · 8.2 st · 167, 160, 190, 195 wpm | Most even of three (8 st), clean ASR on 'Footnote three.', and the largest timbre distance from RIMA; placed -2 st (house max) to open a 3 st lane under her. |
| ADELINA (**new (pass 1)**) | 27 | 1 (1.6 s) | `af_bella` · a-bella-warm  | warm, brisk mezzo, close and dry, kind finality | 199.4 Hz · 6.5 st · 163 wpm | A- pack (best available), the most controlled range (6-7 st, 'kind finality'), in pace band. Not shared with anyone in the act. |
| RIMA TAMURI (CASTING.md ★) | 27 | 2 (3.2 s) | `af_heart` · a-heart-composed  | composed alto-mezzo with broadcast polish, unhurried, soft landings | 206.5 Hz · 8.0 st · 147, 188 wpm | CASTING.md pick, dry. Kokoro's top-graded pack; NELEH is placed ~3 st under her for the sc 27 exchange. |

Silent by design (not recorded): **THE ORB** (sc 26A, 29): non-verbal by canon: its iris, the toast 'rewinding…' and the chime; it never reacts to the V.O.; **MADA** (sc 29): tile avalanche PHRASE 4: '(No line. The stat is the joke.)'; **THE QUIET VOTE** (sc 27/30): camera-off tile, no line; **BUKAJ** (sc 27): toast text only; his plate waits for his real debut; **MAS (portrait)** (sc 27): pass one gives him no portrait window and no V.O.: only posts, the security tile and his voice through their speaker (a4-27-00); **CARD** (sc 28): WHAT THEY DIDN'T KNOW: music sting, no VO. THE OTHER YRRAL left the act in draft 3.1 with the new-board wide.

**Processing (all dry).** Returning cast keep their CASTING.md chains with the room stripped. New chains (`tools/cast_a4.py`):
- **NELEH** `c-aoede-precise`: HPF 90 Hz; pitch -2 st; peak -1.5 dB @300 Hz Q1.0; peak +1.5 dB @4500 Hz Q0.9; comp 2.5:1 @-22 dB (6/100 ms)
- **MADA** `b-adam-grey`: HPF 110 Hz; pitch +1.5 st; low shelf -1.5 dB @180 Hz; peak -1.5 dB @3000 Hz Q0.9; high shelf -1.5 dB @7000 Hz; comp 3.0:1 @-24 dB (5/120 ms)
- **TERB** `b-echo-brisk`: HPF 80 Hz; pitch 0; peak +1.5 dB @150 Hz Q0.9; peak -1.5 dB @500 Hz Q1.0; peak +2 dB @2000 Hz Q0.9; comp 3.0:1 @-21 dB (3/70 ms)
- **TASYA** `b-eric-warm`: HPF 70 Hz; pitch -1.5 st; low shelf +2 dB @180 Hz; peak -1.5 dB @350 Hz Q1.0; high shelf +1.5 dB @6000 Hz; comp 2.0:1 @-24 dB (12/150 ms)
- **TTEMME** `d-fenrir-headset`: HPF 150 Hz; pitch +2 st; peak -2 dB @300 Hz Q1.0; peak +2.5 dB @2800 Hz Q0.9; high shelf -1 dB @9000 Hz; comp 3.5:1 @-20 dB (3/60 ms)
- **ADELINA** `a-bella-warm`: HPF 80 Hz; pitch -1 st; low shelf +1.5 dB @200 Hz; peak -1 dB @450 Hz Q1.0; peak +1 dB @2500 Hz Q0.9; high shelf -1 dB @8000 Hz; comp 2.5:1 @-22 dB (6/110 ms)
- **TILED EMPLOYEE** `a-nova-plain`: HPF 100 Hz; pitch -1.5 st; peak +1 dB @3000 Hz Q0.9; comp 2.0:1 @-22 dB (8/110 ms)
- **MAS (V.O.)** `vo-close` (this pass): HPF 60 Hz; pitch 0; low shelf +2.5 dB @150 Hz; peak -2 dB @320 Hz Q1.0; peak -1 dB @3200 Hz Q0.8; high shelf -2.5 dB @7500 Hz; comp 2.5:1 @-26 dB (15/160 ms); -18 LUFS
- **MAS through the board's laptop speaker** `laptop_speaker` (this pass): HPF 330 Hz; HPF 330 Hz; LPF 5400 Hz; LPF 5400 Hz; peak +4 dB @950 Hz Q1.1; peak +2 dB @2800 Hz Q1.4; tanh saturation drive 1.8 mix 0.25; comp 3.0:1 @-24 dB (4/80 ms); -22 LUFS

## 3. MAS (V.O.)

**Brief (performer first, for the human who replaces the scratch).** The same man as on camera, telling us, not the room: close to the mic, dry, a touch slower (110–125 wpm against his scenes' 125–135), and a little lower in level. It is a story he has told many times, told to one person. Lowercase on the page means understated in the voice: no emphasis word, no comic timing, no smile audible, no irony; finals level or gently falling, never a performed drop. Never whispered, never breathy (no breath or heartbeat sounds, X3), never ASMR. He denies feelings; he never sounds hurt. The picture does every joke. D8 ("gerg never waits to be asked.") is the one warm line, and even that stays plain.

**The chain against his on-camera voice** (measured on the delivered lines):

| | On camera (`a-michael-close`) | V.O. (`vo-close`) |
|---|---|---|
| Median F0 · mean range | 111.0 Hz · 9.0 st | 111.9 Hz · 8.4 st |
| Pace (lines of 3+ words) | 146, 146, 148, 128 wpm | 120, 114, 149, 142, 133 wpm |
| Brightness (spectral centroid) | 1546 Hz | 1355 Hz |
| Span vs his on-camera read of the same words | 1.00 | ×1.084, ×1.186, ×1.12, ×1.134, ×1.113 |
| Level | −16.0 LUFS | −18.0 LUFS |
| EQ / dynamics | low shelf +2 dB @160 · −2 dB @320 · **+1 dB @3.2 kHz** · high shelf −1.5 dB @8 k · 2:1 @ −24 | low shelf **+2.5** dB @150 · −2 dB @320 · **−1 dB @3.2 kHz** · high shelf **−2.5** dB @7.5 k · **2.5:1 @ −26, 15/160 ms** |
| Room | none (dry) | none (dry) |

**Takes.** Eight per line: three seeds and a speed step, a mid-story lead-in carrier ("Mm.", "So.", "Anyway.", "Well.", cut away at the quietest frame), and a tail carrier (", really.") that keeps the final from dropping. Scored like the one-word Mas lines (ASR, lane, final contour, creak) plus an **understated** term (0.12 × range), a steep-fall penalty below −5 st, and a pace term. Every term is in `qa/qa.json` and each row's `pick_reason`; alternates are in `takes/<id>/`, best first in `alt_takes`.

**How the pace is set.** The bible's numbers (V.O. 110–125 wpm against his scenes' 125–135) are a ratio: the V.O. is 8–20% slower. Words per minute can't carry that ratio across line shapes: "i put the phone down." is five monosyllables and reads ~150 wpm even at a drawl, while "the meeting ended early." reads 115 at a normal pace, and his own on-camera lines measure 128–148 wpm. So each V.O. line is paced against **his on-camera voice reading the same words** (`a-michael-close`, seed 1, its own pace band): the V.O. span must be ×1.08–1.20 of that read. The per-line band that implies is in `qa.pace_ref`, and the delivered ratio in `qa.span_vs_oncam`. The wpm column is kept for reference.

| Id | Sc · device | Line | Dur · fr · beats | Pace (wpm · × on-camera span) | F0 · range · final | Take | Slot (draft 3.1) | Fit |
|---|---|---|---|---|---|---|---|---|
| `a4-26a-vo1` | 26A · D2 | i don't keep score. | 2.09 s · 51 · 4 | 120 · ×1.084 | 117.6 Hz · 7.8 st · -1.7 st | t05/8 | [ECU] 2 bars + 1 beat; the line waits for bar 2: from bar 2's downbeat 5 beats remain, less the 1-beat clearance before the [2S] | fits (4 ≤ 4 beats) |
| `a4-26a-vo2` | 26A · D4 | the meeting ended early. | 2.19 s · 53 · 4 | 114 · ×1.186 | 108.7 Hz · 9.2 st · -5.1 st | t04/8 | [PF] 1½ bars: 6 beats, less 1 before the Orb's [P] and its toast | fits (4 ≤ 5 beats) |
| `a4-29-vo1` | 29 · D5 | i put the phone down. | 2.15 s · 52 · 4 | 149 · ×1.12 | 109.4 Hz · 8.2 st · -4.9 st | t05/8 | [2S] 1 bar, then MAS'S VERSION: 4 beats, less 1 before the matching frame | **4 beats vs 3: see §10** |
| `a4-29-vo2` | 29 · D3 | the badge was a joke. | 2.44 s · 59 · 4 | 142 · ×1.134 | 115.3 Hz · 8.1 st · -0.8 st | t02/8 | [2S] from beat 4 (the iris lands on beat 3) into [P] THE ORB: the Orb must already be on the lanyard, so it starts on beat 4 at the earliest and runs into the [P]; the [P] holds 1 beat after it, then 'mostly.' | editor places it |
| `a4-29-vo3` | 29 · D8 | gerg never waits to be asked. | 2.81 s · 68 · 5 | 133 · ×1.113 | 111.9 Hz · 8.6 st · -3.7 st | t05/8 | [2S] the back wall, out of the quiet beat: the door's first held step lands on 'asked'; TASYA comes at least 1 beat after the line ends | editor places it |
| ↳ fallback | 26A · D2 | i don't keep things. | 2.15 s · 52 · 4 | 119 · ×1.107 | 119.3 Hz · 6.2 st · -1.5 st | t04/8 | `fallback/a4-26a-vo1.wav`; swap it in only under ruling 2's fallback | – |

*Beats* = the audible span rounded up to whole beats (1 beat = 0.625 s = 15 frames). **The door's first held step:** "asked" starts 1.900 s (frame 46) into `a4-29-vo3` and ends at frame 66.

Total V.O.: 5 lines, 24 words, 11.7 s of files (the bible's budget for the pilot is ≤ 8 lines, ≤ 60 words, ≤ 30 s; Act Four carries 5 of the episode's 7).

## 4. "super." through their laptop speaker, and the "mostly." re-take

**`a4-27-00` (sc 27, the board's side).** No new read: `a4-26-01`'s delivered take (t06), unchanged in time (so its word track and length are the same), through `laptop_speaker`: a steep band-limit to 330 Hz – 5.4 kHz, the chassis resonance at 950 Hz, a small honk at 2.8 kHz, a little driver distortion and the laptop's own levelling. Delivered at **-22.0 LUFS** (6 LU under dialogue), true peak -4.56 dBTP. The recognizer still hears “Super.”. No room is added: the call's room tone and any codec colour are the mix's. The **clean copy** (`clean/a4-27-00.wav`, the untouched −16 LUFS take) is for a mix that builds its own speaker. `side: none` (the dialogue box types `super.` with no portrait window), `mouth: []`.

**`a4-29-03` "mostly." (re-take).** It now answers the Orb's look at the lanyard after a 1-beat hold, and the line before it is the V.O. "the badge was a joke.", which the Orb never hears. Ten takes: five read straight after the new account ("the badge was a joke." / "It was a joke.", said aloud in his on-camera voice and cut away, so the word comes out as its qualifier), two direct, three after a small lead-in. Picked for a level-to-gently-falling final, in his lane, a shade under the V.O. before it. Delivered **t04**: 0.94 s, 106.9 Hz, range 8.3 st, final -2.2 st, -1.3 st against the V.O. ASR “Mostly.”. lowest score 0.846 of 10 takes (next t02 at 0.883); terms: asr_conf 0.846. The draft-2 take (final +0.9 st, level) is archived at `retired/a4-29-03_d2.wav` with its alternates.

## 5. New voices of pass 1: briefs and auditions

Unchanged since pass 1 (no casting changes in draft 3.1). Written performer-first, like CASTING.md §1, from each character file's persona and comic function. Three stock candidates each (TTEMME got two more in round 2), read DRY on the role's real Act Four lines. Audition files: [`../../../../../audio/ep01/act4/dialogue/auditions/<role>/`](../../../../../audio/ep01/act4/dialogue/auditions/) (reel pings = candidate index). Numbers from `auditions/auditions.json` (round-1 tracker; the delivered lanes in §2 are re-measured).

### NELEH
- **Comic function:** Cassandra with citations: the one board member who read the charter literally. Principled, never a villain.
- **Pitch:** a cool mezzo, median ~165-200 Hz, even (7-11 st per line), kept ~3 st under RIMA (~220 Hz on her Act Four lines) so the two never blur in the sc 27 exchange. **Pace:** 150-165 wpm, precise and efficient; a clean full stop before the footnote.
- **Texture:** clean and articulate, crisp consonants (a footnote band at 4.5 kHz), dry. **Attitude:** polite, exact, patient; she is asking the correct question in the wrong room.
- **Cadence:** even statements that land on the last noun; questions lift only a little (she already knows the answer). **Avoid:** any accent or national-origin colour; villainy, sneer or scolding; breathiness.

| Cand. | Pack (grade) | Median F0 | Range | Pace | Worst CER · conf. | |
|---|---|---|---|---|---|---|
|  a-kore-precise | `af_kore` (C+) | 191.5 Hz | 12.1 st | 212, 154, 194 | 0.0 · -0.528 | |
|  b-sarah-precise | `af_sarah` (C+) | 189.1 Hz | 12.1 st | 212, 155, 186 | 0.0 · -0.532 | |
| ★ c-aoede-precise | `af_aoede` (C+) | 199.4 Hz | 8.3 st | 225, 160, 190 | 0.0 · -0.47 | |
*Placement after audition:* −1 → −2 st (house max), for a 3 st lane under RIMA.

**Pick:** Most even of three (8 st), clean ASR on 'Footnote three.', and the largest timbre distance from RIMA; placed -2 st (house max) to open a 3 st lane under her.

### MADA
- **Comic function:** the poker face: runs a Q&A empire and never gives an answer. 'Good question.' is all he says.
- **Pitch:** a neutral mid-baritone, median ~115-130 Hz (about 2 st above MAS's own 'good question.' so the calm-off reads as two men), narrow (<= 9 st). **Pace:** unhurried; the two words take ~0.8-1.0 s. Pauses stand in for sentences.
- **Texture:** muted grey: no chest warmth, presence pulled back, dynamics held flat (3:1). **Attitude:** courteous non-answer; not smug, not robotic, not sinister.
- **Cadence:** level through 'Good', a small settle on 'question'; identical every time (it is a canned answer). **Avoid:** a synthetic/robot sheen (he is human); a sneer; any imitation.

| Cand. | Pack (grade) | Median F0 | Range | Pace | Worst CER · conf. | |
|---|---|---|---|---|---|---|
|  a-echo-grey | `am_echo` (D) | 115.5 Hz | 16.2 st | – | 0.0 · -0.525 | |
| ★ b-adam-grey | `am_adam` (F+) | 113.2 Hz | 8.7 st | – | 0.0 · -0.393 | |
|  c-echo-eric-grey | `am_echo*0.60+am_eric*0.40` (D/D blend) | 119.3 Hz | 22.0 st | – | 0.0 · -0.438 | |
*Placement after audition:* 0 → +1.5 st, to sit above MAS in the calm-off; lane tightened to 112-126 Hz so the pair search favours his lower takes (away from TTEMME).

**Pick:** Flattest 'Good question.' of three (8-9 st vs 16-22 for the echo-based ones) and the only pack with no conflict: am_echo is TERB's, in the same scene. Placed +1.5 st so the calm-off is two men: ~1.5-2 st apart in pitch, with the timbre (MFCC 27) doing the rest. One master read, chosen as a pair with Mas's echo.

### TERB
- **Comic function:** the fire marshal of imploding boards: calm, capable, faintly bored by catastrophe.
- **Pitch:** a tall baritone, median ~95-115 Hz, moderate range (8-12 st). **Pace:** brisk, 165-185 wpm; procedural questions, no drama.
- **Texture:** crisp and clean: a little chest, a clean low-mid, a 2 kHz edge. **Attitude:** reassuring and practical; he has done this before.
- **Cadence:** short procedural questions with a quick lift; the realisation '...Ah.' falls flat and short. **Avoid:** heroics, barking, a drill-sergeant read; any imitation.

| Cand. | Pack (grade) | Median F0 | Range | Pace | Worst CER · conf. | |
|---|---|---|---|---|---|---|
|  a-fenrir-brisk | `am_fenrir` (C+) | 152.0 Hz | 6.2 st | 240 | 1.5 · -0.473 | |
| ★ b-echo-brisk | `am_echo` (D) | 113.6 Hz | 15.9 st | 183 | 0.5 · -0.704 | |
|  c-fenrir-onyx-brisk | `am_fenrir*0.60+am_onyx*0.40` (C+/D blend) | 131.6 Hz | 8.6 st | 199 | 1.0 · -0.6 | |

**Pick:** The only candidate in a tall-baritone lane (~100 Hz on 'Which room is on fire?'); am_fenrir came out at 150 Hz and turned 'Ah.' into 'Bye.'. Darkest timbre of the act's men after ALYI: MFCC distance 48 from MAS and 59 from MADA, his two calm-off neighbours.

### TASYA
- **Comic function:** the zen landlord: he never fights, he owns the building the fight is in. Serenity is leverage; only Mas is calmer.
- **Pitch:** a warm light baritone-tenor, median ~130-150 Hz (a clear lane above MAS and below GERG's bright 135 is impossible, so separation comes from pace and warmth: he is half GERG's speed), gentle range (7-11 st). **Pace:** 125-140 wpm, measured, business words said like mindfulness mantras.
- **Texture:** warm, soft-onset, smiling (a small air lift), no edge. **Attitude:** warm, gently amused, delighted; generous and three moves ahead.
- **Cadence:** parallel phrases with even spacing ('below them, above them, around them'), each landing softly. **Avoid:** ANY accent or accent colour (explicit guardrail); 'sipping tea'; smugness; any imitation of the real voice.

| Cand. | Pack (grade) | Median F0 | Range | Pace | Worst CER · conf. | |
|---|---|---|---|---|---|---|
|  a-fenrir-eric-warm | `am_fenrir*0.50+am_eric*0.50` (C+/D blend) | 150.3 Hz | 14.5 st | 138, 144, 148 | 0.0 · -0.434 | |
| ★ b-eric-warm | `am_eric` (D) | 144.0 Hz | 13.8 st | 125, 132, 138 | 0.0 · -0.453 | |
|  c-santa-fenrir-warm | `am_santa*0.40+am_fenrir*0.60` (D-/C+ blend) | 170.4 Hz | 14.6 st | 133, 148, 133 | 0.0 · -0.401 | |

**Pick:** Pace sat in band on every line (130-140 wpm) and warm_smile reads soft; the most periodic, smoothest voice in the act. Pure eric keeps it off every other act-four pack except TTEMME's round 1 (which is why TTEMME moved). His read-aloud post uses a tail-carrier take: every plain read ended in creak on 'team'.

### TTEMME
- **Comic function:** the 72-hour CEO: a livestream co-founder who ran the company for a weekend and talks to 'chat' the whole time.
- **Pitch:** a light mid register, median ~122-160 Hz, lively (10-16 st); away from TASYA by timbre (not the eric pack) and from MADA by +2 st and the headset. **Pace:** 155-175 wpm, casual streamer patter; the second 'Chat...' slows as he watches the sand.
- **Texture:** a headset mic: bass rolled off, forward presence, quick compression; dry. **Attitude:** affable, a little bemused, sincere (his exit 'deeply pleased' is played straight).
- **Cadence:** addresses chat first, then the news; a small honest question lift at the end. **Avoid:** gamer-bro caricature, shouting, sarcasm; any imitation.

| Cand. | Pack (grade) | Median F0 | Range | Pace | Worst CER · conf. | |
|---|---|---|---|---|---|---|
|  a-eric-headset | `am_eric` (D) | 143.9 Hz | 14.6 st | 173, 136 | 0.071 · -0.4 | |
|  b-santa-headset | `am_santa` (D-) | 140.5 Hz | 15.2 st | 155, 128 | 0.0 · -0.406 | |
|  c-echo-eric-headset | `am_echo*0.40+am_eric*0.60` (D/D blend) | 135.4 Hz | 16.6 st | 166, 128 | 0.0 · -0.37 | |
| ★ d-fenrir-headset | `am_fenrir` (C+) | 113.8 Hz | 16.6 st | 186, 155 | 0.0 · -0.369 | |
|  e-liam-headset | `am_liam` (D) | 116.2 Hz | 10.8 st | 164, 146 | 0.0 · -0.357 | |
*Placement after audition:* auditioned at 0 st (the 114 Hz above); delivered at +2 st (the house max).

**Pick:** Round 2: every eric-based TTEMME sat 10-17 MFCC units from TASYA in the same boardroom; am_fenrir in a headset chain sits 36 away. +2 st (the house max) keeps him above MADA, but they remain the act's closest pair (§6); the headset texture is the separation. One-episode cameo, so sharing NOLE's pack is harmless (they never share a scene).

### ADELINA
- **Comic function:** the adult in the other room: translates Mario's 40,000 words into three bullets and a revenue chart.
- **Pitch:** a warm mezzo, median ~175-215 Hz, moderate range. **Pace:** brisk but unhurried, 150-165 wpm; the colon in 'In plain English:' is a real beat (~0.35 s).
- **Texture:** warm, close and dry; a phone-call brightness is left to the mix. **Attitude:** brisk and warm; kind finality. No is a complete sentence.
- **Cadence:** set-up phrase level, beat, the verdict falls short and clean. **Avoid:** sibling or family framing (guardrail); coldness; sarcasm; any imitation.

| Cand. | Pack (grade) | Median F0 | Range | Pace | Worst CER · conf. | |
|---|---|---|---|---|---|---|
| ★ a-bella-warm | `af_bella` (A-) | 193.3 Hz | 6.7 st | 136, 157 | 0.0 · -0.358 | |
|  b-aoede-warm | `af_aoede` (C+) | 197.7 Hz | 8.9 st | 154, 165 | 0.0 · -0.254 | |
|  c-nova-warm | `af_nova` (C) | 178.8 Hz | 10.2 st | 112, 163 | 0.0 · -0.37 | |

**Pick:** A- pack (best available), the most controlled range (6-7 st, 'kind finality'), in pace band. Not shared with anyone in the act.

### TILED EMPLOYEE
- **Comic function:** one hand up in the all-hands crowd; asks the question everyone is thinking.
- **Pitch:** a plain lower-mid female voice, ~135-175 Hz: 3+ st under NELEH (two lines earlier) and 5+ st under RIMA (the line before), well above ALYI's answer. **Pace:** natural, ~150-170 wpm.
- **Texture:** plain and clean; the crowd/room is a mix send. **Attitude:** earnest, direct, a little unsure; not comic-nervous.
- **Cadence:** a real question lift on 'coup'. **Avoid:** mockery of staff; any accent.

| Cand. | Pack (grade) | Median F0 | Range | Pace | Worst CER · conf. | |
|---|---|---|---|---|---|---|
| ★ a-nova-plain | `af_nova` (C) | 174.5 Hz | 10.6 st | 182, 226 | 0.0 · -0.42 | |
|  b-alloy-plain | `af_alloy` (C) | 159.2 Hz | 14.3 st | 166, 200 | 0.182 · -0.47 | |
|  c-river-plain | `af_river` (D) | 185.4 Hz | 7.2 st | 196, 245 | 0.0 · -0.347 | |
*Placement after audition:* 0 → −1.5 st, to clear NELEH by 3 st.

**Pick:** Follows RIMA directly (sc 27): the largest distance from her with a clean ASR read (af_alloy was heard as 'Is this a cool?'). Placed -1.5 st: 6 st under RIMA, 3 st under NELEH (two lines earlier), and the take that finally lifts on 'coup?'.

## 6. Distinctness where voices share a scene

Measured on the delivered lines. ΔF0 in semitones; ΔMFCC = distance between mean MFCC 1-12 vectors (different stock packs land at ~20-70, variants of one pack at ~10-17); Δcentroid = brightness difference. MAS / MAS (V.O.) is the same performer by design: that pair should read as one man at two distances, so a small ΔMFCC there is the goal, not a flag.

| Pair | Scenes | ΔF0 | ΔMFCC | Δcentroid | Read |
|---|---|---|---|---|---|
| ADELINA / ALYI | 27 | 14.9 st | 51.9 | 97% | clear |
| ADELINA / MADA | 27 | 8.3 st | 25.7 | 17% | clear |
| ADELINA / MARIO | 27 | 9.6 st | 29.0 | 18% | clear |
| ADELINA / NELEH | 27 | 2.3 st | 34.4 | 42% | clear |
| ADELINA / RIMA TAMURI | 27 | 0.6 st | 19.1 | 11% | **closest: listen** |
| ADELINA / TASYA | 27 | 4.8 st | 26.0 | 1% | clear |
| ADELINA / TILED EMPLOYEE | 27 | 5.3 st | 34.6 | 88% | clear |
| ADELINA / TTEMME | 27 | 6.5 st | 30.1 | 33% | clear |
| ALYI / MADA | 27, 30 | 6.7 st | 66.1 | 58% | clear |
| ALYI / MARIO | 27 | 5.4 st | 46.9 | 59% | clear |
| ALYI / MAS MANALT | 30 | 4.8 st | 60.9 | 62% | clear |
| ALYI / NELEH | 27 | 12.6 st | 30.4 | 28% | clear |
| ALYI / RIMA TAMURI | 27 | 15.6 st | 54.8 | 55% | clear |
| ALYI / TASYA | 27, 30 | 10.1 st | 43.5 | 50% | clear |
| ALYI / TERB | 30 | 3.5 st | 34.1 | 25% | clear |
| ALYI / TILED EMPLOYEE | 27 | 9.6 st | 32.0 | 4% | clear |
| ALYI / TTEMME | 27 | 8.4 st | 67.0 | 66% | clear |
| GERG MOCKBRAN / MAS MANALT | 29, 31 | 4.2 st | 18.2 | 3% | clear |
| GERG MOCKBRAN / MAS MANALT (V.O.) | 29 | 4.1 st | 19.4 | 11% | clear |
| GERG MOCKBRAN / NELEH | 29 | 3.7 st | 38.1 | 82% | clear |
| GERG MOCKBRAN / TASYA | 29 | 1.1 st | 22.5 | 27% | ok (timbre) |
| MADA / MARIO | 27 | 1.3 st | 27.8 | 2% | ok (timbre) |
| MADA / MAS MANALT | 30 | 1.8 st | 27.6 | 9% | ok (timbre) |
| MADA / NELEH | 25, 27 | 6.0 st | 52.1 | 70% | clear |
| MADA / RIMA TAMURI | 27 | 8.9 st | 21.0 | 6% | clear |
| MADA / TASYA | 27, 30 | 3.5 st | 39.1 | 19% | clear |
| MADA / TERB | 30 | 3.1 st | 59.3 | 78% | clear |
| MADA / TILED EMPLOYEE | 27 | 2.9 st | 53.6 | 126% | clear |
| MADA / TTEMME | 27 | 1.8 st | 16.4 | 20% | **closest: listen** |
| MARIO / NELEH | 27 | 7.3 st | 43.0 | 74% | clear |
| MARIO / RIMA TAMURI | 27 | 10.2 st | 28.7 | 9% | clear |
| MARIO / TASYA | 27 | 4.7 st | 30.4 | 21% | clear |
| MARIO / TILED EMPLOYEE | 27 | 4.2 st | 42.4 | 131% | clear |
| MARIO / TTEMME | 27 | 3.0 st | 31.3 | 18% | clear |
| MAS MANALT / MAS MANALT (V.O.) | 29 | 0.1 st | 16.5 | 14% | same man, two distances (by design) |
| MAS MANALT / NELEH | 29 | 7.8 st | 48.6 | 88% | clear |
| MAS MANALT / TASYA | 29, 30 | 5.3 st | 33.2 | 31% | clear |
| MAS MANALT / TERB | 30 | 1.3 st | 47.9 | 96% | clear |
| MAS MANALT (V.O.) / NELEH | 29 | 7.7 st | 38.7 | 65% | clear |
| MAS MANALT (V.O.) / TASYA | 29 | 5.2 st | 30.6 | 15% | clear |
| NELEH / RIMA TAMURI | 27 | 2.9 st | 37.7 | 38% | clear |
| NELEH / TASYA | 27, 29 | 2.5 st | 39.1 | 30% | clear |
| NELEH / TILED EMPLOYEE | 27 | 3.0 st | 20.2 | 33% | clear |
| NELEH / TTEMME | 27 | 4.2 st | 53.7 | 53% | clear |
| RIMA TAMURI / TASYA | 27 | 5.4 st | 33.4 | 12% | clear |
| RIMA TAMURI / TILED EMPLOYEE | 27 | 6.0 st | 44.3 | 112% | clear |
| RIMA TAMURI / TTEMME | 27 | 7.1 st | 22.7 | 25% | clear |
| TASYA / TERB | 30 | 6.6 st | 42.8 | 50% | clear |
| TASYA / TILED EMPLOYEE | 27 | 0.5 st | 34.9 | 90% | clear |
| TASYA / TTEMME | 27 | 1.7 st | 35.5 | 33% | clear |
| TILED EMPLOYEE / TTEMME | 27 | 1.2 st | 55.3 | 65% | clear |

## 7. Line list (draft 3.1 order)

Durations are the delivered WAV (incl. 30 ms head + 80 ms tail pad); frames at 24 fps (1 beat = 15 frames). **Kind:** D dialogue · VO · ◻ post pop-up (unvoiced; hold = on-screen beats). **Side** = the portrait window the line plays from (`ui.ts` dialogueBox `tail`): L Mas's window · R the other character's · – none. **Lip:** ✓ = mouth cues to animate. **Take** = delivered / recorded.

| ID | Sc | Kind | Side | Lip | Speaker | Line | Shot (draft 3.1) | Dur (s) · fr | Take | Status | Tag |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `a4-25-01` | 25 | D | – | cues | NELEH | Step four. | [GFX] THE PLAN: the blueprint figures at the blank line | 0.83 · 20 | t03/3 |  | [INVENTED] |
| `a4-25-02` | 25 | D | – | cues | MADA | Good question. | [GFX] THE PLAN: the blueprint figures at the blank line | 1.09 · 27 | t08/8 |  | [INVENTED] catchphrase |
| `a4-26-01` | 26 | D | L | ✓ | MAS MANALT | super. | [P] MAS, left (phrase 4, after his thumb taps the middle super at once) | 0.89 · 22 | t06/11 | restaged | [INVENTED] usage of a real public tic |
| `a4-26a-vo1` | 26A | VO | – |  | MAS MANALT (V.O.) | i don't keep score. | [ECU] the desk and the tally, bar 2 (the brush; his thumb comes to rest on mark 3) | 2.09 · 51 | t05/8 | **new** | [INVENTED · VO · D2 · the Orb catches it; the tag's drawer pays it off] |
| `a4-26a-01` | 26A | ◻ 11 b | – |  | MAS MANALT | "if i start going off, the nopeai board should go after me for the full value of my shares" | [POV] his phone, full-bleed (2 bars) | 8.40 · 202 | t01/1 |  | [V · NOV 17, 2023 · decoded 9:32 PM, zone to confirm] |
| `a4-26a-vo2` | 26A | VO | – |  | MAS MANALT (V.O.) | the meeting ended early. | [PF] MAS, left (1½ bars; V.O. band y 182-203 on hoodie shadow) | 2.19 · 53 | t04/8 | **new** | [INVENTED · VO · D4 · the exit's first shot catches it] |
| `a4-27-00` | 27 | D | – |  | MAS MANALT | super. | [SCR] the board's call grid, bezel in frame (after HOLD 1 BEAT: NELEH turns a page) | 0.89 · 22 | = a4-26-01 | **derived** | [INVENTED] usage of a real public tic (a4-26-01 heard from the board's side) |
| `a4-27-01` | 27 | ◻ 3 b | – |  | GERG MOCKBRAN | "…I quit." | [SCR] the board's call grid (after the 'has left' toast) | 0.63 · 16 | t01/2 |  | [V · NOV 17, 2023 · fragment of a longer message; re-fetch the casing] |
| `a4-27-02` | 27 | D | R | ✓ | RIMA TAMURI | I'll hold it together. | [P] RIMA TAMURI, right, under the spotlight | 1.82 · 44 | t01/4 |  | [INVENTED] |
| `a4-27-03` | 27 | D | R | ✓ | NELEH | For how long? | [P] NELEH, right | 1.20 · 29 | t01/4 |  | [INVENTED] |
| `a4-27-04` | 27 | D | R | ✓ | RIMA TAMURI | We'll share more soon. | [P] RIMA, right (then [P] NELEH listening, 1 beat) | 1.37 · 33 | t03/3 |  | [INVENTED] catchphrase |
| `a4-27-05` | 27 | D | – | cues | TILED EMPLOYEE | Is this a coup? | [W] the all-hands, a tighter plate of the bullpen (no portrait) | 1.37 · 33 | t05/5 | restaged | [INVENTED] cartoon line (unquoted paraphrase of the all-hands question) |
| `a4-27-06` | 27 | D | R | ✓ | ALYI | "You can call it this way" | [P] ALYI, right, the door frame cutting his window in half | 3.12 · 75 | t01/1 |  | [V · NOV 17, 2023] |
| `a4-27-07` | 27 | ◻ 8 b | – |  | MAS MANALT | "…sorta like reading your own eulogy while you're still alive" | [SCR] the board's grid under the hearts (a notification) | 5.14 · 124 | t01/1 |  | [V · NOV 18, 2023] |
| `a4-27-08` | 27 | D | R | ✓ | NELEH | The bylaws allow it. Footnote three. | [P] volley, right-hand window: NELEH | 2.35 · 57 | t01/3 |  | [INVENTED] ('Footnote three.' is her catchphrase) |
| `a4-27-09` | 27 | D | R | ✓ | ALYI | Step four… will reveal itself. | [P] volley, right-hand window: ALYI (reflection) | 3.27 · 79 | t01/1 |  | [INVENTED] |
| `a4-27-10` | 27 | D | R | ✓ | NELEH | When? | [P] volley, right-hand window: NELEH | 0.61 · 15 | t04/5 |  | [INVENTED] |
| `a4-27-11` | 27 | D | R | ✓ | ALYI | The company will tell us. | [P] volley, right-hand window: ALYI (reflection) (then [P] NELEH listening, 1 beat) | 3.19 · 77 | t01/1 |  | [INVENTED] |
| `a4-27-12` | 27 | D | R | ✓ | NELEH | The company is calling us. | [2S] NELEH and MADA, the phones buzzing harder (Neleh's medium rig) | 1.68 · 41 | t01/1 | restaged | [INVENTED] |
| `a4-27-13` | 27 | D | R | ✓ | ALYI | That is the company telling us. | [P] ALYI, right (reflection) | 3.70 · 89 | t01/1 |  | [INVENTED] |
| `a4-27-14` | 27 | D | R | ✓ | MARIO | I've written up some thoughts. | [P] MARIO, right, the lamp turning in the window behind him | 2.16 · 52 | t03/3 | restaged | [INVENTED] |
| `a4-27-15` | 27 | D | R | ✓ | ADELINA | In plain English: no. | [P2] MARIO and ADELINA, she on the right | 1.57 · 38 | t01/4 |  | [INVENTED] catchphrase |
| `a4-27-16` | 27 | D | R | ✓ | MARIO | Hi. Yes. We're very worried. How much? | [P] MARIO, right, the rent meters spinning through the lighthouse window behind him | 2.77 · 67 | t01/4 |  | [INVENTED] |
| `a4-27-17` | 27 | ◻ 6 b | – |  | MAS MANALT | "first and last time i ever wear one of these" | [SCR] the lobby security-camera tile (upside-down in its corner) | 4.37 · 105 | t01/2 |  | [V · NOV 19, 2023] |
| `a4-27-18` | 27 | D | R | ✓ | TTEMME | Chat. I'm the CEO now. | [P] TTEMME, right (chat overlay) | 1.74 · 42 | t05/5 |  | [INVENTED] |
| `a4-27-19` | 27 | D | R | ✓ | TTEMME | Chat… for how long? | [P] TTEMME, right (after the hourglass-flip insert) | 1.61 · 39 | t02/4 |  | [INVENTED] |
| `a4-27-20` | 27 | D | R | ✓ | TASYA | "a new advanced AI research team" | [P] TASYA, right, in the new slate-blue doorway | 2.80 · 68 | t09/10 |  | [V · NOV 19-20, 2023] |
| `a4-27-21` | 27 | D | R | ✓ | NELEH | Step four? | [2S] NELEH and MADA over the blueprint (step 4 blank but for her '?') | 0.85 · 21 | t04/4 | restaged | [INVENTED] |
| `a4-27-22` | 27 | D | R | ✓ | MADA | Good question. | [2S] NELEH and MADA over the blueprint | 1.09 · 27 | t08/8 |  | [INVENTED] catchphrase |
| `a4-29-vo1` | 29 | VO | – |  | MAS MANALT (V.O.) | i put the phone down. | [2S] Mas, the Orb, the lanyard laid square, his hand on his phone (1 bar) → MAS'S VERSION | 2.15 · 52 | t05/8 | **new** | [INVENTED · VO · D5] |
| `a4-29-01` | 29 | ◻ 8 b | – |  | RIMA TAMURI | "NopeAI is nothing without its people" | [ECU] the matching frame: the phone face-up on the desk, the post legible on its screen for 2 bars | 3.03 · 73 | t01/1 |  | [V · NOV 20, 2023, ~2:06 AM PT] |
| `a4-29-vo2` | 29 | VO | – |  | MAS MANALT (V.O.) | the badge was a joke. | [2S] the Orb's iris on the GUEST lanyard (from the bar's 3rd beat) → [P] THE ORB, HOLD 1 BEAT | 2.44 · 59 | t02/8 | **new** | [INVENTED · VO · D3 · the Orb is already on the lanyard; it never hears the line] |
| `a4-29-03` | 29 | D | L | ✓ | MAS MANALT | mostly. | [2S] Mas, aloud, to the Orb (Mas's medium rig); HOLD 1 BEAT after | 0.94 · 23 | t04/10 | **re-take** | [INVENTED] |
| `a4-29-04` | 29 | D | – | ✓ | GERG MOCKBRAN | One sec. Compiling. | [POV] Gerg's video tile on the monitor, big enough to act in | 1.21 · 30 | t02/2 |  | [INVENTED] catchphrase |
| `a4-29-05` | 29 | D | L | ✓ | MAS MANALT | what are you building? | [P] MAS, left | 1.97 · 48 | t01/3 |  | [INVENTED] |
| `a4-29-06` | 29 | D | – | ✓ | GERG MOCKBRAN | The company. Again. Just in case. | [POV] Gerg's tile | 1.98 · 48 | t05/6 |  | [INVENTED] |
| `a4-29-vo3` | 29 | VO | – |  | MAS MANALT (V.O.) | gerg never waits to be asked. | [2S] the dark room's back wall, out of the quiet beat; the door's first held step on 'asked' | 2.81 · 68 | t05/8 | **new** | [INVENTED · VO · D8 · plants 'to be asked' for Ep12] |
| `a4-29-07` | 29 | D | – |  | TASYA | Everyone is welcome. | [2S] the back wall and the slate-blue door (O.S., behind it) | 1.50 · 36 | t01/1 | restaged | [INVENTED] (short form of his 'Everyone is welcome. Rent is due on the first.') |
| `a4-29-08` | 29 | D | L | ✓ | MAS MANALT | leave it open. | [P] MAS, left, at once on 'Everyone is welcome.' | 1.52 · 37 | t03/4 | restaged | [INVENTED] |
| `a4-29-09` | 29 | D | – | ✓ | NELEH | Has anyone read the char— | [POV] the tile avalanche, phrase 2: NELEH's tile as it goes | 1.66 · 40 | t03/3 |  | [INVENTED] |
| `a4-30-01` | 30 | D | R | ✓ | ALYI | "I deeply regret my participation in the board's actions." | [P2] MAS left at his end desk; ALYI right, the door frame cutting his window | 5.17 · 125 | t01/1 | restaged | [V · NOV 20, 2023] |
| `a4-30-02` | 30 | D | R | ✓ | TASYA | "We are below them, above them, around them." | [W] the bullpen with [P] TASYA's window open over it, right | 3.66 · 88 | t01/1 |  | [V/K · NOV 20, 2023 · re-verify before lock] |
| `a4-30-03` | 30 | D | L | ✓ | MAS MANALT | hi. | [PF] MAS, left, the 'looking down' swap | 0.71 · 18 | t01/6 | restaged | [INVENTED] |
| `a4-30-04` | 30 | D | – |  | TASYA | Hello. | [PF] MAS, left (TASYA O.S., from the floor) | 0.89 · 22 | t03/3 |  | [INVENTED] |
| `a4-30-05` | 30 | D | R | ✓ | TERB | Which room is on fire? | [P] TERB, right (after the [W] entrance and his card) | 1.71 · 42 | t02/3 |  | [INVENTED] |
| `a4-30-06` | 30 | D | R | ✓ | TERB | …Ah. | [P] TERB, right; behind his window everyone looks around | 0.63 · 16 | t02/4 | restaged | [INVENTED] |
| `a4-30-07` | 30 | D | – |  | TERB | Terms? | [2S] the calm-off (TERB O.S.) | 0.90 · 22 | t06/6 |  | [INVENTED] |
| `a4-30-08` | 30 | D | R | ✓ | MADA | Good question. | [P] MADA, right, after HOLD 1 BEAT | 1.09 · 27 | t08/8 |  | [INVENTED] catchphrase |
| `a4-30-09` | 30 | D | L | ✓ | MAS MANALT | good question. | [P] MAS, left, after HOLD 1 BEAT; then [2S] HOLD 1 BAR | 1.34 · 33 | t07/10 |  | [INVENTED] |
| `a4-30-10` | 30 | ◻ 7 b | – |  | GERG MOCKBRAN | "Returning to NopeAI & getting back to coding tonight." | [POV] his phone, lit green (then [PF] MAS reading it, 1 beat) | 3.00 · 72 | t01/1 |  | [V · NOV 21, 2023 · re-fetch the casing; '&' read as 'and'] |
| `a4-30-11` | 30 | ◻ 10 b | – |  | TTEMME | "I am deeply pleased by this result, after ~72 very intense hours of work." | [ECU] prop insert: the last grain runs out of the hourglass | 5.60 · 135 | t01/1 |  | [V · NOV 21, 2023; '~' read as 'about'] |
| `a4-30-12` | 30 | D | – |  | MAS MANALT | okay. | [ECU] his hand sets the glass down and nudges it (2 beats), after the silent [CU] | 0.89 · 22 | t04/7 | restaged | [INVENTED] |
| `a4-31-01` | 31 | D | R | ✓ | GERG MOCKBRAN | What's in there? | [P2] MAS left; GERG right, laptop open (gerg-speak portrait) | 0.90 · 22 | t01/2 |  | [INVENTED] |
| `a4-31-02` | 31 | D | L | ✓ | MAS MANALT | it's a preview. | [P2] MAS left (not looking); the vault hums on the line | 1.42 · 35 | t01/4 |  | [INVENTED] (echo of the 'research preview' launch) |
| `a4-31-03` | 31 | D | L | ✓ | MAS MANALT | "i love and respect alyi… i harbor zero ill will towards him." | [P] MAS, left, at his desk (voiced on camera, never V.O.) | 5.89 · 142 | t04/4 |  | [V · NOV 29, 2023] |

*cues* = the speaker is drawn (a blueprint figure in THE PLAN, the employee in the all-hands crowd) but no mouth is animated by default; the cues are kept as an option.

Voiced total **89.6 s**: dialogue 78.0 s (10 Mas rows incl. the laptop copy), V.O. 11.7 s. The act's picture clock is 7:12.8 (pov-changes §0).

**Retired or superseded** (not in `lines.json`; nothing here goes in the cut):

| Id | Words | Was | Why | Files |
|---|---|---|---|---|
| `a4-29-02` | the hearts were sincere. | draft 2, on-mic (to the Orb) | cut in draft 3.1: pov-and-framing §5.7 'never write' (claims a feeling about the employees' real act, and paired it with the check). Replaced by the V.O. a4-29-vo2 'the badge was a joke.' before the letter; the check now lands as pure record. | `retired/a4-29-02.wav`, `retired/a4-29-02.mp3` |
| `a4-29-03 (draft-2 take)` | mostly. | draft 2 t01/7, read after 'the hearts were sincere.' | re-taken for draft 3.1's context (after the Orb's look at the lanyard); the old delivered take and its 7 alternates are archived | `retired/a4-29-03_d2.wav`, `retired/takes/a4-29-03_d2/` |
| `a4-26-vo1` | the meeting ended early. | draft 3, sc 26 V.O. over the [CU] (editor scratch only) | removed from sc 26 in draft 3.1 (no V.O. inside the drop-out or in the candor card's scene); the words move to 26A as a4-26a-vo2. Never recorded by this stage. | – |
| `draft-3 V.O. texts` | i'm not a sentimental person. · the weekend was mostly logistics. · i kept quiet. · the hearts were sincere. | draft 3 wording under the ids a4-26a-vo1, a4-26a-vo2, a4-29-vo1, a4-29-vo2 (editor scratch in out/ep01/act4/animatic/scratch-vo/) | all four are in the §5.7 'never write' list or were rewritten at the table read; the same ids now carry draft 3.1's words, recorded here. The editor's scratch overlay must be dropped (it overrides lines.json by id). | – |

## 8. Key comedic lines: takes and picks

Takes vary what a director would vary: speed (±5-10%), a **context carrier** (the line read after a lead-in in the same breath, then cut at the quietest frame before it; e.g. 'mostly.' read straight after 'the badge was a joke.'), a tail carrier, and the vocoder seed. Each take is scored (lower is better) on ASR accuracy + confidence, the duration window, F0 range, the final contour the delivery asks for (for Mas 'level or gently falling', so over-steep falls also cost), the character's lane, creak, and line-specific terms. Every term is logged per take in `qa/qa.json` and in each row's `pick_reason`.

| Line | Takes | Delivered | Why (measured) |
|---|---|---|---|
| `a4-26-01` MAS MANALT: super. | 11 | t06 · 0.89 s · 100.3 Hz · range 7.7 st · final 1.4 st | lowest score 3.677 of 11 takes (next t10 at 4.01); terms: asr_conf 0.968, final_fall 1.52, lane 1.189. ASR: “Super.” |
| `a4-26a-vo1` **(3.1)** MAS MANALT (V.O.): i don't keep score. | 8 | t05 · 2.09 s · 117.6 Hz · range 7.8 st · final -1.7 st | lowest score 1.155 of 8 takes (next t08 at 1.504); terms: asr_conf 0.219, understated 0.936. ASR: “I don't keep score.” |
| `a4-26a-vo2` **(3.1)** MAS MANALT (V.O.): the meeting ended early. | 8 | t04 · 2.19 s · 108.7 Hz · range 9.2 st · final -5.1 st | lowest score 2.038 of 8 takes (next t08 at 2.365); terms: asr_conf 0.184, range 0.72, understated 1.104, fall_too_steep 0.03. ASR: “The meeting ended early.” |
| `a4-27-04` RIMA TAMURI: We'll share more soon. | 3 | t03 · 1.37 s · 205.3 Hz · range 6.9 st · final -2.6 st | lowest score 0.063 of 3 takes (next t01 at 0.207); terms: asr_conf 0.063. ASR: “We'll share more soon.” |
| `a4-27-15` ADELINA: In plain English: no. | 4 | t01 · 1.57 s · 199.4 Hz · range 6.5 st · final -1.3 st | lowest score 0.178 of 4 takes (next t02 at 0.258); terms: asr_conf 0.178. ASR: “in plain English. No.” |
| `a4-27-16` MARIO: Hi. Yes. We're very worried. How much? | 4 | t01 · 2.77 s · 116.5 Hz · range 14.2 st · final -2.7 st | lowest score 0.345 of 4 takes (next t04 at 0.378); terms: asr_conf 0.345. ASR: “Hi, yes, we're very worried how much.” |
| `a4-27-19` TTEMME: Chat… for how long? | 4 | t02 · 1.61 s · 121.1 Hz · range 12.3 st · final 1.2 st | lowest score 0.489 of 4 takes (next t01 at 1.526); terms: asr_conf 0.297, lane 0.192. ASR: “Chat? For how long?” |
| `a4-29-vo1` **(3.1)** MAS MANALT (V.O.): i put the phone down. | 8 | t05 · 2.15 s · 109.4 Hz · range 8.2 st · final -4.9 st | lowest score 1.214 of 8 takes (next t08 at 1.267); terms: asr_conf 0.11, range 0.12, understated 0.984. ASR: “I put the phone down.” |
| `a4-29-vo2` **(3.1)** MAS MANALT (V.O.): the badge was a joke. | 8 | t02 · 2.44 s · 115.3 Hz · range 8.1 st · final -0.8 st | lowest score 1.386 of 8 takes (next t03 at 1.507); terms: asr_conf 0.354, range 0.06, understated 0.972. ASR: “The badge was a joke.” |
| `a4-29-03` **(3.1)** MAS MANALT: mostly. | 10 | t04 · 0.94 s · 106.9 Hz · range 8.3 st · final -2.2 st | lowest score 0.846 of 10 takes (next t02 at 0.883); terms: asr_conf 0.846. ASR: “Mostly.” |
| `a4-29-vo3` **(3.1)** MAS MANALT (V.O.): gerg never waits to be asked. | 8 | t05 · 2.81 s · 111.9 Hz · range 8.6 st · final -3.7 st | lowest score 1.675 of 8 takes (next t06 at 1.824); terms: asr_conf 0.283, range 0.36, understated 1.032. ASR: “Gerg never waits to be asked.” |
| `a4-29-08` MAS MANALT: leave it open. | 4 | t03 · 1.52 s · 111.3 Hz · range 10.8 st · final -2.1 st | lowest score 0.929 of 4 takes (next t01 at 1.254); terms: asr_conf 0.449, range 0.48. ASR: “Leave it open.” |
| `a4-30-03` MAS MANALT: hi. | 6 | t01 · 0.71 s · 122.2 Hz · range 8.0 st · final 0.3 st | lowest score 1.514 of 6 takes (next t04 at 2.295); terms: asr_conf 0.874, final_fall 0.64. ASR: “Hi!” |
| `a4-30-04` TASYA: Hello. | 3 | t03 · 0.89 s · 149.0 Hz · range 11.4 st · final -1.3 st | lowest score 0.588 of 3 takes (next t01 at 0.856); terms: asr_conf 0.588. ASR: “Hello.” |
| `a4-30-06` TERB: …Ah. | 4 | t02 · 0.63 s · 89.9 Hz · range 11.5 st · final 0.0 st | lowest score 1.144 of 4 takes (next t01 at 8.835); terms: asr_conf 0.744, final_fall 0.4. ASR: “Ah.” |
| `a4-30-08` MADA: Good question. | 8 | t08 · 1.09 s · 123.5 Hz · range 7.5 st · final -5.2 st | lowest score 2.112 of 8 takes (next t04 at 2.482); terms: asr_conf 0.237, flatness 1.875. One master read reused for all three MADA lines (sc 25, 27, 30): a canned answer should be identical. ASR: “Good question.” |
| `a4-30-09` MAS MANALT: good question. | 10 | t07 · 1.34 s · 113.9 Hz · range 10.7 st · final -2.1 st | lowest score 0.956 of 10 takes (next t04 at 1.31); terms: asr_conf 0.536, range 0.42, pair_contour_match 0.592. Picked **as a pair** with MADA's master take t08 (contour r = 0.852). ASR: “Good question.” |
| `a4-30-12` MAS MANALT: okay. | 7 | t04 · 0.89 s · 106.3 Hz · range 7.6 st · final -2.4 st | lowest score 0.561 of 7 takes (next t03 at 0.853); terms: asr_conf 0.561. ASR: “Okay” |
| `a4-31-02` MAS MANALT: it's a preview. | 4 | t01 · 1.42 s · 117.6 Hz · range 9.6 st · final -1.0 st | lowest score 0.174 of 4 takes (next t02 at 0.618); terms: asr_conf 0.174. ASR: “It's a preview.” |

Alternates are kept in `takes/<id>/` and listed best-first in each row's `alt_takes` (the fallback's in `fallback.alt_takes`), so the ear pass can swap one in without re-recording.

## 9. Mouth cues and `lines.json`

**Which rows have a mouth track (draft 3.1).** `lip_sync: true` only where the speaker's mouth is drawn in the shot: a portrait window (`[P]`, `[P2]`, `[PF]`), a medium rig in a `[2S]` ("mostly.", the boardroom lines), a reflection in a portrait, or a video tile big enough to act in (Gerg on the monitor, NELEH's avalanche tile). The five V.O. lines, the laptop-speaker "super.", the O.S. lines and "okay." (now off his face, over the hands) have `mouth: []`. The two THE PLAN lines and the all-hands employee keep their cues with `lip_sync: false`: the figures are drawn, but a blueprint figure and a tiled crowd drawing have no mouth by default. The re-taken "mostly." has new cues from its new take; every other row keeps its pass-1 cues.

`mouth: [{t, f, shape}]` per line on the portrait set used by `studio/src/shared/pixel/cast/talk.ts` (**A** open · **E** wide/teeth · **O** round · **M** closed · **rest** · **smile**); `t` is seconds from the start of the WAV, `f` the 24 fps frame; each cue holds until the next. Method (unchanged): Kokoro's word timings carried through every edit and checked against a recognizer; each word split across its misaki phonemes by weight; phonemes mapped to mouths (a Rhubarb-style reduction); the 10 ms envelope gates open/close; every drawing held ≥ 2 frames (on 2s); `rest` after the last word, `smile` only after warm deliveries. `words: [{w, t0, t1, f0, f1}]` is delivered on every voiced row (V.O. included) for picture sync. Diagnostic strip: [`out/ep01/act4/dialogue/mouth_check.png`](../../../../../out/ep01/act4/dialogue/mouth_check.png).

A list in draft 3.1 script order. Paths are relative to the repo root (`/home/jgon/project/art/mrmas`).

```
{id, scene, speaker, speaker_slug, text, spoken_as, delivery, tag, mode, voiced_in_cut, on_camera,
 kind       'dialogue' | 'vo' | 'post'        (post = unvoiced pop-up; read-aloud posts and the memo are dialogue)
 side       'left' | 'right' | 'none'         portrait window / dialogueBox tail: left = Mas, right = the other character,
                                              none = no window (V.O., his voice via their speaker, O.S., tiles, blueprint, crowd, posts)
 pov        'his' | 'board'                   whose side of the told-twice (sc 27 = the board's pass)
 shot       the draft 3.1 shot the line plays over (tag + framing)
 lip_sync   true = animate `mouth`;  status  'unchanged' | 'new-3.1' | 'retake-3.1' | 'derived-3.1' | 'restaged-3.1'
 file (wav), mp3, duration_s, frames_24, voiced_span_s, take, takes_tried, pick_reason, alt_takes?,
 voice, voiceId, model, processing[], mouth[{t,f,shape}], words[{w,t0,t1,f0,f1}],
 qa{lufs_i, target_lufs, true_peak_dbtp, clipped_samples, median_f0_hz, f0_range_st, final_move_st, wpm, asr, cer, logprob,
    align_median_s, mp3_lufs_i, mp3_true_peak_dbtp},
 popup_hold_beats? popup_note? (posts) · master? / pair? (the calm-off) · voice_desc? (V.O.)
 fallback? {text, file, mp3, duration_s, words, qa, alt_takes, why}   (a4-26a-vo1: the guardrails wording)
 derived_from? + clean? {file, mp3, lufs_i}                            (a4-27-00: processed from a4-26-01)}
```

`mode` is kept for the editor's lock (`vo` for the V.O. rows, `speaker` for the laptop row, `post-popup`, `read-aloud-post`, `memo-read`, `on-mic`). **Filter the cut on `voiced_in_cut`** (or `kind != 'post'`); pop-up rows point at `optional/`.

## 10. For the next stage

**The editor's lock must drop its scratch V.O. overlay.** `studio/src/episodes/ep01/act4/animatic/tools/lock.py` loads `out/ep01/act4/animatic/scratch-vo/scratch_vo.json` after `lines.json` and overrides by id, and those scratch rows carry draft 3's words under the same ids (`a4-26a-vo1` = "i'm not a sentimental person.", `a4-26a-vo2`, `a4-29-vo1`, `a4-29-vo2`), plus `a4-26-vo1`, which draft 3.1 removes. Until that overlay goes, the lock keeps the wrong words. Draft 3.1's V.O. is all in `lines.json` now (`kind: vo`, `mode: vo`).

**V.O. that is longer than its written slot:** `a4-29-vo1` "i put the phone down." runs 1.99 s (4 beats) against the 3 beats its slot leaves ([2S] 1 bar, then MAS'S VERSION). The shortest of its 8 takes is 1.96 s, and his on-camera read of the same words is 1.795 s: at V.O. pace these words do not fit 3 beats, and reading them faster would put him back at his on-camera pace and lose the closeness. It also shares the `[2S]` with the rail: `· HIS SIDE` types on after the 2-beat home shot, needs 2.05 s, and the V.O. may not play at the same moment as a rail item (pov-and-framing §5.2: stagger ≥ 1 beat). So the board has to give this beat room: run the `[2S]` 2 bars (rail first, then the line from bar 2's downbeat, clear by a beat before MAS'S VERSION), or type the rail on over the home shot and let the line start on the `[2S]`'s second beat with the shot at 1 bar + 2 beats. Script lengths are picture time; the act clock absorbs ≤ 1 bar.

**Listen first.** These picks are measured, not heard. The ear pass should confirm or swap (alternates are in `takes/`): the five V.O. lines as a set (one man, one distance, nothing performed), the fallback, the "mostly." re-take against the V.O. before it, the laptop "super." in the call's room tone, the one-word Mas lines, the calm-off pair, ADELINA's 'no.', MARIO's run, TERB's '…Ah.' and 'Terms?', NELEH's cut-off, and the closest pairs flagged in §6.

**Mix notes (all dialogue is dry; rooms and treatments are yours):**
- **MAS (V.O.):** delivered −18.0 LUFS, 2 LU under dialogue, as briefed ("slightly lower"). pov-and-framing §5.1 says the V.O. "sits at dialogue level": if the mix follows the bible, raise it 2 dB; either way it stays dry and close, with no room and no send. The score thins to one instrument or drops out under it; never a sting or a swell under a line. It never plays inside the drop-out (sc 26 has no V.O. at all) and never over the dialogue box or a rail item.
- **`a4-27-00` his voice through their laptop:** laid at its delivered −22.0 LUFS, under the board's call room tone, which continues through it; nobody reacts. No music. Use `clean/a4-27-00.wav` only if the mix builds its own speaker.
- **`a4-26-01` 'super.' (sc 26):** the live mic on the call, no music under it; a light call-codec band-limit is still an option, but keep it clearly fuller than the sc 27 laptop version so the two sides read as the same word heard twice.
- **ALYI:** his CASTING hall as a send (room 0.8, damp 0.6, ~12% wet, 35 ms pre-delay, send HPF 200 Hz). Low and pre-delayed in the reflections (sc 27) and the doorway `[P2]` (sc 30). The sad violin runs under his post only and stops dead on the first heart; the 2-beat hold after it is room tone only.
- **TASYA (O.S.) 'Everyone is welcome.':** behind the slate-blue door (low-pass plus a little room), at least 1 beat after the V.O. ends, **no music under either**. 'leave it open.' comes at once on it. TASYA 'Hello.' from the floor: optional low-mid lift.
- **GERG on the monitor** (sc 29): a small-speaker EQ, but a different speaker from the board's laptop (his tile is big and close). **NELEH `a4-29-09`:** a hard stop inside 'char-'; a dropout blip on the tile exit can cover it.
- **MAS'S VERSION** (sc 29): the keynote-reel piano is score, cut mid-phrase on the hard cut; no dialogue sits inside it.
- **"okay."** plays off his face over the glass set-down `[ECU]`, after the silent `[CU]`'s 2 beats.
- THE PLAN's NELEH and MADA are blueprint figures: a chip/band-limit treatment is a style call for the mix.
- Gaps inside lines are digital silence (pause edits). Lay room tone under all dialogue, V.O. included.

**Flags:**
- **Finals that miss the direction on every take** (a Kokoro limit, for the actor or an alternate): RIMA 'I'll hold it together.' lifts (+2.2 st; 4 takes, all rising); MAS 'super.' ends +1.4 st and a little under his lane (11 takes; the best falling alternates are listed in `alt_takes`). The laptop copy inherits that take.
- **Closest pairs (§6):** MADA / TTEMME (both at the house pitch limit) and ADELINA / RIMA (same scene, never the same exchange). If either blurs by ear: MADA to master take t04, or TTEMME to `e-liam-headset`.
- **Texture:** `am_michael` (MAS, and so the V.O.) and `am_adam` (MADA) vowels are less periodic than the rest of the cast, a slightly husky grain. It doesn't register as creak, but pYIN loses whole vowels on them, so the tracker fills those frames from YIN (method in `a4lib.f0_contour`). The softer V.O. top makes this grain a little more audible: check it by ear first.
- `am_adam` (MADA) is Kokoro's lowest-graded pack (F+); D-grade packs: ALYI (onyx), MARIO (liam), TERB (echo), TASYA (eric).
- ASR hears ALYI as 'Ali' in the memo (`/ˈælji/` is set). Lock the pronunciation at the table read (naming §9 says 'AL-yee').
- **"gerg" is said aloud for the first time in any recording so far** (`a4-29-vo3`). naming §9 writes it "gerg"; the G2P read it "jerg" (/dʒɜrg/, heard as 'Jerg'/'Jurg' on all 8 first-session takes), so it is set to a hard G, /ɡɜrɡ/, rhyming with 'berg' (the letter swap of Greg). Lock it at the table read with ALYI's; if the room wants 'jerg', re-run `record.py a4-29-vo3` with the override removed from `lines_a4.py`.
- The script's holds (the 1-beat Orb hold before 'mostly.', the calm-off, the 1-bar hold, the quiet beat) are **picture** time. The files are trimmed, and the holds are timed in the edit (the listening reel approximates them).
- 'noted.' is not in Act Four (it is the cold open and the tag button), so it was not recorded here.
- Carried tags: TASYA `a4-30-02` is [V/K], re-verify before lock. GERG's posts `a4-27-01` / `a4-30-10` need a casing re-fetch.
- Blip pairing (pixel dialogue voice): NELEH, MADA, TTEMME, TERB, TASYA, ADELINA and the employee have no blip kit in `audio/sfx` yet.

**Re-run:** `HF_HUB_OFFLINE=1 audio/.venv-casting/bin/python audio/ep01/act4/dialogue/tools/record.py [ids…]` (no ids = the whole act; any run refreshes the draft 3.1 staging on every row), then `final_cast.py`, `reel.py`, `make_doc.py`. Takes are seeded, so a re-run reproduces them exactly. This pass: `record.py a4-26a-vo1 a4-26a-vo2 a4-29-vo1 a4-29-vo2 a4-29-vo3 a4-29-03 a4-27-00`.
