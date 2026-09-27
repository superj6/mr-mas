# Pacing: MR. MAS against the reference shows (research, 2026-09-27)

> **Showrunner, 2026-09-27:** "can we compare our pacing to some other related shows we discussed? it is looking alright but it still is pretty quick on transitions and feels like your not fully pulled into a scene"

**What this is:**
- Measured numbers for the reference shows, from Cinemetrics records, two academic studies, and scene-heading counts of the published scripts.
- The same measures on the Ep1 stick reel v2 (22:51).
- What the difference means.

**Trust:** every reference number is tagged **M** (measured, source listed) or **E** (estimate). Cinemetrics entries are single user submissions. Ours are measured from the timelines with `studio/src/reel/tools/pacing.py`.

**Used by:** [the Ep1 stick v3 plan](../../episodes/ep01/production/stick/v3-plan.md), and [flow-and-continuity §2a](../../bible/flow-and-continuity.md#2a-arriving-and-leaving-scenes).

---

## Short answer

- **Our shots aren't fast.**
  - Ep1 v2 averages **5.1 s a shot** (median 3.4 s). Act Four v5 averages 6.2 s (median 4.0 s).
  - That's slower than Veep, Silicon Valley, The Social Network, House of Cards and Fleabag, and close to Better Call Saul.
  - Cutting faster or slower inside a scene isn't the problem.
- **Our scenes are short, and we keep leaving them.**
  - Ep1 changes place about **every 25 s** (53 stays in 22 min).
  - Its 33 numbered scenes average **40 s**.
  - The reference half-hours run about **50–75 s per scene heading** (E). Headings over-count real scenes, so their real scenes run longer still.
  - House of Cards' measured average is **73 s**, and Breaking Bad's is **127 s**.
- **We enter and leave scenes abruptly.**
  - The film studies find a scene usually *opens wider*, tightens on faces, and *eases back* before the cut. Editors of Succession and Fleabag name the starts and ends of scenes as the hardest part of the job.
  - We open on inserts and labels, cut away within 1.5 s of the last word in 13 of 30 talk scenes, and until today couldn't lead a scene with sound at all (0 of 226 lines start under the previous shot).

**So the note is right, and the fix is fewer, longer scenes with real entrances and exits.** Slower shots wouldn't fix it.

---

## 1. Shot length (ASL = average shot length, MSL = median shot length, seconds)

| Title (unit measured) | ASL | MSL | Tag |
|---|---|---|---|
| **MR. MAS Ep1 stick v2 (whole episode, 261 shots)** | **5.1** | **3.4** | ours |
| **MR. MAS Act Four v5 (83 shots)** | **6.2** | **4.0** | ours |
| The Social Network (full film; two counts, about 2,285 shots) | 2.9 / 3.0 | 2.1 / 2.2 | M: C1, C2 |
| The Social Network's opening scene (4.8 min) | 2.5 | 2.0 | M: C3 |
| The Big Short (one submission) | 4.7 | 3.0 | M: C4 |
| House of Cards S1 (8,783 shots, 13 episodes) | 4.4 | – | M: S |
| Better Call Saul 4.10 / 5.10 | 6.5 / 7.4 | 4.6 / – | M: C5, V |
| Breaking Bad (about 40 episodes) | 4.5–8.3 | 2.8–6.0 | M: C6 |
| Fleabag 1.1–1.4 | 4.5–5.5 | 2.9–3.3 | M: C7 |
| Veep S5 (8 episodes; 5.9 is an outlier at 7.8) | 3.2–4.3 | 2.7–3.5 | M: C8 |
| Silicon Valley (two 2016 episodes) | 3.1 / 3.5 | 2.4 / 2.8 | M: C9 |
| BoJack Horseman 1.1 / 3.4 | 4.3 / 4.0 | 3.2 / 2.9 | M: C10 |
| Single-camera sitcoms (whole series) | – | 2.0–2.7 | M: A |
| Simpsons, South Park, Rick and Morty (sample episodes) | 3.0–5.8 | – | M: C11 |

**No measured shot length found** for Mr. Robot, Succession, Barry, Death Note or Kaguya-sama.

## 2. Scene length

| Unit | Result | Tag |
|---|---|---|
| **MR. MAS Ep1 v2: 33 numbered scenes** | **40 s mean, 34 s median** | ours |
| **MR. MAS Ep1 v2: stays in one place** (screens counted as their room) | **53 in 22 min: about 25 s each, 12.7 s median; 25 of them under 10 s** | ours |
| House of Cards S1–2 (1,048 scenes) | 73.2 s average | M: S |
| Breaking Bad S1–5 (1,337 scenes) | 127.1 s | M: S |
| Hollywood films (23-film sample) | a new scene or subscene every 55 s | M: K |
| Friends | about 13 scenes an episode, about 100 s each | E: F |
| Succession 1.1 · Barry 1.1 · Veep 1.1 (script headings ÷ runtime) | about 72 · 73 · 70 s per heading | E: SS |
| Silicon Valley 1.1 · Mr. Robot 1.1 · BoJack 4.11 | about 58 · 52 · 52 s per heading | E: SS |
| House of Cards 1.1 by headings, vs measured | 58 s by headings vs 73 s measured | shows the headings method under-reads real scenes by about 25% |

**By act (ours):** Act Three changes place **5.2 times a minute** (its monitor montage), Act Four 2.6, Act One 2.0, Act Two 1.4.

## 3. How the reference shows enter and leave scenes

- **The general pattern (M: K):** scenes begin with a longer-scale shot, tighten on faces, and lengthen at the end, "when the cinematography often backs off before a cut to a new scene". Shot scale was viewers' strongest cue that a scene had changed.
- **Succession (R, W):** the editor names "the beginning and sometimes the ending of the scene" as the hardest part. Scenes are covered by several cameras and play for minutes; 4.3's phone sequence was one continuous 27-minute take.
- **Mr. Robot (H):** the editor had "to let things pause and let shots play". Jump cuts are set against 3–4 minute takes, and it cuts to black before a key line so the viewer finishes it.
- **Fleabag (D):** the editor spent "half a day or even a day" on how scenes "crash into the next one". Pre-laps put the next scene's sound over her face as she thinks about it. The hard cut mid-word is kept for comedy.
- **The Big Short (B):** jarring cuts on purpose, with montage between scenes. The scenes themselves play whole.
- **The Social Network (MM):** very fast cutting inside long scenes. The depositions are the hub that transitions return to.
- **Better Call Saul (BCS):** holds on people alone, and wide landscapes. "A lot of the pacing is within the script."
- **Barry (BA):** a 45-minute pilot cut down to 30, "cut for story".
- **BoJack (BJ):** gags placed inside the transitions.
- **Kaguya-sama (KG):** three segments an episode, stitched by a narrator.

## 4. What it means for MR. MAS

1. **Keep the cutting speed.** Our shot lengths sit inside the references' range. The v3 fix (flow-and-continuity §2a) is about scenes.
2. **Fewer, longer stays in one place.**
   - A talk scene should run about a minute or more.
   - Stay in the room while it plays. Cutaways must earn their place, or they go.
   - The v3 plan cuts the reference beats that fragment Acts One and Three (about 20 place changes).
3. **Enter wider, leave softer.**
   - Open a new place on the room and its people, not an insert.
   - Hold 1.5–3 s after the last line (4–6 s at big turns).
4. **Lead with sound:** pre-laps and hang-overs. The stick reel can now write them (`t` down to −4 s).
5. **A narrator stitches:** Kaguya's narrator, Mr. Robot's Elliot, Frank's asides. Mas's inner voice can carry us between places the way labels were trying to ([mas-inner-voice](../../bible/mas-inner-voice.md)).

## Sources

- **C1–C12:** Cinemetrics records, `https://cinemetrics.uchicago.edu/movie/<id>`.
  - C1 9b527511-6d0e-4776-916b-3395ce854e35
  - C2 d5190fce-5c57-4151-9523-25b52c94b4b4
  - C3 d7eb7ef7-abc3-4d6f-ab17-bf44001c9e1a
  - C4 f1625fff-42d2-48df-8424-cf0a609a18f6
  - C5 4acae5ff-ac8a-4d8f-a3e8-6f72beba6537
  - C6 e.g. b24f8970-2f8b-443d-9a97-976af0586eed
  - C7 f9ac640b-…, 07d8be7e-…, 93cb5106-…, 5e1555a4-…
  - C8 e.g. 8476cd1d-…, 76d3b90d-…
  - C9 cb223ab5-…, 9c5fb3ae-…
  - C10 d65422ea-…, 0e7f88cc-…
  - C11 8199f917-…, ed8725e1-…, 0d53e8f9-…, 27a9d892-…, 9b79f668-…
  - C12 e.g. 0c062743-…, e10fce75-…
- **S:** https://arxiv.org/pdf/2002.06923
- **A:** https://anthology.ach.org/volumes/vol0003/sitcom-form-function-pacing-production-in-of-u-s/10.63744@yHo626es4FhQ.pdf
- **K:** https://pmc.ncbi.nlm.nih.gov/articles/PMC5133278/
- **V:** https://vashivisuals.com/vashi-frames-better-call-saul-2020-something-unforgivable/
- **P:** https://stephenfollows.com/p/what-the-average-screenplay-contains
- **F:** https://arxiv.org/pdf/1911.00773
- **SS:** https://www.scriptslug.com (the pilots named above; heading counts by the research pass)
- **D:** https://www.provideocoalition.com/art-of-the-cut-with-gary-dollner-ace-editor-of-fleabag-and-killing-eve/
- **H:** https://www.provideocoalition.com/art-cut-mr-robot-editor-philip-harrison/
- **R:** https://borisfx.com/blog/aotc/art-of-the-cut-succession/
- **W:** https://www.thewrap.com/succession-season-4-episode-3-filming/
- **B:** https://slate.com/culture/2015/12/the-big-short-editor-hank-corwin-discusses-the-creation-of-those-crazy-montages-and-what-its-like-to-work-with-adam-mckay.html
- **MM:** https://www.moviemaker.com/angus-wall-kirk-baxter-social-network-edit-20110209/
- **BCS:** https://www.hollywoodreporter.com/tv/tv-news/better-call-saul-skip-macdonald-something-stupid-interview-1144930/
- **BA:** https://www.thewrap.com/bill-hader-barry-season-4-emmys-interview/
- **BJ:** https://slate.com/culture/2025/08/long-story-short-netflix-show-bojack-horseman-interview.html
- **KG:** https://en.wikipedia.org/wiki/Kaguya-sama:_Love_Is_War_(TV_series)
