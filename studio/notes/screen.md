# SCREENLIFE / UI-native structure — builder `screen`

The test beat told entirely on Mas's monitor: an invented OS ("Halcyon"), a video app (**Presence**),
the parody social app (**Z**), a terminal, and a water widget. Characters exist only as
**line-screen video**: every camera feed is re-drawn as horizontal scanlines whose thickness is light,
in a per-character duotone (Mas = monitor cyan on near-black, Nole = signal orange). The UI labels it
`LOW-LIGHT`, so the treatment is a camera mode inside the story, not a filter on the show.

## Files (all owned by this builder)
- `src/styleframes/screen.frame.tsx`: deliverable compositions
- `src/styleframes/screen/anim.ts`: beat sheet `T` (every timing lives here), springs, rings, noise, `twos()`
- `src/styleframes/screen/LineScreen.tsx`: the canvas line-screen renderer (lines, or a dots mode)
- `src/styleframes/screen/feeds.ts`: value painters (Mas's room + glass, Nole's office + door + phone), bust painters
- `src/styleframes/screen/noleTone.ts`: NOLE tonal rig (frontal webcam bust, 7 replacement mouths, jaw drop, brows, gaze, lids)
- `src/styleframes/screen/ui.tsx`: OS kit (window chrome, menu bar, Z toast, waveform, water widget, cursor, dock, icons)
- `src/styleframes/screen/Wallpaper.tsx`: THE ORB wallpaper, line-screened (static)
- `src/styleframes/screen/Scene.tsx`: the scene (camera, timeline, windows, flood, typing, SLAM, jolt)
- `src/styleframes/screen/extras.tsx`: lineup (Z profile cards) and style-switch sheet
- `src/dev/screen/entry.tsx`, `src/dev/screen/devframes.tsx`: dev entry, feed/viseme test sheets

Mas is the shared `masTone` (read-only import) with an extra head shift for the turn.

## Compositions
| id | what |
|---|---|
| `screen-scene` | 120 f @24 fps, the test beat |
| `screen-key` | still: frame 76, whole desktop (the flood) |
| `screen-extra-closeup` | still: frame 106, Mas looks into the lens, "super." |
| `screen-extra-lineup` | still: Z profile cards, shared scale and ground line (Nole's hair breaks his frame) |
| `screen-extra-switch` | still: house look plus an engraved certificate PDF and a 1-bit 1993 app |

`ScreenScene` takes `{frame?, cam?: {cx, cy, s}, noCursor?}`, so any frame can be re-staged as a still.

Render (use a private bundle dir; the shared scratch `bundle` name collides with other builders):
```
npx remotion bundle src/dev/screen/entry.tsx --out-dir=<private>/bundle --bundle-cache=false
npx remotion render <private>/bundle screen-scene ../out/lookdev/structures/screen/scene.mp4 --scale=0.5 --concurrency=1
```
The 120 frames take about 40 s at half scale on this CPU box.

## Beat map
- 0–23: close on Mas's feed (typing, blinds, glass), then a slow pull-back reveals the terminal
  (`git commit -m "quiet, steady prog…`), widget "still.", 11:58 PM. An orange light leak creeps in on 21–23.
- 24–33: takeover. There are 3 frames of designed glitch bands (INCOMING · NOLE · DND OVERRIDE). The call window
  slams in from screen-right on a spring, knocks the terminal down-right and bumps Mas's window. The DND pill is
  struck through ("overridden by NOLE"), the feed sync-rolls ("connecting") and Mas's feed flashes warm.
- 33–46: Nole bursts into his own frame from the right through the door, drawn as multi-exposure smear frames. He overshoots, then grins.
- 46–79: push-in on Nole's tile. He leans in and jabs the phone at the lens three times. Live captions write
  "I came up with the name!" word by word, the speaker ring and waveform pulse, and 12 Z posts flood the right edge
  (plus a voice note, "+N more"). The badges climb to 99+.
- 80–86: whip pan (horizontal blur) to Mas's tile.
- 86–107: the cursor clicks the composer. Mas's eyes dart to the lens and his head turns slowly (89–103). One blink (98).
  He types **"Super!"**, holds it 5 frames, deletes it and retypes **"super."**, with a tiny smile at 102. He sends at 105,
  and the bubble holds alone for 3 frames.
- 108–119: Nole replies "NAMED IT." (*sent with SLAM*). It falls in huge and hits at 110, and the camera cuts wide and
  locks. Every window, toast, dock and menu bar jolts and sloshes (translate, rotate, skew, damped), toasts fall, and
  Nole's feed slips. **The water widget never moves.** Its label has read "still." since frame 0.

## Rig and conventions (why the limits read as choices)
- **Humans run on twos (12 fps), UI on ones.** That is video-call cadence, so limited animation reads as authentic.
- **Line-screen quantizes the flat tonal planes into light.** Hard plane edges turn into scanline-width steps that read
  photographic. The lines are drawn at output resolution (`devicePixelRatio × camera zoom`) so they never alias.
- **Adaptive-bitrate tiers.** Line pitch steps finer as the camera pushes in, with a 2-frame row slip, like a stream
  upgrading. Close-ups gain detail for acting beats, and the slip is a free transition for drawing swaps.
- **Tiles crop everything below the chest.** Hands appear only as a single fist + phone drawing.
- **Dialogue is captions, posts and typing**, so lip sync only has to be approximate. The visemes are big dark shapes that
  read through the screen.
- **Motion = smear frames / whip blur / codec slip.** No in-betweens are needed for fast actions.

## Known issues / next pass
- Mas's head "turn" is a feature slide (`turn`), extra head shift and a tilt. It sells because the gaze lands in the lens,
  but a drawn second head angle (frontal Mas) would make it land harder.
- Nole's rest mouth and hair mass still feel a bit mask/helmet-like. The rig wants a designer pass on the hair silhouette
  and the cheek planes.
- In wide shots the faces are small (Mas's eyes are about 4 scanlines). The structure relies on camera push-ins for acting.
- Toasts overlap each other while sliding in (intended as flood chaos, but busy in stills).
- UI type is Jost (bundled). A custom UI face would sell the invented OS more.
