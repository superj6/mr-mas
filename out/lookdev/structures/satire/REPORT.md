**SATIRE (latex-puppet caricature): all deliverables are rendered and I checked them frame by frame.** The scene plays the full test beat at 960x540, 24 fps, 120 frames. I only touched files I own.

**Files**
- Scene: `/home/jgon/project/art/mrmas/out/lookdev/structures/satire/scene.mp4`
- Key still (frame 74, the "NAME!" jab): `/home/jgon/project/art/mrmas/out/lookdev/structures/satire/key.png`
- Extras in the same folder:
  - `extra-closeup.png`: close-up on Mas saying "super." (frame 106).
  - `extra-button.png`: the desk slam and the glint on the untouched water (frame 116).
  - `extra-lineup.png`: both puppets side by side on a workshop backdrop with a height scale.
- Composition ids: `satire-scene` (120 f), `satire-key`, `satire-extra-closeup`, `satire-extra-button`, `satire-extra-lineup`
- Code: `/home/jgon/project/art/mrmas/studio/src/styleframes/satire.frame.tsx`, plus `lib.ts`, `kit.tsx`, `MasHead.tsx`, `NoleHead.tsx`, `Bodies.tsx`, `Set.tsx`, `SatireScene.tsx`, `Lineup.tsx`, `devframes.tsx` and `entry.tsx` in `/home/jgon/project/art/mrmas/studio/src/dev/satire/`
- Notes: `/home/jgon/project/art/mrmas/studio/notes/satire.md`

**How the beat plays**
- **0–1 s:** Mas types with stiff alternating hand pats while his glass eyes jump across the screen, reading. The cyan monitor light flickers.
- **1–2 s:** The door flies open and warm hallway light floods the room. Nole is thrust in from the right with a sideways motion blur, a hop and an overshoot, his head lagging on a spring. Mas does not react.
- **2–3.5 s:** Nole leans in, jaw flapping on syllables, jabbing a glowing phone with a "?" on it. His line runs as TV-style subtitles, yellow for Nole and cyan for Mas.
- **3.5–4.5 s:** Cut to a close-up of Mas. His eyes move first, then his head turns, one slow blink, the tiniest smile: "super."
- **4.5–5 s:** Back to the wide. Nole slams his fist on the desk; the room jolts on springs and the coffee mug splashes. The water glass never moves or ripples, and a small glint on its rim lands the joke.

**What looks strong**
- **Sculpted heads.** They read as painted latex: glass eyes with a reflection of the monitor, a warm reddish band where light turns to shadow, a slight sheen, and warm and cool edge light from the door and the monitor.
- **Lighting drives the drama.** The only light changes are monitor flicker, the door flood and the phone glow, and they carry the scene.
- **The miniature set.** Soft background blur, city lights through the window, visible seams between the set walls, and the desk used as the puppet stage (the "playboard" the puppeteers hide behind).
- **The caricature stays on two features each.** Mas has huge calm eyes and the cowlick; Nole has the jaw and his height.
- **The water gag reads clearly** because the coffee mug next to it does splash.

**Weaknesses**
- **Nole's cheeks in flat light.** In the lineup's neutral light his lower cheeks read heavier than on set. The jaw should be carved flatter and harder so it can never read as jowls.
- **Nole's hair** still looks a bit like a helmet.
- **Mas's neck** is long and plain in the close-up.
- **Hands** are simple latex mitts. That fits the genre, but they are the least refined part.
- **Arms** only work when staged with the elbow hidden below the desk line.

**Rigging notes**
- **Moves well:**
  - Mouths are a hinged-jaw flap, which is what this genre actually uses. No mouth-shape library is needed; the flap just lands on syllables.
  - Glass eyes jump instantly between positions (the monitor reflection stays put while the iris moves), and blinks are a latex lid sliding down.
  - Head turns up to about ±20° come from one drawing, because the features are wrapped onto a curved head.
  - Head bob and tilt, springs on the cowlick, drawstrings, props and door, rod-arm jabs, and the entrance thrust.
  - Every control is a parameter on the character.
- **Would look cheap, and how the conventions hide it:**
  - Big head turns → cut to another camera, as puppet TV does.
  - Walking, legs and full-body acting → nothing below the desk exists, so characters are pushed in from the frame edge.
  - Fluid hands → stiff latex, and fists are always gripping a prop.
  - Lip-sync → the jaw flap is the genre's own style.
  - Arm mechanics → Nole's control rod is visible on purpose.
  - Physics → the set jolts on springs while the camera, a heavy studio pedestal, barely moves.
- **Cost per minute:** low to medium. Once the heads are built, animation is mostly setting keys: jaw syllables, eye jumps and springs. Heads and sets are the expensive part up front. Renders take about 1 s per frame at half size on this machine.
- **Sparing style switches:** good.
  - Money flashbacks can use engraving on a "stage painting" flat behind the puppets, or a cutaway to a flat insert.
  - AI or 1993 moments work as screen-inserts: cut to what the monitor shows in glyph or 1-bit style. The puppet world stays pure, and the switch reads as a TV cutaway.
  - Pushing the puppets themselves into those styles would fight their sculpted look.

Other builders are writing into the same scratchpad folder, so I moved my temp files and bundle into `scratchpad/satire/` to avoid collisions.