The GRAPHIC-SHAPE CINEMA structure (key `shape`) is done: the 120-frame scene renders cleanly, and I checked the key frame, the three extras and a 16-frame contact sheet from the MP4 by eye. The main problem left is Nole's profile head, which still reads as a helmet with a crest.

**Files and composition ids**
- `shape-scene` (120 f, 24 fps) → `/home/jgon/project/art/mrmas/out/structures/shape/scene.mp4` (960x540, `--scale=0.5 --concurrency=1`)
- `shape-key` (the f74 two-shot, full 1920x1080) → `/home/jgon/project/art/mrmas/out/structures/shape/key.png`
- `shape-extra-lineup` → `.../extra-lineup.png`: shape-language model sheet with the construction shapes marked
- `shape-extra-mascu` → `.../extra-mascu.png`: Mas's head turn, blink and "super." in five heads
- `shape-extra-switch` → `.../extra-switch.png`: the same close-up as show look, money flashback and 1993
- Code: `src/dev/shape/entry.tsx`, `src/styleframes/shape.frame.tsx`, `src/styleframes/shape/*` (core, lit, fx, mas, nole, set, scene, extras). Notes: `studio/notes/shape.md`.

**The five shots**
- **Wide (0–23):** flat side-on room in a 2.39 widescreen frame. Mas types inside a cyan wedge of monitor light, with his big cast shadow on the wall. A red blade of light under the door flares at f18. The desk rattles on a rumble but the water never moves.
- **The door (24–47):** a one-frame impact frame (cream background, red sunburst, black silhouettes). The door flies off, then Nole holds a pose jammed shoulder-to-frame against a rocket-glow sunburst, and leaves on a smear.
- **Two-shot (48–83):** Nole smears in and lands. His phone hand snaps between poses and ends up between Mas and his monitor. His jaw drops to talk. Mas keeps typing. Dialogue is a subtitle in the lower black bar.
- **Mas close-up (84–107):** his eyes move first, then his head turns into the red light. One blink, the tiniest smile, "super." Nole looms in from the top right, chin first.
- **Button (108–119):** I chose the freeze-frame name card over the water gag. The frame flattens to red, black and cyan, and "NOLE / NAMED IT." slams in. The water gag survives as a quiet setup in the wide shot.

**What looks strong**
- The two-colour light plan: cyan on screen-left for Mas, red on screen-right for Nole. The close-up where Mas's face splits between the two is the most striking image.
- Clear silhouettes and staging: the small egg-shaped Mas against the huge wedge of Nole.
- The impact frame and the name card read like real title design, not effects.
- Texture sits only at the edges (rough gouache contours and dry-brush light edges); flat areas stay solid colour. It doesn't read as a filter.

**Weaknesses**
- Nole's profile head still reads as a helmet: the swept-back hair plus the red rim light looks like a crest. It needs a drawn hair shape.
- At wide-shot size, Mas's profile hair is one dark mass.
- Nole's arms can look tube-like.
- The lighting method can put rim light on inner edges of concave shapes.
- The engraving switch is a line screen applied to the finished frame. A real money flashback should use per-part hatching and a light background.
- The door smear at f30 covers most of the frame for about two frames.

**Rigging notes**
- **Moves well:** snappy pose-to-pose moves with overshoot (characters on twos, camera and light on ones), the phone arm, hip lean, jaw drop, blinks and eye darts. Light animation is cheap because each light is just a shifted copy of the shape; the same trick gives the cast shadows for free. Mas's head can turn smoothly about ±40° because it is an egg, so the features just slide across it.
- **Would look cheap, and how the style hides it:**
  - *Full-body acting:* we hold poses and snap between them instead.
  - *Turning Nole:* we cut between his profile and front drawings; his wedge stays a wedge.
  - *Walks:* entrances happen as smears and cuts.
  - *Close-up lip-sync:* Nole's chin drops like a nutcracker's, and Mas barely moves his mouth by design.
  - *Stillness:* texture boils on held poses and the camera moves, so held frames don't feel dead.
- **Limits:**
  - Two drawings per character.
  - Hands are mittens or fists, so any finger acting needs an insert drawing.
  - Each new camera angle is a new drawing.
  - The edge-texture effect costs render time; bake it into held poses for production.
- **Cost per minute: low to medium.** Most of the spend goes on layout, colour and cutting. New angles are the expensive part.
- **Sparing style switches: very good.** Every colour is one of about four value steps, so a line screen reads as money engraving and an ordered dither reads as 1-bit/1993 on the same rig (`extra-switch.png`). The card's silhouette look is a third mode that comes for free.

The machine was overloaded (load average around 46), so I rendered from a private bundle at `scratchpad/shape-bundle`. Another builder had overwritten the shared `scratchpad/bundle` folder, so builders should each use their own folder name.