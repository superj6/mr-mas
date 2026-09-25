# PUPPET: handmade paper-puppet diorama (structure key `puppet`)

Cut-paper stop-motion look: jointed card puppets on brass split pins, a multiplane room box
(Wes Anderson dollhouse cross-section, symmetric about the round window) lit by the monitor.
Every constraint of a 2D rig is presented as a convention of the medium:

| rig limit | how the structure presents it |
|---|---|
| no 3D head turns | **replacement heads** (profile card → front card). Swapping a head is how cut-out films turn heads, so the pop reads as craft. |
| limited mouth shapes | Mas: 6 replacement mouth cards. Nole: **the jaw is its own card on a pin**. His mouth animation is just the hinge angle. |
| no full-body acting | Profile puppets on pins (Reiniger). Poses are rotations, so each hold is a clean silhouette. |
| stepped timing | Shot **on twos**. Impacts (the tear, the jolt) go **on ones**. **Mas lives on threes** (his calm), and faces blink/talk on twos. |
| texture boil | Per-exposure pin jitter (±0.3 px / ±0.1°) plus a ±2 % exposure flicker, i.e. the "hands touched it" feel. |
| flat parts | Every card has a userSpace fibre texture that travels with it, a world-space soft drop shadow, form shading and a lit cut edge. |

## Files (all owned by this builder)
- `src/styleframes/puppet.frame.tsx`: FrameDefs (deliverables + dev sheets)
- `src/styleframes/puppet/paper.tsx`: primitives: `Piece` (hand-cut card), `Joint` (pivot + brad), `Brad`, `Thread`, `cut/poly/rect/oval/torn/tornHole` path helpers, `PaperDefs` (fibre patterns, blurs, form/edge gradients, stock patterns), `RimFilter`, `LightCtx`, `RotCtx`, `StockCtx`
- `src/styleframes/puppet/mas.tsx`: Mas rig (`Mas`, `ProfileHead`, `FrontHead`, mouths `FM`)
- `src/styleframes/puppet/nole.tsx`: Nole rig (`Nole`, `NoleHead`, parts `NOLE_H`)
- `src/styleframes/puppet/set.tsx`: diorama: sky, moon on thread, wall + tear, floor, desk, chair, monitor, glass, scraps, foreground
- `src/styleframes/puppet/scene.tsx`: timeline (`timeline(F)`), multiplane `Layer`, light map, slips, `PuppetScene`
- `src/styleframes/puppet/extras.tsx`: lineup, parts kit, paper-stock style switch
- `src/dev/puppet/entry.tsx`: dev entry

## Compositions
- `puppet-scene`: 120 f @24 fps, the test beat → `out/structures/puppet/scene.mp4`
- `puppet-key`: still (f106, wider cam) → `key.png`
- `puppet-extra-closeup` → `extra-closeup.png`; `puppet-lineup` → `extra-lineup.png`;
  `puppet-kit` → `extra-kit.png`; `puppet-stocks` → `extra-stocks.png`
- dev: `puppet-rigtest`, `puppet-sheet-a|b|c|d` (contact sheets of scene frames), `puppet-tear`, `puppet-close`

Render: `npx remotion render src/dev/puppet/entry.tsx puppet-scene ../out/structures/puppet/scene.mp4 --scale=0.5 --concurrency=1 --bundle-cache=false --log=error`
(about 2–2.5 min on this machine when idle).

## How to use the rigs
```tsx
<g transform="translate(985 788)"><Mas p={{head:'front', lookX:0.9, lid:0, mouth:'smile', exp}} /></g>
<g transform="translate(1380 603)"><Nole p={{torsoA:-20, jaw:0.8, pSh:74, pEl:18, pWr:-18, exp}} /></g>
```
- Mas params: `head` profile|front, `headA`, `lookX/Y`, `lid` 0/.5/1, `mouth` rest|smile|p|s|u|er,
  `torsoA`, arm angles `nSh/nEl/nWr` (near) `fSh/fEl/fWr` (far), `cowlick` (spring), `sit`, `exp` (exposure index).
- Nole params: `torsoA`, `headA`, `jaw` 0..1, `brow`, `lookX/Y`, `lid`, phone arm `pSh/pEl/pWr`, back arm
  `bSh/bEl/bWr`, legs `fTh/fKn/bTh/bKn`, `quiff` (spring), `glow`, `exp`.
- Scene conventions: key light = monitor at screen-left (`MON`), shadows fall right. `LightCtx` sets the
  world-space shadow vector. `Piece` counter-rotates it via `RotCtx`, so rotated limbs still throw
  shadows the right way.
- Lighting = one **light map** layer (ambient navy + monitor cone + moon + hallway + phone, composited
  with `screen` inside, then `multiply` over the set), then an emissive bloom layer. Change the lights
  there, not per piece.
- **Style switch**: wrap any rig in `<StockCtx.Provider value="engrave"|"bit">`. Same puppet, same
  animation, re-cut from banknote stock or punch-card stock (the value/luminance of each card maps to
  5 hatch or dither levels). See `extra-stocks.png`.

## Rig limits / known issues
- Heads: Mas has 2 (profile, front). Nole has 1 (profile). A 3/4 Nole or a back view needs a new card.
- Nole's torso is profile. Broadness comes from chest depth, sleeve caps and the neck. Very wide
  frontal shots of him would need a front torso card.
- In the lineup/stocks stills the puppets are pinned with legs straight. Walking cycles are fine
  (hip/knee pins) but must be keyed pose-to-pose. There is no automatic walk.
- The rim-light filter thresholds alpha to skip soft shadows. It is still a filter per puppet (cost).
- Render cost: all SVG filters are CPU-rasterised. Contact sheets that render 16 scenes need unique ids
  (the `U` suffix in scene.tsx). Keep that pattern if you add per-frame defs.
- The hallway behind the tear is a simple glow card and could use a pass (door frame, wallpaper).
