# Ep1 v3.2: the moods a viewer feels, re-measured on the final film (`v31-mood`, 2026-09-28)

> **The ask (the lead, same authorization as [mood-analysis.md](mood-analysis.md)):** re-run the mood analysis on the final film, compare it with the v3 analysis, and check it against [calibration](../../../../bible/calibration.md). Six questions:
> 1. Does the firing land as a shock now?
> 2. Does launch night read warm without lounge?
> 3. Do the set pieces peak?
> 4. Is the arc varied?
> 5. Does the score keep the show's own sound?
> 6. Did anything over-correct?
>
> **Nobody watched or listened.** The method is the v3 analysis's (§1 there). Each claim says whether it's **measured** (the picture and the mix of `out/ep01/full-v3/ep01-v32.mp4`), **looked at** (657 sampled frames), **read** (the v3.2 transcript, script-v32 notes and the v3.2 cue sheets) or **judged**.
>
> The chart is [`out/ep01/full-v3/mood-curve-v32.png`](../../../../../out/ep01/full-v3/mood-curve-v32.png). Its feeling lane lays the v3 film's likely curve (grey) under v3.2's, mapped chapter by chapter. Nothing else was edited or committed. The sampled frames were deleted.

**The film:**
- the Kokoro film, 21:24.54, −16.09 LUFS integrated (measured);
- its chapters as the lead gave them;
- the cold open's new 26.7 s ending into the intro's cursor;
- the v3.2 score (cue sheets in `audio/ost/tracks/e01-v3-*/cues.json`).

---

## 0. The short version

| Question | Answer | The evidence |
|---|---|---|
| **1. The firing a shock?** | **Yes.** It's the film's strongest moment now. | **Measured:** 16.4 s of the suite, then Alyi's sentence on his side. Then a hard cut to the Remove dialog, from 8% to 64% luma for 2.4 s. The click drops the mix to −49 LUFS for 4.7 s. THE PLAN comes 31 s *after* the blow. **Judged:** the likely intensity rises from 6 to 9. |
| **2. Launch night warm without lounge?** | **Without lounge, yes. Warm, only faintly.** | **Read:** the trio is gone. It's the felt, a chip pulse and Gerg's Build in the F-minor modal home. **Measured:** the picture hasn't changed (9.1% luma, R−B −17.4, the stillest scene). So picture and score now agree on *curious and a little cool*, not *warm and giddy*. Act One's score has shifted cooler (§3.2). |
| **3. Set pieces peak?** | **Not in level. In structure, one now does: the shock.** | **Measured:** 36 of 50 story scenes (84% of story time) sit within −15.5 to −18.0 LUFS; v3 had 87%. The odometer is −15.9 (v3 −16.5) and the avalanche −15.6 (v3 −15.5; its score was ridden 2 dB down). |
| **4. Arc varied?** | **Better shaped, same plateau.** | **Judged:** tension 6 or higher is 26% of story time (v3 25%). Acts Two and Three average 3.79 (v3 3.78). The peak is now a real peak. The share of the film that feels amused, wry or dry falls from 65% to 57%. |
| **5. The show's own sound?** | **Yes.** | **Read:** the first-round score is restored. Launch night uses the identity colours (felt, chip, Build). The leitmotifs and the no-third button are in place. Suspense or dread is 14.5% of story time (v3 10.8%), still a minority. |
| **6. Over-correction?** | **Three mild drifts, none severe.** | (a) Act One's score lost its warmth: warm is 12% of the act, against 35% in v3. (b) The inner voice has 11 lines, inside calibration's 10–14, but there's a **6:49** run with none (3:16 → 10:05, all of Act Two). (c) The picture cuts more often: 10.7 → 12.7 cuts a minute over the story, against calibration §1's "add scene, not air". |

**Verdicts (judged, by story time):**

| | v3 | v3.2 |
|---|---|---|
| desirable | 73% | **87.5%** |
| flat | 16% | 12.5% |
| mis-toned | 7.5% | none |
| conflicting | 3% | none |

The flat stretches are launch night, the odometer, Neleh's paper, the board's Sunday middle and the coda.

**The biggest remaining mood issues:**
1. Launch night has no warm channel.
2. The faces that matter are still near-black (4.5–5.4% luma).
3. The set pieces are level with the talk.
4. A 6:49 drought of Mas's inner voice across Act Two.

