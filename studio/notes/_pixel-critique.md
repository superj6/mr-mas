# PIXELCRITIC: art-director review of the MR. MAS intro, pixel edition

I looked at every PNG in `out/pixel/` (the cast sheets, the engine demos and the moment stills) against the approved pixeladv key. For each MP4 I pulled every frame out with Remotion's bundled ffmpeg and read contact sheets and zoomed crops. I rendered nothing new, changed no builder files, and did not listen to any of the audio.

## Overall verdict

**Strongest images; this is what "real show" looks like:**
- the cold-open scan (`mcoldopen-04`)
- the 1993 alert card
- the live cathedral frame (`mdinner1-cathedral`)
- the booster frame (`mdinner2-booster`)
- the skyline
- the roll-call RUMPT and whale portraits

**Weakest:**
- the cold-open token chips
- the 2014 founders
- the navy-and-cream dinner freezes, which fill most of the dinner
- mfinale's frames 480–539, which were cut in brief v2.1
- the Orb used as the title's period

The single biggest structural problem: the dinner (240–479) is frozen in two tones for about 190 of its 240 frames:

| Freeze | Frames | Length |
|---|---|---|
| Gerg | 240–284 | 45 |
| Alyi | 300–339 | 40 |
| Mario | 360–404 | 45 |
| Nole | 420–479 | 60 |

So the "full BASE Woodrose" mostly reads as a navy dot-matrix.

## Style switches to cut

1. **mfinale 480–539, the whole old Ep1 slot.** That is the CHATGTP bloom, the grey board call, the glyph dissolve, BACK and the heart avalanche. Brief v2.1 replaced it with the roll call (spoiler rule).
   - Mount `<MRollcallSequence/>` at 480 and start mfinale at 540: set `MF_START` to 540 in `mfinale/timeline.ts` and remove `slot.ts` and `callart.ts` from the scene.
   - The subtitle "now in low-key research preview" still works on its own.
2. **The amber scanline at 225–229 (mdinner1).** It is a second render front just 57 frames after the cyan one, so it reads as an effect. Land the base palette on the last streak frame of the whip instead, with a hard switch at 225.
3. **The full-frame parchment "paper wipe" text card at 401–404 (mdinner2, `T.paperWipe`).** It is a four-frame white flash nobody can read, and the fourth transition type inside the dinner. Go telescope, then straight to the ceiling burst at 405. If a beat is needed, make it a two-frame scroll whip with no text page.
4. **The dither wipe from 2008 to 2014 at 195 (meras).** Replace it with a hard cut on the 195 brass stab.
5. **The "verified: human" floating toast in the bookend (`mfinale/bookend.ts`, `T.toast` at 692).** It is a winking label that competes with the planned final whisper, the iris glyph at 705–706. Cut it, or move it onto the monitor as a notification.
6. **The chips at 113–117 (mcoldopen), unless rebuilt in the pixel font** (see the cold-open fixes). If they aren't rebuilt, keep the tokenisation on screen plus the white-out and drop the big chips.

**Keep:**
- the glyph cone at 99–104
- 1-bit 1993 and its dialog
- the render front at 168–179
- the whip into the candle
- the two-tone freezes, but shorter
- the two-frame glyph boot of the rose window
- Alyi's token eyes
- the four-frame ledger flash
- the candle wipe
- the roll-call glyph cursor
- the title's build through the eras at 630–641 (motivated and brief)
- the iris glyph

## Per-moment fixes

### mcoldopen (0–119)

1. **`chips.ts`: the chips are the least "pixel" thing in the intro.** Each chip is a `GlyphLayer` drawing a TrueType font at about 25 native px with bloom: 1,168 colours in one chip crop, against 21 in Mas's face. Render the chip text with the pixel font (`shared/pixel/font.ts`) at an integer 2x or 3x on the native grid, with no bloom or soft shadow, for at most 3 frames. Otherwise cut them.
2. **`medium.ts`: Mas has no arms in the medium two-shot.** He "types" from f24 to f89 and "clicks Post" at f112, but only the screen moves. His torso is a flat block with a lighter band.
   - Add forearms and hands at the desk line: two typing drawings on 2s, locked to the key cues.
   - Add a 1–2 px shoulder dip on the f112 click.
   - Give the hoodie torso a hand pass: folds and a pocket.
3. **`medium.ts`: the look to the lens (f94) and the head tilt (f63) are 1 px changes and read as nothing on screen** (checked in the face strip). This is the key acting beat of the cold open.
   - At 94, swap in a near-front head angle drawing (castmas already has a "camera" room pose) and hold it through 117.
   - Make the tilt a proper 2–3 px drawing.
