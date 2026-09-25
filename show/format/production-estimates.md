# MR. MAS: production-time estimates (pixel pipeline)

- **As of:** 2026-09-25, 13:15 UTC. All picture agents had finished; `audio:mix` was still running, so its number is marked ≥.
- **Method.** I measured the agent transcripts of the runs that made the pixel intro: the first and last timestamp per agent, tool calls, renders, stills and PNG reads, with each tool call's time split by activity. I timed renders on this machine and probed every MP4. Then I extrapolated to episodes by content type.
- **Machine:** Intel Core Ultra 7 255U (14 threads, a 15 W laptop part), 30 GB RAM, no GPU. Renders are CPU-only.
- **Units:**
  - **agent-min / agent-h:** one agent working for one minute or hour. These add up across parallel agents.
  - **wall:** clock time.
  - **finished second:** a second that ends up in the cut, not frames that were built and then superseded.

Related: [INTRO_PIXEL_BRIEF](../../studio/INTRO_PIXEL_BRIEF.md) · [PIXEL_GUIDE](../../studio/PIXEL_GUIDE.md) · [pixeladv REPORT](../../out/structures/pixeladv/REPORT.md) · [bible/overview](../bible/overview.md) · [flashback map](../timeline/flashback-map.md)

---

## 1. Headline numbers

| | Number |
|---|---|
| Intro picture, marginal cost | **6.45 agent-h for 30.0 s**: 12.9 agent-min per finished second, or 12.9 agent-h per finished minute |
| Intro, all-in (picture + animatic + audio + script) | **13.8 agent-h for 30 s**, about 28 agent-h per minute. The intro is the densest content the show will have. |
| Intro wall-clock, from the pixel-engine start to all 30 s built and scored | **≈2 h 20 min** at about 8 agents running at once (measured average 7.9, peak 12) |
| One-time pixel platform already paid (structure test, engine, 2 cast rigs) | **3.7 agent-h** (plus 1.2 agent-h of voice casting) |
| Where agent time goes | 55% authoring code-as-art · 16% shell/inspection · 13% render/preview · 6% looking at renders · 6% typecheck |
| Final render, CPU, 1080p | **1.2–2.9 CPU-min per finished minute**. It is not the bottleneck. |
| Cost driver | **New visual events, not seconds.** Each distinct new drawing, gag beat, effect or cut costs about **3–4 agent-min**; held dialogue has a floor of about 0.4 agent-min per second. |
| Cheapest content | Portrait dialogue in existing rooms: **~1.3 agent-h per finished minute** (0.8–2.0) |
| Most expensive content | Beat-synced montage with new portraits, **~24 agent-h/min**; set-pieces, **~10.5 agent-h/min** |
| Season, 12 × 22 min | **≈1,470 agent-h** (926–2,223) · **≈184 wall-h at 8 agents** (98–370) |
| Season, 12 × 11 min | **≈890 agent-h** (569–1,322) · **≈112 wall-h** (60–220) |
| Season, 12 × 6–8 min | **≈620 agent-h** (396–908) · **≈77 wall-h** (42–151) |

The likely calendar bottleneck is **showrunner review**, not machine time: about 100–120 h of review for the 22-minute season (§6.3).

---

## 2. What we measured

### 2.1 Intro picture, per moment (pixel pipeline, wf_49bc14bc-677 and wf_5f61f97b-322)

| Moment | Frames used (built) | Finished s | Agent-min | Agent-min per finished s | Tools · renders · stills · PNG reads | Content type |
|---|---|---|---|---|---|---|
| `mcoldopen` | 0–119 (120) | 5.0 | 58.4 | **11.7** | 155 · 3 · 10 · 56 | (a) new room + (c) post UI + (d) masked GLYPH scan |
| `meras` | 120–224 (built 120–239) | 4.375 | 64.3 | **14.7** (12.9 per built s) | 162 · 4 · 6 · 66 | (d) style switches: 1-BIT 1993, render front, EARLY-WEB16 2008/2014; 3–4 new era sets and a new kid sprite |
| `mdinner1` | 225–344 (built to 359) | 5.0 | 51.3 | **10.3** | 146 · 3 · 6 · 52 | (a) new room (THE WOODROSE) + 2-tone name cards + cathedral bay |
| `mdinner2` | 345–479 (135) | 5.625 | 72.6 | **12.9** | 165 · 3 · 4 · 50 | (a) set-piece in a **reused** room (vault, booster through the ceiling, ledger flash, neon N) |
| `mrollcall` build + review | 480–539 (60) | 2.5 | 38.3 + 21.0 | **23.7** | 213 · 5 · 9 · 80 | (c) montage: 8 new portrait flashes on eighth notes |
| `mfinale` | 540–719 (built 480–719, 240) | 7.5 | 81.1 | **10.8** (8.1 per built s) | 183 · 6 · 10 · 66 | (a) + (c): isometric skyline (reuses the bosses), title, bookend; also built the superseded FIRED/BACK slot |
| **Total** | 720 | **30.0** | **387** | **12.9** | | |