§4 has small, proportionate fixes for each. Every one is a single spot and none is a re-score, per calibration's "fix the named cue".

---

## 1. What changed since v3, measured

| | v3 film | **v3.2 film** |
|---|---|---|
| Length, integrated loudness | 21:25.75, −16.07 LUFS | 21:24.54, −16.09 LUFS |
| Story cuts (detector) | 216 · 10.7 a minute | 257 · 12.7 a minute |
| Cuts a minute: Act One / Two / Three / Four / tag | 9.3 / 15.5 / 12.2 / 8.8 / 17.7 | **12.2** / 14.6 / **15.2** / 10.5 / **25.7** |
| Story luma: median · share under 8% · share warm (R−B > 0) | 10.9% · 34% · 15% | 11.3% · 31% · 15% |
| Talk share of story time · V.O. share | 58% · 6.7% | 55% · **2.8%** |
| V.O. lines · the longest runs without one | 24 · 3:41, 3:05, 2:46 | **11** · **6:49** (3:16 → 10:05), 4:11 (16:38 → 20:49), 3:40 (12:47 → 16:27) |
| Scenes inside −15.5 to −18.0 LUFS | 34 of 45 (87%) | 36 of 50 (84%) |
| Score mood shares (cue sheets; §3.2) | warm 20 · intimate 18 · dry 29 · suspense 11 · comic 10 · exhilarating 4 · none 9 | warm **13** · intimate **23** · dry 26 · suspense **15** · comic 9 · exhilarating 3.5 · none 11 |
| POV (judged) | Mas's inner voice heard in 25% of story time; the rest with him, or away | **his visible move 39%** · his inner voice 20% · with him 25% · away from him 16% |

---

## 2. Sequence by sequence (v3.2 film time)

**Units** as in v3:
- **Luma:** mean brightness, as a percentage of white.
- **R−B:** warmth, negative for cool.
- **Mix:** the short-term loudness's energy mean.
- **"vs v3":** what moved.