4. **`medium.ts`: the monitor pole is about twice too tall, so it reads as a TV on a stand.** Shorten it so the bottom of the screen sits about 12–16 native px above the desk, or use a monitor arm. The square-to-camera cheat itself is acceptable.
5. **`wide.ts`: in the wide the monitor faces camera while Mas sits beside it, looking at its edge.**
   - Turn the wide's monitor 3/4 toward him; the post doesn't need to read in the wide.
   - Raise the wall's ambient one ramp step near the monitor pool so the very dark room and the small Mas read.

### meras (120–239)

1. **The early-web palette dithers and darkens skin.**
   - Mas's face and arm in 2008 get a checkerboard.
   - In 2014 his face goes dark brown.
   - This breaks "no noisy dither on skin" and drifts his identity.
   - Fix: in `palettes.ts`, pin skin to 2–3 flat early-web indices and exclude skin from the dither passes in `era2008.ts` and `era2014.ts`.
2. **`era2014.ts`, the founders.**
   - **Faces:** they are backlit (`back: [0, 1]`) into blank dark ovals with a single eye, and read as doll-like. It could also read as unintended ethnic sameness. Add a front fill from the pendant lamps so faces sit at tone 3–4, and draw two eyes and a mouth.
   - **Hoodies:** the founder with the red/brown ramp (R0–R3) reads as one body-coloured lump. Give that hoodie a distinct hue.
   - **Props:** raised forks read as a pitchfork mob. Use chopsticks or ramen cups.
3. **`era2014.ts`, set.**
   - Brick shows only inside triangular lamp cones, so it reads as four brick pyramids. Show the wall at low tone everywhere, with lit pools that fall off.
   - The throne reads as a stepped altar with Mas standing on it. Give it laptop armrests and a seated or perched Mas.
4. **`era1993.ts` and `kid93.ts`, 1993.**
   - The black computer box reads as a dead screen facing us. Draw the beige case's back in white with vent slots.
   - The "rocket poster" reads as a leaf or surfboard. Give it a clear nose cone, fins and porthole.
   - The kid's cheek uses gradient dither. Use one hard 50% shadow shape, and clean the stray cluster on the nose.
   - Limit the room to 2–3 bounded MacPaint patterns rather than an all-over 25% dot field.
5. **`era2008.ts` (around line 60): the black masking curtain at stage right reads as a leftover pillarbox bar** from 176 to 194. Light its folds more, or narrow it.

### mdinner1 (225–344)

1. **`timeline.ts`: shorten the freezes.**
   - Keep the world frozen for 1 beat (Gerg 240–254, Alyi 300–314).
   - Let the card persist over the live room until 285 and 340.
   - Rework `worldClock` to match.
2. **`cards.ts`: cut Gerg's "PTO: 404"** (meme-number corny). Allow at most one fine-print line per card. "PRODUCTS: 0 · BUNKER: YES" is sharp; keep it.
3. **`cathedral.ts`: the levitating Alyi has a checkerboard dither across his face and robe.** Light him with flat ramp planes and a cyan rim instead.
4. **The freeze remap.**
   - Text and faces must threshold to solid tones; THE WOODROSE sign is illegible dot noise when frozen.
   - Use at most one dither pattern.
   - Fix the empty bottom third of navy in every freeze: move the card plate into that lower band, or tilt the frame down 16–24 px while frozen.
5. **Labels and faces.**
   - The floating "CTRL" label: draw the legend on the keycap itself in `props.ts`.
   - `masdinner.ts`: give Dinner-Mas one catchlight pixel per eye so the "calm, unblinking" read survives at about 50 px.

### mdinner2 (345–479)

1. **`timeline.ts`: unfreeze earlier.**
   - Mario's world: frozen 360–374, live from 375, card through the whip at 384.
   - Nole's world: frozen 420–449, live from 450.
   - The founding (465–479) and the neon relight then play in the full-colour room.
   - In `sign.ts`, spill the neon's red and cyan onto the live table and founders; that is a much better key art frame at 479.
   - It also makes the cut to the roll call at 480 cleaner.
2. **`cards.ts`: Mario's card breaks the template.** The plate sits left and the portrait bottom-centre, covering the table. Use the Gerg/Alyi geometry (portrait top-left, plate to its right). The rise-in animation can differ; the layout shouldn't.
3. **`cards.ts`: Nole's card.**
   - Cut "*PLEDGED · RECEIVED: $133M"; it duplicates the ledger flash's "RECEIVED: $133M" in the same frame.
   - Shrink "SUED OVER IT." to about the name's size and give it rubber-stamp ink breakup, so it doesn't read as an error banner.
