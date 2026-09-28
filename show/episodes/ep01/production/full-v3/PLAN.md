# Ep1 full episode, v3 attempt: the production plan

> **Status: IN PRODUCTION, from 2026-09-27 ~11:00.** Every pass reads this file and [SHOWRUNNER-NOTES](../../../../production/SHOWRUNNER-NOTES.md) first.
>
> **Showrunner, 2026-09-27:** "to be clear, we can use reported and similar sparingly if not clear what referencing, but most things should just be presented. the goal is a story, not a documentary, it just uses real events as references and guidance but does not need disclaimers. with those pointers in mind, i thought the previous work was close enough that i want you to just do a full episode attempt with your best judgement. i liked the orb outro. also it should say art, script, etc. created by opus 4.5, prompt jgon. we can also try a pass using elevenlabs samples"

**What "a full episode attempt" means here:** the whole of Ep1 as one finished-looking preview.
- **Picture:** pixel art at 1080p, the way Act Four v5 looks, for every act.
- **Sound:** a new score on the mood map, with SFX and a final mix.
- **Around the acts:** the final intro, the 2 s filename card, and the Orb outro (proposal B) with the credits.
- **Voices:** built on the Kokoro takes, plus an **ElevenLabs voice pass** as a second mix.
- **Timing:** everything is cut to a v3 stick lock first (the standing "stick first" rule), then drawn.

**The direction** is [stick/v3-plan.md](../stick/v3-plan.md): arrivals and aftermaths, Mas's inner voice, the cuts, the mood map, and no pointers. It carries three rulings:
- **The Act Four cuts (C13–C16)** are made. The showrunner said "with your best judgement".
- **Hedge labels:** use "(REPORTED)"-type labels only where a viewer couldn't tell what's referenced. Otherwise present the event as story.
- **The model's name:** the credit reads **Opus 5.5**. The showrunner wrote 5.5 once and 4.5 once, and the model is Opus 5.5.

---

## 1. Tracks, owners and hand-offs

| # | Track | Owner (pass) | Needs | Makes |
|---|---|---|---|---|
| S1 | **Script v3**: the cuts, Mas's inner voice (15–25 lines), name plates, facts presented as story, clarity and character beats | `v3-script` | v3-plan, mas-inner-voice, the v2 timelines | `show/episodes/ep01/script.md` draft 6; **`full-v3/beat-plan/<seg>.json`** (the hand-off contract, §2); `full-v3/script-v3-notes.md` |
| S2 | **Takes**: every new or changed line and all V.O., with Kokoro (fastrec) | `v3-lock` | S1 | `audio/ep01/v3/<seg>/` |
| S3 | **The v3 stick lock**: per segment, with arrivals, aftermaths and J/L cuts | `v3-lock` | S1, S2 | `show/reel/ep01-v3/<seg>.json` + `ep01-v3.manifest.json`; the stick reel `out/ep01/reel/ep01-v3-stick.mp4` |
| P0 | **The episode pixel pipeline**: Act Four's lock → layouts → frame → Node renderer, generalized so any segment's stick timeline plus a shot-spec module renders | `v3-pipeline` | Act Four v5 code | `studio/src/episodes/ep01/pixel/` (shared lock/frame/render), with Act Four v5 reproduced frame-identical as the test |
| P1a | **Art: cold open and Act One** (sets, cast, kits not yet drawn) | `v3-art-a` | v2 script minus the v3 cuts | modules in `studio/src/shared/pixel/{rooms,cast,kits}/`; `full-v3/art/art-a.md`; a stills sheet |
| P1b | **Art: Acts Two, Three and the tag** | `v3-art-b` | same | same; `full-v3/art/art-b.md` |
| P2 | **Shots per segment**: layouts on the lock, rendered | `v3-shots-<seg>` | S3, P0, P1 | `studio/src/episodes/ep01/pixel/<seg>/shots.ts`; picture renders |
| P3 | **The Orb outro** (B), rebuilt: credits, no terms line | `v3-outro` | OUTRO-PROPOSALS §B, `studio/src/dev/outro/b/` | `out/ep01/outro/outro-b-v3.mp4` + its audio |
| A1 | **Score on the mood map**, rendered to the lock | `v3-score` | S3, v3-plan §6 | `audio/ost/tracks/e01-v3-<seg>/` |
| A2 | **Rooms and SFX stems** per segment | `v3-sound` | S3 | `audio/reel/ep01-v3/<seg>-bed.wav` |
| A3 | **Mix and master**: Kokoro mix, plus the ElevenLabs mix | `v3-mix` | A1, A2, S2, A4 | `out/ep01/full-v3/mix-*.wav` |
| A4 | **ElevenLabs voices**: cast from the voice library (never a clone, never "sounds like" a real person), samples, then the whole episode | `v3-voices-el` | S1 lines | `audio/ep01/v3-el/`; `full-v3/voices-el.md` |
| F | **Assembly, QA and review:** cold reads, measurements, the review page | lead | everything | `out/ep01/full-v3/ep01-v3.mp4` (Kokoro) and `ep01-v3-el.mp4` (ElevenLabs) |

