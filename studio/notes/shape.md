# shape — GRAPHIC-SHAPE CINEMA

Lineless, geometric character design with extreme but *designed* proportions, planar cinematic staging in
2.39:1 scope, and colour-script lighting (monitor cyan from screen-left, rocket red from screen-right).
Lineage: prestige graphic 2D (Primal / Samurai Jack staging), mid-century poster and Saul Bass title cards.
Moody and adult: no outlines, no big shiny eyes, no bounce.

## Files (all owned by this builder)
- `src/dev/shape/entry.tsx` — dev entry (`makeRoot(frames)`)
- `src/styleframes/shape.frame.tsx` — deliverables: `shape-scene` (120 f), `shape-key`, `shape-extra-lineup`,
  `shape-extra-mascu`, `shape-extra-switch`
- `src/styleframes/shape/core.ts` — palette (light colours, not local colours), easing (`snap` = pose-to-pose with
  overshoot), `on2`, deterministic shake/noise, path helpers
- `src/styleframes/shape/lit.tsx` — **LIGHT-AS-OFFSET**: the whole shading system (see below)
- `src/styleframes/shape/fx.tsx` — edge filters (gouache wobble, dry-brush drag), paper grain, `Scope` letterbox + subtitles
- `src/styleframes/shape/mas.tsx` — Mas: seated profile + front bust (egg head, yaw by feature slide)
- `src/styleframes/shape/nole.tsx` — Nole: profile (hip/neck/shoulder/elbow pivots, IK phone hand, nutcracker jaw)
  + front silhouette
- `src/styleframes/shape/set.tsx` — the room staged as a proscenium; light shapes; cast shadows = rig silhouettes
- `src/styleframes/shape/scene.tsx` — the 5-shot test beat; `extras.tsx` — model sheet, turn sheet, style switches

Render (from `studio/`):
```
npx remotion still  src/dev/shape/entry.tsx shape-key ../out/structures/shape/key.png --bundle-cache=false --log=error
npx remotion render src/dev/shape/entry.tsx shape-scene ../out/structures/shape/scene.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error
```
Tip on a shared machine: `npx remotion bundle ... --out-dir=<private dir>` once, then render stills from that dir
(use a dir name nobody else uses — the scratchpad is shared between builders).

## The conventions (why every simplification reads as a choice)
1. **Scope + subtitles in the bar.** 2.39:1 letterbox; dialogue is a festival-print subtitle in the lower bar.
   No balloons, no lip-sync close-ups required: a line can play on a wide shot or over a cut.
2. **Planar proscenium staging.** Back wall parallel to the lens, characters in profile. Profile is the cheapest
   and strongest 2D view — and it is the style's signature, not a limitation.
3. **Held poses + snaps.** Characters hold graphic poses and snap pose-to-pose in 2-3 frames with overshoot
   (`snap()`), on twos. The camera and the light move on ones, so the frame is never dead.
4. **Light-as-offset.** Every shape = base fill + light layers; each light layer paints the part of the shape not
   covered by a copy of itself shifted by a vector. Small shift = rim, large shift = key with a clean convex
   terminator. Lighting animation (door bursts open, rocket glow breathing, Mas turning INTO the red) is two
   numbers per layer. Cast shadows are the rig's own silhouettes scaled about the light (shadow puppetry, free).
5. **Egg-head yaw.** Mas's head is an egg, so a slow head turn is a feature slide over an ellipsoid (eyes, brows,
   nose, cowlick, hairline and ear are projected), plus a jaw ellipse that drifts with the yaw. This is the ONLY
   continuous turn in the show and it is legitimate *because* of how he is built.
6. **Nutcracker jaw.** Nole doesn't need mouth drawings: his chin block is a separate slab that drops to talk,
   revealing a dark slot and a teeth bar. 6 openings (m / k / ee / oh / ai / grin).
7. **Freeze-frame poster card.** The button flattens the frame to three inks (red field, black, cyan) and slams
   type — the rig's silhouette mode reused as a title design.
8. **Texture only at edges.** Flat interiors stay solid ink; the edge filter wobbles contours (boils on threes),
   light shapes drag like dry brush at their edges, paper grain on twos. Nothing is a full-frame "filter".

