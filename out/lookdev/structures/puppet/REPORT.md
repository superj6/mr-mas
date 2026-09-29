The paper-puppet structure is finished: the 120-frame scene MP4, a key frame and four extra stills are rendered. I checked the MP4 by pulling its frames out into tiled sheets and looking at them, not only the test stills.

**Deliverables** (in `/home/jgon/project/art/mrmas/out/lookdev/structures/puppet/`)
- `scene.mp4`: composition `puppet-scene`, 120 frames at 24 fps, rendered at scale 0.5 (960x540).
- `key.png`: composition `puppet-key`, frame 106 with a slightly wider camera, full 1920x1080. It shows both dialogue slips, the phone in Mas's face and the torn wall.
- `extra-closeup.png`: `puppet-extra-closeup`, Mas saying "super.", close enough to see paper grain, pins and the taped slip.
- `extra-lineup.png`: `puppet-lineup`, both puppets standing against a police-lineup height chart in plain daylight.
- `extra-kit.png`: `puppet-kit`, a parts tray on a cutting mat: both Mas heads, six mouths, blink lids, Nole's head with the jaw off its pin, loose brass pins, a craft knife.
- `extra-stocks.png`: `puppet-stocks`, the same two puppets in three paper types (normal, banknote engraving, 1-bit punch card).

**Code** (only my own files)
- `src/dev/puppet/entry.tsx`
- `src/styleframes/puppet.frame.tsx`
- `src/styleframes/puppet/`: `paper.tsx`, `mas.tsx`, `nole.tsx`, `set.tsx`, `scene.tsx`, `extras.tsx`
- `notes/puppet.md`

I also wrote a folder `public/puppet/` into the shared `public/` directory? No — nothing outside my own files was touched.

**The beat as built**
- **0–1 s:** Mas types in profile, lit by the cyan monitor. His head sits inside a round window, and his shadow falls on the striped wallpaper.
- **1–2 s:** Nole doesn't use a door: he tears through the paper wall, shot one drawing per frame for the impact. The phone breaks through first. The torn edge shows the white core of the paper, flaps peel back cream-side out, scraps flip as they fall, and warm hallway light floods in against the cyan. A picture frame is knocked crooked and stays that way. Mas doesn't react.
- **2–3.5 s:** A yellow printed card, "I CAME UP / WITH THE NAME!", drops in on threads and bounces. Nole's square jaw is its own piece on a pin, so opening and closing it is his mouth animation. The phone jabs land on "came", "up" and "name".
- **3.5–4.5 s:** Mas tilts his head, then it is swapped for a front-facing head. His eyes slide to Nole, he gives one slow blink, speaks "super." and ends on the tiniest smile. His small cream card lowers gently.
- **4.5–5 s:** Everything in the room jolts separately: chair, desk, monitor, frames, moon, cards, Mas's cowlick, Nole's jaw dropping. The glass of water doesn't move at all, and a small glint lands on it.

**What looks strong**
- The two-colour light: cyan monitor on one side, warm hole on the other. The monitor light puts a thin bright edge on the cut card facing it.
- Real depth between the six layers, with drop shadows between cards and blur on the far layers.
- The dialogue cards feel like objects in the set, not subtitles.
- Every piece's paper grain moves with the piece, so it never reads as a filter laid over a drawing.

**Weaknesses**
- In the wide shot the faces are small. The acting only reads once the camera pushes in.
- Nole has only a profile head and a profile body. His broadness comes from chest depth and sleeves, so he can look a bit like a mannequin in wide shots.
- The hallway seen through the hole is just a glow, with no detail.
- The per-frame jitter is very subtle at half resolution.
- Cost: renders take about 2–2.5 minutes for the 120 frames on an idle machine. With other builders rendering at the same time, one run took 10 minutes.

**Rigging notes**
- **Moves well:** limbs on pins, the hinged jaw, eyes (pupil discs slide behind eye holes cut in the face), blinks and mouths swapped on twos, springy hair, paper that tears and flutters, hanging objects that swing, camera moves across the layers, and lighting changes.
- **Would look cheap:** smooth in-between drawings, head turns faked by squashing a flat shape, fast lip-sync, a camera move shot on ones while the characters are on twos.
- **How the style hides it:** head turns are head swaps, which is how cut-out films actually do it. The jaw hinge replaces lip-sync. Everything is shot on twos, with impacts on ones, and Mas animates on threes as part of his calm. The small jitter and light flicker read as stop-motion rather than as a missing drawing.
- **Cost per minute: low to medium.** After the one-time puppet build, new material is mostly posing pins, changing a few settings and adding set cards. Each new camera angle does mean building new head pieces.
- **Occasional style switches: very good.** Wrapping any puppet in one setting re-cuts it from banknote engraving paper (money flashbacks) or punch-card 1-bit paper (AI / 1993 moments). Rig and animation stay identical; each piece's light or dark value just maps to a hatch or dither level. It reads as a deliberate change of paper, not an effect. `extra-stocks.png` shows all three.

The dev sheets I used to check motion are in `/home/jgon/project/art/mrmas/out/lookdev/looks/puppet/` (for example `mp4-burst.png`, `mp4-jolt.png`).