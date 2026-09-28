# Content license: CC BY-SA 4.0

**MR. MAS** creative content © 2026 jgon (superj6), licensed under the
[Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/)
([legal code](https://creativecommons.org/licenses/by-sa/4.0/legalcode)).

You're free to share and adapt it, including to make the next episodes, for any purpose, as long as you:
- **credit** it ("MR. MAS by jgon, made with Claude"), link this repository and the license, and say what you changed;
- **share alike:** release your adaptations under CC BY-SA 4.0 too, so the show stays open.

## What's content and what's code

| Content (CC BY-SA 4.0) | Code ([MIT](LICENSE)) |
|---|---|
| `show/`: the bible, outlines, scripts, characters, research and production notes | `studio/src/`: the Remotion pixel engine, shots and tools |
| The art, the character designs and the rendered pictures and films | `audio/**/*.py`, `*.sh` and the other tools: score engine, mixer, casting, takes |
| The music (score, cues and stems) and the sound design | `ops/`, `docs/` tooling, and the build scripts anywhere in the repo |
| The rendered voice takes and mixes | |

## Not covered: third parties keep their own terms
- **Sample libraries:** see [`audio/samples/LICENSES.md`](audio/samples/LICENSES.md) (CC0, CC BY 3.0 and others).
- **Fonts:** SIL Open Font License via `@fontsource` packages.
- **Synthetic voices:**
  - Kokoro-82M, Apache-2.0.
  - ElevenLabs library voices, used under ElevenLabs' terms. Check them before reusing the voices themselves.
  - No voice in this show is a clone of a real person.
- **Video-model inserts:** made with Runway, under Runway's terms.
- **Libraries** under `studio/node_modules` and the Python environments keep their own licenses.

## The show's guardrails (please keep them)
MR. MAS is parody and commentary about public figures' public conduct. If you build on it, keep to the rules in [`show/bible/guardrails.md`](show/bible/guardrails.md):
- parody names only
- no real logos
- no photoreal likenesses of real people
- no cloned voices
- no private lives
