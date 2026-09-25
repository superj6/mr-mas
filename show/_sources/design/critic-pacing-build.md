# MR. MAS intro: editor and technical-director pass

## 0. Verdict

- **Frame grid: correct.** The 32 rows run from f0 to f719 with no gaps or overlaps. That is 720 frames, exactly 30.000 s. Every timecode equals frames/24. Every bar.beat label matches `b(n)=(n−1)*15`. The music plan's section lengths add up to 30,000 ms and fall on bar lines. The sample math checks out: 2,000 samples per frame, 30,000 per beat, 1,440,000 in total.
- **Readability: fails badly.** The table puts about **1,200 characters (about 70 text items)** on screen. Read at 0.25 s + 0.05 s per character, that is about 75 s of reading in a 30 s piece. Seven moments fail on their own read time. The cut rate is fine; the piece is overloaded with text.
- **The two docs conflict** on the cold-open quote, the bar-by-bar content, the title subtitle vs. filename, and the music style. Section 9 says how to resolve each one.
- **It can be built in Remotion 4 on this CPU machine** once five Hard shots are simplified (section 5). One shader plan is wrong: halftone on the card holds cannot run as a full-frame pass-2 effect, because Mas must stay in full color.
- **After the fixes:** about 370 characters must be read. Every item passes its own read window, and the frame total stays at 720.

---

## 1. Timing verification

| Check | Result |
|---|---|
| Shot rows add up to 720 frames | OK, 30.000 s |
| Timecodes (f105=4.375, f495=20.625, f630=26.25, f705=29.375, …) | OK |
| Bar.beat labels (for example 11.3 = beat 43 = f630) | OK |
| Composition offsets b(9)=120, b(13)=180, b(16)=225, b(33)=480, b(43)=630, b(47)=690 | Offsets are right, but the **mounts are wrong**. Era2008_14 must mount at **f165**, because the render front at 3.4 needs it. Tableau must stay mounted **to f494**, because the shockwave re-skins it. Skyline and Title must stay mounted **to f719** inside the Bookend nest. |
| Cursor blink on 8 frames, off 7 | OK; its phase repeats every beat, so the loop works |
| Eighth and sixteenth notes (7.5 and 3.75 frames) | They land on half-frames, and the docs round both ways (f188 goes up, f292 goes down). **Rule:** musical notes stay on the exact grid in MIDI; sound effects tied to picture snap to the frame; always floor. The largest offset is 21 ms, below what anyone can hear. |
| Cold-open voice-over (VO) | **Too optimistic.** The table has "near the singularity;" at f33–55, which is 7 syllables in 0.96 s, about 7.3 syllables per second. A soft, "stress no word" delivery runs about 5 per second. **Fix:** start the VO under the black at f24. That gives "near the singularity;" f24–57, the pause f58–71, and "unclear which side." f72–91. The dot-slide and the D♭ stay where they are. |
| Mas's card vs. the 1-bit grid | The subtitle must be at least 64 px cap height, which is 21 px on the 512-pixel grid. That allows about 24 characters per line, so the 35-character subtitle cannot physically fit. It has to be cut. |
| Monitor text in the cold open | For the typed quote to reach 64 px cap height, the monitor must fill at least 50% of the frame width from f24 to f104. That allows about 18 characters per line, so 3 lines hold **54 characters or fewer**. |

---

## 2. Corrected timing table with read-time audit

"Need" is 0.25 s + 0.05 s per character, counting must-read text only. Everything else becomes an easter egg: 30 px or smaller, low contrast, never needed to follow the story. Only rows 7 and 8 change their frame boundaries. **Total: 720 frames, 30.000 s.**

