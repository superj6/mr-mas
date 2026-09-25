The pixeladv structure is done. The 5-second beat is staged as a 1990s point-and-click adventure game in true pixel art. Everything is drawn on a 480x270 grid and scaled 4x with no smoothing; nothing is a filter over a vector drawing. I checked every beat by looking at rendered stills, over well past three rounds of fixes, and confirmed the MP4 is 960x540, 24 fps, exactly 120 frames (5.0 s), with frames matching the previews.

**Deliverables** (in `/home/jgon/project/art/mrmas/out/structures/pixeladv/`):

| File | Composition id | What it shows |
|---|---|---|
| `scene.mp4` | `pixeladv-scene` | The full beat, rendered at `--scale=0.5 --concurrency=1` |
| `key.png` | `pixeladv-key` | Frame 74: Nole jabbing on the fully typed "I came up with the name!", portrait up, verb bar and inventory visible |
| `extra-portraits.png` | `pixeladv-extra-portraits` | Both dialogue portraits, plus their swappable mouths and eyelids at 2x, including the one-pixel smile |
| `extra-lineup.png` | `pixeladv-extra-lineup` | Height lineup (Mas 74px, Nole 86px), Nole's walk/silhouette/jab/raise/slam frames, Mas's desk drawings, the palette |
| `extra-switch.png` | `pixeladv-extra-switch` | One frame in four palettes: base, 1-bit, "ledger" (money flashbacks), terminal teal |

My code is `src/styleframes/pixeladv.frame.tsx`, the dev entry `src/dev/pixeladv/entry.tsx`, and everything under `src/dev/pixeladv/`. Notes are in `studio/notes/pixeladv.md`. I touched no shared or other builders' files, and the project typecheck is clean for my files.

**How the beat plays**
- **0–1 s:** Mas is seen from behind, silhouetted against his cyan monitor, typing while code appears on screen. The game cursor drifts to his glass and the command line reads "Look at glass of water". That plants the ending.
- **Background gags:** the verb "Open" is struck out, "Pivot" and "Raise" replace Push/Pull, and the clock reads 1:36.
- **Just before 1 s:** feet break the strip of light under the door.
- **1–2 s:** the door bursts open with a hallway flash and a 2px shake, and the wall poster is knocked crooked. Nole stands as a black silhouette in the doorway, his long shadow running down the light toward Mas. The interface dims into cutscene mode. He walks in and his colours step from silhouette to room-lit.
- **2–3.5 s:** Nole leans in and jabs his phone on "came" and "name". His portrait window opens, the line types out, and his mouths follow the letters.
- **3.5–4.5 s:** Mas's head turns in three held drawings (back, three-quarter-back, profile). He blinks once and the "tiniest smile" is literally one pixel: "super."
- **4.5–5 s:** Nole slams his phone on the desk. The room shakes and every object hops: coffee slops out, the monitor tears, a book topples, the pencil cup tips. The glass is drawn after the shake, so it doesn't move a pixel and the water line stays flat. A sparkle lands on it and the cursor returns to "Look at glass of water".

**What looks strong**
- The lighting: cyan monitor against warm hallway light, done by stepping through hand-picked colour ramps rather than blending. The doorway silhouette with its shadow is the most striking image.
- Nole's portrait: square jaw, cyan key on the face, warm rim, glowing phone.
- The interface does real storytelling work: the cursor sets up and pays off the water gag, and the parody verbs carry satire.
- Every simplification reads as the genre, not as a limitation: held drawings, swapped mouths, whole-pixel moves.

**Weaknesses**
- In the wide shot the characters are small, rim-lit silhouettes; the acting lives in the portraits.
- Nole's room sprite is still a bit boxy, and the standing Mas in the lineup is rough.
- Mas's portrait is good but could use one more hand pass on the cheek and the edge of the light.
- The door-burst flash is a round dithered halo and should be hand-shaped.
- The look is deliberately very dark and needs checking on a real screen.

**Rigging notes**
- **Moves well:** anything that is a swap:
  - mouths, eyelids, brows, the three head angles, arm poses
  - walk cycles on 2s, leans done as whole-pixel steps
  - colour-state changes (silhouette, fade, dim)
  - screen and door states, object hops, text timing, cursor moves, lighting flicker
- **Would look cheap:**
  - rotating or scaling sprites (smeared pixels, depth scaling)
  - half-pixel drift, smooth in-betweens, soft glows
  - continuous 3D turns, crowds, cloth
- **How the conventions hide it:**
  - Adventure games hold drawings; in-between frames would look wrong here.
  - Acting moves into the portrait close-ups.
  - Camera moves become cuts or whole-pixel scrolls.
  - The dark room means only lit areas need detail.
  - Faces are hand-painted planes on the grid, so there's no 3D to fake.
- **Cost per minute, relative to other structures: low to medium.** A new room is about 1–2 days. A new character is about 1 day for the room sprite plus 1–2 days for the portrait, then reusable. Dialogue scenes are nearly free (portrait plus text); walk-ins and slapstick need extra drawings.
- **Sparing style switches: excellent, the best case of any structure.** Every pixel is an indexed palette colour, so a switch is a palette remap that can cut in on any frame with no redrawing. `extra-switch.png` shows 1-bit for 1993 or AI moments, a green line-screen "ledger" standing in for engraving in money flashbacks, and a teal terminal for the machine's point of view. A true engraving look isn't possible in this structure; the ledger line-screen is its native stand-in.