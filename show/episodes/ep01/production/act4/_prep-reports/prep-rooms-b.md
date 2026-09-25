All three Act 4 rooms are built as reusable shared modules. They're rendered as 23 stills at 1920×1080, a contact sheet and three motion tests, and I looked at every one. I rendered one still through Remotion and diffed it against my faster Node preview: they are pixel-identical. The type check reports no errors in my files, and every frame uses only master-palette colours. I created new files only and edited nobody else's.

**Files**
- Room modules, in `/home/jgon/project/art/mrmas/studio/src/shared/pixel/rooms/`:
  - `bullpen.ts`: the NopeAI bullpen, day.
  - `lighthouse.ts`: the Misanthropic lighthouse interior, night.
  - `darkroom.ts`: Mas's dark room (the wide plus the sc 26A desk close-up).
  - `kit-b.ts`: shared helpers, including a small text font that has `%`.
- Previews and dev entry, in `/home/jgon/project/art/mrmas/studio/src/episodes/ep01/act4/rooms-b/`:
  - `scenes.ts`, `frames.tsx`, `entry.tsx`.
  - `tools/preview.ts`: the Node preview.
- Renders, in `/home/jgon/project/art/mrmas/out/ep01/act4/assets/rooms-b/`: all stills, `rb-contact.png` and the three motion tests.
- Handoff doc for scene builders: `/home/jgon/project/art/mrmas/show/episodes/ep01/production/act4/rooms-b.md`. It covers every option, anchor and draw order, and maps each scene to the call it uses.

**Composition ids**
- Bullpen:
  - `rb-bullpen-day`, `-crack`, `-crack-staged`, `-staged`, `-reflection`
  - `-allhands`, `-allhands-empty`, `-walkout`
  - `-landlord-1`, `-landlord-2`, `-landlord-3`
- Lighthouse: `rb-lighthouse`, `-meters`, `-staged`.
- Dark room: `rb-darkroom-plate`, `-sc29`, `-door-1`, `-door-3`, `-door`, `-door-ajar`.
- Desk close-up: `rb-darkdesk-2`, `-carve`, `-3`.
- Motion tests (MP4): `rb-motion-lighthouse`, `rb-motion-landlord`, `rb-motion-bluedoor`.

**Strengths**
- **Bullpen:**
  - Reads as daylight, with a warm tungsten hall.
  - The conference door can be shut, open a crack for Alyi (sc 30) or fully open (the all-hands doorway). It carries an `ALYI` nameplate and a readable `IOU: 20% / COMPUTE` note.
  - Alyi's reflection helper lets his figure show faintly in the glass wall.
  - The all-hands is rows of employee faces in video-call squares; the tile avalanche kit can reuse the same drawing.
  - The walkout has a box on every desk and ten employees in coats holding boxes.
- **The landlord remap (sc 30)** is one call per step. Floor, ceiling and walls each turn MACROSOFT slate in three held steps spreading from Tasya's feet; doors, glass, furniture and people keep their colours.
- **Lighthouse:**
  - Brick-red, with a spiral stair made of bound drafts and paper stacked everywhere.
  - The lamp visibly turns once every 2 bars, with a light band walking the upper wall.
  - The throne phone: it can ring, lift off the hook, and the throne can fall over.
  - The two rent meters (`NOZAMA · UP TO $4B`, `ELGOOG · UP TO $2B`) read clearly.
- **Dark room:**
  - It's the intro's cold-open room exactly, with characters removed.
  - Added: three tally marks, the GUEST lanyard, the board's four-tile grid in the monitor corner, the shelf clock (`9:32` for 26A, `2:06` for sc 29) and Tasya's slate door.
  - The door steps up out of the shadow one beat at a time, key in the lock, and can stand ajar for "leave it open."
  - The desk close-up has long horizontal grain for the F1.2 flashback to settle into, two worn marks and the third being carved.
- **For scene builders:** every room returns surface masks, named marks (standing, seated and prop positions) and a pass that repaints the desk or bench over anyone standing behind it.

**Weaknesses**
- The bullpen is day only. Act 1's night bullpen (sc 5–7) would need a new lighting setup; the layout is ready.
- The walkout employees are simple held background figures, not cast quality, and they don't animate.
- The lighthouse perspective is a stylised cheat, and nobody can be staged on the stair.
- The lamp flashes once every 30 frames, which is within the limit, but it still needs the luminance audit.
- In the dark-room wide, the board grid is only about 6×5 px and the tally about 3 px. They read only in inserts, which belong to the monitor builder.
- The GUEST text reads only in the desk close-up.

**For the next stage**
- **Draw order:** room, then anyone behind the desk or bench, then `room.front(b)`, then the seated cast, then anyone in front.
- **Clipping Alyi:** clip him to `DOOR_CRACK` for sc 30 and `DOOR_OPENING` for the all-hands.
- **The Orb** is still only in `dev/mcoldopen/orb.ts`. It should be promoted to a shared cast file.
- **Lighthouse staging:** Mario's mark is at the desk's left end, not behind it. With no sprite scaling, the desk looks too low for anyone standing behind it.
- **To confirm:**
  - The door nameplate reading `ALYI` is my reading of sc 31's "nameplate still on." It's a single option to change.
  - The whiteboard eggs (`LOW-KEY`, `1M`, `?`) are invented and undated.
- **Loose ends:** the RENT flags are amber because Mario is never red. The `NOPE AI` sign goes slate with the walls unless you pass `sign: false`.
- **Cleanup:** the bundled preview script (`rb.js`) is still in the scratchpad. The safety check blocked my first delete command; I reran it in a safe form and it removed the temp images, but I left the bundle.