**Order:**
1. **Now, in parallel:** S1, P0, P1a, P1b, P3, A4 (casting and samples). The sample's temp score (`audio/reel/ep01-v3-sample/music/`) is already being composed; its cues seed A1.
2. **Then:** S2 and S3 (the lock).
3. **Then, in parallel:** P2 (one pass per segment), A1, A2, A4 (the full render).
4. **Then:** A3 and F.

## 2. The beat plan (S1 → S3, P1, P2, A1)

One JSON file per segment (`coldopen`, `act1`, `act2`, `act3`, `act4`, `tag`) in `full-v3/beat-plan/`. It's written against the v2 timelines' beat ids (`show/reel/ep01-full/*-v2.json`; Act Four is `show/reel/ep01-act4-v5.json`).

```json
{"segment": "act1", "source": "show/reel/ep01-full/ep01-act1-v2.json",
 "beats": [
  {"id": "5.02", "action": "keep",
   "arrive_s": 1.2, "hold_after_s": 1.0,
   "lines": [{"id": "e1-a1-5-03", "keep": true},
             {"id": "v3-a1-0001", "new": true, "who": "gerg", "text": "…", "after": "e1-a1-5-03", "gap_s": 0.5, "delivery": "…"}],
   "vo": [{"id": "v3-vo-01", "text": "gerg wants to ship it. …", "at": "start+1.2" }],
   "jcut": [{"line": "e1-a1-5-03", "lead_s": 0.5}],
   "onscreen": {"replace": {"GERG MOCKBRAN · CO-FOUNDER": "GERG MOCKBRAN"}, "drop": [], "add": []},
   "caption": "(only if the picture changes)", "music": "LAUNCH NIGHT · warm build", "why": "…"},
  {"id": "10.*", "action": "cut", "why": "C1: Sydney moves to Ep2"},
  {"id": "v3-5.06b", "action": "new", "after": "5.06", "frame": "HOLD · Alyi in the glass", "set": "bullpen", "…": "…"}
 ]}
```

- **Actions:** `keep` (with edits), `cut`, `merge` (into the beat named in `into`), or `new` (placed after a beat). A `new` beat names its frame, set and characters so P1 and P2 can draw it.
- **Line ids:** new lines are `v3-<seg>-NNNN` and V.O. lines are `v3-vo-NN`. Every changed line is new; the old id is dropped.

## 3. Rules for every pass (binding)

- **Read first:** SHOWRUNNER-NOTES (top four notes), v3-plan, mas-inner-voice, flow-and-continuity §2a, guardrails.
- **Laptop:**
  - Every heavy job runs through `bash ops/heavy.sh …`, with Remotion at `--concurrency=4` or lower, fastrec at `--workers 2`, and `OST_WORKERS=2`.
  - Render at 1080p at most.
  - Never kill another project's processes.
- **Keys** are in `.env`. Never print, log or commit them. Before any commit, scan the staged files for the key values.
- **Voices:** never clone or imitate a real person's voice. No photoreal or near-photoreal likeness of real people. Parody names and logos only.
- **Files:**
  - Write only in your track's folders.
  - Scratch goes in your own subfolder of the session scratchpad. Delete nothing you didn't create.
  - Never edit another track's outputs. Ask the lead.
