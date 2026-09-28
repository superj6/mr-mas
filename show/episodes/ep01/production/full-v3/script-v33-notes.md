# Ep1 v3.3: the polish round's script notes (script draft 8.2, 2026-09-28)

> **Status: DONE, for the lead.** Script draft 8.2, the six v3.3 beat plans (deltas on the **v3.2 lock**), the Kokoro takes for the two new or changed lines, and these notes. PLAN §6's script items only (V1–V3, S1–S5, and the script side of P1–P17; P19 is carried as a length because the lock reads it from the plans). **A polish, not a rewrite:** each fix sits in one spot, and the v3.2 spine ([agency-v32](agency-v32.md)) is unchanged.
>
> **Nothing here was watched or heard.** Lengths are planned from the v3.2 lock's measured beats and the takes' measured lengths; the v3.3 lock sets the frames. Nothing was committed.

**The files:**

| What | Where |
|---|---|
| **The script** | [show/episodes/ep01/script.md](../../script.md), draft 8.2 (its log is at the top) |
| **The beat plans** | [beat-plan-v33/](beat-plan-v33/) `coldopen`, `act1`, `act2`, `act3`, `act4`, `tag`.json; all six pass `python -m json.tool` |
| The spec and builder | [beat-plan-v33/_spec_v33.py](beat-plan-v33/_spec_v33.py) (edit this) and [_build_v33.py](beat-plan-v33/_build_v33.py) (the v3.2 engine, pointed at the v3.2 lock, plus restored lines). It checks that every v3.2 beat appears once, that every dropped, retimed or moved line exists, and that each restored V.O. take exists on disk with the same text |
| **The takes** | `audio/ep01/v33/act4/lines-v33.json` + `wav/`, with fastrec's `lines.json`, `qa/`, `log/`; the tool `audio/ep01/v33/takes.py` and `record.sh` |

**To re-run:**

```
python3 show/episodes/ep01/production/full-v3/beat-plan-v33/_build_v33.py            # validate + runtime + V.O. roster + takes
python3 show/episodes/ep01/production/full-v3/beat-plan-v33/_build_v33.py --write    # rewrite the six JSON files
python3 audio/ep01/v33/takes.py plan                                                 # lines-in.json (the one read)
bash ops/heavy.sh bash audio/ep01/v33/record.sh act4                                 # fastrec --workers 2
audio/.venv-casting/bin/python audio/ep01/v33/takes.py cut                           # the cut + TV re-stage
python3 audio/ep01/v33/takes.py assemble                                             # audio/ep01/v33/act4/lines-v33.json
```

**The plans' fields** are the v3.2 plans' (PLAN §2 plus the additive fields), with one addition: a **restored** line (`"restored": true`) carries its take path (`take`), its lines file (`take_file`) and length (`take_dur_s`), for a V.O. line the v3.2 lock no longer has. Fix codes are PLAN §6's item numbers.

---

## 1. Runtime

| Segment | v3.2 lock (measured) | **v3.3 estimate** | Change | What moved it |
|---|---|---|---|---|
| Cold open | 0:26.7 | **0:26.7** | 0.0 | unchanged |
| Act One | 5:29.8 | **5:30.6** | **+0.8** | P1 Mas's face +1.0, V1 "it does." +0.8; P2 the post's hold −1.0 |
| Act Two | 3:13.0 | **3:10.6** | **−2.5** | V2 "he's not wrong." +1.5, P7 the chip order +0.5; P8 the glass cut −4.5 |
| Act Three | 2:22.4 | **2:13.4** | **−9.0** | P5 the Atem POV folded −4.4, S1 the VP clip and pinky promise −6.3; the Tidder thread +1.0, P10 his held face +1.2, P11 −0.5 |
| Act Four | 8:28.5 | **8:24.8** | **−3.6** | S5 the TV clip (one sentence) −3.8, S3 "Down here." −0.6; S2 the blank page +0.8 |
| Tag | 0:41.3 | **0:42.3** | **+1.0** | P19 the cover held |
| **Story** | **20:41.7** | **20:28.4** | **−13.3** | |

- **The episode runs about 21:10.5** (the story, the 30 s intro, the 2 s card and the 10.1 s outro).
- **Where the estimates could miss** (for the lock builder):
  - **S7.02b** takes the new cut's measured length (audible 0.33–4.19 s in a 4.46 s file) at `start+0.5`, so it lands near 4.8 s.
  - **S7.02:** the employee's take is 4.12 s audible (Tasya's was 4.24), so the beat should hold its 5.94 s.
  - **v31-19.03:** Remuhcs's line moves to `start+1.6`, so her long plate (`REMUHCS · ASKED THE ROOM: …`) reads for 1.6 s before it. If the read floor needs more, the builder holds the beat longer, as it did for 12.02 in v3.2.
  - **v31-18.00** now carries the monitor's caption, Kram's plate and his hoodie inside a 3.8 s arrival. If the read floor for `KRAM · RUNS ATEM` pushes it longer, the Atem saving shrinks by that much.

