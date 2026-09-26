# MR. MAS · Style range: capability audit

> **2026-09-26 correction (lead):** Blender is already installed: **Blender 4.5.3 LTS** at `/home/jgon/Downloads/blender-4.5.3-linux-x64/blender`. It was verified headless here: EEVEE Next renders through the Intel iGPU, and Cycles runs on the CPU (the iGPU isn't exposed to Cycles; that would need Intel's oneAPI compute runtime).
> - GPU access comes through a login-session permission on `/dev/dri/renderD128`. It can drop when the desktop session isn't active. The permanent fix is to add the user to the `render` and `video` groups: `sudo usermod -aG render,video jgon`, then log out and back in.
> - The "install Blender" resource ask is withdrawn. Disk (about 9 GB free) is still the constraint for scenes, textures and caches.


What the pipeline can do **today** at a premium level for every candidate medium, what the rest would take, and an honest quality ceiling on this machine. The audit is the supply side of the two-tier style range: **filter-like treatment passes** (common) and **drastic medium changes** (rare). It doesn't choose the moments. That's the range-design pass.

| | |
|---|---|
| **Status** | **MEASURED**, capability audit, 2026-09-26. It changes no script, rule or locked file. |
| **The notes** | *"we can have some style changes that are more like filter passes, and then rarer some that are drastic changes like high definition anime, 3d, near photorealistic, extra blocky, etc. we want to show off throughout the show the capabilities of what range we're able to do, but not in a forced manner either, only where it makes sense."* · *"some of these may be hard to be done programatically, hence the reason for giving access to video model or similar for the final draft (but still put fully programatic fillers for now)"* · *"there can be guidelines, but the practical flow and user entertainment is always priority"* |
| **Firm guardrails** | No photoreal or near-photoreal treatment of any caricature of a real person, Mas and every rival included. Near-photoreal is for environments, objects, machines, crowds of nobody in particular, and fictional characters. Anime, clay, low-poly and other stylized treatments of caricatures are fine. We evoke a look and never copy a named studio's trademarked one. Parody names and logos only. Voices are never cloned. See [guardrails §5](../bible/guardrails.md#5-legal-hygiene). Photosensitivity rules apply to every medium ([guardrails §7](../bible/guardrails.md#7-broadcast-safety)). |
| **Related** | [style-status](../bible/style-status.md) · [style-jumps](../bible/style-jumps.md) (older budgeted plan, being superseded; its J1, J3 and J6 ideas stand) · [flow-and-continuity](../bible/flow-and-continuity.md) · [GENAI-UPGRADE-PLAN](GENAI-UPGRADE-PLAN.md) · [genvideo README](../../studio/tools/genvideo/README.md) · [PIXEL_GUIDE](../../studio/PIXEL_GUIDE.md) |

---

## 0. At a glance

- **The machine isn't CPU-only for WebGL.** It has an Intel Arrow Lake-U integrated GPU (Mesa 25.2.8, Vulkan 1.4), and headless Chrome reaches it.
  - With `--gl=angle` (or `--gl=vulkan`), WebGL reports `ANGLE (Intel, Vulkan 1.4.318 (Intel(R) Graphics (ARL)))`. With `--gl=swangle`, it's SwiftShader on the CPU. `egl` and `angle-egl` fail.
  - That makes three.js shots **10–40× faster** than on SwiftShader: a 5 s shot of a PBR scene with AO renders in 30–45 s instead of 6–15 min.
  - Remotion's docs recommend `angle` for three.js and `swangle` when there's no GPU.
- **Tier 1, the treatment passes, is almost all feasible now at premium quality.** They're lookups or short pixel loops over the frames we already make. The worst hires pass costs 0.4 s a frame; a 5 s shot renders in 20–40 s.
  - The risk is taste and pacing, not capability.
  - Two need per-scene tuning: NOIR and RISO on our very dark night rooms.
  - The spreadsheet render works but needs layout design to read at 1×.
- **Tier 2 splits three ways.**
  - **Ready now:** mega-pixel, voxel, low-poly, clay and stop-motion, a 3D toon look, a watercolor shader and paper cut-out. Every one of them rendered in this audit.
  - **Half-built:** HD cel anime. Mas and Nole have rigs plus a compositing kit (focus lines, speed streaks, glints, impact frames). The rivals have none.
  - **Needs a resource:** near-photoreal environments.
