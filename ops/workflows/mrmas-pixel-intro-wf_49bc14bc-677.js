export const meta = {
  name: 'mrmas-pixel-intro',
  description: 'Promote the pixel engine (+glyph switch), build the intro cast in pixel art, build intro key moments with motivated style switches, critique, polish',
  phases: [
    { title: 'Engine+Cast', detail: 'engine/glyph/transitions + two cast artists' },
    { title: 'Moments', detail: 'cold open, eras, dinner cards x2, slot+skyline+title' },
    { title: 'Critique', detail: 'art director: craft, not-corny, consistency' },
    { title: 'Polish', detail: 'apply fixes' },
  ],
}

const ROOT = '/home/jgon/project/art/mrmas'
const STUDIO = ROOT + '/studio'
const COMMON = `You are a senior pixel artist + engineer on "MR. MAS", an animated satire of the AI race (Sam Altman -> MAS MANALT). Working dir: ${STUDIO} (Remotion 4, React 19, TS). READ FIRST: ${STUDIO}/ART_GUIDE.md (builder rules: own files only, own dev entry via makeRoot, render + LOOK at PNGs with Read, iterate >= 3 times, notes/<key>.md), ${STUDIO}/INTRO_PIXEL_BRIEF.md (THE DECISION + intro moments + style-switch plan — binding), ${ROOT}/out/structures/pixeladv/REPORT.md and its images (key.png, extra-portraits.png, extra-lineup.png, extra-switch.png) — the approved reference look — and the pixel engine code in ${STUDIO}/src/dev/pixeladv/ (core/px.ts, palette.ts, light.ts, font.ts, figure.ts, art/*, PixelCanvas.tsx).
Showrunner notes (binding): pixel art is the primary style; glyph for dark foreshadowing/tone/comic timing; other switches sparing and motivated; NOTHING CORNY; must look like a real, high-craft production, not a code demo. Parody names only; stylized caricature of public persona (1-2 signature features + a prop), no body-shaming.
Machine: CPU-only, ~9-15 GB free RAM shared with other agents; render stills one at a time; MP4s with --scale=0.5 --concurrency=1 --bundle-cache=false.
Final message: files, composition ids, output paths, strengths, weaknesses.`

