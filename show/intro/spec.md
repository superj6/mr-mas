> **Status: v1 reference, superseded where it conflicts.** The master opening script is now [`SCRIPT.md`](SCRIPT.md) (v2.0, 2026-09-25). v2.0 changes the visual style to pixel art with motivated style switches (see `studio/INTRO_PIXEL_BRIEF.md`) and the music to a piano / orchestral / big-band blend with a jazz feel and 8-bit motifs (variations V1–V4). This file's timing, gags and text remain useful detail.

# Opening Titles: Spec

**"THE CURVE. Everything scales."** This is the 30-second main title for *MR. MAS*.

| | |
|---|---|
| **Version** | v1.1 (room foundation), 2026-09-25 |
| **Built from** | [`_sources/plan-v1.md`](../_sources/plan-v1.md) §3 · [`_sources/design/final.md`](../_sources/design/final.md) §3 · [`worldcast-cast-integration.md`](../_sources/research/worldcast-cast-integration.md) §5 · [`worldcast-flashback-map.md`](../_sources/research/worldcast-flashback-map.md) §0, §2F, §3 · [`worldcast-critic.md`](../_sources/research/worldcast-critic.md). Where they disagree, the critic's corrections win. |
| **Companion files** | [shot-table.md](shot-table.md) (frame by frame) · [cue-sheet.md](cue-sheet.md) (music and sound) · [episode-slots.md](episode-slots.md) (what changes each episode) |
| **Rules it obeys** | [../bible/naming.md](../bible/naming.md) · [../bible/guardrails.md](../bible/guardrails.md) · [../timeline/flashback-map.md](../timeline/flashback-map.md) |

> **VISUAL STYLE IS PENDING.** The showrunner hasn't chosen the show's visual structure yet. Structure tests are running in `studio/` and render to `out/lookdev/structures/`. The status and the options live in **[../bible/style-status.md](../bible/style-status.md)**.
>
> Everything below is written so that it survives that decision. §7 marks each part of this spec as **LOCKED** (style-agnostic), **ADAPTS** (the idea is locked but how it renders depends on the style) or **PENDING STYLE** (a placeholder from the v1 look). Hex codes, fonts, line weights and "cut-paper" wording come from the v1 look and are placeholders until the style is locked.

---

## 1. The concept

Mas's life is **one cyan exponential line**. It starts as a blinking cursor in a dark room and ends as the roofline of an AI skyline. The show uses tech as visual spectacle, and here the spectacle is the joke: **the title sequence scales itself.**

1. **The world renders at the fidelity of its era.** It goes from 1-bit (1993) to consumer video (2008–14), to the house style (2015), to glossy HDR (2022+). A glowing *render front* chases the tip of the curve and upgrades the world as it passes. The score climbs through the same tiers (see §4 and [cue-sheet.md](cue-sheet.md)).
2. **Time stops at the 2015 founding dinner.** Each founder freezes into a name card, and **only Mas keeps moving.** He pockets things.
3. **Bar 9 is the per-episode news slot**, like The Simpsons' couch gag. In Ep1 the curve kinks at a "low-key research preview" button. When he's fired, the curve drops to zero **and the music is fired too.** When he's rehired, both come back.
4. **The curve ends as the roofline of a rival skyline** and goes vertical at **MR. MAS**. The camera then pulls back into his monitor: the whole show is something he just posted. The last frame is the first frame, so the piece loops.

### Rules of the intro

