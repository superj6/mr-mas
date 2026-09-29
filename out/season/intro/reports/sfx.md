The build is done. The SFX stem is a 48 kHz, 24-bit, stereo WAV of exactly 1,440,000 samples (30.000 s), cued to the picture as built. `intro-events.json` appeared at 08:13 while I was working: I parsed it, re-synced the stem to it, and checked it frame by frame against `intro-ep1-1080p-silent.mp4`.

**Event count**
- **Main stem: 96 events.** 41 are key taps (one per typed character, plus the picture's shift+enter at f70); 55 are everything else.
- **Script-frame version: 90 events.** The same sounds placed on the SCRIPT v2.1 frames, for use once the picture conforms.
- **Extras: 17 events.** Opt-in and muted by default.
- **Blips: 13 events.** On their own bus.

Of the 56 sync points matched in `intro-events.json`, only one moved: the scan cone opens at f99. The typing start and end frames also match.

**Automated checks (`qa.json`)**
- The roll call (f480–524) and the title (f630–704) are digitally silent in the main stem, as the script requires.
- The neon buzz and every dinner tail stop dead on f480, to the sample.
- Silent at 30.000 s, so the loop is clean.
- Typing peaks at −29.7 dBFS or lower under the voice-over.
- The hits sit 6–17 dB under the V1 score, supporting the music rather than doubling it.

**Where the production list and the script disagree.** The script is the source of truth, so these items are not in the main stem. They are built very quietly in `intro-sfx_extras.wav` so you can compare:
- glyph shimmer (scan cone, cursor window, iris f705–706): the script says "No glyph_shimmer";
- render-front sweep: "A style switch gets no sound of its own";
- roll-call cut ticks: "The roll call has no SFX except the reverse swell";
- roofline ignite: "No new SFX";
- title-hit layer: the music and vocal pad own f630;
- candle/whoosh into the dinner: the tape spin-up and swell there are cut.

The script also drops the camera-shutter freeze sound; the shutter layer in the main stem is its short chip freeze hit. "Default hybrid" gives way to the script's rule: chip sounds in the 1993 and 2008–14 scenes, plus the klaxon, freeze hits, siren, ka-ching, drip, plop and Post click.

**Picture vs script mismatches.** The stem follows the picture here; the script frame is shown beside each one in `spotting.md`.
- **Cold open:**
  - Typing runs f24–55 and f71–93, with a shift+enter at f70. It lands *with* the voice-over, not 6–8 frames ahead (script f18–49, f64–83), and the last key falls after the voice-over ends.
  - The shots are a stepped macro/medium/wide structure, not insert/room/insert. The chart snaps at f113 (script f114).
- **1993 to 2014:**
  - Collar pops are at f180/187/202 (script f180/190/205).
  - The crown flies f204–216 and lands at f217 (script f220).
  - Two whip pans run into the dinner (f220–229); the script has a locked match cut.
  - Eggs the script cut are back: `▶ PLAY` and `JUN 09 2008`.
- **Dinner:**
  - **Each freeze lasts one beat, then the room runs live under the card.** The script keeps it frozen until each card closes. So I added quiet picture-driven sounds: Gerg's keycaps from f257, the effigy fire from f315 and again f386–409, and the sign's buzz from f450.
  - The keycap is pocketed at f254 (script f278) and the effigy ignites at f296 (script f290).
  - The HUD ticks are at f348/352/356 (script f348/351/354). The scroll runs from f375 with a whip pan (script f378–389), and Mas grabs it at f390 (script f392).
  - **The N lifts at f467, clunks at f473 and the sign relights at f474, all after the freeze.** The script has f456/464/465, inside it.
  - Also in the picture but not the script: the rose-window glyph boot, a flame wipe at f340–344, and a LEDGER flash at f450–453.
- **Roll call:** the cuts match exactly. The layout is one centred window, not eight windows riding the curve.
- **Skyline, title and bookend:**
  - The pops match. MINDDEEP pops one frame after ELGOOG, and both exes sit frame-left of NopeAI.
  - The title keeps the palette ladder the script cut, and the subtitle types at 2 characters per frame.
  - **The bookend is a pull-back onto the front two-shot, not the reverse angle.**
  - **There is no Orb toast at f692**, so its chime is left off the blip stem. The monitor shows "your post was sent" at f705 and Mas clicks Post again then, so a quiet Post click sits under the ding.

**Library and script gaps**
- The script names `drip_clack--chip` and `plop_water--chip`, but neither is in the manifest. I derived both (the plop is unpitched, as the script asks).
- Not in the library, so synthesized: the item pickups (three versions), the paper-unroll swish, the three chip check chimes, the crown flutter and landing tick, the overhead rumble and the tile clatter.
- Mario's D♭5 blip isn't in his kit, so I raised the C5 a semitone.
- Tuning: the hum and the neon lose their A (major-third) overtones, the neon ignite loses its F6 ring, the servo sits on C6, and the scan is retuned from about 1621 Hz onto F and C.
- The V1 render still has the v2.0 bar 9, so the previews check SFX sync, not the score.

To re-sync after picture changes, run `audio/.venv/bin/python audio/intro/sfx/build_intro_sfx.py` (about 10 s). It re-reads `intro-events.json` and logs every change in `picture-sync.json`. I deleted my temporary frame dumps; the folder is 48 MB.

Files are in `/home/jgon/project/art/mrmas/audio/intro/sfx/`:
- `intro-sfx_stem.wav`
- `alt/intro-sfx_stem_script-v2.1-frames.wav`
- `alt/spotting_script-v2.1-frames.json`
- `intro-sfx_extras.wav`
- `intro-blip_stem.wav`
- `spotting.json`
- `spotting.md`
- `picture-sync.json`
- `qa.json`
- `preview/`
- `src/`
- `build_intro_sfx.py`
- `spotting.template.md`
- `make_previews.py`