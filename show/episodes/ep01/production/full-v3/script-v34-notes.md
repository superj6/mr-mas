# Ep1 v3.4: Mas the planner, hinted (script draft 8.3, 2026-09-28)

> **Status: DONE, for the lead.** Script draft 8.3, the six v3.4 beat plans (deltas on the **v3.3 lock**), the Kokoro takes for every new V.O. line, the bible updates, and these notes.
>
> **The notes it answers** (SHOWRUNNER-NOTES 000, PLAN §7, and the showrunner's two later messages):
> - "mas's dialogue is too much just predicting what someone is going to say next, rather than useful narration/insight into what he's thinking/planning"
> - "the mastermind who has higher foresight and planning than others usually", with the firing the one thing he didn't see coming
> - "actually i changed my mind, the duck should just be cut"
> - "make sure in general writing is well nuanced within the context. don't make anything too on the nose"
>
> **Nothing here was watched or heard.** Lengths are planned from the v3.3 lock's measured beats and the recorded takes' measured lengths; the v3.4 lock sets the frames. Nothing was committed.

**The files:**

| What | Where |
|---|---|
| **The script** | [show/episodes/ep01/script.md](../../script.md), draft 8.3 (its log is at the top) |
| **The beat plans** | [beat-plan-v34/](beat-plan-v34/) `coldopen`, `act1`, `act2`, `act3`, `act4`, `tag`.json; all six pass `python -m json.tool` |
| The spec and builder | [beat-plan-v34/_spec_v34.py](beat-plan-v34/_spec_v34.py) (edit this; its `NEW_VO` is the one source for the new lines' text) and [_build_v34.py](beat-plan-v34/_build_v34.py) (the v3.3 engine against the v3.3 lock, counting new V.O.). New V.O. lengths are read from the recorded takes |
| **The takes** | `audio/ep01/v34/<seg>/lines-v34.json` + `wav/`, with fastrec's `lines.json`, `qa/` and `log/`; the tool `audio/ep01/v34/takes.py` (it reads `NEW_VO`) and `record.sh` |
| **The bible** | [mas-inner-voice](../../../../bible/mas-inner-voice.md) §3, §4, §7, §8 · [calibration](../../../../bible/calibration.md) §5, §9 and the diagnosis · [overview §6a](../../../../bible/overview.md) (everyone schemes, later episodes) |

**To re-run:**

```
python3 audio/ep01/v34/takes.py plan                                                 # lines-in.json from the spec
bash ops/heavy.sh bash audio/ep01/v34/record.sh act1 act2 act3 act4                  # fastrec --workers 2 (FORCE="id …" re-reads)
python3 audio/ep01/v34/takes.py assemble                                             # lines-v34.json per segment
python3 show/episodes/ep01/production/full-v3/beat-plan-v34/_build_v34.py --write    # the six plans (lengths from the takes)
```

---

## 1. Runtime

| Segment | v3.3 lock (measured) | **v3.4 estimate** | Change | What moved it |
|---|---|---|---|---|
| Cold open | 0:26.7 | **0:26.7** | 0.0 | unchanged |
| Act One | 5:30.6 | **5:37.8** | **+7.3** | Mario's line +4.4; the bill's plan +3.3; the launch line +1.0; "she'll go for three." −1.4 |
| Act Two | 3:10.6 | **3:01.2** | **−9.4** | the bay's clip and repost −6.8; Sirrah's catchphrase −2.2; "he's not wrong." −1.5; "mine's half written." +1.2 |
| Act Three | 2:13.4 | **2:05.3** | **−8.1** | the deepfake beats −11.1; "i made it for everyone else." −1.5; DevDay's memory +3.4; the Orb's line +1.1 |
| Act Four | 8:25.7 | **8:29.2** | **+3.5** | the return's count +4.1; the Friday read +0.2; Gerg's call −0.8 |
| Tag | 0:42.3 | **0:33.2** | **−9.1** | the duck cut −9.7; the arrival held +0.6 |
| **Story** | **20:29.3** | **20:13.5** | **−15.8** | |

The episode runs about **20:55.6**, with the 30 s intro, the 2 s card and the 10.1 s outro.

---

## 2. The change table (by beat id)

| Item | Beat | Change | Lines | Δ s |
|---|---|---|---|---|
| **A** | 5.03 | "she'll go for three." is cut (a prediction) | − v3-vo-02 | −1.4 |
| **A** | 5.04 | The launch thought becomes a decision | − v3-vo-03; + **v34-vo-01** | +1.0 |
| **A** | 7.01 | The bill, then the practical thought that leads to the call | − v3-vo-07; + **v34-vo-02** | +3.3 |
| **A** | 11.03 | Mario's line is restored (the v3 take). The plate goes back to `MARIO` (the line carries the relation) | + v3-vo-10 (restored) | +4.4 |
| **A** | 13.09 | "he's not wrong." is cut | − v3-vo-12 | −1.5 |
| **A** | 13.13 | On Nedib's "put it in writing": his is half written (it pays the act-out's `PLEASE / REG` and the Senate's sheet). "Longer." follows it | + **v34-vo-04** | +1.2 |
| **A** | 18.02 | The label, and what the company is for, hinted | + **v34-vo-05** | +1.1 |
| **A** | 18.06 | "i made it for everyone else." is cut | − e1-a3-18-04 | −1.5 |
| **A** | 22.01 | On his stage under the applause, Gerg's launch-night forecast, remembered | + **v34-vo-06** | +3.4 |
| **A** | S1.02 | The one wrong read: he plans right into the call | − v3-vo-18; + **v34-vo-07** | +0.2 |
| **A** | S5.09 | As he calls Gerg: who Gerg is to him (paid by "gerg comes back too.") | − v3-vo-21; + **v34-vo-09** | −0.8 |
| **MM** | S8.04 | On his return, the firing's drawing again, and now we hear him: the count | + **v34-vo-11** | +4.1 |
| **B** | 13.12 | Nedib's card loses `DEEPFAKES OF ME: SEEN 0` | — | 0 |
| **B** | 14.01, 14.03 (cut), 14.05 (cut) | The May 12 altered anchor clip, its repost and the second hailstone are cut. The bridge stays: the class photo on his phone, then the voice over black. The rail `MAY 12` goes | — | −6.8 |
| **B** | 21.02, 21.03 (cut), 21.04 (cut), 21.05, v32-21.06 | The deepfake Nedib, "When the hell did I say that?", "which one's real?" and the Orb's verdict are cut. The order's one line stays (the rules written down); he signs, the room applauds, Mas switches it off | − e1-a3-21-02, e1-a3-21-04, e1-a3-21-06 | −11.1 |
| **G** | 13.02 | Sirrah's invented catchphrase is cut (the balance consequence of B, §3.2); her pointer lands on A, then I | − e1-a2-13-01 | −2.2 |
| **C** | 32.01, v31-32.01d (cut), 32.02, 32.04, 33.01 | The Elgoog demo, the Runway insert and "What the quack!" are cut. The monitor stays dark; the rail `DEC 6` moves to the cover's delivery | − v31-tg-0001 | −9.1 |

**Spoken lines changed to directions:** none of the three allowed. The scenes' directions are already his ("read me the letter.", "keep building.", "leave it open.", "gerg comes back too.").

---

## 3. What I judged against PLAN §7, and why

### 3.1 The lines are hinted, not declared (the showrunner's last note)

- **PLAN §7's candidates are treated as intent, not text,** as the lead asked. Each line was run through mas-inner-voice §8 with the new on-the-nose check: no "plan" words, no thesis, and it should read as ordinary once and as foresight on a rewatch.
- **What went, after first being written and recorded:**
  - "it's only the first one." (the long game, named);
  - "until we can build our own." (the intent, stated);
  - "i'd rather be in the room when they do." (the lead named it as on the nose);
  - "if i'm in the building, they decide with me in it." and "the board should know i have somewhere to go." (strategy explained; the picture carries both: the badge, the post, the look at the camera; the badge set beside the lanyard);
  - "that part i planned." (the thesis).
- **What replaced them:** small practical thoughts.
  - "someone can." (the landlord, unnamed; then he calls him)
  - "mine's half written." (the sheet in his pocket)
  - "for when it gets harder to tell." (the Orb)
  - "a year ago, forty users and a nice thread." (Gerg's forecast, remembered exactly)
  - On the return, a count in his own register: "they had four votes. i had the landlord. the money. gerg."
- **The count is 15, not 17:** "fewer, better lines beat the full count."

### 3.2 One deepfake, and the political balance

- **Kept:** the Senate's cloned voice ("That voice was not mine.").
- **Cut:** the May 12 altered anchor clip and the Nedib executive-order deepfake. The order's one line stays because it's the rules written down.
- **The consequence (guardrails §2a rule 3):** those two deepfakes were the episode's political balance pair, RUMPT's repost against Nedib's deepfake. With both gone, the one remaining invented roast of one party's official was Sirrah's catchphrase ("What can be, unburdened by what has been… trained."). A Republican counterweight isn't available: RUMPT's only on-record 2023 AI act is that same altered clip. So the catchphrase is cut too.
- **What remains of either party:** Sirrah hosts, Nedib enters and signs, and the senator's own stunt opens the hearing. All of it is played dry.
- **For the guardrails owner:**
  - Confirm this reads as even-handed, and update §2b's Ep1 row.
  - The overview §6 RUMPT table's Ep1 anchor (the May 12 repost) is no longer on screen. His Ep1 presence is only the cold open's unattributed lit window.

### 3.3 The duck is cut, which supersedes PLAN §7 C

- The showrunner's later message cut it, so C's overlays, the held look and the timings aren't needed.
- The fine print was checked before the cut: TechCrunch (Devin Coldewey, Dec 7, 2023) reports Google's YouTube notes as "For the purposes of this demo, latency has been reduced and Gemini outputs have been shortened for brevity." That comes from a search summary; TechCrunch's page itself didn't show the sentence to the reader. No facts row was added, since it's unused.

### 3.4 Smaller calls

- **Placement:** the rules-room thought sits at 13.13, not 13.01. It needs something to answer, and Nedib's "put it in writing" is that.
- **Kept although optional:** "i don't keep score." (the carve), and "i know. i still read it twice." (his want, not a prediction).
- **At most one prediction:** there are none now. "gerg's not on it… i'll ask for more compute." is the one wrong read, not a prediction of someone else.
- **Everyone's lines were checked for on-the-nose subtext.** None changed in this pass. For a later polish: "That is the company telling us." explains its scene a little (it's said in conflict, so it stays).
- **Tasya and Mario scheming in Ep1:** no change. The light touches already there ("I'll bring a pen.", "below them, above them, around them", the careful rival's memo) carry it. The season note is overview §6a, linked from calibration §9.

---

## 4. The V.O. list, in order (15 lines, 132 words; film-clock estimates)

The film clock has the cold open at 0:00, the intro at 0:26.7, the card at 0:56.7 and Act One at 0:58.7. Times are the plans' estimates.

| # | Film (est.) | Beat | Id | Line | Kind | Take |
|---|---|---|---|---|---|---|
| 1 | 1:33.6 | 5.04 | v34-vo-01 | she's right. it will break. it goes out tonight anyway. | gap + decision | **new** |
| 2 | 2:43.0 | 5.11 | v3-vo-05 | i know. i still read it twice. | gap (his want) | v3 |
| 3 | 3:15.8 | 7.01 | v34-vo-02 | mostly the bill. we can't buy that many servers. someone can. | gap + a practical thought | **new** |
| 4 | 4:33.7 | 9.09 | v3-vo-09 | it does. | gap | v3 |
| 5 | 5:50.6 | 11.03 | v3-vo-10 | mario used to sit where gerg sits. he left to build a careful one. | a read (the rival) | v3, **restored** |
| 6 | 7:34.1 | 13.13 | v34-vo-04 | mine's half written. | a practical thought (the ask) | **new** |
| 7 | 9:45.3 | 18.02 | v34-vo-05 | my other company. for when it gets harder to tell. | a practical thought | **new** |
| 8 | 11:07.4 | 22.01 | v34-vo-06 | a year ago, forty users and a nice thread. | a memory (reads as foresight) | **new** |
| 9 | 11:21.2 | 22.02 | v3-vo-16 | thrilled is too much. enthusiastic is a lot. | effort | v3 |
| 10 | 11:53.6 | S1.02 | v34-vo-07 | gerg's not on it. probably the budget. good. i'll ask for more compute. | the one wrong read | **new** |
| — | 11:59–12:10 | S1.07–S1.12 | — | *(silence from the call's first tile to "super.")* | | |
| 11 | 12:26.2 | S2.01 | a5-26a-01 | i don't keep score. | caught | v5 |
| 12 | 16:07.5 | S5.03 | v3-vo-20 | four hundred and six. four hundred and seven. four hundred and six. | the count | v3 |
| 13 | 16:18.3 | S5.09 | v34-vo-09 | gerg walked out for me. | a read (paid on Tuesday) | **new** |
| 14 | 19:37.3 | S8.04 | v34-vo-11 | they had four votes. i had the landlord. the money. gerg. | the return's count | **new** |
| 15 | 20:20.2 | 32.03 | v3-vo-24 | it looks calmer than me. | caught | v3 |

- **By act:** One 5 · Two 1 · Three 3 · Four 5 · the tag 1.
- **Silent on purpose:** the hearing, the tour, Neleh's paper (a held face), the blow, the board's side, the walk-in and the door (both carried by picture), Tuesday's terms.
- **The rewatch chain:**
  - "someone can." → he calls the landlord → the landlord's desks at 2 AM → the return's "the landlord";
  - "mine's half written." → the Senate's sheet;
  - "a year ago, forty users…" → he never meant forty;
  - "gerg walked out for me." → "gerg comes back too." → the return's "gerg".

---

## 5. The takes (Kokoro; ElevenLabs needs the same eight)

All eight are Mas's inner voice in the episode's existing Kokoro voice: speaker `mas-manalt`, `kind: vo`, fastrec's vo-close chain on **am_michael · a-michael-close**, speed 0.87 (0.85 for v34-vo-05). They were read with fastrec `--workers 2` through `ops/heavy.sh`. Never a clone of anyone.

| Id | Audible s | ASR (CER) | QA |
|---|---|---|---|
| v34-vo-01 | 3.85 | exact (0.0) | clean |
| v34-vo-02 | 4.45 | exact (0.0) | clean |
| v34-vo-04 | 1.30 | exact (0.0) | a soft pace flag (a short line reads slow: 2.3 syll/s); **for an ear** |
| v34-vo-05 | 3.38 | exact (0.0) | a soft pace flag (4.8 syll/s at 0.85, after 4.96 at 0.87); **for an ear** |
| v34-vo-06 | 3.02 | "40" for "forty" (the ASR's numeral) | clean |
| v34-vo-07 | 5.03 | exact (0.0) | clean |
| v34-vo-09 | 1.43 | exact (0.0) | clean |
| v34-vo-11 | 4.64 | exact (0.0) | clean. It was re-read twice: the micro-pauses first garbled "the money and gerg", so it became a count without "and" |

- **Restored, no new take:** v3-vo-10 (`audio/ep01/v3/act1/wav/v3-vo-10.wav`, in `audio/ep01/v3/act1/lines-v3.json`).
- **Recorded but not used** (the files stay; they're not in `lines-v34.json`):
  - v34-vo-03, v34-vo-08 and v34-vo-10, the lines cut by the on-the-nose note;
  - the first reads of the rewritten ids, overwritten in place.
- **Dropped from the lock** (the files stay): v3-vo-02, v3-vo-03, v3-vo-07, v3-vo-12, e1-a3-18-04, v3-vo-18, v3-vo-21 (V.O.); e1-a2-13-01 (Sirrah); e1-a3-21-02, e1-a3-21-04, e1-a3-21-06 (the deepfake beats); v31-tg-0001 (the demo).

---

## 6. For the picture and sound passes

- **Picture:**
  - 11.03 plate `MARIO`;
  - 13.02 Sirrah's pointer on A, then I (no lip movement);
  - 14.01 his feed shows only the class photo (the clip, the tag and the repost are un-drawn; 14.03 and 14.05 are cut);
  - 21.02 one Nedib, the second copy un-drawn;
  - 21.05 the room applauding;
  - v32-21.06 the order's applause;
  - the tag's monitor dark from 32.01 to 33.01;
  - S8.04 the firing's CU held about 5.8 s under the count.
- **Sound:**
  - the bay's clip audio and the repost click go;
  - sc 21's deepfake lines go, and the applause carries into the switch-off;
  - the tag loses the demo film's bed and the stutter, and MM-12 plays through (no duck for the demo);
  - S8.04's V.O. breaks the silence that the same drawing had at the blow (the score stays low under it).
- **The Runway insert** v31-32.01d is no longer in the film.

## 7. Facts

**No new rows.**
- Every new line is an invented thought on an existing beat.
- "forty users and a nice thread" quotes Gerg's own invented line (5.03).
- "someone can." names nobody.
- The kept order line is EO 14110's paraphrase (#38).
- The duck's fine print is unused (§3.3).

## 8. For a person to check

1. **Rewatch test:** do the plants read as ordinary the first time? "someone can.", "mine's half written.", "for when it gets harder to tell.", "a year ago, forty users…", "gerg walked out for me."
2. **S8.04:** does the count land as quiet foresight, not a boast, and not as the staff?
3. **13.13:** does "mine's half written." read as the PLEASE sheet, one act after 12.06?
4. **The bay without the clip:** does the photo on his phone into a voice over black still carry into the Senate?
5. **The balance:** does the White House still read as even-handed without Sirrah's catchphrase?
6. **Takes for an ear:** v34-vo-04 and v34-vo-05 (pace flags), and the restored v3-vo-10 beside the newer Mas takes.
