The four FX kits are built as shared, reusable modules, each proven in a demo, and all of them render cleanly. There are 28 stills and 7 short MP4 tests (`--scale=0.5`). Every demo passes the flash check (worst frame-to-frame luminance jump 0.089 against the 0.1 limit), and the typecheck is clean on all my files. The THE PLAN demo follows the storyboard's sc 25 shots on its real 1080-frame clock. The other demos are condensed tests built to the board's specifics.

**Files**
- Kits (show-wide), in `/home/jgon/project/art/mrmas/studio/src/shared/pixel/kits/`:
  - `blueprint.ts`
  - `callgrid.ts`
  - `avalanche.ts`
  - `props.ts`
- Previews: `/home/jgon/project/art/mrmas/studio/src/episodes/ep01/act4/kits/`
  - `plan.ts`: sc 25 plus the 24.02 flash-print.
  - `demos.ts`: the call, hearts, tiles, props and extras demos.
  - `entry.tsx`, `frames.ts`, `Kits.tsx`: the Remotion entry and compositions.
  - `tools/`: a fast Node preview, a flash audit and two check sheets.
  - `standin.ts`: a placeholder suite, now unused.
- Renders: `/home/jgon/project/art/mrmas/out/ep01/act4/assets/kits/`
  - Stills: `blueprint-00…10` (named by shot), `callgrid-01…05`, `hearts-01…04`, `tiles-01…04`, `props-01…02`, `extras-01`.
  - Tests: `test-{plan,flash,call,hearts,tiles,props,extras}.mp4`.
- Usage notes (API per shot, cues, issues): `/home/jgon/project/art/mrmas/show/episodes/ep01/production/act4/kits-fx.md`
- Composition ids: `kits-plan` (1080 f), `kits-flash` and `kits-flashtrace` (60 f), `kits-call` (288), `kits-hearts` (408), `kits-tiles` (480), `kits-props` (240), `kits-extras` (192). Stills are these compositions with `--frame=N`.

**Strengths**
- **Blueprint:** the script's exact cyan and navy, on a proper palette set.
  - Everything draws itself on in whole-pixel strokes, including the voter circles and a 28 px title stamp for THE WORD.
  - Stamp wear never breaks 1 px lettering, so "CEO" can't read as "CEC".
  - Covers every blueprint beat the board lists for sc 25: the chairs that walk off, the plan-view structure, the figures redrawn larger for the close, and chalk that squeaks and snaps.
  - The corner curl shows the real room frame underneath, with neon on its lip. The tear's crack runs like a render front, and the halves part onto the laptop insert.
- **Call grid:** everything salvaged from the cut intro plus what the board asks for.
  - Salvaged: all five tiles, the camera-off tile, the pointer and the grey palette. MADA's arms are now folded.
  - The tile drops in four drawings (every 4 frames) inside the real 20-frame GLYPH dissolve (Ep1's second and last glyph use); its emptied grey plate keeps falling.
  - Also covered:
    - Tiles opening in held steps; loops that freeze mid-orbit.
    - Mas's live mic chip after his tile is gone.
    - The 1993 dialog in full colour, with Cancel greying one step at a time.
    - The security-camera tile with his post upside-down in the corner; the hard-edged spotlight.
- **Falling stack:** planned once, then cheap to draw on any frame.
  - The tile avalanche lands on exactly 745/770, with the board tiles shoved off, NELEH's footnotes scattering as sparks, and the 1 px presses toward MADA.
  - The heart pour buries the grid. Exactly one blue heart falls last and rides MADA's spinner.
  - The letter counter clunks on each stop: 505 · 650 · 700 · 745.
- **Props:**
  - The hourglass flips as three drawn states, never rotated; its sand moves one grain per step, and when the glass shatters the sand holds for a beat, then slumps.
  - Also built: the lobby sign that lights up with its hung "0" plate and the box of spare zeros, and tally marks carved into any wood with the pen's steel clip.
  - Cartoon fires, with a put-out sequence and the extinguisher spray.
  - The GUEST lanyard in insert, desk and worn sizes, and the `DO NOT REMOVE` pin tag.

**Weaknesses**
- The heart pile's surface is fairly flat and MADA's spinner is small at 1080p.
- The employee faces are tiny generic pixel faces, fine at 4x but not individually readable.
- ALYI's reflection in the glass still reads fairly strongly.
- The spotlight is subtle on tiles that are already dark.
- The tear and the corner curl are outside the four transitions the pixel guide allows. The script calls for both, so keep them to 25.07 only.

**Decisions and gaps for the next stage**
1. **24.02 is a showrunner call.** I defaulted to a print-style palette remap (`BLUEPRINT_PRINT`), which is a colour lookup like every other switch. The alternative, `traceBlueprint`, turns the frame into actual line drawing and reads far more like a blueprint, but it's a filter, which the pixel guide doesn't allow for switches. Compare `blueprint-01…` and `blueprint-01b…`.
2. **The engine font has no `…` or `~`.** The blueprint kit draws its own tilde (needed for `~$10B`), and my demos write "..." where the script has "…". The post UI will need "…", so this should go to the engine owner.
3. **The rooms builders drew their own versions of some props.** `darkroom.ts` has its own tally and lanyard, and `boardroom.ts` has its own fires and the blueprint on the table. For one consistent look they could call my `fire()`, `tallyRoom()` and `guestBadge()`, but that's their call. I didn't touch their files.
4. **`plan.ts` imports the rooms builder's `drawLaptopInsert` (read-only).** If they change its signature, the demo breaks; the kits don't.
5. **Not built — the shot list gives these to "kits", but they weren't in this brief:**
   - Kits: `kit.cards` (including the rail), `kit.post-ui`, `kit.portrait-layout`.
   - Props:
     - Paperwork: `prop.check-evirht`, `prop.term-sheet`, `prop.wallet`.
     - Devices: `prop.phone`, `prop.throne-handset`, `prop.rent-meters`, `prop.gerg-laptop`.
     - Set pieces: `prop.q-vault`, `prop.nameplate-alyi`, `prop.observer-chair`, `prop.labelled-desks`, `prop.arrow-sign`.
     - `prop.extinguisher` (only its pin and spray exist).
   
   These need an owner.
6. **Sound cues are available from the kits:** the chalk returns its squeak and snap phases, and the counter flags each clunk. The notes list them.
7. **Scene builders set the real timing.** The demos pass `k`/`f` offsets, and plans should be computed once and cached.