# Mr. Mas: craft and production research for the 30s intro (as of 2026-09-24)

Scope: Part A covers title-sequence references, Part B covers building a code-only animation pipeline on this machine, and Part C covers music, sound effects, voice and US parody law. This is not a timeline of events. Anything marked **[UNVERIFIED]** or "(est.)" is from memory or an estimate and was not confirmed this session. The web-search budget ran out partway through, so some later items rely on WebFetch or on local `npm view` / `pip index` / system checks, all run today.

## Short answer

- **Stack:** Use **Remotion 4.0.528** as the backbone (React, SVG cut-out characters, timeline, audio sync, encoding). It is free for an individual, works on the installed Node 18.19.1, and ships its own ffmpeg and Chrome Headless Shell. Upgrading to Node 22 LTS through nvm is optional.
- **Audio:** Write music and sound effects in a **Python virtualenv**: numpy, scipy, Spotify's `pedalboard`, `pretty_midi`, and `tinysoundfont` or a VST3 synth. Use CC0 or public-domain samples (Salamander piano, VSCO 2 CE). A licensed stock track (Epidemic) or ElevenLabs Music with a composition plan is the fallback.
- **Voice:** Get a human performance of the cold-open line, or a synthetic voice designed from a text prompt. **Never clone the real person's voice.**
- **Structure to borrow:**
  - Cold open: Social Network or Severance mood (lone piano over a drone).
  - Childhood flashback: Succession home-video texture.
  - Recap: Veep news headlines.
  - Character intros: Snatch, Borderlands and Scott Pilgrim freeze-frame name cards with a joke subtitle.
  - Title card: Silicon Valley's skyline of logos that changes each episode.
  - One visual thread tying the shots together, as in Halt and Catch Fire.
  - Something that changes every episode, as with the Simpsons chalkboard or Rick and Morty's season clips.

---

## Part A: title sequence references

The "Parody hook" line in each entry is what to borrow for Mr. Mas. Cut rates are estimates unless a source is cited.

### 1. Succession (HBO, 2018–23): the key reference for the childhood section
- **Credits:** Picture Mill designed it. Nicholas Britell wrote the theme; the album version runs 1:42. On air it runs about 1:10–1:30 (est.).
- **Structure:** Grainy home-video clips of blank-faced children, cut against the Manhattan skyline, mahogany boardrooms and news footage of the patriarch. Picture Mill shot new footage in one day in Santa Monica and made it look like archive.
- **Pace:** Slow, about 0.5–1 cut/s (est.). Edits land on the piano motif.
- **Music:** Slightly off-kilter classical piano, then Roland TR-808 hip-hop beats, strings and brass. Posh against brash.
- **Why it works:** Innocent family-album footage becomes a dynasty. The music's class contrast (conservatory piano against an 808) says "rich people fighting over an empire" without a word.
- **Lessons:** Treat the childhood section as fake home video: a 4:3 pillarbox, a VHS date stamp, color bleed and tracking lines. Hold the piano alone through the cold open and bring the 808 in on the cut to the YC era.
- **Parody hook:** "Succession-core" is instantly recognizable in tech circles. Write an original theme in that style; never copy the melody (see Part C.6).

### 2. Silicon Valley (HBO, 2014–19): the key reference for the title card and rivals
- **Credits:** yU+co (creative director Garson Yu; director/designer Mehmet Kizilay). Theme: "Stretch Your Face" by Tobacco, a lo-fi, glitchy electronic track.
- **Structure:** Isometric, SimCity-like time-lapse CG. The camera drifts across a Bay Area of office buildings wearing tech logos. Startups "start up, expand, collapse, and quickly get supplanted." About 30s (est.).
- **Pace:** Nearly one continuous camera move with few cuts, but a logo pops, grows or crashes roughly every 0.5s (est.). A drone delivering champagne in one season delivers pizza in the next.
- **Why it works:** The logos change every season to track the real industry. Viewers freeze-frame to hunt Easter eggs. The template was designed to keep expanding.
- **Lessons:** End the Mr. Mas intro on a skyline of parody AI-lab logos and update it every episode. The season's story (rival towers going up, data centers appearing, a lab rebranding) then plays out in the background. This rewards AI insiders who rewatch.

### 3. Halt and Catch Fire (AMC, 2014): a lesson in keeping 30s simple
- **Credits:** Elastic, creative direction by Antibody, directed by Patrick Clair, music by Trentemøller. Nominated for a 2015 main-title Emmy.
- **Length and structure:** Exactly 30s. A white signal flows through a red-magenta void of pixels and machine code into geometric forms, ending on an LED lighting up. Cast faces appear as "glitchy approximations," made with a "very simple Photoshop process."
- **Designers' rule:** "With only 30 seconds, it's very important to not over-complicate the message." One continuous flowing signal carries the eye from shot to shot.
- **Music:** Synths somewhere between modern electronica and retro analog.
- **Lessons:** Give the whole flashback montage one connecting thread: a glowing cursor, a token stream, or a rising loss or scaling curve that carries the eye from childhood to YC to OpenAI to the rivals. Pixelated or dithered "digitized" faces are cheap and stylish in code.

### 4. The Social Network (2010): the tone for the cold open
- Mark walks across Harvard at night after the breakup scene while the titles appear. The music is Reznor and Ross's "Hand Covers Bruise": a few simple piano notes over a buzzing drone. Fincher had planned to use Elvis Costello's "Beyond Belief" but switched when he heard it. The claim that the title font is Facebook's font is **[UNVERIFIED]**.
- **Pace:** Long takes, about 0.2–0.3 cuts/s (est.). Rapid dialogue drops into lonely silence.
- **Lessons:** Seconds 0–5 of Mr. Mas: a dark room, monitor glow, a single high piano line over a low drone, then the quote. This is the founder-myth film; the AI audience will read it at once.

### 5. Archer (FX, 2009–23)
- **Credits:** Designed by Neal Holman as a homage to Saul Bass's 1960s cut-out style. Theme by Scott Sims and Mel Young (surf-spy); JG Thirlwell joined from season 7.
- **Structure:** A bouncing white dot from Archer's gun links vignettes. Each cast member is introduced as a silhouette whose short animation tells you their personality. About 30s (est.).
- **Lessons:** Two-color silhouettes and a single moving dot are about the easiest premium look to build with SVG. Each character can be introduced in a 1–2s vignette.

### 6. Arrested Development (Fox/Netflix)
- **Credits:** Theme by David Schwartz (a light ukulele and whistle feel); narrated by Ron Howard: "Now the story of a wealthy family who lost everything, and the one son who had no choice but to keep them all together. It's Arrested Development." The wording is from memory but high confidence.
- **Visuals:** Family-snapshot and home-video style. The exact shots are **[UNVERIFIED]**. About 30s (est.).
- **Lessons:** A one-sentence narrated premise is a strong alternative or add-on to the cold-open quote ("Now the story of a nonprofit…").