| # | Frames | Time (s) | Bar.beat | Must-read text after fixes | Chars | Need (s) | On screen (s) | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | 0–29 | 0.000–1.250 | 1.1–1.2 | none (VO starts under black at f24) | – | – | – | changed (VO start) |
| 2 | 30–59 | 1.250–2.500 | 1.3–1.4 | `you are here` | 12 | 0.85 | 2.3 | ok |
| 3 | 60–89 | 2.500–3.750 | 2.1–2.2 | the quote, typed and spoken (at most 54 chars) | 41 | 2.30 | 3.7 (f24–112) | ok |
| 4 | 90–104 | 3.750–4.375 | 2.3 | none; the Orb scan has **no toast** now | – | – | – | changed (toast was 42 chars in about 0.6 s) |
| 5 | 105–119 | 4.375–5.000 | 2.4 | token chips (texture only) | egg | – | – | ok |
| 6 | 120–134 | 5.000–5.625 | 3.1 | `1993` | 4 | 0.45 | 0.63 | ok |
| 7 | **135–167** | 5.625–7.000 | 3.2–3.4 | `MAS MANALT` / `no equity.` (`age 8` moves to the dialog title bar as an egg). Cancel click f150; **OK click f165** | 20 | 1.25 | 1.33 | **changed** (was 45 chars in 1.25 s) |
| 8 | **168–179** | 7.000–7.500 | 3.4 | render front, 12 frames (`upgrading…` is an egg) | – | – | – | **changed** |
| 9 | 180–194 | 7.500–8.125 | 4.1 | `2008`, `TPOOL` (the render front reveals the TPOOL screen from f172; `where u at?` becomes an egg) | 9 | 0.70 | 0.95 | ok once pre-revealed |
| 10 | 195–224 | 8.125–9.375 | 4.2–4.3 | `2014`, `WHY COMBINATOR` (the crown already says "president"; `LUAP` moves to his fleece name patch as an egg) | 18 | 1.15 | 1.25 | **changed** (was 46 chars) |
| 11 | 225–239 | 9.375–10.000 | 4.4 | big `2015`, following the same big-year pattern as the other eras; `THE WOODROSE` goes on a menu card as an egg | 4 | 0.45 | 0.63 | **changed** (caption was 38 chars and overlapped the GERG slam) |
| 12 | 240–284 | 10.000–11.875 | 5.1–5.3 | `GERG MOCKBRAN` / `ALREADY CODING.` (one stat row, as an egg: `SLEEP: DEPRECATED`) | 28 | 1.65 | 1.88 | ok; CTRL gag moves to f270–282 |
| 13 | 285–299 | 11.875–12.500 | 5.4 | `UNALIGNED` (stays frozen in the background until f339) | 9 | 0.70 | 2.1 | ok |
| 14 | 300–344 | 12.500–14.375 | 6.1–6.3 | `ALYI` / `FEELS THE AGI.` (egg row: `PRODUCTS: 0`; the FEELING bar is the template break) | 18 | 1.15 | 1.67 (to the wipe) | ok; marshmallow moves to f328–339 |
| 15 | 345–359 | 14.375–15.000 | 6.4 | HUD `RED-TEAMED ✓✓✓`, which stays frozen behind the card | 14 | 0.95 | 2.2 | **changed** (was 25 chars; whiteboard becomes an egg) |
| 16 | 360–404 | 15.000–16.875 | 7.1–7.3 | `MARIO` / `HAS CONCERNS.` plus the scroll `15,000 WORDS ▸▸▸` (the WORD COUNT bar runs off the card and becomes the scroll); one row `SAFETY™ ▰▰▰ / VALUATION ▰▰▰▰▰▰▰▸`; **AGREED stamp cut** | 18 + 12 | 1.15 + 0.85 | 1.67 / 1.38 | **changed** (subtitle was 29 chars, stamp 8 frames) |
| 17 | 405–419 | 16.875–17.500 | 7.4 | `SPACEZ`; the neon **`OPEN`** sign is now in frame | 6 | 0.55 | 0.63 | **changed** (sets up the sign) |
| 18 | 420–464 | 17.500–19.375 | 8.1–8.3 | `NOLE` / `CO-FOUNDER.` plus the stamp `FUTURE PLAINTIFF`, now at **f435 (8.2)** and layered over the subtitle rather than replacing it. The PATIENCE and AGI-ETA row is cut; the check reads `$1,000,000,000*` with `*pledged · received $133M` as an egg | 31 | 1.80 | 1.88 (stamp: 1.25) | **changed** (the stamp at f450 got only 0.63 s) |
| 19 | 465–479 | 19.375–20.000 | 8.4 | `NOPE AI`: N slides f466–473, AI lights f474, and **the sign stays through the f480 shockwave** (re-skinned glossy) until f494. **Flashbulb f476 and Polaroid caption cut.** | 7 | 0.60 | 0.88 | **changed** (was 0.25 s) |
| 20 | 480–494 | 20.000–20.625 | 9.1 | `CHATGTP` on the button; odometer to 100,000,000 as a graphic. `2022`, `low-key research preview` and the HDR HUD become eggs. | 7 | 0.60 | 0.63 | **changed** (was 55 chars) |
| 21 | 495–509 | 20.625–21.250 | 9.2 | `FIRED.` (tile labels are eggs) | 6 | 0.55 | 0.63 | **changed** |
| 22 | 510–524 | 21.250–21.875 | 9.3 | `BACK.` (`UNFIRED.` also works if held to f527). `TTEMME · 72:00:00` becomes an egg. | 5 | 0.50 | 0.63 | **changed** |
| 23 | 525–539 | 21.875–22.500 | 9.4 | `745/770` (egg) | – | – | – | ok |
| 24–29 | 540–629 | 22.500–26.250 | 10.1–11.2 | **Tower wordmarks only:** MACROSOFT, ELGOOG, ATEM, INVIDIA, MISANTHROPIC, zAI, PEEKDEEP. They stay up once they pop. Person plates become name-only eggs; MINDDEEP, TRUTHGTP and the poster are eggs. | 49 | 2.70 total (0.85 at most each) | 1.25–3.75 each | **changed** (plates were 229 chars) |
| 30 | 630–689 | 26.250–28.750 | 11.3–12.2 | `MR. MAS` plus **the bible's per-episode subtitle** (34 chars at most, landing at f640). The filename and legal line move out of the intro. | ≤41 | ≤2.30 | 2.5 / 2.08 | **changed** (filename 34 + legal 50 had about 1 s) |
| 31 | 690–704 | 28.750–29.375 | 12.3 | toast `human (probably)` from f692 | 16 | 1.05 | 1.17 (to f719) | **changed** (moved from row 4) |
| 32 | 705–719 | 29.375–30.000 | 12.4 | cursor; **notification and ding at f705** (on the beat, same blink phase as f0) | – | – | – | changed (ding was f712) |

