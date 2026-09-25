> **Status: v1 reference, superseded where it conflicts.** The master opening script is now [`SCRIPT.md`](SCRIPT.md) (v2.0, 2026-09-25). v2.0 changes the visual style to pixel art with motivated style switches (see `studio/INTRO_PIXEL_BRIEF.md`) and the music to a piano / orchestral / big-band blend with a jazz feel and 8-bit motifs (variations V1–V4). This file's timing, gags and text remain useful detail.

# Opening Titles: Frame-Accurate Shot Table

**0.0–30.0 s · 24 fps · 96 BPM · 15 frames/beat · 60 frames/bar · 12 bars · 720 frames**

| | |
|---|---|
| **Version** | v1.1, 2026-09-25 |
| **Built from** | [`_sources/design/final.md`](../_sources/design/final.md) §3 (shot table, name cards, build notes). Additions from [`worldcast-cast-integration.md`](../_sources/research/worldcast-cast-integration.md) §5 (THE PODIUM), with corrections from [`worldcast-flashback-map.md`](../_sources/research/worldcast-flashback-map.md) §0 and [`worldcast-critic.md`](../_sources/research/worldcast-critic.md) §E |
| **See also** | [spec.md](spec.md) (concept, rules, cards) · [cue-sheet.md](cue-sheet.md) (every audio hit by frame) · [episode-slots.md](episode-slots.md) (per-episode overrides) |