### 7. Mad Men (AMC, 2007–15)
- **Credits:** Imaginary Forces (Steve Fuller, Mark Gardner), in homage to Saul Bass (*North by Northwest*, the *Vertigo* poster). Music: an instrumental of RJD2's "A Beautiful Mine." The designers said it couldn't be done in under 30s; it ended at about 38–40s.
- **Structure:** A silhouetted man walks into an office that dissolves, then falls past skyscrapers covered in ads, and ends reclining on a couch with a cigarette. Few cuts.
- **Lessons:** "Falls, then lands reclining" is exactly Episode 1: fired, then rehired. Replace the ads he falls past with AI hype billboards. BoJack already parodied this fall, so the audience knows it as a parody target.

### 8. House of Cards (Netflix, 2013–18)
- **Credits:** A 90s time-lapse of Washington DC with no people in it. Shot by Andrew (Drew) Geraci's District 7 Media, edited by Elastic, music by Jeff Beal (brooding brass). About 0.5 cuts/s (est.).
- **Lessons:** Use 2–3s of time-lapse for "the rise": a San Francisco skyline or a data center going up at dusk. Procedural sky gradients and window lights are cheap in code.

### 9. The Simpsons (Fox, 1989–)
- Matt Groening made the long opening to cut animation costs, then added the chalkboard and couch gags (plus Lisa's sax solo) so each episode still had something new. Couch gags stretch or shrink to fill airtime. Danny Elfman theme.
- **Lessons:** Keep the structure fixed and swap one slot each episode: a different cold-open quote, a different title-card gag, a different subtitle. It is cheap novelty and a recurring gag in one.

### 10. Futurama
- A new joke caption under the logo every episode (e.g., "Presented in Hypno-Vision"). Details **[UNVERIFIED]**.
- **Lessons:** Add a subtitle line under "MR. MAS" that changes each episode.

### 11. Rick and Morty (Adult Swim)
- **Credits:** Theme by Ryan Elder, about 35s.
- **Structure:** A montage of clips from the coming season mixed with gags made only for the intro. It changes each season except the first and last shots.
- **Pace:** About 1–1.5 cuts/s (est.).
- **Lessons:** Tease the season's arc in the montage: rival lawsuits, the lab split, the data-center buildout, the recursive self-improvement (RSI) endgame. Add fake scenes made only for the intro. Keep the first shot and the last card the same across the season.

### 12. BoJack Horseman (Netflix, 2014–20)
- **Credits:** Theme by Patrick Carney with his uncle Ralph Carney: a Jupiter-4 arpeggio, drums and tenor sax. About 40–45s (est.).
- **Structure:** BoJack stays fixed in frame, deadpan and drinking, while the world scrolls past behind him: bedroom, kitchen, paparazzi, film set, party. It ends with a Mad Men-style fall into a pool, and it changes subtly by season and episode to foreshadow.
- **Lessons:** Very cheap in code: one character pose plus looping parallax backgrounds. A calm, unchanging Mr. Mas drifting through eras (childhood bedroom → YC → OpenAI → Senate hearing → Zoom call where he is fired → back in the office) is a strong montage device with little animation.

### 13. Veep (HBO, 2012–19)
- The opening recaps the backstory as mock news headlines ("Meyer aims higher," "Selina suspends campaign," "Selina Meyer: The New No. 2") and is updated as the story moves on.
- **Lessons:** The fastest readable way to recap real events. Use parody tech-press headlines and chyrons, e.g. "MANALT OUT" followed by "MANALT BACK" within about 1s. Readers need roughly 0.8–1.2s per short headline (est.).

### 14. Snatch (2000) and Lock, Stock and Two Smoking Barrels: the main model for name cards
- **Credits:** Title design by FAQ (Stuart Hilton and Ian Cross).
- **Look:** Each character is frozen mid-action on a posterized frame. The name is set in heavy bold gothic type from boxing posters, hand-redrawn and kerned by eye so it looks imperfect. Colors are slightly desaturated, with paper texture, slight misregistration, tears and creases.
- **Move:** Ritchie asked for "a subtle snappy punching-in on each one as it appears"; they settled on a 2- or 3-frame mix.
- **Timing:** The freezes were cut to the music with an editor, and the music never changed afterward.
- **Lessons:** Freeze on a musical hit, dissolve over 2–3 frames into the poster-style card, hold for about 1–1.5s, then whip out. Each freeze pose should say something about the character.

### 15. Trainspotting (1996)
- The "Choose life" voiceover runs over Iggy Pop's "Lust for Life" while freeze-frames name each character (Renton, Spud, Sick Boy, Tommy, Begbie). From memory, high confidence.
- **Lessons:** The cold-open quote could continue as voiceover into the first freeze cards, like a manifesto.

### 16. Scott Pilgrim vs. the World (2010, Edgar Wright)
- Comic-style captions give name, trait and age as characters arrive; the film also uses game UI and onomatopoeia. The exact card wording is **[UNVERIFIED]**.
- **Lessons:** The format "NAME, joke description, stat" suits AI people well. Present benchmark-style stats as game stat bars (e.g., "Compute: ████░").

### 17. Borderlands games (2009–) and Tales from the Borderlands
- Every relevant character gets a freeze-frame intro card: a big stylized name plus a short witty subtitle, often shown in a slow-motion freeze first.
- **Look:** Cel-shaded ink outlines, flat color, halftone. Very buildable in SVG.
- **Lessons:** The joke goes in the subtitle, not the name. Example formats built from public personas: "MAS MANALT, Just a Humble Nonprofit Guy"; "ALYI, Feels the AGI"; "NOLE, Co-Founder, Future Co-Plaintiff"; "MARIO, Left to Build the Safe One."

### 18. Suicide Squad (2016) and Birds of Prey (2020)
- Dossier-style intro cards with stats and graffiti or handwritten scribbles. Designer credits **[UNVERIFIED]**.
- **Lessons:** A "threat assessment" layout: Threat level, Compute, Lawsuits pending.

### 19. Deadpool (2016)
- The camera flies through a frozen car-crash tableau while joke credits appear instead of names ("Starring God's Perfect Idiot," "A Hot Chick," "A British Villain," "The Comic Relief," "Directed by An Overpaid Tool") to "Angel of the Morning."
- **Lessons:** Joke credits by character type are a strong parody device: "A Billionaire Who Posts," "The Safety Guy," "The Quiet Genius," "Someone's Wallet." A camera move through a frozen layered tableau is 2.5D parallax, which is cheap in code.

### 20. Catch Me If You Can (2002)
- **Credits:** Kuntzel+Deygas for Nexus. John Williams' jazzy theme is from memory.
- **Look:** Hand-carved rubber-stamp cut-out figures, deliberately imprecise, scanned over CG backgrounds, inspired by Saul Bass and Paul Rand. The palette changes with each location.
- **Lessons:** The clearest proof that flat, limited-palette cut-out 2D can look premium. Give each era its own palette: warm Kodachrome for childhood, orange and cream for YC, cool teal for OpenAI, red for the rivals.

### 21. Mr. Robot (USA, 2015–19)
- No conventional opening. A freeze-frame of a strong image, a music sting and a splash of red type make the title card, often dropped in mid-episode. Episode titles are filenames ("eps1.0_hellofriend.mov").
- **Lessons:** Hard-cut the title in over a frozen frame. Name episodes like files, e.g. "ep1.0_research_preview.md."

### 22. Severance (Apple TV+, 2022–)
- **Credits:** Oliver Latta (Extraweg), typography by Teddy Blanks, music by Theodore Shapiro. Won the main-title Emmy.
- **Look:** Surreal 3D digi-double of Adam Scott, deformed and duplicated.
- **Lessons:** An anxious piano ostinato carries dread cheaply. The surreal organic 3D can't be matched in code at that quality, so don't try.

### 23. Game of Thrones (HBO)
- **Credits:** Elastic (Angus Wall), theme by Ramin Djawadi. About 1:40 (est., from memory).
- **Structure:** A clockwork map where cities rise, and the map changes to show where each episode takes place.
- **Parody hook:** A clockwork map of AI kingdoms (SF, Redmond, London, Austin, Beijing) with data centers rising like castles. Good for the "war with competitors" beat.

### 24. Tiger King (Netflix, 2020)
- A docuseries whose bold chyrons introduce outrageous characters. The intro music credit is **[UNVERIFIED]**.
- **Lessons:** Reality-TV lower-thirds with over-the-top self-descriptions.

### What this means for a 30s intro
1. **One idea and one connecting thread** (Halt and Catch Fire). Too many ideas in 30s reads as amateur.
2. **Cut to the music and lock the music early** (Snatch). Name cards land on downbeats. Build and edit to a fixed beat grid.
3. **Contrast in pace:** a slow cold open (0.2 cuts/s), a fast montage (about 1–1.5 cuts/s, like Rick and Morty), then a held title card for 2–3s.
4. **Name cards:** a freeze on the hit, a 2–3 frame punch-in, a hold of 1–1.5s (1.8s if the subtitle needs reading), then a 4–6 frame whip out. Limit it to 4–5 named characters. More than that and nobody can read them.
5. **Headlines are the fastest way to recap real events** (Veep). Keep each to about 3–5 words.
6. **One slot that changes every episode** (Simpsons, Futurama, Rick and Morty, BoJack, Silicon Valley): the quote, the subtitle, and the skyline logos.
7. **Pack in Easter eggs** for the AI audience (Silicon Valley): tiny benchmark numbers, commit hashes, parody logos.
8. **Frame-accurate timing grid.**
   - At 24 fps: frames per beat = 1440 / BPM. 96 BPM gives exactly 15 frames per beat, 60 frames (2.5s) per bar, and 12 bars in 30s.
     - Suggested split: cold open 2 bars (5s), montage 7 bars (17.5s), title 3 bars (7.5s).
     - 120 BPM gives 12 frames per beat and 15 two-second bars.
   - At 30 fps: frames per beat = 1800 / BPM. 120, 100 and 90 BPM all give whole numbers.

---

## Part B: building it with code on this machine

### B.0 Machine check (run locally today, read-only)
- **System:** Ubuntu 24.04.4. CPU: Intel Core Ultra 7 255U, 14 threads. This is a U-series laptop chip, so expect throttling on long renders.
- **GPU:** No discrete GPU, but there is an **Intel Arrow Lake integrated GPU** with the Mesa `iris` driver and `/dev/dri/renderD128`, which the user can access through an ACL. Hardware WebGL through Chrome's ANGLE/EGL may therefore work. Test it; don't assume it.
- **Memory:** 30 GB RAM, but **only about 9 GB was free** at check time (21 GB in use). That caps render concurrency.
- **Disk:** **Only about 30 GB free** (the drive is 93% full). Be careful with PNG frame sequences and sample libraries.
- **Chrome libraries:** All the shared libraries Chrome Headless Shell needs are already present (nss3, atk, gbm, cups, xkbcommon, asound, and so on).
- **Node and Python:**
  - Node v18.19.1 and npm 9.2.0. No nvm, uv or pipx.
  - Python 3.12.3 with Pillow 10.2 and pycairo 1.25.1. **numpy is not installed.** System Python is marked externally managed (PEP 668), so use a `python3 -m venv` (venv works).
- **Missing tools:** No ffmpeg, chromium, blender, fluidsynth, sox, inkscape or rsvg. 663 system fonts are installed.

### B.1 Tool comparison (versions checked on npm and PyPI today)

**Remotion 4.0.528** (published 2026-09-24)
- **License:** The free license covers an individual, a for-profit with 3 or fewer employees, or a nonprofit. Commercial use and monetization are allowed with no key or sign-up. A company license ($25/seat/month, or $0.01 per render with a $100 minimum) is only for 4+ people.
- **Planned for v5 (not released):** contractors will count toward headcount; company licensees must enable telemetry; the default `--gl` changes to `angle`.
- **Node:** Docs say at least 16. Dependencies need at least 18.12 (esbuild 0.28 needs 18+; rspack 1.7.11 and css-loader 7 need 18.12+). **Works on the installed 18.19.1.**
- **Bundled parts:** A Rust compositor (`@remotion/compositor-linux-x64-gnu`, about 27 MB) that includes ffmpeg, so no system ffmpeg is needed. Chrome Headless Shell downloads itself into `node_modules/.remotion/`; it was pinned to Chrome 149 as of 4.0.452. A `--chrome-mode=chrome-for-testing` option is for GPU use.
- **Add-on packages (all 4.0.528):**
  - Media and 3D: `@remotion/three`, `@remotion/lottie`, `@remotion/rive`, `@remotion/skia`, `@remotion/media`.
  - Motion and layout: `@remotion/transitions`, `@remotion/motion-blur`, `@remotion/paths`, `@remotion/noise`, `@remotion/shapes`, `@remotion/layout-utils`.
  - Assets: `@remotion/google-fonts`, **`@remotion/effects`**, **`@remotion/sfx`**.
- **Fit: best.** Frame-deterministic React, a live preview Studio, easy audio sync, and a scriptable command line an agent can drive.

**Motion Canvas (@motion-canvas/core 3.17.2)**
- MIT. Last npm publish **2025-02-16**, so maintenance has slowed. Uses Vite 4/5. Animations are written as generator functions on a Canvas2D renderer, and the editor shows the audio waveform. The ffmpeg exporter bundles its own ffmpeg. Rendering is driven from the editor UI.
- **Fit: good for hand-made vector motion, weak for an agent** (no headless render command in core).

**Revideo (@revideo/core 0.11.0)**
- MIT fork of Motion Canvas, published 2026-07-10. Adds headless rendering and an API. Smaller community (about 3K weekly downloads in March 2026).
- **Needs Node ≥22.12**, because it depends on puppeteer ^25.3 and vite ^8.1.2 (which needs Node ^20.19 or ≥22.12).
- A small MIT fork, "fantoche," aims at "vector character explains something"; maturity **[UNVERIFIED]**.
- **Fit: second choice.** Requires a Node upgrade.

**Theatre.js (@theatre/core 0.7.2)**
- Last publish May 2024. Version 1.0 is being developed in a private repository. Core is Apache-2.0; the Studio editor is AGPL (license split **[UNVERIFIED]**). It is a keyframe editor meant for humans.
- **Fit: skip.**

**GSAP 3.15.0**
- Completely free, including the former paid plugins (SplitText, MorphSVG, DrawSVG, and so on), since 3.13 in April 2025 after Webflow bought GreenSock in October 2024. It uses a "standard no-charge license," which is not an OSI open-source license.
- **Fit: optional inside Remotion.** Drive `timeline.seek(frame/fps)` from `useCurrentFrame()`. MorphSVG helps with mouth-shape morphs. Using GSAP on its own with Puppeteer or Playwright screen capture means building a render pipeline by hand, plus ffmpeg. Puppeteer 25.12 needs Node ≥22.12 and Playwright 1.63 needs Node ≥20.

**Three.js 0.186 and React Three Fiber 9.8.1 inside Remotion**
- `@remotion/three` needs three ≥0.137 and R3F ≥8. R3F 9 needs React 19 (below 19.4); current React is 19.3.
- WebGL is slow without a GPU: Remotion recommends `--gl=swangle` there, and "rendering might be slow." Also try `--gl=angle-egl` with chrome-for-testing on the integrated GPU.
- **Fit: use sparingly** for 3D logos or a data-center flyover.

**Lottie (lottie-web 5.13.0, May 2025)**
- `@remotion/lottie` supports it. Authoring needs After Effects with Bodymovin or the LottieFiles editor. Hand-writing the JSON is painful.
- **Fit: only to bring in assets.**

**Rive (@rive-app/canvas 2.43.1, runtime MIT)**
- The editor is a proprietary GUI. Exporting `.riv` files moved to paid plans (Cadet is $9/seat/month); the exact date is **[UNVERIFIED]**. It is the best tool for rigged 2D characters with state machines, and `@remotion/rive` exists.
- **Fit: only if the user builds the character rigs in Rive.**

**Manim Community 0.21.0**
- Python. Since 0.19 it uses PyAV, which bundles ffmpeg, so no system ffmpeg is needed. Renders with Cairo on the CPU. Excellent for math and charts, weak for characters and film texture.
- **Fit: optional for a scaling-law or loss-curve insert.**

**Blender 5.2 LTS**
- Released 2026-07-14, supported to July 2028. Grease Pencil gets a new Delaunay fill algorithm. Scriptable with bpy. Cycles renders on CPU but slowly; EEVEE needs OpenGL, which would mean the integrated GPU. Blender includes its own ffmpeg. It is a large download (about 400 MB **[UNVERIFIED]**), and authoring blind is hard for an agent.
- **Fit: only for specific 3D shots**, rendered to PNG sequences and imported into Remotion.

**Recommended stack**
1. **Remotion 4.0.528 with React 19 and TypeScript**, starting from a blank `create-video` template. Node 18.19.1 works. Optionally run `nvm install 22` at user level, no sudo: Node 18 reached end of life in April 2025, and Revideo, puppeteer, and `node-web-audio-api` all need Node ≥22.
2. **Characters:** SVG React components with props for pose and expression. Use `@remotion/paths` or flubber 0.4.2 for morphs, `spring()` for overshoot, and `@remotion/noise` for idle movement. GSAP is optional.
3. **Film texture in two passes:**
   - Pass 1 renders the clean SVG/CSS animation.
   - Pass 2 is a composition that loads pass 1 as a `<Video>` and applies `@remotion/effects`.
   - The package (checked by unpacking it) contains WebGL2 shaders including chromatic-aberration, noise, speckle, white-noise, scanlines, light-leak, vignette, barrel-distortion, lut, paper, halftone, tear, tv-signal-off, glow, zoom-blur, levels, duotone and pixelate.
   - Effects attach through an `effects={[...]}` prop on canvas-type components (`<Video>`, `<Img>`, `<Solid>`, `<CanvasImage>`), not on arbitrary SVG. That is why two passes are needed.
4. **Audio:** A Python venv with numpy, scipy, soundfile, pedalboard 0.9.25, mido or pretty_midi, and tinysoundfont 0.3.7. It writes stems and a master WAV, which Remotion's `<Audio>` mixes with volume curves.
5. **Optional installs, with approval:** apt ffmpeg (for convenient format conversion), Rhubarb Lip Sync (MIT, a command-line tool), Surge XT (a GPL VST3 synth), and Blender 5.2.

**Render time (estimates, unverified; benchmark with `npx remotion benchmark`)**
- 30s at 24 fps is 720 frames; at 30 fps it is 900. SVG and CSS scenes at `--concurrency` of 6–8 (limited by free RAM): roughly 3–15 frames/s, so about 1–5 minutes.
- Pass 2 with WebGL effects under SwiftShader: roughly 0.5–3 frames/s, so about 5–25 minutes. The integrated GPU may be much faster.
- `@remotion/motion-blur` multiplies cost by the number of samples. Use it only on whip-pans.
- Remotion's docs note that box-shadow, text-shadow, gradients, blur and drop-shadow filters all run slowly without a GPU. Pre-render such textures once with Pillow.

### B.2 Building caricature characters as layered SVG cut-outs
- **Layers:**
  - `root → hips → torso (breathing) → neck → head → {hair back, face, ears, brows L/R, eyes L/R (white, pupil clipped to the white, eyelid mask), nose, mouth set, hair front}`.
  - Arms as `shoulder → upper arm → elbow → forearm → hand`, rotated at each joint.
  - Hands are swapped drawings (point, fist, open, holding a phone), not deformed.
  - Every group rotates around a named pivot: `translate(p) rotate(θ) translate(-p)`, or `transform-box: fill-box`.
- **Views:** Draw front, three-quarter and profile as separate drawings and swap them on a cut or a smear frame, the classic cut-out approach. Don't attempt 3D head turns.
- **Blinks:** Seeded `random()` every 2–5s. A blink is 4–6 frames (open, half, closed, half, open), with occasional double blinks. Eye darts snap in 1–2 frames and hold.
- **Squash and stretch:** Keep volume constant with `sx = 1/√sy` around the ground-contact point. Anticipation, action, overshoot and settle come from `spring({damping, mass, stiffness})`. Hair, tie or hoodie strings follow with a delayed spring on the parent's rotation. Idle breathing is 1–2% vertical scale at about 0.25 Hz.
- **Hand-made feel:** Change character poses on twos (12 poses/s) while the camera moves on ones. Add 2-frame smear shapes and speed lines on whips. Optional line boil: an `feTurbulence` plus `feDisplacementMap` on strokes, with the seed changing every 2–3 frames. It is CPU-rasterized, so limit it to character layers.
- **Lip sync:** Rhubarb Lip Sync (MIT, command-line) reads a WAV and outputs JSON, TSV or XML mouth-shape cues. `--dialogFile` takes the script text to improve accuracy. Shapes:
  - Six basic shapes in the Hanna-Barbera tradition: A (M/B/P closed), B (slightly open, teeth), C (open "EH"), D (wide "AA"), E (rounded "AO/ER"), F (puckered "OO/W").
  - Optional extras: G (F/V, teeth on lip), H (L, tongue up), X (rest).
  - Map each to a replacement mouth drawing. Latest version and Linux binary are **[UNVERIFIED]** but have historically been provided.
- **Caricature design:**
  - Exaggerate 1–2 signature features per person.
  - Silhouette test: filled solid black, the character should still be recognizable.
  - Shape language: circles read as friendly or earnest, squares as solid, triangles as menacing.
  - Consistent line weight, e.g. about 6 px outer and 3 px inner at 1080p.
  - A 3–5 color palette per character and one signature prop each.
  - Build the caricature from public persona and conduct, not from protected traits or private life.
  - If the user draws characters in Inkscape, Figma or Illustrator with named groups, convert them to React with SVGR.

### B.3 Film textures in code, from cheapest to most expensive on CPU
- **Grain:** Pre-render 8–16 tileable noise PNGs with Pillow and cycle one per frame at 4–8% opacity with an `overlay` or `soft-light` blend. Very cheap. Or use the `noise`/`speckle` effect in pass 2.
- **Gate weave and flicker:** ±0.5 px seeded random translation per frame and ±2% brightness. Nearly free.
- **Vignette:** A radial-gradient overlay (pre-rendered to PNG), or the `vignette` effect.
- **Home video / VHS (childhood section):**
  - 4:3 pillarbox with slightly soft edges.
  - Date stamp in VT323 ("PLAY ▶  JUN 14 1994  4:12PM").
  - Scanlines via a repeating-linear-gradient.
  - Tracking band: a clip-path strip offset horizontally with a noise band.
  - Chroma bleed: a slightly offset, blurred red-channel copy.
  - Head-switching noise along the bottom 8 px.
  - Short tape-wobble bursts.
  - Or use `scanlines`, `tv-signal-off`, `tear` and `wave` in pass 2.
- **Chromatic aberration:** Cheap on text only (RGB offset `text-shadow` on name cards). Full-frame, use the `chromatic-aberration` effect in pass 2.
- **Light leaks:** Large animated radial gradients with a `screen` blend (cheap), or the `lightLeak({seed, hueShift, progress})` effect.
- **CRT for the cold-open monitor:** `barrel-distortion`, `scanlines` and `glow` on the monitor insert only. Add phosphor glow with a blurred duplicate.
- **Paper and poster (Snatch cards):** The `paper`, `halftone` and `roughen-edges` effects, or pre-baked paper PNGs with a `multiply` blend, plus 1–2 px color misregistration.
- **Color grade per era:** The `lut`, `levels`, `duotone` and `color-correction` effects in pass 2.

### B.4 Fonts for name cards
All of these are confirmed present in `@remotion/google-fonts` 4.0.528 (1,854 families) and are mostly under the SIL Open Font License. That package loads fonts from Google at render time; for offline builds use `@fontsource/*` or local files.

| Style | Fonts |
|---|---|
| Snatch / boxing poster | Anton, League Gothic, Bebas Neue, Alfa Slab One, Ultra, Rye, Staatliches |
| Borderlands / comic ink | Bangers, Luckiest Guy; Permanent Marker or Rock Salt for subtitles (thick stroke with `paint-order: stroke`) |
| Scott Pilgrim / game UI | Press Start 2P, Silkscreen, Micro 5, Sixtyfour, Doto, VT323 |
| Succession / prestige | Cormorant Garamond, EB Garamond, Libre Caslon Text, Playfair Display, Instrument Serif, Bodoni Moda |
| Tech / terminal (quote, filenames) | JetBrains Mono, IBM Plex Mono, Geist Mono, Space Grotesk, Inter, Geist, Share Tech Mono |
| 1960s Saul Bass / Archer / Mad Men | Jost (Futura-like), League Spartan, Josefin Sans, Abril Fatface, DM Serif Display |
| Veep-style headlines | Oswald, Archivo Black, Big Shoulders Display, UnifrakturMaguntia (masthead), Playfair Display |
| Sci-fi (RSI episodes) | Orbitron, Audiowide, Chakra Petch, Tomorrow, Rubik Glitch, Monoton |

---

## Part C: music, sound effects, voice and legal

### C.1 Options ranked by quality against effort
1. **Stock library (Epidemic or Artlist):** highest quality for the least effort, but generic, and editing it to exact frames means cutting stems.
2. **AI music generator (ElevenLabs Music composition plan, Suno v6):** custom and fast. Watch licensing: you don't own the copyright, and rights depend on the plan.
3. **Mixed code approach (recommended for iterating and for exact sync):**
   - The agent writes MIDI on the beat grid from A-8.
   - Piano: Salamander. Strings and brass stabs: VSCO 2 CE.
   - An 808 and risers synthesized in numpy.
   - Mix and master in pedalboard.
   - Realistic ceiling about 6.5–7.5/10 for "Succession-style" if the writing is strong (est.).
4. **Pure numpy synthesis:** cheapest. Fine for synthwave, trap or chiptune; cheap-sounding for acoustic instruments (about 5/10 for this style, est.).

**Suggested music plan:**
- 0–5s: a solo, slightly detuned piano over a sub drone (Social Network and Severance).
- On the first montage cut: the 808 drops in with strings and brass stabs (Succession).
- Brass or orchestra hits on each name-card freeze.
- A riser into the title card, then a big final hit (bass, piano and a choir-like "AGI" pad) and a tail of reverb.
- Pick 96 BPM at 24 fps so the beats line up with frames.
- Keep the same theme all season, and do per-episode variations in the last bar only.

### C.2 Composing in code: tools and samples
- **MIDI:** `pretty_midi` 0.2.11 or `mido` 1.3.3. Humanize with ±5–12 ms timing jitter, velocity curves, sustain pedal (CC64), and rotating between sample variants.
- **Rendering without system installs:**
  - `tinysoundfont` 0.3.7 (pip, plays SF2 files).
  - `spessasynth_core` 4.3.22 (npm, Apache-2.0, pure-JavaScript SF2/DLS player, updated August 2026).
  - `js-synthesizer` 1.13.0 (FluidSynth compiled to WebAssembly).
- **With installs:** FluidSynth (apt); sfizz for SFZ libraries **[UNVERIFIED packaging]**; pedalboard hosting VST3 instruments (it can render MIDI through VST3/AU instruments since 0.7.4), e.g. Surge XT (GPL, has a Linux VST3). Caveat: pedalboard doesn't set tempo-valid in the VST3 process context, so tempo-synced LFOs and delays inside plugins may misbehave. The `patch-render` project exists to fix that.
- **Effects and mastering:** pedalboard's Reverb, Compressor, Limiter, Chorus, Delay, Distortion, LadderFilter, Gain and HighpassFilter.
- **Samples and SoundFonts:**
  - **Salamander Grand Piano:** deep-sampled Yamaha C5, originally CC-BY 3.0. The V3 2020-06-02 release is reported as public domain **[verify on download]**. The best free piano, and the key to a convincing Succession-style motif.
  - **VSCO 2 Community Edition:** CC0, SFZ and WAV, about 3 GB. Strings, brass, winds, percussion.
  - **VCSL:** CC0, assorted instruments.
  - **GeneralUser GS 2.0:** free for commercial music.
  - **FluidR3_GM:** MIT. General MIDI sets sound dated, so use them only for filler.
  - Watch disk space: only about 30 GB is free.
- **Tone.js 15.1.22:** Offline rendering needs a Web Audio implementation. Options are headless Chrome (already downloaded by Remotion) or `node-web-audio-api` 2.2.0 (BSD, **needs Node ≥22**). Known problems: samplers must finish loading (`await Tone.loaded()`) before offline rendering, and there are issues past about 120s. Viable, but Python with pedalboard gives better mixing and mastering control.

### C.3 AI music generators (as of September 2026)
- **ElevenLabs Music:** best at hitting a timed structure.
  - Trained on licensed material (label and publisher deals, including Merlin and Kobalt). Models: `music_v2_5`, `music_v2` (the API default during the transition) and `music_v1`. Tracks run 3s to 5 min.
  - A **composition plan** lets you set section-by-section durations of 3,000–120,000 ms each, with positive and negative styles per section. An instrumental-only option exists. You can regenerate or inpaint a single section.
  - Commercial use on paid plans. Reports say self-serve plans exclude film, TV and large-studio games, which need Enterprise; the official docs page says "nearly all commercial uses," so **[verify the model-specific terms]**. The terms say output is not guaranteed unique.
  - Suggested plan: 5s intro, 17.5s montage, 7.5s title, matching the beat map.
- **Suno:**
  - The v6 model family launched 2026-09-09: v6 and v6-wild for Pro and Premier, v6-mini for everyone. It was trained on licensed partner material following the Warner settlement of 2025-11-25; Universal and Sony material was excluded.
  - **Download limits from 2026-09-03:** Free gets 7 lifetime trial downloads, personal use only. Pro gets 20 a month and Premier 60, both with commercial rights. Premier's Suno Studio stems have no limit.
  - Commercial rights only apply to songs made while subscribed and are not retroactive. Reports say the 2026 terms treat users as not owning the copyright **[reported]**.
  - Exact timing to the frame is unreliable, so plan to edit and time-stretch.
- **Udio:** downloads have been disabled since 2025-10-30 (Universal settlement). It is a walled garden, and the promised licensed relaunch had not shipped as of the latest reports. **Not usable.**
- **Google Lyria 3.5:** launched 2026-07-29 in Flow Music. Better control over tempo and duration. Paid tiers advertise commercial rights, and Google doesn't claim ownership. Every track carries a SynthID watermark, and Google offers indemnification on covered services.
- **Stable Audio 2.5:** enterprise and commercial through paid plans. The open-weights Stable Audio Open 1.0 is free for organizations under $1M revenue, makes short clips, and runs slowly on CPU. Useful for textures and sound effects.
- **Copyright caveat:** purely AI-generated music isn't copyrightable in the US (Copyright Office AI report Part 2, January 2025; *Thaler v. Perlmutter*, D.C. Circuit, March 2025, both from memory and high confidence). A mixed approach, with human or agent arrangement over AI stems, gives more authorship.

### C.4 Stock libraries
- **Pixabay Music:** free, commercial use in videos allowed, no attribution needed. Standalone redistribution is banned, as is content featuring recognizable brands. Some tracks are registered with YouTube Content ID and **can trigger claims**; Pixabay provides a per-track license certificate to dispute them. Quality varies.
- **Free Music Archive:** the license varies per track (CC-BY, CC-BY-NC, and so on). Avoid NC tracks for anything monetized.
- **Epidemic Sound:** Creator plan about $9.99/month billed annually ($119.88) or $17.99 month-to-month, with channel clearance.
- **Artlist:** about $199/year personal.
- **YouTube Audio Library:** free for YouTube, with attribution rules per track **[UNVERIFIED current terms]**.

### C.5 Sound effects
- **`@remotion/sfx`:** MIT package. Sounds are hosted at remotion.media, normalized to -3 dB peak, and the docs say they can be used without attribution. Useful: whoosh, whip, ding, page-turn, mouse-click, shutter-modern and shutter-old, record-scratch, switch. It also includes meme sounds (vine-boom, windows-xp-error, spongebob-fail, price-is-right-fail, wilhelm-scream, illuminati-confirmed). Those come from third-party media and cheapen a polished intro, so avoid them.
- **Freesound:** licensed per sound (CC0, CC-BY, CC-BY-NC). Filter to CC0; an account is needed to download.
- **Sonniss GDC bundles:** royalty-free, commercial use, no attribution **[UNVERIFIED for the current year]**.
- **BBC Sound Effects:** the RemArc license is non-commercial only, so avoid.
- **Procedural recipes in numpy with pedalboard:**
  - Whoosh: band-passed noise with a sweeping center frequency, an envelope and an auto-pan.
  - Riser: noise plus a rising saw pitch, into reverb.
  - Impact or boom: a 55→35 Hz sine pitch drop plus a noise transient and saturation.
  - Camera shutter for the freeze-frames: two filtered clicks.
  - Tape stop at the end of the VHS section: resample with slowing playback.
  - Projector rattle: filtered clicks at 24 Hz.
  - Keyboard clacks and server-fan hum (low-passed pink noise) for the dark-room cold open.
  - Retro UI blips: sfxr/jsfxr (MIT).

### C.6 Voice for the cold-open line
- **Best option:** a human performance by the user or a friend. The comedic timing is the joke. Record in a closet on a phone, then process in pedalboard: high-pass, gentle compression, a short "dark room" reverb and optional light saturation. Aim for a performed sound-alike that evokes the persona's cadence (soft, measured, earnest pauses) while staying clearly a cartoon.
- **Synthetic but not a clone:**
  - ElevenLabs Voice Design (a voice built from a text description) or stock library voices on paid plans.
  - Local CPU text-to-speech:
    - Kokoro (pip 0.9.4, Apache-2.0, fast, preset voices, limited emotional range).
    - Piper (pip `piper-tts` 1.8.0; possibly relicensed GPL-3 **[UNVERIFIED]**).
    - Chatterbox (Resemble AI, MIT, has an emotion-exaggeration control) **[UNVERIFIED version]**. It can clone from a reference clip; don't give it a real person's audio.
  - OpenAI's instruction-steerable text-to-speech would be a meta joke **[UNVERIFIED model names]**.
- **Do not clone a real person's voice:**
  - ElevenLabs and others require consent verification and ban cloning people you have no permission for.
  - At least 12 US states regulate voice cloning, including Tennessee's ELVIS Act (2024) and California and New York digital-replica laws.
  - The federal NO FAKES Act (S.4591 / H.R.8915, 2026) was advanced unanimously by Senate Judiciary on 2026-06-18 but is **not law**. It excludes "bona fide… satire, or parody," but critics say those exclusions narrow when a work creates a false impression that it is authentic.
  - YouTube requires disclosure of realistic synthetic content **[UNVERIFIED specifics; clearly animated content is generally exempt]**.
- Run Rhubarb on the final recorded line for lip sync.

### C.7 US parody, fair use and right of publicity (high level, not legal advice)
- **Parody of public figures is strongly protected:**
  - *Hustler v. Falwell* (1988, 8–0): no emotional-distress damages for parody without a false statement of fact made with actual malice.
  - Defamation requires a statement reasonably understood as fact. Obvious hyperbole and absurdity are protected (*Milkovich*, 1990, from memory).
  - **Risk area:** invented filler scenes played realistically that imply real misconduct (crimes, private life, health). Keep the fiction obviously absurd, skip rumor and private-life material (consistent with the exclusions for this project), and add a disclaimer card ("A parody. Events dramatized and invented.").
- **Right of publicity:** state law, and generally yields for expressive works.
  - *Comedy III v. Saderup* (Cal. 2001) set the "transformative use" test.
  - ***Winter v. DC Comics* (Cal. 2003):** the Winter brothers drawn as half-worm "Johnny and Edgar Autumn" were protected as transformative caricature. This is the closest precedent to renamed caricatures like "Mas Manalt."
  - Realistic depictions have lost (*Hart v. EA*, 3rd Cir. 2013; *Keller v. EA*, 9th Cir. 2013), so stay stylized, never photoreal or deepfake.
  - *De Havilland v. FX* (Cal. App. 2018) protected a docudrama portrayal with invented dialogue.
  - The biggest publicity risk is using a real person's likeness to advertise the show or on merchandise.
- **Trademark:** Use parody versions of company names and logos, not the real OpenAI, ChatGPT, xAI, Anthropic, Microsoft or YC marks, and never imply sponsorship. *Jack Daniel's v. VIP Products* (2023) gives parody less protection when it serves as your own brand (the show's logo, merch). Otherwise the *Rogers* test still covers expressive content.
- **Copyright:** Evoke the Succession, Silicon Valley or Snatch styles, but don't copy melodies, footage or specific designs; style is not protected. *Campbell v. Acuff-Rose* (1994) protects parody that comments on the original work itself. Borrowing the Succession theme to mock AI labs would be satire, not parody of Succession, and far weaker fair use. Write original music "in the spirit of."
- **Renaming** signals parody and reduces false-endorsement risk, but doesn't remove defamation exposure, because the targets are still identifiable. Protection comes from framing that is obviously not factual.

