# Ep2's intro variant (`intro-ep2`)

**Status (2026-10-10, revised the same day): built, rendered, looked at full size, flash-checked.** Nobody has watched or listened to it yet [R8].

**The ask:** pipeline.md §8.3 and [show/episodes/ep02/intro-slot.md](../../../../../show/episodes/ep02/intro-slot.md): spoiler-safe changes, nothing from this episode's plot (LEARNINGS W3, M1). **The showrunner's correction (2026-10-10, pipeline.md §8.6):** the typed quote stays "near the singularity; unclear which side." in every episode, so the cold-open line is Ep1's again. The first build's "her" and its typing indicator are gone.

**The outputs:**
- `out/ep02/v1/intro/intro-ep2-V1-1080p.mp4`: the flash-fixed picture the manifest plays (720 f, 30.000 s, silent).
- `…-raw.mp4`: the master before the flash fix.
- `…-mux.mp4`: a review copy with its mix.
- `intro-ep2-events.json`: the picture events.
- The sound: `audio/intro/ep02/intro-ep2-mix-V1-chipchamber.wav` (built in `audio/ep02/intro/`, see its README).

## What changes, and what doesn't

| # | Item | Ep1 | Ep2 | Where |
|---|---|---|---|---|
| 1 | Cold-open line | "near the singularity; unclear which side." (40 keys) | **Ep1's, unchanged** (the showrunner, 2026-10-10): typed f18–83, Post f112, its nine tokens pop as in Ep1. `EP2_SLOT.cold.line` is `EP1_SLOT.cold.line`, the same object. (The first build's "her" and its typing indicator, f38–111, were turned down; `screen.ts` `drawIndicator` stays in the shared code, unused by both episodes) | `slot.ts` |
| 2 | World after Ep1 | dot at the knee (0.50) | the `you are here` dot rests at **0.55**, a step up the curve; it still climbs and leaves on the pluck (f86–90), on "side" as in Ep1 | `EP2_SLOT.cold.dot`; `screen.ts` `dotRest` |
| 2 | Misanthropic's price tag | blank | **blank, unchanged.** `$4B + $2B` is not added, because Ep1's final never aired those deals. The NOZAMA meter (Act Three 19.13) was cut, S4.08's meters went in C14, and neither the v3.5 lock nor its transcript carries them. This is the check proposal D-58 asked for. | — |
| 2 | Hill, CZAR lanyard, tally, coat hook | not in the shipped intro | not added: only what Ep1 aired, and the intro never drew these layers (pipeline.md §8.1) | — |
| 3 | Subtitle | `now in low-key research preview` | **`back by popular demand`** (22 characters, typed f640–645) | `EP2_SLOT.subtitle`; `dev/mfinale/title.ts` |
| 4 | Couch gag | the `CTRL` keycap | **`ESC`**, hand-pixelled on the same 14 × 4 face in CTRL's lettering | `EP2_SLOT.keycap`; `dev/mdinner1/props.ts` |
| 5 | Roll call | — | unchanged | — |
| — | The Orb's toast | `verified: human` | unchanged | — |

## How it's built

