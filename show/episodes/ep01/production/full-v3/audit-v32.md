# Ep1 v3.2: the final audit (`audit-v32`, 2026-09-28)

> **The film audited:** `out/ep01/full-v3/ep01-v32.mp4` (Kokoro, 21:24.5). **All timecodes are on that film's clock.** The ElevenLabs film runs about 3 s longer by the end.
>
> **The brief:** the same three audits as [audit-v31](audit-v31.md), plus two more questions: did v3.2 over-correct anywhere, judged against [calibration.md](../../../../bible/calibration.md)? And what improved or regressed since v3.1?
>
> **How it was done. Nobody watched or listened.**
> - **A and B are judged.** I looked at 857 frames sampled every 1.5 s, with 4 fps frames at the scene changes and enlarged checks on six of them. I read them against the v3.2 timelines, the transcript (`assembly/transcript-v32.txt`), [agency-v32](agency-v32.md) and script-v32-notes §10.
> - **C is measured.** 225 beat boundaries (213 cuts, 49 place changes) and 9 seams were checked, with the same scripts and measures as v3.1: loudness at 1.5 s, 0.4 s and 0.1 s on each side; the floor within ±1.5 s; the score's level either side and its cue marks; spectral jumps; second-difference clicks, checked against the room, SFX and score stems; lines either side of each cut.
>   - The film's audio matches the v3.2 mixes to 0.02 ms and 0.02 dB.
>   - The scripts and raw numbers are in the session scratchpad (`audit-v32/`).
>
> Nothing was edited or committed.

---

## 0. The ranked fix list

Channels: S script/V.O., P picture, M music, X mix/assembly. Cost: S = an edit or mix only; M = a new take, cue edit or shot.