phase('Engine+Cast')
const [engine, castA, castB] = await parallel([
  () => agent(`${COMMON}
TASK (key: pixelengine). Promote the pixel engine into a shared, documented module the whole show will use:
- Create ${STUDIO}/src/shared/pixel/** by moving/refactoring src/dev/pixeladv/core/* (px drawing, palettes + ramps, lighting, font, figure/sprite helpers) and PixelCanvas.tsx into a clean API: a <PixelScene draw={(fb, frame) => ...} palette=... switch=... /> component rendering a 480x270 indexed framebuffer at integer upscale; sprite/pose helpers; text + UI helpers (dialogue box, portrait window, name plate); palette sets: BASE, 2TONE_FREEZE (navy/cream), ONEBIT, EARLYWEB16, LEDGER, TERMINAL, plus remap utilities and MASKED remaps (apply a palette only inside a mask/cone — needed for the Orb scan and for 'freeze everything except Mas').
- ADD the GLYPH switch: render the framebuffer (or a masked region) as glyph tokens (monospace JetBrains Mono from src/shared/theme/fonts.ts via document.fonts.load + delayRender) — each native pixel/cell -> a glyph chosen by luminance with colour from the palette, optional bloom; plus a GLYPH DISSOLVE transition (a sprite/region breaks into tokens that drift/blow away over N frames, deterministic), and a RENDER-FRONT transition (a scanline sweep that upgrades palette A -> B), and a dithered crossfade.
- KEEP src/dev/pixeladv/* working (turn its core files into re-export shims to src/shared/pixel so both old and new imports work). Other agents are importing from src/dev/pixeladv/core/* RIGHT NOW — do not break those paths or exports.
- Write ${STUDIO}/PIXEL_GUIDE.md: canvas spec, palettes and when to use each (with the switch rules from the brief), sprite scale standards (room sprites ~70-90 px tall, portraits ~140 px, name-card layout), animation conventions (holds, swaps, whole-pixel moves, no rotation/scaling), API reference with examples.
- Demo compositions (own files: src/styleframes/pixelengine.frame.tsx, src/dev/pixelengine/**): 'pixelengine-switches' (the pixeladv room in every palette + a masked-cone remap + a glyph render), 'pixelengine-dissolve' (48 frames: a sprite glyph-dissolving and re-forming), 'pixelengine-renderfront' (48 frames: 1-bit -> EARLYWEB16 -> BASE sweep). Render to ${ROOT}/out/pixel/engine/.`, { label: 'pixel:engine', phase: 'Engine+Cast' }),
  () => agent(`${COMMON}
TASK (key: castmas). You are the character artist for MAS across eras + GERG + ALYI, in the approved pixel style. Own files: ${STUDIO}/src/shared/pixel/cast/mas.ts, gerg.ts, alyi.ts (create the cast folder; the engine agent creates other files in src/shared/pixel/ — do not touch those), src/styleframes/castmas.frame.tsx, src/dev/castmas/**, notes/castmas.md. Import drawing primitives from src/dev/pixeladv/core/* (stable shim paths) — and reuse/upgrade the existing Mas art from src/dev/pixeladv/art/mas.ts + portraits.ts (copy into your files, improve).
Deliver sprites + portraits as functions drawing into the framebuffer with pose/expression params:
 MAS (present): room sprite 3/4 FRONT at desk (typing/look-at-camera/turn), portrait (mouths A,E,O,M,rest,smile; blink; eye dart), hoodie, cowlick, calm eyes. MAS at 8 (1993, kid at beige no-logo computer, drawn for the 1-bit era), MAS at 23 (2008 on a stage, two stacked polos with both collars popped), MAS at 29 (2014, hoodie + tiny parachute pack, for the YC throne).
 GERG: slim coder, dark hair, focused, typing hyper-fast; keycaps pop off like popcorn; room sprite at the dinner table + portrait.
 ALYI: mystic co-founder — balding dome with short dark hair at the sides (design feature, not a joke), intense deep-set eyes, dark sweater; levitating cross-legged pose; portrait with eyes that can become scrolling token streams; room sprite.
Make a lineup sheet 'castmas-sheet' (1920x1080 still) showing all sprites/portraits/expressions with the BASE palette, and a 'castmas-motion' (48 frames) test of Mas blink + eye dart + mouth + Gerg typing + Alyi levitation bob. Render to ${ROOT}/out/pixel/cast/.`, { label: 'pixel:cast-mas-gerg-alyi', phase: 'Engine+Cast' }),
  () => agent(`${COMMON}
TASK (key: castrivals). You are the character artist for MARIO + NOLE + the skyline bosses, in the approved pixel style. Own files: ${STUDIO}/src/shared/pixel/cast/mario.ts, nole.ts, bosses.ts (create files only; do not touch other files in src/shared/pixel/), src/styleframes/castrivals.frame.tsx, src/dev/castrivals/**, notes/castrivals.md. Import primitives from src/dev/pixeladv/core/* (stable shim paths); reuse/upgrade Nole from src/dev/pixeladv/art/nole.ts + portraits.ts (copy into your files and improve the boxy room sprite).
 MARIO: curly dark hair, glasses, fleece quarter-zip (never red, nothing Nintendo), finger raised, anxious-earnest; emerges from a vault blast door; portrait + room sprite; a scroll prop that unrolls.
 NOLE: tall, broad, square jaw, swept dark hair, black tee, phone; landing pose leaning out of a small SPACEZ booster hatch holding a novelty check; portrait + room sprites (walk, jab, lean); improve silhouette/boxiness.
 SKYLINE BOSSES (tiny 16-28 px rooftop sprites, each with ONE readable motion loop of 2-4 frames): TASYA (calm, jangling a giant key ring), RADNUS (polite smile, extinguisher, code-red siren nearby), SIMED (speed chess vs a robot arm), KRAM (gold chain, holding a poster), NESNEJ (black leather jacket, tossing GPUs), tiny MARIO + ADELINA (clipboard) on the MISANTHROPIC lighthouse, tiny NOLE with a megaphone on the zAI gantry.
Make 'castrivals-sheet' (1920x1080 still) and 'castrivals-motion' (48 frames: Nole landing/jab, Mario finger raise, each boss loop). Render to ${ROOT}/out/pixel/cast/.`, { label: 'pixel:cast-rivals', phase: 'Engine+Cast' }),
])
const EC = `ENGINE REPORT:\n${engine}\n\nCAST A REPORT:\n${castA}\n\nCAST B REPORT:\n${castB}`
log('engine + cast done')

