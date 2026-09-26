# MR. MAS · GenAI upgrade plan (Season 1)

> **Re-scoped 2026-09-26 (showrunner):** "why would you convert to pixel art, the point of using generator is to do styles beyond what pixel art can do"
> - **Primary use: the Tier 2 leaps of the [style range](../bible/style-range.md), kept in their native look.** HD anime, near-photoreal environments, 3D and claymation finals. The generated footage *is* the style change; no pixel conversion.
> - **Secondary use: pixel-matched elements.** Only where a generated element has to live inside a pixel shot (fire on a pixel table, water in a pixel bay) does it go through `pixelize.py`/`glyphize.py`. The register below (§3–§4) was written for this secondary use and gets re-ranked against the leaps before any spend.
> - **Access:** API credits via dev.runwayml.com are billed separately from a Runway web-app plan. A web-app plan can still make the leaps by hand from prompts and reference frames the lead prepares.
> - **Guardrail unchanged:** never near-photoreal on caricatures of real people. Stylized (anime, clay) versions built from our own character designs are fine.

> **2026-09-26:** the showrunner expects hard media (near-photoreal, high-end anime, 3D) to reach their final look through a video model or similar: "some of these may be hard to be done programatically, hence the reason for giving access to video model or similar for the final draft (but still put fully programatic fillers for now)". The two-tier [style range](../bible/style-range.md) adds its drastic leaps to this register. Per-episode numbers here are guides, not caps.