- **Wall-clock:** the moments ran 11:52 → 13:13 UTC with 5 moment agents plus the 2 roll-call agents, so **81 min wall for the 30 s**. One agent turns a 5–7.5 s dense chunk around in **51–81 min**.
- **Context ceiling:** moment agents peaked at **540–670k tokens of context** on 5–10 s of dense content, with no compactions. That sets the chunk size: an agent can take **≤10 s of set-piece** or, by extrapolation, **~30–60 s of dialogue**.
- **Output tokens:** about 0.6M across the 7 intro picture agents.
- **Rework:** about 9% of the intro's agent time was superseded work:
  - the v2.1 brief change (the FIRED/BACK slot, re-scripting, a temp track with the old bar 9)
  - handoff fallbacks (`meras` 225–239, `mdinner1` 345–359)
  - 3 audio agents that failed twice at start (15.6 agent-min)

### 2.2 One-time costs already paid

| Item | Agent-min | Wall | What it bought |
|---|---|---|---|
| `struct:pixeladv` (wf_3a35d16a-8b9) | 63.8 | 64 min | Core primitives (px, palette, light, font, figure), the look, Mas and Nole v1 with portraits, and a 5 s dialogue test beat |
| `pixel:engine` | 45.0 | 45 min | `src/shared/pixel`: `<PixelScene>`, 6 palette sets, masked remaps, GLYPH, dissolve, render front, dithered crossfade |
| `pixel:cast-mas-gerg-alyi` | 55.6 | 56 min | Mas at 4 ages (today, 1993, 2008, 2014), Gerg, Alyi; portraits, mouths, lids, room sprites |
| `pixel:cast-rivals` | 57.4 | 57 min | Mario, Nole (rebuilt), 7 skyline bosses (26 px, 2–4-drawing loops) |
| **Pixel platform subtotal** | **221.8 (3.7 h)** | about 2 h | |
| `audio:voice-casting` (wf_9b780b56-def) | 73.4 | 73 min | 10 characters × 3 candidates × 3 lines = 90 clips, briefs, reels, manifest |
| Style bake-off (other structures, sunk) | ≈824 (13.7 h) | | puppet, satire, screen, shape, anime, comic, collage, realism, the v1 builds |
| Writers' room (sunk) | ≈751 (12.5 h) | | research, pitches, sweeps, bible, 80 character files, 84 episode files |

**Unit costs inferred from the cast runs:**

| Unit | Agent-min each | Basis |
|---|---|---|
| Speaking character (room sprite, portrait, mouths, lids, a few poses) | **12–20** | Gerg and Alyi; about 10 per "character-unit" in `castmas` |
| Cameo sprite (26 px, one 2–4-drawing loop) | **3–6** | the bosses; about 1.8 agent-min direct authoring each, plus the sheet and review |
| Portrait flash (one action frame) | **5–7** | the roll call |
| Room, simple (pixeladv, dark on purpose) | **~10** | pixeladv, including review |
| Room, rich (WOODROSE with props and cathedral) | **~20** | `mdinner1` |
| Era mini-set | **~4–8** | `meras` |

The pixeladv report quotes "a room is 1–2 days, a character 2–3 days"; that is human-artist time. Agents measured **10–20 agent-min** for the same kinds of asset.

### 2.3 Audio, script and animatic for the intro

