# MR. MAS: Opening Titles, Master Script

**"THE CURVE: everything scales."** The 30-second main title, written as a shootable A/V screenplay.

| | |
|---|---|
| **Title** | *MR. MAS*, opening titles |
| **Version** | **v2.0 (pixel / jazz)**, 2026-09-25 |
| **Status** | **Master script: the single source of truth for the opening.** Where another intro doc disagrees with this file, this file wins. |
| **Runtime** | 30.0 s = 720 frames at 24 fps (f0–719). The 2 s disclaimer card that follows every intro ([guardrails §5](../bible/guardrails.md#5-legal-hygiene)) is not counted. |
| **Grid** | 96 BPM, 4/4 · 15 frames per beat · 60 frames per bar · 12 bars of 2.5 s · `at(bar, beat) = (bar−1)·60 + (beat−1)·15` in `studio/src/shared/timing.ts`. **Swung 2nd eighth = beat + 10 frames.** Straight off-beat = beat + 7 (used only at f622 and f712). |
| **Picture** | Pixel art, adventure-game structure. Native 480×270, 4× nearest-neighbour to 1920×1080, indexed palettes (`studio/src/shared/pixel/palettes.ts`). **Whole-pixel motion only:** the camera cuts or scrolls in whole pixels. Nothing rotates or scales, and nothing blurs. |
| **Sound** | A score between piano, orchestral and big band (brass as accents only), with a jazz feel and 8-bit chip motifs as the identity. **V1 "Chip Chamber Jazz"** is scripted here. V2–V4 notes appear only where they differ. |
| **Supersedes** | The **visual-style and music-style** content of [spec.md](spec.md), [shot-table.md](shot-table.md) and [cue-sheet.md](cue-sheet.md) (all v1.1), and of [`final.md`](../_sources/design/final.md) §3–4, wherever they conflict with this file. That covers the cut-paper / 240p / HDR tiers, every dolly, zoom, punch-in, roll and motion blur, and the 808 / boom-bap / cassette / fuzz-guitar score. **Their timing, gags, text and per-episode content carry forward here.** [episode-slots.md](episode-slots.md) stays the research and sourcing file for the per-episode slots. |
| **Binding inputs** | [`studio/INTRO_PIXEL_BRIEF.md`](../../studio/INTRO_PIXEL_BRIEF.md) (the visual decision and the switch plan) · the audio direction of 2026-09-25 · [guardrails](../bible/guardrails.md) · [naming](../bible/naming.md) (the Trump-equivalent is **DLANOD J. RUMPT, "President RUMPT"**) |

### Style tags
| Tag | Meaning |
|---|---|
| **[BASE]** | The show's look: the master palette with hand-built light ramps. Lighting states inside it (the f480 bloom, the grey call light in 9.2) are **not** switches. |
| **[1-BIT]** | 1993 only. Black #0E0E10 and paper #E9E6DA, with stepped fill patterns. |
| **[EARLY-WEB16]** | 2008–14. Sixteen web-safe colours with GIF-era ordered dither. |
| **[2-TONE FREEZE]** | The name-card freeze: navy N4 and cream P2. **Excluded from the freeze:** Mas, the cyan thread, and anything Mas is holding. |
| **[GLYPH]** | An object turns into tokens (a dissolve), or re-forms from them. |
| **[GLYPH-MASKED]** | A window (the scan cone, the Orb's iris) through which the world is seen as tokens. Outside the window the frame stays BASE. |
| **[LEDGER]** | Money: a green ledger line-screen, masked to one prop, 6 frames or fewer. |
| *(reserved)* [TERMINAL] | The machine's point of view. **Not used in the Ep1 cut.** It is proposed for Ep12 only (§8). |

### Audio tags
| Tag | Meaning |
|---|---|
| **MUS** | Score. V1 unless marked; `V2:` `V3:` `V4:` notes appear only where they differ. |
| **SFX** | Sound effects (synthesized and tuned to the key where pitched) |
| **VO** | Voice-over: Mas only |
| **BLIP** | Per-character pixel text-box voices: short synthesized tones, pitched to the chord |
| **CHANT** | The group chant at the Alyi card |
| **PAD** | The wordless close-harmony vocal pad under the title hit |

### Other notation
- **bar.beat:** `5.1` is bar 5, beat 1. `+n` means n frames after that beat, and `end` means through the beat's last frame.
- **ON SCREEN "…"** is literal on-screen text, never speech. **Bold** marks must-read text, linted in §5. *Italic* marks an egg: 7 px native or smaller (≤28 px at 1080p), low contrast, never needed for a joke.
- **CAM** is the camera. **k** is the name-card clock (frames since the card started, as in `ui.ts nameCard`).
- **[SLOT]** marks per-episode content (Ep1 shown). **[EP3+]** marks the podium layer. **[PROPOSAL]** needs sign-off. Source tags follow [guardrails §3](../bible/guardrails.md#3-fact-handling-tags): [P✓] [V] [H] [K] [INVENTED].

---

## 1. Contents
1. Contents
2. [The opening in one paragraph](#2-the-opening-in-one-paragraph)
3. [The A/V script](#3-the-av-script)
4. [Dialogue and VO sheet](#4-dialogue-and-vo-sheet)
5. [On-screen text registry and easter eggs](#5-on-screen-text-registry-and-easter-eggs)
6. [Name cards](#6-name-cards)
7. [Style-switch log](#7-style-switch-log)
8. [Per-episode slot (Ep1–12)](#8-per-episode-slot-ep112)
9. [Production notes](#9-production-notes)

---

## 2. The opening in one paragraph

Thirty seconds, one cyan line. We open inside Mas's monitor: a cursor blinks on the beat, and a post types itself a word ahead of his soft, close voice, *"near the singularity; unclear which side."* Below it, a dot marked `you are here` sits at the knee of a flat chart. Cut to the room: he looks straight at us, and for five frames his Orb's scan beam shows what the room really is, a cathedral made of tokens. He posts. The frame goes to paper white and comes back as 1993, one bit deep: a kid at a beige computer whose screen we never see, confirming a dialog that reads `no equity.` while Cancel stays greyed out. From there **the palette scales with the curve.** A glowing render front upgrades 1-bit to sixteen early-web colours for the 2008 keynote and the 2014 throne of laptops, then to the show's full pixel palette at a candlelit dinner in 2015. At THE WOODROSE, time stops four times. Each founder freezes into navy and cream behind an adventure-game portrait card, while Mas, the only thing still in colour, walks through the frozen room carrying a glass of water that never ripples. He pockets what he likes, and in the last move he shifts one neon letter so that OPEN becomes NOPE. Bar 9 is this episode's news. In Ep1 he is fired: the music is fired with him, his video tile blows away as tokens, and a beat later both come back. Hearts cool into stars, a pixel skyline of rival labs rises one tower per beat, their rooftops ignite into the same cyan line, and the line shoots up the spire into **MR. MAS**, whose period is the Orb. Then we cut behind him: the whole title was on his screen. He glances back at us, the Orb's eye flickers with tokens for two frames, and the cursor sits where we came in. **The score scales the same way.** One chip voice becomes a swung trio, then a chamber ensemble with big-band punches and a muted trumpet at dusk. It ends on a chord with no third: *unclear which side.*

**The line's journey, in whole pixels:** cursor → the chart's flat line and dot → the 1993 staircase on the wall (1-bit jaggies) → the TPOOL GPS breadcrumb → the 2014 dotted motion path → the Woodrose table runner → the 2022 token stream → the roofline → the spire → the title.

---

## 3. The A/V script

### 3.0 Rules in force for every scene
1. **Mas never freezes.** In every freeze he stays in full colour and keeps moving.
2. **The curve never freezes either.** The cyan thread (#3FE6FF family) is excluded from every remap except the era palettes, where it takes that era's nearest cyan.
3. **Whatever Mas picks up takes his colour** at the moment he touches it: the CTRL keycap, the scroll's tail, the neon N.
4. **Mas's cup never ripples**, in any era. From f255 he carries his water glass through the dinner.
5. **Screens face away from us in wide shots.** We see a screen only in an insert (his point of view), or in the final reverse angle.
6. **Whole-pixel only.** Held drawings are the idiom; light does the emotional work. Integer shakes are 3 px or less.
7. **Photosensitivity:** at most 3 flashes in any 24-frame window, and every pop is 80% white or less. The audit frames are listed in §9.5.
8. **RUMPT never appears in bars 1–8** and never gets an intro card. His only presence is THE PODIUM on the skyline hill, from Ep3 (§8).

### 3.1 Audio variation key
The grid, the hits, the knee motif, the VO, the chant, the PAD and all SFX are identical in every variation. The mute at f495–509 is structural, so it's identical too.

| Variation | Balance | How it differs from V1 |
|---|---|---|
| **V1 "Chip Chamber Jazz"** (recommended) | piano 35 · orchestra 30 · big band 10 · chip 25 | As scripted below. Chamber strings, winds, harp, celesta and timpani; a trio (piano, upright bass, brushes); brass accents at eight moments; chip on every statement of the motif. |
| **V2 "Orchestral Noir, Chip Heart"** | orchestra-led | Strings, low winds, harp and timpani carry the harmony, and piano recedes to colour. **The chip plays every statement of the knee** (the "heart"). Brass is limited to horns and trombones, with no sax shout. Pizzicato bass walks instead of upright. The muted-trumpet line runs longer (bars 10–11) and becomes the noir centre. |
| **V3 "Pixel Swing"** | chip and band forward | The chip leads the melody over a small swing band. Swing starts in bar 3 (the chip hook itself swings). Brushes switch to sticks at f240. The hits are shout chords, and the walking bass runs through bars 4–10. In bar 10 the muted trumpet trades two-beat phrases with the chip lead. |
| **V4 "Piano & Pixels"** | piano, chip, sub only | Solo piano and chip. The hits are piano clusters with chip arpeggios and sub. The piano's left hand walks, and its right hand takes the muted-trumpet line in octaves. **The PAD stays**: it's the only other colour. |

**Harmonic plan (all variations):** open fifths with **no third** in bars 1–2 (the D♭ colour note in the pause is ♭6). **Fm(add9) at f120** is the first chord with a third, the moment the story "picks a side." Bar 4 moves D♭maj7(♯11) → Fm11. The card hits spell the slow knee: **Fm9 (f240) · D♭maj7(♯11) (f300) · B♭m11 (f360) · C7(♯9) (f420)**. Bar 9 goes Fm9 → silence → D♭maj9. Bar 10 goes Fm9 → D♭maj9. Bar 11 builds over an F pedal, and **f630 is a quartal stack C–F–B♭–E♭ over F, with no third.** The knee motif is one bar of eighths, **F F F F G A♭ C F.**

**Where it swings:** bar 4, the dinner (bars 5–8), bar 9, and the skyline's bar 10. **Where it plays straight:** the cold open, 1993 (the machine doesn't swing yet), the bar-11 build and the title.

---

### 3.2 Scene 1: COLD OPEN (f0–119) · moment `mcoldopen`
**Sets.**
- **INSERT:** Mas's monitor, full frame at native resolution. A generic dark-mode Z post composer (no real logo or UI), with a flat log chart below it.
- **ROOM:** the dark room at night. Mas sits at his desk in 3/4 front view (`masDesk`), facing his monitor at frame-left; its screen faces away from us. THE ORB floats at his shoulder, frame-right of his head, slightly above eye level. A server rack with LEDs, a glass of water on the desk. The only light is monitor cyan.

| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 0.000–0.625 · f0–14 · 1.1 | **[BASE] INSERT.** Black screen. A 4×8 px cyan block cursor sits at (298, 124) native, which is 62% x / 46% y: the spot the loop returns to. It blinks on the beat, on f0–7 and off f8–14. CAM locked. | **MUS:** felt piano F5 at f0. Sub drone F1+C2 (open fifth, no third) fades in over f0–29. `V2:` celli and basses hold the fifth instead of the sub; harp harmonic F5. `V3:` the F5 is a 12.5%-duty chip square doubled by felt piano. `V4:` piano alone; low F1+C2 under the pedal, no sub.<br>**SFX:** server hum in, at −30 dB. |
| 0.625–1.000 · f15–23 · 1.2–+8 | **[BASE] INSERT.** The composer steps up from black in 3 palette steps (f15–17): a tiny cowlick avatar, the empty draft field and a [Post] button. Below it, the flat chart: a cyan line along the bottom, and a blinking dot at the knee with its label, ON SCREEN **"you are here"** (legible from f18; the Ep1 dot sits at x = 0.50 of the chart [SLOT]). At f18 the first letters type. The cursor is on f15–22. | **MUS:** piano F5 at f15.<br>**SFX:** none. |
| 1.000–2.417 · f24–57 · 1.2+9–1.4+12 | **[BASE] INSERT.** The line types, keyed to the VO's word-timing JSON and running **6 frames ahead of the voice**: he reads back what he just typed. "near the singularity;" types over f18–49, and the cursor waits after the semicolon (f50–57). ON SCREEN (voiced) **"near the singularity;"** [SLOT] | **VO MAS (f24–57):** *"near the singularity;"* Soft and close-mic; he's reading his own post aloud to an empty room. No word is stressed.<br>**MUS:** piano F5 at f30 and f45, ducked −6 dB under the VO. |
| 2.417–3.000 · f58–71 · 1.4+13–2.1+11 | **[BASE] INSERT.** The semicolon pause. Nothing types, and the cursor blinks once (on f60–67). At f64 typing resumes: "unclear…" | **VO:** the pause, room tone only (f58–71).<br>**MUS:** low piano D♭2 at f60: the colour note in the longest pause [SLOT]. The drone holds the F–C fifth, still with no third. `V2:` the D♭ is on bass clarinet. |
| 3.000–3.750 · f72–89 · 2.1+12–2.2 | **[BASE] INSERT.** "unclear which side." types over f64–83. From f84 the whole line is up: ON SCREEN **"near the singularity; unclear which side."** On "side" (f84–89) the dot climbs the curve in whole-pixel steps and leaves through the top edge of the screen at f89. | **VO MAS (f72–91):** *"unclear which side."* "Side" is left hanging, neither falling nor rising, and its tail runs over the cut. No breath follows. |
| 3.750–4.375 · f90–104 · 2.3 | **[BASE] ROOM**, cut on the pluck at f90. Mas's face is lit cyan from frame-left, his hands on the keys. The Orb's iris is half open. Rack LEDs blink on straight eighths. Eggs: the desk tally *`III`*, two popped collars on the coat hook, the water glass with its dead-flat line. At f93 the head swaps to the 'turn' drawing, and at f94 to 'camera': **his eyes snap to the lens.** f97–99: the Orb's iris swivels to the lens in 3 drawings. f99: the Orb's scan fan, a thin cyan cone, opens and sweeps left to right. **f100–104 [GLYPH-MASKED]:** inside the cone only, the room is an endless data-center cathedral made of tokens, rack pillars receding to a vanishing point. Outside the cone the room stays BASE. At f105 the cone is gone. CAM locked. | **MUS:** the piano stops. Pizzicato C6 doubled by a chip pluck at f90 as the dot exits. Under the glimpse there's only the drone: **no sting.**<br>**SFX:** Orb servo at f97 (a tuned chip whirr on C6); scan "shhk" at f100 (the chip noise channel, a filtered 5-frame sweep). |
| 4.375–4.667 · f105–111 · 2.4–+6 | **[BASE] ROOM.** He's still looking at us. At f107, the micro-smile: **the mouth moves one pixel** (the 'smile' stamp). At f110 his near hand lifts to the mouse (a drawing swap). CAM locked. | **MUS:** the knee run begins: G5 (f105), A♭5 (f108). Felt piano is doubled an octave up by a 25%-duty chip pulse, so the machine takes the tune. (This A♭ is a passing tone; the first chord with a third is f120.) `V2:` celesta with chip. `V3:` chip lead, piano under.<br>**SFX:** reverse cymbal swell, f105–119. |
| 4.667–5.000 · f112–119 · 2.4+7–end | **[BASE → 1-BIT paper] INSERT**, cut on the click. At f112 the pointer clicks [Post] and the button inverts for one frame. f113–117: the line bursts into pastel token chips, one per token: ⟨near⟩⟨ the⟩⟨ singular⟩⟨ity⟩⟨;⟩⟨ unclear⟩⟨ which⟩⟨ side⟩⟨.⟩ (*the semicolon gets its own chip*). They fly past the frame edges in accelerating whole-pixel steps (4 → 16 px per frame). At f114 the chart snaps vertical (2 drawings). f116–119: a stepped Bayer fade in 4 steps up to the 1-BIT paper #E9E6DA, about 79% luminance, inside the ≤80% rule. | **MUS:** C6 (f112) and F6 (f116), piano with chip.<br>**SFX:** the Post click at f112; the swell peaks at f119. |

### 3.3 Scene 2: 1993 (f120–179) · moment `meras`
**Set.** **[1-BIT]** in a 3:2 pillarbox (405×270, centred, with 37/38 px black bars): the proportions of the era's screens. KID MAS, age 8 (`masKid`), sits at a beige computer with no logo; the model is never named. We see him in 3/4 front, with the screen facing away from us and its back glow on the wall. **Animated on fours** (a new drawing every 4 frames), except the dialog and the pointers.

| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 5.000–5.625 · f120–134 · 3.1 | **[1-BIT]** Hard cut from the paper white. The kid watches the away-facing screen. f124: 'turn' drawing. f128: 'camera' drawing, **the same unblinking stare as f94** (a match on the eyes). From the screen's back glow a **staircase line**, the curve as 1-bit jaggies, climbs the wall. Egg: *a juice box on the desk, its straw dead still* [PROPOSAL]. ON SCREEN **"1993"** (date card, top-left inside the pillarbox, f120–134). f133–134: two 1-px dithered zoom rectangles expand from the kid's screen. CAM locked. | **MUS: DROP on Fm(add9)**, the first chord with a third: the story picks a side. Sub boom on F1, chip square bass on F2, chip noise hats on straight eighths. The chip beeper hook plays F (f120), F (f127), F (f135). The piano's left hand lays the Fm9 voicing underneath, with A♭ in the middle. **The chip plays straight: the machine doesn't swing yet.** `V2:` a timpani F and low strings on the drop, with the chip hook on top. `V3:` the hook already swings (F f120, F f130, F f135), with brushes. `V4:` piano Fm9, the chip hook and sub. |
| 5.625–6.250 · f135–149 · 3.2 | **[1-BIT]** f135: the world freezes (the kid's drawing holds) and the alert dialog is fully open, about 340 px wide (`ui.ts alertDialog`): a 2-px frame, a hard drop shadow, a 16×16 **pixel-Orb icon** where the "!" would be, and the title bar egg *`age 8`*. ON SCREEN **"MAS MANALT"** (display face) / **"no equity."**, with the buttons **"Cancel"** (greyed with a 50% dither) and **"OK"** (the default, double border). At f146 a stranger's arrow pointer slides in from frame-right: a pointer with no hand and no owner. | **MUS:** beeper F at f135, then **the chip rests while the dialog is open.** The piano lets Fm9 ring, and the sub holds. |
| 6.250–6.875 · f150–164 · 3.3 | **[1-BIT]** At f150 the stranger's pointer clicks Cancel. **Nothing happens:** the greyed button doesn't even invert. The tooltip egg *`this action cannot be cancelled`* shows f151–164. The pointer withdraws over f156–160. | **SFX: bonk at f150,** a chip wrong-note sting: B4 against the F pedal (a tritone), 60 ms, dry. Otherwise silence. |
| 6.875–7.000 · f165–167 · 3.4–+2 | **[1-BIT]** At f165 the kid's own pointer clicks OK, and OK inverts for one frame. f166–167: the dialog collapses back into the screen along the zoom rectangles, in reverse. | **SFX:** the OK click at f165.<br>**MUS:** beeper C5 at f165. |
| 7.000–7.500 · f168–179 · 3.4+3–end | **[1-BIT → EARLY-WEB16]** The OK fires the staircase line off the wall toward frame-right. A **glowing 1-px render front** (vertical, with a 5-px glow; `transitions.renderFront`) chases the line's tip across the frame in 12 frames. Behind it the world re-renders in EARLY-WEB16, and **the pillarbox bars retract to full 16:9: the frame widens with the era.** From f172 the TPOOL keynote screen is revealed behind the front. No label announces the upgrade. CAM locked; the front moves, the camera doesn't. | **MUS:** beeper F at f172. **The chip gains voices as the front passes:** a rising arpeggio F–A♭–C–E♭–F (f168/170/172/174/176), with a second pulse voice and a triangle bass entering by f179. A brushed-snare swell (f172–179) brings in the trio. `V2:` harp glissando up with a string swell. `V3:` a brush fill with the chip arpeggio. `V4:` a piano run up with the chip arpeggio. |

### 3.4 Scene 3: 2008–2014 (f180–239) · moment `meras`
**Set.** **[EARLY-WEB16]**, full 16:9. The **2008** keynote stage (`masStage`), then the **2014** WHY COMBINATOR throne (`masThrone`). The last row is the bridge into 2015.

| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 7.500–8.125 · f180–194 · 4.1 | **[EARLY-WEB16]** The 2008 keynote stage. THE SLEEVE (a faceless turtleneck sleeve and a hand only, entering from the frame-left edge, with no frailty cues) hands off the clicker. MAS, 23, strides on in two stacked polos, and the collars pop at f180 and f187 (2 drawings each, with a 1-px hop). On the giant screen: ON SCREEN **"TPOOL"** with a BETA starburst, and the thread as a GPS breadcrumb (a dotted cyan line) ending at a pin; egg *`where u at?`*. ON SCREEN **"2008"** (date card, f180–194). Egg: *the stage water bottle on the lectern, dead still* [PROPOSAL]. CAM: a locked wide; the foreground audience silhouettes scroll 1 px every 2 frames. | **MUS:** the trio lands, **swung**: brushes (kick on 1 and 3), upright bass, and piano playing the knee as the bar-4 hook, F f180 · F f190 · F f195 · F f205 · G f210 · A♭ f220 · C f225 · F f235. The chip doubles the hook's top line an octave up. Harmony: D♭maj7(♯11) over f180–209, then Fm11 over f210–239. `V2:` pizzicato strings and harp carry the hook, with no kit. `V3:` a full swing kit, with the chip on the hook. `V4:` piano hook and chip only.<br>**SFX:** the collar pops at f180 and f187 (tuned chip blips on F6 and C6). |
| 8.125–9.375 · f195–224 · 4.2–4.3 | **[EARLY-WEB16]** **Hard cut** to 2014, WHY COMBINATOR. Hoodie founders holding forks and laptops (founders only, never islanders) hoist MAS, 29, in a hoodie with a tiny parachute pack still on his back, onto a throne of laptops and ramen cups (a 3-drawing lift, f198–206). At f202 the two collars re-pop out of the hoodie's neck. LUAP (fleece; egg patch *`LUAP · CALLED IT. (IN AN ESSAY.)`*) drops a paper crown that hops down a dotted, Flash-era motion path on twos (f205–219) and lands on Mas's head at f220; crown egg *`PRESIDENT`*. ON SCREEN **"2014"** and **"WHY COMBINATOR"**. The sign uses the #FF6600/#FFCC66 dither pair so it reads near the approved #FF7F2A; **it is never flat #FF6600.** CAM: a locked low angle. | **MUS: big-band accent #1 at f195:** a cup-muted brass stab (2 trumpets, 2 trombones) on D♭maj9, short, with a swung release. The hook continues (G f210, A♭ f220).<br>**SFX:** the crowd's "ohh" (f195–205; synthetic group placeholder); the collar re-pop at f202; the paper crown's flutter (f205–219); a soft landing tick at f220. |
| 9.375–10.000 · f225–239 · 4.4 | **[EARLY-WEB16 → BASE]** A **match cut on the crown's 2×2 glint**: it holds its screen position while the frame around it becomes THE WOODROSE, and the glint is now a candle flame on the dining table. f225–229: a 5-frame render front sweeps out from the flame and upgrades EARLY-WEB16 to BASE, the house palette. A candlelit private dining room at dusk (egg: the menu card *`THE WOODROSE`*). GERG, already seated at Mas's right hand, types so fast his keycaps pop like popcorn (keycap sprites hop on their own curves). At f232 his napkin sketch swaps to a website (2 drawings). MAS sits at the head of the table, frame-left, fingers steepled, his water glass by his hand. The table runner is the cyan thread, lying flat. The background guests HALO and THE OTHER PAUL sit at the near side with their backs to us (no cards). ON SCREEN **"2015"** (date card, f230–247). CAM locked on the head of the table (camera x = 0). | **MUS:** the hook's last notes, C (f225) and F (f235), fall on the piano. Chamber strings (a quartet plus bass) enter with a swell, f225–239. `V2:` the string swell only. `V3:` a drum fill with a trumpet pickup. `V4:` a piano run.<br>**SFX:** Gerg's mechanical-keyboard typing, gridded to swung 16ths, crescendos into a brushed-snare roll (f230–239). |

### 3.5 Scene 4: THE WOODROSE, the four freezes (f240–464) · moments `mdinner1` (f225–359) and `mdinner2` (f345–479)
**Set.** One adventure-game room, **560×300 native**, with a long table in 3/4 top-down view and seats on both sides. The 480×270 camera window pans in whole pixels from x = 0 to x = 80 across the dinner, and tilts up 30 px for the rocket.

**Positions (world x):**
- Mas's head chair about 30; GERG on the near side at about 90.
- ALYI on the far side at about 180. The back wall behind him becomes the server cathedral, with the rose window high up; the effigy stands in front of it at about 215.
- MARIO on the far side at about 290, with a round vault door in the back wall behind him.
- The far end at about 430: the landing spot, with ceiling tiles above. The neon sign hangs over x ≈ 400–540.

**Staging.** Figures are about 50 px tall; the acting lives in the card portraits. Mas walks at about 2–3 px per frame (a 6-drawing walk on twos), and the camera follows him at 1 px per frame only while he walks. **Carded founders stay frozen (navy and cream) for the rest of the dinner; the rest of the room thaws at each beat-4 pickup.**

**Default card placement:**
- GERG: right half.
- ALYI: upper right.
- MARIO: rising from the bottom-left.
- NOLE: upper left.

Every card must stay clear of the founder's face, Mas's gag and any must-read prop. The full card template is in §6.1.

#### 3.5a GERG (f240–284)
| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 10.000–10.208 · f240–244 · 5.1–+4 | **[2-TONE FREEZE] GERG FREEZE.** At f240 every pixel except Mas and the thread remaps to navy and cream. f240 is the pop frame (cream lifted one step, ≤80% white), with a 2-px integer shake over f240–241. The keycaps freeze mid-air. f240–242: the card's portrait window opens in 3 steps on the right half: Gerg head-down, lit from below, with his green accent surviving only in his name. At f243 ON SCREEN **"GERG MOCKBRAN"** cuts in (the 14-px display face, terminal green #39FF88); at f244 the accent rule draws. | **MUS: HIT on Fm9 at f240:** a low piano cluster, timpani F, a short big-band stab, and a chip arpeggio F–A♭–C–G in 16ths. Then the band drops to walking bass and ride, swung, while the strings sustain the hit chord. **The harmony freezes; the bass keeps walking, like Mas.** `V2:` an orchestral hit (timpani, low brass, strings), with pizzicato walking bass. `V3:` a full-band shout chord; sticks on the ride from here. `V4:` a piano cluster with chip arpeggio and sub; the left hand walks.<br>**SFX:** the freeze "latch" at f240 (a square-wave click over a low thump). |
| 10.208–11.250 · f245–269 · 5.1+5–5.2 | **[2-TONE FREEZE]** The tagline types on at 2 characters per frame (f246–253): ON SCREEN **"ORG CHART: HIM."** From f254 the stat row egg, *`SLEEP: DEPRECATED · PTO: 404`* (7 px, low contrast). The `2015` card holds to f247. At f255 Mas, the only thing moving, in full colour, unsteeples his hands; his glass stays level. CAM locked. | **BLIP GERG:** one blip per word, at f246 ("ORG"), f248 ("CHART:") and f251 ("HIM."). A fast square click, 25 ms, pitched on the chord at F5, A♭5 and C6.<br>**MUS:** the walking bass goes F–G–A♭–B♭ in quarters, the ride plays swung eighths, and the strings hold Fm9. |
| 11.250–11.875 · f270–284 · 5.3 | **[2-TONE FREEZE] Mas's gag.** He reaches over (an arm drawing at f270) and plucks the floating **CTRL** keycap out of the air (f274). It takes his colour the instant he touches it, and he pockets it in his hoodie (f278–282). The card text holds to f284. CAM locked. | **BLIP (item take) at f278:** a square C6 → F6, 40 ms per note. It's the pickup sound for everything Mas takes.<br>**MUS:** the walking bass continues, with a brush pickup over f282–284. |

#### 3.5b ALYI (f285–344)
| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 11.875–12.500 · f285–299 · 5.4 | **[BASE; Gerg masked 2-TONE]** Time resumes around Gerg: the room steps back to BASE in 2 frames (f285–286), while Gerg stays navy and cream and his card closes in 2 steps. Mas stands, glass in hand, and walks toward Alyi's side, the camera following at 1 px per frame (x 0 → 40 by f327). The back wall behind ALYI's seat lights panel by panel into a **server cathedral**: rack-pillar columns, LED votives (palette-cycled), a neural-net rose window, and god-rays built as stepped dither bands. The spires are antenna masts, **with no religious symbols.** ALYI rises into cross-legged levitation, 1 px every 2 frames (f288–299), with a rack pillar always cropping his left edge. At f290 a paperclip-robot effigy ignites in front of the cathedral (an 8-frame hand-pixelled flame loop), labelled ON SCREEN **"UNALIGNED"** (legible from f296). | **CHANT:** a whispered *"feel…"* at f285 and *"…the…"* at f292. Four to six synthetic stock voices, layered and detuned, whispered close-mic and panned wide. **No single leader voice.**<br>**SFX:** a flame whoomph at f290.<br>**MUS:** a chamber-organ (harmonium) swell on a D♭ pedal (f285–299); the walking bass continues. |
| 12.500–13.125 · f300–314 · 6.1 | **[2-TONE FREEZE] ALYI FREEZE on "A-G-I!"** (the f300 pop and a 2-px shake). **Template break:** his card is a stained-glass lancet window that drops from the top of frame in 3 whole-pixel steps (f300–302), upper right. In its portrait his eyes are scrolling token streams: 3-px ticks drawn in BASE, **deliberately not a GLYPH switch.** At f303 ON SCREEN **"ALYI"** (ember #FF6A1A); f306–312 types **"FEELS THE AGI."**; from f313 the stat row egg *`PRODUCTS: 0 · EFFIGIES: 1`* (the fallback; `BUNKER: YES` is held pending a ruling, §9.7). | **MUS: HIT on D♭maj7(♯11) at f300:** low piano, timpani D♭, organ, a short brass stab and a chip arpeggio. Then walking bass and ride, with the strings holding.<br>**CHANT:** a shouted *"A-!"* at f300, *"G-!"* at f303 and *"I!"* at f307, the same 4–6 voices at full voice, dry.<br>**BLIP ALYI:** at f306, f309 and f311, one per word. A low triangle with a slow 120-ms decay, mixed under the chant. |
| 13.125–13.667 · f315–327 · 6.2–+12 | **[2-TONE FREEZE] Template break:** the FEELING meter under the stat row fills past its end. Its fill pixels burst out of the card and climb the rose window's tracery along a whole-pixel path (f315–322), leaving the window lit. Mas, in colour with his glass, reaches the frozen effigy fire (his walk ends at f327). CAM follows him to x = 40. | **MUS:** walking bass and ride; a rising chip glissando follows the meter up the tracery (f315–322). |
| 13.667–14.167 · f328–339 · 6.2+13–6.3+9 | **[2-TONE FREEZE] Mas's gag.** He holds a marshmallow on a fork (*the fork is from WHY COMBINATOR*) to the frozen fire. The flame stays navy and cream **and toasts it anyway:** the marshmallow steps from white to gold to brown in 3 drawings (f330, f334, f338). He blows on it once, at f339. CAM locked. | **MUS:** walking bass and brushes. **SFX:** none; the frozen fire makes no sound. |
| 14.167–14.375 · f340–344 · 6.3+10–end | **[BASE; Gerg and Alyi masked 2-TONE]** Alyi's card closes in 2 steps (f340–341). The room thaws except the two carded founders, and Alyi still hangs in mid-air in navy and cream. Mas eats the marshmallow and walks on toward the vault; the camera resumes at 1 px per frame. | **MUS:** a brush fill into the Mario pickup; the bass walks up toward B♭. |

#### 3.5c MARIO (f345–404)
| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 14.375–15.000 · f345–359 · 6.4 | **[BASE]** A round vault blast door in the back wall is already swinging open (4 drawings, f345–352), with amber beacons (palette-cycled, 2 revolutions per second or slower) and steam puffs (a 4-frame loop). On the wall beside it, upper right, a safety HUD ticks checkmarks at f348, f351 and f354: ON SCREEN **"RED-TEAMED ✓✓✓"**. **It stays legible, frozen, through f400, clear of the card.** MARIO (curls, glasses, an ink-blue fleece; **never red**) steps out with a finger raised (f352). Mas, walking on the far side of the table, arrives beside the vault. Eggs: a sheet stamped *`DRAFT — DO NOT PUBLISH`* flutters out; a whiteboard reads *`BIG BLOB OF COMPUTE`*; inside the vault, *`$1.5B LIBRARY FINE — PAID`*, sacks stencilled *`COMPUTE (RENTED FROM NOLE)`*, and a *`NO ADS`* neon beside a Big Game ticket. | **SFX:** a two-tone klaxon on straight eighths (F4/C5), f345–359; steam hiss; three check chimes at f348, f351 and f354 (chip F6, G6, A♭6: **the knee, climbing**).<br>**MUS:** pizzicato strings on the klaxon's off-beats; the bass walks up to B♭. |
| 15.000–15.750 · f360–377 · 7.1–7.2+2 | **[2-TONE FREEZE] MARIO FREEZE** (the f360 pop and shake). **Template break:** his card rises from the bottom-left edge in 3 whole-pixel steps (f360–362) on a **parchment plate (#E9DCC0) with ink-blue type (#1F3A93).** His accent needs the light plate to read. At f363 ON SCREEN **"MARIO"**; f366–377 types **"HAS CONCERNS. HAS GPUS."**. The stat row egg reads *`DOOM RISK ▰▰▰▰▰▰▰▰ · BUILDING IT ANYWAY ✓`*. The HUD stays readable in navy and cream. | **MUS: HIT on B♭m11 at f360:** low piano, timpani B♭, strings, a short brass stab and a chip arpeggio. **The klaxon is cut dead at f360.** A solo violin sighs down a minor third, quiet, with portamento (f362–380).<br>**BLIP MARIO:** at f366, f368, f373 and f375, one per word. A soft triangle, 40 ms, **each followed by a smaller echo blip 4 frames later: a sub-concern** (a sound egg [INVENTED]). |
| 15.750–16.250 · f378–389 · 7.2+3–end | **[2-TONE FREEZE] Template break:** the WORD COUNT bar runs off the card and becomes a **paper scroll unrolling down the whole table**, toward frame-right at 8 px per frame. Eggs, in real essay phrases at 7 px: *"…country of geniuses in a datacenter…"*, *"…machines of loving grace…"*, and on the last line *"…we must pace the frontier…"*, followed by a tiny price tag [PROPOSAL]. Mas steps over the scroll. | **MUS:** walking bass and ride.<br>**SFX:** a paper-unroll swish, f378–389. |
| 16.250–16.792 · f390–402 · 7.3–+12 | **[2-TONE FREEZE] Mas's gag.** On the far side of the table, above the card's top edge, he picks up the scroll's tail (it takes his colour), rolls it into a paper telescope, and peers up at the ceiling (f394–402): **exactly where the rocket will come through.** CAM locked at x = 60. | **BLIP (item take)** at f392.<br>**MUS:** the bass walks B♭–B–C toward the next hit. |
| 16.792–16.875 · f403–404 · 7.3+13–end | **[2-TONE FREEZE]** Mario's card closes in 2 steps. Mas lowers the telescope. | **MUS:** a brush fill.<br>**SFX:** a low rumble begins overhead. |

#### 3.5d NOLE (f405–464)
| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 16.875–17.500 · f405–419 · 7.4 | **[BASE; Gerg, Alyi and Mario masked 2-TONE]** The room thaws. CAM tilts up 30 px in whole pixels (f405–409) to the ceiling. The tiles burst and each hops on its own curve, and a **SPACEZ** booster descends on a 4-frame flame loop. CAM tilts back down with it (f410–419), with a seeded 3-px integer shake over f414–419. The candles blow flat (2 drawings). **Every glass on the table sloshes** (3 drawings each, offset), **except Mas's.** His is composited after the shake, and its water line stays dead flat. His cowlick whips (a 3-drawing spring), but his face doesn't move. The neon sign swings into frame on its chains (4 drawings, f405–411) and hangs lit: ON SCREEN **"OPEN AI"** (legible from f412). The booster's wordmark, ON SCREEN **"SPACEZ"** (legible from f410), stays in frame through bar 8. The rocket hits furniture only. | **SFX:** the rocket roar, f405–419; its boom folds into the f420 hit. Tile clatter, and a chorus of sloshing glasses.<br>**MUS: big-band accent:** a trumpet-section rip up to C (f414–419), the pickup into the shout. `V2:` horns and low strings crescendo. `V3:` a full-band rip with a snare fill. `V4:` a piano glissando with a chip riser. |
| 17.500–18.125 · f420–434 · 8.1 | **[2-TONE FREEZE] NOLE FREEZE at touchdown** (the f420 pop and shake). The landing legs are on the tablecloth and the bread basket is crushed flat. NOLE leans out of the hatch mid-post, a phone in one hand and a novelty check in the other (egg *`$1,000,000,000*`*). **Template break:** his card slams in from frame-left in 2 steps (f420–421) and lands **crooked**. The frame is drawn with a stair-stepped 1:8 tilt, not rotated, and sits upper left, clear of the sign, the booster and the check. At f423 ON SCREEN **"NOLE"** (rocket red #E0301E); f426–430 types **"NAMED IT."**. | **MUS: THE BIGGEST HIT at f420, on C7(♯9)**, whose E natural pulls home to F. **Big-band accent #2, the only full shout** (trumpets, trombones, saxes), with low piano, timpani C, sub and a chip arpeggio. Then walking bass and ride.<br>**BLIP NOLE:** at f426 and f429, a bright sawtooth bark, 35 ms, with a small up-bend on the second. |
| 18.125–18.750 · f435–449 · 8.2 | **[2-TONE FREEZE]** At f435 a red stamp slams onto the card under the subtitle without covering it (a 1-frame, 1-px kick): ON SCREEN **"SUED OVER IT."**. **f444–449 [LEDGER, masked to the check], optional, 6 frames or fewer:** the novelty check alone renders as a green line-screen engraving, and in that register its fine print is readable: egg *`*pledged · received: $133M`*. At f450 it drops back to navy and cream. Mas, in colour, walks the last stretch toward the sign, under the booster's legs. | **SFX:** the stamp thunk at f435, tuned to C (low piano C1 with a tom). **The LEDGER beat is silent.**<br>**MUS:** walking bass and ride. |
| 18.750–19.375 · f450–464 · 8.3 | **[2-TONE FREEZE] Mas's gag.** Below the sign he lifts his glass and sips (f450–458). Every other glass on the table is frozen mid-slosh; his surface is dead flat. He lowers it at f462. The card text holds to f464. | **MUS:** walking bass; a drum fill over f460–464. |

### 3.6 Scene 5: THE FOUNDING (f465–479) · moment `mdinner2`
| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 19.375–19.750 · f465–473 · 8.4–+8 | **[BASE room; the four founders masked 2-TONE]** Nole's card closes (f465–466) into a hand-pixelled place card at his seat, and now each carded founder has one: *`GERG`*, *`ALYI`*, *`MARIO (UDIAB) · JOINS 2016`* (egg, corrected) and *`NOLE`*. The room thaws, but the four founders stay frozen in navy and cream. The composition takes in the whole table, from Gerg at frame-left to the booster at frame-right (camera x = 80). At f466 Mas reaches up and unhooks the **N** from the end of OPEN. The sign loses power (its tubes drop to their unlit ramp), and the N takes his colour. f467–472: he carries it along a whole-pixel path to the front of the word. At f473 it clunks into place. | **SFX:** neon buzz, f465–474; the item-take blip at f466; the letter clunk at f473.<br>**MUS:** a drum fill, f465–479, with the bass on C. |
| 19.750–20.000 · f474–479 · 8.4+9–end | **[BASE room; founders 2-TONE]** "NOPE" relit at f473, and "AI" lights at f474: ON SCREEN **"NOPE AI"**, now in full colour like Mas. **KEY ART:** four frozen founders in navy and cream under a full-colour neon NOPE AI, with Mas in colour beneath it, glass in hand. Egg: *`DEC 2015`* on a booster leg (verify). The sign stays lit into bar 9. CAM locked. | **SFX:** a neon "tink" at f474.<br>**MUS:** the fill resolves into f480. |

### 3.7 Scene 6: EPISODE SLOT, Ep1 shown (f480–539) · [SLOT] · moment `mfinale`
| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 20.000–20.625 · f480–494 · 9.1 | **[BASE, bloom]** 2022. Time resumes, and the four founders' colour floods back in 2 frames. On the downbeat, Mas taps a tiny **beige** button on the table (the 1993 beige): ON SCREEN **"CHATGTP"**, printed on the button itself, which is the shockwave's origin, so it's legible from f480. A 1-px ring expands from the button (f480–488), and behind it the room relights one ramp step brighter. Every colour steps up its own family ramp, and highlights are capped at ≤80% white: **the palette blooms.** The thread lifts off the table as a glowing token stream and kinks sharply upward; at f486 the kink jolts the frame up 4 px, in whole pixels. Eggs: an odometer on the button's base slams past *`1,000,000 · 5 DAYS`*; *`low-key research preview`*; *`NOV 2022`*. The `NOPE AI` sign stays lit. | **MUS:** the full ensemble on Fm9, swung: piano, strings, walking bass, ride and chip. **No brass yet.** `V2:` an orchestral tutti with chip. `V3:` the band with a chip lead. `V4:` piano, chip and sub.<br>**SFX:** the shockwave at f480 (a sub boom, a chip noise up-sweep and a celesta shimmer); the odometer ratchet in chip ticks, f482–492. |
| 20.625–20.833 · f495–499 · 9.2–+4 | **[BASE, grey light state]** A hard cut (in Ep6 only, the picture cut lands at f494). A generic five-tile video call, with no real app UI, lit only by its own grey screen light: every material sits on its lowest-chroma ramp step. It's a lighting state, not a new palette. The tiles: MAS (behind him, *Vegas neon and a passing race car* [K]), ALYI, NELEH, MADA, and one camera-off tile (egg *`THE QUIET VOTE (camera off)`* [PROPOSAL]). ON SCREEN **"FIRED."** (display face, lower band, f495–509). f495–497: the 1993 dialog re-opens over the grid, redrawn in the BASE UI theme with the same layout and text, **and this time Cancel is not greyed out.** At f499 a board pointer clicks Cancel, **and it works** (the button inverts for one frame). | **MUS: THE MUSIC IS FIRED at f495.** Every stem mutes with a 10-ms fade. One dry piano F4 and room tone remain, on the unmuted bus. (V2–V4 are identical.)<br>**SFX:** none. **The click is silent.** |
| 20.833–21.250 · f500–509 · 9.2+5–end | **[GLYPH, masked to Mas's tile]** f500–507: Mas's tile dissolves into tokens, cyan glyphs on the grey call, that blow away to frame-right (`glyphDissolve`, wind [4, −1]). f508–509: his tile is an empty grey rectangle, and the thread along the tile row falls to zero. `FIRED.` holds to f509. | **Silence:** the dry F4 rings out over room tone. The dissolve makes no sound. |
| 21.250–21.875 · f510–524 · 9.3 | **[GLYPH → BASE]** On the downbeat, colour slams back. The dialog re-pops (f510–512) **with Cancel greyed out again.** Mas's tile re-forms: the tokens fly home and snap back into BASE pixels (`glyphDissolve` in reverse, f510–514). At f515 a tiny hourglass shatters (egg *`TTEMME · 72:00:00`*). At f518 his badge flips from GUEST to CEO (2 drawings; egg). The thread snaps back up. ON SCREEN **"BACK."** (f510–524). | **MUS: THE MUSIC IS REHIRED at f510.** Everything slams back on D♭maj9 with a crash cymbal and **big-band accent #3**, a short shout stab. The walking bass resumes. `V3:` a 2-beat shout chorus. `V4:` a piano cluster with chip and crash.<br>**SFX:** the hourglass shatter at f515 (small); the badge flip at f518 (a chip blip). |
| 21.875–22.500 · f525–539 · 9.4 | **[BASE] The transition object.** A heart avalanche, hundreds of red 5×5 hearts and **exactly one blue**, pours up out of the call grid and carries the camera up (a vertical whole-pixel scroll accelerating from 2 to 12 px per frame). As the hearts rise they cool from red to rose to pale gold to star white, and they shrink by drawing substitution (5×5 → 3×3 → 1×1) into the first stars of a dusk sky. Egg: *`LETTER 745/770`* in the grid's corner. | **MUS:** a celesta and glockenspiel glissando upward in D♭ lydian, doubled by a chip arpeggio.<br>**SFX:** a reverse cymbal swell into f540. |

### 3.8 Scene 7: SKYLINE (f540–629) · moment `mfinale` · bosses in `studio/src/shared/pixel/cast/bosses.ts`
**Set.** **[BASE]** A pixel isometric skyline at dusk: a 720×300 native panorama with 3 parallax layers (the sky fixed, the water at half speed, the roofs at full speed). The camera scrolls right 1 px per frame and cranes up 1 px every 3 frames, settling on NOPEAI at f629.

**Tower pops.** A tower **pops** by rising from below its ground line in 3 whole-pixel drawings, with a 2-px overshoot and a 4-frame dust puff; nothing scales. Each boss is a 16–28 px rooftop sprite with one motion loop of 2–4 drawings. **Tower wordmarks are must-read; person names are egg-size plates.** The far-left hill sits inside the settled frame at x ≤ 57 px (12%), clear of the title's safe area.

| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 22.500–23.125 · f540–554 · 10.1 | The heart-stars settle into the sky and the frame lands on the skyline. **NOPEAI** stands at centre: a neo-gothic data-center cathedral in scaffolding, with a GPU-die rose window and steaming cooling towers (4-frame steam loops); on its spire, the valuation ticker egg *`$86B`* [K, verify]. **MACROSOFT** pops (f540–542, settled by f543), with its plinth running under NopeAI's foundation (egg *`BELOW · ABOVE · AROUND`* [K, re-verify]). TASYA on the roof jangles a key ring (2 drawings on fours). The far-left hill is established, empty in Ep1–2. ON SCREEN **"MACROSOFT"** (from f543). | **MUS:** a chip pluck on F5 doubled by pizzicato F (f540). Upright walking bass and brushes, swung, f540–599. **THE MUTED-TRUMPET MOMENT:** a Harmon-muted trumpet (stem out) plays a lazy, swung counter-line over bar 10. It holds C5 over f540–564, touches B♭4 on the swung "and" of 10.2 (f565), sits on A♭4 over f570–584, and falls off from D♭5 over f585–599. **It's the only horn melody in the piece.** Chords: Fm9 (f540–569), then D♭maj9 (f570–599). `V2:` the line runs on through bar 11, over harp and low strings. `V3:` the trumpet trades 2-beat phrases with a chip lead. `V4:` the piano's right hand plays it in octaves. |
| 23.125–23.750 · f555–569 · 10.2 | **ELGOOG** pops (settled by f558), with *`MINDDEEP`* beneath it (egg), under a CODE RED siren: a palette-cycled beacon turning at 2 revolutions per second or slower. RADNUS smiles politely, holding an extinguisher; SIMED plays speed chess against a robot arm (2 drawings). ON SCREEN **"ELGOOG"**. | **MUS:** chip pluck F at f555.<br>**SFX:** a siren whoop tuned to F, one cycle. |
| 23.750–24.375 · f570–584 · 10.3 | **ATEM** pops (settled by f573). Fresh "AI" letters drip (3-frame drips) over a ghosted METAVERSE. KRAM (gold chain) holds up a poster: egg *`KRAM vs NOLE · CAGE MATCH · CANCELED`*, a poster only, with no fight imagery. ON SCREEN **"ATEM"**. | **MUS:** chip pluck F at f570.<br>**SFX:** a paint drip and clack. |
| 24.375–25.000 · f585–599 · 10.4 | **INVIDIA** pops (settled by f588): a giant graphics card stood on end. NESNEJ, in a mirror-leather jacket with palette-cycled highlights, tosses GPUs to every roof along whole-pixel arcs. On NopeAI's roof they pile up red-hot and sag like Dalí clocks (3 drawings). ON SCREEN **"INVIDIA"**. | **MUS:** chip pluck F at f585.<br>**SFX:** a register "ka-ching," synthesized and tuned to F6 (not a sample). |
| 25.000–25.625 · f600–614 · 11.1 | **The exes double-pop** on either side of NopeAI (settled by f603). **MISANTHROPIC** (brick #B8573A) is a lighthouse of stacked essays with a palette-cycled SAFETY beacon and a dangling price tag; tiny MARIO waves, and ADELINA holds a clipboard. **zAI** is a rocket on a gantry, with NOLE holding a megaphone. Eggs: a banner *`COMING SOON: TRUTHGTP`*, and a split-flap board reading *`KORG 1`* [K, verify] above the fixed banner *`KORG 5: NEXT QUARTER`*. ON SCREEN **"MISANTHROPIC"** and **"zAI"**. | **MUS:** chip pluck G at f600: **the knee begins.** Bar 11 plays straight, as the band squares up for the title. The walking bass gives way to an F pedal. A riser starts: string tremolo crescendo, a chip noise sweep, and a suspended-cymbal roll. |
| 25.625–25.917 · f615–621 · 11.2–+6 | Across the water, **PEEKDEEP** pops quietly (settled by f618): a small unlit building with a whale-shaped water tower and a fin circling the moat (a 4-frame loop); egg *`(NOT YET)`*. ON SCREEN **"PEEKDEEP"** (legible to f650). | **MUS:** chip pluck A♭ at f615.<br>**SFX:** a water plop. A snare roll begins at f615. |
| 25.917–26.250 · f622–629 · 11.2+7–end | On the straight "and" of 11.2, **every rooftop edge ignites into one cyan line** (#3FE6FF). A 1-px line races along the roofs from left to right (f622–627), flat across the incumbents and steeper at the exes, then runs vertically up NopeAI's spire (f628–629) and off the top of frame. **[EP3+]** At f622 THE PODIUM appears on the far-left hill in this episode's state, lit by the same ignition. **The line runs past the hill and never touches it.** The camera settles on NopeAI (f629). | **MUS:** chip pluck C at f622, the knee's leap. The riser peaks; the snare roll continues. **[EP3+]** The podium rides this pluck; **no new SFX.** |

### 3.9 Scene 8: TITLE (f630–689) · moment `mfinale`
| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 26.250–26.667 · f630–639 · 11.3–+9 | **TITLE SLAM** across NopeAI's blazing rose window: ON SCREEN **"MR. MAS"**, a hand-pixelled display wordmark with caps about 40 px tall. **The period is THE ORB**, a 20-px chrome sphere with a cyan iris. **The letters render up through the intro's palettes, masked to the wordmark:** [1-BIT] f630–631 → [EARLY-WEB16] f632–633 → [BASE] chrome ramp from f634. The title scales itself in four frames. A 3-px integer shake runs f630–632. A tiny Mas (8 px) stands on the spire balcony, and every rooftop boss flinches (1 drawing, f630–633). The Orb's iris reflects the skyline upside down, hand-pixelled and flipped, so **NopeAI's spire points into the ground.** From f634 the tower wordmarks drop one light step; they stay readable, but the title owns the frame. | **MUS: THE FINAL HIT at f630, quartal, with NO third.** A sub drop from 55 to 35 Hz. Low piano F1+C2 with F2–B♭2–E♭3 above. The chamber orchestra sustains C–F–B♭–E♭. **Big-band accent #4, the last brass:** a quartal fp swell. A chip arpeggio F5–B♭5–E♭6–F6 in straight 16ths rings out by f660. `V2:` an orchestral tutti, trombones only for brass. `V3:` the band shouts the quartal stack, with chip. `V4:` a piano quartal cluster with chip arpeggio and sub.<br>**PAD:** the wordless close-harmony vocal pad enters at f630: four voices on "oo," F3–B♭3–C4–E♭4 (**no A, no A♭**), sustained. |
| 26.667–27.500 · f640–659 · 11.3+10–11.4 | The subtitle types on under the wordmark in the 7-px lowercase face, 4 characters per frame (f640–647): ON SCREEN **"now in low-key research preview"** [SLOT]. The rose window palette-cycles slowly, one step every 4 frames. **[EP3 only]** The podium's coin-slot glint at f645. | **PAD** holds; the chip arpeggio decays. The subtitle types silently.<br>**[EP3 only] SFX:** a coin clink on C7 at f645 (dry, hard left, −18 dBFS peak, under 80 ms). |
| 27.500–28.750 · f660–689 · 12.1–12.2 | The hold. At f660 the Orb period's catch-light glints (a 1-frame, 2-px sparkle). The rose window keeps cycling. On the balcony, tiny Mas sips from his glass (f670–676): **he still never freezes.** | **MUS:** celesta F6 at f660, answered by a chip echo on the swung "and" (f670). **PAD** holds and begins its release at f686. |

### 3.10 Scene 9: BOOKEND (f690–719) · moment `mfinale`
**Set.** **[BASE]** The dark room from the **reverse angle**: behind Mas's shoulder (the `pixeladv` back view). His monitor, at frame centre-right, is **visible for the first time.** It shows the title card in miniature, hand-pixelled at monitor size (not downsampled). The monitor is placed so that the composer's cursor falls at (298, 124) native, the f0 position. THE ORB floats at his shoulder, nearer the camera, as a sphere of about 32 px.

| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 28.750–29.375 · f690–704 · 12.3 | **[BASE]** A hard cut, and the reveal: **we were on his screen.** The mini title glows on the monitor while Mas sits with his back to us. The Orb turns its iris to camera (3 drawings, f690–694). At f692 the Orb's toast pops up beside it in the BASE UI panel, in lowercase mono: ON SCREEN **"verified: human"** [SLOT]. | **SFX:** a reverse whoosh at f690.<br>**MUS:** celesta F6 at f690. The sub drone F1+C2 (the open fifth) returns. **PAD** releases over f690–704.<br>**BLIP ORB:** the toast chime at f692, a sine bell from F6 to C7, 120 ms. **The Orb never speaks.** |
| 29.375–29.667 · f705–711 · 12.4–+6 | **[BASE]** At f705 the mini title gives way to a small post notification (not must-read), and the screen clears to black by f709. Mas turns his head to us over his shoulder in 3 drawings: back (f705–706), lost profile (f707–708), then **one eye on the lens** (f709). **f705–706 [GLYPH-MASKED, the Orb's iris]:** for 2 frames the iris shows the skyline in tokens, then it settles back to its BASE iris at f707. | **SFX: DING at f705**, an F6 bell (chip bell with celesta): the post has gone out. The drone continues. |
| 29.667–30.000 · f712–719 · 12.4+7–end | **[BASE]** The monitor is black except for the cyan cursor at the f0 position. Its blink stays on the beat phase (on f709–712, off f713–719), so **it blinks on again at f0: the loop.** Mas holds his look, and the Orb's toast holds. At f716 the room steps down one light level. | The ding's tail and the drone are out by f719: **the loop point.** |

---

## 4. Dialogue and VO sheet
**Casting (placeholder):** synthetic stock voices only. **No cloning, no impressions built from real audio, and no accent humour for anyone** ([guardrails X10 and §5](../bible/guardrails.md#5-legal-hygiene)). Mas is the only character with a voice in the intro. The founders speak in BLIPs, and the Orb speaks only in chimes and toast text. **RUMPT is never voiced in the intro, and the intro contains no political audio.**

| # | Type | Speaker | Line (as heard or typed) | Frames | Delivery | Source tag |
|---|---|---|---|---|---|---|
| D1 | VO | MAS | *"near the singularity;"* | f24–57 | Soft and close-mic, reading his own post aloud to an empty room. No word is stressed; the pace of a lunch order. Stock-voice speed about 0.85–0.9. | **[V]** A real post from Jan 2025, recast as Mas's. It's the season tagline, and it falls outside Ep1's window on purpose. |
| D2 | VO | MAS | *(the semicolon pause)* | f58–71 | A real pause, with room tone. The VO is edited as two clips (starting f24 and f72), so the pause is exact. | — |
| D3 | VO | MAS | *"unclear which side."* | f72–91 | "Side" is left hanging, neither falling nor rising. No breath and no blink after it. | **[V]** The same post |
| D4 | TYPED | MAS (composer) | near the singularity; unclear which side. | Typed f18–83, running 6–8 frames ahead of the VO; complete f84–89; posted f112 | Verbatim, in his real lowercase | **[V]** |
| D5 | CHANT | A group of 4–6, the cathedral's unseen congregation (no leader voice) | *"feel…"* / *"…the…"* / *"A-"* *"G-"* *"I!"* | Whispered at f285 and f292; shouted at f300, f303 and f307 | The whisper is close and wide. The shout is dry, in unison, with no single voice on top. | **[V, reported]** The Atlantic's reporting on the 2022 party chant. It isn't a dated quote card. |
| D6 | GROUP | The 2014 crowd | *"ohh"* | f195–205 | Short and impressed | [INVENTED] |
| D7 | BLIP | GERG | types `ORG CHART: HIM.` | f246 · f248 · f251 | A fast square click, 25 ms, pitched F5, A♭5, C6 | [INVENTED] card text |
| D8 | BLIP | ALYI | types `FEELS THE AGI.` | f306 · f309 · f311 | A low triangle with a slow 120-ms decay, under the chant | [INVENTED] card text, echoing the reported chant |
| D9 | BLIP | MARIO | types `HAS CONCERNS. HAS GPUS.` | f366 · f368 · f373 · f375 | A soft triangle, 40 ms, plus an echo blip 4 frames later (a sub-concern) | [INVENTED] |
| D10 | BLIP | NOLE | types `NAMED IT.` | f426 · f429 | A sawtooth bark, 35 ms, with an up-bend on the second | [INVENTED], grounded in **[V]** Feb 17, 2023: "…which is why I named it 'Open' AI…" |
| D11 | BLIP | THE ORB | pops `verified: human` | f692 | A sine bell from F6 to C7, 120 ms | [INVENTED] prop text |
| D12 | BLIP | Mas's pickups (item take) | *(no text)* | f278 (CTRL) · f392 (the scroll's tail) · f466 (the N) | A square C6 → F6, 40 ms per note | — |
| D13 | PAD | Four wordless voices | *"oo"* | f630–704 (release from f686) | Close harmony F3–B♭3–C4–E♭4, with no third | — |

**Silent on-screen text boxes:** the 1993 dialog appears whole, and the system's voice is the beeper and the bonk. The `SUED OVER IT.` stamp gets the thunk. The slot headlines and the title subtitle make no sound.

---

## 5. On-screen text registry and easter eggs

### 5.1 The rule and the counting convention
A must-read item needs **0.25 s + 0.05 s per character** on screen, which is **⌈6 + 1.2·n⌉ frames**.
- Count every visible glyph **except spaces**. An icon, a checkmark or the Orb period counts as 1.
- A card's name and subtitle count as **one group.** A stamp counts with its group and is also checked on its own.
- The window runs from the first frame the item is fully legible (after any type-on, pop or scroll settles) to the last frame before it is covered, closed or leaves the frame.
- **Status:** PASS means margin ≥ 0. A margin of 0 to +2 is shown as *TIGHT*. FAIL means a negative margin.
- **Voiced text** (T02) is checked by the VO rule instead: spoken inside f24–100.

### 5.2 Registry: fixed section and the Ep1 slot
| ID | Text | Class | In → out | Glyphs | Needs (s → f) | Has | Margin | Status |
|---|---|---|---|---|---|---|---|---|
| T01 | `you are here` | must-read | f18 → f89 | 10 | 0.75 → 18 | 72 | +54 | PASS |
| T02 | `near the singularity; unclear which side.` [SLOT] | **voiced** | typed f18–83; complete f84–89 and again at f112 | 36 | (VO rule) | on screen 72 frames while typing | — | **PASS.** The VO ends at f91 (≤ f100), and total exposure (72) exceeds the 50 the read-time rule would need. |
| T03 | `1993` | must-read | f120 → f134 | 4 | 0.45 → 11 | 15 | +4 | PASS |
| T04 | `MAS MANALT` / `no equity.` | card group | f135 → f165 | 18 | 1.15 → 28 | 31 | +3 | PASS (needs the zoom-rect pre-roll at f133–134) |
| T04b | `Cancel` · `OK` | must-read (the gag needs them) | f135 → f165 | 8 | 0.65 → 16 | 31 | +15 | PASS |
| T05 | `TPOOL` | must-read | f176 → f194 (after the front passes) | 5 | 0.50 → 12 | 19 | +7 | PASS |
| T05b | `2008` | must-read | f180 → f194 | 4 | 0.45 → 11 | 15 | +4 | PASS |
| T06 | `2014` + `WHY COMBINATOR` | must-read | f195 → f224 (hard cut, no wipe) | 17 | 1.10 → 27 | 30 | +3 | PASS |
| T07 | `2015` | must-read | f230 → f247 | 4 | 0.45 → 11 | 18 | +7 | PASS |
| T08 | `GERG MOCKBRAN` / `ORG CHART: HIM.` | card group | f243 → f284 | 25 | 1.50 → 36 | 42 | +6 | PASS |
| T09 | `UNALIGNED` | must-read | f296 → f344 | 9 | 0.70 → 17 | 49 | +32 | PASS |
| T10 | `ALYI` / `FEELS THE AGI.` | card group | f303 → f339 | 16 | 1.05 → 26 | 37 | +11 | PASS |
| T11 | `RED-TEAMED ✓✓✓` | must-read | f354 (third tick) → f400 | 13 | 0.90 → 22 | 47 | +25 | PASS (stays frozen and legible behind the Mario hold) |
| T12 | `MARIO` / `HAS CONCERNS. HAS GPUS.` | card group | f363 → f402 | 25 | 1.50 → 36 | 40 | +4 | PASS |
| T13 | `SPACEZ` | must-read | f410 → f464 | 6 | 0.55 → 14 | 55 | +41 | PASS |
| T14 | `OPEN AI` | must-read | f412 → f465 | 6 | 0.55 → 14 | 54 | +40 | PASS |
| T15 | `NOLE` / `NAMED IT.` + stamp `SUED OVER IT.` | card group | f423 → f464 | 23 | 1.40 → 34 | 42 | +8 | PASS |
| T15s | stamp `SUED OVER IT.` alone | stamp | f435 → f464 | 11 | 0.80 → 20 | 30 | +10 | PASS |
| T16 | `NOPE AI` | must-read | f474 → f494 | 6 | 0.55 → 14 | 21 | +7 | PASS |
| T17 | 9.1 `CHATGTP` [SLOT] | slot headline | f480 → f494 | 7 | 0.60 → 15 | 15 | 0 | PASS *(TIGHT: it must be legible on f480 at the button)* |
| T18 | 9.2 `FIRED.` [SLOT] | slot headline | f495 → f509 | 6 | 0.55 → 14 | 15 | +1 | PASS *(TIGHT)* |
| T19 | 9.3 `BACK.` [SLOT] | slot headline | f510 → f524 | 5 | 0.50 → 12 | 15 | +3 | PASS |
| T20 | `MACROSOFT` | wordmark | f543 → f629 | 9 | 0.70 → 17 | 87 | +70 | PASS |
| T21 | `ELGOOG` | wordmark | f558 → f629 | 6 | 0.55 → 14 | 72 | +58 | PASS |
| T22 | `ATEM` | wordmark | f573 → f629 | 4 | 0.45 → 11 | 57 | +46 | PASS |
| T23 | `INVIDIA` | wordmark | f588 → f629 | 7 | 0.60 → 15 | 42 | +27 | PASS |
| T24 | `MISANTHROPIC` + `zAI` | wordmarks (double pop) | f603 → f629 | 15 | 1.00 → 24 | 27 | +3 | PASS |
| T25 | `PEEKDEEP` | wordmark | f618 → f650 | 8 | 0.65 → 16 | 33 | +17 | PASS |
| T26 | `MR. MAS` (the Orb is the period) | title | f630 → f689 | 6 | 0.55 → 14 | 60 | +46 | PASS |
| T27 | subtitle `now in low-key research preview` [SLOT] | title | f647 (typed) → f689 | 27 | 1.60 → 39 | 43 | +4 | PASS |
| T28 | Orb toast `verified: human` [SLOT] | bookend | f692 → f719 | 14 | 0.95 → 23 | 28 | +5 | PASS |

**Ep12 variant cards** (the model-written set from [ep12 gags §4](../episodes/ep12/gags.md); this replaces the older set in spec §5.4, see §9.6):

| ID | Text | Glyphs | Needs | Has | Status |
|---|---|---|---|---|---|
| T04-12 | `MAS MANALT` / `you.` | 13 | 22 | 31 | PASS (+9) |
| T08-12 | `GERG MOCKBRAN` / `ORG CHART: US.` | 24 | 35 | 42 | PASS (+7) |
| T10-12 | `ALYI` / `FELT IT.` | 11 | 20 | 37 | PASS (+17) |
| T12-12 | `MARIO` / `HAS CONCERNS. (READ.)` | 24 | 35 | 40 | PASS (+5) |
| T15-12 | `NOLE` / `NAMED IT. (NOTED.)` + stamp `sued over it.` | 31 | 44 | 42 as built for Ep1 | **FAIL (−2) → fix:** in Ep12 the window opens in 2 steps, the name lands at f422, and the close starts at f467, giving f422–466 = 45 frames (+1, PASS, *TIGHT*) |

Per-episode lint for the other slots (the headlines, the subtitles and the toasts) is in §8.

### 5.3 Easter eggs (not must-read, not linted)
These are 7 px native or smaller and low contrast. Every one must pass the [guardrails](../bible/guardrails.md), and any egg that states a fact needs a line in the episode's `facts.md`.

| Frames | Egg | Tag |
|---|---|---|
| f90–111, f690–719 | Desk tally `III` (the first two marks faint); two popped collars on the coat hook; the water glass's dead-flat line | Per episode (§8.3) |
| f113–117 | The tokenizer gives the semicolon its own chip, `⟨;⟩` | [INVENTED] |
| f120–167 | A juice box whose straw never moves | [PROPOSAL] the cup rule |
| f135–165 | Title bar `age 8`; tooltip `this action cannot be cancelled`; a pixel-Orb icon in a 1993 dialog (an omen) | [INVENTED] |
| f180–194 | `where u at?` on TPOOL's screen; the BETA starburst; a stage water bottle that never ripples | [INVENTED] · [PROPOSAL] |
| f195–224 | Crown `PRESIDENT`; LUAP's patch `LUAP · CALLED IT. (IN AN ESSAY.)`; the tiny parachute on Mas's back | [INVENTED] (the essay pays off in Ep4) |
| f225–239 | Menu card `THE WOODROSE`; HALO and THE OTHER PAUL as background guests | Guests per Brockman's blog [V] |
| f254–284 | `SLEEP: DEPRECATED · PTO: 404`; the pocketed CTRL key | [INVENTED] |
| f313–339 | `PRODUCTS: 0 · EFFIGIES: 1`; the paperclip-robot effigy; the WHY COMBINATOR fork | The effigy is Atlantic reporting [V]; `BUNKER: YES` is held |
| f345–400 | `DRAFT — DO NOT PUBLISH`; whiteboard `BIG BLOB OF COMPUTE`; in the vault, `$1.5B LIBRARY FINE — PAID`, `COMPUTE (RENTED FROM NOLE)`, `NO ADS` neon and a Big Game ticket | [K, verify] for the phrase; the rest [INVENTED], teasing Ep6, Ep8 and Ep7 |
| f366–402 | `DOOM RISK ▰▰▰▰▰▰▰▰ · BUILDING IT ANYWAY ✓`; scroll fragments "…country of geniuses in a datacenter…" and "…machines of loving grace…" (Oct 2024 [K]), then "…we must pace the frontier…" (Sep 12, 2026 [V]); a tiny price tag | Real phrases verbatim · [PROPOSAL] for the tag |
| f420–464 | The check `$1,000,000,000*`, with its fine print `*pledged · received: $133M` legible only in LEDGER (f444–449) | About $133M [V] |
| f465–479 | Place cards, including `MARIO (UDIAB) · JOINS 2016`; `DEC 2015` on a booster leg | Corrected [V] · verify the landing |
| f480–494 | `low-key research preview` · `1,000,000 · 5 DAYS` · `NOV 2022` | [K] · [V] · [V]. **Never `100,000,000`.** |
| f495–509 | Tile labels; `THE QUIET VOTE (camera off)`; Vegas neon and a race car behind Mas | [PROPOSAL] · [K] |
| f510–524 | `TTEMME · 72:00:00`; badge GUEST → CEO | [INVENTED] on a [V] event |
| f525–539 | One blue heart among the red; `LETTER 745/770` | [V] |
| f540–629 | `BELOW · ABOVE · AROUND`; `MINDDEEP`; `KRAM vs NOLE · CAGE MATCH · CANCELED`; the Dalí-clock GPUs; `COMING SOON: TRUTHGTP`; `KORG 1` over `KORG 5: NEXT QUARTER`; the SAFETY beacon and price tag; `(NOT YET)`; `$86B` on the spire; boss name plates (TASYA, RADNUS, SIMED, KRAM, NESNEJ, MARIO, ADELINA, NOLE) | [K, re-verify] · [INVENTED] · [K, verify] |
| f630–689 | The Orb's iris reflects the skyline upside down; tiny Mas on the balcony (he sips at f670); the rivals flinch | [INVENTED] |
| f705–706 | Two frames of tokens in the Orb's iris | [INVENTED] |

**Top five eggs:**
1. **OPEN → NOPE** is a true anagram, and Mas moves the N himself.
2. **The uncancellable dialog:** greyed in 1993, clicked in 2023, greyed again a beat later.
3. **The music is the curve:** the skyline plucks spell the knee, and the first and last chords have no third.
4. **The Orb's iris** reflects the skyline with NopeAI's spire pointing into the ground.
5. **Mas's glass never ripples** while every other glass at THE WOODROSE is frozen mid-slosh.

---

## 6. Name cards

### 6.1 The pixel card template (`studio/src/shared/pixel/ui.ts` → `nameCard`)
1. **Entrance:** the founder enters live, in full colour, on the beat-4 pickup (Gerg is already seated).
2. **Freeze on the downbeat H:**
   - At H every pixel except Mas, the thread and whatever Mas holds remaps to **2-TONE FREEZE** (navy N4 and cream P2, inside the master palette).
   - **Frame H is the pop:** cream is lifted one step, at 80% white or less. A 2-px integer shake runs over H and H+1.
   - The founder's accent colour survives only in his name.
3. **Card clock, k = frames since H:**
   - k0–2: the portrait window (116×140) opens in 3 steps.
   - k3: the NAME cuts in, in the 14-px display face, in the accent colour.
   - k4: the accent rule draws.
   - k6 onward: the tagline types at 2 characters per frame (7-px face).
   - After the tagline, the stat-row egg (7 px, low contrast).
   - The stamp (Nole only) lands at **k15 = f435**. (`ui.ts` currently lands it at k14; see §9.3.)
4. **The hold runs from H to between H+39 and H+44,** depending on the card. Mas's gag runs about H+28 to H+42. The **harmony freezes** (the strings hold the hit chord) **while the walking bass keeps moving**, like Mas.
5. **Exit:** the card closes in 2 steps at the end of its hold (at f285, f340, f403 and f465). The founder stays frozen, masked 2-TONE, until f480.
6. **Each card breaks its own template once** (listed below).
7. **Placement** keeps the founder's face, Mas's gag and any must-read prop clear. The defaults are in §3.5.

### 6.2 The cards
| Card | Exact text (**must-read** · *egg*) | Intro action → freeze | Freeze behaviour and template break | Mas's background gag | Card audio |
|---|---|---|---|---|---|
| **MAS MANALT** (1993) | **`MAS MANALT`** / **`no equity.`** · **`Cancel`** (greyed) **`OK`** · *title bar `age 8`* · *tooltip `this action cannot be cancelled`* | The kid turns to camera with the unblinking stare (f124–128); the world becomes a 1-bit system alert (f135) | It isn't a portrait card: it's a **1-BIT alert dialog** (`alertDialog`) with a pixel-Orb icon. The whole world holds its drawing. **The break:** Cancel can't be cancelled. A stranger clicks it (f150, bonk), and the kid clicks OK (f165). It pays off in bar 9. | *(He is the card.)* | The beeper rests while the dialog is open; the chip bonk (a tritone) at f150; OK with a beeper C at f165 |
| **GERG MOCKBRAN** | **`GERG MOCKBRAN`** / **`ORG CHART: HIM.`** · *`SLEEP: DEPRECATED · PTO: 404`* | Already seated, typing; the keycaps pop like popcorn; the napkin sketch swaps to a website (f232) → **freeze at f240** with the keycaps mid-air | Right half; terminal green #39FF88. **The break:** the frozen keycaps hang in the air *around* the card, over its edge. | Plucks the floating **CTRL** key and pockets it (f270–282); it takes his colour | **HIT Fm9 at f240**; the freeze latch; BLIP GERG at f246, f248 and f251; the item-take blip at f278 |
| **ALYI** | **`ALYI`** / **`FEELS THE AGI.`** · *`PRODUCTS: 0 · EFFIGIES: 1`* (`BUNKER: YES` held) | The cathedral lights up; he levitates; the `UNALIGNED` effigy ignites → **freeze at f300 on "A-G-I!"** | **The break:** a stained-glass lancet card drops from above (f300–302); his eyes are token streams drawn in BASE; the FEELING meter bursts out into the rose window (f315–322). Ember #FF6A1A. | Toasts a marshmallow on the frozen fire, which toasts it anyway (f328–339) | **HIT D♭maj7(♯11) at f300**; the CHANT (f285–307); the organ; BLIP ALYI at f306, f309 and f311 |
| **MARIO** | **`MARIO`** / **`HAS CONCERNS. HAS GPUS.`** · *`DOOM RISK ▰▰▰▰▰▰▰▰ · BUILDING IT ANYWAY ✓`* · *scroll fragments* | The vault door swings open; `RED-TEAMED ✓✓✓` ticks; the DRAFT sheet flutters out; he steps out with a finger raised → **freeze at f360** | **The break:** the card rises from the bottom-left edge on a **parchment plate with ink-blue type** (never red), and the WORD COUNT bar becomes a scroll down the whole table (f378–389) | Rolls the scroll's tail into a telescope and peers at the ceiling, right where the rocket will come in (f390–402) | **HIT B♭m11 at f360**; the klaxon cut dead; the sighing violin; BLIP MARIO with sub-concern echoes; the item-take blip at f392 |
| **NOLE** | **`NOLE`** / **`NAMED IT.`** + stamp **`SUED OVER IT.`** · *check `$1,000,000,000*` / `*pledged · received: $133M`* | A SPACEZ booster crashes through the ceiling; every glass sloshes except Mas's; the neon OPEN AI swings in → **freeze at touchdown, f420**, as he leans out of the hatch mid-post | **The break:** the card slams in from frame-left and lands crooked (a drawn 1:8 stair-step, not a rotation); the stamp lands at f435 on beat 8.2; the optional LEDGER check shows for 6 frames (f444–449). Rocket red #E0301E. | Sips his dead-flat water under the sign (f450–462), then takes the N (f466) and makes **NOPE** (f473) | **THE BIGGEST HIT, C7(♯9), at f420** (the one full shout); the rocket roar; the stamp thunk on C at f435; BLIP NOLE at f426 and f429 |

**No other intro cards.** LUAP is an egg only (the patch). The Ep1 board appears only as tile labels in 9.2. **RUMPT never gets an intro card**: his gold-foil card is in-episode only, from Ep4 ([character file](../characters/dlanod-j-rumpt.md)).

### 6.3 Ep12: the model wrote the cards
In Ep12 the fixed section re-renders. The card texts are `you.` · `ORG CHART: US.` · `FELT IT.` · `HAS CONCERNS. (READ.)` · `NAMED IT. (NOTED.)` + `sued over it.`, linted in §5.2. The other changes:
- The taglines type at a perfectly even rate **with no BLIPs**, because the model has no voice.
- The kid in 1993 **blinks for the first time**, and his screen has turned fully toward us, its glow blown out and unreadable (the reveal belongs to the episode).
- Mas still pockets the CTRL key; the model lets him.
- At 8.4, after OPEN → NOPE, a second cursor slides the N again: **NOPE → PEON.**
- [PROPOSAL] The cards render in **[TERMINAL]** instead of 2-TONE FREEZE: the machine's point of view.

---

## 7. Style-switch log
The house rule is that **a switch must be over before the viewer can think "effect."** Every switch below has a story reason, one clean entry and one clean exit, and no sound sting of its own.

| # | Frames | Style | Story motivation | Why it isn't a gimmick | Exit |
|---|---|---|---|---|---|
| S1 | f100–104 | **GLYPH-MASKED** (the Orb's scan cone) | The machine sees what the dark room really is: a data-center cathedral. It's the first foreshadowing. | Five frames, inside a diegetic beam, on the beat where he looks at us. There's no sting, only the drone; outside the cone nothing changes. | The cone closes at f105 |
| S2 | f116–167 | **1-BIT** (the paper fade at f116–119; the 3:2 pillarbox; animation on fours) | 1993: the kid's world at the fidelity he saw it | The date card is on screen, and everything in frame belongs to 1993. The fade grows out of the Post white rather than being laid over the picture. | The render front, f168–179 |
| S3 | f168–229 | **EARLY-WEB16** (in through the front at f168–179, out at f225–229) | 2008–14. The palette scales with the era, which is the intro's thesis. | Both fronts are tied to the curve's tip. No label names the upgrade; the self-describing v1 eggs are cut (§9.6). | The candle-glint match cut and a 5-frame front into BASE |
| S4 | f240–284 · f300–339 · f360–402 · f420–464 (masked on the frozen founders through f479) | **2-TONE FREEZE** | Time stops at the founding dinner. It's the adventure game's portrait-window convention, and it states the thesis: **the world stops, and Mas keeps operating.** | It's a grammar, not an effect: one rule, repeated four times, with both colours inside the master palette. Mas, the thread and his pickups are excluded, so the rule is readable at a glance. | The room thaws at each beat-4 pickup; the founders thaw at f480 |
| S5 | f444–449 (optional) | **LEDGER**, masked to the check | Money: the check's real value (received: $133M) is visible only in the ledger's register. | Six frames, on one prop, with no sound. It is cut if the animatic feels cluttered. | Back to 2-tone at f450 |
| — | f480–488 · f495–509 | *BASE lighting states:* the bloom (every ramp steps up one), then the grey call light | Launch euphoria, then the chill of the firing call | **These are not switches.** They're light on the house palette, and the audit counts them as lighting. | — |
| S6 | f500–514 | **GLYPH** (Mas's tile dissolves, then re-forms in reverse) | People become tokens. The board deletes him, and he turns into data. It foreshadows the season: the model is studying Mas. | Played for comic timing inside the silent "the music is fired" beat. It's masked to one tile, and it's undone a beat later. | The tile is empty at f508; the tokens fly home over f510–514 |
| S7 | f630–633 | **1-BIT → EARLY-WEB16 → BASE**, masked to the wordmark | The title scales itself: a four-frame recap of the ladder | Four frames, on the hit, on the letters only. The rest of the frame stays BASE. | BASE chrome from f634 |
| S8 | f705–706 | **GLYPH-MASKED** (the Orb's iris) | The last whisper: the machine's eye holds the skyline as data | Two frames, inside an 8-px iris, as he turns to us | The iris settles at f707 |
| — | *(not used in Ep1)* | **TERMINAL** | Reserved for the machine's point of view | Held back so that it means something when it arrives. The Ep12 cards are the proposal (§6.3). | — |

**Budget check.** Full-frame, non-BASE time runs to about 40% of the intro, and almost all of it is the era palettes (f116–229) and the four card holds. That's structural, not decorative. The GLYPH total is 22 frames, all masked. The LEDGER total is 6 frames, optional.

---

## 8. Per-episode slot (Ep1–12)
Only these ranges change between episodes:
- **f18–112:** the cold-open line, the monitor UI, the word-timing JSON, the D♭ colour note (placed in each line's longest pause), and the dot.
- **f480–539:** bar 9.
- **f540–689:** the skyline state and THE PODIUM.
- **f640–689:** the subtitle.
- **f692–719:** the toast.

**f120–479 renders once** and is cached. The exceptions: the 1993 screen angle re-renders at Ep4 and Ep7 (4 authored drawings, §8.3), and Ep12 re-renders the whole fixed section.

**Slot rules:**
- Headlines are **7 glyphs or fewer** (15 frames each).
- Subtitles are **34 characters or fewer** (32 recommended), typed at 4 characters per frame.
- **At most one tuned "object sound"** per slot, keyed to F, C or D♭.
- **At most one non-BASE switch per slot:** GLYPH when the machine takes a person or a place (Ep1, Ep9, Ep11); LEDGER when money is the joke (Ep4, Ep6); TERMINAL in Ep12 only.

Every item's sourcing detail is in [episode-slots.md](episode-slots.md), and each episode's production sheet is its `episodes/epNN/intro-slot.md`.

### 8.1 Cold open and bar 9
| Ep | Window | Cold-open line (as displayed) · medium · tag · VO note | 9.1 / 9.2 / 9.3 (lint margin) | Bar-9 action | 9.4 transition | Slot switch |
|---|---|---|---|---|---|---|
| **1** | Nov 30, 2022–Dec 27, 2023 | *"near the singularity; unclear which side."* · post, Jan 2025 · **[V]** · out of window on purpose; Ep4 posts it "for real" | `CHATGTP` (0) / `FIRED.` (+1) / `BACK.` (+3) | The beige button and the bloom ring; the odometer. The five-tile call where **Cancel finally works**. Re-pop with Cancel greyed; badge GUEST → CEO; the hourglass shatters. | 745 red hearts and 1 blue become stars | **GLYPH** (the tile, f500–514) |
| **2** | Jan–Aug 22, 2024 | *"her"* · post, May 13, 2024 · [K] · the VO is "her" at about f24–33, then **silence** under a pulsing typing indicator; the D♭ lands in the silence | `AROS` (+4) / `SUED.` (+3) / `ELPPA` (+3) | A woolly mammoth walks out of a text box (object sound: a low brass "trumpet" on F2); a complaint made entirely of "!"; a keynote stage lights up and name-checks CHATGTP | "WHERE IS ALYI?" flyers blow upward | none |
| **3** | Jul–Dec 2024 | *"i love summer in the garden"* · post with a strawberry photo, Aug 7, 2024 · [K] (verify the punctuation) · a photo-thumbnail egg | `🍓` as a drawn sprite (+7) / `3 QUIT.` (+1) / `$157B` (+3) | A strawberry "plip" on C6; a revolving door spins three times; the $157B tag | Strawberries tumble upward | none |
| **4** | Jan–Apr 2025 | *"…our GPUs are melting."* · post, late Mar 2025 · [K]/[H] · keeps the source's "GPUs"; the trim is marked | `$500B` (+3) / `−$589B` (+1) / `NOPE.` (+3) | A gold ring stands on a stage; **INVIDIA's gold statue topples to a pebble**; a $97.4B bid bounces off a door | Melting GPU drips fall upward | **LEDGER** on the statue, 6 frames (f498–503) [PROPOSAL] |
| **5** | May–Aug 2025 | *"Missionaries will beat mercenaries."* · internal memo, Jun 2025, as reported · [K] · in a generic memo window, keeping the source's casing | `$6.5B` (+3) / `$100M` (+3) / `GTP-5` (+3) | A velvet cloth over a device; a thermos labelled *per Manalt*; the bar for the bigger number is shorter | A generic moon-sized battle station rises (never the franchise design) | none |
| **6** | Sep–Dec 2025 | *"…I'll find you a buyer… Enough."* · podcast (BG2), late Oct / early Nov 2025 · [K] · an auto-caption strip under a waveform (spoken, so it doesn't count toward the Ep7 capital-"I" gag) | `$1.4T` (+3) / `BACKSTOP` (8 glyphs, −1 → **fix: the picture cuts at f494** while the audio mute stays at f495, for 16 frames and a margin of 0) / `CODE RED` (0) | A baseball backstop rises behind HQ with taxpayers in the bleachers; the CODE RED siren | The CODE RED siren flies from ELGOOG to NopeAI's roof | **LEDGER** on the bleachers, 6 frames [PROPOSAL] |
| **7** | Jan–Mar 2026 | *"…are funny, and I laughed."* · post, Feb 2026 · [V], quote boundary to verify · **the first capital "I" he posts all season** | `NO ADS` (+3) / `BANNED.` (0) / `SIGNED.` (0) + egg *`hours later`* | MISANTHROPIC's Big Game spot. **9.2 is THE PODIUM's only in-slot cameo:** a telephoto slice of the hill and the lighthouse, where the word `BANNED.` *is* the HTURT meteor, in all caps, arcing from the podium into the lighthouse (f495–507). The camera tracks it so the word stays steady. Impact at f507 with **no flash**, in total silence. **RUMPT himself never appears**, only his post. Then NopeAI's pen signs. | A lobster scuttles up the cables (a claw-clack object sound) | none (the meteor is ≤80% white) |
| **8** | Apr–Jun 2026 | *"yes."* · trial testimony, May 12–13, 2026 · [V] · a court-transcript pane (egg `Q. Are you completely trustworthy?`, verify the wording). **A held beat on the transcript first**, because the source has him amend his answer to "yes"; **only "yes." is quoted.** Then the chart buffers, with a room-tone swell and no new sound. | `TRIAL` (+3) / `EXPIRED` (0) / `$965B` (+3) in MISANTHROPIC's colour | THE CALENDAR tears off a single page; `$965B` is *their* number | The SPACEZ IPO rocket | none |
| **9** | Jul–Sep 24, 2026 | *"we are now in the singularity—"* · Jul 2026 · [V] · confirm whether it was a post or an interview (composer or caption strip). **The Post click cuts him off on the dash.** | `NOW.` (+4) / `HACKED.` (0) / `PACE.` (+3) | Agents climb out of a literal sandbox; a PACE banner | Agent sprites swarm up the cables | **GLYPH-MASKED** on the agents (f497–505) |
| **10** SPEC | "OCT 2026?" → "2027??" | *"We may have to pace the rate of AI development…"* · Jul 2026 statement · [V] · a caption strip; a real line used as a callback | `CZAR.` (+3) / `PAUSED` (+1) / `PAUSED` between two drawn air-quote hands (+1) | THE INTERN's lanyard reprints | Cranes with no operators lift the camera | none |
| **11** SPEC | "2027??" | *"i remain enthusiastic about the non-profit structure!"* · email, Sep 21, 2017 (read back in court, May 2026) · [V] · an email draft; **the monitor autocompletes it as ghost text first** [SPEC gag], and the VO reads about 2 frames behind the ghost | `RSI` (+5) / `JK.` (+5) / `(NOT JK)` (0) | A server rack rewrites itself | Bridges of light | **GLYPH** on the rack for 4 frames; the headline stays BASE |
| **12** SPEC | "????" | **No VO.** The chair is empty, and the Orb swivels toward the door, not the lens. The cursor types *"near the singularity; unclear which side."* by itself, adds `ours.` [INVENTED], and posts. The keyboard clicks follow **Ep1's syllable map**. Mas walks in one beat late with a coffee (the cup set-down is a dry Foley) [PROPOSAL]. | `?` / `??` / `???`, typed by an unseen cursor (all PASS) | **The music is not fired:** it keeps playing, and nobody knows who's in charge of it. At 9.3 the band doesn't slam; it just continues. | None: the camera floats up on its own | **TERMINAL** for the slot [PROPOSAL] |

### 8.2 Skyline, RUMPT, toast, subtitle and last bar
| Ep | Skyline change | **RUMPT beat** (THE PODIUM on the far-left hill; RUMPT never appears in person) | Orb toast (margin) | Title subtitle (margin) | Last bar · flag |
|---|---|---|---|---|---|
| **1** | Baseline: the GPUs sag red-hot on NopeAI's roof; `COMING SOON: TRUTHGTP` on zAI; PEEKDEEP `(NOT YET)`; the siren on ELGOOG | **Absent.** [PROPOSAL, parity] NEDIB's fountain pen stands in an inkwell on the hill in Ep1–3, static, with no text and no SFX. | `verified: human` (+5) | `now in low-key research preview` (+4) | Standard |
| **2** | A courthouse rises between zAI and NopeAI; a white ISS cube appears | **Absent.** Optional: one faint HTURT bubble drifts across the sky, with no text. | `verified: human` (+5) | `now with voice` (+26) | Standard |
| **3** | A strawberry on the spire; a revolving door; a GPU Christmas tree (SHIPMAS) | **The podium appears:** a dark silhouette at f622 with a glint at its coin slot, and **one coin clink on C7 at f645, the only sound it ever gets.** (Mas's $1M to the inaugural fund, Dec 2024 [V].) | `verified: human` (+5) | `thinking…` (+31) | Standard |
| **4** | THE WHALE breaches and INVIDIA sinks 17%; the GATESTAR ring flickers (IOUs), with YRRAL's yacht **moored and still** beneath it at frame-right, far from the hill; SAMA NOS's balloon; the MACHINES THINKING tower | **Lit gold**, with a thin gold wire running to the top of NopeAI's GATESTAR ring (never to the yacht) | `verified: human` (+5) | `not for sale` (+30) | Standard |
| **5** | ATEM grows a soup-kitchen annex; a bar chart falls off NopeAI | The label gun fires once, off-screen, and `GENIUS` sticks on the ring's base ([P✓] Jul 23, 2025) | `verified: human` (+5) | `missionary ed. (mercenary rates)` (+2, *TIGHT*; type it at 5 characters per frame for +3) | Standard |
| **6** | GATESTARs multiply; MISANTHROPIC gets a book-return slot `$1.5B`; a `RESERVED` desk in a NopeAI window | A small receipt curl (THE EO RECEIPT) hangs off the podium, with no motion | `human (probably)` (+4) | `backstop not included` (+16) | Standard |
| **7** | SPACEZ swallows zAI; a `NO ADS` billboard aims at NopeAI; an AROS tombstone | As in Ep6 on the skyline. **Its move is the 9.2 meteor** (§8.1). | `human (probably)` (+4) | `ad-free* (*ad-supported)` (+11) | Standard |
| **8** | MISANTHROPIC's lighthouse briefly outgrows NopeAI, so the curve's peak shifts; gargoyles become goblins; a tiny JERDNA strolls over | **THE COUNTERPART's mirrored podium** appears across the water beside PEEKDEEP's whale tower, and the two face each other. It's mirror-chrome with the same silhouette and **no flag, emblem or text.** THE COUNTERPART is never caricatured. [PROPOSAL] design | `human (probably)` (+4) | `saved by the calendar` (+17) | Standard |
| **9** | FACEHUGGER raises an INVIDIA flag (*`(PENDING)`*); every tower hangs a PACE banner while its cranes keep building; the ASTRA star; THE NU dome | The label gun relabels THE NU dome's sign from `AI` to `SI` in one beat: the tape travels over f615–621 and sticks at f622 | `human (probably)` (+4) | `outside intended scope` (+15) | Standard |
| **10** SPEC | The towers grow between frames | **SI FORCE robot vacuums** march along the waterfront in gold dress uniforms: a silent background loop over f540–689, with no text | `human (probably)` (+4) | `at a responsible pace (2× speed)` (+4) | **A faint Shepard-tone riser** over f660–719, below −30 LUFS short-term · **SPECULATIVE** |
| **11** SPEC | The towers fuse into one; the Whale's building is suddenly just as tall | The robot vacuums continue | `human… probably?` (+4) | `assisted` (+33) | **A louder riser, and a second ding answers the first** (C6 at f712, still no third) · **SPECULATIVE** |
| **12** SPEC | The skyline redraws itself every frame; a single unlabelled tower; the sign reads **PEON AI**; the axes rescale to a new knee; *Nesnej's register drawer hangs open, silent* | The Intern has taken over the intro, and **the podium's plaque reads `USER`**: the only plaque text all season, with a size bump for legibility | `side: unclear`. **Fix:** it pops from the title's Orb period at **f680** (f680–704 = 25 frames, +4), because Ep12 cuts to black at f704. | `generally available` (+18) | **The third tries to arrive.** A choir alto glides up from G at f630, toward A♭ (minor) or A (major). Picture and sound cut to black at **f704**, and the f705 ding never sounds. · **SPECULATIVE** |

### 8.3 Small per-episode layers (eggs; details in [episode-slots §6–7](episode-slots.md#6-bookend-dot-toast-subtitle-last-bar))
| Ep | `you are here` dot (cold open) | 1993 screen angle (authored drawings, not rotated) | Desk tally | Coat-hook collars | Gold threads in the hoodie |
|---|---|---|---|---|---|
| 1 | x 0.50, at the knee | 0°, facing away | `III` | 2 | — |
| 2 | 0.55 | 0° | `III` | 3 | — |
| 3 | 0.60 | 0° | `III` | 4 | — |
| 4 | 0.65 | **10°** | `IIII` | 5 | 1 |
| 5 | 0.70 | 10° | `IIII` | 6 | 2 |
| 6 | 0.75 | 10° | `IIII` | 7 | 3 |
| 7 | 0.80 | **35°** | `IIII` | 8 | 3 |
| 8 | 0.85 | 35° | `IIII` | 9 | 4 |
| 9 | 0.90, past the knee | 35° | `IIII` | 10 | 5 |
| 10 SPEC | at the chart's top edge | 35° | `IIII` | a ruff | 6 |
| 11 SPEC | off the top: `you are ↑` | 35° | `IIII ?` | a ruff | 6+ |
| 12 SPEC | the axes rescale; the dot sits at a new knee | **fully turned**, glow blown out | `∞` | a single visitor lanyard | — |

---

## 9. Production notes

### 9.1 What is placeholder
- **Mas's VO:** a synthetic stock voice. Kokoro-class stock presets are being auditioned in `audio/vocals/_work/` (am_echo, am_eric, am_fenrir and am_michael, each in semicolon, dash and soft reads). **No cloning, no impression, no accent.** The VO is edited as two clips (f24 and f72) so the semicolon pause is frame-exact. A human performer in a cartoon register of the cadence can replace it later, under the same rules.
- **The CHANT and the crowd "ohh":** 4–6 layered stock voices, detuned ±10 cents and offset 0–20 ms, with the whisper made in processing. They are placeholders until a group session.
- **BLIPs:** synthesized in numpy to the voice specs in §4 (D7–D12). **`audio/sfx/manifest.json` does not exist yet**, so this script is the spec until it does.
- **PAD:** a formant-synth or sampled "oo" placeholder, voiced F3–B♭3–C4–E♭4.
- **Music:** **code-composed** from the grid. `beats.json` (exported from `timing.ts`) and `audio/compose.py` are still to write. `audio/theme/` is empty, and **`audio/theme/VARIATIONS.md` does not exist yet**, so the V1–V4 descriptions in §3.1 are the working definitions. The Harmon-muted trumpet phrase (f540–599) is the one line worth a live player; it's sampled until then.
- **All pixel art:** only the engine and cast code exist so far: `studio/src/shared/pixel/*`, plus `cast/mas.ts` with `masDesk`, `masPortrait`, `masKid`, `masStage` and `masThrone`, and the skyline bosses in `cast/bosses.ts`. **None of the five intro moments had notes in `studio/notes/` or renders in `out/pixel/` at the time of writing.**

### 9.2 Dependencies on the pixel moments in progress
| Moment | Frames | Owns | Hand-offs and needs |
|---|---|---|---|
| `mcoldopen` | f0–119 | INSERT A and B, the ROOM, the GLYPH scan cone, the token-chip burst, the paper fade | The native composer UI (no real logo); `masDesk` with its screen / turn / camera heads and the 1-px smile; an Orb sprite with 3 iris drawings; the cursor at (298, 124) |
| `meras` | f120–239 | 1-BIT 1993, the alert dialog and zoom rectangles, the two render fronts, EARLY-WEB16 for 2008 and 2014, the candle match cut | **It owns the f225–229 front**, while `mdinner1` owns the room behind it. It needs the pillarbox retract, the dither-pair rule for WHY COMBINATOR, and the `masKid`, `masStage` and `masThrone` sprites. |
| `mdinner1` | f225–359 | THE WOODROSE room (560×300), GERG and ALYI, the freeze mask, the cards, the cathedral, the effigy flame loop | **It hands off at f344** (Alyi's card closed). The f345–359 overlap belongs to `mdinner2`. The freeze mask must exclude Mas, the thread and his pickups. Mas carries his glass from f255. |
| `mdinner2` | f345–479 | MARIO, the vault and HUD, the scroll, the rocket, NOLE, the stamp, the optional LEDGER, the neon, and the founding key art | The HUD stays legible and frozen through f400. The stamp lands at f435. The N re-lights in colour at f473, and "AI" at f474. |
| `mfinale` | f480–719 | The slot, the skyline, the title and the bookend | The GLYPH dissolve and its reverse; the bloom ring; the heart-to-star substitution; tower pops; the f622 roofline; the hill layer [EP3+]; the wordmark's 4-frame palette ladder; **the reverse-angle room** (the `pixeladv` back view) with a hand-pixelled mini title and the cursor at (298, 124); the 2-frame GLYPH iris |

If a moment's build changes any of this, update this file. Its frame numbers are the contract.

### 9.3 Engine and code notes
1. **`ui.ts nameCard`** lands the stamp at k14 (f434). The script needs **k15 (f435)**, on the beat with the thunk: make the stamp frame a parameter.
2. **Mario's card:** `nameCard`'s backing plate is `THEME.ink` (dark), and ink blue #1F3A93 on dark fails contrast. His card needs a **parchment plate** option.
3. **Ep12 Nole card:** a 2-step window open and a late close (T15-12 fix, §5.2).
4. **`EARLYWEB16` contains 0xFF6600,** which is YC's brand orange. The WHY COMBINATOR sign must use the dither pair (reading near #FF7F2A) or 0x993300, never a flat #FF6600 ([guardrails §5](../bible/guardrails.md#5-legal-hygiene)).
5. **The bloom** is `familyStep(+1)` behind the ring, with highlights clamped to ≤80% white. **The grey call light** is each material's lowest-chroma ramp step. Neither is a new `PaletteSet`.
6. **The read-time lint as code:** a registry generated from `timing.ts` with every item's in and out frames and glyph count (§5.2), so CI fails on any FAIL.
7. **Render cache:** f120–479 renders once for Ep1–11. The 1993 layer has 3 cached angle states (Ep1–3, Ep4–6, Ep7–11), and Ep12 re-renders the whole section.

### 9.4 Stems and mix
- **Stems:** `piano`, `orch`, `bigband`, `chip`, `bass`, `drums`, `fx`, `vo`, `chant`, `blip`, `pad`. Each is its own `<Audio>` layer, so the fire and rehire, the per-episode VO and the Ep12 cut are all gain curves.
- **The unmuted bus** carries the dry F4 and the room tone through f495–509.
- **Mix:** about −14 LUFS integrated, −1 dBTP, with the piano ducked 6 dB under the VO.
- **Timing:** every listed hit is sample-exact. Pads, hats and ostinati may be humanized ±8 ms. The swing is fixed at +10 frames and is never humanized.

### 9.5 Photosensitivity audit frames
The automated luminance audit runs on every render. Check these frames by hand as well:
- f116–120: the paper fade and the hard cut into 1993.
- f240, f300, f360 and f420 (the card pops, 60 frames apart), and the thaws at f285, f340 and f405.
- f480: the bloom ring.
- **f495 and f510:** the grey cut and the slam, which fall inside one 24-frame window.
- f622: the roofline ignition.
- f630: the title slam and shake.
- **Ep7 only:** the meteor at f495–507 must stay ≤80% white, with no impact flash.

### 9.6 What changed from v1.1
1. **Look:** pixel art replaces the cut-paper, 240p and HDR tiers. The fidelity ladder becomes a **palette ladder:** 1-BIT → EARLY-WEB16 → BASE → the BASE bloom. The 1993 pillarbox widens to 16:9 as the front passes.
2. **Camera:** every dolly, zoom, push-in, roll and motion blur is replaced by cuts and whole-pixel scrolls, and the card punch-ins become 2-px integer shakes. The cold open is built as insert, room, insert. **The pull-back becomes a cut to the reverse angle,** where the monitor is visible for the first time.
3. **THE WOODROSE is a single adventure-game room.** Mas crosses it carrying his water glass, so the glass that never ripples travels with him. The flame and paper wipes are gone.
4. **New rules:** the cyan thread never freezes, and anything Mas picks up takes his colour. The neon sign ends in full colour, which strengthens the key art.
5. **The typing leads the VO by 6–8 frames:** he reads back what he typed.
6. **The 2008 → 2014 change is a hard cut** (T06 improves from +1 to +3). **Timing fixes:** the `2015` card holds to f247, and the RED-TEAMED HUD holds to f400.
7. **Cut:** the self-labelling eggs `512×342 · 1-BIT`, `upgrading… 1-bit → 240p`, `▶ PLAY JUN 09 2008` and `HDR · RAY-TRACED* / *not really` (each one announces the effect). The Tesla painting at the dinner is cut too; it's a 2017 prop, so Ep8 only. The `you are here` dot is dropped from the bookend.
8. **Score:** the 808, trap hats, boom-bap, cassette piano and fuzz guitar are retired. It's now V1 "Chip Chamber Jazz," with swing, walking bass under the freezes, a muted trumpet at dusk, eight big-band accents, chip on every statement of the motif, per-character BLIPs, and the vocal PAD reserved for the title.
9. **Ep12:** the model-written card set follows the episode room ([ep12 gags §4](../episodes/ep12/gags.md): `you.` · `ORG CHART: US.` · `FELT IT.` · `HAS CONCERNS. (READ.)` · `NAMED IT. (NOTED.)`). It replaces spec §5.4's set, which is still also listed in `world/props.md` and `characters/gerg-mockbran.md`; those files should be aligned. The Ep12 toast now pops at f680 so it passes before the f704 cut to black.

### 9.7 Open questions for the showrunner
1. **`BUNKER: YES` or `EFFIGIES: 1`** on ALYI's stat row? The script uses the fallback, `EFFIGIES: 1`, because the bunker line comes from a contested book.
2. **LEDGER:** keep the 6-frame check at f444–449 or cut it after the animatic? And approve LEDGER in the Ep4 and Ep6 slots and TERMINAL for Ep12?
3. **Parity on the hill:** approve NEDIB's inkwell in Ep1–3, which is gone in Ep4 when EO 14110 is revoked? It conflicts with the integration's "absent in Ep1–2, no new cast."
4. **Mas's voice:** which stock voice (am_echo, am_eric, am_fenrir or am_michael)? And is a synthetic chant acceptable through picture lock?
5. **Ep12's final chord:** does the alto glide toward A♭ (minor) or A (major)? Both are scored, and neither is heard.
6. **Variation lock:** confirm V1 "Chip Chamber Jazz" as the lock, with V3 as the fallback if V1 reads too polite. Is one live Harmon-mute trumpet phrase (2.5 s) in budget?
