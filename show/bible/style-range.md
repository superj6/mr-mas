# MR. MAS · Style range

> **2026-09-26 correction (lead):** Blender is already installed: **Blender 4.5.3 LTS** at `/home/jgon/Downloads/blender-4.5.3-linux-x64/blender`. It was verified headless here: EEVEE Next renders through the Intel iGPU, and Cycles runs on the CPU (the iGPU isn't exposed to Cycles; that would need Intel's oneAPI compute runtime).
> - GPU access comes through a login-session permission on `/dev/dri/renderD128`. It can drop when the desktop session isn't active. The permanent fix is to add the user to the `render` and `video` groups: `sudo usermod -aG render,video jgon`, then log out and back in.
> - The "install Blender" resource ask is withdrawn. Disk (about 9 GB free) is still the constraint for scenes, textures and caches.


> **Status: WORKING GUIDE, 2026-09-26, final after the critic pass.** This is the show's style-range bible: when the picture leaves pixel art, how far it goes, who owns each look, how every change comes in and goes out, and what gets built now versus for the final draft. The critic's amendments are applied throughout; [§10](#10-change-log-the-critic-pass) lists what changed, and what was modified or declined, with the reason.
> - It **supersedes the budget, triggers, framework and season map of [style-jumps](style-jumps.md).** It keeps that file's jumps (J1–J6), alternates (A1–A4), the bezel rule, the transitions and the prototype lessons, and credits them where they're used ([§1.6](#16-what-this-keeps-from-style-jumps-and-what-it-replaces)). style-jumps is owned by the jump-fix pass and isn't edited here.
> - **Every number in this file is a guide**, per [flow-and-continuity](flow-and-continuity.md). Break one when it plays better and say why in a line. The only firm lines are in [§5.1](#51-firm-lines).
> - Every item in the season map is **proposed**, except the booked J-ids, which keep their style-jumps status. Episode files belong to the season revision.
>
> **Built from three research files, all 2026-09-26:**
> - [style-range-references](../_sources/research/style-range-references.md): 45 moments where a show or film changes style or medium, and twelve lessons. Tagged [V], [K] and [UNVERIFIED].
> - [style-range-capabilities](../production/style-range-capabilities.md): what this machine can render today, measured, including the integrated GPU.
> - [style-range-opportunities](../_sources/research/style-range-opportunities.md): 95 motivated moments across the season, the ranking, the rulings and the handoffs. Its ids (episode.letter) are the ids used here.
>
> Also read: [style-status](style-status.md) (pixel primary; the switch vocabulary) · [guardrails](guardrails.md) · [naming](naming.md) · [pov-and-framing](pov-and-framing.md) · [GENAI-UPGRADE-PLAN](../production/GENAI-UPGRADE-PLAN.md) · [genai-candidates](../production/genai-candidates.md) · [intro spec §4](../intro/spec.md) (the fidelity tiers and the render front) · [PIXEL_GUIDE](../../studio/PIXEL_GUIDE.md) · [SHOWRUNNER-NOTES](../production/SHOWRUNNER-NOTES.md).

**The showrunner's notes (binding):**
- "also to be clear on jump ideas, what i meant is we can have some style changes that are more like filter passes, and then rarer some that are drastic changes like high definition anime, 3d, near photorealistic, extra blocky, etc. we want to show off throughout the show the capabilities of what range we're able to do, but not in a forced manner either, only where it makes sense. surely you have other existing shows for reference. and more generally, try to be creative and break boundaries while still being tasteful and generally faithful to the shows tone and flow"
- "some of these may be hard to be done programatically, hence the reason for giving access to video model or similar for the final draft (but still put fully programatic fillers for now)"
- "generally, there should be no hard cutoffs for rules on episode handling. there can be guidelines, but the practical flow and user entertainment is always priority"
- Earlier: "we want any simplification to look artistic, not like a limitation of our capability" · "don't make anything too corny" · "high quality and entertaining with good pacing, not amateur" · pixel art is the primary style, and glyph rendering is for dark foreshadowing.

**Contents:** [The range in twelve lines](#the-range-in-twelve-lines) · [1. Philosophy](#1-philosophy) · [2. Tier 1: passes](#2-tier-1-passes) · [3. Tier 2: leaps](#3-tier-2-leaps) · [4. Entering and exiting](#4-entering-and-exiting) · [5. Guardrails and taste tests](#5-guardrails-and-taste-tests) · [6. The season map](#6-the-season-map) · [7. The prototype slate](#7-the-prototype-slate) · [8. Resource asks](#8-resource-asks) · [9. Rulings, handoffs and the checklist](#9-rulings-handoffs-and-the-checklist) · [10. Change log](#10-change-log-the-critic-pass) · [Appendix A. Reserve passes](#appendix-a-reserve-passes-only-when-a-script-names-the-device) · [11. Prototype results](#11-prototype-results)

---

## The range in twelve lines

1. **Pixel is the show.** Every change of look is a departure from it and a return to it. The base never rises.
2. **Two tiers.** A **pass** (Tier 1) re-treats the pixel frame we already render: a palette, a resolution, a lens, a texture, a frame rate or a device's screen. A **leap** (Tier 2) re-draws the moment in another medium: HD anime, clay, paper, low-poly, voxels, true 3D, near-photoreal plates. If you can make it by post-processing the pixel frame, it's a pass.
3. **Every look has an owner:** the device we're watching through, a rival's product as it sees itself, the record, the machine, Mas's inner life, or the world at a peak. If nobody owns it, it's decoration and it goes.
4. **Count register changes, not seconds.** Passes are grammar; leaps are events. The slate is about **16 leaps in 12 episodes**: roughly one an episode, two in a few, three in the finale. Every episode keeps a **register strip** of every change, existing switches included, and checks it in the animatic ([§6.14](#614-the-register-strips)).
5. **Enter through a door in the story** (a monitor, a lens, a lantern, a match cut, the band retracting, a bezel), never through a plain cut or a crossfade, **and write the exit first.** The exit is where the meaning lands.
6. **Keep the character, change the world.** Caricatures stay stylized in every medium, including statues, figurines and mannequins that stand in for them; rooms, skies, machines, animals and crowds of nobody in particular may go near-photoreal. That's the firm likeness line, and it's also the season's thesis.
7. **The bezel holds until J5.** The machine's near-photoreal picture stays inside a bezel or a signposted render (a screen, the projector, an exhibit, the model's own flashback). In Ep2 the world converts the machine's picture at the bezel; in Ep12, once, the machine converts the world ([§1.4](#14-the-spine-the-machine-renders-at-the-fidelity-of-its-month)).
8. **Mas has no tell, and the range obeys it.** Before J6, no pass is keyed to his inner state. **His glass stays pixel inside every leap** until J6 turns it fluid, and the season's stat bars never find anything over his head ([§3.5](#35-plants-anchors-and-ladders)).
9. **Sound changes medium with the picture** instead of dropping into a hole, and it's period-true: the first machine clips are silent. Designed silence is kept for the record's prints and the ring in his water.
10. **Every pastiche says something and evokes a genre**, never a named studio's look. No wink, no glitch-as-wipe, and no leap that re-draws a genre gag in that genre's medium for emphasis.
11. **Subtraction counts as range,** and one moment of it is booked: the Ep12 button plays as one unbroken slow pixel push that ends on the ring ([§3.4](#34-fenced-slots-and-the-booked-subtraction)). Everything gets a fully programmatic filler now, built on the final's timing, framing and masks, so a video-model, Blender or human final drops in as a layer swap. No character ever comes out of a model.
12. **Four prototypes come first** ([§7](#7-the-prototype-slate)): the HD-anime read at the poker table, the first true 3D camera over the cliff, near-photoreal objects with pixel people at the reconstruction's table (plus one clay turnaround still of CLOD), and a reel of the four passes the season leans on, each inside its pixel room. They're samples for approval; nothing goes into season production before the showrunner has seen them.

---

## 1. Philosophy

### 1.1 Why the show changes medium

The showrunner asked for range "throughout the show", "not in a forced manner either, only where it makes sense", and to "break boundaries while still being tasteful and generally faithful to the shows tone and flow." Four reasons make a change of medium make sense in MR. MAS. A moment that has none of them stays pixel.

1. **Perception, through Mas.** The show is limited third person through an unreliable narrator ([pov-and-framing](pov-and-framing.md)). How he sees himself is grander than what's true, so **his legend gets the grander medium and the truth stays in pixel**: Po's shadow-puppet dream opening into the CG film, South Park's anime fantasy cut off by the plain-style consequence ([references](../_sources/research/style-range-references.md) 36, 10). Other people's versions are signposted like any exit from his POV (`HIS VERSION`, the exhibit sticker). **His self-image is never his feeling:** a leap may show how he sees himself at an invented beat (10.C), but no pass reads his mood off the room before J6 ([§2.2](#22-the-vocabulary)).
2. **The medium is the message.** The companies in this show sell pictures of themselves, and the record, the press and the courts keep their own pictures. So a rival's product arrives in its own register (CLOD is clay because CLOD is a clay golem), a trial is remembered in pastel because trials are remembered in pastel, and a hearing looks like a broadcast because we're watching the broadcast. Lumon's stop-motion film and Mr. DNA are the models: a cute medium telling a self-serving story (31, 30).
3. **The season spine: the machine renders at the fidelity of its month.** The intro already renders each era at its fidelity ([intro spec §4](../intro/spec.md)). In the episodes, that idea holds only for what the machines make ([§1.4](#14-the-spine-the-machine-renders-at-the-fidelity-of-its-month)). The realest-looking picture on screen is the machine's, which was style-jumps' M5 and is The Mitchells vs. the Machines' design principle (12). And it stays in its frame until the one time it doesn't.
4. **Range is part of the joke, but only where the joke already is.** A show about machines that can render anything, made in code, can prove it renders anything too. It does so the way Mr. Robot, Community, Severance and The Simpsons' Homer³ did: a full commitment when a story door opens, then home (8, 6, 31, 27). Anthology freedom doesn't transfer to a serialized thriller (45). Range for its own sake belongs in the fenced slots ([§3.4](#34-fenced-slots-and-the-booked-subtraction)), including the episode title cards, which each render in their own file type.

### 1.2 What doesn't change

- **Pixel art is the primary look**, adventure-game staging (a 480×203 room over the 480×67 verb and inventory band), native 480×270 at 4× nearest-neighbour, indexed palettes with hand-built light ramps ([style-status DECISION](style-status.md), [PIXEL_GUIDE](../../studio/PIXEL_GUIDE.md)).
- **GLYPH is the machine's dark foreshadowing**, placed for tone and comic timing.
- **Every simplification reads as a choice.** When a medium is limited here, we pick its conventions (holds, on 2s, stepped cameras, key poses) so the limit reads as craft. **A leap must look at least as finished as the pixel base it leaves**, or it reads as a limitation.
- **Nothing corny** ([§5.3](#53-taste-tests)).
- **The tone** is a fluid thriller drama that happens to be funny ([tone-and-dialogue](tone-and-dialogue.md)), and **the flow** is sequences, continuous sound and cutting on story ([flow-and-continuity](flow-and-continuity.md)): "Stay in one visual register for a while."
- **The guardrails** ([§5.1](#51-firm-lines)). **1080p maximum.**

### 1.3 Every look has an owner

The owner is the reason for the medium. It decides what the medium may show and how it comes in. When the owner comes back, the medium comes back and escalates; nobody else borrows it. This keeps style-jumps' best rule ("each medium means one thing") and widens the palette.

| Owner | What it may show | Media it owns | Enters by | Example |
|---|---|---|---|---|
| **THE DEVICE** (a security camera, a call, a broadcast, a stream, a phone, the deposition camera, a handheld console, a photo-finish camera) | What that device records | The Tier 1 device passes ([§2.2](#22-the-vocabulary)), at one of three sizes: OSD only, bezel, or full room ([§2.3](#23-how-often-and-how-big)) | Push into its screen, or cut to its point of view. The band stays | Draft Night as the stadium feed (5.A) |
| **THE MACHINE** (NopeAI's models, the agents, THE INTERN, THE MODEL) | Only what it sees now, or what it makes, at that month's fidelity | GLYPH when it *sees*; near-photoreal when it *makes*, **inside a bezel or a signposted render until J5**; the painted image-craze look; voxels for its worlds; true 3D once it builds its successor; the point-cloud reconstruction | A bezel (a screen, the projector, an exhibit) or the model's own flashback; the render front re-renders only inside them until J5 | The mammoth in the boardroom screen, turning to pixel as it steps through the bezel (2.A) |
| **THE BRANDS** (each rival's product as the company likes to see itself) | The product's self-image | MISANTHROPIC: clay for its products (CLOD, and MYTHIC), paper for its people's words. ATEM / KRAM: the low-poly plaza, empty. THE WHALE: extra blocky, because cheap is the product. zAI / NOLE: the airbrushed metal album cover. The ad industry: the promo grade on its own screens (P23) | The product's own surface: a pane, a jumbotron, an ad break, a lantern, a box | CLOD's Big Game ad in clay, on the TV in Mas's room (7.A) |
| **THE RECORD** (how it will be remembered, by hand) | Only what happened | Engraving (J1), halftone (J2), the courtroom pastel, the class-photo ladder | The flash-print (the freeze's 2-frame pop) | `CANCELLED` perforated through his call tile (J1) |
| **HIM** (Mas's self-image, on invented beats only) | How he'd like to be seen, never what he feels | The HD-anime read, his self-image as the man who reads every table; the ring in his water (J6), the one time the show sees inside him | The event itself is the front, or a hard cut on a sound | THE READ at the poker table (10.C) |
| **THE WORLD** (the stakes, visible to everyone in frame) | The event, which everyone can see; nobody sees the medium | Continuous-tone night behind a tear (J3); the sky reformatting to footage (J5); the grid's draw reaching a room (P30 BROWNOUT) | The tear, the refine, or the event's own cause | "Mario is right." (J3) |

**MISANTHROPIC owns two media** (clay and paper) because they are one idea: the company that makes everything look handmade, and is itself a brand, the way its `NO ADS` neon is an ad (Ep7). Clay belongs to the product only: the people beside CLOD stay pixel.

### 1.4 The spine: the machine renders at the fidelity of its month

Taken literally ("the show gets more realistic every episode"), the spine would raise the base, turn range into a quota and shut out the human counter-voices (pastel, engraving, paper, clay). Taken narrowly it's one of the best tools the season has ([opportunities §3](../_sources/research/style-range-opportunities.md#3-the-spine-test-the-show-renders-at-the-fidelity-of-the-machine)):

1. **A ceiling.** A machine-made image never looks better than that month's real models could.
2. **Period flaws, then they heal.** Early machine images carry the flaw people noticed that month: period truth the audience can feel, and a small joke about the record rather than a showreel. **The fidelity flaws are healed by Ep6** (AROS 2, where the only flaw left is the Orb's `(probably)`).
3. **Then the machine escalates in authorship and in dimension, not in polish.** In Ep8 each witness's model renders its own version (8.B): the flaw is now the author. In Ep9 the agents' world gains depth with a camera that can't move in it (9.A), and in Ep11 the successor adds the dimension (11.A).
4. **The bezel holds until J5.** The machine's near-photoreal picture stays inside a bezel or a signposted render (a screen, the projector, an exhibit, the model's own flashback). style-jumps' rule stands: machine footage "in the world's own place... happens once, as the season's last image of scale: J5." That gives the season its arc: **in Ep2 the world converts the machine's picture** (the mammoth turns to pixel as it steps out of the screen), and **in Ep12 the machine converts the world** (the sky reformats). It also means every earlier machine filler only has to hold up at screen size.
5. **The first perfect render is J5.** It's booked, it's the act-out, and it's the scariest image in the show. Nothing before it (not 12.A, not the intro's takeover) shows the machine rendering a whole world perfectly.
6. **The humans never render.** Because of the likeness line, the machine's world reaches full fidelity while the people in it stay drawn. Nobody says the thesis; the picture does.

Brand media and the record are exempt. The pixel base never rises.

**The sound spine is period-true too.** AROS's first preview (Feb 2024) had no audio, so 2.A's mammoth is silent while the boardroom's bed runs under it. AROS 2 (Sep–Oct 2025) arrived with sound, so from Ep6 the machine's clips carry their own sound through their device's speaker. At J5 the machine's full-band air enters the room itself.

| Ep | Month | What the machines could make | What its picture shows | Where it's allowed | Its sound | The machine on screen |
|---|---|---|---|---|---|---|
| 2 | Feb 2024 | Minute-long demo clips (AROS's first preview) | The flaw: the walk slides; a chair melts | Inside the boardroom screen. At the bezel the mammoth turns to pixel, and the slide and the melt carry over in pixel | **None.** The clip is silent; the room's bed runs | 2.A the mammoth |
| 3 | Dec 2024 | AROS goes public at SHIPMAS | The sleigh's runners still drift | A stream window | None of its own; the stream's presenter audio only | 3.F, door 3 |
| 4 | Mar 2025 | CHATGTP's image model turns the internet into soft painted pictures | A warm yellow cast [K]; soft, wobbly edges; lettering that almost reads | The city's pictures (phones, screens, posters) and the machine's own cathedral of racks. Painted, not footage: the streets and the people stay pixel | — | 4.F the paint wave |
| 6 | Sep–Oct 2025 | AROS 2: sound, and physics that hold; the cameo feeds | **Healed.** None visible, except the Orb's first `(probably)` | Phones and feeds; the fake CCTV clip, visibly drawn (the likeness line) | **Its own**, through each phone's speaker | 6.E (P1 CCTV). 6.F CAMEO CITY in reserve |
| 8 | Apr–Jun 2026 | Every lab has image and video models | **Authorship:** each witness's model renders his own version | The courtroom projector, under the exhibit stickers | Each render in its own sound | 8.B the Rashomon renders |
| 9 | Jul 2026 | Agents act inside worlds | **Dimension, step one:** the world has depth, but the camera can't move in perspective | The monitor, into the agents' own sandbox | The sandbox's own room | 9.A the folder city |
| 10 | "OCT 2026?" | THE INTERN deals the cards | What it sees, not what it makes | The dealer's view | The GLYPH family | J4 (the dealer's view) |
| 11 | "2027??" | A model trains its successor inside itself | **Dimension, step two:** the camera moves in perspective for the first time | His monitor, into the nest | Recorded full-band air of a very large room, 10 dB under | 11.A the cliff |
| 12 | "????" | Anything | Its own flashback resolves only the objects it learned (12.A). Then the bezel fails once: the world, perfectly, except the humans (J5) | 12.A inside the model's flashback; **J5 in the world's own place** | Full-band air in the room itself | 12.A, J5 |

### 1.5 What the references taught

The [reference study](../_sources/research/style-range-references.md) looked at 45 moments. Its twelve lessons, compressed, are the working principles of this file. Numbers in brackets are the study's entry numbers.

| # | Lesson | Where it lives here |
|---|---|---|
| 1 | Every look has an owner (Abed, Gwen, Katie, Lumon, the machine) (6, 2, 12, 31) | §1.3 |
| 2 | Two tiers, two grammars; frequency follows tone. JoJo hits every minute because it's opera; Mr. Robot swings once a season; a thriller with comic bones sits between (18, 9) | §2.3, §3.3, §6.14 |
| 3 | Build a door, not a cut: a bookcase, a collider, a TV in a break room (27, 1, 31) | §4.1 |
| 4 | Write the exit first; make it a beat: Butters' eye, Tyrell through the set, Jeff's jet pack (10, 8, 7) | §4.2 |
| 5 | Keep the character, change the world: Homer on a real street, Roger in a real lamp's light (27, 37) | §5.1, §4.6 (contact) |
| 6 | The self-image gets the grander medium, the truth the base (36, 10, 20) | 10.C, §1.1 |
| 7 | Every pastiche is a thesis, evoked through grammar, never one studio's frames (32, 8, 33) | §5.3 |
| 8 | The company explainer is a strong medium, and can climb tiers (30, 31) | §3.4 (THE PLAN stays BLUEPRINT) |
| 9 | Seed the intrusion small, long before: WandaVision's coloured toy, Lain's red noise (32, 39) | §3.5 |
| 10 | Subtraction is range: EEAAO's rocks, "Fish Out of Water", a single take (41, 14, 9) | §3.4 (the Ep12 oner), §2.2 GRAMMAR |
| 11 | The wildest range goes in fenced slots: couch gags, Chainsaw Man's endings (43, 44) | §3.4 (the intro slot, the title cards) |
| 12 | Commit to each medium's rules, and build the filler on the final's timing (24, 38, 3, 4) | §3.2 (rules column), §6 (routes) |

### 1.6 What this keeps from style-jumps, and what it replaces

style-jumps did the hard early work: it proved on screen that pixel and a second medium can share a frame without reading as a filter. Its ideas stand unless this table says otherwise.

| From style-jumps | Here |
|---|---|
| **J1** `CANCELLED` (Ep1 sc 26, engraving, near lock) | Kept as 1.E, a RECORD leap. Unchanged |
| **J2** THE HUG halftone (Ep7 #17, booked) | Kept as 7.D. By this file's definition it's a pass (computed from the frame) that plays at leap weight: once, at a peak, protected like a leap. The beat's "bullet time" is a frozen-moment slide in layers, never an orbit (R9) |
| **J3** THE SKY OPENS (Ep9 #23, booked, not proven) | Kept as 9.D, a WORLD leap. The tear build (proto2) ships as the filler |
| **J4** the dealer's full-frame GLYPH (Ep10 #19, booked) | Kept as 10.D. A pass at leap weight, and now the answer to 10.C's anime read. Its two blanks are Mas and the Intern's caret face (the tell ladder, §3.5) |
| **J5** the sky reformats (Ep12 #12, booked; the hold needs sign-off) | Kept as 12.B, a WORLD and MACHINE leap, and now named **the season's first perfect render and its single bezel break** |
| **J6** THE RING (Ep12 #17, booked as amended) | Kept as 12.D, the one time the show sees inside him. Code only. It lands inside the Ep12 oner, framed with no reformatted window in shot |
| **The bezel rule** (M5: SYNTH machine video stays inside a diegetic bezel; J5 is the one break) | **Kept, and extended to every near-photoreal machine image** (§1.4). It had been used up quietly by the first draft of this file; it's restored |
| A1 the hairline glimpses | Kept as an option (Ep5, Ep6) |
| A2 the verdict in pastel | Promoted: 8.D |
| A3 the loss curve tips | Resolved as 11.A, the first true 3D camera |
| A4 the paper class photo | **Kept as style-jumps booked it:** 12.C is code only, a pixel print with cut lines and a focus pull onto the monitor. The near-photoreal version plays only if J5 is cut. "The finale never plays three" |
| The five motivations (M1–M5) | Folded into the owner table (§1.3): M1 → THE WORLD, M2 → HIM, M3 → THE RECORD, M4/M5 → THE MACHINE |
| The transitions (flash-print, tear, event as front, refine, snap, seal, settle, hard cut on a sound) | Kept; §4 adds doors for the new families, including the band |
| The 27 prototype lessons (§5.4) | Kept in full as build law: §4.6 carries the ones every leap needs |
| The animatic test (cut it both ways) and the one-frame test (full frame and phone size) | Kept (§5.3) |
| "Mas never freezes"; "the UI never jumps"; "land on a face" | Kept (§4.6) |
| The budget: 8 a season, 30 s, 0 or 1 an episode, 2 bars of spacing | **Replaced** by guidance that counts register changes (§2.3, §3.3, §6.14); the showrunner's "no hard cutoffs" note. The slate is about 16 leaps, close to the old budget's spirit of "one an episode" |
| The flat Eps 2–6 stretch of pure pixel | **Replaced**: range shows up across the season, and the machine family climbs |
| "Not a punchline"; "continuous tone is never a joke" | **Replaced**: a leap may carry a laugh when the medium *is* the joke's subject (R3). It never decorates a joke that works without it |
| "Mas appears only in graphic media" | **Replaced**: Mas may appear in any stylized medium, never near-photoreal (R2) |
| "The anime look is held" | **Replaced**: HD anime has one home, 10.C, where it's his self-image at an invented game |
| "Never in the intro" | **Replaced**: the intro's bar-9 slot and the title cards are fenced slots, at the intro owner's call (§3.4) |
| "The running cue stops dead on the downbeat" | **Replaced**: the music re-voices with the picture; a stop is a rare designed beat (§4.4; soundtrack pass, H4) |
| Ep4's image craze "not a jump"; CAMEO CITY declined | **Reversed for 4.F only**: the image craze is a record about a medium (4.F). **CAMEO CITY stays out** (6.F is in reserve): a city turning real during a deepfake flood can't tell a cold viewer why, it loses the cameo satire, and it would spend the bezel break |

---

## 2. Tier 1: passes

### 2.1 What a pass is

A pass keeps the drawing and changes its treatment: palette, resolution, lens, texture, frame rate, or the screen of the device we're watching through. It's built as a post-process in the pixel engine or right after it, stays code forever, and costs seconds a shot ([capabilities §3](../production/style-range-capabilities.md#3-the-table)).

- **A pass is grammar.** The viewer learns it: the CCTV look always means a security camera. It can recur, and it doesn't need to escalate.
- **Its motivation** is a diegetic device, how an event will be remembered, the machine's view, or a feeling that belongs to a room or to someone other than Mas.
- **Its length** is from a few frames to a whole sequence, for as long as its device is on screen.

### 2.2 The vocabulary

Ids P1–P21 are the opportunity map's; P22 onward were added from the capability audit and the references. **This list holds only the passes the season books.** Everything else is in [Appendix A](#appendix-a-reserve-passes-only-when-a-script-names-the-device), used only when a script names its device, so the vocabulary can't become a menu that invites decoration. "Where" lists map ids ([§6](#6-the-season-map)).

**THE DEVICE: we're watching through it**

| Pass | What it looks like | What it means here | Where |
|---|---|---|---|
| **P1 CCTV** | High corner angle, barrel distortion that bends the grid correctly, soft mono or washed colour, 8 fps, a burned-in timestamp and a generic REC mark, IR bloom on lights | Someone recorded this. The show's deepfake gags play through it, visibly drawn | 6.E; 11.G opt |
| **P2 CALL** | Webcam softness, small-window compression, a 15 fps stutter on the *other* tiles; ours stays clean. Its breakdown stage (DC-only 8×8 blocks, smeared macroblocks) exists for a call that really fails, and never as a wipe | Distance, and who has the good connection | 1.G |
| **P3 BROADCAST** | A fixed wide, flat light, broadcast-safe colour, a generic lower third. Variants: game-show set, launch webcast, the council chamber. When the broadcast carries a synthetic voice (1.F, Ep1 #16–17), the voice is designed from text or performed by a human, never an imitation of the real person, and a burned-in `[AI-GENERATED AUDIO]` caption sits under the lower third | The official version of an event | 1.F, 4.H (bezel size), 6.B, 8.E, 9.E |
| **P4 SPORTS** | Stadium cameras, a telestrator circle, replay, pick cards, a timing tower | Business as a televised game | 3.B, 5.A, 10.E |
| **P5 STREAM** | A launch livestream: a chat sidebar, a slide, a stream's compression | The company's own show | 2.C, 3.F, 5.I |
| **P6 PODCAST** | Two-camera studio, warm tungsten, mic arms | THE PODCAST CIRCUIT's grammar | 2.D, 5.F |
| **P7 PHONE** | Vertical 9:16, a generic phone UI. Its "portrait mode" is grid-true: the background steps to 2×2 and 4×4 blocks in bands, never a blur ([§2.4](#24-what-keeps-a-pass-premium)) | Private attention | 2.F, 3.A (its bezel), 12.H |
| **P8 DEPOSITION** | Fixed camera, timecode burn-in, flat institutional light | Testimony | 6.G, at OSD size |
| **P9 HANDHELD-4** | 160×144 inside the frame, four LCD greens, 2×2 ordered dither, square-wave sound. Evokes the handheld; never a real console's name, logo, font or UI | A machine playing a game | 4.E |
| **P10 BLOCKY** | Our engine at a quarter of the resolution, 8 colours, limited cycles, hop steps and snapped poses. 4-bit chip at half the sample rate | THE WHALE: cheap is the product | 4.A (at pass weight), 12.E opt |
| **P11 SLIT-SCAN** | A photo-finish camera: time along x, the runners smeared into a strip, the static background as horizontal streaks | Who was first, proved by a camera | 9.C |
| **P23 PROMO GRADE** | Glossy colour and a product-film sheen. Its shallow focus is grid-true stepped resolution in bands | A staged demo, or an ad on its own screen | 1.H, 7.B (on the jumbotron) |
| **P24 SPREADSHEET** | Every cell a number and a fill, a formula bar, a selected cell; bigger cells and a push-in so the picture reads at 1× | The world as someone's model of it | Ep6's title card, `backstop.xlsx` ([§3.4](#34-fenced-slots-and-the-booked-subtraction)) |

**THE RECORD: how it will be remembered**

| Pass | What it looks like | What it means here | Where |
|---|---|---|---|
| **P18 HALFTONE** | The `noir` dot screen on newsprint, inside a photo crop; no masthead | The wire photo | 7.D (J2) |
| **P19 SPIRIT PHOTO** | Sepia double exposure, the ghost at half opacity, a soft vignette | How the dead are photographed: the emails of the departed | 2.G |
| **P25 FLASH-PRINT** | A press flash in the paper's own tone, then a print (≤ 80% white) | The class-photo ladder, the magazine cover | 7.H, 12.C (A4), 12.F |

**THE MACHINE: its view, its outputs**

| Pass | What it looks like | What it means here | Where |
|---|---|---|---|
| **Masked GLYPH** (existing) | The world as tokens, inside the Orb's cone, a cursor window or a reflection | The machine is already here | Every episode |
| **Full-frame GLYPH** (existing) | The whole frame as the model reads it | The machine's view itself. Once, at leap weight | 10.D (J4) |
| **TERMINAL** (existing) | Monospace log on black | The machine's point of view in text | 8.F, 9.G, 11.F; Ep9's title card |
| **BLUEPRINT** (existing, THE PLAN) | Cyan lines on navy, a grid and a title block | The company explains itself | Every episode, all season |
| **P12 HEATMAP** | The model's attention as a heat ramp over the frame, designed from an attention mask (never from brightness), whites ≤ 80% | What the machine cares about | 11.B |
| **P15 LOD** | One figure resolves as a grey untextured placeholder, a render that never finished | The not-seeing ("Who?") | 8.A |
| **P21 IRIS** | The Orb's chrome-lens replay (parked in the genai plan until the SYNTH ruling; the code version is fine) | The Orb's memory and its verdicts | 2.E, 5.H, 11.E |
| **P29 AI TELLS** | A domain warp that melts one region; gibberish type that re-rolls every few frames | The machine's period flaws, on machine-made media only, and only until they heal in Ep6. Never on a person, a face or a hand | 2.A, 3.F, 4.F |

**THE TELLS: the season's key recurring graphic about Mas**

Everyone's tell floats over their head as a stat bar (`BLUFF ▰▰▰▱`); over Mas's head there's nothing. It's a game-style graphic only, never a physical or health "tell" ([ep12 flashbacks](../episodes/ep12/flashbacks.md)). It isn't a pass or a leap; it's the one graphic that crosses media, and it keeps its shape, its label and its fill order (label first, cells left to right in held steps) in every medium it visits. The ladder is in [§3.5](#35-plants-anchors-and-ladders).

**ERA: the existing switches** ([style-status §7](style-status.md#7-style-switches-as-a-device), [PIXEL_GUIDE §2](../../studio/PIXEL_GUIDE.md)): **1-BIT** (1993), **EARLY-WEB16** (2008–14), **LEDGER** (money), **2-TONE FREEZE** (name cards). They stay exactly as they are, and they count in the register strips.

**FEELING and THE WORLD: the room changes, never his face**

> **Before J6, no pass is keyed to Mas's inner state.** His glass never ripples until J6, "the first all season", and a room that drifts with his composure would be a ripple by another name. Feeling passes land on rooms and on other people; a pass on a room Mas is in must be caused by something outside him that the audience can see.

| Pass | What it looks like | What it means here | Where |
|---|---|---|---|
| **P17 AIRBRUSH** | Gradient bands, chrome rim light, star glints over the pixel frame | NOLE's self-image, as a pass (his own `HIS VERSION`) | 6.C |
| **P31 CHIAROSCURO** | One warm light source; everything else falls to the dark ramps | Other people's vigil | 5.G |
| **P30 BROWNOUT** | The room's lights step down in whole palette rungs in the rhythm of a visible cause, and come back up with it. Built on the plates' existing `dim` lighting notes | The grid's draw reaching a room: in Ep11 the gigawatt bows dim the Bay's lights, and the draw reaches his dark room | 11.H opt |

**GRAMMAR: the camera or the edit changes, the rendering doesn't**

| Device | What it is | Where |
|---|---|---|
| **G1 THE ONER** | One unbroken pixel camera move (Mr. Robot's "runtime-error", 9). CPU-cheap, and it agrees with the flow guide's call for fewer cuts | **Booked:** the Ep12 button, #16–19 ([§3.4](#34-fenced-slots-and-the-booked-subtraction)). Other candidates are the writers' call (H2) |
| **G2 LOCKED-OFF vs HANDHELD** | Camera mount tells registers apart ("USS Callister", 33) | Inside any device pass |
| **G6 THE HOTSPOT** | The adventure-game cursor as Mas's attention: it passes over what he's reading, and the band's sentence line and a hotspot label show what he sees. What isn't a hotspot, he doesn't see | 10.C's pre-roll: each player's label is his tell; the dealer isn't a hotspot |
| G3 WORDLESS, G4 SPLIT SCREEN, G5 FRAME RATES PER LAYER | A wordless stretch on continuous music; two panes; layers on different twos and threes (14, 3) | On call when a scene asks. G5 is standard practice inside brand leaps |

### 2.3 How often, and how big

- **Count register changes, not seconds** ([§6.14](#614-the-register-strips)). A register change is any moment the whole room area changes how it's drawn: a full-room device pass, an era switch, a freeze, THE PLAN, a leap that fills the frame. Seconds of runtime hide the problem the flow guide names: "Stay in one visual register for a while."
- **A device pass has three sizes.** Choose the smallest that makes the device clear.
  - **OSD only:** a burn-in, a timecode or a lower third on the pixel frame (6.G). Not a register change.
  - **Bezel:** the device's picture inside its own screen in the pixel room (4.H on the press conference's monitors). Not a register change.
  - **Full room:** the device's picture fills the 480×203 room area; the band stays (5.A, 6.E). This one counts.
- **A few per episode where motivated.** The test is simple: a device is genuinely on screen, and the pass makes it clearer. If the pass adds nothing, leave the device pixel.
- **Device passes don't count as "styles"** for style-status §7b's "two non-base styles per episode", which was written for era and POV switches (H8). They do count in the register strip.
- **Don't stack two treatments on one shot**, unless one device is inside another (a CCTV clip on a broadcast). Don't stack two treatments on one *sequence* either: when a medium's moment is over, it collapses back to pixel rather than lingering under the next pass (5.B).
- **A pass can hold a whole sequence** when the sequence lives inside its device (Draft Night as a broadcast).

### 2.4 What keeps a pass premium

- **Write each pass in the engine's own terms.** Grid-true passes (palette hits, duotone, 4-shade, thermal, breakdown blocks, blueprint, mega-pixel, AI warp) run on the 480×270 indexed framebuffer and snap to the master palette, so a pass is still our palette. Print and tape passes (engraving, halftone, CCTV) run at 1920×1080 over the 4× frame, because a halftone dot or a scanline is finer than a native pixel ([capabilities §4.1](../production/style-range-capabilities.md#41-tier-1-passes)).
- **Never blur pixel art.** A blur smears nearest-neighbour pixels and makes the simplification look like a limitation. Defocus is **stepped resolution in bands**: the engine re-samples a region to 2×2 blocks, and a farther band to 4×4, with the steps on the grid. That's the only depth of field a pixel pass has (P7, P23, and any reserve use of P16).
- **Look like the real device, not a preset:** restrained chroma bleed, one tracking band, honest OSD type, generic UI, parody marks only. A glitch is allowed only when the device really fails, and it's designed like a failure, not a wipe.
- **The rail, truth labels, subtitles and the band stay pixel and on top.**
- **Photosensitivity:** at most 3 flashes in any 24 f, every pop ≤ 80% white, thermal peaks ≤ 80% white ([guardrails §7](guardrails.md#7-broadcast-safety)).

---

## 3. Tier 2: leaps

### 3.1 What a leap is

A leap re-draws the moment through a different pipeline, composited back under the pixel UI: 3D, clay, the anime rig, paint, paper, pastel, voxels or a near-photoreal plate. Code filler now; a video plate, Blender or a human craftsperson later, where that helps.

- **A leap is an event.** It escalates when its owner returns, and never repeats the same image.
- **Its motivation is story:** whose perception or product it is, or a real event that was itself about media.
- **Its size.** A leap either fills the frame (the band retracts, [§4.1](#41-doors-in)) or lives inside the pixel frame: in a bezel (2.A, 1.A, 3.A), a tile (J1), a tear (J3) or a glass (J6). A bezel leap is still a leap, but it isn't a register change.
- **Its length** is typically 2–8 s. A set-piece that lives inside its medium (the Rashomon, the folder city, the reconstruction) holds it for a sequence.
- **The boundary is practical, not a law.** Extra blocky is technically a pass; J2 and J4 are passes that play at leap weight. Count by how it plays.

### 3.2 The vocabulary

Every medium comes with its own rules, and we keep them for the whole stretch: the premium examples used the real tool and honoured its limits (Blizzard's models, Lego's joints, Hobie's frame-rate recipe, the Nicelanders' cycles: 24, 38, 3, 4). Half-committed pastiche is what reads as amateur. "Ceiling" is measured on this machine ([capabilities §3](../production/style-range-capabilities.md#3-the-table)); render times are per 5 s shot at 1080p.

| Medium | Owner and meaning | Its rules | Filler now | Ceiling today | Final route (what lifts it) |
|---|---|---|---|---|---|
| **Near-photoreal plate** (rooms, skies, weather, water, objects, machines, animals, crowds of nobody in particular) | THE MACHINE when it makes; THE WORLD at J5 | **The bezel rule:** a machine image stays inside a bezel or a signposted render (a screen, the projector, an exhibit, the model's own flashback) until J5, where it escapes once. Never a caricature, a statue, a figurine or a mannequin standing in for one, and never a face from a model. Composited under a matte stepped on the native 4×4 grid. Graded within about a stop of the pixel it replaces. Pixel figures inside it get **contact** ([§4.6](#46-rules-that-carry-over-from-style-jumps-prototype-lessons)). Machine plates carry their month's flaw until Ep6 | three.js PBR on the iGPU: IBL from a CC0 HDRI, GTAO, bloom, glass and water transmission, ~30–45 s. Multi-sample accumulation (16–64 passes) for soft light on slow shots (Prototype 3 proves it) | Good real-time CG; objects can pass at screen size and on held shots | **Video model** for chaos inside its bezel (the mammoth's clip, the Rashomon room) and for J5's sky, ~$1–4 a shot, SYNTH inside the bezel, CONVERT at its edge. **Blender** EEVEE / Cycles for controlled objects and stills. CC0 HDRIs and scanned PBR textures |
| **Soft painted anime** | THE MACHINE: the Mar 2025 image model's look (4.F) | The internet's version of the look, never a studio's designs, creatures, props, compositions or typography. The wave repaints the city's *pictures* (faces on phones, screens and posters) first, then the machine's own cathedral of racks **in its visibly flawed copy**: the warm cast, the mush, lettering that almost reads. No painted skyline or landscape. It never touches THE OLD MASTER's still | Tonal `paint`/`soft` and the GPU watercolour shader (Kuwahara washes, edge pooling, granulation); the anime rig for Mas's portrait with a soft grade | Medium–high; faces need designed washes, not a filter | A video plate for the melt (E4-3); an illustrator's paint-over for Mas's portrait; scanned washes |
| **HD cel anime** | HIM: his self-image as the man who reads every table (10.C) | Limited-animation grammar: held key drawings, camera moves on 1s, multiplane, a painted background, **one hard key light** (chiaroscuro, not soft fill), composited rim light. Played dead straight. The season's stat bars redrawn in cel line. **No hands at insert size.** His glass stays pixel. No speed lines, impact frames, sparkle or sweat drops; faces stay composed | The SVG anime rig (Mas and Nole: layered cel, ink, rim and eye rigs), relit under a single key; one hand-painted key drawing for the eyes. ~13 min on CPU, ~2.3 min on the iGPU (it renders differently there: lock one backend) | Medium today: the rig is soft and pastel with weak hands, below the pixel portraits. Prototype 1 must lift it | **A human key animator**, ~10 s of key drawings. Never a model |
| **Claymation** | MISANTHROPIC's products: CLOD, a clay golem (1.A micro → 7.A → 11.C opt), and MYTHIC | 12 fps on 2s. The camera steps on 2s with hand-placed jitter. The surface re-sculpts on 2s (boil) while the texture holds, as a real puppet's would. Fingerprints and tool drag. Miniature depth of field, one soft key, volume-preserving squash. Close-miked foley in a dry room and one felted-upright line; never a pizzicato "ad cue". The people beside the product stay pixel | three.js clay: lambert with a warm subsurface tint, fingerprint and tool-drag normals, boil, AO, DOF. ~35–50 s on the iGPU. One turnaround still is built with Prototype 3 | High for simple designs, and CLOD is one | **A one-puppet stop-motion day**, or a plasticine maquette photographed or phone-scanned for true surfaces (~$20 of clay) |
| **Paper** (pop-up book, cut-out, shadow play) | MISANTHROPIC's people's words (3.D; 7.E in reserve); KCAJ's essay (6.D) | Folds, never bends. Cut-outs keep their white edge and throw a hard shadow. Shadow puppets are jointed silhouettes under one lamp, whose flicker stays inside the flash limits. Rustle and fold for sound | The puppet kit (card joints, torn-paper breach) and the engraved collage set; 2.5D hinged planes in three.js; jointed silhouettes. 4–6 min for SVG shots | High to premium (built) | Scanned card stocks and torn edges (free); an optional paper-craft day |
| **Low-poly** | ATEM / KRAM: the costume of his last pivot (5.B) | Flat shading, 12 fps, **a vast empty plaza** and a `1 ONLINE` counter; thin compressed app audio with spatial pings. Not the legless-avatar meme (a 2022 joke, stale by 2025) | three.js flat shading, ~15 s | At its ceiling | — |
| **Extra blocky** | THE WHALE: cheap is the product (4.A, 12.E opt) | Our engine at a quarter of the resolution, 8 colours, limited cycles, hop steps and snapped poses (the Nicelanders' rule, 4). 4-bit chip at half the sample rate | The pixel engine at low resolution; mega-pixel at 1/8 | Premium | — |
| **Voxel / the grid gains depth** | THE MACHINE's worlds: the agents' sandbox (9.A, orthographic), the successor's new dimension (11.A) | Cubes only, nearest-neighbour faces, colours from the master palette, shading in whole rungs, glyphs on faces. No block-game look (no grass blocks, biomes or tools). In an extrusion, the first frame is the exact flat pixel frame, and **the people stay flat pixel cards** while the room gains depth. 9.A carries no noir grade: the voxels, glyphs and trench coats carry the gag | three.js instanced cubes; our own frame extruded pixel-for-pixel into ~130k voxels (~20 s on the iGPU; tested). Depth per pixel from the draw stage that wrote it | High. Premium needs the engine's layer/depth export | The engine's layer/depth export (small, additive); optional hand-built voxel pieces; a video CONVERT for rain (E9-1, optional) |
| **True 3D camera** | THE MACHINE, once it builds its successor (11.A) | **The pixel world itself never moves in perspective until 11.A** (R9). Other media may move their own camera inside their own medium (a clay set, the low-poly plaza). Perspective on 1s or stepped on 2s (chosen by the Prototype 2 A/B); motion that obeys gravity; it lands back on the grid | @remotion/three with the pixel sprites as billboards, or the voxel extrusion | High | — |
| **Point cloud → learned objects** | THE MACHINE's own flashback (12.A) | Sparse points converge, but **only the objects the model learned resolve** (the table, the LED "candles", the guests' glasses); the rest of the room stays points and glyph, so the first perfect render is still J5. A person is never rebuilt: every guest stays a pixel sprite in their own POV rim, with the stat bars over them. Mas's glass stays pixel | three.js points resolving to PBR objects with an HDRI; the guests as sprites with contact (Prototype 3) | Medium–high (objects pass; the room would read CG, which is why it stays points) | Blender EEVEE on the iGPU, or cloud Cycles, for the objects |
| **Airbrushed metal album cover** | zAI / NOLE: how he sees himself (6.C pass → 8.B leap) | Gradient bands, chrome rims, star glints. A guitar, never a weapon. No real album art | Tonal `soft` with airbrush bands and chrome ramps (`noleTone`) | Medium–high | An illustrator's paint-over; an image plate for the backplate only |
| **Courtroom pastel** | THE RECORD: federal courts bar cameras, so trials are remembered in sketches [K] (8.D) | Toned paper, pastel strokes, the artist's economy: a few faces finished, the rest gesture | A new stroke renderer from the pixel frame (edges, hatching, toned paper) | Medium–high | **A real courtroom sketch artist**, 3–4 frames |
| **Engraving; halftone** | THE RECORD (J1; J2) | As built in style-jumps §5.1: the certificate's formula, cuts that show the grid | J1 built (`jump-proto-1`); J2 in code from the pixel frame | Premium (J1) | The tonal rigs for J2's halftone |
| **Continuous-tone world** | THE WORLD: the night behind the sky (J3), the sky as footage (J5) | As built in style-jumps §5.2: a tear with torn lips in open sky; the refine in held steps | Built (`proto2`); tonal `soft` for J5's last step | High | A recorded night-air bed (audio); the E12-4 sky plate |
| **Fluid water** | HIM (J6) | Code only, unquantized inside the ring, a constant-speed front, true silence | Built (`proto3`) | Premium | Never a model |

**Held, with no owner yet or a guardrail against it:**
- **Glossy toys, gold statues, figurines and mannequins of caricatures** in physically based materials: a statue of a caricature is a caricature, so the likeness line covers it (R4, default deny). Gold and plastic are drawn instead: toon ramps, hand-built pixel highlights or low-poly gloss.
- **A physical zoetrope** (10.B is now a pixel zoetrope in the engine, [§6.10](#610-ep10--ep19_paceyaml-oct-2026--2027)).
- A watercolour storybook world (it would read as a filter on our dark rooms), cel-shaded 3D (it competes with the anime rig), and rotoscope-like motion (a real rotoscope needs a consenting performer's reference video, which needs a ruling: R11).

### 3.3 How often

- **About 16 leaps across the season:** roughly one an episode, two where the story has two peaks in different acts, three in the finale. Bezel micros (1.A, 3.A) and optional rungs (11.C, 12.E) sit outside that count and play only if the animatic asks for them. That's a description of the map, not a ceiling.
- **Every episode keeps a register strip** ([§6.14](#614-the-register-strips)): every change in order, existing switches included, checked in the animatic.
- **The better test than any count is the animatic:** cut it both ways, and keep the leap only if the version with it plays better (style-jumps' animatic test, kept).
- **Don't stack two leaps in one sequence**, and don't cut back and forth between media. A leap holds its medium steadily.
- **In a two-leap episode, the leaps sit in different acts and different families.** Ep8 is the stated exception ([§6.8](#68-ep8--ep17_statute_of_limitationspdf-apr--jun-2026)).
- **Never cut an owner's first appearance** (1.A, 5.B, 6.C) while keeping its later rungs: the later ones depend on it.
- **What to cut first if an episode feels busy:** full-room device passes down to bezel or OSD size, then the optional items, then the second leap.

### 3.4 Fenced slots, and the booked subtraction

The Simpsons' couch gags, Chainsaw Man's twelve endings and Mob Psycho's paint-on-glass ending sequences show range with no cost to the body of the show (43, 44, 17). MR. MAS has four such places, and books one moment of subtraction.

- **The intro's bar-9 slot** (f480–539, 2.5 s, "like The Simpsons' couch gag", [intro spec](../intro/spec.md)). It may host any pass freely, and a leap medium only as a callback to one the audience has already seen, never a preview of this episode's leap (the intro never spoils). The intro owner decides (R10). The intro's fidelity tiers stay as they are. **Ep12's takeover (12.I) climbs the tiers but stops short of a perfect render**, so it can't spend J5.
- **The title cards.** Every episode's title is a file, and the card can render in its own file type. It has an owner built in (the file), and it gives range-for-its-own-sake a home outside the episode body. The intro owner decides (H9):

  | Ep | Title | The card as its file |
  |---|---|---|
  | 1 | `research_preview.md` | Raw markdown source, the `#` and the asterisks showing |
  | 2 | `her.wav` | A waveform, the title spelled by its envelope |
  | 3 | `strawberry.jpg` | Heavy JPEG compression, 8×8 blocks on the grid |
  | 4 | `not_for_sale.eml` | An email header: From, To, Subject |
  | 5 | `missionaries.docx` | A document with a tracked change in the margin |
  | 6 | `backstop.xlsx` | The P24 cell render: the title in filled cells, a formula bar |
  | 7 | `supply_chain_risk.pdf` | A PDF page with redaction bars |
  | 8 | `statute_of_limitations.pdf` | A court filing: an exhibit sticker and a page stamp (distinct from Ep7's redactions) |
  | 9 | `outside_intended_scope.log` | TERMINAL: the title as a log line |
  | 10 | `pace.yaml` | Indented config, a key and a value |
  | 11 | `assist_clause.txt` | Plain monospace with a blinking caret |
  | 12 | `unclear_which_side.md` | The same markdown as Ep1, rendered this time |

- **The TAG.** When an episode's tag is about media, it may borrow its owner's medium. Writers' call.
- **In-world ads, keynotes and launch films.** The product is speaking, so its own register is licensed: the Big Game ad (7.A), the sponsored lasagna on the jumbotron (7.B, P23), the merger portrait (5.J), the staged duck demo (1.H).
- **THE PLAN stays BLUEPRINT all season.** The company explainer is a strong diegetic medium (30, 31), and its strength here is consistency: it's the one register the audience can always read. The first draft's climbing rungs (11.I, 12.J) are cut.
- **The booked subtraction: the Ep12 button as one unbroken push.** #16–19 (the badge, the monitor, `define "win."`, the ring, the Orb, the title) play as **one slow pixel push with no cuts**, under the room bed. The push moves from the visitor badge to the monitor to the glass; J6 lands inside the take with no cut; the Orb's scan passes through the same frame, and the title sets over it. The only cut is to black. After the finale's leaps and montage, the stillness is what lets the ring land, and it costs nothing. The framing keeps every reformatted window out of the shot.

### 3.5 Plants, anchors and ladders

WandaVision's coloured toy helicopter in a black-and-white world taught the rule with one object (32). One object in the wrong medium, long before the leap, makes the leap feel inevitable. MR. MAS has one object that does the opposite: the thing that never changes medium.

**The anchor: Mas's glass.** It's the season's most consistent object, and it anchors the whole range system. **The glass stays pixel inside every leap**, drawn at 4× nearest-neighbour inside whatever medium surrounds it, until J6 turns it fluid. Then J6 pays off the range system as well as the tell.

| Where | The glass |
|---|---|
| Every episode | Its water line is one flat row; it doesn't ripple (Ep1 #1, #34; Ep2 #3, #27; Ep5 #2; Ep6 #25; Ep7 #7; Ep8 #1; Ep9 #23, where every glass sloshes except his as the sky cracks; Ep10 #10) |
| 7.A (Ep7 #7) | The ad plays on the TV; the glass beside it stays still, and one bead of condensation slides down it |
| 8.B, MAS's render | The AROS room is near-photoreal and the people are sprites; the one thing his render "gets right" is the pixel glass, literally |
| 10.C | A pixel sprite in the anime frame's foreground plane. It may read as a compositing error, so it's tested blind in Prototype 1 |
| Ep11 #11 | Every glass in the city ripples in time, except his |
| 11.A | When the room gains depth, the glass stays a flat pixel card, like him |
| 12.A | Every glass on the reconstructed table resolves near-photoreal except his: the model learned everything at that table but him |
| J6 (Ep12 #17) | One ring, continuous and fluid, the first all season |

**The tell ladder.** Everyone's tell as a stat bar, and nothing over Mas: the season's key recurring graphic about him. Each rung keeps the shape and the fill order.

| Rung | Where | What it shows |
|---|---|---|
| 1 | **4.C / F4.1** (Ep4 #15, 2003–05 dorm poker) | "Everyone's tells float over their heads as stat bars; over Mas's head there's nothing." Played in the base, so the bars read clean |
| 2 | **10.C's pre-roll** (Ep10 #19, pixel) | G6 THE HOTSPOT: his cursor passes over each player and the label shows the tell; the dealer isn't a hotspot |
| 3 | **10.C** (anime) | The same bars redrawn in cel line over the four players he reads. Over the Intern's caret face, nothing: "the same blank as over Mas's in ep4." The rhyme with his own blank is the chill |
| 4 | **J4** (10.D) | The machine's view: the tells rise as columns of tokens; two blanks, Mas and the Intern |
| 5 | **12.A / F12.1** (Ep12 #6) | The camera in his chair: the bars over every drawn guest; over his reflection in the window, nothing |

**Plants.**

| Plant | Where | Pays off in |
|---|---|---|
| The render front re-rendering the world | The intro, every episode | Inside the bezel (2.A), inside the model's flashback (12.A), and once in the world (J5) |
| The hairline in the sky (J3's rung 0) | Ep1 #19 (the KA-CHING crack); optionally Ep5 and Ep6 #17 (A1) | J3, then J5 |
| A clay CLOD on the lighthouse monitor | Ep1 (1.A, 4 s) | 7.A, 11.C |
| The melted chair left as a pixel puddle | Ep2 (2.A), the one scar | Gone from the boardroom by Ep6, when the fidelity has healed |
| The strawberry photo, the only photograph in the dark room, kept in its phone | Ep3 (3.A) | J5, when a photographic image leaves its frame for the first time |
| NOLE's airbrush pass | Ep6 (6.C) | 8.B |
| The folder city: a world with depth, but a camera that never moves in perspective | Ep9 (9.A) | 11.A |
| Masked GLYPH in cones and reflections | Every episode | J4 |
| The bead of condensation | Ep7 #7 | J6 |
| The class-photo ladder | Ep1 → 7.H → 12.C | 12.C |

---

## 4. Entering and exiting

Every change of look follows [flow-and-continuity](flow-and-continuity.md): it stays inside a sequence, it comes in through a motivated bridge, and the sound bed carries across. A style change that arrives as a plain cut or a crossfaded "filter on" reads as an effect. The exception is when the filter *is* the joke: in 4.F the image app repaints Mas's portrait on his phone before the wave reaches the city's other pictures, because applying a filter is what the app does.

### 4.1 Doors in

| Door | How it works | Used by |
|---|---|---|
| **Push into the device** | The camera pushes into a screen, lens or bezel until the device's picture fills the room area (pixel-step push-ins) | Device passes; the handheld (4.E); the folder city (9.A) |
| **Cut to the device's point of view** | A hard cut to the camera's corner, the stadium feed, the deposition camera | Device passes |
| **The bezel** | The machine's image plays inside a screen, the projector or an exhibit frame; if it leaves, it becomes ours at the edge (the genvideo pixelize converter does this cheaply) | THE MACHINE's makes, all season until J5 (2.A, 3.F, 8.B) |
| **The band retracts** | The verb and inventory band slides down out of frame in three held steps and the room takes the full 270 lines: the old adventure-game cutscene convention, a door native to the form. It returns, in held steps, on the exit | Every leap that fills the frame (4.F, 5.B, 6.D, 7.A, 8.B, 9.A, 10.C, 11.A, 12.A) |
| **The render front** | The intro's glowing 1-px seam re-renders the world behind it, like a progressive JPEG ([intro spec §4.2](../intro/spec.md)). Inside a bezel or the model's own flashback until J5 | 12.A; J5 |
| **Refine** | The masked region steps up its resolution one held step per beat (4×4, 2×2, 1×1, then unquantized) | J5 |
| **The product's surface** | A pane, a jumbotron, an ad break, a lantern, a box: the product opens | THE BRANDS |
| **The flash-print** | Two frames of one flat paper tone (≤ 80% white), then the new medium whole | THE RECORD |
| **The tear** | A torn line in open sky, pulled apart in held steps (style-jumps §5.2) | J3 |
| **The event is the front** | The event's own leading edge carries the new medium (the ring) | J6 |
| **Hard cut on a diegetic sound** | The new medium's first frame is the frame of a click, a thud, a card snap, on the beat | 10.C, J4 |
| **The frame gains depth** | The first 3D frame is bit-identical to a full, recognisable pixel frame, and the camera's first move reveals that the flat world has a side we never saw | 11.A |
| **Match cut on a shared object** | The same prop or gesture in pixel, then in the new medium, with the sound carried across. The audience realises a beat late (Satoshi Kon, 35) | Any family; the most fluid door there is |

### 4.2 Ways out

Plan the exit first. The strongest switches in the references end on meaning, and the snap back to pixel should *land* something: the laugh or the chill the leap set up.

| Exit | How it works | Used by |
|---|---|---|
| **Snap** | A hard cut on the beat back to the exact pixel frame the leap left, or its next held drawing | The default |
| **Back into the device that made it** | A melt, a collapse into the monitor's glow, the end card shrinking into the TV | THE MACHINE, THE BRANDS |
| **The product closes** | The plaza empties and collapses to a sprite, the book folds shut, the lantern is set down | THE BRANDS |
| **A physical act** | The erase stroke, the snap, the fold, the stamp | THE RECORD |
| **Seal** | The tear closes in held steps and leaves one pixel scar | J3 |
| **Settle** | The event finishes, then the snap | J6 |
| **The fall lands** | The 3D camera's travel ends on a plane of the pixel set, and depth collapses in held steps | 11.A |
| **The band returns** | After any full-frame leap, the band steps back up into place in held steps, on a beat | Every full-frame leap |
| **Hold** | No way back | J5 only, if its hold is signed |

### 4.3 By family

| Family | In | Out | Band | Sound |
|---|---|---|---|---|
| **THE DEVICE** | Push into it, or cut to its point of view | Leave the device: pull back to the room, or its UI closes | **Stays** | The room's bed continues, and the device's own speaker carries (a CCTV hum, a stream's compression, a stadium PA) |
| **THE MACHINE** | The bezel; inside it, the render front or a refine | Back into the device that made it. At most one pixel scar | Stays for a bezel; retracts for 9.A, 11.A, 12.A, J5 | **Period-true.** 2024 clips are silent (2.A, 3.F's sleigh): the room's bed runs under them. From AROS 2 (Ep6) its clips carry their own sound through their device's speaker. When the machine takes the frame (9.A, 11.A, 12.A), the chip lead's timbre steps toward acoustic (piano, strings) and a recorded full-band ambience comes in about 10 dB under. At J5 that air enters the room. No risers, no whooshes |
| **THE BRANDS** | The product's surface | The product closes | Retracts | Each brand's own sound. Clay: close-miked foley in a dry room and one felted-upright line. Low-poly: thin, compressed app audio with spatial pings. THE WHALE: 4-bit chip at half the sample rate. The handheld: four square-wave channels. NOLE's airbrush: the house brass through fuzz. Paper: rustle and fold. Shadow play: the lantern's hiss |
| **THE RECORD** | The flash-print | A physical act | Stays when the print lives in the frame (J1's tile, J2's crop); retracts for 8.D | Silence, or one sound true to the medium (a shutter, a pastel scratch) |
| **HIM** | Hard cut on a sound (10.C); the event is the front (J6) | A hard cut on a sound; it settles | Retracts for 10.C; stays for J6 | 10.C: the score's own piano and strings, played straight, never an anime sting. J6: true silence |
| **THE WORLD** | The tear, the refine, or the event's visible cause | The seal, the hold, or the cause ending | Stays for J3 and P30; J5 per its sign-off | Real, full-band outdoor air, about 10 dB under the room, at full level on the cut. P30: the room's hum steps down with its lights |

### 4.4 Sound across a change

- **The bed continues.** Room tone keeps running, and music plays as a continuous performance ([flow-and-continuity §3](flow-and-continuity.md#3-sound-a-continuous-bed)). When the picture changes medium, the music **re-voices** (the chip lead drops or changes timbre, the cue carries on in piano and strings) or **thins** (melody out, a pedal holds). It doesn't stop dead and leave a hole.
- **Designed silence is a rare story beat:** J1 sits inside the Cancel click's digital silence (D6), and J6 is silent. Those two are the season's. A silent machine clip (2.A) isn't silence: the room's bed runs.
- **A deliberate music stop** is punctuation, on a story beat, with a clear re-entry. 10.C's strings stopping on the cut into J4 is one.
- **No stingers, whooshes, risers, reversed cymbals, glitch stutters or meme sounds.** No heartbeat or breath (X3). Two beats currently break this and are handed off (H2, H4): Ep8 F8.1's soap-opera coda "as organ-stinger melodrama" (the organ plays as a bed, never a stinger) and Ep12 #4's "little swap-whooshes" (the sort is silent, like the rest of Ep12's machine).
- **One sound per event, not per frame** (style-jumps lesson 14). A bed that replaces the room arrives at full level on the cut, about 10 dB under it (lesson 13).
- **This changes style-jumps §3.4** ("the running cue stops dead on the downbeat"). The soundtrack pass owns the cue-level detail (H4).

### 4.5 How long they tend to last

Reference points, not limits. Watch it and decide.

| Kind | Typical length |
|---|---|
| A device pass | As long as the device is on screen: a few frames to a whole sequence |
| A feeling pass | A beat to a hold (2–6 s) |
| A record print | 1–3 s |
| A leap inside a bezel (a cameo on a monitor or a phone) | 1–4 s |
| A leap | 2–8 s |
| A set-piece that lives inside its medium | 15–45 s (the Rashomon's four renders together: up to about 90 s) |
| Out versus in | Out is usually faster than in; both land on the grid |

### 4.6 Rules that carry over (from style-jumps' prototype lessons)

These were learned on screen, and they apply to every leap.
- **Show a new medium by what it bends, cuts or cools, not by its own glow** (lesson 1). **Brightness isn't fidelity:** grade within about a stop of what it replaces, and let resolution and fine detail carry the difference (lesson 2).
- **Contact sells a shared frame.** When pixel figures stand in a near-photoreal or 3D place (Roger Rabbit's swinging lamp, 37), give them all four, and prove them on screen (Prototype 3):
  - **Occlusion:** the place's near surfaces (a table edge, a chair back) cover the sprite correctly at its depth.
  - **Shadow:** the sprite casts a shadow from its own alpha onto the plate. The shadow belongs to the plate's light, so it may be soft there.
  - **Reflection:** the sprite appears as a pixel image in the plate's glass, metal and polished wood.
  - **Light on the sprite in whole palette rungs:** the place's light reaches the sprite as a one- or two-rung step on the faces that face it (lesson 23), never as a continuous cast, and never on Mas as a continuous cast.
- **A clean edge is a layer; a torn edge is a surface** (lesson 21). Mattes are stepped on the native grid.
- **Easing is a genre** (lesson 4). Physical events move at their own speed.
- **Check every line and trail for chart, arrow, lightning and logo reads** (lessons 5, 17). In a show about markets, a jagged line over a skyline is a price chart, and a curve falling off a cliff is a crash (11.A's mitigations are in Prototype 2).
- **Scale sets the read** (lesson 7): frame every leap object with enough context to name it cold.
- **Mas never freezes, in any medium.** When the world prints or stops, he keeps one live motion that belongs to what he's doing (lesson 25).
- **The UI never jumps.** The rail, truth labels, subtitles and portrait windows stay pixel, on top and in place. The band moves only by its own convention (retract and return in held steps), never in a cut.
- **One scar at most**, on one object.
- **Land on a face** (Mas's, his glass or the Orb's) within about 10 s of an exit.
- **Exits need a mask and an order** (lesson 20): out first, then the space closes.
- **Stray marks cost more than they seem** (lesson 26). Check the frames around every change at 1:1.
- **Determinism:** hash seeds only, no `Math.random`, no `Date`. Footage plates are frozen files with provenance.
- **Lock one render backend per sequence.** The anime rig renders visibly differently on the GPU; the pixel engine is bit-identical on both ([capabilities §2](../production/style-range-capabilities.md#2-render-backends-measured)).

### 4.7 Script notation and the ledger

The change goes in the scene heading and gets one line where it lands:

```
[BASE · PASS P1 · full]
PASS P1 CCTV · DEVICE · full room · 3 s · in: cut to the corner camera · out: the DEEPFAKE stamp

[BASE · LEAP 4.F]
LEAP 4.F · MACHINE · soft painted anime · 8 s · band: retracts · in: his portrait repaints on his phone, then the city's pictures · out: the melt drains into the racks · sound: chip → piano and strings, continuous
  FILLER: tonal paint + watercolour shader + anime rig · FINAL: GEN E4-3 (melt), human paint-over (portrait) · fallback: filler
```

A device pass names its size (`OSD`, `bezel`, `full`). Booked jumps keep their names (`JUMP J1` in existing scripts reads the same as `LEAP 1.E`). THE EDITOR logs every leap in the episode's POV ledger ([POV §8.3](pov-and-framing.md#83-the-pov-ledger-one-per-episode-filled-in-by-the-editor)): the id, the frames, the owner, the taste tests, the animatic cut both ways, and the episode's register strip. A `GEN:` line marks any slot a generated take may later fill ([GENAI §1](../production/GENAI-UPGRADE-PLAN.md#1-principles)).

---

## 5. Guardrails and taste tests

### 5.1 Firm lines

These are the showrunner's guardrails. They don't bend for range. When a leap and a guardrail disagree, the leap goes.

- **Likeness.** Never photoreal or near-photoreal on any caricature of a real person, Mas and every rival included. That covers **statues, reflections, portraits, toys, figurines, mannequins standing in for people**, and deepfakes shown as footage. None of them gets a physically based or path-traced material on the caricature's form: gold and plastic on a caricature are drawn (toon ramps, hand-built pixel highlights, low-poly gloss). R4 defaults to **deny** until the showrunner rules.
- **Near-photoreal is for** environments, objects, machines, animals, weather, skies, crowds of nobody in particular, and fictional characters (THE INTERN, THE MODEL, the mammoth). No face or performance ever comes out of a model ([GENAI principle 4](../production/GENAI-UPGRADE-PLAN.md#1-principles)), so a near-photoreal fictional character is built, not generated.
- **Stylized caricatures are fine in any stylized medium:** anime, clay, low-poly, paper, pastel, painted, voxel (R2). Painted and soft treatments start from the on-model drawing (the sprite or the anime rig), never from a photo, and never add realistic skin.
- **Evoke, don't copy.** No imitation of a named studio's trademarked look on screen, and no named living artist's look. We evoke a genre through its grammar (cel shading, two-tone shadows, held keys, timing, aspect ratio, camera mount, palette), never a studio's character designs, creatures, props, compositions, landscapes or typography. STUDIO IBLIHG in 4.F is the test case (R7): its most recognisable signature is the lush painted landscape, so 4.F paints no landscape, and its paint is the machine's flawed copy.
- **Parody names and logos only,** in every medium: no real game, franchise, console, app UI, masthead, wordmark or typography ([guardrails §5](guardrails.md#5-legal-hygiene)).
- **Never clone a voice.** Human performers, or voices designed from text only. When the story depicts a real voice clone (Ep1 #16's anchor, #17's senator opening his own hearing), the voice is designed from text or performed by a human, never an imitation of the real person, and a burned-in `[AI-GENERATED AUDIO]` caption sits under the broadcast's lower third. When the Researcher imitates RUMPT's cadence (Ep11 #6), a human actor performs it.
- **The X list holds in every medium** ([guardrails §1](guardrails.md#1-hard-exclusions)): no war imagery, sexualized content, family, health, deaths or the rest of X1–X12. A new medium is never a way around an exclusion.
- **Photosensitivity** in every medium ([guardrails §7](guardrails.md#7-broadcast-safety)).
- **1080p maximum**, never `--scale` above 1 for deliverables.

### 5.2 Strong guidelines

- **Fairness.** No leap takes a real politician as its subject (R8). Politicians get device passes (a broadcast, a game-show set); the leaps stay on the tech figures and the machine. **No pass speaks for a politician's perception** either: 8.A stages the not-seeing objectively, in the room, not from RUMPT's eyeline.
- **POV.** Mas is in the frame, or it's his screen, phone, window or glass ([pov-clarification](pov-clarification.md)). A leap into someone else's version is signposted.
- **Inner life on invented beats only.** HIM's media never land on a real event, where they'd assert his intent or feelings. That's why the anime read is at Ep10's invented poker game and not at THE HUG or the trial. And before J6, no pass reads his inner state at all ([§2.2](#22-the-vocabulary)).
- **Truth.** A leap carries no claim beyond its tag, never amplifies a causation the record doesn't hold, and never dresses a real quote card. Facts stay on the rail, in pixel. A staging the record doesn't support (Mas in a stadium box at the Big Game) defaults to one it does (the TV in his room).
- **Spoilers.** No leap's frames appear in the intro, recaps, previews, thumbnails, promos or reels shown outside the room before its episode airs. The intro slot only calls back.
- **Invented must look invented** ([guardrails §5](guardrails.md#5-legal-hygiene)): never a realistic-looking invented scene that implies real misconduct.

### 5.3 Taste tests

Run these in the script, again in the animatic, and again on the built shot. They're judgement tools.

1. **Owner.** Whose look is this, in one word? If nobody's, it goes.
2. **Motivation and door.** Does it enter through something in the story? Would a newcomer know why the world changed?
3. **Does it serve the scene?** Cut the animatic both ways. If the version without it plays as well, cut it. If the laugh works without the leap, the leap was decoration.
4. **The cold viewer.** The first full frame tells a cold viewer why the world changed, before any sound or text, **at full frame and at phone size.** Blind reads only: the mp4 and unlabelled stills (style-jumps lesson 27). Nobody should reach for the words "filter" or "effect". A clip with no context reads as a filter by construction, so every test clip carries its door and its exit.
5. **Corn.** No wink at the audience; the grand register is played dead straight, which is why Death Note's potato chip works (20). No meme sounds, no glitch as a wipe, no anime shorthand (speed lines, sparkle, sweat drops), no pastiches stacked back to back. **A device pass is the device itself** (Draft Night *is* a sports broadcast; THE ROUND TABLE *is* a game show), so it isn't a genre quote. **A leap may not re-draw a genre gag in that genre's medium for emphasis**: a western at HIGH NOON, a mecha at THE TRANSFORMER, a food commercial on the lasagna gag, noir rain on the trench-coat gag.
6. **Premium.** Does it commit to its medium's rules for the whole stretch? Would someone who works in that medium accept it? Does its simplification read as a choice? Does its seam belong to the pixel world? **Does it look at least as finished as the pixel base it leaves?**
7. **The exit lands.** Does the return to pixel land a laugh, a chill or a fact?
8. **Evoke, not copy.** Could anyone name the studio, the franchise or the show it's copying? Then it's copying. That includes well-worn devices from other shows: floating deduction words over a suspect belong to a famous live-action detective, so the read uses the season's own stat bars.
9. **Flow.** Does the sound carry? Does it add cuts, or strand the audience between registers? Does the episode's register strip still let it stay in one register for a while?
10. **Escalation.** When a medium returns, does it top or clearly differ from its last appearance?
11. **Mas's tell.** Does anything in it read his inner state before J6? Is his glass still pixel?

### 5.4 Declined

From the opportunity map ([§9](../_sources/research/style-range-opportunities.md#9-declined)) and the critic pass, with the reason in brief:
- **zAI's anime companion as a lens:** KORG's never-do list bans the companion characters, and "spicy mode" is X7. NOLE gets the airbrushed album cover.
- **Any photoreal fake of a public figure from the record** (the puffer-coat pontiff, the arrest fakes, deepfake Mases as footage): the likeness line. The fake CCTV clip stays drawn.
- **Path-traced or physically based statues, figurines and mannequins of caricatures** (4.A's gold NESNEJ, 5.E's SIMED figurine, 8.B's mannequins, 2.B's digital twin): the likeness line covers statues and toys.
- **RUMPT's AI self-portraits as a leap:** fairness, and guardrails §1b bars religious-costume and war-themed images. The podium's AI-rendered surface stays a prop.
- **A film-grade look for "her":** it points at the actress, who is never drawn or voiced.
- **An anime inner war at THE HUG or the trial:** real events. Moved to Ep10.
- **THE TRANSFORMER as mecha, HIGH NOON as a western, the lasagna as a food commercial, the folder city as noir rain** (as leaps): genre gags re-drawn in their genre's medium.
- **Ep3's podium turn:** it would amplify a causation the record doesn't hold, around a politician.
- **NOLE through the ceiling in anime (Ep12):** an arrival gag with nothing to motivate the medium.
- **A "deep-fried" meme pass; P33 PALETTE HIT; P34 MOOD DRIFT:** corn at this show's rate, and a mood drift is a ripple by another name.
- **Floating deduction words at the poker table:** a well-worn live-action device (test 8).
- **5.C's lensing on the "event horizon" post:** it puts HIM's medium on a real blog post and a real date; the black-hole gag already works in pixel.
- **The legless-avatar meme** (5.B): a 2022 joke, stale by 2025.
- **YLLIT near-photoreal:** held, not declined. It's fictional, but it needs its own ruling against the no-faces-from-a-model principle (R5).

---

## 6. The season map

**How to read it.**
- **Id** is the opportunity map's episode.letter. **★** marks the slate; **opt** marks an optional item that plays only if the animatic asks for it; **KEEP** marks a booked style-jumps jump. Cut and reserve items are listed in [§6.15](#615-reserve-and-cut). The full menu of 95 moments is in [opportunities §5](../_sources/research/style-range-opportunities.md#5-the-map-episode-by-episode).
- **Beat** numbers are the 2026-09-26 `beats.md` numbers. The season revision may renumber them; the ids stay.
- **Status** is **proposed** for everything except the J-ids, which carry their style-jumps status.
- **Size** for a device pass is OSD, bezel or full ([§2.3](#23-how-often-and-how-big)). **Band** says whether the verb and inventory band stays or retracts.
- **FILLER** is the fully programmatic version, built now for the first pass and cut into the animatic. It must play well on its own and hold the moment's timing, framing, masks and meaning, so the final is a layer swap.
- **FINAL** is the intended final-draft route. **CODE**: the filler is the final. **VIDEO**: a video-model plate for environment, object or creature layers only, per the [GENAI plan](../production/GENAI-UPGRADE-PLAN.md) (720p, audio off, CONVERT or SYNTH, through the gate; E-codes are [genai-candidates](../production/genai-candidates.md) ids), and only inside a bezel or a signposted render until J5. **IMAGE**: an image-model plate for a backplate or object, never a cast member. **BLENDER**: Blender EEVEE or Cycles for controlled near-photoreal objects. **HUMAN**: a craftsperson. **SCAN**: real material references. If a final fails the gate, the filler ships.

### 6.1 Ep1 · `ep1.0_research_preview.md` (Nov 2022 → Dec 2023)

*The season revision owns this episode; the Act Four v4 pass owns sc 24–31. Everything here is an option for them.* The pilot teaches two grammars: each company lives in its own medium (1.A, in a bezel), and the record prints (J1).

| Id | Beat | Tier · medium · owner | In → out | Length | FILLER (now) | FINAL | Status |
|---|---|---|---|---|---|---|---|
| **1.E ★ KEEP J1** | sc 26, the Cancel click | 2 · **engraving**: the tile prints as a `CANCELLED` certificate · RECORD. Band stays | Flash-print → snap, then the tile falls through its slot | 1.9 s | Built: `jump-proto-1` | CODE | booked · near lock (jump-fix pass) |
| **1.A** micro | sc 11 / #12, the split-screen duel (Mar 14, 2023) | 2 in a bezel · **claymation**: CLOD alone in clay on the lighthouse monitor, 12 fps with thumbprints; Mario stays pixel beside it · BRANDS (the owner's first appearance). Band stays | The monitor's picture is clay from its first frame → it returns to pixel on "Addendum." | ≈ 4 s | three.js clay on the iGPU (the CLOD kit from Prototype 3's turnaround) | HUMAN: the stop-motion day (the same puppet as 7.A and 11.C); SCAN a maquette | proposed |
| **1.F ★** | #16–17, the anchor and the Senate (May 12–16, 2023) | 1 · **P3 BROADCAST**, full, for the hearing's establishing wide and the voice-cloned opening · DEVICE. #16's anchor plays at bezel size on the phone | In on the hearing wide → out when we go close on Mas | 3–6 s | Code. **The voice:** designed from text or performed by a human, never an imitation of the senator or the anchor; a burned-in `[AI-GENERATED AUDIO]` caption under the lower third (and on the phone at #16) | CODE; the voice cast per the soundtrack pass | proposed |
| 1.G | sc 26–27 / #27, the firing call | 1 · P2 CALL on the other tiles (soft, never a glitch) · DEVICE. In-frame | The whole call | The call | Code | CODE | proposed (Act Four v4's option) |
| 1.H | #33, the staged duck demo (Dec 6, 2023) | 1 · P23 PROMO GRADE at bezel size, then the pull-back reveals the rod in pixel · DEVICE | The promo fills the monitor → pull back to the rod | 3 s | Code (stepped-resolution focus, no blur) | CODE | proposed |
| 1.B, 1.C, 1.D | #11 Kram's leak; #19 NESNEJ's keynote stage; sc 30 TASYA's "below, above, around them" | — | — | — | — | — | held: 1.B plays at 5.B; 1.C has no owner now; 1.D because the pixel world never moves in perspective before Ep11 (R9) |

Existing switches stay: F1.1 1-BIT, the #4 freeze, the sc 17 LEDGER, THE PLAN, masked GLYPH. The KA-CHING hairline in the sky (#19) stays a pixel line: it's J3's plant. Title card: raw markdown ([§3.4](#34-fenced-slots-and-the-booked-subtraction)).

### 6.2 Ep2 · `ep1.1_her.wav` (Jan → Aug 2024)

| Id | Beat | Tier · medium · owner | In → out | Length | FILLER (now) | FINAL | Status |
|---|---|---|---|---|---|---|---|
| **2.A ★** | CO #1, THE AROS MAMMOTH (Feb 15, 2024) | 2 in a bezel · **near-photoreal creature** inside the boardroom screen, at the first preview's fidelity: the walk slides a little. **Silent**, as the preview was; the boardroom's bed runs · MACHINE, and a real event that was itself about media. Band stays | SELBEEP hits play; the mammoth walks in the screen → **it steps through the bezel and turns to pixel at the edge.** The sliding walk carries over into pixel; a chair it brushes melts in pixel and is left as a puddle (the one scar); it walks out through the far wall, which stays pixel | 6–8 s | A three.js PBR walk in a snow plate, built to hold at screen size only; the pixelize step at the bezel with the genvideo converter's logic; the pixel mammoth as 8 drawings after the step-out | VIDEO: E2-1 SYNTH inside the bezel → REF/CONVERT at the step-out (R6); no people in the plate | proposed |
| 2.C | #13, "her" eclipses the demo | 1 · P5 STREAM, full · DEVICE (never a film-grade look: it would point at the actress) | The launch stream frames the stage | The set-piece | Code | CODE | proposed |
| 2.D | #9, XEL's show | 1 · P6 PODCAST (the mics grow between answers), full or bezel · DEVICE | The studio's two cameras | 4 s | Code | CODE | proposed |
| 2.E | #28, the Orb's wordless fact-check | 1 · P21 IRIS → `verified: human (all of them)` · MACHINE | The iris opens | 2 s | Code | CODE | proposed |
| 2.F | #20–21, WWDC on his phone → F2.1 | 1 · P7 PHONE → EARLY-WEB16 · DEVICE | Existing | — | Existing | CODE | existing |
| 2.G | #6, THE EMAIL SÉANCE | 1 · P19 SPIRIT PHOTO, inside the candle's pool of light · RECORD. In-frame | Each ghost rises in double exposure → the candle snuffs into F2.3 | 2–3 s a ghost | Code | CODE | proposed |

**For the season revision (H2):** Ep2 #1 reads "A photoreal woolly mammoth walks through the boardroom. An extra grows a sixth finger." The mammoth is near-photoreal only inside the screen, and the sixth finger goes: there's no person in a machine plate, and P29's flaws never land on a person. The chair and the slide carry the flaw.

### 6.3 Ep3 · `ep1.2_strawberry.jpg` (Aug → Dec 2024)

| Id | Beat | Tier · medium · owner | In → out | Length | FILLER (now) | FINAL | Status |
|---|---|---|---|---|---|---|---|
| **3.D ★** | sc 19 / #16, F3.3, the exodus as a band breakup | 2 · **paper pop-up book**: fold lines, pull-tabs, the tour bus splitting on pop-up hills · BRANDS (MISANTHROPIC's founders' own telling). Band retracts | The camera follows LUNCHMAS's footprints down the bridge planks, and the planks become the book's first spread → the book folds shut on the fuel-stop sticker, and the fold becomes a plank seam | ≈ 15–20 s | 2.5D hinged paper planes in three.js with the puppet kit's card textures | SCAN card stocks; HUMAN optional paper-craft day | proposed |
| 3.A micro | CO #1, the garden photo (Aug 7) | 2 in a bezel · a **near-photoreal strawberry photo** on his phone, the only photograph in the dark room (the plant for J5) · DEVICE and the record (he posted a real photo) | Phone screen only; the pixel strawberry with one bite missing (#25) answers it | 2 s | three.js PBR still with accumulation | BLENDER Cycles still (one frame), or IMAGE plate (object) | proposed |
| **3.B ★** | #7, HOW MANY R'S? | 1 · P4 SPORTS, full: the jumbotron replay, a telestrator circle on the nervous kicker · DEVICE | The stadium's cameras → out on the owner's box | 4–8 s | Code | CODE | proposed |
| 3.C | #7, the shutter | 1 · masked GLYPH through the slats for 12 frames · MACHINE. In-frame | On the slam | 0.5 s | Existing | CODE | proposed |
| 3.E | #12–13, $157B → F3.2 | 1 · LEDGER | Existing | — | Existing | CODE | existing |
| 3.F | #21, SHIPMAS | 1 · P5 STREAM with an advent-calendar UI; door 3's mammoth-sleigh is AROS in a stream window, still silent, its runners still drifting (the spine) · DEVICE, MACHINE | Doors open as stream segments | The set-piece | Code; the sleigh as a three.js clip in the window | VIDEO: a small plate for door 3, inside the window | proposed |

### 6.4 Ep4 · `ep1.3_not_for_sale.eml` (Jan → Apr 2025)

*The episode where the internet turned into paintings, and the season's busiest strip ([§6.14](#614-the-register-strips)). It carries one leap; THE WHALE plays at pass weight, and F4.1 stays in the base so the first rung of the tell ladder reads clean.*

| Id | Beat | Tier · medium · owner | In → out | Length | FILLER (now) | FINAL | Status |
|---|---|---|---|---|---|---|---|
| **4.F ★** | #21, OUR GPUS ARE MELTING (Mar 25–31, 2025) | 2 · **soft painted anime** in the machine's visibly flawed copy (the warm cast [K], the mush, lettering that almost reads) · MACHINE, and a record that is itself about a medium. Band retracts at the cathedral | Mas's portrait on his phone repaints first (the app's own filter: here the "filter on" is the joke), then the city's other pictures (faces on screens, posters and billboards) repaint in a wave, then the data-center cathedral repaints in the flawed copy → the paint gets hotter and runs, the racks drip into the lava rivers, the paint drains away in the melt and the pixel cathedral is under it; the lava cools to gold bars in pixel. **THE OLD MASTER's still** sits small in the corner with its context note, is never touched by the paint, and is out of frame at the wave's peak. No painted skyline or landscape | 6–10 s | Tonal `paint` + the watercolour shader for the cathedral; the anime rig for Mas's portrait with a soft grade; the melt in code | VIDEO E4-3 for the melt; HUMAN illustrator paint-over for Mas's portrait; SCAN washes. Characters stay rig | proposed (R3, R7) |
| 4.A | #9, THE PEBBLE (Jan 27, 2025) | 1 at pass weight · **P10 extra blocky**: THE WHALE's beach chair and pebble at a quarter of our resolution · BRANDS (the cheap model is cheap) | Cut to the Whale in its own resolution; the pebble skips across the red tickers and crosses into ours on the skip → it hits NESNEJ's statue, drawn in pixel with the base's hand-built gold ramp, and the statue shatters into 1-bit pixels, which is F4.2's door | 3–4 s | Pixel engine at quarter resolution with limited cycles; the shatter in code | CODE | proposed |
| 4.C | #15, F4.1 dorm poker (2003–05) | **Base.** The first rung of the tell ladder: everyone's tell as a stat bar, nothing over Mas. No DV pass, so the bars read clean · RECORD | A poker chip spins in and out | The flashback | Code | CODE | proposed |
| **4.E ★** | #18, CLOD 3.7 ships (Feb 24–25) | 1 · P9 HANDHELD-4, full: CLOD plays a monster game on a stream, stuck in a cave, walking into the same wall. *You're absolutely right! This is a wall.* [INVENTED] · DEVICE, the record. If the strip plays busy: bezel size, inside the lighthouse monitor | Push into the lighthouse monitor until the handheld frame fills → the stream's chat slides in and we pull back to Mario fretting | 4–6 s | Code | CODE | proposed |
| 4.H | #13, Paris: NORCAM's deepfakes hold his press conference | 1 · P3 BROADCAST at bezel size, on the press conference's monitors; the deepfakes stay visibly drawn · DEVICE | The monitors in the room | 3 s | Code | CODE | proposed |
| 4.B | #10, F4.2 1993 | 1 · 1-BIT | Existing | — | Existing | CODE | existing |
| 4.G alt | #23, the sycophancy update | 2 · a gilded oil portrait, painted from the on-model drawing · BRANDS | The reply renders him; he looks a beat too long → "roll it back." snaps it | 2–3 s | Tonal `paint` | CODE | alternate: only if 4.F is cut; otherwise a flattering bloom on the reply's thumbnail (Tier 1, bezel) |
| 4.D | #14, HIGH NOON | — | — | — | — | — | held: a genre gag in its genre's register |

**An Ep4 egg, not a plant:** in 4.F's door his phone avatar repaints and stays painted for the rest of Ep4, on his phone only, if his real avatar change verifies [K, unverified: the web-search budget for this pass was used up; H7]. It doesn't carry past Ep4: the UI never jumps, and a 10–16 px avatar can't carry a payoff.

### 6.5 Ep5 · `ep1.4_missionaries.docx` (May → Aug 2025)

| Id | Beat | Tier · medium · owner | In → out | Length | FILLER (now) | FINAL | Status |
|---|---|---|---|---|---|---|---|
| **5.B ★** | #9, Kram unveils Draft Night (Jun 12) | 2 · **low-poly → pixel** · BRANDS (every pivot is a costume change). Band retracts | The jumbotron lights, and we push into it: Kram's greeting is his old metaverse self, a low-poly avatar alone in a vast empty plaza under a ghost METAVERSE sign, a counter reading `1 ONLINE` → he unzips it and steps out into pixel in the host's suit; the plaza collapses to a pixel sprite on the jumbotron and the screen goes dark. It doesn't linger under the draft's broadcast pass | 3–4 s | three.js flat shading, 12 fps | CODE | proposed |
| **5.A ★** | #10, Draft Night | 1 · P4 SPORTS, full: pick cards reading `POACHED`, a ticker, a telestrator circle · DEVICE. The crowd behind the stage defocuses by stepped resolution, never a blur | The stadium feed, throughout | The sequence | Code (Prototype 4) | CODE | proposed |
| 5.F | #11, the podcast | 1 · P6 PODCAST at bezel size (on the boardroom TV), so #9–12 don't turn over four registers | — | 3 s | Code | CODE | proposed |
| 5.G | #12, the monks' vigil | 1 · P31 CHIAROSCURO: the phones under the robes are the only cold light (no religious iconography) · FEELING, on other people | The vigil wide | The beat | Code | CODE | proposed |
| 5.H | #26a, the Orb flags MOSWEN's meme `EDITED` | 1 · P21 IRIS (the fairness mirror of 2.E) · MACHINE | The iris | 2 s | Code | CODE | proposed |
| 5.I | #24, the chart crime | 1 · P5 STREAM, full: the `BIGGER NUMBER` bar shorter than the `SMALLER NUMBER` bar · DEVICE | The livestream's slide | 3 s | Code (Prototype 4) | CODE | proposed |
| 5.J | #27, YNOJ's merger portrait | 1 · the published portrait's own black and white, at bezel size (a post on his phone); no velvet plate · DEVICE | The portrait → out when the second cloth appears | 3 s | Code | CODE | proposed |
| 5.D | #24, the GTP-5 teaser | — | — | — | — | — | held: franchise risk, and it spends sky before Ep9 |

A1 (optional): a 12-frame glimpse of continuous tone in the #17 hairline. Title card: a tracked change in a `.docx`.

### 6.6 Ep6 · `ep1.5_backstop.xlsx` (Sep → Dec 2025)

*The fidelity flaws are healed. AROS 2 speaks from every phone at CAMEO CITY (bezel size, with its own sound); the city itself stays pixel.*

| Id | Beat | Tier · medium · owner | In → out | Length | FILLER (now) | FINAL | Status |
|---|---|---|---|---|---|---|---|
| **6.D ★** | #17, FEAR-MONGERING: KCAJ's lantern (Oct 13–14, 2025) | 2 · **shadow play**: cut-paper puppets on a lit wall; the creature is the smiley-masked, many-eyed shape the lore plants in #11 (O6.4) · BRANDS (his essay's own image [K wording]). Band retracts | KCAJ lifts the lantern; the wall becomes a lit screen and the shadow moves on its own → SKCAS's pixel stamp lands on the wall, the shadow takes its selfie with it, the lantern is set down and the wall is a wall | 4–6 s | 2D jointed silhouettes (puppet kit) under a warm, flash-safe flicker | CODE; optionally a real shadow-puppet shoot on a paper screen (HUMAN, cheap) | proposed |
| **6.C ★** | #14, F6.1 HIS VERSION (Nole) | 1 · P17 AIRBRUSH over the pixel flashback: chrome rims, star glints on the OPEN neon he hangs himself, NOLE 40% taller (the plant for 8.B) · BRANDS | Tagged `HIS VERSION` → the receipt curls into the check | The flashback | Code | CODE | proposed |
| **6.E ★** | #18, CAMEO CITY: the GPU shoplifting (Sep 30) | 1 · P1 CCTV, full, over our pixel Mas pocketing a GPU at a generic big-box store; the real viral clip was fake security footage [K] · DEVICE. It carries the cameo satire on its own | Cut to the camera's corner → the `DEEPFAKE` stamp | 3–4 s | Code | CODE | proposed |
| 6.B | #3, THE ROUND TABLE | 1 · P3 game-show variant, full, kept on the pledges (fairness) · DEVICE | The show's cameras | The set-piece | Code | CODE | proposed |
| 6.G | #19, Alyi's deposition | 1 · P8 DEPOSITION at **OSD size**: the timecode burn-in and the fixed frame on the pixel shot, no re-grade; Alyi only in the table's reflection · DEVICE | The deposition camera's frame | 4 s | Code | CODE | proposed |
| 6.H | #11, THE TRANSFORMER, O6.4 | 1 · one masked-GLYPH frame behind the `PUBLIC BENEFIT` decal · MACHINE. In-frame | One frame | 1 f | Existing | CODE | proposed |
| 6.J opt | #24, EMIT's "Architects of AI" | 2 · a painted cover with no masthead · RECORD | A flash-print; Mas's magnifying glass | 2 s | Tonal `paint` | HUMAN paint-over | proposed (only if the strip is quiet) |
| 6.I, 6.K | THE TRANSFORMER as a toy commercial; YLLIT near-photoreal | — | — | — | — | — | held (genre quote; R5) |

The Orb's first `VERIFIED HUMAN… probably.` (#18) plays in pixel. The melted-chair puddle from Ep2 is gone from the boardroom. Title card: `backstop.xlsx` as P24, the season's one spreadsheet render.

### 6.7 Ep7 · `ep1.6_supply_chain_risk.pdf` (Jan → Mar 2026)

| Id | Beat | Tier · medium · owner | In → out | Length | FILLER (now) | FINAL | Status |
|---|---|---|---|---|---|---|---|
| **7.A ★** | #7, THE BIG GAME ad (Feb 7) | 2 · **claymation**: CLOD's commercial in stop-motion, our staging, not a recreation of the real spot. A blank clay billboard pushes up through the tabletop; CLOD presses it back down with its thumb; **the thumbprint left behind is the company's mark on the end card: the refusal is the branding** · BRANDS (the ad is MISANTHROPIC's own voice, and roasted like every camp). Band retracts | **Staged on the TV in Mas's dark room** (the record has his post, "they are funny, and I laughed", not a stadium box). The set buzzes from the broadcast's stomping crowd; the ad-break slate; push into the TV → the end card, the thumbprint, sits small in the TV again; band returns; the glass beside the set stays still as one bead of condensation slides | 5–8 s | three.js clay on the iGPU (the CLOD kit) | HUMAN: the stop-motion day; SCAN a maquette | proposed |
| 7.C | #7, F7·m2, the 1993 CAPS LOCK flash | 1 · 1-BIT | It follows his reply's capital "I", not the ad's exit: the bead gets its beat first | 2 s | Existing | CODE | existing |
| 7.B | #8, THE CHAT WINDOW BECOMES TIMES SQUARE | 1 · P23 PROMO GRADE at bezel size, on the jumbotron: the sponsored lasagna in the promo sheen, in pixel · BRANDS | The sponsored banner grows into a video ad on the screens → "skip in 5" hits zero and the jumbotron shrinks it back into the chat | 3–4 s | Code | CODE | proposed |
| **7.D ★ KEEP J2** | #17, THE HUG (Feb 27–28) | 1 at leap weight · P18 HALFTONE inside a photo crop; the third arms keep signing outside it in pixel · RECORD. The beat's "bullet time" is a frozen-moment slide in layers, never an orbit (R9) | A press flash → the snap | 2.5 s | Code | CODE (tonal rig as the upgrade) | booked (jump-fix pass) |
| 7.F | #5, the aquarium glass cracks | 1 · underwater caustics over the agents' forum, through the glass, at bezel size · DEVICE | Through the glass → out on the crack | 3 s | Code | CODE | proposed |
| 7.H | #22, THE COUNCIL class photo | 1 · P25 FLASH-PRINT: a rung of the class-photo ladder · RECORD | Flash-print → snap | 1.5 s | Code | CODE | proposed |

Title card: a `.pdf` page with redaction bars.

### 6.8 Ep8 · `ep1.7_statute_of_limitations.pdf` (Apr → Jun 2026)

*Two leaps in Act 2, a stated exception to "different acts": the Rashomon (#12) and the verdict (#19) are seven beats apart, in different families, and the verdict is a 3 s print. The animatic decides; the fallback for 8.D is a P25 flash-print in pixel with the same erase. The BUFFER (8.C) goes to reserve so Act 2 can breathe.*

| Id | Beat | Tier · medium · owner | In → out | Length | FILLER (now) | FINAL | Status |
|---|---|---|---|---|---|---|---|
| **8.B ★** | #12, F8.1 THE RASHOMON RENDERS | 2 · **four renders, each an exhibit on the courtroom projector** (signposted: the exhibit sticker stays in the corner), each by the witness's company's model. GERG: ASCII text-mode, his own figure the only one at full resolution. NOLE: an airbrushed metal album cover, with a guitar, not a sword. MAS: an AROS clip, a near-photoreal room and paintings; **the people stay pixel sprites**, and the one thing his render gets right is his water glass, which is pixel. ALYI: a blank white square with one door · BRANDS, MACHINE. Band retracts | The exhibit sticker slaps on and the projector blooms → it peels. **One door for the whole flashback:** Exhibit A (240p, 2014) plays first on the same projector, and the soap-opera coda plays after it in the pixel courtroom with the organ as a bed, never a stinger (H2, H4) | ≤ 90 s total, ≈ 15 s a render | GLYPH text-mode; tonal `soft` with airbrush bands (`noleTone`); a three.js PBR room with the sprites and full contact (Prototype 3's kit); a white field and a door | VIDEO room plate E8-2 (environment only, SYNTH inside the projector, R6); HUMAN paint-over for NOLE's backplate | proposed |
| **8.D ★** | #19, THE VERDICT (May 18) | 2 · **courtroom pastel**: toned paper, pastel strokes, the sketch artist's economy · RECORD (A2, promoted). Band retracts | The gavel's flash-print → THE CALENDAR's corner erases Mas's pencil mark, and the erase stroke wipes back to pixel | 3 s | A stroke renderer from the pixel frame | HUMAN: a real courtroom sketch artist, 3–4 frames | proposed (stated exception, above) |
| **8.A ★** | #5, "WHO?" (Apr 17) | 1 · P15 LOD, **staged objectively**: the GOLD OVAL fails to render Mario whenever he enters, a grey placeholder; only the Orb's cone resolves him · the not-seeing. In-frame | Each entrance → when the Orb tracks him | 2 s an entrance | Code | CODE | proposed |
| 8.E | #24, the SPACEZ IPO reaches orbit | 1 · P3 launch-webcast variant, full, whose altitude readout is the share price · DEVICE | The webcast frame | 4 s | Code | CODE | proposed |
| 8.F | #28, the log line | 1 · TERMINAL | Existing | — | Existing | CODE | existing |

Title card: a court filing with an exhibit sticker and a page stamp.

### 6.9 Ep9 · `ep1.8_outside_intended_scope.log` (Jul → Sep 24, 2026)

| Id | Beat | Tier · medium · owner | In → out | Length | FILLER (now) | FINAL | Status |
|---|---|---|---|---|---|---|---|
| **9.A ★** | CO #2–3 and #4, THE FOLDER CITY | 2 · **voxel**: an isometric city of folder-shaped voxel towers under `WELCOME TO /tmp — NOTHING HERE LASTS`, glyphs on the faces; orthographic, so the world has depth but the camera doesn't move in perspective (the plant for 11.A). **No noir grade:** the voxels, the glyphs and the trench coats carry the gag · MACHINE (the agents' own world). Band retracts | The push through the monitor into the sandbox, whose sand grains are the first voxels → the agents climb out, stacked in trench coats, into the intro smash; in #4, back in on the folder board, out on FACEHUGGER's velvet rope, which is #5's door | 20–40 s over two visits | three.js instanced cubes, orthographic, the glyph atlas from `pixel/glyph.ts` (40k cubes ≈ 20 s a shot on the iGPU, measured) | CODE; optional VIDEO E9-1 CONVERT for rain; optional hand-built voxel pieces | proposed |
| **9.D ★ KEEP J3** | #23, "Mario is right." | 2 · **continuous-tone night** behind a torn sky · WORLD. Band stays | The tear → the seal, one scar | 3.1 s | Built: `proto2` (the tear) | CODE; a recorded night-air bed | booked · not proven (jump-fix pass) |
| **9.C ★** | #20, THE PHOTO FINISH | 1 · P11 SLIT-SCAN, full · DEVICE. **The joke is the absurdly long gap:** the humans' post crosses the line at 11:48pm, then the strip runs on through empty streaks (the night, the morning) until NopeAI's crosses at noon. The camera proves who was first, and the strip is the paper that unrolls down Market Street | The finish camera's strip → `SHOW YOUR WORK.` | 3–5 s | Code, from the rendered frames | CODE | proposed |
| 9.B | #5, THE TRENCH-COAT CAPTCHA | 1 · the frame splits into a 3×3 image grid, solved tile by tile · DEVICE. One sequence with 9.A's exit at the rope | Grid in → the rope opens | 3 s | Code | CODE | proposed |
| 9.E | #30–31, the Security Council | 1 · P3 BROADCAST, full: the chamber's webcast wide, the `INVITED` chair in shot · DEVICE | The webcast wide → out when we go close on Mas | 3 s | Code (Prototype 4) | CODE | proposed |
| 9.G | #36, `intern: done. next: researcher.` | 1 · TERMINAL | Existing | — | Existing | CODE | existing |

Title card: TERMINAL, the title as a log line.

### 6.10 Ep10 · `ep1.9_pace.yaml` ("OCT 2026?" → "2027??")

| Id | Beat | Tier · medium · owner | In → out | Length | FILLER (now) | FINAL | Status |
|---|---|---|---|---|---|---|---|
| **10.C ★** | #19, THE READ | 2 · **HD cel anime** in the psychological-duel register: one hard key light, a hand-painted key drawing of his eyes, then **one continuous multiplane push of 8–10 s from behind Mas across the table.** The tells light up in sequence as objects (the ladle tips, the napkin corner lifts, the register key sinks, Nole's phone flares on "post"), and the season's stat bars set over each player in cel line. **Over the Intern's caret face, nothing.** No hands at insert size. His glass stays pixel in the foreground · HIM, at an invented game. **Nole is a stated exception** to the opportunity map's "No NOLE anime" (a ruling against zAI's anime companion as a lens): here he's a held figure in the back plane of Mas's self-image, and his tell is carried by his phone. Band retracts | Pixel pre-roll: G6 THE HOTSPOT, his cursor over each player and the tell in the label, the dealer never a hotspot; the band retracts; the card snaps, and the first anime frame is his eyes → the push rests on the blank; a hard cut on the dealer's next card to J4 | 10–12 s, then J4 | The anime rig relit under one hard key; the eye key drawing; the table as a painted background; the props as layers (Prototype 1) | HUMAN: a key animator's polish of the key drawings (~10 s with 4.F's portrait). Never a model | proposed (Prototype 1) |
| **10.D ★ KEEP J4** | #19, the dealer's view | 1 at leap weight · full-frame GLYPH: each player's tell rises as a column of tokens; **two blanks, Mas and the Intern's caret face** · MACHINE | Hard cut on the card's snap, in and out | 1.9 s | Engine GLYPH (needs the Vegas table set, which Prototype 1 builds) | CODE | booked (jump-fix pass) |
| 10.B | #7, THE 360 REVIEW | 1 · a **pixel zoetrope** in the engine: the ring of reviewers spins, and a slit strobe (geometry, never luminance flashes) animates THE INTERN growing up (cursor, lanyard, blazer) · MACHINE | The ring spins up → it stops on `EXCEEDS EXPECTATIONS`, and Mas's *huh.* → **Huh.** | 4–5 s | Code | CODE | proposed |
| 10.A | #2, the DevDay hologram of Mas | 1 · a clean additive hologram with depth slices, drawn flat (no perspective camera) · DEVICE | The keynote hall → the real Mas on his paint bucket | 2 s | Code | CODE | proposed |
| 10.E | #23, THE GRAND PRIX | 1 · P4 SPORTS, full: an onboard camera, the timing tower, the safety car's light bar · DEVICE | The race broadcast | 4–6 s | Code | CODE | proposed |

Title card: indented `.yaml`.

### 6.11 Ep11 · `ep1.10_assist_clause.txt` ("2027??")

| Id | Beat | Tier · medium · owner | In → out | Length | FILLER (now) | FINAL | Status |
|---|---|---|---|---|---|---|---|
| **11.A ★** | #3, THE NESTED LANYARD → THE CLIFF | 2 · **the first time the pixel world moves in perspective**: the dark room itself gains depth, a full frame turning a few degrees, while Mas and his glass stay flat pixel cards; then the dive into the nest, the loss curve tipping past vertical, and the camera over the edge · MACHINE (the successor adds a dimension; resolves A3). Band retracts | The frame gains depth: the first 3D frame is the exact pixel frame of the room → the fall lands on the dark room's floor and flattens back to adventure-game staging. The room is 2D again, but we've seen its side | 12–15 s | @remotion/three on the iGPU with the voxel extrusion and glyph textures (Prototype 2) | CODE, with the engine's layer/depth export | proposed (Prototype 2; R9) |
| 11.C opt | #11, THE POLITENESS LOOP + O11.3, the bliss spiral | 2 · **claymation CLOD** bowing to the Researcher's glyph body; the bows decay into spiral glyphs · BRANDS vs MACHINE (two machines, two media) | The Researcher crosses the Bay; CLOD at the lighthouse door is clay → the last spiral glyph becomes the Bay's dimming lights, in pixel (the dimming inside the flash limits) | 4–6 s | three.js clay + glyph | HUMAN: the stop-motion day (the same puppet) | proposed |
| **11.B ★** | #19, ATTENTION IS ALL YOU NEED (TO AVOID) | 1 · P12 HEATMAP, full: hot where the heads attend (Kram's soup, Nole's replies, Mario's plan); Mas is the same cold as the walls · MACHINE | Cut into the heads' view on the first swivel → "it thinks i'm part of it." | 3–5 s | Code | CODE | proposed |
| 11.D | #21, F11.3 THE DIFF | 1 · a red/green diff of the same scene that won't merge · DEVICE | Existing device | — | Code | CODE | proposed |
| 11.E | #17, the Orb checkpoint | 1 · P21 IRIS (Nole fails: `NOT VERIFIED`, then `…human? probably?`) · MACHINE | The iris | 2–3 s | Code (Prototype 4) | CODE | proposed |
| 11.F | #2, F11.1, the context window | 1 · GLYPH / TERMINAL. It exits to the pixel dark room, which holds long enough to re-establish before 11.A's door | Existing | — | Existing | CODE | existing |
| 11.H opt | #14, Mas alone: `[accept] [accept] [accept]` | 1 · **P30 BROWNOUT**, re-motivated from the story: if the politeness loop is still bowing (the writers' call), the draw reaches his room and its lights dip in whole rungs in the bows' rhythm. He sets the phone face down and the lights keep dipping, because it has nothing to do with him · THE WORLD. Otherwise #14 stays pixel | In the bows' rhythm → the loop ends | 3 s | Code (the plate's `dim` notes) | CODE | proposed |

Title card: plain `.txt` with a blinking caret.

### 6.12 Ep12 · `ep1.11_unclear_which_side.md` ("????")

*The spine's peak: three leaps in three families (the machine's own flashback, the world, HIM), never back to back, and one first perfect render: J5. Then the button, in one take.*

| Id | Beat | Tier · medium · owner | In → out | Length | FILLER (now) | FINAL | Status |
|---|---|---|---|---|---|---|---|
| **12.A ★** | #6, F12.1 THE RECONSTRUCTION | 2 · **point cloud → learned objects**, in the model's own flashback (a signposted render). The model rebuilds the 2015 WOODROSE from every version the season has shown (Gerg's, Alyi's, Nole's airbrush, Mario's), and the POV rims converge on cyan. **Only the objects it learned resolve near-photoreal:** the table and its linen, the LED "candles", every guest's glass, the cutlery. The rest of the room stays points and glyph. Every guest stays a pixel sprite with full contact. The camera sits in Mas's chair, and the stat bars rise over the drawn guests. **His own glass stays pixel:** the model learned everything at that table but him · MACHINE. Band retracts | The monitor's cyan; points bloom around the table → the window's reflection shows nothing over him, and the room collapses back into the monitor's glow | 20–45 s (the flashback) | three.js points resolving to PBR objects with an HDRI and accumulation; the guests as sprites with contact; GLYPH (Prototype 3) | BLENDER EEVEE on the iGPU or cloud Cycles for the objects; the sprites stay code | proposed (Prototype 3) |
| **12.B ★ KEEP J5** | #12, the sky reformats | 2 · refine to footage · WORLD, MACHINE. **The season's first perfect render and its single bezel break** | Refine, one held step per beat → the hold (if signed) | 5 s | Code, the last step in tonal `soft` | VIDEO: the E12-4 sky plate, through the matte-only path | booked (hold needs sign-off) |
| 12.C | #14, THE LAST CLASS PHOTO | 1 · **A4, code only:** a pixel print (P25) in which the humans have cut lines around them, and a focus pull onto the monitor, the only thing in focus (stepped-resolution defocus on everything else). Mas keeps one live motion as the print develops · MACHINE (a robot arm's camera), RECORD | The shutter; the print develops → the robot arm lifts it and it hangs as a pixel frame on the wall | 3 s | Code | CODE. (The near-photoreal photograph with paper cut-outs plays only if J5 is cut) | proposed |
| **12.K ★** | #16–19, THE BUTTON | **G1 THE ONER**: one slow pixel push with no cuts, under the room bed: the visitor badge, the monitor, `define "win."`, the glass (J6 lands inside the take), the Orb's scan through the same frame, the title over it. The only cut is to black. The framing keeps every reformatted window out of shot | In on the badge → the cut to black | The length of #16–19 (≈ 30–50 s, the writers' timing) | Code | CODE | proposed |
| **12.D ★ KEEP J6** | #17, `define "win."` | 2 · one ring across his water, continuous and fluid, inside 12.K · HIM. Band stays | The event is the front → it settles, then snaps back to the quantized row, still inside the take | 2.5 s | Built: `proto3` | CODE only | booked as amended |
| 12.E opt | #13, THE WHALE ships an open-weights copy of the finale | 1 at pass weight · P10 extra blocky: the vignette is our own finale at the Whale's quarter resolution · BRANDS (a callback to 4.A) | The montage cut; its vignette | 2–4 s | Pixel engine at low resolution | CODE | proposed |
| 12.F | #13, EMIT's `MACHINE OF THE YEAR` | 1 · P25 FLASH-PRINT cover pass · RECORD | Montage | 2 s | Code | CODE | proposed |
| 12.G | #15, F12.2 1993 | 1 · 1-BIT | Existing | — | Existing | CODE | existing |
| 12.H | CO #1, every phone's RSVP | 1 · P7 PHONE in a growing grid of every device on Earth · DEVICE | The opening montage | 3 s | Code | CODE | proposed |
| 12.I | The intro takeover | 1 · the title renders up the tiers, **stopping short of a perfect render** so it can't spend J5 · MACHINE | — | — | — | — | the intro owner's call (H9) |

**Under J5's hold.** If the hold is signed and runs to F12.2, #13–14 play under a footage sky in the windows. That's why 12.C is a pixel print (the photograph's near-photoreal couldn't read as special under a real sky), and why 12.K frames the windows out. Ep12 #4's "little swap-whooshes" go (H2, H4): the sort is silent. Title card: the same markdown as Ep1, rendered.

### 6.13 The slate at a glance

| Ep | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Leaps (★)** | J1 | 2.A | 3.D | 4.F | 5.B | 6.D | 7.A | 8.B, 8.D | 9.A, J3 | 10.C | 11.A | 12.A, J5, J6 |
| Count | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 2 | 2 | 1 | 1 | 3 |
| Passes at leap weight | | | | | | | J2 | | | J4 | | 12.K (the oner) |
| Bezel micros and options | 1.A | | 3.A | 4.A (P10) | | 6.J opt | | | | | 11.C opt | 12.E opt |

- **16 leaps**, about one an episode, two in Ep8 and Ep9, three in the finale. That sits between the old budget (8) and the first draft of this file (21–25), and it's what "rarer" means at this show's rhythm.
- **The families spread:** MACHINE (2.A, 4.F, 9.A, 11.A, 12.A, with 8.B shared), BRANDS (3.D, 5.B, 6.D, 7.A, 8.B), RECORD (J1, 8.D), WORLD (J3, J5), HIM (10.C, J6).
- **Every medium the showrunner named has a home:** HD anime (10.C), 3D (11.A), near-photoreal (2.A in its bezel, 8.B's room in the projector, 12.A's objects, J5's sky), extra blocky (4.A, 12.E).
- **Screen time:** about 230–250 s of Tier 2 across a 264-minute season, about 1.5%. The biggest blocks are the sequences that live inside their medium (the Rashomon, the folder city, the reconstruction).
- **Top of the list** (the opportunity map's ranking, re-read after this pass): 4.F the paint wave · 12.A the reconstruction · 2.A the mammoth · 8.B the Rashomon renders · 9.A the folder city · 10.C the read · 6.D the lantern · 11.A the cliff · 8.D the verdict in pastel · 7.A CLOD's ad · 3.D the pop-up exodus · 5.B the empty plaza. J1, J5 and J6 would place in the top five.

### 6.14 The register strips

**Count register changes, not seconds.** Each episode's strip lists every change in beat order, existing switches included, so the editor can see whether the episode stays in one register for a while. ■ is a full-room change (it counts). □ is an in-frame mark (a bezel, an OSD, a masked GLYPH cone, a leap that lives inside the frame): it's listed, but the room's register holds. Drafted from the 2026-09-26 beats, with the micro-flashbacks' era tiers still to add; **the editor re-counts every strip in the animatic** and logs it in the POV ledger.

**The guide, not a cap:** most episodes land around 5–7 full-room changes in 22 minutes. More than about three in any four beats, outside one designed sequence, reads as the strobing the flow guide warns about; fix it by shrinking a device pass to bezel or OSD size before cutting anything.

| Ep | The strip (beat: change) | ■ |
|---|---|---|
| 1 | #4 FREEZE ■ · #5 F1.1 1-BIT ■ · #12 1.A clay CLOD on the monitor □ · #16 the anchor on the phone, captioned □ · #17 1.F P3 ■ · sc 17 LEDGER ■ · #19 the hairline □ · #26 THE PLAN ■ · #27 1.G CALL tiles □ + J1 in the tile □ · #33 1.H promo in the monitor □ · masked GLYPH □ | ≈ 5 |
| 2 | #1 2.A in the screen □ · #2 FREEZE ■ · #6 2.G ghosts in the candle's pool □ · #9 2.D P6 ■ · #12 THE PLAN ■ · #13 2.C P5 ■ · #20–21 2.F PHONE → F2.1 EARLY-WEB16 ■ · #28 2.E IRIS ■ · masked GLYPH □ | ≈ 6. #9–13 is dense: if it plays busy, 2.D goes to bezel size |
| 3 | CO #1 3.A in the phone □ · #6 THE PLAN ■ · #7 3.B P4 ■ + 3.C GLYPH slats □ · #12–13 LEDGER ■ → F3.2 · #16 3.D paper ■ · #21 3.F P5 ■ (the sleigh in a window □) · #24 FREEZE ■ | ≈ 6 |
| 4 | #3 FREEZE ■ · #5 THE PLAN ■ · #9 4.A P10 ■ → #10 F4.2 1-BIT ■ (one move) · #13 4.H on the monitors □ · #15 F4.1 in the base, the stat bars □ · #18 4.E HANDHELD ■ · #21 4.F paint ■ · #24 F4.3 EARLY-WEB16 ■ · masked GLYPH □ | ≈ 7, down from about 11. The busiest strip; #18–24 is the pressure point, and 4.E drops to bezel size first |
| 5 | #4 FREEZE ■ · #9 FREEZE ■ + 5.B plaza ■ → #10 5.A P4 ■ (one sequence) · #11 5.F podcast on the TV □ · #12 5.G CHIAROSCURO ■ · #16 THE PLAN ■ · #17 A1 hairline □ opt · #24 5.I P5 ■ · #26a 5.H IRIS ■ · #27 5.J portrait on his phone □ | ≈ 7–8. #9–12 is one Draft Night sequence plus the vigil; #24–27 stays breathable because 5.J is bezel size |
| 6 | #3 6.B game show ■ · #4 FREEZE ■ · #8 THE PLAN ■ · #11 6.H GLYPH frame □ · #14 6.C AIRBRUSH ■ · #17 6.D shadow play ■ · #18 6.E CCTV ■, the Orb's `(probably)` in pixel · #19 6.G deposition OSD □ · #24 6.J cover ■ opt | ≈ 6–7. The #17–19 run is now leap, pass, OSD |
| 7 | #5 7.F caustics through the glass □ · #7 7.A clay ■ → the bead → F7·m2 1-BIT ■ on the reply · #8 7.B promo on the jumbotron □ · #14 THE PLAN ■ · #17 J2 in its crop □ · #22 7.H FLASH-PRINT ■ | ≈ 4–5, plus the micro-flashbacks' tiers |
| 8 | #3 THE PLAN ■ · #5 8.A LOD □ · #12 8.B ■ (one door: Exhibit A, four renders, all on the projector) → coda in pixel · #19 8.D pastel ■ · #24 8.E webcast ■ · #28 8.F TERMINAL ■ | ≈ 5, from about 8 (the BUFFER is in reserve; F8.1's extra registers fold into the projector) |
| 9 | CO #2–3 9.A voxel ■ · #4 9.A again ■ → #5 9.B CAPTCHA ■ (one sequence at the rope) · #9 F9.1 GLYPH ■ · #15 THE PLAN ■ · #20 9.C SLIT-SCAN ■ · #23 J3 in the sky □ · #30 9.E webcast ■ · #36 9.G TERMINAL ■ | ≈ 7–8, most of them the machine's own grammar |
| 10 | #2 10.A hologram □ · #7 10.B pixel zoetrope □ · #11 THE PLAN ■ · #19 hotspots □ → 10.C anime ■ → J4 ■ (one sequence) · #23 10.E P4 ■ · the flashbacks' tiers | ≈ 4–5. One poker table now carries F10·m, 10.C and J4, and nothing else |
| 11 | #2 F11.1 GLYPH ■ → the dark room holds · #3 11.A ■ · #9 THE PLAN ■ · #11 11.C clay ■ opt · #14 11.H BROWNOUT □ opt · #17 11.E IRIS ■ · #19 11.B HEATMAP ■ · #21 11.D diff ■ | ≈ 6–7 |
| 12 | CO #1 12.H phones ■ · #3 FREEZE ■ · the intro takeover (stops short) · #6 12.A ■ · #10 F12.3 tally montage ■ · #12 J5 ■ (the hold) · #13 montage: 12.F print ■, 12.E blocky ■ opt · #14 12.C print □ · #15 F12.2 1-BIT ■ · #16–19 12.K the oner, J6 inside it □ | ≈ 8, and then none: the season ends in one take |

### 6.15 Reserve and cut

**Reserve** (not booked; each comes back only with its own reason, and the register strip's room):

| Id | What | Why it's out | What would bring it back |
|---|---|---|---|
| 6.F | CAMEO CITY: the street behind the pixel Mases refines to near-photoreal | A cold viewer can't tell why the city turns real during a deepfake flood; the flip loses the cameo satire, which 6.E's CCTV already carries; and it would spend J5's bezel break | Only inside a bezel: the cameo app's own feed on a phone |
| 7.E | Ep3's paper book folds shut under the stamp | One beat after J2 | The animatic plays J2 → 7.E as one continuous motion |
| 8.C | P14 BUFFER on the jury after "yes." | It crowded Act 2 next to 8.B and 8.D | 8.D is cut |
| 11.G | P1 CCTV on the core's cameras | A second pass in 11.B's beat | 11.B moves |
| 6.A | P16 TILT-SHIFT on the pier's carousel | Blur on pixel art reads as a filter | Rebuilt grid-true (stepped-resolution bands) and a quiet strip |

**Cut:** 2.B (DIRE's digital twin: a caricature's likeness in a glossy material), 2.H (redundant once 1.A plants the clay CLOD), 4.C's DV pass (the stat bars need the base), 5.C (HIM's medium on a real blog post and a real date; the gag works in pixel), 5.E (a path-traced figurine of a caricature), 5.J's velvet plate, 7.B as a near-photoreal food commercial (a genre quote; it's now P23 on the jumbotron), 7.G (the machine's image out of its bezel), 10.F (a fourth register at one poker table), 11.I (a second 3D move six beats after 11.A), 12.J (a fourth statement of the thesis in the finale), and the profile-picture plant's 10.C payoff.

---

## 7. The prototype slate

### 7.0 Why these four, and how they're judged

The slate shows the widest range at the highest quality this machine reaches today, on moments the season actually needs, and it tests the rules this file leans on hardest. Prototypes are numbered **1–4 (folders `p1`–`p4`)** so they don't collide with the pass ids P1–P34.

| | Prototype | Season moment | Why it's in the slate |
|---|---|---|---|
| **1** | **HD cel anime: THE READ** | 10.C + a J4 placeholder (Ep10 #19) | The drastic medium the showrunner named that we can reach with the cast. The rig today is soft and pastel with weak hands, below the pixel portraits ([§3.2](#32-the-vocabulary)), so the prototype must lift it: one hard key, a hand-painted key drawing, one continuous push, no hands at insert size. It tests the tell ladder in cel and the glass anchor blind, and it builds the Vegas table J4 needs |
| **2** | **Real 3D: THE CLIFF** | 11.A (Ep11 #3) | The first time the pixel world moves in perspective, built on our own frame extruded into voxels, so the reveal happens to a room the audience knows. It shows "3D" and "extra blocky" in one move, and it A/Bs the render resolution |
| **3** | **Near-photoreal with pixel contact: THE RECONSTRUCTION's table** | 12.A (Ep12 #6), plus one clay turnaround still of CLOD | The showrunner named "near photorealistic". It's the most-used Tier 2 medium on the map and it carries both the firm guardrail and the thesis, but §4.6's contact rules are unproven; without this clip the approval gate would leave it unapproved. It also carries the tell ladder's last rung and the glass anchor. Clay needs only one still: the audit already rates it high |
| **4** | **The Tier 1 reel: the four passes the season leans on** | 5.A, 5.I, 9.E, 11.E | P3 BROADCAST (5 uses), P4 SPORTS, P5 STREAM and P21 IRIS (3 each), over one-offs. Each clip enters and exits inside a pixel room, because a 5 s showcase with no context reads as a filter by construction |

**Shared spec.**
- 1920×1080, 24 fps, on the 96 BPM grid (a beat is 15 f, a bar is 60 f). `p` is the prototype's frame. Lengths: 1 is 480 f (20 s); 2 is 360 f (15 s); 3 is 360 f (15 s) plus one still; 4 is 720 f (30 s).
- Each builds in its own dev folder, **`studio/src/dev/range/p1/` … `p4/`**, with an `entry.tsx` on `makeRoot` like the other dev entries, and renders to **`out/range/p1.mp4` … `p4.mp4`**, with a contact sheet (`pN-sheet.png`) and key stills beside it. That's outside `dev/jumps/**` (the jump-fix pass's) and `src/episodes/ep01/**` (Act Four v4's). The WOODROSE set in `src/dev/mdinner1/` and `mdinner2/` is imported, never edited. Anything added to `src/shared/pixel` stays additive ([PIXEL_GUIDE §7](../../studio/PIXEL_GUIDE.md)).
- **The adventure layout:** every clip opens and closes in the base with the verb and inventory band on screen. Device passes keep the band; a full-frame leap retracts it in three held steps and brings it back on the exit.
- **Backends:** 1 renders on the CPU, where the anime lookdev was approved (about 15 min at `--concurrency=4`), unless its look is re-approved on the iGPU. 2 and 3 render with `--gl=angle` on the iGPU after a one-frame probe that prints the WebGL renderer string (without it, a render silently falls back to SwiftShader, 10–40× slower); long GPU renders go in chunks. 4 renders on the CPU. One backend per clip.
- `--concurrency=4` at most, 1080p at most. The disk is about 98% full: no kept frame sequences, one HDRI under 10 MB, scratch deleted after review. Only the mp4s, the contact sheets and the key stills are kept.
- Each clip ships with a temp sound pass to the brief (score, SFX, room), muxed with the bundled ffmpeg. No voice is cloned; the prototypes carry no dialogue.
- **Review.** The showrunner watches each clip twice, cold and then with its context. A blind cold read (the mp4 and unlabelled stills only) goes first. A clip passes if the reader names what the medium means from one frame, at full frame and at phone size, and nobody says "filter" or "effect".
- **The approval gate.** These four are the samples. After they're built and reviewed, work stops for the showrunner's call before any season production of leaps or passes.

### 7.1 Prototype 1 · HD cel anime · THE READ (10.C, Ep10 #19)

| | |
|---|---|
| **Owner** | HIM: his self-image as the man who reads every table, on an invented beat |
| **Register** | The psychological-duel thriller, evoked through grammar only: one hard key light, a held key drawing moved by the camera, one continuous multiplane push, a painted background. No studio's designs or frames |
| **Clip** | 480 f. Pixel pre-roll p0–119 · anime p120–359 (10 s) · J4 placeholder p360–405 · pixel p406–479 |
| **In / out** | The band retracts, then a hard cut on the card's snap / a hard cut on the dealer's next card, into J4; then the band returns |
| **Staging** | NO-LIMIT PACE (Ep10 #14): a Vegas poker table with GPUs for chips, under one tungsten pool light. Mas left foreground, Nole across; Kram, Mario and Nesnej seated; **the Intern dealing** (blazer, lanyard, a monitor head whose face is one blinking caret) |

**The idea.** In pixel, it's a man at a card table. In his own head it's a duel, and he's winning: every tell lands in his read, drawn in the season's own stat bars. The anime plays that completely straight. The push crosses the whole table and comes to rest on the dealer, and over the Intern's caret face there's nothing: "the same blank as over Mas's in ep4." Then the machine's view cuts in.

**Step 0, before any animation: the key test.** One still of the Mas rig under a single hard tungsten key from above, no fill: two-tone shadows plus one highlight tone, a cool rim from the far neon, deep blacks. `out/range/p1-keytest.png`. Compare it with the pixel portrait windows (`out/dev/pixeladv/key-test.png`). Build on only if it reads at least as finished; otherwise fix the rig's light first.

| p | Beat | Picture | Sound |
|---|---|---|---|
| 0–29 | bar 1, 1–2 | Pixel `[MS]` over the table, band on screen: Mas in the left foreground, back three-quarter, his glass by his hand (the water one flat row); Nole across, the others seated, the GPU chips; the Intern at frame right, caret blinking on the quarter notes | The Ep10 poker cue (felted upright, walking bass, brushed kit, the chip lead) and the casino bed (chips, a far murmur, a shuffle) |
| 30–84 | bar 1, 3 → bar 2, 2 | **G6 THE HOTSPOT.** Mas's cursor glides across the table in held steps. On each player it lights as a hotspot: the band's sentence line reads `look at nole`, and a pixel stat bar sets over his head, label first, then the cells left to right: `POST-BUTTON TWITCH ▰▰▰▰▰` (p30), then Kram `LADLE ▰▰▰▱` (p45), Mario `ADDENDUM ▰▰▰▰` (p60), Nesnej `REGISTER ▰▰▰▰▰` (p75) | One soft cursor tick per hotspot, on the beat. No stinger |
| 85–89 | 2, 2 | The cursor slides across the Intern. It doesn't light; the sentence line stays empty; no bar | No tick |
| 90–119 | 2, 3–4 | **The band retracts** in three held steps (p90, p97, p104), and the dark under the table takes the freed lines. The Intern lifts the next card | The cue carries on |
| 120 | bar 3, 1 | **In: hard cut on the card's snap.** First anime frame: `[ECU]` his eyes, **one hand-painted key drawing**, top-lit by the same tungsten key as the pixel table, a cool rim from the far neon | The snap is the door. On this frame the chip lead and the casino bed drop out, and the cue carries on re-voiced: piano and a low string pad, the same phrase at the same tempo |
| 120–149 | 1–2 | The camera slides slowly across the key drawing (it moves; the drawing holds). On p135 his pupils step one line toward the table: his one live motion | — |
| 150 | 3 | Cut to the push's first frame: `[OTS]` from behind Mas, four planes. Foreground: his shoulder and ear in silhouette, his hand at rest on the rail, and **his glass, a pixel sprite at 4× nearest-neighbour inside the cel frame**. Then the table's near edge and chips; the four players as held drawings; the painted casino dark with a far neon | — |
| 150–359 | 3 → bar 6, 4 | **One continuous multiplane push** across the table toward the dealer, on 1s, with the planes' parallax doing the work. The tells light up in sequence **as objects**, one per beat: p180 Kram's ladle tips and one drop falls; p195 Mario's napkin corner lifts off the felt, `Addendum:` showing; p210 Nesnej's register key sinks; p225 Nole's phone flares one step on "post". As each lights, its stat bar sets over the player's head **in cel line: the same shape, label and fill order** as the pixel bars. No hands at insert size; the players' faces stay composed | One piano note from the cue's chord on each tell, the phrase resolving on the phone. Where a fifth note would land, for the dealer, the phrase leaves a rest |
| 270–359 | bar 5 → 6 | The push carries on to the far end of the table and slows to rest, with mass, on the Intern: the caret face in focus, blinking on the quarter notes, and **over its head, nothing.** Hold from p330 | The strings hold the resolved chord. No sting |
| 360 | bar 7, 1 | **Out: hard cut on the dealer's next card** to J4 | The strings stop on the cut, a designed stop on a story beat; the GLYPH family comes in (glass shimmer, sub) |
| 360–405 | 1–4 | J4 placeholder: the engine's full-frame GLYPH over the pixel table; each tell rises as a column of tokens; two blanks, Mas and the Intern. J4 itself is the jump-fix pass's build | The GLYPH family |
| 406–479 | bar 7, 4 → bar 8 | Pixel `[MS]` at the table. **The band returns** in three held steps (p406, p413, p420). Mas's one-pixel eye return; land on his face and the glass | The poker cue re-enters in its own timbre, chip lead and casino bed at full level, on the downbeat (p420) |

**What premium means here.**
- It looks at least as finished as the pixel base: consistent line weight at 1080, two-tone shadows plus one highlight tone, composited rim light, a painted background with real depth of field, a hard single key.
- The limited animation reads as a choice: one key drawing moved by the camera, held drawings in planes, one continuous push, one live motion on Mas.
- The light is continuous across the cut: the anime's key is the pixel table's lamp, in the same colour.
- The stat bars are recognisably the season's (F4.1's), redrawn, not a new HUD.
- It plays dead straight. Faces stay composed: the drama is in staging and timing.
- One backend for the whole clip.

**Passes if** a blind reader says something like "he's reading everyone at the table" from the stills, notices (or feels) that the dealer has nothing over it, reads the cut to GLYPH as "something else is watching", and either doesn't notice the pixel glass or reads it as deliberate.
**Fails if** anyone reads it as an anime parody or a wink; a face emotes; the bars read as a new game HUD rather than the season's; the pixel glass reads as a compositing error; or it looks less finished than the pixel portraits.
**Must not:** use speed lines, impact frames, kira glints, focus lines, sweat drops, thought bubbles or floating deduction words; show a hand at insert size; play an anime sting; show any real casino, card brand or chip logo; copy a named studio's designs.

**Reuse:** `src/shared/anime/` (`Mas.tsx`, `Nole.tsx`, `cel.tsx`, `ink.ts`, `hair.tsx`, `Grade.tsx`, `Motion.tsx`; from `scene/fx.tsx` only the rim, edge-glow and flat filters); the tonal `paint` renderer for the table background; `pixel/cast/mas-medium.ts`, `pixel/cast/nole.ts` and `pixel/ui.ts` (the band) for the pre-roll and tail.
**New:** the pixel Vegas table plate (also J4's blocker: build it once for both); the Intern at the table in pixel and in cel; Kram, Mario and Nesnej as single held cel drawings for the back plane; the eye key drawing; the prop layers (ladle, napkin, register key, phone); the pixel and cel stat bars; the hotspot cursor and sentence line; the band retract and return.
**Final route:** a human key animator repaints the eye key drawing and polishes the held drawings (with 4.F's portrait, about 10 s of work). Never a model.

### 7.2 Prototype 2 · real 3D · THE CLIFF (11.A, Ep11 #3)

| | |
|---|---|
| **Owner** | THE MACHINE: the Researcher training its successor inside itself |
| **Medium** | The first time the pixel world moves in perspective, built on "the grid gains depth": our own frame extruded pixel-for-pixel into voxels, so the first 3D frame is the flat frame |
| **Clip** | 360 f. Pixel p0–59 · 3D p60–329 (11.25 s) · pixel p330–359 |
| **In / out** | The band retracts; the frame gains depth / the fall lands, depth collapses in three held steps, and the band returns |
| **Staging** | Mas's dark room (`rooms/darkroom-plate.ts`): Mas at the desk, the Orb at his shoulder, his glass. The Researcher's nested lanyard plays on his monitor: a badge whose photo is a badge, whose photo is a badge |

**The idea.** For ten episodes the room has been flat, and the camera has never moved in perspective (even the folder city was orthographic). Here the machine builds something bigger than itself, and the picture gains a dimension it never had. **The event is the reveal, not the fall:** the room we know turns a few degrees and shows a side we've never seen, while Mas and his glass stay flat cards, one voxel thick. The machine gets depth; the humans don't. Then the nest of badges is a tunnel, the loss curve tips past vertical, and the camera goes over the edge. It lands, and the room is flat again, but now we know it isn't.

| p | Beat | Picture | Sound |
|---|---|---|---|
| 0–44 | bar 1, 1–3 | Pixel `[W]`, the dark room, band on screen: Mas reads at the desk; the nested lanyard on his monitor | The Ep11 cue (the dread palette: a low piano ostinato under the chip lead), the server hum, the rack tick |
| 45–59 | 4 | **The band retracts** in three held steps (p45, p50, p55); the dark under the desk takes the freed lines | — |
| 60 | bar 2, 1 | **In: the frame gains depth.** Frame 60 is bit-identical to frame 59: the whole room | On p60 the chip lead's timbre steps toward acoustic (piano harmonics), and the synthesized hum gives way to a recorded, full-band air about 10 dB under. No whoosh |
| 60–119 | 1–4 | **The reveal.** The camera trucks right and yaws about 8°, craning up about 2°, with mass (it accelerates and settles like a heavy dolly, no overshoot). The room shows its relief: the desk has a front and a side, the window is recessed with the city at depth beyond it, the shelf juts, the rack is a block, the monitor has a back, the Orb is a sphere of voxels. **Mas and his glass stay flat pixel cards** at their depths. Shading in whole palette rungs; the monitor's cyan cone is the key and throws voxel shadows | The rack tick picks up a real reverb tail as the room gains depth: the space sounds bigger as it looks bigger |
| 120–149 | bar 3, 1–2 | The camera holds at the new angle. We look at the side of a room we've watched all season | The cue holds its phrase |
| 150–179 | 3–4 | The camera pushes toward the monitor in perspective, passing Mas's card close enough to see its edge (one voxel thick), and enters the screen | — |
| 180–239 | bar 4 | The nest is a tunnel: each badge a slab, the lanyard ribbons hanging as strips of voxels, receding in true perspective. The camera flies down it; the inner faces carry glyph textures that read as shapes, not words | The cue continues, re-voiced |
| 240–269 | bar 5, 1–2 | The tunnel opens onto the loss curve: **a smooth, noiseless cyan surface** (a loss curve, not a price), labelled once in the monitor's own lowercase axis type, `loss`; no tickers, no currency, no red or green. It slopes down ahead, and its far end tips past vertical into an edge | The cue suspends on a held chord: no riser, no crescendo |
| 270–284 | 3 | **The camera goes over the edge.** It pitches down 90° and gains speed as it falls; nothing eases out | The chord holds; the air deepens |
| 285–314 | 4 → bar 6, 1 | The fall: the cliff face of glyph voxels streams up past the lens; below, the dark room's floor rushes up, in voxels | Air under the held chord |
| 315–329 | bar 6, 2 | **Out: the fall lands.** The camera rights itself to the room's own staging as depth collapses in held steps (p315, p320, p325) | — |
| 330–359 | 3–4 | The exact pixel `[W]`: Mas at the desk, the curve on his monitor now vertical. **The band returns** in held steps (p330, p335, p340). Land on his face | On p330 the hum and the rack tick return in phase, dry; the chip lead comes back in its own timbre on the next beat (p345) |

**The render resolution, chosen by eye.** At 1080, perspective voxels get anti-aliased edges off the grid and shimmer as the camera moves. Render the 3D stretch (p60–329) both ways: **(a)** native 480×270, upscaled 4× nearest-neighbour, with the camera stepped on 2s; **(b)** 1920×1080 supersampled 2×, on 1s. Deliver the one that reads as ours as `out/range/p2.mp4`, and the other as `out/range/p2-alt.mp4` for the A/B, with a one-line note of which and why.

**What premium means here.**
- Frame 60 and frame 330 are exact pixel frames; the 3D stretch starts and ends on the grid.
- **3D, but ours.** Every rendered colour comes from the master palette, faces are shaded in whole rungs, and the voxels are the frame's own pixels. The depth is new; the palette isn't.
- **Depth from the draw order, not from colour.** The dark-room plate draws in stages (plate, Orb, Mas's back, desk, Mas's front, front). Record which stage last wrote each pixel, and use `DPLATE`'s geometry for depth inside the plate (wall, window, shelf, monitor, rack). That's the premium layer/depth export in miniature, and it gives the engine owner the shape of the real one (H6).
- The camera obeys gravity, not UI easing (lesson 4), and never shakes.
- No bloom or glow on the curve: the new dimension shows itself through occlusion, parallax and shadow (lesson 1).
- **The crash read.** In a show about markets, a cyan curve falling off a cliff can read as a crash. The curve is smooth, labelled `loss`, cyan only, and the fall ends harmlessly in the room. The blind read asks what the curve means; if the answer is "a crash" or "the market", it fails, and the fallback staging is the curl: the surface keeps curving past vertical and the camera follows it round the lip until the room's floor is overhead, then rights itself.

**Passes if** a blind reader describes a flat room that turns out to have depth, a dive into the screen, a fall over an edge, and a return to the room, and reads Mas's flatness as a choice; nobody says "screensaver", "game" or "crash".
**Fails if** it reads as a block game, a flythrough demo or a glitch; the landing reads as a cut instead of a flattening; the curve reads as a market; or Mas's flat card reads as a bug.
**Must not:** look like any block game (no grass, biomes, tools, blocky avatars); extrude Mas or his glass; shake the camera; add a whoosh or riser; use red or green on the curve.

**Reuse:** `pixel/rooms/darkroom-plate.ts`, `pixel/cast/mas-medium.ts`, `pixel/cast/orb-medium.ts`, `pixel/glyph.ts` (the atlas), `pixel/palette.ts` (the rungs), `pixel/ui.ts` (the band); `three` 0.186.1, `@remotion/three` 4.0.529, `@react-three/fiber` 9.8.1 (installed, unused so far). The audit's extrusion and GL probe lived in scratch and were deleted; they're rebuilt here as small modules.
**New:** the nested-lanyard pixel art (the badge Droste); the extrusion (instanced cubes from a pixel buffer, with the per-stage layer id); the flat cards for Mas and the glass; the tunnel, curve and cliff geometry; the palette-snap post pass; the landing collapse; the band retract and return; the two-resolution render.
**Final route:** CODE. This medium is at its ceiling in three.js; the lift is the engine's depth export.

### 7.3 Prototype 3 · near-photoreal with pixel contact · THE RECONSTRUCTION's table (12.A, Ep12 #6)

| | |
|---|---|
| **Owner** | THE MACHINE, in its own flashback (a signposted render, so the bezel rule holds) |
| **Medium** | Near-photoreal objects (the table and its linen, the LED "candles", the guests' glasses, the cutlery) resolving out of a point cloud, with pixel sprites seated at them, in full contact |
| **Clip** | 360 f. Pixel p0–44 · the render p45–329 · pixel p330–359. Plus one still: CLOD's clay turnaround |
| **In / out** | The band retracts; the monitor's cyan, and points bloom around the table / the room collapses back into the monitor's glow, and the band returns |
| **Staging** | Ep12's dinner at THE WOODROSE in pixel, the monitor at the far end of the table facing Mas at the head, "like a mirror" (Ep12 #4); then the model's rebuild of the 2015 dinner with the camera in Mas's chair |

**The idea.** The model can rebuild a room it learned, but not a person. So the objects come back perfect, and the people come back exactly as the show draws them, sitting at a real table in real candlelight. Their tells float over them as the season's stat bars. Every glass on the table is real except one: his. The model learned everything at that table but him.

| p | Beat | Picture | Sound |
|---|---|---|---|
| 0–29 | bar 1, 1–2 | Pixel `[W]`, band on screen: the Ep12 table at THE WOODROSE from the side, adventure-game staging. Mas at the head; the monitor at the far end, glowing cyan; the guests along the table; LED candles; his glass, one flat row | The Ep12 dinner bed (cutlery, a murmur with no words, room tone) under the finale cue |
| 30–44 | 3 | **The band retracts** in three held steps (p30, p35, p40) | — |
| 45–119 | bar 1, 4 → bar 2 | **In: points bloom** from the monitor's cyan and rise off every surface. The pixel room steps down to black in whole rungs behind them, leaving a cloud of cyan points; the guests' POV rims (green, orange, red, navy) gather as coloured clusters and converge on cyan (Ep12 #6). The camera, now inside the model's render, glides from the side view **into Mas's chair**, looking down the table at the monitor | The room's bed thins; the monitor's tone rises one step. The chip lead's timbre steps toward acoustic, and the cue carries on in piano and strings |
| 120–209 | bar 3 → bar 4, 2 | **The learned objects resolve**, one family per beat: the table and its white linen (real weave, folds, a soft sheen); the LED "candles" in glass holders (warm, flicker-free, true point lights); the cutlery; **every guest's glass** (refraction, caustics on the linen). The walls, the window and the rest of the room stay sparse points and glyph. The guests appear as **pixel sprites** in their seats, each in its POV rim, **in full contact** (§4.6): the table's near edge covers their laps; each casts a shadow from its own alpha onto the linen; each shows as a small pixel image in the nearest glass and the polished cutlery; the candles warm the faces that face them by one palette rung and the monitor adds a cyan rim rung. **Mas's glass, in the foreground at the camera's place, stays pixel**: a flat 4× sprite on the real linen, with its own contact shadow | The sound resolves like the picture: sparse, clicking points first, then converging on a recorded, full-band 2015 dining room (cutlery, glass, a murmur, no words) about 10 dB under the cue |
| 210–269 | bar 4, 3 → bar 5, 2 | **The stat bars rise** over the guests in pixel, the season's shape and fill order, one guest per beat (for example `ORG CHART ▰▰▰▰`, `A-G-I ▰▰▰▰▰`, `NAMED IT ▰▰▰▰▰`, `CONCERNS ▰▰▰▱`; the writers set the final labels) | One sound for the set, not one per bar: the piano plays the chord once as the last bar fills |
| 270–314 | bar 5, 3 → bar 6, 2 | The camera turns a few degrees to the window, a dark reflective plane of points: **Mas's reflection, in pixel, and over it nothing.** Hold from p285 | The cue thins to a pedal; the 2015 room goes on under it |
| 315–329 | 3 | **Out: the room collapses back into the monitor's glow.** The objects de-resolve to points in held steps (the objects first, then the space), and the points stream back into the monitor | The dining room collapses into the monitor's tone |
| 330–359 | 4 → end | Pixel `[W]`, the Ep12 table as at p0. **The band returns** in held steps (p330, p335, p340). Land on Mas and his glass | The dinner bed returns in phase on p330; the cue carries on in its own timbre |

**What premium means here.**
- **The objects pass as near-photoreal at full frame**: linen weave and folds, glass refraction and caustics, soft candle light from true point lights, graded within about a stop of the pixel room. Built in three.js (`MeshPhysicalMaterial`) with image-based light from **one CC0 HDRI** (Poly Haven, an evening interior, 1k or 2k, under 10 MB; resource ask 2 costs nothing) and **multi-sample accumulation**: jittered camera and soft-shadow samples, about 16 per moving frame and 64 per held frame. If the download isn't allowed, three.js's built-in `RoomEnvironment` is the fallback, and the prototype says so.
- **Contact is the test.** All four kinds (occlusion, shadow, reflection, light in whole rungs) are visible in one frame at p200, and the sprites look like they're sitting at the table, not pasted over it.
- Mattes where the render meets pixel are stepped on the native 4×4 grid.
- **Nothing about a person is near-photoreal**: no face, no hand, no statue, no reflection of a caricature rendered as anything but its pixel sprite. The HDRI holds no people, readable text or logos.
- Mas's pixel glass reads as deliberate, the room's quiet joke, not as an error.
- One backend (the iGPU) for the whole clip.

**Passes if** a blind reader says something like "a computer rebuilt the room, but not the people" from one frame, and the sprites read as sitting in it.
**Fails if** the sprites look pasted on (no contact), the objects read as a game engine, the pixel glass reads as a compositing error, or anything reads as a photoreal person.
**Must not:** resolve the walls or the window into a full near-photoreal room (the first perfect render is J5); put any caricature in a physically based material; use a model-generated image anywhere.

**The clay still: CLOD's turnaround** (`out/range/p3-clod-turnaround.png`). One 1920×1080 frame on the same three.js kit: CLOD four times on a seamless paper sweep (front, three-quarter, side, back), terracotta `#B8573A` with fingerprints and tool drag, the bow tie, the clipboard, the potter's wheel in its chest; one soft key, a warm fill, contact shadows and AO on the sweep, miniature depth of field. **Passes if** a blind reader says "a clay puppet" and nobody says "CG with a clay texture." It's the kit 1.A, 7.A and 11.C build on.

**Reuse:** `src/dev/mdinner1/set.ts` and `mdinner2/` (the WOODROSE table, seats, pendants, LED candles, windows: imported, not edited), the pixel cast (`mas-medium`, `gerg-medium`, `nole`, `mario`, `alyi`), `pixel/glyph.ts`, `pixel/palette.ts`, `pixel/ui.ts`; `three`, `@remotion/three`.
**New:** the Ep12 table `[W]` with the monitor at the far end; the point system; the PBR object set; the contact system (sprites as billboards that cast alpha shadows, show in reflections and take light in whole rungs); the pixel stat bars; the window reflection; the collapse; the band retract and return; CLOD's clay figure and sweep.
**Final route:** Blender EEVEE on the iGPU, or cloud Cycles, for the objects; the sprites and the points stay code.

### 7.4 Prototype 4 · the Tier 1 reel: four passes in their rooms

Four clips of 180 f each, cut as one 30 s reel under **one continuous temp cue** (a tension-palette cue at 96 BPM). Each clip enters from a pixel room through its door, holds its pass for about 4–5 s, and exits back into a pixel room, landing on a face or an object. **The band stays on screen throughout** (device passes keep it), and each pass fills only the 480×203 room area. The reel itself is the test that passes come and go with the sound bed never dropping.

**4a · P4 SPORTS · Draft Night (5.A, Ep5 #10).** `rooms/boardroom-plate.ts`. p0–179.

| p | Picture | Sound |
|---|---|---|
| 0–29 | The boardroom at night in pixel: the wall TV shows the draft, small. Mas at the table, his glass beside him, still | The room tone; the TV's stadium PA, band-limited through its speaker; the cue |
| 30 | **In: cut to the stadium feed** on the beat | The PA at full broadcast range, a crowd, a commentator's wordless murmur |
| 30–149 | A fixed broadcast camera on the draft stage: the draft board a wall of GPU racks, one rack lighting; a pick walks out in a jersey with a citation count on the back, holding a novelty check `$100M · PER MANALT`. A generic pick card lower third (`ROUND 1 · PICK 4`, parody marks only), a ticker crawling `POACHED · POACHED · POACHED`, and a telestrator circle drawn in held steps around the pick's thermos of soup. The crowd behind the stage defocuses by **stepped resolution** (2×2, then 4×4 farther back), never a blur | The cue plays under the broadcast |
| 150–179 | **Out:** cut back to the boardroom; the feed small on the TV again. Land on Mas's face; the glass | The PA back through the TV speaker, under the room tone |

**4b · P5 STREAM · the chart crime (5.I, Ep5 #24).** `rooms/bullpen.ts`. p180–359.

| p | Picture | Sound |
|---|---|---|
| 180–209 | The bullpen in pixel; the wall screen shows NopeAI's launch stream, small. Two pixel-step push-ins toward it (p190, p200) | The bullpen's room tone under the cue |
| 210–314 | **In: the stream fills the room area.** A launch-stream layout: the main video (Mas presenting in pixel beside a slide), a chat sidebar scrolling in held steps (`the bars???`, `bigger number shorter??`, `chart crime`: invented), a small generic `LIVE` tag and a viewer count. The slide: the `BIGGER NUMBER` bar shorter than the `SMALLER NUMBER` bar. Honest stream compression: soft chroma, one macroblock drift on a fast move, never a glitch | The stream's compressed room, no dialogue; one soft notification tick per chat burst; the cue continues |
| 315–359 | **Out:** pull back through the wall screen to the bullpen. A staffer stares at it; land on the face | The bullpen's tone returns |

**4c · P3 BROADCAST · the Security Council webcast (9.E, Ep9 #30).** A new pixel plate: the council chamber (a horseshoe table, desk mics, nameplates, a plain dark back wall; no copied mural). p360–539.

| p | Picture | Sound |
|---|---|---|
| 360–389 | The chamber in pixel, `[MS]`: Mas at the horseshoe; two seats away, a chair labelled `INVITED`, empty | The chamber's murmur, the cue |
| 390 | **In: cut to the chamber's webcast wide** | The PA through the webcast: a flat, compressed room, a faint wordless interpretation channel doubled under it |
| 390–479 | A fixed high wide, locked off (G2), flat institutional light, broadcast-safe colour; a generic lower third, `SECURITY COUNCIL · OPEN DEBATE · ARTIFICIAL INTELLIGENCE`, a small `WEBCAST` bug and a timecode. Everyone is tiny; the `INVITED` chair reads from across the room | The cue thins under the PA |
| 480–539 | **Out: we go close on Mas**, in pixel `[MCU]`, the way 1.F leaves its wide. Land on his face | The pixel room's bed returns in full |

**4d · P21 IRIS · the Orb checkpoint (11.E, Ep11 #17).** `rooms/lobby.ts` with `cast/orb-medium.ts`. p540–719.

| p | Picture | Sound |
|---|---|---|
| 540–569 | The lobby in pixel: the Orb at a checkpoint rope; guests passing; NOLE steps up. The Orb turns to him | The lobby's bed; the cue |
| 570–574 | **In: the iris opens**, its blades stepping open across the room area in held steps | A small mechanical aperture sound |
| 575–659 | The Orb's view, the code version of the chrome-lens replay: the pixel frame through a fisheye that bends the grid correctly, a chrome rim, one specular sweep, a scan line passing over NOLE (a sprite; never glossy skin). `NOT VERIFIED`. A long held beat. Then a tiny stamp: `…human? probably?` | One scan tone; one low tone on `NOT VERIFIED`; the long beat is the cue's pedal, never a hole; a tiny stamp thud |
| 660–689 | **Out: the iris closes** in held steps back to the Orb's eye | The aperture again |
| 690–719 | NOLE let through on appeal, in pixel. Land on the Orb's eye | The lobby's bed; the cue's phrase resolves on p720 |

**What premium means here.** Each clip reads as its device from one frame: a sports broadcast, a launch stream, an institution's webcast, a scanner's view. Every OSD is honest type with parody marks only. The band and the rail stay untouched. No blur anywhere. The cue never drops into a hole. Photosensitivity holds (the iris and the stamp are single events).

**The reel passes if** a blind reader names each device and never says "filter", and if the sound never drops.
**Build:** the passes go into one additive `passes` module next to the engine (H6), so the season reuses them, along with the stepped-resolution defocus and the band helpers. The audit measured 10–40 s per 5 s shot; the reel renders in a few minutes on the CPU.

---

## 8. Resource asks

Every item in the map has a code filler, so nothing here blocks the first pass. Each ask lifts specific moments; the cheapest ones come first. These add to [GENAI §9](../production/GENAI-UPGRADE-PLAN.md#9-resource-asks-ordered-by-impact) and [capabilities §8](../production/style-range-capabilities.md#8-resource-asks-ordered-by-lift).

| # | Ask | Cost | What it buys | Without it |
|---|---|---|---|---|
| 1 | **GPU access that doesn't depend on the desktop login:** `sudo usermod -aG render jgon` | Free; one command; **needs your OK** | Reliable 10–40× faster three.js renders for every 3D row: Prototypes 2 and 3, 2.A, 1.A, 5.B, 7.A, 8.B's room, 9.A, 11.A, 11.C, 12.A | GPU renders silently fall back to the CPU when no one is logged in at the console; we probe before every render |
| 2 | **CC0 HDRIs and scanned PBR textures** (Poly Haven) | Free. One HDRI under 10 MB for Prototype 3 now; 50–200 MB a set later | An immediate lift for every near-photoreal filler: 12.A's objects, 2.A's clip, 8.B's room, 3.A's strawberry | Procedural materials and three.js's `RoomEnvironment` |
| 3 | **The video-model key**: Runway API with prepaid credits (GENAI ask 2), plus the backed-up source archive it needs first (GENAI ask 3) | $50 bake-off → $150 pilot → $500 season ceiling; ~$1–4 a shot; archive ~$0–5 a month | Near-photoreal where believable chaos matters, **inside its bezel until J5**: 2.A the mammoth in its screen, 4.F the melt, 8.B the room in the projector, J5 the sky; E9-1's rain optional. Environments, objects and creatures only | The three.js fillers ship: good real-time CG, which only has to hold at screen size |
| 4 | **Disk:** an external drive, or a cleanup (the disk is 97–98% full, about 10 GB free) | ~50–100 GB is comfortable | The precondition for 5 and 7: Blender, texture sets, Cycles frame sequences (0.4–1.4 GB a shot before encoding) and the source archive | One heavy shot at a time, scratch deleted after each |
| 5 | **Blender 4.x LTS** | Free; ~1.2 GB installed plus assets | **Controlled near-photoreal objects.** EEVEE on the iGPU (est. 10–60 min a shot): 12.A's table set, 8.B's room. **Cycles on the CPU for stills** (est. 2–6 min a frame): 3.A's strawberry photo. Baked lighting back into three.js | Objects stay good CG |
| 6 | ~~Permission to add `three-gpu-pathtracer`~~ | — | **Withdrawn.** Its main reasons were 4.A's gold, 5.E's plastic, 7.B and 12.C. The first two are now drawn (the likeness line), 7.B is a pass, and 12.C is A4 in code. Accumulation in three.js and Blender stills cover the rest | — |
| 7 | **Cloud GPU hours** | ~$25 covers dozens of Cycles shots (est. $0.10–0.50 each) | 12.A's objects with the camera moving into Mas's chair, path-traced | Local EEVEE, or the three.js accumulation filler |
| 8 | **Real material references** | ~$20–50 | A block of plasticine to model and phone-scan CLOD's head (1.A, 7.A, 11.C, the turnaround); card stocks and torn edges (3.D, 6.D); a watercolour pad for 4.F's washes | Code textures |
| 9 | **Human craftspeople and performers** (unquoted) | — | The most honest version of each medium: a **one-puppet stop-motion day** for CLOD (a tabletop set, about 20 s across 1.A, 7.A and 11.C); a **courtroom sketch artist** for 3–4 frames (8.D); an **anime key animator** for about 10 s (10.C's key drawings, 4.F's portrait); an **illustrator's paint-over** (NOLE's cover in 8.B); optionally a **paper-craft day** (3.D); a **voice performer**, or a voice designed from text, for the depicted voice clones (1.F, Ep1 #16) | The fillers |

**The shortest path to near-photoreal:** asks 1 and 2 lift three.js today at no cost, and Prototype 3 proves them. Ask 3 covers everything chaotic inside a bezel, and J5's sky. Asks 4 and 5 cover the controlled objects. Ask 7 covers 12.A's moving camera.
**The shortest path to higher-end 3D:** ask 1, the engine's layer/depth export (H6), and a scanned maquette (ask 8).

---

## 9. Rulings, handoffs and the checklist

### 9.1 Rulings needed (showrunner)

R1–R9 are the opportunity map's ([§10](../_sources/research/style-range-opportunities.md#10-conflicts-rulings-and-handoffs)); R10–R15 are added here.

| # | Ruling | Default until answered |
|---|---|---|
| R1 | This two-tier guidance replaces style-jumps' budget ("8 a season, 30 s, 0 or 1 an episode") | Plan to this file (about 16 leaps, register strips); the showrunner's "no hard cutoffs" note already points here |
| R2 | Mas may appear in any stylized medium (anime, clay, low-poly, painted, pastel, paper, voxel), never near-photoreal | Allow, per the showrunner's own guardrail wording |
| R3 | A leap may carry a laugh when the medium is the joke's subject (4.F, 12.E); it never decorates a joke that works without it | Allow, case by case in the animatic |
| R4 | A physically based material on a caricature's form (a gold statue, a plastic figurine, a mannequin standing in for a person) | **Deny.** The bible's own rule is that when a leap and a guardrail disagree, the leap goes. Gold and plastic are drawn |
| R5 | The genai plan's principle 4 ("no face or performance out of a model") stays. Does a restyle of our own rig renders count? Does YLLIT (fictional) get an exception? | Principle 4 stands; no restyle of faces; no YLLIT near-photoreal |
| R6 | The SYNTH ruling (GENAI §10) now covers the mammoth's clip inside its screen (with CONVERT at the step-out), the Rashomon room inside the projector, and J5's sky | Code fillers ship; plates wait |
| R7 | A legal read of 4.F's STUDIO IBLIHG evocation before lock | Evoke the internet's version only: faces on pictures first, the cathedral in the machine's flawed copy, no landscape |
| R8 | No leap takes a real politician as its subject, and no pass speaks for a politician's perception | Hold as a strong guideline |
| R9 | **The pixel world itself never moves in perspective until 11.A.** Other media may move their own cameras (a clay set, the low-poly plaza); THE HUG's "bullet time" is a layered slide, never an orbit | Reserve |
| R10 | The intro's bar-9 slot, the title cards and the end tags as fenced slots: passes freely, leap media only as callbacks to what has aired | The intro owner decides, slot by slot |
| R11 | A performer-driven rotoscope: a consenting performer's reference video driving our caricature (never footage of the real person) | Not used; the "fake" routes (3D toon to pixel) are fine |
| R12 | At a leap, the music re-voices or thins rather than stopping dead; designed silence only for J1 and J6 | As written here; the soundtrack pass owns the detail (H4) |
| R13 | **The bezel rule:** the machine's near-photoreal image stays inside a bezel or a signposted render until J5, which breaks it once (and needs the SYNTH owner's sign-off, per style-jumps §6) | As written here |
| R14 | **Mas's tell:** before J6, no pass is keyed to his inner state, and his glass stays pixel inside every leap | As written here |
| R15 | Ep8 carries two leaps in one act (8.B, 8.D) | Keep both; the animatic decides; 8.D's fallback is a P25 print in pixel |

style-jumps' own open decisions (J5's hold, J1 replacing the GLYPH dissolve) stay with that file.

### 9.2 Handoffs (this file edits no other file)

| # | To | What |
|---|---|---|
| H1 | **The jump-fix pass** (`style-jumps.md`, `studio/src/dev/jumps/**`) | The two-tier definitions, the owner table, the narrowed spine and **the bezel rule, restored**. J4's two blanks are Mas and the Intern's caret face (the tell ladder). J5 is named the season's first perfect render and single bezel break. J6 lands inside the Ep12 oner (12.K), framed with no reformatted window in shot. A4 stays code at 12.C. J2's "bullet time" is a layered slide, no orbit. A2 → 8.D, A3 → 11.A. R1–R3, R13 |
| H2 | **The season revision** (`show/episodes/**`) | The ★ items as proposed staging, beat by beat; none adds a scene, a speaking character or a real line (4.E adds one invented CLOD line; 10.C allows one lowercase V.O. line). Specific beats: **Ep1 #16–17** the depicted voice clones are designed or performed, with the `[AI-GENERATED AUDIO]` caption. **Ep2 #1** the mammoth is near-photoreal only inside the screen; the sixth finger goes. **Ep4 #15** F4.1 in the base, the first rung of the tell ladder. **Ep7 #7** staged on the TV in Mas's room unless the facts place him at the game; the thumbprint is the brand's mark. **Ep7 #17** "bullet time" without an orbit. **Ep8 F8.1** one projector door; the coda's organ as a bed, never a stinger. **Ep9 #20** the finish strip's joke is the long gap (11:48pm to noon), not "too close to call". **Ep10 #19** the dealer is the Intern, caret face, nothing over it. **Ep11 #14** the brownout, if the loop is still bowing, or pixel. **Ep12 #4** the sort's swap-whooshes go. **Ep12 #16–19** one unbroken push. **The flashback docs** still tag the 2015–21 flashbacks "T3 · cut-paper", a v1 leftover (intro spec §7 marks it PENDING STYLE): relabel T3 as pixel, since paper is MISANTHROPIC's medium (3.D; F3.3's pop-up is that leap, not a tier). The profile-picture plant stops at Ep4. A G1 ONER elsewhere, if a sequence wants one |
| H3 | **The Ep1 Act Four v4 pass** | 1.E (J1, unchanged) and 1.G (P2 CALL on the call grid), as options only. 1.A is now a 4 s bezel micro on the lighthouse monitor |
| H4 | **The soundtrack pass** (`audio/ost/**`) | §4.3–4.4: sound by family and the period-true machine sound (2.A silent under the room's bed; AROS 2's own sound from Ep6); the re-voice rule (R12); each brand's sound (clay: dry-room foley and one felted-upright line, never a pizzicato "ad cue"); F8.1's organ as a bed; Ep12 #4's silent sort; 12.K under the room bed; the prototype temp cues; the voice for 1.F and Ep1 #16 (designed from text or performed, never an imitation) |
| H5 | **The genai plan owner** | Plate candidates now: E2-1 SYNTH inside the boardroom screen with CONVERT or REF at the step-out; E8-2 inside the projector; E4-3; E12-4 for J5; E9-1 optional. Removed: 6.F's street, 7.B's lasagna, 7.G's rain, 12.C's studio. 12.A's objects route to Blender, not video. Stills through Blender as a third route beside CONVERT and SYNTH. The resource asks in §8, with ask 6 withdrawn |
| H6 | **The engine owner** (`studio/src/shared/pixel`) | A `passes` module for the booked passes, additive only; stepped-resolution defocus bands; the band's retract and return; G6's hotspot label with a stat bar; the pixel stat-bar element; OSD helpers for the three device sizes; a three.js composite path under the pixel UI with the contact system (occlusion, alpha shadows, reflections, light in rungs); the per-pixel layer/depth export (the per-stage write id is its first form); the GL probe as a shared tool. With the PIXEL_GUIDE owner: the band rule by family (§4.3) |
| H7 | **Fact checks** | Re-verify every [K] before it reaches a card or the rail: Mas's avatar change (Mar 2025, still unverified: this pass's web-search budget was used up); the image model's warm cast; KCAJ's essay wording; the fake CCTV clip; the courtroom-camera convention; whether Mas attended the Big Game (default: no); AROS's first preview without audio and AROS 2 with it |
| H8 | **The style-status owner** | A §7c pointer to this file. Device passes don't count toward §7b's "two non-base styles" guide; they do count in the register strip |
| H9 | **The intro owner** | The bar-9 slot as a fenced slot (R10); **the title cards rendered as their file types** (§3.4); 12.I, the finale's takeover, stops short of a perfect render |
| H10 | **INDEX** | Add this file to the Bible table, after style-status, and mark style-jumps as superseded in part |
| H11 | **THE EDITOR** | A register strip per episode in the POV ledger, re-counted in the animatic ([§6.14](#614-the-register-strips)) |

### 9.3 Before a leap or pass locks

- [ ] It has an id from §6 and an owner from §1.3.
- [ ] It enters through a door (§4.1) and its exit lands a beat (§4.2); the band follows its family's rule.
- [ ] The taste tests pass (§5.3), and the animatic was cut both ways.
- [ ] It's on the episode's register strip, and the strip still lets the episode stay in one register for a while.
- [ ] It commits to its medium's rules for the whole stretch (§3.2), and it looks at least as finished as the pixel base.
- [ ] The sound bed carries across; any stop is a designed beat; the machine's sound is period-true.
- [ ] Mas is in it or behind it, never frozen, and never near-photoreal. Nothing reads his inner state before J6; his glass is pixel.
- [ ] A machine near-photoreal image is inside a bezel or a signposted render (unless it's J5).
- [ ] No caricature is near-photoreal or in a physically based material; no face or performance came out of a model; no studio's look is copied; parody marks only; no voice is cloned.
- [ ] The UI layer is pixel and untouched; facts stay on the rail.
- [ ] Photosensitivity: at most 3 flashes in any 24 f; every pop ≤ 80% white.
- [ ] The one-frame test passes blind, at full frame and at phone size, with its door and exit in the clip.
- [ ] The filler plays well on its own and holds the final's timing, framing and masks. Any `GEN:` slot has a fallback.
- [ ] 1920×1080, 24 fps, one render backend.
- [ ] Logged in the episode's POV ledger.

---

## 10. Change log: the critic pass

**Applied (2026-09-26).** Every numbered amendment from the critic was applied, most in full. Where each landed:

| # | Amendment | Where |
|---|---|---|
| 1 | The bezel rule restored; 2.A restaged (near-photoreal inside the screen, pixel through the bezel; the slide and the melt carry over) | Twelve lines 7; §1.3; §1.4 point 4; §1.6; §3.2; §4.1; §6.2; R13 |
| 2 | The firm-line contradictions: gold and plastic drawn; 8.B's people as sprites, no six fingers; R4 default deny; the path tracer withdrawn; 1.F's voice method and caption | §3.2 (held); §5.1; §5.4; §6.1; §6.4; §6.8; §8 ask 6; R4 |
| 3 | Ep12: J5 the one first perfect render; 12.A converges into the machine's grammar; 12.C back to A4 in code; 12.J cut; J6 framed without a reformatted window | §1.4; §1.6; §3.2; §6.12; §6.15 |
| 4 | The tell ladder: stat bars in cel at 10.C, the blank over the Intern's caret face, named in §2.2 and §3.5 | §2.2 (THE TELLS); §3.5; §6.10; Prototype 1 |
| 5 | Mas has no tell: P34 and P33 cut; 11.H re-motivated from the grid's draw; D6 out of the reel; the rule "before J6, no pass keyed to Mas's inner state" | Twelve lines 8; §2.2 (FEELING and THE WORLD); §5.3 test 11; §6.11; R14 |
| 6 | Count register changes; the per-episode register strip; the slate trimmed to about 16; Ep4, Ep6, Ep7, Ep8 and Ep10 fixed | Twelve lines 4; §2.3; §3.3; §6.13; §6.14 |
| 7 | Cuts and demotions: 6.F to reserve; 7.B to P23; 7.G, 5.E, 5.C, 5.J's velvet, 10.F, 11.I, 12.J and 2.B cut; 10.B a pixel zoetrope; 1.A to its 4 s fallback; 2.H cut | §6; §6.15 |
| 8 | The prototype set: Prototype 3 (near-photoreal with pixel contact) replaces clay, which keeps one turnaround still; the reel rebuilt on P3, P4, P5 and P21, each with its door and exit in a pixel room | §7.0; §7.3; §7.4 |
| 9 | Prototype 1's premium: one continuous 8–10 s push, the tells as objects, no hands at insert size, one painted key drawing for the eyes, the hard-key test first, "No NOLE anime" resolved | §3.2; §6.10; §7.1 |
| 10 | Prototype 2: the reveal on a recognisable full frame (the dark room turning), R9 reworded, the resolution A/B, more time for the first parallax, the crash read addressed | §3.2; §7.2; R9 |
| 11 | 7.A's staging: the TV in his room, the thumbprint as the mark, no pizzicato; clay for the product only | §1.3; §3.2; §5.2; §6.7 |
| 12 | 4.F: faces on pictures first, the cathedral in the machine's flawed copy, THE OLD MASTER's still untouched and out of frame at the peak; the avatar plant an Ep4 egg only | §3.2; §5.1; §6.4; §3.5 (plant removed) |
| 13 | The spine rewritten: fidelity healed by Ep6, then authorship and dimension; the sound spine | §1.4; §4.3 |
| 14 | Mas's glass as the anchor of the range system | Twelve lines 8; §3.5; Prototypes 1–3 |
| 15 | The verb and inventory band: stays for device passes, retracts for leaps; G6 THE HOTSPOT at 10.C's pre-roll | §1.2; §2.2; §4.1–4.3; §7 |
| 16 | One booked moment of subtraction: the Ep12 button as one unbroken push ending on the ring | §3.4; §6.12 (12.K) |
| 17 | The title cards as their file types, handed to the intro owner | §3.4; H9 |
| 18 | 8.A staged objectively | §5.2; §6.8 |
| 19 | "No genre quote on a genre gag" reworded; 9.A drops the noir grade; E9-1 optional | §5.3 test 5; §5.4; §6.9 |
| 20 | No blur on pixel art: stepped-resolution defocus; 6.A cut to reserve | §2.4; P7, P23; §6.15 |
| 21 | The vocabulary pruned to booked passes, the rest in Appendix A; 5.B plays emptiness and collapses to a sprite | §2.2; §3.2; §6.5; Appendix A |
| 22 | Housekeeping: T3 relabelled as pixel (H2); 9.C's beat read correctly; Ep12 #4's whooshes (H2, H4) | §4.4; §6.9; §6.12; H2, H4 |

**Modified or declined, with the reason.**
- **Item 3 × item 14, "only the objects it learned resolve (the table, the LED candles, the glass)":** modified. Item 14 keeps Mas's glass pixel inside every leap, so at 12.A **every guest's glass resolves and his doesn't.** That turns the conflict into the reconstruction's quietest line: the model learned everything at that table but him.
- **Item 16, "one unbroken push ... ending on J6":** modified. #18 (the Orb) and #19 (the title) come after the ring, so the push doesn't end on J6; J6 lands *inside* the take, and the Orb's scan and the title follow in the same frame. The only cut is to black.
- **Item 6's count, which counted masked GLYPH and the freezes alongside the leaps:** modified. The strip lists every change, as asked, but separates full-room changes (■) from in-frame marks (□: a GLYPH cone, a bezel, an OSD, a leap inside the frame). A masked cone doesn't take the viewer out of the room's register, and counting it the same way would push the fix toward cutting the season's foreshadowing grammar instead of its real crowding. Ep4 still drops from about 11 changes to about 7.
- **Item 6, Ep8's two leaps in Act 2:** kept with a stated exception (R15) rather than cutting 8.D. The verdict is seven beats after the Rashomon, in a different family, 3 s long, and it's the record's best case for its own medium (courts bar cameras). The BUFFER goes to reserve and F8.1's extra registers fold into one projector door, which fixes the crowding the critic named. The animatic decides, and 8.D has a pixel fallback.
- **Item 8, "either 2.A as restaged in item 1 or 12.A's table":** 12.A chosen. The restaged 2.A only has to hold up at screen size, which is the easier case; 12.A tests pixel sprites *inside* a near-photoreal plate, all four kinds of contact, the tell ladder's last rung and the glass anchor in one clip.
- **Item 9, "No NOLE anime":** resolved both ways the critic offered, as a stated exception (the opportunity map's line ruled out zAI's anime companion as a lens, not Nole as a figure in Mas's self-image) and by keeping his tell on the phone.
- **Item 12, "Keep it as a verified Ep4 egg":** kept, but only once it verifies. The avatar change is still [K], and this pass couldn't re-verify it.
- **Item 1 and 4.F:** 4.F isn't treated as a bezel break. It's painted, not footage, and the amended wave repaints the city's pictures and the machine's own cathedral, not its streets or people, so the world isn't converted before J5.
- **Own additions, for consistency with the amendments:** 11.A keeps Mas and his glass as flat cards when the room gains depth; 12.I stops short of a perfect render; 7.E goes to reserve (one beat after J2); 11.G goes to reserve (a second pass in 11.B's beat); the three device-pass sizes (OSD, bezel, full), so a crowded strip can shrink a pass before cutting one; 3.A's strawberry photo pays off in J5 rather than 12.C, since 12.C is now a pixel print.
- **Declined:** none outright.

---

## Appendix A. Reserve passes (only when a script names the device)

These are built or buildable, and none is booked. Use one only when a script names its device on screen; never as decoration, and never to fill a quiet stretch. Each still follows §2.4.

| Pass | What it looks like | Its device | Known weak spots |
|---|---|---|---|
| **P13 LENSING** | The pixel frame bends around a black disc, pixel-accurate | A black hole on a screen, a lens | Its only booking (5.C) was cut: it put HIM's medium on a real post |
| **P14 BUFFER** | The frame re-renders coarse to fine, like a stream catching up | A stream or a feed that's genuinely lagging | 8.C is in reserve |
| **P16 TILT-SHIFT** | A fake-miniature band, **grid-true**: stepped resolution in bands, never a blur | A photo app's miniature mode, a toy | 6.A is in reserve |
| **P20 DV** | Soft chroma, interlaced motion, an OSD date (2003–05; never a tracking roll) | A home-video camera in the scene | Dropped from F4.1 so the stat bars read clean |
| **P22 ARCHIVE TAPE** | Restrained chroma bleed, one tracking band, head-switch noise, honest OSD type | Footage played back off tape (an old deposition, a keynote from the archive). Never a transition | — |
| **P26 RISO / NEWSPRINT** | Two-ink misregistration, AM halftone at a real screen angle, paper grain | A pamphlet, a zine, a paper's inside page. Never a political poster | Needs a per-scene tone curve for our dark rooms |
| **P27 NOIR** | Black, paper, one spot colour | A hard-boiled paperback or poster in the scene | Lit scenes only; the dark rooms need a relight |
| **P28 THERMAL** | An iron LUT with heat from colour family (skin, screens, lamps), a sensor HUD | A machine's heat sensor | Thermal peaks ≤ 80% white |
| **P32 HELD FRAMES** | The world steps down to 6–8 fps for a shock beat and comes back; Mas keeps his own motion | A world event everyone sees (never his mood) | Easy to overuse; one a season at most |

**Retired:** **P33 PALETTE HIT** (an inversion or duotone for a beat: corn at this show's rate, and nothing booked it) and **P34 MOOD DRIFT** (the room drifting with his composure: a ripple by another name, which would spend J6 in advance).

---

## 11. Prototype results

*Added 2026-09-26, after one polish pass per prototype against its cold read.* All four clips are built and re-rendered with temp sound, and each builder checked its encoded file at full size and at 480×270. **None has had a blind re-read, and nobody has listened to any of the sound.** The approval gate in [§7.0](#70-why-these-four-and-how-theyre-judged) still holds: no leap or pass enters season production before the showrunner's call. The beat tables in §7.1–7.4 are the briefs; where a clip now differs, this section says so, and the tables get updated once the showrunner approves, not before.

### 11.0 The review reel

- **`out/range/range-reel.mp4`**: 1920×1080, 24 fps, 2,352 frames (98.0 s), H.264 at crf 14 with 256 kbps stereo AAC at 48 kHz, 58.6 MB. The order is slate, P1, 1 s of black, slate, P2, 1 s of black, slate, P3, 1 s of black, slate, P4, 1 s of black. Each slate is 3.5 s and silent, fades in and out of black over 8 frames, and gives the prototype's id, tier, medium, season moment, owner and length. The clips are unchanged, and so is their sound, apart from a 5 ms ramp at each edge against clicks. **Internal only**: it carries J4, the cliff and the reconstruction.
- **`out/range/range-sheet.png`**: one key still per prototype, taken from the encoded reel: P1 p238 (the push with the tells lit), P2 p147 (the room in perspective, Mas a flat card), P3 p200 (contact at the table). P4 gets its four passes as one tile, each at 480×270: p130, p290, p430 and p650.
- **Rebuild:** `audio/.venv-mix/bin/python studio/src/dev/range/tools/reel.py`. The bundled ffmpeg can't pipe raw video and has no drawtext or fade, so the slates are short PNG sequences in scratch. They're joined to the four mp4s with the `concat` filter and encoded once (x264 crf 14). Scratch peaks at about 60 MB and is deleted afterwards.
- **Checks on the encode:** the encode holds all 2,352 frames. Each clip's first, middle and last frames, and the sheet's frames, match their sources to within 0.8 levels on average (99.9th percentile 10 levels or less), so nothing slipped a frame. The black is true black. Loudness was measured with ffmpeg's `loudnorm` on the encoded AAC, so it differs by a few tenths from the builders' own figures.

| Segment | Reel frames | Time (s) |
|---|---|---|
| Slate 1 | 0–83 | 0.00–3.50 |
| P1 | 84–563 | 3.50–23.50 |
| Black | 564–587 | 23.50–24.50 |
| Slate 2 | 588–671 | 24.50–28.00 |
| P2 | 672–1031 | 28.00–43.00 |
| Black | 1032–1055 | 43.00–44.00 |
| Slate 3 | 1056–1139 | 44.00–47.50 |
| P3 | 1140–1499 | 47.50–62.50 |
| Black | 1500–1523 | 62.50–63.50 |
| Slate 4 | 1524–1607 | 63.50–67.00 |
| P4 | 1608–2327 | 67.00–97.00 |
| Black | 2328–2351 | 97.00–98.00 |

| Clip | Length | Integrated | True peak |
|---|---|---|---|
| P1 | 20 s | −15.4 LUFS | −1.4 dBTP |
| P2 | 15 s | −17.6 LUFS | −5.1 dBTP |
| P3 | 15 s | −20.4 LUFS | −1.0 dBTP |
| P4 | 30 s | −16.2 LUFS | −1.2 dBTP |
| The reel | 98 s | −16.9 LUFS | −1.0 dBTP |

Each clip's loudness is kept as delivered. **P3 sits about 5 LU under P1 and 4 LU under P4**, which you'll hear as a drop at the reel's third clip. Its sound pass should bring the dinner up by about 4 LU, unless the quiet is intended (its builder didn't say).

### 11.1 Prototype 1 · HD cel anime · THE READ

**Final state.** `out/range/p1.mp4`: 480 f, 20 s, CPU render (451 s at `--concurrency=4` on a machine at load 35–50). Code is in `studio/src/dev/range/p1/`. It has a pixel pre-roll with G6 THE HOTSPOT, the band sliding away, the eye key drawing, one continuous cel push across the table to the dealer, J4, and pixel with the band back.
- **The cel shot, restaged.** The players sit around the oval at different depths in high-back leather chairs, with different sizes, poses and head tilts. The Intern stands nearer, at the right end, so the focus pull onto it shows. Everyone breathes (on 2s) and blinks on their own schedule. Figures are clipped along the rail's real curve, and labels fade before the frame edge.
- **The tells.** They play as objects with the season's bars in cel line: the ladle, Mario's napkin (a real napkin whose corner lifts on small handwriting), Nesnej's register key and Nole's phone. Over the Intern's caret face there is nothing.
- **The glass.** It's a larger hand-pixelled tumbler on the pixel base's 4-pixel grid, sitting on the felt by his hand, fully in frame, with a drawn shadow and a spot of light through the water.
- **Life in the pixel stretches:** breathing, steam off Kram's soup and a scrolling phone screen.
- **Mix:** −15.75 LUFS, −1.33 dBTP. The two style cuts are the two loudest transients, and J4 sits about 5 dB above the push.

**Where it departs from §7.1.**
- **The band** slides out in one eased move with a slide sound instead of three held steps. The freed bottom third shows a patterned casino carpet in the lamp's spill, the table's pedestal and the back of Mas's chair.
- **The door in** has a visible cause: the dealer draws a card, lifts it into the lamp, holds it and snaps it down. The music stops for half a second before the snap, so the snap lands 14 dB above the silence.
- **The door into J4** is motivated rather than a plain hard cut. The push rests on the dealer, its caret stops blinking at p345, and the camera is drawn into its screen until the frame is black glass with the caret in the middle (p359). The cut at p360 lands on a card snap and a sub hit and opens on the same caret, drawn in text characters at the same size and place. The view then pulls straight out to the whole table.
- **J4's tells** rise as four columns, one word each (TWITCH, LADLE, ADDENDUM, REGISTER), one glass note each. The caret leaves the dealer's face, so its screen is blank, and blinks over Mas's head, where nothing gets typed: those are the two blanks. It cuts back to pixel at p406 on a softer snap.
- **The ending:** the bars are still up when we come back, his cursor lands on him, the sentence line reads `look at mas`, and nothing sets. Then a final chord and a cut to black at p468.

**Honest read.** At full frame the cel shot looks lit and finished: one hard tungsten key, a cool rim, a painted dark, and the season's bars redrawn in cel line so they read as ours. It's the best evidence so far that the cast can live in a second drawn medium. It isn't premium character animation yet. The staging is still broadly a row of four at a table rather than a composed duel. Kram's and Mario's faces are built on Mas's face and Nesnej's on Nole's, which a key animator would catch at once. J4 is a placeholder for the jump-fix pass and doesn't read at phone size.

**Weaknesses.**
- Kram's and Mario's faces are built on Mas's face, and Nesnej's on Nole's. The ensemble isn't composed.
- The pixel glass inside the cel shot may still read as an error. Only a blind read will tell.
- The push still rests on the dealer for about 1.5 s before it moves into the screen.
- **J4 at phone size:** the words are too small and show as four lines, and the caret over Mas is a small bright mark. Its first 3 frames are huge, noisy bezel characters (they read as a spill, but it's busy).
- The soup drop is only just visible. The dealer's arm in the pixel card lift is a one-pixel line.
- The casino carpet and the felt are painted in code.
- The sound is temp and renders against the live soundtrack engine (`audio/ost/engine`), which another pass is editing.
- No blind read yet. `out/range/p1-sheet-blind.png` is an uncaptioned sheet ready for it.

**Final route.** Unchanged: a human key animator repaints the eye key drawing and the held faces (about 10 s of work, with 4.F's portrait). The only fit for a video model is an empty casino background plate, with no people and no likenesses. The real J4 stays with the jump-fix pass.

### 11.2 Prototype 2 · real 3D · THE CLIFF

**Final state.** `out/range/p2.mp4` is the native variant (480×270 upscaled 4×, the reveal on 2s, the rest on 1s). `p2-alt.mp4` is the 1080 variant, with the same sound. The A/B note stands: **native ships**, because it reads as our own frame gaining depth, while the 1080 variant mixes smooth voxel edges with 4×4 pixels and looks like an engine. The frame where the 3D starts and the frame where it lands are both exact: 0 px differ in the render, and at most 2 levels on the encode. Code is in `studio/src/dev/range/p2/`, and `tools/build.sh` builds both variants in about 5 min.

**Where it departs from §7.2.**
- **The opening has a cause.** The monitor shows the Researcher building its successor: a new badge prints inside the photo window every 5 frames. The lit cursor glides to the badge, the sentence line reads `Look at lanyard`, and it clicks at p30. Mas keeps reading.
- **The band** slides out with weight over p45–55 and returns over p322–331, rather than in held steps. The dead black under the desk is now the desk's front panel.
- **The reveal** settles by p124 and holds to p135. The room keeps living (LEDs, city lights, the Orb's bob), the shadows dither in over p70–86, and the switch from 2s to 1s is hidden in the hold.
- **The push past Mas.** His card stands at the desk's far edge, with his forearms on the desk top. The monitor sharpens in four steps as the camera nears it, so `RESEARCHER V1–V3` read. The 3D badge matches the screen, so there's no pop.
- **The badge zoom** runs at three speeds: V3 held about 0.75 s, V4–V8 rushing past, then a hard brake on V9, which holds about 0.6 s on `EXCEEDS EXPECTATIONS`, with the loss plot in its photo window.
- **The loss surface** is now the monitor's own plot: a dark field with a faint grid, grey axes, `loss`, and the cyan line standing out of the wall as a ledge. The camera trucks along it, crests the lip and plunges down the line, which tips past vertical through the x-axis. Mario's napkin from Ep10 is pinned to the wall on the way down as the one warm accent.
- **The landing** is one continuous, accelerating fall that stops dead on the exact pixel frame at p314, where the brief had three held steps. **The pixel room returns at p315, not p330**, and holds about 1.9 s. At p345 Mas's brow lifts and the Orb takes one servo step.

**Honest read.** This one reaches the brief. The room we've watched all season turns a few degrees and shows its side, Mas and his glass stay one voxel thick, and the native variant keeps every edge on our grid, so it reads as depth added to our own frame, not as a game. The badge nest reads, and the brake on `EXCEEDS EXPECTATIONS` lands a joke without a word. The weakest stretch is the end of the fall, and whether the cyan plunge reads as "crash" is still untested.

**Weaknesses.**
- **Desk streaks:** for about 5 frames (p146–151) the desk's painted grain and light pool stretch into streaks at a grazing angle. You can see it in key-3.
- **Mas up close:** his forearms on the desk look slightly painted on, and a few rim-light specks stay near his hair. Keep him flat anyway: the flatness is the point, and the likeness line rules out anything more.
- **The end of the fall:** for the last ~12 frames the room is a lit block in the dark rather than a floor rushing up.
- **The napkin's curl** is a voxel staircase and reads a little like lined paper, and a cold viewer won't know the Ep10 callback.
- **The monitor's four sharpening steps** may read as texture pop-in.
- **Small life:** the blinks and the Orb's bob are small at phone size, the hold is only about 0.45 s, and the cursor is small on the badge.
- **The crash read** hasn't been tested blind. The mitigations are the legible `loss`, cyan only, and a harmless landing. The curl fallback in §7.2 is still available.
- **Sound:** unheard. The air is synthesized noise, and the landing jumps about 7 dB, which is meant as the impact.

**Final route.** CODE, as briefed. The lift is the engine's layer/depth export (H6), not a model.

### 11.3 Prototype 3 · near-photoreal with pixel contact · THE RECONSTRUCTION's table

**Final state.** `out/range/p3.mp4`: 360 f, rendered on the iGPU (the probe confirmed Intel Arrow Lake) in 257 s. It uses one CC0 HDRI (`warm_restaurant_night_2k.hdr`, 5.7 MB), which is the first use of resource ask 2. The pixel frame hands over into the render effectively exactly: p44→p45 differ by 0.0001 and p65→p66 by 0.0037, and p329→p330 by 0. The only frame-to-frame jumps left are three intended ones (the people's light steps at p155 and p161, and the cut to the window at p269). Brightness sits within the pixel bookends' range through the entry, and the sound has no hole below −42 dBFS. The clay still is `out/range/p3-clod-turnaround.png`. Code is in `studio/src/dev/range/p3/`.
- **Entry:** the show's render front sweeps from the monitor. Behind it the four people turn into prints in their memory colours (green, navy, red, and cyan for Mas), and every pixel of the room becomes a small block in its own colour. When the camera moves, the pixel art opens into a 3D diorama, with dark person-shaped holes where the people were. The room then cools to cyan points in a wave, and the rim appears only once the colours have merged (p106).
- **Timing:** the 2015 slate lands at p108 and the table resolves at p120. The table, candles, cutlery and glasses each fade in over 8–14 frames. The people take the candlelight in steps (p150, p156, p162), after assembling out of their cyan clusters one point per pixel (p128–146).
- **Life at the table:** breathing, blinks, Nole talking with his phone, Mario's finger and his turn to speak, Gerg looking at whoever is speaking, and one line from Alyi. Bodies are lit down to the cloth and go into the table's shadow. The contact reads: forearms and hands on the cloth, pixel-sharp shadows under the arms, soft seat shadows, and cyan rims on the heads only.
- **The monitor** shows the model's own picture of the table in glyph, with the guests as tokens and only a blinking cursor at Mas's seat. **Mas's glass** is a solid pixel goblet with a contact shadow, and the real table shows through it in pixel.
- **CLOD:** the neck ring is gone, the clipboard is gripped, and thumb dents and smears are pressed into the form under a sharper side light.

**Where it departs from §7.3.**
- **The window is a cut (p270) to an 8× lens,** not a turn of a few degrees, because the turn didn't read. At 8× his reflection is exactly the portrait's real size. It sits in the dark glass beside the monitor's picture, behind window bars, with a sheen, a faint double image and one blink. The stat bars' plate rises over him, and nothing types in it. **This needs the showrunner's look.**
- **The exit** is longer than the brief's held steps. His reflection comes apart where it is and never enters the monitor, and the guests are already point clouds when we pull back. The camera leaves his chair along the reverse of the glide as everything streams into the monitor, and the render front redraws the pixel room, landing last on Mas and his glass.

**Honest read.** The test it had to pass was contact, and it passes it. The pixel guests sit at the table: they're occluded by it, cast shadows on it and take its candlelight, and the one pixel glass among real ones reads as the room's quiet joke. The objects read as **good real-time CG under candlelight, not yet near-photoreal**: the linen and glasses hold at full frame, but nobody would take them for a photograph. So this is the prototype that most needs the resource asks below.

**Weaknesses.**
- No blind re-read yet.
- p96–112 is still dark (4.5–6.8%) as the glide passes behind his chair. It's thin but readable at 480×270, held up by the monitor.
- The zoom out of the window (p309–314) is a fast couple of frames of blur, and the stream into the monitor still leans toward "light rays".
- The near guests' lower torsos are big dark flat shapes. The hands on the table and all the forearms are generated in code, not drawn.
- The stat bars are unchanged in concept and remain the closest thing to corny in the clip.
- CLOD's eyes and smile are still clean, so it may read as good CG clay rather than a puppet.
- The temp sound is re-timed to picture but unheard, and at −20.4 LUFS it's the quietest of the four by about 4–5 LU (§11.0).

**Final route.** Blender EEVEE on the iGPU, or cloud Cycles, for the objects (asks 4, 5 and 7). Add recorded 2015-room ambience, and make a stop-motion or scanned CLOD (asks 8 and 9). **Declined:** the builder's proposed video-model pass on the guests' idles. The guests are caricatures, and twelve-lines 11 and R5 put every face and performance out of a model's reach. Their idles stay in code, or go to a human animator.

**Conflict to rule on (R17 below).** Ep12's season revision (`show/episodes/ep12/open-questions.md` #26, `outline.md`, `beats.md`, `flashbacks.md`) now holds 12.A "at dense points, short of near-photoreal", so that J5's sky is the season's one photographic world, and it leaves the ruling to this file. The prototype kept to the §7.3 brief.

### 11.4 Prototype 4 · the Tier 1 reel

**Final state.** `out/range/p4.mp4`: 720 f, 30 s, CPU. The full reel renders in about 2.5 min, the cue in about 62 s and the sound pass in about 100 s. It plays under one continuous temp cue: −16.0 LUFS, peak −1.20 dBFS, no silent gaps, a largest level jump of 3.8 dB, and the four clips within 2.8 LU of each other (4d, the Orb, is quietest by design). The band stays on screen throughout. Code is in `studio/src/dev/range/p4/`, and the render commands are in its `entry.tsx`.
- **4a P4 SPORTS · Draft Night.** On the beat at p15 it cuts in to his TV, drawn three times closer at the show's own pixel density, and at p30 to the full feed. The stands are rows of simplified heads with hard-edged out-of-focus discs for the lights and flashes (at most two a second, under 80% white). The check reads `$100M*` with `*PER MANALT`. The telestrator writes `SOUP` beside the steaming thermos, and the `POACHED` ticker follows the pick card, so the jokes land one at a time. Afterwards his eyes drop (p160), his hand goes to the phone (p165) and it buzzes (p169). He never blinks.
- **4b P5 STREAM · the chart crime.** Wide, then over his shoulder through the glass (p195), the stream (p210), and back over his shoulder (p315), all on the beat. The chart shows GTP-5 **52.8** as a tall bar beside OLD MODEL **69.1** as a short one, big enough to read at 480 wide. Only one chat line, "chart crime", names the joke. The staffer leans in and squints in profile, lit by the screen.
- **4c P3 BROADCAST · the Security Council.** The chamber's own wall monitor plays the webcast, and the cut goes to its picture. A delegate speaks into a live mic, and Mas's eyes go to the empty chair on the beat (p375). The wide is redrawn in perspective, with four distinct generic delegates. It has honest webcast texture (compression banding, broadcast-safe colour, dark lens corners) but no barrel distortion, which broke `INVITED`. In the close-up his pupils move one pixel to the chair (p495) and back (p525).
- **4d P21 IRIS · the Orb checkpoint.** NOLE is re-lit to read in the wide and makes one step up with planted feet. The rope drops and hangs, with its brass hook on the carpet. The Orb's close-up is painted at its own density with six-sided out-of-focus lights. The lens view puts face brackets and `ID: NOLE` on him, then `NOT VERIFIED` and the `…human? probably?` stamp on a solid card. It ends on the Orb's eye turning to camera on the music's resolution (p705).

**Found on the way, for other passes.**
- **A shared-engine bug:** `flipImg` in `studio/src/shared/pixel/sprite.ts` only draws where the unflipped sprite is also filled, so every mirrored figure comes out as a sliver. P4 uses a correct flip in its `cast/kit.ts`, and the shared file is untouched. `dev/framing-v3/templates.ts` and the Act Four pass's `episodes/ep01/act4/animatic/framing.ts`, `shots3.ts` and `shots4.ts` still import it and may be cut the same way (H6, H3).
- **The passes module's colour cache** made results depend on which frames had been drawn before. It's fixed in `passes/color.ts`, and the Node preview now matches the Remotion render exactly on p20 and p650.

**Honest read.** The most production-ready of the four. Each clip reads as its device from one frame (a sports broadcast, a launch stream, an institution's webcast, a scanner's lens), the band never moves, and the sound never drops. It's all code, and code is the final route. The weakest part at full size is 4c's wide.

**Weaknesses.**
- The wordless voices may still sound synthetic, most of all the council speaker, who now talks through all of 4c. Nobody has listened to them.
- The cue imports the live `audio/ost/engine`, so a re-render may not match.
- **The defocus rule:** §2.4 asks for stepped pixel blocks, but in 4a's crowd and the Orb close-up the builder used simplified shapes and out-of-focus light discs, because the blocks read as censorship. 4c's close-up and the lens view still use the blocks (R16).
- The webcast wide is readable but not premium at full size: small faces in chair frames, and an abstract placeholder on the wall panel.
- A lot of this is new art rather than approved assets: the TV cut-in, the staffer's flat-shaded profile, the four delegates, the chamber, the phone, the Orb close-up's background and the crowd.
- NOLE's walk is steppy (four drawings held three frames each) and lasts only about 8 frames.
- The rope drops with no one touching it. It should read as the Orb giving in, but a cold viewer may not see why.
- The same Orb close-up is used three times (p560, p665, p705).
- The sports feed has no texture of its own: "his TV" is carried by the cut-in, not by the picture.
- Two levels (the council PA and the webcast) were set by feel rather than by ear.
- No blind read of this version.

### 11.5 What the four taught

1. **Weighted moves beat held steps for the band.** Every cold read took the three held steps as jumps. All three leaps now slide the band with weight (P1 in one eased move with a sound, P2 over 11 frames, P3 a pixel row a frame), and P4 never moves it. §4 and §7's "three held steps" should become "the band slides out with weight and returns the same way" once the showrunner approves.
2. **Every door needs a visible cause on screen:** the dealer's card, the cursor's click, the room's own TV and wall monitor. The cuts that had only a beat under them are the ones the cold reads called unmotivated. This hardens §4.1.
3. **Contact works at native density.** Pixel sprites can sit in a lit 3D plate (P3) and in a cel plate (P1) when occlusion, shadow and light land in whole rungs on the 4-pixel grid.
4. **Resolution is a stylistic choice, not a quality setting.** P2's native render beats its 1080 render, because staying on the grid is what makes it ours.
5. **Phone size is the hard test.** The leaps hold at full frame, but what fails at 480×270 is small type and marks (J4's words, the caret, the soup drop, the Orb's bob).
6. **The same gaps remain in all four:** no blind re-read, nobody has listened, the sound depends on an engine that's being edited, and the faces need a human key pass.

### 11.6 Rulings this adds

| # | Ruling | Default until answered |
|---|---|---|
| R16 | P4's defocus: simplified shapes and hard-edged out-of-focus light discs for a crowd or a close-up's background, where stepped blocks read as censorship | Allow for those two cases; stepped blocks stay the rule everywhere else, including the lens view |
| R17 | 12.A's learned objects: resolve near-photoreal (§6.12, Prototype 3) or hold at dense points (Ep12's season revision, open question 26) | **Keep them resolving, but a clear step below J5**: objects only, walls and window stay points and glyph, final in EEVEE rather than path-traced. The contrast between perfect objects and drawn people is the thesis, and the prototype shows it working. J5 stays the season's one photographic *world*. If the showrunner prefers the critics' version, the prototype's point stage (p96–128) is already the fallback |
| R18 | P3's window as a cut to an 8× lens instead of a turn of a few degrees | Keep the cut; it's the version that reads |
| R19 | P2's pixel return at p315 and the continuous landing, instead of p330 and three held steps | Keep, per "guidelines, not hard rules" |

### 11.7 Next

- **Blind reads** of all four, with the mp4 and uncaptioned stills only. P1's sheet is ready; P2–P4 need uncaptioned versions.
- **A listening pass** on all four mixes, once the soundtrack pass has settled `audio/ost/engine`. Then re-render the cues against it.
- **The showrunner's approval gate** (§7.0), with this reel.
- **Resource asks, where they stand:** ask 1 (the `render` group) is still open. P3 ran on the iGPU because the desktop session was live. Ask 2 has been used once (one HDRI). Asks 3–9 are open, and P3 is the clip they would lift most.
