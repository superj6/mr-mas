export const meta = {
  name: 'mrmas-structures-b',
  description: 'Four more structurally different show styles (anime scene, noir motion comic, Gilliam engraved collage, painterly prestige realism) animating the same Mas/Nole beat',
  phases: [{ title: 'Build', detail: 'one builder per structure' }],
}

const ROOT = '/home/jgon/project/art/mrmas'
const STUDIO = ROOT + '/studio'
const COMMON = `You are a senior animation director + lookdev engineer on "MR. MAS", an animated satire of the AI race (Sam Altman -> MAS MANALT, Elon Musk -> NOLE). Working dir: ${STUDIO} (Remotion 4, React 19, TS).
FIRST read ${STUDIO}/ART_GUIDE.md and follow its builder rules (own files only, own dev entry src/dev/<key>/entry.tsx via makeRoot, deliverables in src/styleframes/<key>.frame.tsx, render + LOOK at PNGs with Read, iterate >= 3 times, notes/<key>.md). Others work in parallel — never edit files you don't own; you MAY import (read-only) existing shared modules.
LOOK AT the finished sibling structures for the quality bar and to avoid duplicating them: ${ROOT}/out/structures/{puppet,satire,pixeladv,screen,shape}/key.png (+ their REPORT.md). The best ones (pixeladv, screen) set the bar: they look like real productions.
SHOWRUNNER'S NOTES (binding): wants STRUCTURAL variety (construction, proportions, shape language, staging), not filters; must be realistic for us to animate with 2D rigs; "any simplification must look ARTISTIC, not like a limitation of our capability"; high craft bar.
THE TEST BEAT (identical across structures; 120 frames @ 24 fps, 1920x1080):
 0.0-1.0s MAS (grey hoodie, calm large-ish eyes, forward cowlick, small closed smile) types at his desk in a dark room lit by a cyan monitor; his glass of water on the desk.
 1.0-2.0s NOLE (tall, broad, square jaw, dark swept-back hair, black tee, phone) BURSTS IN from screen-right.
 2.0-3.5s Nole leans in jabbing his phone: "I came up with the name!" (dialogue in your structure's native presentation). Mouth animation.
 3.5-4.5s Mas slowly turns his head to him, one blink, the tiniest smile: "super."
 4.5-5.0s Button: everything jolts EXCEPT Mas's water (no ripple) — or a freeze-frame name card "NOLE / NAMED IT."
DELIVERABLES: '<key>-scene' (120 f) -> ${ROOT}/out/structures/<key>/scene.mp4 (--scale=0.5 --concurrency=1 --bundle-cache=false), '<key>-key' still -> ${ROOT}/out/structures/<key>/key.png (1920x1080, your best frame), 2-3 extras -> ${ROOT}/out/structures/<key>/extra-*.png (e.g. closeup, lineup, and ONE 'extra-switch.png' showing how a sparing style switch would look in your structure, e.g. an engraving money-flashback or glyph AI-POV moment). Verify motion by rendering stills at several --frame values and LOOKING before the MP4. Also write ${ROOT}/out/structures/<key>/REPORT.md with the same content as your final message.
Final message: files + composition ids; strengths; weaknesses; RIGGING NOTES (what moves well, what would look cheap and how the conventions hide it, cost per minute of show low/med/high, support for sparing style switches).`

const S = [
  { key: 'anime', prompt: `${COMMON}
STRUCTURE (key: anime): PRESTIGE TV ANIME (seinen: Psycho-Pass / Death Note / Monster maturity). The anime rig kit + ANIME MAS + ANIME NOLE already exist in src/shared/anime/** (built by the anime lookdev builder; read notes/anime.md and out/dev/anime/*). You own src/styleframes/animescene.frame.tsx, src/dev/animescene/**, notes/animescene.md, and may ADD new files under src/shared/anime/scene/** (do not modify the existing anime rig files; wrap/extend them). Output folder key = 'anime' (out/structures/anime/).
Use real anime staging conventions that make limited animation look intentional: dramatic held frames, camera pans across stills, a smash cut to a tight Nole close-up on his line with speed lines, a slow push on Mas's eyes for "super.", light flicker, sakuga-free but stylish timing, lip flaps. Painted background (soft) + cel characters.` },
  { key: 'comic', prompt: `${COMMON}
STRUCTURE (key: comic): NOIR GRAPHIC-NOVEL MOTION COMIC — but premium: the frame is a comic PAGE with panels (gutters, panel borders, captions, hand-lettered balloons, SFX lettering like "SLAM"), and the virtual camera travels between panels while each panel has its own internal parallax and limited motion (blink, head turn swap, flicker). Heavy blacks, one spot color per scene (cyan monitor vs Nole's red/orange doorway), halftone textures in the prints. You may import (read-only) the tonal rigs src/shared/tonal/masTone.ts, noleTone.ts, env/* and ToneSvg's noir style, OR draw your own ink-heavy versions if that looks better — the construction here is the PAGE/PANEL structure. Own: src/styleframes/comic.frame.tsx, src/shared/comic/**, src/dev/comic/**, notes/comic.md.` },
  { key: 'collage', prompt: `${COMMON}
STRUCTURE (key: collage): SATIRICAL ENGRAVED COLLAGE CUT-OUT (in the tradition of Terry Gilliam's cut-out animation and Victorian political satire): characters are collaged from engraved/etched cut-outs (heads rendered as banknote-style line engravings, bodies from vintage catalogue-engraving fragments), with visible cut edges, paper tone differences, absurd mechanical motion (heads that hinge open, jaws on pivots, limbs that pop on and off), vintage ephemera backgrounds (a dark room made of engraved plates, a monitor that is an engraved cathode tube cabinet with a cyan hand-tinted glow), hand-tinting spot color. Nole's entrance can be a giant engraved hand/foot or a steam-age rocket crashing in. Use the engraving renderer (src/shared/tonal/ToneSvg.tsx style 'engrave', read-only) with the tonal rigs (masTone.ts, noleTone.ts) and/or your own engraved parts. Own: src/styleframes/collage.frame.tsx, src/shared/collage/**, src/dev/collage/**, notes/collage.md.` },
  { key: 'realism', prompt: `${COMMON}
STRUCTURE (key: realism): PAINTERLY PRESTIGE REALISM — "closer to realism": realistic proportions (7.5 heads tall, real eye size, anatomical planes), digital-painting rendering (soft gradients, blurred form shadows, crisp cast shadows, subsurface warmth at the terminator, brush-texture overlays, cinematic depth of field, film grain), in the spirit of painted prestige 2D (Arcane-like texture / rotoscope-drama feel) — but built from scratch with your own construction, NOT the existing masTone (its semi-real design looked generic and its head/neck joint broke). Caricature only in 1-2 features (Mas: slightly large calm eyes + cowlick; Nole: jaw + height). Staging like live-action cinema: shot/reverse-shot, shallow focus rack from Mas to Nole, motivated lighting (cyan monitor key, warm doorway rim when Nole enters). Limit motion to what reads as restrained acting (breath, blink, eye darts, slow head turn via 2-3 drawn angles cross-dissolved on a blink, mouth shapes), which is the genre's convention. Own: src/styleframes/realism.frame.tsx, src/shared/realism/**, src/dev/realism/**, notes/realism.md.` },
]

phase('Build')
const out = await parallel(S.map(s => () => agent(s.prompt, { label: `struct:${s.key}`, phase: 'Build' }).then(r => ({ key: s.key, report: r }))))
return out.filter(Boolean)