| Time | Sequence | Picture (measured · looked at) | Sound (mix · cue sheet) | Story (judged) | Likely feeling | Verdict | vs v3 |
|---|---|---|---|---|---|---|---|
| 0:00–0:27 | **Cold open**, the rewind "too far" | the stage 27%; the rewind 35%; collapses into the intro's cursor | no score under the hall; a reversed texture (−38 → −22) into the cut | the invite; the Orb's rewind | curious, pulled in | desirable | **the double 1993 is gone** (was conflicting) |
| 0:58–2:05 | **Launch night: his call** | **9.1%, R−B −17.4, motion 0.11: unchanged.** The tungsten spill is still the only warm light. | **the felt, a chip pulse and the Build in F-minor modal** (Fm9, D♭maj9♯11, B♭m9, E♭13sus); section −21.4. **Talk 76%** (87% in v3). | "she's right. it will break." → "it's a preview." The click is his call. | **curious, a little cool; no lounge** | **flat** | was **mis-toned**. The corny colour is fixed, but no channel carries "giddy" now. |
| 2:05–2:23 | The click; Alyi's count | Alyi in the glass at 4.6–4.7% | E♭13sus; the knee's flat line on the chip after the click | "Six years and eleven months." | tender, uneasy | desirable | same |
| 2:23–2:48 | The chat flatters him | dark screens, 9.5% | the same bed (−19.9); **no warm colour arrives** | "it likes me." / "i still read it twice." | amused | desirable | the trio's payoff is gone; the joke carries it |
| 2:48–3:12 | **The odometer; his million post** | 8.9%; the red heat | a straight driving figure (−16.8, featured); **mix −15.9** | **his post** over the million | driven, pleased | flat (under-lifted) | +0.6 LU; he now *does* something |
| 3:12–3:24 | The bill | 7% | the Ache over F | "it's the bill." / "mostly the bill." | a wry sting | desirable | — |
| 3:24–3:33 | **He calls the landlord** (new) | 7.5%; the phone at his ear, lit red from below | the F pedal and shimmer hold; one Rhodes chord on "pen" (−23.2) | "we're going to need more servers." / "I'll bring a pen." | decisive, wry | desirable | new: cause and effect into the check |
| 3:33–4:07 | Elgoog's code red (his phone) | 28.9%, the act's brightest | pizz panic, the siren as a joke; centroid 1.1 kHz | the rival's alarm | amused | desirable | — |
| 4:07–4:50 | The landlord's deal | 21.9%, grey daylight | THE JOB swing → a stop on the pop → Tasya's floor | steps on the check; "and the rent?" | charmed, wary | desirable | — |
| 4:50–5:11 | Weeks on | 16.7% | the swing back, lighter | "we made them dance" | wry | desirable | — |
| 5:11–5:37 | **Sydney** (restored) | 16.5% | GLYPH colours, sweetened: an uncanny music box (−22) | his lines to her: "you've been an extremely good gnib." | uncanny, amused | desirable | new; his exchange gives it a stake |
| 5:37–6:04 | **The Atem leak; the duel** | 21.1% | the Atem sting; the Lighthouse; **the Build's pass from his click** | "give it a minute. it'll be open source."; **his click ships GTP-4** | amused, busy | desirable | the prediction and the click are his |
| 6:04–6:28 | **The pause letter; EMIT; PLEASE REG—** | 23.5%; Nole's desk still near-black; the EMIT page in cream | played straight: a cold pedal, nothing walking; THREAT on the pen | Rezeile's op-ed lands; he writes his ask | a chill, and his move | desirable | was **flat**; the stake is his now |
| 6:28–7:36 | **White House** | **26.1%, R−B +17.4: still the warmest room** | B♭ pomp; the Fountain Pen | he takes the seat nearest the teacher; "how's the dancing?" | delighted | desirable | the act-break step is softer (−29 → −19) |
| 7:36–7:48 | The bay | 6.3% | **−24.3** (was −27.0); no score | his thumb replays the clip | uneasy | desirable | was flat; the chairman's "That voice was not mine." now pays it |
| 7:48–8:56 | **The Senate: his ask; the wallet** | 12.7% | the lighter Under Oath; the stop on the wallet | **"i would form a new agency…"**; declines to run it | amused | desirable | his ask is his move |
| 8:56–9:01 | The tour poster, his stamp | 15.4% | THE RUN (−16.4) | **his own hand stamps it** | brisk | desirable | — |
| 9:01–9:41 | The rooftop, the crack | 41.8%, the brightest scene | grand, uneasy; the climb cut at the crack; the bell | "It doesn't say what it costs." | amused, then uneasy | desirable | the best act-out, as before |
| 9:41–10:12 | Tasya's thirteenth key; the Orb arrives | 13.3% teal | **a softer entry: −37 → −28 → −15 over 2 s** (was +21 dB on one frame); the Water Line | "i made it for everyone else." | tender, wry | desirable | the act break is fixed |
| 10:12–10:28 | The hands runner | 10.2% | THE COPY on chip | he raises his hand, then lowers it | wry | desirable | — |
| 10:28–10:59 | The Tidder post; Gerg's call | 7.1% | the Build in A♭, in passes | "go to sleep, gerg." | warm | desirable | — |
| 10:59–11:06 | Neleh's paper | 30%, a cream page, no speech | −22.5 | a reference on his monitor (it plants her) | idle | flat | new; 6 s without a stake (calibration §4) |
| 11:06–11:27 | The order, the deepfakes | 25.7%, warm cream | held Water Line chords; the verdict | "which one's real?" | amused | desirable | — |
| 11:27–11:40 | **Switch off; DevDay live** | 11%, R−B −27 (the blue stage) | **no score: the hall's applause**; the mix −16.5 | **he switches the monitor off**; "and today, you can build your own chatgtp." | a lift, his stage | desirable | new; his act now has a public high |
| 11:40–11:49 | "super." chosen | 10.2% | the Water Line at home | "thrilled is too much." | wry, intimate | desirable | — |
| 11:49–11:54 | **The surge; he pauses sign-ups** | 6.1% | the Water Line thinned to its pedal (−25.5) | his post pauses the sign-ups | strain | desirable | new |
| 11:54–12:04 | THE CLOCK | 30 cuts a minute | P04, a dead stop, the crane pre-lap (−40 → −20 over 4 s) | Friday | dread | desirable | — |
| 12:04–12:20 | **Vegas, noon; JOIN** | 21%; the practice lap | the suite's pedal; the felt bar; the V.O. 10.6 s in; the mix −18.8 | "gerg's not on it. alyi set it up. probably just the budget." | poised; the wrong read is now **suspense**, not irony | desirable | was **mis-toned** (THE PLAN came first) |
| 12:20–12:34 | **The call: removed** | 8–9% tiles → **the Remove dialog at 64%, hard cut, 2.4 s** → the grid | LEVERAGE low, thinned under **Alyi's sentence (momentary −13 LUFS)**; the dialog; **a dead stop on Remove** | "Mas. The board has decided that you will no longer lead the company." | **shock** | desirable | was **conflicting** |
| 12:34–12:45 | **The silence; "super."; his post** | 10–13%, then **his phone in orange afternoon light** (23%, R−B +37) | **4.7 s at −49** (v3 3.7 s); the buzz; "super."; **6.5 s of room at −36**, no score | "super."; **his own post** ("i loved my time at nopeai… 🫡") | stunned, stung; then composure | desirable | his first move after the blow |
| 12:45–12:54 | That night | 7.7% | the felt's re-entry (−20.9) | "i don't keep score." **TPOOL is cut.** | hurt, held in | desirable | was conflicting; the flash is gone |
| 12:54–13:23 | **THE PLAN on Neleh's desk** | her office first (4.6 s), then the blueprint (R−B −51, saturation 0.76) | her clockwork and a pad (−23.3), **then** the waltz (−18.7) | the explanation, after the fact | dry, informed | desirable | now a door, not whiplash |
| 13:23–14:07 | Board: the call again; the post | 18.7% | PROCEDURE (−19.8) | Alyi's sentence the second time (told twice) | dry, curious | desirable | — |
| 14:07–14:30 | The all-hands; Gerg quits | 13.4% | the pedal, the hush | "Is this a coup?" | sober | desirable | — |
| 14:30–14:59 | Boardroom: hearts, phones | 7.3%; Neleh's face 5.1% | the Door and the choir; the sincere viola | "Then we'll write step four ourselves." | amused, sympathetic | desirable | — |
| 14:59–15:18 | The split: Mario says no | 8.6% | the Lighthouse; the Addendum cut | "In plain English: no." | amused | desirable | — |
| 15:18–15:26 | **The lobby, his side** (new) | 15.1%; CCTV stepping into colour | no score, then one felt note on his look up; the mix −24.0 | **he puts the guest badge on himself and posts it** | a sly lift | desirable | it breaks the away-block with his move |
| 15:26–15:58 | Sunday: the camera; Ttemme | 9.4% | PROCEDURE; the hourglass | the sealed folder | dry, patient | flat | — |
| 15:58–16:22 | Tasya's door; "Step four, Mada?" | 7.9% | Tasya's floor; the hang | the Macrosoft statement | turned | desirable | — |
| 16:22–16:53 | **2 AM** | 6.8% | the Water Line, warm; the Build in A♭ | **"read me the letter."** | relief, warm | desirable | he asks, rather than being read to |
| 16:53–17:27 | The letter; Alyi signed | 10.6%; "alyi voted." close-up **4.5%** | the pedal and the walk; the rest on ALYI | "alyi voted." / "He did both." | hurt | desirable | same (the face is still dark) |
| 17:27–18:00 | **"keep building."; the badge** | 6.4%; Gerg's look 5.3% | the Build, cut on his look; Tasya's floor; its third leaves when he sets the badge down | **"keep building."**; picks up the badge and doesn't wear it; "and the rent?"; "leave it open." | loyal, decisive | desirable | his moves replace two V.O. lines |
| 18:00–18:16 | **The avalanche** | 8.8%, 15 cuts a minute | P11, the full band, **ridden −2 dB** (−16.9); **the mix −15.6, level with the talk** | the label | fun; not lifted in level | desirable, under-lifted | the level went down, not up |
| 18:16–18:35 | Monday: Alyi's regret | 21.3% | the STRAIGHT violin decays | "It has been four days." | bittersweet | desirable | — |
| 18:35–18:55 | The landlord becomes the room | 19% | Tasya's floor; below, above, around | Tuesday's invite: his Accept tap | amused, uneasy | desirable | — |
| 18:55–19:43 | **Tuesday: his terms; the calm-off** | 7.6% | LEVERAGE; a dead stop on "of what?" | **"gerg comes back too."** | amused tension | desirable | his term, stated |
| 19:43–19:54 | The hourglass (the Runway insert) | 10.8% | the turn on "we're so back"; the shatter's held breath | Ttemme's 72 hours | release | desirable | new look, owned |
| 19:54–20:06 | The lobby sign; "okay." | 18.6% | VICTORY LAP −14.4, the loudest cue | **the refused Remove dialog** (the rhyme is fixed) | triumph, ironic | desirable | v3's fix #7 was done |
| 20:06–20:32 | The coda | 22.1%, the orange vault | the vault's F (−27.1); the mix −17.7 | the memo, the nameplate, the chair | quiet, winding down | flat | 31.7 → 26.2 s |
| 20:32–21:02 | **Tag: the duck; CEO of the year** | **the demo film at 45.8%, R−B +17** (near-photoreal), then the dark teal room | the demo's own glossy bed; a 2 s dead cut; MM-12 | "What the quack!"; "it looks calmer than me." | wry, a laugh | desirable | **busier: 25.7 cuts a minute** |
| 21:02–21:14 | Tag: the thud; "noted." | 19.3% | the thud cuts the line; the no-third button; the hum held into the outro | "noted." | quiet unease | desirable | the tag → outro seam is held (the assembly reports +12.7 dB, was +20.5) |

