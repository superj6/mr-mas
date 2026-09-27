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
