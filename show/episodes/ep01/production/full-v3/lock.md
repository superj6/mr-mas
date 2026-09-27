# Ep1 v3: the stick lock (`v3-lock`, 2026-09-27)

> **Status: FINAL LOCK (2026-09-27, after the lead's rulings).** Tracks S2 (takes) and S3 (the lock) of [PLAN.md](PLAN.md), under the showrunner's "just do a full episode attempt with your best judgement". The downstream passes (pixel shots, score, voices) start from this lock.
>
> **The lead's rulings on the first lock:** J-cuts close the gap after the line (§4.4); keep the reading of the hold numbers (§4.5, 13 beats); T1 restored (no trim is applied); the Senate line's "in" and the outro's −1 dB go to the showrunner's ear.
>
> **Nothing here was watched or heard.** Every number below is measured from the files (the timelines, the takes' own measurements, the mixer's QA, the render's sidecars). Whether a cut plays, or a take sounds natural, needs a person.
> Nothing was committed.

**The files:**

| What | Where |
|---|---|
| **The lock** (six dialogue-reel timelines) | `show/reel/ep01-v3/ep01-v3-{coldopen,act1,act2,act3,act4,tag}.json` |
| **The episode manifest** (key `ep01-v3-stick`) | `show/reel/ep01-v3/ep01-v3.manifest.json` (the studio shows it as `reel-ep01-v3`) |
| **The stick reel** | `out/ep01/reel/ep01-v3-stick.mp4` (+ `-chapters.json`, `-measure.json`); work files in `studio/out/reel-work/ep01-v3-stick/` |
| The builder (one, generic) | `audio/reel/ep01-v3/build_timeline.py` → the timelines, the manifest, `audio/reel/ep01-v3/lock-report.json` (every edit and deviation, per beat) |
| The stick sound | `audio/reel/ep01-v3/bed.py` → `audio/reel/ep01-v3/<seg>-bed.wav` + `-bed-qa.json` (card + six segments) |
| Measurements, transcript | `audio/reel/ep01-v3/measure.py` → `audio/reel/ep01-v3/measure.json`, [lock-transcript.txt](lock-transcript.txt) |
| **The takes** | `audio/ep01/v3/<seg>/lines-v3.json` (every v3 take of the segment) with `wav/`; fastrec's own `lines.json`, `qa/`, `log/` beside it; the plan and recorder `audio/ep01/v3/takes.py`, `audio/ep01/v3/record.sh` |

---

## 1. Runtime

Story time (the lock's frames; the intro, the card and the outro are episode time):

| Segment | v2 story | Plan estimate (notes §1.1) | **v3 lock** | vs estimate | vs v2 |
|---|---|---|---|---|---|
| Cold open | 0:30.2 | 0:30.7 | **0:30.7** | +0.0 | +0.5 |
| Act One | 5:59.7 | 5:23.3 | **5:22.5** | −0.8 | −37.2 |
| Act Two | 3:39.8 | 3:22.6 | **3:24.7** | +2.1 | −15.0 |
| Act Three | 2:33.7 | 2:06.8 | **2:08.0** | +1.2 | −25.6 |
| Act Four | 8:38.5 | 8:40.6 | **8:43.8** | +3.2 | +5.3 |
| Tag | 0:40.6 | 0:33.9 | **0:33.9** | −0.0 | −6.8 |
| **Story** | **22:02.4** | **20:37.9** | **20:43.6** | **+5.7** | **−1:18.8** |

- **Against the target (about 20:38; 19:45–20:45 is fine): 20:43.6, inside the band, 1.4 s under its top. No §1.3 trim is applied.**
- **How it got there:** the first lock ran 20:46.7, so it took T1 (S5.08, Gerg's share-sale line, −2.3 s) to land at 20:44.4. The lead then ruled that J-cuts close the gap after their line (−3.1 s: 5.03 −1.0, 7.01 −2.1) and restored T1 (it explains the check for a newcomer). That gives 20:43.6, so no trim is needed; T2–T7 are unused.
- **The episode is 21:25.8:** the story, the 30 s intro, the 2 s filename card and the Orb outro (10.125 s). The reel adds its own 3 s title slate (21:28.8).
- **Where the lock differs from the estimate** (it sets frames from the takes): 11.03 +2.1 s (the V.O. introducing Mario is 4.6 s and has to finish before his 6.6 s memo starts), 13.01 +2.0 s (the White House read is 5.9 s with its pause), S7.07 +1.0 s (Terb's re-read is as long as the old take), S7.02 +0.9 s, S4.02 +0.9 s, 20.06 +0.9 s. Several beats came in under their estimate (7.01 −2.5 with its J-cut, 5.03 −1.2, 15.07 −0.8, S5.09 −0.7).

## 2. Pacing against v2

`python3 studio/src/reel/tools/pacing.py` on the six v2/v5 timelines and on the six v3 ones (the v2 tag includes its 12 s outro placeholder; the v3 tag doesn't):

| | v2 | **v3 lock** |
|---|---|---|
| Shots · ASL · median shot | 261 · 5.1 s · 3.4 s | **228 · 5.5 s · 3.9 s** |
| Places (stays) · median stay | 53 · 12.7 s | **50 · 12.3 s** |
| Stays under 10 s / 10–30 / 30–60 / 60 s+ | 25 / 11 / 13 / 4 | **23 / 10 / 12 / 5** |
| Talk stays (8 s or more) | 30 | **31** |
| Entry air, median (cut-in to the first audible word) | 3.8 s | **3.7 s** |
| Entry air 2 s or less | 7 | **11** |
| **Entry air counting spoken lines only** (Mas's V.O. left out) | 3.8 s median, 7 at 2 s or less | **5.3 s median, 7 at 2 s or less** |
| **Exit air, median** (last word to the cut-out) | 2.1 s | **2.8 s** |
| Exit air 1.5 s or less | 13 | **10** (9 counting spoken lines only) |
| Lines · J-cuts (a line under the outgoing shot) · L-cuts (a line over the next shot) | 226 · 0 · 6 | **228 · 2 · 6** |
| Mas's words · share · inner-voice lines (words) | 243 · 13.6 % · 3 (12) | **396 · 22.0 % · 24 (185)** |

- **The arrivals are there, and the tool hides them:** it counts the V.O. as the first word, and the plan puts Mas's voice inside several arrivals on purpose (13.01 at 1.0 s, S1.01 at 1.8 s, S1.06 at 0.4 s, 22.02 at 1.3 s). Counting spoken lines only, the median entry air goes from 3.8 s to **5.3 s**. The other short entries are 7.01 (the J-cut, −0.6 s) and the v2 ones that stay (1.01, 21.02, S3.06, S4.02, S5.11, S8.08).
- **The aftermaths are there:** exit air median 2.1 → **2.8 s**, and the stays that cut out within 1.5 s of the last word drop from 13 to 10. The ones left: 12.02 (0.7 s, new: its stay now ends on Nole's last word because the EMIT page is cut; the pen's scratch leads the cut, as the plan asks), 20.02, 22.01, S2.04, S3.02, S4.08, S5.08, S7.01, S7.05, S8.08.
- **Scenes are still short:** the median stay barely moves (12.7 → 12.3 s). The cuts took whole short stays (Sydney, the crate, the hands runner, the EMIT page) and the reinvestment went into the long ones, so the count of places drops only from 53 to 50. The pacing comparison's 50–75 s scenes are an outline question, not a lock one.

## 3. The takes (S2)

**27 v3 takes are in the lock:** 21 recorded here, 6 reused from the v3 sample. Plus the two kept v2 V.O. takes (`e1-a3-18-04`, `a5-26a-01`, now v3-vo-14 and 19), which stay under their own ids in their beats. All fastrec (Kokoro-82M stock voices, the house method), `--workers 2`, through `ops/heavy.sh`: 21 lines in about 2 min of wall, 0 file problems.

| Id | Seg | Who | Take | Speed | Voiced s | wpm | syll/s (guide) | Flags left |
|---|---|---|---|---|---|---|---|---|
| v3-vo-01 | act1 | Mas V.O. | **re-read** (the sample's read "jerg", "AL-ih-ee") | 0.87 | 5.80 | 176 | 4.13 (3.4–4.0) | — |
| v3-vo-02 | act1 | Mas V.O. | reused v3s-11 | 0.915 | 1.24 | 194 | 3.23 | — |
| v3-vo-03 | act1 | Mas V.O. | reused v3s-02 | 0.87 | 3.17 | 208 | 3.73 | — |
| v3-vo-04 | act1 | Mas V.O. | **re-read** (the sample's "AL-ih-ee"); 0.85 after a first read at 4.5 syll/s | 0.85 | 5.05 | 143 | 4.42 | — |
| v3-vo-05 | act1 | Mas V.O. | reused v3s-04 | 0.915 | 1.91 | 220 | 3.66 | — |
| v3-vo-06 | act1 | Mas V.O. | reused v3s-05 | 0.915 | 1.21 | 99 | 3.31 | — |
| v3-vo-07 | act1 | Mas V.O. | reused v3s-06 | 0.915 | 1.11 | 162 | 3.60 | — |
| v3-vo-08 | act1 | Mas V.O. | new | 0.87 | 2.87 | 146 | 3.69 | — |
| v3-vo-09 | act1 | Mas V.O. | new | 0.88 | 0.79 | 152 | 2.53 | — |
| v3-vo-10 | act1 | Mas V.O. | new | 0.87 | 4.59 | 183 | 3.95 | — |
| v3-vo-11 | act2 | Mas V.O. | new | 0.87 | 5.92 | 122 | 3.68 | — |
| v3-vo-12 | act2 | Mas V.O. | new | 0.88 | 1.12 | 161 | 2.68 | pace: slow for its guide (a 3-syllable line; "i don't keep score." was 2.41 and kept) |
| v3-vo-13 | act2 | Mas V.O. | new | 0.87 | 2.40 | 175 | 4.17 | — |
| v3-a2-0001 | act2 | Mas | new; re-read at 0.88 after an ASR flag at 0.90 | 0.88 | 2.25 | 160 | 4.44 (3.6–4.2) | ASR heard "in" as "and" (and "NopeAI" as "no pay I", a name): **for an ear** |
| v3-vo-15 | act3 | Mas V.O. | new | 0.87 | 4.29 | 154 | 4.16 | — |
| v3-vo-16 | act3 | Mas V.O. | new | 0.87 | 3.41 | 141 | 3.96 | — |
| v3-vo-17 | act4 | Mas V.O. | new | 0.87 | 3.34 | 162 | 4.10 | — |
| v3-vo-18 | act4 | Mas V.O. | new, whole (replaces v3s-07, which was flagged at 4.89) | 0.85 | 4.76 | 151 | 4.43 | — |
| v3-vo-20 | act4 | Mas V.O. | reused v3s-08 | 0.915 | 4.65 | 155 | 3.70 | (the sample's ASR flag on "406": numbers, not a misread) |
| v3-vo-21 | act4 | Mas V.O. | **re-read** (the sample's "jerg") | 0.88 | 2.24 | 134 | 3.74 | — |
| v3-vo-22 | act4 | Mas V.O. | new | 0.87 | 1.91 | 188 | 3.66 | — |
| v3-vo-23 | act4 | Mas V.O. | **re-read** (the sample's "jerg") | 0.88 | 1.87 | 192 | 3.74 | — |
| v3-vo-24 | tag | Mas V.O. | new; 0.85 after a first read at 4.38 | 0.85 | 1.42 | 211 | 4.23 | — |
| v3-a4-0001 | act4 | Tasya | new, whole (the statement's second sentence) | 0.92 | 9.10 | 185 | 4.82 (3.8–4.4) | — |
| v3-a4-0002 | act4 | Tasya | new; re-read at 0.88 after 5.07 syll/s at 0.92 | 0.88 | 4.24 | 170 | 5.00 | over the guide, like every v5 Tasya take (5.2–5.3) |
| v3-a4-0003 | act4 | Tasya | new; **four whole reads joined in room tone** at 0.85 (`{s…}`), after one read measured 5.56–5.66 syll/s with two pause-in-voice flags | 0.85 | 6.93 | 156 | 4.45 | — |
| v3-a4-0004 | act4 | Terb | new, whole (without "so nobody's surprised") | 1.02 | 10.60 | 209 | 5.66 (4.4–5.0) | as the v5 take (5.67) |

- **The V.O. direction** (mas-inner-voice §9: close, dry, unhurried): the V.O. preset (`a-michael-close`, −18 LUFS, dry), speed 0.85–0.88, and 0.35–0.5 s pauses opened between sentences. Multi-sentence lines measure 122–183 wpm with the pauses, against the guide's 110–130; the stock voice at these speeds doesn't go slower without leaving its band. Short lines measure high in wpm because they have no pause to average in.
- **Pronunciations** are the cast lexicon's IPA (`audio/voices/cast.json`, which matches naming.md): gerg /ɡɜɹɡ/, alyi /ælji/, Mas /mɑs/, Mockbran, Yrral.
- **Kokoro's speed barely moves articulation** for Tasya's voice: 0.92 → 0.88 changed 5.07 → 5.00 and 5.66 → 5.56 syll/s. Splitting the podcast line into whole reads fixed it; the invented line (0002) was left at 5.0, where every v5 Tasya take already sits.

## 4. How the plans were applied, and every deviation

The builder applies each beat plan generically (its docstring has the rules). The lead's sample builder is the reference: `vo_line`, `shift` (a V.O. after a line pushes what follows by its length and gap), the J-cut as a negative `t`, name reveals from Mas's words, plates cut, side badges removed. Every source beat, line and V.O. of the six plans is applied; `lock-report.json` lists every edit per beat.

**Deviations from the beat plans, and why:**

1. **No trim.** The first lock applied T1 (it ran 20:46.7); the lead restored it, and with the J-cut gaps closed the story fits at 20:43.6. The builder keeps the ranked trims as switches (`V3_TRIMS=T1`), off.
2. **Four sample takes re-read, although their text is identical** (v3-vo-01, 04, 21, 23): they say "gerg" as /ʤɜɹɡ/ and "alyi" as /ælɪi/, against the registry. The other six are reused.
3. **The three changed quotes were read whole, not cut from their old takes** (v3-a4-0001, 0003, 0004; notes §8 suggested cutting). Nobody can listen to judge a splice; a whole read in the same voice and speed is the safer stand-in.
4. **J-cuts close the gap (the lead's ruling).** The line starts lead_s under the outgoing shot, and the lines and timed items after it move up by the same amount, so the conversation keeps the rhythm its takes were read at; the beat shortens to match. 5.03: Gerg from 0.5 to −0.5 s, the beat 13.0 → 12.0 s, Gerg → Rima still 0.35 s. 7.01: Rima from 1.5 to −0.6 s, the beat 9.8 → 7.7 s, Rima → "it's the bill." still 0.8 s. (The first lock followed the sample, which moved the line alone and left pauses of 1.35 s and 2.9 s.) This is where the lock differs from the sample's method.
5. **Where `hold_after_s` / `arrive_s` disagree with the plan's own `est_s` and "why"** (the beat's audio unchanged), the lock follows `est_s` (the "+X s" the why states); the lead ruled to keep this reading. The plan's hold numbers look like they were written as the added time in some beats and as the whole tail in others. **The 13 beats:**

   | Beat | Plan field | Lock |
   |---|---|---|
   | 5.09 | hold 1.5 | tail 2.02 (+1.5 as the why says) |
   | 9.10 | arrive 2.2 | first line at 3.60 (+1.0) |
   | 9.13 | hold 1.4 | 2.71 (+1.0) |
   | 13.14 | hold 1.5 | 2.87 (+1.0) |
   | 18.06 | hold 1.0 | 2.50 (+1.0) |
   | 22.03 | hold 1.4 | 2.12 (+0.8) |
   | S1.12 | hold 3.0 | 3.43 (2.2 → 4.6 s, the sample's) |
   | S3.07 | hold 1.6 | 2.48 (+0.8) |
   | S4.07 | hold 1.0 | 2.10 (unchanged) |
   | S5.07b | hold 4.2 | 3.38 (3.5 → 6.0 s, the sample's) |
   | S5.12 | hold 4.4 | 3.87 (2.9 → 5.5 s, the sample's) |
   | S7.01 | arrive 2.7 | +1.5 at the head; the post pops at 2.7, the first line at 9.70 |
   | S8.05 | hold 1.5 | 1.82 (+0.8) |

   Where a beat's last sound is new (a V.O. at the end), `hold_after_s` is the exact hold after it (5.02, 5.11, 7.01, 20.06, S1.06), as in the sample.
6. **1.01's "the hall under black before the first frame"** is a new 0.5 s black beat `1.00` in front of 1.01 (a stick shot can't be black for part of itself); 1.01 keeps its v2 length, so the cold open is the plan's 30.7 s.
7. **A V.O. at `start+S` in a beat with lines** pushes the first line only as far as it must (to 0.5 s after the V.O.): 11.03 (Mario's memo from 2.3 to 5.9 s) and 13.11, S5.09, S5.09-back. In a beat with no lines the beat is the longer of `est_s` and S + the V.O. + its hold (0.6 s unless the plan sets one).
8. **A beat whose every line is replaced keeps `est_s` as a floor** (6.01: the counter's musical phrase stays 5.0 s; S7.02b: 8.58 s, which leaves 1.4 s after "around them."). Without it, 6.01 would have shrunk to 3.7 s.
9. **Things that start with a dropped plate or text go with it:** the name reveals of Noterb (16.01) and Notnih (17.01, "Ep3 introduces him"); the "blackmail" stamp (16.01); the Nozama call's ring (S4.08, C14); the `catching up` toast's click (19.01). Not the tag's THUD, which starts with the dropped `UI: Look at glass of water` (a device overlay only marks the action).
10. **Mas's voice names someone before their plate:** Mario is now named at "mario" (11.03, 0.8 s), not at the plate (5.9 s). Everyone else his voice names was already named.
11. **The safety net** (script-v3-notes §4) caught one: 21.03's rail also read `· EO 14110` (the plan listed only 21.02's).
12. **S7.02b's caption** quoted the dropped "Oh, we'd be fine."; it now reads "Then the record: below, above, around. The floor, ceiling and walls turn slate."
13. **Where the plan's `add` / `replace` values are notes**, the lock shows the text itself: 9.01's check (`MACROSOFT · "multiyear, multibillion dollar" · $ MULTIBILLION`, from 2.4 s, after the door strains), 6.06's `RAIL: DEC 5, 2022` (with the million, 0.15 s), 19.11's `MISANTHROPIC`, 11.01's `GTP-4` (from 0.2 s), and S4.11's chat kept as `LIVE · CHAT:  F  F  F  F` (the plan's value was a note: "the F spam as a small egg, no hold").
14. **Sounds that end a lengthened no-line beat keep their place at its end:** S1.06's JOIN click (after "…probably just the budget.") and 22.02's tap (after "…enthusiastic is a lot."), as the captions' "then" says; the sample moved the click the same way.
15. **Merged beats' sounds are kept**, fitted into the target's length (9.01 ← 9.02, 9.03; 9.04 ← 9.05: the pen tick lands as he pockets it, under the V.O.; 16.01 ← 16.05). Their on-screen text isn't carried: the plan's `add` says what's on screen.
16. **Tasya's statement now runs into S4.13e:** the second sentence alone (9.1 s) starts in S4.13 and ends 0.8 s into `MAS · GERG →` (v2's whole statement ended inside S4.13d).
17. **Unchanged beats keep their exact v2/v5 lengths** (not rounded), so their frames are v2's; the cold open's picture is v2's frame for frame after the black.

## 5. The stick sound (temporary)

This reel exists to judge timing and the voice. The score (A1) and the rooms and SFX (A2) come from their own passes.

- **The mixer** (`studio/src/reel/tools/mixer.mjs`) lays all 228 takes (dual mono, −3 dB) and one bed per chapter, ducked −10 dB under speech, with the v2 manifest's settings.
- **Each bed** (`bed.py`) covers exactly its chapter:
  - **rooms** by beat `room`, leading each cut by 0.6 s (or the plan's sound J-cut lead: 13.01 and 18.01 under the act break's black, 5.01 under the card's last 0.6 s, 9.13 → 11.01 0.8 s, S4.15 → the dark room 1.0 s, and so on; `-bed-qa.json` lists each decision) and trailing 0.4 s (or the plan's L-cut: 13.14's room air 1.0 s; Act Four's vault hum 1.5 s into the tag). They're un-ducked under speech, so they dip about 2 dB after the mixer's −10 (the sample's room duck);
  - **the beats' `sounds`**, made by the v2 bed modules (all 104 sound names resolved; none missing), un-ducked as the sample left them; a J-cut naming a beat's own sound moves it earlier (12.01's toast pop 0.4 s, 12.04's pen 0.5 s, S4.01's heart gliss 0.5 s);
  - **music:** the **cold open keeps its v2 stem** (its timing is v2's after the black). **Everywhere else, a quiet temp pad per mood run** of the plan's `music` (the mixer's chord table; major colours for launch night, the lobby, 2 AM and the return; minor for the bill, the pause letter, Vegas and that night), about −31 LUFS un-ducked, ducked 10 dB (launch night 6, 2 AM 8, as the sample); none under the bridge; stopping on the collar's pop, the black of 12.07, the wallet (and back), the bell, THE CLOCK's last step, the Cancel click, Mada's label and the tag's thud; the coda is the vault's F hum. **Act Four's v5 score no longer lines up** with its cut, so it's pads too: a step back from v5's real cues until the score pass lands.
  - **The one silence:** the Cancel click (S1.09) to the phone's buzz (S1.11): rooms and pad out, room tone only (−50 LUFS), as in the sample.
- **The intro and the outro** play their own masters (the intro at −3 dB as in v2; the outro, −16.0 LUFS as mastered, at −1 dB so it sits level with the intro: a proposal for an ear).

## 6. The reel

`out/ep01/reel/ep01-v3-stick.mp4` (the final lock's render; it replaced the first lock's): 1280×720, 24 fps, H.264 + AAC 192k, **21:28.8** (the 3 s title slate + the 21:25.8 episode), 105.6 MB. Rendered with `node src/reel/tools/episode.mjs <manifest> --jobs 2 --conc 4` through `ops/heavy.sh`: 21 segments, **418.5 s of wall** (render 387 s, mix 11 s alongside, mux 26 s).

| Chapter | Starts | Length | Mix, LUFS | Peak, dBFS |
|---|---|---|---|---|
| title slate | 0:00.0 | 3.0 | (silence) | |
| cold open | 0:03.0 | 30.7 | −18.7 | −6.5 |
| intro | 0:33.7 | 30.0 | −16.9 | −4.3 |
| card | 1:03.7 | 2.0 | −37.9 | −26.2 |
| Act One | 1:05.7 | 5:22.5 | −16.9 | −4.7 |
| Act Two | 6:28.2 | 3:24.8 | −16.5 | −4.6 |
| Act Three | 9:52.9 | 2:08.0 | −17.1 | −5.2 |
| Act Four | 12:01.0 | 8:43.8 | −16.4 | −4.4 |
| tag | 20:44.8 | 0:33.9 | −24.5 | −5.6 |
| outro | 21:18.6 | 0:10.1 | −17.0 | −4.2 |

- **Checked:** 30,930 video frames, the plan's count; video and audio both 1288.750 s; the mixer placed all 228 takes and 7 beds with 0 missing files; the whole mix is −16.7 LUFS with a −4.2 dBFS sample peak (the limiter never engaged); the only digital silence of 0.5 s or more is the title slate.
- **Looked at** (four stills of the first lock's render, not the film): 5.02 (the V.O. typing into the strip as `mas (v.o.)`, the figures named as his voice names them), S1.03, the card, the outro's credits (`art · script · music · voices · edit: opus 5.5` / `prompt: jgon`).
- **The transcript** is [lock-transcript.txt](lock-transcript.txt), in the pattern of the v2 stick's [transcript-v2.txt](../stick/transcript-v2.txt).
- **Not heard or watched:** the cuts, the takes, the beds' levels, the pads.

## 7. How to rebuild

From the repo root (the takes only if a line changes):

```sh
python3 audio/ep01/v3/takes.py plan                                   # audio/ep01/v3/<seg>/lines-in.json from the beat plans
bash ops/heavy.sh bash audio/ep01/v3/record.sh [seg ...]              # fastrec --workers 2 (resumes; FORCE="id ..." re-reads)
python3 audio/ep01/v3/takes.py assemble                               # <seg>/lines-v3.json (+ the reused sample takes)
python3 audio/reel/ep01-v3/build_timeline.py                          # the lock + manifest + lock-report.json + the pacing tables
                                                                      #   (no trim by default; V3_TRIMS=T1 applies the first §1.3 trim)
audio/.venv-casting/bin/python audio/reel/ep01-v3/bed.py              # the beds (about 1 min)
cd studio && bash ../ops/heavy.sh node src/reel/tools/episode.mjs ../show/reel/ep01-v3/ep01-v3.manifest.json --jobs 2 --conc 4
cd .. && python3 audio/reel/ep01-v3/measure.py                        # measure.json + lock-transcript.txt
```

- **A beat plan changes:** re-run `_build_beatplan.py --write` (the script pass's), then the builder and the beds. Only the changed chapters re-render (the segments are cached by content).
- **A new take:** add its id to `SAY` in `takes.py` (text, IPA, speed), then plan → record → assemble → build.
- **The pixel pipeline (P0/P2)** reads these timelines as the stick lock; each timeline's `_source.takes_files` lists its takes files for `lock.py --takes`.

## 8. Rulings, and what is still open

**Ruled by the lead (2026-09-27):** J-cuts close the gap (§4.4); the hold numbers follow the plan's lengths (§4.5); T1 restored, no trim; the Senate line's "in" (v3-a2-0001, ASR heard "and") and the outro's −1 dB trim go to the showrunner's ear.

**Still open, for an ear:** v3-vo-12's slow read; Tasya's two new lines (as fast as her v5 takes); v3-a4-0003's four joined reads; the pads' levels (measurement targets, not heard). If the script pass meant `hold_after_s` as the whole tail, the 13 beats in §4.5 would change by about −7 s net.