4. **Cut 401–404** (see the cut list).
5. **Coordinate with mdinner1:**
   - mdinner1 adds Mas's water line and a readable DRAFT sheet.
   - In this span, keep the neon sign's lettering generic, never the real wordmark's letterforms.

### mfinale (540–719 after the cut)

1. **Cut 480–539** (see the cut list) and rebase the timeline.
2. **`title.ts`: the title's Orb reads as a Poké Ball** (light top hemisphere, dark bottom, dark equator band, ringed centre button). That is an IP collision.
   - Redraw it from the cold-open Orb model (`mcoldopen/orb.ts`: front lens rings, no equator).
   - Put the reflection on a curved, low horizon.
   - Reduce `ORB_D` from 25 to about 19 and kern it tight to the R, with a wider gap after, so it reads "MR." and not "MR O MAS".
3. **`skyline.ts` and `iso.ts`: NopeAI's facade has an oval cyan "eye" where the rose window should be.**
   - Use mdinner1's 8-petal neural rose window at skyline scale, so the title really sits in the rose window.
   - The three cathedrals (glyph, server, skyline) then rhyme.
   - The facade needs a hand pass.
4. **Skyline and title (v2.1 says the roll call "stands on their towers").**
   - Add a MACHINES THINKING rooftop with RIMA in a spotlight.
   - Change KRAM's rooftop prop to the thermos so it matches his roll-call flash.
   - Fix the plates cropped at the left edge ("G", "AI METAVERSE").
   - During 630–690, drop the skyline one palette step behind the wordmark.
5. **`bookend.ts`.**
   - Import `MED`, `CARET_FRAME` and `screenAt` from `mcoldopen/timeline.ts` instead of copying the numbers.
   - Shift Mas's key light toward the dusk violet of the screen's content with a ramp swap; motivated and cheap.

### mrollcall (480–539; not in the reports, reviewed anyway)

1. **`timeline.ts` `winSize()`: flashes 1–4 are 26% of the width and too small to read in 7 frames.** Scale the base window about 1.4x and keep the semitone leap.
2. **`shared/pixel/cast/rollcall.ts`: RIMA is still the plainest face.** Try a 3/4 head.
3. **Wire the 8 stabs to `CUTS`.** Otherwise this is approved; it is the most finished span.

## Cross-moment consistency fixes

1. **Dither discipline** is the one recurring craft defect: ordered dither used as shading on skin or figures (Alyi, 2008 Mas, the 1993 kid, the CHATGTP hand and table). Make it a rule: dither only on backgrounds and light falloff, never on skin. The freeze remap becomes a threshold plus one pattern.
2. **Freeze palette and card template in one shared module**, used by both mdinner1 and mdinner2.
   - Recommendation: cream paper with a per-founder ink in the faction colour (Gerg green, Alyi orange, Mario ink blue, Nole red). That matches castrivals' designed "Mario: parchment + ink blue" and ties the cards to the roll-call fields.
   - Use one card geometry with at most one fine-print line.
3. **Era stamps: 1993 (meras), 2014 (meras) and 2015 (mdinner1) use three different styles.** Use one font, size and position, rendered in each era's palette. The 2008 camcorder date is the only diegetic exception.
4. **Mas model.**
   - Lock the castrivals v2 lineup (Mas 78, Mario 80, Nole 93). The 2008 sprite at 82 px is taller than standard Mas, and pixeladv had 74.
   - Keep the forward cowlick and one catchlight in every scale.
   - Skin must survive every palette.
5. **One Orb model** across the cold open, the bookend and the title period. The 1-bit 1993 icon is fine as a reduction of the same design.
6. **Promote the CX dusk ramps into the master palette.** The castrivals bosses, the roll call and mfinale all use them, and they are currently "outside the palette".
7. **Transition vocabulary: keep four** (render front, whip streak, flash-print for freezes, candle wipe) and cut the rest (see the cut list).
8. **Audio: any structural cut needs a re-cut of the scratch track.** The 480–539 slot is the obvious one.

## Files

Review evidence (contact sheets and zoomed crops) is in `/home/jgon/project/art/mrmas/out/dev/pixelcritic/`:
- `mcoldopen-sheet-a.png`
- `mcoldopen-sheet-b.png`
- `mcoldopen-face-acting.png`
- `mcoldopen-chip-ttf.png`
- `meras-sheet-a.png`
- `meras-sheet-b.png`
- `meras-skin-dither.png`
- `meras-1993-zoom.png`
- `mdinner1-sheet.png`
- `mdinner1-figures-zoom.png`
- `mdinner2-sheet.png`
- `mfinale-sheet.png`
- `mrollcall-sheet.png`
- `orb-models.png`

The sheet builder and cropper are `sheet.py` and `crop.py` in `/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/`.