| # | Time | What | Why | Ch. | Fix | Cost |
|---|---|---|---|---|---|---|
| 1 | **3:16.2 → 10:05.5** | **6:49 with no inner voice.** That's the back half of Act One, all of Act Two and the head of Act Three. Acts One and Four hold 8 of the 11 lines, and Act Two has none. | The count (11) is on target. Where the lines sit isn't. Note 1's "everything still feels distance" comes back across the money, Sydney, GTP-4, Washington and the rooftop. The pruning took out the thoughts that happened to sit here. | S | Put one or two lines back here that only the voice can do. **Restore "it does." at 4:30** (the collar; the take is on file). If a second is wanted, add a gap line on the rooftop after "we'll read it." (9:13.5). No voice at the hearing: it's a proceeding. That makes 12–13 lines, still inside calibration §5. | S |
| 2 | 2:58.5 · 11:50 · 12:40 · 15:22 (and 8:57, 10:28) | **His new moves are mostly posts, so agency has become reading.** On-screen text rose from 13.7 to **14.5 items a minute** while spoken words fell by 181. Two-thirds of his new moves are text to read: the million post over the 1,000,000 wheel (it says the same thing twice), the sign-ups post over SIGN UP → NOTIFY ME (again twice), the post after the blow, the lobby selfie. | Calibration §3's order is the world, then a line said in conflict, then a plate. A post the picture already shows is a caption. Six posts by Mas in 20 minutes reads as "the man who posts". | P | **Keep** the post after the blow and the lobby post: they're the record, and they move the story. **At 2:58.5,** let the odometer land, then show only his thumb and the post's first line, and cut the 1 s hold on the digits. **At 11:50,** keep NOTIFY ME, and collapse the post once it's up. | S |
| 3 | 9:44.7 (v31-18.00b) | **Act Three opens on a reference nobody reacts to.** A monitor POV shows Tasya hanging a thirteenth key, with the plate `KRAM · RUNS ATEM`. With "thirteen." cut, nothing ties it to Mas. | Calibration §4: a reference that takes screen time needs a stake. This one lost its stake. It's also the "on his screen, changes nothing he does" pattern the diagnosis names. | P | Fold it into the background of 18.00 and 18.01: the monitor plays soft behind the Coinworld box arriving. Cut the POV (−5.0 s) and Kram's plate. | S |
| 4 | **15:19.52** | **An accidental click.** The `cloth_rustle` SFX (the lanyard going on) is cut off mid-sample. The SFX stem's second difference is 100× the local 99th percentile, falling −35 → −50 dBFS within 45 ms. | New in v3.2. It lands on his biggest new move, the walk-in. | X | Fade the rustle out over 20 ms, or let the sample finish. | S |
| 5 | **17:13.27** | **A designed score stop with no fade.** At "the scroll stops on ALYI" the score goes from −25 dBFS to digital zero in one sample. The score stem's second difference is 0.076 (30× local), and 12× in the mix. It lands under "Alyi signed it." | The other dead stops carry a 3 ms fade ("stops dead (3 ms)"). This one has none, so it will tick. | M | Give the stop a 3–8 ms fade, like the rest. | S |
| 6 | 12:45.29 | **The night cue re-enters +24.4 dB within 400 ms** (−39 → −15 LUFS), on the cut from the suite to the dark room. | It's designed ("the re-entry after D6"), but it grew from v3.1's +19.5. The new post beat before it now ends on the room fading to night, so the felt fifth lands as a jolt, not a return. | M/X | Start the felt fifth 0.3–0.5 s early under the post's last palette step, or lay it −3 dB. For an ear. | S |
| 7 | 9:37.5–9:40.7 | **The act-out glass is only partly fixed.** It now reads as a small head resting on a flat cyan disc on the water's surface: a floating head, not his reflection. | Still an unintended image, on the act break. | P | Draw the face *in* the surface, mirrored and dim, broken by the crack. No disc, no rim. Or take the fallback: cut 17.12 (−4.5 s). | M |
| 8 | 14:35.1–14:54.0 (S4.02) | **A static 18.9 s wide.** The boardroom holds through Neleh's two speeches, and the sampled frames are identical until the cut to Alyi's reflection. | Calibration §1: every hold changes. v3.1 flagged the same hold, and it's still there. | P | Cut in on "What they actually want to know is what happens on Monday." Use S4.07's MCU setup on Neleh, or the row of phones, so the wide holds 8 s at most. | S |
| 9 | 11:48.9 (v32-22.04) | **The sign-ups pause causes nothing.** The Friday reminder follows it with no link, so it's "and then". | His real act, but it reads as a checklist move (calibration §9, the chain test). | P | Let 23.02's reminder pop up over his own NOTIFY ME page. The door he shut is where the invite arrives. | S |
| 10 | 18:40.8 | **Tasya's "…below them, above them, around them." is still recited face to face.** The planned podcast mic wasn't drawn: the frame shows none. | It's the last real quote spoken in person (audit-v31 #12). | P/X | Draw the mic and put the line on the small-speaker chain. Or play it as a clip on the bullpen TV while Tasya stands there. | M |

**Also, smaller:**
- **15:18–15:25, dated twice.** The walk-in carries both a plate (`NOPEAI HQ · LOBBY · NOV 19 · 1:03 PM`) and a rail (`NOV 19, 2023 · ~1 PM PT`). Drop the rail.
- **Three-part plates.** Trim to a name plus one word: `RADNUS · RUNS ELGOOG` (the flame shows the rest) and `NOLE · BUILDING HIS OWN` (EARLY FUNDER is lore). This is picture work, cost S.
- **12:54.50, a faint tick.** The room stem steps at the whip with no crossfade (13× local, at −38 dBFS). A 10 ms crossfade fixes it.
- **10:11.88, a score step with no cue mark.** It rises +12 dB into 19.01 (the iris flick). The composer should confirm it.
- **21:14.42, tag → outro.** Now +13.3 dB (400 ms) and +16 dB within 200 ms. It was +20. For an ear. No change is needed if it lands as an ending.

