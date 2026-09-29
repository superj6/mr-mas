# MR. MAS · Style jumps

> **Superseded in part (2026-09-26).** The showrunner widened the idea: "we can have some style changes that are more like filter passes, and then rarer some that are drastic changes like high definition anime, 3d, near photorealistic, extra blocky, etc. we want to show off throughout the show the capabilities of what range we're able to do, but not in a forced manner either, only where it makes sense." The framework, budget and season map now live in [style-range.md](style-range.md), which is being written by the style-range pass. This file's jumps (J1–J6), prototypes and lessons carry over into it.
> - Per [flow-and-continuity](flow-and-continuity.md), every budget and count below ("8 jumps and 30 s a season", "0 or 1 per episode") is a **guide, not a cap**.
> - Hard media get a fully programmatic filler now, and a video model or similar for the final draft.

> **Status: WORKING RULE, 2026-09-25.** Supervising director (visual language), first version. It governs every script, board and build where the picture leaves the pixel engine at a peak. Items marked **PROPOSED** change another file or need another owner's sign-off; until they sign, write to the default given. Three prototypes are briefed in [§5](#5-the-three-prototypes).
>
> **Prototype pass, same day.** All three were built, reviewed by the critic and polished. Ranking: **J1 near lock, J6 booked as amended, J3 re-prototyped but not proven.** What the builds taught is in [§5.4](#54-lessons-from-the-prototypes); §5.1–5.3 now describe the polished builds. The review reel is `out/lookdev/jumps/jumps-reel.mp4` (internal only: it contains J3 and J6).

**The showrunner's notes (binding):**
- "in particular, i am imagining some interesting style jumps for intense moments. but it needs to be sparing and tasteful"
- Earlier, as relayed: "in general i want to consider where we can tastefully add higher quality animation in select segments with a video model output ... we will still make a first pass full programmatically."

**What doesn't change:**
- pixel art is the primary look, and BASE is the show ([style-status](style-status.md), [PIXEL_GUIDE §2](../../studio/PIXEL_GUIDE.md#2-palettes-and-the-switch-rules))
- GLYPH is for dark foreshadowing
- switches stay sparing and motivated
- nothing corny (pacing law L8)
- the thriller-drama tone ([tone-and-dialogue](tone-and-dialogue.md))
- the POV contract: limited third person, through Mas ([pov-and-framing](pov-and-framing.md))
- no announced climaxes (L9)
- no real-person likeness, and parody names only ([guardrails](guardrails.md))
- 1080p is the maximum render

**Related:** [style-status §7](style-status.md#7-style-switches-as-a-device) (the switch vocabulary) · [genai-candidates](../production/genai-candidates.md) (generative inserts, SYNTH) · [intro SCRIPT](../intro/SCRIPT.md) (THE CURVE) · [recurring-gags](../gags/recurring-gags.md) (G35) · [SEASON-NOTES](../reel/SEASON-NOTES.md)

**Contents:** [The rule in ten lines](#the-rule-in-ten-lines) · [1. What a jump is](#1-what-a-style-jump-is-and-isnt) · [2. The five motivations](#2-the-five-motivations) · [3. Rules](#3-rules) · [4. Season map](#4-season-map) · [5. The three prototypes](#5-the-three-prototypes) · [5.4 Lessons](#54-lessons-from-the-prototypes) · [6. Video models](#6-video-models-coordination-with-genvideo-and-genai-candidates) · [7. Decisions and handoffs](#7-decisions-for-the-showrunner-and-handoffs) · [8. Checklist](#8-pre-lock-checklist-for-a-jump)

---

## The rule in ten lines

1. A jump is one peak moment, 1–5 s long, re-rendered in another medium. Then the picture snaps back to the exact pixel frame it left.
2. It needs one of five reasons: **the stakes become real, Mas loses control, how it will be remembered, the machine's view, the reality intrusion.**
3. **The budget is 8 a season and 30 s in total.** An episode gets 0 or 1; only the finale gets 2. This map books **6 (≈ 17 s)**.
4. Jumps go only at the episode's peak. Never use one on a beat whose laugh works without it.
5. If a palette remap can do it, it's a switch, not a jump.
6. **Each medium means one thing, everywhere in the show.** For example, continuous tone is never used for a gag.
7. The jump comes in on the beat through its motivation's own device. It goes out faster than it came in, also on the beat. Never crossfade.
8. **Picture leaves the grid; sound leaves the chip.** A jump subtracts. No stings or whooshes, no V.O. and no real lines inside it.
9. Mas is in it or behind it. He reacts to events, never to media, and he never freezes. No real person, and no parody of one, ever appears in continuous tone or footage.
10. The jump rate follows THE CURVE: one teaching jump in the pilot, a flat middle, the knee at Ep9, and the climb to the finale.

---

## 1. What a style jump is (and isn't)

### 1.1 Definition

A **style jump** is a single moment at the peak of an episode, one to five seconds long. The picture leaves the pixel engine and the same moment is re-rendered in another medium, because the story has reached something the 480×270 grid can't honestly hold. Then the picture snaps back to the exact pixel frame it left, and the episode goes on as if the grid had never broken.

Three things make it a jump:
- **It changes the renderer, not the palette.** A switch remaps the same frame inside the engine: that's why it can cut in and out on any frame (PIXEL_GUIDE rule 5). A jump hands the frame to another engine: the tonal renderers, the anime rig's motion toolkit, a wave simulation, or footage.
- **It carries one meaning** (§2), named in the script.
- **It is an event, not a register.** Switches are grammar: the viewer learns that 1-BIT means 1993 and meets it again. A jump never repeats as-is. When a motivation comes back, it escalates.

### 1.2 Switch or jump

| | Switch ([style-status §7](style-status.md#7-style-switches-as-a-device), PIXEL_GUIDE §2) | Jump (this file) |
|---|---|---|
| What changes | The palette, or a glyph render of the same frame, inside the pixel engine | The renderer: the moment is redrawn in another medium |
| What it owns | An era, a point of view, a truth label or an explanation (1-BIT = 1993, LEDGER = money, THE PLAN, the Orb's iris, SYNTH if approved) | A meaning, at a peak (§2) |
| Length | From frames (the Orb scan: 5 f) to whole sequences (a flashback) | 24–120 f (1–5 s) |
| Repeats | Yes: it's grammar | Never the same image; the idea escalates |
| Entered by | A diegetic device: the iris, the hyperlink, the render front, a bezel | The beat itself, through its motivation's transition (§3.3) |
| Budget | At most two non-base styles per episode ([§7b](style-status.md#7b-rules-for-switching)) | 8 a season (§3.1), counted separately (PROPOSED) |
| Ep1 example | `[LEDGER, 6 frames] INVIDIA · $1,000,000,000,000` (sc 17) | The click on Cancel printing as a cancelled certificate (J1) |

Generated video converted to pixel or GLYPH is neither a switch nor a jump. It's a production method (§6).

### 1.3 What it is not

- **Not a filter.** Never "the same scene, now as anime" or "now as a woodcut". A jump never quotes a genre for its own sake: no western woodcut at HIGH NOON, no mecha sequence for THE TRANSFORMER, no manga reaction face, no named studio's or living artist's look.
- **Not decoration.** It never makes a set-piece look more expensive, props up a weak beat or dresses a scene change.
- **Not a flashback look.** Eras keep their switches (1-BIT, EARLY-WEB16, LEDGER, the Orb's iris). A jump happens in the present tense of its scene.
- **Not a punchline.** It never lands on a joke. A laugh may follow the snap back; it never rides the jump.
- **Not realism for people.** No real person, and no parody of one, is ever rendered in continuous tone or footage (§3.6).
- **Not a glitch.** No datamosh, chromatic split, VHS roll, scanline wobble, lens flare or "corrupted file." That's the corn L8 bans.
- **Not a sound event.** Nothing whooshes, rises, reverses or stings into or out of it.
- **Not an edit fix.** A jump is written into the script at the draft stage. Nobody adds one in the animatic or the edit to rescue a beat.
- **Not a promo asset** (§3.6).

---

## 2. The five motivations

Each motivation is a meaning. Each has an owner, which is the [POV layer](pov-and-framing.md#12-four-layers-one-order-of-precedence) whose truth it shows, plus "the world" for staging everyone in frame can see. Each reserves its media, has its own way in and out, and has a ladder across the season.

| | Motivation | In one line | Owner | Media (reserved) | In → out | Sound | Season |
|---|---|---|---|---|---|---|---|
| **M1** | **The stakes become real** | The curve reaches the picture | The world | Continuous tone (tonal `soft`, `paint`); at the top rung, footage | Crack → seal (J5: refine → hold) | Real, full-band air (J5: the chip reformats) | J3, J5 |
| **M2** | **Mas loses control** | His composure is the grid | HIM (the to-no-one version) | Fluid, sub-pixel motion on the water in his glass | The event as the front → settle | Silence | J6 only |
| **M3** | **How it will be remembered** | The record prints | THE RECORD | Engraving, halftone, hedcut stipple; pastel as an alternate | Flash-print → snap | Silence, or one medium-true sound | J1, J2 |
| **M4** | **The machine's view** | The model looks back | THE MACHINE | Full-frame GLYPH | Hard cut on a sound → hard cut | The GLYPH family, ≤ 2 s | J4 only |
| **M5** | **The reality intrusion** | Something we didn't draw | THE MACHINE's output, entering the world | Footage, unconverted | Refine → hold (J5) | The chip reformats with the picture | J5 (shared with M1) |

### M1 · The stakes become real: "the curve reaches the picture"

- **Meaning.** The intro's thesis is *everything scales*. The palette climbs from 1-bit to sixteen colours to the full pixel set as the curve rises. In the episodes, fidelity scales with stakes: when a stake stops being abstract, the world shows the next tier behind the pixels. First comes continuous tone, and at the end, footage.
- **Where it lives.** On G35, *sudden unity cracks the sky*, which the gag file calls "always the scariest shot in the episode."
- **Owner.** The world. Everyone in frame can see the event (the crack). Nobody, Mas included, sees the medium.
- **Media (reserved).** Tonal `soft` / `paint` / `softenv` continuous tone appears nowhere else in the show. Footage is kept for the last rung.
- **In and out.** In through **the crack**: the render front's `tear` mode, driven along a jagged path. Out through **the seal**: the same front in reverse, in 2–4 held steps, leaving a 1-px pixel scar where it opened widest. The last rung has no out (J5).
- **The crack is a fracture, not a line** (learned in J3, §5.4). It nucleates on a surface and branches; its runs are angular; it passes behind whatever stands in front of the picture plane (Mas, the Orb). It never floats as a lone line in open sky above the skyline: in this show that is a line chart over a bar chart.
- **The ladder.**

| Rung | Ep | Beat | What shows through | Jump? |
|---|---|---|---|---|
| 0 | 1 | KA-CHING #1 (sc 17): the hairline across the sky, and the crack in his glass | Nothing: a pixel line. The pilot teaches that the sky *can* crack | **No.** It's the setup |
| ½ | 5, 6 | The hairlines at 99–1 and at the superintelligence statement | A pixel line | No (A1 is an optional 12-frame glimpse) |
| 1 | 9 | "Mario is right.": the sky cracks open | Continuous tone pours through the picture | **J3** |
| (2) | 11 | The loss curve tips past vertical | The frame rate breaks | Held (A3) |
| 3 | 12 | Everyone agrees; the sky quietly reformats | Footage. No crack, no way back | **J5** |

- **Never:** a crack that lies flat and horizontal under a held tone, which reads as a flatline (X3); a crack shaped like a price chart (one line with a trend); a crack through a face, or aimed at one; any glimpse of the layer behind before Ep5.

### M2 · Mas loses control: "his composure is the grid"

- **Meaning.** Every pixel rule is Mas's composure turned into a medium: whole-pixel motion, held drawings, nothing rotates, nothing blurs, and the water line is one flat row. The grid breaks only when he does, and this season he breaks once.
- **Owner.** HIM, the *to no one* version ([POV §1.3](pov-and-framing.md#13-the-four-versions-of-mas)): the truest one, never spoken.
- **Medium.** Fluid, sub-pixel, continuous motion on the one object that has stood for his composure all season: the water in his glass. It is built in code (the wave-equation ripple [genai-candidates §2.3](../production/genai-candidates.md#23-better-in-code) asks for) and never generated.
- **In and out.** **The event is the front:** the ring's leading edge carries the new medium outward. Out: it settles, then snaps back.
- **The ladder.** Ep7's bead (a pixel tell, not a jump) → Ep10's "Huh." (a capital letter, not a jump) → Ep12's ring (**J6**, the only M2 jump).
- **Rules.**
  - It goes on invented beats only. Feelings never attach to real events ([POV §3.7](pov-and-framing.md#37-guardrails-on-the-inner-life)).
  - It never touches his face ("a face that breaks" is on the never list), never his hands, and never uses breath or a heartbeat.
  - It happens once a season. It renders a reserved tell ([POV §3.6](pov-and-framing.md#36-reserved-tells-never-spent-early)); it doesn't add a new one.

### M3 · How it will be remembered: "the record prints"

- **Meaning.** At a peak that will outlive the week, the moment freezes into the medium that will carry its memory: a certificate, a wire photo, a courtroom sketch, a class photo.
- **Owner.** THE RECORD. It's true to its tag: it shows what happened, carries no claim beyond that, and has no opinion.
- **Media.**
  - Tonal `engrave`: banknote and certificate intaglio. LEDGER stays the pixel money switch; true engraving is kept for M3.
  - Halftone: the `noir` dot screen on newsprint, or `stipple` for a hedcut portrait.
  - Pastel sketch: alternate only.
- **In and out.** In on **the flash-print**: the freeze's 2-frame pop, then the new medium, whole. Out: **a snap**, on the grid.
- **Rules.**
  - **Show the medium, not a document.** No masthead, caption, byline, date, real publication's typography or real logo. The only text is the medium's own marks (a serial, a perforation, a name already on screen). Facts stay on the rail.
  - It never dresses a real quote card. The record's cards stay plain, because "the record plays dry" ([tone §9.2](tone-and-dialogue.md#92-principles)).
  - Its subject is never a politician (§3.6). No propaganda-poster idiom: that look asserts intent and belongs to one side.
  - **Mas never freezes.** When the world prints, Mas keeps one live motion (J1: his pupils step one line; J2: his third arm keeps signing outside the photo).

### M4 · The machine's view: "the model looks back"

- **Meaning.** Masked GLYPH (the Orb's cone, the cursor window, tokens in a reflection) is the everyday foreshadowing switch. A **full-frame** GLYPH takeover is the machine's view itself: for a moment, we see the scene as the model reads it.
- **Owner.** THE MACHINE. Mas never sees GLYPH ([POV §1.4](pov-and-framing.md#14-who-knows-what)).
- **Medium.** Full-frame GLYPH: the engine's glyph pass over the whole frame, with the house bloom and tint.
- **In and out.** A hard cut on a diegetic sound, in and out.
- **Rules.**
  - It happens once a season (J4, Ep10), and never before Ep9.
  - Nothing in it has to be read: shapes carry it.
  - It shows only what the machine sees now, never what will happen (L9).
  - Machine-POV sequences stay switches (the /tmp city, the Researcher's context window, F12.1).

### M5 · The reality intrusion: "something we didn't draw"

- **Meaning.** Footage presses into the pixel world: fluid, true to the lens, unpixelated. In this show, the realest-looking thing on screen is made by a machine, and that is the point.
- **Its everyday form is a switch.** [genai-candidates](../production/genai-candidates.md#12-four-treatments) proposes **SYNTH** (NEEDS SIGN-OFF): machine-made video that stays inside a diegetic bezel (a screen, a projector, an exhibit frame) and becomes ours if it leaves. It's used for AROS's mammoth (Ep2) and the Rashomon exhibits (Ep8). That's the right call. Machine video inside a screen is a register that says what it is.
- **The jump form** is the bezel failing: machine footage in the world's own place. It happens once, as the season's last image of scale: **J5**, when the sky in THE WOODROSE's windows reformats.
- **Owner.** THE MACHINE's output, entering the world.
- **Rules.**
  - The footage shows objects, animals, weather, water, sky or land only. Never a person, face, hand, readable text, logo or real product UI.
  - It's composited *inside* the pixel frame behind a matte stepped on the native grid, so the pixel world keeps its edges. Never cut away to "real footage."
  - It's generated fresh from a written prompt and never recreates a real demo clip. It passes genai-candidates' gate ([§1.5](../production/genai-candidates.md#15-the-gate-every-insert-every-take)).

### 2.6 Where the ladders meet

**J5 is M1 by motivation and M5 by medium.** That's the one planned exception to "one motivation per jump."
- The stakes ladder climbs toward "realer."
- The intrusion thread has shown since Ep2 that the realest pictures on screen are the machine's.
- When the sky reformats in Ep12, the world reaches its highest fidelity yet, and that fidelity is the machine's render.

That's the season's thesis in one image, and nobody says it.

### 2.7 The style library: every asset and its one job

| Asset | Where | Job here | Never |
|---|---|---|---|
| Pixel switches: BASE, ONEBIT, EARLYWEB16, LEDGER, TERMINAL, 2TONE_FREEZE, family steps, masked GLYPH | `studio/src/shared/pixel/**`, PIXEL_GUIDE §2 | Switches, not jumps. The home every jump returns to | — |
| Full-frame GLYPH | `pixel/glyph.ts`; tonal `glyph` | M4, once (J4) | Masked uses stay switches |
| Tonal `engrave` (banknote) | `studio/src/shared/tonal/**`; `out/lookdev/looks/render/hero-engrave.png` | M3 (J1) | Money flashbacks (LEDGER keeps them); gags |
| Tonal `noir` halftone, `stipple` hedcut | same; `hero-noir.png`, `hero-stipple.png` | M3 (J2; stipple for any portrait) | A real paper's look |
| Tonal `riso` | same | Held; no booked use | Political posters |
| Tonal `soft`, `paint`, `softenv` | same; `out/lookdev/looks/env/env-set-softenv.png` | M1 (J3, J5's fallback) and M2 (J6's grade): continuous tone | Any gag anywhere (so Ep4's image-craze repaint stays pixel, §4); any person, Mas included |
| Tonal `dither`, `pixel` | same | None (1-bit is the 1993 switch) | — |
| Anime rig: **the look** | `studio/src/shared/anime/**`, `out/lookdev/looks/anime/` | **Held.** Not a jump target. Its faces emote, and "a face that breaks" is on Mas's never list. As a look it reads as a genre quote | — |
| Anime rig: **the motion toolkit** | `anime/scene/fx.tsx` (`SpeedStreaks`), `Scene.tsx` (the smear filter), `props.tsx` (`WaterGlass` `ripple`) | The motion rung (A3, held); the smear transition; J6's ripple reference | `FocusLines`, `Kira` or impact frames as emphasis: anime shorthand is corn here |
| Paper puppet | `studio/src/styleframes/puppet*`, `out/lookdev/structures/puppet/` | M3 alternate A4 (the humans as cut-outs in the last class photo) | — |
| Satire latex puppet | `styleframes/satire*` | None | Ever: caricature pushed toward likeness |
| Graphic shape | `styleframes/shape*` | None: a title-design look that reads as decoration here | — |
| Screenlife | `styleframes/screen*` | None: `[POV]` screens already do this in pixel | — |
| THE CURVE (the intro's concept) | [intro SCRIPT](../intro/SCRIPT.md) | M1's logic and the season's jump rate (§4.3) | — |
| genvideo converters; genai treatments CONVERT, REF and GLYPH source | `studio/tools/genvideo/`; [genai-candidates §1.2](../production/genai-candidates.md#12-four-treatments) | Production methods, not jumps (§6) | People |
| SYNTH (PROPOSED switch) | genai-candidates §1.2 | M5's everyday form, bezel-bound | Full frame; people |

---

## 3. Rules

### 3.1 Budget

| | Limit | This map |
|---|---|---|
| **Season** | **8 jumps and 30 s (720 f)** in total, not counting J5's PROPOSED hold. The brief allowed about one an episode (12); the showrunner's word is *sparing* | **6 booked, 405 f ≈ 16.9 s.** The other two are reserve for what the scripts discover, not a quota |
| **Episode** | 0 or 1. Two only in the finale, and in different acts. No episode is owed one | Ep12: J5 (the Act Two out) and J6 (the button) |
| **Length** | 24–120 f (1–5 s), in whole beats (15 f) on the 96 BPM grid. 30–60 f is the norm | 45–120 f |
| **Spacing** | At least 2 bars (120 f) from any switch, THE PLAN, a name card, a flashback door, a real quote card, a real line or V.O. Never two in one act | Checked per jump in §4.1 |
| **Never in** | The intro, the filename card (no disclaimer card since 2026-09-27), the end credits, recaps, previews, promos or thumbnails | — |
| **Per motivation** | M1 ≤ 3 · M2 once · M3 ≤ 3 · M4 once · M5 once as a jump | M1: J3, J5 · M2: J6 · M3: J1, J2 · M4: J4 · M5: J5 (shared) |

**Switch budget (PROPOSED, style-status owner):** jumps don't count toward [§7b](style-status.md#7b-rules-for-switching)'s "two non-base styles per episode," because they run under 5 s and set up no register. In exchange, an episode with a jump puts no switch within 2 bars of it. Until the owner signs, count each jump as one of the two.

### 3.2 Triggers: the six tests

All six must pass in the script before a jump is boarded.

1. **Peak.** The beat is the episode's A-plot peak, a movement cliff, an act-out or a G35 rung, and it's marked T on the engagement map ([pacing §13](../format/pacing-model.md)).
2. **The joke test.** Board the beat without the jump. If the laugh still lands, the jump was decoration: cut it. Jumps sit on dread, stakes or silence.
3. **The switch test.** If a palette remap, a masked glyph, a freeze or a SYNTH bezel can carry it, it's a switch.
4. **The one-frame test.** The first full frame tells a cold viewer why the world changed (a certificate; the sky opening; the machine's eyes) before any sound or text.
5. **The escalation test.** It tops, or clearly differs from, the last jump with the same motivation. A repeat gets cut.
6. **The truth test.** It passes §3.6: no claim beyond the tag, no real person in continuous tone or footage, no causation between real events, no politician as the subject, and no feeling at a real event.

**Then the animatic test:** cut the animatic both ways. If the version without the jump plays as well, cut the jump.

### 3.3 In and out

| Transition | Direction | Motivation | How it works | Source |
|---|---|---|---|---|
| **Flash-print** | In | M3 | The freeze's 2-frame pop (a family step of k 2, at most 80% white), then the new medium, whole, on the 3rd frame | PIXEL_GUIDE §2 rule 7; `freeze.ts` |
| **Crack** | In | M1 | `renderFront(..., {tear})` driven along a jagged mask path instead of a straight sweep. The pixel side steps in whole pixels; the far side is continuous | `transitions.ts`, `mask.ts` |
| **Hard cut on a sound** | In and out | M4, M5 | The first frame of the jump is the frame of a diegetic transient (a click, a thud, a card snap), on the beat | — |
| **Smear** | In and out | The motion rung only (A3) | 1–2 smear frames with speed streaks carry the frame off the grid. The whip streak is its cousin inside the grid | Anime `scene/fx.tsx`, `Scene.tsx` |
| **The event as the front** | In | M2 | The ring's leading edge is the boundary between the two media. It travels at constant speed (an eased-out front is a UI touch ripple) | New (J6) |
| **Refine** | In | J5 only (the last rung) | The masked region steps up its resolution, one held step per beat: the 4×4 pixel grid, then 2×2, then 1×1 (still palette-bound), then unquantized. No crack, no seam, no sound cue | New (J5) |
| **Snap** | Out (the default) | All | A hard cut on the beat back to the exact pixel frame the jump left | — |
| **Seal** | Out | M1 | The crack closes in 2–4 held steps; a 1-px pixel scar stays for the rest of the scene, only where it opened widest (the thin runs heal clean) | `transitions.ts`, reversed |
| **Settle** | Out | M2 | The event finishes (the ring reaches the rim and calms), then snaps | — |
| **Hold** | (no out) | J5 only | The refined region stays. Until decision 5 (§7) is signed, it steps back down its four steps after 2 bars instead | — |

- **Out is always faster than in.** Both ends land on the grid.
- **The art isn't redrawn.** A jump returns to the pixel frame it left, or to that frame's next held drawing.
- **One scar at most.** A jump may leave one pixel-drawn trace on one object (J1's punched row across the tile's hoodie, J3's mark on the wall). Never more, never a label, and never a trace that spans the frame.
- **The UI never jumps.** The rail, truth labels, subtitles and portrait windows stay pixel, on top and in place.
- **Banned:** crossfades, dissolves, white-outs, wipes, zooms, glitch transitions, and anything that eases between two media.
- **Photosensitivity** follows the intro ([SCRIPT §3.0](../intro/SCRIPT.md#30-rules-in-force-for-every-scene), rule 7): at most 3 flashes in any 24 f, and every pop at 80% white or less. A bright medium entering from a dark frame (cream paper after a night call) is graded to 75% luminance or less with falloff toward the edges, so it reads as print, not as a flash.

### 3.4 Sound and music

**Picture leaves the grid; sound leaves the chip.** On the jump's first frame, the chip layer and the pixel room's SFX stop. They come back on the snap frame, in time: the rack LEDs' tick resumes in phase, as if the grid had kept counting.

- **The score.** A jump gets no stinger. The running cue stops dead on the downbeat where the jump starts (tone changes on the downbeat, [tone §9.2](tone-and-dialogue.md#92-principles) rule 5). If the moment is already silent (J1 sits inside D6), the silence holds. The next cue may enter on the downbeat where the jump ends, never inside it. A jump never raises the level: its effect is subtraction.
- **By motivation:**

| | Inside the jump |
|---|---|
| M1 | The medium's own acoustic: real, full-bandwidth outdoor air or room reverb, wide and quiet, from a recording (never a synth pad). It arrives at full level on the cut, about 10 dB under the room it replaces: no entry steps, no rise. On the seal it band-limits back down. No held tone under a crack (X3 flatline). Micro-sounds for the crack: one per event (a corner it turns), never one per frame |
| M2 | Silence. Not even water |
| M3 | Silence, or one sound true to the medium (a press shutter). Nothing inside D6 |
| M4 | The GLYPH family, 2 s at most ([tone §9.3](tone-and-dialogue.md#93-the-tone-palette-the-tracks): glass shimmer, sub, detuned chip, the knee reversed), or silence |
| M5 / J5 | The sound reformats with the picture: the chip lead's timbre steps up with each refinement step, so quietly nobody notices (THE COPY family's endgame) |

- **Voice.** No dialogue, V.O. or real line inside a jump. V.O. keeps a bar clear on either side ([POV §5.5](pov-and-framing.md#55-where-vo-is-forbidden)).
- **Never** a heartbeat, breath or ringing (X3), and never a whoosh, riser, reversed cymbal, glitch stutter or meme sound (L8).

### 3.5 POV

- **Every jump has an owner layer** (§2): the world, HIM, THE RECORD or THE MACHINE. The owner decides what the jump may show:
  - the record, only what happened
  - the machine, only what it can see now
  - Mas, only what he'd never say
- **Mas is in it or behind it:** in frame, or it's his screen, window, phone or glass. A jump doesn't count as an exit ([POV §6](pov-and-framing.md#6-leaving-his-pov)). It never shows what he couldn't know, except that M4 shows the machine's reading of the present.
- **He reacts to events, never to media.** He can look up at a crack; he never notices an engraving or tokens. No V.O., line or tell ever refers to a jump.
- **Mas never freezes** in any medium (intro rule 1). Inside a print, he keeps one live motion.
- **Land on a face.** Within 10 s of the snap (L2), the shot is on Mas's face, his object or the Orb.
- **Mas appears only in graphic media** (engrave, halftone, glyph, pixel), where he stays recognizable. He never appears in continuous tone or footage.
- **No announced climax.** A jump shows its own moment and hints at nothing beyond its episode (L9). The M1 cracks before Ep9 stay pixel hints.

### 3.6 Guardrails

When a jump and a guardrail disagree, the guardrail wins and the jump goes.

- **Likeness.** No real person, and no parody of one, is ever rendered in continuous tone (`soft`, `paint`) or footage. Generated footage contains no people, faces or hands (genai-candidates NO-GO).
- **Names and marks.** Parody names only. No real logos, UI, mastheads or typography; call and phone UIs stay generic ([guardrails §5](guardrails.md#5-legal-hygiene)).
- **Facts.** A jump carries no quote, number or fact card. The rail carries them, unchanged, on top.
- **Causation.** A jump amplifies. Never spend one where amplification would assert a link between real events that the record doesn't hold. Example: Ep3's coin slot ([SEASON-NOTES](../reel/SEASON-NOTES.md), note 2).
- **Politics.** No jump centres a real politician or party. Officials may be in frame, but never as the subject (fairness rules [2a.3–4](guardrails.md#2a-the-rules)).
- **Inner life.** Feelings ride invented beats only. No breaking face, trembling hands, sweat (beyond Ep7's pixel bead), breath, heartbeat or panic imagery (X3; POV §3.6–3.7).
- **Harm.** X4–X8 hold in every medium. There's no violence, and war stays paperwork only (J2's third arms carry paper).
- **Imitation.** No named living artist's or studio's look.
- **Spoilers.** A jump's frames never appear in the intro, recaps, previews, reels shown outside the room, thumbnails or promos before its episode airs.
- **Render.** 1920×1080 at most. Never 4K, and never `--scale` above 1 for deliverables (PIXEL_GUIDE).

### 3.7 Build and render

- **Layers.**
  - The pixel layer stays 4× nearest-neighbour.
  - Continuous-tone and footage layers are authored or generated at 1920×1080 native, never upscaled from 480×270.
  - Where the media meet, the matte is stepped on the native grid (4×4 blocks), so the seam belongs to the pixel world.
- **Grade.** Every non-pixel layer is graded to the scene's key light (monitor cyan, tungsten, Strip neon, candle-LED), so the jump reads as the same world in another medium.
- **Determinism.** Hash seeds only: no `Math.random`, no `Date` (PIXEL_GUIDE §1). Footage plates are frozen files with provenance (§6).
- **Code.**
  - Prototypes live in `studio/src/dev/jumps/proto{1,2,3}/` (one dev entry each; compositions registered in `studio/src/styleframes/jumps/`), and render to `out/lookdev/jumps/`. Each has `tools/build.sh` (picture, temp sound, mux, stills, sheet); `studio/src/dev/jumps/tools/reel.sh` builds the review reel. *(The brief's `dev/stylejumps/` path was never used.)*
  - Anything the prototypes add to `src/shared/pixel` stays additive ([PIXEL_GUIDE §7](../../studio/PIXEL_GUIDE.md#7-compatibility-and-ownership)).
  - **PROPOSED for the engine owner:** a `SwitchSpec` of `{type: 'jump', layer, mask, t0, frames}` that composites a non-pixel layer under the `after` UI.

### 3.8 Script notation and the ledger

The jump goes in the scene heading, `[BASE · JUMP J1]`, and gets one line in the body where it lands:

```
JUMP J1 · M3 RECORD · ENGRAVE · 45 f · in: flash-print on the click · out: snap on beat 4 · sound: none (inside D6)
```

Ids are season-wide and assigned by this file. THE EDITOR logs each jump in the episode's POV ledger ([POV §8.3](pov-and-framing.md#83-the-pov-ledger-one-per-episode-filled-in-by-the-editor)): the id, the frames, the six tests, and the animatic cut both ways.

---

## 4. Season map

Sources: the Ep1–3 teleplays, the Ep4–12 beat sheets, [SEASON-NOTES](../reel/SEASON-NOTES.md), [recurring-gags](../gags/recurring-gags.md) (G35, the ring, the bead) and [genai-candidates](../production/genai-candidates.md). Clocks are story clocks where a script or the reel gives one. **Code** means programmatic now; **video** means a generated plate later.

### 4.1 The candidates

| Id | Ep · beat (clock) | The moment | Motivation | Target medium | Source | Frames (s) | Status |
|---|---|---|---|---|---|---|---|
| **J1** | 1 · Act Four sc 26, shot 26.05 (13:41) | The board's arrow clicks Cancel. In the drop-out's silence his call tile prints as an engraved certificate, `CANCELLED` punches through it, and it snaps back to fall out of the grid | M3 | Engraving on the call grid's geometry | Code | 45 (1.9) | **BOOKED · PROTOTYPE A: near lock** (polished, §5.1). Replaces the tile's GLYPH dissolve (PROPOSED). Spacing: THE PLAN ends 480 f before and NELEH's card 360 f before; the candor card is 435 f after |
| **J2** | 7 · Act Two #17, THE HUG (≈ 15:30) | In the bullet time, a press flash. Inside a photo crop the two men hug, printed as a halftone. Outside the crop, in pixel, the third arms keep signing and depositing | M3 | Halftone in a crop mask; pixel outside | Code (halftone the pixel frame; the tonal rigs are an upgrade) | 60 (2.5) | **BOOKED** |
| **J3** | 9 · Act Two #23, sudden unity: "Mario is right." (≈ 11:10) | In the dark room, the crack runs across the window toward him and opens. The continuous-tone night pours through, then it seals to a hairline | M1 rung 1 | Continuous tone behind a pixel crack | Code (genai §2.3: sky cracks are engine) | 75 (3.1) | **BOOKED, NOT PROVEN · PROTOTYPE B re-built** (§5.2). Blocker for the Ep9 build: an up / over-the-shoulder head for Mas (cast owner). Fallback in §5.2 |
| **J4** | 10 · Act Two #19, the Intern is dealing (move it to 70–75%, SEASON-NOTES note 8) | Mas has read every tell but one. The card snaps down and we see the table as the dealer does: each player's tell rises as a column of tokens. Two blanks: Mas, and the dealer's own hands | M4 | Full-frame GLYPH | Code (needs the Vegas table set) | 45 (1.9) | **BOOKED** |
| **J5** | 12 · Act Two #12, everyone agrees (the act-out, ≈ 13:01) | No crack. The sky in THE WOODROSE's windows refines, one step per beat, from the 4×4 pixel grid to 2×2 to 1×1 to footage. Nobody at the table looks up; only the Orb's iris moves | M1 rung 3 (M5 medium) | Generated sky footage, unconverted, in the window mask | Video (fallback: code, tonal `soft`) | 120 (5.0), PROPOSED hold | **BOOKED.** The hold for the rest of the dinner needs sign-off (§7) |
| **J6** | 12 · Button #17, `define "win."` | One ring spreads across his water, the first all season. Inside the ring the water is continuous and fluid. It reaches the rim, settles, and snaps back to one flat row | M2 | Continuous tone plus a wave-equation ripple | Code only (genai NO-GO for models) | 60 (2.5) | **BOOKED as amended · PROTOTYPE C** (§5.3): unquantized (decision 8), constant-speed front, a ~100 px disc of clear water |
| A1 | 5 · #17 and 6 · #17, the G35 hairlines | A 12-frame glimpse: one pixel of continuous tone inside the pixel crack, and nothing else | M1 rung ½ | Continuous tone, 1 px | Code | 12 each (both together count as one jump) | Alternate. Promote if the season animatic shows the device forgotten between Ep1 and Ep7 |
| A2 | 8 · #19, the verdict (≈ 14:15) | The one human-drawn record in an episode of machine renders: the verdict as a courtroom pastel | M3 | Pastel (a new renderer, not `soft`/`paint`) | Code | 45 (1.9) | Alternate. Held while F8.1's Rashomon renders run; promote if F8.1 falls under 45 s |
| A3 | 11 · #3, the loss curve tips past vertical (watched on his monitor, per SEASON-NOTES note 5) | Our camera in the dark room tips with the curve on 1s, with two smear frames and speed streaks, in continuous tone for the rotation, and lands back in pixel | M1 rung 2 (motion) | Continuous tone plus the anime motion toolkit | Code | 30 (1.25) | Alternate. genai E11-1 gives the cliff to the machine's POV inside the monitor, and a jump can't sit within 2 bars of that switch. Promote only if the cliff is restaged in his room without it |
| A4 | 12 · #14, the final class photo | A photograph in which the humans are paper cut-outs and only the monitor is in true focus | M3 | Paper puppet plus a focus pull | Code | 60 (2.5) | Alternate. It swaps in for J5 if the reformat is cut; the finale never plays three |
| — | 1 · sc 17, KA-CHING #1's crack (9:33–10:13) | The hairline across the sky, and its reflection in his glass | M1 rung 0 | Pixel | — | — | **Not a jump, by design.** Showing what's behind the sky in the pilot spends the season's scariest image on its setup. It stays a pixel line, the bell's decay and silence, as scripted |
| — | 2 · cold open, AROS's mammoth | Machine video on the lobby screen that steps out and becomes ours | (M5's everyday form) | SYNTH switch, then pixel | Video, under genai E2-1 | — | **Not a jump:** it's genai-candidates' SYNTH switch (NEEDS SIGN-OFF). Bezel-bound machine video tells you what it is |
| — | 4 · #21, OUR GPUS ARE MELTING | The image craze repaints the cathedral | — | A pixel palette set (a pastel wash) or genai E4-3's CONVERT melt | — | — | **Not a jump.** A diegetic filter is a filter gag by definition. Continuous tone is never a joke, and no studio's watercolour look |
| — | 11 · #19, "it thinks i'm part of it." | The lasers slide off him | — | Pixel | — | — | **Not a jump.** The line lands on its own (the joke test), and M4 is spent in Ep10 |

**Declined outright:**
- **Ep3 #24, the podium turns.** A jump would amplify the coin-slot-to-turn causation that SEASON-NOTES already cut (note 2), and it would spend the heightened register on a politician (fairness 2a.3–4). The podium's reveal grammar carries the beat.
- **Ep12 #1, NOLE through the ceiling on a booster (the brief's anime-smear suggestion).** It's a running arrival gag (he comes through the ceiling in Ep11 too) in a cold open, so it fails the peak and joke tests. The anime look as a destination reads as a filter. The anime motion toolkit is kept for A3.
- **Ep6 #18, CAMEO CITY.** A high-fidelity or generated Mas drifts toward a real likeness. Never.
- **Ep6 #11, THE TRANSFORMER, and Ep4 #14, HIGH NOON.** A genre quote (mecha, western) on a genre gag is exactly the filter the rules ban.

### 4.2 Budget check

| Motivation | Jumps | Frames | Seconds |
|---|---|---|---|
| M1 | J3, J5 | 195 | 8.1 |
| M2 | J6 | 60 | 2.5 |
| M3 | J1, J2 | 105 | 4.4 |
| M4 | J4 | 45 | 1.9 |
| **Total** | **6 of 8** | **405 of 720** | **16.9 of 30** |

- **Code now:** J1, J2, J3, J4, J6.
- **Video later:** J5 only, with a code fallback.
- **One opening in the pilot:** Ep1 carries J1 alone. Its GLYPH count drops from two uses to one, because J1 replaces the dissolve.

### 4.3 The shape

```
Ep      1   2   3   4   5   6   7   8   9  10  11  12
jumps   1   ·   ·   ·   ·   ·   1   ·   1   1   ·   2
```

This is THE CURVE.
- **The start.** The pilot teaches one grammar (the record).
- **The flat middle.** Ep2's SYNTH window and Ep8's Rashomon exhibits keep "another medium" in view as switches, and Ep7 brings the record back.
- **The knee and the climb.** The knee comes at Ep9, and the jumps climb to the finale.
- **Why the flat stretch.** Eps 2–6 carry no jump, and Eps 3–6 are the show's longest run of pure pixel. That's on purpose, so the device comes back as a return, not a habit. If the season animatic shows it forgotten by Ep7, promote A1.

---

## 5. The three prototypes

### 5.0 Why these three

- **They cover three motivations** (the record, the stakes, Mas), with three mechanics (a print, a crack, an event as the front) and three sound behaviours (silence inside D6, full-band air, true silence).
- **All three build in code from assets that exist:**
  - Ep1's call grid, cast and dark-room plate (`studio/src/shared/pixel/{kits,cast,rooms}/**`)
  - the tonal renderers and the dark-room environment (`studio/src/shared/tonal/**`)
  - the anime rig's ripple and sky plate for reference (`studio/src/shared/anime/**`)

  None waits for genai-candidates' bake-off. genai §2.3 already assigns sky cracks and the ring to code.
- **They test the hardest question the rules raise:** can pixel and a non-pixel medium share the screen without reading as a filter? A swaps the whole frame, B shares the frame through a tear in its sky, and C shares one object.
- **Changes from the suggested list:**
  - **(a) is kept**, but `CANCELLED` is perforated instead of `VOID` stamped. It rhymes with the Cancel button, the season's spine, and keeps `VOID IF CEO MISSING` fresh for sc 29. The perforation also replaces the tile's GLYPH dissolve, so the firing gets one image, not two.
  - **(b) moves from Ep1's crack to Ep9's.** Ep1's is rung 0 and stays pixel; Ep9's is where the ladder first opens. It's built in the dark room, which exists in both pixel and tonal.
  - **(c) swaps the booster for the ring** (reasons in §4.1).

**Shared build spec:**
- 1920×1080, 24 fps, **120 frames (5.0 s) per clip**, including pre-roll. `p` is the prototype frame.
- Entries (as built): `studio/src/dev/jumps/proto{1,2,3}/entry.tsx`, using the `makeRoot` pattern. Compositions: `jump-proto-1` (+ `-steppop`), `jump-proto-2` (+ `-sheet`), `jump-proto-3` (+ `-quantized`).
- Build (picture, temp sound, mux, stills, sheet), then the reel, from `studio/`:
  ```
  bash src/dev/jumps/proto1/tools/build.sh      # likewise proto2, proto3
  bash src/dev/jumps/tools/reel.sh               # out/lookdev/jumps/jumps-reel.mp4
  ```
  Deliverables never take `--scale`; previews may use `--scale=0.5`.
- **Deliver per prototype:**
  - the mp4, with a temp sound pass to the brief
  - a contact sheet of the listed key frames
  - for A, a context cut from 26.04b to 26.05a, taken from the Act Four animatic
- **Review.** The showrunner watches each clip twice, cold and then in context. It passes if the cold viewing reads the meaning from one frame and nobody says "effect" or "filter."

### 5.1 Prototype A · J1 · "CANCELLED" (Ep1, sc 26, shots 26.04c–26.05)

| | |
|---|---|
| **Motivation** | M3, how it will be remembered |
| **Owner** | THE RECORD |
| **Medium** | Banknote and certificate engraving (tonal `engrave`), one ink |
| **Clip** | 120 f = act frames 1620–1739 (13:38:12–13:43:12): 26.04c, the arrow's bar and the click, then 26.05, the jump, the snap and the fall |
| **Jump** | 45 f, p60–104 (act 1680–1724), 3 beats |
| **In / out** | Flash-print on the click / snap on 26.05's 4th beat |
| **Sound** | The click, then D6's digital silence through the whole jump |
| **Lock impact** | None. 26.05 stays 60 f, and D6 (1680–1830) is unchanged ([timing-v2](../episodes/ep01/production/act4/timing-v2.md)) |
| **Source frames** | Frozen at lock v2 (`proto1/lockv2.ts`, the v2 composer's `native()` verbatim). THE EDITOR has since moved Act Four to lock v3, which renumbers sc 26 (the click is now 26.06b) and still carries the GLYPH dissolve; re-targeting J1 onto v3 is a handoff, not part of this prototype. **One deliberate difference from lock v2** (final polish): in p0–60 ALYI's name chip is not drawn where the dialog cuts it (the cut left a stray `'I` that a blind cold read called "leftover text"); the same fragment shows in the act, so it goes to THE EDITOR with the re-target |

**The idea.** Nothing in the pilot is bigger than this click. The board cancels a man who owns nothing, and the record prints it. For three beats his tile is an engraved certificate with a blank shares line, and `CANCELLED` is punched through it the way real cancelled certificates are. It rhymes with the 1993 dialog, whose Cancel was greyed out, and with THE PLAN's blank step 4. Then it's a call tile again, falling out of the grid. The firing is the humans' act, so the record takes it, not the machine's tokens.

**Frames:**

| p (act f) | Beat | Picture | Sound |
|---|---|---|---|
| 0–59 (1620–1679) | 26.04c | `[POV]` pixel, as locked (less ALYI's cut chip, above): the unlit arrow on Cancel, waiting out the bar | The laptop fan, the Strip, the crane truck below |
| 60 (1680) | 26.05, beat 1 | Cancel's pressed drawing, in pixel, for one frame | ***Click.*** Then D6: everything stops, true digital zero |
| 61–62 | | **In: flash-print, as a press flash.** The room area is one flat paper tone (P1, 78% white) for two frames: the record taking its picture. No image, no dither. The rail stays, as it does over the certificate | Silence |
| 63–74 | | **The certificate**, whole (layout below) | Silence |
| 75 (1695) | beat 2 | **The perforation:** `CANCELLED`, punched through in one frame, as one stroke of a perforator. Each hole is a cut: the grid shows in it, the sheet's shadow falls into it, its wall catches the key (below) | Silence (no crunch: D6 holds) |
| 76–89 | | It holds. Nothing moves | Silence |
| 90 (1710) | beat 3 | His engraved pupils step one line toward the holes. It's Mas's one live motion, and it matches 26.04a's pupil step toward the dialog. Nothing else on him moves | Silence |
| 91–104 | | It holds | Silence |
| 105 (1725) | beat 4 | **Out: snap to pixel.** The grid again, with the dialog gone. His tile is greyed (`CALL_GREY`) and carries the scar: one row of 2×2 `N0` punched holes on a 4 px pitch straight across the hoodie (the record's punch, carried back into the grid on the one object it cancelled), well clear of the name bar. Its mic shows unmuted, with no speaking bar | Silence |
| 105–107 | | It holds in place: the snap reads | Silence |
| 108–115 | | **It falls through its own slot**, masked to it: four held drawings on 2s, straight down, whole pixels (4, 14, 34, 60 px; `pixel.ts` `FALL`), no GLYPH dissolve. Nothing of it is ever drawn outside the slot, so it never crosses a tile, the frame edge or the row below, and its name goes down with it | Silence |
| 116–119 | | The slot is empty. The four remaining tiles close ranks in two held steps (p116, p118; `slideTiles`, `CLOSE`) and settle into G4 for the last two frames | Silence |
| (120 = act 1740) | | Cut to 26.05a `[CU]`, as locked, outside the clip | D6 runs on to 1830 |

**The certificate's layout** (as built; fix pass after the lead's review). It is built on `gridLayout(5)`'s geometry and drawn at 1080, so the eye stays on his tile. It must read as a **share certificate, not a banknote**: grey-green paper plus green ink plus an oval portrait read as money, and "his face on the money" is a laugh. The fix pass lets the certificate's own formula carry that read, because frame and ink alone did not.
- **Border.** The call window's frame becomes a guilloché border with rosette corners, engraved in ink `#16302A` on **ivory** stock (`#F5EFDA` under a warm-neutral grade whose light sits over the text block), graded to 75% luminance or less (measured peak 0.744 on the rendered frame), falling off toward the edges as if the laptop lit it.
- **Vignette.** Mas's tile holds an oval vignette (rx 186, ry 248 at 1080): the engraved Mas bust, facing the cartouche. The Strip's neon doesn't survive the print. **Two re-cuts of the tonal rig (`masTone`) still read as a woman in a hood with a bun** (one bowl-shaped hatch mass, a top tuft, a long soft face, a wimple collar), because its straight one-angle hatching cannot follow hair. The bust is now engraved line by line from the **anime rig's on-model geometry** (`shared/anime/Mas.tsx`, copied into the generator; no shared file touched) by an offline generator, `proto1/tools/engrave_bust.py` → `proto1/bustArt.ts`:
  - **Hair:** its strands radiate from the cowlick's root and each of the six front locks is cut root to tip, so the lines converge at the lock's point. The hair is the darkest value on the sheet, with a lit sheen on the crown. The locks end over the brow (a clear hairline) and the hair steps back at the temple to a short sideburn in front of the ear. The cowlick is a thin, hooked, pointed tuft, never a round mass.
  - **Face:** it is cut in fine lines that follow its contour. The lit side is bare paper with hairlines, and the far cheek carries a light second set. The jaw is a firm burin contour, heaviest under the chin, with light hatching and no beard. The face is short, the eyes are big, calm and unblinking, and the smile is the tiny closed one.
  - **Ear and neck:** the ear is a cut contour with its fold. The neck is lit skin with the jaw's shadow across its top.
  - **Hoodie:** the hood bunches behind the neck, the roll lies round it, and two paper-white drawstrings with solid aglets hang from their eyelets. The body is a mid-grey drape of cross-contour lines, cross-hatched on the far side.
  - **Tone:** tone is line width (darkness × the real local spacing between lines). The bust sits at 0.54 px per rig unit.
- **Cartouche.** The dialog's rect becomes the name cartouche, which reads as the certificate's formula. From the top:
  - `NOPEAI` in engraved capitals (128 px) and a rule
  - the title band `THIS CERTIFIES THAT` (27 px caps)
  - `MAS MANALT`, the dialog's own title, so the eye reads continuity
  - **`HOLDS` (32 px), then a long ruled blank with end ticks, then `SHARES` (46 px).** The blank is the longest thing under the name and has nothing written on it, because the blank is the story.

  The sheet has no other words.
- **Four seals.** Each board tile becomes a small engraved seal: a doorway, a glowing page, a spinner, a black square. They're the cold open's four attendee circles, now signature seals, in a row at the foot of the sheet, **clear below the word** (no hole ever lands on a rim). No names.
- **Serial.** One engraved box, top right, reading `No. 1` (a stock certificate is numbered once; two serials in opposite corners are a banknote's). No date, and no reference to the tally.
- **Counter medallion.** It sits bottom right, with an empty centre, next to the word's last letter.
- **The perforation.** `CANCELLED` is set in the 7-px pixel font's letterforms, where every lit pixel is a punched round hole: **12 px across at 1080 on a 16 px pitch** (a punch die, not a headline), so the word is about 112 px tall and 976 px wide.
  - **It runs across clean paper only.** It sits level and centred under the blank (x 748–1724, y 482–594 at 1080), clear of the vignette's frame, the seals and the counter. It never touches the portrait. When the first build ran it through the vignette, the first two letters were lost in the engraving and the word read "C?NCELLED".
  - **The holes are real cuts.** Through each one you see the pixel frame the jump left (the click's frame), the grid cutting through the record, which is what the snap returns to. Final polish (a blind cold read called the fix pass's flat near-black holes "dot-matrix printing, not punched-through holes"). Each cut now shows three things a printed dot never does:
    - **The grid.** Every pixel is pressed into one navy band (the call's own blues), set by its difference from its 3×3 neighbourhood, so every cut averages the same tone. Every letter reads the same at phone size, over a face, a lamp or a dark tile alike, and the frame's blocks show plainly inside each cut at full size (`shadeFrame` in `JumpProto1.tsx`).
    - **The sheet's shadow** falling into the cut on the side away from the key: the hole minus itself shifted down-right, a dark crescent on the upper left.
    - **The cut wall** catching the key: a thin crescent of paper edge on the lower right.

    There is no ink ring (ink is printing). A pale security underprint (below) runs under the whole sheet, so each cut visibly interrupts printed lines.
- **Before the punch (p63–74)** the band under the blank is empty: the slot the word will fill. A pale lathe-work ribbon was tried there in the fix pass. At phone size it read as a grey wave, a banknote band, and it muddied the word, so it was dropped.
- **The underprint** (final polish): fine wavy lathe lines, 0.42 px at 20% ink, 5.2 px apart, across the whole sheet inside the border (the vignette's paper covers it inside the oval). It is a field, not a band, so it has no shape and no edge; at phone size it is a tint of about 2%. Its job is the cuts: at full size every hole visibly breaks the print under it. A first try that stopped at the text panel's edge showed that edge as a hard vertical line beside the vignette; it now runs border to border.

**Reuse:**
- `studio/src/shared/pixel/kits/callgrid.ts`: `gridLayout`, `callChrome`, `drawTile`, `callDialog`, `drawPointer`, `captureTile`, `dropY`, `slideTiles`, `CALL_GREY`
- `pixel/cast/calltile.ts`
- `pixel/font.ts`, for the hole letterforms
- `pixel/freeze.ts`, for the pop
- tonal `engrave` (the ink); the anime rig's Mas geometry (copied into the generator)

**New:**
- a deterministic guilloché and rosette generator
- the four seals in engrave
- the perforator (`proto1/perforation.ts`) and the cut layer (`HOLES_CLIP`, `HoleRims` with its shadow and wall crescents, `CUT`, the underprint in `proto1/Certificate.tsx`; the grid-in-the-cut band `shadeFrame` in `proto1/JumpProto1.tsx`)
- the vignette's engraved bust. The generator (`proto1/tools/engrave_bust.py`, numpy + pycairo, seeded) does three things:
  - it paints a value study per material
  - it cuts each material's line family (lofts between guide curves, a fan of strands from the crown), with widths from value × the real local spacing
  - it writes `proto1/bustArt.ts` (SVG fragments; two iris drawings for the pupil step), which `proto1/bust.ts` hosts

  Re-run it after any change: `../audio/.venv-mix/bin/python src/dev/jumps/proto1/tools/engrave_bust.py [preview.png] [scale]`, from `studio/`.
- the scar row on the grey tile, the press flash (`popRoom`), the masked exit (`FALL`, `CLOSE`) and the ALYI chip fix (`hideAlyiFragment`), all in `proto1/pixel.ts`
- the frozen lock-v2 composer (`proto1/lockv2.ts`)

**Built:** `studio/src/dev/jumps/proto1/` · `out/lookdev/jumps/proto1.mp4` (144 f: 2.5 s locked pixel, the click, the jump, the snap and fall, 1 s of the locked `[CU]`), `proto1-key-{1..4}-p*.png`, `proto1-sheet.png`, `proto1-steppop.mp4` (the rejected family-step in: it reads as a glitch flash). The sheet's transition row is p59, 60, 61, 63, 74, 75, 104, 105, 110, 114, 116, 120. Sound: the click decays to digital zero by p66 and stays there through the `[CU]`.

**Fix pass (2026-09-25, the lead's review):**
- **What changed.** The portrait, the perforation's place and hole shading, and the certificate's formula (the title band, `HOLDS ____ SHARES`, one serial). That build is kept for comparison in `out/lookdev/jumps/history/r1/` (same file names).
- **Checks, from the encoded mp4:**
  - All 102 pixel frames (p0–62, p105–143) render identical to the previous build, to the pixel.
  - p74→p75 changes only the holes' box, and p89→p90 only the pupils (a step of about 3 px, down and to the right, toward the word).
  - The AAC stream is bit-identical to the previous delivery.
  - At 480×270 the word reads whole, and the bust reads as a young man with short dark hair and a hoodie.
- **Still open:**
  - The frame keeps some banknote DNA (the wavy border band, rosette corners, the oval, green-black ink). The certificate's formula now does the naming.
  - The bust is on-model to the anime rig (its eyes and pointed locks), not a classical engraved likeness.
  - The scar row no longer sits on the perforation's line, which now misses the portrait.

**Final polish (2026-09-26, the blind cold read).** A stranger with no context read the fix-pass build correctly: "a board voting a founder out on a call, told from his side"; `CANCELLED` and the `NOPEAI` certificate "land clearly on a first watch"; the portrait "a young man, late 20s to early 30s, dark spiky hair, a cowlick, a dark hoodie". Nothing felt corny. What looked cheap, and what changed (the fix-pass build is in `out/lookdev/jumps/history/`, same file names; the lead's key comparison is still key-3):

| Cold read | Change |
|---|---|
| "The tile squeeze (110–119) reads as a broken CSS layout": his tile overlapped by ALYI and NELEH, cut off, its label spilling into the row below | It falls through its own slot, masked to it, and is gone before the ranks close (frames above) |
| "The green flash (61–62) looks like a palette filter … at 2 frames a render hiccup" | A flat press flash in the paper's own tone (78% white, measured 0.768; the rule's cap is 0.80) |
| "Solid black dots read as dot-matrix printing, not punched holes" | The cuts show the grid, the sheet's shadow and the lit wall, over a pale underprint they break |
| A stray `'I` at the dialog's edge (ALYI's cut label) | Not drawn where the dialog cuts it (p0–60 only; handoff) |
| The `.` after his mic icon, and a thin grey bar under his name | The mic's single speaking bar is gone (the icon still shows him unmuted); the shoulder's rim light under the chip, which greys into a lone bar, takes the hoodie's grey |

- **Checks, from the encoded mp4 and the renders:**
  - p0–60 differ from lock v2 only inside native x 187–195, y 91–101 (the chip). p63–74 are unchanged frame to frame. p74→p75 changes only the holes' box (x 750–1721, y 484–591), and p89→p90 only the pupils (x 357–429, y 324–343).
  - Paper peak luminance 0.743 (≤ 0.75); the flash 0.768 (≤ 0.80).
  - The AAC stream is bit-identical to the fix-pass delivery.
  - At 480×270, `CANCELLED` reads whole and every letter the same tone. The exit reads as his tile sinking out of its slot, then the board closing ranks; nothing overlaps.
- **Left as it is:**
  - Neleh's orbiting footnote digits (`3 2 1`) read cold as "debug numbers or dizzy stars". That is the call kit's footnote gag, on every Neleh shot of the act, not J1's (handoff to the kit owner and THE EDITOR).
  - "The anime portrait inside a banknote engraving" read as "mildly incongruous, but it works as a joke. Not corny." It is on the line M3's "fails if it reads as a gag" draws. The bust stays on-model; the board should watch for it in context.
  - The exit now ends by the cut (the slot is empty from p116), where lock v2 had the tile "still falling at the cut" for F1.2's plate. THE EDITOR checks F1.2's continuity when J1 moves to lock v3.

**Passes if:**
- a cold viewer says "certificate" or "cancelled" from one frame
- the `[CU]` at 26.05a still plays as the deadpan (watch it in context)
- the silence never breaks
- the snap lands on the exact grid

**Fails if:**
- it reads as a gag (a stamp slapping down)
- the perforation reads as a wound on his face
- the paper reads as a flash

**Must not:** make a sound on the perforation; use a rubber stamp or the word `VOID`; show any date or real text; keep the GLYPH dissolve as well.

**Script change (PROPOSED, Ep1 owner).**
- sc 26 phrase 3's first shot becomes: *"`[POV]` (1 bar) JUMP J1. His tile, perforated, drops out of the grid like a puzzle piece: straight down through its own slot, a whole-pixel fall, and is gone. The four remaining tiles close ranks."*
- The GLYPH dissolve comes out, which returns one of the pilot's two GLYPH uses.
- **Fallback if declined:** keep the dissolve and drop J1. Never both.

### 5.2 Prototype B · J3 · "THE SKY OPENS" (Ep9, Act Two #23)

| | |
|---|---|
| **Motivation** | M1, the stakes become real, rung 1 (image fidelity) |
| **Owner** | The world |
| **Medium** | Continuous tone (a deep star field, `proto2/deep.ts`) behind a pixel tear |
| **Clip** | 120 f: pre-roll p0–29, jump p30–104 (75 f, 5 beats), after p105–119 |
| **In / out** | The tear: a torn line runs down through open sky, then is pulled apart from the top into a narrow V / the seal, from the tip up, leaving a torn scar where it stood widest |
| **Sound** | The rack's tick stops on p30; two dry micro-cracks (the tear's start, p30, and its stop, p36); full-band night air at full level on the cut (p45), about 11 dB under the room; the room returns in phase on p105 |
| **Staging** | INT. MAS'S DARK ROOM — NIGHT. `RAIL: SEP 12, 2026`. The desk plate, `[W]`: Mas at the desk (left), the Orb, his glass, the window's night skyline behind, the shelf clock at `3:12`. The posts that trigger the beat ("i agree with mario…", "Mario is right.") have played on his monitor before the clip. The prototype has no text beyond the rail |

**The idea.** Ep1 taught that the sky can crack. In Ep9 it tears. From behind the window head a torn line runs straight down through open sky, passes behind the transom and stops in mid-air. It holds as a hairline, then is pulled apart from the top like a sheet: a narrow V, widest where it runs on out of frame, closing to a hairline at its tip. Behind the painted night is a deeper one, a black field with far more stars than the sky in front of it. The Orb sees it. Mas keeps reading. It seals from the tip up and leaves a torn scar. (It tears top to bottom, the way a veil is torn, in a skyline with a cathedral going up in it. Nobody says so.)

**How the shape got here (three passes).**
- **The fracture** (two builds: a nucleus, three arms, angular runs through the wall and the city). The lead read it as a stock chart, and in the room as the show's cyan curve (`prev/r1/proto2-p056.png`).
- **The seam** (fix pass, 2026-09-25): one straight 1-px seam at x 280, both ends hidden, behind the window head and **a tower's roof**. It killed the chart. The blind cold read of that build (2026-09-26, `prev/proto2-*.png`) found three new misreads. At 480×270 its column of stars sat on the tower and read as **"a lit tower or spire with twinkling lights"**. Its perfect rectangle, whose look changed where it crossed the transom (the galaxy band ran through the lower pane only), read as **"a compositing layer or a column of dead pixels"**. And its hairline and its scar read as stray lines. The one fix asked for: "move it off the rooftops into open sky, give it ragged edges, not a clean rectangle."
- **The tear** (final polish, same day; ships). The comparison, on the same plate, clock and far side:

| | A · GLASS (`glass.ts`) | B · SEAM (`seam.ts`) | C · TEAR (`tear.ts`): **ships** |
|---|---|---|---|
| Shape | A star fracture from one point: radial arms and spider-web rings | One straight 1-px seam, parted to 11 px; its lower end hidden behind a tower's roof | A torn V from behind the window head, 20 px wide there, tapering to a torn hairline in open sky; passes behind the transom |
| Cold read at 480×270 | "His window got smashed": a bullet hole, a rock (and a spider) | "A lit spire", "a pasted strip", "dead pixels" (blind read) | Builder's read only, not yet blind: "a black rip in the sky with stars in it" |
| Guardrails | An impact on his home's window at night reads as an attack on that home ([mas-manalt](../characters/mas-manalt.md) NEVER DO) | Clean | Clean |
| Kept as | `out/lookdev/jumps/proto2-alt-glass-p075.png`, the sheet's third row | `out/lookdev/jumps/history/proto2-*.png` (the build that was read), the sheet's third row | `out/lookdev/jumps/proto2.mp4` |

**What makes it a tear and not anything else:**
- **It lives in open sky.** Its only occluders are the window head (its top runs on out of frame) and the transom (across it). Its tip stops 15 native px above the nearest roof. Nothing of the city touches it, so nothing of the city can claim it.
- **Its edges are torn.** Both lips follow one jagged profile, 1-px jogs in runs of 2–4 rows (`FIBRE`), so the two edges would fit back together: one surface pulled apart, never a layer. The path meanders by a pixel every 4–9 rows (`MEANDER`); a tear never runs ruler-straight. It has no trend, no corners and no branches, so it is not a chart and not lightning.
- **It has one visible end.** Its top runs on behind the window head, so it is never a lens or an eye. Its sides bow (width ∝ distance to the tip^0.62), so it is a rip, not a drawn triangle or an arrowhead.
- **One lip dark, one a rung lighter.** The left face's edge is a rung darker (its thickness in shadow), the right a rung lighter (catching the far side). Never two lit lips: that is a beam.
- **Inside it is black, with sharp points.** The far side's floor sits below the pixel sky. The galaxy band no longer crosses the opening (its glow and dense dust read as grey smoke at phone size, and in the seam build they made the lower pane "change look").

**Frames** (as built). Native coordinates: window x 108–300, y 10–112; mullion x 203–205; transom y 44–45. Mas is at [88, 44] (his figure spans x 107–162) and the Orb at [202, 72]. The tear's line is x 232 ± 2 (the meander and the fibre), y 10–61; the roofs under it start at y 76; the spire's needle is at x 258.

| p | Beat | Picture | Sound |
|---|---|---|---|
| 0–29 | 1–2 | Pixel `[W]`, still. The rack LEDs blink on straight eighths; the monitor flickers on 2s. **Mas reads:** his eyes return along a line (the rig's one-pixel dart, p16–21) | Server hum, the rack tick |
| 30–36 | 3 | **In: the tear.** A torn 1-px line runs down the sky at a constant 8 native px a frame (never eased), from behind the window head, **behind the transom**, to a stop in open sky at y 61. Inside the line there is already the far side | The tick stops dead on p30. One dry micro-crack as the tear starts and one when its tip stops (p36), both panned to x 232 |
| 36 | | The Orb's iris steps to the tear: the witness, **and the only one** | — |
| 37–44 | | The torn hairline holds. A star catches in it | The hum holds; nothing new |
| 45–51 | 4 | **It is pulled apart** in held steps on 2s: top widths 4, 9, 14 and 18 native px, the V's sides bowing to the tip, where a hairline runs on | On p45 the hum and every chip sound cut. In their place, from the gap: outdoor night air, full band, wide and quiet, **at full level on the cut** |
| 52–89 | 1–2 (bar 2) | **The hold.** It opens to 20 px on p68. The far side's dust and field stars drift differentially (near about 0.35 px a frame, far dust about 0.08): a volume, not a texture. **The Orb's rim takes the opening's light:** one whole palette rung on the rim facing the tear, while it is wide (a pixel light; see "Light" below). **Mas reads on:** on p74 his eyes return and the feed on his monitor scrolls one post. He reacts to nothing the sky does | The air holds |
| 90–103 | 3 | **Out: the seal**, 12, 5 and 1 px at p90, 94 and 98. Faster than it came in | The air band-limits and narrows with each step |
| 104 | | The scar: the torn line itself, two rungs darker than the sky, from behind the window head to y 33 (where it stood widest). The thin run below heals clean | — |
| 105–119 | 4 | Pixel. The scar stays for the rest of the scene. Mas reads on (a third eye return, p110–115); the glass is flat | The hum and the rack tick return on p105, in phase |

**The far side** (`proto2/deep.ts`, authored at 1080 native):
- **What's behind the sky:** the same night, one tier up and much deeper. A floor darker than the pixel sky (`#02030d` to `#040716`). About 9,000 stars in three populations: a faint dust, a middle field on a power law in brightness, and a few near stars with a soft bloom and no spikes (spikes are a lens effect). No moon, no city, no aurora colours, and (final polish) no galaxy band inside the opening.
- **Its one readable element: there are far more stars behind the sky than in it.** Seven hero stars are placed along the V, brighter near the top, each **centred on a native block and held still** (the dust and the field drift around them), so each lands in one phone pixel as a clear point of light for the whole hold (measured: 154–234 of 255 at 480×270).
- **Exposure:** +2.1 stops mean over the opening at p75 (`tools/grade.ts`), carried by points, not glow, on a floor darker than the sky. Peak luminance 1.0 (the hero cores).
- **Light.** The seam build's continuous cool cast over the window, the wall and the Orb is dropped for the tear: a blind cold read never registered it, and a soft cast over pixel surfaces is the filter look. Its light is now one whole rung on the Orb's rim facing the tear, in pixel steps, while the tear is wide (`tearOrbRim`). The room stays in its own medium; nothing touches Mas or his glass.

**Mas never freezes** (his design anchor). The blind read found him "completely frozen: the shot plays like a still with one animated sticker." The rig still has no up / over-the-shoulder head, so he doesn't react. He reads: three eye returns (look −1 → 0 → −1) at p16, p74 and p110, each well clear of the tear's events (p30, p45, p90), the middle one on the same frame as the feed's scroll. Each feed post now has its own line lengths, so the scroll shows.

**Checks** (`tools/check.ts` and `tools/grade.ts`, plus frames and audio pulled from the encoded mp4):
- Deterministic. The rail never changes. The pixel grid is exact at p29, p105 and p119.
- Mas and his glass match the pixel frame's own drawing on every frame from p30 to p104: no far side, cast or cut on them. The nearest continuous-tone pixel is 68 native px from his figure (52 in the seam build).
- Audio from the muxed AAC: the room at −27.0 dB RMS through p29; micro-crack peaks −9.6 (p30) and −15.1 (p36) dBFS; the air at −38.6 from p45, with no rise; −45.3 through the seal; the room back at −26.9 on p105.

**Reuse:** `pixel/rooms/darkroom-plate.ts` (`drawDarkPlate`, `DPLATE`), `pixel/cast/mas-medium.ts` (its eye dart), `pixel/cast/orb-medium.ts`, `pixel/palette.ts` (`stepColor`), and `pixel/font.ts` for the sheet's labels.

**New (final polish):**
- `proto2/tear.ts`: the torn path, the V, the lips, the scar, the Orb's rim light
- `proto2/plate.ts`: the reading eye returns (`DARTS`), the feed's scroll (`SCROLL_AT`) and its varied posts, the clock at `3:12` (the plate's 2-px-wide `4` read cold as "3:11" or "3:Y1")
- `proto2/deep.ts`: the band out of the opening, a darker floor, the tear's still hero stars
- `proto2/scene.ts`: `VARIANT` = `tear` (default) · `seam` · `glass`

Kept for the record: `seam.ts`, `glass.ts`, and the retired fracture (`crack.ts`, `sky.ts`). The Remotion `jump-proto-2-sheet` composition (in `styleframes/`) still carries the fracture build's labels, so the build doesn't use it.

**Built:** `studio/src/dev/jumps/proto2/` · `out/lookdev/jumps/proto2.mp4` (120 f), `proto2-p{040,056,084,112}.png`, `proto2-sheet.png` (its third row: the tear at 1:1, the seam and the glass at phone size), `proto2-sound.wav`, and `proto2-alt-glass-p075.png` (the frame that was judged; not re-rendered). The seam build is in `out/lookdev/jumps/history/proto2*`; the fracture build in `out/lookdev/jumps/history/r1/`.

**Cold test at 480×270, stated plainly.** This is the builder's own read, not a blind one. A stranger would describe a man reading at his desk at night, a floating robot eye, and a black rip at the top of the window with stars in it, which the eye turns to look at. Nothing touches the skyline, so the spire read is gone. Its edges are torn and it has no rectangle, so the pasted-strip and dead-column reads should be gone. That needs confirming blind.
- **Risks I can see.** A dark jagged wedge hanging from the top of a sky could be taken for smoke or a funnel cloud. The stars inside it and the tear's motion (it runs, then it is pulled apart, then it closes from the tip) argue against that. The lone hairline (p30–44) reads as a crack, and should.
- **Genre.** "A rift in the sky" is a science-fiction idiom, and "the sky is a set" echoes a well-known film. Both sit close to the meaning, but the board should hear them.

**Status: rebuilt on the blind read; not yet blind-read again or proven in the Ep9 animatic.** What remains:
1. **Quiet at phone size.** It's 20 of 480 px wide at the top and 51 tall: the second thing the eye finds, after his face. Going bigger crowds the Orb and the spire.
2. **The concept is "the sky is a surface".** The break doesn't come through the wall or pass behind him, so his figure is never near it.
3. **Carried over:** the night air is still synthesized, and Mas's up / over-the-shoulder head doesn't exist yet. The plate's dithered monitor spill (the soft cyan glow right of the monitor, on every frame) read cold as "a gradient filter". It belongs to the dark-room plate, not the jump (handoff to the plate owner).

**The ladder (PROPOSED, Ep1, Ep5 and Ep6 owners, and this file's owner).** Make the rung-0 and rung-½ hairlines (Ep1 sc 17, Ep5 #17, Ep6 #17) the same short, torn, vertical line as J3's scar: behind a window head, in open sky, clear of every roof. Then Ep9 reads as "that line opened." A horizontal hairline across a sky is the chart read the seam pass removed. §2 M1 ("In and out," "The crack is a fracture, not a line"), §3.3's Crack row and §4.1's J3 row still describe the retired fracture; they sit outside this pass.

**Fallback, unchanged:** if the Ep9 animatic reads the tear as a glitch, smoke or part of the window, keep Ep9's crack as a pixel hairline, let J5 carry M1 alone, and move the knee to Ep10.

**Passes if:**
- it reads in one frame as "the sky is a surface, and something bigger is behind it"
- the tear reads as threat, not glitch
- the room feels smaller when its sound returns

**Fails if:**
- the continuous layer looks pasted on (fix the grade)
- the tear reads as a chart, lightning, a beam, a portal, smoke, a funnel cloud, a skyline element or a window blind
- anyone reaches for the word "glitch"

**Must not:** use chromatic fringing or glitch blocks; hold a tone; light both lips; show its top end; let it touch or line up with a roof or the spire; slosh his glass; put continuous tone or a cast on Mas; turn him toward the lens; leave a scar across the sky.

**For the Ep9 writer.** Stage the beat in the dark room, with the macro on his monitor; that also answers SEASON-NOTES note 1, since Ep9's Act Two needs Mas in frame. "Every glass sloshes except Mas's" can play in cuts to other rooms after the snap.

### 5.3 Prototype C · J6 · "THE RING" (Ep12, Button #17)

| | |
|---|---|
| **Motivation** | M2, Mas loses control: the only M2 jump in the season |
| **Owner** | HIM, the to-no-one version |
| **Medium** | Continuous tone and a fluid ripple, inside a pixel insert. Code only: the wave-equation grid genai §2.3 asks for, **unquantized** inside the ring for 60 f (decision 8, resolved) |
| **Clip** | 120 f: pre p0–29, jump p30–89 (1 bar), after p90–119 |
| **In / out** | The ring's edge is the front / settle, then snap |
| **Sound** | The room, then true silence for the whole jump; the hum returns on the snap |
| **Staging** | `[ECU]`, looking straight down into his glass on the desk, under the monitor's cyan key, **with desk around it for context**. The prototype uses the dark room; the Ep12 script sets the room. The water is clear: the desk's grain and the glass's thick base show through it. It reflects the monitor: a cool rectangle holding one line of type (`define "win."`, mirrored), which in pixel is type shape only and **becomes legible only inside the ring** |

**The idea.** All season his water has been one flat row of pixels. Here, after the screen answers the child's question, one ring spreads, and the grid gives way for exactly as long as the ring lasts. Inside the ring the water is real: continuous, refracting, the screen's reflection bending. Outside it, the water is still pixel until the ring reaches the rim. Then it settles, and the grid comes back as if nothing had happened. In his world the water never moved; we saw it move.

**What the first build got wrong** (the critic): the ring's exponential ease-out moved like a **UI touch ripple** (the "screensaver" fail); the ring showed itself by its own glowing crest and dimple instead of by what it bent; the glass read as **a camera lens** (a thick glowing rim around opaque dark water, 132 px across, filling the frame); the snap was too subtle on a small screen.

**Frames** (as re-built). The water disc is **100 native px across** (400 px at 1080; the rim's outer edge 110 px), sitting in the desk with room around it; R is its radius (50).

| p | Beat | Picture | Sound |
|---|---|---|---|
| 0–29 | 1–2 | Pixel `[ECU]` from above: the water disc flat and indexed, the monitor's reflection still | Server hum, a faint monitor whine |
| 30 | 3 | **In.** At the centre, with no drop and no visible cause, the ring begins, so faint it opens out of nothing. Inside radius r the water is continuous tone | Everything cuts to digital silence |
| 30–65 | 3 → 1 | r grows from 0 to R at **constant speed** (≈ 1.4 native px a frame), smooth and sub-pixel: the only curved sub-pixel motion in the show. The slowing is the amplitude's damping, never the front's. The ring is seen by **what it bends**: the grain and the base through the water, the screen's reflection and its type on it. Inside the ring the type is legible | Silence |
| 66–80 | 1–2 | The ring meets the rim, and a faint return ring (about 30% amplitude) runs back in. The whole disc is continuous now | Silence |
| 81–89 | 2 | **Settle.** The amplitude falls to zero, and the reflection steadies, still continuous | Silence |
| 90 | 3 | **Out: snap to pixel.** The disc is identical to p29. No scar | The hum returns |
| 90–119 | 3–4 | Pixel, held. (In the episode: cut to the Orb's scan) | Hum |

**The glass** (pixel, `proto3/art.ts`). A 2 px rim top in dim glass teal with **one** highlight arc toward the monitor; a 2 px inner wall; a quiet meniscus row (never a second bright ring). Through the water: the same desk as outside it (one wood function for both media), magnified ×1.05, ×1.14 inside the base's edge (so the grain jumps at the base, which reads "glass bottom"), one light step down, with the monitor's light gathering on the far half of the bottom. No caustic swoosh on the desk.

**The ripple.**
- One damped circular wave as a height field inside the leading edge:

  ```
  h(r, t) = A · e^(−k·t) · sin(ω·(r − v·t))
  ```
- It's rendered at 1080 native as surface normals that offset the reflection (refraction), plus one specular from the monitor. Deterministic.
- **References:** the anime rig's `WaterGlass` `ripple` parameter (`studio/src/shared/anime/scene/props.tsx`) for the look; the tonal soft dark room's glass (`out/lookdev/looks/env/env-set-softenv.png`) for the grade.

- **Knobs as built** (`proto3/ring.ts`): peak slope 0.36; the crest and trough packet narrow (it spans ~7 px behind the front: a packet wider than a young ring's radius makes a dome, which inverts the reflection like a lens); reflection displacement 14 native px per unit slope, refraction 3.5; slope shading 0.1 and height shading 0.15 (was 0.35 / 0.6: the ring must not glow); the monitor's glint only where a crest faces it.

**Reuse:**
- `pixel/rooms/darkroom-plate.ts`, for the desk under the cyan key
- `pixel/kits/inserts-props.ts`, for the glass-drawing conventions
- the tonal `soft` grade

**New:**
- a small top-down pixel drawing of the glass on the desk: the rim, the disc and the reflection rectangle
- the ring shader
- the disc mask, stepped on the native grid

**Passes if:**
- the room goes quiet watching it
- it reads as his, not as a water effect
- the snap back hurts a little

**Fails if:**
- it looks like a screensaver
- there's any sound
- the ring reads as a drop from above

**Must not:** show a drip, a tear, a hand, a second ring or a face, or make any sound. It is never generated.

**Built:** `studio/src/dev/jumps/proto3/` · `out/lookdev/jumps/proto3.mp4` (120 f), `proto3-key-{1..4}-*.png`, `proto3-sheet.png`, `proto3-sound.wav`, and `proto3-quantized.mp4` rebuilt on the new art for the record. Sound: digital zero p31–88; the room returns at −30 dB on p90.

**Fallback.** If the showrunner prefers genai-candidates' fully quantized ring, J6 comes out and M2 has no jump at all. The ring then stays the pixel tell it was written as. The quantized A/B reads as clean water, but it isn't a jump and it spends the tell, so the default is unquantized (decision 8). **Internal only:** no frame of this prototype leaves the room before Ep12 airs.

---

### 5.4 Lessons from the prototypes

The three builds were reviewed frame by frame (strips, zooms, per-frame audio levels from the muxed files), polished, and re-rendered. What they taught applies to every jump still to be built (J2, J4, J5, the alternates).

**The new medium must show itself through what it changes, not through its own light.**
1. **Show the medium by what it bends, cuts or cools.** J6's ring only stopped reading as an effect when its own crest glow went down (kHeight 0.6 → 0.15) and it was seen bending the grain, the base and the type. J1's holes stopped reading as dot-matrix print when they became cuts that show the grid behind (and, final polish, when the grid inside them was visible at all: see lesson 22). J3's "spill" registered only as a cooling of the room, not as added light; a blind read then never saw the cooling at all, so the tear's light is one pixel rung on the Orb's rim (lesson 23).
2. **Brightness isn't fidelity.** Grade the new medium to within about one stop of what it replaces, and let resolution, smooth gradients, fine stars and grain carry the difference. J3's far side was 4.6 stops over the pixel sky and read as lightning; at +0.8 it reads as a deeper night. The same law governs J5's plate. *Fix pass:* at +0.8, J3's opening was too quiet to read at phone size. Inside a small opening the far side may go higher, provided points carry the difference and glow doesn't: J3's seam sat at +2.2 stops and the tear at +2.1, on a floor darker than the sky around it. A grey glow at a similar level read as glitter paper, and a galaxy band's glow inside a narrow opening read as grey smoke at phone size.
3. **The cut should reveal the grid.** When a jump opens a hole in its medium, what shows through is the pixel frame it left. That sets up the snap and says "this is the same moment."

**Motion and shape carry genre, so check them against the show's own subjects.**

4. **Easing is a genre.** An exponential ease-out on a spreading ring is how a UI touch ripple moves. Physical events move at their own speed; slowing belongs to amplitude, not position. Watch for UI easing in any jump that stands for a physical event.
5. **In a show about markets, a jagged line across a skyline reads as a price chart, however it is routed.** The skyline reads as the bars. Two J3 builds made the crack a proper fracture: it nucleated on a surface, branched, ran in angular segments, passed behind whatever stood in front of the picture plane, and left only a short scar. It still read as a chart, and in the dark room as the show's own cyan curve. The fix was a shape with no trend at all: one straight vertical seam, with both ends hidden, in the sky only. A blind read then found what that fix cost (lesson 19); the shape that ships is a torn vertical V in open sky (§5.2). Test the silhouette of every line, stroke or trail in a jump for chart, arrow, logo and lightning reads.
6. **A wave packet wider than the ring is a lens.** A young ring whose crest and trough cover its whole interior becomes a dome that inverts the reflection. Keep the packet narrow, so the middle is calm as soon as the ring opens.
7. **Scale sets the read.** At 132 px across, with a thick rim and opaque water, the glass was a camera lens. At 100 px with a 2 px rim, clear water and desk around it, it's a tumbler. Frame every jump object with enough context to name it cold.

**Print media need a per-medium re-cut, and their stock carries genre.**

8. **Engrave a portrait from the on-model drawing, line by line; don't re-tone a plane rig.** At vignette size the tonal rig's engrave pass fused hair, the skull's shadow and the jaw into one mass, and Mas read as a hooded woman. Two re-cuts of that rig (new hatch angles, the hair behind the ear, an ear contour, a lighter jaw) still read as a woman with a bun, because one straight hatch angle per plane cannot follow hair. What worked (J1 fix pass) was to engrave from the show's own on-model geometry (the anime rig), cutting each material's own line family:
   - hair strands radiating from the crown, and each lock cut root to tip
   - contour lines on the face
   - a drape on the cloth

   Tone is line width. The male read is carried by dark short hair with a hairline over the brow, the temple break and the ear, a firm jaw contour over light hatching, and a hoodie that shows its drawstrings. Every M3 jump that prints Mas (J2's halftone included) should start from `proto1/tools/engrave_bust.py` (or a vignette drawing from the cast owner), never from `masTone`.
9. **Paper, ink and layout decide "certificate" or "banknote", and words decide it fastest.** Grey-green stock plus green ink plus an oval portrait is money, and money is a gag. Ivory stock under a warm-neutral grade helps. What names the medium in one frame is the medium's own formula: `THIS CERTIFIES THAT` / name / `HOLDS ____ SHARES`, with the blank the longest thing under the name. So is one serial, not two. Keep the medium's marks clear of each other: no hole on a seal's rim.

**POV and staging**

10. **If the right reaction drawing doesn't exist, hold.** A jump isn't the place to borrow a near-front head: it reads as a look into the lens. A witness (the Orb's one servo step) can carry the reaction, and his stillness can be the scarier choice.
11. **Occlusion sells the plane.** The crack reads as the picture's surface when Mas and the Orb stand in front of it. Continuous tone, casts and cuts never cross his figure.
12. **Things leaving the grid fall behind it, through their own opening.** J1's tile dropping over Mada's tile read as a window being dragged. Dropping behind the other tiles fixed that, but a blind read still saw "a broken CSS layout": the grid has gaps, so the falling tile showed through them, cut off, its label running into the row below. Mask an exit to the object's own slot and let it finish before anything moves into its place (lesson 20).

**Sound**

13. **"At full level on the cut."** Any fade-in inside a jump is a riser, even a short one. A bed that replaces the room sits about 10 dB under it.
14. **One sound per event, not per frame.** Twelve micro-cracks, one a frame, read as an ice-crackle effect. Five, one on each corner the crack turns, read as a break.

**Review practice**

15. **Run the one-frame test twice: at full frame and at phone size.** J6's snap and J3's opening changed their reads at small sizes. Log both in the POV ledger.
16. **Measure what the rules state.** Paper luminance (J1 peaks at 0.74), the far side in stops (`proto2/tools/grade.ts`) and dB per frame from the muxed file are checks, not opinions. Keep the measuring tools next to each build.

**Shape (J3 fix pass)**

17. **An impact pattern names its cause.** A star fracture (radial arms plus spider-web rings) reads as something hitting the glass: a bullet hole or a rock, and in a character's home, an attack on it. At pixel scale the rings also read as a spider web. When a break has to mean "the medium failed," give it a shape that implies no projectile (J3's tear; §5.2 keeps the glass variant as a still).

**Legibility (J1 fix pass)**

18. **A word cut into a medium must land on clean ground, and everything seen through it must read as one value.** J1's `CANCELLED` began on the portrait's engraving, and at phone size it read "C?NCELLED". Some of its holes showed warm pixels, others dark, so the letters didn't match. Run the word over plain paper. Press whatever shows through the cuts into one narrow band, so every letter carries the same dark. *Final polish:* "one value" means the same average per cut, not a flat fill (lesson 22).

**Final polish (blind cold reads, 2026-09-26)**

19. **An end you hide behind something joins it.** J3's seam hid its lower end behind a tower's roof so the slit would stay parallel-sided. At phone size the slit and the tower became one object: "a lit spire". Hide an end only behind the frame or the window's own architecture, never behind subject matter, and keep a clear margin between the break and anything it could belong to (the tear's tip stops 15 px above the roofs).
20. **An exit needs a mask and an order.** Out first, then the space closes. Drawn behind a grid with gaps, a falling tile is still seen, clipped by whatever happens to cover it. Clipped to its own slot, it reads as leaving (J1: it falls through its slot in four held drawings, and only then do the ranks close).
21. **A clean edge is a layer; a torn edge is a surface.** A perfect rectangle of a different medium reads as compositing ("a pasted texture strip") or a fault ("dead pixels"), however well graded. J3's tear has two lips with one shared jagged profile, as a torn sheet's edges would fit back together, and a path that drifts a pixel. The jogs are 1 px in short runs: jaggedness at the scale of a zigzag is lightning. Keep the far side continuous across anything it passes behind: a band that crossed only the seam's lower pane made the strip "change look" at the transom.
22. **A hole shows depth; a dot is flat.** J1's flat near-black holes read as dot-matrix printing. A cut reads when it shows, in its own geometry, something under the sheet (the grid's blocks, normalized per cut so every letter still averages the same), the sheet's shadow falling into it on the side away from the key, the cut wall lit on the other, and printed lines (a pale underprint) broken by it. No ink ring: ink is printing.
23. **Light that enters the pixel room stays pixel.** A continuous cast laid over pixel surfaces is invisible when it's subtle and a filter when it isn't. A jump's light on the room is whole palette rungs on the surfaces that face it (J3: the Orb's rim), and never on Mas.
24. **A pop is a flash, not a filter.** The freeze's pop, done as a dithered print of the frame, read as "a palette filter" and "a render hiccup". Two frames of one flat tone, in the new medium's own colour and at 80% white or less, read as a press flash: the record taking its picture.
25. **Mas never freezes, even when he mustn't react.** "Completely frozen" read as "a still with one animated sticker". Give him a live motion that belongs to what he is doing (J3: reading, three one-pixel eye returns, one with the feed's scroll), timed clear of the jump's events so it can't be taken for a reaction.
26. **Stray marks cost more than they seem.** A cold viewer lists every fragment: a clipped label (`'I`), a lone 1×2 meter bar (`.`), a rim light greyed into a bar, a 2-px-wide `4` on a clock. Check the frames around a jump for leftovers at 1:1 before a cold read, and log any that belong to another owner as handoffs.
27. **A cold read must be blind.** A sheet with production captions ("THE SKY OPENS", "tear", "the Orb has seen") tells the viewer the answer. Give cold readers the mp4 and unlabelled stills only; keep the labelled sheet for the room.

## 6. Video models: coordination with genvideo and genai-candidates

- **Converted isn't a jump.** Footage converted to pixel or GLYPH (genai-candidates' CONVERT, REF and GLYPH-source treatments, and the palettes from `studio/tools/genvideo/palettes.json`) follows the pixel rules and counts toward nothing here.
- **SYNTH is a switch.** Bezel-bound machine video (genai §1.2, NEEDS SIGN-OFF) is M5's everyday form and belongs to that file's budget.
- **Unconverted footage outside a bezel is a jump.** It happens once: J5.
  - J5 breaks SYNTH's rule that machine video stays bezel-bound, on purpose, as the endgame's image. It needs the SYNTH owner's sign-off as well as the showrunner's.
  - **Default until then:** J5 ships in code, with the last refinement step rendered in tonal `soft` instead of footage. It's still a jump, but not footage.
- **No other jump uses a model.** J3's sky and J6's water stay code (genai §2.3). J1, J2 and J4 are engine work.
- **Proposed new candidate for the register** (genai owner):

| Slot | Content | Length | Frame | Musts |
|---|---|---|---|---|
| **E12-4 · J5's sky** | A night sky (or dusk, per the Ep12 script) over a far city: very slow cloud drift, no blinking lights | 6 s, plus a 20 s loop if the hold (§7) is approved | 1920×1080, 24 fps, at least the size of the window region | Matches the pixel sky's composition exactly (horizon line, moon position), so the refinement steps read as one sky. No people, aircraft, text or logos. Graded to THE WOODROSE's candle-LED palette. Passes the gate (§1.5) |

- **A request to the genvideo owner:** a *matte-only* path. It cuts a plate out with a matte stepped on the native 4×4 grid and grades it to a key light, without palettizing. That's the whole treatment J5's plate gets.
- **Provenance** follows genai §1.4: `studio/assets/genai/<ID>/provenance.json`, with the source archived outside git. Renders never call a model.

---

## 7. Decisions for the showrunner and handoffs

### 7.1 Decisions

| # | Decision | Default until decided |
|---|---|---|
| 1 | Approve the five motivations, the budget (8 a season, 30 s) and the six booked jumps | As written |
| 2 | J1 replaces the tile's GLYPH dissolve at the firing | Both options stay open in the script until the Ep1 owner signs; the prototype decides |
| 3 | The pilot's crack stays pixel (rung 0) | Yes |
| 4 | Decline the booster smear; hold the anime look; keep its motion toolkit for A3 | Yes |
| 5 | **J5 holds** in THE WOODROSE's windows for the rest of the dinner, until F12.2 cuts to 1993: the one jump with no way back | It steps back down its four steps after 2 bars, the only jump that leaves the way it came |
| 6 | J5 puts the season's only unconverted footage outside a bezel | Code fallback (tonal `soft`) until the SYNTH decision and a plate pass the gate |
| 7 | Jumps count separately from the two-switch budget (style-status §7b) | Count each jump as one of the two |
| 8 | J6's unquantized ring, against genai's fully quantized one | **Resolved on picture: unquantized.** The quantized ring reads as clean water, but it isn't a jump and it spends the tell. `proto3-quantized.mp4` is kept for the record |

### 7.2 Handoffs

Nothing outside this file was edited by the bible; the prototype pass edited only its own files (`studio/src/dev/jumps/**`, `studio/src/styleframes/jumps/**`, `out/lookdev/jumps/**`).

| To | What |
|---|---|
| style-status owner | Add a §7c pointer ("style jumps: see style-jumps.md"). True engraving becomes the M3 medium; LEDGER stays the money switch. Decision 7 |
| INDEX / coordinator | Add this file to the Bible table and to the reading order after style-status |
| Engine owner (PIXEL_GUIDE) | The crack (`renderFront` with `tear` along a path) as a jump transition; the smear for A3 only; the PROPOSED `{type: 'jump'}` spec; the prototypes' dev entries (`src/dev/jumps/`) |
| Ep1 script and Act Four production | J1 in sc 26: the notation, the dissolve removed, the scar row. The shots-locked-v2 internals of 26.05. The timing lock itself is unchanged. **Mirror two prototype fixes into the lock's 26.05:** the grey tile blits *before* the board so it falls behind the grid, and the scar is a row of 2×2 `N0` holes on a 4 px pitch across the hoodie (`proto1/pixel.ts` `drawSnap`, `SCAR`), not a dotted rule along the name-bar edge |
| Ep7 writer | Stage J2: the press flash, the crop, and the third arms outside it |
| Ep9 writer | Stage J3 in the dark room (§5.2). Mas doesn't react inside the jump; the Orb is the witness |
| Cast owner | **Blocker for J3's Ep9 build:** an up / over-the-shoulder head for `mas-medium` (the reaction J3 was written for; until then he holds). For every M3 jump: a vignette-scale engraved bust of Mas (§5.4, lesson 8) |
| Ep10 writer | J4 at the dealer reveal, moved to 70–75% (SEASON-NOTES note 8). Tell columns rise over the four players the beat names; officials and the POPE (who doesn't play) get none |
| Ep11 writer | No jump. If the cliff is restaged in his room without the machine-POV switch, A3 can be promoted |
| Ep12 writer | J5: no crack, nobody looks up, only the Orb. J6: the ring, silent |
| Audio owner | §3.4. **A real outdoor night-air recording for J3** (the prototype's air is still synthesized pink noise; `proto2/tools/mix.ts` takes a file as its third argument), then a small library of air beds for M1. The GLYPH family's ≤ 2 s cue for J4. J5's four-step chip reformat. Chip comes back first on a snap |
| genai / genvideo owners | §6: the E12-4 candidate, the matte-only path, and the sign-off on J5's bezel break. genai-candidates §2.3 says the ring is "a small wave-equation grid, quantized": decision 8 now defaults to **unquantized inside the ring for the jump's 60 f** (still code, never a model); please point that line here |
| Pacing owner | Mark each jump's beat T on the engagement maps |
| Guardrails owner | Consider adding §3.6's likeness line ("no real person or parody of one in continuous tone or footage") to guardrails §5 |

---

## 8. Pre-lock checklist for a jump

- [ ] It has an id from §4 and one motivation (J5's shared M1/M5 is the only exception).
- [ ] The six tests pass (§3.2), and the animatic was cut both ways.
- [ ] 24–120 f, in whole beats, with both ends on the grid.
- [ ] At least 2 bars from any switch, THE PLAN, a card, a flashback door, a real line or V.O.
- [ ] In and out come from §3.3. Out is faster than in. One scar at most.
- [ ] The UI layer is pixel and untouched.
- [ ] Sound: the chip goes out on the first frame and comes back first on the snap. No sting, no whoosh, no X3 sounds.
- [ ] Mas is in it or behind it, never frozen, and never in continuous tone or footage.
- [ ] No text beyond the medium's own marks. No fact, quote, logo, masthead or date.
- [ ] Any footage has provenance and a likeness check (genai §1.5).
- [ ] Photosensitivity: at most 3 flashes in any 24 f; every pop at 80% white or less.
- [ ] The one-frame test passes at full frame **and** at phone size (§5.4, lesson 15).
- [ ] The new medium is graded within about a stop of what it replaces, and shows itself by what it bends, cuts or cools, not by its own glow (§5.4, lessons 1–2).
- [ ] No line, stroke or trail in it reads as a chart, an arrow, lightning or a logo (§5.4, lesson 5).
- [ ] 1920×1080, 24 fps, no `--scale` above 1.
- [ ] Logged in the episode's POV ledger.
