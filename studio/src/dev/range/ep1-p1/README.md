# E1-P1 · CLOD under its launch light (style-range 1.A) · handoff

A fully programmatic filler for Ep1 sc 11, the split-screen duel (Mar 14, 2023), from phrase 1 to the cut to sc 12.
CLOD, MISANTHROPIC's product, is the only thing in clay: a stop-motion puppet rendered with three.js on the iGPU
and composited at output resolution into the pixel lighthouse pane. Everything else is pixel. The verb band stays
in place and readable for the whole clip (round 6). The brief is `show/bible/style-range.md` §6.1a, "E1-P1". No
external API was called. R24 (the whole pane in clay, `ep1-p1-b.mp4`) is not ruled on, so that cut is not built.
Current state: **round 6** (2026-09-27). Round 5's notes follow round 6's; where they disagree, round 6 wins.

## Outputs (`out/range/ep1/`)

| File | What |
|---|---|
| `ep1-p1.mp4` | 660 f (27.5 s), 24 fps, 1920×1080, H.264 crf 16 + AAC 256k, the temp sound pass |
| `ep1-p1-key-1-pixel-clod-p150.png` | phrase 1: CLOD unlit on its plinth, a pixel figure; Mario's finger on "…same day" |
| `ep1-p1-key-2-launch-p268.png` | the launch: clay CLOD rising out of its bow to face us, "…right!", `CLOD 1 · SAME DAY` |
| `ep1-p1-key-3-the-hold-p452.png` | the hold: CLOD square to the lens, its head cocked at Mario |
| `ep1-p1-key-4-watching-p520.png` | CLOD's head following the second scroll, which runs behind the plinth |
| `ep1-p1-sheet.png` / `ep1-p1-sheet-blind.png` | 34 frames from the encoded mp4, captioned / numbered only |

All stills and sheet tiles are pulled from the encoded mp4, not from the renderer.

## Timing (660 f, not 600)

