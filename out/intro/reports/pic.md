I've built the full 720-frame `intro-ep1` composition and rendered both silent masters. Each is 720 frames, h264 yuv420p, 24 fps, 30.000 s, no audio track: 1080p at crf 12, 4K at crf 16 from a `--scale=2` render.

**Handoff frames** (I looked at every cut and its neighbours at native scale):
- **meras → mdinner1: cut at f225.** Meras' own 225–239 is a stand-in 2015 room, not the dinner set, so the only clean edit is the match cut on the beat. It was broken (Fix 1 below); now the crown glint on f224 sits exactly on the centre candle flame on f225.
- **mdinner1 → mdinner2: cut at f345.** The 345–359 overlap is pixel-identical: 0 pixels differ on all 15 frames. I cut on the first overlap frame, beat 6.4.
- **mdinner2 → mrollcall: hard cut at f480** on the downbeat, from the NOPE AI key art to the TASYA window. Clean.
- **mrollcall → mfinale: hard cut at f540.** mfinale already starts at 540 and no longer mounts its old 480–539 slot, so no edit was needed. The roll call closes onto the skyline's own sky over 537–539, but stars appear on the cut because the roll call's sky has none.
- **Loop f719 → f0** is clean: black with the cursor off (713–719), then the cold-open cursor on at f0. **f119 → f120** (paper white to 1993) is also clean.

**Fixes:**
1. **Match cut, one moment-file edit.** In `meras/era2014.ts` I changed `HANDOFF` from [84,108] to [84,95]. The old point was the candle's base, 13 px below the flame. The edit is marked in the file and written up in `notes/intro.md`.
2. **YC orange.** The 2014 section (f195–224) had about 3,200 pixels per frame of #FF6600, which the script bans. It comes from the shared early-web palette and meras' 2014 palette. A check in my own layer (`src/intro/qc.ts`) maps it to the approved #FF7F2A, and all 720 frames now have none. Fixing it at the source would make that check unnecessary.
3. **Encoding.** At the same crf, Remotion's built-in encoder smeared colour across pixel edges. I encode the Remotion PNG render with the bundled ffmpeg instead. The 1080p master against the lossless render improved from 39.3 to 44.1 dB average and from 29.7 to 34.8 dB at the worst frame (f117).

**Checks:**
- Each moment inside the intro renders identically to its own composition; I checked five frames, including every tokens-effect frame.
- The photosensitivity check passes: at most 2 flashes in any 24-frame window, against a limit of 3.
- The only odd single frame is f180, meras' intended 2-px camera bump on the first collar pop.

**Script deviations I didn't fix** (they're in other owners' files; all are tabled in `notes/intro.md`, and the events file gives both frames):
- **Title shake:** 8 px at f630, where the script's rule is 3 px or less.
- **Title palette ladder:** f630–638 still steps the title through old palettes; v2.1 cut this.
- **Rose window:** the tokens effect at f292–293 is outside the script's budget.
- **Alyi's card text** reads `BUNKER: YES`; the script says use `EFFIGIES: 1` until a ruling.
- **Ledger flash:** Nole's check still flashes f450–453; the script holds it out of the cut.
- **The N move** plays 467–473 after the freeze instead of 456–464 inside it.
- **Freezes** last one or two beats rather than until each card closes.
- **Roll-call layout and plate:** the build uses one growing window, not the script's windows riding the line, and RUMPT's plate reads `???` instead of blank.
- **For the audio team:** cue from `intro-events.json`, not the script. Several frames differ, for example collar pops at 187/202, letter clunk at 473 and neon relight at 474.

Temporary frame dumps are deleted.

Files are in `/home/jgon/project/art/mrmas/`:
- out/intro/picture/intro-ep1-1080p-silent.mp4
- out/intro/picture/intro-ep1-4k-silent.mp4
- out/intro/picture/intro-events.json (151 events, the cut list and the beat grid)
- out/intro/picture/beats/ (48 stills + `_contact-sheet_intro-ep1-beats.png`)
- out/intro/picture/handoffs/ (45 files: stills and strips per cut, the match-cut zoom, the overlap diff)
- studio/src/intro/ (`edl.ts`, `scenes.ts`, `qc.ts`, `IntroEp1.tsx`, `intro.frame.tsx`)
- studio/src/dev/intro/ (`entry.tsx`, `review.tsx`, `tools/master.sh`, `tools/events.ts`, `tools/contact_sheet.py`, `tools/handoffs.py`)
- studio/notes/intro.md
- studio/src/dev/meras/era2014.ts (the one moment-file edit)