- **Don't commit.** The lead commits after each step.
- **Honesty:** nobody here can watch or listen. Say what was measured and what was looked at, and never claim a cut "works".

## 4. Where things land

```
show/episodes/ep01/production/full-v3/   PLAN.md (this) · beat-plan/ · art/ · script-v3-notes.md · voices-el.md · review.md
show/reel/ep01-v3/                        the v3 stick timelines + manifest (the lock)
studio/src/episodes/ep01/pixel/          the episode pixel pipeline + per-segment shots
audio/ep01/v3/ · audio/ep01/v3-el/       takes (Kokoro, ElevenLabs); WAVs git-ignored
audio/reel/ep01-v3/                       beds and stems;   audio/ost/tracks/e01-v3-*/   the score
out/ep01/full-v3/                         the films and mixes (git-ignored)
```

---

## 5. v3.1: the finalizing round (from 2026-09-27 ~16:00)

**The showrunner, on the v3 films:**
- "it is looking pretty good as a whole otherwise. i think you did a good job on narrative and pacing overall. however there are still a few confusing transitions that just seem to come out of nowhere… also, i want to bring back the syney and atem references at least… the elevenlabs voices are not as good as i hoped, especially sam who sounds strangely russian"
- "i didn't mean for you to overkill and make it sound goofy level hapy" · "the cold open to intro is not very good transition"
- "i'll let you make your own review, judgements, and update to the full next version" · "you can also attempt the runway transition variations, try your best to get a fully finalized version"
- "also when you finish, remove the old ones if ur able and upload the new variants to drive"

**The work list:**
1. **Reviews:** a newcomer cold read (`read-v3-newcomer.md`) and an editor's transitions and naturalness critique (`review-v3-critic.md`).
2. **Script v3.1:**
   - Fix every weak or bad transition (setup lines, orienting V.O., pre-laps, arrivals, match cuts).
   - Rewrite unnatural lines.
   - **Restore, with context and stakes:**
     - Sydney (sc 10)
     - the Atem weights leak (sc 11)
     - a short "hands runner" in Act Three: everyone in power asks to be regulated, framed by one V.O. line
     - Rezeile's op-ed as one beat inside the pause-letter scene
   - Keep the runtime near the band by trimming elsewhere, never the breath.
3. **Score:** restrained, per the note ("intensity and texture, not genre"). Composers X and Y are re-scoring; then refit to the v3.1 timing.
4. **Cold open:** it ends on the rewind collapsing into the intro's first frame (done in picture; its sound is being redone).
5. **Voices:**
   - Mas's ElevenLabs voice is recast to a neutral American voice, picked by measurement, with an audition file kept.
   - The other principals get an accent check.
   - Kokoro stays the primary film.
6. **Runway:**
   - The tag's Elgoog demo film: near-photoreal, objects only (a toy duck, the parody logo, no people or hands). It's exposed as stills, a pixel-to-native-to-pixel transition. Try variations and keep the best.
   - If credits remain, the hourglass shatter at the return.
   - 500 credits.
   - Fallback: the programmatic version.
7. **Polish:**
   - the intro's flash (4 in a second at its whip smear, intro frames 221–224): dim those frames in the episode assembly
   - the 160 ms digital zero at Act Three's black
   - the act-break level jumps
   - the Vegas practice laps' level
   - the V.O./rail overlap at S1.01
8. **Rebuild, check, final read:**
   - Rebuild both films and run QA, then a last cold read.
   - **Drive:** move the old `ep01-v3.mp4` and `ep01-v3-el.mp4` to the trash (rclone remote `mrmas-drive:`, folder "MR MAS Ep1 v3"), upload the new films, and share them with jgon@mit.edu (Drive API permissions through rclone's token; retry on the shared client's rate limit).

