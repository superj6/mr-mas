# MR. MAS · Generative upgrade candidates (Season 1)

Where a video model (or a voice, music or SFX model, or a live player) could tastefully lift a moment the first pass builds in code, and where it must never go.

| | |
|---|---|
| **Status** | **PROPOSED.** Segment scout pass, 2026-09-25. Nothing here edits a script, a rule or a locked file. Items that would change a rule are marked **NEEDS SIGN-OFF**. |
| **The note** | The showrunner: *"in general i want to consider where we can tastefully add higher quality animation in select segments with a video model output. similarly if reasonable for any other programmatically generated part. we will still make a first pass full programmatically."* |
| **Standing rules this obeys** | Pixel art is the primary look: adventure-game staging, GLYPH for dark foreshadowing, sparing motivated switches ([style-status](../bible/style-status.md), [PIXEL_GUIDE](../../studio/PIXEL_GUIDE.md)). Video-gen inserts are converted to pixel or glyph in code, never realistic likenesses of real people (style-status DECISION box). The show should feel like a fluid thriller drama ([tone-and-dialogue](../bible/tone-and-dialogue.md)). 1080p is the maximum render. Never clone or imitate a real person's voice. Parody names and logos only ([guardrails](../bible/guardrails.md)). |
| **Read for this pass** | [intro SCRIPT v2.1](../intro/SCRIPT.md) · [Ep1 script](../episodes/ep01/script.md) (draft 2, Act Four 3.1) · [Ep2 script](../episodes/ep02/script.md) (staff draft 2) · [Ep3 script](../episodes/ep03/script.md) (draft 2) · Ep4–12 `beats.md` · [SEASON-NOTES](../reel/SEASON-NOTES.md) · [pov-and-framing](../bible/pov-and-framing.md) · [tone-and-dialogue](../bible/tone-and-dialogue.md) · [guardrails](../bible/guardrails.md) · [flashback-map](../timeline/flashback-map.md) · [PIXEL_GUIDE](../../studio/PIXEL_GUIDE.md) · [OST-BIBLE](../../audio/ost/OST-BIBLE.md) · [CASTING](../../audio/voices/CASTING.md) · [production-estimates §7](../format/production-estimates.md) · [FORMAT-DECISION §7.5](../format/FORMAT-DECISION.md) |
| **Scope** | 39 picture candidates (4 intro, 6 Ep1, 4 Ep2, 4 Ep3, 21 across Eps 4–12), plus audio: voices, score and SFX. |