const MOMENTS = [
  { key: 'mcoldopen', frames: '0-119 (5.0 s) and the masked GLYPH Orb-scan glimpse at f99-104', prompt: 'COLD OPEN: dark room (upgrade the pixeladv room; now Mas faces 3/4 FRONT at his desk, lit by the monitor), THE ORB floating at his shoulder (chrome sphere + mechanical iris, pixel-rendered), the post composer on the monitor with a flat log chart and a "you are here" dot, typed line "near the singularity; unclear which side." (typed on screen; the voice-over will be added in audio), head tilt, eyes snap to camera, the Orb iris swivels, SCAN BEAM with the masked GLYPH glimpse of the endless data-center cathedral inside the cone for 5 frames, micro-smile, click Post: the line breaks into token chips (glyph) streaming past, the chart snaps vertical, flash to white on f118-119.' },
  { key: 'meras', frames: '120-239 (5.0 s)', prompt: 'ERAS: 1993 in ONEBIT — kid Mas (8) at the beige no-logo computer, screen facing away, turns to camera; the world becomes a 1-bit ALERT DIALOG name card "MAS MANALT / no equity." with Cancel greyed out; a stranger\'s pointer clicks Cancel — nothing — the kid clicks OK (f165). RENDER-FRONT sweep (f168-179) upgrading to EARLYWEB16 for 2008: Mas (23) strides onstage in two stacked polos (collars pop on f180 and f187) beside a faceless turtleneck sleeve, TPOOL on the giant screen, camcorder OSD "▶ PLAY JUN 09 2008" (tasteful); 2014 (f195-224): hoodie founders with forks and laptops hoist Mas (tiny parachute on his back) onto a throne of laptops and ramen cups, LUAP drops a paper crown ("WHY COMBINATOR"); f225-239 the crown\'s glint becomes a candle and the palette sweeps to BASE into the dinner.' },
  { key: 'mdinner1', frames: '225-359 (the dinner opening + GERG and ALYI cards)', prompt: 'THE WOODROSE dinner, BASE palette, candlelit, lateral camera truck done as whole-pixel scroll: GERG already seated, keycaps popping like popcorn, napkin sketch becoming a website -> FREEZE on f240: 2TONE_FREEZE remap of everything except Mas (masked); GERG portrait-window name card "GERG MOCKBRAN / ORG CHART: HIM." (egg stat row "SLEEP: DEPRECATED · PTO: 404"); Mas plucks the floating CTRL key and pockets it (f270-282). Then the wall lights into a SERVER CATHEDRAL (rack pillars, LED votives, neural-net rose window), ALYI levitates, a paperclip-robot effigy labelled UNALIGNED ignites; FREEZE f300: ALYI card "ALYI / FEELS THE AGI." (egg "PRODUCTS: 0 · BUNKER: YES"), his eyes are scrolling token streams (a tiny, tasteful glyph touch); Mas roasts a marshmallow on the frozen fire (f328-339).' },
  { key: 'mdinner2', frames: '345-479 (MARIO and NOLE cards + the OPEN->NOPE founding)', prompt: 'Continue THE WOODROSE dinner (match mdinner1\'s room/palette — coordinate by reading its files as they appear under src/styleframes/mdinner1* / src/dev/mdinner1/, but build your own composition): a round vault blast door with amber beacons and a safety HUD, MARIO steps out, finger raised, a DRAFT — DO NOT PUBLISH sheet flutters; FREEZE f360: MARIO card "MARIO / HAS CONCERNS. HAS GPUS." (egg "DOOM RISK ▰▰▰▰▰▰▰▰ · BUILDING IT ANYWAY ✓"); his scroll unrolls down the table and Mas rolls its tail into a telescope. Ceiling tiles burst and a SPACEZ booster descends onto the table, every glass sloshes EXCEPT Mas\'s water; FREEZE f420: NOLE card "NOLE / NAMED IT." + red stamp "SUED OVER IT." (f435), novelty check "$1,000,000,000*" with fine print "*pledged · received: $133M" (optional ≤6-frame LEDGER flash on the check). f465-479: wide on the frozen founders, Mas slides the neon N from the end to the front: OPEN AI -> NOPE AI (key-art frame).' },
  { key: 'mfinale', frames: '480-719 (slot, skyline, title, bookend)', prompt: 'SLOT (Ep1) f480-539: CHATGTP — Mas taps a tiny "low-key research preview" button, the palette blooms brighter, an odometer slams past 1,000,000 ("5 DAYS"); f495 FIRED.: a desaturated five-tile video call (MAS with Vegas neon behind, ALYI, NELEH, MADA, camera-off tile), a board pointer clicks Cancel — this time it works — Mas\'s tile GLYPH-DISSOLVES into tokens; f510 BACK.: color slams back, badge flips GUEST -> CEO, a tiny 72-hour hourglass shatters; f525-539 a heart avalanche (one blue heart) lifts the camera into a dusk sky. SKYLINE f540-629: pixel isometric dusk skyline, one tower pops per beat with its boss sprite (use castrivals bosses): NOPEAI neo-gothic data-center cathedral in scaffolding, MACROSOFT (plinth under NopeAI), ELGOOG/MINDDEEP, ATEM, INVIDIA (GPUs sag red-hot on NopeAI\'s roof), MISANTHROPIC lighthouse, zAI gantry, PEEKDEEP whale water tower across the water; f622 rooftops ignite into one cyan line. TITLE f630-689: "MR. MAS" pixel wordmark (adapt src/shared/title pixel version if it exists — read-only — or build your own) with the ORB as the period and subtitle "now in low-key research preview". BOOKEND f690-719: pull back into Mas\'s monitor in the dark room; on the final beat the Orb\'s iris shows the skyline in GLYPH for 2 frames; cursor blinks.' },
]