**Added 2026-09-27 (showrunner):** "the transition righy now hiting worse is beginning of act 4. it should eel like a sudden shock to viewer he's fired, but the viewere just becomes aware through the plan, the video call is a bit hard to understand what cancel means". **Required fix in script v3.1 (the lead's design):**
- **His side, first: shock.** S1.01 Vegas (arrival) → S1.02 the laptop's JOIN → V.O. "gerg's not on it. alyi set it up. probably just the budget." → JOIN.
  - The call. ALYI's first sentence reaches us for the first time on his side: "Mas. The board has decided that you will no longer lead the company." (his real words, already in S3.00a).
  - A hard cut to a **literal** host dialog in the 1993 dialog's look: `Remove MAS MANALT from the meeting?` [Remove]. ALYI's pointer clicks Remove. `You've been removed from the meeting.`
  - The tile drops, the one silence, the buzz, then "super.".
  - The viewer learns it the same instant he does. No THE PLAN before it.
- **The board's side, second: the explanation.** THE PLAN blueprint (S1.03–S1.05: the three who stepped down, the majority, the investor's zero votes, "And the CEO? What does he own?" "Good question.", step 1 NOON · VIDEO CALL) **moves to open the board's side** as Neleh's prep minutes before noon, then her side of the call (S3.00a…).
  - The waltz moves with it.
  - Alyi's line is heard twice, once per side: the told-twice device working as intended.
- **The Cancel metaphor is retired from Ep1's call.** The dialog's look is the only rhyme with 1993.

**Added 2026-09-27 (showrunner):** "these are types of things to be looking out for. while you're fixing the new final variant i want you to do analysis on various moods viewer will feel throughout from the different visual, story, an sound aspects amd make sure it is desireable".
- **The mood analysis** (`mood-analysis.md` and `out/ep01/full-v3/mood-curve.png`) runs alongside the fixes. Its ranked fixes feed the script revision, the score and the shot passes.
- **It runs again on the final v3.1 film** as part of the final checks, together with the newcomer read.

**Done 2026-09-27 (lead): the intro's flash.** Frames 222 and 224 now hold 221 and 223 (the whip smear on 2s). Flashcheck on the patched intro: at most 1 flash in any second, pass (it was 4 at frame 221).
- The patched picture is `out/intro/intro-ep1-V1-1080p-flashfix.mp4` (git-ignored). Rebuild it with `python3 show/episodes/ep01/production/full-v3/assembly/tools/intro_flashfix.py out/intro/intro-ep1-V1-1080p-flashfix.mp4`.
- **The v3.1 assembly uses it in place of the original intro picture.** The intro's audio is unchanged.

**Added 2026-09-28 (showrunner):**
- "it is not really showing him take any action… if he is the main character he should be showing agency". This becomes **v3.2**, an agency pass: `v32-agency`, draft 8, beat-plan-v32. See SHOWRUNNER-NOTES note 0.
- "please do another final audit to make sure nothing feels too forced, too out of the blue (that is not intentional), and that sound transitions are happening properly". **The final audit** (brief: scratchpad final-audit-brief.md, output `audit-<tag>.md`) covers:
  - forced moments
  - unintended out-of-the-blue beats, and Mas's agency
  - sound transitions measured at every cut, every chapter seam and the designed silence
- **It runs on the v3.1 film** (its findings feed v3.2) **and again on the v3.2 film as the last gate** before the Drive swap.

**2026-09-28 (showrunner):** "don't worry about the drive anymore". No more Drive uploads or shares. The v3.2 films stay local at out/ep01/full-v3/. (The v3.1 swap had already finished: the v3.1 films were uploaded and shared, and the v3 films moved to the Drive trash.)

**v3.2 sound items** (from audit-v31 §C), for the rebuild:
- **Tag → outro:** a +20 dB jump in 100 ms at 21:41.58. Hold the tag's hum 2 s, crossfade, and bring the outro's first hit down 6 dB (assembly and outro audio).
- **Act One's head:** the 1.0–1.2 s act-head fade softens the **designed downbeat** at film 0:58.7. Exempt designed hits from the fade (sound pass).
- **Act One at film 5:08.6:** a −16 dB music dip, a gap left where a cue moved (composer X).
- **Three music accents with no cue mark,** at film 1:56.3, 11:48.1 and 21:20.1: the composers confirm or remove them.
- **4 pre-laps:** lines leading in at place changes (the script marks them as J-cuts; the lock builds them).
- The cold open → intro seam gets an ear.