| Run | Agent-min | Output | Rate |
|---|---|---|---|
| `audio:theme` | 101.5 | 4 × 30.000 s variations, 40 stems, cues.json, MIDI, motif study | ≈25 agent-min per fully scored 30 s variation, so **~50 agent-min per score-minute at title density**. CPU about 2.4 min to build one 30 s variation. |
| `audio:sfx` | 46.3 | 131 sounds (78 default, 29 chip, 24 band), 87 voice blips, 30 s SFX layout | **~0.35 agent-min per sound** |
| `audio:vocals` | 76.2 | 5 cold-open VO takes, Nole and "super." takes, 6 chants, 21 sung pieces | |
| `audio:mix` | ≥31.5 | intro mix | still running |
| Failed starts (3 agents × 2) | 15.6 | nothing | about 6% of audio time wasted |
| **Audio subtotal** | **≈271 (4.5 h)** | wall 10:54 → 13:14+ (≥2.3 h) | |
| TTS render (Kokoro-82M, CPU, 8 threads) | | 9 clips in 168 s | **~19 CPU-s per line** including processing and ASR QA |
| Intro script (draft, timing, tone, audio critics, final, v2.1 edit, verify) | 136.7 (2.3 h) | 30 s, frame-accurate | wall 109 min |
| Animatic (video, temp track, check) | 35.6 | 30 s stick-figure animatic with temp track | **1.2 agent-min/s**; wall 32 min |

### 2.4 Where agent time goes

This is the split of the 10.7 agent-h of pixel work (structure test, engine, cast, moments, roll call, animatic), by the time between tool results:

| Activity | Share |
|---|---|
| Authoring code-as-art (Write/Edit/heredoc edits of sprites, sets, scenes) | **55%** |
| Shell / inspection / encode | 16% |
| Render + Node preview | 13% |
| Looking at rendered PNGs | 6% (35–66 PNG reads per agent) |
| Typecheck | 6% |
| Notes, report | ~2% |

Inside authoring, **new art (sets, props, sprites, portraits) takes about 65–72%** and choreography (scene and timeline files) about 15–30%:

- pixeladv: portraits 9.1 min, sprites and figure 7.1, room 4.9, choreography 4.4.
- `mdinner1`: set, props, cathedral and Mas dinner drawings 14.9 min; scene and timeline 8.

So reusing art is the main lever. Faster rendering is not.

### 2.5 Render benchmarks (timed here, under load ≈10 from other agents)

| Test | Result |
|---|---|
| `remotion still pixeladv-key`, bundle included | 20.1 s (the bundle alone is 19.6 s) |
| `mcoldopen` 120 f, 1080p, concurrency 1 / 4 / 6 | 28.4 s / 15.1 s / 12.1 s |
| `mcoldopen` 120 f, 540p, concurrency 1 | 24.4 s |
| 24 f vs 120 f, same settings | fixed launch cost about 7–13 s; **marginal 0.05–0.12 s per 1080p frame** |
| Agent-logged renders | `mdinner1` 135 f 540p: 36 s · `mdinner2` 135 f with bundling: 48.6 s · animatic 720 f 720p at concurrency 4: 37.9 s |
| **Per finished minute (1,440 f), 1080p** | **≈1.2–2.9 CPU-min** + ~20 s bundle per entry |
| File size | ~170–290 kB/s, so about 300–400 MB per 22-minute episode at 1080p |
| Season master renders | 12×22: **5–13 CPU-h** · 12×11: 2.6–6.4 h · 12×7: 1.7–4.1 h |

---

## 3. Rates by content type

These are picture-only rates at the quality bar held so far: at least 3 fix rounds, every render looked at, whole-pixel motion.

| Type | Measured basis | Agent-min per finished s (low / **mid** / high) | Agent-h per finished minute (mid) | Wall per finished minute at 8 agents (mid) |
|---|---|---|---|---|
| **(a) New-room establishing / set-piece** | 8.1–12.9 measured (`mcoldopen`, `mdinner1`, `mdinner2`, `mfinale`) | 8 / **10.5** / 13 | 10.5 | ~79 min |
| **(b) Portrait-dialogue scene, reuse** | Inferred, not measured. The pixeladv 5 s beat from scratch was 12.8/s; its scene-only share (15–30%) gives 1.9–3.8/s at about 4 events/s; scaled to dialogue density of 0.3–0.5 events/s | 0.8 / **1.3** / 2.0 | 1.3 | ~10 min |
| **(c) Montage / UI / text-heavy** | Roll call 23.7/s (new portraits); stick-figure animatic 1.2/s. Chyrons, typewriter cards and THE PLAN on existing kits sit in between. | 2.5 / **4.5** / 8 (new-art montage: up to 24) | 4.5 | ~34 min |
| **(d) Style-switch sequence** | `meras` 14.7/s with new era sets. The engine makes a remap a lookup, so a flashback in an existing set costs about (b) + 10–20%. | 3 / **7** / 13 | 7 | ~53 min |