- **A new idea, proven on screen: "the grid gains depth".** Our own pixel frame is extruded into 130k voxels, and the camera swings round it. Frame 0 matches the flat pixel frame; by the end of the swing, the figures stand out as blocks. It renders a 5 s shot in about 20 s.
- **Near-photoreal.**
  - three.js on the iGPU reaches good real-time CG, the level of a mid-2010s game, but not photoreal. It has no GI and no caustics, and transmission is screen-space.
  - Blender Cycles on this CPU would reach photoreal. It's estimated at 2–6 min a frame, so 4–12 h for a 5 s shot, and about 1.2 GB of disk.
  - The video-model route in the [GENAI plan](GENAI-UPGRADE-PLAN.md) gives the most realism per dollar, at about $1–4 per shot, but for environments only.
- **Installed:** `three@0.186.1` and `@remotion/three@4.0.529`, pinned exactly. npm also added `@react-three/fiber@9.8.1` as the required peer. Only additions: 15 packages, no version changed. After the install, the main bundle (`src/index.ts`) bundled and `pixelengine-switches` rendered, output checked.
- **Three caveats** (in [§2](#2-render-backends-measured)):
  - GPU and CPU rasterization differ on SVG-filter-heavy lookdev. The anime scene grows extra rim strokes. The pixel engine is bit-identical on both. Lock one backend per sequence.
  - GPU access relies on the desktop login's device permission, so probe it before every GPU render.
  - Remotion documents a memory leak with `angle` on long renders. Render in chunks.

---

## 1. How this was measured

- **Machine.** Intel Core Ultra 7 255U: 12 cores, 14 threads, 15 W class. 30 GB RAM and an integrated Intel GPU (Arrow Lake-U). The disk was at 98–99% (7–10 GB free).
- **Load.** Other renders and builds were running throughout (load average 11–19 on 14 threads).
  - Every number below is wall time on that shared machine, at `--concurrency=4` unless noted, at 1920×1080 and 24 fps.
  - Numbers are extrapolated from 24- or 48-frame runs to a 120-frame shot, including the ~3–4 s of browser startup.
  - Quiet-machine numbers would be lower.
- **Harness.** A throwaway Remotion entry lived in the session scratchpad and imported the real engine read-only: `drawRoom()` from `src/dev/pixelengine/room.ts` and the pixel palette, dither and font modules.
  - **Treatment passes:** 16 passes on the approved dark-room key frame.
  - **Seven three.js scenes:** PBR room, PBR plus post, clay, low-poly, low-poly through the pixelated pass, voxel city, toon.
  - **Three effects:** a watercolor shader, the pixel-depth extrusion, and a GL probe that prints the WebGL renderer string.
  - **Existing compositions:** timed as they are, with no edits.
  - **Cleanup:** scratch renders were viewed, then deleted. Nothing was written into the project tree except this file and the npm install.
- **Estimates are labelled as estimates.** Nothing about Blender, cloud GPUs or path tracing was run.

---

## 2. Render backends (measured)

| `--gl` | What Chrome got | Result |
|---|---|---|
| *(default, none)* | `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)))`: CPU (probed) | All existing 2D and SVG work renders this way today |
| `swangle` | `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)))`: CPU | Works. Slow for 3D; a PBR frame at concurrency 4 hit the 33 s frame timeout |
| **`angle`** | **`ANGLE (Intel, Vulkan 1.4.318 (Intel(R) Graphics (ARL)))`: the iGPU** | **Works. Use it for three.js** |
| `vulkan` | Same Intel device | Works (not timed separately) |
| `egl`, `angle-egl` | — | Fail: "Error creating WebGL context" / GPU process exits |
| WebGPU | `navigator.gpu` exists, but no adapter under `angle`, `vulkan`, `swangle` or the default | Not available headless. three's WebGPURenderer is out; stay on WebGL2 |

**The same work on the two backends** (5 s shot, 120 frames):

| Composition | Default / `swangle` | `angle` (iGPU) | Output identical? |
|---|---|---|---|
| `mcoldopen` (pixel engine) | ≈ 10 s | not timed (no reason to move) | **Bit-identical** (mean diff 0.0) |
| `tone-motion-soft` (tonal rig, canvas) | ≈ 3.5 min | ≈ 1.7 min | Near: 0.19% of pixels move by more than 10 of 255 |
| `puppet-scene` (paper puppet, SVG) | ≈ 6.3 min | ≈ 4.3 min | Near: 0.12% |
| `anime-scene` (SVG cel rig and filters) | ≈ 13 min | **≈ 2.3 min** | **No.** Rim strokes render differently: extra rim strokes float beside the hair on the GPU. 0.74% of pixels move by more than 40 |
| three.js PBR room | ≈ 6 min (concurrency 1; times out at 4) | ≈ 30–45 s | n/a |
| three.js PBR plus AO and bloom | ≈ 15 min (concurrency 1) | ≈ 30–45 s | n/a |
| three.js clay (re-sculpt on 2s, AO, DOF) | ≈ 12 min | ≈ 35–50 s | n/a |
| three.js voxel city (40k cubes) | ≈ 4.7 min | ≈ 20 s | n/a |
| three.js low-poly / toon | ≈ 30 s / 20 s | ≈ 15 s / 10 s | n/a |

**Rules that follow:**
1. **3D renders pass `--gl=angle` on the command line.** Don't set it globally in `remotion.config.ts`: it would change the look of approved SVG lookdev.
2. **Probe before a GPU render.**
   - The GPU node (`/dev/dri/renderD128`) is reachable only through a per-user permission that the desktop login grants (`user:jgon:rw-`). Rendering with nobody logged in at the console may lose it.
   - Chrome then falls back to SwiftShader, and the render is 10–40× slower without an error.
   - The fix is permanent membership of the `render` group (one `sudo usermod -aG render jgon`, [§8](#8-resource-asks-ordered-by-lift)).
   - Until then, render a 1-frame probe that prints the renderer string first. The harness's `gl-probe` is 20 lines; rebuild it in the 3D kit.
3. **Keep one backend per sequence.** If a shot's lookdev was approved on the CPU, re-approve it before moving it to the GPU. The pixel engine is exempt, because it's bit-identical on both.
4. **Split long GPU renders into chunks.** Remotion's docs say `angle` "has memory leak issues", so render long GPU passes in parts of a few hundred frames.
5. **three r186 no longer ships `PCFSoftShadowMap`.** It silently falls back to `PCFShadowMap`. For soft shadows, use `shadow.radius`, VSM, or multi-sample accumulation (§5.3).

---

## 3. The table

Cost is for **one 5 s shot** (120 frames at 1080p).
- **Render:** measured as in §1, or labelled *est.*
- **Build:** agent time to make the *first* shot in that medium, then each extra shot once the kit exists. Always an estimate.

**Tier 1: treatment passes on existing scenes**

| Medium | Now | Quality ceiling here | Render · build | Resource that would lift it |
|---|---|---|---|---|
| Palette inversion | **Yes** | Premium. It flips OKLab lightness, keeps hue and snaps to the master palette, so it's still our palette. 3 ms a frame | ~10 s · 1 h, then minutes | — |
| Duotone / tritone | **Yes** | Premium: a compiled tone set, the same machinery as 2-TONE FREEZE. 6 ms | ~10 s · 1 h | — |
| Riso / newsprint | **Yes** | High. AM halftone at a real screen angle, two-ink misregistration, paper grain. On our night rooms most of the frame goes to the dark ink, so it needs a per-scene tone curve. 0.16–0.4 s a frame | ~40 s · 2–4 h | Scans of a real riso print and newsprint (paper tooth, dot gain) |
| Engraving | **Yes** | Premium when drawn from vector or tonal sources (J1 proves it: `jump-proto-1` renders a 5 s shot in ~20 s). As a pass over pixel frames it reads well at a distance but shows pixel stair-steps in close-up | ~20–45 s · 0.5 day | — |
| Noir (black, paper, one spot) | **Partly** | High on lit scenes. On our dark rooms a pure threshold swallows everything but the monitor and the hall light, so each scene needs its own threshold, or a relight | ~10 s · 2–4 h per set | — |
| GLYPH / ASCII | **Yes** (built) | Premium: engine GLYPH switch, glyph dissolve, `glyphize.py` for video | ~10–20 s · exists | — |
| 1-bit | **Yes** (built) | Premium (ONEBIT) | ~10 s · exists | — |
| Game Boy-style 4-shade | **Yes** | Premium: a 240×135 grid, four LCD greens, 2×2 ordered dither. 7 ms. Evoke the look; never the name or logo | ~10 s · 1 h | — |
| CRT / VHS / archive | **Yes** | High: chroma bleed, tracking band, head-switch noise, scanlines, vignette, OSD. 0.25 s a frame. The ceiling is taste: see §4.1 | ~30 s · 0.5 day | CC0 real tape-noise and film-scratch plates (free) |
| Security camera | **Yes** | High: soft mono, barrel distortion, interlace, noise, timestamp and REC OSD | ~25 s · 2–4 h | — |
| Thermal | **Yes** | High and convincing. Heat comes from colour family (skin, hair, screens, lamps), not from brightness, through an iron LUT with a HUD | ~20 s · 2–4 h | — |
| Video-call breakdown | **Yes** | High: DC-only 8×8 blocks and smeared macroblocks, damage growing on a gradient, updated on 2s. A true codec round-trip through the bundled ffmpeg at low bitrate is likely possible (untested) | ~20 s · 0.5 day | — |
| "AI video tells" | **Yes** | High as parody: a domain warp that melts one region and gibberish type that re-rolls every few frames. Hand-drawn extra fingers are a sprite job | ~15 s · 0.5 day | Real tells need a model clip, and models can't touch people, so code stays the better joke |
| Spreadsheet-cell render | **Partly** | Medium–high. It works: every cell a number and a fill, with a formula bar and a selected cell. At 1× the image reads weakly, so it needs bigger cells, a limited fill scale and a push-in | ~15 s · 1 day | — |
| Blueprint | **Yes** | Premium: the kit exists (`kits/blueprint.ts`), and an edge pass from the indexed frame gives clean white lines on ink blue with a grid and title block. 16 ms | ~10 s · 2 h | — |

**Tier 2: drastic medium changes**

| Medium | Now | Quality ceiling here | Render · build | Resource that would lift it |
|---|---|---|---|---|
| Mega-pixel | **Yes** | Premium: our grid at 1/8 (60×34), with the block's most common colour. 8 ms | ~10 s · 1 h | — |
| Voxel, and "the grid gains depth" | **Yes** (iGPU) | High. A 40k-cube voxel city, and our own frame extruded to 130k voxels with an orbit. Premium needs a depth or layer buffer from the engine, which it doesn't export yet | ~20 s (iGPU), ~5 min (SwiftShader) · 1 day, then 2–4 h | `render` group membership (a free fix). Optional MagicaVoxel models |
| HD cel anime (our cast) | **Partly** | High for Mas and Nole: TV-anime key-art quality in the lookdev, with limited animation (held poses, camera, smears, impact frames), not full sakuga. Rivals have no rigs. Lens flares aren't built (easy) | 2.3 min (iGPU, re-approve) or 13 min (CPU) · 1–2 days per new rig, 0.5–1 day per shot | A human 2D animator for key poses on hero moments. A video model can't help: no people |
| Low-poly 3D | **Yes** | High: flat-shaded terrain, trees and figures, fog and shadows. Honest stylization, not a limitation | ~15 s (iGPU), ~30 s (SwiftShader) · 0.5–1 day per set, 0.5 day per figure | — |
| 3D toon (cel-shaded) | **Yes** | Medium–high: 3-step toon ramp and inverted-hull ink lines. The cast would need modelling, and a toon cast would compete with the SVG anime rig | ~10 s (iGPU) · 1–2 days per character | — |
| Real 3D, PBR (environments and objects) | **Yes** (iGPU) | High-end real-time CG: IBL, GTAO, bloom, glass and water transmission, wood and metal. Not photoreal | ~30–45 s (iGPU), 6–15 min (SwiftShader) · 1–2 days per set | HDRIs and scanned PBR textures (Poly Haven, CC0: ~50–200 MB a set), or a path tracer or Blender (§5) |
| Clay / stop-motion | **Yes** (iGPU) | High for simple designs. Fingerprint and tool-mark normal map, sheen, re-sculpt boil on 2s, a camera that steps on 2s with hand-placed jitter, miniature DOF, AO | ~35–50 s (iGPU), ~12 min (SwiftShader) · 1–2 days per character, 0.5 day per set | A real plasticine maquette photographed or phone-scanned for true surfaces, or a human sculptor. ~$20 of clay |
| Paper cut-out | **Yes** (built) | High to premium: `puppet-scene` (card joints, torn-paper breach) and the engraved collage set exist | ~4.3–6.3 min · 0.5 day per shot on the kits | Scanned card stocks and torn edges (free) |
| Watercolor / painted | **Partly** | Medium–high. A GPU watercolor shader (Kuwahara washes, wobbling edges, edge pooling, granulation, paper) reads as a gouache storybook on simple forms. Tonal `soft` and `paint` cover painted characters. Faces need designed washes, not a filter | ~30–45 s (iGPU) · 1 day | Scans of real washes and paper, or painted plates by an illustrator |
| Rotoscope-like | **Partly** | Medium. 3D toon or clay renders pushed through `pixelize.py` (tested: temporally stable, 0.16 flips per 1,000) or tonal posterize. It isn't true rotoscope, because there's no performance source | ~1.5 min convert · 1 day | A consenting performer's reference video plus pose extraction. **Needs a ruling** (§4.2) |
| Near-photoreal (never the cast) | **Needs a resource** | three.js: good real-time CG. Blender Cycles: photoreal at 2–6 min a frame (*est.*). Video models: photoreal elements at 720p | three.js ~30–45 s · Cycles 4–12 h (*est.*) · video ~$1–4 per shot plus a 1.5 min convert | Runway key (GENAI §9), and/or Blender (free, ~1.2 GB) plus cloud-GPU hours (~$0.10–0.50 per shot, *est.*) |

---

## 4. Notes per medium

### 4.1 Tier 1 passes

- **Each pass is written in the engine's own terms.**
  - Grid-true passes (inversion, duotone, noir, 4-shade, thermal heat mapping, breakdown blocks, blueprint, mega-pixel, AI warp) run on the 480×270 indexed framebuffer, as switches already do. They cut in on any frame, inside or outside a mask. The masked "freeze everything except Mas" works for them unchanged.
  - Print and tape passes (riso, newsprint, engraving, VHS, security camera) run at 1920×1080 over the 4× frame, because a halftone dot or a scanline is finer than a native pixel.
- **Taste is the ceiling.** [style-jumps §1.3](../bible/style-jumps.md#13-what-it-is-not) banned VHS roll, datamosh and "corrupted file" as corn. That holds when the effect is decoration. It doesn't hold when the medium is **diegetic**: a video call really breaking up, a deposition played off tape, a security camera that recorded the lobby. The passes are built to look like the real device (restrained chroma bleed, one tracking band, honest OSD type), not like a glitch preset.
- **Every pass still has to follow [flow-and-continuity](../bible/flow-and-continuity.md).** Enter it and leave it through a device (a push into the screen, a match cut, a pre-lap), and keep the sound bed continuous.
- **Photosensitivity.**
  - The breakdown, impact frames and any flash-cut obey the 3-flashes-per-24-frames rule.
  - Thermal's white-hot peaks stay at 80% white or less.
  - The engine's luminance audit applies unchanged.
- **Weak spots:**
  - **Noir** needs lit scenes or a relight. The dark room collapses to the monitor and the hall light.
  - **Riso** needs a per-scene tone curve.
  - **The spreadsheet** needs layout design. As built, the numbers win and the picture loses at 1×.

### 4.2 Tier 2 media

- **HD cel anime.**
  - **What exists:** `src/shared/anime/` holds the Mas and Nole rigs (layered SVG cel with ink, rim and eye rigs), the room, the grade, and `scene/fx.tsx`: focus lines, speed streaks, a kira glint, rim, edge-glow and flat filters, an impact filter and subtitles.
  - **Premium means designing for limited animation:** strong held key poses, camera moves and multiplane, smears, one-frame impact frames, compositing light. That is authentic to TV anime and plays to a rig.
  - **The rig can't do** perspective turns past about ¾, or fluid full-body acting.
  - **Rivals:** each needs a rig (the existing two are ~340 lines each, plus hair and mouth sets). Build only the characters a moment needs.
  - **GPU render:** re-approve the look first (§2).
  - **Don't imitate a named studio's look.** The kit is generic TV-anime grammar.
- **3D (three.js).**
  - The engine is now installed. `<ThreeCanvas>` renders under Remotion, and `EffectComposer` post (GTAO, bloom, Bokeh DOF, `RenderPixelatedPass`, custom `ShaderPass`) works through `useFrame`.
  - **Stylized 3D** (low-poly, voxel, clay, toon) is where we can be premium now, because the medium's own limits match ours.
  - **Casting a caricature in 3D** means building it from primitives or SDFs in code, 1–2 days per character. Stop-motion's constraints (held poses, 2s, stepped camera) hide the absence of a real animation rig. Clay is therefore the best 3D medium for the cast.
- **"The grid gains depth"** (new, extra blocky, tested).
  - Our frame is extruded pixel-for-pixel into voxels. Depth comes from colour family (figures bulge, the wall stays back) plus lightness relief. Front faces are unlit, so frame 0 reads as the flat pixel frame, and the camera swings round.
  - It's the "extra blocky" jump with a meaning of its own: the flat world we trusted has a side we never saw.
  - **The premium version needs** the engine to export a layer or depth id per pixel (room, furniture, Mas, Nole, foreground), a small `compose.ts` addition.
  - **References:** the 2D-to-3D rotation reveal is a known game grammar (FEZ, 2012). We evoke it; we don't quote it.
- **3D into pixel.** `pixelize.py` converts any video, including our own three.js renders. A 2 s clay clip converted in 36 s with its stability stats in the gate's pass range. So 3D can also serve as a **source** for pixel shots (flights in depth, the J3 sky, crowds), not only as a jump.
- **Clay / stop-motion.**
  - The test builds a fingerprint and tool-drag normal map and re-noises the geometry on 2s (boil). It keeps the texture fixed, as a real puppet would. The camera steps only on 2s.
  - **The honest gap is sculpting.** Code primitives read as "simple clay figure", not as a crafted puppet. The cheapest lift is physical: model a head in plasticine, photograph or phone-scan it, and use the real surface.
  - A clay caricature is stylized, so the likeness rule holds.
- **Watercolor.**
  - The shader treatment is convincing on simple forms and flat colour.
  - On faces and on the dark pixel rooms it would read as a filter. Premium watercolor starts from a source designed for washes: flat 3D or tonal planes, and real scanned wash masks.
- **Rotoscope-like.**
  - **Allowed:** the "fake" routes, 3D rendered to toon and then to pixel or posterize.
  - **Needs a ruling:** a real rotoscope needs a performance source.
    - The model route is closed: no people or acting from models (GENAI §1.4).
    - What's left is a **consenting performer's** reference video driving our caricature: traced by hand, or through pose extraction such as MediaPipe on the CPU (not installed) driving our rig.
    - Guardrails say "never traced from photos". That was written about the real people, but a performer-driven rotoscope is close enough that it needs the showrunner's ruling.
    - The source must never be footage of the real person being parodied.

---

## 5. Near-photoreal: the routes compared

Near-photoreal is only for environments, objects, machines, crowds of nobody in particular and fictional characters. The stylized cast is composited over it, never rendered in it.

| Route | Status here | What it reaches | Cost per 5 s shot | Disk |
|---|---|---|---|---|
| **three.js on the iGPU** (`--gl=angle`) | **Works now** | Good real-time CG: IBL, AO, bloom, soft-ish shadows, transmission. Reads as "CG" | ~30–45 s render | Textures 50–200 MB a set |
| three.js on SwiftShader | Works, slow | The same image | 6–15 min (concurrency 1–2; raise `--timeout`) | same |
| three.js plus multi-sample accumulation | Buildable now (not tested) | Offline, we can afford 16–64 jittered passes a frame: soft area shadows, true DOF, motion blur. A clear step up, still without GI | *est.* 3–10 min (iGPU) | same |
| `three-gpu-pathtracer` (npm, MIT) | Not installed (needs an OK) | Path-traced GI, soft shadows, refraction. Near-photoreal stills and slow shots | *est.* 30–120 s a frame on this iGPU, so 1–4 h a shot; hold plates on 2s or 4s | ~5 MB package |
| **Blender Cycles, CPU** | Not installed (estimate) | Photoreal: GI, caustics, volumes, OIDN denoise | *est.* 2–6 min a frame at 1080p and 128–256 spp on this 15 W chip, so **4–12 h a shot** (2–6 h on 2s) | ~1.2 GB installed, plus assets, plus PNG or EXR frames (0.4–1.4 GB a shot before encoding) |
| Blender EEVEE on the iGPU | Not installed (estimate, unverified) | Near-photoreal for many interiors: real-time GI approximations, ray-traced reflections | *est.* 5–30 s a frame, so 10–60 min a shot | as above |
| Blender Cycles on the iGPU (oneAPI) | Not possible yet | As CPU Cycles, faster | Needs Intel's compute runtime (`libze`/level-zero, sudo). Arrow Lake-U support is unverified | +~300 MB |
| Cloud GPU (RTX 4090 class) | Not set up | Cycles at production quality | *est.* 5–20 s a frame: 10–40 min, **~$0.10–0.50 a shot** | Transfer only |
| **Video model** (GENAI plan) | Waiting on a key | The most realism per dollar: water, fire, sky, weather, crowds, flights in depth. Weakest on exact control and continuity | ~20 generated s at $0.05–0.20/s: **~$1–4 a shot**, plus a ~1.5 min convert | ~20–50 MB a take (archive) |

**A shot needs control** (a machine assembling, a set revealed exactly, the ring in his water, J6): three.js now, then Blender or the path tracer.

**A shot needs believable chaos** (the sky opening in J3, water, fire): the video model, converted or in a SYNTH window. The code filler stays behind it in both cases.

---

## 6. Fully programmatic fillers now, upgrades later

Every drastic moment is built first in code and cut into the animatic. The upgrade is a **layer swap** on the same frames, mask and sync ([GENAI §1](GENAI-UPGRADE-PLAN.md#1-principles)). Mark the slot with a `GEN:` line; the filler ships if the upgrade fails the gate.

| Drastic medium | The filler we can build now | The later upgrade |
|---|---|---|
| Near-photoreal environment or element | three.js PBR (iGPU), with accumulation for soft light | Video model (CONVERT or SYNTH), or Blender / path tracer for controlled shots |
| HD anime moment | SVG anime rig and fx kit (Mas, Nole; new rigs as needed), limited animation | A human animator's key poses redrawn into the rig. Never a model |
| Clay / stop-motion | three.js clay, boil on 2s, stepped camera | A real maquette photographed or scanned for surfaces, or a sculptor |
| Voxel / grid gains depth | Engine frame to instanced voxels (iGPU) | An engine layer/depth export, and optional hand-built voxel pieces |
| Watercolor / painted | Shader pass over flat 3D or tonal planes | Scanned washes and paper, or illustrator plates |
| Rotoscope-like | 3D toon to `pixelize.py` or posterize | Performer-driven rotoscope, after a ruling |
| Low-poly / toon 3D | three.js | — (already at its ceiling) |
| Every Tier 1 pass | Code | Optional real reference plates (tape noise, riso scans) |

---

## 7. Reference shows (how others earn their range)

These are for the room, not the screen. Each lesson is about **motivation and grammar**, not a look to copy.

| Reference | What it does | Lesson for us |
|---|---|---|
| *WandaVision* (2021) | Each era is a period TV grammar: B&W sitcom, then colour | Era treatments work as story when the characters live inside them. Our 1-BIT / EARLY-WEB16 logic, extended |
| *Community*: "Abed's Uncontrollable Christmas" (stop-motion), "Digital Estate Planning" (8-bit game), "G.I. Jeff" (80s cartoon) | Whole episodes in another medium, each motivated by a character's head | A drastic switch lands when it's a character's point of view. For us that's Mas's unreliable narration |
| *Adventure Time*: "A Glitch Is a Glitch" (3D), "Bad Jubies" (stop-motion), "Food Chain" (guest-directed anime-influenced) | Rare guest-medium episodes inside a stable house style | Range reads as confidence when the base style stays sovereign |
| *The Simpsons* couch gags and "Brick Like Me" (toy-brick episode) | Guest styles, then a snap back to the house look | Short, bold, then home. The Tier 2 rhythm |
| *Spider-Man: Into the Spider-Verse* (2018) | Several media in one frame; animating on 2s versus 1s as characterisation | Mix media inside one shot (Mas stays pixel while the world turns print), and use frame rate as a style tool |
| *Mr. Robot* S2 "eps2.4_m4ster-s1ave.aes" | A sitcom pastiche as a dissociation device | A style jump as the POV character's coping. Close to our Mas-POV contract |
| *Legion* S1 "Chapter 7" | A silent-film interlude inside a thriller | Genre medium used for tension, not a gag |
| *Undone* (2019), *A Scanner Darkly* (2006) | Rotoscope over consenting actors | The rotoscope lift, and why it needs a performer |
| *The Mitchells vs. the Machines* (2021) | 2D doodles layered on 3D as a character's POV | Treatment layers as a character's voice |
| *FEZ* (game, 2012) | A 2D pixel world rotates to reveal depth | Our "grid gains depth" moment. Evoke the reveal, never the game's art |

---

## 8. Resource asks, ordered by lift

1. **`sudo usermod -aG render jgon`** (free, one command). It makes GPU rendering independent of the desktop login, and every 3D row depends on it.
2. **The Runway key** (already [GENAI §9](GENAI-UPGRADE-PLAN.md#9-resource-asks-ordered-by-impact)). It's the near-photoreal environment route, at ~$1–4 a shot.
3. **Permission to add `three-gpu-pathtracer`** (npm, MIT, ~5 MB). It gives path-traced plates on the iGPU with no new disk burden.
4. **Blender 4.x LTS** (free, ~1.2 GB installed; decide against the ~7–10 GB free). It unlocks EEVEE on the iGPU for controlled near-photoreal, Cycles for stills, and baked lighting back into three.js.
5. **Cloud GPU hours** (optional, ~$25 covers dozens of Cycles shots at the estimated rates). Photoreal renders become minutes instead of hours.
6. **Real material references** (≈ $20–50): a block of plasticine for a scanned maquette, a riso print and newsprint scan, a watercolor pad. The cheapest way to lift clay, print and watercolor from "good code" to "real".
7. **A human 2D animator** for key poses on the one or two anime moments that need acting beyond the rig.
8. **A ruling** on performer-driven rotoscope (§4.2).
9. **Disk.** At 98–99% full, any Blender, pathtracer or plate work needs a cleanup or an external drive first. Keep 1080p PNG sequences only until encoding (0.2–0.5 GB a shot).

---

## 9. Install record and side effects

- **Command.** In `studio/`: `npm install --save-exact three@0.186.1 @remotion/three@4.0.529`.
- **`package.json`** gained `"three": "0.186.1"` and `"@remotion/three": "4.0.529"`.
- **The lockfile only gained entries:**
  - 15 packages: `@react-three/fiber@9.8.1` (the required peer, with its own `scheduler@0.28.0`), `zustand`, `its-fine`, `suspend-react`, `react-use-measure` and friends.
  - Size: 23 MB (`three`) plus 2.6 MB.
- **Nothing was upgraded.**
- **The peer range matters.** `@react-three/fiber@9.8.1` accepts `react >=19 <19.4`, and we're on 19.1.0. A future React bump past 19.3 needs a fiber bump too.
- **Verified afterwards:**
  - `npx remotion bundle src/index.ts` succeeds.
  - `pixelengine-switches` (10 frames) renders, output checked.
  - Every existing composition timed in §2 renders unchanged.
- **Side effect.** Bundling a second entry made Remotion clear and rebuild its shared webpack cache (`studio/node_modules/.cache`, ~265 MB). The next main bundle by another pass may take ~20–60 s longer, once.
- **Scratch.** Everything was under the session scratchpad and has been deleted.