## The test beat (5 graphic cuts, 120 f)
| frames | shot | what carries it |
|---|---|---|
| 0-23 | WIDE, planar | Mas typing inside a banded cyan wedge; his giant cast shadow on the wall; a red blade under the off-screen door flares at f18; desk objects rattle on a rumble (f19+) — **the water in the glass never moves** (house rule, set up here) |
| 24-47 | THE DOOR | door thumps (f25-26), **impact frame** at f27 (cream field, sunburst, black silhouettes), door slab smears off its hinges, debris chips, then a HELD frontal pose: Nole jammed shoulder-to-frame against a rocket-glow sunburst; slow push; launch smear f44-47 |
| 48-83 | TWO-SHOT | smear-in (2 frames), landing squash + camera kick, lean; IK phone hand snaps between 4 poses with overshoot, landing the phone *between Mas and his monitor*; nutcracker jaw on twos; Mas keeps typing and only stops at f76; subtitle in the bar |
| 84-107 | MAS CU | eyes lead (f86), head slides across the egg into the red light (f88-101), one blink at the end of the turn, tiniest smile, "super." (s/oo/p/er); Nole looms top-right, chin first |
| 108-119 | FREEZE CARD | 1-frame cream flash, frame flattened to three inks, NOLE / NAMED IT. slams in (scale 1.28 → 0.97 → 1); "super." subtitle persists across the cut |

## Rig limits in this style (honest)
- Mas has two drawings (seated profile, front bust). A 3/4 walk, a profile-to-front turn in a wide, or a
  back view would each be a new drawing. The egg yaw only covers about ±40° from front.
- Nole's profile is a *cheat* (the trapezoid stays a trapezoid in profile). That is the design, but it means no
  real 3/4 view: cut between profile and front, don't turn him.
- Hands are mittens/fists. Any finger acting (typing close-up, pointing) needs a hand insert drawing.
- Light-as-offset makes rims follow a direction, not a 3D form: on concave shapes (armpits, the hood roll)
  it can paint rims on inner edges. Fix per part by union-ing silhouettes (`Lit` accepts an array) or by
  adding a designed shadow shape.
- The `sh-edge` / `sh-dry` filters are SVG displacement; they cost render time (~2-4 s/frame at half res on
  this CPU box). For production, bake textures per held pose.

## Known issues / next pass
- Nole's profile head still reads a bit "helmet": the swept-back hair tail + red rim suggests a crest. Needs a
  drawn hair shape with 2-3 locks and less rim.
- Mas's seated-profile hair is a large dark mass at wide scale; it holds as a silhouette but loses the
  hair/head separation. A cyan-lit parting shape would help.
- The engraving switch is a compositor line screen (value → line width). It proves the value structure maps
  cleanly, but a real money-flashback sequence should swap each value token for a hatch pattern that follows
  the form (per-part pattern fills), and use a light background.

## Rigging notes for the showrunner
- **Moves well:** pose-to-pose snaps with overshoot, IK phone hand, hip lean, jaw drop, blinks, eye darts,
  egg yaw up to about ±40°, camera push/shake/cut, and any light change (door, flicker, turning into the red).
  Cast shadows come free with every pose.
- **Would look cheap, and how the conventions cover it:** in-betweened full-body acting (don't do it: hold
  and snap), a continuous 3D turn of Nole (cut between profile and front instead), mouths animated on ones in
  close-up (Nole's jaw is one slab; Mas barely moves his mouth anyway), walk cycles (stage entrances as
  smears and cuts, the way Nole arrives here).
- **Cost per minute: LOW-MED.** Cheaper than drawn/tonal full animation: two drawings per character, pieces
  on pivots, light is two numbers. The spend goes on layout, colour script and cutting. New angles are the
  expensive part.
- **Sparing style switches: very good.** Every fill is one of about 4 value steps, so the frame screens
  cleanly: a line screen gives engraving (money), an ordered dither gives 1-bit (1993 / the model)
  (`extra-switch.png`, `Treat` in `extras.tsx`). The silhouette mode already makes the poster/title-card look
  (the freeze card).