**The rule of thumb that reconciles the table:** picture agent-min ≈ **0.4 × seconds + 3.5 × visual events**, where a visual event is a new drawing, pose, gag beat, effect or cut.

- The intro runs at about 4 events/s.
- A talky scene runs at 0.3–0.5 events/s; a set-piece at 2–4.
- A 22-minute episode at an average of 1 event/s comes to about 84 agent-h of picture, which matches the mid case in §5.

**Largest uncertainty:** rate (b) is inferred. At 780 s per 22-minute episode, 0.8 vs 2.0 is a swing of 10–26 agent-h per episode. Measure it with the first real Ep1 dialogue scene (§8).

---

## 4. One-time vs marginal

### 4.1 One-time costs still to pay (season)

| Item | Agent-h | Notes |
|---|---|---|
| Speaking characters | 8–13 | about 40 at 12–20 agent-min |
| Cameo sprites | 5.5–11 | about 110 at 3–6 agent-min (the registry and cameo rosters list about 155 figures) |
| Recurring rooms | 6–10 | about 25 (dark room, HQ cathedral, WOODROSE, GOLD OVAL, hearing rooms, courtrooms, studios, skyline states) at 15–25 agent-min. One-off gag sets are budgeted inside (a). |
| THE PLAN blueprint kit | 1.5–3 | template, linework, stamps, tear-back transition |
| Score cue library | 5–15 | knee-motif variants, faction and character cues, stings |
| Voice casting for the remaining ~30 speaking characters | 2.5–5 | measured 7.3 agent-min per character |
| Engine extensions | 6–12 | episode assembler, VO-driven mouth timing, auto SFX spotting from `CUES`, walk and crowd kits, camera scroll |
| **Total** | **≈36–70 (mid 50)** for 22 min | about 30–60 for 11 min and 26–52 for 7 min (fewer cameos and sets) |

### 4.2 Marginal cost per episode