Mario's temp memo runs 206 f, past the brief's p176 limit, so the clip opens a bar early (phrase 1's downbeat),
as the brief allows: every brief frame is +60 here (`timeline.ts`, `B(p)`). The clunk is p240, the clay runs
p240–599 (15 s), and the cut to sc 12 is p600 (rail `MAR 22, 2023` from p604).

- p0–239 pixel split. Gerg photographs the napkin; CLOD stands unlit on the plinth as a pixel figure made from the
  clay's own first key (`tools/pxclod.ts`); Mario's plate shows p8–96. Mario dictates the memo and writes it down
  (p96–127, p166–239), jabbing his finger on "…on the same day as them." (p128–165).
- p240 **the strike.** The can's clunk on the downbeat, and in the same frame the light is full and CLOD is clay.
  The frame flashes: one extra rung on the pixel light and a lens star for p240–241, the clay overexposed and
  settling over p240–245 (`FLASH_EXP` ×1.9, ×1.38, ×1.12). The `SAFETY` lantern browns out p240–249 in two held
  steps. Mario hops back (p240–243) and holds his startle, hand to chest, mouth open (to p255).
- p240–261 the bow on 2s, toward Mario. "You're absolutely right!" plays p244–276 on three replacement mouths.
  p262–280 it rises out of the bow and squares to the lens. `CLOD 1 · SAME DAY` shows p252–331.
- p262–599 **the moving hold** (`gl/cels.ts` `MOVES`), CLOD facing us. It breathes (a lean and chest swell, 64–88 f
  a breath, uneven), its surface boils through 4 replacement surfaces on 2s in a hashed order, the wheel turns in
  eighths, and its head acts on the scene's beats in eased moves on 2s:
  - p300–312: it looks where Mario looks, up at the split line (Mario looks up, held p300–317).
  - p312–322: back to him, head cocked, for "Addendum." (Mario's finger up p318–352).
  - p392–408 and p422–438: it nods along while he writes his line (p390–449).
  - p486–510: it follows the second scroll across the floor toward the split.
  - p570–584: back to Mario at his empty spindle (`beam`), and the grin mouth from p586.
  - Blinks (replacement lids) on the head turns (p300, p486, p570) and after "Addendum." (p352).
- p300–599 the duel plays around it: the post (p365–473), the cheers, Gerg glancing up at the site going live (p277,
  p572), the second scroll behind the plinth and across the split, the website, the empty spindle.
- p600–659 sc 12, over Mas's shoulder at night, with `PAUSE GIANT AI EXPERIMENTS` on his monitor.

## What round 6 (this pass) changed, and why

A cold review of round 5 (the mp4 of 2026-09-26 23:53) found three things to fix first: Mario's warm light was a
brown slab, the clay insert sat on the pane instead of in it (a dim clay CLOD before the light, hunched and turned
away, a speckled clipboard, a belly that read as a hole, soft edges), and the band's bottom quarter was dead. It also
listed misreads: Mario's startle, look-up and "adds a line" couldn't be seen at 480 × 270; the floor scroll read as a
loading bar; the `GTP-4` banner's raised T read as a font bug; `CLOD 1 · SAME DAY` and the post were barely legible;
the pixel cast was nearly frozen. Round 5's pixel.ts edits after that render (23:59) were never rendered; this pass
builds on them. Each fix below names what the reviewer saw.

**1. Mario's light and Mario's acting (`pixel.ts`)**
- **A rim, not a coat** ("a flat, hard-edged brown fill... a second brown coat or a ghost double"). Only his
  silhouette's edge facing the lens (its left pixels and upper-left corners) takes the tungsten ladder three rungs
  up, an amber rim line; the pixel inside each steps one rung up its own ramp. The fleece stays blue.
- **He acts, in held drawings** ("one- or two-frame pose changes you can't see at 480"). `marioAt` + `marioImgFor`
  (the cast's own figure, recomposed here; `cast/mario.ts` is untouched):
  - p96–127 and p166–239 he writes the memo as he dictates it: a writing arm across his belly to the roll in his far
    hand, the pen hand stepping along the line and back, head and eyes down. p128–165 the finger jabs "…the same day
    as them." The pen scratches are in the sound too.
  - p240–243 **the strike**: a 3 px hop back and 1 px up, a squint, hand to chest, mouth open. p244–255 held (12 f):
    hand to chest, brows up, mouth open, then closed. p256–299 he watches CLOD bow at him, a step back.
  - p300–317 he looks up past CLOD to the split line (head up a pixel, 18 f held); p318–352 finger up for
    "Addendum."; p365–389 head down over his phone for the post; p390–449 he writes his line (the same writing arm);
    blinks at uneven gaps (70–117 f), never on a clock.

**2. The clay insert sits in the scene and faces us**
- **The swap happens inside the flash** ("the clay appears dark for about 2 frames before the light rises... a pop
  and then a light"). The filament ramp and the night twins are gone (`timeline.ts` `lightAt`, `flashAt`,
  `flashExpAt`; `gl/cels.ts`). On the clunk (p240) the light is full, CLOD is clay, and the frame flashes: the pixel
  light takes one extra rung for that drawing (pool, wall spot, beam, spill, Mario's rim) and the lens throws a small
  four-point star; the clay is overexposed and settles over three drawings (×1.9 with a warm lift, ×1.38, ×1.12),
  under a soft shoulder that tops out at 75 % luma (76.5 % measured after the encode). The pixel CLOD is on screen up to p239.
- **The world reacts** ("nothing else in the world reacts to it except a flat tint on Mario"): Mario's hop, and the
  lighthouse's `SAFETY` lantern browns out as the launch light pulls the power, two rungs for p240–243 and one for
  p244–249, then comes back (`SAFETY_DIP`).
- **It turns to face us** ("hunched and turned 3/4 away over his clipboard... the star of the new medium shows us his
  back"). Poses gained `body`, a whole-puppet turn on its tie-down (`gl/cels.ts`, `CelRender.tsx`). It bows at Mario
  as before, then rises out of the bow and squares to the lens over p262–280, like a product on its launch plinth:
  upright (lean 0.03 where round 5 held 0.30), face lifted, head a little toward Mario. The hold's beats are all head
  moves from there (the split, "Addendum.", the nods, the scroll, the grin at Mario's spindle, a new `beam` key).
- **The clipboard** ("mottled, speckled... camouflage or a texture error"): its page is a clean part (no mottling,
  no grit, no dents, almost no normal map), with three bold rolled lines and a big red tick: a checklist.
- **The belly** ("the dent with a white crescent reads as a hole or wound"): the niche is 5 mm deep (it was 9), its
  back is shadowed terracotta (it was near-black), the wheel sits 6 mm further out and is tipped 0.95 rad so its head
  is a grey disc (it showed only a pale crescent), and the lump on it is a small pot, a shade lighter than CLOD.
- **Tighter edges** ("smooth, softened edges pasted onto a hard-pixel world"): aperture 0.04 → 0.02, and the light
  wrap is 2 px at 0.35 (it was 5 px at 0.55, a halo).
- **The beam in hard steps** ("the soft cone... not pixel-quantized"): two rungs by the lens, one down the cone, a
  clean stepped end; the checker taper that blurred into a gradient at phone size is gone. The pool, wall spot and
  spill were already whole rungs with hard edges.

**3. The bottom band, the paper, the text**
- **The band stays whole and readable** ("the bottom ~25 % of the frame is empty black... looks unfinished"; "too
  dim and too short... near-illegible at 480"): the adventure layout's own band, undimmed, for the whole clip, so its
  jokes play throughout: `Open` struck out, and Mas's inventory, a nonprofit charter, a GPU and an orb. Its position
  never moves. (Round 5's reviewer had called the dimmed band illegible and a quarter of the frame; this pass takes
  the other reviewer's "persistent verb and inventory" option.)
- **The paper** ("drawn flat and hugs the bottom edge... a loading bar"): the floor run leaves the frame's edge and
  lies in the room. It follows a meandering path that recedes toward the split (y 195 at his heels, 190 at the
  divider, 194 at Gerg's desk), passes behind the plinth and the can's tripod, turns gold where it crosses the pool,
  lifts off the floor in curls with their shadow under them, throws a two-row shadow, and the second scroll leads
  with a round roll. The first sheet's free end curls up.
- **`GTP-4`**: the letters sit on one baseline (the bobbing T read as a baseline bug).
- **`CLOD 1 · SAME DAY`** is held 80 f (p252–331), like Mario's plate; it was 40 f.
- **Mas's post**: the quote is set in the 14 px display face on two lines, `"…still flawed,` / `still limited…"`.
  The card covers the `GTP-4` banner whole and the top of the demo screen.

**Kept from round 5:** the moving hold (breathing, head moves on the story beats, the boil in a hashed order, the
wheel in eighths), the blinks, the dust motes, the wall hot spot with CLOD's projected shadow, the held lighthouse
lamp, the office tees, Mas's day face, Gerg's glances, sc 12's display-face title.

**Declined:** cropping to the panes (the band's position is the bible's grammar, and a crop would change the
frame for one shot); the room-wide ordered dither (the shared engine's approved look, flagged in round 5).

## What round 5 changed, and why (for the record)

Superseded by round 6: the filament's ramp and night twins, Mario's near-side rungs, the band stepping out, the
beam's checker taper, the scroll's floor line along the frame's edge, the hunched hold, the bobbing banner letters.

A cold review of round 4 found the reveal pasted on, the hold frozen, loops ticking and several misreads. Each fix
below names what the reviewer saw.

**The reveal belongs to the room, and CLOD stays alive**
- **The filament's ramp** (reviewer: "the lamp pops on in one frame"): 8 frames in four held steps, as above. The
  brief's "the light's pop is one step" was there to rule out a strobe. The ramp keeps that intent and never
  flashes, and the pop still peaks under 80 % white.
- **The light lands** (reviewer: "a flat see-through wedge that lights nothing; the wall, floor and Mario don't
  change"). There's now a hot spot where the cone lands behind CLOD: the back wall, the desk stack and the phone,
  three rungs, with CLOD's silhouette projected from the lens cut out of it. The beam is narrowed to CLOD, with two
  rungs near the lens, and it's gone by the time it reaches the figure (a one-band checker taper). Eleven dust motes
  drift in the beam, a pixel at a time. The floor pool and desk spill have hard rung edges (their ordered-dither
  seams read as speckle round the clay). Mario's near side takes two rungs on the edge and one on the next three
  columns (it was one rung that nobody saw). The spill is capped at 78 % white, and he throws a floor shadow.
- **Mario reacts:** the startle, then he watches CLOD bow at him, where before he kept writing.
- **The clay graded into the pane** (reviewer: "sharper, smoother and differently lit… a sticker"). `CelRender.tsx`
  has a harder stage key (a smaller source, less fill), so the clay has a shadow side and a terminator like the
  pane's banded light. The aperture is roughly halved (0.075 → 0.04), because the soft lower body was the likeliest
  pasted-in tell. `P1.tsx` adds a light wrap: the pane's own light, blurred, bleeds a few pixels onto the silhouette.
- **The moving hold** (reviewer: "moves for about 1 second, then freezes for about 14 seconds… a tech demo"): as
  above. This departs from the brief's "the pose still"; a stop-motion moving hold is the standard fix.
- **The pixel CLOD before the launch** (reviewer: "a murky brown blob… a gingerbread man or bear"): its night rungs
  go one step higher, the SAFETY lamp catches the top of its head, and each eye bead has a glint.

**No metronomes; people act**
- **The lighthouse's lamp is held** at 45° for this scene (`LAMP_F`). Turning, it stepped every 3 f (reviewer: "the
  lantern flickers on a 3-frame cycle") and swept a patch of brick every 1.25 s (reviewer: "blinks… reads as a
  glitch"). Its gear's 3-frame tick is gone from the sound too. Mas's breath now toggles at uneven gaps (40–63 f),
  where it used to be every 48 f.
- **The office people** (reviewer: "heads on armless blob bodies"): the table sprites' near-black tee is lifted to
  Gerg's blue and the coworker's grey (a map in `pixel.ts`; the cast file is untouched), so shoulders and forearms
  separate from the laptops.
- **Gerg's keycap popcorn is off** in this clip (reviewer: "white pixel specks… noise or dead pixels").
- **Mas's face** (reviewer: "lit teal-green… sickly"): his desk sprite is lit for the cold open's dark room. Here it
  takes the day bullpen's skin and neutral rims (`MAS_DAY`).
- **Gerg glances** up at the site each time it goes live, and his typing stops in the sound.

**Legibility and the frame**
- **The band** (reviewer: "illegible at 480×270, and it takes 25 % of the frame"): the bible's grammar keeps its
  position ("the band's content changes, never its position"), so it stays in place. After the opening beat
  (p100–107) its verbs and inventory step out in three held steps, leaving a quiet bar with the date.
- **The scroll** (reviewer: "a ruler, ladder or piano keys stuck to his leg… a progress bar or cable"): it's paper
  now.
  - It hangs from his FAR hand, so it's drawn behind him. It bellies back and swings under his heels.
  - The roll's ends show at his fist.
  - It's 8 px wide, with ink-blue lines of uneven length in paragraphs.
  - On the floor it's a sheet a hand wide seen edge-on: 5–6 rows, a faint mottle for the writing, a shadow and a
    round roll at its leading end.
  - Its brightest colour is P1 (77 %). P2 measured 91 %.
- **The diagonal line** (reviewer: "a scratch or a stray line"): the stair's rope handrail and its stanchions are
  painted out of this pane (`eraseRail`).
- **sc 12's title** (reviewer: "GIANT reads as 6IANT"): it's set in the engine's 14 px display face (`bigText`),
  where it used to be the 7 px face struck twice.

**Declined, with reasons**
- **Going full-frame on the right pane for the reveal.** The rooms are 480×203 plates at a fixed pixel density, so
  CLOD wouldn't get any bigger. Dropping the split would also lose the duel's grammar and the scroll-across-the-split
  joke. The band also can't retract here: in the bible it retracts only for full-frame leaps, and this is a leap
  inside a frame.
- **The room-wide ordered dither** on the bullpen's walls and ceiling and in the lighthouse's paper (reviewer: "look
  like a dither filter"). That's the shared engine's approved look, used across the show, so changing it in one
  prototype would make this pane disagree with every other shot. It's flagged for the lead as an engine-wide note.

## Re-run (from `studio/`)

```
S=<your scratch dir>
src/dev/range/ep1-p1/tools/build.sh $S            # all stages: voice cels px clip sound mux stills
src/dev/range/ep1-p1/tools/build.sh $S clip mux stills   # picture-only change (needs $S/pub/cels and $S/sound.wav)
../audio/.venv-mix/bin/python src/dev/range/ep1-p1/tools/motion.py <tile crops t000.png..> $S/pub/cels/cel-110.png
```

- Run heavy stages through `ops/heavy.sh` (the machine-wide slot limit), in the background, and poll the log:
  `nohup ../ops/heavy.sh src/dev/range/ep1-p1/tools/build.sh $S cels px clip sound mux stills > $S/build.log 2>&1 &`.
- The `voice` stage makes the stock Kokoro takes locally into `$S/vo` and writes `gen/takes.json`. The takes are
  reproducible byte for byte, so round 6 skipped the stage and copied round 5's `vo/` into its scratch. The `sound`
  stage needs `$S/vo`.
- `cels` probes the GL renderer first and refuses anything that isn't the iGPU. There are 184 cels: 180 lit (every
  hold drawing is unique) and the 4 phrase-1 night and id keys (round 6 dropped round 5's 4 ramp night twins).
- `px` writes `gen/clod-px.json`: the pixel CLOD, the shadow rungs per key pose (round 6: from the drawing nearest
  each key, not the first one named for it), and the clay's coverage per key pose for the wall shadow.
- A few clay cels without the whole build (to look at a sculpt change): bundle `entry.tsx`, then
  `npx remotion still <bundle> ep1-p1-cels <out.png> --frame=<cel index> --gl=angle` (about 5 s a cel). The frame →
  cel index map is `celIndexAt` in `gl/cels.ts`.
- Tile crops for `motion.py`:
  `ffmpeg -i ep1-p1.mp4 -vf crop=400:384:1116:404 -start_number 0 <dir>/t%03d.png`.
- Fast pixel-only preview (no clay):
  `npx esbuild src/dev/range/ep1-p1/tools/preview.ts --bundle --platform=node --outfile=$S/pre.cjs`, then
  `node $S/pre.cjs <out> 1 src/dev/range/ep1-p1/gen/takes.json src/dev/range/ep1-p1/gen <frames…>`.
- Times, round 6 (a loaded machine, load 10–20 on 14 threads): cels 143 s (184 cels, iGPU, `--gl=angle`), clip
  72–73 s (`--concurrency=4`), sound 7 s, mux and stills about 1 min. `cels px clip sound mux stills` took 711 s
  wall clock including the wait for a heavy slot; the picture-only `clip mux stills` took 187 s.

## Measured (from the encoded mp4, `tools/motion.py`, ffprobe)

Round 6's final render (2026-09-27 02:02). Clay-only numbers use each frame's own cel coverage as the mask.

| Measure | Value |
|---|---|
| Format | 1920×1080, 24 fps, 660 frames, picture and sound both 27.500 s, 2.13 MB |
| On 2s, inside the clay | an odd frame differs from the frame before it by 0.034 (max 0.148); a new drawing by 5.8 |
| The hold's boil | 4.5 per drawing (3.1–10.2); 3 near-identical pairs among 13,041 hold-drawing pairs |
| The entry | p238→p239 0.03 (held pixel CLOD); p239→p240 36.5 (the strike: the swap and the flash in one frame) |
| The strike's clay (mean luma) | p240–241 146, p242–243 115, p244–245 102, p246 83 (the hold sits at about 105) |
| Clay whites | max 195 of 255 (76.5 %) on every frame p240–599, the flash frames included (round 5: 72.5 %; this pass's first render: 79.6 % on the flash, then the shoulder was lowered) |
| Room whites | the tile's pre-existing desk-lamp paper measures 230 (90 %) before and after the light; the can's light adds no pixel over 78 % |
| Sound (temp) | −16.0 LUFS, peak −1.58 dBFS, quietest 100 ms −33.3 dBFS (under Mas's post), bars −15.6 to −25.7 dBFS |
| Band text | verbs N7 on N1 about 2.95 : 1 and inventory labels N7 on N2 about 2.8 : 1 (the approved band's own colours, undimmed); the rail's date P1 on N1 about 11.6 : 1 |

Seen in frames pulled from the encoded mp4 (not measured): at 480×270 CLOD's eyes, smile, bow tie and clipboard
tick read, `CLOD 1 · SAME DAY` and the post's quote read, the band's verbs and inventory read, and the paper reads
as a strip lying in the room rather than on the frame's edge.

## Needs a human

- Watch and listen at full size and at phone size. I can't watch in real time or listen.
- **The strike.** Does p240's blown amber CLOD (two frames) read as a light slamming on and the camera catching up,
  or as a glitch? It doubles the clay tile's brightness for 2 frames, once (not a repeating flash).
- **The turn to the lens.** CLOD now holds square to us, which departs from the bible's "holds its bow's last key".
  Does the product-on-its-plinth presentation play, and is the face readable enough at phone size?
- **Mario's acting.** Do the hop and held startle, the look up (a 1 px head move, held 18 f) and the writing arm read
  at 480×270? The writing arm crosses his belly to the roll in his far hand: does it read as writing, or as hands
  clasped?
- **The `SAFETY` dip.** A new beat (the launch light browns out the SAFETY lantern). Funny and quick, or too cute?
- **The band.** It's back, whole and readable. Is that better than round 5's quiet bar? At about 3 : 1 its verbs are
  readable but not bright; brightening them would be an engine-level change to the approved band.
- **The belly.** At phone size the wheel is a grey disc with an orange dot in a ring. A potter's wheel, a button, or
  an eye?
- **The blind read, the moving hold and loops:** does the clay sit in the pane; are the head moves in character; does
  the 15 s hold (30 s in the episode) show a loop?
- **The temp mix:** MM-04 and MM-17 are engine temps; the clunk, filament, press, whirr, rustle, pen and felted
  upright are synthesised; the voices are stock presets.

## Open issues and weaknesses

- The clip is 660 f, not 600, because of the memo take. In the episode the clay runs about 30 s, twice this sample,
  and the moving hold's beats would need re-spacing to the episode's timing.
- It's still a 3D render in a pixel pane, by design. Tighter focus, a narrower light wrap, the strike and the rungs
  the clay throws reduce the pasted-in risk; they don't remove it.
- Mouths and lids are 1–2 px at 480×270. Facing us, the face reads by the eyes, smile, bow tie and head turns.
- Mario's rim is on every left-facing edge of his silhouette, so both legs carry an amber line. The look up is only
  a pixel.
- The writing arm and the head attitudes are composed in `pixel.ts` from the cast's figure (`marioFigure`), not
  drawn by the cast's artist. If they're kept, they belong in `cast/mario.ts` as real poses.
- The paper's path and curls are code-drawn; at phone size it's still a thin strip, now in the room.
- The wall hot spot is a clean-edged ellipse in three rungs, not a physical cone footprint.
- The desk behind CLOD holds the room's own whites (about 90 % after encoding): pre-existing room art.
- Final route (R22, the showrunner's pick, on paper only): a stop-motion day, a scanned maquette, a video model for
  the clay body only (code keeps the mouths and timing), or this filler as the final. Nothing was spent.
