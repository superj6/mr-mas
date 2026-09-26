# Ep1 · Act Four · Dialogue (casting + recording) · draft 3.2

*Dialogue director + recordist, 2026-09-25. Re-recorded for script **draft 3.2** (the tightening pass) of [script.md](../../script.md#act-four--the-blip-told-twice), per [tighten-changes.md](tighten-changes.md) §1–§4, which answers the showrunner's note on animatic v2 ("why is there so much empty silence in the animatic? the dialogue feels slow…"). **Every voiced line is re-taken at pace** (same words, same tags), the removed lines are retired, the new ones are recorded, and the overlaps and cut-offs the script marks are built into the takes and placed in `lines.json`. These are still **scratch synthetic voices** (Kokoro-82M stock packs): every take was measured and picked by numbers, and nobody has listened yet. A human ear pass is the first thing the next stage needs (§12). Draft 3.1's doc and takes are in `retired/3.1/` and the repository history.*

| | |
|---|---|
| **Lines** | 53 rows in draft 3.2 order · **43 dialogue** + **3 MAS (V.O.)** voiced in the cut · 7 post pop-ups (unvoiced by house rule; scratch reads unchanged in `optional/`) |
| **This pass** | 6 new · 3 changed · 8 removed (§0) · all 45 read lines re-taken for pace, plus the laptop "super." re-derived · 216 takes recorded and measured · the 7 posts restaged (the 9:32 post moves to sc 27) |
| **Voiced time** | **63.6 s audible** (67.0 s of files, 184 words), against 3.1's 83.4 s (89.6 s, 188 words). On the 3.2 beat model (4:09.4) the dialogue covers **25.0%** of the act (v2: 20% of 7:33.8) |
| **Pace** | **175 wpm** over every read (words per audible minute; 3.1's takes: 136). MAS on camera 148 · MAS (V.O.) 151 · everyone else 152–214 (ALYI slowest, by brief; MADA's canned two-word line 140, the one-line crowd voice 296) (§1) |
| **Fit** | 39 of 41 on-camera and O.S. reads land within ±10% of their §2 target; the 3 V.O. lines sit inside their slots (§4). Time-compression used on 3 lines |
| **Overlaps · cut-offs** | 7 overlaps placed (`overlap_prev_s`) · 5 hard cut-offs · median gap inside an exchange on the model clock **0.15 s** (the two gaps the script holds open excluded; v2: 1.14 s) |
| **Audio** | [`../../../../../audio/ep01/act4/dialogue/`](../../../../../audio/ep01/act4/dialogue/) · `wav/<id>.wav` 48 kHz/24-bit mono · `mp3/<id>.mp3` 160k · `fallback/` (the V.O. alternate wording) · `clean/` (the dry copies of the two processed lines) · `retired/` (removed lines) · `retired/3.1/` (the takes this pass replaces) · [`lines.json`](../../../../../audio/ep01/act4/dialogue/lines.json) · [`act4-dialogue-reel.mp3`](../../../../../audio/ep01/act4/dialogue/act4-dialogue-reel.mp3) (the dialogue stem laid on the 3.2 beat model, 4:09.4; dialogue only) |
| **Levels** | DRY (no reverb/slap). Integrated loudness per line: **dialogue −16.0 LUFS**, **MAS (V.O.) −18.0**, **NELEH on the call −18.0** ("≈ 2 dB under RIMA", §4 row 3), **the laptop-speaker line −22.0**. True peak ≤ −1.5 dBTP, 0 clipped samples. **Trims: 20 ms head / 40 ms tail** (was 30 / 80); cut-offs end on the cut consonant with no tail. MP3s level-matched to ±0.1 LU |
| **Engine** | Kokoro-82M v1.0, lang 'a' (General American) stock packs; misaki G2P; pedalboard EQ/comp; Rubber Band (R3, via pedalboard) for time-compression. No cloning, no reference audio, no accent. Tools: `tools/record_32.py` (+ `lines_a4_32.py`, `a4pace.py`), `final_cast.py`, `pace_32.py`, `reel_32.py`, `make_doc_32.py` |

**QA gate** (`tools/final_cast.py`): format, level to each row's target, true peak, clipping, MP3 level-match, staging fields, mouth tracks, and the 3.2 checks (status values, trims ≤ 40 ms, internal pauses ≤ 0.3 s, hard cut-off ends, span against target). 6 items flagged, none a format or level failure:
- a4-27-14: span 1.23 s is -23% of its target 1.6 s
- a4-27-17: ASR CER 0.086 ('The first and last time I ever wear one of these.')
- a4-29-08: span 1.11 s is +11% of its target 1.0 s
- a4-29-09: ASR CER 0.15 ('Has anyone read the charter?')
- a4-30-11: ASR CER 0.143 ('I am deeply pleased by this result, after about 72 very intense hours of work.')
- a4-31-03: ASR CER 0.021 ('I love and respect Ali. I harbor zero ill will towards him.')

---

## 0. What changed for draft 3.2

Line by line against [tighten-changes.md](tighten-changes.md) §1 and the 3.1 `lines.json`. Status values are §1.4's.

| Id | Sc | Speaker | Line | Status | What was done |
|---|---|---|---|---|---|
| `a4-25-10` | 25 | NELEH | Nine seats. Three left this year. Four of us vote. | **new** | recorded |
| `a4-25-11` | 25 | NELEH | This board controls the company. | **new** | recorded |
| `a4-25-12` | 25 | NELEH | The investor gets— | **new** | recorded; a hard cut-off (§3) |
| `a4-25-13` | 25 | NELEH | And the CEO owns— | **new** | recorded; a hard cut-off (§3) |
| `a4-27-00` | 27 | MAS MANALT | super. | **rederive** | the new a4-26-01 take through the same laptop_speaker chain, −22 LUFS |
| `a4-27-23` | 27 | NELEH | Share what? | **new** | recorded dry, then a light call filter at −18 LUFS (dry copy in `clean/`); overlaps RIMA's 'soon' |
| `a4-27-24` | 27 | RIMA TAMURI | More. Soon. | **new** | delivered: her own a4-27-04 read of the two words, with a 0.12 s stop (§5) |
| `a4-26a-01` | 27 | MAS MANALT | "if i start going off, the nopeai board should go after me for the full value of my shares" | **moved** | the 9:32 post moves from 26A to sc 27 (27.10, on NELEH's phone), hold 8 beats |
| `a4-27-09` | 27 | ALYI | Step four will reveal itself. | **changed** | re-recorded with the new wording (no pause after 'four') |
| `a4-27-14` | 27 | MARIO | I've written up some thoughts— | **changed** | re-recorded with the new wording; a hard cut-off (§3) |
| `a4-27-21` | 27 | NELEH | Step four? | **restaged** | re-taken for pace; now O.S. over the blueprint insert (no mouth) |
| `a4-29-04` | 29 | GERG MOCKBRAN | One sec. Compiling— | **changed** | re-recorded with the new wording; a hard cut-off (§3) |
| `a4-25-01` | 25 | NELEH (blueprint) | Step four. | **removed** | THE PLAN no longer shows step 4 (the no-spoiler fold); MADA's 'Good question.' now cuts off 'And the CEO owns—'. WAV/MP3 → `retired/`, alternates → `retired/takes/` |
| `a4-26a-vo2` | 26A | MAS (V.O.) | the meeting ended early. | **removed** | D4 cut: with THE PLAN shorter it would share D2's 4-bar phrase. WAV/MP3 → `retired/`, alternates → `retired/takes/` |
| `a4-29-vo1` | 29 | MAS (V.O.) | i put the phone down. | **removed** | D5 and MAS'S VERSION cut; the hearts play straight (D5 debuts in Ep2 or Ep3). WAV/MP3 → `retired/`, alternates → `retired/takes/` |
| `a4-27-02` | 27 | RIMA | I'll hold it together. | **removed** | R6: a stated trope. WAV/MP3 → `retired/`, alternates → `retired/takes/` |
| `a4-27-03` | 27 | NELEH | For how long? | **removed** | replaced by 'Share what?' (a4-27-23). WAV/MP3 → `retired/`, alternates → `retired/takes/` |
| `a4-27-11` | 27 | ALYI (reflection) | The company will tell us. | **removed** | R2: the committee races the phones; a third question-and-answer in a row. WAV/MP3 → `retired/`, alternates → `retired/takes/` |
| `a4-27-18` | 27 | TTEMME | Chat. I'm the CEO now. | **removed** | it said his card aloud; the spotlight and his stream's name bar carry it. WAV/MP3 → `retired/`, alternates → `retired/takes/` |
| `a4-27-22` | 27 | MADA | Good question. (end of pass one) | **removed** | pattern 8: twice an episode at most; her '?' and his spinner end the pass unanswered. WAV/MP3 → `retired/`, alternates → `retired/takes/` |
| 35 lines | | | every other voiced line | **retake-pace** | same words, same tag, re-taken at pace; several have a new cue (§2) |
| `a4-27-01`, `a4-27-07`, `a4-27-17`, `a4-29-01`, `a4-30-10`, `a4-30-11` | | | the other posts | unchanged | unvoiced; holds re-timed to the 3.2 shots (`popup_hold_beats`) |

## 1. Pace

**The note** was "the dialogue feels slow": v2 measured 129 wpm with a median gap of 1.14 s. The fix sits in three places, and this pass owns the first two: the read and the trim. The placement (the gaps) is the lock's; §3 gives it the overlaps and fixed gaps to place from.

**How the pace was set.**
- **Span first.** Each line has a target: the audible span the 3.2 picture was timed to (§2, ±10%). Kokoro-82M's durations are deterministic for a given text, pack and speed, and scale as 1/speed, so one probe read per line gives the speed that lands the *delivered* span (after the chain and trims) on its aim; a take whose carrier moves it more than 5% off is read once more at its own speed. The §3 per-pack speeds were the starting points, and each line was solved from there (clamped to ×0.85–×1.25 of the start).
- **The aim.** Everyone aims at the target, except **MAS on camera, whose lines of two or more words aim 8% long** (measured, the slowest in any room, never sluggish; the cap is +10%), and **the V.O.**, which is paced to its wpm band inside the picture slot its clearances leave (§4). One-word Mas lines stay at their targets (≤ 0.65 s audible).
- **Light time-compression only at the clamp.** Where the speed solver hit its limit, Rubber Band (R3 engine, formants kept) took the rest, at most ×1.10. A few takes were also read slower and brought back to length on purpose, because the slower read carried the contour the direction asked for. Delivered with compression: `a4-29-03` ×1.062, `a4-30-06` ×1.100, `a4-30-07` ×1.100.
- **Internal pauses** are set as digital silence inside the read: every full stop or ellipsis inside a line ≤ 0.3 s (MARIO's four stops 0.12–0.16 s; the memo's '…' the one exception at ≈ 0.4 s). "Step four will reveal itself." has none.
- **Trims: 20 ms of head and 40 ms of tail silence** (the QA gate checks ≤ 40 ms). Cut-offs have no tail at all.
- **Contractions** are the script's ("I've", "We'll", "What's", "it's", "don't") and read as contractions; no line's words were changed. "That is the company telling us." and "Everyone is welcome." keep their printed, uncontracted forms.

**Measured pace per character.** One measure throughout: words ÷ audible span (10 ms frames above −40 dB of the line's peak, first to last), summed over the character's lines. *All* = every line; *3+* = lines of three or more words (one-word lines read slow in wpm by nature, and cut-offs read fast). Copies (the laptop "super.", the lifted "More. Soon.") are left out. 3.1 is the same measure on the takes this pass replaces (`retired/3.1/`).

| Character | Lines | Words | Audible s | **wpm (all)** | wpm (3+) | 3.1 wpm (all · 3+) | Speed 3.1 → 3.2 (median) |
|---|---|---|---|---|---|---|---|
| MAS (on camera) | 9 | 28 | 11.34 | **148** | 164 | 116 · 128 | 0.82 → 0.88 |
| MAS (V.O.) | 3 | 15 | 5.98 | **151** | 151 | 131 · 131 | 0.76 → 0.68 |
| ALYI | 4 | 26 | 10.28 | **152** | 152 | 105 · 105 | 0.80 → 0.97 |
| TASYA | 4 | 18 | 6.45 | **167** | 175 | 130 · 134 | 0.88 → 0.91 |
| MADA | 2 | 4 | 1.72 | **140** | – | 121 · – | 0.90 → 0.98 |
| TERB | 3 | 7 | 2.18 | **193** | 242 | 153 · 189 | 1.02 → 1.38 |
| MARIO | 2 | 12 | 3.50 | **206** | 206 | 154 · 154 | 0.95 → 1.01 |
| RIMA | 1 | 4 | 1.12 | **214** | 214 | 164 · 164 | 0.90 → 0.85 |
| TTEMME | 1 | 4 | 1.26 | **190** | 190 | 171 · 171 | 1.00 → 1.03 |
| NELEH | 10 | 43 | 12.82 | **201** | 205 | 172 · 178 | 0.95 → 0.98 |
| ADELINA | 1 | 4 | 1.29 | **186** | 186 | 164 · 164 | 0.95 → 1.27 |
| GERG | 3 | 12 | 3.44 | **209** | 209 | 199 · 199 | 1.15 → 1.17 |
| TILED EMPLOYEE | 1 | 4 | 0.81 | **296** | 296 | 214 · 214 | 0.95 → 1.20 |
| **All reads** | 44 | 181 | 62.19 | **175** | | 136 | |

*Speed 3.1* is the cast speed in `cast_a4` (3.1's wpm-band loop then slowed many lines further: ALYI and RIMA read at 0.68–0.72, the V.O. at 0.58–0.61). The per-line speeds are in each row's `pace.speed`.

## 2. Every voiced line against its target

Target = tighten-changes §2 (the audible span the picture was timed to). Span = the delivered take's audible span. ± = span against target. wpm on the audible span. **Cue** = the 3.2 shot and the beat inside it where the line starts (§5). Dur = the file (with its 20 / 40 ms pads).

| # | Id | Speaker | Line | Status | Target | **Span** | ± | wpm | Speed · TSM | Dur · fr | Take | Cue |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `a4-25-10` | NELEH | Nine seats. Three left this year. Four of us vote. | new | 3.30 | **3.20** | −3% | 188 | 0.908 | 3.27 · 79 | t01/4 | 25.02, beat 2 |
| 2 | `a4-25-11` | NELEH | This board controls the company. | new | 1.70 | **1.75** | +3% | 171 | 0.913 | 1.83 · 44 | t01/3 | 25.02, beat 8 |
| 3 | `a4-25-12` | NELEH | The investor gets— | new | 0.80 | **0.77** | −4% | 234 | 0.998 | 0.79 · 19 | t04/4 | 25.02, beat 11 |
| 4 | `a4-25-13` | NELEH | And the CEO owns— | new | 0.90 | **0.89** | −1% | 270 | 0.957 | 0.90 · 22 | t01/4 | 25.02, beat 13.5 |
| 5 | `a4-25-02` | MADA | Good question. | retake-pace | 0.85 | **0.86** | +1% | 140 | 0.976 | 0.94 · 23 | mada-good-question t02/6 | 25.02, beat 14.6 |
| 6 | `a4-26-01` | MAS MANALT | super. | retake-pace | 0.60 | **0.59** | −2% | 102 | 1.067 | 0.68 · 17 | t02/7 | 26.09, beat 1.2 |
| 7 | `a4-26a-vo1` | MAS MANALT (V.O.) | i don't keep score. | retake-pace | 1.50 | **1.72** | +15% | 140 | 0.660 | 1.80 · 44 | t04/6 | 26A.01, beat 2 |
| 8 | `a4-27-00` | MAS MANALT | super. | rederive | 0.60 | **0.59** | −2% | 102 | 1.067 | 0.68 · 17 | a4-26-01 t02 | 27.01, beat 1.1 |
| 9 | `a4-27-04` | RIMA TAMURI | We'll share more soon. | retake-pace | 1.10 | **1.12** | +2% | 214 | 0.855 | 1.21 · 30 | t05/5 | 27.05, beat 1.5 |
| 10 | `a4-27-23` | NELEH | Share what? | new | 0.55 | **0.57** | +4% | 211 | 1.184 | 0.65 · 16 | t01/4 | 27.05b, beat 0.7 |
| 11 | `a4-27-24` | RIMA TAMURI | More. Soon. | new | 0.90 | **0.83** | −8% | 145 | 0.855 | 0.90 · 22 | splice/5 | 27.05c, beat 1.3 |
| 12 | `a4-27-05` | TILED EMPLOYEE | Is this a coup? | retake-pace | 0.90 | **0.81** | −10% | 296 | 1.196 | 0.87 · 21 | t03/11 | 27.07, beat 1.8 |
| 13 | `a4-27-06` | ALYI | "You can call it this way" | retake-pace | 2.10 | **2.09** | −1% | 172 | 0.854 | 2.19 · 53 | t01/4 | 27.08, beat 1.3 |
| 14 | `a4-27-08` | NELEH | The bylaws allow it. Footnote three. | retake-pace | 2.00 | **2.00** | +0% | 180 | 1.009 | 2.08 · 50 | t04/4 | 27.13b, beat 1.3 |
| 15 | `a4-27-09` | ALYI | Step four will reveal itself. | changed | 2.10 | **2.10** | +0% | 143 | 1.104 | 2.17 · 53 | t03/4 | 27.14, beat 1.6 |
| 16 | `a4-27-10` | NELEH | When? | retake-pace | 0.45 | **0.43** | −4% | 140 | 0.980 | 0.50 · 12 | t04/4 | 27.14, beat 4.7 |
| 17 | `a4-27-12` | NELEH | The company is calling us. | retake-pace | 1.30 | **1.32** | +1% | 227 | 0.982 | 1.39 · 34 | t04/4 | 27.16, beat 1.3 |
| 18 | `a4-27-13` | ALYI | That is the company telling us. | retake-pace | 2.20 | **2.27** | +3% | 159 | 0.991 | 2.36 · 57 | t01/4 | 27.17, beat 1.2 |
| 19 | `a4-27-14` | MARIO | I've written up some thoughts— | changed | 1.60 | **1.23** | −23% | 244 | 0.892 | 1.25 · 30 | t04/4 | 27.22a, beat 1.4 |
| 20 | `a4-27-15` | ADELINA | In plain English: no. | retake-pace | 1.30 | **1.29** | −1% | 186 | 1.270 | 1.37 · 33 | t03/4 | 27.22b, beat 0.9 |
| 21 | `a4-27-16` | MARIO | Hi. Yes. We're very worried. How much? | retake-pace | 2.20 | **2.27** | +3% | 185 | 1.122 | 2.34 · 57 | t01/4 | 27.23, beat 1.2 |
| 22 | `a4-27-19` | TTEMME | Chat… for how long? | retake-pace | 1.30 | **1.26** | −3% | 190 | 1.027 | 1.32 · 32 | t07/8 | 27.27, beat 1.5 |
| 23 | `a4-27-20` | TASYA | "a new advanced AI research team" | retake-pace | 2.10 | **1.96** | −7% | 184 | 0.833 | 2.04 · 49 | t05/5 | 27.29, beat 1.3 |
| 24 | `a4-27-21` | NELEH | Step four? | restaged | 0.65 | **0.68** | +5% | 176 | 1.183 | 0.73 · 18 | t03/4 | 27.30, beat 1.4 |
| 25 | `a4-29-vo2` | MAS MANALT (V.O.) | the badge was a joke. | retake-pace | 1.60 | **1.81** | +13% | 166 | 0.715 | 1.89 · 46 | t03/6 | 29.04, beat 1 |
| 26 | `a4-29-03` | MAS MANALT | mostly. | retake-pace | 0.65 | **0.65** | +0% | 92 | 1.089 · ×1.06 | 0.72 · 18 | t07/9 | 29.05, beat 1 |
| 27 | `a4-29-04` | GERG MOCKBRAN | One sec. Compiling— | changed | 0.90 | **0.99** | +10% | 182 | 1.210 | 1.01 · 25 | t01/4 | 29.11a, beat 1.3 |
| 28 | `a4-29-05` | MAS MANALT | what are you building? | retake-pace | 1.40 | **1.35** | −4% | 178 | 0.825 | 1.42 · 35 | t01/4 | 29.11b, beat 0.8 |
| 29 | `a4-29-06` | GERG MOCKBRAN | The company. Again. Just in case. | retake-pace | 1.70 | **1.76** | +3% | 205 | 1.168 | 1.81 · 44 | t03/4 | 29.12, beat 1.1 |
| 30 | `a4-29-vo3` | MAS MANALT (V.O.) | gerg never waits to be asked. | retake-pace | 2.00 | **2.45** | +23% | 147 | 0.676 | 2.55 · 62 | t05/6 | 29.16, beat 1 |
| 31 | `a4-29-07` | TASYA | Everyone is welcome. | retake-pace | 1.20 | **1.16** | −3% | 155 | 1.045 | 1.24 · 30 | t02/3 | 29.16, beat 6 |
| 32 | `a4-29-08` | MAS MANALT | leave it open. | retake-pace | 1.00 | **1.11** | +11% | 162 | 0.870 | 1.18 · 29 | t03/4 | 29.17, beat 1 |
| 33 | `a4-29-09` | NELEH | Has anyone read the char— | retake-pace | 1.20 | **1.21** | +1% | 248 | 0.980 | 1.24 · 30 | t01/3 | 29.24, beat 1.5 |
| 34 | `a4-30-01` | ALYI | "I deeply regret my participation in the board's actions." | retake-pace | 3.80 | **3.82** | +0% | 141 | 0.950 | 3.90 · 94 | t01/4 | 30.01, beat 1.4 |
| 35 | `a4-30-02` | TASYA | "We are below them, above them, around them." | retake-pace | 2.90 | **2.72** | −6% | 176 | 0.833 | 2.80 · 68 | t04/4 | 30.03, beat 2 |
| 36 | `a4-30-03` | MAS MANALT | hi. | retake-pace | 0.45 | **0.47** | +4% | 128 | 1.142 | 0.54 · 13 | t01/5 | 30.06, beat 1.4 |
| 37 | `a4-30-04` | TASYA | Hello. | retake-pace | 0.60 | **0.61** | +2% | 98 | 0.980 | 0.70 · 17 | t01/4 | 30.06b, beat 0.9 |
| 38 | `a4-30-05` | TERB | Which room is on fire? | retake-pace | 1.20 | **1.24** | +3% | 242 | 1.192 | 1.36 · 33 | t03/3 | 30.11a, beat 1.2 |
| 39 | `a4-30-06` | TERB | …Ah. | retake-pace | 0.40 | **0.41** | +2% | 146 | 1.375 · ×1.10 | 0.49 · 12 | t01/3 | 30.11b, beat 2 |
| 40 | `a4-30-07` | TERB | Terms? | retake-pace | 0.50 | **0.53** | +6% | 113 | 1.375 · ×1.10 | 0.69 · 17 | t03/4 | 30.12, beat 1.8 |
| 41 | `a4-30-08` | MADA | Good question. | retake-pace | 0.85 | **0.86** | +1% | 140 | 0.976 | 0.94 · 23 | mada-good-question t02/6 | 30.13, beat 1.2 |
| 42 | `a4-30-09` | MAS MANALT | good question. | retake-pace | 0.90 | **0.99** | +10% | 121 | 0.825 | 1.06 · 26 | t06/6 | 30.14, beat 2 |
| 43 | `a4-30-12` | MAS MANALT | okay. | retake-pace | 0.60 | **0.57** | −5% | 105 | 0.825 | 0.64 · 16 | t05/10 | 30.23, beat 1.8 |
| 44 | `a4-31-01` | GERG MOCKBRAN | What's in there? | retake-pace | 0.70 | **0.69** | −1% | 261 | 1.029 | 0.85 · 21 | t01/4 | 31.02, beat 1.8 |
| 45 | `a4-31-02` | MAS MANALT | it's a preview. | retake-pace | 1.00 | **0.99** | −1% | 182 | 0.971 | 1.05 · 26 | t01/4 | 31.02, beat 3 |
| 46 | `a4-31-03` | MAS MANALT | "i love and respect alyi… i harbor zero ill will towards him." | retake-pace | 4.30 | **4.62** | +7% | 156 | 0.879 | 4.69 · 113 | t01/4 | 31.03, beat 1.8 |

Removed from the cut and from `lines.json`: `a4-25-01`, `a4-26a-vo2`, `a4-29-vo1`, `a4-27-02`, `a4-27-03`, `a4-27-11`, `a4-27-18`, `a4-27-22` (§0).

## 3. Overlaps, cut-offs and fixed gaps

**Overlaps** are placed from the previous voiced line's word track, exactly where tighten-changes §4 puts them. In `lines.json`:
- `overlap_prev_s`: seconds of audible overlap (the previous line's audible end minus this line's audible start); `overlap_prev_frames` the same at 24 fps;
- `overlap_with`: the previous line; `overlap_place_at_s`: **where this WAV's t = 0 sits on the previous WAV's clock** (lay the file there); `overlap_anchor`: the rule it was placed by.

| Sc · shot | Under | Over | Rule (§4) | `overlap_prev_s` · fr | Place at (s into the under WAV) |
|---|---|---|---|---|---|
| 25 · 25.02 | `a4-25-13` NELEH: And the CEO owns— | `a4-25-02` MADA: Good question. | 4 f before a4-25-13's audible end | **0.167** · 4 | 0.713 |
| 27 · 27.05b | `a4-27-04` RIMA TAMURI: We'll share more soon. | `a4-27-23` NELEH: Share what? | 6 f before a4-27-04's audible end | **0.250** · 6 | 0.880 |
| 27 · 27.14 | `a4-27-09` ALYI: Step four will reveal itself. | `a4-27-10` NELEH: When? | 4 f before a4-27-09's audible end | **0.167** · 4 | 1.933 |
| 27 · 27.22b | `a4-27-14` MARIO: I've written up some thoughts— | `a4-27-15` ADELINA: In plain English: no. | 3 f into 'thoughts' (a4-27-14) | **0.293** · 7 | 0.927 |
| 29 · 29.11b | `a4-29-04` GERG MOCKBRAN: One sec. Compiling— | `a4-29-05` MAS MANALT: what are you building? | 4 f before a4-29-04's audible end | **0.167** · 4 | 0.823 |
| 29 · 29.17 | `a4-29-07` TASYA: Everyone is welcome. | `a4-29-08` MAS MANALT: leave it open. | 4 f before a4-29-07's audible end | **0.167** · 4 | 0.993 |
| 30 · 30.06b | `a4-30-03` MAS MANALT: hi. | `a4-30-04` TASYA: Hello. | 1 f before a4-30-03's audible end | **0.042** · 1 | 0.418 |

**Cut-offs** are read on into a continuation, so the cut word keeps a mid-sentence contour, then cut at the closure before it (or inside the word after n phonemes), re-cut after the chain so no processing smears the stop, with a 3 ms de-click ramp and no tail pad. The QA gate checks each ends loud (a stop, not a decay). The next sound is the cut: a stamp, a line, a tile's exit.

| Id | Line | How | Ends | Span (target) | Next sound |
|---|---|---|---|---|---|
| `a4-25-12` | The investor gets— | read on into 'paid in full.' and cut at the closure before it; ends on the cut consonant | gets— | 0.77 s (0.80) | the `VOTES: 0` stamp (`rubber_stamp_C`) on the 't' of 'gets' |
| `a4-25-13` | And the CEO owns— | read on into 'precisely nothing.' and cut at the closure before it; ends on the cut consonant | owns— | 0.89 s (0.90) | MADA's "Good question." (overlapping) |
| `a4-27-14` | I've written up some thoughts— | read on into 'because the charter says so.' and cut at the closure before it; ends on the cut consonant | thoughts— | 1.23 s (1.60) | ADELINA's "In plain English: no." (overlapping) |
| `a4-29-04` | One sec. Compiling— | cut inside 'Compiling' after 6 phonemes | Compiling— | 0.99 s (0.90) | MAS's "what are you building?" (overlapping); Gerg's keys continue |
| `a4-29-09` | Has anyone read the char— | cut inside 'charter' after 3 phonemes | char— | 1.21 s (1.20) | her tile's exit |

The stamp lands on the 't' of 'gets': **0.693 s (frame 17)** into `a4-25-12` (its `sync`).

**Fixed gaps** the script or §3 sets (`gap_prev_s`, `gap_with`, `gap_place_at_s` = where this WAV's t = 0 sits on the previous WAV's clock):

| Id | Line | Gap after | `gap_prev_s` | Why |
|---|---|---|---|---|
| `a4-27-13` | That is the company telling us. | `a4-27-12` | 0.100 s | tight on NELEH's 'us' (≤ 3 f) |
| `a4-29-07` | Everyone is welcome. | `a4-29-vo3` | 0.625 s | at least 1 beat after the V.O. (§3, pov-and-framing §5) |
| `a4-30-08` | Good question. | `a4-30-07` | 0.100 s | on the tail of 'Terms?' (≤ 3 f), tight, not overlapped |
| `a4-30-09` | good question. | `a4-30-08` | 0.625 s | **exactly 1 beat** after MADA's line: the late beat is the joke |
| `a4-31-02` | it's a preview. | `a4-31-01` | 0.150 s | tight on Gerg (≤ 4 f) |

Everything else inside an exchange follows the lock's default (tighten-changes §3): a reply starts on the previous line's last syllable or ≤ 0.3 s after it; conversation cuts land on the turn.

**Check on the 3.2 beat model.** `tools/reel_32.py` lays every delivered take at its §5 cue (shot In + cue beat), or from the previous line where an overlap or a fixed gap is set, and measures the dialogue stem (`act4-dialogue-reel.mp3`, `reel_cues.json`). It is the recordist's fit check, not the lock:
- voiced **62.4 s of 249.4 s = 25.0%** of the act (v2: 20% of 453.8 s; tighten-changes projected ≈ 62 s, 25%);
- stretches of more than 6 s with no voice: **11, 132.6 s** (v2: 18, ≈ 304 s; the 3.2 board projects 12, ≈ 138 s). They are the set-pieces (THE PLAN's bars around the diagram, the drop-out and F1.2, the exit's screens, the hearts, the avalanche, the landlord's aftermath, the lobby) and every one is scored or carries its own sound in tighten-changes §6: the v3 animatic must be cut with that sound, or they will read as silence again;
- median gap between consecutive lines inside an exchange: **0.15 s** (v2: 1.14 s; the target is ≤ 0.3 s), or 0.202 s counting the two gaps held open by rule (MAS's 1-beat-late echo and the V.O. clearance before "Everyone is welcome.");
- unmarked collisions (a take running into the next line's cue): **none**.

| Silence on the model clock | Starts (s into the act) | Length |
|---|---|---|
| | 0.00 | 6.88 s |
| | 15.65 | 18.23 s |
| | 48.15 | 8.41 s |
| | 67.28 | 13.53 s |
| | 103.02 | 7.30 s |
| | 117.18 | 13.44 s |
| | 133.77 | 16.42 s |
| | 161.43 | 10.13 s |
| | 172.77 | 10.60 s |
| | 196.91 | 7.60 s |
| | 210.49 | 20.01 s |

## 4. MAS (V.O.)

Three lines in 3.2 (D4's "the meeting ended early." and D5's "i put the phone down." are cut). Same performer and pack as his scenes, the `vo-close` chain, dry, −18 LUFS, told, never performed; the brief is unchanged from 3.1. The V.O. is never overlapped and never overlaps.

**Pace, and a call for the POV owner (script ruling 7).** The ruling states two numbers: ×1.05–1.10 of his new on-camera read of the same words, and 130–140 wpm (this pass's brief: ~135–145). At the new on-camera pace they disagree. His on-camera voice at its delivered speed reads these words at 176–203 wpm, so the first pass, paced at ×1.08, came out at 156, 185, 167 wpm. **The delivered V.O. is paced to the wpm band instead:** ×1.15–1.32 of his on-camera read (aim ×1.28), inside each slot, which keeps it clearly a touch slower and closer than his scenes. The ×1.08 reads are kept as a named alternate in `takes/<id>-x108/` (the pick in `pick.json`), so the POV owner can rule either way without a re-record; the ×1.08 set runs 0.67 s shorter across the three lines.

| Id | Sc · device | Line | Target | **Span** | wpm | ×on-camera (his read) | Slot max (why) | Final · range | Take |
|---|---|---|---|---|---|---|---|---|---|
| `a4-26a-vo1` | 26A · D2 | i don't keep score. | 1.50 | **1.72** | 140 | ×1.265 (1.36 s at 0.875) | 2.500 s (26A.01 is 6 beats; the line starts on beat 2 and must end >= 1 beat before the cut: 6 - 1 - 1 = 4 beats) | −0.8 st · 9.4 st | t04/6 |
| `a4-29-vo2` | 29 · D3 | the badge was a joke. | 1.60 | **1.81** | 166 | ×1.223 (1.48 s at 0.875) | 1.875 s (29.04 is 1 bar from its beat 1; it must end >= 1 beat before 'mostly.' on 29.05's beat 1: 3 beats) | −2.3 st · 9.1 st | t03/6 |
| `a4-29-vo3` | 29 · D8 | gerg never waits to be asked. | 2.00 | **2.45** | 147 | ×1.310 (1.87 s at 0.875) | 2.500 s (from 29.16's beat 1; TASYA starts on beat 6 and must come >= 1 beat after it: 4 beats) | −2.9 st · 8.8 st | t05/6 |
| ↳ fallback | 26A · D2 | i don't keep things. | 1.50 | **1.68** | 143 | ×1.226 | 2.500 s | −1.1 st · 8.8 st | t03/6 |

Total: 3 lines, 15 words, **5.98 s audible, 151 wpm**. Why it sits above a plain 135–145: these are four-to-six-word lines of short words with no internal stop, and the picture bounds them. "the badge was a joke." can't run past 1.875 s without moving 29.05's cut (it must end a beat before "mostly."), which is 160 wpm for five words at the most. On the like-for-like measure the V.O. is slower than his scenes: his on-camera lines of 3+ words run 164 wpm, and every V.O. line is ×1.22–1.31 of his own read of the same words.

**The door's first held step:** "asked" starts **1.852 s (frame 44)** into `a4-29-vo3` and ends at frame 60.

## 5. The special lines

**`a4-27-00` "super." through their laptop** (re-derived). No new read: the new `a4-26-01` take (t02), unchanged in time, through `laptop_speaker` (330 Hz – 5.4 kHz, the chassis resonance, a little driver distortion, the laptop's levelling), **-22.0 LUFS**. The dry copy is `clean/a4-27-00.wav`. `side: none`, `mouth: []`.

**`a4-27-23` NELEH "Share what?" on the call** (new). Read dry and picked like any line (t01/4), then a **light call filter**, thinner than the laptop chain: HPF 200 Hz, LPF 7 kHz (single poles), +1.5 dB at 1.8 kHz, 2.5:1 levelling, no saturation; delivered at **-18.0 LUFS**, 2 LU under RIMA (§4 row 3). Dry copy: `clean/a4-27-23.wav`. It overlaps RIMA's 'soon' by 0.250 s. The two-up tile shows her mouth (`lip_sync`).

**`a4-27-24` RIMA "More. Soon."** (new): "exactly the read of a4-27-04's last two words; the stop ≤ 0.15 s". Two kinds of candidate were scored together: **the two words lifted from her delivered a4-27-04 take** with a 0.12 s stop between them (literally her read), and four fresh reads scored on how closely their melody matches those two words. Delivered: **splice** (the lifted words; melody r = 0.861 against a4-27-04's 'more soon'); span 0.83 s. Every candidate is in `takes/a4-27-24/`, best first in `alt_takes`: splice (2.132), t02 (3.57), t03 (4.034), t01 (5.782), t04 (5.803).

**The calm-off** (`a4-25-02` / `a4-30-08` MADA, `a4-30-09` MAS). MADA's line is still **one master read** for both his lines (`takes/mada-good-question/`, 6 takes); `a4-27-22` is cut, so it plays twice, not three times. The master and MAS's echo were chosen **as a pair**: mada-good-question t02 × t06, melody r = 0.828. MADA 0.86 s, MAS 0.99 s, laid **exactly one beat apart** (`gap_prev_s` 0.625).

**`a4-29-03` "mostly."** answers the Orb's look, a shade under the V.O. before it: 105.6 Hz, −0.2 st against `a4-29-vo2`, final +0.7 st, 0.65 s.

## 6. Cast

No casting changes: the same packs and chains as 3.1 (CASTING.md picks for the returning cast; pass-1 picks for the new roles, §11). Lanes re-measured on the 3.2 lines (`qa/final_cast.json`): median F0, mean per-line range, and the timbre used for §7.

| Character | Lines | Voice (preset) | Text description | Median F0 · range | Speed (3.2, median) |
|---|---|---|---|---|---|
| ALYI | 4 (10.6 s) | `am_onyx` · a-onyx-cathedral | low, weighty baritone, falling sermon finals; the weight in pitch, not length (hall added in the mix) | 83.0 Hz · 12.5 st | 0.97 |
| TERB | 3 (2.5 s) | `am_echo` · b-echo-brisk | tall, dark, brisk baritone, crisp 2 kHz edge, procedural and unbothered | 90.6 Hz · 9.3 st | 1.38 |
| MAS MANALT | 9 (12.0 s) | `am_michael` · a-michael-close | soft light baritone, close-mic, level finals; the slowest in any room, never a drawl | 115.9 Hz · 8.4 st | 0.88 |
| MAS MANALT (V.O.) | 3 (6.2 s) | `am_michael` · a-michael-close | the same voice, closer and softer: intimate close mic, dry, a touch slower than his scenes, slightly lower; told, never performed | 120.7 Hz · 9.1 st | 0.68 |
| TTEMME | 1 (1.3 s) | `am_fenrir` · d-fenrir-headset | affable light mid voice through a headset mic, streamer patter | 123.5 Hz · 10.0 st | 1.03 |
| MADA | 2 (1.9 s) | `am_adam` · b-adam-grey | neutral, muted-grey mid baritone, flat dynamics, a canned courteous non-answer | 131.2 Hz · 8.8 st | 0.98 |
| MARIO | 2 (3.6 s) | `am_liam` · a-liam-earnest | earnest mid baritone, lecture mic with a rolled-off top; his short stops are the joke | 131.7 Hz · 13.9 st | 1.01 |
| TASYA | 4 (6.8 s) | `am_eric` · b-eric-warm | warm, soft-onset light baritone with a smile in the air band, gently amused; no accent colour | 136.2 Hz · 10.7 st | 0.91 |
| GERG MOCKBRAN | 3 (3.7 s) | `am_puck` · a-puck-quick | bright quick tenor-baritone, dry laptop-room close mic, sunny and literal, fastest in the act | 137.0 Hz · 7.7 st | 1.17 |
| TILED EMPLOYEE | 1 (0.9 s) | `af_nova` · a-nova-plain | plain clean mid female voice, earnest question | 137.4 Hz · 7.5 st | 1.20 |
| NELEH | 10 (13.4 s) | `af_aoede` · c-aoede-precise | cool, even mezzo, crisp consonants, precise and polite; questions barely lift | 172.6 Hz · 7.4 st | 0.98 |
| ADELINA | 1 (1.4 s) | `af_bella` · a-bella-warm | warm, brisk mezzo, close and dry, kind finality | 178.2 Hz · 4.3 st | 1.27 |
| RIMA TAMURI | 1 (1.2 s) | `af_heart` · a-heart-composed | composed alto-mezzo with broadcast polish, pleasant, soft landings | 222.6 Hz · 8.3 st | 0.85 |

Silent by design (not recorded): **THE ORB** (sc 26A, 29): non-verbal by canon: its iris, the toast 'rewinding…' and the chime; it never reacts to the V.O.; **MADA** (sc 29): tile avalanche PHRASE 4: '(No line. The stat is the joke.)'; **THE QUIET VOTE** (sc 27/30): camera-off tile, no line; **BUKAJ** (sc 27): toast text only; his plate waits for his real debut; **MAS (portrait)** (sc 27): pass one gives him no portrait window and no V.O.: only posts, the security tile and his voice through their speaker (a4-27-00); **CARD** (sc 28): WHAT THEY DIDN'T KNOW: MM-09x sting on the downbeat, no voice; **MADA (end of pass one)** (sc 27): 27.31 [MCU]: he doesn't answer 'Step four?'; the spinner keeps turning (a4-27-22 is cut).

## 7. Distinctness where voices share a scene

Measured on the delivered 3.2 lines. ΔF0 in semitones; ΔMFCC = distance between mean MFCC 1–12 vectors (different stock packs land at ~20–70, variants of one pack at ~10–17); Δcentroid = brightness difference. MAS / MAS (V.O.) is one man at two distances by design.

| Pair | Scenes | ΔF0 | ΔMFCC | Δcentroid | Read |
|---|---|---|---|---|---|
| ADELINA / ALYI | 27 | 13.2 st | 45.9 | 43% | clear |
| ADELINA / MARIO | 27 | 5.2 st | 30.5 | 33% | clear |
| ADELINA / NELEH | 27 | 0.6 st | 24.6 | 11% | ok (timbre) |
| ADELINA / RIMA TAMURI | 27 | 3.9 st | 30.6 | 30% | clear |
| ADELINA / TASYA | 27 | 4.7 st | 25.4 | 16% | clear |
| ADELINA / TILED EMPLOYEE | 27 | 4.5 st | 24.6 | 54% | clear |
| ADELINA / TTEMME | 27 | 6.3 st | 29.4 | 39% | clear |
| ALYI / MADA | 30 | 7.9 st | 57.8 | 54% | clear |
| ALYI / MARIO | 27 | 8.0 st | 46.7 | 53% | clear |
| ALYI / MAS MANALT | 30 | 5.8 st | 60.9 | 58% | clear |
| ALYI / NELEH | 27 | 12.7 st | 31.5 | 22% | clear |
| ALYI / RIMA TAMURI | 27 | 17.1 st | 62.3 | 51% | clear |
| ALYI / TASYA | 27, 30 | 8.6 st | 42.0 | 42% | clear |
| ALYI / TERB | 30 | 1.5 st | 30.3 | 8% | clear |
| ALYI / TILED EMPLOYEE | 27 | 8.7 st | 44.6 | 7% | clear |
| ALYI / TTEMME | 27 | 6.9 st | 59.2 | 57% | clear |
| GERG MOCKBRAN / MAS MANALT | 29, 31 | 2.9 st | 17.7 | 6% | clear |
| GERG MOCKBRAN / MAS MANALT (V.O.) | 29 | 2.2 st | 16.1 | 8% | **closest: listen** |
| GERG MOCKBRAN / NELEH | 29 | 4.0 st | 35.3 | 72% | clear |
| GERG MOCKBRAN / TASYA | 29 | 0.1 st | 24.9 | 30% | ok (timbre) |
| MADA / MAS MANALT | 30 | 2.1 st | 26.5 | 8% | clear |
| MADA / NELEH | 25 | 4.7 st | 40.4 | 69% | clear |
| MADA / TASYA | 30 | 0.6 st | 34.7 | 27% | ok (timbre) |
| MADA / TERB | 30 | 6.4 st | 56.1 | 101% | clear |
| MARIO / NELEH | 27 | 4.7 st | 38.0 | 66% | clear |
| MARIO / RIMA TAMURI | 27 | 9.1 st | 30.0 | 5% | clear |
| MARIO / TASYA | 27 | 0.6 st | 32.2 | 25% | ok (timbre) |
| MARIO / TILED EMPLOYEE | 27 | 0.7 st | 42.6 | 130% | ok (timbre) |
| MARIO / TTEMME | 27 | 1.1 st | 30.3 | 8% | ok (timbre) |
| MAS MANALT / MAS MANALT (V.O.) | 29 | 0.7 st | 6.2 | 15% | same man, two distances (by design) |
| MAS MANALT / NELEH | 29 | 6.9 st | 43.4 | 83% | clear |
| MAS MANALT / TASYA | 29, 30 | 2.8 st | 32.6 | 38% | clear |
| MAS MANALT / TERB | 30 | 4.3 st | 51.7 | 118% | clear |
| MAS MANALT (V.O.) / NELEH | 29 | 6.2 st | 39.4 | 60% | clear |
| MAS MANALT (V.O.) / TASYA | 29 | 2.1 st | 32.6 | 20% | clear |
| NELEH / RIMA TAMURI | 27 | 4.4 st | 42.6 | 37% | clear |
| NELEH / TASYA | 27, 29 | 4.1 st | 35.5 | 25% | clear |
| NELEH / TILED EMPLOYEE | 27 | 3.9 st | 29.2 | 38% | clear |
| NELEH / TTEMME | 27 | 5.8 st | 40.2 | 45% | clear |
| RIMA TAMURI / TASYA | 27 | 8.5 st | 41.3 | 19% | clear |
| RIMA TAMURI / TILED EMPLOYEE | 27 | 8.4 st | 52.7 | 119% | clear |
| RIMA TAMURI / TTEMME | 27 | 10.2 st | 18.9 | 13% | clear |
| TASYA / TERB | 30 | 7.1 st | 42.6 | 58% | clear |
| TASYA / TILED EMPLOYEE | 27 | 0.2 st | 31.7 | 84% | ok (timbre) |
| TASYA / TTEMME | 27 | 1.7 st | 35.5 | 27% | clear |
| TILED EMPLOYEE / TTEMME | 27 | 1.8 st | 47.3 | 60% | clear |

## 8. Key lines: takes and picks

Kokoro-82M's timing and melody are deterministic for a given text, pack and speed (the seed only moves vocoder noise), so takes vary what a director varies: the **context** before the line (a lead-in carrier read in the same breath and cut away at the quietest frame, e.g. "mostly." read straight after "It was a joke."), a **tail** that keeps a final open, a **pace variant** (a take aimed ±5% off), and the **internal stops**. Each take is scored (lower is better) on ASR accuracy and confidence, the final contour the delivery asks for, the character's lane, creak, line-specific terms, and the 3.2 pace terms: span against the target (±10%), the pull toward the aim, compression used, and the longest internal pause. Every term is logged per take in `qa/qa.json` and in each row's `pick_reason`.

| Line | Takes | Delivered | Why (measured) |
|---|---|---|---|
| `a4-26-01` MAS MANALT: super. | 7 | t02 · 0.59 s · 115.9 Hz · range 8.1 st · final −1.5 st | lowest score 0.763 of 7 takes (next t01 at 2.451); terms: asr_conf 0.713, span_aim 0.05. ASR: “Super.” |
| `a4-26a-vo1` MAS MANALT (V.O.): i don't keep score. | 6 | t04 · 1.72 s · 122.1 Hz · range 9.4 st · final −0.8 st | lowest score 2.182 of 6 takes (next t06 at 2.798); terms: asr_conf 0.178, range 0.84, understated 1.128, span_aim 0.036. ASR: “I don't keep score.” |
| `a4-27-04` RIMA TAMURI: We'll share more soon. | 5 | t05 · 1.12 s · 222.6 Hz · range 8.3 st · final −4.9 st | lowest score 0.113 of 5 takes (next t01 at 0.14); terms: asr_conf 0.058, span_aim 0.055. ASR: “We'll share more soon.” |
| `a4-27-24` RIMA TAMURI: More. Soon. | 5 | splice · 0.83 s · 191.5 Hz · range 6.8 st · final +0.3 st | lowest score 2.132 of 5 takes (next t02 at 3.57); terms: asr_conf 0.403, final_fall 0.64, contour_match 0.556, range_match 0.3, span_aim 0.233. ASR: “more soon.” |
| `a4-27-15` ADELINA: In plain English: no. | 4 | t03 · 1.29 s · 178.2 Hz · range 4.3 st · final −0.5 st | lowest score 0.261 of 4 takes (next t02 at 0.398); terms: asr_conf 0.238, span_aim 0.023. ASR: “In plain English, no.” |
| `a4-27-16` MARIO: Hi. Yes. We're very worried. How much? | 4 | t01 · 2.27 s · 115.2 Hz · range 15.3 st · final −3.0 st | lowest score 0.478 of 4 takes (next t03 at 0.586); terms: asr_conf 0.383, span_aim 0.095. ASR: “Hi, yes, we're very worried, how much?” |
| `a4-27-19` TTEMME: Chat… for how long? | 8 | t07 · 1.26 s · 123.5 Hz · range 10.0 st · final +1.0 st | lowest score 0.309 of 8 takes (next t05 at 2.059); terms: asr_conf 0.217, span_aim 0.092. ASR: “Chat for how long.” |
| `a4-29-vo2` MAS MANALT (V.O.): the badge was a joke. | 6 | t03 · 1.81 s · 106.9 Hz · range 9.1 st · final −2.3 st | lowest score 2.972 of 6 takes (next t02 at 3.281); terms: asr_conf 0.153, range 0.66, understated 1.092, vo_wpm 1.05, span_aim 0.017. ASR: “The badge was a joke.” |
| `a4-29-03` MAS MANALT: mostly. | 9 | t07 · 0.65 s · 105.6 Hz · range 5.8 st · final +0.7 st | lowest score 2.33 of 9 takes (next t04 at 3.422); terms: asr_conf 0.874, final_fall 0.96, tsm 0.496. ASR: “mostly.” |
| `a4-29-vo3` MAS MANALT (V.O.): gerg never waits to be asked. | 6 | t05 · 2.45 s · 120.7 Hz · range 8.8 st · final −2.9 st | lowest score 2.013 of 6 takes (next t04 at 2.054); terms: asr_conf 0.307, range 0.48, understated 1.056, vo_wpm 0.1, span_aim 0.07. ASR: “Gerg never waits to be asked.” |
| `a4-29-08` MAS MANALT: leave it open. | 4 | t03 · 1.11 s · 115.9 Hz · range 10.5 st · final +0.2 st | lowest score 1.58 of 4 takes (next t01 at 1.819); terms: asr_conf 0.337, range 0.3, final_fall 0.56, span_tol 0.3, span_aim 0.083. ASR: “Leave it open.” |
| `a4-30-03` MAS MANALT: hi. | 5 | t01 · 0.47 s · 118.6 Hz · range 4.8 st · final −3.7 st | lowest score 0.895 of 5 takes (next t05 at 3.179); terms: asr_conf 0.762, span_aim 0.133. ASR: “Hi!” |
| `a4-30-04` TASYA: Hello. | 4 | t01 · 0.61 s · 129.7 Hz · range 7.1 st · final −0.6 st | lowest score 0.842 of 4 takes (next t04 at 0.857); terms: asr_conf 0.732, lane 0.06, span_aim 0.05. ASR: “Hello.” |
| `a4-30-06` TERB: …Ah. | 3 | t01 · 0.41 s · 90.6 Hz · range 9.1 st · final −3.2 st | lowest score 1.617 of 3 takes (next t02 at 13.541); terms: asr_conf 0.742, span_aim 0.075, tsm 0.8. ASR: “Ah.” |
| `a4-30-07` TERB: Terms? | 4 | t03 · 0.53 s · 86.9 Hz · range 11.6 st · final +0.8 st | lowest score 1.833 of 4 takes (next t01 at 2.177); terms: asr_conf 0.693, final_rise 0.16, span_aim 0.18, tsm 0.8. ASR: “terms.” |
| `a4-30-08` MADA: Good question. | 6 | mada-good-question t02 · 0.86 s · 131.2 Hz · range 8.8 st · final −0.2 st | the master read (one canned answer for both lines), chosen as a pair with MAS's echo a4-30-09 t06: contour r 0.828, pair score 6.95. ASR: “Good question.” |
| `a4-30-09` MAS MANALT: good question. | 6 | t06 · 0.99 s · 102.6 Hz · range 8.8 st · final +1.3 st | lowest score 2.418 of 6 takes (next t03 at 2.852); terms: asr_conf 0.322, final_fall 1.44, lane 0.6, span_aim 0.056. ASR: “Good question.” |
| `a4-30-12` MAS MANALT: okay. | 10 | t05 · 0.57 s · 124.5 Hz · range 8.4 st · final −6.2 st | lowest score 0.15 of 10 takes (next t09 at 0.15); terms: span_aim 0.15. ASR: “Okay” |
| `a4-31-02` MAS MANALT: it's a preview. | 4 | t01 · 0.99 s · 112.2 Hz · range 9.5 st · final +0.7 st | lowest score 1.361 of 4 takes (next t03 at 2.021); terms: asr_conf 0.151, final_fall 0.96, span_aim 0.25. ASR: “It's a preview.” |

Alternates are kept in `takes/<id>/` for these lines and listed best-first in `alt_takes` (the fallback's in `fallback.alt_takes`), so the ear pass can swap one in without re-recording. Other lines keep only the delivered take; every take's numbers are in `qa/qa.json`.

## 9. `lines.json` and mouth cues

A list in draft 3.2 script order (voiced lines and the post pop-ups between them). Paths are relative to the repo root. **Filter the cut on `voiced_in_cut`** (or `kind != 'post'`); pop-up rows point at `optional/`.

```
{id, scene, speaker, speaker_slug, text, spoken_as, delivery, tag, mode, voiced_in_cut, on_camera,
 kind       'dialogue' | 'vo' | 'post'
 side       'left' | 'right' | 'none'   portrait window: 'none' everywhere in 3.2 except ALYI's post in the 30.01 [P2] box ('right')
 pov        'his' | 'board'
 shot, shot_id, cue                     the 3.2 shot (tag + framing) and 'shot, beat n' where the line starts (tighten-changes §2/§5)
 lip_sync, status                       status: new | changed | retake-pace | rederive | restaged | moved | unchanged
 target_span_s, voiced_span_s, span_vs_target
 pace {words, wpm, speed, speed_start_32, speed_31, tsm, aim_s, target_s, longest_internal_gap_s, audible_in_s, audible_out_s}
 overlap_prev_s?, overlap_prev_frames?, overlap_with?, overlap_place_at_s?, overlap_anchor?   (marked overlaps, §3)
 gap_prev_s?, gap_with?, gap_place_at_s?                                                  (fixed gaps, §3)
 cutoff? {type, ends_on, note}  ·  sync? {word: {t0, f0, t1, f1}}   (the stamp's 't' of 'gets', 'Three'/'Four', 'asked', 'below/above/around')
 file (wav), mp3, duration_s, frames_24, take, takes_tried, pick_reason, alt_takes?,
 voice, voiceId, model, processing[], mouth[{t,f,shape}], words[{w,t0,t1,f0,f1,ph}],
 qa{lufs_i, target_lufs, true_peak_dbtp, clipped_samples, median_f0_hz, f0_range_st, final_move_st, wpm, asr, cer, logprob, align_median_s,
    pace_ref? span_vs_oncam? (V.O.) · below_ref? st_vs_ref? · contour_r_vs_*?},
 popup_hold_beats? popup_note? (posts) · master? / pair? (the calm-off) · fallback? (a4-26a-vo1) · derived_from? + clean? (a4-27-00; a4-27-23 has clean? only)}
```

**Mouths.** `lip_sync: true` only where the speaker's mouth is drawn in the 3.2 shot: the `[MCU]`s and `[MCU·door]`s, the reflections, the wides where the speaker acts (ADELINA, TASYA's landlord, TERB's "…Ah."), the call's two-up (NELEH), Gerg's tiles and NELEH's avalanche tile, and ALYI in the one box. `mouth: []` for the V.O., O.S. lines (TASYA ×2, TERB's "Terms?", NELEH's "Step four?"), the laptop line, and the two lines over a silhouette or an insert: "super." (the 26.09 `[OTS]`), NELEH's "When?" (over her silhouette into the table cut) and "okay." (over his hands). THE PLAN's figures and the all-hands employee keep cues with `lip_sync: false`. Every voiced row has new cues from its new take; the method is unchanged (Kokoro's word timings carried through every edit, misaki phonemes → the portrait set A / E / O / M / rest / smile, held on 2s). Word tracks now carry each word's phonemes (`ph`).

## 10. House rules applied

Unchanged from 3.1:

- **Never clone, never mimic.** Stock Kokoro packs or averages of them only; every brief was written from the character file's persona and comic function, never from the real person's voice (script header; guardrails §5 'Voices'; CASTING.md §0).
- **No accent humour; no age, health or disability coding.** Every voice is a General-American pack. A creak/fry detector runs on every take and penalises it.
- **The V.O. is Mas's alone and never heard in the world.** Same performer, closer; every line [INVENTED], tagged with its device, lowercase. "mostly." answers the Orb's look, not the V.O.
- **A voice on their call, never a caption.** In pass one Mas is heard only through the board's laptop speaker, processed from the line he already said on his side.
- **Tags travel with the audio.** [V] lines are spoken verbatim with the parody-name swap; [V/K] (TASYA 'below/above/around') and GERG's re-fetch flags are carried, not resolved. The four new THE PLAN lines are [INVENTED] (the board describing its own public structure).
- **Posts are pop-ups, never speeches.** The 7 posts are unvoiced (`kind: post`); the spoken ones (TASYA's read-aloud post, ALYI's post from the doorway, Mas's memo) are `kind: dialogue`.
- **Mas's text stays lowercase** in `text`; pronunciation overrides live in `spoken_as` only (ALYI → /ˈælji/ 'AL-yee', gerg → hard G).

## 11. Briefs and auditions (pass 1, unchanged)

Unchanged since pass 1 (no casting changes in draft 3.1 or 3.2; the §3 pace brief of tighten-changes replaces each role's pass-1 'Pace' line). Written performer-first, like CASTING.md §1, from each character file's persona and comic function. Three stock candidates each (TTEMME got two more in round 2), read DRY on the role's real Act Four lines. Audition files: [`../../../../../audio/ep01/act4/dialogue/auditions/<role>/`](../../../../../audio/ep01/act4/dialogue/auditions/) (reel pings = candidate index). Numbers from `auditions/auditions.json` (round-1 tracker; the delivered lanes in §2 are re-measured).

#### NELEH
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

#### MADA
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

#### TERB
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

#### TASYA
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

#### TTEMME
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

#### ADELINA
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

#### TILED EMPLOYEE
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

## 12. For the next stage

**THE EDITOR (re-lock as `timing-v3`).** Lay each file at its cue (`cue`), and use `overlap_place_at_s` / `gap_place_at_s` where they're set: those are already in the previous WAV's clock. Cut-offs end on the cut: lay the next sound on the file's end. Word frames for picture sync are in `sync` and `words`. Every on-camera and O.S. take is within ±10% of the span the board was timed to except two, and neither needs a cut to move:
- `a4-27-14` MARIO "I've written up some thoughts—" is 1.23 s against 1.60 s. The target doesn't fit its own shot: 27.22a is 2 beats, the line starts on beat 1.4 and ADELINA comes in 3 f into 'thoughts', 2 f before the cut. That leaves about 1.1–1.2 s for the line, and this read (at MARIO's speed floor) fits it. A 1.6 s read would push ADELINA, and the cut, about half a second late.
- `a4-29-08` MAS "leave it open." is 1.11 s against 1.00 s (+11%, one frame past the band). It's his 8%-long aim and the take with the most level final. 29.17 is a bar long, so nothing moves.
- The three V.O. lines run 13–23% over their targets by design (§4). Each stays inside the slot its clearances leave, so no cut moves.

**Listen first.** The picks are measured, not heard. The ear pass should confirm or swap (alternates in `takes/`): the pace as a whole (does anything now sound hurried rather than brisk?), the cut-offs (a stop, not a glitch), the overlaps laid as §3 places them, the three V.O. lines as a set, "More. Soon." against "We'll share more soon.", NELEH's call filter, the calm-off pair a beat apart, and the one-word Mas lines.

**V.O. pace needs the POV owner's sign-off** (script ruling 7, §4). The delivered V.O. is paced to the wpm band (×1.22–1.31 of his on-camera read). The ruling's own ratio (×1.05–1.10) is already recorded: `takes/<id>-x108/`, with the pick in `pick.json`. If the owner rules for the ratio, swap those three files in; they're shorter, so no cut moves.

**Mix notes** (all dialogue is dry; rooms and treatments are yours):
- **Sound under every stretch without voice** (tighten-changes §6): the v2 animatic was dialogue-only and played its set-pieces as dead air. The dialogue stem here has the same holes by design (the reel's silences in §3); the temp score and SFX fill them.
- **Overlaps are two dry files summed.** Keep both intelligible: the second voice rides ≈ 2 dB under where §4 says so (NELEH on the call is already delivered 2 LU under); nothing ducks the first line's tail. No music under a real line or a card.
- **MAS (V.O.)** −18 LUFS, lifted +2 dB in the premix (§3 levels); dry and close, no room. No sting or swell under any V.O. line.
- **`a4-27-00`** at its delivered −22 LUFS under the call's room tone. **`a4-26-01`** is the live mic on his side: keep it fuller than the laptop copy.
- **ALYI:** his CASTING hall as a send (room 0.8, damp 0.6, ~12% wet, 35 ms pre-delay, send HPF 200 Hz), low in the reflections and the doorway box.
- **TASYA (O.S.)** "Everyone is welcome." behind the door (low-pass plus a little room), ≥ 1 beat after the V.O., no music under either; "leave it open." overlaps its tail. "Hello." from the floor.
- **GERG on the monitor:** a small-speaker EQ, a different speaker from the board's laptop. His keys continue under MAS's overlap.
- Gaps inside lines are digital silence (pause edits): lay room tone under all dialogue.

**Flags:**
- **Finals that miss or only just meet the direction** (a Kokoro limit at these speeds; alternates in `takes/`): `a4-27-05` Is this a coup? ends −0.2 st (asked for: a lift on 'coup?'); `a4-29-08` leave it open. ends +0.2 st (asked for: even and falling); `a4-31-02` it's a preview. ends +0.7 st (asked for: pleasant and flat, level or falling); `a4-30-09` good question. ends +1.3 st (asked for: Mada's melody, level); `a4-29-03` mostly. ends +0.7 st (asked for: level or gently falling). "Is this a coup?" stayed level or fell on all 11 takes, including slower reads compressed back to length. The 3.1 take that lifted was 24% longer than the 3.2 target.
- **"okay."** now settles (−6.2 st), read with a tail (". Fine.") cut away. Every read without a tail (18 across two passes, plain, after a carrier, or slower and compressed) rose, which turned it into a question. Check that the fall isn't too final.
- **Time-compression** (Rubber Band R3, formants kept) is on `a4-29-03` mostly. (×1.06), `a4-30-06` …Ah. (×1.10), `a4-30-07` Terms? (×1.10). TERB's two are at his speed clamp (am_echo still reads one-word lines long at 1.375). "mostly." is a slower read brought back to length, because it was the take that sat under the V.O. Check each for smearing; if one smears, `takes/` has uncompressed alternates.
- `am_michael` (MAS) and `am_adam` (MADA) remain less periodic than the rest (a slightly husky grain; pYIN is gap-filled from YIN). `am_adam` is Kokoro's lowest-graded pack (F+).
- The act's closest pairs are listed in §7; if one blurs by ear, the 3.1 remedies still apply (MADA to another master take; TTEMME to `e-liam-headset`).

