# Ep1 v3.5: the final version, the script side (script draft 8.4, 2026-09-28)

> **Status: DONE, for the lead.** Script draft 8.4, the six v3.5 beat plans (deltas on the **v3.4 lock**), the Kokoro takes for every new or changed line, the season and bible updates, the verification of every "confirm before lock" item, and these notes.
>
> **What it builds.** [proposal-v35](proposal-v35.md) as agreed, scene by scene, with the lead's choices in [PLAN §8](PLAN.md): 1A, 2A, 3A, 4A, **5A** (TPOOL in two shots, about 6 s), 6A, 7A, 8A, **9A** (the tear macro), 10A (the pay-back set), **11A** (one film: the ElevenLabs cast, MARIO on Kokoro, SIRRAH recast by the ElevenLabs pass), **12A amended plus the quicker board exit**, and CLOD's pane planned so a claymation insert works or doesn't. The showrunner's authorization: "i think we're now seeming fully on the same page. i now trust your judgement to put everything we've discussed into the final rendering. go for it".
>
> **Nothing here was watched or heard.** Lengths are planned from the v3.4 lock's measured beats and the recorded v3.5 takes' measured audible lengths; the v3.5 lock sets the frames. Nothing was committed.

**The files:**

| What | Where |
|---|---|
| **The script** | [show/episodes/ep01/script.md](../../script.md), draft 8.4 (its revision log is at the top; scene headings carry `P35 sc N`) |
| **The beat plans** | [beat-plan-v35/](beat-plan-v35/) `coldopen`, `act1`, `act2`, `act3`, `act4`, `tag`.json; all six pass `python3 -m json.tool` |
| The spec and builder | [beat-plan-v35/_spec_v35.py](beat-plan-v35/_spec_v35.py) (edit this: the new lines' text, the deltas, the new beats, ORDER and MOVED) and [_build_v35.py](beat-plan-v35/_build_v35.py) (validates every anchor, on-screen string and take, then writes the plans) |
| **The takes** | `audio/ep01/v35/<seg>/lines-v35.json` + `wav/`, with fastrec's `lines-in.json`, `lines.json`, `qa/` and `log/`; the tool `audio/ep01/v35/takes.py` (plan · cut · assemble; it reads the spec) and `record.sh` |
| **The season, bible and facts** | §12 lists the files touched |

**To re-run:**

```
python3 audio/ep01/v35/takes.py plan                                                     # lines-in.json from the spec
bash ops/heavy.sh bash audio/ep01/v35/record.sh act1 act2 act4                           # fastrec --workers 2 (FORCE="id …" re-reads)
bash ops/heavy.sh audio/.venv-casting/bin/python audio/ep01/v35/takes.py cut             # Terb's cut take
python3 audio/ep01/v35/takes.py assemble                                                 # lines-v35.json per segment
python3 show/episodes/ep01/production/full-v3/beat-plan-v35/_build_v35.py --write        # the six plans (lengths from the takes)
```

**For the lock builder** (the plan format is PLAN §2's, with the v3.1–v3.4 fields; the plans' `_about` lists what's new):
- Every v3.4 beat appears once, in the v3.5 order; cut beats keep their place with `action: cut`; S4.12 merges into S4.13; two beats move (`moved`, named in the spec's MOVED: S4.07 after S4.13d, S5.03 before S5.02).
- New beats carry `frame`, `set`, `room` and `chars`. **21.03 and 21.04 are v3.3's deepfake beats**, restored; `restore_from` names their v3.3 lock source.
- Line flags: `new` (v35-* ids, takes in `audio/ep01/v35/`), `restored` (an earlier take, with `take` and `take_file`: e1-a1-9-09, e1-a3-21-02/04/06), `reuse_of` (v35-a1-0010 on e1-a1-5-11's file), `cut_from` (v35-a4-0008, from v3-a4-0004).
- **New placement forms:** `overlap:<id>-S` (5.04: Gerg's "That's a v2 problem." starts 0.25 s before Rima's line ends); a new line at `start-S` is a J-cut (41.03, 41.04, 0.3 s).
- **New per-beat fields** for the art, shot and score passes: `scene`, `mode`, `pace`, `tempo` (the gap before each named line), `camera`, `picture`, `style`, `flashback`, `style_leap` (7.02) and `style_leap_optional` (11.03, CLOD). `onscreen` also takes `retime`. `sounds_drop` lists sounds a transition moves elsewhere.

---

## 1. What changed, in one screen

- **Act One grows to about 7:30:** the first weeks (sc 10), 3 AM (12), JUN 2018 (13), the window (18), the vision post (19) and Elgoog's waitlist (22) are new; the wait before the first user (6), the tear macro and the INVIDIA plants (8, 13), Tasya's "in everything we make" (14), Gerg's earlier GNIB line (15), the bar card and Alyi's awe (21), Mario's point two (21) and Nole's stamp (23) change existing scenes.
- **Act Two is one caused line:** the reminder and the sheet (26); the Senate without its clone, with "i get paid enough for health insurance." back in Mas's mouth (27); MAR 2019 (28, new); the tour rebuilt as his leverage game (29); the signatures scroll and every signer's pen becomes an order (30, 30A).
- **Act Three:** the president's deepfake is restored (35); DevDay's thought waits for the counter (36).
- **Act Four:** the post typed twice (40); the war room (41) and the flight home (42), new; TPOOL in two shots (43); the board's side trimmed by 12A amended, with the desk's props, Alyi's held face and the staff's beat (44–49); Alyi alone (49A, new); the count and "gerg walked out for me." cut (50); the board's exit in 9 s (52); Alyi's regret in full (53); Terb without his lead-in (54); a tighter coda (56).
- **The inner voice is 17 lines** (§4). **The tempo** is set per exchange (§6).

## 2. Runtime

| Segment | v3.4 lock (measured) | proposal-v35 (estimate) | **v3.5 plan** | vs v3.4 | vs proposal |
|---|---|---|---|---|---|
| Cold open | 0:26.7 | 0:26.7 | **0:26.7** | 0.0 | 0.0 |
| Act One | 5:37.5 | ≈ 7:29 | **7:29.7** | **+112.2** | +0.7 |
| Act Two | 3:01.2 | ≈ 3:26 | **3:31.4** | **+30.2** | +5.4 |
| Act Three | 2:05.3 | ≈ 2:17 | **2:19.1** | **+13.8** | +2.1 |
| Act Four | 8:27.8 | ≈ 7:52 | **8:02.3** | **−25.5** | +10.3 |
| Tag | 0:33.2 | 0:33.2 | **0:33.2** | 0.0 | 0.0 |
| **Story** | **20:11.7** | ≈ 22:05 | **22:22.5** | **+130.8** | +17.5 |
| **Episode** (30 s intro, 2 s card, 10.1 s outro) | 20:53.9 | ≈ 22:47 | **≈ 23:04.6** | | |

**By proposal-v35 scene** (seconds against v3.4; the plans' `scene` field):

| Act | Scene: change |
|---|---|
| Act One | 4 -1.6 · 6 +1.7 · 8 -0.2 · 9 -0.4 · 10 +18.5 · 12 +10.6 · 13 +34.1 · 14 +1.5 · 15 +1.6 · 17 -0.8 · 18 +13.5 · 19 +24.5 · 20 -0.1 · 21 +6.4 · 22 +3.0 · 23 -0.2 |
| Act Two | 26 +2.0 · 27 -9.2 · 28 +25.8 · 29 +11.1 · 30 +0.5 |
| Act Three | 33 -0.6 · 35 +11.4 · 36 +3.0 |
| Act Four | 40 +3.0 · 41 +24.0 · 42 +3.0 · 43 +5.9 · 44 -1.5 · 45 -6.3 · 46 -4.2 · 47 -14.5 · 49 -18.0 · 49A +5.0 · 50 -7.0 · 51 -0.8 · 52 -7.1 · 53 +1.5 · 54 -4.0 · 56 -4.5 |

**Why the plan runs about 17 s over the proposal's estimate.** The proposal's lengths were estimates before the takes existed; the plan's are the recorded lines plus the tempo table's gaps.
- **Act Four, +10 s.**
  - The war room is 24 s against 22: its seven recorded lines total 13.9 s, with Mas's own gaps at 0.45 s, even with the calls overlapping (two 0.3 s J-cuts) and FOUNDER MODE silent.
  - The board's weekend (47 + 49) is about 71 s against 67: its kept lines alone, measured, are about 55 s; Tasya's statement runs 11.3 s and has to finish inside S4.13d once S4.13e (its tail) is cut; the blank-page business keeps 2.8 s.
  - The 12A items themselves land at their stated sizes (noon −6.3, the count −3.35, Tuesday −4.0, the coda −4.5, the board's exit −7.1).
- **Act Two, +5 s:** the 2019 night is 25.8 s (nine lines) against 24, and the tour 16.1 s against 14 (the lectern line is 4.1 s, TIME's longer wording).
- **Act Three, +2 s:** DevDay's thought waits until the odometer has landed at 4.4 s and been read, which costs 3.0 s, not 1.5.
- **Act One, +0.7 s:** the 2018 night is 34.1 s against 27 (Alyi's weighted lines run 15 s at his speed, even with 0.6 s gaps), and the tempo table's quick exchanges give back about 5 s across the act.
- **Where to cut, if the lead wants the proposal's 22:05** (ranked by what they cost the story; none is applied): the 2018 night's no-answer hold and 13.05's side-project insert to 2 s (−0.8); the vision post's three passages held 3 s each instead of 4 (−3); the war room's post card to 2 s and the notepad to 1.2 s (−1); the tour's guest-book match folded into the last stamp (−1.4); the weekend's blank-page business to 2 s (−0.8). About −7 s in all.

## 3. The change table (by beat id, from the v3.4 lock)

Every beat with an edit, in the v3.5 order. Unchanged beats aren't listed; they're `keep` in the plans with "unchanged". The cold open and the tag have no changes. Beat ids `v35-*` are new; `21.03` and `21.04` are v3.3's deepfake beats, restored.

**Act One** (v3.4 lock 337.6 s → 449.7 s)

| Beat | P35 sc | Action | s (v3.4 → v3.5) | Lines | Fix | What and why |
|---|---|---|---|---|---|---|
| 5.03 | 4 | keep | 9.72 → 9.47 | tempo/retime: e1-a1-5-03 | PACE | Quick banter: Gerg answers Rima on her last word's tail (0.50 → 0.25 s). |
| 5.04 | 4 | keep | 29.64 → 28.34 | tempo/retime: e1-a1-5-06, e1-a1-5-08, e1-a1-5-09 | PACE | The bargain plays quicker; Mas stays unhurried inside it. |
| 5.10 | 6 | keep | 14.17 → 13.97 | tempo/retime: e1-a1-5-20 | PACE |  |
| 5.11 | 6 | keep | 8.16 → 8.01 | tempo/retime: e1-a1-5-23 | PACE |  |
| 5.12 | 6 | keep | 2.58 → 4.60 | — | NEW, TR | Sc 6 (new): the team waits for the first user. The counter's first tick lands after a held breath. |
| 7.01 | 8 | keep | 10.56 → 10.36 | tempo/retime: e1-a1-7-02 | PACE |  |
| 7.02 | 8 | keep | 5.00 → 5.00 | — | C9, NEW | Choice 9A: the tear on the heatsink as a 2–3 s near-photoreal macro of objects only; the INVIDIA plant. |
| v32-7.03 | 9 | keep | 9.00 → 8.60 | tempo/retime: v32-a1-0003, v32-a1-0004 | PACE, TR | Its exit changes: people are posting what they do with it, which causes the first weeks. |
| v35-10.01 | 10 | new | new · 2.50 | — | NEW | Sc 10: what people do with it, fast and rising. |
| v35-10.02 | 10 | new | new · 2.00 | — | NEW |  |
| v35-10.03 | 10 | new | new · 2.50 | — | NEW | The comedy of it. |
| v35-10.04 | 10 | new | new · 3.00 | — | NEW, FACT | Nole's first reaction (the ledger's 4a #5): scared of it, and watching. Sc 23 pays it. |
| v35-10.05 | 10 | new | new · 2.00 | — | NEW |  |
| v35-10.06 | 10 | new | new · 2.50 | — | NEW, FACT | Rima's banner, paid: nobody reads banners. |
| v35-10.07 | 10 | new | new · 2.50 | — | NEW, FACT |  |
| v35-10.08 | 10 | new | new · 1.50 | — | NEW, TR | The out: the players notice. The code red arrives on his own phone (8.01). |
| 8.01 | 11 | keep | 2.50 → 2.50 | — | TR | The code red now arrives out of the first weeks (sc 10's last cut). |
| 8.06 | 11 | keep | 2.50 → 2.50 | — | TR | The exit changes: he turns back to the feed at 3 AM (sc 12). |
| v35-12.01 | 12 | new | new · 4.50 | — | NEW, FACT | Sc 12: among the jokes and the tests, someone used it for something that mattered. |
| v35-12.02 | 12 | new | new · 4.31 | + v35-vo-01 | NEW, C1 | Choice 1A: "they've stopped testing it. they're using it." The act's one moment where he's moved, never named; it rhymes with "i still read it twice." |
| v35-12.03 | 12 | new | new · 1.80 | — | NEW, TR | Having seen what the world does with it, he remembers why they started. |
| v35-13.01 | 13 | new | new · 3.20 | — | NEW, FACT | Sc 13: the night the machine taught itself. |
| v35-13.02 | 13 | new | new · 13.55 | + v35-a1-0001, v35-a1-0002, v35-a1-0003, v35-a1-0004 | NEW | Alyi's awe, Mas's practicality: the believer and the organizer. |
| v35-13.03 | 13 | new | new · 7.37 | + v35-a1-0005, v35-a1-0006 | NEW | Neither knows the road. |
| v35-13.04 | 13 | new | new · 6.01 | + v35-a1-0007 | NEW | Why they want AGI, in one question. It's broken at sc 39 and mended at sc 53. |
| v35-13.05 | 13 | new | new · 2.50 | — | NEW | A small rewatch thrill: CHATGTP's seed, for whoever notices. |
| v35-13.06 | 13 | new | new · 1.50 | — | NEW, TR | "then a lot more computers." The money for them arrives. |
| 9.01 | 14 | keep | 5.50 → 5.50 | — | TR | The 2018 flashback's exit lands here: the same glass, the same walk. |
| 9.06 | 14 | keep | 7.12 → 6.97 | tempo/retime: e1-a1-9-03 | PACE |  |
| 9.09 | 14 | keep | 21.48 → 23.18 | + v35-a1-0008; tempo/retime: v31-a1-0005, e1-a1-9-07, e1-a1-9-08 | NEW, PACE | One Tasya line: the deal wants his model in everything Macrosoft makes. "that's a lot of servers." now answers both. |
| 9.10 | 15 | keep | 9.99 → 11.61 | − v32-a1-0005; + e1-a1-9-09 (restored); tempo/retime: e1-a1-9-10 | C7, FACT, PACE | Gerg says it plainly: their model in the landlord's search engine, aimed at Elgoog. Tasya's "made them dance" answers him. |
| v31-10.02 | 17 | keep | 18.50 → 17.75 | tempo/retime: e1-a1-10-01, e1-a1-10-02, e1-a1-10-03 | PACE |  |
| v31-10.04 | 17 | keep | 3.00 → 3.00 | — | TR | The exit changes: that evening, Gerg takes a marker to the window. |
| v35-18.01 | 18 | new | new · 6.00 | — | NEW, FACT, TR | Sc 18: whatever wears their badge, the users are theirs. |
| v35-18.02 | 18 | new | new · 5.00 | + v35-a1-0009, v35-a1-0010 (reuse) | NEW | The old joke, and the height the firing falls from. |
| v35-18.03 | 18 | new | new · 2.50 | — | NEW, TR | The dream came true, and he writes it down. |
| v35-19.01 | 19 | new | new · 3.00 | — | NEW, FACT | Sc 19: his vision, in his own words. |
| v35-19.02 | 19 | new | new · 14.00 | — | NEW, FACT | The mission, why he shipped a preview (gradually), and the stakes. |
| v35-19.03 | 19 | new | new · 4.02 | + v35-vo-02 | NEW, C2 | Choice 2A: "someone gets to be in the room." His want, hinted; a rewatcher hears the cold open. |
| v35-19.04 | 19 | new | new · 3.50 | — | NEW, FACT, TR | A rival answers the same day |
| 11.01 | 20 | keep | 8.79 → 8.64 | tempo/retime: e1-a1-11-05 | TR, PACE | Sc 20 is now a response: a week after Atem gave its model to researchers, the whole thing is loose. |
| 11.03 | 21 | keep | 13.59 → 17.94 | + v35-a1-0011 | C3, NEW | Choice 3A: Mario's second point, the reason he builds at all. Then his own bot launches the same day. |
| 11.04 | 21 | keep | 8.50 → 10.50 | — | NEW, FACT, TR | The leap made legible (the bar exam), Alyi's awe, and the line on the window jumping: the team's lead, in picture. |
| v35-22.01 | 22 | new | new · 3.00 | — | NEW, FACT, TR | Sc 22: they're ahead. |
| 12.01 | 23 | keep | 4.29 → 4.29 | — | TR | The toast now leads out of the waitlist (sc 22). |
| 12.02 | 23 | keep | 7.45 → 7.25 | − v32-a1-0007; + v35-a1-0012; tempo/retime: e1-a1-12-03 | C4, FACT, PACE | Choice 4A: he signs a pause with one hand and files his own company with the other (X.AI Corp., Nevada, Mar 9, 2023: facts #62 |

**Act Two** (v3.4 lock 181.2 s → 211.4 s)

| Beat | P35 sc | Action | s (v3.4 → v3.5) | Lines | Fix | What and why |
|---|---|---|---|---|---|---|
| 13.12 | 25 | keep | 0.62 → 0.62 | — | REST | Nedib's card gets its stat back; sc 35's deepfake pays it (SEEN 1). |
| 13.13 | 25 | keep | 7.18 → 7.18 | — | REST | The card rides into 13.13 with its stat, as in v3.3. |
| 14.01 | 26 | keep | 4.00 → 6.00 | — | NEW, TR | Sc 26: he's going to the Senate, and he's taking the sheet. |
| 14.06 | 27 | cut | 1.33 → 0.00 | — | CLONE | The cloned voice over black is cut (the Senate's fake, SN 00000). |
| 15.01 | 27 | cut | 4.00 → 0.00 | — | CLONE | The voice finds a mouth: the clone, cut. |
| 15.02 | 27 | cut | 5.18 → 0.00 | — | CLONE | "That voice was not mine. The words were not mine." is cut with the clone. The hearing room's wide and the chairman's plate move (v35-27.00, 15.06). |
| 15.03 | 27 | cut | 2.50 → 0.00 | — | CLONE | The chairman and the clone: cut. |
| v35-27.00 | 27 | new | new · 3.80 | — | NEW, CLONE, TR | Sc 27 opens straight on the hearing, with Sucram beside him. |
| 15.05 | 27 | keep | 7.08 → 6.88 | tempo/retime: e1-a2-15-05 | PACE |  |
| 15.06 | 27 | keep | 6.62 → 6.62 | — | CLONE | His plate moves here from the cut 15.02. |
| 15.07 | 27 | keep | 6.12 → 6.12 | — | CLONE |  |
| 15.16 | 27 | keep | 2.79 → 2.79 | — | CLONE |  |
| 15.11 | 27 | keep | 8.40 → 7.90 | tempo/retime: e1-a2-15-11, e1-a2-15-12 | PACE |  |
| 15.13 | 27 | keep | 3.50 → 4.22 | − e1-a2-15-13; + v35-a2-0001 | CLONE, NEW | His own words at the hearing, lowercased (facts L22). |
| 15.14 | 27 | keep | 6.30 → 6.30 | — | TR | The senator's disbelief sends him back to the night he chose it: sc 28. |
| v35-28.01 | 28 | new | new · 2.30 | — | NEW, TR | Sc 28: the night he chose it. |
| v35-28.02 | 28 | new | new · 13.80 | + v35-a2-0002, v35-a2-0003, v35-a2-0004, v35-a2-0005, v35-a2-0006, v35-a2-0007 | NEW, FACT | He builds the machine: how NopeAI raised money. |
| v35-28.03 | 28 | new | new · 4.43 | + v35-a2-0008, v35-a2-0009, v35-a2-0010 | NEW, FACT | Why he owns nothing, and who's on top. |
| v35-28.04 | 28 | new | new · 2.80 | — | NEW | The money arrives; the landlord's first key. |
| v35-28.05 | 28 | new | new · 2.50 | — | NEW, TR | Back from 2019: the question has no answer to write down. |
| 16.01 | 29 | cut | 5.00 → 0.00 | — | NEW | The tour poster is rebuilt as sc 29 (v35-29.01–05): the stamps, the lectern, NOTERB's post, his post. |
| v35-29.01 | 29 | new | new · 4.00 | — | NEW, FACT, TR | Sc 29: he won't run the agency, so he carries his rules to the world himself. |
| v35-29.02 | 29 | new | new · 4.91 | + v35-a2-0011 | NEW, FACT | The leverage: threat. |
| v35-29.03 | 29 | new | new · 2.80 | — | NEW, FACT | Push-back. |
| v35-29.04 | 29 | new | new · 3.00 | — | NEW, FACT | Retreat: he's played the room and got his meetings. |
| v35-29.05 | 29 | new | new · 1.40 | — | NEW, FACT, TR | The out: the same pen signs one sentence. |
| 17.01 | 30 | keep | 6.00 → 6.50 | — | FACT, TR | Sc 30: the people racing to build it sign one sentence. The signers are checked against the statement's own page; the count is shown as "hundreds". |
| 17.10 | 30A | keep | 3.00 → 3.00 | — | NEW | Sc 30A: the ones who warned are the ones buying. |

**Act Three** (v3.4 lock 125.3 s → 139.1 s)

| Beat | P35 sc | Action | s (v3.4 → v3.5) | Lines | Fix | What and why |
|---|---|---|---|---|---|---|
| 20.06 | 33 | keep | 12.48 → 11.93 | tempo/retime: e1-a3-20-06, e1-a3-20-08 | PACE |  |
| 21.02 | 35 | keep | 8.01 → 10.60 | + e1-a3-21-02 (restored) | REST | The president's deepfake, restored as in v3.3: one copy (the second copy stays un-drawn). |
| 21.03 | 35 | new | new · 4.38 | + e1-a3-21-04 (restored) | REST | His own real words are the joke, and they're in his favour (the balance: script-v35-notes §6). |
| 21.04 | 35 | new | new · 4.40 | + e1-a3-21-06 (restored) | REST, KEEP | "which one's real?" and the Orb's verdict (the ledger's keep list). |
| 21.05 | 35 | keep | 2.30 → 2.30 | — | REST |  |
| v32-21.06 | 35 | keep | 2.00 → 2.00 | — | REST |  |
| 22.01 | 36 | keep | 14.32 → 17.32 | tempo/retime: v34-vo-06 | C2, TR | "a year ago, forty users and a nice thread." now comes one beat after the rail and the counter are read (the proposal's timing change), so the number lands first. |

**Act Four** (v3.4 lock 507.8 s → 482.3 s)

| Beat | P35 sc | Action | s (v3.4 → v3.5) | Lines | Fix | What and why |
|---|---|---|---|---|---|---|
| v32-S1.13 | 40 | keep | 5.00 → 8.00 | — | NEW, TR | Sc 40: typed twice. It costs him something; nothing on his face says so. |
| v35-41.01 | 41 | new | new · 2.91 | + v35-vo-03 | NEW, C10 | Sc 41: he's surprised, and working every line he has (The Social Network's grammar). |
| v35-41.02 | 41 | new | new · 6.12 | + v35-a4-0001, v35-a4-0002, v35-a4-0003 | NEW | Sympathy for Gerg's hurt; his loyalty, shown. |
| v35-41.03 | 41 | new | new · 6.75 | + v35-a4-0004, v35-a4-0005, v35-a4-0006 | NEW | Tasya's anger, which becomes Sunday's offer. |
| v35-41.04 | 41 | new | new · 4.02 | + v35-a4-0007, v35-vo-04 | NEW, C10 | The money's calls; the rattled count (said calmly at the return). |
| v35-41.05 | 41 | new | new · 2.60 | — | NEW | A joke, in public, on the night he was fired. |
| v35-41.06 | 41 | new | new · 1.60 | — | NEW, TR | His three options. Nothing about the staff, the letter, the firing's reasons or family. |
| v35-42.01 | 42 | new | new · 3.00 | — | NEW, C10, TR | Sc 42: he's chosen; the planner is back. Paid at "gerg comes back too." |
| S2.01 | 43 | keep | 4.12 → 4.12 | — | TR | The carve now follows the flight home (Nov 18). |
| S2.02 | 43 | keep | 2.60 → 2.00 | — | C5, TR | The marks take us back: the first mark opens TPOOL. |
| v35-43.01 | 43 | new | new · 3.50 | — | C5, FACT | Choice 5A (two shots, about 6 s: a 3.5 s TPOOL was unreadable before). |
| v35-43.02 | 43 | new | new · 2.50 | — | C5 | It's happened before, and he survived. The return's count is a lesson learned here. |
| S2.05 | 43 | keep | 2.50 → 3.00 | — | C5, TR | The Orb counts the marks, then rewinds to the board's side. |
| v31-S3.00p | 44 | keep | 4.60 → 5.60 | — | NEW | Sc 44: the desk's props (SN 0000's "why he was fired", felt as a question; Ep2's podcast is the answer). |
| S1.03 | 44 | keep | 11.75 → 9.30 | − a5-25-01; tempo/retime: a5-25-02 | NEW | "Three of us stepped down this year." is cut; the picture says it. |
| S3.00a | 45 | keep | 15.20 → 14.20 | — | C12 | 12A: the replay of noon, tighter at its head only; Alyi's sentence stays whole (heard once per side). |
| S3.01 | 45 | keep | 4.00 → 2.60 | — | C12 | 12A: the removal notice goes; "super." through their laptop stays (the told-twice payoff). |
| v35-45.01 | 45 | new | new · 1.20 | — | NEW | Sc 45 (new): a first twinge for Alyi, filled at 49A and 53. |
| S3.02 | 45 | cut | 1.60 → 0.00 | — | C12 | 12A: the overhead of her desk and its tick go; step 4's blank is on the table on Saturday (S4.02) and in her look (S4.07, moved). |
| S3.03 | 45 | keep | 9.00 → 5.50 | − a5-27-08 | C12 | 12A: a shorter hold (5.5 s reads both sentences). |
| S3.04 | 46 | keep | 10.83 → 9.88 | tempo/retime: a5-27-13, a5-27-14, a5-27-15 | PACE |  |
| S3.04b | 46 | keep | 3.26 → 3.01 | tempo/retime: v31-a4-0003 | PACE, TR |  |
| S3.06 | 46 | keep | 2.36 → 3.96 | tempo/retime: a5-27-18 | NEW, TR | Sc 46: the staff's shock, one beat of silence, before the question. |
| S3.05 | 46 | keep | 10.10 → 5.50 | − a5-27-20; tempo/retime: a5-27-21 | C6, KEEP | Choice 6A: Alyi's line stays (the ledger's keep list), alone. |
| S4.01 | 47 | cut | 4.79 → 0.00 | — | C12 | 12A: the eulogy post card and the wall screen go. |
| S4.02 | 47 | keep | 17.40 → 9.00 | − a5-27-23 | C12 | 12A: footnote three stays (the keep list); the rail moves here from the cut S4.01. |
| S4.08 | 47 | keep | 18.79 → 17.44 | tempo/retime: a5-27-31 | PACE, C12 |  |
| S4.09 | 49 | keep | 11.34 → 10.24 | tempo/retime: v31-a4-0005, a5-27-36, a5-27-37 | PACE, C12 |  |
| S4.10 | 49 | cut | 4.30 → 0.00 | — | C12 | 12A: "the boardroom, now night" goes; Ttemme's card and CHAT: LIVE plate move to S4.10b's head. |
| S4.10b | 49 | keep | 15.20 → 14.05 | tempo/retime: a5-27-38, a5-27-39, a5-27-40, a5-27-41 | C12, KEEP, PACE | 12A: Ttemme, "We'd like a different one." and the blank page stay; his card and CHAT: LIVE plate move here from the cut S4.10. |
| S4.11 | 49 | keep | 2.00 → 2.00 | — | C12, KEEP | 12A: the hourglass turning stays (Tuesday's fixed-length hourglass needs it); the F F F F chat goes. |
| S4.12 | 49 | merge | 2.92 → 0.00 | — | C12 | 12A: its reaction hold goes; the slate step, the new door and the rail NOV 19 · ~11:53 PM PT open S4.13. |
| S4.13 | 49 | keep | 5.70 → 6.25 | tempo/retime: a5-27-44, v3-a4-0001 | C12 |  |
| S4.13d | 49 | keep | 7.42 → 8.60 | — | C12 | 12A: shorter reaction holds; the statement's tail (it ran into S4.13e) ends here. |
| S4.13e | 49 | cut | 3.00 → 0.00 | — | C12 | 12A: Tasya's sign goes (the S5.11 door keeps its own). |
| S4.14 | 49 | cut | 2.79 → 0.00 | — | C12 | 12A: "Step four, Mada?" goes; Neleh's look (S4.07, moved) replaces it. |
| S4.15 | 49 | cut | 2.50 → 0.00 | — | C12 | 12A: Mada's held note goes; the bridge is Alyi alone (sc 49A). |
| S4.07 (moved after S4.13d) | 49 | keep | 5.00 → 3.00 | − a5-27-29 | C12, KEEP | Neleh's look at the blank line (the keep list), moved to after the statement; it replaces "Step four, Mada?" and bridges to Alyi alone. |
| v35-49A.01 | 49A | new | new · 5.00 | — | NEW, C10, TR | Sc 49A: the company he built is emptying, and he did it. The cause, shown; his own words come at sc 53. |
| S5.03 (moved after v35-49A.01) | 50 | keep | 5.85 → 2.50 | − v3-vo-20 | C12, TR | The hearts stay (2.5 s, no voice); the count goes. |
| S5.02 | 50 | keep | 4.50 → 3.00 | — | TR | Moved after the hearts, so the match from Alyi's phone lands on Mas's phone. |
| S5.09 | 50 | keep | 14.06 → 12.33 | − v34-vo-09; tempo/retime: a5-29-03, v31-a4-0007, v31-a4-0008 | C12, PACE |  |
| S5.06 | 50 | keep | 22.79 → 22.49 | tempo/retime: a5-29-10, a5-29-11 | PACE |  |
| S5.09-back | 50 | keep | 5.40 → 5.25 | tempo/retime: a5-29-17 | PACE |  |
| S5.11 | 51 | keep | 15.60 → 14.85 | tempo/retime: a5-29-21, a5-29-22, v31-a4-0013 | PACE |  |
| S6.01 | 52 | keep | 4.50 → 2.30 | — | C12 | The quicker board exit (the lead's extra): the grid fills in 2.3 s. |
| S6.02 | 52 | keep | 1.50 → 1.00 | — | C12 |  |
| S6.03 | 52 | keep | 1.92 → 1.20 | — | C12 |  |
| S6.04 | 52 | keep | 1.96 → 1.60 | — | C12 |  |
| S6.06 | 52 | keep | 6.25 → 2.90 | — | C12 | The board leaves the call in about 9 s. |
| S7.01 | 53 | keep | 18.60 → 20.10 | — | NEW, FACT | Sc 53: his own words, in full (facts L10, |
| S7.06 | 54 | keep | 4.20 → 3.40 | — | C12 | Only the freeze card is shorter (TERB / THE NEW CHAIR). |
| S7.06-cont | 54 | keep | 4.92 → 4.32 | tempo/retime: a5-30-09 | C12 | The fire exchange is tighter. |
| S7.07 | 54 | keep | 10.88 → 8.55 | − v3-a4-0004; + v35-a4-0008 (cut take) | C12 | Terb reads the agreement without his lead-in. |
| S7.07-cont | 54 | keep | 17.36 → 17.11 | tempo/retime: a5-30-13, v31-a4-0016, a5-30-15 | PACE, KEEP |  |
| S8.06 | 56 | keep | 2.79 → 2.20 | — | C12 | A tighter vault shot. |
| S8.07 | 56 | keep | 9.00 → 6.51 | tempo/retime: a5-31-03 | C12, PACE | A tighter "Is it ready?" exchange. |
| S8.10 | 56 | keep | 5.20 → 3.80 | — | C12, KEEP | The observer chair stays (the act's last payoff), its hold shorter. |

## 4. The inner voice (17 lines, 135 words)

Film clock: cold open 0:00, intro 0:26.7, card 0:56.7, Act One 0:58.7. The times are the plans' beat starts (the line starts a little later in its beat).

| # | Beat starts (est.) | P35 sc | Beat | Id | Line | Kind | Take |
|---|---|---|---|---|---|---|---|
| 1 | 1:17.6 | 4 | 5.04 | v34-vo-01 | she's right. it will break. it goes out tonight anyway. | the decision | v34 |
| 2 | 2:35.4 | 6 | 5.11 | v3-vo-05 | i know. i still read it twice. | the gap (his want) | v3 |
| 3 | 3:11.3 | 8 | 7.01 | v34-vo-02 | mostly the bill. we can't buy that many servers. someone can. | a practical thought | v34 |
| 4 | 4:32.2 | 12 | v35-12.02 | **v35-vo-01** | they've stopped testing it. they're using it. | a read of the world (1A); the one moment he's moved | **new** |
| 5 | 5:33.3 | 14 | 9.09 | v3-vo-09 | it does. | the gap | v3 |
| 6 | 7:16.4 | 19 | v35-19.03 | **v35-vo-02** | someone gets to be in the room. | his want, hinted (2A) | **new** |
| 7 | 7:32.5 | 21 | 11.03 | v3-vo-10 | mario used to sit where gerg sits. he left to build a careful one. | a read of the rival | v3 |
| 8 | 9:22.0 | 25 | 13.13 | v34-vo-04 | mine's half written. | a practical thought | v34 |
| 9 | 12:07.0 | 31 | 18.02 | v34-vo-05 | my other company. for when it gets harder to tell. | a practical thought | v34 |
| 10 | 13:38.5 | 36 | 22.01 | v34-vo-06 | a year ago, forty users and a nice thread. | a memory (now after the counter) | v34 |
| 11 | 13:55.9 | 36 | 22.02 | v3-vo-16 | thrilled is too much. enthusiastic is a lot. | effort | v3 |
| 12 | 14:28.4 | 38 | S1.02 | v34-vo-07 | gerg's not on it. probably the budget. good. i'll ask for more compute. | the one wrong read | v34 |
| — | | 39 | S1.07–S1.12 | — | *(silence from the call's first tile to "super.")* | | |
| 13 | 15:03.6 | 41 | v35-41.01 | **v35-vo-03** | the budget. i said the budget. | the wrong read, paid | **new** |
| 14 | 15:19.4 | 41 | v35-41.04 | **v35-vo-04** | gerg. tasya. the money. the money. the money. | the rattled count (the new §3 example) | **new** |
| 15 | 15:30.6 | 43 | S2.01 | a5-26a-01 | i don't keep score. | caught | v5 |
| 16 | 21:50.4 | 55 | S8.04 | v34-vo-11 | they had four votes. i had the landlord. the money. gerg. | the return's count (the war room's, said calmly) | v34 |
| 17 | 22:28.2 | 57 | 32.03 | v3-vo-24 | it looks calmer than me. | caught | v3 |

- **By act:** One 7 · Two 1 · Three 3 · Four 5 · the tag 1.
- **Cut:** v3-vo-20 (the 2 AM count, 12A) and v34-vo-09 ("gerg walked out for me.", 12A); the files stay.
- **Silent on purpose:** the call's first tile to "super."; the testimony; Neleh's paper; every memory (2018, 2019, TPOOL); the board's side; Alyi's night; the tour; the door; Tuesday's terms.
- **The rules held** (mas-inner-voice §4, §8): no "plan" words, no thesis, lowercase, nothing that works as a post. Two lines are new plans hinted ("someone gets to be in the room." reads as ordinary once and hears the cold open on a rewatch); two are the scramble, flat and fast, never self-pity; none says anything about the staff letter or the firing's reasons. **Predictions: none.**
- **The rewatch chain:** "i still read it twice." → he reads the stranger's post twice → "they've stopped testing it." · "someone gets to be in the room." → the cold open's "…in the room…" · "probably the budget." → "the budget. i said the budget." · "gerg. tasya. the money." → "i had the landlord. the money. gerg."

## 5. The seams (every new or changed transition)

Cause is why the next scene happens; the sound lead is what we hear first (J-cut: under the outgoing shot; L-cut: carried over the next picture); the matched object is what holds the eye across the cut.

| # | Seam (out → in) | Cause | Sound lead | Matched object |
|---|---|---|---|---|
| 1 | 5.12 (the wait) → the first tick | the first user arrives | Gerg's three refresh taps, then SET-PIECE SWING on the first tick | the plate's `0` |
| 2 | v32-7.03 → v35-10.01 (the first weeks) | people are posting what they do with it | the first weeks' driving pulse under the pops (J 0.6 s) | his phone's screen → a stranger's phone |
| 3 | v35-10.08 → 8.01 (Elgoog) | the players notice | the siren through his phone's small speaker (J 0.3 s) | his phone, lit red among the white glows |
| 4 | 8.06 → v35-12.01 (3 AM) | he turns back to the feed | the siren's tail becomes the bullpen's fans (L 0.8 s) | the locked phone → his laptop |
| 5 | v35-12.03 → v35-13.01 (JUN 2018) | he remembers why they started | 2018's server fans and the arena's tinny game audio (J 0.8 s) | the corner counter `USERS:` → `PLAYED AGAINST ITSELF TODAY: 180 YEARS`, same place and size; the glowing line |
| 6 | v35-13.06 → 9.01 (the lobby) | "then a lot more computers." → the money arrives | a revolving door's squeal and a heavy jam (L 0.5 s) | his glass, walking; his place in frame |
| 7 | v31-10.04 → v35-18.01 (the window) | Gerg, stung, that evening | the egg timer's tick becomes a marker's squeak on glass (J 0.6 s) | Gerg's hand: the laptop lid → the marker |
| 8 | v35-18.03 → v35-19.01 (the vision post) | the dream came true; he writes it down | one felt note under the lamp, then his keys | the blank page he opens |
| 9 | v35-19.04 → 11.01 (Atem's leak) | a rival answered the same day; a week later its model is loose | the Build's chip line on the Publish click | his lid closes → Gerg's laptop opens, same place in frame |
| 10 | 11.04 → v35-22.01 (the waitlist) | they're ahead: the line jumps | a velvet rope's snap (J 0.4 s) | the users line on the window → the line behind the TV |
| 11 | v35-22.01 → 12.01 (the pause letter) | the world asks the race to stop | the letter's toast pop (J 0.4 s) | the wall TV → his monitor |
| 12 | 14.01 → v35-27.00 (the Senate) | the reminder: he's going, with the sheet | a gavel's knock under the black (J 0.5 s) | the folded sheet in his hand → the same sheet under his hand at the witness table |
| 13 | 15.14 → v35-28.01 (MAR 2019) | the senator's disbelief sends him back to the night he chose it | a marker's squeak and an old office fan, under "equity" (J 0.8 s) | his hand sets the wallet on the table → the same hand sets a marker on the tray |
| 14 | v35-28.04 → v35-28.05 (back) | the structure's done; the money arrives | the glowing line sweeps back; the hearing's room | the check under the door → a senator's blank pad |
| 15 | v35-28.05 → v35-29.01 (the world) | he won't run the agency, so he takes his rules to the world | the chairman's gavel becomes a passport stamp (J 0.2 s) | the gavel → the stamp |
| 16 | v35-29.05 → 17.01 (one sentence) | the same week, the statement | the stamps' rhythm slows into many pens scratching (L 0.5 s) | his pen signing a guest book → his pen signing the one sentence |
| 17 | 21.02 → 21.04 (the deepfake, restored) | the copy finishes the sentence wrongly | a cut-paper pop; the real one's line on the monitor | the copy beside the real NEDIB → the Orb's iris choosing the one with the pen |
| 18 | v32-S1.13 → v35-41.01 (the war room) | the phone lights and doesn't stop | the war room's driving pulse (J 0.6 s) | the phone in his hand → the phone on the desk |
| 19 | v35-41.06 → v35-42.01 (the flight) | he's chosen | the phone's ring becomes a plane's hum (L 0.5 s) | the notepad on the desk → the notepad on his knee |
| 20 | v35-42.01 → S2.01 (home) | home, at night | the plane's hum becomes the dark room's drone (L 0.6 s) | the pen writing `TERMS` → the same pen carving |
| 21 | S2.02 → v35-43.01 (TPOOL) | the marks: it has happened before | a VHS tracking wipe; the felt line detuned | the eye-light on mark 1 → the first sheet `TO THE BOARD` |
| 22 | v35-43.02 → S2.05 (back) | he walked out still in charge | the tracking line clears; the dark room's tail | the eye-light steps onto mark 3 and his thumb → the Orb's rewind (kept whip to Neleh's desk) |
| 23 | S3.01 → v35-45.01 → S3.03 | the removal, from their side | the procedure's pedal only | Alyi's tile, his face held |
| 24 | S3.04b → S3.06 (the all-hands) | the staff come to Rima | the crowd's hush (J 0.6 s), then one beat of silence; the line waits | Alyi's doorway tile → the real doorway (kept) |
| 25 | S3.05 → S4.02 (Saturday) | the calls pile up | the phones' buzz (the heart gliss goes with S4.01) | Alyi's tile → the phones on the table |
| 26 | S4.02 → S4.08 (Mario) | they need a CEO | four dial tones, pre-lapped under the cut | the phones → the speakerphone |
| 27 | S4.11 → S4.13 (Tasya) | the talks went nowhere; the landlord moves | the key ring's jangle as the wall steps slate | the boardroom wall → the new door in it (S4.12 merged) |
| 28 | S4.13d → S4.07 (Neleh's look, moved) | the statement: Mas and Gerg are going to Macrosoft | the pizzicato slows and hangs on one note | Alyi's reflection looking at the door → her eyes on the blank line |
| 29 | S4.07 → v35-49A.01 (Alyi alone) | the company is emptying into the landlord's building | the held note stops; the bullpen's night air (L) | step 4's blank line → the users line on the window |
| 30 | v35-49A.01 → S5.03 (2 AM) | the same hearts, on his phone | the hearts' soft ticks carry across (L 0.4 s) | Alyi's phone → Mas's phone |
| 31 | S5.03 → S5.02 → S5.04 | he's back with us | his thumb's tick; the room | the phone → the glass and the lanyard → the Orb's iris on the lanyard |
| 32 | S6.06 → S7.01 (Monday) | the board is broken | the band stops dead on Mada's label (kept) | the tiles → the two boxes |
| 33 | S7.07 (Terb) | the agreement is read | (no seam) Terb's read opens on "We have reached…" | the sheet in his hand |

## 6. The tempo (how fast people answer each other)

**The rule** (proposal-v35's pace table): **quick** = the others answer at 0.15–0.35 s (the plans use 0.25), Mas at 0.4–0.5 s (0.45); **normal** = 0.4–0.6 s; **weighted** = longer, only on turns. The gaps inside exchanges get tighter; the air around scenes doesn't. Mas's own thought-then-line gaps never shrink. Gaps that carry business (a typed prompt, an entrance, "His keys stop", a non-answer, a dead stop) keep their length; each is named. The plans' `tempo.gaps` give the gap before each named line; a negative gap is an overlap.

| Act | P35 sc | Beat | Pace | Gap before each named line (s) | Kept as business, or note |
|---|---|---|---|---|---|
| One | 4 | 5.03 | quick | e1-a1-5-03 0.25 |  |
| One | 4 | 5.04 | quick | e1-a1-5-06 0.25, e1-a1-5-08 0.25, e1-a1-5-09 -0.25 (overlap) | Gerg's "That's a v2 problem." cuts in on Rima's last word (overlap 0.25 s): the scene's one overlap. Mas's own gaps unchanged (the V.O. and "it's a preview." keep 0.5 / 0.8). |
| One | 6 | 5.10 | quick | e1-a1-5-20 0.25 | the typing (2.4 s) is business and stays |
| One | 6 | 5.11 | quick | e1-a1-5-23 0.25 |  |
| One | 6 | 5.12 | weighted | — | the wait is the beat |
| One | 8 | 7.01 | normal | e1-a1-7-02 0.60 |  |
| One | 9 | v32-7.03 | quick | v32-a1-0003 0.45, v32-a1-0004 0.25 |  |
| One | 12 | v35-12.01 | weighted | — |  |
| One | 12 | v35-12.02 | weighted | — |  |
| One | 13 | v35-13.02 | weighted | — |  |
| One | 13 | v35-13.03 | weighted | — |  |
| One | 13 | v35-13.04 | weighted | — |  |
| One | 14 | 9.06 | quick | e1-a1-9-03 0.25 | Gerg's entrance (1.2 s) is business and stays |
| One | 14 | 9.09 | quick | v31-a1-0005 0.25, v35-a1-0008 0.35, e1-a1-9-07 0.45, e1-a1-9-08 0.25 | his hold after "it does." (1.2 s) stays: it's his |
| One | 15 | 9.10 | quick | e1-a1-9-10 0.25 |  |
| One | 17 | v31-10.02 | quick | e1-a1-10-01 0.45, e1-a1-10-02 0.25, e1-a1-10-03 0.45 |  |
| One | 18 | v35-18.02 | quick | v35-a1-0010 0.45 |  |
| One | 19 | v35-19.03 | weighted | — |  |
| One | 20 | 11.01 | quick | e1-a1-11-05 0.45 |  |
| One | 21 | 11.03 | normal | v35-a1-0011 0.40 |  |
| One | 23 | 12.02 | quick | e1-a1-12-03 0.25 |  |
| Two | 27 | 15.05 | quick | e1-a2-15-05 0.25 |  |
| Two | 27 | 15.11 | quick | e1-a2-15-11 0.45, e1-a2-15-12 0.25 |  |
| Two | 28 | v35-28.02 | quick | v35-a2-0003 0.45, v35-a2-0004 0.80, v35-a2-0005 0.45, v35-a2-0006 0.80, v35-a2-0007 0.45 | Alyi's two questions wait for the marker (0.8 s: business) |
| Two | 28 | v35-28.03 | quick | v35-a2-0009 0.45, v35-a2-0010 0.50 |  |
| Three | 33 | 20.06 | quick | e1-a3-20-06 0.45, e1-a3-20-08 0.45 |  |
| Three | 36 | 22.01 | normal | — | the V.O. waits one beat after the date and the counter have been read (the counter lands at 4.37 s) |
| Four | 41 | v35-41.02 | quick | v35-a4-0002 0.45, v35-a4-0003 0.25 |  |
| Four | 41 | v35-41.03 | quick | v35-a4-0005 0.45, v35-a4-0006 0.25 |  |
| Four | 41 | v35-41.04 | quick | — | overlaps: AUHSOJ's fragment under the V.O.'s first word |
| Four | 45 | S3.00a | weighted | — | the join's pre-roll 1.0 s tighter (the 11:59 wait); every line and the held beat after "Do you have any questions?" stay |
| Four | 46 | S3.04 | quick | a5-27-13 0.25, a5-27-14 0.25, a5-27-15 0.25 |  |
| Four | 46 | S3.04b | quick | v31-a4-0003 0.25 |  |
| Four | 47 | S4.08 | quick | a5-27-31 0.25 | Adelina's overlap stays |
| Four | 49 | S4.09 | quick | a5-27-36 0.25, a5-27-37 0.25 | head 1.2 → 0.8 s (12A: shorter holds) |
| Four | 49 | S4.10b | quick | a5-27-39 0.25, a5-27-40 0.25, a5-27-41 0.25 |  |
| Four | 50 | S5.09 | quick | v31-a4-0007 0.25, v31-a4-0008 0.45 | "His keys stop, for half a beat" (0.81 s) stays |
| Four | 50 | S5.06 | quick | a5-29-10 0.45, a5-29-11 0.25 | the scroll to Alyi's name (1.6 s) stays |
| Four | 50 | S5.09-back | quick | a5-29-17 0.25 |  |
| Four | 51 | S5.11 | quick | a5-29-21 0.45, a5-29-22 0.25, v31-a4-0013 0.25 | the door's crack on "desk" (1.2 s) stays |
| Four | 54 | S7.06-cont | quick | a5-30-09 1.00 | the look-around is a beat, 1.6 → 1.0 s |
| Four | 54 | S7.07-cont | quick | a5-30-13 0.45, v31-a4-0016 0.25, a5-30-15 0.45 | Mada's non-answer after "you're staying?" (0.9 s) and the dead stop before "Good question." (1.6 s) stay |
| Four | 56 | S8.07 | quick | a5-31-03 0.25 | the rack to the vault and Gerg's exit, 4.1 → 1.9 s |

- **Weighted, untouched:** sc 5 (six years and eleven months), 12 (3 AM), 13 (JUN 2018, 0.6 s gaps), 19 (the vision post), 39 (the call), 45 (noon from their side: only the join's pre-roll, −1 s), "alyi voted." / "He did both." (S5.07b), Neleh's look (S4.07) and 55 (the count).
- **Overlaps:** launch night's one (Gerg over Rima, 0.25 s), Adelina over Mario (kept), and the war room's calls (Tasya's tile and AUHSOJ's fragment each 0.3 s under the line before).
- **What it saves:** about 5.0 s in Act One, 0.7 s in Act Two, 0.55 s in Act Three and about 5.8 s in Act Four.

## 7. Verification ("confirm before lock")

Read 2026-09-28. X posts were read raw from X's embed endpoint (`cdn.syndication.twimg.com/tweet-result?id=…`, the facts file's method), which returns the exact text and UTC time; OpenAI and Stack Overflow pages from the Internet Archive's captures of the day. Reuters, CNBC, CBC and Forbes returned 403 or timed out here.

| # | Item | What the source says | Source · tag | Result, and what the script does |
|---|---|---|---|---|
| 1 | **The tour's stops and order** | Toronto, Washington (May 16, the hearing) and Rio came first; Lagos was "the fourth stop in the first week" (May 19); Madrid May 22 (La Moncloa); Warsaw May 23 (University of Warsaw); Paris May 23 (Macron's post); London May 24 (Sunak; UCL); Munich May 25 (TUM) | TechCrunch (May 25, 2023), Techpoint Africa (May 19), La Moncloa (May 22), Coopernicus.pl, TUM · **[V]** | **Changed.** The stamps after the hearing run `RIO DE JANEIRO · LAGOS · MADRID · WARSAW · PARIS · LONDON · MUNICH`; Toronto is dropped (before the hearing). **Paris came before London**, so the out's "Paris guest book" names no city |
| 2 | **"cease operating"** | TIME, at UCL, May 24: "Either we'll be able to solve those requirements or not. If we can comply, we will, and if we can't, we'll cease operating… We will try." Decrypt prints the same. Reuters' version ("We will try to comply, but if we can't comply we will cease operating.") reached me only through search summaries | TIME (May 24, 2023), Decrypt (May 25) · **[V]** | **Changed.** The proposal's "we will try to comply, and if we can't comply we will cease operating." mixed the two reports. Mas says TIME's words: "if we can comply, we will, and if we can't, we'll cease operating." (v35-a2-0011) |
| 3 | **"no plans to leave", in full** | "very productive week of conversations in europe about how to best regulate AI! we are excited to continue to operate here and of course have no plans to leave." | @sama, id 1661975237280567297, 2023-05-26 05:59:09 UTC (7:59 AM in Europe; 10:59 PM PT May 25) · **[P]** | **Confirmed.** The card shows the second sentence with a print ellipsis; the rail `MAY 26, 2023` stands (local time, where he was) |
| 3a | NOTERB's post | "There is no point in attempting blackmail — claiming that by crafting a clear framework, Europe is holding up the rollout of generative #AI. To the contrary! …" | @ThierryBreton, id 1661733271472861184, 2023-05-25 13:57:40 UTC · **[P]** | **Confirmed.** Its card is dated May 25 |
| 4 | **The extinction statement's signers** | The statement's page lists Geoffrey Hinton, Yoshua Bengio, Demis Hassabis, Sam Altman and Dario Amodei; CAIS's release names all five | aistatement.com; safe.ai press release (May 30, 2023) · **[P]** | **Confirmed** (MAS MANALT · MARIO · SIMED · NOTNIH · OIGNEB). **The count:** "more than 350" appears only in search summaries; no page I could open prints it. The card reads `+ HUNDREDS MORE` |
| 5 | **Nole's Dec 3, 2022 post** | "@sama ChatGPT is scary good. We are not far from dangerously strong AI." | @elonmusk, id 1599128577068650498, 2022-12-03 19:48:57 UTC (11:48 AM PT) · **[P]** | **Confirmed, and it's a reply to Mas:** the card shows "replying to @masa" |
| 6 | **Alyi's regret** | "I deeply regret my participation in the board's actions. I never intended to harm OpenAI. I love everything we've built together and I will do everything I can to reunite the company." | @ilyasut, id 1726590052392956028, 2023-11-20 13:15:21 UTC (5:15 AM PT) · **[P]** (re-read raw; facts L10) | **Confirmed, word for word;** shown in full (name swap only) |
| 7 | **The at-capacity date** | The "ChatGPT is at capacity right now" page was widely reported in December 2022; no source I found gives a first date | Digital Trends, WePC and others via search · **[H]** | **Not verifiable to a day.** It's shown undated, inside the `DEC 2022` montage and the 3 AM scene (no rail on it) |
| 8 | **The launch banner's exact words** | The in-app text ("May occasionally generate incorrect information", as widely remembered) sat in a login-walled page chunk the Archive never captured. The launch post (archived Nov 30, 2022) says: "ChatGPT sometimes writes plausible-sounding but incorrect or nonsensical answers." | openai.com/blog/chatgpt, Archive capture 2022-11-30 18:09 UTC · **[P·arch]** | **Not verifiable.** The banner is the show's own UI line, `research preview · may make things up` `[INVENTED]`, grounded in the launch post; it pays Rima's "a banner that says it makes things up" |
| 9 | **INVIDIA's $1T date** | "Nvidia… hit a $1 trillion market value on Tuesday" (May 30, 2023); others: "fleetingly crossed… before retreating" | CBS News (read); Bloomberg / US News (search summaries) · **[V]** | **Confirmed:** `INVIDIA · $1,000,000,000,000 (INTRADAY)` on May 30 stands |
| 10 | **Macrosoft's Feb 7 wording** | "We're excited to announce the new Bing is running on a new, next-generation OpenAI large language model that is more powerful than ChatGPT and customized specifically for search." | blogs.microsoft.com, Feb 7, 2023 · **[P]** | **Confirmed.** The TV chyron `THE NEW GNIB · POWERED BY NOPEAI` is the show's paraphrase of it; Gerg's line is invented and consistent |
| 11 | **Macrosoft's Jan 23 "deploy… across our consumer and enterprise products"** | "Microsoft will deploy OpenAI's models across our consumer and enterprise products and introduce new categories of digital experiences built on OpenAI's technology." Also: "As OpenAI's exclusive cloud provider, Azure will power all OpenAI workloads…" | blogs.microsoft.com, Jan 23, 2023 · **[P]** | **Confirmed.** Tasya's invented "And we'd like it in everything we make." is consistent; the second sentence grounds "You'll build everything on our servers." |

**Also checked, for lines the new scenes type or voice** (not on the proposal's list):

| Item | Source · tag | Result |
|---|---|---|
| OpenAI Five: "plays 180 years worth of games against itself every day, learning via self-play… on 256 GPUs and 128,000 CPU cores" | blog.openai.com/openai-five, Archive capture 2018-06-25 · **[P·arch]** | Confirmed: the 2018 counter, "a hundred and eighty years", the racks' GPUs |
| The vision post's title and three passages | openai.com/blog/planning-for-agi-and-beyond, Archive capture 2023-02-24 20:03 UTC · **[P·arch]** | Confirmed word for word (the em dashes included) |
| Mar 11, 2019: "invest billions of dollars", "capped at 100x their investment", "controlled by OpenAI Nonprofit's board", the board list (Brockman, Sutskever, Altman, D'Angelo, Karnofsky, Hoffman, Yoon, McCauley) | openai.com/blog/openai-lp, Archive capture 2019-03-11 · **[P·arch]** | Confirmed: Gerg's premise, "a hundred times", "the board.", and Mada and the Quiet Vote in the room |
| GTP-4 "passes a simulated bar exam with a score around the top 10% of test takers" | openai.com/research/gpt-4, Archive capture 2023-03-14 · **[P·arch]** | Confirmed: `SIMULATED BAR EXAM · TOP 10%` |
| ChatGPT Plus "$20/month", Feb 1, 2023 | openai.com/blog/chatgpt-plus, Archive capture 2023-02-01 · **[P·arch]** | Confirmed: `PLUS · $20` |
| "Temporary policy: ChatGPT is banned" | meta.stackoverflow.com/questions/421831, Archive capture 2022-12-05 · **[P·arch]** (posted 05:34 UTC Dec 5) | Confirmed |
| "ChatGPT sets record for fastest-growing user base - analyst note" | Reuters (Krystal Hu), Feb 2, 2023, via Yahoo Finance's syndication (search) · **[H]** | Used as the clipping's headline (no figure). The proposal's `FASTEST-GROWING CONSUMER APP EVER` is replaced with the real headline's words |
| Bard's waitlist opens, US and UK | The Register, TechCrunch, Fortune, Mar 21, 2023 (search) · **[V]** | Confirmed |

**Dropped or paraphrased because they couldn't be verified:** the at-capacity page's date (shown undated), the launch banner's exact words (an invented banner instead), the statement's exact count ("hundreds"), and the proposal's "Paris" guest book and TORONTO stamp (wrong order).

**Logged in the facts file:** [facts.md](../../facts.md), "v3.5 rows" X1–X23, following the v3.1 and v3.2 passes' practice (the rows above are unchanged; X17 replaces §B's "cease operating" fragment, and X6 upgrades §B's NOLE row to [P]).

## 8. The takes (Kokoro)

**33 recorded, 1 cut, 1 reused, 4 restored.** Every new read copies its reference take's speaker, voice, speed and device, i.e. the character's existing Kokoro voice (`ref` in the spec). Mas's V.O. is the v3.4 V.O. chain (am_michael · a-michael-close · vo-close). Read with fastrec `--workers 2` through `ops/heavy.sh` (about 60 s of wall time for the first pass). **Never a clone of anyone.**

| Id | Speaker | Line | Audible s | Speed · device | ASR (CER) | QA |
|---|---|---|---|---|---|---|
| v35-vo-01 | MAS MANALT | they've stopped testing it. they're using it. | 2.61 | 0.87 · — | 0.0 | — |
| v35-vo-02 | MAS MANALT | someone gets to be in the room. | 1.82 | 0.85 · — | 0.0 | — |
| v35-a1-0001 | ALYI | Nobody taught it that. It played itself. | 3.38 | 0.87 · — | 0.0 | — |
| v35-a1-0002 | MAS MANALT | a hundred and eighty years. since this morning. | 3.1 | 0.9 · — | 0.0 | — |
| v35-a1-0003 | ALYI | Make it bigger and it could learn anything. | 3.06 | 0.87 · — | 0.0 | — |
| v35-a1-0004 | MAS MANALT | how much bigger? | 1.11 | 0.9 · — | 0.0 | — |
| v35-a1-0005 | ALYI | Games now. Robots, maybe. After that… I don't know. | 4.07 | 0.87 · — | 0.0 | — |
| v35-a1-0006 | MAS MANALT | then a lot more computers. | 1.8 | 0.9 · — | 0.0 | — |
| v35-a1-0007 | ALYI | Something that can learn anything, Mas. What else would you build? | 4.41 | 0.87 · — | 0.038 | — |
| v35-a1-0008 | TASYA | And we'd like it in everything we make. | 2.2 | 0.85 · — | 0.0 | — |
| v35-a1-0009 | RIMA TAMURI | Still a preview? | 0.88 | 0.94 · — | 0.0 | — |
| v35-a1-0011 | MARIO | Point two: if someone's going to build it, it should be someone who's scared of it. | 3.95 | 0.95 · — | 0.0 | — |
| v35-a1-0012 | OIGNEB | You signed it. Now put the stamp down. | 2.57 | 0.87 · — | 0.0 | — |
| v35-a1-0010 | MAS MANALT | still a preview. | 1.17 | 0.9 · — | 0.0 | reuse of e1-a1-5-11 |
| v35-a2-0001 | MAS MANALT | i get paid enough for health insurance. | 2.22 | 0.91 · — | 0.0 | — |
| v35-a2-0002 | GERG MOCKBRAN | The next one costs billions. Nobody donates billions. | 3.15 | 1.02 · — | 0.0 | — |
| v35-a2-0003 | MAS MANALT | so they don't donate. they invest. | 2.16 | 0.92 · — | 0.0 | — |
| v35-a2-0004 | ALYI | Capped at what? | 1.04 | 0.95 · — | 0.0 | pace |
| v35-a2-0005 | MAS MANALT | a hundred times. | 1.22 | 0.92 · — | 0.0 | — |
| v35-a2-0006 | ALYI | And who's in charge? | 1.48 | 0.95 · — | 0.0 | pace |
| v35-a2-0007 | MAS MANALT | the board. | 0.8 | 0.92 · — | 0.0 | — |
| v35-a2-0008 | MADA | And you? | 0.72 | 0.96 · — | 0.0 | — |
| v35-a2-0009 | MAS MANALT | nothing. | 0.74 | 0.9 · — | 0.0 | — |
| v35-a2-0010 | MADA | Good answer. | 0.82 | 0.96 · — | 0.0 | — |
| v35-a2-0011 | MAS MANALT | if we can comply, we will, and if we can't, we'll cease operating. | 4.11 | 0.915 · pa | 0.0 | — |
| v35-vo-03 | MAS MANALT | the budget. i said the budget. | 2.11 | 0.87 · — | 0.0 | — |
| v35-vo-04 | MAS MANALT | gerg. tasya. the money. the money. the money. | 3.42 | 0.93 · — | 0.121 | pace, pause-in-voice |
| v35-a4-0001 | GERG MOCKBRAN | They took my chair. Told me after. So I quit. | 2.86 | 1.0 · call | 0.0 | — |
| v35-a4-0002 | MAS MANALT | you didn't have to. | 1.22 | 0.9 · — | 0.0 | — |
| v35-a4-0003 | GERG MOCKBRAN | Yeah. I did. | 0.74 | 1.0 · call | 0.0 | — |
| v35-a4-0004 | TASYA | We found out a minute before the rest of the world, Mas. One minute. | 3.8 | 0.85 · call | 0.038 | pace |
| v35-a4-0005 | MAS MANALT | i got a few more. | 1.33 | 0.9 · — | 0.0 | — |
| v35-a4-0006 | TASYA | Then we should talk. | 1.22 | 0.86 · call | 0.0 | — |
| v35-a4-0007 | AUHSOJ (doubled preset) | —the tender's in trouble— | 1.26 | 1.1 · call | 0.0 | — |
| v35-a4-0008 | TERB | We have reached an agreement in principle for Mas Manalt to return to NopeAI as CEO with a new initial board of Terb (Chair), the Other Yrral, and Mada. | 8.27 | 1.02 · — | 0.053 | cut from v3-a4-0004 |

- **MARIO's "Point two…"** (v35-a1-0011) is his Kokoro voice at 0.95, read slower than his memo (5.4 syll/s against 5.8 at 1.02) for the sincere turn: **it's the final take in the one film** (choice 11A). Its mix needs the proposal's work (level, room, a light EQ to the ElevenLabs lines).
- **Re-read once,** after the first pass: twelve takes whose forced pauses cut into still-sounding voice (six dips of −6 to −17 dB), whose "Robots" smeared into "are robots", whose short questions read slow, or whose speed was outside the voice's band. After the re-reads: **0 problems.**
- **Soft flags left, for an ear:** v35-vo-04, the war room's count (5.6 syll/s by design, "faster than he ever thinks"; two small pause dips at −19 and −26 dB; the ASR hears "tasya" as "toss you", the lexicon's pronunciation); v35-a4-0004 (Tasya, 5.1 syll/s); v35-a2-0004 and -0006 (short questions reading slow, 2.9 and 2.7 syll/s). The ASR hears "Mas" as "Moss" (the lexicon's pronunciation) in v35-a1-0007 and v35-a4-0004.
- **AUHSOJ has no voice in the registry.** His fragment (v35-a4-0007) doubles the photographer's stock preset on the call chain, for timing only; the row keeps his name. The ElevenLabs pass casts him from the library (never the real person's voice). Adding an `auhsoj` voice to `audio/voices/cast.json` is the voices track's call.
- **The cut:** v35-a4-0008 is v3-a4-0004 from "We" (word 8, 2.955 s) to the end, cut at the midpoint of the 0.43 s gap after "once", 12 ms fades, room-tone handles, no chain (the source is dry), −16 LUFS; 8.86 s file, 8.27 s audible.
- **The reuse:** v35-a1-0010 is e1-a1-5-11's file ("still a preview."), no new audio.
- **Restored, no new take:** e1-a1-9-09 (Gerg's GNIB line), e1-a3-21-02, e1-a3-21-04, e1-a3-21-06 (the deepfake beats).
- **Dropped from the lock** (the files stay): v32-a1-0005, v32-a1-0007, e1-a2-15-13 (the clone), v3-vo-20, v34-vo-09, a5-25-01, a5-27-08, a5-27-20, a5-27-23, a5-27-29, v3-a4-0004 (replaced by its cut).
- **For the ElevenLabs pass** (PLAN §8 step 3): every new line except MARIO's, plus AUHSOJ's casting, SIRRAH's recast (her two lines), and v35-a4-0008 cut the same way from the EL Terb take.

## 9. For the picture, sound and score passes

- **New art** (PLAN §8 step 4 lists the sets): the first weeks' phones and prompts (sc 10); 3 AM (12); NopeAI's first office by night (13) and by day (28), the ATOD arena drawn top-down in its own game medium, the lone desk; the window's users line (18, reused at 21, 22 and 49A); the vision post's editor (19); GNIB's chyron and face (15); DRAB's rope (22); Nole's FILED stamp and ZAI CORP. papers (23); the reminder card and the witness table opener (26–27); the passport, the lectern, NOTERB's post (29); the signature scroll and the purchase orders (30–30A); the INVIDIA logos (8, 13); the war room's tiles and notepad (41); the plane (42); TPOOL at 240p (43); Neleh's desk props (44); Alyi's held face (45); the staff's beat (46); Alyi alone (49A); the restored deepfake (35: one copy).
- **Style leaps:** the tear on the heatsink (7.02: 2.5 s near-photoreal macro, objects only, choice 9A; fallback BASE) and the hourglass (S7.13, unchanged). **CLOD's claymation insert** (11.03–11.04) is optional: fitted to the right pane's frames, so the timing is identical either way. If both land, Ep1 has three leaps, the two in Act One about 4 minutes apart.
- **Memory tiers:** 2018 and 2019 are T3 cut-paper (flashback-map §0.1), in by the intro's glowing line and out by its sweep back; TPOOL is T2a, 240p, silhouettes only, in by a VHS tracking wipe.
- **New cues:** the first weeks' pulse, 2018, 3 AM (no score, one felt note), the window, the vision post, 2019, the war room's pulse, the flight's note, TPOOL's detuned line. Refits everywhere else. The show's own sound (no trio, no generic pads).
- **Sound:** a group laugh from the library under the window (no voice takes); the stamps; the gavel-to-stamp; the siren-to-fans; the hearts' ticks across Alyi's cut; the phones' dial tones pre-lapped into Mario's split.

## 10. Judged differently from the proposal, and why

1. **"cease operating":** TIME's exact words, not the proposal's hybrid of two reports (§7 #2).
2. **The tour:** Rio → Munich, not Toronto → Paris; the guest book names no city (§7 #1).
3. **The statement's count:** "hundreds", not "350" (§7 #4). **The clipping:** Reuters' headline words, not "FASTEST-GROWING CONSUMER APP EVER" (the UBS claim in a headline's clothes).
4. **The banner:** an invented line in the show's UI (`research preview · may make things up`), since the real words couldn't be read (§7 #8).
5. **Every signer's pen becomes an order, but not Mas's:** his hand stays empty, keeping v3.3's P7 ruling (his compute came through the landlord). "The ones who warned are the ones buying" still reads.
6. **TPOOL is 6.0 s** after the pay-back set, not 5: the lead's 5A says "about 6 s" and notes that 3.5 s was unreadable, so the pay-back set's −1 s on its second shot is taken from its 7 s version.
7. **Mas's "still a preview." at the window reuses launch night's take:** the same words and the same read, which is the joke; no new take.
8. **The first weeks' Nole card is a reply to Mas** (the raw post is addressed to @sama): the card says so.
9. **The 2 AM hearts come before the home shot** (S5.03 moves ahead of S5.02) so Alyi's hearts match onto Mas's phone; the rail rides the match (it's on 49A, Alyi's night, already 2:06 AM).
10. **Alyi's held face (45) is its own 1.2 s beat,** after the click and before the post, so the art pass has a clear shot to draw.
11. **The war room overlaps its calls** (two 0.3 s J-cuts), the proposal's "overlapping calls", to stay near its 22 s budget.
12. **The Senate opener is a new beat** (v35-27.00: the sheet under his hand, the camera lifting to the room), because cutting 15.01–15.03 took the hearing room's only establishing wide and the chairman's plate with it (the plate moves to 15.06).
13. **Tasya is "he"** in the script, as in every earlier draft (the proposal says "she" twice).

## 11. Guardrails and the balance

- **Parody names only**, including the new ATOD, STACK UNDERFLOW (proposed; the naming owner confirms), ZAI CORP., DRAB, NOTERB, AUHSOJ, THE FIRST CHECK, FOUNDER MODE, NOR, TPOOL.
- **No motive at a contested moment:** no reason for the firing (the desk's props are a feeling of why, never an answer; the post is the board's own words); nothing about who organized the staff letter (the letter still arrives by Gerg's reading, after it exists); no testimony V.O.; the sealed memo stays out; Alyi's vote is never explained (49A is its cause's aftermath, and his own post closes it).
- **Mas never orchestrates the staff letter.** The war room's calls are Gerg, the landlord and the money, all reported; "gerg walked out for me." is cut; the return's count names the landlord, the money and Gerg, never the staff.
- **No family or private life:** Alyi's night is the office; the 3 AM post's "sister" is an invented stranger's.
- **No real face from a real likeness:** hands only for the first weeks' strangers, the tour's leaders and the senator in 28.05; TPOOL is silhouettes; the 2018 side project's researcher is a hoodie on a chair.
- **No clone:** the Senate's cloned voice is cut; AUHSOJ doubles a stock preset; nobody imitates the real person.
- **The balance (guardrails §2b, updated):** Ep1 roasts no party. The one fake is the president's deepfake, and his own real reaction ("When the hell did I say that?") is the joke, in his favour; the Senate's chairman now speaks only his real jobs question. RUMPT stays the cold open's unattributed lit window. If the guardrails owner reads the copy's invented line as a roast, the fix is to let the copy just clap (the proposal's own fallback).

## 12. The season and the bible (updated)

| File | What changed |
|---|---|
| [ep02/outline.md](../../../ep02/outline.md) (+ [beats.md](../../../ep02/beats.md) #19) | Neleh's podcast restored at the lanyard split (May 28, 2024), with the new board's reply `[K]` and the Mar 8 review's rail kept; the memo stays out |
| [ep12/outline.md](../../../ep12/outline.md) | The reveal of his why from Mas's chair at THE WOODROSE; `HOW DO I WIN?` retired (choice 8A), 1993 kept as the intro's imagery; the finale's last exchange re-thought; the voice's silent addressee re-thought |
| [timeline/flashback-map.md](../../../../timeline/flashback-map.md) | Ep1's three memories (about 66 s); THE WOODROSE's five parts from Ep3; one full motive flashback per later episode; the 1993 thread without its question |
| [bible/motives-and-the-race.md](../../../../bible/motives-and-the-race.md) §5 (and a pointer in §3) | Each player's Ep1 act as built; Mas's thread without the 1993 question; Nesnej's plants; Neleh's podcast |
| [timeline/season-flashbacks-overview.md](../../../../timeline/season-flashbacks-overview.md) §4 (and §1, §3) | ATOD Ep1 (2018) → Ep5 (the win) → Ep8 (the 2017 origin); the text side project in Ep1; Breakout with THE WOODROSE in Ep3; the 2019 structure in Ep1; budgets |
| [bible/guardrails.md](../../../../bible/guardrails.md) §2b | Ep1's row: no party roasted; the president's own real line is the joke |
| [bible/mas-inner-voice.md](../../../../bible/mas-inner-voice.md) §3 (and §2) | The rattled-count example is the war room's count (the 406/407 count is cut); the silent addressee follows the Ep12 re-think |
| [ep01/facts.md](../../facts.md) | "v3.5 rows" X1–X23: every verified item (§7) |
| [ep01/flashbacks.md](../../flashbacks.md) | A status note at the top: the three v3.5 memories, pointing to the map |

## 13. For a person to check

1. **The rewatch test:** "they've stopped testing it." (moved, never named?), "someone gets to be in the room." (ordinary once, the cold open on a rewatch?).
2. **The war room:** does it read as a scramble with a still face, and does the count read as rattled, not comic?
3. **The 2018 night:** at 34 s, does it hold, or does it want the §2 trims?
4. **Alyi's turn:** the held face (45), his night (49A), "He did both." (50) and his post (53). Is the cause clear without a word about his vote?
5. **The takes, for an ear:** MARIO's point two beside the ElevenLabs cast; the war room's count; Tasya's minute; the two short questions in 2019.
6. **The balance:** does the restored deepfake read as a laugh at fakes, not at the president?
