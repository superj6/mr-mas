# SATIRE: latex-puppet caricature (builder: satire)

The structure is a TV political puppet show: big sculpted latex heads (about 1.6x) on small
costume bodies, glass eyes, hinged jaws and rod arms, all staged on a miniature studio set. Every
limit of 2D rigging is written as a rule of puppetry, so it reads as the genre working as intended
and never as a missing capability.

## Files (all owned by `satire`)
- `src/styleframes/satire.frame.tsx`: deliverables `satire-scene` (120 f), `satire-key`,
  `satire-extra-closeup`, `satire-extra-button`, `satire-extra-lineup`.
- `src/dev/satire/entry.tsx`: dev entry (deliverables plus `satire-dev-*` test frames from `devframes.tsx`).
- `lib.ts`: spline/blob helpers, `rot3` projection, keyframes, springs (`ring`), noise wobble.
- `kit.tsx`: `PuppetDefs` (blur bank, mottle and pore textures), `Soft` (blurred shading group),
  `Rim` (shape minus offset shape = rim crescent), `GlassEye`, `Bumps` and `Creases` (sculpt passes).
- `MasHead.tsx` and `NoleHead.tsx`: the sculpted heads. `Bodies.tsx`: costumes, hands, rod arm with 2-bone IK.
- `Set.tsx`: back-wall flats, window bokeh, shelf, door, desk (the playboard), keyboard, water glass,
  coffee mug, THE ORB, foreground monitor. `SatireScene.tsx`: timing (`sceneState(t)`), cameras, captions.
- `Lineup.tsx`: the puppet-shop lineup still.

## How the heads work
Each head is drawn front-on in "sculpt space". Every point is projected through a height field
(cranium ellipsoid plus nose, brow, cheek and chin bumps) and then rotated by `yaw` and `pitch`.
The skull outline stays fixed, while the face, chin, nose, eyes, brows and fringe parallax on the
sphere. That gives about ±20° of genuine-looking turn from one drawing.
Shading is all vector: a three-zone radial key (cool lit skin, a warm subsurface band at the
terminator, deep shadow), blurred ambient-occlusion shapes, bump/crease passes that follow the light
direction `light`, latex sheen speculars, paint mottle, and rim crescents (warm door, cool monitor).
`exposure` dims a puppet for ambient level.

Pose params (`PuppetPose`): yaw, pitch, jaw 0..1, smile, lid, gazeX/gazeY (the lids follow the gaze),
brow, key, rim, hair (cowlick spring), phone (under-glow), light, exposure.

## Rig limits and conventions (how each one reads as craft)
- **Mouth = hinged jaw flap.** A weighted mesh drop: the chin and lower lip move, the corners stay.
  There are no phoneme shapes. In this genre the flap is authentic, and lip-sync lands on syllables
  (see the `nJaw` keys).
- **Eyes = glass.** They dart instantly (saccades) and never smear. The key-light reflection stays
  fixed while the iris moves, which is what sells the glass. Blinks are a latex lid cap sliding down.
- **Head turns top out around ±20°** of parallax. Bigger turns get a cut to a second camera,
  as puppet TV does.
- **Bodies are costumes on foam.** They only breathe, bob and jiggle. Hands are stiff latex:
  typing is an alternating pat, and gripping is a fixed fist around a prop.
- **The desk is the playboard.** Nothing below it exists, so there are no legs or walks. Entrances
  are the puppeteer thrusting the puppet in from the frame edge, sold with a horizontal smear blur,
  a hop and overshoot, and the head lagging on a spring.
- **Rods are visible on purpose** (Nole's phone arm). That is the genre's honesty.
- **Secondary motion is springs:** cowlick, drawstrings, head bobble, shelf props, door bounce,
  coffee slosh.
- **Miniature-set physics:** a slam makes the set jolt with damped rings. The camera is a heavy
  pedestal and barely moves. THE WATER GLASS is excluded from every jolt; that is the gag.
- **Lighting is animated** by parameters only: monitor flicker (`key`), door flood (`doorLight`),
  phone under-glow and rim crescents.

## Known issues / next passes
- In the flat workshop light of the lineup, Nole's lower cheeks read heavier than on set. The jaw
  should be carved harder (a flatter front plane, less soft cheek mass) so it never reads as jowls.
- Mas's neck is long and plain in the MCU. Bring the hood up or add a neck tendon crease.
- Nole's pompadour still reads a little helmet-like. It needs a sculpted front roll and gel clumps.
- The shading is baked relative to the light, so turning the light more than about 45° needs a
  new `light` vector per shot (supported, but not automatic).
- The arm IK is simple. Arms look best when the elbow is hidden below the playboard (staging rule).
- Render cost: about 3-6 s/frame at full res on this CPU (blur-heavy SVG). Pre-baking the back
  set to a PNG per shot would halve it.

## Outputs
`out/lookdev/structures/satire/`: scene.mp4 (960x540, 120 f), key.png (f74), extra-closeup.png (f106),
extra-button.png (f116, the water glint), extra-lineup.png.