---

## Local files
The only files created were in the session scratchpad, used to inspect npm packages (`/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/`: the `@remotion/effects`, `@remotion/sfx` and `@remotion/google-fonts` tarballs and `fonts.txt`). Nothing was created in `/home/jgon/project/art/mrmas`.

## Sources
- Remotion: [License FAQ](https://www.remotion.dev/docs/license/faq) · [LICENSE.md](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) · [Pricing](https://www.remotion.dev/docs/license/pricing) · [v5.0 migration](https://www.remotion.dev/docs/5-0-migration) · [Chrome Headless Shell](https://www.remotion.dev/docs/miscellaneous/chrome-headless-shell) · [GL options](https://www.remotion.dev/docs/gl-options) · [GPU](https://www.remotion.dev/docs/gpu) · [Effects](https://www.remotion.dev/docs/effects) · [SFX](https://www.remotion.dev/docs/sfx) · [Performance](https://www.remotion.dev/docs/performance) · [Benchmark](https://www.remotion.dev/docs/cli/benchmark)
- Other animation tools: [PkgPulse: Remotion vs Motion Canvas vs Revideo 2026](https://www.pkgpulse.com/guides/remotion-vs-motion-canvas-vs-revideo-programmatic-video-2026) · [fantoche](https://github.com/fantoche-dev/fantoche) · [Motion Canvas FFmpeg exporter](https://motioncanvas.io/docs/rendering/video/) · [Theatre.js](https://github.com/theatre-js/theatre)
- GSAP: [GSAP 3.13](https://gsap.com/blog/3-13/) · [Webflow: GSAP free](https://webflow.com/blog/gsap-becomes-free) · [CSS-Tricks](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/)
- Rive, Manim, Blender: [Rive $9 plan](https://community.rive.app/c/announcements/rive-s-new-9-mo-plan) · [Rive runtime license](https://github.com/rive-app/rive-runtime/blob/main/LICENSE) · [Manim install](https://docs.manim.community/en/stable/installation.html) · [Manim 0.19 changelog](https://docs.manim.community/en/stable/changelog/0.19.0-changelog.html) · [Blender 5.2 LTS](https://www.blender.org/press/blender-5-2-lts-release/) · [Grease Pencil 5.2](https://developer.blender.org/docs/release_notes/5.2/grease_pencil/)
- Lip sync: [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync)
- Title sequences: [Succession, Art of the Title](https://www.artofthetitle.com/title/succession/) · [Picturemill: Succession](http://picturemill.com/succession/) · [Succession theme (Wikipedia)](https://en.wikipedia.org/wiki/Succession_(Main_Title_Theme)) · [yU+co: Silicon Valley](https://www.yuco.com/works/silicon-valley) · [Stash: Silicon Valley](https://www.stashmedia.tv/yuco-opens-silicon-valley-hbo/) · [Silicon Valley (Wikipedia)](https://en.wikipedia.org/wiki/Silicon_Valley_(TV_series)) · [Stretch Your Face](https://silicon-valley.fandom.com/wiki/Stretch_Your_Face) · [Halt and Catch Fire, Art of the Title](https://www.artofthetitle.com/title/halt-and-catch-fire/) · [Motionographer: HACF](https://motionographer.com/2014/06/02/halt-and-catch-fire-main-titles/) · [The Social Network soundtrack](https://en.wikipedia.org/wiki/The_Social_Network_(soundtrack)) · [Archer, Art of the Title](https://www.artofthetitle.com/title/archer/) · [Archer theme](https://archer.fandom.com/wiki/Theme_Music) · [Arrested Development, Art of the Title](https://www.artofthetitle.com/title/arrested-development/) · [Mad Men, Art of the Title](https://www.artofthetitle.com/title/mad-men/) · [Imaginary Forces: Mad Men](https://imaginaryforces.com/project/mad-men) · [House of Cards: Geraci interview](https://alexandrosmaragos.com/blog/2013/02/andrew-geraci-interview) · [Simpsons opening](https://simpsons.fandom.com/wiki/Opening_Sequence) · [Rick and Morty theme](https://rickandmorty.fandom.com/wiki/Rick_and_Morty_Theme_Song) · [Den of Geek: R&M credit jokes](https://www.denofgeek.com/tv/rick-and-morty-best-opening-credit-jokes/) · [TIME: BoJack titles](https://time.com/5782922/bojack-horseman-title-sequence/) · [Slate: BoJack](https://slate.com/culture/2017/09/don-t-skip-bojack-horseman-s-opening-credits.html) · [Veep title sequence](https://veep.fandom.com/wiki/Title_sequence) · [Snatch, Art of the Title](https://www.artofthetitle.com/title/snatch/) · [Freeze-Frame Introduction (TV Tropes)](https://tvtropes.org/pmwiki/pmwiki.php/Main/FreezeFrameIntroduction) · [Borderlands (TV Tropes)](https://tvtropes.org/pmwiki/pmwiki.php/Franchise/Borderlands) · [PremiumBeat: character title cards](https://www.premiumbeat.com/blog/stylize-video-with-character-title-cards/) · [Deadpool, Art of the Title](https://www.artofthetitle.com/title/deadpool/) · [Catch Me If You Can, Art of the Title](https://www.artofthetitle.com/title/catch-me-if-you-can/) · [Trent Walton: Mr. Robot title cards](https://trentwalton.com/notes/2020/02/16/mr-robot-title-cards) · [Severance, Art of the Title](https://www.artofthetitle.com/title/severance/) · [Extraweg: Severance S2](https://www.extraweg.com/severance-2) · [Tiger King](https://en.wikipedia.org/wiki/Tiger_King)
- AI music: [Suno downloads FAQ](https://help.suno.com/en/articles/13614785) · [Suno ToS update](https://suno.com/blog/suno-updates-tos) · [Suno v6 (Rundown)](https://www.therundown.ai/news/suno-v6-music-partners-paid-fan-remixes) · [DMN: Suno/Warner](https://www.digitalmusicnews.com/2025/12/22/suno-warner-music-deal-changes/) · [MBW: UMG–Udio](https://www.musicbusinessworldwide.com/universal-music-settles-udio-lawsuit-strikes-deal-for-licensed-ai-music-platform/) · [Billboard: UMG–Udio FAQ](https://www.billboard.com/pro/umg-udio-ai-deal-faq-artist-payments-user-downloads-lawsuit/) · [Udio downloads](https://undetectr.com/blog/udio-download) · [Eleven Music docs](https://elevenlabs.io/docs/overview/capabilities/music) · [Eleven Music compose API](https://elevenlabs.io/docs/api-reference/music/compose) · [Eleven music terms](https://elevenlabs.io/music-terms) · [MindStudio: Eleven Music v2](https://www.mindstudio.ai/blog/elevenlabs-music-v2-commercial-content-licensed-ai-music) · [Google Lyria 3.5](https://blog.google/innovation-and-ai/models-and-research/google-labs/lyria-3-5/) · [Stable Audio Open license](https://huggingface.co/stabilityai/stable-audio-open-1.0/blob/main/LICENSE.md) · [Stable Audio pricing](https://stableaudio.com/pricing)
- Stock libraries: [Pixabay license](https://pixabay.com/service/license-summary/) · [Pixabay Content ID](https://pixabay.com/blog/posts/how-to-clear-a-youtube-content-id-claim-with-a-pix-190/) · [Epidemic vs Artlist](https://photutorial.com/epidemic-sound-pricing/) · [Fluxnote comparison](https://fluxnote.io/guides/epidemic-sound-vs-artlist-2026)
- Samples and audio code: [GeneralUser GS](https://github.com/mrbumpy409/GeneralUser-GS/blob/main/documentation/README.md) · [FluidR3 (FreshPorts)](https://www.freshports.org/audio/fluid-soundfont) · [abcjs soundfonts (Salamander/FluidR3 licensing)](https://github.com/educandu/abcjs-soundfonts) · [VSCO 2 CE](https://versilian-studios.com/vsco-community/) · [VSCO-2-CE GitHub](https://github.com/sgossner/VSCO-2-CE) · [VCSL](https://github.com/sgossner/VCSL) · [pedalboard](https://github.com/spotify/pedalboard) · [pedalboard instruments (X post)](https://x.com/psobot/status/1669455929161445381) · [patch-render](https://github.com/blablack/patch-render) · [Tone.js OfflineContext](https://tonejs.github.io/docs/15.0.4/classes/OfflineContext.html) · [Tone.js offline issue #630](https://github.com/Tonejs/Tone.js/issues/630)
- Voice and law: [NO FAKES S.4591](https://www.congress.gov/bill/119th-congress/senate-bill/4591) · [Holland & Knight on NO FAKES](https://www.hklaw.com/en/insights/publications/2026/06/senate-judiciary-committee-advances-legislation-to-protect-name) · [ARL on NO FAKES](https://www.arl.org/blog/nofraudsnofakes/) · [FIRE on NO FAKES](https://www.fire.org/news/no-fakes-act-real-threat-free-expression) · [ElevenLabs cloning consent](https://terms.law/forum/thread/elevenlabs-voice-clone-legal.html) · [Hustler v. Falwell](https://en.wikipedia.org/wiki/Hustler_Magazine_v._Falwell) · [FIRE: satire and parody](https://www.fire.org/research-learn/satire-parody-and-first-amendment) · [Winter v. DC Comics](https://scocal.stanford.edu/opinion/winter-v-dc-comics-33304)