## 6. v3.3: the polish round (from 2026-09-28 06:30)

**Inputs:** [audit-v32](audit-v32.md) §0 · [mood-analysis-v32](mood-analysis-v32.md) §4 · [read-v32-newcomer](read-v32-newcomer.md) §2c, §4 and its top 8.
**The rule:** a polish, not a rewrite. Calibration applies line by line: fix the spot and don't move the whole. The v3.2 spine (agency-v32) stays exactly as it is. **Timecodes are on the v3.2 film clock;** lock times run about 1–3 s later.
**Where it lands:** script draft 8.2 (`script-v33-notes.md`), `beat-plan-v33/`, the lock `show/reel/ep01-v33/` (+ `-el`), then the films `out/ep01/full-v3/ep01-v33.mp4` and `ep01-v33-el.mp4`.

**X: sound defects.** These are measured, and every one must be fixed.

| # | Where | Fix | Owner |
|---|---|---|---|
| X1 | 15:19.52 | The `cloth_rustle` (lanyard) SFX is cut off mid-sample. Let it finish, or fade it over 20 ms. | stems |
| X2 | 17:13.27 | A designed score stop with no fade, which ticks. Give it a 3–8 ms fade, like the other dead stops. | composer Y |
| X3 | 12:45.29 | The night cue re-enters +24 dB within 400 ms. Start the felt fifth 0.3–0.5 s early, under the post's last palette step, and/or lay it −3 dB. | composer Y (mix confirms) |
| X4 | 12:54.50 | The room steps at the whip. Add a 10 ms crossfade. | stems |
| X5 | 10:11.88 | A +12 dB score step with no cue mark. Confirm it as designed (mark it) or smooth it. | composer Y |
| X6 | 18:00–18:14 | The avalanche: +1.5–2 LU short-term, as a mix gain row. The score stays as it is. | mix |
| X7 | every changed cut | Room tone in every black, rooms leading cuts by 0.6 s, no new click (second-difference scan of the stems). | stems + assembly |

**V: the inner voice's placement.** The count goes from 11 to 13, inside calibration's 10–14. Both takes exist.
- **V1. Restore "it does."** after "That collar suits you." (4:31.9), but only if P4 makes the collar arrive at that moment.
- **V2. Restore "he's not wrong."** before "how's the dancing?" (the White House, Act Two). It's an invented beat and a thought-then-speech gap, which is calibration §5's preferred kind. It ends the Act Two drought.
- **V3. No voice at Neleh's paper** (11:02). This is mas-inner-voice §5: another person's real act that bears on him gets the held face and the room, not a thought. P10 carries the beat.
- **No new lines are written.** The writer may swap one candidate for a better one of the same kind, but not add a third.