> **Style note.** Frame numbers, beats, story content and text are **style-agnostic and locked**. The *Visual* column describes the v1 look. Palettes, "cut-paper," halftone and the **Build** effort column are **placeholders until the style is chosen**: see [../bible/style-status.md](../bible/style-status.md) and [spec.md §7](spec.md#7-what-is-style-agnostic-and-what-waits-on-the-style-decision).

---

## 1. The grid

The code source of truth is `studio/src/shared/timing.ts`, which defines `FPS = 24`, `BPM = 96`, `FRAMES_PER_BEAT = 15` and `at(bar, beat) = (bar−1)·60 + (beat−1)·15`.

| Bar | Beat 1 | Beat 2 | Beat 3 | Beat 4 | Seconds at beat 1 |
|---|---|---|---|---|---|
| 1 | f0 | f15 | f30 | f45 | 0.000 |
| 2 | f60 | f75 | f90 | f105 | 2.500 |
| 3 | f120 | f135 | f150 | f165 | 5.000 |
| 4 | f180 | f195 | f210 | f225 | 7.500 |
| 5 | f240 | f255 | f270 | f285 | 10.000 |
| 6 | f300 | f315 | f330 | f345 | 12.500 |
| 7 | f360 | f375 | f390 | f405 | 15.000 |
| 8 | f420 | f435 | f450 | f465 | 17.500 |
| 9 | f480 | f495 | f510 | f525 | 20.000 |
| 10 | f540 | f555 | f570 | f585 | 22.500 |
| 11 | f600 | f615 | f630 | f645 | 25.000 |
| 12 | f660 | f675 | f690 | f705 | 27.500 |

The off-beat ("and") of any beat is its start frame + 7 (for example, the off-beat of 11.2 is **f622**). Sound effects snap to frames by rounding down. Notes stay sample-exact in MIDI.

## 2. Legend

- **Bold text** is must-read. The lint in §6 checks every must-read item.
- *Italic text* is an egg: 30 px or smaller, low contrast, never needed for the joke.
- `[SLOT]` marks a per-episode override (Ep1 content shown). `[EP3+]` marks THE PODIUM layer.
- **Build** is the v1 effort estimate: **E** easy · **M** medium · **H** hard. It will be re-estimated after the style is locked.
- All on-screen gag text is **[INVENTED]**, except typed quotes (real; see [episode-slots.md §3](episode-slots.md#3-cold-open-lines)) and the fragments on Mario's scroll (real essay phrases; see §7).

---

## 3. The shot table

| Timecode (s) · frames | Bar.beat | Visual | On-screen text | Camera / transition | Music / SFX | Build |
|---|---|---|---|---|---|---|
| 0.000–1.250 · f0–29 | 1.1–1.2 | Black. A cyan block cursor blinks on the beat (on 8 frames, off 7) at 62% x / 46% y, the exact spot the piece ends on. LCD subpixels visible. | — (VO starts under black at f24) | Locked extreme close-up; dolly-out from f15 (6.0→3.0, easeOutCubic) | Sub drone F1+C2 fades in; server hum; felt piano F5 at f0 and f15 | E |
| 1.250–2.500 · f30–59 | 1.3–1.4 | Reveal: a generic Z post composer (the UI changes per episode for non-post lines; see [spec §3.3](spec.md#33-source-fidelity-rule-for-the-cold-open-line-new-in-v11)) over a log chart: flat cyan line, a blinking dot at the knee. MAS in the left third, three-quarter view, grey hoodie, lit only by the monitor. THE ORB, chrome, at his shoulder, iris half open. Three rack LEDs blink on eighth notes. | **typed quote** `[SLOT]` · **`you are here`** | Dolly-out continues (3.0→1.15); 2° roll; 4 parallax planes | Piano F5 at f30 and f45, ducked −6 dB under the VO | M (hero rig) |
| 2.500–3.750 · f60–89 | 2.1–2.2 | The pause: the cursor blinks twice and his head tilts 2°. "unclear which side." On "side" the dot slides up the curve and off the top of the monitor. A glint in his catchlights. | (quote completes) | Slow push 1.15→1.20 | Low D♭ at f60, inside the pause (still no third) `[SLOT]`: the color note goes in each episode's longest pause | E |
| 3.750–4.375 · f90–104 | 2.3 | f94: his eyes snap to the lens. f97: the Orb's iris swivels to the lens. f99–104: its scan fan sweeps the room, and for 5 frames the "dark room" is an endless data-center cathedral. | — | Imperceptible push; anamorphic streak as the beam crosses | Piano out; pluck at f90 as the dot exits; servo f97; scan "shhk" f100 | M |
| 4.375–5.000 · f105–119 | 2.4 | Micro-smile at f107. At f112 he clicks **Post**: the line bursts into pastel token chips that stream past the lens, and the chart snaps vertical. White at f118–119 (≤80% white). | *⟨near⟩⟨ the⟩⟨ singular⟩⟨ity⟩⟨;⟩…* (the tokenizer gives the semicolon its own token) | Accelerating push 1.2→8; zoom-blur f113–119 | Knee run G5 A♭5 C6 F6 at f105/108/112/116; click f112; reverse-cymbal swell | E |
| 5.000–5.625 · f120–134 | 3.1 | **Tier 1 · 1993 · 1-bit**, 3:2 pillarbox, animated on fours. KID MAS (8) at a beige computer with no logo, model unconfirmed. **The screen faces away from us**; the staircase line climbs out of its back glow onto the wall. *A juice box on the desk that never ripples* (proposed, per the flashback map's "cup" rule). He turns to camera (match cut on the eyes). | **`1993`** · *`512×342 · 1-BIT`* | White-to-white match cut; locked | **DROP on Fm, the first minor third:** sub boom, square bass, noise hats; beeper F F F at f120/127/135 | M |
| 5.625–7.000 · f135–167 | 3.2–3.4 | **The MAS card as a 1-bit alert dialog**, 85% of frame width: pixel-Orb icon, **Cancel greyed out**. f150: a stranger's pointer clicks Cancel; bonk, nothing happens. f165: the kid clicks OK. | **`MAS MANALT`** / **`no equity.`** · `Cancel` `OK` · *title bar `age 8`* · *tooltip `this action cannot be cancelled`* | The world freezes on 3.2. Zoom-rects open over 2 frames (**v1.1: start at f133** so the dialog is fully open at f135; see lint T04). The dialog collapses f166–167. | Beeper pauses while the dialog is open; bonk f150 as a wrong-note sting; OK click and beeper C at f165 | E |
| 7.000–7.500 · f168–179 | 3.4 | The OK fires the line off the wall. A glowing 1-px **render front** chases its tip, and behind it the world re-renders as soft camcorder video, with the TPOOL screen revealed from f172. | *`upgrading… 1-bit → 240p`* | Lateral track with the tip; 12-frame wipe | Beeper F at f172; tape-start whirr f168–179 | M |
| 7.500–8.125 · f180–194 | 4.1 | **Tier 2a · 2008 · 240p.** THE SLEEVE (a faceless turtleneck sleeve; no frailty cues, per critic §D39) hands off the clicker. MAS (23) strides on in two stacked polos; the collars pop at f180 and f187. On the giant screen, TPOOL with a BETA starburst; the thread is a GPS breadcrumb ending at a pin. *A stage water bottle that never ripples* (proposed). | **`2008`** · **`TPOOL`** · *`where u at?`* · *`▶ PLAY JUN 09 2008`* | Handheld zoom with overshoot, on twos | Boom-bap kit; wobbly tape piano hook (±15 cents); hiss; D♭maj7; tuned collar pops | M |
| 8.125–9.375 · f195–224 | 4.2–4.3 | **Tier 2b · 2014, inside a generic web-player inset.** Hoodie founders holding forks and laptops hoist MAS onto a throne of laptops and ramen cups, a tiny parachute still on his back. LUAP drops a paper crown down a dotted path. The two collars re-pop at f202. | **`2014`** · **`WHY COMBINATOR`** · *crown `PRESIDENT`* · *patch `LUAP · CALLED IT. (IN AN ESSAY.)`* | 2-frame wipe in; low-angle hero shot; spring settle | Lo-fi brass stab f195; crowd "ohh"; collar re-pop f202 | M |
| 9.375–10.000 · f225–239 | 4.4 | **Tier 3, the house style** (v1: crisp cut-paper). The crown's glint becomes a candle; the frame widens to 16:9 into a candlelit dining room at dusk. GERG is already seated, typing so fast the keycaps pop like popcorn; his napkin sketch swaps to a website. MAS sits at the head, fingers steepled. The table runner is the thread, lying flat. | **`2015`** (**v1.1: holds to f247**; see lint T07) · *menu card `THE WOODROSE`* | 5-frame whip (motion blur on f225–229 only) into a table-height lateral truck: the dinner shot begins | Tape spins up to speed; mechanical-keyboard snare roll | **H** (tableau system) |
| 10.000–11.875 · f240–284 | 5.1–5.3 | **GERG FREEZE**, keycaps mid-air. The world drops to the frozen two-tone (v1: navy/cream); Gerg's accent is terminal green. f270–282: MAS, in full color and the only thing moving, plucks the floating **CTRL** key and pockets it. | **`GERG MOCKBRAN`** / **`ORG CHART: HIM.`** · *`SLEEP: DEPRECATED · PTO: 404`* | 2-frame pop (≤80% white); 3-frame punch-in 1.06→1.0; card anchored in the world, trucks off on 5.4 | **HIT on Fm at f240:** timpani, brass, low piano, 808, shutter; kick goes half-time | M |
| 11.875–12.500 · f285–299 | 5.4 | The wall behind the next seat lights into a **server cathedral**: rack pillars, LED votives, a neural-net rose window, god-rays. **ALYI** rises into cross-legged levitation; a paperclip-robot effigy ignites. | **`UNALIGNED`** (on the effigy, in frame until f339) | Truck, then tilt up | Whispered chant "FEEL" f285, "THE" f292; flame whoomph; organ swell | M |
| 12.500–14.375 · f300–344 | 6.1–6.3 | **ALYI FREEZE** on "A-G-I!". A stained-glass card drops from above; his eyes are scrolling token streams. The FEELING bar bursts out of the card into the rose window. f328–339: MAS roasts a marshmallow on the frozen fire. | **`ALYI`** / **`FEELS THE AGI.`** · *`PRODUCTS: 0 · BUNKER: YES`* ⚠ (fallback *`PRODUCTS: 0 · EFFIGIES: 1`*; see [spec §5.2](spec.md#52-card-text-exact)) | Card drops; 3% push; f340–344 flame wipe through a foreground candle | **HIT on D♭ at f300**; shouted "A-G-I!" f300/303/307; wordless choir enters | M |
| 14.375–15.000 · f345–359 | 6.4 | A round vault blast door, already swinging open: amber beacons, steam, a safety HUD ticking checkmarks. **MARIO** (curls, glasses, fleece) steps out with a finger raised. A sheet stamped `DRAFT — DO NOT PUBLISH` flutters out. **v1.1: the HUD stays legible in the frozen background through f400, clear of the card** (lint T11). | **`RED-TEAMED ✓✓✓`** · *whiteboard `BIG BLOB OF COMPUTE`* | Truck continues; beacon sweeps the lens | Two-tone klaxon on eighths; pizzicato; steam; triple chime | M |
| 15.000–16.875 · f360–404 | 7.1–7.3 | **MARIO FREEZE.** The WORD COUNT bar runs off the card and becomes a scroll unrolling down the whole table. f390–402: MAS rolls its tail into a paper telescope and peers up at the ceiling. | **`MARIO`** / **`HAS CONCERNS. HAS GPUS.`** · *`DOOM RISK ▰▰▰▰▰▰▰▰ · BUILDING IT ANYWAY ✓`* · *scroll fragments (§7)* | Card rises from bottom-left; f401–404 the scroll whips past as a paper wipe | **HIT on B♭m at f360**; klaxon cut dead; sighing violin glissando | E |
| 16.875–17.500 · f405–419 | 7.4 | Ceiling tiles burst; a **SPACEZ** booster descends on flame. Candles blow flat and every glass sloshes, **except Mas's water**. His hair whips; his face doesn't move. The neon **OPEN AI** sign swings into frame. | **`SPACEZ`** · **`OPEN AI`** (both must stay legible through bar 8; see lint T13–T14) | Tilt up, then down; seeded 6 px shake | Rocket roar ending at f419 (the boom is folded into the next hit); fuzz-guitar pickup | M |
| 17.500–19.375 · f420–464 | 8.1–8.3 | **NOLE FREEZE** at touchdown: landing legs on the tablecloth, bread basket crushed. He leans out of the hatch mid-post with a novelty check, the Tesla painting under his arm (a 2017 prop used as a tease; see spec open question 4). f435: a red stamp slams over the subtitle without covering it. | **`NOLE`** / **`NAMED IT.`** + stamp **`SUED OVER IT.`** · *check `$1,000,000,000*` `*pledged · received: $133M`* | Card slams in crooked (−8°); stamp springs 1.4→1.0 | **Biggest HIT, on C major at f420:** brass fanfare and a power chord; stamp thunk f435 tuned to C | E |
| 19.375–20.000 · f465–479 | 8.4 | **The founding.** Wide shot: the frozen crew, their cards shrunk to place cards. MAS slides the neon **N** from the end to the front (f466–473): **OPEN becomes NOPE**. "AI" lights at f474, and the sign stays lit into the next shot. **This frame is the key art.** | **`NOPE AI`** · *place card `MARIO (UDIAB) · JOINS 2016`* (corrected) · *a booster has just landed beside `DEC 2015` (verify)* | Push-in on the sign | Neon buzz; letter clunk f473; drum fill | M |
| 20.000–20.625 · f480–494 | 9.1 `[SLOT]` | **Tier 4 · 2022.** Time resumes and color floods back. Mas taps a tiny beige button on the downbeat; a radial shockwave re-skins the same set in glass and bloom. The thread becomes a glowing token stream and kinks sharply up; an odometer slams past 1,000,000. | **`CHATGTP`** (placed at the button, the shockwave's origin, so it's legible from f480) · *`low-key research preview`* · *`1,000,000 · 5 DAYS`* · *`NOV 2022`* · *`HDR · RAY-TRACED*` `*not really`* | Growing `clip-path: circle()` render front; camera jolts up the curve | **Tier 4:** full band, choir pad, sub boom, glass shimmer; odometer ratchet | M |
| 20.625–21.250 · f495–509 | 9.2 `[SLOT]` | Hard cut, desaturated. A generic five-tile video call: MAS (Vegas neon and a passing race car behind him), ALYI, NELEH, MADA, and one camera-off tile. The 1993 dialog returns in HD glass; a board pointer clicks Cancel, and this time it works. Mas's tile drops out and goes grey; the thread falls to zero. | **`FIRED.`** · *tile labels* (optional: *`THE QUIET VOTE (camera off)`*; see [episode-slots.md §8](episode-slots.md#8-easter-eggs)) | Static hard cut | **The music is fired:** every stem muted (10 ms fade); one dry piano F4 and room tone | E |
| 21.250–21.875 · f510–524 | 9.3 `[SLOT]` | Color slams back. The dialog re-pops with Cancel greyed out again. His badge flips GUEST → CEO at f518; a tiny hourglass shatters; the line snaps back up. | **`BACK.`** · *`TTEMME · 72:00:00`* | Punch-in 1.08→1.0 | **The music is rehired:** everything slams back on D♭ with a crash at f510 | E |
| 21.875–22.500 · f525–539 | 9.4 `[SLOT]` | **Transition object.** A heart avalanche, hundreds red and exactly one blue, carries the camera up; the hearts cool into the first stars of a dusk sky. | *`LETTER 745/770`* | Whip-tilt up; zoom-blur f525–531 | Celesta and glockenspiel glissando; reverse swell | M |
| 22.500–23.125 · f540–554 | 10.1 | **Skyline at dusk** (v1: isometric). **NOPEAI** is a neo-Gothic data-center cathedral in scaffolding, with a GPU-die rose window and steaming cooling towers. **MACROSOFT** pops up with its plinth running *under* NopeAI's foundation. TASYA on the roof, jangling a key ring. A **far-left hill** is established here, empty; THE PODIUM appears on it later (Ep3+). | **`MACROSOFT`** · *plinth `BELOW · ABOVE · AROUND`* | Continuous truck left and crane up to f629; each pop springs with a 2-frame overshoot and dust | Half-time 808, glitchy arps; pluck F | M |
| 23.125–23.750 · f555–569 | 10.2 | **ELGOOG / MINDDEEP** under a spinning CODE RED siren (2 revolutions/s or slower). RADNUS smiles politely, holding an extinguisher; SIMED plays speed chess against a robot arm. | **`ELGOOG`** · *`MINDDEEP`* | Pop | Pluck F; siren whoop tuned to F | E |
| 23.750–24.375 · f570–584 | 10.3 | **ATEM:** fresh "AI" letters drip over a ghosted METAVERSE. KRAM (gold chain) holds a poster (poster only; no fight imagery). | **`ATEM`** · *`KRAM vs NOLE · CAGE MATCH · CANCELED`* | Pop | Pluck F; paint drip and clack | E |
| 24.375–25.000 · f585–599 | 10.4 | **INVIDIA:** a giant graphics card stood on end. NESNEJ in a mirror-leather jacket tosses GPUs to every roof; on NopeAI's roof they pile up red-hot and sag like Dalí clocks. | **`INVIDIA`** | Pop | Pluck F; ka-ching | M |
| 25.000–25.625 · f600–614 | 11.1 | **The exes** pop up flanking NopeAI. **MISANTHROPIC**: a lighthouse of stacked essays with a SAFETY beacon and a dangling price tag; tiny MARIO waves, ADELINA holds a clipboard. **zAI**: a rocket on a gantry, NOLE with a megaphone. | **`MISANTHROPIC`** · **`zAI`** · *`COMING SOON: TRUTHGTP`* · *KORG version board ([episode-slots §7](episode-slots.md#7-running-eggs-by-episode))* | Double pop | Pluck G (the knee begins); riser starts | M |
| 25.625–26.250 · f615–629 | 11.2 | **PEEKDEEP** across the water: a small unlit building with a whale-shaped water tower and a fin circling the moat. **At f622 every rooftop edge ignites into one cyan line**: flat across the incumbents, steeper at the exes, vertical up NopeAI's spire. **`[EP3+]` At f622, THE PODIUM appears on the far-left hill** in its per-episode state ([episode-slots §5](episode-slots.md#5-skyline-state-and-the-podium)). The line runs past the hill and **never touches it**. | **`PEEKDEEP`** (legible to f650) · *`(NOT YET)`* | Quiet pop; camera settles on NopeAI. The hill must sit inside the settled frame (left edge, x ≤ 12%), clear of the title's safe area. | Pluck A♭ and a plop; **pluck C at f622** (the podium's appearance rides this pluck, **no new SFX**); riser peaks; snare roll | M |
| 26.250–28.750 · f630–689 | 11.3–12.2 | **Title slam** across the blazing rose window. The letters render up through the tiers: 1-bit f630, 240p f633, flat f636, chrome with bloom from f639. The period is THE ORB; its iris reflects the skyline upside down. A tiny Mas stands on the spire balcony; the rivals flinch. f640: the subtitle types on (≤8 frames). **`[EP3 only]`** the podium's coin-slot glint, and one coin clink at f645. | **`MR. MAS`** · **subtitle** `[SLOT]` (Ep1: `now in low-key research preview`) | 3-frame punch-in with 8 px shake, then slow push 1.00→1.03 | **Final hit at f630, F–C open fifth with no third:** choir, brass, low piano cluster, sub drop 55→35 Hz; `[EP3]` coin clink f645; celesta F6 f660 | M |
| 28.750–29.375 · f690–704 | 12.3 | **Pull-back:** the frame shrinks into Mas's monitor in the dark room. The Orb turns its iris to camera; the `you are here` dot blinks at this episode's position `[SLOT]`. | **Orb toast** `[SLOT]` (Ep1: `verified: human`) from f692 | Dolly-out 1.0→0.3 over 12 frames | Reverse whoosh and celesta F6 f690; drone returns | M |
| 29.375–30.000 · f705–719 | 12.4 | His eyes flick to the lens once more. At f705 a post notification appears, and the cursor blinks on where f0 began. End; the piece loops. | cursor | Locked | **Ding (F6 bell) at f705**; drone out by f719 | E |

---

## 4. Per-episode override map

Only these ranges change between episodes. Everything else renders once and is cached. Details per episode are in [episode-slots.md](episode-slots.md); each episode's own sheet is `../episodes/epNN/intro-slot.md`.

| Frames | What changes | Notes |
|---|---|---|
| f24–112 | Cold-open line: VO, typed text, monitor UI (post / memo / caption / transcript / email), word-timing JSON, the D♭ color-note position | Length rule: ≤16 syllables, ≤54 characters, VO inside f24–100 |
| f30–112, f690–704 | `you are here` dot position | One notch per episode |
| f480–539 | Bar 9: 9.1 headline, 9.2 "fired," 9.3 "rehired," 9.4 transition object | Headlines ≤7 glyphs (lint in [episode-slots §4](episode-slots.md#4-bar-9-the-slot)) |
| f540–689 | Skyline state: tower changes, eggs (KORG board, valuation ticker), THE PODIUM (Ep3+), SI FORCE robot vacuums (Ep10–11) | No new must-read text except the per-episode states listed |
| f640–689 | Title subtitle | ≤34 characters (≤32 recommended) |
| f692–719 | Orb toast | Escalates across the season |
| Dark-room desk and coat hook (f30–119, f690–719) | Firing tally, collar count, gold threads (Ep4+) | Eggs only |
| **f120–479** | **Nothing, except Ep12** (model-written cards; the 1993 kid blinks) | Render once and cache |

## 5. Mounts

The mounts overlap at every render front, so each seam has both sides alive.

| Mount | Frames | Contains |
|---|---|---|
| ColdOpen | f0–119 | Dark room, monitor, Orb, VO-synced type |
| Era1993 (pre-rendered) | f120–179 | 1-bit tier, the MAS dialog card |
| Era2008_14 | f165–239 | T2a stage, T2b web inset |
| Tableau | f225–494 | The dinner scene graph, four freezes, the founding |
| EpisodeSlot | f480–539 | Bar 9 per-episode content |
| Skyline | f540–719 | Towers, the roofline, **the hill layer with THE PODIUM** (Ep3+), waterfront (Ep10–11 robot vacuums) |
| Title | f630–719 | Wordmark, Orb period, subtitle |
| Bookend | f690–719 | Nests Skyline and Title in the monitor; the Orb toast |

**Ep7 exception:** its 9.2 needs a telephoto slice of the hill and the MISANTHROPIC lighthouse inside EpisodeSlot, for the HTURT meteor. That's the podium's only in-slot cameo; see [episode-slots §4](episode-slots.md#4-bar-9-the-slot).

---

## 6. Text registry and read-time lint

### 6.1 The rule
A must-read item needs **0.25 s + 0.05 s per character** of legible screen time, which is **⌈6 + 1.2·n⌉ frames** for n characters.

**Counting convention (proposed in v1.1; `final.md` left it open):**
- Count every visible glyph **except spaces**.
- An emoji, icon or checkmark counts as 1.
- A card's name and subtitle count as **one group**, because they're read together.
- The **window** runs from the first frame the item is legible (after any smear, blur or wipe-in) to the last frame before it is covered, wiped or leaves the frame.
- **Status:** PASS (margin ≥ +3) · TIGHT (0 to +2) · FAIL (negative).

A registry file generated from `timing.ts` should list every item's in/out frames and glyph count, and a CI lint should run this check on every render. The table below is the hand-computed baseline for the fixed section and Ep1.

### 6.2 Registry: fixed section plus Ep1 slot

| ID | Text | Class | Legible window | Glyphs | Needs | Has | Margin | Status / fix |
|---|---|---|---|---|---|---|---|---|
| T01 | `you are here` | must-read | f30–112 | 10 | 18 | 83 | +65 | PASS |
| T02 | typed quote (Ep1: 41 chars) | **voiced** | typed in sync with the VO, complete by f91 | — | ≥12 frames complete before Post | f91–112 = 21 | +9 | PASS. Voiced rule: the VO must end by f100. |
| T03 | `1993` | must-read | f120–134 | 4 | 11 | 15 | +4 | PASS |
| T04 | `MAS MANALT` / `no equity.` | card group | f137–165 as v1; **f135–165 with the f133 zoom pre-roll** | 18 | 28 | 29 → **31** | +1 → **+3** | TIGHT as v1 → **PASS with the pre-roll** |
| T05 | `TPOOL` + `2008` | must-read | TPOOL f172–194; 2008 f180–194 | 9 | 17 | 23 | +6 | PASS |
| T06 | `2014` + `WHY COMBINATOR` | must-read | f197–224 (after the 2-frame wipe-in) | 17 | 27 | 28 | +1 | TIGHT. Optional fix: start the wipe-in at f194. |
| T07 | `2015` | must-read | f230–239 (after whip blur) | 4 | 11 | 10 | **−1** | **FAIL → fix: `2015` rides the GERG pop and holds to f247 (18 frames, +7)** |
| T08 | `GERG MOCKBRAN` / `ORG CHART: HIM.` | card group | f242–284 | 25 | 36 | 43 | +7 | PASS |
| T09 | `UNALIGNED` | must-read | f285–339 | 9 | 17 | 55 | +38 | PASS |
| T10 | `ALYI` / `FEELS THE AGI.` | card group | f302–339 | 16 | 26 | 38 | +12 | PASS |
| T11 | `RED-TEAMED ✓✓✓` | must-read | f345–359 as v1 | 13 | 22 | 15 | **−7** | **FAIL → fix: the HUD stays legible, frozen, behind the MARIO hold (f345–400 = 56, +34). Otherwise demote it to an egg.** |
| T12 | `MARIO` / `HAS CONCERNS. HAS GPUS.` | card group | f362–400 | 25 | 36 | 39 | +3 | PASS (watch the card-rise timing) |
| T13 | `SPACEZ` | must-read | f405–464 (the wordmark stays visible on the landed booster) | 6 | 14 | 60 | +46 | PASS only if it stays visible. If it's f405–419 only, it shares 15 frames with T14 → FAIL. |
| T14 | `OPEN AI` | must-read | f405–465 (the sign stays lit) | 6 | 14 | 61 | +47 | PASS, same condition as T13 |
| T15 | `NOLE` / `NAMED IT.` + stamp `SUED OVER IT.` | card group | f422–464; stamp f437–464 | 23 (stamp 11) | 34 (stamp 20) | 43 (stamp 28) | +9 (+8) | PASS |
| T16 | `NOPE AI` | must-read | f474–494 | 6 | 14 | 21 | +7 | PASS |
| T17 | 9.1 `CHATGTP` | slot headline | f480–494 | 7 | 15 | 15 | 0 | TIGHT: it must be legible from f480 (placed at the shockwave's origin) |
| T18 | 9.2 `FIRED.` | slot headline | f495–509 | 6 | 14 | 15 | +1 | TIGHT |
| T19 | 9.3 `BACK.` | slot headline | f510–524 | 5 | 12 | 15 | +3 | PASS |
| T20 | `MACROSOFT` | skyline wordmark | f542–629 | 9 | 17 | 88 | +71 | PASS |
| T21 | `ELGOOG` | skyline wordmark | f557–629 | 6 | 14 | 73 | +59 | PASS |
| T22 | `ATEM` | skyline wordmark | f572–629 | 4 | 11 | 58 | +47 | PASS |
| T23 | `INVIDIA` | skyline wordmark | f587–629 | 7 | 15 | 43 | +28 | PASS |
| T24 | `MISANTHROPIC` + `zAI` | skyline wordmarks (double pop) | f602–629 | 15 | 24 | 28 | +4 | PASS |
| T25 | `PEEKDEEP` | skyline wordmark | f617–650 | 8 | 16 | 34 | +18 | PASS |
| T26 | `MR. MAS` | title | f630–689 | 6 | 14 | 60 | +46 | PASS |
| T27 | subtitle (Ep1: `now in low-key research preview`) | title | f640–689 (type-on ≤8 frames) | 27 | 39 | 50 | +11 | PASS. At the 34-character cap (about 30 glyphs): needs 42, +8. |
| T28 | Orb toast (Ep1: `verified: human`) | bookend | f692–719 | 14 | 23 | 28 | +5 | PASS. Longest toasts (`human (probably)`, 15 glyphs): +4. |

**Ep12 variant cards:**

| ID | Text | Glyphs | Needs | Has | Status |
|---|---|---|---|---|---|
| T04-12 | `MAS MANALT` / `human face.` | 19 | 29 | 31 with the pre-roll | TIGHT (+2). **The pre-roll is required.** |
| T08-12 | GERG / `REPORTS TO IT.` | 24 | 35 | 43 | PASS |
| T10-12 | ALYI / `FELT IT.` | 11 | 20 | 38 | PASS |
| T12-12 | MARIO / `PACED. ANYWAY.` | 18 | 28 | 39 | PASS |
| T15-12 | NOLE / `WAS RIGHT. ONCE.` + stamp `APPEALING.` | 28 | 40 | 43 | PASS (+3) |

Per-episode items (cold-open lines, bar 9 headlines, subtitles, toasts, podium text) are linted in [episode-slots.md](episode-slots.md).

### 6.3 Egg text rules
- 30 px or smaller at 1080p, low contrast, and **never required for a joke to land**. They are not linted for read time.
- They must still pass the guardrails: no private or family life, no health, no violence, no unadjudicated crimes (see [../bible/guardrails.md](../bible/guardrails.md)).
- Every glyph (▰ ▸ ✓ ⚠ ⟨⟩, hearts, the 🍓) is drawn as SVG or a sprite. No emoji fonts and no real OS UI.
- Egg values that make factual claims (dates, dollar figures, versions) need a source tag in the episode's `facts.md`.

---

## 7. Real phrases on screen (quote registry)

Real quotes appear only where marked, and they are verbatim.

| Where | Text | Source · tag |
|---|---|---|
| f30–112 (per episode) | the cold-open line | See [episode-slots §3](episode-slots.md#3-cold-open-lines) |
| f360–404 scroll (egg) | "…country of geniuses in a datacenter…" | Mario-basis essay *Machines of Loving Grace*, Oct 2024 · [K] |
| f360–404 scroll (egg) | "…machines of loving grace…" | Same essay's title · [K] |
| f360–404 scroll (egg, last line) | "…we must pace the frontier…" | Essay *We Must Pace the Frontier*, Sep 12, 2026 · [V] (`gaps.md` #5) |
| f345–359 whiteboard (egg) | `BIG BLOB OF COMPUTE` | The "big blob of compute" hypothesis, a widely reported phrase · [K], verify |
| f540–554 plinth (egg) | `BELOW · ABOVE · AROUND` | Echoes "below them, above them, around them" · [K], re-verify (`final.md` §7) |
| f480–494 (egg) | `low-key research preview` | The phrase used for the ChatGPT launch · [K] |

---

## 8. Build notes (P0: these change the edit)

1. **One timing source.** `studio/src/shared/timing.ts` exists and defines the grid. Still to write: a `beats.json` export from it, which drives both Remotion and the audio scripts in `audio/` (see [cue-sheet.md §5](cue-sheet.md#5-production-routes)). `final.md` calls this file `beats.ts`; the real file is `timing.ts`.
2. **Text registry and lint** (§6) as code: every text item has in/out frames and a glyph count, and CI fails on any FAIL.
3. **Mounts overlap at every render front** (§5).
4. **Render passes: PENDING STYLE.** In v1, pass 1 is clean vector plus grain, weave and vignette. Halftone is masked to frozen actors only, never full-frame, because Mas stays in color. Pass 2 runs shaders only on f113–119, f180–239, f480–689 and the monitor region in f690–719. Re-plan after the style is locked.
5. **Rendering details (v1):**
   - The 1-bit tier is built from Bayer-pattern fills at native resolution.
   - Every glyph is drawn as SVG.
   - Flames are an 8-frame hand-drawn loop.
   - THE PODIUM is a small sprite with a gold state, a dark state and a plaque state. It has **no rig**: it never moves more than one beat.
6. **Render cache:** f120–479 renders once and is reused for Ep1–11. Ep12 re-renders it.
7. **Photosensitivity audit.** Every render gets an automated luminance check. At most 3 flashes in any 24-frame window, and every pop is ≤80% white. Frames to check by hand as well:
   - f112–120: zoom-blur, the white, the match cut
   - f240, f300, f360, f420: 2-frame card pops, 60 frames apart
   - f480: the shockwave
   - f495 and f510: the desaturation cut and the slam, which sit in one 24-frame window
   - f622: roofline ignition, plus the podium in Ep3+
   - f630: the title slam and shake
   - **Ep7 only:** the meteor streak inside f495–509, kept ≤80% white with no impact flash
8. **Estimate (v1 look):** about 25–32 working days for the Ep1 intro, then 0.5–1 day per later episode, and about 2 days for Ep12. Re-estimate after the style is locked.

## 9. Changes from `design/final.md` §3
- **Fixed:** T04, T07 and T11 timing (lint fixes); the "UN dome" is now THE NU; Mario's place card; SPACEZ and OPEN AI must stay legible through bar 8.
- **Removed:** the `Thu, Apr 22, 1993` menu-bar egg (critic §E42).
- **Added:**
  - The hill layer and THE PODIUM at f622 (Ep3+), with no new SFX; the Ep3 coin clink at f645; the Ep7 in-slot meteor.
  - Proposed juice-box and water-bottle "cup" eggs.
  - Medium-specific monitor UIs for non-post lines.
- **Flagged:** `BUNKER: YES` and the Tesla painting (see [spec.md §9](spec.md#9-open-questions-for-the-head-writer--showrunner)).
