Both moments are re-rendered to the same filenames in `out/season/intro/moments/`, and the engine fixes are in. The `mdinner2` overlap with `mdinner1` (345-359) is pixel-identical: I checked frames 345, 352 and 359 after polish-a's last edits and got 0 differing pixels. I did not edit any cast module.

**One freeze module for the whole dinner.** polish-a and I both built a shared freeze/card module in parallel. They then deleted theirs (`cast/cards.ts`) and moved `mdinner1` onto mine (`src/shared/pixel/freeze.ts`). I removed my duplicate era stamp from `ui.ts`; the era stamp now lives only in their `cast/era.ts`. The four founder cards and prints now use one set of code.

**Engine (`src/shared/pixel`)**
- **Colours:** the dusk, fleece, ink-blue and rocket-red ramps are now in the master palette (`palette.ts`), with the same hex values, so existing art doesn't change.
- **Skin never dithers:** freeze, early-web, ledger and terminal now render skin as one flat colour. 1-bit is exempt, since its patterns are the 1993 look. meras' 2008/2014 palettes inherit this unless they pin skin themselves.
- **The freeze is now a threshold plus one 50% pattern.**
- **`freeze.ts`:** holds each founder's ink (Gerg green, Alyi orange, Mario denim blue, Nole maroon), the print sets, the single card layout, and a smaller rubber stamp with worn ink.
- **Font:** added `$`, `·` and `✓`.
- **Docs and demos:** `PIXEL_GUIDE.md` is at v1.1, and the affected demos in `out/lookdev/pixel/engine/` are re-rendered.

**`mdinner2` (345-479)**
- **Freezes:** Mario's world is printed for one beat (360-374) and Nole's for two (420-449). The room runs again under each card.
- **Prints:** same inks, curves and method as Gerg and Alyi. The table no longer leaves a dead navy band at the bottom, and signs and text print as solid letters.
- **Cards:**
  - Mario: now in the standard layout, rising in from below. His one fine-print line is a live `WORD COUNT` counter.
  - Nole: the pledged line is cut, and `SUED OVER IT.` is a name-sized stamp landing on 435.
- **Cuts and changes:**
  - The paper wipe at 401-404 is gone; the telescope holds straight into the burst at 405.
  - Mario's essay now unrolls from his hand in the live room.
  - The neon's red and cyan light the live wall, window, table, Nole and the rocket (hull).
- **Audio:** the scratch track is re-cut to the new timing.

**`mfinale` (now 540-719)**
- **Rebase:** starts at 540 and no longer uses `slot.ts` or `callart.ts`. The old slot stills are moved to `out/season/intro/moments/_cut/`.
- **Title Orb:** now the cold open's Orb model at 19 px, with no equator band, so it doesn't read as a Poké Ball. It sits tight to the R with a word space after, exactly on the rose window's centre.
- **NopeAI:** an 8-petal jewel rose window matching the dinner's cathedral, plus a hand pass on the stone facade.
- **Rooftops:**
  - New MACHINES THINKING tower, with RIMA stepping into a spotlight at 617.
  - KRAM holds a thermos.
  - The METAVERSE billboard is readable, and plates no longer crop at the frame edge.
- **Bookend:** drawn by the cold open's own `drawMedium`, so it inherits polish-a's arms and monitor arm. His key light turns violet while the title is on screen. The `verified: human` toast is cut.
- **Audio:** the roll call's 8 stabs now land on its cut frames, and there are full stems.

**Compositions:** `mdinner2`, `mdinner2-{mario,telescope,booster,nole,nole-ledger,nope}` (`nole-ledger` is new); `mfinale` (180 frames), `mfinale-bars9-12` (new, 480-719: the roll call then `mfinale`), `mfinale-key-{skyline,title,bookend}`, `mfinale-sheet`; `pixelengine-*`.

**Outputs** (all in `out/season/intro/moments/`):
- `mdinner2`: `mdinner2-*.png`, `mdinner2.mp4`, `mdinner2-scratch-audio.wav`, `mdinner2-with-scratch-audio.mp4`
- `mfinale`: `mfinale-{skyline,title,bookend}.png`, `mfinale.mp4`, `mfinale-with-scratch-audio.mp4`, `mfinale-bars9-12.mp4`, `mfinale-bars9-12-with-scratch-audio.mp4`
- Audio stems: `audio/mfinale-{music,sfx,vox,mix}.wav` and `audio/mfinale-bars9-12-*.wav`
- Notes: `notes/mdinner2.md` and `notes/mfinale.md` are rewritten; `notes/pixelengine.md` has a new v1.1 section.

**Strengths:** the dinner now reads as one print style with legible lettering; the rose window reads as stained glass rather than an eye; the title reads "MR. MAS"; the bookend genuinely closes the loop into the cold open; and the neon-lit final frame is a stronger key art image.

**Weaknesses:**
- Standing Mas in the key art is still a grey block with no arms.
- The Orb as the period is small and only reads at full size.
- KRAM's thermos is an override in my skyline file; a native pose in `bosses.ts` (polish-a's) would be cleaner.
- `mdinner2` copies `mdinner1`'s print routine, which isn't exported, so a change there needs a manual re-sync. The tone curves are imported, so those stay in sync automatically.
- The roll call's last frames have no stars, so stars appear on the cut to the skyline at 540. The fix is in `mrollcall`, which isn't mine.
- The audio is still synthesised placeholders.

**Resources that would raise quality:**
- Real stems: brass stabs with a chip lead, an 808, a celesta.
- Two scratch voice reads: Mario's "well, actually—" and Nole's pitch.
- A few "aah"/"ooh" choir takes in F.
- A video model, so I can prototype a palette-quantised smoke plate under the booster landing.