**The moments take an episode slot, with Ep1's values as the default.** That is pipeline.md §8.3 step 1. The fork, the plan's fallback, was not needed.
- `src/intro/slot.ts` defines the `IntroSlot` type and Ep1's values. Those values are read from the moments' own constants.
- `src/intro/scenes.ts` provides `scenesFor(slot)`. `SCENES` is `scenesFor(EP1_SLOT)`.
- `src/intro/IntroEp1.tsx` provides `IntroCut` (the same EDL for every episode). `IntroEp1` is `<IntroCut scenes={SCENES}/>`.
- The shared moments gained a slot parameter whose default is Ep1's:
  - `dev/mcoldopen`: `timeline.ts` (`ColdLine`, `ColdSlot`, `EP1_COLD`; the `L1_KEYS` / `L2_KEYS` export lines the SFX builder reads are untouched), `screen.ts`, `medium.ts`, `wide.ts`, `chips.ts`, and `scene.ts` (`makeColdOpen(slot)`; `coldOpen` is Ep1's).
  - `dev/mdinner1`: `props.ts` (the legend) and `scene.ts` (`makeScene(legend)`; `SCENE` is Ep1's).
  - `dev/mfinale`: `title.ts` (`titleAfter(…, sub)`), `bookend.ts` (`BookSlot`; the title thumbnail is cached per subtitle) and `scene.ts` (`makeMfinaleScene`, `localScene(start, slot)`).
- This folder holds:
  - `slot.ts`: `EP2_SLOT`.
  - `IntroEp2.tsx`, `frames.ts`, `entry.tsx`: the `intro-ep2` composition. It is not a `*.frame.tsx`, so it stays out of `src/Root.tsx`.
  - `tools/master.sh`: Ep1's master settings, with the composition and the output path as arguments. It refuses `out/season/`.
  - `tools/preview.ts`: a Node preview plus native-frame hashes.
  - `tools/events.ts`: Ep2's events, which are Ep1's export with the slot applied (the typing events stay Ep1's while the line is Ep1's).

**Ep1's intro is unchanged** [M]:
- **The stream:** `intro-ep1` was rendered from the slot code to scratch with Ep1's master settings. Its H.264 elementary stream is identical to the committed `out/season/intro/picture/intro-ep1-1080p-silent.mp4` (md5 `2ae91638225e02ac0f35c1b6306413ee`; 22 sampled decoded frames identical; `mp4cmp.mjs`).
- **The native frames:** all 720 hash the same from HEAD's code and the new code (Node, `composeFrame`).
- **The events:** the export is byte-identical to the committed `intro-events.json` (md5 `f37ea409b5e12dad7774ea78aaa6bc3a`).
- **The files:** every file under `out/season/intro/`, `audio/intro/` (except the new `audio/intro/ep02/`), `audio/theme/` and `out/ep01/outro/` matches its pre-pass sha1 (953 files).

## Re-render

From the repo root (`S` = your scratch folder; the heavy steps go through `ops/heavy.sh`):

```sh
bash studio/src/episodes/ep02/intro/tools/master.sh intro-ep2 out/ep02/v1/intro/intro-ep2-V1-1080p-raw.mp4 $S/intro   # ~1.5 min
A=show/episodes/ep02/production/v1/assembly/tools
bash ops/heavy.sh audio/.venv-casting/bin/python $A/intro_flashfix.py out/ep02/v1/intro/intro-ep2-V1-1080p-raw.mp4 out/ep02/v1/intro/intro-ep2-V1-1080p.mp4
bash ops/heavy.sh audio/.venv-casting/bin/python $A/flash_seg.py out/ep02/v1/intro/intro-ep2-V1-1080p.mp4
# the proof that Ep1's picture is unchanged (to scratch only):
bash studio/src/episodes/ep02/intro/tools/master.sh intro-ep1 $S/proof/intro-ep1.mp4 $S/proof
(cd studio && node src/episodes/ep02/pixel/tools/mp4cmp.mjs ../out/season/intro/picture/intro-ep1-1080p-silent.mp4 $S/proof/intro-ep1.mp4 0 60 112 250 647 710)
# a fast look, and the events:
(cd studio && node_modules/.bin/esbuild src/episodes/ep02/intro/tools/preview.ts --bundle --platform=node --outfile=$S/ip.js --log-level=warning)
node $S/ip.js $S 4 ep2 frame:40 frame:250 frame:660 frame:710
(cd studio && node_modules/.bin/esbuild src/episodes/ep02/intro/tools/events.ts --bundle --platform=node --outfile=$S/ev2.cjs --log-level=warning)
node $S/ev2.cjs out/season/intro/picture/intro-events.json out/ep02/v1/intro/intro-ep2-events.json
```

To make another episode's intro, write its `IntroSlot` beside its own composition, the way this folder does.

## Measured and looked at

**The revision (Ep1's line, 2026-10-10)** [M]:
- **Flashes:** the raw master reads 4 in a second at f221 (Ep1's whip smear, unchanged); after `intro_flashfix.py` (f222 and f224 hold f221 and f223), 1 a second at most, 0 red. The limit is 3, so it passes.
- **The file:** 720 frames, 24 fps, 1920 × 1080, yuv420p; the mux (re-made with the new master) is 30.000 s.
- **Against Ep1, native frames** (`tools/preview.ts` hashes, all 720): 163 differ, all from the kept changes. The cold open differs only in the medium shots (f30–59, 72–98, 105–117), and there only in the chart's `you are here` box (x 640–879, y 580–651 at 1080p): the dot and its label rest at 0.55. f0–29, f60–71 and f99–104 are Ep1's frame for frame. The rest: f232–253 (ESC) and f640–718 (the subtitle and the bookend's dot).
- **Looked at full size [J]** (the encoded file): f20 ("ne" and the caret, the same pixels as Ep1's encode), f60 (the wide, the same), f110 (the whole line typed, the pointer on Post; only the label sits a step right). The scan (f100–104) has Ep1's cells and tints; its GLYPH characters come from the browser's font pass and vary a little between renders.

**The first build ("her")**, for the record:
- The keycap: f250 and f254 (ESC in Mas's hand, legible as E-S-C when cropped); the subtitle: f646 and f660 (centred under the wordmark); the bookend: f700, f710 and f716 (the composer's f0 state with the dot at 0.55, the toast). These are unchanged by the revision.
- `intro_flashfix.py`'s repo root was one level short; that pass fixed it (7 up, not 6).

## Open, and for a human

- **A watch and a listen.** In particular, whether ESC reads at speed.