---

## 3. The six questions, with the evidence

### 3.1 Does the firing land as a shock? Yes

- **The order is right.** 16.4 s of the suite comes first: the crane, a practice lap, his glass, "gerg's not on it. alyi set it up. probably just the budget." Then:
  - JOIN;
  - Alyi's sentence, heard on his side (12:22.6);
  - the Remove dialog;
  - the silence;
  - "super." and his post.

  THE PLAN arrives at 12:59, 31 s after the blow, as the board's explanation. The viewer learns it when he does, which is the showrunner's ask.
- **The picture delivers a jolt (measured).** The call's tiles are at 8–9% luma. The hard cut to the dialog is at **64%**, held 2.4 s: the largest brightness step in the story on a single cut.
- **The sound subtracts on the click (measured).**
  - Alyi's line is the loudest thing in the call (momentary −13 LUFS, over LEVERAGE thinned to its pedal).
  - Then **4.7 s at −49 LUFS**, the buzz, "super.", and **6.5 s of room at −36 with no score** under his post.
- **The story's wrong read now works as suspense.** "probably just the budget." is a hope the audience shares for eight seconds. In v3 it was irony, because THE PLAN had already told us.
- **One watch item (judged).** His post plays in orange afternoon light: 23% luma, R−B +37, the warmest shot in Act Four, 20 s after the blow. That's intended (his first move, composure). If it reads as relief too soon, grade it one step toward the suite's grey. It's a one-shot change.