Where generated video (and, where it's reasonable, generated voice, music, SFX and images) replaces a piece of the programmatic first pass, how it gets back into our look, what it costs, and what the production needs from the showrunner.

| | |
|---|---|
| **Status** | **PROPOSED.** Producer synthesis, 2026-09-25. It changes no script, rule or locked file; anything that would is listed under [§10 Rulings](#10-rulings-needed-no-cost). Nothing is spent until the showrunner answers [§9 RESOURCE ASKS](#9-resource-asks-ordered-by-impact). |
| **The note** | *"in general i want to consider where we can tastefully add higher quality animation in select segments with a video model output. similarly if reasonable for any other programmatically generated part. we will still make a first pass full programmatically."* |
| **Built from** | The scout's register: [genai-candidates.md](genai-candidates.md) (39 picture moments plus the audio candidates). The converter's working pipeline: [studio/tools/genvideo/README.md](../../studio/tools/genvideo/README.md), with test output in `out/genvideo/tests/`. The model-landscape research pass: prices and terms fetched 2026-09-25, key sources in [§12](#12-key-sources). |
| **Standing rules** | Pixel art is the primary look: adventure-game staging, GLYPH for dark foreshadowing, sparing and motivated switches ([style-status DECISION](../bible/style-status.md)). The show plays as a fluid thriller drama. 1080p maximum. Never clone or imitate a real person's voice. Never a photoreal or deepfake likeness of a real person. Parody names and logos only ([guardrails §5](../bible/guardrails.md#5-legal-hygiene)). Always ask about resources that would raise quality. |

**Contents:** [0. At a glance](#0-at-a-glance) · [1. Principles](#1-principles) · [2. Where the reports disagreed](#2-where-the-reports-disagreed-and-the-call) · [3. Top 10: intro + Ep1](#3-top-10-the-intro-and-ep1-the-pilot-batch) · [4. Season patterns](#4-season-patterns) · [5. Models](#5-recommended-models-per-category) · [6. Pipeline](#6-pipeline) · [7. Costs](#7-costs) · [8. Test plan](#8-test-plan-once-access-exists) · [9. RESOURCE ASKS](#9-resource-asks-ordered-by-impact) · [10. Rulings](#10-rulings-needed-no-cost) · [11. Handoffs](#11-handoffs) · [12. Sources](#12-key-sources)

---

## 0. At a glance

- **The first pass stays 100% code.** A generated insert is a later **layer swap** on the same frames, mask and sync. If a take fails the gate, the code layer ships.
- **Scope is small on purpose.** The register has 39 moments, about 272 s, or about 1.8% of the season. All of them are environments and elements: water, fire, smoke, weather, melts, shatters, flights in depth, and the machine's own POV. **No people, faces, hands, mouths or acting.**
- **Every clip comes back as our pixel art.** The pipeline is already built and tested on CPU: `keyframes.py` → model → `pixelize.py`/`glyphize.py` → `GenVideoScene`. Static-pixel boil drops 8–11×, A-B-A flicker drops to about 0, and 0 stray colours reach the frame. **The one missing piece is a model to call.**
- **Pilot batch: the intro's 4 and Ep1's 6 candidates** (about 42 s on screen, about 410 generated seconds): **about $25–120** at 720p with audio off. A bake-off comes first (**$50 cap**). **Season video: about $90–360; ask for a $500 ceiling.**
- **Buy 720p, audio off, never 4K.** Our canvas is 480×270, and the score and SFX are ours.
- **One key covers most of it.** The Runway API serves Wan 3.0, Veo 3.1 Fast, MiniMax H3 Max and Aleph 2. Sora 2's API shut down on 2026-09-24. Luma is excluded because its terms forbid altering its watermarks.
- **The biggest audio lift is human,** not a model: actors for MAS and RUMPT, a live Harmon trumpet (the title's one melody, still missing from the render), a horn session, strings and a foley day. Generative music stays banned unless the texture exception is signed off.
- **Nine resource asks**, led by the voice actors and a video API key, are in [§9](#9-resource-asks-ordered-by-impact). **Eight rulings** are in [§10](#10-rulings-needed-no-cost).

---

## 1. Principles

1. **The first pass is fully programmatic.** Every candidate has a code version that is cut into the animatic first. The generative version replaces a layer only after animatic lock, on the same frame range, mask, audio sync and 96 BPM grid. Nothing gets re-edited to fit a take. Mark the slot in the script like a `MUSIC:` line: `GEN: E1-6 · CONVERT · shatter + sand layers · fallback: code`.
2. **Upgrade only where it clearly lifts a moment.** Use generation for chaotic secondary motion and depth that are costly to hand-pixel and forgiving of drift. Skip the moments where cheapness is the joke (THE WHALE's budget breach, tiled crowds) and the moments that are better as a program (the heart and tile avalanches, the lensing black hole, the ring in his water). **Rough guides (not caps, per [flow-and-continuity](../bible/flow-and-continuity.md)):** around **45 s and 6 inserts per episode**, and about 1 SYNTH window (if SYNTH is approved). Go over them when a moment clearly plays better, and say why. GLYPH inserts come out of the existing GLYPH allowance.
3. **Everything is converted into our look.**
   - **CONVERT** is the default: 480×270, the master palette through the named light ramps, held on 2s (3s behind faces), whole-pixel motion.
   - **GLYPH** uses the clip only as the source for the machine's point of view.
   - **REF** uses the clip only as motion reference for drawings we make.
   - **SYNTH** (a near-raw clip inside a diegetic bezel) exists only if the showrunner signs it off.

   The test for every insert: *at 1×, in context, nobody thinks "AI video."*
4. **No likeness and no acting.** No person, face, hand, mouth, lip sync or performance ever comes out of a model. Every character is our sprite, composited afterwards, and characters are masked out of conditioning frames. Performance-capture tools (Runway Act-Two, Wan-Animate) are out. The show's own deepfake gags stay visibly drawn; generating them would make the show the thing it mocks.
5. **Parody guardrails apply to prompts and pixels.**
   - Prompts describe only physics, material, light and camera. They never name a real person, company, product, landmark, franchise, studio or artist, and never say "in the style of."
   - No legible text comes from a model. All text, logos and UI are code.
   - Nothing that touches X1–X12: no war hardware or strikes, no religious iconography in the nave, nothing Epstein-adjacent.
   - Invented must look invented: no realistic real room at a real event.
6. **Never lower moderation.** Runway's `publicFigureThreshold` stays on `auto`. A blocked prompt is a signal to change the idea, not something to route around.
7. **Voices stay honest.** Nothing is cloned, and nothing is designed to evoke a real voice. Final human characters are human performers. Designed voices come from a text prompt only, never from reference audio of a real person. **RUMPT and every official stay human-only**; ElevenLabs' own policy bans impersonating elected officials even with authorization. The OST engine stays the composer of record.
8. **Provenance and disclosure.**
   - Every insert has a `provenance.json`: model, version, date, prompt, seed, input hashes, cost, a terms snapshot and watermark status.
   - Raw sources are archived outside git, because they can't be re-created.
   - The end credits disclose AI-assisted elements.
   - We never remove a *visible* watermark. Any provider whose terms forbid altering invisible marks or content credentials is excluded, because pixel conversion alters them.
9. **Resolution and audio.** Generate at 720p (480p is fine for elements on black, GLYPH sources and REF). Model audio is always off. Never buy 4K. Deliver at 1080p maximum.
10. **Broadcast safety is unchanged.** Every insert passes the photosensitivity audit: at most 3 flashes per 24 frames, pops at 80% white or less, and the saturated-red test.

---

## 2. Where the reports disagreed, and the call

| Question | Research said | Scout / converter said | **Call** |
|---|---|---|---|
| Face and hand close-ups in quiet beats (first/last frame, Act-Two) | "Highest lift for thriller feel, highest drift risk" | NO-GO: acting, faces, hands. Hand-built | **Out for Season 1.** Motion behind stillness does the thriller work instead (E1-4, E1-5, E8-4) |
| A voice for THE ORB | ElevenLabs Voice Design fits it | The Orb is non-verbal (canon) | **No voice.** THE INTERN is Mas's actor, processed, on one contract |
| 240p camcorder memories | A cheap 480p use | Not in the pixel DECISION; EARLY-WEB16 owns 2008–14 | **Not a candidate** |
| Orb iris replay ("glossy HDR") | Close to a model's native look | Not listed | It is proposed in [style-status §7a](../bible/style-status.md#7a-proposed-switch-vocabulary) but **not in the pixel DECISION's switch list**. **Parked**; it would follow the SYNTH ruling |
| Music models as a polish layer | ElevenLabs Music conditioning, ACE-Step cover | OST §6.10 ban stands; live players first | **The ban stands.** Only the narrow M8 texture exception goes to the showrunner ([§10](#10-rulings-needed-no-cost)) |
| Ingest tool | — | The scout proposed `genai-ingest/` | **Already built** as `studio/tools/genvideo/`. Still to build: the API client, provenance and the gate script ([§6](#6-pipeline)) |
| Ep1 timecodes | — | The scout used an earlier conform | This plan uses the current script's scene timecodes (draft 2 / Act Four 3.1) |
| Luma Ray3.2 (16 keyframes, cheapest 720p) | A good control option | — | **Excluded.** Its terms forbid altering watermarks or content credentials. Revisit only with Luma's written OK |
| Ep8: each witness rendered by "their own company's" real model | All available behind one Runway key | E8-2: SYNTH, environment only, goes last | **Optional off-screen in-joke** after the SYNTH ruling. Environment only, never labelled on screen |

---

## 3. Top 10: the intro and Ep1 (the pilot batch)

The intro and Ep1 have exactly ten candidates. They are ranked by **lift × reuse ÷ risk**. The seconds are shipped on-screen seconds.

| # | ID · kit | Exact spot | First pass (code) | What the model adds | Treatment | Sec | Risk |
|---|---|---|---|---|---|---|---|
| **1** | **E1-6** · SHATTER | Ep1 **sc30** (15:34–16:23), the `[HIGH]` table overhead, 8 beats. *"On the post's last beat the hourglass shatters, only the glass… The sand holds the shape… for one beat, then falls."* | Held drawings | A real shatter (shards, glints) and a granular collapse. **The one-beat hold is ours** (a held frame in code) | CONVERT: two takes on black, spliced | 2 (+2 in Ep5, +Ep7) | low |
| **2** | **IN-4** · BAY | Intro **f540–629**, Scene 7 SKYLINE (`mfinale`): the water plane and NopeAI's cooling-tower steam. Reused in Ep1 **sc14** (7:10–7:20, the night bay) and sc1's window | 3-plane parallax, palette-cycled glints, 4-frame steam loops | A living water surface reflecting *our* lit towers, real steam and fog. Day, dusk, night and ice come from ramps, not new generations | CONVERT (`plate`), water on 2s, steam as 8-frame loops | 3.8 (≈30 across the season) | med |
| **3** | **E1-4** · VEGAS | Ep1 **sc24** `[W]` 12:31–12:35, the act's 1-bar establishing wide. Then the **window plate behind sc26** (12:52–13:10), including the `[CU]`, one drawing with the Strip's neon behind him | A pixel Strip plate with cycled neon, and the crane-truck sprite | A dusk descent over a neon boulevard into the suite. Traffic streaks, sign flicker and heat haze behind the still face, stepped down two light levels. *Option (writer):* the plate freezes on the D6 click, when "the Strip… stop[s]" | CONVERT, on 3s behind faces | 15 | med |
| **4** | **E1-1** · SLOSH | Ep1 **sc1** (0:00–0:20; *"the moderator's glass sloshes over its rim"*, about 0:12) and **sc24** `[W]` (flute, tumbler, ice bucket and vase shiver). Every later "every glass but his" | 3 drawings per glass, offset | How each vessel really sloshes, crowns and spills. We pick 3–4 key drawings per vessel. **Mas's glass is never generated** | REF (+ CONVERT for sc1's spill) | 6 across the season | low |
| **5** | **E1-3** · MELT | Ep1 **sc6** THE ODOMETER DRILL, 2:08–2:48. Phrase 1 bar 1 (it bores through the ceilings), phrase 3 (the bedrock punch), phrase 4 (*"GPUs sag like soft clocks"*) | Whole-pixel scroll, held debris, 1-px heat steps, held sag drawings | Dust and debris per punched floor; a slow viscous sag. **This sets the season's melt vocabulary** (the skyline state, the Ep2 chair, Ep4's set-piece) | CONVERT. The melt uses first/last frame: our GPU sprite → our drawn sag | 6 | low–med |
| **6** | **IN-1** · NAVE | Intro **f100–104** `[GLYPH-MASKED]`, inside the Orb's scan cone (S1). Source buffer `drawCathedral()` | A static nave in tokens | A slow dolly down an endless data-center nave, so the 5 glyph frames have real parallax. **The kit feeds E4-3, E9-2 and E12-2** | GLYPH source (adds no GLYPH time) | 0.2 | low–med |
| **7** | **E1-5** · FIRE, SMOKE | Ep1 **sc30**, the boardroom: `[M]` MADA among the small fires → the `[2S]` **calm-off** (*"all the chaos… happens behind them"*: Terb sprays the chair fire) → the `[2S]` HOLD 2 BEATS | 4-frame fire loops, spray drawings | Small-scale fire, plus the extinguisher cloud filling and clearing behind two still men | CONVERT layers, kept lower in value than the faces | 5 | low |
| **8** | **IN-2** · FIRE | Intro **f290–299** and from the thaw at **f340**: the `UNALIGNED` effigy's live frames. The frozen f300–339 is unchanged | An 8-frame hand-pixelled loop | Real turbulence and ember lift on the tungsten W ramp. The fire's luminance drives the wall light | CONVERT (on black) | 1.3 | low |
| **9** | **E1-2** · (SLOSH) | Ep1 **sc3**, 0:30–0:35: *"The moderator's water climbs back into his glass."* | Held-drawing chunks | **E1-1's spill played in reverse, done in code. $0** | CONVERT | 2 | low |
| **10** | **IN-3** · PLUME | Intro **f405–419**: the ceiling burst and the SPACEZ booster's plume | A 4-frame flame loop, tile hops, a 3-px shake | Billowing exhaust and tile dust. **Only if a v2.2 re-render happens anyway**; the kit's real use is E8-3 | CONVERT behind our booster | 0.6 | low |

**Totals:** intro about 5.9 s, Ep1 about 36 s. Ep1 sits exactly at the 6-insert cap and under 45 s. IN-1 and IN-4 ride the per-episode re-render of f0–119 and f540–719. IN-2 and IN-3 need a re-render of the cached f120–479 (the `mdinner1` block), so they wait for a v2.2 pass.

**Generation plan for the pilot** (the bake-off chooses the final model per pattern; see [§8](#8-test-plan-once-access-exists))

| # | ID | Clips to generate | Conditioning | Gen s × takes | Default model |
|---|---|---|---|---|---|
| 1 | E1-6 | shatter 5 s + sand collapse 5 s, on black | I2V from our hourglass plate | 10 × 4 = 40 | Wan 3.0 720p / Veo 3.1 Fast |
| 2 | IN-4 | water 8 s, steam 5 s, day fog 5 s | first/last frame = our skyline plates | 18 × 4 = 72 | Veo 3.1 Fast / Kling 3.0 |
| 3 | E1-4 | descent 8 s, window loop 10 s | first/last frame = our Strip plates | 18 × 4 = 72 | Veo 3.1 (full, audio off) for the descent; Wan 3.0 for the loop |
| 4 | E1-1 | 4 vessels × 5 s, plus the table spill | T2V, vessels on a table, no hands | 25 × 3 = 75 | H3 Max / Wan 3.0 at 480p (REF only) |
| 5 | E1-3 | debris burst 5 s, melt 8 s | melt: first frame our sprite, last frame our sag | 13 × 4 = 52 | Wan 3.0 480p (debris); Veo 3.1 Fast (melt) |
| 6 | IN-1 | nave dolly 8 s | T2V, vanishing point on the cone axis | 8 × 4 = 32 | Wan 3.0 480p |
| 7 | E1-5 | fire 5 s, extinguisher cloud 5 s, on black | T2V | 10 × 3 = 30 | Wan 3.0 480p (shares the FIRE kit) |
| 8 | IN-2 | fire loop 5 s, on black | T2V | 5 × 3 = 15 | Wan 3.0 480p |
| 9 | E1-2 | none (E1-1 reversed) | — | 0 (+10 spare) | — |
| 10 | IN-3 | plume and dust 5 s, on black | T2V | 5 × 3 = 15 | Wan 3.0 480p |
| | | | | **≈ 410 s** | |

---

## 4. Season patterns

The full register is in [genai-candidates §5](genai-candidates.md#5-candidate-register). After Ep1 there are 6 more A-tier moments, 23 B-tier and 4 C-tier. **Ten shared kits** carry more than half the seconds. Each is generated once, converted once, committed, and reused all season.

| Kit | Pattern | First use | Reused in |
|---|---|---|---|
| **BAY** | Liquids / sky | IN-4 | Ep1 sc14 · Ep3 CO, sc18, E3-3 · E5-2 · Ep6 · E11-2 |
| **NAVE** | Flight / GLYPH | IN-1 | E4-3 · E9-2 · E12-2 |
| **FIRE** | Elements | IN-2, E1-5 | E2-3 · Ep3 sc15 · E12-3 |
| **SMOKE** | Elements | E2-2 (the candle wipe) | E1-5 · E8-3 |
| **SLOSH** | Liquids (REF) | E1-1 | every "every glass but his" · E11-2 |
| **MELT** | Physics | E1-3 | E2-1's chair · **E4-3** |
| **SHATTER** | Physics | E1-6 | Ep5 #17 · E7-2 |
| **PLUME** | Elements | IN-3 | E8-3 |
| **VEGAS** | Plate / flight | E1-4 | E10-1 · E10-2 |
| **SURF** | Liquids | E3-1 | Ep4 #4 · E12-3 |

**The later A-tier moments:**
- **E2-1** AROS's mammoth: SYNTH → REF/CONVERT. It depends on the SYNTH ruling.
- **E2-4** the Bay Bridge storm.
- **E4-3** OUR GPUS ARE MELTING.
- **E9-1** the /tmp folder city: CONVERT flight plus GLYPH beats.
- **E11-2** every glass in the city ripples.
- **E12-2** the model rebuilds THE WOODROSE: GLYPH/TERMINAL, first and last frames from the intro's dinner set.

**Placement rule.** Inserts go in S-mode set-pieces, establishing wides, backgrounds behind a held face (two light steps down), his screens, machine-POV sequences and signposted exits, and under the credits. **Never** in an I-mode dialogue foreground, under must-read text, on `(REPORTED)` or `(DISPUTED)` material, or as extra screen time without Mas.

**Never generated** (the scout's [§2](genai-candidates.md#2-no-go-zones)):
- character acting, faces, lip sync, or anything deepfake, including the in-world deepfake gags
- realistic real events and rooms
- text, THE PLAN, or UI
- Mas's glass and reserved tells
- 1993 and 1-BIT
- war, religious, franchise or Epstein-adjacent imagery
- the sincere beats (F9.3, the bead, the ring)

---

## 5. Recommended models per category

Prices are per second of output at our tier (720p or 480p, audio off) unless noted. They were fetched from official pricing pages and API specs on 2026-09-25; *unverified* marks what the research couldn't confirm from a primary source.

### 5.1 Video

| Role | Model (access) | Price | Control | Terms and provenance |
|---|---|---|---|---|
| **Workhorse** (elements on black, loops, GLYPH sources, REF) | **Wan 3.0** (Runway API) | 480p **$0.05** · 720p **$0.10** | T2V, I2V, first+last frame (can't be mixed with refs); 2–30 s | Runway claims no ownership of outputs. Real-people policy and provenance unverified |
| **Plates and melts** (first/last frame) | **Veo 3.1 Fast** (Runway, audio off) | **$0.10** | First+last frame; 4/6/8 s; 24 fps | SynthID watermark. Rejects photoreal prominent people |
| **Hero flights** (E1-4 descent, E12-2) | **Veo 3.1** (Runway or fal, audio off) | **$0.20** | As Fast, higher fidelity | As above. **In the Gemini API, Veo 3.1 always bills with audio ($0.40), so buy it through Runway or fal** |
| Budget alternative | **MiniMax H3 Max** (Runway) | 480p $0.05 · 768p $0.08 | First+last frame; 5–15 s | Unverified |
| Consistency option | **Kling 3.0 Std** (fal) | **$0.084** | First+last frame (`end_image_url`), Elements refs; up to 15 s | Unverified. Needs a fal key |
| Restyle our animatic | **Aleph 2** (Runway V2V) | $0.28 (56-credit minimum) | Up to 5 timed keyframes; input 2–30 s at ≤30 fps | Test once (E9-1). Our `ref.mp4` steers it |
| Gemini-only alternative | Veo 3.1 Lite / Omni Flash | $0.05 at 720p / about $0.10 | Lite's first+last frame is **unverified** | SynthID. Omni refuses to edit recognizable people |
| Open weights (phase 2 option) | **Wan2.2-TI2V-5B** + a pixel-art LoRA trained on our engine renders | about $0.34/h (RunPod 4090) or $0.15 per 5 s clip on fal | 720p, 24 fps; needs a 24 GB GPU | **Apache-2.0**, "no rights over generated contents." Unlimited retries, and our frames stay private |

**Excluded:**
- **Sora 2:** the API shut down on 2026-09-24.
- **Luma Ray3.2:** its terms forbid altering watermarks or content credentials.
- **Act-Two and Wan-Animate:** performance capture is character acting.
- **Runway frame interpolation and the Magnific upscaler:** both destroy the pixel grid.
- Every **4K tier**, and every **model audio track**.
- **Seedance 2.5** ($0.30 at 720p plus fees): no gain for our uses.
- **HappyHorse** (maker unverified) and **Moonvalley** (API on a waitlist).
- **LTX-2.5:** about 66 GiB of weights, so an H100; later, if ever.

### 5.2 Voice

| Use | Pick | Price | Terms |
|---|---|---|---|
| **Final human characters** | **Human actors** in a cartoon register, cast from the persona briefs, in this order: MAS (+ THE INTERN on one contract) → RUMPT → NOLE → CHATGTP → ALYI, MARIO, NESNEJ, RIMA, GERG | [§7](#7-costs) | The contract bars training a voice model on their takes without separate consent and pay ([CASTING §6](../../audio/voices/CASTING.md#6-what-would-most-improve-these-voices-in-order)) |
| **CHATGTP candidate and the scratch upgrade** (non-official characters only) | **ElevenLabs v3 + Voice Design** (`eleven_ttv_v3`): text prompt only, 3 previews | API v3 $0.10 per 1K characters. **Creator plan $22/mo** ($11 the first month); Pro $99 for 44.1 kHz PCM | Bans replicating anyone's voice without consent, and bans impersonating officials even with authorization. Never name a real person or write "sounds like" in a prompt. **CHATGTP must resemble no real voice** (Ep2's "her" plot) |
| Temp comic timing | ElevenLabs speech-to-speech from a **consenting** director's or writer's timing read, into a designed voice | Included in the plan | CASTING §6 item 3 |
| Free local option | **Qwen3-TTS-12Hz-1.7B-VoiceDesign** | $0 | Apache-2.0, about 4 GB. CPU speed unverified, so test it |
| Scratch | **Kokoro-82M** (current) | $0 | RUMPT and the officials stay on it until the human cast |

### 5.3 Music

| Use | Pick | Price | Terms |
|---|---|---|---|
| **Composer of record** | The **OST engine** plus licensed samples | — | [OST §6.10](../../audio/ost/OST-BIBLE.md#610-licences-and-rights): "No generative-AI music models." **Stands** |
| **The upgrade** | **Live players:** M1 Harmon trumpet (f540–599), M2 horn stab session, M3 violin and cello, M4 felted upright, M5 vocal quartet (the PAD), M6 chant group | [§7](#7-costs) | Recorded to the grid, delivered as stems |
| *Only if M8 is approved* | **ElevenLabs Music v2.5**, for non-melodic beds and diegetic source music (a lounge through a wall, a stadium PA) | $0.15/min (API) | Commercial use on Starter and up. Music Terms updated 26 May 2026. Optional C2PA. Every cue must pass the engine's `analysis` checks (F home, no A♮ over F, the 96 BPM grid) |
| Open alternative (M8) | **ACE-Step 1.5** (cover and repaint) | $0 | MIT. The 2B turbo model runs slowly on CPU; how well notes survive a cover is unverified |
| Not used | Suno v6 (commercial use only for permitted downloads; no API seen), Lyria 3.5 (commercial terms unstated) | — | — |

### 5.4 SFX

| Use | Pick | Price | Terms |
|---|---|---|---|
| **Signature materials** (glass, water, ice, paper, stamps, keys) | **One foley day** | [§7](#7-costs) | Owned outright |
| Raw layers for set-pieces (rocket, meteor, mammoth, thunder, walla with no intelligible speech) | **ElevenLabs Sound Effects v2** (0.1–30 s, loop mode, **48 kHz WAV**) | Included in the plan (API $0.12/min) | Commercial use on paid plans. Every layer is re-pitched to F and edited |
| Free local option | **Stable Audio 3 small-sfx** (0.6B, gated) | $0 | Stability Community Licence (free under $1M revenue) |
| Avoid | MMAudio | — | CC-BY-NC: non-commercial only |

Identity sounds stay procedural: the chip, the blips, the Orb's chime, the freeze latches and the KA-CHING.

### 5.5 Images (drafts and plates, never cast)

| Use | Pick | Price | Notes |
|---|---|---|---|
| REF key-drawing drafts for creatures and props (the mammoth's walk, the gull, the lobster, the dogs, the vessels) | **Retro Diffusion** with `input_palette` locked to the master palette | $0.03–0.18 per image; animations $0.07–0.25 | **Licence unverified: check it before first use** |
| Concept boards for kits (the nave, the folder city, the Strip) | **Nano Banana Pro / 2** (Gemini) | $0.134 / $0.067 per image | Concepts only |
| A still becomes a pixel plate | `pixelize.py plate.png --duration 4` | $0 | The same ingest as video |

**Never** use image models for cast members or caricatures of real people. That keeps both "never traced from photos" and the likeness rule.

---

## 6. Pipeline

```
 script GEN: slot ─▶ code version cut in the animatic (ships if anything below fails)
        │
 1 CONDITION  keyframes.py ─▶ start/end clean plates (+ soft, model-size), motion masks, guide, ref.mp4, prompt scaffold (guardrails built in)
        │
 2 GENERATE   gen.py (TO BUILD) ─▶ raw.mp4 (720p, audio off) + provenance.json ─▶ archive the source (outside git) at once
        │
 3 CONVERT    pixelize.py (plate | default | character presets, --match start-native.png, --families per shot)
              glyphize.py (GLYPH sources)  ·  REF: pick key drawings, hand-clean
        │
 4 COMPOSITE  <GenVideoScene> + blitGen() inside the mask · match cut / genHandoff (2–6 f) · every engine switch applies
        │
 5 REVIEW     automated gate (TO BUILD) ─▶ human gate ─▶ showrunner go / no-go at 1×, in context, against the code version
        │
 6 SHIP       commit studio/public/genvideo/<ID>/ (indexed PNGs + clip.json + provenance.json) · credits list built from provenance
```

| Stage | Tool | Status |
|---|---|---|
| Conditioning export | `studio/tools/genvideo/keyframes.py` + the `genvideoPlate` prop on `PixelScene` | **Built and tested** (`out/genvideo/tests/keyframes/room-sky/`) |
| Generate | `gen.py`: a Runway client first (the OpenAPI spec is public), with Gemini and fal adapters later. It writes `provenance.json` and archives the source | **To build**, once a key exists (about 0.5 day) |
| Convert | `pixelize.py`, `glyphize.py`, `gvlib.py` | **Built.** Static boil down 8–11×, flips about 0, a 96.4% round trip. About 1–4 CPU-min per 5 s clip |
| Composite | `GenVideo.tsx`, `genclip.ts`, `plate.ts` | **Built.** 0 off-palette colours in rendered frames; the handoff join doesn't show |
| Automated gate | Combines `pixelize --stats`, `strayColors`, the luminance and red audit, and an end-frame match | **To build** (about 0.5 day) |
| Human gate | [genai-candidates §1.5](genai-candidates.md#15-the-gate-every-insert-every-take) checklist | Written |
| Masks for figures | An optional small segmentation model (CPU) for `--protect` | Optional |
| Known limits | Non-rigid edges crawl slightly (pan-lock handles rigid pans only). The palette has no mid warm yellows, so always `--match` to our frame | Open |

**Automated gate thresholds** (set from the converter's own worst case, the synthetic `stress` clip):

| Check | Pass if |
|---|---|
| Static-pixel boil | ≤ 0.30 changes per pixel per second |
| A-B-A flips | ≤ 1.5 per 1,000 static pixel-drawings |
| Palette | `strayColors === 0` (CONVERT and GLYPH) |
| Dither | Only on backgrounds and falloff, never on skin |
| First/last-frame shots | Outside the motion mask, the last drawing matches `end-native.png` at ≥ 95% visually identical (the round-trip ceiling is 96.4%) |
| Photosensitivity | At most 3 flashes per 24 frames, pops at 80% white or less, and the saturated-red test passed |
| Budget | Near the rough guide of 45 s, 6 inserts and 1 SYNTH, or a stated reason to exceed it |

**Storage.**
- Sources: about 0.5 GB for the pilot and 1–3 GB for the season. The disk has about 12 GB free.
- Converted drawings are small indexed PNGs and **are committed** (the `.gitignore` already allows them).
- `*.mp4` is gitignored, and a generated source **can't be re-created**, so it goes into a backed-up archive the day it's made (ask 3).

**Disclosure and watermarks.**
- **Invisible watermarks.** Veo and Omni embed SynthID, and our conversion will destroy it. That is a side effect of redrawing, not concealment, but we disclose anyway: an end-credit line (for example, *"Select environmental motion generated with AI video tools and redrawn in pixel by the production. No performances, faces or voices were generated."*) and the per-insert provenance manifest.
- **Content credentials.** Optionally, attach a C2PA manifest to the delivered masters.
- **Visible watermarks.** Never remove one; buy tiers that don't add one.
- **Excluded providers.** Luma is out: its terms forbid altering its watermarks or content credentials.
- **Before distribution** (not re-verified this pass): check the platform's synthetic-media disclosure setting and EU AI Act Art. 50 transparency duties, which apply from Aug 2026 with lighter disclosure for artistic and satirical work. This plan's inserts contain no people and no depiction of real events, so they are not deepfakes.

---

## 7. Costs

### 7.1 Generation

The rates are the budget tier (Wan 3.0 or H3 Max at 480–720p, $0.05–0.10/s), a mixed tier (70% budget and 30% Veo 3.1 or Aleph at $0.20–0.28/s), and an all-premium tier (Veo 3.1 audio-off at $0.20/s).

| Batch | Generated seconds | Budget | Mixed | All premium | **Ask** |
|---|---|---|---|---|---|
| **Bake-off** (3 tests × 3 models × 3 takes × 5 s) | about 135 | $7–14 | about $20 | about $27 (up to $40 with Seedance-class models) | **$50** |
| **Pilot: the top 10** ([§3](#3-top-10-the-intro-and-ep1-the-pilot-batch)) | about 410 | $25–40 | about $60 | about $80–120 | **$150** |
| **Season** (all A and B moments, pilot included; about 4 takes per shipped second, plus loops) | 1,100–1,800 | $90–180 | $160–280 | $220–360 | **$500 ceiling** |

**Agent time.** Roughly cost-neutral against the hand-built set-piece rate. The brief, takes, ingest, QA and review replace hand-drawn debris, water and fire. **Measure it in the bake-off** (agent-minutes per shipped second) before committing the season.

### 7.2 Tools (season, about 6 months of production)

| Item | Range |
|---|---|
| ElevenLabs Creator ($22/mo), plus one Pro month ($99) for finals if needed | $120–230 |
| Retro Diffusion credits | under $50 |
| Nano Banana concept boards | $15–30 |
| fal key (Kling 3.0), optional | about $50 |
| Cloud GPU (the open-weights LoRA route), optional | $25–100 |
| Backed-up archive for sources (5 GB) | about $0–5/mo, or an existing drive |
| **AI tools and generation, season total** | **about $350–1,000. Ask: a $1,000 ceiling** |

### 7.3 Humans

**These are the producer's planning ranges, not quotes.** Replace them with real quotes; union and non-union rates differ widely.

| Item | Pilot (intro + Ep1) | Season |
|---|---|---|
| **Voice principals:** MAS (+ THE INTERN), RUMPT, NOLE, CHATGTP (about 3–5 studio hours per episode across the cast, per production-estimates §7) | $1k–3k | $7k–25k |
| Next five principals, plus a walla group of 4–8 | — | $5k–15k |
| M1 Harmon trumpet (one remote session) | $150–400 | — |
| M2 horn-section stab and shout library (one session serves the season) | — | $1.5k–4k |
| M3 violin and cello (the STRAIGHT beats) | $400–1.2k | — |
| M4 felted upright ("Water Line" phrases) | — | $300–800 |
| M5 vocal quartet (the PAD) and M6 chant group | — | $1.4k–4k |
| Foley day (glass, water, ice, paper, stamps, keyboards) | $800–2.5k | — |

---

## 8. Test plan (once access exists)

**Phase 0: now, no spend.**
- Read the chosen provider's terms and save a snapshot: commercial use, training on our inputs, moderation, watermarks.
- Build the `gen.py` stub against Runway's OpenAPI spec, and the gate script.
- Run `keyframes.py` for the three bake-off shots.
- Optionally, run local CPU tests of Qwen3-TTS VoiceDesign (about 4 GB) and Stable Audio 3 small-sfx, one at a time, deleting the weights after, to spare the 12 GB of disk.

**Phase 1: the bake-off** ($50 cap; about 2 days).
- **Three models:** Wan 3.0 at 720p, Veo 3.1 Fast (audio off), and MiniMax H3 Max. If a fal key is granted, Kling 3.0 Std replaces H3 Max. Three takes each.

| Test | Shot | Treatment | Proves |
|---|---|---|---|
| 1 | **E1-6** hourglass shatter (2 s) | CONVERT | The ingest and hold cadence; generated physics passes the effect test |
| 2 | **IN-1** (5 frames) plus a 2-bar (5 s) slice of **E9-1** | GLYPH + CONVERT flight | Depth survives GLYPH and pixel conversion; a flight stays readable. Also try Aleph 2 once on E9-1's `ref.mp4` |
| 3 | **E2-1** mammoth: SYNTH window → step-out as 8 drawings | SYNTH → REF | Whether SYNTH is tasteful at all, decided on picture |

- **Measure per take:**
  - the automated gate ([§6](#6-pipeline))
  - first/last-frame drift against `end-native.png`
  - moderation blocks
  - generation cost per *shipped* second
  - agent-minutes per shipped second
  - CPU conversion time
- **Review:** the showrunner watches each test in its scene at 1×, against the code version, and answers one question: *"Did you think 'effect'?"*
- **Outputs:**
  - a go or no-go per treatment (CONVERT, GLYPH, REF, SYNTH)
  - the default model per pattern
  - measured cost per shipped second, which re-prices [§7](#7-costs)
- **A no-go on SYNTH** moves E2-1 and E8-2 to CONVERT or code, and nothing else changes.

**Phase 2: the pilot** ($150 cap).
- Generate the top 10 as layer swaps in the intro and Ep1 animatic.
- The showrunner screens an A/B reel, code version against upgraded.
- Only passing inserts ship. The per-episode intro renders pick up IN-1 and IN-4.

**Phase 3: the kits.** Lock BAY, NAVE, FIRE, SLOSH, MELT, SHATTER and VEGAS from the pilot. Generate SMOKE, PLUME and SURF at their first use. Commit the converted drawings; archive the sources.

**Phase 4: per episode.** At each episode's animatic lock, pick the inserts that clearly lift the episode from the register (about 6 inserts and 45 s is the rough guide), generate, gate, and get sign-off. The credits list is built from `provenance.json`.

**Audio tests** (run in parallel once the accounts exist):

| Test | Method | Pass if |
|---|---|---|
| CHATGTP designed voice | 3 prompts from the persona brief × 3 previews in ElevenLabs Voice Design. A blind panel compares them with Kokoro on 5 Ep2 lines | The panel prefers it, and **nobody hears a real person or product voice in it** (any such match is an automatic reject) |
| Scratch-cast upgrade | One Ep1 scene with designed voices (non-official characters only) against the current scratch | Better comic timing on the marked pauses |
| SFX layers | ElevenLabs SFX v2, Stable Audio small-sfx and the current synth, on E1-6's shatter and E2-4's thunder | Better after re-pitching to F and editing; licence clean |
| Music (M8 only) | One diegetic bed through the `analysis` checks | Passes the F-home, A♮ and grid checks |

---

## 9. RESOURCE ASKS (ordered by impact)

| # | Ask | Why it matters | Budget | When |
|---|---|---|---|---|
| **1** | **Human voice actors**, in this order: **MAS (who also plays THE INTERN, on one contract)** → **RUMPT** → NOLE → CHATGTP. Also: union or non-union? | The show's biggest quality gain per dollar. The deadpan lives in timed pauses that TTS rushes. RUMPT *must* be human | Pilot $1k–3k; top four for the season $7k–25k (unquoted) | Cast now, while Eps 1–3 are scripted; record after script lock |
| **2** | **A Runway API key with prepaid credits**, plus approval to run the bake-off. One key covers Wan 3.0, Veo 3.1 Fast and full, H3 Max and Aleph 2. *Alternative:* a Gemini API key | This is the missing piece: the pipeline is built, and nothing can generate video on this CPU | **$50** for the bake-off → **$150** for the pilot → **$500 season ceiling** | Now |
| **3** | **A backed-up archive for generated sources** (about 5 GB: cloud storage, an external drive or git LFS) | Sources can't be re-created, and `*.mp4` is gitignored. **This blocks the first generation** | About $0–5/mo | Before ask 2 is used |
| **4** | **Live brass and strings:** a **Harmon-muted trumpet** (M1, the title's only melody, still missing from the render), a **horn-section session** (M2), a **violin and cello** (M3) | The most audibly fake instruments on a laptop, on moments heard every week | $2k–5.6k | M1 before the next intro master |
| **5** | **One foley day:** glass, water, ice, paper, stamps, keyboards | The signature gag family is liquid, and synthesized water convinces least | $0.8k–2.5k | Before the Ep1 mix |
| **6** | **ElevenLabs Creator plan** ($22/mo; Pro $99 for one month of finals if needed) | Voice Design for the CHATGTP candidate and the scratch upgrade; SFX v2 raw layers; Music only if M8 is approved | $120–230 for the season | With ask 2 |
| **7** | **A vocal quartet** (M5, the PAD) and **a chant and walla group** (M6, crowds) | Synthetic vowels and TTS crowds are audible | $1.4k–4k | Before the Ep2 mix |
| **8** | *Optional:* a **fal.ai** key (Kling 3.0), **Retro Diffusion** credits, and a **Gemini** key for Nano Banana concept boards | A consistency option; on-palette REF drafts; kit concepts | About $50 + under $50 + $15–30 | After the bake-off |
| **9** | *Optional:* a **cloud GPU account** (RunPod or Modal) for the open-weights route (Wan2.2-5B, Apache-2.0) with a pixel-art LoRA trained on our renders | Unlimited retries, private frames, and a model that learns our look. Worth it only if the bake-off shows API models fighting the look | $25–100 | After the bake-off |

**Standing budget request:** a **$1,000 ceiling for AI tools and generation** this season, plus a **human-talent budget** set by the showrunner (the planning total for asks 1, 4, 5 and 7 is about $11k–37k for the season).

---

## 10. Rulings needed (no cost)

| # | Decision | Producer's recommendation | Default until decided |
|---|---|---|---|
| 1 | **SYNTH:** a bezel-bound switch for diegetic machine media (E2-1, E8-2) | Decide on the bake-off's test 3, on picture | Not used |
| 2 | **Reverse the "in-world deepfake parodies" exception** in [production-estimates §7](../format/production-estimates.md#7-what-external-tools-would-change) and FORMAT-DECISION §7.5 | **Yes, reverse it.** Deepfake gags stay visibly drawn | Drawn |
| 3 | **M8:** a narrow music-texture exception to OST §6.10 (non-melodic beds and diegetic source music only) | Hold until the live sessions land, then revisit | The ban stands |
| 4 | **Rough guides:** about 45 s, 6 inserts and 1 SYNTH per episode (guides, not caps, per the 2026-09-26 note) | Yes | As proposed |
| 5 | **Disclosure:** an end-credit line plus the provenance manifest (and optional C2PA) | Yes. Approve the wording in [§6](#6-pipeline) | Credit line on |
| 6 | **Designed voices** (text-prompt only): allowed for scratch and temp of non-official characters, and for CHATGTP as a final candidate if it passes the "resembles nobody" check. Never for officials | Yes | Kokoro scratch |
| 7 | **Gate owner** for each insert | THE EDITOR and a pixel QA agent flag; the showrunner decides | As recommended |
| 8 | **The Orb iris replay's "glossy HDR" look** (style-status §7a, not in the pixel DECISION) | Park it; it follows ruling 1 | Not used |

The scout also left an optional writer's call: on E1-4, the Strip plate could freeze on the D6 click.

---

## 11. Handoffs

| To | What |
|---|---|
| **Engine owner** (`studio/`) | `gen.py` with provenance and archiving; the automated gate script; optional segmentation masks; later, zoom and parallax compensation in `pixelize.py` |
| **Intro owner** | IN-1 and IN-4 ride the per-episode renders. IN-2 and IN-3 wait for a v2.2 pass of f120–479 |
| **Ep1 writer** | Add `GEN:` lines under the six Ep1 shots in [§3](#3-top-10-the-intro-and-ep1-the-pilot-batch). No text changes |
| **Eps 2–12 writers** | Mark slots while drafting, inside the placement rule ([§4](#4-season-patterns)) |
| **Guardrails owner** | Add the NO-GO zones and the per-insert gate to the pre-lock checklist |
| **Audio and casting** | Casting in the ask-1 order; sessions M1–M6; the foley day. Verify YLLIT's song (Ep7 #21) is original |
| **Production-estimates owner** | Re-price §7's video-gen row from [§7](#7-costs) here: it is no longer "backgrounds only," and deepfake parodies are out |
| **INDEX owner** | Link `show/production/` (this plan, the register, the queue) from `show/INDEX.md`. It was left untouched this pass because other agents were editing it |

---

## 12. Key sources

**Pricing and models**
- Runway API pricing and models: https://docs.dev.runwayml.com/guides/pricing/ · https://docs.dev.runwayml.com/guides/models/
- Gemini API pricing and Veo: https://ai.google.dev/gemini-api/docs/pricing · https://ai.google.dev/gemini-api/docs/veo
- The Sora shutdown banner: https://developers.openai.com/api/docs/guides/video-generation
- fal pricing and Kling 3.0: https://fal.ai/pricing · https://fal.ai/models/fal-ai/kling-video/v3/standard/image-to-video
- Luma terms (the watermark clause): https://lumalabs.ai/legal/tos
- Wan2.2: https://github.com/Wan-Video/Wan2.2
- RunPod pricing: https://www.runpod.io/pricing

**Use policies and audio**
- ElevenLabs pricing and use policy: https://elevenlabs.io/pricing/api · https://elevenlabs.io/use-policy
- ElevenLabs Voice Design and Music: https://elevenlabs.io/docs/api-reference/text-to-voice/design · https://elevenlabs.io/docs/overview/capabilities/music
- Stable Audio 3 small-sfx: https://huggingface.co/stabilityai/stable-audio-3-small-sfx
- ACE-Step 1.5: https://github.com/ace-step/ACE-Step-1.5
- Qwen3-TTS VoiceDesign: https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign
- Retro Diffusion: https://github.com/Retro-Diffusion/api-examples

**Project**
- [genai-candidates.md](genai-candidates.md)
- [studio/tools/genvideo/README.md](../../studio/tools/genvideo/README.md), with results in `out/genvideo/tests/results.json` and the `*-sheet.png` files
- [PIXEL_GUIDE](../../studio/PIXEL_GUIDE.md)
- [style-status](../bible/style-status.md)
- [guardrails](../bible/guardrails.md)
- [CASTING](../../audio/voices/CASTING.md)
- [OST-BIBLE](../../audio/ost/OST-BIBLE.md)
- [intro SCRIPT v2.1](../intro/SCRIPT.md)
- [Ep1 script](../episodes/ep01/script.md)
