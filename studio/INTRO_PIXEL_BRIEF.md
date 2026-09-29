# MR. MAS: Intro Pixel Brief (v2, 2026-09-25)

## Decision (showrunner)
- **The primary look is pixel art**, in the adventure-game structure built in `src/dev/pixeladv`: native 480×270 canvas, 4× nearest-neighbour upscale, indexed palettes, hand-built light ramps.
- **Glyph is for dark foreshadowing**: moments where the machine is watching, or the future is leaking in. Its placement is chosen for tone and comic timing.
- **Other switches are rare and motivated**:
  - 1-bit for the 1993 era
  - an early-web low-colour palette for 2008–14
  - "ledger" for money
  - "terminal" for the machine's point of view
- **Never corny.** No gratuitous glitch spam, no meme sounds, no winking UI jokes that stop the rhythm. A switch must be over before the viewer can think "effect."
- **The title sequence should exercise a few style changes**, all motivated by story. Proposed switch plan below.
- Timing stays on the 96 BPM / 24 fps grid: 15 frames per beat, 60 per bar, 720 frames = 30.0 s. See `src/shared/timing.ts`. Shot-by-shot source: `../show/_sources/design/final.md` §3.

## Intro, pixel edition: moments and style switches

| Time | Frames | Moment | Style | Why this style |
|---|---|---|---|---|
| 0–5 s | 0–119 | **Cold open.** Dark room, Mas at his desk in 3/4 front, lit by the monitor. The Orb floats at his shoulder. He types, then posts "near the singularity; unclear which side." | BASE pixel | The show's home look. |
| inside 3.75–4.4 s | 99–104 | **Orb scan.** Inside the scan beam's cone only, the room is revealed for 5 frames as an endless data-center cathedral rendered in **GLYPH** (tokens). Outside the cone, the room stays BASE. | GLYPH, masked | Foreshadowing: the machine sees what the room really is. |
| 5–7 s | 120–167 | **1993.** Kid Mas (8) at a beige computer with no logo; the screen faces away from us. The world freezes into a **1-bit** alert dialog: `MAS MANALT / no equity.`, with Cancel greyed out. | 1-BIT | Era-true (early Mac). |
| 7–10 s | 168–239 | **Render front.** A glowing scanline sweeps the frame and upgrades the palette: 1-bit → **early-web 16-colour** for 2008 (TPOOL stage, two popped collars) and 2014 (WHY COMBINATOR crown, throne of laptops). | EARLY-WEB palette | The palette literally scales with the era. |
| 10–20 s | 240–479 | **THE WOODROSE founding dinner** in full BASE pixel. Each founder's entrance freezes into a name card: GERG, ALYI, MARIO, NOLE. While a card holds, the frozen world remaps to a 2-tone palette; **Mas stays in full colour and keeps moving**. Ends with Mas sliding the neon N: OPEN → NOPE. | BASE + 2-tone freeze remap | Name cards come from the portrait-window convention of adventure games. |
| optional, ≤ 6 frames | inside the Nole card | The novelty check `$1,000,000,000*` flashes in **LEDGER** (`received: $133M`). | LEDGER | Money. Use it only if it doesn't clutter. |
| 20–22.5 s | 480–539 | **Per-episode slot (Ep1).** The CHATGTP button: the palette blooms brighter. **FIRED.** Mas's video-call tile dissolves into **GLYPH tokens** and blows away. **BACK.** The tile re-renders in BASE, and a heart avalanche carries the camera up. | BASE → GLYPH dissolve → BASE | Foreshadowing: people become tokens. Played for comic timing. |
| 22.5–26.25 s | 540–629 | **Skyline at dusk**, pixel isometric. One tower pops per beat: NOPEAI data-center cathedral, MACROSOFT, ELGOOG/MINDDEEP, ATEM, INVIDIA, MISANTHROPIC, zAI, PEEKDEEP. The rooftops then ignite into one cyan line. | BASE | — |
| 26.25–30 s | 630–719 | **Title: MR. MAS**, with the Orb as the period. Pull back into Mas's monitor. On the last beat the Orb's iris shows the skyline for **2 frames in GLYPH** before settling. | BASE + 2-frame GLYPH in the iris | The last whisper of foreshadowing. |

