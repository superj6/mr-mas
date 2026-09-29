# MR. MAS: Opening Titles, Master Script

**"THE CURVE: everything scales."** The 30-second main title, written as a shootable A/V screenplay.

| | |
|---|---|
| **Title** | *MR. MAS*, opening titles |
| **Version** | **v2.1 (pixel / jazz / no spoilers)**, 2026-09-25, script-checked the same day (§11). v2.0 is kept at [`history/SCRIPT-v2.0-backup.md`](history/SCRIPT-v2.0-backup.md). |
| **Status** | **Master script: the single source of truth for the opening.** Where another intro doc disagrees with this file, this file wins. §9.8 lists the files that still disagree. |
| **Runtime** | 30.0 s = 720 frames at 24 fps (f0–719). The 2 s filename card that follows every intro (the filename alone, with no disclaimer since 2026-09-27: [overview §8](../bible/overview.md#8-disclaimer-cards)) is not counted. |
| **Grid** | 96 BPM, 4/4 · 15 frames per beat · 60 frames per bar · 12 bars of 2.5 s · `at(bar, beat) = (bar−1)·60 + (beat−1)·15` in `studio/src/shared/timing.ts`. **Swung 2nd eighth = beat + 10 frames.** **Straight 2nd eighth = beat + 7.5 in the music** (engine `STRAIGHT_OFF`); picture and SFX round down to +7. Straight off-beats land at f127, the roll-call cuts (f487, f502, f517, f532), f622 and Ep11's f712 ding. Straight-eighth textures (the rack LEDs, the 1993 hats, the klaxon) alternate +7/+8. |
| **Picture** | Pixel art, adventure-game structure. Native 480×270, 4× nearest-neighbour to 1920×1080, indexed palettes (`studio/src/shared/pixel/palettes.ts`). **Whole-pixel motion only:** the camera cuts or scrolls in whole pixels. Nothing rotates or scales, and nothing blurs. |
| **Sound** | A blend of piano, orchestra and big band, **brass as accents only**, with a jazz feel; **8-bit chip motifs run throughout** as the identity. **V1 "Chip Chamber Jazz"** is scripted here. V2–V4 notes appear only where they differ (§3.1). |
| **Supersedes** | The **visual-style and music-style** content of [spec.md](spec.md), [shot-table.md](shot-table.md) and [cue-sheet.md](cue-sheet.md) (all v1.1), and of [`final.md`](../_sources/design/final.md) §3–4, wherever they conflict with this file. That covers the cut-paper / 240p / HDR tiers, every dolly, zoom, punch-in, roll and motion blur, the 808 / boom-bap / cassette / fuzz-guitar score and, from v2.1, **the whole per-episode bar-9 "news slot"**. [episode-slots.md](episode-slots.md) stays the research and sourcing file for the per-episode items that survive (§8). |
| **Binding inputs** | [`studio/INTRO_PIXEL_BRIEF.md`](../../studio/INTRO_PIXEL_BRIEF.md), **including "REVISION v2.1" (no spoilers; the roll call)** · the audio direction in [style-status](../bible/style-status.md) (piano / orchestral / big-band blend, brass accents only, jazz feel, chip motif throughout, variations V1–V4) · [guardrails](../bible/guardrails.md) · [naming](../bible/naming.md) (the Trump-equivalent is **DLANOD J. RUMPT, "President RUMPT"**) |

### Style tags
| Tag | Meaning |
|---|---|
| **[BASE]** | The show's look: the master palette with hand-built light ramps. Lighting states inside it (house light dropping one step, the dusk ramps) are **not** switches. |
| **[1-BIT]** | 1993 only. Black #0E0E10 and paper #E9E6DA, with stepped fill patterns. |
| **[EARLY-WEB16]** | 2008–14. Sixteen early-web colours with GIF-era ordered dither (§9.5 note 4 replaces the one YC-orange slot). |
| **[2-TONE FREEZE]** | The name-card freeze: navy N4 and cream P2. **Excluded from the freeze:** Mas, the cyan thread, anything Mas is holding or has taken, and UI overlays (date cards and the cards themselves: "the interface is not world"). |
| **[GLYPH-MASKED]** | A window through which the world is seen as tokens: the scan cone, the roll call's eighth window, the Orb's iris. Outside the window the frame stays BASE. These three are the whole GLYPH budget. |
| *(held)* [LEDGER] | Money: a green ledger line-screen, masked to one prop, 6 frames or fewer. **Not in the v2.1 cut** (§7 S5). |
| *(reserved)* [TERMINAL] | The machine's point of view. Proposed only for the held Ep12 takeover package (§6.3). Not in any default cut. |

### Audio tags
| Tag | Meaning |
|---|---|
| **MUS** | Score. V1 unless marked; `V2:` `V3:` `V4:` notes appear only where they differ. `[SCORE]` marks a change the rendered V1 still needs (§9.2). |
| **SFX** | Sound effects from `audio/sfx/manifest.json` (synthesized and tuned to the key where pitched). `[SFX]` marks a manifest or cue-list change (§9.3). |
| **VO** | Voice-over: Mas only |
| **BLIP** | Per-character text-box voices on the name-card taglines: one blip per word, pitched to the card's hit chord |
| **CHANT** | The group chant at the Alyi card |
| **PAD** | The wordless close-harmony vocal pad under the title hit |

### Other notation
- **bar.beat:** `5.1` is bar 5, beat 1. `+n` means n frames after that beat, and `end` means through the beat's last frame.
- **ON SCREEN "…"** is literal on-screen text, never speech. **Bold** marks must-read text, linted in §5. *Italic* marks an egg: 7 px native or smaller (≤28 px at 1080p), low contrast, never needed for a joke.
- **CAM** is the camera. **k** is the name-card clock (frames since the card started, as in `ui.ts nameCard`).
- **[SLOT]** marks per-episode content (Ep1 shown; the rules and the Ep1–12 tables are in §8). **[PROPOSAL]** needs sign-off. Source tags follow [guardrails §3](../bible/guardrails.md#3-fact-handling-tags): [P✓] [V] [H] [K] [INVENTED].

---

## 1. Contents
1. Contents
2. [The opening in one paragraph](#2-the-opening-in-one-paragraph)
3. [The A/V script](#3-the-av-script)
4. [Dialogue and VO sheet](#4-dialogue-and-vo-sheet)
5. [On-screen text registry and easter eggs](#5-on-screen-text-registry-and-easter-eggs)
6. [Name cards](#6-name-cards)
7. [Style-switch log](#7-style-switch-log)
8. [Per-episode changes (Ep1–12), spoiler-safe](#8-per-episode-changes-ep112-spoiler-safe)
9. [Production notes](#9-production-notes)
10. [Revision notes (v2.1)](#10-revision-notes-v21)
11. [Checker notes (v2.1)](#11-checker-notes-v21)

---

## 2. The opening in one paragraph

Thirty seconds, one cyan line. We open inside Mas's monitor: a cursor blinks on the beat, and a post types itself a word ahead of his soft, close voice, *"near the singularity; unclear which side."* Below it, a dot marked `you are here` sits at the knee of a chart whose curve hasn't turned up yet. Cut to the room: he looks straight at us, and for five frames his Orb's scan beam shows what the room really is, a cathedral made of tokens. He posts. The frame goes to paper white and comes back as 1993, one bit deep: a kid at a beige computer whose screen we never see, confirming a dialog that reads `no equity.` while Cancel stays greyed out. From there **the palette scales with the curve.** A glowing render front upgrades 1-bit to sixteen early-web colours for the 2008 keynote and the 2014 throne of laptops, then to the show's full pixel palette at a candlelit dinner in 2015. At THE WOODROSE, time stops four times. Each founder freezes into navy and cream behind an adventure-game portrait card, while Mas, the only thing still in colour, walks through the frozen room carrying a glass of water that never ripples. He pockets what he likes, and while the last freeze holds he moves one neon letter, so that when time comes back OPEN has become NOPE. Then the table runner, which is the cyan thread, lifts into a chart and **THE PLAYERS** get their roll call: eight portraits on eight eighth notes, riding the curve. Four incumbents sit on the flat part (a key ring, a siren, a thermos of soup, a tossed GPU); then comes the leap: a spotlight, a whale, a silhouette at a gold podium, and a window that holds nothing but a blinking cursor, the player who doesn't exist yet. At dusk the same players stand on their towers for the group shot, the rooftops ignite into one cyan line, and the line shoots up the spire into **MR. MAS**, whose period is the Orb. Then we cut behind him: the whole title was on his screen. He glances back at us, the Orb's eye flickers with tokens for two frames, and the cursor sits where we came in. **The score scales the same way.** One chip voice becomes a straight 1-bit hook, then a swung trio, then a chamber ensemble with big-band punches, eight brass-and-chip stabs for the roll call, and a muted trumpet at dusk. It ends on a chord with no third: *unclear which side.* **Nothing in it spoils an episode.** Each week changes only the cold-open line, the skyline (after the fact), the title's subtitle, one pocketed keycap, and how much of the roll call has come into focus.

**The line's journey, in whole pixels:** cursor → the chart's flat line and dot → the 1993 staircase on the wall (1-bit jaggies) → the TPOOL GPS breadcrumb → the 2014 dotted motion path → the Woodrose table runner → the roll call's knee (the portraits ride it) → the roofline → the spire → the title → the cursor.

---

## 3. The A/V script

### 3.0 Rules in force for every scene
1. **Mas never freezes.** In every freeze he stays in full colour and keeps moving. (He is not in the roll call; the roll call is everyone else.)
2. **The curve never freezes either.** The cyan thread (#3FE6FF family) is excluded from every remap except the era palettes, where it takes that era's nearest cyan.
3. **Whatever Mas picks up takes his colour** at the moment he touches it, and keeps it: the glass, the keycap, the scroll's tail, the neon N.
4. **Mas's cup never ripples**, in any era. From f255 he carries his water glass through the dinner.
5. **Screens face away from us in wide shots.** We see a screen only in an insert (his point of view), or in the final reverse angle.
6. **Whole-pixel only.** Held drawings are the idiom; light does the emotional work. Integer shakes are 3 px or less.
7. **Photosensitivity:** at most 3 flashes in any 24-frame window, and every pop is 80% white or less. The audit frames are listed in §9.7.
8. **RUMPT** never appears in bars 1–8, never gets a name card and is never voiced. In bar 9 he is the roll call's **mystery figure** (flash 7): a silhouette at a gold podium that fills in only as the show airs him (§8.2). In the skyline he stands at that podium on the far-left hill. **The hill is shared:** it always carries a matching presence for the other side and the one CZAR lanyard (§8.3), and it changes only in pairs. The cyan line never touches it.
9. **No flatline.** The thread may sag, snap or dangle, but on a dark field or a screen it never lies flat under a held tone. The cold-open chart has axes and a visible upturn past the knee, so it never reads as a monitor (guardrails X3). The Woodrose table runner is a prop on a lit table, not a trace, and the roll call's flat stretch sits under short stabs, not a held tone.
10. **No spoilers.** Nothing in the intro may reveal the current episode's plot. That includes Ep12: there is no finale exception (the takeover package is held, §6.3). Per-episode changes (§8) show only what earlier episodes have already aired. The one exception is the cold-open quote, which is the episode's epigraph: the words only, in their medium, without the episode's staging. Roll-call actions are **traits, not events**: no dates, numbers or text in the portraits, and the egg plates carry names only.

### 3.1 Audio variation key
The grid, the hits, the knee motif, the **roll-call stab rhythm and top line**, the VO, the chant, the PAD and all SFX are identical in every variation, and so are the SFX flavours (§9.3). Only orchestration and balance change.

| Variation | Balance (piano · orchestra · big band · chip) | Status | How it differs from V1 |
|---|---|---|---|
| **V1 "Chip Chamber Jazz"** (recommended) | 35 · 30 · 10 · 25 (target; the 05:40 re-render measures 38 · 27 · 10 · 25 with rhythm excluded, but chip is only about 15% in the dinner and skyline, §9.2) | **Rendered** (`theme-V1-chipchamber.wav`, re-rendered 05:40) to the v2.0 structure; needs the recompose in §9.2 | As scripted below. Chamber strings, harp, celesta and timpani (no winds in the render); a trio of piano, upright bass and **brushes throughout**; brass accents at eight moments; chip on every statement of the motif. |
| **V2 "Orchestral Noir, Chip Heart"** | 25 · 45 · 5 · 25 (the render measures 33 · 41 · 4 · 22) | Rendered (`theme-V2-orchestralnoir.wav`) to v2.0: still has the old bar 9, the lub-dub heartbeat and the Harmon phrase in the dinner (§9.2) | Strings, low winds, harp and timpani carry the harmony, and piano recedes to colour. **The chip is reduced to the knee statements** (the "heart" is a metaphor: **no lub-dub heartbeat figure**, §9.2). **Brass is horns and trombones only**, with one exception, the Harmon trumpet, whose line runs longer (bars 10–11, straight in bar 11) and becomes the noir centre. Pizzicato bass walks instead of upright. |
| **V3 "Pixel Swing"** | 30 · 15 · 15 · 40 (the render measures 30 · 27 · 14 · 29) | Rendered (`theme-V3-pixelswing.wav`) to v2.0: still has the old bar 9 | The chip leads the melody over a small swing band. Swing starts in bar 3 (the chip hook itself swings). Brushes switch to sticks at f240. The hits are shout chords, and the walking bass runs through bars 4–10. In bar 10 the muted trumpet trades two-beat phrases with the chip lead. |
| **V4 "Piano & Pixels"** | piano, chip and sub only (the render measures 53 · 8 · 0 · 39) | Rendered (`score/v4.py`, `theme-V4-pianopixels.wav`) to v2.0: still has the old bar 9, and adds a clarinet line and a title string pad this script doesn't have (§9.2) | Solo piano and chip. The hits are piano clusters with chip arpeggios and sub. The piano's left hand walks, and its right hand takes the muted-trumpet line in octaves. **The PAD stays**: it's the only other colour. |

**The eight brass accents** (the numbering used everywhere below): **#1** f195 (a cup-muted stab) · **#2** f240 · **#3** f300 · **#4** f360 (card stabs: trumpets and trombones only) · **#5** f414–419 (the trumpet rip) · **#6** f420 (the only full shout, saxes included) · **#7** f480–532 (the roll call: eight stabs, one gesture) · **#8** f630 (the horn swell, the last brass). Separately, **the one horn melody** is the Harmon-muted trumpet over bar 10 (f540–599). No other brass, and no Harmon mute anywhere before f540 (SFX included).

**Harmonic plan (all variations):** open fifths with **no third** in bars 1–2 (the D♭ colour note in the pause is ♭6). **Fm(add9) at f120** is the first chord with a third, the moment the story "picks a side." Bar 4 goes D♭maj7 → Fm9 → C7(♭9) into the dinner. The card hits are **Fm11 (f240) · D♭maj9(♯11) (f300) · B♭m9 (f360) · C7(♯9♭13) (f420)**, whose E natural pulls home to F. **Bar 9 (the roll call):** Fm9 ×4 → D♭maj7(♯11) ×2 → C7(♯9♭13) → **an open fifth on F with no third**: the player who doesn't exist yet hasn't picked a side. Bar 10 is a line cliché over F minor: F–E–E♭–D in the bass (Fm, Fm(maj7), Fm7, Fm6). Bar 11 goes D♭ → C7 over a timpani F roll, and **f630 is a quartal stack C–F–B♭–E♭ over F, topped by G (the 9th), with no third.**

**The knee motif** is one bar of eighths, **F F F F G A♭ C F**: the flat line, then the leap. It is stated at every scale. The cold open plays only the leap (G A♭ C F, f105–116). 1993 plays only the flat (F F F). Bar 4 plays the whole knee swung. Each card bar carries four chip Fs (the flat line), and f465–475 is the kink (G A♭ C) into F at f480. **Bar 9 plays the whole knee as eight stabs**, and bars 10–11 play it slow, one tower per beat.

**Where it swings:** bar 4, the dinner (bars 5–8) and the skyline's bar 10. **Where it plays straight:** the cold open, 1993 (the machine doesn't swing yet), **the roll call** (straight eighths, so every portrait gets 7–8 frames), the bar-11 build and the title. The chant's "A-G-I!" is straight 16ths inside the swing and is locked, never swung.

---

### 3.2 Scene 1: COLD OPEN (f0–119) · moment `mcoldopen`
**Sets.**
- **INSERT:** Mas's monitor, full frame at native resolution. A generic dark-mode Z post composer (no real logo or UI), with a log chart below it: axes, a faint 1-px grid, a flat cyan line to the knee and a **visible upturn past it**, drawn dotted (the future).
- **ROOM:** the dark room at night. Mas sits at his desk in 3/4 front view (`masDesk`), facing his monitor at frame-left; its screen faces away from us. THE ORB floats at his shoulder, frame-right of his head, slightly above eye level. A server rack with LEDs, a glass of water on the desk. The only light is monitor cyan.

| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 0.000–0.625 · f0–14 · 1.1 | **[BASE] INSERT.** Black screen. A 4×8 px cyan block cursor sits at (298, 124) native, which is 62% x / 46% y: the spot the loop returns to. It blinks on the beat, on f0–7 and off f8–14. CAM locked. | **MUS:** felt piano F5 at f0, with a 1-frame chip "cursor glint" on F6. Sub drone F1+C2 (open fifth, no third) fades in over f0–29; **the music owns the drone** (SFX `room_drone` is cut, §9.3). `V2:` celli and basses hold the fifth instead of the sub; harp harmonic F5. `V3:` the F5 is a 12.5%-duty chip square doubled by felt piano. `V4:` piano alone; low F1+C2 under the pedal, no sub.<br>**SFX:** `server_hum` in, at −30 dB. |
| 0.625–1.000 · f15–23 · 1.2–+8 | **[BASE] INSERT.** The composer steps up from black in 3 palette steps (f15–17): a tiny cowlick avatar, the empty draft field and a [Post] button. Below it, the chart: axes, the flat cyan line, the dotted upturn, and a blinking dot at the knee with its label, ON SCREEN **"you are here"** (legible from f18; the Ep1 dot sits at x = 0.50 of the chart [SLOT]). At f18 the first letters type. The cursor is on f15–22. | **MUS:** piano F5 and chip glint at f15.<br>**SFX:** soft key taps begin at f18 (below). |
| 1.000–2.417 · f24–57 · 1.2+9–1.4+12 | **[BASE] INSERT.** The line types, keyed to the VO's word-timing JSON and running **6–8 frames ahead of the voice** (6 on the first phrase, 8 on the second, as in D4): he reads back what he just typed. "near the singularity;" types over f18–49, and the cursor waits after the semicolon (f50–57). ON SCREEN (voiced) **"near the singularity;"** [SLOT] | **VO MAS (f24–57):** *"near the singularity;"* ("near" from f24–25, "singularity" ends f55–57 in every take). Soft and close-mic; he's reading his own post aloud to an empty room. No word is stressed.<br>**MUS:** piano F5 at f30 and f45. **The music ducks under the VO:** every stem except the sub −6 dB (strings −9 dB) over f23–91, 2-frame attack, 6-frame release, lifted inside the pause (f58–71). `[SCORE]` cut the chip glints at f30/f45 (they sit on the consonants).<br>**SFX:** one `key_tap_soft_01–06` per typed character and `key_tap_space` per space, on the reveal frames f18–49 and f64–83, at −30 dBFS or lower under words `[SFX]` (replaces the free-running `typing_soft`). |
| 2.417–3.000 · f58–71 · 1.4+13–2.1+11 | **[BASE] INSERT.** The semicolon pause. Nothing types, and the cursor blinks once (on f60–67). At f64 typing resumes: "unclear…" | **VO:** the pause, room tone only (f58–71).<br>**MUS:** low piano D♭2 at f60, ending at f71: the colour note in the longest pause [SLOT]. The drone holds the F–C fifth, still with no third. `[SCORE]` delete the felt A♭2 (the third of F) and end the D♭ chord at f71. `V2:` the D♭ is on bass clarinet. |
| 3.000–3.750 · f72–89 · 2.1+12–2.2 | **[BASE] INSERT.** "unclear which side." types over f64–83. From f84 the whole line is up: ON SCREEN **"near the singularity; unclear which side."** On "side" (f86–89) the dot climbs the curve in whole-pixel steps and leaves through the top edge of the screen at f89. | **VO MAS (f72–91):** *"unclear which side."* ("unclear" f72, "which" f81, "side" f86–91). "Side" is left hanging, neither falling nor rising. **Every take is fitted to end by f91:** the "side" vowel is shortened (stretch ≈ 0.6 on the vowel, ≈ 0.7 on the word: f86–94 becomes f86–91). Its final "d" lands on f90–91, just over the cut, and only the room tail runs past f91. No breath follows. |
| 3.750–4.375 · f90–104 · 2.3 | **[BASE] ROOM**, cut on the pluck at f90. Mas's face is lit cyan from frame-left, his hands on the keys. The Orb's iris is half open. Rack LEDs blink on straight eighths. Eggs: the desk tally *`II`* [SLOT], two popped collars on the coat hook [SLOT], the water glass with its dead-flat line. At f93 the head swaps to the 'turn' drawing, and at f94 to 'camera': **his eyes snap to the lens.** f97–99: the Orb's iris swivels to the lens in 3 drawings. f99: the Orb's scan fan, a thin cyan cone, opens and sweeps left to right. **f100–104 [GLYPH-MASKED]:** inside the cone only, the room is an endless data-center cathedral made of tokens, rack pillars receding to a vanishing point. Outside the cone the room stays BASE. At f105 the cone is gone. CAM locked. | **MUS:** the piano stops. The pluck at f90 as the dot exits: harp F5, pizzicato C5 and chip F6, ducked 3 dB so the final "d" of "side" is heard. Under the glimpse there's only the drone: **no sting.** `[SCORE]` cut the violins that sustain f58–113.<br>**SFX:** Orb servo at f97 (a tuned chip whirr on C6 `[SFX]`); scan "shhk" at f100 (`orb_scan_sweep`, a filtered 5-frame noise sweep, retuned to F/C `[SFX]`). No `glyph_shimmer`. |
| 4.375–4.667 · f105–111 · 2.4–+6 | **[BASE] ROOM.** He's still looking at us. At f107, the micro-smile: **the mouth moves one pixel** (the 'smile' stamp). At f110 his near hand lifts to the mouse (a drawing swap). CAM locked. | **MUS:** the knee's leap begins: G5 (f105), A♭5 (f108). Felt piano and harp with celesta, doubled an octave up by a 25%-duty chip pulse, so the machine takes the tune. (This A♭ is a passing tone; the first chord with a third is f120.) `V2:` celesta with chip. `V3:` chip lead, piano under.<br>**SFX:** `reverse_swell_1beat`, end-anchored at f120 (the SFX owns this swell; `[SCORE]` cut the music `revswell` at f105). |
| 4.667–5.000 · f112–119 · 2.4+7–end | **[BASE → 1-BIT paper] INSERT**, cut on the click. At f112 the pointer clicks [Post] and the button inverts for one frame. f113–117: the line bursts into pastel token chips, one per token: ⟨near⟩⟨ the⟩⟨ singular⟩⟨ity⟩⟨;⟩⟨ unclear⟩⟨ which⟩⟨ side⟩⟨.⟩ (*the semicolon gets its own chip*). They fly past the frame edges in accelerating whole-pixel steps (4 → 16 px per frame). At f114 the chart snaps vertical (2 drawings). f116–119: a stepped Bayer fade in 4 steps up to the 1-BIT paper #E9E6DA, about 79% luminance, inside the ≤80% rule. | **MUS:** C6 (f112) and F6 (f116), piano with chip.<br>**SFX:** `post_click--chip` at f112; the swell peaks at f119. |

### 3.3 Scene 2: 1993 (f120–179) · moment `meras`
**Set.** **[1-BIT]** in a 3:2 pillarbox (405×270, centred, with 37/38 px black bars): the proportions of the era's screens. KID MAS, age 8 (`masKid`, native 1-bit render), sits at a beige computer with no logo; the model is never named. We see him in 3/4 front, with the screen facing away from us and its back glow on the wall. **Animated on fours** (a new drawing every 4 frames), except the dialog and the pointers. SFX here use the `--chip` flavour.

| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 5.000–5.625 · f120–134 · 3.1 | **[1-BIT]** Hard cut from the paper white. The kid watches the away-facing screen. f124: 'turn' drawing. f128: 'camera' drawing, **the same unblinking stare as f94** (a match on the eyes). From the screen's back glow a **staircase line**, the curve as 1-bit jaggies, climbs the wall. ON SCREEN **"1993"** (date card, top-left inside the pillarbox, f120–134). f133–134: two 1-px dithered zoom rectangles expand from the kid's screen. CAM locked. | **MUS: DROP on Fm(add9)**, the first chord with a third: the story picks a side. Sub boom on F1, chip square bass on F2, chip noise hits. The beeper hook plays F (f120), F (f127, straight), F (f135); at f120 the beeper sounds A♭4 and C5 with its F5, so the third arrives in the machine's voice. `[SCORE]` add the piano's left hand: Fm9 (F2 C3 A♭3 G4), pedalled to f164. **The chip plays straight: the machine doesn't swing yet.** `V2:` a timpani F and low strings on the drop, with the chip hook on top. `V3:` the hook already swings (F f120, F f130, F f135), with brushes. `V4:` piano Fm9, the chip hook and sub. |
| 5.625–6.250 · f135–149 · 3.2 | **[1-BIT]** f135: the world freezes (the kid's drawing holds) and the alert dialog is fully open, about 340 px wide (`ui.ts alertDialog`): a 2-px frame, a hard drop shadow, a 16×16 **pixel-Orb icon** where the "!" would be, and the title bar egg *`age 8`*. ON SCREEN **"MAS MANALT"** (display face) / **"no equity."**, with the buttons **"Cancel"** (greyed with a 50% dither) and **"OK"** (the default, double border). At f146 a stranger's arrow pointer slides in from frame-right: a pointer with no hand and no owner. | **MUS:** beeper F at f135, then **the chip rests while the dialog is open.** The piano lets Fm9 ring, and the sub holds. |
| 6.250–6.875 · f150–164 · 3.3 | **[1-BIT]** At f150 the stranger's pointer clicks Cancel. **Nothing happens:** the greyed button doesn't even invert. The pointer withdraws over f156–160. (No tooltip: the bonk explains it.) | **SFX: bonk at f150,** `alert_bonk--chip`, E4 dropping to E3, 60 ms, dry: **E against the F pedal**, the leading tone that pulls home at f420 (chosen so it can't sound like an OS beep). The SFX owns the bonk: `[SCORE]` delete the square-bass B2 at f150. Otherwise silence. |
| 6.875–7.000 · f165–167 · 3.4–+2 | **[1-BIT]** At f165 the kid's own pointer clicks OK, and OK inverts for one frame. f166–167: the dialog collapses back into the screen along the zoom rectangles, in reverse. | **SFX:** `dialog_ok_click--chip` at f165.<br>**MUS:** beeper C6, with square C3, at f165. |
| 7.000–7.500 · f168–179 · 3.4+3–end | **[1-BIT → EARLY-WEB16]** The OK fires the staircase line off the wall toward frame-right. A **glowing 1-px render front** (vertical, with a 5-px glow; `transitions.renderFront`) chases the line's tip across the frame in 12 frames. Behind it the world re-renders in EARLY-WEB16, and **the pillarbox bars retract to full 16:9: the frame widens with the era.** From f172 the TPOOL keynote screen is revealed behind the front. No label announces the upgrade. CAM locked; the front moves, the camera doesn't. | **MUS:** beeper F at f172. **The chip gains voices as the front passes:** a rising arpeggio F–A♭–C–E♭–F (f168/170/172/174/176), with a second pulse voice and a triangle bass entering by f179 `[SCORE: add; missing in the render]`. A brushed-snare swell (f172–179) brings in the trio. `V2:` harp glissando up with a string swell. `V3:` a brush fill with the chip arpeggio. `V4:` a piano run up with the chip arpeggio.<br>**SFX:** none. **A style switch gets no sound of its own** (`render_front_sweep` and `tape_start` are cut). |

### 3.4 Scene 3: 2008–2014 (f180–239) · moment `meras`
**Set.** **[EARLY-WEB16]**, full 16:9. The **2008** keynote stage (`masStage`), then the **2014** WHY COMBINATOR throne (`masThrone`). The last row is the bridge into 2015. SFX use `--chip`.

| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 7.500–8.125 · f180–194 · 4.1 | **[EARLY-WEB16]** The 2008 keynote stage. THE SLEEVE (a faceless turtleneck sleeve and a hand only, entering from the frame-left edge, with no frailty cues) hands off the clicker. MAS, 23, strides on in two stacked polos, and the collars pop at **f180 and f190** (2 drawings each, with a 1-px hop), on the hook's swung Fs. On the giant screen: ON SCREEN **"TPOOL"** with a BETA starburst, and the thread as a GPS breadcrumb (a dotted cyan line) ending at a pin; egg *`where u at?`*. ON SCREEN **"2008"** (date card, f180–194). CAM: a locked wide; the foreground audience silhouettes scroll 1 px every 2 frames. | **MUS:** the trio lands, **swung**, and plays **through a sample-chip filter: the band at the era's fidelity.** Brushes (kick on 1 and 3), upright bass, and piano playing the knee as the bar-4 hook, F f180 · F f190 · F f195 · F f205 · G f210 · A♭ f220 · C f225 · F f235. The chip doubles the hook's top line an octave up. Harmony: D♭maj7 (f180–209) → Fm9 (f210–224) → C7(♭9) (f225–239). `[SCORE]` remove the 15-cent tape wow (the cassette is retired) and the boom-bap kick on 2& and 3&. `V2:` pizzicato strings and harp carry the hook, with no kit. `V3:` a full swing kit, with the chip on the hook. `V4:` piano hook and chip only.<br>**SFX:** `collar_pop--chip` on A♭4 (f180) and C5 (f190) `[SFX: retime from f187]`. |
| 8.125–9.375 · f195–224 · 4.2–4.3 | **[EARLY-WEB16]** **Hard cut** to 2014, WHY COMBINATOR. Hoodie founders holding forks and laptops (founders only, never islanders) hoist MAS, 29, in a hoodie with a tiny parachute pack still on his back, onto a throne of laptops and ramen cups (a 3-drawing lift, f198–206). At **f205** the two collars re-pop out of the hoodie's neck. LUAP (fleece; egg patch *`LUAP · CALLED IT. (IN AN ESSAY.)`*) drops a paper crown that hops down a dotted, Flash-era motion path on twos (f205–219) and lands on Mas's head at f220; crown egg *`PRESIDENT`*. ON SCREEN **"2014"** and **"WHY COMBINATOR"**. **The sign is flat #FF7F2A on cream #F3EEDC, the approved parody pair; no pixel is ever #FF6600 (YC's orange)** (§9.5 note 4). Orange on cream is only 2.2:1, so the must-read letters take a 1-px #000033 outline. CAM: a locked low angle. | **MUS: big-band accent #1 at f195:** a cup-muted stab (3 trumpets, 2 trombones) on D♭maj7 through the sample-chip filter, short, with a swung release. The hook continues (G f210, A♭ f220). `V2:` horns and trombones only. `V3:` a full-band shout. `V4:` a piano cluster with chip.<br>**SFX:** the collar re-pop at f205 (`collar_pop--chip`, F5; the three pops spell A♭–C–F, the knee's top) `[SFX: retime from f202]`; the paper crown's flutter (f205–219); a soft landing tick at f220. No crowd "ohh". |
| 9.375–10.000 · f225–239 · 4.4 | **[EARLY-WEB16 → BASE]** A **match cut on the crown's 2×2 glint**: it holds its screen position while the frame around it becomes THE WOODROSE, and the glint is now a candle flame on the dining table. f225–229: a 5-frame render front sweeps out from the flame and upgrades EARLY-WEB16 to BASE, the house palette. A candlelit private dining room at dusk (egg: the menu card *`THE WOODROSE`*). GERG, already seated at Mas's right hand, types so fast his keycaps pop like popcorn (keycap sprites hop on their own curves). At f232 his napkin sketch swaps to a website (2 drawings). MAS sits at the head of the table, frame-left, fingers steepled, his water glass by his hand. The table runner is the cyan thread, lying flat. The background guests HALO and THE OTHER PAUL sit at the near side with their backs to us (no cards). ON SCREEN **"2015"** (date card, f230–247). CAM locked on the head of the table (camera x = 0). | **MUS:** the hook's last notes, C (f225) and F (f235), fall on the piano. Chamber strings (a quartet plus bass) enter with a swell, f225–239 `[SCORE: add; the strings are silent here in the render]`. `V2:` the string swell only. `V3:` a drum fill with a trumpet pickup. `V4:` a piano run.<br>**SFX:** `keycap_popcorn`, then `keyboard_roll` (Gerg's mechanical keyboard, straight 32nds accelerating, end-anchored on f240). **The keyboard is the roll:** `[SCORE]` cut the music's brush roll and the `revswell` at f228. No `tape_spinup`. |

### 3.5 Scene 4: THE WOODROSE, the four freezes (f240–464) · moments `mdinner1` (f225–359) and `mdinner2` (f345–479)
**Set.** One adventure-game room, **560×300 native**, with a long table in 3/4 top-down view and seats on both sides. The 480×270 camera window pans in whole pixels from x = 0 to x = 80 across the dinner (clamped at 80), and tilts up 30 px for the rocket.

**Positions (world x):**
- Mas's head chair about 30; GERG on the near side at about 90.
- ALYI on the far side at about 180. The back wall behind him becomes the server cathedral, with the rose window high up; the effigy stands in front of it at about 200–215.
- MARIO on the far side at about 290, with a round vault door in the back wall behind him.
- The far end at about 430: the landing spot, with ceiling tiles above. The neon sign hangs over x ≈ 400–540.

**Staging.** Seated figures are about 50 px tall; standing figures are 82–96 px (`masStage` 82, Mario 84, Nole 96). The acting lives in the card portraits. **Mas walks at about 4 px per frame** (a 6-drawing walk on twos, 8 px per drawing), and the camera follows at 1 px per frame only while he walks. **Carded founders stay frozen (navy and cream) for the rest of the dinner; the rest of the room thaws at each card close.** SFX here use the hybrid flavour, except the klaxon (`--chip`).

**Default card placement** (every card stays clear of the founder's face, Mas's gag and any must-read prop; the template is in §6.1):
- GERG: right half.
- ALYI: upper right.
- MARIO: rising from the bottom-left.
- NOLE: upper left.

#### 3.5a GERG (f240–284)
| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 10.000–10.208 · f240–244 · 5.1–+4 | **[2-TONE FREEZE] GERG FREEZE.** At f240 every pixel except Mas, the thread and the UI (the `2015` card) remaps to navy and cream. f240 is the pop frame (cream lifted one step, ≤80% white), with a 2-px integer shake over f240–241. The keycaps freeze mid-air. f240–242: the card's 112×136 portrait window opens in 3 steps on the right half: Gerg head-down, lit from below, with his green accent surviving only in his name. At f243 ON SCREEN **"GERG MOCKBRAN"** cuts in (the 14-px display face, terminal green #39FF88); at f244 the accent rule draws. | **MUS: HIT on Fm11 at f240 (brass accent #2):** a low piano cluster, timpani F, a short stab for trumpets and trombones only, and four chip Fs across beats 2–3 of the bar: the knee's flat line. Then the band drops to walking bass and brushes, swung, while the strings sustain the hit chord. **The harmony freezes; the bass keeps walking, like Mas.** `V2:` an orchestral hit (timpani, horns, trombones, strings), with pizzicato walking bass. `V3:` a full-band shout chord; sticks on the ride from here. `V4:` a piano cluster with chip and sub; the left hand walks.<br>**SFX:** the freeze latch at f240 (`freeze_hit_F--chip`, gated to about 0.12 s): the same short latch lands on all four card hits. |
| 10.208–11.250 · f245–269 · 5.1+5–5.2 | **[2-TONE FREEZE]** The tagline types on at 2 characters per frame (f246–253): ON SCREEN **"ORG CHART: HIM."** From f254 the stat row egg, *`SLEEP: DEPRECATED`* (7 px, low contrast). The `2015` card holds to f247. At f255 Mas, the only thing moving, in full colour, unsteeples his hands and **lifts his glass: it takes his colour at the touch** (rule 3), and its water line stays level. CAM locked. | **BLIP GERG:** one blip per word, at f246 ("ORG"), f248 ("CHART:") and f251 ("HIM."): the clicky tick of `blips.py`, pitched on Fm11 tones (C7, E♭7, F7).<br>**MUS:** the walking bass goes F2–A♭2–C3–D3 in quarters, brushes play swung eighths, and the strings hold Fm11. From f255 a viola-and-cello counter-line begins; it runs under the whole dinner and lands on F4 at f480. |
| 11.250–11.875 · f270–284 · 5.3 | **[2-TONE FREEZE] Mas's gag, the week's couch gag [SLOT].** He reaches over (an arm drawing at f270) and plucks one floating keycap out of the air (f274): **CTRL** in Ep1 (§8.1). It takes his colour the instant he touches it, and he pockets it in his hoodie (f278–282). Only the keycap sprite changes by episode: the room plate is cached, and Mas is a separate layer anyway. The card text holds to f284. CAM locked. | **SFX:** `item_take` at f278, a quiet pickup (not a BLIP: no text box is open for it) `[SFX: add]`.<br>**MUS:** the walking bass continues, with a brush pickup over f282–284. |

#### 3.5b ALYI (f285–344)
| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 11.875–12.500 · f285–299 · 5.4 | **[BASE; Gerg masked 2-TONE]** Time resumes around Gerg: the room steps back to BASE in 2 frames (f285–286), while Gerg stays navy and cream and his card closes in 2 steps. Mas stands (f285–287), glass in hand, and walks toward Alyi's side (f288–327), the camera following at 1 px per frame (x 0 → 40 by f327). The back wall behind ALYI's seat lights panel by panel into a **server cathedral**: rack-pillar columns, LED votives (palette-cycled), a neural-net rose window, and god-rays built as stepped dither bands. The spires are antenna masts, **with no religious symbols.** ALYI **rises still seated: his dinner chair lifts with him**, 1 px every 2 frames (f288–299), napkin in lap, with a rack pillar always cropping his left edge. At f290 a paperclip-robot effigy ignites in front of the cathedral (an 8-frame hand-pixelled flame loop), labelled ON SCREEN **"UNALIGNED"** (legible from f296). | **CHANT:** a whispered *"feel…"* at f285 and *"…the…"* at f295 (the swung "and"). Four to six synthetic stock voices, layered and detuned, whispered close-mic and panned wide. **No single leader voice.**<br>**SFX:** `flame_whoomph` at **f290**, low-passed at 2 kHz and 4 dB down, under the whisper `[SFX: retime from f285]`.<br>**MUS:** a reed-organ (harmonium) swell on a D♭ pedal (f285–299), never a church organ `[SCORE: add]`; the walking bass continues. |
| 12.500–13.125 · f300–314 · 6.1 | **[2-TONE FREEZE] ALYI FREEZE on "A-G-I!"** (the f300 pop and a 2-px shake). **Template break:** his card is a stained-glass lancet window that drops from the top of frame in 3 whole-pixel steps (f300–302), upper right. In its portrait his eyes are scrolling token streams: 3-px ticks drawn in BASE, **deliberately not a GLYPH switch.** At f303 ON SCREEN **"ALYI"** (ember #FF6A1A); f306–312 types **"FEELS THE AGI."**; from f313 the stat row egg *`PRODUCTS: 0 · EFFIGIES: 1`* (the fallback; `BUNKER: YES` is held pending a ruling, §9.10). | **MUS: HIT on D♭maj9(♯11) at f300 (brass accent #3):** low piano, timpani D♭, the reed organ, a short stab for trumpets and trombones, and the four chip Fs. Then walking bass and brushes, with the strings holding. `V2:` timpani, horns, trombones and strings with the organ. `V3:` a shout chord. `V4:` a piano cluster with chip and sub.<br>**CHANT:** a shouted *"A-!"* at f300, *"G-!"* at f303 and *"I!"* at f307: straight 16ths inside the swing, locked. The same 4–6 voices at full voice, dry.<br>**SFX:** the freeze latch (`freeze_hit_Db--chip`, gated).<br>**No BLIP for Alyi:** the congregation is his voice. |
| 13.125–13.667 · f315–327 · 6.2–+12 | **[2-TONE FREEZE]** Held. Mas, in colour with his glass, reaches the frozen effigy fire (his walk ends at f327). CAM follows him to x = 40. | **MUS:** walking bass and brushes. |
| 13.667–14.167 · f328–339 · 6.2+13–6.3+9 | **[2-TONE FREEZE] Mas's gag.** He holds a marshmallow on a fork (*the fork is from WHY COMBINATOR*) to the frozen fire. The flame stays navy and cream **and toasts it anyway:** the marshmallow steps from white to gold to brown in 3 drawings (f330, f334, f338). He blows on it once, at f339. CAM locked. | **MUS:** walking bass and brushes. **SFX:** none; the frozen fire makes no sound. |
| 14.167–14.375 · f340–344 · 6.3+10–end | **[BASE; Gerg and Alyi masked 2-TONE]** Alyi's card closes in 2 steps (f340–341). The room thaws except the two carded founders, and Alyi still hangs in mid-air in his chair, in navy and cream. Mas eats the marshmallow and walks on toward the vault (f340–359); the camera resumes at 1 px per frame (x 40 → 60 by f359). | **MUS:** a brush fill into the Mario pickup; the bass walks D♭3–C3–A♭2 down to F2 at f345 `[SCORE: walks[6]; the render's A2 clashes with the klaxon]`. |

#### 3.5c MARIO (f345–404)
| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 14.375–15.000 · f345–359 · 6.4 | **[BASE; Gerg and Alyi masked 2-TONE]** A round vault blast door in the back wall is already swinging open (4 held drawings, f345–352), with amber beacons (palette-cycled, 2 revolutions per second or slower) and steam puffs (a 4-frame loop). On the wall beside it, upper right, a safety HUD ticks checkmarks at f348, f351 and f354: ON SCREEN **"RED-TEAMED ✓✓✓"**. **It stays legible, frozen, through f400, clear of the card.** MARIO (curls, glasses, an ink-blue fleece; **never red**) steps out with a finger raised (f352). Mas, walking on the far side of the table, arrives beside the vault. Eggs: a sheet stamped *`DRAFT — DO NOT PUBLISH`* flutters out; a whiteboard reads *`BIG BLOB OF COMPUTE`* ([K]: verify before lock, or cut). Nothing else is in the vault. | **SFX:** `klaxon--chip`, a two-tone B♭4/F4 on mechanical straight eighths, f345–359 (the `--chip` flavour has no Harmon-trumpet layer); steam hiss; three check chimes at f348, f351 and f354 (chip F6, G6, A♭6: **the knee, climbing**) `[SFX: three one-shots replace vault_chime_triple; paper_flutter is cut]`.<br>**MUS:** pizzicato on the swung off-beat (f355) against the klaxon's straight eighths `[SCORE: add]`; the bass sits on F2, the dominant, into B♭ at f360. |
| 15.000–15.750 · f360–377 · 7.1–7.2+2 | **[2-TONE FREEZE] MARIO FREEZE** (the f360 pop and shake). **Template break:** his card rises from the bottom-left edge in 3 whole-pixel steps (f360–362) on a **parchment plate (#E9DCC0) with ink-blue type (#1F3A93), about 7.4:1 contrast.** His accent needs the light plate to read (§9.5 note 2). At f363 ON SCREEN **"MARIO"**; f366–377 types **"HAS CONCERNS. HAS GPUS."**. The stat row egg reads *`DOOM RISK ▰▰▰▰▰▰ · WORD COUNT ▰▰▰▰▰▰▸▸▸`*. The HUD stays readable in navy and cream, upper right. | **MUS: HIT on B♭m9 at f360 (brass accent #4):** low piano, timpani B♭, strings, a short stab for trumpets and trombones, and the four chip Fs. **The klaxon is cut dead at f360.** The strings hold B♭m9; **the dead klaxon is the only reaction.** `V2:` timpani, horns, trombones and strings. `V3:` a shout chord. `V4:` a piano cluster with chip and sub.<br>**SFX:** the freeze latch (`freeze_hit_Bb--chip`, gated).<br>**BLIP MARIO:** at f366, f368, f373 and f375, one per word: the soft marimba of `blips.py` on B♭m9 tones (C5, D♭5, F5, A♭5), **each followed by a smaller echo blip 4 frames later: a sub-concern** (a sound egg [INVENTED]). |
| 15.750–16.250 · f378–389 · 7.2+3–end | **[2-TONE FREEZE] Template break:** the WORD COUNT bar runs off the card's bottom edge and becomes a **paper scroll that unrolls about 96 px along the table** toward frame-right (8 px per frame, f378–389), its free end stopping at Mas's feet by the vault. **It never crosses the card's text.** Eggs, at 7 px: *"…country of geniuses in a datacenter…"*, *"…machines of loving grace…"* ([K]: upgrade to [P] from the essay before lock), and on the last line *`ADDENDUM:`* followed by a tiny price tag [PROPOSAL]. Mas steps over the scroll in place (no walk cycle; CAM holds x = 60). | **MUS:** walking bass and brushes; the bass walks down B♭–A♭–F–D♭ over bar 7 (f360/375/390/405) into C at f420.<br>**SFX:** a paper-unroll swish, f378–389 `[SFX: add]`. |
| 16.250–16.792 · f390–402 · 7.3–+12 | **[2-TONE FREEZE] Mas's gag.** On the far side of the table, above the card's top edge, he picks up the scroll's tail (it takes his colour), rolls it into a paper telescope, and peers up at the ceiling (f394–402): **exactly where the rocket will come through.** CAM locked at x = 60. | **SFX:** `item_take` at f392.<br>**MUS:** the bass walks on toward D♭. |
| 16.792–16.875 · f403–404 · 7.3+13–end | **[2-TONE FREEZE]** Mario's card closes in 2 steps. Mas lowers the telescope. | **MUS:** a brush fill.<br>**SFX:** a low rumble begins overhead. No `paper_whip`. |

#### 3.5d NOLE (f405–464)
| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 16.875–17.500 · f405–419 · 7.4 | **[BASE; Gerg, Alyi and Mario masked 2-TONE]** The room thaws. CAM tilts up 30 px in whole pixels (f405–409) to the ceiling while it pans x 60 → 75. The tiles burst and each hops on its own curve, and a **SPACEZ** booster descends on a 4-frame flame loop. CAM tilts back down with it (f410–419), with a seeded 3-px integer shake over f414–419. The candles blow flat (2 drawings). **Every glass on the table sloshes** (3 drawings each, offset), **except Mas's**: he keeps walking through the crash, and his glass is composited after the shake, its water line dead flat. His cowlick whips (a 3-drawing spring), but his face doesn't move. The neon sign swings into frame on its chains (4 drawings, f405–411) and hangs lit: ON SCREEN **"OPEN AI"** (legible from f412; generic neon lettering, never the real wordmark's typeface or logo). The booster's wordmark, ON SCREEN **"SPACEZ"** (legible from f410), stays in frame through bar 8. The rocket hits furniture only. | **SFX:** `ceiling_burst` at f405; `rocket_roar` f405–419, its boom folding into the f420 hit; tile clatter. (No chorus of sloshing glasses: it would be buried.)<br>**MUS: big-band accent #5:** a trumpet-section rip up to C (f414–419), the pickup into the shout `[SCORE: add; the render has a timpani roll here]`. `V2:` horns and low strings crescendo. `V3:` a full-band rip with a snare fill. `V4:` a piano glissando with a chip riser. |
| 17.500–18.125 · f420–434 · 8.1 | **[2-TONE FREEZE] NOLE FREEZE at touchdown** (the f420 pop and shake). Mas has stopped at the table's far end for the landing. The landing legs are on the tablecloth and the bread basket is crushed flat. NOLE leans out of the hatch mid-post, a phone in one hand and a novelty check in the other (egg *`$1,000,000,000*`*; the asterisk is never readable). **Template break:** his card slams in from frame-left in 2 steps (f420–421) and lands **crooked**. The frame is drawn with a stair-stepped 1:8 tilt, not rotated, and sits upper left, clear of the sign, the booster and the check. At f423 ON SCREEN **"NOLE"** (rocket red #E0301E); f426–430 types **"NAMED IT."**. | **MUS: THE BIGGEST HIT at f420, on C7(♯9♭13)**, whose E natural pulls home to F. **Big-band accent #6, the only full shout** (trumpets, trombones, saxes), with low piano, timpani C, sub, and the chip line on E (bar 8). Then walking bass and brushes. `V2:` the biggest orchestral hit: timpani, horns, trombones, low strings and sub, no saxes. `V3:` the band's biggest shout. `V4:` the biggest piano cluster, with chip and sub.<br>**SFX:** `landing_thunk` (high-passed at 150 Hz); the freeze latch (`freeze_hit_C--chip`, gated).<br>**BLIP NOLE:** at f426 and f429: the overdriven square of `blips.py`, with a small up-bend on the second, **ending on C6 or E♭6** (never F5, which clashes with the E). |
| 18.125–18.750 · f435–449 · 8.2 | **[2-TONE FREEZE]** At **f435 (k15)** a red stamp slams onto the card under the subtitle without covering it (a 1-frame, 1-px kick): ON SCREEN **"SUED OVER IT."** (`ui.ts` lands it at k14 today, §9.5 note 1). Mas, in colour, walks the last stretch (f435–449) under the booster's legs toward the sign; CAM reaches x = 80 at f439 and holds. | **SFX:** the stamp at f435 (`rubber_stamp_C`: a stamp slap, a wood knock on C3, a C2 body and a soft timpani C2).<br>**MUS:** walking bass and brushes. |
| 18.750–19.000 · f450–455 · 8.3–+5 | **[2-TONE FREEZE] Mas's gag.** Below the sign he lifts his glass and sips (lift f450, sip f451–453, lower f454–455). Every other glass on the table is frozen mid-slosh; his surface is dead flat. | **MUS:** walking bass and brushes. |
| 19.000–19.375 · f456–464 · 8.3+6–end | **[2-TONE FREEZE] While time is still stopped**, Mas reaches up and unhooks the **N** from the end of the frozen OPEN (f456); it takes his colour. f457–463: he carries it along a whole-pixel path to the front of the word, and at f464 it clunks into place. **The frozen sign now reads NOPE AI** in navy and cream, with its N in full colour: ON SCREEN **"NOPE AI"** (legible from f464). **The world stops, and Mas renames the company.** Nole's card text holds to f464. CAM locked at x = 80. | **SFX:** `item_take` at f456; `letter_clunk` (F3 steel) at f464 `[SFX: retime from f466/f473]`.<br>**MUS:** a drum fill, f460–464. |

### 3.6 Scene 5: THE FOUNDING (f465–479) · moment `mdinner2`
| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 19.375–20.000 · f465–479 · 8.4 | **[BASE room; the four founders masked 2-TONE]** On the beat, time comes back. Nole's card closes (f465–466) into a hand-pixelled place card at his seat, and now each carded founder has one: *`GERG`*, *`ALYI`*, *`MARIO (UDIAB) · JOINS 2016`* (egg, corrected) and *`NOLE`*. The room thaws, but the four founders stay frozen in navy and cream. **The sign relights in one step at f465, in full colour like Mas: "NOPE AI".** **KEY ART (f465–479):** four frozen founders in navy and cream under a full-colour neon NOPE AI, with Mas in colour beneath it, glass in hand. The composition takes in the whole table, from Gerg at frame-left to the booster at frame-right. The table runner, the cyan thread, lies flat along the table: **its screen height is where bar 9's flat line starts** (a match on the thread). Egg: *`DEC 2015`* on a booster leg (verify). CAM locked. | **SFX:** `neon_ignite` at f465 (its ring retuned to C6, or removed, so it doesn't pre-empt the F6 at f480) `[SFX]`; `neon_buzz` f465–479, **cut dead on the f480 cut**.<br>**MUS:** chip and celesta play the kink, G5 · A♭5 · C6 at f465, f470 and f475, into F at f480; a drum fill, f465–479; the bass steps G♭2 (f465) into F at f480. |

### 3.7 Scene 6: THE PLAYERS, the roll call (f480–539) · moment `mrollcall`
**Set.** **[BASE]** Hard cut on the downbeat. **THE PLAYERS field:** the dusk sky's darkest ramp step (so both cuts, in at f480 and out at f540, are luminance-matched), with the cold-open chart's faint 1-px grid. **The thread** comes over the cut at the table runner's screen height and draws the knee left to right in whole-pixel stair steps: flat under flashes 1–4, rising under 5–8. It lives on the steady surround layer, so **it persists across the cuts** and the whole knee is on screen by f532.

**The windows.** Eight portrait windows (`ui.ts portraitWindow`, 112×136, the name-card size), **one at a time, cut on the eighth:** straight eighths, so each flash holds 7 or 8 frames. **Snap rule:** flash n (n = 0–7) cuts at ⌊480 + 7.5n⌋, so the cuts land on **f480, f487, f495, f502, f510, f517, f525 and f532**, and the flashes run 7, 8, 7, 8, 7, 8, 7 and 8 frames. The on-beat cuts meet their stabs exactly. The off-beat stabs sound at +7.5, so the picture leads them by half a frame (21 ms) and never trails (the same rule as `mrollcall` `CUTS`). Each window's bottom edge sits on the thread, so **the portraits ride the curve**:

| # | Frames | Note | Window (x, y) native | Thread under it (y) |
|---|---|---|---|---|
| 1 | f480–486 | F | (16, 100) | 236 |
| 2 | f487–494 | F | (64, 100) | 236 |
| 3 | f495–501 | F | (112, 100) | 236 |
| 4 | f502–509 | F | (160, 100) | 236 |
| 5 | f510–516 | G | (208, 84) | 220 |
| 6 | f517–524 | A♭ | (256, 60) | 196 |
| 7 | f525–531 | C | (304, 28) | 164 |
| 8 | f532–539 | F (octave) | (352, −8): the top rail is cropped by the frame edge | 128, then off the top |

(The flat line's target y is 236; if the room layout puts the runner elsewhere at f479, move the whole table by the same offset.)

**Each window:** a faction-colour fill behind the portrait (the player's own tower wall colour from the skyline, so the rooftop shot at f540 matches; **all eight fills, the cursor's token field included, sit on one luminance step and differ in hue only**), and one **signature action drawing on the cut**. **The read rule for the portraits** replaces the text rule here: one silhouette per flash, readable from its first frame; the key drawing holds **at least 4 frames**; anything that moves inside a flash (keys, a beacon, a toss, a splash) moves around a silhouette that doesn't change; and nothing new lands on a flash's last frame. Every row below passes it. **These are not name cards:** there is no must-read text, the 1.2 s card-hold rule does not apply, and nothing in them needs reading. Tiny name plates on the window's bottom rail are eggs (7 px, low contrast); **RUMPT's plate and the cursor's plate stay blank.** CAM locked: the windows cut, nothing slides. **Mas is not in the roll call.**

**Sound.** **Brass accent #7: stop-time.** The band plays only the eight stabs, on straight eighths (music onsets f480, 487.5, 495, 502.5, 510, 517.5, 525, 532.5). In V1: 2 trumpets and 2 trombones, open and short (about 4 frames), **doubled an octave up by the chip lead** (25% pulse), with upright bass and kick on every stab and sub F1 on stabs 1 and 8. No ride, no sustained strings (the viola-and-cello line's last note sounds inside stab 1 and releases with it) and no SFX. The top line is F5 F5 F5 F5 G5 A♭5 C6 F6: **the knee.** `V2:` horns and trombones with chip, pizzicato basses, timpani on stabs 1 and 8. `V3:` full-band shout kicks (trumpets, trombones, saxes) with the chip lead. `V4:` piano right-hand clusters doubled by chip, sub on stabs 1 and 8. **No "music fired" mute, in any variation.**

| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 20.000–20.292 · f480–486 · 9.1–+6 | **[BASE] 1 · TASYA** (MACROSOFT fill) **jangles a giant key ring**: the keys swing on the cut, and the follow-through drawing at f484 settles them. The thread runs flat from the frame's left edge under the window. Egg plate *`TASYA`*. | **Stab 1 (F):** Fm9, F5 on top (A♭–C–E♭–G under it); bass F2. The viola-and-cello line lands on F4 inside the stab (about 4 frames) and stops with it. |
| 20.292–20.625 · f487–494 · 9.1+7–end | **2 · RADNUS** (ELGOOG fill): **a polite smile under a spinning code-red siren** (palette-cycled at 2 revolutions per second or slower: it turns about a quarter in the flash). The siren's red stays inside the sprite; the fill is not red. Egg plate *`RADNUS`*. | **Stab 2 (F):** Fm9, F5 on top; bass F2. |
| 20.625–20.917 · f495–501 · 9.2–+6 | **3 · KRAM** (ATEM fill) **offers a soup thermos with a check floating in it** like a crouton. The thermos has no label and the check has no number: the soup is his trait (his character file puts it in his silhouette), not an event. Egg plate *`KRAM`*. | **Stab 3 (F):** Fm9, F5 on top; bass F2. |
| 20.917–21.250 · f502–509 · 9.2+7–end | **4 · NESNEJ** (INVIDIA fill), leather jacket with palette-cycled highlights, **tosses a GPU**: drawing 1 on the cut (f502–505), the GPU just leaving his hand; from f506 it's half out of the window's top edge, a second whole-pixel position (egg: it's the first to land on a roof at f585). Egg plate *`NESNEJ`*. **End of the flat.** | **Stab 4 (F):** Fm9, F5 on top; bass F2. |
| 21.250–21.542 · f510–516 · 9.3–+6 | **5 · RIMA TAMURI** (fill by episode, §8.2; NopeAI in Ep1) **steps into a spotlight**: a hard circular key light on its mark. Drawing 1, on the cut (f510): the house is dark and she's one step off her mark. Drawing 2 (f511): the light snaps on and she lands on her mark, holding to f516 (6 frames: the key image). The light's drift away, her device, lives in her rooftop loop (§3.8), not in the flash, so nothing moves on the flash's last frame. **It's her own light; she is never framed as filling in for anyone** (guardrails: no "understudy" framing). Egg plate *`RIMA TAMURI`*. **The leap begins.** | **Stab 5 (G):** D♭maj7(♯11), G5 on top; bass D♭2. |
| 21.542–21.875 · f517–524 · 9.3+7–end | **6 · THE WHALE** (PEEKDEEP's water as the fill), the company mascot (no founder, ever), **breaches on a budget**: 2 drawings, no overshoot, one splash. Drawing 1 on the cut (f517–520): clear of the water. Drawing 2 (f521–524): the one splash, with the whale still in frame. The budget is the joke; it is never silent or inscrutable. Egg plate *`PEEKDEEP`* [SLOT]. | **Stab 6 (A♭):** D♭maj7(♯11), A♭5 on top; bass D♭2. The A♭ is the knee's note: no gong, no pentatonic sting. |
| 21.875–22.167 · f525–531 · 9.4–+6 | **7 · RUMPT, silhouette only, at a gold podium, pointing** (the mystery-figure trope). He is backlit by the podium's own gold: a 1-px gold rim, no features, no tie colour and no text. The silhouette test is suit, podium and pointing arm; **never a fist pump.** The fill is the podium's gold. The plate is blank. He fills in only as the show airs him [SLOT] (§8.2). | **Stab 7 (C):** C7(♯9♭13), C6 on top; bass C2. **No voice, no SFX, no political audio.** |
| 22.167–22.500 · f532–539 · 9.4+7–end | **8 · The player who doesn't exist yet.** **[GLYPH-MASKED]** A portrait window holding only a **blinking cursor in GLYPH**: the interior is a dark token field, and the cursor is a 4×8 cyan block made of tokens, on f532–535, off f536–537, on f538–539. The window's top rail is cropped 8 px by the frame edge, and the thread's last segment runs up and off the top, **like the dot at f89.** The plate is blank. The cursor gains a face across the season [SLOT] (§8.2). | **Stab 8 (F, the octave):** F6 on top of **open fifths F–C, with no third**; bass F1 with the sub. It rings to f539.<br>**SFX:** `reverse_swell_1beat`, end-anchored at f540. |

### 3.8 Scene 7: SKYLINE, the group shot (f540–629) · moment `mfinale` · rooftop sprites in `studio/src/shared/pixel/cast/bosses.ts`
**Set.** **[BASE]** Hard cut on the downbeat. A pixel isometric skyline at dusk: a 720×300 native panorama with 3 parallax layers (the sky fixed, the water at half speed, the roofs at full speed). The camera scrolls right 1 px per frame and cranes up 1 px every 3 frames, settling on NopeAI at f629. **The roll call's thread becomes the roofline, unlit until f622.**

**The anime "everyone on the rooftops" group shot.** The players we just met stand on their towers, and **each repeats its roll-call action as its rooftop loop** (2–4 drawings), so the audience matches them at a glance: TASYA on MACROSOFT (the keys), RADNUS on ELGOOG (the siren), KRAM on ATEM (the thermos), NESNEJ on INVIDIA (the GPU toss), RIMA TAMURI under her spotlight, which swings onto her and drifts off again (her device, a 4-drawing loop; on NopeAI's roof deck in Ep1; §8.2 moves her), THE WHALE's fin in PEEKDEEP's moat, **RUMPT's silhouette at the gold podium on the far-left hill**, and **the cursor blinking on the tip of NopeAI's spire** (BASE, 2×4 px: the eighth player's rooftop) [PROPOSAL]. The skyline regulars SIMED, MARIO with ADELINA, and NOLE are on their towers too.

**Tower pops.** A tower **pops** by rising from below its ground line in 3 whole-pixel drawings, with a 2-px overshoot and a 4-frame dust puff; nothing scales. PEEKDEEP pops on a budget (2 drawings, no overshoot, no dust). **Tower wordmarks are must-read; person names are egg-size plates.** **The far-left hill** sits inside the settled frame at x ≤ 57 px (12%), clear of the title's safe area. It is not a tower. It is shared (§8.3): RUMPT's podium, the other side's matching prop, and the signpost with the one CZAR lanyard.

**Everything dated on the skyline is per-episode and shows only aired events** (§8.3). The Ep1 baseline below carries no dated eggs.

| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 22.500–23.125 · f540–554 · 10.1 | The frame lands on the skyline. **NOPEAI** stands at centre: a neo-gothic data-center cathedral in scaffolding, with a GPU-die rose window and steaming cooling towers (4-frame steam loops). RIMA TAMURI's spotlight drifts on its roof deck [SLOT]. **MACROSOFT** pops (f540–542, settled by f543), with its plinth running under NopeAI's foundation. TASYA on the roof jangles his key ring (2 drawings on fours). The far-left hill is established in its episode state [SLOT]; in Ep1, RUMPT's silhouette stands unlit at a dark gold podium, NEDIB's fountain pen stands in an inkwell, and the lanyard on the signpost has a blank tag. ON SCREEN **"MACROSOFT"** (from f543). | **MUS:** the pluck on F5: harp and pizzicato, with chip an octave up (f540). Upright walking bass and brushes, swung, f540–599: the line cliché F2–E2–E♭2–D2 (Fm, Fm(maj7), Fm7, Fm6), one bass note per beat. **THE MUTED-TRUMPET MOMENT:** a Harmon-muted trumpet (stem out) plays a lazy, swung counter-line over bar 10. It holds C5 over f540–564, touches B♭4 on the swung "and" of 10.2 (f565), sits on A♭4 over f570–584, and falls off from D5 over f585–599 (the D is the 6th of Fm6, over the D bass). **It's the only horn melody in the piece** `[SCORE: top priority; missing from the render; its own stem]`. `V2:` the line runs on through bar 11 (straight there), over harp and low strings. `V3:` the trumpet trades 2-beat phrases with a chip lead. `V4:` the piano's right hand plays it in octaves.<br>**SFX:** `tower_pop` (unpitched) on each pop. The music owns the plucks (`tower_pluck_*` are cut). |
| 23.125–23.750 · f555–569 · 10.2 | **ELGOOG** pops (settled by f558), with *`MINDDEEP`* beneath it (egg), under the CODE RED siren: a palette-cycled beacon turning at 2 revolutions per second or slower. RADNUS smiles politely, holding an extinguisher; SIMED plays speed chess against a robot arm (2 drawings). ON SCREEN **"ELGOOG"**. | **MUS:** pluck F at f555.<br>**SFX:** `siren_whoop_F--chip`, high-passed at 1.2 kHz and cut to one 8-frame whoop, clear of the trumpet's held C5. |
| 23.750–24.375 · f570–584 · 10.3 | **ATEM** pops (settled by f573). Fresh "AI" letters drip (3-frame drips) over a ghosted METAVERSE. KRAM (gold chain) holds out his soup thermos, as in the roll call. ON SCREEN **"ATEM"**. | **MUS:** pluck F at f570.<br>**SFX:** `drip_clack--chip`, −4 dB. |
| 24.375–25.000 · f585–599 · 10.4 | **INVIDIA** pops (settled by f588): a giant graphics card stood on end. NESNEJ, in a mirror-leather jacket with palette-cycled highlights, tosses GPUs to every roof along whole-pixel arcs; the one from his roll-call flash lands first. On NopeAI's roof they pile up red-hot with a 2-drawing shimmer and **keep their shape** (the Dalí sag arrives only after Ep4 airs, §8.3). ON SCREEN **"INVIDIA"**. | **MUS:** pluck F at f585.<br>**SFX:** `ka_ching--chip`, −4 dB (synthesized and tuned to F6, never a sample). |
| 25.000–25.625 · f600–614 · 11.1 | **The exes double-pop** on either side of NopeAI (settled by f603). **MISANTHROPIC** (brick #B8573A) is a lighthouse of stacked essays with a palette-cycled SAFETY beacon and a dangling price tag, blank in Ep1 [SLOT]; tiny MARIO waves, and ADELINA ticks a clipboard. **zAI** is a rocket on a gantry, with NOLE holding a megaphone. ON SCREEN **"MISANTHROPIC"** and **"zAI"**. | **MUS:** pluck G at f600: **the kink** (the knee began at f540). Bar 11 plays straight, as the band squares up for the title. Harmony D♭ (f600) → C7 (f615) over a timpani F roll. A riser starts: string tremolo crescendo, a chip noise sweep, a suspended-cymbal roll, and a snare roll from f600 building to f629. `[SCORE]` quantize the bar-11 roll and arpeggio notes at f613.1, f620.6 and f622.5 (the f615 and f622 onsets are 31–37 ms early).<br>**SFX:** none (`reverse_swell_2beat` is cut). |
| 25.625–25.917 · f615–621 · 11.2–+6 | Across the water, **PEEKDEEP** pops on a budget (settled by f617): a small building with one lit window, a whale-shaped water tower with a fishing line hanging off it, and THE WHALE's cheerful fin circling the moat (a 4-frame loop). Egg *`(NOT YET)`* [SLOT]. ON SCREEN **"PEEKDEEP"** (legible to f650). | **MUS:** pluck A♭ at f615.<br>**SFX:** `plop_water--chip`, unpitched, −4 dB. |
| 25.917–26.250 · f622–629 · 11.2+7–end | On the straight "and" of 11.2, **every rooftop edge ignites into one cyan line** (#3FE6FF). A 1-px line races along the roofs from left to right (f622–627), flat across the incumbents and steeper at the exes, then runs vertically up NopeAI's spire (f628–629), **through the blinking cursor at its tip**, and off the top of frame. The ignition's glow rim-lights the hill by 1 px, but **the line runs past the hill and never touches it.** The camera settles on NopeAI (f629). | **MUS:** pluck C at f622, the knee's leap. The riser peaks; the snare roll continues. No new SFX. |

### 3.9 Scene 8: TITLE (f630–689) · moment `mfinale`
| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 26.250–26.667 · f630–639 · 11.3–+9 | **TITLE SLAM** across NopeAI's blazing rose window: ON SCREEN **"MR. MAS"**, a hand-pixelled display wordmark with caps about 40 px tall, **in finished BASE chrome from f630** (no palette ladder: that was v2.0's S7, now cut). **The period is THE ORB**, a 20-px chrome sphere with a cyan iris. A 3-px integer shake runs f630–632. A tiny Mas (8 px) stands on the spire balcony. **Every figure on the skyline flinches** (1 drawing, f630–633), the hill included; **tiny Mas is the only one who doesn't**, and the cursor on the spire just keeps blinking. The Orb's iris reflects the skyline upside down, hand-pixelled and flipped, so **NopeAI's spire points into the ground.** From f634 the tower wordmarks drop one light step; they stay readable, but the title owns the frame. | **MUS: THE FINAL HIT at f630, quartal, with NO third.** A sub drop from **C2 (65.4 Hz) to F1 (43.7 Hz)** over 1.6 s `[SCORE: the render starts on A1, 55 Hz, which is F's major third]`. Low piano F1+C2 with F2–B♭2 above. The chamber orchestra sustains C–F–B♭–E♭ over F, topped by G (the 9th). **Big-band accent #8, the last brass:** a horn swell (C4 F4 B♭4 E♭5). The chip plays one straight-16th arpeggio F5–B♭5–E♭6–F6 (f630–641) `[SCORE: add]` into a sustained F6 pulse with vibrato over C6 and a triangle F3. `V2:` an orchestral tutti; horns and trombones for brass. `V3:` the band shouts the quartal stack, with chip. `V4:` a piano quartal cluster with the chip and sub.<br>**PAD:** the wordless close-harmony vocal pad enters at f630: four voices on "oo," F3–B♭3–C4–E♭4 (**no A, no A♭**), sustained, 2 dB above the violas it doubles (or thin the violas over f630–704). |
| 26.667–27.500 · f640–659 · 11.3+10–11.4 | The subtitle types on under the wordmark in the 7-px lowercase face, 4 characters per frame (f640–647): ON SCREEN **"now in low-key research preview"** [SLOT]. The rose window palette-cycles slowly, one step every 4 frames. Nothing on the hill moves or glints here, in any episode: the eye stays on the subtitle. | **PAD** holds; the chip decays. The subtitle types silently. The hill never makes a sound (the v2.1 draft's Ep4 coin clink is cut: it was the hill's only one-sided beat, §11). |
| 27.500–28.750 · f660–689 · 12.1–12.2 | The hold. At f660 the Orb period's catch-light glints (a 1-frame, 2-px sparkle). The rose window keeps cycling. On the balcony, tiny Mas stands with his glass, still. | **MUS:** celesta F6 at f660, alone (no chip echo). **PAD** holds and begins its release at f686. |

### 3.10 Scene 9: BOOKEND (f690–719) · moment `mfinale`
**Set.** **[BASE]** The dark room from the **reverse angle**: behind Mas's shoulder (the `pixeladv` back view). His monitor, at frame centre-right, is **visible for the first time.** It shows the title card in miniature, hand-pixelled at monitor size (not downsampled). The monitor is placed so that the composer's cursor falls at (298, 124) native, the f0 position. THE ORB floats at his shoulder, nearer the camera, as a sphere of about 32 px.

| TC (s) · frames · bar.beat | VIDEO | AUDIO |
|---|---|---|
| 28.750–29.375 · f690–704 · 12.3 | **[BASE]** A hard cut, and the reveal: **we were on his screen.** The mini title glows on the monitor while Mas sits with his back to us. The Orb turns its iris to camera (3 drawings, f690–694). At f692 the Orb's toast pops up beside it in the BASE UI panel, in lowercase mono: ON SCREEN **"verified: human"** [SLOT]. | **MUS:** the music's reverse swell (f679–690) lands on the cut. The sub drone F1+C2 (the open fifth) returns. **PAD** releases over f686–704. `[SCORE]` cut the celesta at f690.<br>**BLIP ORB:** the toast chime at f692, a single C7, 80 ms. **The Orb never speaks.**<br>**SFX:** none (`whoosh_pullback` is cut; there is no pull-back any more). |
| 29.375–29.667 · f705–711 · 12.4–+6 | **[BASE]** At f705 the mini title clears to black by f709. Mas turns his head to us over his shoulder in 3 drawings: back (f705–706), lost profile (f707–708), then **one eye on the lens** (f709). **f705–706 [GLYPH-MASKED, the Orb's iris]:** for 2 frames the iris shows the skyline in tokens, then it settles back to its BASE iris at f707. | **SFX: DING at f705**, `bell_ding_F6` (a chip bell with celesta): the post has gone out. **The SFX owns the ding** (`[SCORE]` remove it from `title()`); it is cut at f719 with a 0.35 s fade. The drone continues. |
| 29.667–30.000 · f712–719 · 12.4+7–end | **[BASE]** The monitor is black except for the cyan cursor at the f0 position. Its blink stays on the beat phase (visible f709–712, off f713–719), so **it blinks on again at f0: the loop.** Mas holds his look, and the Orb's toast holds. At f716 the room steps down one light level. | The ding's tail and the drone are out by f719: **the loop point.** |

---

## 4. Dialogue and VO sheet
**Casting (placeholder):** synthetic stock voices only (Kokoro-82M stock packs, [CASTING.md](../../audio/voices/CASTING.md)). **No cloning, no impressions built from real audio, and no accent humour for anyone** ([guardrails X10 and §5](../bible/guardrails.md#5-legal-hygiene)). Mas is the only character with a voice in the intro. The founders speak in BLIPs, and the Orb speaks only in chimes and toast text. **The roll call has no voices and no blips.** **RUMPT is never voiced in the intro. The intro has no political voice, music or SFX: the hill never makes a sound.** The scene VO files in `audio/intro/vocals/vo/` (`mas_super_take*`, `nole_came-up-with-the-name_*`) and `voice_rumpt_line` stay out of the intro.

| # | Type | Speaker | Line (as heard or typed) | Frames | Delivery | Source tag |
|---|---|---|---|---|---|---|
| D1 | VO | MAS | *"near the singularity;"* | f24–57 | Soft and close-mic, reading his own post aloud to an empty room. No word is stressed; the pace of a lunch order. Rendered at Kokoro speed 0.75–0.83. | **[V]** A real post from Jan 2025, recast as Mas's. It's the season tagline, and it falls outside Ep1's window on purpose. |
| D2 | VO | MAS | *(the semicolon pause)* | f58–71 | A real pause, with room tone. The VO is edited as two clips (starting f24 and f72), so the pause is exact. | — |
| D3 | VO | MAS | *"unclear which side."* | f72–91 | "Side" is left hanging, neither falling nor rising. No breath and no blink after it. Rendered at speed 1.03–1.15, with the "side" vowel shortened so the voice ends by f91. | **[V]** The same post |
| D4 | TYPED | MAS (composer) | near the singularity; unclear which side. | Typed f18–83, running 6–8 frames ahead of the VO; complete f84–89; posted f112 | Verbatim, in his real lowercase. One soft key tap per character. | **[V]** |
| D5 | CHANT | A group of 4–6, the cathedral's unseen congregation (no leader voice) | *"feel…"* / *"…the…"* / *"A-"* *"G-"* *"I!"* | Whispered at f285 and f295; shouted at f300, f303 and f307 (straight 16ths, locked) | The whisper is close and wide. The shout is dry, in unison, with no single voice on top. This is also Alyi's card voice. | **[V, reported]** The Atlantic's reporting on the 2022 party chant. It isn't a dated quote card. |
| D6 | BLIP | GERG | types `ORG CHART: HIM.` | f246 · f248 · f251 | The clicky tick of `blips.py`, one per word, on Fm11 tones (C7, E♭7, F7) | [INVENTED] card text |
| D7 | BLIP | MARIO | types `HAS CONCERNS. HAS GPUS.` | f366 · f368 · f373 · f375 | The soft marimba of `blips.py` on B♭m9 tones (C5, D♭5, F5, A♭5), plus an echo blip 4 frames later (a sub-concern) | [INVENTED] |
| D8 | BLIP | NOLE | types `NAMED IT.` | f426 · f429 | The overdriven square of `blips.py`, with an up-bend on the second, ending on C6 or E♭6 | [INVENTED], grounded in **[V]** Feb 17, 2023: "…which is why I named it 'Open' AI…" |
| D9 | BLIP | THE ORB | pops `verified: human` | f692 | A single sine bell on C7, 80 ms | [INVENTED] prop text |
| D10 | SFX | Mas's pickups (`item_take`) | *(no text)* | f278 (the keycap) · f392 (the scroll's tail) · f456 (the N) | A quiet pickup sound. It's an SFX, not a BLIP, because no text box is open. | — |
| D11 | PAD | Four wordless voices | *"oo"* | f630–704 (release from f686) | Close harmony F3–B♭3–C4–E♭4, with no third | — |

**Removed in v2.1:** the 2014 crowd "ohh" (sitcom sweetening; the f195 stab is the reaction) and the Alyi blips (they turned to mush under the shouted "I!").

**Silent on-screen text boxes:** the 1993 dialog appears whole, and the system's voice is the beeper and the bonk. The `SUED OVER IT.` stamp gets the thunk. The title subtitle makes no sound.

---

## 5. On-screen text registry and easter eggs

### 5.1 The rule and the counting convention
A must-read item needs **0.25 s + 0.05 s per character** on screen, which is **⌈6 + 1.2·n⌉ frames** ([guardrails §7](../bible/guardrails.md#7-broadcast-safety)).
- Count every visible glyph **except spaces**. An icon, a checkmark or the Orb period counts as 1.
- A card's name and subtitle count as **one group.** A stamp counts with its group and is also checked on its own.
- The window runs from the first frame the item is fully legible (after any type-on, pop or scroll settles) to the last frame before it is covered, closed or leaves the frame.
- **Exception, fast type-on:** a type-on at 2 or more characters per frame (48 characters per second, faster than the rule's 20) never blocks the reader, so a card group's window opens at the name cut-in (k3). Slower reveals (the RED-TEAMED ticks, one every 3 frames) still count from the last tick.
- **Name cards also hold at least 1.2 s (29 frames)** from the name cut-in: GERG 42, ALYI 37, MARIO 40, NOLE 42 frames.
- **Status:** PASS means margin ≥ 0. A margin of 0 to +2 is shown as *TIGHT*. FAIL means a negative margin.
- **Voiced text** (T02) is checked by the VO rule instead: spoken inside f24–91.
- **The roll call (f480–539) carries no must-read text.** Its plates are eggs.

### 5.2 Registry: the fixed section and the Ep1 slot items
| ID | Text | Class | In → out | Glyphs | Needs (s → f) | Has | Margin | Status |
|---|---|---|---|---|---|---|---|---|
| T01 | `you are here` | must-read | f18 → f89 | 10 | 0.75 → 18 | 72 | +54 | PASS |
| T02 | `near the singularity; unclear which side.` [SLOT] | **voiced** | typing f18–83 (66 frames), complete f84–89; 72 frames in all, and again at f112 | 36 | (VO rule) | 72 | — | **PASS.** The VO ends by f91, and total exposure (72) exceeds the 50 the read-time rule would need. |
| T03 | `1993` | must-read | f120 → f134 | 4 | 0.45 → 11 | 15 | +4 | PASS |
| T04 | `MAS MANALT` / `no equity.` | card group | f135 → f165 | 18 | 1.15 → 28 | 31 | +3 | PASS (needs the zoom-rect pre-roll at f133–134) |
| T04b | `Cancel` · `OK` | must-read (the gag needs them) | f135 → f165 | 8 | 0.65 → 16 | 31 | +15 | PASS |
| T05 | `TPOOL` | must-read | f176 → f194 (after the front passes) | 5 | 0.50 → 12 | 19 | +7 | PASS |
| T05b | `2008` | must-read | f180 → f194 | 4 | 0.45 → 11 | 15 | +4 | PASS |
| T06 | `2014` + `WHY COMBINATOR` | must-read | f195 → f224 (hard cut, no wipe) | 17 | 1.10 → 27 | 30 | +3 | PASS |
| T07 | `2015` | must-read | f230 → f247 | 4 | 0.45 → 11 | 18 | +7 | PASS |
| T08 | `GERG MOCKBRAN` / `ORG CHART: HIM.` | card group | f243 → f284 | 25 | 1.50 → 36 | 42 | +6 | PASS (fast type-on, §5.1) |
| T09 | `UNALIGNED` | must-read | f296 → f344 | 9 | 0.70 → 17 | 49 | +32 | PASS |
| T10 | `ALYI` / `FEELS THE AGI.` | card group | f303 → f339 | 16 | 1.05 → 26 | 37 | +11 | PASS (fast type-on) |
| T11 | `RED-TEAMED ✓✓✓` | must-read | f354 (third tick) → f400 | 13 | 0.90 → 22 | 47 | +25 | PASS (stays frozen and legible behind the Mario hold) |
| T12 | `MARIO` / `HAS CONCERNS. HAS GPUS.` | card group | f363 → f402 | 25 | 1.50 → 36 | 40 | +4 | PASS (fast type-on; parchment plate; the scroll never crosses the text) |
| T13 | `SPACEZ` | must-read | f410 → f464 | 6 | 0.55 → 14 | 55 | +41 | PASS |
| T14 | `OPEN AI` | must-read | f412 → f455 (the N comes off at f456) | 6 | 0.55 → 14 | 44 | +30 | PASS |
| T15 | `NOLE` / `NAMED IT.` + stamp `SUED OVER IT.` | card group | f423 → f464 | 23 | 1.40 → 34 | 42 | +8 | PASS (fast type-on) |
| T15s | stamp `SUED OVER IT.` alone | stamp | f435 → f464 | 11 | 0.80 → 20 | 30 | +10 | PASS |
| T16 | `NOPE AI` | must-read | f464 (frozen, the N in colour) → f479; relit in full colour at f465 | 6 | 0.55 → 14 | 16 | +2 | PASS *(TIGHT: the N move happens during the freeze so it reads before the f480 cut)* |
| T20 | `MACROSOFT` | wordmark | f543 → f629 | 9 | 0.70 → 17 | 87 | +70 | PASS |
| T21 | `ELGOOG` | wordmark | f558 → f629 | 6 | 0.55 → 14 | 72 | +58 | PASS |
| T22 | `ATEM` | wordmark | f573 → f629 | 4 | 0.45 → 11 | 57 | +46 | PASS |
| T23 | `INVIDIA` | wordmark | f588 → f629 | 7 | 0.60 → 15 | 42 | +27 | PASS |
| T24 | `MISANTHROPIC` + `zAI` | wordmarks (double pop) | f603 → f629 | 15 | 1.00 → 24 | 27 | +3 | PASS |
| T25 | `PEEKDEEP` | wordmark | f617 → f650 | 8 | 0.65 → 16 | 34 | +18 | PASS |
| T26 | `MR. MAS` (the Orb is the period) | title | f630 → f689 | 6 | 0.55 → 14 | 60 | +46 | PASS |
| T27 | subtitle `now in low-key research preview` [SLOT] | title | f647 (typed) → f689 | 27 | 1.60 → 39 | 43 | +4 | PASS |
| T28 | Orb toast `verified: human` [SLOT] | bookend | f692 → f719 | 14 | 0.95 → 23 | 28 | +5 | PASS |

T17–T19 (the v2.0 bar-9 headlines) are retired with the news slot.

**Ep12 variant cards: held package only** (§6.3). By default Ep12 runs the standard cards above. This is the episode room's set, [ep12 gags §4](../episodes/ep12/gags.md), and it is the canonical Ep12 set wherever it is used; §9.8 lists the files that still carry older sets. If the showrunner sanctions the package, these are the timings. The taglines keep the 2-character-per-frame rate, so the fast type-on rule applies:

| ID | Text | Glyphs | Needs | Has | Status |
|---|---|---|---|---|---|
| T04-12 | `MAS MANALT` / `you.` | 13 | 22 | 31 | PASS (+9) |
| T08-12 | `GERG MOCKBRAN` / `ORG CHART: US.` | 24 | 35 | 42 | PASS (+7) |
| T10-12 | `ALYI` / `FELT IT.` | 11 | 20 | 37 | PASS (+17) |
| T12-12 | `MARIO` / `HAS CONCERNS. (READ.)` | 24 | 35 | 40 | PASS (+5) |
| T15-12 | `NOLE` / `NAMED IT. (NOTED.)` + stamp `sued over it.` | 31 | 44 | 42 as built for Ep1 | **FAIL (−2) → fix:** in Ep12 the name cuts in at k2 (f422) instead of k3, and the close starts at f467 (f467–468), giving f422–466 = 45 frames (+1, PASS, *TIGHT*) |

Per-episode lint for the subtitles and toasts is in §8.1.

### 5.3 Easter eggs (not must-read, not linted)
These are 7 px native or smaller and low contrast. Every one must pass the [guardrails](../bible/guardrails.md), and any egg that states a fact needs a line in the episode's `facts.md`. **The fixed section (f120–479) renders in every episode, so it carries no egg that belongs to a later episode's plot.**

| Frames | Egg | Tag |
|---|---|---|
| f90–111, f690–719 | Desk tally (Ep1: `II`, both faint); popped collars on the coat hook (Ep1: 2); the water glass's dead-flat line | Per episode (§8.4) |
| f113–117 | The tokenizer gives the semicolon its own chip, `⟨;⟩` | [INVENTED] |
| f135–165 | Title bar `age 8`; a pixel-Orb icon in a 1993 dialog (an omen) | [INVENTED] |
| f180–194 | `where u at?` on TPOOL's screen; the BETA starburst | [INVENTED] |
| f195–224 | Crown `PRESIDENT`; LUAP's patch `LUAP · CALLED IT. (IN AN ESSAY.)`; the tiny parachute on Mas's back | [INVENTED] |
| f225–239 | Menu card `THE WOODROSE`; HALO and THE OTHER PAUL as background guests | Guests per Brockman's blog [V] |
| f254–284 | `SLEEP: DEPRECATED`; the pocketed keycap [SLOT] | [INVENTED] |
| f313–339 | `PRODUCTS: 0 · EFFIGIES: 1`; the paperclip-robot effigy; the WHY COMBINATOR fork | The effigy is Atlantic reporting [V]; `BUNKER: YES` is held |
| f345–400 | `DRAFT — DO NOT PUBLISH`; whiteboard `BIG BLOB OF COMPUTE` | [INVENTED] · [K, verify or cut] |
| f366–402 | `DOOM RISK ▰▰▰▰▰▰ · WORD COUNT ▰▰▰▰▰▰▸▸▸` (the bar that becomes the scroll); scroll fragments "…country of geniuses in a datacenter…" and "…machines of loving grace…" (Oct 2024); the last line `ADDENDUM:` and a tiny price tag | [INVENTED] · real phrases verbatim, [K → P before lock] · [PROPOSAL] for the tag |
| f420–464 | The check `$1,000,000,000*`, its asterisk unreadable | [INVENTED] prop on a [V] pledge |
| f465–479 | Place cards, including `MARIO (UDIAB) · JOINS 2016`; `DEC 2015` on a booster leg | Corrected [V] · verify the landing |
| f480–539 | Roll-call plates `TASYA` `RADNUS` `KRAM` `NESNEJ` `RIMA TAMURI` `PEEKDEEP` (RUMPT's and the cursor's are blank); NESNEJ's GPU lands first at f585; RIMA's light drifts off her on the roof (not in the flash) | [INVENTED] |
| f540–629 | `MINDDEEP`; the SAFETY beacon; the price tag, the hill, the lanyard and every dated item [SLOT] (§8.3); boss plates (TASYA, RADNUS, SIMED, KRAM, NESNEJ, RIMA TAMURI, MARIO, ADELINA, NOLE); the cursor on the spire [PROPOSAL] | [INVENTED] · per §8.3 |
| f630–689 | The Orb's iris reflects the skyline upside down; tiny Mas on the balcony is the only figure who doesn't flinch | [INVENTED] |
| f705–706 | Two frames of tokens in the Orb's iris | [INVENTED] |

**Cut in v2.1:** the 1993 tooltip `this action cannot be cancelled` (it labels what the viewer can see); the juice box and the 2008 stage bottle (still objects only read as a gag against motion); `PTO: 404`; the vault eggs `$1.5B LIBRARY FINE — PAID`, `COMPUTE (RENTED FROM NOLE)` and the `NO ADS` neon with a Big Game ticket (they spent Ep6–8 jokes in Ep1; the library fine moves to the Ep7 skyline); the scroll line "…we must pace the frontier…" (Ep9–10's PACE); the whole v2.0 bar-9 egg set; and from the Ep1 skyline `$86B`, `BELOW · ABOVE · AROUND`, `KRAM vs NOLE · CAGE MATCH · CANCELED`, `COMING SOON: TRUTHGTP`, `KORG 1` / `KORG 5: NEXT QUARTER` and the Dalí-clock GPUs (the ones that survive return later in §8.3, once aired).

**Top five eggs:**
1. **OPEN → NOPE** is a true anagram, and Mas moves the N himself, while time is stopped.
2. **The roll call is the curve:** eight portraits ride the knee, the incumbents on the flat part, and the last player is only a cursor.
3. **The music is the curve:** the roll-call stabs and the skyline plucks both spell the knee, and the first chord, the last chord and the cursor's stab have no third.
4. **The Orb's iris** reflects the skyline with NopeAI's spire pointing into the ground.
5. **Mas's glass never ripples** while every other glass at THE WOODROSE is frozen mid-slosh.

---

## 6. Name cards

### 6.1 The pixel card template (`studio/src/shared/pixel/ui.ts` → `nameCard`)
1. **Entrance:** the founder enters live, in full colour, on the beat-4 pickup (Gerg is already seated).
2. **Freeze on the downbeat H:**
   - At H every pixel except Mas, the thread, whatever Mas holds or has taken, and the UI remaps to **2-TONE FREEZE** (navy N4 and cream P2, inside the master palette).
   - **Frame H is the pop:** cream is lifted one step, at 80% white or less. A 2-px integer shake runs over H and H+1.
   - The founder's accent colour survives only in his name.
   - **The freeze latch SFX** (`freeze_hit_*--chip`, gated to about 0.12 s) lands on every H.
3. **Card clock, k = frames since H:**
   - k0–2: the 112×136 portrait window (`NAMECARD`) opens in 3 steps.
   - k3: the NAME cuts in, in the 14-px display face, in the accent colour.
   - k4: the accent rule draws.
   - k5 onward: the tagline types at 2 characters per frame (7-px face; the first characters show at k6), with one BLIP per word.
   - After the tagline, the stat-row egg (7 px, low contrast).
   - The stamp (Nole only) lands at **k15 = f435**. (`ui.ts` currently lands it at k14; §9.5 note 1.)
4. **The hold runs from H to between H+39 and H+44,** depending on the card, and never less than 29 frames from the name (§5.1). Mas's gag runs about H+28 to H+44. The **harmony freezes** (the strings hold the hit chord) **while the walking bass keeps moving**, like Mas.
5. **Exit:** the card closes in 2 steps at the end of its hold (at f285, f340, f403 and f465). The founder stays frozen, masked 2-TONE, until the dinner ends at f479.
6. **Each card breaks its own template once** (listed below).
7. **Placement** keeps the founder's face, Mas's gag and any must-read prop clear. The defaults are in §3.5.

### 6.2 The cards
| Card | Exact text (**must-read** · *egg*) | Intro action → freeze | Freeze behaviour and template break | Mas's background gag | Card audio |
|---|---|---|---|---|---|
| **MAS MANALT** (1993) | **`MAS MANALT`** / **`no equity.`** · **`Cancel`** (greyed) **`OK`** · *title bar `age 8`* | The kid turns to camera with the unblinking stare (f124–128); the world becomes a 1-bit system alert (f135) | It isn't a portrait card: it's a **1-BIT alert dialog** (`alertDialog`) with a pixel-Orb icon. The whole world holds its drawing. **The break:** Cancel can't be cancelled. A stranger clicks it (f150, bonk), and the kid clicks OK (f165). (Its payoff, the Cancel that finally works, lives in Ep1 itself, not in the intro.) | *(He is the card.)* | The beeper rests while the dialog is open; the chip bonk (E against F) at f150; OK with a beeper C6 at f165 |
| **GERG MOCKBRAN** | **`GERG MOCKBRAN`** / **`ORG CHART: HIM.`** · *`SLEEP: DEPRECATED`* | Already seated, typing; the keycaps pop like popcorn; the napkin sketch swaps to a website (f232) → **freeze at f240** with the keycaps mid-air | Right half; terminal green #39FF88. **The break:** the frozen keycaps hang in the air *around* the card, over its edge. | Plucks one floating keycap and pockets it (f270–282); it takes his colour. The keycap is the week's couch gag (§8.1). | **HIT Fm11 at f240**; the latch; BLIP GERG at f246, f248 and f251; `item_take` at f278 |
| **ALYI** | **`ALYI`** / **`FEELS THE AGI.`** · *`PRODUCTS: 0 · EFFIGIES: 1`* (`BUNKER: YES` held) | The cathedral lights up; he rises still seated, his chair lifting with him; the `UNALIGNED` effigy ignites → **freeze at f300 on "A-G-I!"** | **The break:** a stained-glass lancet card drops from above (f300–302); his eyes are token streams drawn in BASE. Ember #FF6A1A. (No FEELING meter: the lancet is his one break.) | Toasts a marshmallow on the frozen fire, which toasts it anyway (f328–339) | **HIT D♭maj9(♯11) at f300**; the latch; the CHANT (f285–307) is his voice; the reed organ; no blips |
| **MARIO** | **`MARIO`** / **`HAS CONCERNS. HAS GPUS.`** · *`DOOM RISK ▰▰▰▰▰▰ · WORD COUNT ▰▰▰▰▰▰▸▸▸`* · *scroll fragments* | The vault door swings open; `RED-TEAMED ✓✓✓` ticks; the DRAFT sheet flutters out; he steps out with a finger raised → **freeze at f360** | **The break:** the card rises from the bottom-left edge on a **parchment plate with ink-blue type** (never red, about 7.4:1), and its WORD COUNT bar runs off the bottom edge and becomes a scroll along the table (f378–389) | Rolls the scroll's tail into a telescope and peers at the ceiling, right where the rocket will come in (f390–402) | **HIT B♭m9 at f360**; the latch; the klaxon cut dead; BLIP MARIO with sub-concern echoes; `item_take` at f392 |
| **NOLE** | **`NOLE`** / **`NAMED IT.`** + stamp **`SUED OVER IT.`** · *check `$1,000,000,000*`* | A SPACEZ booster crashes through the ceiling; every glass sloshes except Mas's; the neon OPEN AI swings in → **freeze at touchdown, f420**, as he leans out of the hatch mid-post | **The break:** the card slams in from frame-left and lands crooked (a drawn 1:8 stair-step, not a rotation); the stamp lands at f435 on beat 8.2. Rocket red #E0301E. | Sips his dead-flat water under the sign (f450–455), then, still inside the freeze, takes the N (f456) and makes **NOPE** (f464) | **THE BIGGEST HIT, C7(♯9♭13), at f420** (the one full shout); the rocket roar; the latch; the stamp at f435; BLIP NOLE at f426 and f429 |

**No other intro cards.** LUAP is an egg only (the patch). **The roll-call portraits are not cards:** no must-read text, no hold rule, no blips. **RUMPT never gets an intro card**: his gold-foil card is in-episode only, from Ep4 ([character file](../characters/dlanod-j-rumpt.md)).

### 6.3 Ep12: the takeover package (held)
**The default follows §8.** Ep12's intro follows §8 like every other episode: the cached Ep7–11 fixed section with the standard cards, plus the five changes in the §8 tables. **Nothing in this section plays unless the showrunner explicitly sanctions it (§9.10 Q2).** The binding brief allows no finale exception, and the [Ep12 outline](../episodes/ep12/outline.md) puts most of these beats in the episode itself.

The package below was designed by the Ep12 room ([ep12 intro-slot](../episodes/ep12/intro-slot.md), [gags §4](../episodes/ep12/gags.md)). [THE INTERN's file](../characters/the-intern.md) lists "it takes over the intro" as an Ep12 event.

| Item | Where the episode already has it | Checker's call |
|---|---|---|
| The cold open plays to an empty chair. The cursor types the Ep1 line alone, adds `ours.` [INVENTED] and posts. The Orb turns toward the door, and Mas walks in a beat late with a coffee (a dry Foley set-down). There is no VO, but the key taps replay Ep1's per-character map. | THE INTERN's Ep12 row: "It takes over the intro." | The only item that could count as the intro's own event. It needs the ruling. |
| The model writes the cards (`you.` · `ORG CHART: US.` · `FELT IT.` · `HAS CONCERNS. (READ.)` · `NAMED IT. (NOTED.)` + `sued over it.`), typed perfectly even at 2 characters per frame with no BLIPs, and optionally in **[TERMINAL]** instead of 2-TONE FREEZE | The first A-plot beat: "The model wrote them all." | It spoils the A-plot's opening beat, so it needs an explicit ruling (the lint is in §5.2). |
| NOPE → PEON at the end of bar 8 | The logline and the A-plot ("NOPE AI becomes PEON AI"); gags §3 stages it in the room | **Stays out.** It's an in-episode payoff. It also isn't a one-letter move: moving NOPE's N gives only ONPE, OPNE or OPEN, so PEON needs two moves. And it can't fit between T16's read (NOPE AI needs f464–477) and the f480 cut. |
| The 1993 kid blinks, and his screen has turned fully toward us | The C-plot: "the screen finally turns toward us" | **Stays out** (the C-plot's payoff). |
| The subtitle `generally available` and the toast `side: unclear` | The button's title card "MR. MAS, *generally available*" and the Orb's `HUMAN: VERIFIED. SIDE: UNCLEAR.` | **Both stay out** (they are the button). |
| The towers fuse into one unlabelled tower, the skyline redraws itself every frame, and the axes rescale; THE WHALE's building is suddenly just as tall; Nesnej's register drawer hangs open, silent | The themes ("the sky quietly reformats"), THE WHALE's payoff (it ships an open-weights copy of the finale) and the B-plot (the register goes silent) | The register and the whale's height **stay out**. The rest needs the ruling. |
| The cursor window is empty, because the cursor has left it for the cold open | It follows the cold open | Only with the cold open. |
| Mas pockets CTRL "because the model lets him" | n/a | By default he pockets CTRL as the Ep1 bookend, and the model plays no part. |

Under any ruling, the Ep12 room's in-episode cards for RUMPT (`HIGH IQ (VERIFIED)` → `USER`), NESNEJ and THE INTERN never appear in the intro.

---

## 7. Style-switch log
The house rule is that **a switch must be over before the viewer can think "effect."** Every switch below has a story reason, one clean entry and one clean exit, and no sound sting of its own.

| # | Frames | Style | Story motivation | Why it isn't a gimmick | Exit |
|---|---|---|---|---|---|
| S1 | f100–104 | **GLYPH-MASKED** (the Orb's scan cone) | The machine sees what the dark room really is: a data-center cathedral. It's the first foreshadowing. | Five frames, inside a diegetic beam, on the beat where he looks at us. There's no sting, only the drone; outside the cone nothing changes. | The cone closes at f105 |
| S2 | f116–167 | **1-BIT** (the paper fade at f116–119; the 3:2 pillarbox; animation on fours) | 1993: the kid's world at the fidelity he saw it | The date card is on screen, and everything in frame belongs to 1993. The fade grows out of the Post white rather than being laid over the picture. | The render front, f168–179 |
| S3 | f168–229 | **EARLY-WEB16** (in through the front at f168–179, out at f225–229) | 2008–14. The palette scales with the era, which is the intro's thesis. | Both fronts are tied to the curve's tip. No label names the upgrade, and no sound marks it. | The candle-glint match cut and a 5-frame front into BASE |
| S4 | f240–284 · f300–339 · f360–402 · f420–464 (masked on the frozen founders through f479) | **2-TONE FREEZE** | Time stops at the founding dinner. It's the adventure game's portrait-window convention, and it states the thesis: **the world stops, and Mas keeps operating** (he even renames the company inside the last freeze). | It's a grammar, not an effect: one rule, repeated four times, with both colours inside the master palette. Mas, the thread and his pickups are excluded, so the rule is readable at a glance. | The room thaws at each card close; the founders stay frozen to the end of the dinner |
| S5 | *(held)* | **LEDGER**, masked to Nole's check | Money | **Cut from the v2.1 cut:** at f444–449 it landed inside the stamp's read and pulled the eye off the sip. If an animatic restores it, its fine print must be re-sourced ($133M was all donors; Nole's own share is reported at $38M by his testimony and $44M in court records [verify]). | — |
| S6 | f532–539 | **GLYPH-MASKED** (the roll call's eighth window) | The player who doesn't exist yet: a cursor made of tokens | Eight frames, inside one portrait window, on one stab. The rest of the frame stays BASE. | The cut to the skyline at f540 |
| S7 | f705–706 | **GLYPH-MASKED** (the Orb's iris) | The last whisper: the machine's eye holds the skyline as data | Two frames, inside an 8-px iris, as he turns to us | The iris settles at f707 |
| — | *(held Ep12 package only)* | **TERMINAL** | The machine's point of view | Held back so that it means something when it arrives. It plays only if the §6.3 package is sanctioned. | — |

**Cut in v2.1:** v2.0's S6 (Mas's call tile dissolving into GLYPH, the bloom and the grey call light: all Ep1 plot) and v2.0's S7 (the wordmark's 4-frame palette ladder: decoration, and with the f622 ignition and the slam it put four brightness jumps inside 24 frames).

**Budget check.** Full-frame non-BASE time is about 40% of the intro, almost all of it the era palettes (f116–229) and the four card holds: structural, not decorative. **The GLYPH total is 15 frames (the cone 5, the cursor window 8, the iris 2), all masked.** LEDGER: 0.

---

## 8. Per-episode changes (Ep1–12), spoiler-safe
**The rule** ([brief, REVISION v2.1](../../studio/INTRO_PIXEL_BRIEF.md)): the intro must feel like an intro, not a recap. **Nothing in the intro may reveal the current episode's plot**, and that includes Ep12 (§6.3). Only five kinds of thing change. Items 2–5 may show only what earlier episodes have already aired. Item 1 is the episode's epigraph. The brief lists the cold-open quote as spoiler-safe, and it matches the episode's title file, so it may come from the episode's own window, but only as words in their own medium, with none of the episode's staging or payoff (for example, Ep8's courtroom buffering stays in Ep8):
1. **The cold-open line** (f18–112: the line, the monitor UI, the word-timing JSON, the D♭ colour note placed in the line's longest pause, and the dot).
2. **World state, after the fact:** the skyline, the hill, and the small room layers (tally, collars, threads, the 1993 screen angle). **The skyline in episode N shows the aftermath of episodes 1 to N−1.** The Orb's toast and the last-bar sound are ambient drift, not events, and are listed here too.
3. **The title subtitle gag** (f640–689). **It is last week's release note**: a callback to the episode that just aired (Ep1 states the premise).
4. **One small couch gag:** the keycap Mas pockets at Gerg's card (f270–284).
5. **Roll-call evolution** (f480–539): the fills and states of flashes 5–8 as the characters debut.

**Retired with the news slot:** the per-episode bar-9 headlines, actions, transition objects and slot switches (v2.0's GLYPH and LEDGER slot switches for Ep1, 4, 6, 9 and 11), the Ep6 early picture cut, and the Ep7 meteor cameo. Those beats belong to their episodes.

**Rendering.** f120–479 renders once and is cached. The couch gag is a sprite swap on Mas's layer, which is separate anyway. The 1993 screen angle re-renders at Ep4 and Ep7 (4 authored drawings, §8.4). Ep12 uses the Ep7–11 cache; it re-renders the fixed section only if the held package (§6.3) is sanctioned.

**Rules for every change.** Subtitles are **34 characters or fewer** (32 recommended), typed at 4 characters per frame. **At most one tuned object sound per episode** across all changes (in practice only Ep11's answering ding; the hill never sounds). **No per-episode style switch.** New hill text stays at about 12 characters or fewer per side per episode (the podium rule from episode-slots; the lanyard tag is counted separately). Skyline eggs are 7 px or smaller, one short label per item, and never must-read. Every [K] line or egg is upgraded to [V]/[P] or swapped before that episode locks (guardrails §4). Sourcing detail stays in [episode-slots.md](episode-slots.md); each episode's production sheet is its `episodes/epNN/intro-slot.md` (all twelve still describe the old bar 9, §9.8).

### 8.1 Cold open, couch gag and title text
| Ep | Window | Cold-open line (as displayed) · medium · tag · VO note | Couch gag: the pocketed keycap [PROPOSAL] | Subtitle: last week's release note (margin at 4 cps) | Orb toast (margin) | Last bar |
|---|---|---|---|---|---|---|
| **1** | Nov 30, 2022–Dec 27, 2023 | *"near the singularity; unclear which side."* · post, Jan 2025 · **[V]** · out of window on purpose; Ep4 posts it "for real" | `CTRL` | `now in low-key research preview` (+4): the premise | `verified: human` (+5) | Standard |
| **2** | Jan–Aug 22, 2024 | *"her"* · post, May 13, 2024 · [K → upgrade] · the VO is "her" at about f24–33, then **silence** under a pulsing typing indicator; the D♭ lands in the silence | `ESC` | `back by popular demand` (+16) | `verified: human` (+5) | Standard |
| **3** | Jul–Dec 2024 | *"i love summer in the garden"* · post with a strawberry photo, Aug 7, 2024 · [K] (verify the punctuation) · a photo-thumbnail egg | `MUTE` | `now with voice (paused)` (+15) [verify] | `verified: human` (+5) | Standard |
| **4** | Jan–Apr 2025 | *"…our GPUs are melting."* · post, late Mar 2025 · [K]/[H] · keeps the source's "GPUs"; the trim is marked | `SHIFT` | `thinking… ($200/mo)` (+18) [verify] | `verified: human` (+5) | Standard |
| **5** | May–Aug 2025 | *"Missionaries will beat mercenaries."* · internal memo, Jun 2025, as reported · [K]: needs the published text · a generic memo window, keeping the source's casing | `$` | `not for sale` (+30) | `verified: human` (+5) | Standard |
| **6** | Sep–Dec 2025 | *"…I'll find you a buyer… Enough."* · podcast (BG2), late Oct / early Nov 2025 · [K] · an auto-caption strip under a waveform (spoken, so it doesn't count toward the Ep7 capital-"I" gag) | `5`, visibly shorter than the `4` beside it | `missionary ed. (mercenary rates)` (+2, *TIGHT*; +3 at 5 cps) | `human (probably)` (+4) | Standard |
| **7** | Jan–Mar 2026 | *"…are funny, and I laughed."* · post, Feb 2026 · [V], quote boundary to verify · **the first capital "I" he posts all season** | `BACKSPACE` | `backstop not included` (+16) | `human (probably)` (+4) | Standard |
| **8** | Apr–Jun 2026 | *"yes."* · trial testimony, May 12–13, 2026 · [V] · a court-transcript pane (egg `Q. Are you completely trustworthy?`, verify the wording). **A held beat on the transcript first**, because the source has him amend his answer to "yes"; **only "yes." is quoted.** No buffering: "the courtroom buffers" is Ep8's own A-plot payoff, so the chart simply waits under room tone. | `CAPS LOCK` | `ad-free* (*ad-supported)` (+11) | `human (probably)` (+4) | Standard |
| **9** | Jul–Sep 24, 2026 | *"we are now in the singularity—"* · Jul 2026 · [V] · confirm whether it was a post or an interview (composer or caption strip). **The Post click cuts him off on the dash.** | `Y` | `saved by the calendar` (+17) | `human (probably)` (+4) | Standard |
| **10** | "OCT 2026?" → "2027??" | *"We may have to pace the rate of AI development…"* · Jul 2026 statement · [V] · a caption strip; a real line used as a callback | `PAUSE` | `outside intended scope` (+15) | `human (probably)` (+4) | **A faint Shepard-tone riser** over f660–719, below −30 LUFS short-term |
| **11** | "2027??" | *"i remain enthusiastic about the non-profit structure!"* · email, Sep 21, 2017 (read back in court, May 2026) · [V] · an email draft; **the monitor autocompletes it as ghost text first** [SPEC gag], and the VO reads about 2 frames behind the ghost | `"` (the quote key) | `at a responsible pace (2× speed)` (+4) | `human… probably?` (+4) | **A louder riser, and a second ding answers the first** (C6 at f712, still no third) |
| **12** | "????" | *"near the singularity; unclear which side."* · the Ep1 post returns as the finale's epigraph (the episode is titled after it) · **[V]** · Mas types and voices it exactly as in Ep1: the same takes, word timings, D♭ and key-tap map. The held takeover cold open (empty chair, the cursor typing alone, `ours.`) is in §6.3. | `CTRL`, the Ep1 bookend | `assisted (after you)` (+18) [PROPOSAL]: Ep11's assist clause and politeness loop (the Ep12 room's `generally available` is the episode's button, so it stays out) | `human… ?` (+10): the drift the button answers. It pops from the title's Orb period at **f680** and holds its screen position as a UI layer across the f690 cut (f680–704), because Ep12 cuts to black at f704. | **The third tries to arrive.** A choir alto glides up from G at f630, toward A♭ (minor) or A (major). Picture and sound cut to black at **f704**, and the f705 ding never sounds. |

**Why each keycap:** ESC (he got out of Ep1's firing) · MUTE (Ep2's paused voice) · SHIFT (Ep3's for-profit shift) · `$` (Ep4's $500B) · a short `5` (Ep5's chart) · BACKSPACE (Ep6's walked-back backstop) · CAPS LOCK (Ep7's capital "I") · Y (Ep8's "yes.") · PAUSE (Ep9's PACE) · `"` (Ep10's air quotes) · CTRL again (Ep12: the Ep1 bookend, a callback to the season's first intro). Each is a callback, never a preview.

### 8.2 Roll-call evolution (flashes 5–8)
Flashes 1–4 never change. A state changes only in the first intro after the episode that aired it.

| Ep | 5 · RIMA TAMURI (fill) | 6 · THE WHALE | 7 · RUMPT | 8 · the cursor window [PROPOSAL ladder] |
|---|---|---|---|---|
| 1 | NopeAI fill; she's on NopeAI's roof in the group shot | Budget breach; plate `PEEKDEEP` | **Silhouette** at a gold podium, pointing; gold rim only | The cursor alone |
| 2 | NopeAI | — | Silhouette | Cursor |
| 3 | NopeAI | — | **The hands fill in:** the pointing hand and cuff catch the podium's gold (Ep2 aired his hands and voice) | One token eye above the cursor |
| 4 | Neutral grey fill; in the group shot her light stands on an empty lot (Ep3 aired her resignation) | — | **Filled in** (Ep3 aired the reveal): a stylized caricature per his [character file](../characters/dlanod-j-rumpt.md), navy suit and over-long red tie, pointing, at a gold podium with a coin slot. Never hair, skin, weight, hand-size or age cues; never a fist pump. | One eye |
| 5 | **MACHINES THINKING** fill; she stands on its new tower (Ep4 aired the founding) | A tiny beach chair bobs in the splash (Ep4 aired the beach-chair launch and the breach); the plate stays `PEEKDEEP`. No figure: ep04 facts mark the "$5.6M" cost [UNVERIFIED], and rule 10 keeps numbers out of the portraits. | Filled in | Two eyes |
| 6 | MACHINES THINKING | — | — | Two eyes |
| 7 | — | — | — | Two eyes and a 1-px closed mouth |
| 8 | — | — | — | Mouth |
| 9 | — | — | — | A faint head outline in tokens: no hair and no cowlick, nothing that points at anyone |
| 10 SPEC | — | — | — | Head outline |
| 11 SPEC | — | — | — | The whole face, in tokens, with a lanyard line (Ep10 aired THE INTERN's lanyard) |
| 12 SPEC | — | — | — | — (Ep11's state). The empty window is part of the held takeover package (§6.3). |

"—" means unchanged from the row above. In the flash RIMA always lands in her light. On the roof it drifts off her again (her device), in every episode: the beat where it finally stays belongs to Ep12's episode. The face ladder uses only the cursor portrait's 8 GLYPH frames and is ambient drift, not an event. It never resolves into a nameable person, and in particular never takes Mas's cowlick or any Mas trait: "the model distilled Mas" is the finale's payoff ([the model](../characters/the-model.md)).

### 8.3 Skyline and hill, after the fact
**The hill.** Its props are either **bipartisan** (the one CZAR lanyard, guardrails §2a rule 10; the roadmap placard; THE HORSESHOE) or **come in same-weight pairs** drawn from the previous episode's balance pair ([guardrails §2b](../bible/guardrails.md#2b-camp-matrix-as-outlined)). **If no verified pair aired, neither side changes.** Props only: egg-size, one word or less, no sound, never touched by the line, no campaign material (X11). **Misanthropic's dangling price tag** changes too, so the writers' own analogue is roasted in every intro.

| Ep | Skyline: new aftermath (from the episode before) | Misanthropic's price tag | Hill, RUMPT's side | Hill, the other side | CZAR lanyard tag |
|---|---|---|---|---|---|
| **1** | **Baseline:** the towers and their players, no dated events. GPUs pile up red-hot and keep their shape; PEEKDEEP `(NOT YET)`; the siren is RADNUS's trait. | blank | His silhouette at a dark gold podium; no text, no SFX | NEDIB's fountain pen in an inkwell, static (the sitting administration) | blank: the job exists before anyone holds it [PROPOSAL] |
| **2** | zAI's banner `COMING SOON: TRUTHGTP` (Apr 2023 [V]); the split-flap `KORG 1` over the fixed `KORG 5: NEXT QUARTER` [K, verify] | `$4B + $2B` (NOZAMA and ELGOOG, Sep–Oct 2023 [V]) | A phone glow in the silhouette's hand (Ep1: the AI-altered anchor repost [H]) | A scroll tied in a pinky-promise knot, `VOLUNTARY`, beside the inkwell (Jul 21, 2023 [V]) | `SIRRAH` (2023 [H]) |
| **3** | A courthouse rises between zAI and NopeAI; a white ISS cube appears | `$4B + $2B` | — | *(bipartisan)* A placard `9 FORUMS · 0 BILLS` (the Senate roadmap, May 15, 2024 [H]) | `SIRRAH` |
| **4** | A strawberry on the spire; a revolving door; a GPU Christmas tree (SHIPMAS) | The last plank of the *Loving Grace* bridge is a job listing | **The podium turns to face us, lit gold, with its coin slot** (Ep3's button [V]). It's static and silent: no glint and no clink, because the other side's scroll gets no beat either. | A scroll stamped `VETOED` bobbing in the bay under the lighthouse (MOSWEN, SB 1047, Sep 29, 2024 [V]); the inkwell stays | `SKCAS` (Dec 5, 2024 [H]) |
| **5** | INVIDIA's tower sits 17% lower; `(NOT YET)` comes down; the GATESTAR ring flickers (IOUs), with YRRAL's yacht **moored and still** at frame-right, far from the hill; the MACHINES THINKING tower rises; **the GPUs start to sag like Dalí clocks** (and stay that way) | `$61.5B` (Mar 2025 [V]) | A thin gold wire from the podium to the top of the GATESTAR ring (never to the yacht) | The inkwell is gone; **THE THREE-TIER MAP** stays pinned under a pebble, with no text (Jan 13, 2025 [P]) | `SKCAS` |
| **6** | ATEM grows a soup-kitchen annex; a bar chart falls off NopeAI | A tiny system card on the lighthouse door stamped `TRANSPARENCY!` [INVENTED] | `GENIUS` label on the ring's base ([P✓] Jul 23, 2025) **only when paired** | MOSWEN's `EDITED` sticker, **only once upgraded from [K]**. Until then neither side changes. | `SKCAS` |
| **7** | GATESTARs multiply; a `RESERVED` desk in a NopeAI window; the CODE RED siren now spins on NopeAI's roof too (Ep6 flew it across the bay; RADNUS's siren in the roll call is his trait and stays) | A book-return slot: `RETURNS · LATE FEE: $1.5B` (Sep 2025 [V]) | THE EO RECEIPT curls off the podium, no motion | A signed `SB 53` scroll with a fountain-pen flourish and no button (Sep 2025) [PROPOSAL, verify] | `SKCAS` |
| **8** | SPACEZ swallows zAI; a `NO ADS` billboard aims at NopeAI; an AROS tombstone | `RETURNS · LATE FEE: $1.5B` | A `BANNED` stamp on the lighthouse door: paperwork only, no meteor, no impact | THE RECEIPT, a `STRONGLY WORDED` receipt, on the lighthouse roof (an object only: [naming](../bible/naming.md) never makes its source a character) | `(FORMER)` (Mar 26, 2026) |
| **9** | MISANTHROPIC's lighthouse briefly outgrows NopeAI, so the curve's peak shifts; gargoyles become goblins; a tiny JERDNA strolls over | — | — | — | `(FORMER)` |
| **10** SPEC | FACEHUGGER raises an INVIDIA flag (*`(PENDING)`*); every tower hangs a PACE banner while its cranes keep building; the ASTRA star; THE NU dome; *(international, not partisan, and not on the hill)* THE COUNTERPART's mirrored podium stands across the water beside PEEKDEEP's whale tower, facing the hill: mirror-chrome, **no flag, emblem or text**, never caricatured [PROPOSAL design] (Ep9 aired the mirrored podium; RUMPT's podium itself doesn't change) | — | The label-gun tape on THE NU dome's sign, already stuck: `AI` → `SI` | SIRRAH's toy blocks spell `SLOW` | `(FORMER)` |
| **11** SPEC | The towers grow between frames; SI FORCE robot vacuums march along the waterfront in gold dress uniforms (a silent loop, no text) | — | Pair from the Ep10 room (THE RUMPT PACE) | Pair from the Ep10 room (SREDNAS's Ban ASI hearing) | `THE INTERN` |
| **12** SPEC | The GATESTAR rings link into one chain across the sky; THE WHALE's beach chair on PEEKDEEP's roof carries an `OUT OF OFFICE` sign (both Ep11). The room's fused tower, the redrawn skyline and the rescaled axes are held (§6.3). The whale's matching height and Nesnej's silent register are Ep12 payoffs and stay out. | — | — (**no `USER` plaque**: that relabel is Ep12's in-episode gag) | *(bipartisan)* THE HORSESHOE: a horseshoe magnet with a `PAUSE` sign on each end (Ep11) | `THE INTERN` |

"—" means unchanged. Dated items need a line in that episode's `facts.md`; the tags above are carried from [episode-slots.md](episode-slots.md) and the reviews and must be re-checked there.

### 8.4 Small room layers (eggs; details in [episode-slots §6–7](episode-slots.md#6-bookend-dot-toast-subtitle-last-bar))
| Ep | `you are here` dot (cold open) | 1993 screen angle (authored drawings, not rotated) | Desk tally (G01) | Coat-hook collars (G05) | Gold threads in the hoodie (G06) |
|---|---|---|---|---|---|
| 1 | x 0.50, at the knee | 0°, facing away | `II` (TPOOL ×2, faint) | 2 | — |
| 2 | 0.55 | 0° | `III` (Ep1's NopeAI mark) | 2 | — |
| 3 | 0.60 | 0° | `III` | 3 | — |
| 4 | 0.65 | **10°** | `III` | 4 | — |
| 5 | 0.70 | 10° | `IIII` (Ep4's bid) | 5 | 1 (Ep4's ring ceremony) |
| 6 | 0.75 | 10° | `IIII` | 6 | 2 |
| 7 | 0.80 | **35°** | `IIII` | 7 | 3 |
| 8 | 0.85 | 35° | `IIII` | 8 | 3 |
| 9 | 0.90, past the knee | 35° | `IIII` | 9 | 4 |
| 10 SPEC | at the chart's top edge | 35° | `IIII` | 10 | 5 |
| 11 SPEC | off the top: `you are ↑` | 35° | `IIII` | a ruff | 6 |
| 12 SPEC | — (off the top; the rescale is held, §6.3) | 35°, unchanged (the full turn is Ep12's C-plot payoff) | `IIII ?` (Ep11's half-scratched YC mark; **never `∞`**, which is Ep12's own payoff) | a ruff (the visitor lanyard is Ep12's payoff) | 6 |

Every count is one episode behind v2.0's table, because each mark, collar and thread is earned in an episode and may only show after it airs.

---

## 9. Production notes

### 9.1 What exists now (re-checked 2026-09-25 at 05:47)
Other workstreams are building in parallel, and several of the files below changed after the v2.1 edit (05:34). **Everything built so far follows v2.0 timing or its own layout, and this file is the spec where they differ.**

**Pixel**
- **Engine:** `studio/src/shared/pixel/*`: `px`, `palette`, `light`, `font`, `figure`, plus `dither`, `mask`, `palettes` (the six sets), `transitions` (render front, dither fade and wipe), `sprite`, `glyph` and `glyphDraw` (tokens and the dissolve), `ui` (dialogue box, portrait window, name plate, `nameCard`, 1-bit `alertDialog`), `compose` and `PixelScene.tsx` ([pixelengine notes](../../studio/notes/pixelengine.md)). Engine tests are in `out/lookdev/pixel/engine/`: the switch sheet (base, freeze, 1-bit, early-web16, ledger, terminal, cone-terminal, cone-glyph, glyph, bloom), the render-front stills and video, and the dissolve.
- **Cast:** `cast/mas.ts` (`masDesk`, `masPortrait`, `masKid` in BASE and native 1-bit, `masStage`, `masThrone`), `gerg.ts`, `alyi.ts` and `kit.ts` ([castmas](../../studio/notes/castmas.md)); `mario.ts` (portrait, room sprite, vault, scroll ending in "ADDENDUM:", DRAFT sheet), `nole.ts` (room sprite v2, portrait, booster, check) and `bosses.ts` (26-px rooftop TASYA, RADNUS, SIMED, KRAM, NESNEJ, MARIO with ADELINA, NOLE, plus the DUSK ramps) ([castrivals](../../studio/notes/castrivals.md)). Boards and motion tests are in `out/lookdev/pixel/cast/`. `cast/rollcall.ts` now holds the eight roll-call portraits (see `mrollcall` below).
- **Moments (in progress):**
  - **`mcoldopen`**: code in `studio/src/dev/mcoldopen/`, stills `out/season/intro/moments/mcoldopen-01…05`, and `mcoldopen.mp4` (also with a scratch-audio mix). There is no `studio/notes/mcoldopen.md` yet. Its timeline matches §3.2 except the chart snap (f113 against the script's f114).
  - **`mdinner1`** ([note](../../studio/notes/mdinner1.md)): five stills, `mdinner1.mp4` (f225–359) and a scratch track. It differs from §3.5 in five ways:
    - a 2-frame GLYPH "boot" of the rose window at f292–293, outside the three-window GLYPH budget (cut it);
    - Alyi levitates 2 → 22 px, where the script has him rise in his chair;
    - the lancet drops in 4 held drawings with an overshoot, where the script has 3 steps;
    - a `CTRL` object label at f256–271 (the note itself flags it as a possible UI wink; cut it);
    - its planning cue sheet still has the tape spin-up and a whip at f225.
  - **`mdinner2`**: code in `studio/src/dev/mdinner2/` and one still (`mdinner2-nope.png`). Its `timeline.ts` is v2.0:
    - HUD ticks at f348/352/356 (the script has f348/351/354);
    - the scroll leaves the card at f368 (f378);
    - a paper wipe at f401 (cut);
    - a LEDGER flash at f450–453 (held);
    - the sip at f445 (f450–455);
    - the N lifts at f466, clunks at f473 and relights at f474. The script moves the N inside the freeze, f456–464, and relights at f465.
  - **`mrollcall`** ([note](../../studio/notes/mrollcall.md)): stills, a contact sheet and `mrollcall.mp4`. **Its cut frames match §3.7 exactly**, and RIMA's flash already follows the read rule. Its layout differs:
    - one centred window that grows by semitone (124×150 up to 206×250, 40% of the screen), where the script has 112×136 windows riding the thread;
    - flashes 5–8 sit on black, where the script has one shared fill step;
    - RUMPT's plate reads `???` (the script has it blank);
    - RADNUS's red beam turns his face red on k2–5;
    - the whale uses 3 poses (the script has 2);
    - the cursor window closes onto the dusk over f537–539.

    The showrunner picks the layout; until then this file is the spec. If the growing window stays, re-run the audit in §9.7. Audio is not wired.
  - **`meras`** and **`mfinale`**: code only, no renders. `mfinale/scene.ts` still draws the v2.0 bar 9 (`drawChat`, `drawFired`, `drawBack`, `drawHearts`), and no skyline group shot exists yet.
- **Still to build:**
  - rooftop sprites for RIMA, THE WHALE's fin and RUMPT's podium;
  - KRAM's rooftop loop redrawn with the thermos (`bosses.ts` pumps the cage-match poster, which is cut because no episode airs it);
  - a standing, walking dinner Mas carrying the glass (`mas.ts` has none);
  - Mario's parchment plate in `nameCard`;
  - the skyline panorama and the hill;
  - the reverse-angle room;
  - RUMPT's Ep3 and Ep4 roll-call states and the cursor's face ladder.

**Audio**
- **Theme:** all four variations are rendered, all to the **v2.0** structure. The masters are `theme-V1-chipchamber` (re-rendered at 05:40), `theme-V2-orchestralnoir`, `theme-V3-pixelswing` and `theme-V4-pianopixels` (`.wav` and `.mp3`). Alongside them are `midi/`, `stems/`, the measurements in `analysis/V*.json` and `V*_balance.json`, and `theme-motif-study.mp3`. **`VARIATIONS.md` and `cues.json` now exist**, but both describe the v2.0 cue:
  - the f495–509 "music fired" mute and the f510 slam, with cues at f495, f510 and f525;
  - a ±15-cent tape wobble in the 2008–14 tier;
  - a 55 → 35 Hz title sub drop;
  - V2's chip heartbeat.

  Regenerate both after the recompose (`make_cues.py`); until then §3.1 of this file wins. All four `score/v*.py` files still have the fired/rehired `slot()`. The score is code-composed: `build.py`, `engine/`, `score/common.py`, `motif.py` and `v1.py`–`v4.py`.
- **SFX:** `audio/sfx/manifest.json` has 218 entries in hybrid, chip and band flavours (87 of them are voice-kit blips), with `wav/`, `mp3/`, reels, QA spectrograms, `LICENSES.md` and the intro cue layout `audio/sfx/intro/sfx_intro_cues.json` (generated by `scripts/layout.py`). The cue list is built to v2.0 and disagrees with this script in the ways listed in §9.3. There are no card blips yet; `blips.py` has dialogue-box kits only.
- **Vocals:**
  - **VO:** Mas's cold-open takes in `audio/intro/vocals/vo/` are am_michael, am_puck, am_echo, am_liam, and a **"designed" blend of stock packs** (michael 0.5 / puck 0.3 / echo 0.2), with `mas_coldopen_word_timings.json` and copies placed at f0 in `vo/placed/`. **Every take runs to f94–95** ("side" is f86–94), so each needs the vowel fit in §3.2.
  - **Chant:** **it is rendered**: `audio/intro/vocals/chant/feel-the-agi_*_from-f280` in cathedral, dry and stone-room mixes, with whisper and shout stems and an untuned alternate. It is placed from f280, so check it against the script's f285, 295, 300, 303 and 307.
  - **PAD:** `audio/intro/vocals/harmony/` holds six title-PAD candidates (quartal "aah", orchestral open fifth, piano-intimate "ooh", 8-bit voice arpeggio, two hybrids). Check each for a third before choosing (`scripts/check_harmony.py`). The folder also holds "doo-bah" stabs and a knee-hook scat, which are rendered but **not scripted**.
  - **Full layers:** `audio/intro/vocals/intro-layer/` has two 30 s layers placed at f0. **A** is the VO at f24, the chant at f280 and the hybrid pad at f630. **B** is A plus doo-bah stabs on f240, f360 and f420. There are also previews over each theme. B's stabs are not scripted: the card stabs are brass only (§3.1), and the vocals README's own rule allows at most one stab, at f420.
- **Casting:** `audio/voices/CASTING.md` and its manifest hold scratch stock voices for ten characters. Only Mas's voice is used in the intro.
- **Animatic temp track:** `audio/intro/animatic/temp-track.mp3` and its `temp-track_events.json` (05:24) still carry the f495 and f510 events of the v2.0 bar 9, so they need a rebuild.

**Still placeholder:** Mas's VO (a stock voice; a human performer in a cartoon register can replace it later, under the same rules); the PAD (candidates only); the Harmon trumpet phrase (sampled until a live player is budgeted).

### 9.2 The V1 score: what must be recomposed
Checked against the 05:38 `score/v1.py` and the 05:40 render. **The re-render did not change the structure: every item below is still open.**

**Must (the v2.1 structure and the binding direction):**
1. **Bar 9, f480–539.** Delete the bloom hit at f480, the fired mute (`fired_piano`, `roomtone`), the f510 rehire slam, the badge and heart material, the heart glissando and the `revswell` at f526. Compose the **eight roll-call stabs** (§3.7): straight eighths at f480, 487.5, 495, 502.5, 510, 517.5, 525 and 532.5; Fm9 ×4 → D♭maj7(♯11) ×2 → C7(♯9♭13) → open fifth on F; top line F5 F5 F5 F5 G5 A♭5 C6 F6; trumpets and trombones doubled by chip lead an octave up; bass and kick on each; sub on 1 and 8; stop-time. Retire the `fired` stem. End the viola-and-cello counter-line on F4 inside stab 1 (the render holds it to f494). **The same rewrite applies to `slot()` in `v2.py`, `v3.py` and `v4.py`** (all three are now rendered with the old bar 9), and then `cues.json`, `VARIATIONS.md` and the animatic temp track are regenerated.
2. **The Harmon-muted trumpet, f540–599** (C5 → B♭4 → A♭4 → a fall from D5), on its own stem. The binding direction requires it. **The 05:38 `v1.py` now has a Harmon phrase, but in the wrong place:** a three-note F5–E♭5–D♭5 answer in bar 7 (about f385–407, the `mt` list after the counter-line). That breaks "no Harmon mute before f540". Move it to bar 10 as written in §3.8. In `v2.py` the Harmon phrase also sits in the dinner (bars 6–7, over ALYI → MARIO): move it to bars 10–11.
3. **Brass accents:** add the f414–419 rip; play the f240, f300 and f360 stabs without saxes and tuba (`big_band_stab(saxes=False, tuba=False)`) so f420 is the only full shout. Brass measures 17% in the dinner against a 10% target.
4. **No-third fixes:** delete the felt A♭2 at f60; start the title's sub on C2 (MIDI 36) gliding to F1 (29), not on A1 (33).
5. **One owner per sound:** remove the ding from `title()` (the SFX owns it) and cut the celesta at f690, the music `revswell` at f105 and the brush roll plus `revswell` at f228.
6. **Chip throughout:** the 05:40 render meets the whole-piece target (38 · 27 · 10 · 25 with rhythm excluded, the `VARIATIONS.md` metric), but chip is still only 14% of the dinner and 13% of the skyline (about 15–16% with rhythm excluded). Raise the dinner ostinato and the skyline chip (about +4 dB each, then re-measure), and re-run `stemtable.py` until chip is at least 20% in every section after f120. The metric is defined now: a K-weighted loudness share with bass, kit and sub excluded as rhythm.
7. **V2's lub-dub "heartbeat" figure** (`heartbeat()` in bars 1, 2, 9, 10 and 12, now rendered and described in `VARIATIONS.md` as "the chip is a heartbeat") must go: under the flat chart and blinking dot it reads as a heart monitor (guardrails X3). The chip "heart" of V2 is the knee, not a pulse.
7a. **V4** adds a clarinet counter-line and a string pad under the title. §3.1 defines V4 as piano, chip and sub, with the PAD the only other colour. Cut them, or ask the showrunner to widen V4's definition.
7b. **The title sub** still drops 55 → 35 Hz in every variation (`VARIATIONS.md`): start it on C2 (item 4).

**Should (align with this script):**
8. Cold open: cut the chip glints at f30/f45; end the D♭ chord at f71; cut the violins at f58–113; implement the VO duck (§9.6).
9. 1993: add the piano's left-hand Fm9 at f120 (pedalled to f164); delete the square-bass B2 at f150; add the f168–176 chip arpeggio, the second pulse voice and the triangle bass.
10. 2008–14: remove the tape wow and the boom-bap kick (kick on 1 and 3); add the string swell at f225–239.
11. Dinner: fix `walks[6]` to D♭3 C3 A♭2 F2; add the reed organ at f285–300; add the pizzicato at f355; lock the swung off-beats (humanize 3 ms or less on brush, felt and upright).
12. Skyline: quantize the bar-11 notes at f613.1, f620.6 and f622.5.
13. Title: add the F5–B♭5–E♭6–F6 chip arpeggio at f630.

**Adopted from the render into the script (no recompose):** the card chords Fm11 · D♭maj9(♯11) · B♭m9 · C7(♯9♭13); the G on top of the f630 stack; bar 4's D♭maj7 → Fm9 → C7(♭9) through the sample-chip filter; f195 as 3 trumpets and 2 trombones on D♭maj7; the beeper's A♭4 + C5 at f120 and its C6 at f165; the f90 pluck (harp F5, pizzicato C5, chip F6); the cursor glints at f0 and f15; the dinner chip ostinato; the viola-and-cello counter-line (f255–480); the f465–475 kink triplets and the G♭2 bass at f465; the bar-10 line cliché; bar 11's D♭ → C7 over a timpani F roll; the sustained chip F6 at f630. **Dropped rather than added:** the chip 16th arpeggios at the card hits (the ostinato replaces them), the Alyi chip glissando, the violin sigh at f362 and the chip echo at f670.

### 9.3 SFX and cue-list alignment (`manifest.json` and `scripts/layout.py`)
**Rule: every sound has one owner.** The music owns the drone (f0–119, f690–719), the plucks (f540–622), the swell into f690 and every stab. The SFX owns the reverse swells into f120 and f540, the bonk, the ding and every diegetic sound.
- **Remove from the intro cue list:** every v2.0 bar-9 cue (`shockwave_bloom`, `odometer_ratchet`, `piano_fired_F4`, the intro use of `room_tone`, `hourglass_shatter`, `heart_gliss`); `glyph_shimmer` (f99), `glyph_dissolve` (f500) and `glyph_blink` (f705); `render_front_sweep` (f168; its description still says "1-bit → 240p"); `tape_start` (f168), `tape_spinup` (f225), `paper_whip` (f401) and `paper_flutter` (f350); `camera_shutter` and the hybrid `freeze_hit_*`; `room_drone` (f0, f690: it measures F1 +4 cents against the score's exact F1 and beats against it); `whoosh_pullback` (f690); `reverse_swell_2beat` (f600); `tower_pluck_1–7`; `typing_soft`.
- **Retime or retune:** `flame_whoomph` → f290 (low-pass 2 kHz, −4 dB); `collar_pop_*--chip` → A♭4 f180, C5 f190, F5 f205; `klaxon--chip` B♭4/F4 at f345; `vault_chime_triple` → three one-shots, F6/G6/A♭6 at f348/351/354; `orb_servo` → C6; `orb_scan_sweep` → retune to F/C (it measures about 1621 Hz, between G6 and A♭6); `letter_clunk` → f464; `neon_ignite` → f465 with its ring on C6 or removed; `neon_buzz` → f465–479, cut dead at f480; `landing_thunk` high-passed at 150 Hz; `siren_whoop_F--chip` high-passed at 1.2 kHz, one 8-frame whoop; `drip_clack`, `ka_ching` and `plop_water` in `--chip` at −4 dB, the plop unpitched; `bell_ding_F6` with `cut=719` and a 0.35 s fade; `freeze_hit_{F,Db,Bb,C}--chip` gated to about 0.12 s at f240/300/360/420.
- **Add:** `key_tap_soft_01–06` and `key_tap_space` per typed character (f18–49, f64–83, −30 dBFS or lower); a quiet `item_take` (f278, f392, f456); the paper-unroll swish (f378–389); the card BLIPs, one per word on the script's frames (§4), in `blips.py`'s timbres on chord tones. (The v2.1 draft's Ep4 coin clink is cut: the hill never sounds.)
- **Flavour rule, the same in all four variations:** 1-BIT and EARLY-WEB16 scenes use `--chip`; BASE scenes use hybrid; **nothing with a Harmon mute plays before f540** (so the klaxon is `--chip`); never `collar_pop--band`, `klaxon--band` or `siren_whoop_F--band`.
- **The roll call (f480–539) has no SFX** except the reverse swell into f540.

### 9.4 Dependencies on the pixel moments
| Moment | Frames | Owns | Hand-offs and needs |
|---|---|---|---|
| `mcoldopen` | f0–119 | INSERT A and B, the ROOM, the GLYPH scan cone, the token-chip burst, the paper fade | The native composer UI (no real logo); the chart with axes and the dotted upturn; `masDesk` with its screen / turn / camera heads and the 1-px smile; an Orb sprite with 3 iris drawings; the cursor at (298, 124) |
| `meras` | f120–239 | 1-BIT 1993, the alert dialog and zoom rectangles, the two render fronts, EARLY-WEB16 for 2008 and 2014, the candle match cut | **It owns the f225–229 front**, while `mdinner1` owns the room behind it. It needs the pillarbox retract, the #FF7F2A WHY COMBINATOR sign (§9.5 note 4), and the `masKid`, `masStage` and `masThrone` sprites. |
| `mdinner1` | f225–359 | THE WOODROSE room (560×300), GERG and ALYI, the freeze mask, the cards, the cathedral, Alyi's rising chair, the effigy flame loop | **It hands off at f344** (Alyi's card closed). The f345–359 overlap belongs to `mdinner2`. The freeze mask must exclude Mas, the thread, his pickups and the UI. Mas carries his glass from f255; he needs a standing, walking drawing set with it. The couch-gag keycap is a per-episode sprite. |
| `mdinner2` | f345–479 | MARIO, the vault and HUD, the scroll, the rocket, NOLE, the stamp, the neon, the N move and the founding key art | The HUD stays legible and frozen through f400. The stamp lands at f435. **The N comes off at f456 and clunks in at f464, inside the freeze; the sign relights at f465.** It hands `mrollcall` the runner's screen y at f479. |
| `mrollcall` | f480–539 | **The roll call**: the eight windows, the thread under them, the GLYPH cursor window | The cut frames ⌊480 + 7.5n⌋, and the window positions, fills and read rule of §3.7 (the current build differs, §9.1). It takes the runner's screen y from `mdinner2` at f479 and hands `mfinale` the thread (as the unlit roofline) and the dusk field at f539. |
| `mfinale` | f540–719 | The skyline group shot, the hill, the title and the bookend | The rooftop players (each repeating its roll-call action); tower pops; the f622 roofline; the hill and lanyard layers; the wordmark (no ladder); **the reverse-angle room** (the `pixeladv` back view) with a hand-pixelled mini title and the cursor at (298, 124); the 2-frame GLYPH iris |

If a moment's build changes any of this, update this file. Its frame numbers are the contract.

### 9.5 Engine and code notes
1. **`ui.ts nameCard`** lands the stamp at k14 (f434). The script needs **k15 (f435)**, on the beat with the stamp SFX: make the stamp frame a parameter.
2. **Mario's card:** `nameCard`'s backing plate is `THEME.ink` (dark), and ink blue #1F3A93 on dark fails contrast (about 2:1). His card needs a **parchment plate** option (#E9DCC0; ink blue on it is about 7.4:1).
3. **Ep12 Nole card (held package only, §6.3):** the name at k2 (f422) and a late close (f467) (T15-12, §5.2).
4. **YC orange.** `EARLYWEB16_COLORS` contains 0xFF6600, which is YC's brand orange. The v2.0 note (a #FF6600/#FFCC66 dither pair "reading near #FF7F2A") was wrong twice over: that pair averages #FF9933, not #FF7F2A, and it puts YC's exact orange on every other pixel. **Fix:** replace the 0xFF6600 slot with 0xFF7F2A, the approved WHY COMBINATOR orange ([guardrails §5](../bible/guardrails.md#5-legal-hygiene), [orgs](../world/orgs-and-products.md)); the palette then holds fifteen web-safe colours plus the approved sign orange (nobody can tell it apart from the web-safe set). The approved cream ground, #F3EEDC, isn't in `EARLYWEB16_COLORS` either (its nearest colours are 0xFFFFFF and 0xFFCC66), so add it as a sign-only colour or swap it for the least-used slot. Draw the sign flat #FF7F2A on #F3EEDC. That pair is only 2.2:1, so the must-read letters take a 1-px #000033 outline. Add a render lint that fails on any #FF6600 pixel.
5. **The dusk ramps** for the roll-call field and the skyline come from `bosses.ts DUSK`. The roll-call fills are the towers' own wall colours, stepped to one shared luminance. None of this is a new `PaletteSet`.
6. **The read-time lint as code:** a registry generated from `timing.ts` with every item's in and out frames and glyph count (§5.2), including the fast type-on exception, so CI fails on any FAIL.
7. **Render cache:** f120–479 renders once for Ep1–11. The 1993 layer has 3 cached angle states (Ep1–3, Ep4–6, Ep7–11); the couch-gag keycap is a sprite swap on Mas's layer. Ep12 uses the Ep7–11 cache and re-renders the whole section only if the held package (§6.3) is sanctioned.

### 9.6 Stems and mix
- **Music stems (as built):** `piano`, `strings`, `brass`, `winds`, `bass`, `drums`, `perc`, `chip`, `sub`, `fx`, plus `fired`, which v2.1 retires. **Other buses:** `vo`, `chant`, `pad`, `blip`, `sfx-main` (and `sfx-unmuted`, unused now that the mute is gone). The Harmon trumpet gets its own stem. Each is its own `<Audio>` layer, so the per-episode VO and the Ep12 cut are gain curves.
- **The VO duck:** every music stem except the sub −6 dB (strings −9 dB) over f23–91, 2-frame attack, 6-frame release, lifted inside the pause (f58–71) so the D♭ is heard; the f90 pluck −3 dB.
- **Loudness:** master **the full mix** to about −14 LUFS integrated and −1 dBTP. V1's music alone already measures −14.0 LUFS / −1.15 dBTP, so bring the music down to about −15.5 before VO, SFX and chant are added.
- **Timing:** every listed hit is sample-exact. **Swung off-beats are locked** (humanize 3 ms or less; the engine humanizes unlocked notes by σ 5–10 ms). Pads, hats and ostinati may be humanized ±8 ms. The chant's "A-G-I!" is locked straight.

### 9.7 Photosensitivity audit frames
The automated luminance audit runs on every render. Check these frames by hand as well:
- f116–120: the paper fade and the hard cut into 1993.
- f240, f300, f360 and f420 (the card pops, 60 frames apart), and the thaws at f285, f340, f405 and f465 (the f465 thaw and relight).
- **f480–540: the roll call.** Eight cuts in 60 frames. Each window is about 12% of the frame (under the 25%-of-screen area threshold), the surround is steady, and the fills share one luminance step, so the cuts should not count as flashes. RADNUS's siren red stays inside its sprite at 2 revolutions per second or slower. The in and out cuts are luminance-matched to the dusk ramp. **The current `mrollcall` build differs** (§9.1). Its window grows to 172×208 (28%) and 206×250 (40%) for flashes 7 and 8, over the 25% area threshold. Flashes 5–8 sit on black, a bevel edge brightens one step on every cut, and RADNUS's beam turns his figure red on k2–5 (a red transition, small in area). If that layout is kept, audit f510–539 frame by frame.
- f622: the roofline ignition.
- f630: the title slam and shake (with v2.0's palette ladder cut, f622–645 holds two events).

### 9.8 Files that still need aligning (not edited in this pass)
- **Ep12 card set** (this file follows [ep12 gags §4](../episodes/ep12/gags.md)): [world/props.md](../world/props.md) line 284 (`human face.` · `REPORTS TO IT.` · `PACED. ANYWAY.` · `WAS RIGHT. ONCE.` + `APPEALING.`); [characters/gerg-mockbran.md](../characters/gerg-mockbran.md) lines 87 (`PTO: 404`), 89 and 108 (`REPORTS TO IT.`); [characters/mas-manalt.md](../characters/mas-manalt.md) line 137 (`human face.`); [gags/recurring-gags.md](../gags/recurring-gags.md) line 164 (G06/P07's `human face.` card); [spec.md](spec.md) §5.4 lines 203–204 and [shot-table.md](shot-table.md) T04-12/T08-12 lines 172–173 (superseded, but still readable). [ep12/intro-slot.md](../episodes/ep12/intro-slot.md) also still says "Permanent Marker", the `?`/`??`/`???` bar 9, the tally `∞` and the `USER` plaque.
- **The old bar 9:** all twelve `episodes/epNN/intro-slot.md` files, [episode-slots.md](episode-slots.md) (bar-9 sections), [cue-sheet.md](cue-sheet.md), `audio/sfx/intro/sfx_intro_cues.json`, `audio/intro/animatic/build_temp_track.py` and `temp-track_events.json`, `score/v1.py`–`v4.py`, `audio/theme/VARIATIONS.md` and `cues.json`, `audio/intro/vocals/intro-layer/` (layer B's card stabs), and the pixel moments listed in §9.1 (`mdinner1`'s GLYPH rose-window boot and levitation; `mdinner2/timeline.ts`; `mfinale/scene.ts`'s v2.0 slot; `mrollcall`'s window layout).
- **Characters:** [rima-tamuri.md](../characters/rima-tamuri.md) (Intro: "the one blue heart" → roll-call flash 5); [the-whale.md](../characters/the-whale.md) (no `RECEIPT: $5.6M*` plate anywhere in the intro: ep04 facts mark the figure [UNVERIFIED]; the Ep5 change is a beach chair in the splash); [dlanod-j-rumpt.md](../characters/dlanod-j-rumpt.md) (the Intro line, "never an intro card" stays but add the roll call, and the podium table's shift: the coin slot in Ep4, silent, with no clink, no meteor cameo and no `USER` plaque); [nesnej.md](../characters/nesnej.md) (the Dalí sag from Ep5); [mario.md](../characters/mario.md) (the new stat row); [kram.md](../characters/kram.md) (the thermos in the roll call and on the roof); [alyi.md](../characters/alyi.md) (he rises in his chair; no FEELING meter; no blips).
- **Ep12 takeover as the default:** [ep12/intro-slot.md](../episodes/ep12/intro-slot.md) (cold open, `side: unclear`, `generally available`); [the-intern.md](../characters/the-intern.md) lines 12 and 94 ("takes over the intro"); [ep12/gags.md](../episodes/ep12/gags.md) §1 (the OPEN → NOPE row places PEON at "intro bar 8.4", and "slides the N" can't make PEON). All of these must follow the §6.3 ruling.
- **Mas's cowlick on the cursor portrait:** the face ladder never takes it (§8.2). Check [the-intern.md](../characters/the-intern.md) and [the-model.md](../characters/the-model.md) if either plans an intro face.
- **Recurring gags:** G01 (the tally shows a mark from the episode after it's earned), G05 and G06 (collars and threads, one episode behind).
- **Naming:** [naming.md](../bible/naming.md) line 497 still carries the pronunciation of the retired spelling; RUMPT is one syllable, "rumpt" (rhymes with "jumped"). `audio/voices/CASTING.md` §0 rule 7 flags the same leftover.

### 9.9 What changed from v1.1 (the v2.0 pass, kept for history)
1. **Look:** pixel art replaces the cut-paper, 240p and HDR tiers. The fidelity ladder becomes a **palette ladder:** 1-BIT → EARLY-WEB16 → BASE. The 1993 pillarbox widens to 16:9 as the front passes.
2. **Camera:** every dolly, zoom, push-in, roll and motion blur is replaced by cuts and whole-pixel scrolls, and the card punch-ins become 2-px integer shakes. The cold open is built as insert, room, insert. **The pull-back becomes a cut to the reverse angle,** where the monitor is visible for the first time.
3. **THE WOODROSE is a single adventure-game room.** Mas crosses it carrying his water glass, so the glass that never ripples travels with him. The flame and paper wipes are gone.
4. **New rules:** the cyan thread never freezes, and anything Mas picks up takes his colour. The neon sign ends in full colour, which strengthens the key art.
5. **The typing leads the VO by 6–8 frames:** he reads back what he typed.
6. **The 2008 → 2014 change is a hard cut.** The `2015` card holds to f247, and the RED-TEAMED HUD holds to f400.
7. **Cut:** the self-labelling eggs `512×342 · 1-BIT`, `upgrading… 1-bit → 240p`, `▶ PLAY JUN 09 2008` and `HDR · RAY-TRACED* / *not really`; the Tesla painting (a 2017 prop, Ep8 only); the bookend dot.
8. **Score:** the 808, trap hats, boom-bap, cassette piano and fuzz guitar are retired for V1 "Chip Chamber Jazz."
9. **Ep12:** the model-written card set follows the episode room.

### 9.10 Open questions for the showrunner
1. **RUMPT's fill-in timing.** The brief says the silhouette fills in "from Ep3", but Ep3's button *is* his face reveal (the podium turns around). v2.1 fills in only his hands in Ep3 (Ep2 aired them), shows him fully from Ep4, and moves the coin slot to Ep4. The coin clink and glint are cut, because the hill's other side gets no beat to match (checker). Confirm?
2. **The Ep12 takeover.** The brief allows five kinds of change and "nothing in the intro may reveal the current episode's plot." The checked v2.1 therefore defaults Ep12 to the five changes (§8) and **holds** the room's takeover package in §6.3, with a map of which parts duplicate the episode's own beats. Should THE INTERN's "it takes over the intro" count as the intro's own Ep12 event (the empty-chair cold open, plus the model-written cards, which are also the A-plot's first beat)? PEON, the 1993 turn, `generally available`, `side: unclear`, the silent register and the whale's height stay out either way.
3. **VO fit and casting.** Shorten the "side" vowel so every take ends by f91 (recommended), or allow f72–94 with only the tail over the cut? And which take: am_michael, am_puck, am_echo, am_liam, or the designed blend?
4. **The hill package.** Approve NEDIB's inkwell (Ep1–4) → THE THREE-TIER MAP (Ep5+), the one CZAR lanyard with a blank tag in Ep1, and "the hill changes only in pairs" (so Ep6's `GENIUS` label waits until MOSWEN's `EDITED` is upgraded from [K])?
5. **Roll-call traits that come from later episodes.** KRAM's soup (Ep5's gag), THE WHALE's breach (Ep4) and RIMA's spotlight are fixed from Ep1 per the brief, drawn as traits with no text or numbers. Keep them, or hold the soup and the breach back until they air?
6. **Score lock.** Confirm V1 as the lock (V3 the fallback if V1 reads too polite), adopt the render's chord names and the G on top of the f630 stack, and budget one live Harmon-mute trumpet phrase (2.5 s)?

*Still open from v2.0:* `BUNKER: YES` or `EFFIGIES: 1` on Alyi's stat row (the fallback is used); and the Ep12 alto glide, toward A♭ (minor) or A (major).

---

## 10. Revision notes (v2.1)
**Source of the change:** the showrunner's REVISION v2.1 in [`studio/INTRO_PIXEL_BRIEF.md`](../../studio/INTRO_PIXEL_BRIEF.md) (binding), the three v2.0 reviews ([timing](history/v2.0-review-timing.md), [tone](history/v2.0-review-tone.md), [audio](history/v2.0-review-audio.md)), and the current audio direction. v2.0 is backed up at [`history/SCRIPT-v2.0-backup.md`](history/SCRIPT-v2.0-backup.md).

**Structure**
- **Bar 9 is now THE PLAYERS roll call** (§3.7): eight portraits on straight eighths, riding the knee, cut on the eighth, with eight brass-and-chip stabs in stop-time. The Ep1 fired/rehired beat, the CHATGTP bloom, the video call, the GLYPH tile dissolve, the heart avalanche and the "music is fired" mute are gone from the intro; they live in Ep1.
- **The skyline is the group shot** (§3.8): the roll-call players stand on their towers and repeat their actions; the cursor sits on the spire; the hill is shared.
- **The N move happens inside Nole's freeze** (f456–464), so `NOPE AI` reads before the hard cut at f480 (T16 +2), and the key art runs f465–479.
- **§8 is rewritten around spoiler safety:** five kinds of change, each one episode behind; the subtitle becomes last week's release note; a per-episode keycap couch gag; roll-call evolution (RUMPT's hands in Ep3 and his full design from Ep4; RIMA's fill; the cursor's face ladder); a skyline and hill table where everything dated appears only after it airs.

**Fixes adopted from the reviews**
- *Timing:* the fast type-on exception in §5.1 (T08, T10, T12 and T15 were failing the rule as written); the name-card 1.2 s check; VO fitted to f24–91 with the real word timings; typing leads 6–8 frames; the straight off-beat rule; the collars on the swung Fs (f180, f190, f205); the pizzicato at f355; walk speed and camera math; the scroll length; the glass pickup at f255; UI overlays excluded from the freeze; the f345 row label; the 112×136 window; figure heights; the T15-12 wording; the Ep12 toast held across the cut; the stamp at k15 as an engine parameter.
- *Tone and guardrails:* rule 9 (no flatline) and the chart's upturn; rule 10 (no spoilers); hill parity and the CZAR lanyard; Misanthropic's per-episode price tag; PEEKDEEP on a budget; the [K] lock gate; cut the tooltip, the crowd "ohh", the violin sigh, Alyi's meter and blips, the juice box and stage bottle, `PTO: 404`, the future-episode vault eggs and the PACE scroll line; the WORD COUNT stat row; Alyi rises in his chair; the non-flinch replaces the balcony sip; the Dalí sag after Ep4 airs; cut the title's palette ladder and the Ep1 LEDGER beat; fewer bells at the bookend; generic neon lettering.
- *Audio:* the audio column now follows the current direction (piano / orchestra / big band, brass as accents only, jazz, chip throughout, V1–V4 with status and balances); eight brass accents numbered with the roll call as #7; the render's chord names and harmony where the render is sound; the no-third fixes; one owner per sound; SFX flavours follow the picture; the card latch on all four hits; the card blips per word on chord tones; the VO duck and loudness plan; §9.2 lists what V1 must recompose, bar 9 first.
- *Legibility and legal:* Mario's parchment plate (about 7.4:1); the YC-orange correction (the v2.0 dither-pair note was wrong); the Ep12 card set follows the episode room, with the files that disagree listed in §9.8.

**Dropped as moot** (they concerned the old bar 9): the Ep6 and Ep7 headline margins, the flatline tile, the grey-call reading load, the 9.3 overload, the 4-px jolt, the reversed dissolve, the Ep7 meteor staging, the Ep5 battle-station transition, the Ep1 slot's tuned-sound count, the heart glissando and the fired F4's ownership.

**Not adopted:** the tone review's `SABBATICAL: CUT SHORT` (it previews Ep3's beach gag inside the fixed section), and its subtitle punch-ups in their original episodes (each would preview that episode; they now run one episode later as callbacks).

---

## 11. Checker notes (v2.1)
An independent script check of the editor's v2.1, against the brief's REVISION v2.1, the three v2.0 reviews, the guardrails, the episode outlines and the files on disk at 05:47. The editor's text is kept wherever it passed; the items below were changed in place.

**Checks**

| Check | Result |
|---|---|
| Rows cover f0–719 with no gaps or overlaps | **PASS**: 56 rows, contiguous |
| TC = frames/24 on every row | **PASS** |
| bar.beat labels match `at(bar, beat)` | **PASS** |
| Roll call: 8 flashes on straight eighths | **PASS**: cuts at ⌊480 + 7.5n⌋ = f480, 487, 495, 502, 510, 517, 525, 532 (lengths 7, 8, 7, 8, 7, 8, 7, 8); the stabs sound at +7.5, so the picture leads by half a frame. The rule is now stated in §3.7 and matches `mrollcall`'s `CUTS`. |
| Roll call: read time per image | **PASS after fix**. RIMA's key image held only 3 frames and changed on the flash's last frame, so she now lands in her light at f511 and holds 6 frames, and the slide-off moved to her rooftop loop. A read rule was added: one silhouette per flash, key drawing at least 4 frames, nothing new on the last frame. NESNEJ and THE WHALE now have frame-exact drawings. |
| Must-read text, 0.25 s + 0.05 s per character | **PASS**: T01–T28, the held Ep12 cards (with the T15-12 fix), the subtitles Ep2–12 and the toasts were all recomputed. T16 `NOPE AI` is +2 (tight) and Ep6's subtitle is +2 (tight). Name cards hold at least 29 frames. |
| No spoiler of an episode's plot in §8 | **PASS after fix**, listed below |
| RUMPT naming | **PASS**: RUMPT everywhere; the retired spelling appears nowhere |
| Guardrails and political balance | **PASS after fix**, listed below |

**Spoiler fixes (checked against `episodes/ep*/outline.md`)**
1. **Ep12 had no exception to take.** Its takeover played the episode's own logline and button: the model-written cards (the A-plot's first beat), NOPE → PEON (logline), the 1993 screen turning (the C-plot), `generally available` (the button's title card), `side: unclear` (the button's Orb verdict), Nesnej's silent register (the B-plot) and THE WHALE's matching tower (its payoff). Ep12 now defaults to the five changes: the Ep1 line as epigraph, `CTRL`, `assisted (after you)` [PROPOSAL], `human… ?`, Ep11's skyline aftermath, and the 1993 screen at 35°. The package is **held** in §6.3 with a spoiler map for Q2. NOPE → PEON is also not a one-letter move and can't fit before f480.
2. **Ep8's cold open** no longer buffers the chart: "the courtroom buffers" is Ep8's A-plot payoff.
3. **The cursor's face ladder** no longer grows Mas's cowlick (Ep9–10). That pointed at the finale's "the model distilled Mas" payoff, and it broke the ladder's own "never nameable" rule.
4. **Ep9's mirrored COUNTERPART podium** moves to Ep10: Ep9 is the episode that stages it.
5. **§8's rule** was reworded: items 2–5 are after the fact, and the cold-open quote is the epigraph (words only, no staging), which is what every §8.1 row already does.

**Guardrails and balance fixes**
6. **The Ep4 coin glint and clink are cut.** They were the hill's only one-sided beat (a sound and a light on RUMPT's side, none on the other), and they fired during the subtitle's type-on. The coin slot stays as a static prop, and the hill never sounds.
7. **Ep8's other-side prop** is THE RECEIPT, with no real name: [naming](../bible/naming.md) keeps its source an object, never a character.
8. **KRAM's `CAGE MATCH · CANCELED` poster is cut from Ep2.** No episode airs it, so it wasn't "after the fact" (and it was [K]).
9. **THE WHALE's Ep5 plate `RECEIPT: $5.6M*` is cut.** ep04 facts mark the figure [UNVERIFIED], and rule 10 bans numbers in the portraits. The Ep5 change is a beach chair in the splash.
10. **Ep7's siren** follows Ep6: the CODE RED siren flew to NopeAI's roof. It isn't a second siren.
11. **The WHY COMBINATOR sign** is #FF7F2A on #F3EEDC, the pair guardrails §5 names. That pair is 2.2:1, so the must-read letters get a 1-px #000033 outline, and §9.5 note 4 adds #F3EEDC to `EARLYWEB16` (it was missing).
12. **Rule 9 (no flatline)** is scoped to dark fields and screens, so the lit table runner and the roll call's flat stretch under short stabs no longer trip it. **Rule 10** now bars text other than names on the plates.
13. **Hill text rule:** "12 characters per episode" contradicted the editor's own table. It is now about 12 per side per episode, from episode-slots' podium rule, with skyline eggs as single short labels.

**Timing and audio fixes**
14. **VO:** the voice itself crosses the f90 cut by 2 frames (the final "d" on f90–91), so the wording was corrected from "only its room tail crosses".
15. **Roll-call sound:** "no strings" contradicted the viola-and-cello F4 at f480. The note now sounds inside stab 1 and releases with it (§9.2 item 1).
16. **§3.1 statuses, §9.1 and §9.2 brought up to date.** V2–V4 are now rendered, `VARIATIONS.md` and `cues.json` exist, and the chant is rendered, all to v2.0 (the old bar 9, the "music fired" mute, the 55 → 35 Hz sub, V2's heartbeat). The 05:40 V1 re-render meets the whole-piece balance, but chip is still about 15% in the dinner and skyline. **V1 now plays a Harmon phrase in bar 7 (f385–407), which breaks "no Harmon before f540": move it to bar 10.** V4 adds a clarinet and a title string pad. Bar 9 must be recomposed in all four variations.
17. **The pixel moments** now exist in part and are listed with how they differ (§9.1, §9.8):
    - `mrollcall` matches the cut frames, but its window grows by semitone to 40% of the screen, so §9.7 adds an audit note;
    - `mdinner1` adds a GLYPH rose-window boot over budget, and Alyi levitates;
    - `mdinner2`'s timeline and `mfinale`'s scene are still v2.0.

    §9.4 now gives the roll call its own moment, `mrollcall`.

**Still for the showrunner:** §9.10 Q1–Q6. Q1 and Q2 were rewritten for the clink cut and the held Ep12 package.
