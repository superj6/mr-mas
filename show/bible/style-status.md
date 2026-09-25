# Visual style: status

> ## DECISION (2026-09-25): pixel art primary
> - **Primary look: pixel art, adventure-game structure.** Native 480×270, 4× nearest-neighbour upscale, indexed palettes with hand-built light ramps.
>   - Reference: `out/structures/pixeladv/`. Engine: `studio/src/shared/pixel/`. Guide: `studio/PIXEL_GUIDE.md`.
> - **GLYPH (token) rendering is for darker foreshadowing,** placed for tone and comic timing.
> - **Other switches are sparing and story-motivated:**
>   - 1-BIT for 1993
>   - EARLY-WEB16 for 2008–14
>   - LEDGER for money
>   - TERMINAL for the machine's point of view
>   - a 2-TONE FREEZE for name cards
> - **The title sequence exercises a few style changes.** See `show/intro/SCRIPT.md` and `studio/INTRO_PIXEL_BRIEF.md`.
> - **Video-gen inserts** may be interlaced for fluid or realistic shots, converted to pixel or glyph in code for consistency. Never realistic likenesses of real people.
> - **Audio:** a blend of piano, orchestral and big band (brass as accents only) with a jazz feel. 8-bit chip motifs stay present as the identity. Theme variations V1–V4 are in `audio/theme/`.
> - Nothing corny, and every simplification must read as an artistic choice.
>
> The exploration history below is kept for reference.


> ## ⚠ PENDING DECISION
> **No base style is locked.** The v1 proposal ("scaling fidelity," built on ink and cut-paper) was reviewed and judged **too cartoony** by the showrunner. The room is now exploring **structural** options: the base rendering idiom of the episode body, not just palette or line weight. Nothing downstream (character rigs, name-card template, intro build, fonts) should be treated as final until this page says **LOCKED**.
>
> Last updated **2026-09-25**. Sources: [plan-v1](../_sources/plan-v1.md) §5, [final](../_sources/design/final.md) §5, [craft research](../_sources/research/craft.md) Part B, [flashback map](../_sources/research/worldcast-flashback-map.md) §3.