## REVISION v2.1 (2026-09-25): no spoilers; add a roll call
**Showrunner note:** the intro must feel like an intro, not a recap. The old bar 9 showed Ep1's climax (fired, then rehired). It's cut from the intro; that beat now lives only in Ep1.

**New bar 9 (f480–539, 20.0–22.5 s): "THE PLAYERS" roll call.** This adapts the sitcom roll call and the anime rival-lineup and mystery-silhouette tropes.
- 8 pixel portrait flashes, one per eighth note (7–8 frames each, cut on the eighth). Each has one signature action frame and a faction colour behind it.
- No names needed. Tiny name plates are optional easter eggs.
- The 8 flashes play the knee motif F F F F G A♭ C F:

  | # | Note | Character | Action |
  |---|---|---|---|
  | 1 | F | TASYA | jangles a giant key ring |
  | 2 | F | RADNUS | polite smile under a spinning code-red siren |
  | 3 | F | KRAM | offers a soup thermos with a check floating in it |
  | 4 | F | NESNEJ | leather jacket, tosses a GPU |
  | 5 | G | RIMA TAMURI | steps into a spotlight |
  | 6 | A♭ | THE WHALE | breaches |
  | 7 | C | RUMPT | **silhouette only**, at a gold podium, pointing (mystery-figure trope) |
  | 8 | F (octave) | *(unnamed)* | a portrait window holding only a **blinking cursor in GLYPH**: the player who doesn't exist yet |

- Flashes 1–4 are the flat part of the curve (incumbents). Flashes 5–8 are the rising leap (wildcards, power, the future).
- **Music:** the eight flashes are eight stabs, brass section doubled by chip lead. No "music fired" mute any more.

**Bars 10–11.2 (skyline)** now read as the anime "everyone on the rooftops" group shot: the characters from the roll call stand on their towers.

**Per-episode changes are spoiler-safe.** Only these change:
- the cold-open quote
- skyline state, reflecting only events already aired
- the title subtitle gag
- one couch gag (e.g. what Mas pockets at the dinner)
- the roll call as characters debut: RUMPT's silhouette fills in from Ep3; the cursor portrait slowly gains a face over the season.

**Nothing in the intro may reveal the current episode's plot.**

## Cast (parody names only)
- **MAS MANALT:** grey hoodie, calm unblinking eyes, forward cowlick, tiny closed smile, slight frame.
- **GERG MOCKBRAN:** coder, keycaps popping.
- **ALYI:** mystic; server cathedral, "feel the AGI."
- **MARIO:** curls, glasses, fleece; never red, nothing Nintendo.
- **NOLE:** tall, square jaw, swept hair, black tee, phone, SPACEZ booster.
- Skyline bosses are tiny rooftop sprites: TASYA (keys), RADNUS, SIMED, KRAM, NESNEJ (leather jacket), tiny MARIO and ADELINA, NOLE.

**Name-card text** (from the approved package):
- `GERG MOCKBRAN / ORG CHART: HIM.`
- `ALYI / FEELS THE AGI.`
- `MARIO / HAS CONCERNS. HAS GPUS.`
- `NOLE / NAMED IT.` with the stamp `SUED OVER IT.`
- Mas's 1993 dialog: `MAS MANALT / no equity.`

## Quality bar
- `out/lookdev/structures/pixeladv/key.png` and its portraits are the reference for colour and light.
- Hand-placed pixel clusters on faces; no noisy dither on skin.
- Whole-pixel motion only: no sub-pixel drift, no rotating or scaling sprites.
- Every simplification must read as the genre.