| # | Rule | Why |
|---|---|---|
| 1 | **Mas never freezes.** Every other character drops to two-tone. Only he stays in full color and in motion. | The show's thesis: the world stops, and he keeps operating. |
| 2 | **Mas's cup never ripples**, in any era. At the rocket landing every glass on the table sloshes except his. | Serene Survivor trope ([Mas](../characters/mas-manalt.md)). The flashback map uses it in every era (juice box, stage water bottle, crystal glass). |
| 3 | **[RUMPT](../characters/dlanod-j-rumpt.md) never appears in bars 1–8 and never gets an intro name card.** He wasn't at THE WOODROSE. His only presence is **THE PODIUM** on the skyline hill from Ep3 onward, plus a few micro-beats (see [episode-slots.md §5](episode-slots.md#5-skyline-state-and-the-podium)). **The cyan curve never touches the podium.** | Per the worldcast integration §5. The intro is Mas's origin story. |
| 4 | **No other new worldcast cast members in the intro:** ECNAV, SKCAS, HTESGEH, NORCAM, POPE OEL XIV and the rest. They live in the episodes, THE PLAN blueprints and the class photo. | Keeps the opening's text density and its roster stable. |
| 5 | **The intro teases and never explains.** Every bars 1–8 beat is paid off by a flashback somewhere in the season (§6). | Flashbacks are spread across the season, not front-loaded (a binding user note). |
| 6 | **Text density.** Must-read text follows the read-time rule in [shot-table.md §6](shot-table.md#6-text-registry-and-read-time-lint). Per-episode additions are about 12 new characters or fewer. | 30 seconds at phone size. |
| 7 | **Photosensitivity.** At most 3 flashes in any 24-frame window. Every pop is 80% white or less. An automated luminance audit runs on every render. | Non-negotiable accessibility rule. |
| 8 | **Real quotes are verbatim** (§3.3). All other on-screen text is **[INVENTED]** comedy: card subtitles, stat rows, headlines, subtitles, Orb toasts. | The room's rule on quotes. |

---

## 2. Structure by bar

The grid is **96 BPM, 4/4, 24 fps**. That gives 15 frames per beat, 60 frames (2.5 s) per bar, and 12 bars = **720 frames = 30.0 s**. The single timing source in code is `studio/src/shared/timing.ts` (`at(bar, beat)`).

```
bar:   1     2     3     4     5     6     7     8     9     10    11    12
time:  0.0   2.5   5.0   7.5   10.0  12.5  15.0  17.5  20.0  22.5  25.0  27.5  30.0
       |--dark room--|1993 |'08-'15|------ the dinner: 4 freezes ------|SLOT |--skyline--|title/bookend|
tier:  T0    T0    T1    T2→T3 T3    T3    T3    T3    T4    T4    T4    T4→T0
cards:                   MAS         GERG  ALYI  MARIO NOLE  (per ep)            MR. MAS
```

| Bar | Time (s) | Frames | Section | Tier | What happens | Music |
|---|---|---|---|---|---|---|
| 1 | 0.0–2.5 | f0–59 | Dark room | T0 | A cyan cursor blinks on the beat. The camera dollies out to MAS at his monitor with [THE ORB](../characters/the-orb.md) at his shoulder. He types this episode's line into a post composer over a flat log chart (`you are here`). The VO starts at f24. | Sub drone, server hum, one felt-piano F per beat |
| 2 | 2.5–5.0 | f60–119 | Dark room → **Post** | T0 | The pause. The dot slides up the curve and off the monitor. His eyes snap to the lens. The Orb's scan shows, for 5 frames, that the "dark room" is an endless data-center cathedral. He clicks **Post**: the line bursts into token chips, the chart snaps vertical, and the frame goes to white. | Low D♭ in the pause; the four-note **knee** run into the click |
| 3 | 5.0–7.5 | f120–179 | **1993** | T1 | KID MAS (8) at a logo-free beige computer. The screen faces away from us. The world becomes a 1-bit alert dialog, **MAS MANALT / no equity.**, with Cancel greyed out. A stranger clicks Cancel (*bonk*), and the kid clicks OK. The line fires off the wall and the render front upgrades the world. | **DROP** on F minor, the first third. Chiptune beeper hook |
| 4 | 7.5–10.0 | f180–239 | **2008 → 2014 → 2015** | T2a → T2b → T3 | TPOOL keynote in two popped collars. The WHY COMBINATOR throne of laptops and ramen, with LUAP's paper crown. The crown's glint becomes a candle, and we're at THE WOODROSE. | Boom-bap, cassette piano, lo-fi brass; tape spins up to speed |
| 5 | 10.0–12.5 | f240–299 | Dinner · **GERG** | T3 | GERG freezes (`ORG CHART: HIM.`). Mas pockets the CTRL key. A server cathedral lights up behind the next seat. | **HIT** Fm |
| 6 | 12.5–15.0 | f300–359 | Dinner · **ALYI** | T3 | ALYI freezes on "A-G-I!" Mas roasts a marshmallow on the frozen effigy fire. A vault door opens and MARIO steps out. | **HIT** D♭; chant; klaxon |
| 7 | 15.0–17.5 | f360–419 | Dinner · **MARIO** | T3 | MARIO freezes (`HAS CONCERNS. HAS GPUS.`). His scroll unrolls down the table. A SPACEZ booster crashes through the ceiling, and a neon OPEN AI sign swings in. | **HIT** B♭m; rocket roar |
| 8 | 17.5–20.0 | f420–479 | Dinner · **NOLE** → the founding | T3 | NOLE freezes (`NAMED IT.` / stamp `SUED OVER IT.`). Mas slides the neon N: **OPEN → NOPE**. This is the key-art frame. | **Biggest HIT**, C major; neon |
| 9 | 20.0–22.5 | f480–539 | **THE SLOT** (per episode) | T4 | 9.1 news · 9.2 "the music is fired" · 9.3 "the music is rehired" · 9.4 transition object. Ep1: CHATGTP / FIRED. / BACK. / hearts become stars. | T4 arrives; hard mute; slam back |
| 10 | 22.5–25.0 | f540–599 | Skyline 1 | T4 | Isometric dusk skyline. One tower pops per beat, each with its boss on the roof: NOPEAI, MACROSOFT, ELGOOG/MINDDEEP, ATEM, INVIDIA. | Plucks F F F F |
| 11 | 25.0–27.5 | f600–659 | Skyline 2 → **title** | T4 | The exes pop (MISANTHROPIC, zAI), then PEEKDEEP. At f622 every roof ignites into one cyan line; from Ep3, THE PODIUM appears on the far-left hill at the same moment, untouched by the line. **MR. MAS** slams in at f630, and the period is THE ORB. | Plucks G A♭ C; **final hit** F–C with no third |
| 12 | 27.5–30.0 | f660–719 | Title hold → **bookend** | T4 → T0 | The subtitle holds. The camera pulls back into Mas's monitor, and the Orb's toast appears. His eyes flick to the lens, a notification dings, and the cursor blinks where f0 began. | Celesta; **ding** F6 at f705; drone out |

---

## 3. The cold open

### 3.1 Recommended line (all episodes; Ep1 is the anchor)

> *"near the singularity; unclear which side."* Mas's real post, Jan 2025 [V] (source: [`gaps.md`](../_sources/research/gaps.md) §1). It is recast as Mas's post.

- **It's the season tagline**, and it runs a three-step arc across the season:
  - *near* (Ep1)
  - → *"we are now in the singularity—"* (Ep9, Jul 2026 [V])
  - → Ep12: the chair is empty, the cursor types the Ep1 line by itself, adds `ours.` **[INVENTED]**, and posts it.
- **It falls outside Ep1's window** (Nov 2022–Dec 2023). This is deliberate: Ep4's A-plot has Mas post the line "for real," so the pilot's opening line pays off three episodes later.
- **The line changes every episode** after Ep1. Eps 2–11 rotate a real line from inside that episode's window, or a callback to one. The list, with sources and lengths, is in [episode-slots.md §3](episode-slots.md#3-cold-open-lines).

### 3.2 Delivery and timing
- **Soft and close-mic.** He's reading his own post aloud to an empty room, not performing for us. No word is stressed.
- **Ep1 timing:**
  - The VO starts under the black at **f24**.
  - "near the singularity;" runs **f24–57**.
  - The semicolon is a real pause, **f58–71**, with one low piano note (D♭) in it.
  - "unclear which side." runs **f72–91**.
- "side" is left hanging, neither falling nor rising. After it: silence, a stare, no blink.
- **Length rule:** 16 syllables or fewer and 54 characters or fewer, **spoken inside f24–100**.
- **Per-episode word timings** are a hand-keyed JSON file per episode. The dot slides on the last stressed word, and the piano color note goes in the longest pause (see [cue-sheet.md §7](cue-sheet.md#7-per-episode-audio-changes)).

### 3.3 Source-fidelity rule for the cold-open line (new in v1.1)
The v1 design set every line in lowercase. That silently alters real quotes whose sources have capitals: Ep4's "GPUs," Ep5's memo, Ep6's podcast line and Ep10's statement. v1.1 replaces the lowercase convention with this rule:

1. **Posts are typed verbatim** into the generic post composer, keeping his lowercase habit and the source's own punctuation.
2. **Lines that were not posts** (memo, podcast, testimony, email, remarks) appear in a generic UI for their medium:
   - a memo window
   - an auto-caption strip under a waveform
   - a court-transcript pane
   - an email draft

   The text keeps the source's casing. The dark-room staging doesn't change: he still reads it aloud to the empty room.
3. **Trims are always marked** with `…` or the source's own dash. Never swap punctuation, for example turning a dash into a full stop.
4. **Parody names may replace real names inside a quote**, as the bible already does with "Mario is right." No other word may change.
5. Every line carries a source tag in [episode-slots.md §3](episode-slots.md#3-cold-open-lines). Lines tagged [K] or † must be re-verified before picture lock or replaced.

This rule **sharpens the Ep7 gag rather than breaking it.** The flashback map's "caption case tells the age" rule becomes: *the first capital "I" he **posts** all season is in Ep7* ("…are funny, and I laughed."). Capitals in memo, podcast or court text don't count, because he didn't type them into the composer.

### 3.4 Alternates

| # | Line | Source · tag | Fits the rules? | Notes |
|---|---|---|---|---|
| A1 | *"the compute costs are eye-watering."* | Post, Dec 5, 2022 · [K] ([`mid.md`](../_sources/research/mid.md)) | Yes: 35 chars, 10 syllables | Inside Ep1's window. Pairs with a single tear sizzling on a GPU on the monitor. Drier and funnier, but less ominous. |
| A2 | *"agi has been achieved internally"* (casing per source), then the post **edits itself** on screen | Reddit comment, ~Sep 26, 2023 · [K] (`mid.md`) | Yes: 32 chars, 10 syllables | **New proposal.** Inside Ep1's window, and the edit is a built-in visual gag: the text rewrites itself into "…just memeing…" (egg size; take the full edit text from the source). Already an Ep1 B-plot beat. |
| A3 | *"I think that AI will probably, most likely, sort of lead to the end of the world. But in the meantime, there will be great companies created with serious machine learning."* | Conference remark, Jun 2015 · **[UNVERIFIED]** in `mid.md`; wording per [`early.md`](../_sources/research/early.md) | **No** (about 6 s) | The funniest real line, but **pilot-only, in a 35.0 s cut**: 4 extra bars of dark room (+120 frames), everything downstream shifts, and the music's first section becomes 10 s. Show it in full or not at all. Verify the exact wording before any use. |
| A4 | *"i remain enthusiastic about the non-profit structure!"* | Email, Sep 21, 2017 · [V] (flashback map §0.1; `gaps.md` says Sep 20) | Yes: 53 chars, 16 syllables | The cheerful "!" plays against the dark room. Already Ep11's line. |

**Promo only, never in the show intro:** "i've been fired before. (beat) it didn't take." **[INVENTED]**

---

## 4. The fidelity-tier concept

The world, the typography and the score all render at the fidelity of the era on screen. **The same scene graph and the same notes run in every tier.** A tier changes how things render, never what's in the scene, so the intro stays one continuous camera move and one theme rather than a medley.

### 4.1 The tier ladder

| Tier | Era on screen | Frames | Picture, as designed in v1 (**placeholder until style lock**) | Sound (same motif) |
|---|---|---|---|---|
| **T0** "the present" | The dark room (bookend) | f0–119, f690–719 | Near-black room lit only by monitor cyan; LCD subpixels; CRT glow on the monitor in the bookend only | Felt piano, sub drone, server hum |
| **T1** 1-bit | 1993 | f120–179 | Pure black and white at 512×342 and 6 fps, scaled 3× nearest-neighbor, in a 3:2 pillarbox; Bayer dither | Pulse-wave beeper, square bass, noise hats, over a real sub |
| **T2a** consumer video | 2008 | f180–194 | 320×240 at 12 fps; scanlines, chroma bleed, camcorder OSD | Boom-bap, wow-and-flutter cassette piano, hiss |
| **T2b** Flash-era web | 2014 | f195–224 | A generic web-player inset; orange on cream; dotted motion paths | Lo-fi brass stab, crowd "ohh" |
| **T3** the house style | 2015 dinner | f225–479 | v1: crisp cut-paper vector with paper grain. **The freeze is a palette swap, not a filter.** | Hybrid orchestra (piano, strings, brass, timpani) plus an 808 |
| **T4** max | 2022+ (slot, skyline, title) | f480–689 | The house style plus a gloss pass: glass, bloom, specular, light chromatic aberration | T3 plus a wordless choir, risers, sub drops, glass shimmer, celesta and bell |

### 4.2 The render front
The transition between tiers is **a glowing 1-px seam** that chases the curve's tip and re-renders the world behind it, like a progressive JPEG. Tiny egg labels mark each upgrade (`upgrading… 1-bit → 240p`).

| Seam | Frames | How |
|---|---|---|
| T0 → T1 | f118–120 | White-to-white match cut on the eyes |
| T1 → T2a | f168–179 | A lateral 12-frame render-front wipe |
| T2b → T3 | f225–229 | A 5-frame whip; the crown's glint becomes a candle |
| T3 → T4 | f480+ | A radial shockwave (`clip-path: circle()`) from the button Mas taps |
| Title | f630–639 | The wordmark renders up through all tiers in 12 frames: 1-bit, 240p, flat, then chrome |
| T4 → T0 | f690–701 | The whole frame shrinks into the monitor |

### 4.3 The tier rule, stated so any style can adopt it
The ladder is defined **relative to the house style**, so it holds whichever structure is chosen in [../bible/style-status.md](../bible/style-status.md):

- **T3 is the house style exactly as the episode bodies look.** The 2015 dinner is "now-fidelity."
- **T1** is the house style reduced to two tones at about ¼ resolution and about 6 fps.
- **T2** is the house style shown through a period consumer-video or web pass: resolution, frame rate, chroma and compression cues.
- **T4** is the house style plus one gloss or light pass: bloom, glass, specular and aberration. Nothing else changes.
- **Test for any candidate structure:** T1, T3 and T4 must be distinguishable at phone size in a 1-second glance. If the chosen style is itself low-resolution or pixel-based, the tiers separate by **palette depth and lighting** rather than resolution.

### 4.4 The ladder is also the flashback language
The season's flashbacks reuse these tiers **in reverse** (`downgrading… HDR → 1-bit`). The 1-bit alert dialog, the VHS tracking wipe, the candle-flame match cut and the Orb's iris replay (post-2019 memories only) are all entry devices. See [../timeline/flashback-map.md](../timeline/flashback-map.md) §3. Whatever the intro establishes for a tier, the flashbacks inherit.

---

## 5. Name cards

### 5.1 Shared template (the idea is locked; the look is pending style)
1. The character enters live and in full color on the beat-4 pickup.
2. **Freeze on the downbeat.** A 2-frame pop (80% white or less) and a 3-frame punch-in (1.06→1.0). The character drops into the frozen two-tone palette (v1: navy #14213D and cream #F2E8D5, with halftone and misregistration). **Only Mas never freezes.**
3. The NAME slams in with a 2-frame smear. The subtitle scrawls on at f+4 to f+10. The stat row is an egg: small and low contrast.
4. **Each card breaks its own template once**, and Mas does one background gag in frames f+30 to f+42 of the hold.
5. **Exit:** the card is anchored in the world, so the camera truck carries it off, or a flame or paper wipe takes it.
6. v1 type (pending style): Anton for names (about 170 px cap height), Permanent Marker for subtitles (about 64 px), Silkscreen for stats (30 px or smaller).

### 5.2 Card text (exact)
All subtitles and stat rows are **[INVENTED]** gag text, not quotes.

| Character | Card text (**bold** = must-read, *italic* = egg) | Action → freeze | Template break / Mas gag | Accent · sound |
|---|---|---|---|---|
| [MAS MANALT](../characters/mas-manalt.md) (1993) | **`MAS MANALT`** / **`no equity.`** · `Cancel` (greyed) `OK` · *title bar `age 8`* · *tooltip `this action cannot be cancelled`* | The kid turns to camera with the unblinking stare; the world becomes a 1-bit alert dialog | A stranger clicks Cancel: bonk, nothing. The kid clicks OK. **Pays off in bar 9.** | Pure black and white · square-wave bonk |
| [GERG MOCKBRAN](../characters/gerg-mockbran.md) | **`GERG MOCKBRAN`** / **`ORG CHART: HIM.`** · *`SLEEP: DEPRECATED · PTO: 404`* | Revealed already seated; keycaps pop like popcorn; his napkin sketch swaps to a website | Mas pockets the floating **CTRL** key | Terminal green #39FF88 · keyboard snare roll, hit on Fm |
| [ALYI](../characters/alyi.md) | **`ALYI`** / **`FEELS THE AGI.`** · *`PRODUCTS: 0 · BUNKER: YES`* ⚠ | The server cathedral lights up; he levitates; a paperclip-robot effigy labeled `UNALIGNED` ignites; freeze on "A-G-I!" | The FEELING bar bursts into the rose window; Mas roasts a marshmallow on the frozen fire | Ember #FF6A1A · chant, organ, hit on D♭ |
| [MARIO](../characters/mario.md) | **`MARIO`** / **`HAS CONCERNS. HAS GPUS.`** · *`DOOM RISK ▰▰▰▰▰▰▰▰ · BUILDING IT ANYWAY ✓`* | The vault door swings open; a `DRAFT — DO NOT PUBLISH` sheet flutters out; he raises a finger | The WORD COUNT bar becomes a scroll down the whole table; Mas rolls its tail into a telescope | Parchment #E9DCC0 with ink blue #1F3A93, **never red** · klaxon cut dead, hit on B♭m |
| [NOLE](../characters/nole.md) | **`NOLE`** / **`NAMED IT.`** + stamp **`SUED OVER IT.`** · *check `$1,000,000,000*` / `*pledged · received: $133M`* | A SPACEZ booster crashes through the ceiling; he leans from the hatch mid-post | Every glass sloshes except Mas's. Then Mas slides the N: **OPEN → NOPE** | Rocket red #E0301E · roar, fanfare, hit on C, stamp thunk |
| [LUAP](../characters/luap.md) (egg only) | *patch `LUAP · CALLED IT. (IN AN ESSAY.)`* | Drops a paper crown (`PRESIDENT`) down a dotted path | A tiny parachute on Mas's back (the "cannibals" essay, in the Ep4 flashback) | Orange #FF7F2A on #F3EEDC |
| Ep1 board (slot) | *tiles `ALYI` `NELEH` `MADA` `(camera off)`* | Five-tile call; the pointer finally clicks Cancel | Cancel greys out again one beat later | 90% desaturated |
| Skyline | Tower wordmarks are must-read; person names are egg-size plates | Each tower pops on a beat with its person on the roof and one moving part | Plates stay up until the title lands | Tuned plucks |

⚠ **`BUNKER: YES` is flagged.** The bunker line comes from reporting in the book *Empire of AI* (`early.md`). The critic's THE BIOGRAPHERS entry (§B14) rules that "book contents stay excluded as contested." Until the head writer rules on it, use the fallback *`PRODUCTS: 0 · EFFIGIES: 1`*. The effigy is Atlantic reporting, per `mid.md`. The same flag applies to the Ep10 bunker flashback.

**Also corrected in v1.1:**
- The place card at the founding (bar 8.4) now reads *`MARIO (UDIAB) · JOINS 2016`*. He was at Baidu, not Google, in Jul 2015 (flashback map §0.2).
- NOLE's check is an egg, and the received amount is "about $133M" in the source. The Tesla painting under his arm is a **2017** prop (the "I decline" walkout, Ep8). It stays as a tease; see the open questions.

### 5.3 The RUMPT card never appears in the intro
His card is in-episode only, starting in Ep4. It's gold foil, the only card that breaks the navy/cream template. The label gun relabels his subtitle `PRESIDENT` → `RENAMED IT.` See [RUMPT](../characters/dlanod-j-rumpt.md).

### 5.4 Ep12 variant: the model wrote the cards
All of these are **[INVENTED]**:
- MAS: `human face.`
- GERG: `REPORTS TO IT.`
- ALYI: `FELT IT.`
- MARIO: `PACED. ANYWAY.`
- NOLE: `WAS RIGHT. ONCE.` + stamp `APPEALING.`
- The 1993 kid blinks for the first time.
- The Intern has taken over the intro ([THE INTERN](../characters/the-intern.md)), and THE PODIUM's plaque reads `USER`.

---

## 6. What the intro teases, and where it pays off
From the flashback map §2F. The intro only teases; the explanation always lands in an episode, where it motivates the present-day plot.

| Intro beat | Frames | Pays off in |
|---|---|---|
| Bar 3: the 1993 kid; the screen faces away | f120–167 | [Ep1](../episodes/ep01/flashbacks.md), [Ep4](../episodes/ep04/flashbacks.md), [Ep7](../episodes/ep07/flashbacks.md), [Ep12](../episodes/ep12/flashbacks.md) (the screen finally turns: `HOW DO I WIN?`) |
| Bar 3: the uncancellable Cancel | f135–167 | Bar 9 of Ep1 (the board clicks it), then Ep1's Blip |
| Bar 4.1: the 2008 collars | f180–194 | [Ep2](../episodes/ep02/flashbacks.md) |
| Bar 4.2: the throne and ramen crown | f195–224 | [Ep4](../episodes/ep04/flashbacks.md) (cannibals), [Ep5](../episodes/ep05/flashbacks.md) (crown) |
| Bars 4.4–8: THE WOODROSE | f225–479 | Ep3, Ep5, Ep6, Ep10, Ep12 |
| Bar 5: GERG's napkin | f225–284 | [Ep3](../episodes/ep03/flashbacks.md) |
| Bar 5.4: ALYI's effigy | f285–344 | [Ep2](../episodes/ep02/flashbacks.md) |
| Bar 6.4: MARIO's vault | f345–359 | [Ep7](../episodes/ep07/flashbacks.md) |
| Bar 7: MARIO's scroll | f360–404 | [Ep10](../episodes/ep10/flashbacks.md) |
| Bar 8: NOLE's `received: $133M` check | f420–464 | [Ep6](../episodes/ep06/flashbacks.md) |
| Bar 8.4: the OPEN→NOPE neon | f465–479 | Ep6 ("his version") → [Ep8](../episodes/ep08/flashbacks.md) ("I came up with the name!") |
| Bar 11.2: THE PODIUM on the hill (Ep3+) | f622–689 | Ep3's button, where THE PODIUM turns around |

---

## 7. What is style-agnostic, and what waits on the style decision

| Element | Status | Notes |
|---|---|---|
| The concept (§1) and the intro rules | **LOCKED** | |
| The 12-bar structure, the beat grid and every frame number | **LOCKED** | `studio/src/shared/timing.ts` |
| Story beats, card text, headlines, subtitles, toasts, eggs | **LOCKED** (content) | Text still has to pass the lint in [shot-table.md](shot-table.md) |
| Cold-open line, delivery, length rule, source-fidelity rule | **LOCKED** | |
| Per-episode slot system, THE PODIUM states | **LOCKED** | [episode-slots.md](episode-slots.md) |
| Music: theme, motif, harmony, cue sheet, frame hits, SFX, voice plan | **LOCKED** | [cue-sheet.md](cue-sheet.md). The *motivation* for the music tiers depends on the picture tiers surviving (see below). |
| Read-time rule, text registry, photosensitivity rules | **LOCKED** | |
| Mounts and render cache (which frame ranges change per episode) | **LOCKED** | |
| The fidelity-tier ladder | **ADAPTS** | Defined relative to the house style (§4.3). If the chosen structure can't separate the tiers, see the fallback below. |
| Name-card template | **ADAPTS** | The freeze, the two-tone, "Mas never freezes" and the one template break are locked. The palette, halftone and fonts are pending. |
| Mas's design anchors | **ADAPTS** | Locked: grey hoodie, unblinking stare, tiny closed smile, three-quarter view in the left third, lit by the monitor. Pending: proportions. The showrunner has flagged the big-eyed outlined look as too cartoony (`studio/ART_GUIDE.md`). |
| Skyline | **ADAPTS** | Locked: one tower per beat, one boss per roof, the roofline becomes the curve, the hill with the podium. Pending: the isometric angle and the tower rendering. |
| Palettes and hex codes, fonts, line weights, halftone, "cut-paper" | **PENDING STYLE** | They come from the v1 look (`design/final.md` §5) and remain placeholders. |
| Render passes, shader budget, the "Build" effort column in the shot table | **PENDING STYLE** | Re-estimate after the style is locked |

**Fallback if the chosen structure can't carry the tiers:** keep the structure, beats and music, and replace the picture tiers with *era dressing inside the house style*: period screens, props and aspect ratios. The render front then becomes a plain wipe. `design/final.md` §5 calls this the "flat throughout" alternative. It costs the scaling joke, and the music tiers lose their motivation.

---

## 8. Changes from `design/final.md` in this version
1. THE PODIUM was added to the skyline from Ep3 (worldcast integration §5). RUMPT is barred from bars 1–8 and from intro cards.
2. Mario's place card now reads `MARIO (UDIAB) · JOINS 2016` (flashback map §0.2).
3. **The 1993 menu-bar egg `Thu, Apr 22, 1993` is retired.** The computer came "at eight" [V], not provably on his birthday, and possibly not until 1994 (critic §E42). The date card reads `1993` only, and the title bar egg `age 8` stays.
4. The source-fidelity rule (§3.3) replaces the lowercase-everything convention. The Ep7 "first capital" gag is restated as the first capital *I* he **posts**.
5. The Ep9 line keeps its source dash: `we are now in the singularity—`. The Ep8 "yes." is no longer played as instant, because the source says he amended his answer to "yes." Details in [episode-slots.md §3](episode-slots.md#3-cold-open-lines).
6. `BUNKER: YES` is flagged (§5.2). "UN dome" becomes **THE NU** dome, per the registry.
7. Alternate A2 ("agi has been achieved internally") was added. The alternates table now carries tags.

## 9. Open questions (for the head writer / showrunner)
1. **Style:** which structure? Everything marked ADAPTS or PENDING waits on [../bible/style-status.md](../bible/style-status.md).
2. **Runtime:** is every intro a hard 30.0 s, or may the pilot run 35 s for alternate A3? This is carried over from `final.md`.
3. **`BUNKER: YES`:** keep it (overruling critic §B14 for this line) or switch to `EFFIGIES: 1`?
4. **The Tesla painting at the 2015 dinner:** it's a 2017 prop. Keep it as a knowing tease, or move it to Ep8 only?
5. **Parity on the hill:** the intro's only political element is RUMPT's podium. Approve the optional NEDIB inkwell for Ep1–3 ([episode-slots.md §5](episode-slots.md#5-skyline-state-and-the-podium))?
6. **Names:** keep MARIO and KORG despite their brand associations (carried over from `final.md`)?