### 3.2 Does launch night read warm without lounge? No lounge, yes. Warm, only faintly

- **The corny colour is gone (read).** The A♭ Rhodes-brushes-upright trio is replaced by the show's identity instruments: the felt, the chip's triangle pulse, Gerg's Build. Calibration §6 calls this on target, and it is on target for "not corny" and "our own sound".
- **But no channel now says "giddy" (measured and read).**
  - **The picture** hasn't changed: 9.1% luma, R−B −17.4, motion 0.11. v3's fix #10 (bring the tungsten in) wasn't done.
  - **The harmony** is the F-minor modal home. The Build is in its F-minor cell here, where v3 had A♭ major.
  - **The chat's section** (2:23–2:47) keeps the same bed, so the warmth never pays off. v3's fix #2 had the warmth arrive *at the chat*.
- **The result (judged): curious and a little cool.** Picture and score now agree, so it's flat rather than mis-toned.
- **Act One's score has shifted cooler overall** (cue sheets, share of the act):

  | | v3 | v3.2 |
  |---|---|---|
  | warm | 35% | **12%** |
  | intimate or curious | 5% | 25% |
  | suspense or dread | 12% | **22%** |
  | comic or caper | 37% | 31% |

  Where the suspense share comes from:
  - the heat now runs on into the landlord's call;
  - Sydney's cue uses GLYPH colours;
  - the pause letter plays straight.

  Each is defensible on its own. Together, Act One is cooler than the mood map's "warm, giddy… exhilarating… caper".

### 3.3 Do the set pieces peak? Not in level

| Set piece | v3 mix | v3.2 mix | Score (cue sheet) |
|---|---|---|---|
| The odometer | −16.5 | **−15.9** | a straight driving figure, −16.8 (featured) |
| The avalanche | −15.5 | **−15.6** | the full band, **ridden −2 dB** (phrases 3–4 at −16.9 and −16.8, where they were −14.9 and −15.1) |
| The lobby sign | — | −16.8 | VICTORY LAP −14.4, the loudest cue section |
| For comparison: talk scenes | −15.7 to −16.8 | −15.5 to −16.8 | — |

