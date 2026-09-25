I've built intro frames 345–479 as the `mdinner2` composition: the MARIO and NOLE cards and the OPEN AI → NOPE AI founding. It continues mdinner1's dinner scene; the room, lighting and freeze look are imported from mdinner1 unchanged. The MP4 is 960×540, 24 fps, exactly 135 frames. I checked every beat by eye in the fast Node preview and the Remotion renders over several rounds of fixes. My files typecheck clean; the project's only 11 errors are in another builder's `realism/bake`.

**Continuity with mdinner1.** Frames 345–359 are pixel-identical to mdinner1's version, confirmed by a pixel diff. The one exception is 12 px at 345–346, a water line I added to Mas's glass. mdinner1's notes already plan to cut to this composition at 345, so the overlap is invisible either way.

**Composition ids** (dev entry `src/dev/mdinner2/entry.tsx`)
- `mdinner2`: the span. Local frame 0 is global 345. `Mdinner2.tsx` also exports `MDINNER2 = {from: 345, durationInFrames: 135}` and `<Mdinner2Sequence />` for mounting it in the full intro.
- Stills, named by global frame:

| Composition | Frame | What it shows |
|---|---|---|
| `mdinner2-mario` | 378 | Mario's card rising; he's an ink silhouette in the lit vault door |
| `mdinner2-telescope` | 398 | Mas has rolled the scroll's end into a paper telescope aimed at the ceiling |
| `mdinner2-booster` | 416 | the room running again as the booster rides down beside Mas |
| `mdinner2-nole` | 451 | Nole's card, the SUED OVER IT. stamp, fine print and the green "ledger" flash on the check |
| `mdinner2-nope` | 479 | the key art |

**Timing on the beat grid**
- **360:** Mario freeze.
- **375:** DOOM RISK bar fills.
- **390:** Mas takes the scroll.
- **405:** the ceiling bursts.
- **420:** Nole freeze, the biggest hit.
- **435:** the stamp lands.
- **450:** the check flashes ledger green.
- **465:** Mas stands and slides the N; the letter lands at 473 and "AI" lights at 474.

**Style switches:**
- **Two-tone freeze, twice.** Mario and Nole print darker than the room, so Mario reads as a silhouette in the bright vault and the check stays readable.
- **Ledger flash.** Four frames, on the check only.
- **Neon light spill.** In the frozen key art the sign relights the room around it: dark red, warm pink, and cyan off "AI".
- **No glyph.** mdinner1 already uses it on the rose window, and the next planned one is at 480.

**Audio examples.** A timing scratch track is synthesized in mdinner1's instrument set, so the two spans sound like one score.
- **Music:** the B♭ minor hit at 360, with the klaxon cut dead; a sighing violin; a fuzz-guitar lead-in to the C major hit at 420; a drum fill into 480.
- **Effects:** the burst, the rocket roar, glasses sloshing (never Mas's), the stamp thunk, a dry register tick (no "ka-ching"), the neon hum and the letter clunk.
- **Vocals:** marked, not faked. Mario's inhale at 357 gets cut off by the freeze.

The measured loudness peaks land at 360, 405 and 420. The frame-by-frame cue sheet is in `notes/mdinner2.md`.

**Strengths**
- The live booster frame (416) is the strongest image: rocket through the ceiling, Nole with the check, the OPEN sign swinging in, Alyi floating, Mas perfectly calm.
- The key art reads instantly, and the neon lighting the frozen room makes it feel lit rather than pasted on.
- The gags chain by cause: Mario's word count becomes the scroll, the scroll's end becomes Mas's telescope, and Mas aims it just before the ceiling bursts. The telescope springs open into the paper transition, and Mas's touch brings the sign back to life.
- The N slides behind O, P and E, so no accidental in-between words appear.
- The fine print is readable for anyone who pauses: DOOM RISK, ADDENDUM:, "MARIO (JOINS 2016)", "$133M".

**Weaknesses**
- **Nole:** frozen Nole is hard to read in the hatch; the check and his card portrait carry him.
- **Telescope:** the telescope beat is small on screen and works mostly by timing.
- **Key art:** Mario is out of frame there, because in mdinner1's layout the founders span more than one screen width. Showing everyone would need a new half-scale drawing of the room.
- **Draft sheet:** the DRAFT sheet is mdinner1's tiny 8×7 px drawing, so "DO NOT PUBLISH" can't be read.
- **Bread basket:** I landed the booster next to Mas rather than on mdinner1's bread basket at x 820. It crushes the burnt effigy instead.
- **No rotation:** the design's crooked card and springing stamp became a straight slam with an impact frame, because sprites can't rotate or scale.
- **Standing Mas:** this is a new drawing (mdinner1's seated Mas with the torso extended behind the table) and could use a hand pass.
- **Coupling to mdinner1:** my composition imports mdinner1's files and copies its Mas sprite. If they change them, the diff check in the notes shows what to re-sync.

**Questions and resources that would raise quality**
- **Key-art wide:** should it show all five founders? Yes means I build a half-scale drawing of the room.
- **mdinner1 coordination:** could mdinner1 add Mas's water line and a readable DRAFT sheet, so both spans match?
- **Audio stems:** real stems (brass hits, solo violin, fuzz guitar), sound effects (neon hum, metal clunk, rocket landing, glass slosh, rubber stamp) and a voice for Mario's inhale. With stems I'll cut them to these frames.
- **Video model:** if you connect one, I'd prototype a generated smoke or paper-whoosh layer under the booster landing, reduced to the show's palettes so it stays pixel art.

Everything is in `/home/jgon/project/art/mrmas/`:
- `studio/src/styleframes/mdinner2.frame.tsx`
- `studio/src/dev/mdinner2/`: `Mdinner2.tsx`, `entry.tsx`, `scene.ts`, `timeline.ts`, `masmd2.ts`, `sign.ts`, `scroll.ts`, `booster.ts`, `props.ts`, `cards.ts`, `tools/preview.ts`, `tools/scratch_audio.py`
- `studio/notes/mdinner2.md`
- `out/pixel/moments/`:
  - `mdinner2-mario.png`, `mdinner2-telescope.png`, `mdinner2-booster.png`, `mdinner2-nole.png`, `mdinner2-nope.png` (all 1920×1080)
  - `mdinner2.mp4`
  - `mdinner2-with-scratch-audio.mp4`
  - `mdinner2-scratch-audio.wav`