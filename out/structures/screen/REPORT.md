SCREENLIFE / UI-NATIVE (key: `screen`): delivered. The scene MP4, key frame and four extra stills are rendered. My files typecheck clean. I checked motion through about 10 rounds of stills and contact sheets pulled from the MP4, and did 4 full MP4 passes.

**Deliverables** (in `/home/jgon/project/art/mrmas/out/structures/screen/`)
| File | Composition id | What it is |
|---|---|---|
| `scene.mp4` | `screen-scene` | 120 frames, 24 fps, rendered at scale 0.5 with concurrency 1 (about 40 s) |
| `key.png` | `screen-key` | frame 76, the whole desktop: Nole yelling "I came up with the name!", the post flood, Mas calm in cyan, the water widget |
| `extra-closeup.png` | `screen-extra-closeup` | frame 106: Mas looks into the lens with the tiny smile, "super." sent |
| `extra-lineup.png` | `screen-extra-lineup` | Mas and Nole as Z profile cards at the same scale and ground line; Nole's hair breaks out of his card frame |
| `extra-switch.png` | `screen-extra-switch` | the house look beside an engraved share-certificate PDF (money flashback) and a 1-bit "ASK.EXE (1993)" app window |
| `extra-button.png` | (`screen-scene` at frame 113) | the button mid-slosh |

**Source files** (all mine, under `/home/jgon/project/art/mrmas/studio/`)
- `src/styleframes/screen.frame.tsx`
- `src/styleframes/screen/`: `anim.ts` (holds all timings), `LineScreen.tsx`, `feeds.ts`, `noleTone.ts` (Nole rig), `ui.tsx`, `Wallpaper.tsx`, `Scene.tsx`, `extras.tsx`
- Dev entry and test sheets: `src/dev/screen/entry.tsx`, `src/dev/screen/devframes.tsx`
- Notes: `notes/screen.md`
- Mas comes from the shared `masTone` + `ToneSvg`/`ToneCanvas`, imported read-only.

**How the beat plays**
- **0–1 s:** close on Mas's feed (typing, moonlit blinds, the glass on his desk). A pull-back reveals the terminal (`git commit -m "quiet, steady prog…`), the water widget labelled "still.", and 11:58 PM.
- **Burst-in:** a light leak, then 3 frames of designed glitch bands. Nole's call window slams in from the right on a spring, knocks the terminal down-right and strikes through the "Do Not Disturb" pill ("overridden by NOLE"). Inside his own video, Nole bursts through his door from the right as smeared multiple exposures.
- **Dialogue:** the camera pushes in while Nole leans in and jabs the phone at the lens three times. Live captions build "I came up with the name!" word by word, with a speaking ring and waveform. Twelve Z posts plus a voice note flood the screen, and the notification badges climb to 99+.
- **Mas's reply:** a whip pan to Mas. His eyes go to the lens first, then his head slowly turns, he blinks once and gives a tiny smile. He types "Super!", holds it, deletes it and sends "super.", which sits alone for 3 frames.
- **Button:** Nole replies "NAMED IT." (sent with SLAM). The camera cuts wide and locks. Every window, post, dock and menu bar sloshes, and Nole's video glitches. The water widget never moves, and Mas's own video stays clean.

**What looks strong**
- One consistent look: every camera feed is drawn as horizontal scanlines whose thickness is the light, in a duotone per character (cyan for Mas, orange for Nole). The app labels it "LOW-LIGHT", so it reads as a camera mode inside the story, not a filter on the show.
- The color script carries the story: cold cyan calm, an orange invasion, Nole's glow spilling warm onto Mas's face, then cyan again for his close-up.
- The UI is at real-product level: hairline windows, a proper type hierarchy, UI springs.
- The comedy lives in the UI itself: the Do Not Disturb override, "Camera on · nobody can see you", the knocked-over terminal, "Super!" deleted to "super.", "sent with SLAM".
- The water gag is set up from frame 0 by the widget's label.

**Weaknesses**
- **Head turn:** Mas's turn is a small feature slide plus gaze and tilt. It sells because his eyes land in the lens, but a drawn front-facing Mas head would land harder.
- **Nole's face:** his rest mouth and hair mass still read a bit mask- or helmet-like. It needs a designer pass on the hair silhouette and cheek planes.
- **Wide shots:** faces are small (Mas's eyes are about 4 scanlines), so acting beats depend on camera push-ins.
- **Busy moments:** the post flood overlaps while posts slide in, and the "connecting" frames (30–33) are murky.
- **Quality-switch glitch:** the 2-frame line slip when the stream "upgrades" (frame 53) could read as a bug to some viewers.
- **Fonts:** the UI uses the bundled Jost font; a custom face would sell the invented OS more.

**Rigging notes**
- **Moves well:**
  - eye darts, blinks and brows;
  - 7 replacement mouths with a jaw drop, big dark shapes that read through the scanlines;
  - lean-ins done as scale;
  - lunges done as smear frames;
  - light-color spill between feeds;
  - camera pushes, whips and cuts;
  - cursor moves, typing, captions, springs and the jolt.
- **Would look cheap:** continuous head turns, hand or body acting, walking, holding a wide shot on faces.
- **How the conventions hide it:**
  - Tiles crop at the chest, and the only hand is one fist-plus-phone drawing.
  - Characters animate at 12 fps like a video call, while the UI runs at 24 fps.
  - The scanline treatment turns the flat tonal planes into light that reads photographic.
  - Glitches (the stream "upgrading" as the camera pushes in, the impact slip) and whip blur cover drawing swaps for free.
  - Dialogue is captions, posts and typing, so lip sync only has to be approximate.
- **Cost per minute: low to medium.** Character animation is the lowest of the structures, because the busts are driven by about 10 parameters. The real cost is per-scene UI layout and motion design, but windows, posts, captions and the flood are all data-driven.
- **Sparing style switches: excellent, the strongest fit.** A switch arrives as a document or app on the same desktop: an engraved PDF for money flashbacks, an old 1-bit app window for AI/1993 moments, terminal output for glyph moments. The camera just opens it, so switches are diegetic and cost only that one asset.

**Build notes**
- Feeds render at the actual output resolution. Without that, the half-scale MP4 aliased badly.
- Other builders write to the shared scratch `bundle` folder, so I bundle into my own `screen-builder/bundle` instead; that folder name is in `notes/screen.md`.