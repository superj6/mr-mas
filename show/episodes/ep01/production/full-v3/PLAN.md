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