---

## 2. The change table (every beat that changes)

| Item | Beat(s) | Change | Lines | Δ s |
|---|---|---|---|---|
| **V1** | 9.09 | Restore "it does." (the v3 take v3-vo-09) after "That collar suits you.", once the collar arrives (P4); "and the rent?" follows it | + v3-vo-09 (restored, `audio/ep01/v3/act1/wav/v3-vo-09.wav`); e1-a1-9-05 retimed | +0.8 |
| **P4** | 9.08, 9.09 | The Macrosoft collar's first appearance is 9.08's pop; on "That collar suits you." Tasya's hand settles it (the ring clinks). Shot pass: no Macrosoft collar on him in any Act One shot before 9.08 (the cold open keeps it) | — | 0 |
| **V2** | 13.09 | Restore "he's not wrong." (the v3 take v3-vo-12) before "how's the dancing?" | + v3-vo-12 (restored, `audio/ep01/v3/act2/wav/v3-vo-12.wav`); e1-a2-13-12 retimed | +1.5 |
| **V3** | v31-20.07, v31-20.08 | No voice at Neleh's paper; his held face instead (P10) | — | 0 |
| **S1 / P9** | v31-19.02 (cut), v31-19.03, 20.01 | The VP's two-letters chyron and the pinky promise go; only the forum's raised hands stay (his own hand raised at home, lowered, then his keys). 20.01 opens on a TIDDER thread, its title invented crowd speculation (`t/singularity · "is it already here? anyone actually know?"`), and his reply typed into it | e1-a3-19-01 retimed to `start+1.6` | −3.6, −2.7, +1.0 |
| **S2 / P15** | S4.10, S4.10b | **No reason line** (§3.2). Picture only: as the spotlight leaves Rima's tile, its label steps back from `INTERIM CEO` to `RIMA TAMURI · CTO`. Ttemme's "Okay." is cut; he turns the page over toward us, and its back is blank | − a5-27-42 ("Okay.") | +0.8 |
| **S3** | S7.03 | "Down here." is cut; his look down at the slate floor holds | − v31-a4-0014 | −0.6 |
| **S4 / P17** | S7.02 | "Everyone's packed. Whatever happens to this place, Mas, don't worry about us." moves from Tasya to the **tiled employee** ("Is this a coup?"), among the boxes, visibly the one speaking | − v3-a4-0002 (Tasya); + **v33-a4-0001** (employee, new take) | 0 |
| **S5 / P17** | S7.02b | Tasya's quote becomes an interview clip on the bullpen TV (a podcast mic in frame, the TV's small speaker) while the staff pack; the room still turns slate on below / above / around. The take is cut to its confirmed last sentence (§3.4) | − v3-a4-0003; + **v33-a4-0002** (cut from v3-a4-0003, TV chain) | −3.8 |
| **P1** | 5.07 | Under Gerg's "It's a research preview.", a cut-in to Mas's MCU (5.11's drawing, without the chat's glow): his face, not answering, held about 1 s. No look at Rima | — | +1.0 |
| **P2** | 6.06 | The wheel lands; then only his thumb and the post's first line, as a preview. The 1 s hold on the digits goes | on-screen: the post's preview text | −1.0 |
| **P3** | 7.01 | One tear glint at his eye, readable in the shot | — | 0 |
| **P5** | v31-18.00, v31-18.00b (merge), 18.01 | The Atem POV folds into the home room's background: the monitor plays softly at frame right, large enough to read (the thirteenth key, Kram's two-part plate, the caption). "Everyone is welcome." moves to v31-18.00; the JUL 18 chip goes | v31-a3-0001 moved (v31-18.00b → v31-18.00, `start+1.4`) | +0.6, −5.0 |
| **P6** | 14.01 | **Declined as written** (§3.1): the clip stays a generic anchor, drawn unmistakably as one | — | 0 |
| **P7** | 17.10 | The chip order is in **Mario's** hand, unambiguously (§3.3); held half a second longer | — | +0.5 |
| **P8** | 17.11, 17.12 (cut), 17.13 | 17.12, the glass, is cut. 17.11 ends Act Two on the register's figure lifting off as the chip-maker's line and climbing off the top of the frame (the intro's curve), then a hold on the empty sky. 17.13's black carries the bell's tail, and Act Three's room leads in 0.6 s under it | — | −4.5 |
| **P10** | v31-20.08, 23.02 | His face reading page 30, held about 2 s (the room, no voice). The paper's tab stays in his tab strip; the Friday reminder pops up on the monitor over his own NOTIFY ME page, beside that tab | — | +1.2, 0 |
| **P11** | v32-22.04 | NOTIFY ME stays; the post collapses once it's up | — | −0.5 |
| **P12** | S4.02 | A slow push in during Neleh's second speech, reaching her MCU by "what happens on Monday"; the row of phones lights up in frame on "That is the company telling us."; no frame held unchanged over 8 s | — | 0 |
| **P13** | v32-S5.00 | Dated once: the rail goes, and the camera's plate `NOPEAI HQ · LOBBY · NOV 19 · 1:03 PM` stays | on-screen: − `RAIL: NOV 19, 2023 · ~1 PM PT` | 0 |
| **P14** | 8.03, 12.02 | `RADNUS · RUNS ELGOOG`; `NOLE · BUILDING HIS OWN` | on-screen plates | 0 |
| **P16** | S5.03 | The heart counter on screen ticks 406 → 407 → 406 in sync with the voice | — | 0 |
| **P19** | 32.03 | The cover beat holds about 1 s longer | — | +1.0 |

**Not in this pass** (other owners): X1–X7, M1–M2, P18 (the face lights).

---

## 3. What I judged against PLAN §6, and why

### 3.1 P6: the altered clip is *not* redrawn as the senator

PLAN §6 asks for the faked face in the May 12 clip to be the senator's. **I declined it as written.**
- **The record (facts #18):** the May 12, 2023 item is an *AI-altered anchor clip* reposted by the president's silhouette (RUMPT). The anchor is kept generic and is never drawn as a real person (facts §F).
- **The problem:** drawing the clip as a fake of the senator would show RUMPT reposting a deepfake of a named senator. That is an invented act by real people, not the record (guardrails §4 and §6; fairness).
- **The two fakes are different on the record.** The Senate's cloned voice (May 16) is the senator's own: he played it himself to open the hearing (V2). The bay's clip is someone else's.
- **Instead (a shot note on 14.01):** draw the clip unmistakably as a *news anchor at a desk*, with a blank lower-third bar, so a viewer doesn't expect the senator's face. The chairman's "That voice was not mine." then names his own, separate fake.
- **If the lead wants one fake only,** the fallback is to cut the bay's clip (14.01's feed item and the repost at 14.03). That costs the episode's political balance pair (guardrails §2a rule 3), so I don't recommend it.

### 3.2 S2: there is no clean reported reason for replacing Rima

- **The facts file:** the one reported reason, that she was moving to rehire him and Gerg, is **[UNVERIFIED]** in facts §E ("Mira 'moving to rehire Sam and Greg' … Not used"). Research mid §3 marks it the same way.
- **Guardrails:** a reason in Neleh's mouth would be the board's motive during the five days (guardrails §4 and §6). That can't rest on an unverified report.
- **So no line.** The picture-only fix: as the spotlight swings off Rima's tile (S4.10), its label steps back from `INTERIM CEO` to `RIMA TAMURI · CTO`, and she smooths her jacket.
  - A newcomer learns what happened to her (she's back to CTO, which is accurate).
  - "We'd like a different one." stays unexplained on purpose.
  - Ttemme's blank page pays it.
- **If a verified reason turns up later** (two outlets, dated Nov 19–20, 2023), it could be one plain line before "We'd like a different one." Draft 8.2 doesn't write one.

### 3.3 P7: the hand on the chip order is Mario's

- **The scene's logic:** the pen was in Mario's hand (he wouldn't give it back), and it becomes the purchase order.
- **The record:** Mas's compute came through the landlord ("You'll build everything on our servers.", sc 9; facts #6, the exclusive cloud term). A chip order in his own hand isn't what the record shows.
- **Fairness:** the gag is Misanthropic's roast ("the safety guy buys more chips"; guardrails §2a rule 7, "No halos": Mario gets a roast every episode).
- **The fix is picture only:** his fleece cuff, the footnote still wet on the sheet, and the scroll's end at the frame's edge. Mas's hand stays half out beside it, empty. The beat holds half a second longer (the v3.2 newcomer asked for exactly that).

### 3.4 S5: the TV clip uses only the confirmed sentence

- **What the take keeps:** "We are below them, above them, around them." is confirmed (facts L19).
- **What it drops:** the earlier "we have all the IP rights and all the capability" is **on HOLD** in L19 (the two transcriptions disagree on "IP", and nobody has heard the audio). The new take is cut from v3-a4-0003 at that sentence boundary, then put through fastrec's `tv` chain.
- **Chronology:** the podcast was released Nov 21 (L19), and the scene is Monday the 20th. The scene carries no date card, and the clip carries no dated chyron, as in v3.2.

### 3.5 S1: the thread's title is invented crowd text

- **The ask:** PLAN §6 asks for "the Tidder thread that carries the rumour".
- **What the record supports:** a comment in the forum r/singularity, edited to "…just memeing, y'all have no chill…" (facts #34). A check for a specific named rumour the comment answered didn't confirm one.
- **So the title is the crowd's generic speculation, in the parody UI:** `t/singularity · "is it already here? anyone actually know?"`. It is marked [INVENTED] and claims no source, like the existing reply `wait. human-level?? internally??` (facts §D).
- **The effect:** the post now answers something on his screen, and no reason is played.

### 3.6 Smaller calls

- **V1's condition:** it's met by P4 (the collar arrives on Tasya's hand at the line).
- **No new V.O. lines,** and no swaps. The two restored lines are the plan's own candidates.
- **S4's line to Mas** is the staff's reported threat to follow him. It says nothing about who organized anything, so the letter's authorship stays blank (calibration §10's contested item).
- **P8's picture** uses the register's own figure (the INVIDIA $1T flash-print, facts #22) for the line that climbs off the frame. No new claim.
- **P19** is outside my list, but it's a length the lock reads from the plans, so it's carried (32.03 at 4.8 s). P18 (the face lights) is left to the picture pass.

---

## 4. The inner voice: 13 lines, 82 words

| # | Id | Line | Beat | Kind |
|---|---|---|---|---|
| 1 | v3-vo-02 | she'll go for three. | 5.03 | a prediction the picture pays |
| 2 | v3-vo-03 | she's right. it will break. i don't know which part yet. | 5.04 | gap |
| 3 | v3-vo-05 | i know. i still read it twice. | 5.11 | gap |
| 4 | v3-vo-07 | mostly the bill. | 7.01 | gap |
| 5 | **v3-vo-09** | **it does.** | 9.09 | gap (**V1, restored**) |
| 6 | **v3-vo-12** | **he's not wrong.** | 13.09 | gap (**V2, restored**) |
| 7 | e1-a3-18-04 | i made it for everyone else. | 18.06 | caught / gap |
| 8 | v3-vo-16 | thrilled is too much. enthusiastic is a lot. | 22.02 | effort |
| 9 | v3-vo-18 | gerg's not on it. alyi set it up. probably just the budget. | S1.02 | the one wrong read |
| 10 | a5-26a-01 | i don't keep score. | S2.01 | caught |
| 11 | v3-vo-20 | four hundred and six. four hundred and seven. four hundred and six. | S5.03 | the count under pressure |
| 12 | v3-vo-21 | gerg. he'll say he's compiling. | S5.09 | a prediction the picture pays |
| 13 | v3-vo-24 | it looks calmer than me. | 32.03 | caught / gap |

- **Distribution:**
  - Act One: 5 (the collar's line now sits at 4:3x, in the audit's drought).
  - **Act Two: 1** (the drought ends at the White House).
  - Act Three: 2.
  - Act Four: 4.
  - The tag: 1.
- **The audit's drought** (v3.2: 6:49, from "mostly the bill." to "i made it for everyone else.") is now broken by the two restored lines. Its longest piece runs from "he's not wrong." (Act Two) to "i made it for everyone else." (Act Three): **about 2:55** (measured on the plans' estimates).
- **Two longer silences are by design, and they're unchanged from v3.2:**
  - the board's side, from "i don't keep score." to the 2 AM count (about 3:42: "we've left him");
  - the return, from "gerg. he'll say he's compiling." to the tag's "it looks calmer than me." (about 4:06: every room there is someone else's real act or a real negotiation).
- **Silent on purpose:** the hearing, the tour, Neleh's paper (V3), the blow, the board's side, and the door and the terms.

---

## 5. The takes (Kokoro; ElevenLabs needs the same two)

| Id | Who | Line | Take | Measured |
|---|---|---|---|---|
| **v33-a4-0001** | Tiled employee | Everyone's packed. Whatever happens to this place, Mas, don't worry about us. | **new read** (fastrec, `--workers 2`, through `ops/heavy.sh`). Her existing voice: speaker, speed (1.0) and device from her own take a5-27-18. It is in the room (`on_camera: on`), never a clone of anyone | 5.39 s file, audible 0.50–4.62 s; −16.0 LUFS; true peak −3.3 dBTP; QA 0 problems. ASR hears "Moss" for "Mas", as it does in every Mas take (the IPA is /mˈɑs/) |
| **v33-a4-0002** | Tasya (TV) | …We are below them, above them, around them. | **cut** from v3-a4-0003 (words 10–17, at the sentence boundary, 12 ms fades, room-tone handles to 0.35 s), then fastrec's `tv` chain, levelled to −16 LUFS (as the v3.2 re-stages were) | 4.46 s file, audible 0.33–4.19 s |

- **Restored V.O., no new takes:**
  - v3-vo-09: `audio/ep01/v3/act1/wav/v3-vo-09.wav`, 1.99 s.
  - v3-vo-12: `audio/ep01/v3/act2/wav/v3-vo-12.wav`, 2.39 s.
  - Both are in `audio/ep01/v3/<seg>/lines-v3.json`, which the lock builder already reads.
- **Dropped from the lock** (the files stay on disk):
  - a5-27-42 ("Okay.");
  - v31-a4-0014 ("Down here.");
  - v3-a4-0002 (Tasya's "Everyone's packed…", replaced by the employee's);
  - v3-a4-0003 (Tasya's face-to-face quote, replaced by its TV cut).
- **Moved, the take unchanged:** v31-a3-0001 ("Everyone is welcome."), v31-18.00b → v31-18.00.
- **ElevenLabs:** the employee's line in her EL voice, Tasya's EL take cut the same way and put through the TV chain, and the two restored V.O. lines' EL takes (the v3 EL files, if the EL lock kept them; otherwise re-read in EL Mas's voice).

---

## 6. For the picture and sound passes (script side)

- **New or changed drawings:**
  - 5.07: Mas's MCU cut-in;
  - 6.06: the post preview under his thumb;
  - 7.01: the tear's glint;
  - 9.09: Tasya's hand settling the collar;
  - 17.10: Mario's cuff and sheet;
  - 17.11: the chip-maker's line climbing off the top of the frame, then the empty sky;
  - v31-18.00: the monitor's lobby in the background, readable;
  - 20.01: the TIDDER thread's title;
  - v31-20.08: his MCU reading page 30, then the tab strip;
  - 22.04 and 23.02: the tab strip, and the reminder over NOTIFY ME on the monitor;
  - S4.10: Rima's label stepping to CTO;
  - S4.10b: the page's blank back;
  - S5.03: the counter's 406/407/406;
  - S7.02: the employee among the boxes, speaking;
  - S7.02b: the wall TV with Tasya at a podcast mic, the room going slate.
- **Un-draw:**
  - 17.12, the glass;
  - v31-18.00b, the Atem POV, and its JUL 18 chip;
  - v31-19.02, the VP's lectern and chyron;
  - the pinky-promise item and Mas's two fingers in v31-19.03;
  - Tasya on the bullpen floor (S7.02) and his MCU (S7.02b);
  - the walk-in's rail.
- **Sound:**
  - a new J-cut: Act Three's room leads 0.6 s under 17.13's black (it replaces the glass's tail);
  - S7.02b's line on the TV's small speaker;
  - the collar's clasp on Tasya's hand at 9.09 (the ring's clink stays);
  - the removed lines leave their beats' room tone only.

## 7. Facts

**No new rows.**
- S1's thread title is invented crowd text (facts §D's pattern).
- S2 rests on facts §E (the [UNVERIFIED] row stays unused).
- S5 rests on L19.
- P7 rests on #6.
- P8 rests on #22.
- The restored V.O. lines are invented thoughts on invented beats.

## 8. For a person to check

1. **9.09:** does the collar arrive at the line, so that "it does." lands as vanity rather than trim?
2. **13.09:** does "he's not wrong." then "how's the dancing?" read as the gap, not a pause?
3. **20.01:** does the thread give the post a trigger without a motive?
4. **v31-20.08:** does his held face at page 30 read as taking it in, with no voice?
5. **S4.10 / S4.10b:** do Rima's label change and the blank page land as the running gag, not as a missing explanation?
6. **S7.02 / S7.02b:** is the employee clearly the speaker? Does the TV clip read as the landlord's reach while the room turns slate?
7. **17.11:** does the chip-maker's line leaving the frame read as the act's out, not as a stock chart?
8. **14.01:** does the anchor read as an anchor, so the senator's line at the hearing is a second, separate fake?