**Photosensitivity:** the card pops must be at 80% white or less. Cutting the f476 flash means there is never more than one bright transient in any 24-frame window between f420 and f510.

---

## 3. Density: shots, cuts and overstuffed moments

| Section | Time | Table rows | Continuous shots | Transitions | Freezes / pops | Rows/s | Must-read chars, before → after |
|---|---|---|---|---|---|---|---|
| Cold open | 0–5.0 | 5 | 1 | 1 (to white) | – | 1.0 | 95 → 53 |
| Eras (bars 3–4) | 5.0–10.0 | 6 | 3 | 4 (match cut, 2 render fronts, whip) | 1 dialog | 1.2 | 237 → 55 |
| Dinner (bars 5–8) | 10.0–20.0 | 8 | 1 | 2 in-world wipes | 4 freezes | 0.8 | 415 → 143 |
| Episode slot (bar 9) | 20.0–22.5 | 4 | 2 | 3 plus a color slam | – | 1.6 | 139 → 18 |
| Skyline | 22.5–26.25 | 6 | 1 | 0 | 7 pops plus the roofline | 2.1 pops/s | 229 → 49 |
| Title and bookend | 26.25–30.0 | 3 | continues from the skyline | slam, pull-back | – | 0.8 | 91 → 54 |
| **Total** | 30.0 | **32** | **about 8** | **about 11** (0.37/s) | 4 freezes, 7 pops | 1.07 | **about 1,206 → 372** |

The pace goes slow, medium, steady hits, fast, fastest, then slow again, which follows the craft rules (craft.md), so **the cut rate needs no change**. Overstuffed moments, worst first:

1. **Bar 9, f480–524:** three headlines, button, odometer, year, HUD, four call tiles, dialog, badge and hourglass. About 139 characters in 1.9 s, where they need about 7.5 s.
2. **Mario, f345–404:** HUD, whiteboard, card, three stat rows, lanyard and stamp come to about 141 characters. The 15-frame entrance also packs in seven actions: the wheel turns, steam vents, the door swings, the HUD ticks, he steps out, he flings the scroll, Adelina catches it.
3. **Nole to NOPE to launch, f420–494:** the stamp is readable for 0.63 s, NOPE for 0.25 s and the Polaroid for 4 frames, and the flashbulb and shockwave land 4 frames apart.
4. **Skyline plates:** 229 characters in 3.75 s.
5. **2014 plus the dinner caption, f195–260:** 88 characters in about 2.7 s, colliding with the GERG slam.
6. **Mas's dialog:** 45 characters plus the pointer gag in 1.25 s, and the text does not fit the grid anyway.
7. **Title:** filename plus legal line in the last 1.6 s. **Toast:** 42 characters in 0.6 s.

**If the animatic still confuses non-AI viewers,** cut in this order: skyline person plates entirely, then the TTEMME hourglass, then Luap (the crown drops from off-screen), then Adelina, then the marshmallow, then the FEELING-bar break. Keep CTRL, OPEN→NOPE, and the Cancel callback.

---

## 4. The per-episode slots: length rules and rewrites

### 4a. Cold-open quote

The window is f24–100 (3.2 s): **16 syllables or fewer, including the pause, and 54 characters or fewer.** The staging becomes data-driven. Word timings are a hand-keyed JSON file per episode. The dot slides on the last stressed word, the piano color note goes in the longest pause, and the token chips are a hand-split array.

