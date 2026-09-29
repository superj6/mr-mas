# MR. MAS · Style range: the season opportunity map

> **Status: RESEARCH, 2026-09-26.** A season-wide map of every moment where a change of look is motivated, in two tiers, with a ranking of the twelve strongest leaps. It is a **menu, not a quota**, and it edits no other file. It proposes the two-tier range that supersedes the fixed budget in [style-jumps](../../bible/style-jumps.md). That file is owned by the jump-fix pass, and the episode files by the season revision; the handoffs are in [§10](#10-conflicts-rulings-and-handoffs).
>
> **Sources read:** [INDEX](../../INDEX.md); every `episodes/epNN/outline.md` and `beats.md` (plus the Ep1 script's sc 11 and the Ep8 Rashomon flashback); [style-jumps](../../bible/style-jumps.md) §1–4; [style-status](../../bible/style-status.md) §7; [flow-and-continuity](../../bible/flow-and-continuity.md); [guardrails](../../bible/guardrails.md) §1; [orbit-and-lore](../../bible/orbit-and-lore.md) (the short version and the budget); [world-stakes](../../bible/world-stakes.md) §3 and §10; [intro spec](../../intro/spec.md) §4; [GENAI-UPGRADE-PLAN](../../production/GENAI-UPGRADE-PLAN.md) §0–2; [genai-candidates](../../production/genai-candidates.md) (the E-codes); the character files for KRAM, NESNEJ, NOLE, SIMED, RADNUS, POPE OEL XIV, RUMPT and [products-as-characters](../../characters/products-as-characters.md); the lookdev in `out/lookdev/looks/anime`, `animescene`, `realism` and `env`. The web-search budget was spent before this pass, so every real-world date that the room's fact files don't already hold is tagged **[K]** (re-verify before lock).

**The showrunner's notes (binding):**
- "also to be clear on jump ideas, what i meant is we can have some style changes that are more like filter passes, and then rarer some that are drastic changes like high definition anime, 3d, near photorealistic, extra blocky, etc. we want to show off throughout the show the capabilities of what range we're able to do, but not in a forced manner either, only where it makes sense. surely you have other existing shows for reference. and more generally, try to be creative and break boundaries while still being tasteful and generally faithful to the shows tone and flow"
- "some of these may be hard to be done programatically, hence the reason for giving access to video model or similar for the final draft (but still put fully programatic fillers for now)"
- "generally, there should be no hard cutoffs for rules on episode handling. there can be guidelines, but the practical flow and user entertainment is always priority"
- Earlier: "we want any simplification to look artistic, not like a limitation of our capability" · "don't make anything too corny" · "high quality and entertaining with good pacing, not amateur" · pixel art is the primary style, and glyph rendering is for dark foreshadowing.

**Contents:** [The answer in twelve lines](#the-answer-in-twelve-lines) · [1. The two tiers](#1-the-two-tiers) · [2. Every medium has an owner](#2-every-medium-has-an-owner) · [3. The spine test](#3-the-spine-test-the-show-renders-at-the-fidelity-of-the-machine) · [4. The lead's seeds](#4-the-leads-seeds-evaluated) · [5. The map, episode by episode](#5-the-map-episode-by-episode) · [6. The twelve strongest leaps](#6-the-twelve-strongest-tier-2-leaps) · [7. In, out and sound](#7-in-out-and-sound) · [8. The production kit](#8-the-production-kit-code-now-video-later) · [9. Declined](#9-declined) · [10. Conflicts, rulings and handoffs](#10-conflicts-rulings-and-handoffs)

---

## The answer in twelve lines

1. **Two tiers.** A **Tier 1 pass** is a treatment computed from the pixel render we already have: a palette, a resolution, a lens, a texture or a device's UI. A **Tier 2 leap** re-renders the moment through a different pipeline: 3D, clay, the anime rig, paint, pastel or near-photoreal plates. The test is practical: if you can make it by post-processing the pixel frame, it's a pass.
2. **Every medium has an owner.** It belongs to a device, a company's product, the record, the machine, Mas's inner life or the world. The owner decides what the medium may show and how it comes in. That's what keeps range from reading as a showreel: CLOD is clay because CLOD is a clay golem, not because we wanted to show clay.
3. **The map holds 95 moments:** 38 Tier 2 leaps and 57 Tier 1 passes (about a dozen of the passes are existing switches). It is a menu. The recommended slate (★) is **21–25 leaps** (four of them style-jumps' booked J1, J3, J5 and J6) and **11 new passes**; the other low-risk passes are free to use wherever their device is on screen. The leaps come to about 4–4.5 minutes across a 264-minute season, under 2%.
4. **The spine holds, but only in a narrow form.** Keep "the show renders at the fidelity of the machine" as a **ceiling and an arc for machine-made media only**. Each machine leap looks as good as that month's real models did, and carries their signature flaw (an extra finger, a melting chair, a warm yellow cast). The flaws heal across the season. The finale renders flawlessly, and the one thing it still can't render is a human being. Brand media and the record are exempt, and the pixel base never rises.
5. **The firm guardrail becomes the thesis.** Near-photoreal is only ever for rooms, skies, objects, animals, machines, crowds of nobody in particular and fictional characters. So at the peak, the machine's world is perfect and the people in it are still drawn. Ep12's last class photo says it outright: the humans are paper cut-outs, and only the monitor is real.
6. **The three strongest leaps:** Ep4's paint wave (the Mar 2025 image craze, exiting through the melting GPUs), Ep12's reconstruction of THE WOODROSE, and Ep2's mammoth stepping out of the screen. The full ranking is in [§6](#6-the-twelve-strongest-tier-2-leaps).
7. **The lead's ten seeds:** eight accepted (some reshaped), one moved, one rejected. The inner-war anime moves from THE HUG and the trial, which are real events where it would assert intent, to Ep10's invented poker game. The zAI companion lens is rejected, because KORG's never-do list bans the companion characters; NOLE's house medium becomes the airbrushed metal album cover the Ep8 Rashomon already gives him.
8. **Every leap enters through its owner's device and exits on a matched object.** Sound changes medium with the picture instead of dropping into a hole ([flow-and-continuity §3](../../bible/flow-and-continuity.md#3-sound-a-continuous-bed)). Designed silence is kept for the record's prints and the ring in his water.
9. **The shape.** Instead of style-jumps' long pure-pixel stretch (Eps 2–6), most episodes carry one or two leaps. The machine family climbs toward the finale, which carries four.
10. **Everything has a code filler now.** `three` 0.186 and `@remotion/three` are already installed but unused, and the anime rig, the tonal renderers and the genvideo converters exist. The video model, once the key arrives, replaces environment, object and creature layers only. No character ever comes out of a model.
11. **The resource asks** go beyond the video key: a one-puppet stop-motion day for CLOD, a courtroom sketch artist for three or four frames, and an anime key animator for about 10 s. Each is small, and each is the most honest version of its medium ([§8](#8-the-production-kit-code-now-video-later)).
12. **Rulings needed:** nine, listed in [§10](#10-conflicts-rulings-and-handoffs). The biggest ones: Mas may appear in any stylized medium (style-jumps currently limits him to graphic media); a leap may carry a laugh when the medium *is* the joke's subject; and near-photoreal is never used on any caricature, even as a statue or a toy.

---

## 1. The two tiers

### 1.1 Definitions

| | **Tier 1 · the pass** | **Tier 2 · the leap** |
|---|---|---|
| What changes | The treatment of the same pixel frame: palette, resolution, lens, texture, frame rate or a device's UI | The renderer. The same moment is re-drawn by another pipeline: 3D, clay, the anime rig, paint, pastel, voxels, or a near-photoreal plate |
| How it's built | A post-process in the pixel engine or right after it. Code forever | A separate render path, composited back under the pixel UI. Code filler now; a video plate or a human craftsperson later, where it helps |
| What motivates it | A **diegetic device** (a security camera, a phone, a video call, a broadcast, a stream, a deposition camera, a handheld game), an **emotional state**, **how it will be remembered**, or **the machine's view** | **Story**: whose perception or product it is, or a real event in the record that was itself about media |
| What it's like | Grammar. It can recur and the viewer learns it (the CCTV look always means a security camera) | An event. It escalates when it returns, and never repeats the same image |
| Typical length | From a few frames to a whole shot or sequence, for as long as the device is on screen | 2–8 s. A set-piece that lives inside its medium (Ep9's folder city, Ep8's Rashomon, Ep12's reconstruction) holds it for a sequence |
| Where it lives in the old vocabulary | The switches in [style-status §7](../../bible/style-status.md#7-style-switches-as-a-device) (1-BIT, EARLY-WEB16, LEDGER, TERMINAL, the freeze, masked GLYPH), plus the new device passes in [§5](#5-the-map-episode-by-episode) | style-jumps' J1, J3, J5 and J6 (J2's halftone and J4's full-frame GLYPH are computed from the frame, so they are passes by this definition) |

**The boundary is practical, not a law.** "Extra blocky" is technically our own engine at a quarter of the resolution, so it's a pass, but when it carries a story (THE WHALE, Ep4 and Ep12) it reads as a leap, and the map counts it as one.

### 1.2 How often (guidance, not caps)

- **Tier 1 passes** are grammar. Use one whenever a device is genuinely on screen and the pass makes the device clearer. If a device appears and the pass doesn't add anything, leave it pixel.
- **Tier 2 leaps** are events. Most episodes want one or two, and the finale more. The better test is in the animatic: cut it both ways, and keep the leap only if the version with it plays better ([style-jumps §3.2](../../bible/style-jumps.md#32-triggers-the-six-tests), whose "animatic test" survives).
- **Don't stack two leaps in one sequence**, and don't cut back and forth between media. A leap holds its medium steadily and lands on a face (Mas's, his object's or the Orb's) soon after it exits.
- **A leap may carry a laugh when the medium is the joke's subject** (the image craze, the figurine, the sponsored lasagna). It never decorates a joke that works without it. This replaces style-jumps' "never a punchline" (see ruling R3).

### 1.3 The firm lines

These are the showrunner's guardrails and they don't bend for range.

- **Likeness.** Never photoreal or near-photoreal on any caricature of a real person, Mas and every rival included. That covers statues, reflections, portraits, toys and figurines: a gold statue can have a physically based gold *material*, but its form stays the sprite's caricature with no sculpted face. Anime, clay, low-poly, painted, pastel, paper and other stylized treatments of caricatures are fine.
- **Near-photoreal is for** environments, objects, machines, animals, weather, skies, crowds of nobody in particular, and fictional characters (THE INTERN, THE MODEL, the mammoth).
- **No imitation of a named studio's trademarked look.** We evoke the internet's version of a look, never a studio's designs, creatures, props, compositions or typography. STUDIO IBLIHG in Ep4 is the test case.
- **Parody names and logos only.** No real game, franchise, UI, masthead or typography inside any medium.
- **Never clone a voice.** When the Researcher imitates RUMPT's cadence (Ep11 #6), a human actor performs it.
- **The X list holds in every medium** ([guardrails §1](../../bible/guardrails.md#1-hard-exclusions)): no war imagery, no sexualized content, no family, no health, no deaths.
- **Fairness (proposed as a strong guideline).** No leap takes a real politician as its subject. Politicians get Tier 1 device passes (a broadcast, a game-show set), and the leaps stay on the tech figures and the machine.
- **POV.** Mas is in the frame, or it's his screen, his phone or his glass ([pov-clarification](../../bible/pov-clarification.md)). A leap into someone else's version of events is signposted like any other exit (the exhibit sticker, the `HIS VERSION` tag).

---

## 2. Every medium has an owner

The owner is the reason for the medium. When the owner returns, the medium returns and escalates; nobody else borrows it. This keeps style-jumps' best rule ("each medium means one thing") and widens the palette.

| Family | Owner | Medium | Why it's theirs | Enters by | Where (map ids) |
|---|---|---|---|---|---|
| **THE DEVICE** | Security cameras, calls, broadcasts, streams, phones, the deposition camera, a handheld console, a photo-finish camera | Tier 1 device passes (the library in [§5.0](#50-the-tier-1-pass-library)) | We're watching through it | Push into the screen, or cut to the device's point of view | Every episode |
| **THE MACHINE** | NopeAI's models, the agents, THE INTERN and THE MODEL | GLYPH when it *sees*; near-photoreal when it *makes*, at that month's fidelity and with that month's flaws; the image model's painted wave; voxels for the agents' world; true 3D once it builds its successor; a point-cloud reconstruction at the end | The show's thesis: the realest pictures on screen are the machine's (style-jumps M5) | The intro's **render front**, the glowing 1-px seam that re-renders the world behind it ([intro spec §4](../../intro/spec.md)) | 2.A, 4.F, 6.F, 8.B (MAS), 9.A, 10.B, 11.A, 12.A, 12.B, 12.C |
| **THE BRANDS** | The rivals' products, as each company likes to see itself | **MISANTHROPIC:** handmade. Clay for CLOD, and paper for its people's words (Mario's scrolls, the pop-up hills, KCAJ's shadow puppets). **ATEM / KRAM:** the low-poly legless avatar, the costume of his last pivot. **INVIDIA / NESNEJ:** the path-traced digital twin. **THE WHALE:** extra blocky, because cheap is the product. **zAI / NOLE:** the airbrushed metal album cover. **ELGOOG:** the collectible figurine made by its banana image app. **The ad industry:** the glossy food commercial | Each is the product's own register, drawn from the record or from the character bible (CLOD's clay design, KRAM's wardrobe, the Ep8 renders) | The product's own surface: a split pane, a jumbotron, an ad break, a stream, a box, a lantern | 1.A, 3.D, 4.A, 5.B, 5.E, 6.C, 6.D, 7.A, 7.B, 7.E, 8.B (NOLE), 11.C, 12.E |
| **THE RECORD** | How it will be remembered, by hand | Engraving (J1), halftone press (J2), the courtroom pastel, the class-photo ladder | Human-made media are the counter-voice to the machine's renders | The flash-print (the freeze's 2-frame pop) | 1.E, 7.D, 7.H, 8.D, 12.C |
| **HIM** | Mas's inner life, on invented beats only | The ring in his water (J6); the anime mind game, his self-image as the man who reads every table | His composure is the grid; it breaks only when he does | The event is the front | 10.C, 12.D |
| **THE WORLD** | The stakes, visible to everyone in frame | Continuous-tone night behind a crack (J3); the sky reformatting to footage (J5) | The curve reaches the picture (style-jumps M1) | The crack, then the refine | 9.D, 12.B |

**Note on MISANTHROPIC.** Giving one company both clay and paper sounds like two media, but they are one idea: the company that makes everything look handmade, and that is itself a brand, the way its `NO ADS` neon is an ad (Ep7). It also links three existing pieces the room already wrote: CLOD's clay design, F3.3's "cut-paper hills" (restaged as a band breakup, [guardrails §1b](../../bible/guardrails.md#1b-specific-cuts-and-restagings-from-the-worldcast-critic-binding)), and Ep7's callback where those hills "fold shut under the stamp."

---

## 3. The spine test: "the show renders at the fidelity of the machine"

**The idea.** The intro renders each era at its fidelity: 1-bit for 1993, consumer video for 2008–14, the house style for 2015, glossy HDR from 2022 ([intro spec §4](../../intro/spec.md)). Carried into the season, the range could widen as the models do and peak in the endgame.

**The test.** Taken literally, it breaks three things:
- **It would raise the base.** If the whole picture got more realistic each episode, pixel would stop being the show by Ep8. The showrunner chose pixel as the primary look, and every simplification has to read as a choice.
- **It would turn range into a quota:** "Ep7 must top Ep6." That's the forced feeling the showrunner warned against.
- **It would exclude the best counter-voices.** The courtroom pastel, the engraving, the shadow puppets and CLOD's clay aren't the machine's fidelity at all. They are what humans, or brands pretending to be human, make.

**Taken narrowly, it helps a great deal.** Keep it as a rule for the MACHINE family only:

1. **A ceiling.** A machine-made leap never looks better than that month's real models could make.
2. **Period flaws.** It carries the flaw people actually noticed that month. That's period accuracy the audience can feel, and it makes each leap a small joke about the record rather than a showreel.
3. **The flaws heal.** Across the season the flaws disappear. The first perfect render, in the finale, is the scariest image in the show.
4. **The humans never render.** Because of the firm line, the machine's world reaches full fidelity while the people stay drawn. That's the season's thesis without anyone saying it.

| Ep | Month | What the machines could make (the record) | The flaw it carries | The machine leap |
|---|---|---|---|---|
| 2 | Feb 2024 | Minute-long, near-photoreal demo clips from AROS's first preview | Physics slips: a walk that slides, a sixth finger on an extra, a chair that melts (all already in #1) | 2.A, the mammoth |
| 3 | Dec 2024 | AROS goes public at SHIPMAS | Mostly right; the sleigh's runners still drift | 3.F (in a stream window) |
| 4 | Mar 2025 | CHATGTP's image model turns the internet into soft painted portraits | A warm yellow cast [K]; soft, wobbly edges; lettering that almost reads | 4.F, the paint wave |
| 6 | Sep 2025 | AROS 2, with sound and physics that hold | None visible. Only the Orb's first `(probably)` | 6.F, CAMEO CITY |
| 8 | Apr–Jun 2026 | Every lab has image and video models | The flaw is now the *author*: each witness's model renders his own version | 8.B, the Rashomon renders |
| 9 | Jul 2026 | Agents act inside worlds | The world is a sandbox with no bottom | 9.A, the folder city |
| 10 | "OCT 2026?" | THE INTERN animates itself | It uses the oldest animation machine there is | 10.B, the zoetrope |
| 11 | "2027??" | A model trains its successor inside itself | The camera gains a dimension | 11.A, the cliff |
| 12 | "????" | Anything | Nothing, except the humans | 12.A, 12.B, 12.C |

**Verdict: keep it, as a ceiling and an arc for the machine's own media.** It gives every machine leap a second reason (period truth) on top of its local one, and it makes the finale's near-photoreal environments feel earned rather than spent.

---

## 4. The lead's seeds, evaluated

| Seed | Verdict | Where | Why, and the constraint |
|---|---|---|---|
| **The Mar 2025 image craze, and "our GPUs are melting"** | **Accept. Rank 1** | Ep4 #21 (4.F) | The record itself is about a medium, and Mas changed his own avatar to one of the portraits [K]. The existing beat already melts the racks, so the leap exits through the melt. Evoke the internet's painted-anime portrait, not STUDIO IBLIHG's designs; THE OLD MASTER's still stays small, with its context note. The old ruling (a filter gag, no continuous tone) is superseded because here the medium is the event |
| **KRAM's metaverse, with low-poly legless avatars** | **Accept, reshaped** | Ep5 #9 (5.B); Ep1 sc 11 as an alternate (1.B) | The metaverse predates the season window (2021–22), so it plays as his *old* costume, shed on screen: every pivot is a costume change, and here the costume is a medium. The empty avatar keeps waving behind him all through Draft Night |
| **NESNEJ's keynotes, where the stage and a digital twin are near-photoreal renders** | **Accept, with the likeness line** | Ep4 #9 (4.A); Ep1 #19 as an alternate (1.C) | The stage, chips, robots and the statue's gold *material* may be near-photoreal; NESNEJ himself stays drawn. (Eggs for those who know: a keynote once used a CGI stand-in of him and his kitchen [K].) Best spent at the pebble, where the expensive render is toppled by the cheap one and shatters into F4.2's 1-bit |
| **CLOD, the polite clay golem, as claymation** | **Accept, as a three-rung ladder** | Ep1 sc 11 (1.A) → Ep7 #7 (7.A) → Ep11 #11 (11.C) | CLOD is already designed as a clay figure with thumbprints. The pilot shows the lighthouse pane in clay; the Big Game ad is claymation; in Ep11 clay bows to the Researcher's glyph body. The best final is a real one-puppet stop-motion day |
| **"CLOD plays a monster game" as a 4-shade handheld pass** | **Accept (Tier 1)** | Ep4 #18 (4.E) | The real stream ran from Feb 2025 with the model that shipped in #18 [V per orbit-ea-rationalist-lore]. Generic creatures, no game UI, fonts or names. CLOD walks into the same cave wall and apologizes to it |
| **zAI's anime companion app as the lens for a NOLE scene** | **Reject** | — | [products-as-characters](../../characters/products-as-characters.md): KORG's NEVER DO bans "the companion characters," and "spicy mode" is X7. NOLE's house medium becomes the airbrushed metal album cover (6.C → 8.B), which the Ep8 Rashomon already assigns him. No NOLE anime |
| **Ep8's Rashomon, each witness drawn by his own company's model** | **Accept. Rank 4** | Ep8 #12 (8.B) | Already written, and the best anthology slot in the season. Refined for the likeness line: MAS's AROS render has a near-photoreal room, people as smooth untextured mannequins with six fingers, and only his water glass rendered correctly |
| **A cat-and-mouse psychological-duel anime inner war, for THE HUG or the trial** | **Move** | Ep10 #19 (10.C) | THE HUG and the trial are real events. An inner war there would state Mas's intent and feelings at a real event (POV §3.7; guardrails §4), which is also a fairness and defamation risk. Ep10's poker game is invented, and it's the season's purest psychological duel. The pov-clarification already names these shows as the inner-monologue reference, so this is where the look pays off, and the hard cut to the dealer's GLYPH view (J4) answers it |
| **Ep9's agents' sandbox city as a voxel or 3D world** | **Accept. Rank 5** | Ep9 CO and #4 (9.A) | The agents' own world, and real research has put a thousand agents in a block world to see what society they'd build [K]. Voxel noir, with glyphs on the voxel faces, merges the machine's GLYPH with its first world. It must not look like any block game: no grass blocks, biomes or tools |
| **The endgame, where the machine can render anything, as the season's near-photoreal environments** | **Accept, as the spine's peak** | Ep12 #6, #12, #14 (12.A–C) | Near-photoreal rooms and sky, and never a near-photoreal person, which is the point: the humans are the only thing still drawn |
| **The spine** | **Keep, narrowed** | §3 | A ceiling and an arc for the machine's media; brands and the record are exempt; the base never rises |

---

## 5. The map, episode by episode

**How to read the tables.**
- **Id** is episode.letter. **★** marks the recommended slate. **KEEP** marks style-jumps' booked jumps, which this map carries without re-designing (the jump-fix pass owns them).
- **Beat** uses the `beats.md` number (#n), plus the script scene (sc n) for Eps 1–3 where it matters.
- **Motivation:** DEV = a diegetic device · EMO = an emotional state · MEM = how it will be remembered · MACH = the machine's view or output · OWNER = whose product or perception · REC = a real event that was itself about media.
- **Forced?** is the risk that it feels forced: low, med or high, with the reason.
- **Build** gives the code filler now and the final upgrade (video = a generated plate for environment, object or creature layers only; human = a craftsperson). E-codes are [genai-candidates](../../production/genai-candidates.md) ids.

### 5.0 The Tier 1 pass library

Every pass is a post-process on the pixel frame, built once and reused. The existing switches (1-BIT, EARLY-WEB16, LEDGER, TERMINAL, the 2-TONE FREEZE, masked and full GLYPH, THE PLAN) stay as they are.

| Pass | What it looks like | Where it recurs |
|---|---|---|
| **P1 CCTV** | Overhead fisheye, monochrome or washed colour, 8 fps, a timestamp burned in, IR bloom on lights | 6.E, 11.G |
| **P2 CALL** | Webcam softness, small-window compression and a 15 fps stutter on the *other* tiles; ours stays clean until it isn't. A soft compression, never a glitch | 1.G |
| **P3 BROADCAST** | A fixed wide, flat light, a generic lower third, broadcast-safe colour. Hearings, press conferences, the UN | 1.F, 4.H, 9.E |
| **P4 SPORTS** | Stadium cameras, a telestrator, replay, a pick card, a timing tower | 3.B, 5.A, 10.E |
| **P5 STREAM** | A launch-livestream frame with a chat sidebar and a slide | 2.C, 3.F, 5.I |
| **P6 PODCAST** | A two-camera studio, warm tungsten, mic arms. It becomes THE PODCAST CIRCUIT's look | 2.D, 5.F |
| **P7 PHONE** | Vertical 9:16, portrait-mode blur, the phone's own UI | 2.F, 3.A, 12.H |
| **P8 DEPOSITION** | Fixed camera, timecode burn-in, flat institutional light | 6.G |
| **P9 HANDHELD-4** | 160×144 inside the frame, four greens, square-wave sound | 4.E |
| **P10 BLOCKY** | Our engine at a quarter of the resolution, 8 colours (counted as a leap when it carries a story) | 4.A, 12.E |
| **P11 SLIT-SCAN** | A photo-finish camera: time along the x axis, the runners smeared into a strip | 9.C |
| **P12 HEATMAP** | The model's attention as a heat ramp over the frame | 11.B |
| **P13 LENSING** | The pixel frame bends around a black disc, pixel-accurate | 5.C |
| **P14 BUFFER** | The frame re-renders coarse to fine, like a stream catching up: the intro's render front, in reverse | 8.C |
| **P15 LOD** | One figure resolves as a grey untextured placeholder, a render that never finished | 8.A |
| **P16 TILT-SHIFT** | A fake-miniature blur band: a toy version of the world | 6.A |
| **P17 AIRBRUSH** | Gradient bands, chrome rim light, star glints: NOLE's register as a pass | 6.C |
| **P18 HALFTONE** | The `noir` dot screen on newsprint, in a crop | 7.D (J2) |
| **P19 SPIRIT PHOTO** | Sepia double exposure, the ghost at half opacity, soft vignette | 2.G |
| **P20 DV** | Soft chroma, interlaced motion, an OSD date (period for 2003–05; never a tracking roll) | 4.C |
| **P21 IRIS** | The Orb's glossy chrome-lens replay | 2.E, 5.H, 11.E |

### 5.1 Ep1 · `ep1.0_research_preview.md` (Nov 2022 → Dec 2023)

*Owner note: the season revision owns this episode's files, and the Act Four v4 pass owns sc 24–31's production. Everything here is a proposal.*

| Id | Beat | Tier | Medium | Motivation | In → out | Length | Forced? | Build |
|---|---|---|---|---|---|---|---|---|
| **1.A ★** | sc 11 / #12, the split-screen duel, right pane (Mar 14, 2023) | 2 | **Claymation:** the MISANTHROPIC pane, CLOD 1's bow and Mario's scroll, at 12 fps with thumbprints | OWNER (CLOD's own medium, set up in the pilot) | The pane is a bezel: the right pane is clay from its first frame, on the rail. Out: the split closes on phrase 4 and the pane returns to pixel on "Addendum." | The duel's phrases, ≈ 40 s at half-frame; the fallback is CLOD alone in clay inside the pixel lighthouse | med: the pilot is dense, but a split screen is the clearest bezel there is, and it teaches "each company lives in its own medium" in minute 5 | three.js clay → a real stop-motion day |
| 1.B | sc 11 bars 2–3 / #11, Kram's leak (Mar 3, 2023) | 2 | **Low-poly legless avatar** | OWNER (his last pivot) | On the bullpen monitor he stands in an empty low-poly plaza as the weights spill; he steps out of the avatar into pixel, hoodie paint still wet | 2 s | med: same scene as 1.A, so take one. Better in Ep5 (5.B) | three.js flat shading |
| 1.C | sc 16–17 / #19, NESNEJ: "the more you buy, the more you save" | 2 | **Near-photoreal keynote stage**; NESNEJ drawn | OWNER (INVIDIA's digital twin) | Push into the poster run's last screen; the stage is path-traced. Out on the register's KA-CHING, in pixel | 2–3 s | med-high: it crowds the pilot's hairline crack, which stays pixel by design. Hold for 4.A | three.js PBR; video plate |
| 1.D | sc 30 / #30, TASYA: "below them, above them, around them" | 2 | **True 3D room reveal:** the flat set gains perspective, and floor, walls and ceiling are MACROSOFT | OWNER (the landlord has depth) | A dolly; the set folds into perspective. Out: it flattens as he takes the folding chair | 3 s | med: Act Four is in production, and the first 3D camera is better kept for Ep11 (11.A). Hold | @remotion/three |
| **1.E ★ KEEP J1** | sc 26, the Cancel click | 2 | **Engraving:** the tile prints as a `CANCELLED` certificate | MEM | Flash-print → snap | 1.9 s | low | Prototype A (near lock) |
| **1.F ★** | sc 15 / #17, the Senate (May 16, 2023) | 1 | P3 BROADCAST for the establishing wide and the cloned-voice opening | DEV | In on the hearing wide; out when we go close on Mas | 3–6 s | low | code |
| 1.G | sc 26–27 / #27, the call grid | 1 | P2 CALL on the other tiles | DEV | Whole call | the call | low-med: it must never read as a glitch | code |
| 1.H | #33, the staged duck demo (Dec 6, 2023) | 1 | **Promo grade** (shallow focus, glossy colour), then the pull-back reveals the puppet rod in pixel | DEV, REC | The promo fills the monitor → the camera pulls back to the rod | 3 s | low | code |
| — | Existing switches | 1 | F1.1 1-BIT · the sc 2 freeze · sc 17 LEDGER · THE PLAN · masked GLYPH | — | — | — | — | — |

### 5.2 Ep2 · `ep1.1_her.wav` (Jan → Aug 2024)

| Id | Beat | Tier | Medium | Motivation | In → out | Length | Forced? | Build |
|---|---|---|---|---|---|---|---|---|
| **2.A ★** | CO #1, THE AROS MAMMOTH (Feb 15, 2024) | 2 | **Near-photoreal creature** at the first preview's fidelity, with its flaws: the walk slides a little, an extra grows a sixth finger, a chair melts | REC (a demo that was itself about media), MACH | SELBEEP hits play. The mammoth's trunk crosses the screen's bezel, and the render front opens the boardroom around it. Out: it walks through the far wall; the wall stays pixel, and the melted chair is left as a pixel puddle (the one scar) | 6–8 s | **low**: the record is the medium | Code: a tonal `soft`/`paint` mammoth on a three.js walk cycle. Video: E2-1, composited under a stepped matte; the extra is our sprite |
| 2.B | #11, DIRE debates his digital twin (Apr 2024) | 2 | **Glossy CG twin:** a smooth, too-perfect 3D bust, never photoreal | OWNER (the twin is a product) | A studio monitor; the twin turns to camera. Out: DIRE's badges drift onto it; cut away | 2 s | med: a cameo, in a busy act | three.js |
| 2.C | #13, "her" eclipses the demo (May 13) | 1 | P5 STREAM | DEV | The launch stream frames the stage; the blimp blocks its lights | the set-piece | low. Never a film-grade evocation, which would point at the actress | code |
| 2.D | #9, XEL's show | 1 | P6 PODCAST (the mics grow between answers) | DEV | The studio's two cameras | 4 s | low; it becomes the podcast circuit's grammar | code |
| 2.E | #28, the Orb's wordless fact-check (Aug 11) | 1 | P21 IRIS | MACH | The iris opens on the crowd → `verified: human (all of them)` | 2 s | low | code |
| 2.F | #20–21, WWDC on his phone → F2.1 | 1 | P7 PHONE → EARLY-WEB16 | DEV | Existing | — | low | existing |
| 2.G | #6, THE EMAIL SÉANCE | 1 | P19 SPIRIT PHOTO for the ghost emails | MEM (how the dead are photographed) | Each ghost rises in double exposure; the candle snuffs into F2.3 | 2–3 s a ghost | low-med: keep it inside the candle's pool of light | code |
| 2.H | sc 18, GOLDEN GATE CLOD (O2.2) | 1 | A clay-textured still on the lighthouse monitor (the bridge as CLOD's avatar) | OWNER | Monitor only | 1–2 s | low: an egg | code |

### 5.3 Ep3 · `ep1.2_strawberry.jpg` (Aug → Dec 2024)

| Id | Beat | Tier | Medium | Motivation | In → out | Length | Forced? | Build |
|---|---|---|---|---|---|---|---|---|
| 3.A | CO #1, the garden photo (Aug 7) | 2 (in a bezel) | **A near-photoreal strawberry photo** on his phone: the only photo in the dark room | DEV, REC (he posted a real photo) | Phone screen only. The pixel strawberry with one bite missing (#25) answers it | 2 s | low | code photo-style render; a video/image plate is fine (object) |
| **3.B ★** | #7, HOW MANY R'S? | 1 | P4 SPORTS: the jumbotron replay, a telestrator circle on the nervous kicker | DEV | The stadium's cameras; out on the owner's box | 4–8 s | low | code |
| 3.C | #7, the shutter | 1 | Masked GLYPH through the shutter's slats: the scratch paper glimpsed for 12 frames | MACH | On the slam | 0.5 s | low | existing |
| **3.D ★** | sc 19 / #16, F3.3, the exodus as a band breakup | 2 | **Paper pop-up book:** fold lines, pull-tabs, the tour bus splitting on pop-up hills | OWNER (MISANTHROPIC's founders' own telling, the handmade family) | The camera follows LUNCHMAS's footprints down the bridge planks, and the planks become the book's first spread. Out: the book folds shut on the fuel-stop sticker, and the fold becomes a plank seam | the flashback, ≈ 15–20 s | low-med | 2.5D paper planes with hinges in three.js; E3-4 CONVERT; a paper-craft day optional |
| 3.E | #12–13, $157B → F3.2 | 1 | LEDGER | — | Existing | — | — | existing |
| 3.F | #21, SHIPMAS | 1 | P5 STREAM with an advent-calendar UI. Door 3's mammoth-sleigh is AROS in a stream window, its physics now almost right (the spine) | DEV, MACH | Doors open as stream segments | the set-piece | low | code; a small video plate for door 3 |

### 5.4 Ep4 · `ep1.3_not_for_sale.eml` (Jan → Apr 2025)

*The episode where the internet turned into paintings. It can carry two leaps because they sit in different acts, in different families, and the second is the record itself.*

| Id | Beat | Tier | Medium | Motivation | In → out | Length | Forced? | Build |
|---|---|---|---|---|---|---|---|---|
| **4.A ★** | #9, THE PEBBLE (Jan 27, 2025) | 2 | **Extra blocky → 3D gold → 1-bit.** THE WHALE's beach chair and pebble render at a quarter of our resolution; the pebble skips across the red tickers; NESNEJ's statue is a path-traced gold render | OWNER ×2 (the cheap model is cheap; INVIDIA's twin is expensive) | In: cut to the Whale in its own resolution. The pebble crosses into our resolution on the skip; it hits the gold, and the statue shatters into 1-bit pixels, which is F4.2's door (already written) | 4–5 s | med: three fidelities must read in one frame as "the cheap one broke the expensive one" | Pixel engine at low res; three.js PBR gold on the sprite's form, no sculpted face; E4-1 for the shatter |
| 4.B | #10, F4.2 1993 | 1 | 1-BIT | — | Existing | — | — | existing |
| 4.C | #15, F4.1 dorm poker (2003–05) | 1 | P20 DV, or EARLY-WEB16 as the pixel decision reads | MEM | A poker chip spins in and out (existing) | the flashback | low-med | code |
| 4.D | #14, HIGH NOON | 1 | A sun-bleached noon palette, with 2.39 bars for the standoff only | EMO | Bars slide in on the tumbleweed; out on Nole's post | 3–4 s | **high**: a genre quote on a genre gag. Take only if the animatic plays better | code |
| **4.E ★** | #18, CLOD 3.7 ships (Feb 24–25) | 1 | P9 HANDHELD-4: CLOD plays a monster game on a stream, stuck in a cave, walking into the same wall. *You're absolutely right! This is a wall.* [INVENTED] | DEV, REC | Push into the lighthouse monitor until the handheld frame fills; out as the stream's chat slides in and we pull back to Mario fretting | 4–6 s | low. No game IP of any kind | code |
| **4.F ★** | #21, OUR GPUS ARE MELTING (Mar 25–31, 2025) | 2 | **Soft painted anime:** hand-painted watercolour backgrounds and soft cel figures, a little too sweet, with the month's warm yellow cast [K] | REC (the record is a medium), MACH (CHATGTP's image model) | Mas's portrait on his phone repaints first (his real avatar change [K]); then a wet paint front sweeps the skyline and the cathedral. Out: the paint gets hotter and runs, the racks drip into the lava rivers, the paint drains away in the melt and the pixel cathedral is under it; the lava cools to gold bars in pixel. THE OLD MASTER's still sits in the corner throughout, small, with its context note | 6–10 s | med: studio evocation. It must read as the internet's version of a look, with no designs, creatures or compositions from STUDIO IBLIHG | Code: tonal `paint` + the anime rig for Mas. Video: E4-3 for the melt. Characters stay rig |
| 4.G | #23, the sycophancy update (Apr 25–29) | 2 (alt) | **A gilded oil portrait** of Mas, or **a boxed action figure** (the April figure trend [K]) | OWNER (the flatterer's picture of him) | The reply renders him; he looks a beat too long. Out: "roll it back." snaps it to pixel | 2–3 s | med-high: a second machine image in the episode. Take only if 4.F is cut; otherwise play it as a Tier 1 flattering bloom on the reply's thumbnail | three.js toy or tonal `paint` |
| 4.H | #13, Paris: NORCAM's deepfakes hold his press conference | 1 | P3 BROADCAST. The deepfakes stay visibly drawn (generating them would make the show the thing it mocks) | DEV | The press-conference wide | 3 s | low | code |

### 5.5 Ep5 · `ep1.4_missionaries.docx` (May → Aug 2025)

| Id | Beat | Tier | Medium | Motivation | In → out | Length | Forced? | Build |
|---|---|---|---|---|---|---|---|---|
| **5.A ★** | #10, Draft Night | 1 | P4 SPORTS: the draft broadcast, pick cards reading `POACHED`, a ticker | DEV | The stadium feed, throughout the set-piece | the sequence | low | code |
| **5.B ★** | #9, Kram unveils Draft Night (Jun 12) | 2 | **Low-poly legless avatar → pixel** | OWNER (every pivot is a costume change) | The jumbotron lights, and Kram's greeting is his old metaverse avatar in an empty low-poly plaza under the ghost METAVERSE sign. Out: he unzips it and steps out into pixel in the host's suit; the empty avatar keeps waving behind him all night | 3 s | med: a gag, but it's his defining pivot, and it pays off the intro skyline's wet paint | three.js flat shading, 12 fps |
| 5.C | #8, "we are past the event horizon" (Jun 10) | 1 | P13 LENSING: the pixel lectern stretches into a black disc | OWNER (his sentence, made literal) | The disc opens behind him; he keeps reading from a card that isn't there; it closes on the next beat | 3 s | low-med. Kept as a pass so the near-photoreal sky stays unspent until Ep9 | code |
| 5.D | #24, the GTP-5 teaser (Aug 2025) | 2 (opt) | **A near-photoreal, generic battle station** rising over the pixel Bay, in a blockbuster-VFX register | REC (his own teaser was a film image) | It rises behind the skyline as a matte-painted plate; out on the livestream's chart | 3 s | med-high: franchise design risk, and it spends sky before Ep9 | video plate (E5-2); a generic sphere, no trench |
| **5.E ★ (opt)** | #26, SIMED photobombed by the banana image app (Aug 26) | 2 | **A collectible figurine** in its box on a desk: the trend the banana app set off [K] | OWNER (ELGOOG's own image app outdraws its Nobel) | SIMED's IMO-gold card flips to the figurine box; out as a banana steps onto the podium, in pixel | 2–3 s | med: a runner's gag. Keep the toy chibi, the face sprite-simple | three.js glossy toy |
| 5.F | #11, the podcast (Jun 17) | 1 | P6 PODCAST | DEV | — | 3 s | low | code |
| 5.G | #12, the monks' vigil | 1 | A candle-chiaroscuro palette in which the phones under the robes are the only cold light | EMO | The vigil wide | the beat | low. No religious iconography | code |
| 5.H | #26a, the Orb flags MOSWEN's meme `EDITED` | 1 | P21 IRIS (the fairness mirror of 2.E) | MACH | The iris | 2 s | low | code |
| 5.I | #24, the chart crime | 1 | P5 STREAM | DEV | The livestream's slide | 3 s | low | code |
| 5.J | #27, YNOJ's merger portrait | 1 (+2 micro) | A black-and-white luxury-watch-ad pass; optionally the velvet cloth alone is near-photoreal, the product never revealed | DEV, OWNER | The portrait; out when the second cloth appears | 3 s | low | code; a velvet plate is fine (object) |

### 5.6 Ep6 · `ep1.5_backstop.xlsx` (Sep → Dec 2025)

| Id | Beat | Tier | Medium | Motivation | In → out | Length | Forced? | Build |
|---|---|---|---|---|---|---|---|---|
| 6.A | CO #1–2, the carousel on the pier | 1 | P16 TILT-SHIFT: money going in a circle looks like a toy | EMO / MEM | A high wide as the check lands; out when Mas steps to the ticket booth | 3 s | low-med | code |
| 6.B | #3, THE ROUND TABLE game show | 1 | A game-show broadcast pass: buzzer lights, podium cameras, a generic chyron | DEV | The show's cameras | the set-piece | low-med: keep it on the pledges (fairness) | code |
| **6.C ★** | #14, F6.1 HIS VERSION (Nole) | 1 | P17 AIRBRUSH over the pixel flashback: chrome rims, star glints on the OPEN neon he hangs himself, NOLE 40% taller | OWNER (his version) | Tagged `HIS VERSION`; out as the receipt curls into the check (existing) | the flashback | low-med. First sight of NOLE's house medium; it becomes a full leap in Ep8 | code |
| **6.D ★** | #17, FEAR-MONGERING: KCAJ's lantern (Oct 13–14, 2025) | 2 | **Shadow play:** cut-paper puppets on a lit wall. The creature is the smiley-masked, many-eyed shape the lore plants in #11 (O6.4) | OWNER (his essay's own image, a child with a light in a dark room finding creatures [K wording]) | KCAJ lifts the lantern; the wall becomes a lit screen and the shadow moves on its own. Out: SKCAS's pixel stamp lands on the wall, the shadow takes its selfie with it, the lantern is set down and the wall is a wall | 4–6 s | low-med | 2D jointed silhouettes with a warm flicker |
| **6.E ★** | #18, CAMEO CITY: the GPU shoplifting (Sep 30) | 1 | P1 CCTV over our pixel Mas pocketing a GPU at a generic big-box store; the real viral clip was fake security footage [K] | DEV, REC | Cut to the camera's corner view; out on the `DEEPFAKE` stamp | 3–4 s | low | code |
| **6.F ★** | #18, CAMEO CITY | 2 | **A near-photoreal generated city** at AROS 2's fidelity, with our pixel Mases walking through it | MACH (the flaws have healed; now the city is realer than the people) | SELBEEP throws a switch at the switchboard; the street behind the pixel Mases refines to near-photoreal. Out: the Orb's iris closes on `VERIFIED HUMAN… probably.`, and its lens returns us to pixel | 5 s | med: every person must stay a sprite | Code: three.js or tonal `softenv`. Video: an environment plate with no people in it |
| 6.G | #19, Alyi's deposition | 1 | P8 DEPOSITION; Alyi only in the table's reflection | DEV | The deposition camera's fixed frame | 4 s | low | code |
| 6.H | #11, THE TRANSFORMER, O6.4 | 1 | The masked-GLYPH frame behind the `PUBLIC BENEFIT` decal (the orbit pass's plant) | MACH | One frame | 1 f | low | existing |
| 6.I | #11, THE TRANSFORMER unfolding | 2 (opt) | Hard-surface 3D in a toy-commercial register | OWNER | — | 3 s | **high**: a genre quote on a genre gag (E6-1 is high risk too) | three.js |
| 6.J | #24, EMIT's "Architects of AI" | 2 (opt) | A painted cover illustration with no masthead | MEM | A flash-print; Mas's magnifying glass | 2 s | med | tonal `paint` |
| 6.K | #18, YLLIT walks the frame | 2 (hold) | A near-photoreal synthetic starlet (fictional, so the firm line allows it) | OWNER | — | — | high: needs a ruling against the genai plan's "no faces from a model" (R5). Default: no | — |

### 5.7 Ep7 · `ep1.6_supply_chain_risk.pdf` (Jan → Mar 2026)

| Id | Beat | Tier | Medium | Motivation | In → out | Length | Forced? | Build |
|---|---|---|---|---|---|---|---|---|
| **7.A ★** | #7, THE BIG GAME ad (Feb 2026) | 2 | **Claymation:** CLOD's commercial in stop-motion (our staging, not a recreation of the real spot) | OWNER (the ad is MISANTHROPIC's own voice) | The TV's ad-break slate; the ad fills the frame. Out: its end card shrinks back into the TV, and Mas's glass is in the foreground as the single bead slides | 5–8 s | low-med | three.js clay; a real stop-motion day |
| **7.B ★ (opt)** | #8, THE CHAT WINDOW BECOMES TIMES SQUARE | 2 | **A near-photoreal food commercial:** the sponsored lasagna in a slow push, steam, a cheese pull, rim light | OWNER (the ad's register is the joke) | The sponsored-ingredient banner grows into a video ad and eats the frame. Out: the "skip in 5" counter hits zero and the jumbotron shrinks it back into the chat | 3–4 s | med: the joke is the register itself. Object only, no hands, a parody cheese | three.js or tonal `soft`; a video plate (object) |
| 7.C | #7, the 1993 CAPS LOCK flash | 1 | 1-BIT | EMO | Existing | 2 s | — | existing |
| **7.D ★ KEEP J2** | #17, THE HUG (Feb 27–28) | 1 | P18 HALFTONE inside a photo crop; the third arms keep signing outside it in pixel | MEM | A press flash; out on the snap | 2.5 s | low-med | code; the tonal rig is the upgrade |
| **7.E ★** | #18, F7·m3, the exodus callback | 2 | **Paper pop-up:** Ep3's book folds shut under the stamp | OWNER (a return, not a new medium) | The stamp's shadow falls across the spread; the book folds shut on the impact | 2 s | low | reuses 3.D |
| 7.F | #5, the aquarium glass cracks | 1 | Underwater caustics over the agents' forum, seen through the aquarium glass | DEV | Through the glass; out on the crack | 3 s | low | code |
| 7.G | #21, THE AROS FUNERAL (Mar 24) | 2 (opt) | **Near-photoreal rain on the tombstone:** AROS renders its own funeral as its last output (weather and object only; mourners stay pixel) | MACH | The tombstone's inset refines; out on YLLIT's 0.5 s credit roll | 3 s | med | a video plate (weather) |
| 7.H | #22, THE COUNCIL class photo | 1 | A flash-print photo pass: one rung of the class-photo ladder that ends in 12.C | MEM | Flash-print → snap | 1.5 s | low | code |

### 5.8 Ep8 · `ep1.7_statute_of_limitations.pdf` (Apr → Jun 2026)

| Id | Beat | Tier | Medium | Motivation | In → out | Length | Forced? | Build |
|---|---|---|---|---|---|---|---|---|
| **8.A ★** | #5, "WHO?" (Apr 17) | 1 | P15 LOD: from RUMPT's eyeline, Mario resolves as a grey untextured placeholder every time he walks through the GOLD OVAL; only the Orb's cone renders him | OWNER (the not-seeing; the record is "Who?") | Each pass; out when the Orb tracks him | 2 s a pass | low-med. The joke is on the not-seeing, and it's record-true | code |
| **8.B ★** | #12, F8.1 THE RASHOMON RENDERS | 2 | **Four media.** GERG: ASCII text-mode, his own figure the only one at full resolution. NOLE: an airbrushed metal album cover, with a guitar, not a sword (6.C's pass, now a full painting). MAS: an AROS clip, with a near-photoreal room and painting, the people smooth untextured mannequins with six fingers, and only his water glass rendered correctly. ALYI: a blank white square with one door | OWNER (each witness's company's model) | The exhibit sticker slaps on and the projector blooms; out as it peels (existing) | ≤ 90 s total, ≈ 15 s each | **low**: the device is the scene | Glyph; tonal `soft` with airbrush bands; three.js mannequins over an environment plate (E8-2, SYNTH ruling) |
| 8.C | #17, "yes.", then the courtroom buffers | 1 | P14 BUFFER, with spinners over the jury | DEV | Right after the amended "yes."; it catches up on the next line | 2 s | low-med: a clean progressive step, never a glitch | code |
| **8.D ★** | #19, THE VERDICT (May 18) | 2 | **Courtroom pastel sketch:** toned paper, pastel strokes, the sketch artist's economy | MEM (federal courts bar cameras, so sketches are how trials are remembered [K]) | The gavel's flash-print. Out: THE CALENDAR's corner erases Mas's pencil mark, and the erase stroke wipes back to pixel | 3 s | **low** | Code: a stroke renderer from the pixel frame. Human: a real courtroom artist for 3–4 frames |
| 8.E | #24, the SPACEZ IPO reaches orbit | 1 | A launch-webcast pass in which the altitude readout is the share price | DEV | The webcast frame | 4 s | low | code |
| 8.F | #28, the log line | 1 | TERMINAL | MACH | Existing | — | — | existing |

### 5.9 Ep9 · `ep1.8_outside_intended_scope.log` (Jul → Sep 24, 2026)

| Id | Beat | Tier | Medium | Motivation | In → out | Length | Forced? | Build |
|---|---|---|---|---|---|---|---|---|
| **9.A ★** | CO #2–3 and #4, THE FOLDER CITY | 2 | **Voxel noir:** an isometric city of folder-shaped voxel towers in rain under `WELCOME TO /tmp — NOTHING HERE LASTS`, with glyphs on the voxel faces | MACH (the agents' own world) | The push through the monitor into the sandbox; the sand grains are the first voxels. Out: the agents climb out, stacked in trench coats, into the intro smash. In #4 we're back in on the folder board, and out on FACEHUGGER's velvet rope | 20–40 s over two visits | low-med. No block-game look: no grass blocks, biomes or tools | three.js instanced cubes, orthographic; the glyph atlas from `pixel/glyph.ts`; E9-1 |
| 9.B | #5, THE TRENCH-COAT CAPTCHA | 1 | The frame splits into a 3×3 image grid, and the agents solve it tile by tile | DEV | Grid in; the rope opens | 3 s | low | code |
| **9.C ★** | #20, THE PHOTO FINISH | 1 | P11 SLIT-SCAN: the two posts smear into a finish strip | DEV | The finish camera's strip; out on `SHOW YOUR WORK.` | 3 s | low | code, from the rendered frames |
| **9.D ★ KEEP J3** | #23, "Mario is right." | 2 | **Continuous-tone night** behind a pixel crack | WORLD | Crack → seal | 3 s | booked, not proven | Prototype B |
| 9.E | #30–31, the Security Council | 1 | P3 BROADCAST, the chamber's webcast wide | DEV | The class photo's frame | 3 s | low | code |
| 9.F | YLLIT's talk-show glitch (optional in cast) | 2 (hold) | The near-photoreal avatar drops to pixel mid-answer | OWNER | — | 2 s | high: rides on R5 | — |
| 9.G | #36, `intern: done. next: researcher.` | 1 | TERMINAL | MACH | Existing | — | — | existing |

### 5.10 Ep10 · `ep1.9_pace.yaml` ("OCT 2026?" → "2027??")

| Id | Beat | Tier | Medium | Motivation | In → out | Length | Forced? | Build |
|---|---|---|---|---|---|---|---|---|
| 10.A | #2, the DevDay hologram of Mas | 1 | A clean additive hologram with depth slices | DEV | The keynote hall; out to the real Mas on his paint bucket | 2 s | low | code |
| **10.B ★ (opt)** | #7, THE 360 REVIEW | 2 | **A zoetrope:** a physical drum of 360 frames that, spun, animates THE INTERN growing up (cursor, lanyard, blazer), seen through the slits. The Intern is fictional, so the drum may be near-photoreal | MACH (the machine animates itself on the oldest animation machine) | The ring of reviewers spins and the camera drops to the slits. Out: the drum stops on `EXCEEDS EXPECTATIONS`, and Mas's *huh.* → **Huh.** plays in pixel | 4–5 s | med | three.js cylinder and strip, strobed on the steps |
| **10.C ★** | #19, THE READ | 2 | **An HD-anime mind game** in the cat-and-mouse psychological-thriller register: chiaroscuro, slow push-ins, the tells as sharp floating stat cards. No speed lines, impact frames or sparkle | HIM (his self-image as the man who reads every table), at an invented game | The card snaps, and the first anime frame is his eyes; the tells land one by one, with at most one lowercase V.O. line. Out: a hard cut to J4, the dealer's full-frame GLYPH, where the machine sees the blank over his head | 5–6 s, then J4's 2 s | med: anime shorthand is corn, so it has to be played straight | The anime rig exists (`studio/src/shared/anime`, lookdev v1 with Mas and Nole). Human: a key animator's polish |
| **10.D ★ KEEP J4** | #19, the dealer's view | 1 | Full-frame GLYPH | MACH | A hard cut on the card's snap, in and out | 1.9 s | low | booked |
| 10.E | #23, THE GRAND PRIX | 1 | P4 SPORTS: an onboard camera, the timing tower, the safety car's light bar | DEV | The race broadcast | 4–6 s | low | code |
| 10.F | #14, the poker table | 1 | A casino "eye in the sky" pass for the establishing top shot | DEV | One shot | 2 s | low | code |

### 5.11 Ep11 · `ep1.10_assist_clause.txt` ("2027??")

| Id | Beat | Tier | Medium | Motivation | In → out | Length | Forced? | Build |
|---|---|---|---|---|---|---|---|---|
| **11.A ★** | #3, THE NESTED LANYARD → THE CLIFF | 2 | **The first true 3D camera move in the show.** The lanyards recede in depth, the loss curve tips past vertical, and the camera goes over the edge; the pixel sprites become billboards in a 3D space, with glyph textures on the surfaces | MACH (the successor adds a dimension) | The zoom down the nested lanyards to a single pixel; the pixel opens into depth. Out: the fall lands on the dark room's floor plane and flattens back to adventure-game staging. The room is 2D again, but we've seen that it has depth | 4–6 s | med. It resolves style-jumps' held A3 and merges E11-1's glyph | @remotion/three |
| **11.B ★** | #19, ATTENTION IS ALL YOU NEED (TO AVOID) | 1 | P12 HEATMAP: the core's view. It's hot where the heads attend (Kram's soup, Nole's replies, Mario's plan), and Mas is the same cold as the walls | MACH | Cut into the heads' view on the first swivel; out on "it thinks i'm part of it." | 3–5 s | low. It's the one-frame read of the line | code |
| **11.C ★ (opt)** | #11, THE POLITENESS LOOP + O11.3, the bliss spiral | 2 | **Claymation CLOD** bowing to the Researcher's glyph body; the bows decay into spiral glyphs | OWNER vs MACH (two machines, two media) | The Researcher crosses the Bay; CLOD at the lighthouse door is clay. Out: the last spiral glyph becomes the Bay's dimming lights, in pixel | 4–6 s | med: the third clay rung has to escalate, and it does, by meeting the machine | three.js clay + glyph |
| 11.D | #21, F11.3 THE DIFF | 1 | A red/green diff of the same scene that won't merge | DEV | Existing device | — | low | code |
| 11.E | #17, the Orb checkpoint | 1 | P21 IRIS (Nole fails) | MACH | The iris | 2 s | low | code |
| 11.F | #2, F11.1, the context window | 1 | GLYPH / TERMINAL | MACH | Existing | — | — | existing |
| 11.G | #19, the heist's approach | 1 | P1 CCTV on the core's cameras | DEV | One shot | 2 s | low (optional) | code |
| 11.H | #14, Mas alone: `[accept] [accept] [accept]` | 1 | The dark room's cyan drains to grey for the hold, then returns when the phone goes face down | EMO (an invented beat) | On the hold | 3 s | low-med: spend it only if the beat needs it | code |

### 5.12 Ep12 · `ep1.11_unclear_which_side.md` ("????")

*The spine's peak. Four leaps, in four acts or families, never back to back.*

| Id | Beat | Tier | Medium | Motivation | In → out | Length | Forced? | Build |
|---|---|---|---|---|---|---|---|---|
| **12.A ★** | #6, F12.1 THE RECONSTRUCTION | 2 | **Point cloud → near-photoreal room.** The model rebuilds the 2015 WOODROSE from every version the season has shown (Gerg's, Alyi's, Nole's airbrush, Mario's paper fragments) as sparse points that converge on one near-photoreal dining room. Every guest stays drawn, each in their own POV rim, because the model can rebuild a room but not a person. The 3D camera sits in Mas's chair | MACH at full fidelity | The monitor's cyan; points bloom around the table. Out: the stat bars rise over the guests, the window's reflection shows nothing over him, and the room collapses back into the monitor's glow | 20–45 s (the flashback) | low-med | three.js points + GLYPH; an environment plate (E12-2) |
| **12.B ★ KEEP J5** | #12, the sky reformats | 2 | Refine to footage (M1 by motivation, M5 by medium) | WORLD / MACH | Refine → hold | 5 s | booked | video, with a code fallback |
| **12.C ★** | #14, THE LAST CLASS PHOTO | 2 | **A near-photoreal photograph in which the humans are paper cut-outs** and only the monitor is real (style-jumps' A4, promoted) | MACH (a robot arm's camera) | The shutter; the print develops. Out: the robot arm lifts it and it becomes a pixel frame on the wall | 3 s | **low**: it turns the guardrail into the thesis | Code: three.js photo set + paper planes. Video: the room plate |
| **12.D ★ KEEP J6** | #17, `define "win."` | 2 | One ring across his water, continuous and fluid | HIM | The event is the front → settle | 2.5 s | booked | code only |
| 12.E | #13, THE WHALE ships an open-weights copy of the finale | 2 (micro) | Extra blocky: the vignette is our own finale at the Whale's quarter-resolution | OWNER (a callback to 4.A) | The montage cut; its 4 s vignette | 2–4 s | low-med: a montage laugh, earned because the medium is the joke's content | pixel engine at low res |
| 12.F | #13, EMIT's `MACHINE OF THE YEAR` | 1 | A flash-print cover pass | MEM | Montage | 2 s | low | code |
| 12.G | #15, F12.2 1993 | 1 | 1-BIT | — | Existing | — | — | existing |
| 12.H | CO #1, every phone's RSVP | 1 | P7 PHONE in a growing grid of every device on Earth | DEV | Opening montage | 3 s | low | code |
| 12.I | The intro takeover | 1 | The title renders up the tiers and on past T4 into the machine's render (the intro-slot owner's call) | MACH | — | — | low | intro owner |

### 5.13 The recommended slate at a glance

```
Ep            1   2   3   4   5   6   7   8   9  10  11  12
Tier 2 (★)    2   1   1   2   1-2 2   2-3 2   2   1-2 1-2 4
Tier 1 (★)    1   ·   1   1   1   2   1   1   1   1   1   ·   (plus the existing switches)
```

- **No long pure-pixel stretch.** The range shows up across the whole season, which is what "throughout the show" asks for. The machine family climbs toward the finale, as §3 describes.
- **Rough screen time:** about 240–280 s of Tier 2 across the season (the range depends on whether 1.A plays the whole pane in clay), under 2% of it. The largest blocks are sequences where the story lives inside the medium (the Rashomon, the folder city, the reconstruction).
- **What to cut first if an episode feels busy:** the optional items (★ opt), then the second leap in a two-leap episode. Never cut the owner's first appearance (1.A, 5.B, 6.C), because later rungs depend on it.

---

## 6. The twelve strongest Tier 2 leaps

Ranked on five things: the strength of the motivation (the record, the owner, the story); whether the first frame reads cold; what it adds to the range (a medium nothing else uses); fit with the thriller's tone; and how clean it is under the guardrails and in production. The booked jumps J1, J3, J5 and J6 are carried, not re-ranked; J1 and J6 would place in the top five.

| Rank | Id | The leap | Why it ranks here |
|---|---|---|---|
| **1** | 4.F | **THE PAINT WAVE** (Ep4 #21): the Mar 2025 image craze repaints the cathedral in soft painted anime, then melts off into the lava rivers | The record is itself about a medium, and Mas changed his own portrait. The exit is already written (the melt), and it shows the most range with the strongest reason. It's also period-true: the month's warm cast and soft wobble are the joke. Its risk (studio evocation) is manageable by evoking the internet's version, and THE OLD MASTER's still keeps it honest |
| **2** | 12.A | **THE RECONSTRUCTION** (Ep12 F12.1): the model rebuilds THE WOODROSE from every version into one near-photoreal room; the guests stay drawn; the camera sits in Mas's chair | The spine's payoff. It gathers every owner medium the season built (Gerg's, Nole's airbrush, Mario's paper) and resolves them into the machine's. The firm line (no photoreal people) becomes the image: it can rebuild the room but not the people |
| **3** | 2.A | **THE MAMMOTH** (Ep2 CO): AROS's demo creature steps out of the screen at the first preview's fidelity, flaws included | A real media event, in a cold open, at the start of the season's range. It's near-photoreal in the category the firm line permits (an animal), it teaches the render front, and its flaws (the sixth finger, the melting chair) set up the "flaws heal" arc |
| **4** | 8.B | **THE RASHOMON RENDERS** (Ep8 F8.1): four witnesses, four media, one painting walking out | Already written and already the season's anthology slot. Each medium belongs to its witness, the reveal is built in (only Mas's water glass renders correctly), and it's the natural place for the widest spread of range in one sequence |
| **5** | 9.A | **THE FOLDER CITY** (Ep9): the agents' world in voxel noir | A world with its own rules, a real echo in the research record, and a set-piece long enough to enjoy. It fuses the machine's GLYPH with its first world, and pushes the season's knee into 3D |
| **6** | 12.C | **THE LAST CLASS PHOTO** (Ep12 #14): a near-photoreal photograph in which the humans are paper cut-outs and only the monitor is real | The simplest statement of the thesis in the show, and it closes the class-photo ladder that runs from Ep1. Three seconds, one frame, no words |
| **7** | 10.C | **THE READ** (Ep10 #19): the poker mind game in HD anime, answered by a hard cut to the dealer's GLYPH view | The season's one psychological duel, invented, so the inner war is safe. The human thriller's register and the machine's view play back to back, and the rig already exists |
| **8** | 6.D | **THE LANTERN** (Ep6 #17): KCAJ's lantern throws a shadow-play creature that SKCAS stamps `FEAR-MONGERING` | The medium is the essay's own image made literal. It joins the lore's one spine image (the smiley-masked creature) and MISANTHROPIC's handmade family, and the joke lands on the stamp and the selfie, not on the fear |
| **9** | 8.D | **THE VERDICT, IN PASTEL** (Ep8 #19) | The one human-drawn record in an episode of machine renders. Real courtroom convention motivates it, it's instantly readable, and the erase stroke is a perfect exit. It's also the cheapest way to hire a real artist |
| **10** | 4.A | **THE PEBBLE** (Ep4 #9): the Whale's cheap blocky render topples INVIDIA's expensive gold one, which shatters into 1-bit | THE WHALE's story told in rendering terms, in 4 seconds: cheap beats expensive, and expensive collapses to 1993. It uses the two brand media nobody else can (blocky and path-traced) and reuses F4.2's door |
| **11** | 11.A | **THE CLIFF** (Ep11 #3): the show's first true 3D camera move, over the edge of the loss curve | A medium change that *is* the story: recursive self-improvement gives the picture a dimension it never had. Holding 3D back for eleven episodes (see 1.D) is what makes it land |
| **12** | 7.A | **CLOD'S BIG GAME AD, IN CLAY** (Ep7 #7), with its ladder 1.A → 7.A → 11.C | Claymation is the most charming medium on the list and belongs to exactly one character. The ad is the rung that best stands alone: a real media event (a TV ad) whose content is the product's self-image |

**First reserves:** 6.F CAMEO CITY (much of it is carried by the 6.E CCTV pass anyway), 3.D the pop-up book, 5.B Kram's avatar, 10.B the zoetrope, 7.B the sponsored lasagna, 5.E the figurine.

---

## 7. In, out and sound

**The grammar by family.** These replace style-jumps' transition table as defaults. As [flow-and-continuity](../../bible/flow-and-continuity.md) says, the watching experience wins.

| Family | In | Out | Sound |
|---|---|---|---|
| **THE DEVICE** | The device is on screen: push into it, or cut to its point of view | We leave the device: pull back to the room, or its UI closes | The room's bed continues; the device's own speaker carries (a CCTV hum, a stream's compression, a stadium PA) |
| **THE MACHINE** | The render front (the intro's glowing seam), or a refine step | Back into the device that made it (a melt, a drain, a collapse into the monitor's glow). At most one pixel scar | The sound reformats with the picture: the chip lead's timbre steps toward acoustic (piano, strings); a full-band recorded ambience replaces the synthesized bed. No risers or whooshes |
| **THE BRANDS** | The product's own surface: a pane, a jumbotron, an ad break, a stream, a lantern | The product closes: the end card, the avatar unzipped, the book folded shut | Each brand's sound. Clay: close-miked foley in a dry room. Low-poly: thin, compressed app audio with spatial pings. INVIDIA's twin: arena reverb. THE WHALE: 4-bit chip at half the sample rate. The handheld: four-channel square waves. NOLE's airbrush: the house band's brass run through fuzz. Paper: rustle and fold. Shadow play: the lantern's hiss |
| **THE RECORD** | The flash-print | A physical act: the erase, the snap, the fold | Silence, or one sound true to the medium (a shutter, a pastel scratch) |
| **HIM** | The event is the front | It settles | Silence (J6) or, for 10.C, the score's own strings and piano played straight, never an anime sting |
| **THE WORLD** | The crack, or the refine | The seal, or the hold | Real, full-band outdoor air, about 10 dB under the room |

**Rules that still help** (guidance): Mas never freezes in any medium. A leap never eases between media with a crossfade (the render front is the only blend). The UI (the rail, truth labels, subtitles) stays pixel and on top. Photosensitivity follows the intro's rules. Within about 10 s of an exit, the shot is on a face.

**What changes from style-jumps §3.4.** "The running cue stops dead on the downbeat" conflicts with the flow guidance's continuous bed. The music should thin, re-voice or change medium with the picture, and a hard stop should be a rare designed beat (the record's prints and the ring). This is for the soundtrack pass to weigh ([§10](#10-conflicts-rulings-and-handoffs), H4).

---

## 8. The production kit: code now, video later

Every item in the map has a fully programmatic filler that can be cut into the animatic today. The final upgrade replaces a layer on the same frames, mask and sync ([GENAI-UPGRADE-PLAN §1](../../production/GENAI-UPGRADE-PLAN.md#1-principles)).

| Medium | Code filler now | What exists | Final upgrade | Notes |
|---|---|---|---|---|
| Tier 1 passes (P1–P21) | Post-processes on the pixel frame, added to the engine as one `passes` module | The pixel engine, masks, the render front, the freeze, GLYPH | None needed; they stay code | Additive to `src/shared/pixel` ([PIXEL_GUIDE §7](../../../studio/PIXEL_GUIDE.md)) |
| Near-photoreal environments, objects, creatures, weather | three.js PBR scenes and tonal `softenv`/`paint` | `three` 0.186 and `@remotion/three` installed but unused; tonal renderers; `out/lookdev/looks/env` | **Video plates** (Runway, 720p, audio off) under a stepped matte; people masked out of conditioning frames | The mammoth, CAMEO CITY's street, the Rashomon room, the lasagna, the rain, the Woodrose, the sky |
| Soft painted anime | Tonal `paint`/`soft` for backgrounds; the anime rig for figures | `src/shared/anime`, `out/lookdev/looks/anime` (Mas and Nole) | A video plate for the paint wave and melt (E4-3); a human paint-over for Mas's portrait | Characters stay rig |
| HD anime | The anime rig and `animescene` | Lookdev v1, rig sheet, a motion test | A human key animator's polish of about 10 s; possibly a restyle of our own rig renders (ruling R5) | No model-generated faces |
| Claymation | A three.js clay shader: lambert with a warm subsurface tint, fingerprint normal noise, a per-frame boil, stepped at 12 fps | — | **A real one-puppet stop-motion day** for CLOD | The most honest version of the medium, and cheap |
| Low-poly legless avatar | three.js flat shading at 12 fps | — | None needed | — |
| Voxel noir | three.js instanced cubes, orthographic, with a glyph atlas on the faces | `pixel/glyph.ts` | A CONVERT plate for rain and depth (E9-1) | — |
| True 3D camera | @remotion/three with the pixel sprites as billboards | — | None needed | Reserve the first use for Ep11 |
| Point-cloud reconstruction | three.js points resolving to planes | — | An environment plate for the resolved room (E12-2) | — |
| Zoetrope | A three.js cylinder with a frame strip, strobed on the steps | — | None needed | — |
| Paper pop-up, shadow play | 2.5D paper planes with hinges; 2D jointed silhouettes | `studio/src/styleframes/puppet*`, `out/lookdev/looks/puppet`, `out/lookdev/looks/collage` | Optionally a paper-craft shoot | — |
| Courtroom pastel | A new stroke renderer from the pixel frame (edges, hatching, toned paper) | — | **A human courtroom artist** for 3–4 frames | — |
| Airbrushed metal cover | Tonal `soft` with gradient bands and chrome ramps | `noleTone.ts` | A human paint-over; an image plate for the backplate only | No weapons anywhere near a real person |
| Engraving, halftone, stipple | The tonal `engrave`, `noir`, `stipple` renderers | `out/lookdev/looks/env` | — | J1, J2 |
| Collectible figurine, action figure, glossy twin | three.js glossy toy with a box | — | None needed | Chibi proportions; a sprite-simple face |

**Resource asks, in order of lift** (to add to the plan's [§9](../../production/GENAI-UPGRADE-PLAN.md#9-resource-asks-ordered-by-impact)):
1. **The video-model key** (already pending): the mammoth, the paint wave's melt, CAMEO CITY's street, the Rashomon room, the Woodrose, the sky.
2. **A one-puppet stop-motion day for CLOD:** one clay puppet, a small tabletop set, about 20 s of animation across 1.A, 7.A and 11.C.
3. **A courtroom sketch artist** for 3–4 frames (8.D).
4. **An anime key animator** for about 10 s (10.C, and Mas's portrait in 4.F).
5. **Optional:** a paper-craft day for the pop-up book (3.D, 7.E).

**Disk and render.** Every filler renders at 1080p at most and at `--concurrency=4` or less on this machine. The largest new renders (the folder city, the reconstruction) should be built as short shot tests first.

---

## 9. Declined

| Item | Why |
|---|---|
| **zAI's anime companion as a lens** | KORG's NEVER DO bans the companion characters, and "spicy mode" is X7. NOLE gets the airbrushed album cover instead |
| **Any photoreal fake of a public figure from the record** (the puffer-coat pontiff, the arrest fakes, the viral fight clip between two actors, deepfake Mases as footage) | The firm likeness line. CAMEO CITY keeps its Mases as sprites and uses the CCTV pass |
| **RUMPT's own AI self-portraits as a leap** | Fairness (a politician as the subject), and [guardrails §1b](../../bible/guardrails.md#1b-specific-cuts-and-restagings-from-the-worldcast-critic-binding) bars religious-costume images and war-themed AI images. The podium's AI-rendered surface ([RUMPT's file](../../characters/dlanod-j-rumpt.md)) stays a prop |
| **The fake explosion photo that moved markets (2023)** | X6-adjacent |
| **A film-grade look for "her"** | It points at the actress, who is never drawn or voiced |
| **An anime inner war at THE HUG or the trial** | It would state intent and feelings at real events. Moved to Ep10 |
| **THE TRANSFORMER as a mecha sequence, HIGH NOON as a western** (as leaps) | Genre quotes on genre gags. Tier 1 at most, and only if the animatic asks |
| **Ep3's podium turn** | style-jumps' reason holds: it would amplify a causation the record doesn't hold, around a politician |
| **Ep12's NOLE through the ceiling in anime** | An arrival gag in a cold open; nothing to motivate the medium |
| **YLLIT near-photoreal** (6.K, 9.F) | Held, not declined: it's fictional, but it needs its own ruling against the genai plan's no-faces rule, and the synthetic-actor controversy makes it a statement the show would be making with the tool it satirizes |
| **A "deep-fried" meme pass** for the TIDDER post (Ep1 #22) | Corn |

---

## 10. Conflicts, rulings and handoffs

### 10.1 Rulings needed (showrunner)

| # | Ruling | Default until answered |
|---|---|---|
| R1 | Replace style-jumps' budget ("8 a season, 30 s, 0 or 1 an episode") with the two-tier guidance in §1.2 | The showrunner's "no hard cutoffs" note already points here. Plan to this map; the jump-fix pass carries the change into style-jumps |
| R2 | Mas may appear in any stylized medium (anime, clay, low-poly, painted, pastel, paper), never near-photoreal. style-jumps §3.5 currently limits him to graphic media, and §2.7 holds the anime look | Allow, per the showrunner's own guardrail wording |
| R3 | A leap may carry a laugh when the medium is the joke's subject (4.F, 5.E, 7.B, 12.E); it never decorates a joke that works without it. style-jumps §1.3 says "never a punchline" and "continuous tone is never a joke" | Allow, case by case in the animatic |
| R4 | Near-photoreal *material* on a caricature's form (the gold statue in 4.A) | Allow the material, never a sculpted face; keep the sprite's proportions |
| R5 | The genai plan's principle 4 ("no face or performance out of a model") stays. Does a restyle of our own rig renders count? Does YLLIT (fictional) get an exception? | Principle 4 stands; no restyle of faces; no YLLIT near-photoreal |
| R6 | The SYNTH ruling ([genai plan §10](../../production/GENAI-UPGRADE-PLAN.md#10-rulings-needed-no-cost)) now covers the mammoth's exit from its bezel, the Rashomon room and CAMEO CITY's street | Code fillers ship; plates wait for the ruling |
| R7 | STUDIO IBLIHG evocation in 4.F: a legal read before lock | Evoke the internet's version; no designs, creatures, props or compositions |
| R8 | No leap takes a real politician as its subject (fairness) | Hold as a strong guideline |
| R9 | The first true 3D camera is reserved for Ep11 (so 1.D stays held) | Reserve |

### 10.2 Handoffs (this pass edits none of these files)

| # | To | What |
|---|---|---|
| H1 | **The jump-fix pass** (`show/bible/style-jumps.md`, `studio/src/dev/jumps/**`) | The two-tier definitions (§1), the owner table (§2), the narrowed spine (§3), the reclassification of J2 and J4 as passes, A4's promotion to 12.C, A3's resolution as 11.A, and R1–R3 |
| H2 | **The season revision** (`show/episodes/**`) | The ★ items as proposed staging, beat by beat. None adds a scene, a speaking character or a real line. 4.E adds one invented CLOD line; 10.C allows one lowercase V.O. line |
| H3 | **The Ep1 Act Four v4 pass** | 1.E (J1, unchanged) and 1.G (P2 CALL on the call grid), as options only |
| H4 | **The soundtrack pass** (`audio/ost/**`) | §7's sound-by-family table, and the conflict between "the cue stops dead" and the continuous bed |
| H5 | **The genai plan owner** | New plate candidates beyond the E-codes: CAMEO CITY's street (6.F), the lasagna (7.B), the funeral rain (7.G), the Woodrose room (12.A), the class-photo room (12.C). The resource asks in §8 |
| H6 | **The engine owner** (`studio/src/shared/pixel`) | A `passes` module for P1–P21, additive only; a first three.js composition path under the pixel UI |
| H7 | **Fact checks** | Re-verify every [K] here before any of it reaches a card or a rail: Mas's avatar change and the image model's warm cast (Mar 2025); the April figure trend; the banana app's figurine trend; KCAJ's essay wording; the CGI-keynote egg; the block-world agents study; the fake CCTV clip; the courtroom-camera convention |