**Related:** [overview](overview.md) · [guardrails](guardrails.md#5-legal-hygiene) · [intro](../intro/) · [locations](../world/locations.md) · [props](../world/props.md)

**Contents**
1. [Where we are](#1-where-we-are)
2. [What stays fixed whatever we pick](#2-what-stays-fixed-whatever-we-pick)
3. [What "too cartoony" might mean](#3-what-too-cartoony-might-mean)
4. [How we'll judge the options](#4-how-well-judge-the-options)
5. [The eight structural options](#5-the-eight-structural-options)
6. [First-pass comparison](#6-first-pass-comparison)
7. [Style switches as a device](#7-style-switches-as-a-device)
8. [What depends on this decision](#8-what-depends-on-this-decision)
9. [Next steps](#9-next-steps)
10. [Questions for the showrunner](#10-questions-for-the-showrunner)
11. [Decision log](#11-decision-log)

---

## 1. Where we are

| Stage | What happened | Result |
|---|---|---|
| **v1 proposal** | "The scaling-fidelity mix." Cut-paper plus ink outlines as the backbone, with the world rendering at the fidelity of its era: 1-bit (1993) → 240p camcorder (2008–14) → crisp cut-paper (2015) → glossy HDR (2022+). Saul Bass / Borderlands ink / halftone name cards. Episode body: Saul Bass cut-paper, ink outlines, film grain. | Fallbacks on file: flat Saul Bass throughout, prestige newsprint collage, pseudo-3D diorama. |
| **Showrunner review** | The look was judged **too cartoony.** | The v1 base is **not approved** for the episode body. |
| **Now** | Exploring eight **structural** alternatives (§5), plus the idea of **sparing style switches** as an artistic device (§7). | **PENDING DECISION.** |

**What survives from v1 as a concept, not a look:** the idea that *style can carry meaning* (era, point of view, reliability) is still on the table. It has moved from "the whole show scales" to "a few deliberate switches" (§7). The intro's "THE CURVE: everything scales" concept may still work inside a new base style. That is an intro-team question ([intro](../intro/)).

---

## 2. What stays fixed whatever we pick

These are story or guardrail requirements, not style choices. Any option must deliver them.

| Invariant | Why |
|---|---|
| **Stylized caricature, never photoreal or deepfake.** Each figure gets 1–2 exaggerated signature features plus one prop, and must pass a silhouette test (identifiable when filled solid black). | Legal protection for parody ([guardrails §5](guardrails.md#5-legal-hygiene)). It also keeps the target identifiable. |
| **Exaggerate props, poses and conduct, not bodies.** No hair, weight, skin-tone, age or accent-coded features. | Guardrails X3 and X10. This matters most for the caricature-heavy options (§5C). |
| **Mas's design anchors:** grey hoodie; big, calm, unblinking eyes; a tuft of hair; a tiny closed smile; three-quarter view, left third of frame. | Continuity across every era and style switch. |
| **The Orb** reads as a chrome eyeball with a scan beam. **Monitor cyan #3FE6FF** belongs to Mas and the curve. | Title card, cold open, and the season-long verdict gag. |
| **Mas never freezes.** Other characters freeze into name cards or two-tone; he keeps moving. | A core visual gag and the name-card grammar. |
| **Liquids must be able to ripple** (every glass but his). | The cup that never ripples pays off in Ep12. |
| **Truth grammar stays legible.** Dated quote cards, "reported" chyrons, truth labels and cartoon dialogue must look different from one another in any style. | [Guardrails §4](guardrails.md#4-how-facts-appear-on-screen). |
| **THE PLAN** blueprint (#7FDBFF on #0B1E3F) stays its own register. | Viewers must recognize the explainer instantly. |
| **Tech is the spectacle.** The style must be able to do cathedral-scale data centers, melting GPUs, money in orbit and agent swarms. | The showrunner's direction. |
| **Parody marks in off-brand colors.** No real logos or UI. | Trademark hygiene. |
| **Production reality.** Art is authored as code (SVG, CSS, WebGL in Remotion) on a CPU-only machine with an integrated GPU (untested for WebGL), about 9 GB of free RAM and about 30 GB of free disk. No diffusion image generation. Character acting is done with cut-out rigs (on twos, smear frames, 6–8 mouth shapes). An illustrator could supply designs; that question is still open. | [craft.md](../_sources/research/craft.md) B.0–B.2. Any option needing true 3D, heavy per-frame painting or fluid hand-drawn acting needs outside artists or a different pipeline. |

---

## 3. What "too cartoony" might mean

The note is short, so the room is treating these as **hypotheses to test with style frames**, not conclusions. Each points to different fixes.

| Hypothesis | Symptom in v1 | Options that answer it best |
|---|---|---|
| **H1: Shape language.** Round, bouncy, "friendly" shapes read as kids' TV. | Soft cut-paper blobs, springy pop-ins | Graphic-shape cinema (angular), noir motion comic, semi-real painterly |
| **H2: No weight or material.** Flat vector has no light, texture or mass, so nothing feels expensive. | Clean fills, paper-grain overlay only | Paper-puppet diorama, latex-puppet caricature, semi-real painterly |
| **H3: The register is sitcom, not prestige.** The show wants *Succession* gravitas with absurd content; v1 looked like the absurd content. | Bright era palettes, comic name cards everywhere | Screenlife, noir motion comic, graphic-shape cinema |
| **H4: Too many looks.** Four fidelity tiers read as a gimmick montage rather than a show. | Constant tier changes | Any single strong base, with switches used sparingly (§7) |
| **H5: The genre signal is wrong.** It should read "political satire," not "animated comedy." | Nothing in v1 said "satire" at a glance | Latex-puppet caricature (the classic satire idiom), noir motion comic |

---

## 4. How we'll judge the options

| # | Criterion | The question |
|---|---|---|
| C1 | **Not cartoony** | Does it read as adult, prestige satire at first glance? |
| C2 | **Caricature legibility** | Can a viewer identify MAS, NOLE, MARIO and RUMPT on a phone in two seconds? |
| C3 | **Tech-spectacle ceiling** | Can it make the data-center cathedral, the Money-Go-Round and the agent swarm genuinely impressive? |
| C4 | **Legal distance** | How far is it from photoreal likeness? |
| C5 | **Guardrail fit** | Does the idiom itself push toward body or feature jokes? |
| C6 | **Pipeline feasibility** | Can we build it with code-authored SVG in Remotion on this machine? |
| C7 | **Truth grammar** | Can quote cards, chyrons, labels and invented dialogue stay visibly distinct? |
| C8 | **Twelve-episode stamina** | Will it still feel fresh in Ep12, or is it a one-episode gimmick? |
| C9 | **Intro compatibility** | Does it work with THE CURVE, the name-card freezes and the per-episode slot? |

---

## 5. The eight structural options

Each option is described as the **base look of the episode body**. The rest of this page covers the switches (§7) and the intro's own concept.

### A. Anime cel

**What it is.** Hard cel shading, dramatic rim light, speed lines, impact frames, held poses with camera moves. This is the limited-animation grammar of adult drama anime, not the kids' register.

- **For the satire.** Boardroom showdowns staged like shōnen duels: NOLE's $97.4B bid at high noon, THE HUG in bullet time. Deadpan holds suit Mas.
- **For the spectacle.** The strongest native vocabulary for giant tech: the data-center cathedral as a mecha hangar, THE TRANSFORMER transforming for real, beam-and-particle GPU melts.
- **Risks.** Anime face conventions tend to prettify and homogenize, which **weakens caricature legibility** (C2). Real-person parody must keep the 1–2 signature features. Some viewers still read "cartoon."
- **Feasibility.** Good. Cel shading, impact frames and held-pose animation suit cut-out rigs well. Fluid *sakuga* acting doesn't.
- **Test frame.** High noon: NOLE and Mas across a table, a BID token spinning, wind lines.

### B. Paper-puppet diorama

**What it is.** Physical paper puppets on a lit miniature stage: visible fibers, brads at the joints, rods, real cast shadows, multiplane depth, shallow depth of field. It sits between toy theatre and shadow-puppet film.

- **For the satire.** Everyone is literally a puppet, which is a thematic gift for a show about who is pulling whose strings. RUMPT's receipts and MARIO's scrolls become real paper props.
- **For the spectacle.** Scale through multiplane and light: a paper cathedral lit from inside by LED "votives," or glowing tech inside a paper world. The contrast is the spectacle.
- **Risks.** It is **the closest relative of v1's cut-paper**. It only answers the note if the material realism (light, depth, texture) does the work (H2). If it's executed flat, it's v1 again.
- **Feasibility.** Very good. SVG cut-out rigs already *are* puppets. It needs lighting, shadow and depth passes and paper textures, which are CPU-friendly as pre-rendered textures.
- **Test frame.** THE WOODROSE dinner as a lit stage, with rods visible on every founder except Mas.

### C. Satire latex-puppet caricature

**What it is.** The classic political-satire idiom: sculpted latex heads with specular sheen, wrinkles and big mouth flaps, on puppet bodies.

- **For the satire.** Instantly reads as **political satire** (H5), and it has the strongest caricature legibility (C2). RUMPT, NOLE and NESNEJ would be unmistakable.
- **For the spectacle.** Practical-effects charm: foam GPUs, a latex data center. Spectacle is "big puppet," not "awe."
- **Risks.** The tradition's engine is **exaggerating faces and bodies**, which collides with our no body, hair, age or feature rules (C5). Our version would have to exaggerate props, poses and costume instead, which is a real departure from the idiom. It can read grotesque rather than prestige.
- **Feasibility.** Weak on this pipeline. Convincing latex needs sculpted or painted designs (an illustrator) or 3D, which is slow on CPU. Rigid heads with jaw flaps do suit cut-out rigs and 6–8 mouth shapes.
- **Test frame.** RUMPT at THE PODIUM with the giant marker, and Mas beside him. Check it against the guardrails first.

### D. Retro adventure-game pixel art

**What it is.** The early-'90s point-and-click look: hand-placed pixel art, dithered skies, palette cycling, close-up conversation portraits, a generic verb bar (`LOOK · USE · TALK`) and an inventory.

- **For the satire.** The **inventory is the prop list**: `USE CHECK ON PODIUM`, `GIVE SOUP TO RESEARCHER`. Dialogue trees are a natural way to show [INVENTED] lines as *choices*, never as quotes (C7). It ties directly to the 1993 thread: the kid at the computer.
- **For the spectacle.** Moody pixel skylines, palette-cycled server lights, and a whole-screen parallax cathedral. The ceiling is lower for "awe."
- **Risks.** Gimmick fatigue over 12 episodes (C8). Caricature at sprite size needs the big-portrait close-ups. Must not copy any specific studio's interface.
- **Feasibility.** Excellent. It's native to code (the 1-bit tier already exists).
- **Test frame.** The GOLD OVAL as a game room: RUMPT behind the desk, Mas's inventory showing `$1M CHECK`, the verb bar reading `GILD MAS`.

### E. Screenlife, UI-native

**What it is.** The story is told through screens: video calls, chat windows, feeds, IDEs, terminals, dashboards, news tickers and camera feeds, with drawn characters appearing in tiles and windows.

- **For the satire.** The most native form for an AI story: the Blip *was* a video call, the plot moves through posts, and the agents live in folders. It reads as a thriller, not a cartoon (H3).
- **For the spectacle.** Tech as UI: windows cascading into infinity, the agents' folder city, the Money-Go-Round as a live dashboard. Physical metaphors (melting GPUs) need a window to live in.
- **Risks.** **An invented post in a realistic UI reads as a real post** (C7). Invented screens must look visibly absurd, and real UIs can't be copied, so every interface is original design work. Faces are small (C2). It's text-heavy on phones and could tire over 12 episodes as a base; it may work better as a device.
- **Feasibility.** Excellent. Kinetic type and UI parody are native.
- **Test frame.** THE BLIP call grid: the board's tiles, Mas's tile going grey, the employee letter's counter climbing in a side window.

### F. Graphic-shape cinema

**What it is.** Bold, angular shape design, a very limited palette, and cinematic lighting and staging: silhouettes against light, long lenses, negative space. It draws on mid-century title design and modern graphic action animation, lit like live-action drama.

- **For the satire.** The silhouette *is* the caricature (C2), so props and poses carry identity, which suits our guardrails (C5). Prestige composition around absurd content (H1, H3).
- **For the spectacle.** Scale through shape and light: one tiny Mas silhouette against a cathedral of racks, the GATESTAR ring as a pure circle of light.
- **Risks.** It's related to v1's Saul Bass fallback. It only answers the note if the push is toward **angular shapes and cinematic light**, not flat cheerfulness.
- **Feasibility.** Very good. SVG shapes plus lighting and gradient passes.
- **Test frame.** Mas alone in THE DARK ROOM as the Orb's scan reveals the endless cathedral.

### G. Semi-real painterly

**What it is.** Stylized proportions rendered with painted light, texture and atmosphere, like concept art in motion.

- **For the satire.** Maximum gravitas (H1–H3). The absurd reads funnier when it's lit beautifully.
- **For the spectacle.** The highest ceiling: volumetric light in data-center naves, painted skies over GATESTAR.
- **Risks.** **The closest option to photoreal likeness** (C4). Painted faces drift toward portraiture, which is exactly what weakens the parody defense. Proportions must stay clearly caricatured. It's also the most expensive to sustain.
- **Feasibility.** Weak on this pipeline. Painted textures per shot, and likely an illustrator. Shader-based painterly filters on CPU are slow.
- **Test frame.** NESNEJ tossing GPUs across a painted dusk skyline.

### H. Noir motion comic

**What it is.** Inked panels with heavy blacks, halftone, limited animation and parallax, caption boxes and word balloons, and splash pages for big moments.

- **For the satire.** A **built-in truth grammar** (C7): word balloons = cartoon dialogue [INVENTED], caption boxes = narration, a pasted-in clipping = a dated real quote. The noir register suits the Ep9 `/tmp` city and the Ep8 trial. Reads adult (H1, H3, H5).
- **For the spectacle.** Splash pages and page-turn reveals: the GPU melt as a double-page spread. Motion is limited.
- **Risks.** Low motion over a whole season (C8). Comedic timing depends on panel reveals rather than animation.
- **Feasibility.** Excellent. Limited animation *is* the style.
- **Test frame.** Nole v. Manalt: a courtroom page, the "yes." balloon, and a panel of the gallery buffering.

---

## 6. First-pass comparison

**▲ strong · ● workable · ▼ weak or risky.** This is the room's **pre-test read**, a hypothesis to be replaced by the style-frame bake-off (§9). It is not a ranking.

| Option | C1 not cartoony | C2 legibility | C3 spectacle | C4 legal distance | C5 guardrail fit | C6 feasibility | C7 truth grammar | C8 stamina | C9 intro |
|---|---|---|---|---|---|---|---|---|---|
| A. Anime cel | ● | ▼ | ▲ | ▲ | ● | ● | ● | ▲ | ● |
| B. Paper-puppet diorama | ● | ▲ | ● | ▲ | ▲ | ▲ | ▲ | ● | ▲ |
| C. Latex-puppet caricature | ● | ▲ | ● | ▲ | ▼ | ▼ | ● | ● | ▼ |
| D. Adventure-game pixel | ● | ● | ● | ▲ | ▲ | ▲ | ▲ | ▼ | ▲ |
| E. Screenlife | ▲ | ▼ | ▲ | ● | ▲ | ▲ | ▼ | ● | ● |
| F. Graphic-shape cinema | ▲ | ▲ | ▲ | ▲ | ▲ | ▲ | ▲ | ▲ | ● |
| G. Semi-real painterly | ▲ | ● | ▲ | ▼ | ● | ▼ | ● | ● | ● |
| H. Noir motion comic | ▲ | ▲ | ● | ▲ | ▲ | ▲ | ▲ | ● | ● |

**Combinations worth a test frame** (untested; listed so the bake-off covers them):
- **F + E:** graphic-shape cinema for the physical world, screenlife for the digital world (posts, calls, agents).
- **B + E:** diorama puppets for the physical world, with real-feeling screens glowing inside the paper set.
- **H with D inserts:** noir comic as the base, with adventure-game pixel art owning the 1993 and early-web flashbacks.

---

## 7. Style switches as a device

**The idea.** Whatever base wins, the show changes style **sparingly and on purpose**, so each switch *means* something: an era, a point of view, a reliability flag. This keeps v1's best idea (style carries meaning) without v1's constant tier-hopping (H4).

### 7a. Proposed switch vocabulary

| Switch | Look | Owns | Enters and exits via | Examples |
|---|---|---|---|---|
| **Engraving** | Banknote and stock-certificate intaglio: fine line engraving, guilloché borders, one ink color on cream | **Money flashbacks**: pledges, sales, cap tables, term sheets | A banknote's guilloché border wipes in; a serial number stamps the date | The `$1B PLEDGED*` receipt printing `$133M` (Ep6) · TPOOL's $43.4M sale (Ep3) · the 100x cap term sheet (Ep6) · the MINDDEEP stock certificate blowing into NOLE's firepit (Ep6) · THE MONEY-GO-ROUND check (optional, present day) |
| **Glyph** | The world rebuilt from text glyphs, tokens and box-drawing characters | **AI point of view** | A cursor blink, or the scene dissolving into tokens | The agents' `/tmp` city (Ep9) · the Researcher scrolling "The Merge" in its own context window (Ep11) · the model's rebuild of THE WOODROSE from every version (Ep12) · THE INTERN's POV on the RESERVED desk |
| **1-bit** | Pure black and white, dithered, 512×342 at 6 fps | **1993** | The curve rewinds to its first pixel (`downgrading… → 1-bit`); the uncancellable dialog | KID MAS at the beige computer (Eps 1, 4, 7, 12) · NESNEJ's 1993 SYNNED (Ep4) |
| **240p camcorder** | Scanlines, chroma bleed, VHS tracking, an OSD date | **2003–2014 home-video memories** | VHS tracking wipe; a poker chip spin; a GPS pin drop | DROFNATS poker (Ep4) · the TPOOL revolts `(REPORTED)` (Ep1) · the 2008 keynote (Ep2) · NOLE's 2014 lecture (Ep8) |
| **Flash-era web** | A web-player inset, plain HTML, blue links, a buffering spinner | **LUAP's essays and early YC** | A blue hyperlink click on a date in the present | The cannibals essay (Ep4) · the ramen coronation (Ep5) · TIDDER, 8 days (Ep9) |
| **Unreliable-narrator renders** | Each witness's memory is drawn by their own company's image model | **Contested accounts** | The exhibit sticker slaps on; the projector blooms | NOLE's metal album cover, Mas's six fingers, GERG's ASCII (Ep8 Rashomon) · NOLE's `HIS VERSION` (Ep6) |
| **Orb iris replay** | Glossy HDR through a chrome lens | **The Orb's memories, post-2019 only** | The iris opens | CAMEO CITY (Ep6, optional) · unprompted replays from Ep9 on |
| **THE PLAN** | Cyan blueprint on navy | **Explanations** | The blueprint unrolls; it tears back out when the plan fails | Every episode ([overview §7](overview.md#7-the-the-plan-device)) |

### 7b. Rules for switching

1. **Every switch is motivated** by an era, a point of view, a reliability label or an explanation. Never for novelty.
2. **Two non-base styles per episode at most**, not counting THE PLAN. The Rashomon episode (Ep8) is the exception, and it budgets for it.
3. **Enter and exit through a diegetic device** (the render front, a hyperlink click, the iris, the exhibit sticker). Every flashback exits on a present-day object that matches its entry.
4. **Readable in one frame.** A viewer should know "this is money," "this is the machine's view" or "this is 1993" before any dialogue.
5. **Mas stays recognizable in every style**, and **he never freezes** in any of them.
6. **No switch smuggles in realism.** Engraving, painterly or camcorder looks never become photoreal faces.
7. **Truth labels ride on top of every switch.** `HIS VERSION`, `RECONSTRUCTED` and `(DISPUTED)` stay legible in any style.

---

## 8. What depends on this decision

| Downstream item | Blocked until lock? | Notes |
|---|---|---|
| Character rigs (MAS first, then the four founders, then RUMPT and the skyline bosses) | **Yes** | Rig structure (cut-out vs puppet-with-rods vs sprite) differs by option. |
| Name-card template | **Yes** | The freeze → pop → punch-in grammar survives; its look doesn't. |
| Intro build | **Partly** | The shot table, beat grid and music can proceed. Look-dependent shots wait. |
| Fonts | Partly | The UI fonts (JetBrains Mono, Silkscreen, VT323) are safe; display fonts depend on the base. |
| THE PLAN blueprint | No | It's its own register. |
| Location and prop designs ([locations](../world/locations.md), [props](../world/props.md)) | Writing, no; art, yes | Descriptions are style-agnostic on purpose. |
| Scripts | No | Scripts should avoid style-specific staging until lock, apart from the §7 switches. |

---

## 9. Next steps

1. **Confirm the hypotheses** (§3) with the showrunner: which of H1–H5 was the note?
2. **Style-frame bake-off.** For each shortlisted option (and up to two combinations from §6), render the **same three stills**:
   - **Frame 1:** THE DARK ROOM cold open, with Mas, the Orb and the monitor glow.
   - **Frame 2:** a two-shot of Mas and RUMPT in THE GOLD OVAL, to test caricature and guardrail fit.
   - **Frame 3:** a tech-spectacle beat, either OUR GPUS ARE MELTING or THE MONEY-GO-ROUND.
   - Plus a **Mas character sheet** (front and three-quarter views, four expressions) in the winning finalists.
3. **Publish the stills side by side** for review.
4. **Lock**, then update this page to **LOCKED**, with the base style, the approved switch vocabulary and the palette tokens. Notify the intro, character and world owners.

---

## 10. Questions for the showrunner

1. Which of H1–H5 best describes "too cartoony"? More than one?
2. Is there a reference show or film whose *look* is closer to what you want?
3. Would you accept one base style for the body and a different one for the intro (the intro as its own title-design piece)?
4. Will an illustrator be available for character designs? That changes the feasibility of options C and G.
5. Is the "style switch" device (§7) welcome, or should the show hold one look throughout?
6. How much motion does the comedy need? Options D and H are lower-motion by nature.

---

## 11. Decision log

| Date | Decision | By |
|---|---|---|
| v1 plan | Proposed "scaling fidelity": cut-paper and ink with four era tiers | Design pass |
| After v1 review | v1 base judged **too cartoony**; structural exploration opened (options A–H) | Showrunner |
| 2026-09-25 | This status page created. **PENDING DECISION.** | Writers' room |