| Line | 22 min | 11 min | 7 min |
|---|---|---|---|
| Picture (by §3 and the §5 mix) | 52 / **80** / 120 | 32 / **49** / 72 | 22 / **33** / 49 |
| Full script: act drafts in parallel, 3 critic passes, fact check, revision | 5 / **7** / 9 | 3 / **4** / 5 | 2 / **2.75** / 3.5 |
| Animatic / leica reel at 0.2–0.4 agent-min/s (the intro's 1.2/s was a stick-figure animatic of maximum density) | 4.3 / **6.5** / 8.6 | 2.1 / **3.2** / 4.2 | 1.3 / **2** / 2.6 |
| Audio: TTS voice, underscore, SFX spotting and new sounds, mix (§4.3) | 7 / **11** / 16 | 3.6 / **6** / 8.2 | 2.2 / **3.5** / 5 |
| Intro slot changes (cold-open quote, skyline state, subtitle, couch gag, roll-call fill-in) | 1 / **1.5** / 2 | same | same |
| Integration, conform, QC, notes fixes (10 / 15 / 20% of picture) | 5 / **12** / 24 | 3 / **7** / 14 | 2 / **5** / 10 |
| **Per episode, all-in (agent-h)** | **74 / 118 / 179** | **45 / 71 / 105** | **31 / 48 / 71** |
| Per new minute | 3.5 / **5.5** / 8.3 | 4.3 / **6.7** / 10 | 4.7 / **7.4** / 11 |

### 4.3 How the audio line is built (22-minute episode; scale down for shorter formats)

| Item | Assumption | Agent-h |
|---|---|---|
| Voice (synthetic stock voices) | 10–16 lines/min, so about 215–345 lines, mid about 280. At 0.4–0.8 agent-min per line (direction, take pick, ASR QA, level). About 19 CPU-s per take, so about 1.5 CPU-h per take pass, about 25 min wall when split 4 ways. | 1.7–4.5 |
| Underscore | about 60% of runtime (about 13 min) at 10–25 agent-min per minute once the library exists | 2.2–5.4 |
| SFX | about 20–40 new sounds + spotting at 2–5 agent-min per runtime minute | 1–2 |
| Mix | 5–10 agent-min per minute | 2–4 |

The beat sheets list 6–81 tagged key lines per episode; a full script typically runs 3–4× the key lines.

---

## 5. Content mix per format

These are the seconds of **new** content per episode. The intro is 30 s and reused in every format.

| Type | 12 × 22 min (1,290 s new) | 12 × 11 min (630 s) | 12 × 6–8 min (390 s) |
|---|---|---|---|
| (a) Set-pieces / new rooms | 210 s (about 6 × 35 s; Ep1 lists 6) | 150 s (4) | 110 s (3) |
| (b) Portrait dialogue | 780 s | 300 s | 160 s |
| (c) Montage / UI / text (THE PLAN 45 → 30 → 20 s, chyrons, headline cascades) | 200 s | 120 s | 80 s |
| (d) Flashbacks / style switches (map: Ep1 10 s, Eps 2–11 about 60–118 s) | 100 s | 60 s | 40 s |
| Share of picture hours, mid case: a / b / c / d | 46 / 21 / 19 / 15% | 54 / 13 / 18 / 14% | 58 / 10 / 18 / 14% |
| Picture tasks per episode (≤10 s set-piece chunks, 30–60 s dialogue scenes) | about 65 | about 38 | about 26 |

Set-pieces are the show's spectacle and stay roughly constant per episode. Shorter formats therefore cost **more per minute**, because they cut the cheap connective dialogue first.

---

## 6. Season projections (current setup: up to ~10 agents, measured effective ~8, CPU-only)

### 6.1 Agent-hours and machine wall-clock

| Format | New content / season | Agent-h per episode | Season agent-h (incl. one-time) | Wall-clock hours (effective 9.5 / 8 / 6 agents) | Machine days at 12 h/day | Machine days running 24/7 |
|---|---|---|---|---|---|---|
| **12 × ~22 min** | 258 min | 74 / **118** / 179 | 926 / **1,470** / 2,223 | 98 / **184** / 370 | 8 / **15** / 31 | 4 / **8** / 15 |
| **12 × ~11 min** | 126 min | 45 / **71** / 105 | 569 / **892** / 1,322 | 60 / **112** / 220 | 5 / **9** / 18 | 2.5 / **4.6** / 9 |
| **12 × ~6–8 min** | 78 min | 31 / **48** / 71 | 396 / **616** / 908 | 42 / **77** / 151 | 3.5 / **6.4** / 12.6 | 1.7 / **3.2** / 6.3 |

The low case pairs the low rates with more parallelism, and the high case pairs the high rates with less (effective 6: dependencies, CPU contention, review stalls).

### 6.2 Calendar (staggered pipeline, one episode per stage at a time, reviews answered within a day)

| Format | Calendar |
|---|---|
| 22 min | **~4–7 weeks** |
| 11 min | **~2.5–4.5 weeks** |
| 6–8 min | **~2–3 weeks** |

Pre-production one-time work (§4.1) takes about 1 wall-day and can overlap with scripting.

**Scripts only**, the immediate ask:

| Scope | Agent-h | Wall at 8 agents |
|---|---|---|
| Full refined scripts for Eps 1–3 at 22 min | ~15–27 | **~2–3.5 h** |
| All 12 episodes at 22 min | ~60–110 | ~8–14 h |

### 6.3 Human review load (likely the real bottleneck)

- **Chunk reviews:** about 65 picture chunks per 22-minute episode at about 4 min each.
- **Gates:** four per episode: script read (~1 h), animatic, picture lock, mix.

| Format | Showrunner review time |
|---|---|
| 22 min | about 8–10 h per episode, **~100–120 h per season** |
| 11 min | ~60 h per season |
| 7 min | ~40 h per season |

### 6.4 Assumptions

- The quality bar stays where the intro set it.
- Eps 10–12 cost the same as the real-events episodes.
- Rework is about 10%; it is inside the integration line.
- Final masters are rendered at 1080p (review renders stay at 540p).
- The laptop sustains about 8–10 concurrent agents: the intro ran 7–12 at load ≈10 on 14 threads, 30 GB.
- The measured peak of 18 concurrent agents was writing-heavy, with few renders.

---

## 7. What external tools would change

| Tool | What it changes | Effect on the numbers |
|---|---|---|
| **Human voice actors** | Final reads replace TTS; scratch TTS stays for timing and animatics. Deadpan comedy depends on the read, so this is the biggest quality gain per dollar. | **Agent-h:** about neutral (−1 to −3 h per episode on TTS take-picking; +0.5–1 h per episode to edit takes and re-time mouths from the new word timings). **Calendar:** +1–3 weeks for casting up front. Recording is about one remote session per episode (about 280 lines at 22 min, about 3–5 studio hours across the cast) and must land **after script lock and before animatic**, so start casting while Eps 1–3 are being scripted. |
| **Video-gen inserts** | They clash with the whole-pixel, indexed-palette rule. Two legitimate uses: (1) in-world "deepfake" or broadcast parodies (NORCAM's deepfakes, the cloned anchor), under guardrail review with no real likeness; (2) reference plates quantized to the palette and hand-cleaned for backgrounds. | Backgrounds are about 15% of picture time; halving them saves **~5–8% of picture** (22 min: −4 to −7 agent-h per episode). It adds guardrail and review risk ("invented must look invented"). **A small lever.** |
| **A GPU** | Faster encodes, local TTS/ASR (19 s → about 1 s per line), better local voice and music models, optional image-gen. | Render and preview are only about 12% of agent time, and season masters are 5–13 CPU-h. **Saves about 3–6% of agent time.** Worth it for audio quality, not for picture throughput. |
| **A second CPU box or cloud render (e.g. Remotion Lambda)** | Raises the concurrency ceiling from about 8–10 to 15–20 agents without render contention. | **About halves wall-clock**; agent-h unchanged. This does more for the schedule than a GPU. |
| **A pixel artist** | Raises the ceiling on faces; the agents' own weakness lists are mostly faces (Mas's mid-turn head, RIMA's eyes, doll-like founders, a boxy Nole). | Best use: about 10 principal portraits plus expression sets (about 1–2 artist-days each, so 2–4 weeks **in parallel**; portraits are swappable stamps), plus paint-over passes on agent-made rooms. A little less agent fix-round time; calendar neutral. **Cannot carry the volume alone:** about 150 characters and 130 locations at 1–2 days per room and 2–3 days per character is more than an artist-year. |

---

## 8. What this means for the writing (in-the-moment vs macro)

- **In-the-moment beats are cheap.** Portrait dialogue in existing rooms is about 1.3 agent-h per minute, and the deadpan lives in the portrait close-ups. Write as much of the comedy as possible as reads, reactions and one-pixel smiles.
- **Macro progression is expensive only when it needs new art.** Montages with new drawings run about 24 agent-h/min, new-era flashbacks about 15, set-pieces about 10.5. It is cheap when it rides on state changes to assets we already have:
  - palette remaps: era or flashback inside an existing room
  - skyline tower states
  - date chyrons and typewriter cards
  - the tally marks
  - roll-call fill-ins
  - recurring props that change state: the cup, the collars, the badge, the label gun

  Carry the season's progression on these, and spend new art on **1–2 set-pieces per act**.
- **Budget gags in visual events.** Each new event costs about 3–4 agent-min. A 22-minute episode at about 1 event/s is about 80 agent-h of picture; ~1,300 events and ≤3.5 min of set-piece is a workable cap. Ep1 lists about 59 dated events and 6 set-pieces, which fits at 22 min. At 7 min it would push the per-minute cost toward intro density.
- **Shorter is cheaper in total but denser per minute:** 7.4 vs 5.5 agent-h per new minute.
- **Calibrate before committing to a format.** Produce three things from the Ep1 script and measure each:
  - the cold open (a/d)
  - one 45–60 s dialogue scene (b)
  - THE PLAN (c)

  That would replace the inferred (b) rate with a measured one in about 3–5 wall-hours.

## 9. How to re-measure

Per-agent wall-clock, tool counts and activity splits come from `subagents/workflows/wf_*/agent-*.jsonl`: the first and last `timestamp`, `tool_use` and `tool_result` pairs. The scripts used for this file are in this session's scratchpad (`agents.py`, `split.py`, `files.py`, `renders.py`, `proj.py`). Re-run them after the calibration scene and update §3.
