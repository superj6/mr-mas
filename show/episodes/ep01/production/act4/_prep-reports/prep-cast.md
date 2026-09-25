Act Four's cast is built. The five new characters and the speaking sets for everyone else who talks in the act are in place, all through my own Remotion entry and following the show's pixel rules. The sheets, lineup, name cards, both call grids and an 8-second motion test are rendered, and I looked at every one and revised it until it read correctly. The typecheck is clean for all my files; the only errors are old ones in `src/dev/realism`. I didn't edit any existing file.

**What's built.** All code is in `studio/src/shared/pixel/cast/`.
- **Every speaking portrait** uses the same six mouths as Mas (A, E, O, M, rest, smile), driven by `visemeAt()` in `talk.ts`, with a 3-frame blink.
- **Call tiles** share a standard 150×86 tile (the salvaged grid size) that also works at any size, a ballot icon that flips in 3 drawings, and 38×22 mini tiles for the grid in Mas's monitor corner.

| Character | File | What's in it |
|---|---|---|
| NELEH | `neleh.ts` | Portrait; the glowing paper; orbiting footnotes that can stop and scatter; call tile; standing sprite at the blueprint (paper, marker, writing) |
| MADA | `mada.ts` | Near-front poker face with folded arms and the nod; the loading spinner (runs, stops, has a blue variant for the heart gag); tile; seated in the bolted chair; the empty chair |
| TTEMME | `ttemme.ts` | Hoodie, headset, hourglass; the hourglass as a prop (sand level, flip, one grain per beat, shatter where the sand holds its shape for a beat); the chat "F" egg; sticky note `CEO (TEMP)` |
| TERB | `terb.ts` | Portrait with helmet on/off; 4-drawing walk-in (the helmet appears at the door); spray, stamp, hand-over and seated poses; extinguisher close-up with the pin and a readable DO NOT REMOVE tag; term sheet |
| THE QUIET VOTE | `the-quiet-vote.ts` | Camera-off tile at any size, a portrait-window version, and the laptop on a chair |
| RIMA | `rima-speak.ts` | Her roll-call face, now speaking; jacket-smoothing hand; tile where the hard spotlight snaps on |
| TASYA | `tasya-speak.ts` | Roll-call face, speaking; hands clasped or jangling the key ring; standing with the arrow sign or the keys |
| ADELINA | `adelina.ts` | New portrait (she had none); phone to her ear with the throne on or off; standing reach and phone poses |
| ALYI | `alyi-speak.ts` | Full mouth set; his reflection in dark glass with the 2-frame flicker; doorway tile; standing sprite for the doorway beats |
| GERG | `gerg-speak.ts`, `gerg-stand.ts` | Full mouth set; his portrait under the green laptop glow; typing tile; walking while typing (sc 31) |
| MAS | `mas-stand.ts` | Present-day walk, the pin-pull reach, pocketing it, and the GUEST lanyard |

Mas and Gerg weren't in my brief, but the act needs them on their feet (the pin pull, the lobby walk-in, sc 31) and neither had a standing sprite, so I added them. Mario already has four mouths; `talk.ts` maps the six onto them, so he needed no new file.

**Renders:** 21 files in `out/ep01/act4/assets/cast/`: one sheet per character plus `walkers.png`, `lineup.png`, `card-0`…`card-5.png`, `callgrid.png` (sc 26 in full colour with the salvaged Mas tile), `boardgrid.png` (sc 27), and `motion.mp4` (960×540, 192 frames).

**Remotion ids:** `act4cast-sheet-<walkers|neleh|mada|ttemme|terb|quietvote|rima|tasya|adelina|alyi|gerg>`, `act4cast-lineup`, `act4cast-card-0..5`, `act4cast-callgrid`, `act4cast-boardgrid`, `act4cast-motion`.

**Strengths:** the portraits match the approved intro portraits. Each character reads from their prop at a glance. The Rima and Tasya faces carry over from their roll-call portraits. The full-colour call grids look like the show.

**Weaknesses:**
- Each portrait has only one head angle, and room-scale heads only open and close the mouth, so lip-sync belongs in the portraits.
- The Alyi and Gerg mouth sets are patches over their owners' portraits. If `alyi.ts` or `gerg.ts` moves a mouth, the patch boxes need re-checking.
- Tasya's clasped hands and Rima's smoothing hand are small details at the bottom of the frame.
- The webcam busts are simpler than the portraits.
- The glow from Neleh's paper only reads on her navy blazer.

**The next stage needs to know:**
- NELEH's card stat `FOOTNOTES: ∞` needs an ∞ glyph, and the 7px font doesn't have one. The card or font owner has to add it; the other card stats render fine.
- The script's blue for Rima (`#1E6BFF`) isn't in the master palette, so the blue spinner uses the cyan family.
- Tiles are drawn in full colour. If anyone wants the old desaturated call look, the grid builder applies it as a palette.
- The Mas tile for the sc 26 grid is still the salvage in `dev/mfinale/callart`. My `callgrid` view composes it the way the script asks, with no `FIRED.` and the clock blanked.
- The blueprint figures in The Plan, the heart and tile falling kits, and the bullpen-becomes-Tasya remap belong to other builders.
- Voices are untouched.

The full API and the scene-by-scene usage map are in `show/episodes/ep01/production/act4/cast.md`.

Files are in `/home/jgon/project/art/mrmas`:
- `studio/src/shared/pixel/cast/`: `talk.ts`, `calltile.ts`, `neleh.ts`, `mada.ts`, `ttemme.ts`, `terb.ts`, `the-quiet-vote.ts`, `rima-speak.ts`, `tasya-speak.ts`, `adelina.ts`, `alyi-speak.ts`, `gerg-speak.ts`, `gerg-stand.ts`, `mas-stand.ts`
- `studio/src/episodes/ep01/act4/cast/`: `entry.tsx`, `frames.ts`, `CastCanvas.tsx`, `sheet.ts`, `lab.ts`, `tools/lab.ts`
- `out/ep01/act4/assets/cast/`: the 21 renders
- `show/episodes/ep01/production/act4/cast.md`