| Ep | Bible quote | Syllables / chars | Verdict | Fix |
|---|---|---|---|---|
| 1 | "ai will probably, most likely, sort of lead to the end of the world…great companies." | 30 / 124 | **FAIL** (about 6.5 s) | **A:** "…the compute costs are eye-watering." † (Dec 2022; 9 syllables; fits the GPU visuals). **B:** keep the line in a **pilot-only 35.0 s cut** with a 4-bar dark room (+120 frames; everything downstream shifts +120; the music's "Dark room" section becomes 10 s). |
| 2 | "her" | 1 | ok | – |
| 3 | "i love summer in the garden" † | 8 / 27 | ok | – |
| 4 | "our gpus are melting." | 7 / 21 | ok | – |
| 5 | "missionaries will beat mercenaries." | 10 / 35 | ok | – |
| 6 | "if you want to sell your shares, i'll find you a buyer… enough." | 15 plus pause / 63 | FAIL | "…i'll find you a buyer. enough." † |
| 7 | "they are funny, and I laughed." | 7 | ok | – |
| 8 | "…yes." | 1 | ok | the spinner fills the silence |
| 9 | "we are now in the singularity. this is the moment." | 15 plus pause / 50 | borderline | "we are now in the singularity." |
| 10 | "we may have to pace the rate of ai development to give ourselves enough time." | 21 / 78 | FAIL | "…pace the rate of ai development…" † |
| 11 | "i remain enthusiastic about the non-profit structure!" | 16 / 53 | at the limit | ok if delivered briskly |
| 12 | "near the singularity; unclear which side." | 11 plus pause / 41 | ok | the payoff for the opening's staging |

### 4b. Bar-9 headlines

A one-beat headline slot (15 frames) holds **7 must-read characters or fewer**. A prop carries the meaning, and longer text is an egg only. Grammar: 9.1 is the news, 9.2 is when the music is fired, 9.3 is when it's rehired.

| Ep | 9.1 | 9.2 (music fired) | 9.3 (music rehired) |
|---|---|---|---|
| 1 | `CHATGTP` (odometer) | `FIRED.` | `BACK.` |
| 2 | `AROS` (mammoth) | `SUED.` (complaint made of "!") | `her` |
| 3 | strawberry icon, no text | `3 QUIT.` | `$157B` |
| 4 | `$500B` (the ring rises) | `−$589B` (whale pebble) | `NOPE.` (reply to the $97.4B bid) |
| 5 | `$6.5B` (velvet cloth) | `$100M` (thermos) | `GTP-5` (Death Star) |
| 6 | `$1.4T` (Money-Go-Round) | `BACKSTOP` (8 chars, about −1 frame, acceptable) | `CODE RED` (siren flies) |
| 7 | `NO ADS` | `BANNED.` (SUPPLY CHAIN RISK stamp) | `SIGNED.` (same day) |
| 8 | `TRIAL` | `EXPIRED.` (THE CALENDAR's gavel) | `$965B` (Misanthropic passes) |
| 9 | `NOW.` (curve goes vertical) | `HACKED.` (mascot face-hugged) | `PACE.` (sky cracks) |
| 10 | `PROMOTED` | `PAUSED` | `"PAUSED"` |
| 11 | `RSI` | `JK.` | `(NOT JK)` |
| 12 | `?` | `??` | `???` (typed by an unseen cursor; matches the question-mark chyrons) |

**Title subtitle cap is 34 characters.** Only Ep5 is over: "missionary edition (mercenary rates)" is 36; use "missionary ed. (mercenary rates)".

---

## 5. Buildability: Remotion 4, CPU only, no image generation

| # | Shot | Rating | Technique | Simplification / note |
|---|---|---|---|---|
| 1 | Cursor extreme close-up | Easy | `<Cursor on={f%15<8}>`, subpixel PNG multiply, CSS scale | Pre-render the subpixel tile at 6× so it doesn't moiré |
| 2 | Reveal: Mas, Orb, composer, chart | **Medium (hero)** | `<MasRig view="3q" light="monitor">` built from flat light and shadow shapes, Orb PNG plus 8 SVG iris blades, 4 parallax planes, typing from word-timing JSON | Mouths: 6–8 replacement shapes keyed by hand. Rhubarb isn't installed, and 16 syllables don't need it. |
| 3 | Pause, head tilt, dot | Easy | Rotation around a pivot; `getPointAtLength` | The mirrored text in the catchlight is unreadable at eye size, so draw a glint rect instead |
| 4 | Eye dart, scan, data-hall reveal | Medium → Easy | One perspective rack plate drawn in pycairo, revealed through an SVG cone mask; streak PNG in screen blend | It's on screen for 5 frames, so one plate is enough |
| 5 | Post, tokens, push to white | Easy | Spring-scaled chips with CSS perspective; zoom-blur in pass 2 (f113–119) | – |
| 6–8 | 1993, 1-bit dialog, render front | Medium → Easy | A native 512×342 sub-composition at 24 fps with stepping every 4 frames. **SVG Bayer `<pattern>` fills (8 grey levels) plus `crispEdges`**, and a threshold filter on the text. Render once, then place with `<OffthreadVideo>` at 3× with `pixelated`. | Skip the numpy dither pipeline entirely; flat cut-out art only needs pattern fills |
| 9 | 2008 keynote, 240p | Medium | 320×240 sub-composition, 12 fps stepping; Mas stride in 2 drawings; collars spring-scale in; scanlines and chroma in pass 2 | – |
| 10 | 2014 throne and crowd | Medium → Easy | One founder `<symbol>` × 20 with 2 poses swapped on twos; the throne rises on a spring; the crown follows a dotted path | Cut the 480p mini render front and use a 2-frame wipe |
| 11 | Whip into dinner, Gerg typing | Medium | Pillarbox mask widens; `CameraMotionBlur` with 6 samples on f225–229 only; keycaps on seeded arcs | Napkin to website is a swap of 2 states, not a morph |
| — | **Tableau system** (f225–494) | **Hard** (infrastructure) | World about 7,680 px wide, 8 planes, a camera spline, `useActorTime = min(f, freezeAt)`, `PaletteContext` swapping between live and frozen fills | **Cull actors outside the viewport per frame.** Every rig must take its fills from palette tokens (plan this before drawing). |
| 12 | Gerg freeze and card | Medium | `<NameCard>`; halftone plus 1–2 px misregistration as **a pass-1 `<pattern>` overlay masked to the frozen-actor group** | **Not pass 2**: a full-frame halftone would also halftone Mas |
| 13 | Alyi's cathedral | Hard → Medium | Rack `<symbol>` instances with LEDs flickering from `random(seed + (f>>1))`; rose window generated once from polar polygons; god-ray PNG wedges | **Flames:** a loop of 8 hand-drawn SVG frames on twos instead of noise-displaced paths. Scarf: 3 segments on lagged springs. |
| 14 | Alyi card, FEELING bar, marshmallow | Medium | Card `layout="drop"`; the token eyes are clipped, scrolling mono text; the bar overflows and then follows a path; the flame wipe is a scaled flame sprite | – |
| 15 | Vault entrance | Hard → Medium | The door ellipse is already swinging via scaleX at f345; small conic-gradient beacons; steam sprites | Mario in 2 drawings. **The scroll launches on the freeze beat. Adelina is already frozen at the frame edge.** |
| 16 | Mario card and scroll | Easy | The overflow stat hands off to a scroll strip with tiled micro-text PNG; the paper wipe is a full-frame sprite | – |
| 17 | Rocket through the ceiling | Medium | Booster SVG with a looping flame sprite, 10 tiles on seeded arcs, pre-blurred smoke PNGs, `noise2D` shake, candles skewed flat | Many parts, but each is simple |
| 18 | Nole freeze and stamp | Easy | Upper body only inside the hatch; the stamp springs from 1.4 to 1.0 with a rough-edge mask | – |
| 19 | Wide shot, place cards, NOPE | Medium | Camera goes to the widest keyframe; the shared card component interpolates into place cards; neon letters are `<text>` with glow PNGs; the N moves along a path | This frame is the key art, so it gets the most polish |
| 20 | Shockwave to Tier 4 | Hard → Medium | **No second set.** The same table with a gloss overlay (specular PNGs) revealed by a growing `clip-path: circle()`; bloom from pass-2 glow; `<RollingDigits>`; `<textPath>` token stream | Delete the pass-1 "blurred-copy bloom" (a CPU blur) |
| 21–22 | Video call, FIRED / BACK | Easy | CSS-grid tiles and bust sprites; desaturation through the palette, not a CSS filter; the dialog in an HD skin; badge flips with `rotateY` | Mute = master-bus gain with a 10 ms fade; the dry F4 and room tone sit on an unmuted bus |
| 23 | Heart avalanche | Easy–Medium | One `<canvas>`, 400 `Path2D` hearts on closed-form seeded trajectories (no simulation state); color lerps toward white | Draw the hearts as paths, never emoji |
| 24–29 | Skyline | Medium | `<IsoTower>` built from 3 polygons plus a window pattern; the NopeAI tower is a bespoke SVG; 4 planes; pops are scaleY springs plus a dust sprite; siren is a conic gradient at 2 revolutions/s or slower; melt is a swap of 4 drawings (or flubber); roofline drawn on with `stroke-dashoffset` plus a glow PNG | Rooftop sprites get one moving part each |
| 30 | Title slam | Medium | 4 pre-rendered wordmark PNGs swapped by frame; Orb reused; the rivals' flinch is a squash transform on their existing sprites; subtitle typed on via `slice` | No new reaction drawings |
| 31 | Pull back into the monitor | Hard → Medium | Render f690–719 of the title and skyline as **its own pass-1 clip**. Pass 2 composites it into a **face-on** monitor with barrel, scanlines and glow; the dark room stays a clean layer. | Fallback: skip barrel and use a scanline PNG plus glow in pass 1 |
| 32 | Final beat and cursor | Easy | Same `<Cursor>` coordinates as f0 | – |
| — | Global texture | Easy | **Move grain, gate weave and vignette to pass 1** (Pillow tiles and a transform). Pass 2 runs **only on the shader ranges** (f113–119, f180–239, f480–689, f690–719); other ranges are a plain `<OffthreadVideo>`. | Line boil (`feTurbulence`) is v2 only |

**Pipeline notes**
- **GPU flag:** test `--gl=angle-egl` with chrome-for-testing on the Arrow Lake integrated GPU against `swangle`.
- **Intermediate format:** use ProRes 422 HQ, about 0.7 GB per 30 s pass. Disk has only 30 GB free, so keep no more than 3 versions.
- **Frame alignment:** check pass-2 alignment once with a separate test clip that has frame numbers burned in.
- **Glyphs:** draw ▰▱▸✓⚠⟨⟩ and the heart as SVG. Silkscreen, Anton and the system emoji fonts can't be trusted.
- **three.js:** not needed.
- **Render estimate:** pass 1 is about 5–12 min, since the tableau frames are the slow ones. Pass 2 covers about 330 frames at roughly 2–11 min.
- **Cache:** keep **all per-episode variation out of f120–479** so that section renders once. Ep12's rewritten cards and the kid's look to camera force one extra render.

---

## 6. Asset list

**Characters:** 15 designs, about 62 drawings, plus about 14 eye and mouth pieces. Silhouette-test each one before rigging.

| Character | Used in | Drawings / poses | Expressions |
|---|---|---|---|
| Mas, dark-room chiaroscuro bust | cold open, bookend | 1 rig: head tilt, clicking hand | 3 eye states plus a blink, micro-smile, 6–8 mouths |
| Mas as a kid, 1-bit | 1993 | 2 (three-quarter view at the computer, turned to camera) plus a clicking hand | stare |
| Mas at 23–29, low-res | 2008, 2014 | stride ×2, seated on the throne ×1, 3 collars, parachute | neutral |
| Mas as an adult, Tier 3 and 4 | dinner, slot, title | seated with steepled fingers, reach and pocket, marshmallow stick, standing reach-up to the neon, call-tile bust in color and grey with the badge, spire silhouette | serene, micro-smile |
| Gerg | dinner | typing loop ×2, freeze | focused, manic |
| Alyi | dinner, call tile | levitating body, arms-up shout freeze, tile bust, 3 scarf segments | eyes closed, token eyes |
| Mario | dinner, skyline | step-out, finger-up freeze, tiny waving sprite | worried |
| Adelina | dinner, skyline | frozen with clipboard, tiny sprite | calm |
| Nole | dinner, skyline | leaning out of the hatch ×2, tiny megaphone sprite | posting grin |
| Luap | 2014 | 1 pose dropping the crown | rumpled |
| Neleh, Mada | call tiles | 1 bust each | – |
| Tasya, Radnus, Simed, Kram, Nesnej | skyline | 1 sprite each with 1 moving part | – |
| The Whale | skyline | fishing silhouette | – |
| Founder crowd | 2014 | 1 figure × 2 poses, instanced ×20 | – |
| Turtleneck sleeve | 2008 | 1 arm | – |
| Orb | cold open, title, bookend | chrome PNG, 8 blades, scan cone | iris open, half, closed |

**Backgrounds and sets (11):**
1. Dark room: desk, monitor, 3 rack LEDs, 4 planes
2. Data-hall reveal plate
3. Monitor UI: composer and log chart
4. 1993 bedroom corner with the beige computer
5. 2008 keynote stage and giant screen
6. 2014 crowd, throne and web-player frame (define it as a 16:9 player inset inside the 4:3 frame)
7. THE WOODROSE tableau: table, candles, dusk windows, server-cathedral wall, vault and whiteboard, breakable ceiling, neon sign
8. Tier-4 gloss overlay for set 7
9. Video-call UI with the Vegas window
10. Dusk sky
11. Isometric Bay skyline: 8 towers, water, sky gradient

**Props (about 45):**
- Cold open: cursor, subpixel tile, token chips.
- 1993–2014: beige computer, pointer, TPOOL screen UI and BETA starburst, GPS pin, 3 collars, clicker, crown, ramen cups, laptops, parachute.
- Dinner: Gerg's laptop and keycaps, napkin and website, CTRL key, paperclip effigy, marshmallow, stained-glass card frame, vault door, beacons, HUD, scroll strip, clipboard, 1 stamp, booster, flame, smoke, ceiling tiles, bread basket, novelty check, place cards, neon letters.
- Slot: beige button, odometer, badge, hourglass, hearts.
- Skyline: GPUs and their melt states, key ring, teacup, extinguisher, siren, chess set and robot arm, sign flip, megaphone, fishing rod, price tag.
- Episode data: 3 headline props and 1 transition object per episode, plus skyline toggles.

**Parody logos and wordmarks (16):** Z, COINWORLD, TPOOL, WHY COMBINATOR, SPACEZ, OPEN/NOPE AI neon, CHATGTP, MACROSOFT, ELGOOG, MINDDEEP, ATEM, INVIDIA, MISANTHROPIC, zAI, PEEKDEEP, and MR. MAS in 4 fidelity tiers.

**Fonts: cut from 12 to 8.** Keep JetBrains Mono, Silkscreen, VT323, Oswald, Anton, Permanent Marker, Archivo Black and Bodoni Moda. Drop Micro 5 (Silkscreen covers it), Varela Round (use Archivo for TPOOL), Instrument Serif (the caption is cut) and Big Shoulders (use Oswald tabular figures). All load locally via `@fontsource` or TTF files.

**Pre-baked textures (Pillow):**
- 12 grain tiles, vignette, subpixel tile
- cyan and amber glow sprites, 4 god-ray wedges, 6 smoke puffs, streak
- 8 flame frames, rack plate, specular overlays, paper and halftone tiles

**Sound effects: about 45 in total. About 35 are synthesized in numpy.**
- **Synthesized:**
  - Room and UI: drone, hum, servo, scan, clicks.
  - Era sounds: bonk, tape start and spin-up, collar pops.
  - Card and dinner: shutter, klaxon, steam, chimes, stamp, rocket roar, neon buzz, letter clunk.
  - Slot: shockwave, glass shimmer, ratchet, crash, shatter, glissando.
  - Skyline and title: 7 plucks, siren, sign clack, ka-ching, gavel, plop, riser, snare roll, sub drop, celesta, ding.
- **Recorded (about 6):** VO, gang chant (4–6 voices), crowd "ohh", mechanical keyboard, room tone, flame whoomph.
- **From `@remotion/sfx`:** only whooshes and whips. No meme sounds.

**Music:** 8 stems (piano, orchestra, drums, 808, chip, effects, chant, VO) from one MIDI source.

---

## 7. Production order (animatic first)

1. **Lock the text** (0.5 day): apply the fixes in section 9 and resolve the doc conflicts.
2. **Scaffold and grey-box animatic** (1–1.5 days):
   - `beats.ts` exports the grid, a `f8floor` helper, and a **TEXT registry** giving each text item's in/out frames and character count.
   - A lint script asserts `0.25 + 0.05n ≤ (out − in)/24` for every must-read item.
   - Grey boxes, final type sizes, click track and temporary hits.
   - **Gate:** the lint passes, and 5 viewers from outside AI watch it cold.
3. **Music v1 and lock** (2–3 days):
   - Write the MIDI on the grid. Rough out the Tier-3 card hits first, then all four tiers.
   - Record the VO and the chant. Hand-key the word timings.
   - **Lock the structure.** No picture edits change the grid after this.
4. **Style frames and benchmarks** (1.5 days):
   - Paint 5 frames: f60, f150, f260, f474, f660.
   - Benchmark both passes with `angle-egl` and with `swangle`.
5. **Shared components** (2 days): PaletteContext, NameCard, IsoTower, Cursor, Orb, RollingDigits, RenderFront, Tableau camera, and the pattern halftone.
6. **Characters** (4–6 days): silhouette tests, then the hero Mas bust, the adult Mas rig, the 4 card characters, then the one-pose sprites.
7. **Sections, riskiest first** (about 11 days):
   - Tableau: 4 days
   - Skyline: 2.5
   - Cold open: 1.5
   - Era pre-renders: 1.5
   - Slot: 1
   - Title and bookend: 1
8. **Pass 2 and texture** (1 day).
9. **Final mix to picture and sync audit** (1 day): scrub every hit in section 8.
10. **QA** (1 day):
    - Photosensitivity: `npx remotion ffmpeg` with signalstats, allowing no more than 3 flashes in any 24-frame window.
    - Legal: parody names and logos only, no real UI or operating-system sounds.
    - Rerun the read lint and the viewer test.
11. **Other episodes:** Eps 2–11 take about 0.5–1 day each (data plus 3 props, a transition and skyline toggles). Ep12 takes about 2 days (the empty chair and walk-in, rewritten cards, the extra render of the fixed section).

**Roughly 25–32 working days for the Ep1 intro.**

---

## 8. Music cue sheet vs. shot table

| Item | Status | Fix |
|---|---|---|
| Piano F5 at f0/15/30/45/60; knee run f105/109/112/116; drop f120 | aligned | – |
| The concept text says the hook is "stretched across the cold open, one note per blink" | contradicts the cue sheet (five Fs, a D♭, then the knee run) | Reword the concept: the cold open is four Fs plus the knee run on Post |
| D♭ at f78 | off the grid, but tied to the VO | Take it from each episode's word timings (the longest pause) |
| Bonk at f150 (tuned to C) lands on the hook's G | collision | The beeper plays F F F (f120/127/135) and **pauses while the dialog is open**. The bonk is a wrong-note sting. |
| OK click at f156 | off the grid | **f165.** The beeper plays C at f165 and F at f172. Tape-start moves to f168–179. |
| Collar pops f180/f188, third collar f203 | mixed rounding | Snap to frames with floor: f187, f202 |
| Card hits f240/300/360/420 on Fm/D♭/B♭m/C; chant; A-G-I; klaxon cut at f360 | aligned | – |
| Stamp at f392 (AGREED) | repeats the stamp 58 frames later | Cut it along with the gag |
| Sonic boom at f419, then the hit at f420 | two transients 1 frame apart smear together | Fold the boom into the f420 hit's sub layer; the rocket roar ends at f419 |
| Stamp at f450 (C) | too late to read | **f435** |
| Letter clunk at f473 | missing from the cue sheet | Add it |
| Flash pop at f476 | – | Cut it (photosensitivity, and it's redundant) |
| f480 shockwave, f495–509 mute, f510 slam, f525–539 glissando | aligned | Mute with a 10 ms fade; the dry F4 and room tone on an unmuted bus |
| Zoom-blur range | build preface says f525–539, table says f525–531 | Use f525–531 |
| Plucks at f540/555/570/585 (F), f600 (G), f615 (A♭), f622 (C); final F at f630 | aligned; they spell out the hook | – |
| Celesta f660 and f690; whoosh f690 | aligned | – |
| Ding at f712 | 7 frames of ring before the hard out | **f705**, or let the tail pre-lap into Act 1 (add a 5 ms fade for loops) |
| Music-generator plan: 5000/5000/10000/6250/3750 ms | on the bar lines | Do the tape spin-up in post (it conflicts with the negative "tempo changes"); lay the hits, mute and slam with the code-built layer |
| Bible spine: "Schifrin/Holmes breakbeat and brass at bar 3" | conflicts with the opening's 1-bit tier | The opening's piano/808 fidelity tiers govern; update the bible |

---

## 9. Fixes, in priority order

**P0: before locking the animatic**

1. **Cold-open quote.**
   - Use a per-episode quote (the bible's version, which matches the user's "relevant quote"). Allow 16 syllables or fewer, 54 characters or fewer, in the f24–100 window.
   - Pre-lap the VO to f24.
   - Ep1 needs option A ("…the compute costs are eye-watering." †) or option B (a pilot-only 35.0 s cut).
   - Trim the Ep6, Ep9 and Ep10 quotes as in section 4a.
2. **Text budget.** Bring must-read text from about 1,206 to about 370 characters using the section 2 table. Everything else is an egg: 30 px or smaller, low contrast.
3. **Mas's dialog.** Subtitle `no equity.` with `age 8` in the title bar. OK click at f165. Rows become f135–167 and f168–179.
4. **2014.** Chyron `WHY COMBINATOR`. LUAP becomes a name-patch egg. Cut the 480p mini render front.
5. **Dinner caption.** Replace it with a big `2015`; the venue goes on a menu card.
6. **Mario.**
   - Subtitle `HAS CONCERNS.`, with WORD COUNT becoming the `15,000 WORDS` scroll.
   - One row: `SAFETY™ / VALUATION`. HUD: `RED-TEAMED ✓✓✓`.
   - Cut AGREED.
   - Simplify the entrance: door already opening, scroll launches on the freeze, Adelina pre-frozen.
   - The roast of Mario survives: verbosity, safety as a brand, and the vault eggs.
7. **Nole.** Stamp at f435, layered over `CO-FOUNDER.` Cut the PATIENCE/ETA row. The check's fine print reads `received $133M`, which brings back the bible's number joke.
8. **NOPE.** Show `OPEN` from f405. The sign stays up through the shockwave until f494. Cut the flashbulb and the Polaroid.
9. **Bar 9.** Seven must-read characters or fewer per beat. Rewrite all 12 episodes as in section 4b.
10. **Skyline.** Only the tower wordmarks are must-reads. Person plates become name-only eggs or are cut.
11. **Title.**
    - `MR. MAS` plus the bible's per-episode subtitle, 34 characters or fewer, landing at f640.
    - The filename becomes the Mr. Robot-style title card **after** the intro. Use the bible's `ep1.x_*.md/.wav/.jpg…` names and retire the `.ckpt` column.
    - The legal line goes to a pre-roll or the end credits, or shrinks to `a parody.`
12. **Orb toast.** Moves to the bookend as `human (probably)`, f692–719.
13. **Mas gag window.** Standardize it to f+30 through f+42 of each hold: CTRL at f270–282, marshmallow at f328–339.
14. **Halftone and misregistration** become a pass-1 pattern overlay masked to the frozen actors, never a full-frame pass-2 effect.
15. **Sequence mounts overlap at every render front.** Era2008_14 from f165; Tableau to f494; Skyline and Title to f719.
16. **Define the Tier-4 set** as the tableau plus a gloss overlay; no second set.

**P1: build**

17. Grain, weave and vignette in pass 1. Pass 2 only on the shader ranges. Remove the CPU blur-bloom. Benchmark `angle-egl`.
18. Build the 1-bit tier from SVG Bayer-pattern fills at native resolution. No numpy dither.
19. Draw every symbol glyph and heart as SVG.
20. Hand-key the word timings. Rhubarb is optional.
21. Cut the fonts from 12 to 8.
22. Apply every music fix in section 8, including the stamp at f435, the folded-in boom, OK at f165, and the ding at f705.
23. Photosensitivity: card pops at 80% white or less, the f476 flash cut, the siren at 2 revolutions/s or slower, and an automated luminance audit.
24. Add the read-time lint and the per-episode render cache (nothing per-episode between f120 and f479).

**P2: consistency and compliance (for the head writer)**

25. Update the bible's "Intro spine (fixed)" to match the opening:
    - a continuous tableau instead of the 4-panel split;
    - the 1-bit tier instead of VHS;
    - bar 9 as the per-episode slot;
    - piano/808 tiers instead of the Schifrin/Holmes groove;
    - the MAS MANALT → MR. MAS letter morph dropped.
26. **Cut the "ƧAM" mirror egg.** Its reflection spells the real first name, which the bible's rejection of the "SAM" successor gag rules out for the same reason. Pick **THE WOODROSE** over "The Rosewood" in the bible's Ep6 and Ep12.
27. Add the bible's per-episode eggs only in the sections that change per episode, all at egg size:
    - a KORG split-flap board on the zAI tower;
    - the firing tally carved into the dark-room desk;
    - a valuation ticker on NopeAI's spire.

**Documents consulted:**
- /tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/research/craft.md
- /tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/research/gaps.md