**S: story and lines.** These are small, and each one is a single spot.
- **S1. The Tidder trigger** (10:29). Cut the VP clip and the pinky promise (10:16–10:23): they are TV with no stake. Keep the forum's raised hands (Mas raising his own at home). Then, on his monitor, the Tidder thread that carries the rumour, then his reply typed into it. The record: he commented on a rumour and called it a meme.
- **S2. Why Rima is replaced** (15:45–15:58). Give Neleh one plain, reported reason before "We'd like a different one." (the writer checks the facts file; no invented motive). Cut Ttemme's "Okay.": he reads the page, turns it over, and the back is blank. The running gag holds.
- **S3. "Down here." is cut** (18:53).
- **S4. "Everyone's packed. Whatever happens to this place, Mas, don't worry about us."** moves from Tasya to the EMPLOYEE who asked "Is this a coup?", in the bullpen among the boxes, where we can see them. This needs a new take from the existing employee voice.
- **S5. Tasya's "…below them, above them, around them."** becomes an interview clip on the bullpen TV (a podcast mic in frame, on the small-speaker chain) while the staff pack. It's no longer recited face to face (audit #10).

**P: picture.** Each item is a spot. Prefer a change inside the shot to a new cut: mood §3.6 shows Act Three and the tag drifting too busy.
- **P1. Rima's "Did anyone tell the rest of the board?"** (2:03). Mas's face, not answering, under Gerg's "It's a research preview." Reuse his existing MCU. About +1 s.
- **P2. The million post** (2:58.5). Let the odometer land, then show only his thumb and the post's first line. Cut the 1 s hold on the digits.
- **P3. "Is that a tear?"** (3:14). Draw one tear glint at his eye in that shot.
- **P4. The collar.** The Macrosoft collar must *arrive* at "That collar suits you." Check that no Act One shot before 4:31 has it on him (the cold open is Nov 2023, so it stays there). Show it clasping on, or Tasya's hand settling it.
- **P5. The Atem monitor beat** (9:44.7). Fold it into the background of the Coinworld arrival (18.00/18.01): the monitor plays softly behind. Keep the key ring legible and Tasya's "Everyone is welcome.", with a two-part plate at most. About −3 to −5 s.
- **P6. The altered-audio clip** (7:39). The faked face should be the senator himself (the white-haired senator of the hearing), since it's his voice that was faked.
- **P7. The chip order** (9:27, `AI CHIPS · QTY: MORE`). Make the hand unambiguous. The writer decides whose, against the record.
- **P8. The act-out glass** (9:33–9:41). Cut 17.12. Act Two ends on the chip-maker's line climbing off the top of the frame (the intro's curve, an image the film already owns), with sound leading into Act Three's black. About −4.5 s.
- **P9. S1's picture.** The Tidder thread on his monitor, then his reply.
- **P10. Neleh's paper** (11:02). Hold about 2 s on his face reading page 30: the held face, the room, no voice. Keep the paper's tab in his tab strip after that. The Friday reminder (23.02) pops up over his own NOTIFY ME page with that tab visible (audit #9).
- **P11. The sign-ups post** (11:50). Keep NOTIFY ME, and collapse the post once it's up.
- **P12. The static boardroom wide** (14:35, 18.9 s). Push in slowly during Neleh's second speech, reaching her MCU by "what happens on Monday". On Alyi's "That is the company telling us.", the row of phones lights up in frame. No held frame should run more than 8 s unchanged.
- **P13. The walk-in's date appears twice** (15:18). Drop the rail and keep the plate.
- **P14. Three-part plates** trimmed to two parts: `RADNUS · RUNS ELGOOG` and `NOLE · BUILDING HIS OWN`.
- **P15. S2's picture:** Ttemme's page turn and its blank back.
- **P16. The count** (16:30, "four hundred and six. four hundred and seven. four hundred and six."). The heart/repost counter on his screen should visibly tick 406 → 407 → 406 in sync with the voice.
- **P17. S4/S5's picture:** the employee speaking among the boxes (visibly the one talking), and Tasya's podcast clip on the bullpen TV.
- **P18. Face light** (mood #2). A key or rim light one or two ramp steps up, *on the face only*, on the non-joke close-ups: "alyi voted.", Gerg's look, Neleh's real face, Mada, "good question.", Alyi in the glass, the toast. The room isn't touched.
- **P19. The tag's density** (mood #5). Hold the cover beat about 1 s longer (32.03).

**M: score.**
- **M1. Launch night's one warm accent** (2:23–2:47, mood #1). Either the Build pass in its A♭ major, or one Rhodes chord on "it likes me.". It's an accent, not the trio and not a new bed. Owner: composer X.
- **M2.** X2, X3 and X5 above. Refit both locks to v3.3's lengths, and keep the show's own sound. Nothing else is re-scored.

**Left alone, on purpose:**
- Alyi's glass ghosts (his motif: doorways and reflections).
- The IOU sign and the Q\* safe (plants for later episodes).
- The two faint tally marks.
- The intro's names.
- "gerg. he'll say he's compiling." (two readers disagree, so the line stays: calibration).
- The cold open's first line.
- The duck (the tag reads as Elgoog catching up, which is right).
- "Merger".

**Order:**
1. The script, beat plans and takes, then the v3.3 lock (Kokoro and EL).
2. In parallel, capped at three agents: the pixel segments; the composers' fixes (X2, X3, X5, M1), which don't wait for the lock, then the refit; the stems fixes (X1, X4), which don't wait for the lock.
3. Renders go one at a time through ops/heavy.sh. Then stems, the mix, assembly and QA.
4. A measured sound check at every changed cut and the four defects, plus the flash check.
5. Commit and push after each step. No Drive.

**Done 2026-09-28 (v3.3):**
- **The films:** `out/ep01/full-v3/ep01-v33.mp4` (Kokoro, 21:12.17) and `ep01-v33-el.mp4` (ElevenLabs, 21:12.46).
- **QA:** −16.08 / −16.10 LUFS, 0 decode errors, 0-sample A/V lag, flashes ≤3 per second, every seam clean.
- **The final check:** [audit-v33](audit-v33.md). 34 of 36 items landed. Three of the v3.2 sound defects are gone, and nothing swung.
- **Its optional items,** done in a micro-pass with frame counts unchanged:
  - The night re-entry swells in over 200 ms, now +10.9 dB over the room in its first 100 ms (it was about +24).
  - The sign-ups post collapses before the reminder.
  - Act Two's act-out gets Mas's close-up beat.
  - Kram's plate is dropped.
- **Left alone:** tag → outro at +12.7 dB, which reads as an ending; the Coinworld "CO-FOUNDER", which is lore for later episodes.

## 7. v3.4: Mas the planner (from 2026-09-28, on the v3.3 films)

**Showrunner:** see SHOWRUNNER-NOTES note 000. "have mas look like he is mostly planning and directing things as he intends, with the exception he was not expecting the board [firing]. this should be thinking about higher level goals, not just immediately what people do right away"

**A. The inner voice becomes his plan** (writer, draft 8.3):
- Every V.O. line states the higher-level goal behind the move on screen, or the plan it serves. Predictions and next-five-seconds reads go.
- He directs events up to the Friday call. The firing blindsides him (silence), then the voice plans the comeback.
- **Candidates** (the writer refines them, keeping the voice rules: lowercase, plain, no aphorisms, puns or winks):
  - **The launch:** "she's right. it will break. better it breaks in public, and first." (replaces the "i don't know which part yet" ending). "she'll go for three." is cut.
  - **The bill → the call:** "mostly the bill. we'll need more servers than we can buy. for now, we rent."
  - **The collar:** "it does. until we can build our own."
  - **CLOD's same-day launch:** restore v3.1's "mario used to sit where gerg sits. he left to build a careful one." (the showrunner asked for it), optionally with a plan edge.
  - **Regulation** (Act One's out or the White House; an invented beat, never the hearing): "they're going to write rules anyway. i'd like to be in the room when they do." This replaces "he's not wrong.".
  - **The Orb:** "my other company. when nobody can tell people from machines, this can." (replaces "i made it for everyone else."; explains CO-FOUNDER).
  - **DevDay:** "a hundred million a week. next, they build on us."
  - **The Friday call:** "gerg's not on it. probably the budget. good. i'll ask for more compute." (the irony: he's planning right into it).
  - **The walk-in:** "if i'm in the building, they decide with me in it."
  - **Before the Gerg call:** "gerg walked out for me. whatever happens next, he comes with me." (replaces "gerg. he'll say he's compiling."; pays off in "gerg comes back too.").
  - **Leave it open:** "macrosoft stays open. the board should know i have somewhere to go."
  - **The accept:** "this time, i'd like to know who's on the board."
  - **Keep:** "i know. i still read it twice." · "thrilled is too much. enthusiastic is a lot." · the count · "it looks calmer than me." (optionally "i don't keep score.").
  - **Target:** about 14–17 lines, across every act, silent from the call's first tile to "super.".
- **Up to 3 of Mas's spoken lines** may become directions (for example "ship it."), and only where the scene already has him deciding.
- **Still firm:**
  - no V.O. at the Senate testimony
  - none on the firing's reasons (Neleh's paper stays a held face)
  - no line that implies he rallies, counts on or organizes the staff letter
- **Bible:** update mas-inner-voice §3/§4/§7 and calibration §5/§9 to the planner voice.

**B. The deepfakes: keep one.**
- Keep the Senate's cloned voice (his own hearing's opener, "That voice was not mine.").
- Cut the May 12 altered anchor clip, and the Biden executive-order beat with its deepfake joke. The writer may keep the order's one line only if it serves the regulation plan.

**C′. Superseded (showrunner, same day): the duck is cut.** The tag goes from the room to the cover, the lawsuit, then "noted.". Section C below is kept only as the record.

**A′. The mastermind layer (showrunner, same day):**
- On top of the planner voice, his V.O. hints at the long game: he'd been arranging things behind the scenes to get here, with more foresight than anyone in the room.
- The payoff comes on his return, where he'd made himself the piece everything depends on. Candidate: "they could fire me. they couldn't run it without me. that part i planned."
- **The firing is still the one thing he didn't foresee.**
- He's a mastermind by foresight, never by a claimed secret act at a contested moment.
- **Later episodes:** Mario, Tasya, Nole and the other key leaders scheme too (a season note goes in the bible).

**C. The duck, made to land** (tag):
- The film's first card names it: ELGOOG · INIMEG (their answer).
- A large LIVE chip.
- On the stutter, freeze, and the film's own fine print slides in: "for the purposes of this demo, latency has been reduced and INIMEG outputs have been shortened for brevity." (the real video's description, with the parody name).
- Mas's held look at the frozen duck, about 2 s, with no V.O.
- The Runway frames stay; overlays are allowed.

**D. The intro's Mas for the EL film:** re-read "near the singularity; unclear which side." with Jeremy, fitted to the intro's clip frames (f24–57 and f72–91), and remix the intro master for the EL film. The Kokoro film keeps am_michael, which is the episode's Kokoro Mas.

**Order:**
1. The writer (A, B and C's lines).
2. In parallel: the EL intro (D) and the tag's duck prototype.
3. Takes (Kokoro and EL), then the v3.4 locks, then the picture passes, the score refit, the mix, assembly, and a focused check.

## 8. v3.5: the final version (from 2026-09-28, agreed)

**Showrunner:** "i think we're now seeming fully on the same page. i now trust your judgement to put everything we've discussed into the final rendering. go for it"

**The spec:** [proposal-v35.md](proposal-v35.md) (967170b), with the lead's choices:
- 1A, 2A, 3A, 4A;
- **5A** (TPOOL at 6 s, not the echo);
- 6A, 7A, 8A;
- **9A** (the second style leap: the tear on the heatsink);
- 10A;
- **11A** (one film: the ElevenLabs cast, MARIO on Kokoro, SIRRAH recast);
- **12A amended plus the quicker board exit**;
- CLOD's pane as a 3D claymation insert, if the Blender test reads.

**Order:**
1. Draft 8.4 and beat plans, plus the Kokoro takes, the season and bible docs, and verification of every "confirm before lock" item.
2. The base lock (Kokoro timing).
3. ElevenLabs takes: every new line except MARIO, SIRRAH auditioned and picked. Then the ElevenLabs lock with MARIO's Kokoro takes cast in.
4. Picture passes on the ElevenLabs lock only: new art for 2018, 2019, the first weeks, 3 AM, the window, the vision post, GNIB, the waitlist, the stamp, the tour, the statement and chips, the INVIDIA plants, the war room, the flight, TPOOL, Neleh's desk, Alyi alone, the president's deepfake restored, and the Senate without the clone. Plus the two inserts: the tear macro and CLOD.
5. The score on the ElevenLabs lock: a refit plus the new cues (the war room's pulse, 2018, 2019, the first weeks, the window).
6. Stems and the mix, ElevenLabs only.
7. Assembly: one film, `ep01-v35.mp4`.
8. QA, then the final checks: a newcomer read, the critic's transition table on the new seams, and the sound audit.

**Rules:** everything goes through ops/heavy.sh, at most 3 agents at once, and a commit after each step.