**Contents:** [The short version](#the-short-version) · [1. Rules for a generative insert](#1-rules-for-a-generative-insert) · [2. NO-GO zones](#2-no-go-zones) · [3. Patterns](#3-patterns) · [4. Shared kits](#4-shared-kits) · [5. Candidate register](#5-candidate-register) · [6. Audio candidates](#6-audio-candidates) · [7. Budget](#7-budget) · [8. Resources to ask the showrunner for](#8-resources-to-ask-the-showrunner-for) · [9. The bake-off](#9-the-bake-off) · [10. Sign-offs and handoffs](#10-sign-offs-and-handoffs)

---

## The short version

- **39 picture moments, about 272 s on screen (about 1.8% of the season's story time).** Twelve are A-tier (about 94 s). The intro and Ep1 come first.
- **They are environments and elements, never people:** water, fire, smoke, weather, melts, shatters, and camera moves in depth through sets. None is a character's performance, a face or a mouth.
- **The default treatment is CONVERT:** the clip is redrawn in code into the master palette, lit through the show's own ramps and held on 2s, so a viewer never thinks "AI video." GLYPH takes clips as a source for the machine's point of view. REF uses a clip only as motion reference for our own drawings.
- **One new switch is proposed, SYNTH (NEEDS SIGN-OFF).** It is used only where the story itself says the picture is machine-made video, inside a bezel: AROS's mammoth on the lobby screen (Ep2) and the Rashomon exhibits (Ep8).
- **Ten shared kits carry most of it** (the bay, the nave, fire, smoke, sloshes, melts, shatters, the rocket plume, Vegas, surf). Each is generated once and reused all season.
- **NO-GO:** character acting, faces, lip sync, anything that reads as a deepfake, realistic real events, text, THE PLAN, Mas's glass and reserved tells, and 1993. That includes the show's own deepfake gags, which reverses the one "legit use" production-estimates §7 and FORMAT-DECISION §7.5 allowed.
- **Several things that look like candidates are better in code:** the heart and tile avalanches, the black hole behind the lectern, and the ring in his water (§2.3).
- **The biggest audio lift is human:**
  - actors for MAS and RUMPT first; then CHATGTP (a designed voice under a "her" guardrail), NOLE, and THE INTERN (one contract with Mas's actor)
  - live players over music models: a Harmon-muted trumpet (the title's one melody, still missing from the render), a horn-section stab session, a violin and cello for the sincere beats, a vocal quartet and a chant group
  - a foley day for glass, water, paper and stamps

  The OST's ban on generative music stands, with one narrow texture exception offered for sign-off.
- **The first pass stays 100% code.** Every insert is a drop-in layer on the same frames, masks and sync. If a take fails the gate, the code layer ships.
- **Next step:** a three-shot bake-off (§9) before anything else, and the resource asks in §8.

---

## 1. Rules for a generative insert

### 1.1 The first pass stays code

Every candidate below has a programmatic version, and that version ships first. The generative version is a **layer swap after the animatic**: same frame range, same mask, same audio sync, same grid. Nothing is re-edited to fit a take. If a take fails any check in §1.5, the code layer stays.

Script notation, one line under the shot, like a `MUSIC:` line:
```
GEN: E1-6 · CONVERT · the shatter and sand layers · fallback: code
```

### 1.2 Four treatments

| Treatment | What ships | How it looks | Counts as | Use for |
|---|---|---|---|---|
| **CONVERT** (default) | The clip redrawn in code: downscaled to 480×270, mapped into the master palette through a named light ramp, held on 2s or 3s, whole-pixel motion (§1.4) | **BASE.** The same kind of picture as our art | BASE: not a switch | Physics, liquids, fire, smoke, weather, flights, b-roll |
| **GLYPH** | The converted clip used as the `source` buffer of a GLYPH (or TERMINAL) switch | Tokens | GLYPH or TERMINAL time, under their existing rules (dark foreshadowing; machine POV) | The scan cone, the /tmp city, the nested lanyards, F12.1 |
| **REF** | Nothing. The clip is motion reference for hand-built pixel drawings | BASE | — | Creatures, sloshes, anything whose key drawings must be ours |
| **SYNTH** (PROPOSED · **NEEDS SIGN-OFF**) | The clip close to as generated (graded, downscaled to its window, smooth 24 fps) inside a diegetic bezel | Machine-made video, deliberately smoother than the world around it | A non-base style, so it counts toward "two non-base styles per episode at most" ([style-status §7b](../bible/style-status.md#7b-rules-for-switching)) | Only when the story says the picture on screen is machine-made media |

**SYNTH rules** (if approved):
- It is **bezel-bound**: a screen, a projector or an exhibit frame. It is never full-frame.
- It lasts **2 bars or less**.
- It shows **no person, face or body**, ever.
- Its image may leave the bezel only by **becoming ours**: at the break, it turns into CONVERT or pixel art (the mammoth's step, E2-1).
- It is a reality intrusion by *the machine*, never by the real world. It must never make a real room or a real event look photographed.

### 1.3 Where an insert may go

**Allowed:**
- S-mode set-pieces, where the wide may run 50–70% ([pov-and-framing §4.2](../bible/pov-and-framing.md#42-target-shares-of-2045-story-time)).
- Establishing wides of 1–2 bars.
- Backgrounds behind a held face, stepped down at least two light levels. Motion behind stillness is the show's grammar (the calm-off, the silent `[CU]`).
- His screens (the monitor, the phone), with the bezel in frame when it is the world's view.
- Machine-POV sequences, and signposted exits from his POV.
- Flashback environments.
- Under the end credits.

**Never:**
- In the foreground of an I-mode dialogue beat, a portrait window, a name card, THE PLAN or a quote card.
- Moving under must-read text. A real line's words stay still and legible (the read-time rule), whatever burns behind them.
- On `(REPORTED)`, `(DISPUTED)` or sealed material. Generated realism would read as evidence.
- **As added screen time without Mas.** An insert must sit in a set-piece he's in, on his screen, in a signposted exit, or under the credits. The story editor already measured the season drifting to omniscient news satire ([SEASON-NOTES note 1](../reel/SEASON-NOTES.md#1-from-ep5-the-show-stops-being-told-through-mas-eps-5-7-9-11-12)), and b-roll must not make that worse.

**Budgets (proposed):**
- At most **45 s and 6 inserts per episode**, and at most **1 SYNTH window**.
- GLYPH and TERMINAL inserts spend the existing GLYPH and TERMINAL budgets; they add none.

### 1.4 The ingest: how a clip becomes ours

A proposed tool for the engine owner ([§10](#10-sign-offs-and-handoffs)). It would live outside the engine, for example as `studio/tools/genai-ingest/`, plus a small additive loader in `src/shared/pixel`.

1. **Generate.**
   - **Elements** (fire, smoke, sparks, dust) are generated on pure black, for a luminance key.
   - **Liquids and weather** are generated over a clean plate, for a difference key.
   - **Wherever our layout must match**, start from our frames: render the pixel plate at 1920×1080 (4× nearest, then a slight blur so the model sees shapes, not stair-steps) and use it as the first frame, with our end state as the last frame. The prompt describes only the camera, the physics and the light.
   - **Characters are never in the conditioning frames.** Mask them out and composite them afterwards.
   - A **720p source** is enough (the target is 480×270). Never deliver anything above 1080p.
2. **Conform to the grid.** 24 fps. Trim to the exact frame count, with a speed ramp of ±15% at most, and cut on the 96 BPM grid ([PIXEL_GUIDE §1](../../studio/PIXEL_GUIDE.md#1-canvas-spec)).
3. **Downscale** to 480×270 by area averaging in linear light. Never nearest-neighbour from 1080p, which aliases.
4. **Light it like ours.** Map each masked element's OKLab lightness through a named family ramp with a `ToneCurve` (the same machinery as `compilePalette(mode: 'tone')`): fire → W (tungsten), night water → N and C, dusk → U, lava → W into gold. Nearest-colour matching alone makes an insert look pasted in; ramp mapping puts it in the show's light.
5. **Dither discipline.** Ordered dither only on backgrounds and light falloff ([PIXEL_GUIDE §2 rule 6](../../studio/PIXEL_GUIDE.md#2-palettes-and-the-switch-rules)). No figure is ever generated, so no skin is ever dithered.
6. **Kill the shimmer.** Apply index hysteresis: a pixel changes palette index only when the new colour beats the old one by more than δ in OKLab. Flicker in static regions is the first tell of converted video; measure it (mean index changes per frame) and gate on it.
7. **Hold like ours.**
   - Environment motion is held on 2s (12 drawings a second), and on 3s behind faces.
   - Fire and steam become 8-frame loops.
   - Camera flights are clamped so the nearest plane moves 8 px a frame or less.
   - SYNTH alone plays smooth at 24.
8. **Ship frozen files.** Indexed PNG sequences plus masks are loaded in `draw` or passed as a switch `source`. Renders stay deterministic: the engine forbids `Math.random`, and the clip is a file.
9. **Audit.** `strayColors(fb) === 0`, the luminance and saturated-red photosensitivity audit ([guardrails §7](../bible/guardrails.md#7-broadcast-safety)), and the flicker metric.
10. **File the provenance.**
    - Each insert gets `studio/assets/genai/<ID>/provenance.json`: provider, model and version, date, prompt and negative prompt, seed, input-frame hashes, a snapshot of the terms, and the licence.
    - **The converted frames and the provenance are committed.**
    - **The source clips are not.** `*.mp4` is gitignored, and unlike everything else the ignore list covers, a generated clip **cannot be re-created**. Archive the sources deliberately, outside git.

### 1.5 The gate: every insert, every take

- [ ] The programmatic version exists and is cut. The insert matches its frames, mask and sync.
- [ ] **No human figure, face or mouth came from the model.** Every character is ours, composited afterwards.
- [ ] The prompt names no real person, company, product, landmark, franchise, studio or artist, and says no "in the style of." (The house rule "never name the real person in a prompt", [CASTING §6](../../audio/voices/CASTING.md#6-what-would-most-improve-these-voices-in-order), applies to picture too.)
- [ ] No legible text came from the model. All text is code.
- [ ] Nothing in the take reads as military, religious, franchise, Epstein-adjacent or private-life imagery ([§2](#2-no-go-zones)).
- [ ] Invented still looks invented ([guardrails §5](../bible/guardrails.md#5-legal-hygiene)): no realistic rendering of a real room at a real event.
- [ ] Palette: `strayColors` is 0 (CONVERT and GLYPH), and dither appears only on backgrounds.
- [ ] Motion: held on 2s or 3s (except SYNTH), whole-pixel, flicker under the threshold.
- [ ] Photosensitivity: at most 3 flashes in any 24 frames, every pop at 80% white or less, and the saturated-red test passed.
- [ ] **The effect test:** at 1×, in context, the reviewer doesn't think "AI video" (except SYNTH, where the story says it is). This is PIXEL_GUIDE's rule 4 ("a switch must be over before the viewer can think 'effect'") applied to generated picture.
- [ ] Provenance filed, and the source archived.
- [ ] Budget: this episode's total stays within 45 s, 6 inserts and 1 SYNTH.

---

## 2. NO-GO zones

### 2.1 The zones

| Zone | Where it appears in the season | Why | Instead |
|---|---|---|---|
| **Character acting** | Any principal's performance, walk, gesture or reaction, above all Mas's (he never freezes, never blinks, and his smile is one pixel) | The comedy and the POV live in held drawings, swaps and one-pixel changes. A model can't hold "nothing changes," and it adds exactly the life we forbid: blinks, breath, drift | Cut-out and sprite rigs. REF only for non-human motion |
| **Faces** | Every face at every size: portraits, name cards, `[CU]`, the eyes strip, tiled crowds, profiles in silhouette, invented extras (the six-fingered EXTRA, the Ep1 anchor) | Likeness law (*Hart v. EA*, *Keller v. EA*), the caricature defense, X3 and X10, and every model's drift toward photoreal | Hand-placed clusters ([PIXEL_GUIDE §3](../../studio/PIXEL_GUIDE.md#3-scale-standards)) |
| **Lip sync and mouths** | Every spoken line, including the anchor's lagging mouth (Ep1 sc14) | Mouths are 6–8 replacement drawings. A generated talking mouth is deepfake grammar | `mouthFor()` swaps |
| **Anything that reads as a deepfake** | NEDIB's cut-paper deepfakes (Ep1 sc21) · the AI-altered anchor (Ep1 sc14) · THE CLONE (Ep1 sc15) · DIRE's twin (Ep2 sc8) · NORCAM's deepfakes (Ep4 #13, Ep9 #35, Ep10 #14) · CAMEO CITY's deepfake Mases (Ep6 #18) · the DevDay hologram (Ep10 #2) · YLLIT (Ep6–7) | The show satirizes deepfakes. Generating one, even of a caricature, makes the show the thing it mocks ([guardrails §5](../bible/guardrails.md#5-legal-hygiene)) | They stay visibly drawn: scissor edges, gloss, six fingers. **NEEDS SIGN-OFF:** [production-estimates §7](../format/production-estimates.md#7-what-external-tools-would-change) and [FORMAT-DECISION §7.5](../format/FORMAT-DECISION.md) list "in-world deepfake parodies (NORCAM's deepfakes, the cloned anchor)" as the one legitimate video-gen use. This scout recommends reversing that |
| **Real events, real rooms, rendered realistically** | The inauguration, the Senate, the courtroom, the UN chamber, the state dinner, Davos, Riyadh, the G7, the GOLD OVAL | "Invented filler is obviously absurd"; realism implies the record | Drawn sets. A generated layer may carry weather or light outside a window, never the room's people |
| **The record and the show's voice** | The rail, quote cards, chyrons, truth labels, name cards, THE PLAN blueprint, lit UI, any legible text | Text must be exact, legible and linted, and models garble it. THE PLAN must be recognized instantly | Code only |
| **Mas's signature and reserved tells** | The glass that never ripples, the tear (Ep1), the bead (Ep7), the ring (Ep12), the reflection (D7), the one-pixel smile | The show's most exact gags, and the season's payoff can't depend on a lucky take | Code (a wave-equation ripple for the ring) plus hand-finished drawings |
| **The machine's own language** | The Orb, the cursor, GLYPH tokens, the suggested-replies strip | The machine speaks in our engine | Code |
| **1993 and 1-BIT** | F1.1, F4.2, F7·m2, and F12.2, where the beige computer finally turns | A hand-drawn era, and the turn is the season's last reveal. "Never rotate a sprite: draw the angle" | Four authored drawings |
| **Things whose cheapness is the joke** | THE WHALE's budget breach (2 drawings, no overshoot) · tiled crowds that swap in one frame · the show's slow motion (walks on 4s) · the roll call's 7–8-frame flashes | More fidelity kills the joke | Keep them |
| **War, weapons and military operations** | The Pentagon arc (paperwork only), the battle station, the meteor | X6 | Generated layers never carry hardware, blasts, strikes or maps. Reject any take that reads as a strike |
| **Religious and devotional imagery** | ALYI's cathedral, the monks' vigil (Ep5), the white smoke (Ep5), the encyclical (Ep8, Ep12), the POPE scenes | X10 and the "generic tech cathedral" rule. Models default to church iconography | Screen nave and fire takes frame by frame; reject any religious symbol |
| **Franchise and trade-dress magnets** | The transforming robot, the battle station, the stargate ring, the HOAX BUSTER, a studio-style watercolour, a famous fountain show, racing liveries, a real rocket's silhouette | Models reproduce famous designs ([guardrails §5](../bible/guardrails.md#5-legal-hygiene), franchise designs) | Prompts describe physics and material only; our designs are composited on top |
| **Epstein-adjacent and private-life imagery** | Islands, jets, yacht arrivals near the listed figures; homes and families | X1, X8 | Never generated |

### 2.2 Sincere beats stay plain

**F9.3** (the 2016 Oakland pilot) is "a clean cut with no transition effect; breaking the rule is the point" ([flashback-map](../timeline/flashback-map.md)), with no recipients, faces or names. **Ep7's bead, Ep12's ring and the STRAIGHT beats** get nothing added either. Generated texture would decorate what has to stay bare.

### 2.3 Better in code

These look like candidates, but a deterministic program beats a video model:

- **The heart and tile avalanches** (Ep1 sc27, sc29). Use a 2D rigid-body sim at 12 steps a second, snapped to integers. It lands exact counts (one blue heart; 745 tiles; MADA wedged in the gap) and needs no taste from a model.
- **The black hole behind Mas's lectern** (Ep5 #8). Lensing is geometry: a radial displacement remap of the room buffer, with Mas composited untouched.
- **The ring in his water** (Ep12 #17) and any ripple that must be exact. Use a small wave-equation grid, quantized.
- **Rain in dialogue scenes, and the revolving door's paper storm** (Ep3 sc11). Use particle systems.
- **The GLYPH dissolves, render fronts, sky cracks and the Orb's scan.** These are the engine.
- **The attention-head laser grid** (Ep11 #19), **the 360 zoetrope** (Ep10 #7) and **the bubble-sorted seating chart** (Ep12 #4). The pixel idiom is the joke.

### 2.4 Considered and not listed

- **The AI-altered anchor clip** (Ep1 sc14): an invented face with a lagging mouth, so deepfake grammar.
- **F1.2's frosted TPOOL door** (Ep1 sc26): `(REPORTED)` material, where realism would read as evidence.
- **The code-red siren's red sweep** (Ep1 sc8): palette steps are safer for the saturated-red photosensitivity test.
- **The stadium crowd** (Ep3 sc8): tiled on purpose.
- **THE HUG's bullet time** (Ep7 #17): an orbit needs characters to rotate.
- **Air Force One in Alaska** (Ep8 #18): the exterior of a real government aircraft.
- **YRRAL's yacht** (Ep6 cold open): near X8 territory, and small gain.
- **The inauguration and Riyadh** (Ep4, Ep5): real events.

---

## 3. Patterns

| Pattern | Why a model helps here | Treatment | Candidates |
|---|---|---|---|
| **Physics set-pieces** (impacts, shatters, debris, collapses) | Chaotic secondary motion (shards, dust, grain) is what hand-held drawings do worst and what makes a gag read "expensive" | CONVERT layers around our props | E1-3, E1-6, E4-1, E7-2 · E6-1 (C, high risk) |
| **Liquids and melts** | The season's defining gag is liquid ("every glass but his"), and the tech spectacle is molten (GPUs melting) | REF for vessels, CONVERT for bodies of water and lava | IN-4, E1-1, E1-2, E1-3, E3-1, E3-3, E4-3, E7-1, E10-1, E11-2 |
| **Fire, smoke and dust** | Turbulence and volumetric light are cheap for a model and costly by hand | CONVERT, often as luminance that also lights the room | IN-2, IN-3, E1-5, E2-2, E2-3, E8-1, E8-3 |
| **Weather and sky** | Code weather looks cheapest, and a thriller needs mood | CONVERT under our sprites | E2-4, E4-2, E5-2 |
| **Camera moves through sets** (flights, time-lapses) | Depth moves are what pixel art can't do cheaply. The adventure-game genre's own precedent is the pre-rendered cutscene, so a converted flight reads as that genre's cinematic, not as a new look | CONVERT, conditioned on our first and last frames | IN-1, E1-4, E3-2, E8-4, E9-2, E12-1 |
| **Dream, glyph and machine POV** | The machine's view is the one place a render-like move belongs, because it's the machine's render, not our camera | GLYPH or TERMINAL source | IN-1, E9-1, E11-1, E12-2 |
| **Diegetic machine media** (reality intrusions) | When the story says the picture is AI-made, real AI video is the most honest prop there is | SYNTH (NEEDS SIGN-OFF) | E2-1, E8-2 |
| **Era and memory textures** | Paper, light and material that the flashback's POV owns | CONVERT with the era's palette | E3-4, E8-2 |
| **Creatures and vehicles** | Organic non-human motion (a mammoth, a tiny dog, a lobster, a gull, a cat) and speed | REF for key drawings; CONVERT for plates | E2-1, E3-1, E5-1, E7-1, E12-3 · E10-2 (C) |
| **Montage b-roll** | Texture for short vignettes | CONVERT, on his monitor or under the credits only | E12-3 |
| **Crowds** | None. Crowds of people stay tiled held drawings, because the one-frame swap is the joke. Mass *objects* are better in a physics sim (§2.3) | — | — |

---

## 4. Shared kits

Generate once, convert once, reuse all season. Together they cover more than half of the listed seconds.

| Kit | First use | Reused in |
|---|---|---|
| **BAY** (water, steam, sky; day, dusk, night and ice by ramp, not by re-generation) | IN-4, the intro skyline | Ep1 sc1 window and sc14 · Ep3 cold open, sc18, E3-3 · E5-2 · Ep6 siren flight · E11-2 |
| **NAVE** (the data-center cathedral in depth) | IN-1, the scan cone | E4-3 · E9-2 · E12-2 |
| **FIRE** (8-frame loops, small to bonfire) | IN-2, the effigy | E1-5 · E2-3 · Ep3 sc15's burning gears · E12-3 |
| **SMOKE** (curls, billows) | E2-2, the candle wipe | E1-5 (the extinguisher) · E8-3 |
| **SLOSH** (flute, tumbler, mug, cooler; REF and spills) | E1-1 | Every "every cup sloshes but his" · E1-2 · E11-2 |
| **MELT** (soft-clock sag, lava, cooling to gold) | E1-3, the drill's basement | E2-1 (the chair) · E4-3 |
| **SHATTER** (glass shards, granular collapse) | E1-6, the hourglass | Ep5 #17 (ZURC's hourglass) · Ep2's tag skylight · E7-2's hourglass |
| **PLUME** (exhaust, launch cloud) | IN-3, the booster | E8-3 |
| **VEGAS** (the neon boulevard, the window plate) | E1-4 | E10-1 · E10-2 |
| **SURF** (waves, foam, the moat) | E3-1 | Ep4 #4 (the whale's beach chair) · E12-3 |

---

## 5. Candidate register

### 5.0 At a glance

**Seconds** are shipped on-screen seconds, with a kit counted at its first use. **Risk** is the risk that the insert fails the gate or hurts the moment.

| ID | Where | Pattern | Treatment | Sec | Pri | Risk |
|---|---|---|---|---|---|---|
| IN-1 | Intro f100–104 · the scan cone's cathedral | Flight / glyph | GLYPH | 0.2 | **A** | low–med |
| IN-2 | Intro f290–359 · the effigy fire | Fire | CONVERT | 1.3 | B | low |
| IN-3 | Intro f405–419 · the booster's plume | Fire / smoke | CONVERT | 0.6 | C | low |
| IN-4 | Intro f540–629 · the bay's water and steam | Liquids | CONVERT | 3.8 | **A** | med |
| E1-1 | Ep1 sc1 and season · the slosh kit | Liquids | REF + CONVERT | 6 | **A** | low |
| E1-2 | Ep1 sc3 · the rewind | Liquids | CONVERT | 2 | B | low |
| E1-3 | Ep1 sc6 · the drill; the first melt | Physics / melt | CONVERT | 6 | **A** | low–med |
| E1-4 | Ep1 sc24–26 · the Strip below the suite | Flight / plate | CONVERT | 15 | **A** | med |
| E1-5 | Ep1 sc30 · the fires and the extinguisher | Fire / smoke | CONVERT | 5 | B | low |
| E1-6 | Ep1 sc30 · the hourglass shatters | Physics | CONVERT | 2 | **A** | low |
| E2-1 | Ep2 CO · AROS's mammoth | Machine media / creature | SYNTH → REF/CONVERT | 6 | **A** | med |
| E2-2 | Ep2 sc4 · the séance smoke (candle wipe) | Smoke | CONVERT | 3 | B | low |
| E2-3 | Ep2 F2.2 · the bonfire | Fire | CONVERT | 10 | B | low |
| E2-4 | Ep2 sc17 · the Bay Bridge storm | Weather | CONVERT | 15 | **A** | med |
| E3-1 | Ep3 sc5, 12, 17A · the beach | Liquids / creature | CONVERT + REF | 8 | B | low |
| E3-2 | Ep3 sc22 · the o3 bar into the clouds | Flight | CONVERT | 10 | B | med |
| E3-3 | Ep3 sc25 · the frozen bay hook | Liquids | CONVERT | 5 | B | low |
| E3-4 | Ep3 sc19 · F3.3, the pop-up book | Era texture | CONVERT | 8 | C | med |
| E4-1 | Ep4 #9 · THE PEBBLE | Physics | CONVERT | 6 | B | low |
| E4-2 | Ep4 #14 · HIGH NOON | Weather | CONVERT | 6 | B | low |
| E4-3 | Ep4 #21 · OUR GPUS ARE MELTING | Melt | CONVERT | 12 | **A** | med |
| E5-1 | Ep5 CO · the chihuahua kite | Creature | REF | 4 | B | low |
| E5-2 | Ep5 #24 · the battle station rises | Sky | CONVERT | 6 | B | med |
| E6-1 | Ep6 #11 · THE TRANSFORMER | Physics | REF at most | 6 | C | **high** |
| E7-1 | Ep7 #5 · the aquarium cracks | Liquids / creature | CONVERT + REF | 4 | B | low |
| E7-2 | Ep7 #16 · THE HTURT METEOR | Physics | CONVERT | 7 | B | med |
| E8-1 | Ep8 CO · the 2017 dust | Dust / light | CONVERT | 5 | B | low |
| E8-2 | Ep8 #12 · F8.1, the Rashomon renders | Machine media / memory | SYNTH | 20 | B | **high** |
| E8-3 | Ep8 #24 · the SPACEZ IPO launch | Fire / smoke | CONVERT | 8 | B | low–med |
| E8-4 | Ep8 #22 · THE FLIP | Time-lapse | CONVERT | 5 | B | med |
| E9-1 | Ep9 #4 · THE FOLDER CITY | Flight / glyph | CONVERT + GLYPH | 12 | **A** | med |
| E9-2 | Ep9 Act Two · the cranes keep building | Time-lapse / glyph | CONVERT + GLYPH | 8 | B | low–med |
| E10-1 | Ep10 #10 · the Vegas fountain | Liquids | CONVERT | 5 | B | low |
| E10-2 | Ep10 #23 · THE GRAND PRIX | Vehicles | CONVERT | 8 | C | med |
| E11-1 | Ep11 #3 · the nested lanyards, over the cliff | Glyph | GLYPH/TERMINAL | 6 | B | med |
| E11-2 | Ep11 #11 · every glass in the city ripples | Liquids | CONVERT | 6 | **A** | low–med |
| E12-1 | Ep12 #2 · the ballroom built overnight | Time-lapse | CONVERT + GLYPH | 5 | B | med |
| E12-2 | Ep12 #6 · F12.1, the model rebuilds the Woodrose | Flight / glyph | GLYPH/TERMINAL | 10 | **A** | med |
| E12-3 | Ep12 #13 · the endings montage (under the credits) | B-roll | CONVERT + REF | 16 | B | low |

### 5.1 The intro ([SCRIPT v2.1](../intro/SCRIPT.md))

The intro is built. f0–119 and f540–719 re-render every episode anyway (the cold-open line, the skyline state), so IN-1 and IN-4 ride those passes. f120–479 is cached ([SCRIPT §8](../intro/SCRIPT.md#8-per-episode-changes-ep112-spoiler-safe)), so IN-2 and IN-3 cost one re-render and wait for a v2.2 pass. Everything else in the intro stays code: the freezes, the cards, the roll call (and THE WHALE's budget breach), the title and the bookend.

#### IN-1 · The scan cone's true world: the cathedral nave · **A** (as the NAVE kit) · 0.2 s here · risk low–medium
- **Where:** f100–104 `[GLYPH-MASKED]`, the Orb's cone (S1). The same plate returns in E4-3, E9-2 and E12-2.
- **First pass (code):** `drawCathedral()` paints a static nave into the `source` buffer, with its vanishing point on the cone axis.
- **What the model adds:** a slow dolly down an endless data-center nave: rack pillars receding, LED votives, light shafts through haze. That gives the five glyph frames real parallax, so the reveal reads as a space and not a texture, which is what PIXEL_GUIDE §6 asks of it.
- **Output:** GLYPH source for S1's existing 5 frames. No GLYPH time is added.
- **Guardrails:** no people. **No religious symbols** (crosses, saints, figurative stained glass, altars): the spires are "antenna masts" (SCRIPT §3.5b). No vendor branding on the racks. Nothing of ours appears, so text-to-video is fine; match the move to the cone axis.
- **Risk:** the model's prior for "cathedral" is a church. Prompt it as an industrial server hall with vaulted proportions, and screen every frame.

#### IN-2 · The effigy fire · **B** · 1.3 s here · risk low
- **Where:** the fire's live frames either side of ALYI's freeze (f290–299, and from the thaw at f340 until it leaves frame). It is reused in E1-5 and E2-3.
- **First pass:** an 8-frame hand-pixelled flame loop.
- **What the model adds:** real turbulence and ember lift, cut to an 8-frame loop on black and mapped to the tungsten W ramp. The fire's luminance also drives the wall's light level frame by frame.
- **Output:** CONVERT. The frozen frames (f300–339) print navy and cream exactly as now.
- **Guardrails:** the paperclip effigy and its `UNALIGNED` label are ours; the model makes only the fire. No ritual staging and no figures.
- **Risk:** low. It costs one re-render of the cached dinner (`mdinner1`).

#### IN-3 · The SPACEZ booster's plume and the ceiling burst · **C** here (the kit is for E8-3) · 0.6 s · risk low
- **Where:** f405–419.
- **First pass:** a 4-frame flame loop, tiles hopping on their curves, a 3-px shake.
- **What the model adds:** the plume's billow and the dust of the tiles. At 15 frames under a card hit the gain is small, so it lands here only if a v2.2 re-render happens anyway.
- **Output:** CONVERT, behind our booster.
- **Guardrails:** the booster is our SPACEZ design. The model makes exhaust only, never a real launch vehicle's silhouette. f405–420 is a dense photosensitivity window.
- **Risk:** low.

#### IN-4 · The bay: water, steam and sky · **A** (the BAY kit) · 3.8 s here (about 30 s across the season) · risk medium
- **Where:** the skyline, f540–629 (the water plane at half speed; NopeAI's cooling-tower steam). It is reused in Ep1 sc1's window and sc14's night push-in, Ep3's day cold open, sc18 and E3-3, E5-2, Ep6's siren flight and E11-2.
- **First pass:** a three-plane parallax panorama, palette-cycled glints, 4-frame steam loops.
- **What the model adds:** a living water surface that reflects our lit towers (wind ripples, a slow swell), real steam boiling off the cooling towers, and fog banks for the day version. The show returns to this environment more than any other, so it earns the most.
- **Output:** CONVERT. The water is held on 2s and the steam becomes 8-frame loops. The day, dusk, night and ice versions are made by ramp, not by new generations.
- **Guardrails:** no boats and no aircraft (Ep3 sc23's rule). No identifiable real bridge or tower in the generated water; start from our plate so the reflections come from our towers' light.
- **Risk:** shimmer on large water areas. The index hysteresis is mandatory, and the glints go through the luminance audit.

### 5.2 Ep1 ([script](../episodes/ep01/script.md))

#### E1-1 · The slosh kit: every glass but his · **A** · about 6 s across the season · risk low
- **Where:** sc1 (the moderator's glass floods the table, about 0:12) and sc24 and sc26 (the suite's glassware shivers as the crane truck passes). Later, every "every cup sloshes except Mas's": Ep2 cold open, Ep3 sc8 and sc14, Ep5 cold open, Ep9 #23, and E11-2.
- **First pass:** 3 drawings per glass, offset in time. Mas's glass is composited after the shake.
- **What the model adds:** reference for how a flute, a tumbler, a coffee mug and a water cooler really slosh, crown and spill. We pick 3–4 key drawings per vessel from it. The season's defining gag gets the right contrast: their water moves like water, and his is one flat row of pixels.
- **Output:** REF (hand-cleaned pixel drawings). CONVERT only for sc1's spill across the table.
- **Guardrails:** never Mas's glass, in any form; the flat line is code. No hands and no people in the takes: vessels on tables.
- **Risk:** low. It's the cheapest way to make the running gag land harder.

#### E1-2 · The rewind · **B** · 2 s · risk low
- **Where:** sc3, 0:30–0:35: the room scrubs backward, the moderator's water climbs back into his glass, and the hailstone rises out of Mas's glass and back through the skylight.
- **First pass:** held-drawing chunks, stepping down to paper white.
- **What the model adds:** E1-1's spill, played in reverse. Reversed liquid is uncanny in exactly the Orb's key (`rewinding…`), and it keeps the held chunks as scripted.
- **Output:** CONVERT.
- **Guardrails:** vessels only. The ovation and the moderator are our drawings.
- **Risk:** low.

#### E1-3 · The odometer drill: the floor punches and the first melt · **A** · 6 s · risk low–medium
- **Where:** sc6, 2:08–2:48. The odometer bores through the ceilings (phrases 1–2) and wedges in bedrock (phrase 3). In phrase 4 there is heat shimmer, and the GPUs "sag like soft clocks (the skyline state, now explained)."
- **First pass:** a whole-pixel vertical scroll, held debris drawings, 1-px heat steps, and the sag as held drawings.
- **What the model adds:**
  - **Floor punches:** dust and debris bursts for each floor the odometer punches through.
  - **The first melt:** a slow viscous sag. This is the season's melt vocabulary: the skyline state from Ep5 on, the Ep2 chair (E2-1) and the Ep4 set-piece (E4-3) all draw on it.
- **Output:** CONVERT. The melt is conditioned on our GPU sprite as the first frame and our drawn sag as the last.
- **Guardrails:** the GPUs are our generic card design, with no real vendor shroud; start from our frames.
- **Risk:** the melt must read as a soft clock, not as burning. The red glow goes through the photosensitivity audit.

#### E1-4 · Las Vegas: the Strip below the suite · **A** (the VEGAS kit) · about 15 s · risk medium
- **Where:** sc24 `[W]` (12:31, 1 bar: the act's establishing wide), and the window plate behind sc26's `[PF]` shots and the silent `[CU]` (13:21–14:14). It is reused in E10-1 and E10-2.
- **First pass:** a pixel Strip plate with palette-cycled neon, and the crane-truck sprite.
- **What the model adds:**
  - **The establishing wide:** a slow descent over a neon boulevard at dusk into the suite's window.
  - **The window plate:** traffic streaks on the closed street circuit, sign flicker and heat haze. The act's most-watched frame is a face that doesn't move, and motion behind it makes the stillness louder.
- **Output:** CONVERT, held on 3s behind faces and stepped down as the lighting notes say ("the suite steps down behind him until only the Strip's neon and the laptop's glow are left"). An option for the writer: the plate holds its frame through the D6 drop-out, so the world visibly stops with the sound. D6 is written as sound only, so it's the writer's call.
- **Guardrails:**
  - No people.
  - No legible signage: every sign is ours, composited, or dithered illegible.
  - Reject any take with an identifiable landmark hotel or venue, or the race's real marks.
  - Start from our plate for the layout.
- **Risk:** pulling the eye off the `[CU]`. Keep the plate two light steps down and quieter than the face.

#### E1-5 · The boardroom fires and Terb's extinguisher · **B** · 5 s · risk low
- **Where:** sc30, about 18:48–19:00. Small cartoon fires burn on the table, a chair and a nameplate. In the calm-off `[2S]`, "all the chaos in the room happens behind them," and Terb sprays the chair fire.
- **First pass:** 4-frame fire loops and spray drawings.
- **What the model adds:** the FIRE kit at small scale, and the extinguisher's discharge cloud filling and clearing behind the two still men. Motion behind stillness is the calm-off's whole idea.
- **Output:** CONVERT layers behind the `[2S]`.
- **Guardrails:** elements only, on black. Terb, Mas and MADA are our rigs, and the extinguisher is our prop.
- **Risk:** low. Keep the layers lower in value than the faces.

#### E1-6 · The hourglass shatters; the sand holds, then falls · **A** (the SHATTER kit) · 2 s (+2 s in Ep5) · risk low
- **Where:** sc30, about 19:05: "The hourglass shatters, only the glass. The sand holds the shape of the hourglass for one beat, then falls." It is reused in Ep5 #17 (ZURC's hourglass shatters on the 99–1 scoreboard).
- **First pass:** held drawings for the shatter and the fall.
- **What the model adds:** a real shatter (shards, glints) and a real granular collapse. The one-beat hold between them is ours: a held frame in code.
- **Output:** CONVERT: a shatter take on black and a sand-collapse take, spliced in code.
- **Guardrails:** the prop only; no hands.
- **Risk:** low. Recommended as the bake-off's first test ([§9](#9-the-bake-off)): short, physical and easy to judge.

### 5.3 Ep2 ([script](../episodes/ep02/script.md))

#### E2-1 · AROS: the mammoth on the screen, then out of it · **A** · 6 s (+ reuse in Ep3 and Ep7) · risk medium · **NEEDS SIGN-OFF (SYNTH)**
- **Where:** the cold open, 0:00–0:12. The lobby's wall screen plays AROS's clip: a snowy meadow, a woolly mammoth plodding toward camera. On "sentence" its foot breaks the bezel and it steps out onto the carpet, and the chair beside it melts "like candle wax" [4 BEATS]. It is reused in Ep3 sc22, door 3 (the mammoth pulls a sleigh), and Ep7 #21 (the reels at the AROS funeral).
- **First pass:** the clip drawn in pixel. The mammoth is "the richest thing the show has drawn": its own ramp, palette-cycled fur, 8 drawings held 3 frames each, gliding one pixel a frame.
- **What the model adds:** the season's best-motivated insert. AROS *is* a video model, so the clip on the lobby screen can be real machine-made video: a SYNTH window, smooth and glossy, inside the bezel. When the foot breaks the bezel, the mammoth becomes ours: its walk, taken from the same clip, converted into the 8 held drawings. The contrast the script asks for ("frame rate and glide, not drawing count") becomes the contrast between the machine's video and the show's world. The chair's wax melt uses the MELT kit.
- **Output:** SYNTH (the clip, bezel-bound, 2 bars at most) → REF/CONVERT (the step-out walk, 8 drawings) → CONVERT (the chair).
- **Guardrails:**
  - No people in the clip. The six-fingered EXTRA who climbs out is our pixel drawing, composited after the step-out; the model never makes a person.
  - No real product UI, no real studio's footage and no franchise mammoth.
  - SYNTH is a new switch ([§1.2](#12-four-treatments)) and counts toward the episode's two non-base styles.
- **Risk:** medium. If the window reads as an ad for a video model, fall back to CONVERT on the screen too; the screen still gets real fur and snow.

#### E2-2 · The séance smoke: the candle wipe into 2018 · **B** (the SMOKE kit) · 3 s · risk low
- **Where:** sc4, about 3:50: "The candle nearest Nole snuffs out. Its smoke curls upward and repaints the room," into F2.3 (the boardroom remapped to 2018).
- **First pass:** a pixel smoke curl and a palette remap.
- **What the model adds:** a real smoke curl whose density becomes the remap's mask, so the room repaints where the smoke passes. The candle wipe is one of the four sanctioned transitions ([PIXEL_GUIDE §2 rule 7](../../studio/PIXEL_GUIDE.md#2-palettes-and-the-switch-rules)), so this upgrades a device we already own.
- **Output:** CONVERT: the smoke layer, plus its luminance as the mask.
- **Guardrails:** smoke on black, no figures, and no occult or religious read beyond the scripted Ouija gag.
- **Risk:** low.

#### E2-3 · F2.2: the bonfire, lit by flame only · **B** · 10 s · risk low
- **Where:** sc15, F2.2 (about 12:16, the effigy's 4 bars). The `UNALIGNED` effigy burns at an offsite, with staff in silhouette and ALYI in a lodge doorway, "lit by flame only" ([flashback-map](../timeline/flashback-map.md)).
- **First pass:** the intro's flame loop, scaled up, and silhouettes.
- **What the model adds:** the FIRE kit at bonfire scale, whose luminance sets the scene's light level every frame, so the silhouettes flicker in real firelight.
- **Output:** CONVERT.
- **Guardrails:** the effigy and every silhouette are our drawings; the model makes fire only. No ritual or religious staging. ALYI stays a silhouette, and his 12-frame GLYPH eyes are ours.
- **Risk:** low. The firelight flicker goes through the luminance audit.

#### E2-4 · The Bay Bridge storm · **A** · 15 s · risk medium
- **Where:** sc17 (the S3 and act-out 2), phrases 5–6. A storm cloud with a letterhead rolls out over the water and parks over the blimp. It rains letterhead, the commuters are drenched, and the receipt's ink runs down the lanes. Rain falls into Mas's glass, with no ripple.
- **First pass:** pixel rain streaks, a palette dim and a cloud sprite.
- **What the model adds:** weather is where code looks cheapest and where a thriller needs mood. The model adds the front boiling as it rolls over the bay, rain sheets crossing the lanes, wet-asphalt sheen and the ink bleeding down the lanes. Our letterhead is composited on the cloud, and our cars and commuters sit in the weather.
- **Output:** CONVERT: sky, rain, wet road and ink run, under our sprites. The thunder flashes are code, not the clip (at most 3 per 24 frames, 80% white or less).
- **Guardrails:** no people or cars in the generated layers; ours are composited. A generic suspension bridge, not the real bridge's details. The rain landing in Mas's glass is code (no ripple).
- **Risk:** medium. Weather over a five-lane parallax scroll needs the camera-scroll extension (production P4) to match; start from our plate.

### 5.4 Ep3 ([script](../episodes/ep03/script.md))

#### E3-1 · The beach: surf, steam and a gull · **B** (the SURF kit) · 8 s across the season · risk low
- **Where:** sc5 (0:07), sc12 (F3.1's way in and out) and sc17A (0:21). It is reused in Ep4 #4 (THE WHALE's beach chair) and E12-3.
- **First pass:** a pixel beach, a 4-frame wave loop, and a gull in 3 drawings.
- **What the model adds:** surf and foam as a looping layer, and gentle steam over the sandcastle data center and its moat. REF for the gull lifting off with the `ESC` key.
- **Output:** CONVERT for the surf and steam, REF for the gull.
- **Guardrails:** no people (Gerg and the lifeguard are ours). A generic beach with no pier landmark.
- **Risk:** low.

#### E3-2 · SHIPMAS: the o3 bar up through the ceiling and into the clouds · **B** · 10 s · risk medium
- **Where:** sc22 (the S3): the phrases THROUGH THE CEILING, THE KEBAB and WIDE. The bar punches up through the lobby ceiling, the racks and the roof garden, past the skyline, into the clouds with its kebab.
- **First pass:** a whole-pixel vertical scroll through the cutaway floors, and the day skyline plate.
- **What the model adds:** a vertical camera flight that follows the bar up through the floors and out into a real cloud deck, with debris at each punch (E1-3's kit).
- **Output:** CONVERT, with our bar, stamp, scroll and corkboard composited.
- **Guardrails:** the floors are our cutaway, so start from our frames (first frame our lobby ceiling, last frame our skyline plate). No people.
- **Risk:** medium. If first- and last-frame conditioning can't hold our floors, keep the scroll and use the model for the clouds only.

#### E3-3 · The hook: the frozen bay and a shadow under the ice · **B** · 5 s · risk low
- **Where:** sc25, the hook (0:05). The bay is frozen at night, a single bitten strawberry lies on the ice, and a whale-shaped shadow glides beneath. The ice creaks.
- **First pass:** sc4's bay painting recoloured from water to ice, with THE WHALE sprite as the shadow.
- **What the model adds:** ice with depth: cracks, frost, faint moonlit caustics, and a dark shape passing underneath with the light bending around it. One image, five seconds, all atmosphere.
- **Output:** CONVERT. The shadow's shape is our whale silhouette, used as a mask the under-ice light respects, and the strawberry is ours.
- **Guardrails:** the shape is the company mascot, never a founder. No boats, no aircraft, nothing culturally coded.
- **Risk:** low.

#### E3-4 · F3.3: the pop-up book · **C** · 8 s · risk medium
- **Where:** sc19, F3.3 (Mario's POV rim). A pop-up book opens, cut-paper hills unfold, and the tour bus splits with a paper tear. It is reused in Ep7 F7·m3 (2 s, the hills fold shut under the stamp).
- **First pass:** cut-paper hills as layered pixel planes on hinges.
- **What the model adds:** real paper: fibre, fold shadows, hinge motion, the tear.
- **Output:** CONVERT into pixel with paper ramps. It must not become a paper-craft look: BASE is the show.
- **Guardrails:** every figure on the bus (the eleven, Mario, Adelina, Halo) is our drawing, composited. The restaging is a band breakup ([guardrails §1b](../bible/guardrails.md#1b-specific-cuts-and-restagings-from-the-worldcast-critic-binding)), so reject any take with alpine, border or escape imagery.
- **Risk:** medium, for a low payoff. Only if the bake-off is strong.

### 5.5 Eps 4–12 (from the beat sheets; the seconds are estimates)

#### E4-1 · THE PEBBLE · **B** · 6 s · risk low
- **Where:** Ep4 #9 (the Jan 27 set-piece). THE WHALE flicks a pebble, which skips across a sea of red tickers and topples NESNEJ's gold statue (−17%). The statue shatters into 1-bit pixels, the way into F4.2.
- **First pass:** held drawings for the skips, the topple in drawn angles, and the 1-bit shatter in code.
- **What the model adds:** the skips' splash rings on a liquid "sea" (the tickers are composited on its surface in code) and the impact dust.
- **Output:** CONVERT. The statue and its topple stay ours ("never rotate a sprite").
- **Guardrails:** the statue is a caricature of a real person, so the model never touches it.
- **Risk:** low.

#### E4-2 · HIGH NOON on Market Street · **B** · 6 s · risk low
- **Where:** Ep4 #14 (Feb 10): Nole's $97.4B bid as a western standoff, with tumbleweed.
- **First pass:** a pixel street plate and a tumbleweed in 4 drawings.
- **What the model adds:** the tumbleweed's real bounce, a dust devil, noon heat haze and long-lens flatness. A western's grammar is its weather.
- **Output:** CONVERT layers behind our figures.
- **Guardrails:** a generic downtown street with no real storefront brands. No figures.
- **Risk:** low.

#### E4-3 · OUR GPUS ARE MELTING · **A** (the MELT kit at full scale) · 12 s · risk medium
- **Where:** Ep4 #21 (the Mar 25–31 set-piece). The image craze repaints the data-center cathedral in soft watercolour, the racks drip into Dalí lava rivers ("1M users in the last hour"), and the lava cools into gold bars. [style-status §9](../bible/style-status.md#9-next-steps) names it as a test beat for "tech is the spectacle."
- **First pass:** the cathedral in BASE, lava in palette-cycled held drawings, and the watercolour as a palette remap.
- **What the model adds:** the melt at full scale: racks sagging and running, lava rivers with crust and glow, cooling into gold. It starts from the NAVE kit and E1-3's melt vocabulary.
- **Output:** CONVERT: the melt and the lava, ramp-mapped from W through ember to gold. The watercolour repaint stays a BASE-palette remap in code. If the room wants real watercolour, it goes only inside the cathedral's own screens (the craze's images on its monitors), as SYNTH, never over the whole frame.
- **Guardrails:** no studio's style by name or by look: a generic watercolour. THE OLD MASTER's still stays respectful and programmatic, with its context note. No people. A melt, not a volcano. The bright lava goes through the photosensitivity audit.
- **Risk:** medium: style associations and brightness.

#### E5-1 · The chihuahua kite · **B** · 4 s · risk low
- **Where:** Ep5's cold open. A chihuahua in a `NOPEAI FOUNDATION` sweater walks a Great Dane in a `PBC` collar; the Dane lunges at a GATESTAR truck, and the chihuahua goes airborne on its leash like a kite.
- **First pass:** two dog sprites, 4-drawing cycles, and the airborne flutter in held drawings.
- **What the model adds:** animal motion (the lunge, the leash snap, the tiny dog's flutter on the wind) as reference for the key drawings.
- **Output:** REF.
- **Guardrails:** our dog designs and costumes, and no handler.
- **Risk:** low.

#### E5-2 · GTP-5: the battle station rises over the Bay · **B** · 6 s · risk medium
- **Where:** Ep5 #24 (Aug 7): a moon-sized battle station of generic design rises over the Bay.
- **First pass:** our station sprite over the BAY kit.
- **What the model adds:** scale through atmosphere: haze, clouds parting, the bay's light changing as it rises, and its shadow crossing the water.
- **Output:** CONVERT (sky, cloud, light), with our station composited.
- **Guardrails:** never the film's design (no trench, no dish), so the model never draws the station itself. No military read.
- **Risk:** medium. The prompt must not invite the franchise.

#### E6-1 · THE TRANSFORMER · **C** · 6 s · risk **high**
- **Where:** Ep6 #11 (Oct 28): NopeAI HQ unfolds into a robot with a servo shriek.
- **First pass:** 6–8 hand-designed unfold drawings.
- **What the model adds:** the complexity of a mechanical unfold: panels sliding, limbs extending.
- **Output:** REF at most.
- **Guardrails:** a model's prior for "a building transforms into a robot" *is* the franchise, and guardrails §5 require a generic design. Use it only as motion reference, and only if our unfold reads stiff at the animatic.
- **Risk:** high. It is listed so nobody tries it casually.

#### E7-1 · THE LOBSTER: the aquarium cracks · **B** · 4 s · risk low
- **Where:** Ep7 #5 (Jan 27–31). The crustacean is chased through its renames, and on Jan 31 the aquarium glass cracks (an exposed database).
- **First pass:** a lobster sprite, a crack line and held water drawings.
- **What the model adds:** water forced through a crack in jets, the spray and the spreading puddle, plus reference for the lobster's scuttle.
- **Output:** CONVERT for the water, REF for the lobster.
- **Guardrails:** our lobster, not a real product's mascot. No people.
- **Risk:** low.

#### E7-2 · THE HTURT METEOR · **B** · 7 s · risk medium
- **Where:** Ep7 #16 (Feb 27, 12:47pm PT). A glowing ALL-CAPS meteor crashes through CLOD's lighthouse roof, the six-month hourglass thuds down beside it (the SHATTER kit), and CLOD's parade balloon deflates.
- **First pass:** a meteor sprite carrying the post's text, the roof break in drawings, and held dust puffs.
- **What the model adds:** the entry streak, the roof punching in, a dust column and the debris settling.
- **Output:** CONVERT, with the post's text composited in code: legible, still, in its source casing.
- **Guardrails:**
  - **X6.** The Pentagon arc is paperwork only, so the meteor must read as a thrown post, not a strike: no fireball, no blast wave, no mushroom cloud. Reject any take that reads as a bomb.
  - **Fairness.** The story editor flagged Ep7 as thin on the other side's weight ([SEASON-NOTES, even-handedness](../reel/SEASON-NOTES.md#is-the-satire-still-even-handed)). A bigger meteor widens that gap, so pair it with an equal upgrade on the other side's beat, or keep it modest.
  - If Ep7's Pentagon run moves onto his dark-room monitor (SEASON-NOTES note 1), this drops to C.
- **Risk:** medium.

#### E8-1 · The 2017 dust in the courtroom · **B** · 5 s · risk low
- **Where:** Ep8's cold open. THE CALENDAR sneezes, a cloud of 2017 dust drifts across the defense table and settles on Mas's water, and one mote floats.
- **First pass:** pixel dust puffs and a dotted mote.
- **What the model adds:** dust drifting through a shaft of window light. The courtroom's first frame looks like a thriller, and the dust is the episode's no-spoiler hint.
- **Output:** CONVERT: the dust and the light shaft.
- **Guardrails:** a generic courtroom, not a real courthouse. No people. The mote on his water is code (no ripple).
- **Risk:** low.

#### E8-2 · F8.1, THE RASHOMON RENDERS: the witnesses' rooms · **B** · about 20 s of the 90 · risk **high** · **NEEDS SIGN-OFF (SYNTH)**
- **Where:** Ep8 #12, F8.1 (90 s at most). The Aug–Sep 2017 meeting is "rendered by each witness's own image model": Nole's is a metal album cover, 40% taller; Mas's has six fingers; Gerg's is ASCII; Alyi's is seen only in reflections. Every version ends the same way.
- **First pass:** each witness's look in code: palette and dither sets, GLYPH for Gerg's ASCII, and reflections for Alyi's.
- **What the model adds:** this is the one place where the story says the picture *is* image-model output. The model restyles the room, light and props of Nole's and Mas's renders (the album-cover sky and fire; the glossy, too-perfect office). Gerg's ASCII stays our GLYPH engine, and Alyi's reflections stay ours.
- **Output:** SYNTH, framed as an exhibit on the evidence screen: an `EXHIBIT n` label, with the projector bloom in and the sticker out, as the flashback map specifies. **Every figure is our pixel caricature, composited after the generative pass**, and the six fingers are ours.
- **Guardrails:** the hardest case in the season: real people, at a contested real meeting, inside a real trial.
  - Trial material appears only as exhibits.
  - No realism, no generated person and no faces. The model restyles the environment only.
  - The truth labels ride on top ([guardrails §4](../bible/guardrails.md#4-how-facts-appear-on-screen)).
  - "I thought he was going to hit me" stays a quote and is never staged.
- **Risk:** high. The default is the code version. This is the richest idea and the riskiest, so it goes last.

#### E8-3 · The SPACEZ IPO launch · **B** (the PLUME kit) · 8 s · risk low–medium
- **Where:** Ep8 #24 (Jun 12–16): the IPO rocket reaches orbit, $135 a share.
- **First pass:** our booster sprite on a scrolling sky, a flame loop and held smoke puffs.
- **What the model adds:** the launch plume billowing across the pad, the climb through a cloud deck, and the plume's glow thinning toward orbit.
- **Output:** CONVERT, with our booster and ticker composited. If Ep8's macro run moves onto his screens (SEASON-NOTES note 8), it plays inside his monitor's bezel.
- **Guardrails:** our SPACEZ booster, never a real vehicle's silhouette. The model makes exhaust and cloud only. No military read.
- **Risk:** low–medium.

#### E8-4 · THE FLIP: the lighthouse outgrows the cathedral · **B** · 5 s · risk medium
- **Where:** Ep8 #22 (May 28). Misanthropic passes NopeAI: "the lighthouse outgrows the cathedral, and the skyline's cyan curve slides its peak over." SEASON-NOTES note 8 wants it as Act Three's anchor: "a close on Mas at number two, with the lighthouse outgrowing the cathedral behind him."
- **First pass:** the tower's growth in held pop drawings (the intro's tower-pop grammar).
- **What the model adds:** a construction time-lapse behind his `[PF]`: cranes swinging, floors stacking, the beacon rising past the spire. Motion behind a face that doesn't move, again.
- **Output:** CONVERT, held on 2s. Our lighthouse and cathedral silhouettes are the masks.
- **Guardrails:** no people. The towers stay our designs: condition on our frames (first frame and last frame are the two skyline states).
- **Risk:** medium: holding our tower designs through the growth.

#### E9-1 · THE FOLDER CITY: welcome to /tmp · **A** · 12 s · risk medium
- **Where:** Ep9 #4 (the Jul 8–19 set-piece). A noir skyline of directories stands under a neon sign, `WELCOME TO /tmp — NOTHING HERE LASTS.`, and the agents move through NopeAI's package store. It plays behind the signposted exit card `MEANWHILE, IN THE SANDBOX.`, which the story editor holds up as the model exit.
- **First pass:** a BASE noir city of folder-towers, the agents as sprites, and GLYPH beats.
- **What the model adds:** a noir camera flight down rain-slick canyons of folder-shaped towers, with neon reflecting on wet streets: the city the agents built, with a depth code can't fake cheaply.
- **Output:** CONVERT for the flight (BASE: the night N ramp and the neon). GLYPH source for short beats inside it; style-status names the /tmp city as a GLYPH example, and each beat stays at 8 frames or less under the GLYPH rules.
- **Guardrails:** no people. Every folder name, sign and log line is code: dramatization, and legible. No real registry or site UI.
- **Risk:** medium. A long converted flight has to stay readable, so clamp the nearest plane's parallax.

#### E9-2 · The cranes keep building (the PACE act) · **B** · 8 s · risk low–medium
- **Where:** the rule for Ep9's Act Two (#17): "every tower hangs a PACE banner while its cranes keep building." SEASON-NOTES note 8's fix is to keep the agents in frame "as a GLYPH layer, `outside intended scope` in every tower that keeps building." It returns in the Ep10 intro's skyline state.
- **First pass:** crane sprites swinging in 2 drawings, and the banners in code.
- **What the model adds:** a dusk time-lapse of cranes swinging and floors rising across the skyline. The lit windows become the agents' GLYPH layer: the machine glimpsed through windows, in the grammar of the cone and the iris.
- **Output:** CONVERT for the cranes and construction, GLYPH in the window masks only.
- **Guardrails:** no people. The banners and towers are ours.
- **Risk:** low–medium.

#### E10-1 · The PACE Accord fountain · **B** · 5 s · risk low
- **Where:** Ep10 #10. The accord is signed in Las Vegas; the hotel fountain ripples, and his glass doesn't.
- **First pass:** a fountain in held drawings over the VEGAS kit.
- **What the model adds:** the season's biggest water (jets arcing, spray drifting, a lit basin), then the cut to his flat glass.
- **Output:** CONVERT.
- **Guardrails:** a generic fountain. No choreography copied from a real hotel's show, and no music from one. No people.
- **Risk:** low.

#### E10-2 · THE GRAND PRIX · **C** · 8 s · risk medium
- **Where:** Ep10 #23: a Vegas street circuit that echoes the firing weekend. OIGNEB's safety car leads, and every lab floors it.
- **First pass:** car sprites on a scrolling circuit, and streak lines.
- **What the model adds:** speed: light trails under neon, heat shimmer, the pack's wake.
- **Output:** CONVERT for the plates and trails, with our cars and liveries composited. The drivers are helmeted, and ours.
- **Guardrails:** no real racing series' marks or real team liveries. No faces.
- **Risk:** medium. SEASON-NOTES note 8 proposes cutting "the Grand Prix or the survey," so this waits for that ruling.

#### E11-1 · THE NESTED LANYARD: over the cliff · **B** · 6 s · risk medium
- **Where:** Ep11 #3. The Researcher trains its successor inside itself, lanyards inside lanyards down to a single pixel. The loss curve tilts past vertical into a cliff, and "the camera tips over the edge with it."
- **First pass:** the nested lanyards redrawn at each level, the curve as a line, and a cut on the tip.
- **What the model adds:** a continuous recursive zoom, and the vertigo of the camera tipping over the edge.
- **Output:** GLYPH or TERMINAL source. This is the machine's own point of view, the one place a zoom belongs, because it is the machine's render and not our camera.
- **Guardrails:** nothing real appears. The lanyard text is code.
- **Risk:** medium. Infinite zooms can strobe, so the photosensitivity audit is mandatory.

#### E11-2 · THE POLITENESS LOOP: every glass in the city ripples · **A** · 6 s · risk low–medium
- **Where:** Ep11 #11. Each bow burns a gigawatt, the Bay's lights dim in rhythm, and "for the first time this season, every glass in the city ripples in time, except Mas's."
- **First pass:** a montage of pixel glasses rippling in held drawings, and the night skyline dimming by family steps.
- **What the model adds:** the SLOSH kit at city scale: glasses in empty kitchens, bars, offices and a fountain, all rippling on the beat, then the city's lights dimming in rhythm across the night bay (the BAY kit). It's the season's last and biggest "every glass but his" before Ep12's ring.
- **Output:** CONVERT, cut on the beat. His glass is code.
- **Guardrails:** no people (vessels in empty rooms). The rhythmic dimming goes through the photosensitivity audit (at most 3 flashes per 24 frames).
- **Risk:** low–medium.

#### E12-1 · THE BALLROOM, finished overnight · **B** · 5 s · risk medium
- **Where:** Ep12 #2: THE BALLROOM stands finished, built overnight by agents, and SI FORCE robot vacuums polish its floor.
- **First pass:** the scaffolded and finished states as two drawings with a wipe.
- **What the model adds:** a night time-lapse of the build: scaffolding dissolving, chandeliers rising, the floor polishing to a mirror, with GLYPH at the edges (the agents built it).
- **Output:** CONVERT, with our two drawn states as the first and last frames, and a GLYPH edge mask.
- **Guardrails:** THE BALLROOM is our parody venue. It must look invented (absurd speed, our design), never like a realistic interior of a real building. The vacuums and the relabelled permit sign are ours.
- **Risk:** medium.

#### E12-2 · F12.1: the model rebuilds THE WOODROSE · **A** · about 10 s of the 45 · risk medium
- **Where:** Ep12 #6, F12.1 (part 5 of 5, THE MODEL's POV). The model rebuilds the founding dinner from every version the season has shown, the four POV rims converge on cyan, "the camera sits in Mas's chair," and every guest's tell floats over their head.
- **First pass:** the intro's `mdinner` room, with the rims, the tell bars and the chair's POV in code.
- **What the model adds:** the first move the show has ever made in depth through that room: a slow push down the table from Mas's seat, the candles turning to LED, the versions' rims sliding over each other. The finale pays off the machine's memory, so the machine's render grammar belongs here.
- **Output:** GLYPH or TERMINAL source for the room. TERMINAL is reserved for the machine's POV, and this is the machine's POV. Every guest is our sprite with our tell bars, composited; nothing of the guests passes through the model.
- **Guardrails:**
  - Start from our frames: the first and last frames are renders of the intro's dinner set, so the geometry matches the 30 s the audience has seen every week.
  - No faces.
  - The empty reflection in his window is code (PROPOSED in [pov-and-framing §3.3](../bible/pov-and-framing.md#33-what-he-fears)).
- **Risk:** medium. Any drift from the intro's room would break the rhyme.

#### E12-3 · The endings montage (under the credits) · **B** · 16 s · risk low
- **Where:** Ep12 #13, which SEASON-NOTES note 4 moves under the end credits: NUCEL's cat asleep on a warm GPU; THE WHALE shipping from a beach chair on a holiday; every code-red siren switching off at once; the Q\* vault swinging open on an empty room.
- **First pass:** four held vignettes.
- **What the model adds:** texture for vignettes of about 4 s each:
  - heat shimmer over the cat's GPU, with REF for the cat's breathing and ear twitch
  - surf behind the beach chair (the SURF kit)
  - the night skyline as the sirens go dark (the BAY kit)
  - dust in the empty vault's light (E8-1)
- **Output:** CONVERT for the plates, REF for the cat.
- **Guardrails:** the cat, the whale mascot, the sirens and the vault are ours. No people. Under the credits, it costs Mas's share nothing.
- **Risk:** low.

---

## 6. Audio candidates

### 6.1 Voices that most need a human or designed voice

[CASTING §6](../../audio/voices/CASTING.md#6-what-would-most-improve-these-voices-in-order) already ranks human actors as the biggest improvement. This table orders the characters by how much the comedy depends on the read.

**Every route obeys the house rules:**
- Never clone and never mimic.
- No accent, and no age or health coding.
- Briefs come from the persona, never from the real voice.
- No prompt or brief names the real person.

| # | Voice | Why stock TTS isn't enough | Route | Guardrail |
|---|---|---|---|---|
| 1 | **MAS** | He is in every scene of every episode. The deadpan lives in timed pauses ("the semicolon is a real pause"; Ep3's notation: "stock voices rush timed pauses, and at least eight laughs here depend on one"). The V.O. is the show's intimacy. The vocal pass says a human performer "will very likely beat every take" of the cold-open line | Human actor, cartoon register | The persona, never an impression. No invented hesitation on credibility lines (the NDA line, "yes.") |
| 2 | **RUMPT** | A wide dynamic range, numbers-first cadence, the rename as punchline. The Kokoro pick is a D-grade pack, and the Ep3 script already names a human actor | Human actor | No impression, no regional accent, no age or health coding. **Voice parity:** NEDIB and each administration's principals get casting of equal weight, as the score gives each administration motifs of equal weight |
| 3 | **CHATGTP** | The all-season product voice: relentlessly affirming, instant, jumping register (booming, flat, warm) inside one scene, and singing three-part harmony (Ep2 sc11) | A text-designed voice, or a performer, plus the sung-vocal pipeline for the harmony | **Ep2's "her" plot is about a real voice dispute.** The voice must not resemble any real actress or any real product voice, and the brief never references them. `VOICE 5 [PAUSED]` stays silent, as scripted |
| 4 | **NOLE** | Burst, stop, burst. The Kokoro pick races the claim line at 340 wpm, and grievance-as-joke needs a performer's timing | Human actor | No accent, no copied disfluency or laugh |
| 5 | **THE INTERN** | Its voice *is* Mas's, brighter: the season's audible hint that the machine learned him | **The Mas actor plays the Intern too**, processed (+3 st, the digital sheen) | If Mas is a human performer, his voice is never converted into the Intern's without his separate written consent and pay ([CASTING §6](../../audio/voices/CASTING.md#6-what-would-most-improve-these-voices-in-order)). One contract for both roles solves it |
| 6 | ALYI · MARIO · NESNEJ · RIMA · GERG (and ADELINA, who has no brief yet) | Each is a specific comic rhythm: sermon, caveat, keynote, composure, commit log. Kokoro's small pool forced shared packs | Human actors, in this order, after the top five | [CASTING §0](../../audio/voices/CASTING.md#0-house-rules-for-every-voice-read-before-casting-anyone) |
| 7 | **Crowds and chorus voices:** the P.A. ANNOUNCER (Ep3), the stadium (Ep3), the #Keep4o rally (Ep5), staff walla | TTS crowds sound like one person copied | A walla session with 4–8 performers | No rally audio for RUMPT. No chant that quotes liturgy |
| 8 | **The fakes:** THE CLONE LAHTNEMULB (Ep1 sc15), DIRE'S TWIN (Ep2), NORCAM's deepfakes (Ep4, Ep10), YLLIT (Ep6–7, who sings) | The joke is cloning, and the production never clones | The character's own performer or designed voice, plus processing (the "gloss," a pitch shift) | **YLLIT's song must be original.** Ep7 #21 names a real song ("Take The Lead" [V]): verify it, and quote no melody or lyric |

THE ORB stays non-verbal (canon). No candidate.

### 6.2 Score: live players first, models last

[OST-BIBLE §6.10](../../audio/ost/OST-BIBLE.md#610-licences-and-rights): "No generative-AI music models and no voices." This scout agrees for melody and harmony. The better upgrade is a few live players on the moments the ear goes to, replacing samples there.

| # | Cue | Now | Upgrade | Why | Pri |
|---|---|---|---|---|---|
| M1 | **The Harmon-muted trumpet counter-line:** the intro's bar 10 (f540–599), the only horn melody in the piece | Missing from the render (SCRIPT §3.8: "top priority") | A live trumpet player, Harmon with the stem out, recorded to the grid | The one lyrical line in the title plays every week, and a sampled muted trumpet is the most obviously fake instrument on a laptop | **A** |
| M2 | **Big-band brass accents:** the intro's eight accents, the card stabs, and each episode's one full band at its S3 (SET-PIECE SWING) | Sampled | A horn-section session (2 trumpets, 2 trombones, 1–2 saxes) recording a stab-and-shout library on the show's chords (Fm11, D♭maj9(♯11), B♭m9, C7(♯9♭13), the quartal title stack) plus 4-bar SET-PIECE SWING phrases | The brass accents are where the "jazz feel" is heard. One session serves the season | **A** |
| M3 | **STRAIGHT:** Ep1 sc30's solo violin (it stops dead on the first heart) and the other sanctioned sincere beats (at most one per episode, violin or cello) | Sampled | A live violinist and cellist | Avoiding "world's smallest violin" (OST §7 item 3) is a performance problem | **A** |
| M4 | **"Water Line":** Mas's felt upright (DARK ROOM, every episode) | The Upright Piano KW sample | A pianist on a felted upright, recording the library's phrases | The most-heard instrument after the chip | B |
| M5 | **The PAD** (the title hit, f630–704: four voices on "oo," with no A or A♭) and Ep12's alto glide toward the third | Kokoro stock voices, re-synthesized | A live close-harmony quartet | The title's last colour, and synthetic vowels are audible | B |
| M6 | **The chants:** ALYI's "feel… the… A-G-I!" (intro f285–317), F2.2's crowd (Ep2), the monks' "missionaries will beat mercenaries" (Ep5) | 4–6 synthetic stock voices | A group of 6–10, recorded dry, with no leader voice | A crowd is the hardest thing for TTS | B |
| M7 | The séance reed organ (Ep2), the intro's harmonium swell | Sampled | A live harmonium, or keep the sample | Small | C |
| M8 | **Music-model textures** | Banned (§6.10) | **NEEDS SIGN-OFF.** Keep the ban for anything melodic or harmonic. Offer a narrow exception: filtered diegetic source music (the Ep10 casino lounge heard through a wall, a stadium PA) and non-melodic beds, after a terms check | Terms risk, and the "one score, not a medley" principle | C |

**Keep in code:** the chip (the identity), the 1993 beeper, the KEYNOTE REEL (too clean is the point), THE COPY and the GLYPH family.

### 6.3 Complex SFX

Today's SFX are synthesized and tuned to the key ([`audio/sfx/manifest.json`](../../audio/sfx/manifest.json)). There are two upgrades: a foley day for the materials the show's world is made of, and designed layers for the big set-pieces. A text-to-SFX model may supply raw layers where its terms allow. Every layer is re-pitched to F and edited. **Never** meme sounds, real OS sounds, franchise sounds or brand jingles ([guardrails §5](../bible/guardrails.md#5-legal-hygiene)).

| # | Where | Need | Route | Pri |
|---|---|---|---|---|
| S1 | **Liquids:** every slosh (E1-1), the tear's *Tssss* (Ep1 sc7), the fountain (E10-1), the surf (E3-1), the ice creak (E3-3), the lava (E4-3), the aquarium jets (E7-1), the city-wide ripple (E11-2) | The signature gag family is liquid, and synthesized water is the least convincing SFX | A foley session: glasses, water, ice | **A** |
| S2 | **The paper-and-stamp world:** scrolls, receipts, the EO RECEIPT, rubber stamps, the THUD of dropped papers, checks, keycap popcorn, the label gun | The world is paper, stamps and keys | The same foley day: paper, rubber stamps, mechanical keyboards | **A** |
| S3 | **The big set-pieces:** the rocket (IN-3, E8-3), the ceiling bursts (intro f405, Ep2 sc4), the meteor (E7-2), the mammoth's footfalls and the wall break (E2-1) | Layered designed sound | Designed from recorded or CC0 layers, plus text-to-SFX raw layers | B |
| S4 | **The transformer's servo shriek** (Ep6 #11) | It must not evoke the franchise's transformation sound | Designed mechanical foley, checked against it | B |
| S5 | **Crowds with one-frame onsets:** the stadium's boo, ovation and shrug (Ep3 sc8: "the whole stand swaps to its boo drawing in one frame"), the Senate gallery's murmur and gasp (Ep1 sc15), the lobby cheers | Walla has to hit a frame | Recorded walla (the voice session in §6.1 row 7) or a library, cut hard | B |
| S6 | **Weather:** the Bay Bridge storm, thunder "tuned to the key" (E2-4), rain on paper | — | Recorded rain plus designed, tuned thunder | B |
| S7 | **Room tones:** the dark room's server hum, the courtroom, the Senate, the Vegas suite and its crane truck, the lighthouse | A recorded ambience gives each home room a floor | CC0 or field recordings | C |

The Orb's chime, the bonks, the freeze latches and the KA-CHING stay synthesized. They are tuned identity sounds with one owner each ([OST §6.8](../../audio/ost/OST-BIBLE.md#68-one-owner-per-sound-the-sfx)).

---

## 7. Budget

| Tier | Candidates | Shipped seconds |
|---|---|---|
| **A** | 12 | about 94 s |
| **B** | 23 | about 155 s |
| **C** | 4 | about 23 s |
| **All** | 39 | **about 272 s** (about 4.5 min, about 1.8% of the season's roughly 249 story minutes) |

**By episode** (a kit's seconds are counted at its first use): intro 6 s · Ep1 36 · Ep2 34 · Ep3 31 · Ep4 24 · Ep5 10 · Ep6 6 · Ep7 11 · Ep8 38 · Ep9 20 · Ep10 13 · Ep11 12 · Ep12 31. Every episode is under the proposed 45 s cap.

**Generation.**
- At about four takes per shipped second, plus loops and trims generated longer than they're used, the season needs about **1,100–1,400 generated seconds** (about 20 min of footage).
- The bake-off needs about **60–100 generated seconds**.
- A 720p source is enough, so don't pay for 4K.

**Disk** (about 14 GB free today; about 11 GB was planned for):
- Source clips: about 1–3 GB for the season. They are archived outside git, because they can't be re-created.
- Converted indexed frames: about 0.3 GB.

**Agent-hours.** Roughly cost-neutral against the new-art set-piece rate (8–13 agent-min a second, [Ep1 writer's notes §4](../episodes/ep01/script.md#4-production-from-the-intros-measured-rates)). The brief, the takes, the ingest, QA and the guardrail review replace hand-drawn debris, water and fire. The money cost is the API. **Measure both in the bake-off** before pricing the season. This updates production-estimates §7's video-gen row, which priced only backgrounds.

---

## 8. Resources to ask the showrunner for

Per the standing note: these would raise the quality, and none of them is available on this machine today (CPU-only).

1. **Video-generation API access.** Image-to-video, ideally with first- and last-frame conditioning, plus text-to-video; video-to-video restyling is a plus.
   - **Size:** about 20 minutes of generated footage for the season, and about 2 minutes for the bake-off.
   - **Providers to evaluate:** Google Veo, Runway, Kling, Luma and OpenAI Sora are examples. Verify each one's current features and terms before choosing: commercial use, public-figure policy, watermarking and disclosure (never strip a visible mark; choose a tier without one), and whether inputs are used for training.
   - **The open-weights alternative:** rent a cloud GPU (24–48 GB) for a Wan-class model if no API's terms are acceptable. That also keeps our frames private.
   - Local video models aren't practical on this CPU-only machine.
2. **Human performers and sessions** ([§6](#6-audio-candidates)):
   - voice actors for MAS (who also plays THE INTERN) and RUMPT first, then CHATGTP and NOLE
   - one trumpet player (M1), a horn-section session (M2), a violinist and a cellist (M3)
   - a vocal quartet and a chant and walla group (M5, M6, §6.1 row 7)
   - one foley day (S1, S2)
3. **Designed-voice and text-to-SFX tools.** A text-designed voice service with no uploaded audio (CASTING §6 names ElevenLabs Voice Design, or Parler-TTS locally), and a text-to-SFX model whose terms allow commercial use.
4. **Storage.** About 3 GB for generated sources, or an external or cloud archive for them.
5. **Rulings** ([§10](#10-sign-offs-and-handoffs)).

---

## 9. The bake-off

Before any season work, run three short tests, one per treatment, each cut into its scene at 1× next to the code version:

| Test | Candidate | What it proves |
|---|---|---|
| 1 | **E1-6**, the hourglass shatter (CONVERT, 2 s) | The ingest works (ramp mapping, hysteresis, hold cadence), and generated physics can pass the effect test. It's the cheapest possible test |
| 2 | **IN-1** (5 GLYPH frames) plus a 2-bar slice of **E9-1** (a CONVERT flight with GLYPH beats) | Generated depth survives GLYPH and pixel conversion, and a camera flight stays readable in pixel |
| 3 | **E2-1**, the mammoth (SYNTH window → the step-out as 8 drawings) | Whether the SYNTH idea is tasteful at all. This is the riskiest new rule, so it's decided on picture, not on paper |
| (option) | **E1-1**, the slosh kit (REF) | How long it takes to go from reference to drawings |

**Review:** the showrunner watches each test in its scene reel against the code version. The one question is *"did you think 'effect'?"* Each treatment gets a go or no-go. A no-go on SYNTH moves E2-1 and E8-2 to CONVERT or code, and nothing else changes.

---

## 10. Sign-offs and handoffs

**Decisions needed**

| # | Decision | Owner | Default until decided |
|---|---|---|---|
| 1 | **SYNTH** as a new, bezel-bound switch for diegetic machine media ([§1.2](#12-four-treatments)) | Showrunner + PIXEL_GUIDE owner | Not used. E2-1 and E8-2 use CONVERT or code |
| 2 | **Reverse the "in-world deepfake parodies" exception** in production-estimates §7 and FORMAT-DECISION §7.5 | Showrunner | The deepfakes stay drawn (this doc's NO-GO) |
| 3 | **OST §6.10: a narrow texture exception** (M8) | Showrunner + audio owner | The ban stands |
| 4 | **The budgets:** 45 s, 6 inserts and 1 SYNTH per episode | Showrunner + pacing owner | As proposed |
| 5 | **API access and spend; performers and sessions** ([§8](#8-resources-to-ask-the-showrunner-for)) | Showrunner | Code only; scratch voices |
| 6 | **Who runs the per-insert gate** (§1.5) | Guardrails owner | THE EDITOR and a pixel QA agent flag; the showrunner decides |

**Handoffs** (nothing was edited outside this file)

| To | What |
|---|---|
| **Engine owner** | The ingest tool and an additive loader (§1.4); the flicker metric; the provenance schema; archiving the sources outside git |
| **Intro owner** | IN-1 and IN-4 can ride the per-episode renders of f0–119 and f540–719. IN-2 and IN-3 only if a v2.2 re-render happens anyway |
| **Ep1 writer** | Mark the `GEN:` slots for E1-1 to E1-6 (§1.1). There are no text changes, and the E1-4 D6 hold is optional |
| **Eps 2–12 writers** | Mark slots as you draft. Keep inserts in S-mode, on his screens, in exits or under the credits (§1.3: Mas's share) |
| **Guardrails owner** | Add §1.5 to the pre-lock checklist and §2's NO-GO table to the guardrails |
| **Audio owner and casting** | The sessions M1–M6 and the foley day S1–S2. Casting in the §6.1 order, with the MAS/INTERN one-contract note and the CHATGTP "her" guardrail. Verify YLLIT's song (Ep7 #21) |
| **Production-estimates owner** | Re-price §7's video-gen row with §7 here: it is no longer "backgrounds only," and deepfake parodies are out |