- **The v3 finding stands:** the per-segment −16 LUFS master levels the set pieces to the talk.
- **The episode's peaks now come from structure.** The biggest is the shock's brightness spike and silence. The avalanche and the victory lap still read as "fun", not "lift" (judged).
- **This one needs an ear before anyone acts** (§4 #3). The score's −2 dB on the avalanche was the composer's reading of "goofy level hapy".

### 3.4 Is the arc varied? Better peaked, the same plateau (judged)

| | v3 | v3.2 |
|---|---|---|
| Tension 6 or higher / 4 or lower | 25% / 56% | 26% / 56% |
| Acts Two and Three, mean tension | 3.78 | 3.79 |
| The peak (likely intensity) | 6, pre-empted | **9** |
| Amused, wry or dry, share of story time | 65% | **57%** |
| Sequences with his visible move | — | 39% of story time |

- **The new beats give the plateau more causes, not more jeopardy.** His million post, the landlord's call, his click, his ask, his stamp, the switch-off, DevDay, the pause on sign-ups.
- **The feeling varies more** because more of it is *his*: decisive, loyal, a sly lift. That's calibration's spine, working as mood.
- **The rhythm otherwise matches v3:**
  - small cycles in Act One;
  - comedy with one rise in Act Two;
  - a quiet Act Three, now with DevDay's lift and the surge's strain before THE CLOCK;
  - the peak and a long release in Act Four.

### 3.5 Does the score keep the show's own sound? Yes (read)

- **The first-round score is restored** in Acts Two to Four and the tag. One exception: the avalanche's −2 dB.
- **Every sequence's cue names a house motif or palette:**
  - the Build;
  - the Water Line;
  - THE JOB (the Upsell);
  - the Lighthouse and the Addendum;
  - the Fountain Pen;
  - the Door;
  - Tasya's floor;
  - PROCEDURE;
  - BLUEPRINT;
  - THE CLOCK;
  - VICTORY LAP;
  - the no-third button;
  - the knee's flat line after the click;
  - the kink on the odometer.
- **Neither failure mode is present:**
  - no lounge;
  - no generic pad. Round 2's "soft synth pad" isn't in any cue sheet.
- **Suspense or dread is 14.5% of story time**, a minority as calibration wants. Swing is an accent: the lobby and the Upsell.
- **One thing to hear:** DevDay plays with **no score at all** (11 s under the hall's applause). It's his one public high, so check that the applause alone lifts it.

### 3.6 Did anything over-correct? Three mild drifts (read against calibration)

| Ledger | The swing | What v3.2 shows | Verdict |
|---|---|---|---|
| §6 Music mood | "fix the named cue, not the score" | The named cue (launch night's trio) is fixed. Act One's warmth wasn't re-homed: warm 35% → 12% of the act. | **mild over-correction** in Act One's colour (§4 #1) |
| §5 Inner voice | 10–14 lines, each doing what nothing else can | 11 lines, 77 words, none a caption. But **6:49 with none** (3:16 → 10:05), and none at all in Act Two. The moves carry much of it (his ask, his stamp, the seat). | **a watch item.** The count is right; the gap is long. Keep it only if the moves hold the viewer close (§4 #4). |
| §1 Pacing | "add scene, not air"; the scenes are short | 12.7 cuts a minute over the story (10.7); Act Three 15.2 (12.2), the tag **25.7** (17.7); the lock's median stay 15.4 s (19.2). The agency beats added places. | **drifting the wrong way.** Act Three reads less "intimate, quiet"; the tag is busier. |
| §9 Agency | not a declared schemer | His moves are small and public. No plan in V.O., no backroom. | on target |
| §3, §4 Labels, references | attach, don't cut | Sydney, the Atem leak, EMIT and the hands runner each carry his line or his move. Neleh's paper (6 s) has none. | on target; one small flat beat |
| §7 Style leaps | one or two, each owned | the Elgoog demo film (the tag) and the hourglass (the return) | on target |
| §8 Runtime | about 20–22 min | 21:24.5 | on target |

---

## 4. What remains, ranked (small, one spot each)

1. **Launch night's warmth (sound, or picture), a single accent.**
   - **Sound:** at the chat (2:23–2:47), let one warm colour arrive as the payoff to the click. Either the Build's pass in its **A♭ major** (the colour it already has at Gerg's call and at 2 AM), or one Rhodes chord on "it likes me.".
   - **Or the picture:** bring the hallway's tungsten one ramp step into the bullpen.
   - **Not** the trio, and not a new bed. Calibration §6: swing and trio as accents.
2. **The faces (picture).** The non-joke close-ups are unchanged, at 4.5–5.4% luma:

   | Shot | Luma |
   |---|---|
   | "alyi voted." | 4.5% |
   | Gerg's look | 5.3% |
   | Neleh's real face | 5.1% |
   | Mada | 5.4% |
   | "good question." | 5.2% |
   | Alyi in the glass | 4.6–4.7% |
   | the toast | 4.6% |

   A key or rim one or two ramp steps up on the face only, the room untouched (v3 fix #4, not yet done).
3. **One set piece should rise (sound, the mix; for an ear first).** +1.5–2 LU short-term on the avalanche's 14 s (18:00–18:14), as a mix gain row. Leave the score as it is, since the −2 dB ride was deliberate. If an ear finds the avalanche already lifts, drop this.
4. **The inner voice's drought (story; for an ear first).**
   - If Act Two plays distant, restore **one** thought-and-speech gap at an invented beat. The candidate is "he's not wrong." before "how's the dancing?" (the White House), which is calibration §5's preferred kind.
   - Don't restore any of the caption lines.
5. **The tag's density (picture).** The demo film, the cover and the thud now fit into 41 s at 25.7 cuts a minute, after a 26 s quiet coda. If it plays busy, hold the cover beat about 1 s longer (32.03). Or trim 3–4 s more from the coda (the memo's drift) so the quiet lands once.
6. **Small flat beats (story).**
   - Neleh's paper (10:59, 6 s, no stake): cut it, or give Mas a glance at it.
   - The board's Sunday middle (15:26–15:58, 32 s): dry. It's acceptable now, since his lobby move (15:18) broke the away-block.

**The v3 fixes, checked:**

| v3 fix | Status in v3.2 |
|---|---|
| #1 the shock | done |
| #2 launch night | half-done: no lounge, but no warm payoff |
| #3 the set pieces | reversed on the avalanche |
| #4 the faces | not done |
| #5 the bay and the restored beats | done, by other carriers |
| #6 the rewind as a door | done |
| #7 the dialog rhyme | done |
| #8 the board's side's length | done: 3:28, split by his lobby move |
| #9 the act breaks | done: stepped over 1–2 s |
| #10 launch night's picture | not done |
| #11 TPOOL | done: cut |
| #12 the coda | done: −5.5 s |
| #13 the bill | fine |

---

## 5. For a person

1. **Launch night's first 1:49:** curious, or cool? Does the chat's joke carry the warmth without a warm colour?
2. **The shock:** does the 64% dialog read as a jolt, or a flash? Does the 6.5 s of room under his post read as composure?
3. **The avalanche and VICTORY LAP:** do they lift at −15.6 and −16.8?
4. **Act Two, with no inner voice:** close to him, or distant?
5. **DevDay** with no score, under the hall's applause.
6. **The tag's pace**, with the duck.

---

## 6. How it was made, and how to re-run it

The v3 analysis's tools, unchanged, are in the pass's scratch folder, `…/scratchpad/v31-mood/`. The v3.2 inputs and judgements are in `v31-mood/v32/`:

| File | What |
|---|---|
| `scenes.py` | this film's scenes and the judged values |
| `musclass.py` | the mood family of each of the 113 cue sections |
| `music_rows.json` | the cue sections on the episode clock |
| `chart.py` | the v3 chart, with this film's chapters and the v3 curve mapped under it |

```bash
R=/home/jgon/project/art/mrmas; M=<scratch>/v31-mood; PY=$R/audio/.venv-theme/bin/python
cd $R
bash ops/heavy.sh $PY $M/vis.py out/ep01/full-v3/ep01-v32.mp4 $M/v32/vis $M/v32/sel.txt $M/v32/frames
bash ops/heavy.sh $PY $M/aud.py out/ep01/full-v3/ep01-v32.mp4 $M/v32/aud
cd $M/v32 && $PY chart.py $R/out/ep01/full-v3/mood-curve-v32.png
```

**Changes to the tools:** the cut detector is the v3 one, calibrated then at 87% of the lock's shot changes. The SRTs read are the v3.2 pictures' (`out/ep01/full-v3/picture/*.srt`: 235 lines, 11 of them V.O.).