**Counts:**
- **A, forced:** 8 items, down from 25. All but #8 and #10 are low.
- **B, out of the blue:**
  - 8 unintended, down from 14;
  - 11 intended shocks, labelled;
  - **Mas carried along in 9 places (2 of them intended) plus 3 partly, against v3.1's 19.**
- **C, sound:** 225 boundaries and 9 seams.
  - **Problems:** 2 clicks (#4 accidental, #5 an unfaded stop), 1 jump for an ear (#6) and 2 minor ticks or steps.
  - **None found:** no room-tone holes, no clipped dialogue, no act-break seam stepping 1 dB or more.

---

## 1. v3.2 against v3.1

**audit-v31's 15 fixes:** 12 done, 3 partial.

| v3.1 # | Status in the v3.2 film |
|---|---|
| 1 V.O. narrates | **Done.** 28 → 11 lines, 208 → 77 words. The caption lines are gone. The distribution is the new problem (#1 above). |
| 2 Act Three watches a monitor | **Mostly.** The post now comes from the forum's raised hands, the LEDs omen is gone, and he switches the monitor off and walks onto the DevDay stage live (11:27–11:40), then pauses the sign-ups. Still, 7 of the act's 9 scenes are a screen at his desk. |
| 3 3:40 off screen | **Done.** His lobby walk-in (15:17.8, 8 s) sits inside the board's side and steps out into their camera. The absence is now 2:23 plus 0:56. |
| 4 tag → outro | **Improved.** +20 → +13 dB, and the hum holds 2.0 s alone. |
| 5 "as you know" | **Done**, all four. The Sunday line now plays after his walk-in, so it follows from it. |
| 6 read-aloud device | **Done.** The blog post types itself (13:44–13:52), and Terb keeps his. |
| 7 key count | **Done.** Both V.O. lines are cut, and the ring gets a legible ECU (4:48.8). But it cost #3 above its stake. |
| 8 act-out glass | **Partial** (#7 above). |
| 9 duplicate tagline | **Done.** |
| 10 Alyi's hold | **Done**: 6.3 → 2.5 s, and the score accent on the cut is gone. |
| 11 no line leads a place | **Done.** Dialogue J-cuts at place changes go from 1 to 5: 3:11.9, 6:08.1, 14:07.0, 17:38.8, 20:17.9. There are still no L-cuts. |
| 12 recited quotes | **Partial.** Gerg now listens to "dance", and the employee hears "coup". Tasya's line stays (#10 above). |
| 13 card's downbeat | **Done.** At 0:58.67 the 100 ms level goes −32.0 → −13.3: a hard downbeat. |
| 14 stale gap at 5:08.6 | **Done.** The score reads −27.0 → −28.1 across the cut (now 5:10.58). |
| 15 small blanks | **Mostly.** The flame is an MCU with Radnus's face (7:17). "The company" now points at the phones. Ttemme is kept as a gag, which is fine. The two faint tally marks still mean nothing to a newcomer (12:46.9). |

**Also improved:**
- The Elgoog founders get a cut-in (3:54).
- Mada's face is on the reminder (11:57).
- Plates carry one relation word (`MARIO · EX-NOPEAI`, `NELEH · NOPEAI BOARD`, `RIMA TAMURI · INTERIM CEO`).
- The Senate plays in the record's order: his proposal (8:24.1) before "Would you come and run it?".
- Of v3.1's three unmarked score steps, two are gone and the third (the tag scan) is now marked as designed.

**Regressed or new:**
- The 6:49 stretch with no inner voice (#1).
- More text to read (#2).
- The Atem beat with no stake (#3).
- Two new clicks (#4, #5).
- A larger re-entry jump (#6).
- **Shorter stays:** the median stay went from 19.2 s to 15.4 s. The new beats split places: the call, the switch-off and the walk-in. This works against note 2's "fewer, longer stays", mildly.

---

## 2. Calibration: did v3.2 over-correct?

**Mostly it lands in the middle.** Where it tips over, the cause is placement and medium, not amount.

| Ledger § | Target | v3.2 | Verdict |
|---|---|---|---|
| §5 voice | 10–14 lines, each one only-the-voice | 11 lines. But 0 in Act Two, and one silence of 6:49 | **Over on placement** (#1). The lines kept are good. I accept 8.1's case for "she'll go for three." and "gerg. he'll say he's compiling." (predictions the picture pays), and withdraw audit-v31's cut of them. |
| §9 agency | 1–3 decisions per act with a visible alternative, each causing the next scene | One: 5 · Two: 3 (the seat nearest the teacher doesn't read in a wide of five small figures, 6:28) · Three: 3 · Four: 9 | **Close to the line in One and Four, but not a schemer.** No plan, motive or wink anywhere, and contested moments stay blank. The checklist feel comes from the post-moves (#2) and the sign-ups beat (#9), not from the count. |
| §3 pointers | world → line → plate + one word; 0–2 labels | 0 `(REPORTED)`; 12 relation plates plus the gag cards; 38 date rails (36 in v3.1) | **Plates are fine.** Trim the two three-part plates and the doubled date. The rails are still the calendar (diagnosis cause 1): most scenes open on one. Consider dropping rails where a cause already forces the order, e.g. 3:33 (the phone he just hung up) and 4:07 ("the answer to his call"). |
| §4 references | attach, don't cut | Most are now hung on his moves | **One went bare:** #3. |
| §1 pacing | add scene, not air; every hold changes | Entry air up (4.3 → 5.1 s, spoken lines); stays shorter (19.2 → 15.4 s) | **Mild slip** (#8; the stays). |
| §2 conversation | away-from-Mas talk must change his situation | The board's side is trimmed (−15.7 s) and every exchange turns | **On target.** |
| §8 runtime | 20–22 min | 21:24.5 episode (story 20:41.7) | **On target.** |

---

## 3. A. FORCED (judged)

1. **#8, S4.02:** the static wide.
2. **#10:** Tasya's recited quote.
3. **2:58.5:** the million post reads out the wheel beside it (#2).
4. **11:50:** the sign-ups post and NOTIFY ME say the same thing (#2).
5. **8:24.1:** he says the agency proposal while sliding a sheet that says `PLEASE REGULATE ME`. The prop repeats the line. **Keep it:** it's Act One's payoff. Low.
6. **3:30.1:** "I'll bring a pen." is a visible plant for the pen clipped to the check and the carve. It's light enough to keep. Low.
7. **12:46.9:** "beside two faint ones". The marks have no antecedent. Carve one faint mark, or keep them as texture and accept the blank. The TPOOL/YC readings are contested, so no labels. Low.
8. **4:55.8:** "…I want people to know that we made them dance…" now has Gerg as a listener. It's still a quote with ellipses, but acceptable. Low.

Nothing in the inner voice narrates any more.

## 4. B. OUT OF THE BLUE (judged)

**Intended shocks (keep):**
- the firing (12:22–12:36);
- the voice over black finding the clone (7:47);
- the rewind to the board's side (12:52);
- Tasya's door (15:58);
- "Alyi signed it." (17:14);
- Nesnej's register (9:17);
- the monitor switching off into DevDay's applause (11:27–11:29, new, and it reads as a door);
- the hourglass (19:43);
- the duck (20:35);
- the Q* vault (20:06);
- the Grey Lady's thud (21:02).

**Unintended:**
- #3, the Atem monitor beat;
- #7, the glass;
- #9, the sign-ups;
- the tally marks;
- `KRAM · RUNS ATEM`, who is nobody in Ep1 (it goes with #3);
- the doubled date at 15:18;
- "CHATGTP Plus", which isn't explained (the post is verbatim, so keep it);
- the invisible seat move at 6:28.

**Mas's agency.** He is still carried in 9 places:
- the code red on his phone (3:33);
- GNIB on the TV (4:50);
- the bay feed (7:36; he replays the clip, a token move);
- the rooftop (9:00);
- the Atem monitor (9:44);
- Neleh's paper (10:59; guardrails keep it);
- the reminder (11:56);
- the firing (intended);
- the avalanche (18:00; intended, he never orchestrates the revolt).

He's partly carried in 3 more: the pause letter (he watches, then writes PLEASE), the White House (the seat and the lens are small and hard to see), and the board's side (his walk-in sits inside it).

The other 7 of v3.1's 19 are now his moves: the million post, the GTP-4 click, the Senate proposal, the tour stamp, the hands runner (he turns to his keys), the order (he switches it off), and DevDay (live).

## 5. C. SOUND (measured)

**Seams (film audio; 100 ms / 400 ms steps):**

| Seam | Time | Step | Verdict |
|---|---|---|---|
| cold open → intro | 0:26.67 | +2.0 / −14.6 dB | Unchanged. The designed dead cut; for an ear. |
| intro → card | 0:56.67 | +0.4 / −7.9 dB | OK |
| card → Act One | 0:58.67 | +18.7 / +18.8 dB | **The downbeat is restored** (designed) |
| Act One → Two | 6:28.42 | −0.6 / +3.2 dB | OK; the black is at −37 |
| Act Two → Three | 9:41.46 | +0.4 / +4.1 dB | OK |
| Act Three → Four | 12:03.88 | +0.6 / +0.6 dB | The crane pre-lap: a J-cut |
| Act Four → tag | 20:32.33 | −0.3 / +1.1 dB | The hum as an L-cut |
| tag → outro | 21:14.42 | +7.8 / +13.3 dB (+16 over 200 ms) | Improved from +20; for an ear |
| end | 21:24.54 | fade to zero over 0.6 s | OK |

**Every cut:**
- **Room tone.** No window of 0.1 s or more falls below −60 dBFS except the film's final fade. Below −50 there are only the designed moments: the Act Three black (12:01.6, −53.4) and three short dips inside the one silence (≥ −51.5).
- **Digital zero** occurs only in the first 2 ms and the last 34 ms.
- **The one silence** runs from the Remove click (12:29.78) to the buzz (12:34.84), 5.07 s: room tone only, and clean.
- **The score.**
  - 28 steps of 12 dB or more fall on cuts.
  - 27 of them sit on a cue-sheet stop, start, window edge or mark. That includes the new "DevDay live with no score", with its score entering at home (11:40.25).
  - One step has no mark (10:11.88).
- **Clicks.** The camera shutter at 7:23.6, the post click at 10:31.1 and the dial-tone click are all designed SFX. #4 and #5 are real problems.
- **Dialogue.**
  - No take is clipped by a segment edge.
  - The two interruptions are designed (Mario 15:07.7, Neleh 18:08.1).
  - Mario and Adelina overlap by 0.96 s (designed; for an ear).
- **J/L-cuts.**
  - All 40 room-to-room changes crossfade the rooms (0.6–2.6 s lead).
  - Five of them are led by a line, up from 1.
  - None trails a line.
  - At room changes, the median time from the cut to the first word is 2.8 s, and from the last word to the cut 2.8 s.

## 6. For the lead

- **For v3.2.1 (all cost S):** #4, #5, #6, the tick at 12:54.5 and the 10:11.9 confirmation are sound fixes. #1, #2, #3, #8 and #9 are script or picture fixes. None needs a new take except a rooftop line, if one is wanted.
- **Before the Drive swap:** #4 and #5 are the only measured defects. Everything else is taste.
- **Not heard:** the lobby walk-in's click, the re-entry at 12:45, the Mario/Adelina overlap and the tag → outro step each need an ear.
