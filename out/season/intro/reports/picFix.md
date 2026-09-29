I applied the picture fixes, re-rendered both silent masters to the same paths, and regenerated the beat stills, contact sheet and handoff stills. Many event frames moved, so `/home/jgon/project/art/mrmas/out/season/intro/picture/intro-events.json` is updated (151 → 153 events).

**Verification:** both masters are h264, yuv420p, 24/1, 720 frames (1080p crf 12, 4K crf 16), and a 4K spot frame matches 1080p. The 345–359 overlap is still pixel-identical (0 px on all 15 frames). The type-check is clean for the intro files. I looked at every changed moment in native previews and in the real render. Nothing was listened to.

**Audio is now out of sync with picture.** The sound team needs to rebuild `audio/intro/sfx/build_intro_sfx.py`, then `audio/intro/mix/scripts/run_all.sh` (the events file is already regenerated).

**Moved event frames (old → new)**
- **Typing:** line 1 f24–55 → 18–49. Shift+enter 70 → 63. Line 2 f71–93 → 64–83.
- **Cold-open shots:** medium 30–59, wide 60–71, medium 72–98 (was medium 30–44, wide 45–59, medium 60–98).
- **Scan GLYPH:** 99–104 → 100–104. The fan still opens at f99.
- **1993:**
  - zoom rectangles 135–136 → 133–134
  - dialog fully open 137 → 135
  - the stranger's pointer now enters at 146 from frame-right (was 139, from the left)
- **2008:** the "PLAY / JUN 09 2008" overlay (168–194) is replaced by a "2008" date card at 180–194.
- **Collars and crown:** pop 2 at 187 → 190, re-pop 202 → 205, crown sets off 204 → 205.
- **Start of the dinner:** the whip at 225–229 is gone; the camera holds on the candle 225–229 with a hard cut at 230. The "2015" card now runs 230–247.
- **Alyi scene:**
  - the rose-window GLYPH boot (292–293) is cut
  - the effigy now ignites at 290 (was 296)
  - Alyi's freeze now runs 300–339 (it thaws at 340, not 315), so the marshmallow is toasted on a frozen fire
  - his card closes 340–341
  - the candle wipe (340–344) is cut; 345 is now a hard cut to the vault
- **Vault:** the HUD ticks are 348/351/354 (were 352/356 for the last two).
- **Mario:** his card holds 360–404 and closes 403–404. The whip at 384–389 is cut; there is a hard cut at 390.
- **Nole freeze and founding:**
  - Nole's freeze runs 420–464 (thaws at 465, not 450); the LEDGER flash at 450–453 is gone
  - Mas sips 450–454 (was 453–464) and stands at 455
  - the N lifts at 456 (was 467) and clunks at 464 (was 473)
  - the sign relights in one step at 465 (was 474 with a flicker)
  - place cards at 465; key art 465–479
- **Roll call:** the cut frames are unchanged. The 537–539 pull-back is gone and the window holds to 539.
- **Skyline:** the MACHINES THINKING pop and Rima's f617 light are gone. Rima is on NopeAI's roof deck from 540 with her light drifting. A cursor blinks on the spire tip 540–689.
- **Title:** shake is 630–632 at 3 px (was 630–634 at 8 px). The palette ladder is gone (chrome from 630). The subtitle types 640–647 (was 640–655).
- **Toast:** "your post was sent" (705–711) is replaced by "verified: human" at 692–719.

**Resulting audio cues:** collar pops 190/205, whoomph 290, `fire_live` 340, HUD chimes 351/354, scroll `item_take` 390, N `item_take` 456, clunk 464, neon ignite and buzz 465–479, Orb chime 692.

**Other changes (no frame moved)**
- **Removed spoilers and held items:**
  - scroll: only the two real fragments plus "ADDENDUM:" and a blank tag
  - Alyi's stat line: "PRODUCTS: 0 · EFFIGIES: 1"
  - roll-call plates show names only
  - skyline: TRUTHGTP, BELOW.ABOVE.AROUND and the drooping GPUs are removed; the Misanthropic tag is blank
- **RUMPT, redrawn at 112×136:** plain rounded head, square shoulders, the tie hanging over the podium lip, and a point about 8° above horizontal with a clear fist, thumb and finger. The podium roundel is gone and the plate is blank.
- **Roll call rebuilt to the script layout:** 112×136 windows at the script's x positions. They ride a cyan stair on one steady dusk surround (236/220/196/164/128, then off the top). Faction colours sit on a thin inner mat at one brightness level.
- **Roll-call portraits:** RADNUS's red now stays inside the siren and the four brand-colour tiles are gone. The portraits are cropped into the smaller windows.
- **Title:** plates clear of the wordmark stay on, one step dimmer from 634, so PEEKDEEP reads to about 650. The Orb period has a keyline and a dark ring.
- **2014:** WHY COMBINATOR is now orange letters on a cream plate with a navy outline, and no source pixel is #FF6600. Mas's hair is brown in 2008 and 2014. His pack is now red and sits behind his shoulder.
- **Dinner figures:**
  - Alyi rises seated in his chair with a napkin; his eye glints never print, so no "sunglasses"
  - Mario's raised hand is now an index point with a visible thumb
  - SPACEZ is cream with an outline so it reads as a wordmark
  - standing Mas holds his glass and every arm ends in a hand
- **Smaller fixes:**
  - Alyi and Nole print inks are pushed apart (orange and red)
  - cards open onto the portrait instead of a black box
  - the 1993 dialog title bar is dithered, not pinstriped
  - the 2008 GPS trail runs over land in the brightest cyan
  - the macro zoom is centred on the cursor, so the loop is a match
  - there is an ID badge in the cold-open room as a work cue

**Not changed, needs a decision from you**
- **Bookend f690–691:** I kept these as built, because the art director's "keep" list includes that pull-back. The edit review wants the room at f690.
- **Crown landing:** kept at 217, as the sound review advises, instead of the edit review's 220.
- **Freeze rules:** the founders still thaw instead of staying frozen through f479. The cold-open monitor still faces camera, and the f225 palette switch is still hard. These are rulings the edit review asked for; the art director approved them as built.
- **Hill and political balance:** not built, per the default decision. The tone review asks for a matching presence for the other side somewhere in the intro.
- **1993 pillarbox:** the bars are in the code but disappear against the dark room. Either add a visible edge or record the cut in SCRIPT.md.
- **Also unchanged:** card placements, Mario stepping out at 350 with the finger at 357, and the whale's three poses. The roll-call windows sit 3 px higher than the script's y values so their frames rest on the line.
- **`studio/notes/intro.md`:** its Deviations table is now stale. I didn't edit notes or SCRIPT.md.

**Files touched**
- `mcoldopen`: timeline, scene, medium
- `meras`: timeline, era1993, era2008, era2014, palettes
- `mdinner1`: timeline, scene, cards
- `mdinner2`: timeline, scene, cards, masmd2, sign, scroll
- `mrollcall`: timeline, scene
- `mfinale`: skyline, title, bookend
- `src/dev/intro/tools/events.ts`
- Shared files, all intro-directed changes: `shared/pixel/ui.ts`, `freeze.ts`, `cast/mas.ts`, `cast/alyi.ts`, `cast/mario.ts`, `cast/nole.ts`, `cast/rollcall.ts`

A backup of the original `src/` and the old events file is in `/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/picfix/`. My frame dumps are deleted.

Updated outputs, all in `/home/jgon/project/art/mrmas/out/season/intro/picture/`:
- `intro-ep1-1080p-silent.mp4`
- `intro-ep1-4k-silent.mp4`
- `intro-events.json`
- `beats/`
- `handoffs/`