phase('Moments')
const moments = (await parallel(MOMENTS.map(m => () => agent(`${COMMON}
${EC}

TASK (key: ${m.key}). Build intro frames ${m.frames} as a Remotion composition '${m.key}' whose frame numbers MATCH THE INTRO TIMELINE (use Sequence/from offsets or a local frame = global - start; composition duration = the span length; export a helper so a later integrator can mount it at the right global frame). Use the shared pixel engine (src/shared/pixel/**) and the cast modules (src/shared/pixel/cast/**) — read-only; if something is missing, implement it in your own folder. Own files: src/styleframes/${m.key}.frame.tsx, src/dev/${m.key}/**, notes/${m.key}.md.
MOMENT SPEC: ${m.prompt}
Deliver: 3-5 key stills at 1920x1080 -> ${ROOT}/out/pixel/moments/${m.key}-<name>.png (the most important frames of your span), and the span as MP4 -> ${ROOT}/out/pixel/moments/${m.key}.mp4. Check timing against the beat grid (hits on 15-frame beats). Iterate until it looks like a finished show, not a demo.`, { label: `moment:${m.key}`, phase: 'Moments' }).then(r => ({ key: m.key, report: r }))))).filter(Boolean)
const MR = moments.map(m => `===== ${m.key} =====\n${m.report}`).join('\n\n')

phase('Critique')
const critique = await agent(`${COMMON}
TASK (key: pixelcritic). You are the ART DIRECTOR. Review every image in ${ROOT}/out/pixel/ (cast sheets, engine demos, moments stills; Read each PNG; for MP4s render a few frames as stills from the moments' dev entries if needed). Judge: pixel craft (clusters, readable faces, light ramps, no noisy dithering on skin), consistency of characters/palette/scale across moments, whether each STYLE SWITCH is motivated and brief and NOT CORNY, beat timing, readability of name cards, overall 'real show' quality. Output: per moment the top 3-5 concrete fixes (file + change), cross-moment consistency fixes, and any switch you would cut.
REPORTS:
${MR}`, { label: 'pixel:critic', phase: 'Critique' })

phase('Polish')
const polish = await parallel([
  () => agent(`${COMMON}
TASK (key: polish-a). Apply the art director's fixes for the CAST modules and moments mcoldopen + meras + mdinner1. You may now edit those files (other builders are done). Re-render the affected outputs in ${ROOT}/out/pixel/ (same filenames), LOOK, iterate. Report changes.
ART DIRECTOR:
${critique}`, { label: 'pixel:polish-a', phase: 'Polish' }),
  () => agent(`${COMMON}
TASK (key: polish-b). Apply the art director's fixes for the ENGINE and moments mdinner2 + mfinale. You may now edit those files (other builders are done; coordinate: do not edit cast modules — polish-a owns them). Re-render the affected outputs in ${ROOT}/out/pixel/ (same filenames), LOOK, iterate. Report changes.
ART DIRECTOR:
${critique}`, { label: 'pixel:polish-b', phase: 'Polish' }),
])
return { engine, castA, castB, moments, critique, polish }
