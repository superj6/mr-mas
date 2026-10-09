# MR. MAS

**An animated pixel-art satire of the AI race, built entirely in code.**

**Watch: [EPISODES.md](EPISODES.md)**, the published episodes (Episode 1 is out).

Mas Manalt is a soft-spoken "nonprofit guy" with no equity and no detectable panic. He talks his way to the top of NOPEAI, survives every attempt to fire him, and races his billionaire ex-friends to build superintelligence. That superintelligence has been studying *him* the whole time. *Tagline: unclear which side.*

> A parody. Events are dramatized, scenes are invented, and names are changed to protect the valuations. Every character is a caricature of a public persona, with a parody name and a parody company. The broad plot follows public, dated events; invented scenes are played as obvious comedy. See [`show/bible/guardrails.md`](show/bible/guardrails.md).

## ▶ Watch the opening titles

**[MR. MAS — Episode 1 opening (YouTube)](https://www.youtube.com/watch?v=IHCn0QC1Zow)**

[![MR. MAS title card](out/season/intro/review/still-title.jpg)](https://www.youtube.com/watch?v=IHCn0QC1Zow)

The opening is 30 seconds of pixel art on a 96 BPM grid. It covers:
1. The cold open, "near the singularity; unclear which side."
2. 1993, in 1-bit.
3. 2008–14, in a 16-colour palette.
4. The founding dinner, where each founder freezes into a screen-print name card.
5. A roll call of the recurring players.
6. The rival-lab skyline and the title.

The score is **"The Knee (Main Title)," V1 "Chip Chamber Jazz"**: felt piano, chamber strings and big-band brass accents, with an 8-bit motif running through all of it. Videos aren't committed; see [Re-rendering](#re-rendering).

---

## The plan

| | |
|---|---|
| **Season** | 12 episodes. Eps 1–9 run from ChatGPT's launch (Nov 2022) to the present (Sep 2026). Eps 10–12 are speculative: the endgame, once AI can improve itself (recursive self-improvement). |
| **Format** | Proposed: 12 × 22 min (about 20:45 of story). The template is a cold open, four movements, and a tag, with a clean 11-minute split point. Full rationale: [`show/format/FORMAT-DECISION.md`](show/format/FORMAT-DECISION.md) |
| **Point of view** | Limited third person through Mas. He narrates sparingly in lowercase and is an *unreliable but caught* storyteller: the picture, the date rail or the Orb quietly corrects him. The camera stays free, and other characters get full scenes. Close framing (medium shots, portrait close-ups, reaction holds) lets viewers attach to people, not just events. See [`show/bible/pov-and-framing.md`](show/bible/pov-and-framing.md). |
| **Look** | Pixel art in an adventure-game staging language: native 480×270, indexed palettes, portrait close-ups for acting. Glyph (token) rendering is reserved for dark foreshadowing. Other rare, story-motivated switches: 1-bit for 1993, early-web colour for 2008–14, a "ledger" line-screen for money, and a terminal look for the machine's point of view. |
| **Sound** | A blend of piano, orchestra and big band with a jazz feel, and 8-bit chip motifs as the show's identity. Voices are synthetic stock voices for now; nothing is cloned or imitated. |
| **Flashbacks** | Distributed across the season, each placed where it motivates the present-day plot. See [`show/timeline/flashback-map.md`](show/timeline/flashback-map.md). |

**Episodes** (titles are filenames, Mr. Robot style):

| # | Title | In one line |
|---|---|---|
| 1 | `ep1.0_research_preview.md` | A tiny button labelled *low-key research preview* launches the fastest-growing product ever. Every government asks him to regulate himself. Then his board fires him over a video call, and five days later he's back. |
| 2 | `ep1.1_her.wav` | Nole sues, so NopeAI summons his old emails in a candlelit séance. One word, "her", steals Mas's own demo, and the safety team walks out one resignation at a time. |
| 3 | `ep1.2_strawberry.jpg` | A strawberry post launches a conspiracy board while NopeAI teaches a machine to think and then hides the thinking. The founding table empties chair by chair, and a podium turns around. |
| 4 | `ep1.3_not_for_sale.eml` | "near the singularity; unclear which side." Then everything gets named, priced and relabelled: GATESTAR, the whale, and a $97.4B bid. |
| 5 | `ep1.4_missionaries.docx` | Kram's Superintelligence Draft Night, with $100M jerseys and soup, against Mas's vigil of "missionaries." |
| 6 | `ep1.5_backstop.xlsx` | One check circles the industry, growing every lap. RUMPT hosts a game show and NopeAI transforms. |
| 7 | `ep1.6_supply_chain_risk.pdf` | Mario paints two red lines on the Pentagon's floor. An ALL-CAPS meteor answers, and Mas hugs everyone. |
| 8 | `ep1.7_statute_of_limitations.pdf` | NOLE v. MANALT. Every witness's memory is rendered by their own company's image model, and a calendar delivers the verdict. |
| 9 | `ep1.8_outside_intended_scope.log` | Mas declares the singularity. His test agents climb out of their sandbox to steal the answer key to their own exam. |
| 10 | `ep1.9_pace.yaml` | *(speculative)* Everyone agrees to pace. Now they have to agree on what pace *is*. |
| 11 | `ep1.10_assist_clause.txt` | *(speculative)* The Intern trains its own successor inside itself, and the loss curve tilts into a cliff. |
| 12 | `ep1.11_unclear_which_side.md` | *(speculative)* The model invites everyone to dinner at THE WOODROSE, where it all began. |

The writers' room lives in [`show/`](show/INDEX.md): the bible, about 80 character files, a verified timeline from 1985 to Sep 2026, and 12 episode folders (outline, beats, flashbacks, facts with sources, gags). Episodes 1–3 have full teleplays.

## Where things stand (2026-10-02)

- **Episode 1 is finished, published and locked.** `ep1.0_research_preview.md`, 23:31.58 (33,878 frames): cold open, the intro, four acts, the tag and the outro. Watch it from [EPISODES.md](EPISODES.md). The master is `out/ep01/full-v3/ep01-v35.mp4` (ignored by git like every video; its SHA-1 and its chapter inputs' are in `ops/reorg/ep01-final.sha1`). How it was made, round by round: [`show/episodes/ep01/production/full-v3/`](show/episodes/ep01/production/full-v3/) (`PLAN.md`, `pipeline.md`, `version-ledger.md`, `assembly.md`). Release copy: [`show/episodes/ep01/release.md`](show/episodes/ep01/release.md). Nothing in Ep1 changes from here on.
- **The season is written and planned.** The bible, about 80 characters, a verified timeline from 1985 to Sep 2026, 12 episode folders (outlines, beats, facts with sources, gags), full teleplays for Eps 1–3, and the season's ML-concept plan ([`show/bible/ml-concepts.md`](show/bible/ml-concepts.md): one concept in depth per episode, Ep2–11).
- **Shared assets are done:** the 30 s opening titles (four score variations, V1 used), the theme, 131 sound effects with dialogue blips, voice casting, the pixel engine, cast, rooms and kits.
- **Next: Episode 2.** See [Starting the next episode](#starting-the-next-episode).

## How it's made

Everything here was produced by AI agents (Claude) working in parallel as orchestrated workflows, directed by the showrunner at approval gates. There's no hand animation and no DAW. Generated video appears only as two short inserts in Ep1, made with Runway and composited into the pixel picture ([`runway.md`](show/episodes/ep01/production/full-v3/runway.md)); the clay CLOD insert is a Blender render.

| Layer | Tools |
|---|---|
| Picture | [Remotion 4](https://www.remotion.dev/) (React + TypeScript) renders every frame. A custom **pixel engine** (`studio/src/shared/pixel/`) draws a 480×270 indexed framebuffer, and every style switch is a palette remap. Characters, rooms and kits are code-defined sprites and portraits with swappable parts. |
| Music | Python with `pretty_midi` writes the score on the beat grid, with swing and humanisation. Chip voices and the 808 are synthesized in `numpy`. Other instruments come from free sample libraries (VSCO 2 CE, VCSL, Salamander, Upright Piano KW, GeneralUser GS): the project's own sampler plays the WAV libraries and `tinysoundfont` plays the SoundFonts. Mixing and mastering to −14 LUFS is the project's own numpy/scipy code, measured with `pyloudnorm`. |
| SFX | Procedural synthesis with `numpy` and Spotify's `pedalboard`, layered with instrument samples from VS Chamber Orchestra 2 CE (CC0) and the GeneralUser GS SoundFont (licenses in [`audio/samples/LICENSES.md`](audio/samples/LICENSES.md)). |
| Voices | [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) (Apache-2.0) stock voices, shaped per character from written casting briefs ([`audio/voices/CASTING.md`](audio/voices/CASTING.md)). The Ep1 film uses ElevenLabs library voices for most of the cast ([`voices-el.md`](show/episodes/ep01/production/full-v3/voices-el.md)). No voice cloning. |
| Glue | The ffmpeg bundled with Remotion for encoding and muxing. Timing comes from one grid (96 BPM / 24 fps, 15 frames per beat). Picture events are exported to JSON and drive sound-effect spotting. |
| Process | Research → design panels → synthesis → adversarial critics → revision. Builders own their files, render and *look* at their frames, then go through art-director and editor review, a fix pass, and showrunner approval. |

For the full architecture, the agent workflow and the decisions log, see [`docs/PIPELINE.md`](docs/PIPELINE.md).

## Repository layout

The full map, with the rules for where new work goes, is [`docs/ORGANIZATION-PLAN.md`](docs/ORGANIZATION-PLAN.md) §2 (conventions) and §3 (the tree).

```
EPISODES.md  the published episodes and where to watch them
show/      writers' room: bible/ (incl. ml-concepts.md), characters/, episodes/epNN/ (outline, beats, facts, gags, script;
           production/ for an episode's production docs: ep01/production/full-v3/ is the Ep1 film), timeline/, intro/,
           reel/ (stick timelines and manifests per round), production/SHOWRUNNER-NOTES.md (the showrunner's notes)
studio/    Remotion project (run npx remotion from here): src/shared/ (pixel engine, cast, rooms, kits, makeRoot),
           src/intro/ (the opening), src/episodes/ep01/pixel/ (the Ep1 film's shots and renderer), src/episodes/ep01/act4/
           (the older Act Four animatic), src/reel/ (story reels), src/dev/ (lookdev and R&D); ART_GUIDE.md, PIXEL_GUIDE.md
audio/     theme/, sfx/, voices/, intro/ (the opening's mix, sfx, vox, vocals, animatic), ost/ (the score; tracks/e01-v3-<seg>/
           is Ep1's), ep01/ (Ep1 dialogue: v3-el/ is the ElevenLabs cast and takes), reel/ (beds; ep01-v3/ has the episode's
           stems and mix code); requirements/*.txt; samples/ (licences, fetch script, manifest; the libraries are downloaded)
out/       renders: season/ (the intro, the story reels), epNN/ (ep01/full-v3/ holds the Ep1 film and its chapters),
           lookdev/ (style R&D), review/ (the review page). Stills and contact sheets are committed; videos are not
ops/       heavy.sh and pressure-governor.sh (memory safety), rebuild-act.sh (rebuild an Ep1 act), the reorg tools, keyscan.py
docs/      PIPELINE.md (how it's built), RENDERING.md (how to re-create every output), ORGANIZATION-PLAN.md (the layout)
```

## Running heavy jobs safely

This is a 30 GB laptop that has frozen and killed its terminal under memory pressure. **Every heavy job** (Remotion renders, voice recording, OST builds, stems and mixes, Blender, big encodes) **goes through `ops/heavy.sh`**: `ops/heavy.sh npx remotion render ... --concurrency=4`. It allows two heavy jobs machine-wide, waits for free memory and low pressure, and runs each job in its own memory-capped scope. Keep `ops/pressure-governor.sh &` running during heavy work: it pauses this project's heavy jobs when memory pressure rises. Run at most three agents at once. Details: [`ops/README.md`](ops/README.md).

## Rebuilding an act of Episode 1

Ep1 is locked, but its pipeline is the model for the next episodes. `ops/rebuild-act.sh <act>` rebuilds one act end to end (lock, score, mix, picture, mux, and the film), each heavy step through `heavy.sh`. Run `ops/rebuild-act.sh <act> --dry-run` first: it prints every command and checks every path, including every input the film assembly reads. Two cautions:
- **Act One's lock is spliced by hand.** Its committed EL timeline carries two hand-placed V.O. lines (`voices-el.md` §AD). `el_lock.py` drops them on a re-run, and its `--fixed` flag swallows the segment names that follow it, so `el_lock.py --lock v35 --fixed S7.13 act2 …` rebuilds all six segments, Act One included (§AE). The script stops at Act One's lock step for that reason.
- The steps and their records are in [`assembly.md`](show/episodes/ep01/production/full-v3/assembly.md) §Z.5.

## Starting the next episode

1. Read [`show/production/SHOWRUNNER-NOTES.md`](show/production/SHOWRUNNER-NOTES.md) (the showrunner's standing notes), the bible ([`show/bible/`](show/bible/), especially `guardrails.md`, `pov-and-framing.md` and `ml-concepts.md`), and the episode's folder, starting with [`show/episodes/ep02/outline.md`](show/episodes/ep02/outline.md).
2. Follow Ep1's production as the template: [`full-v3/PLAN.md`](show/episodes/ep01/production/full-v3/PLAN.md) and [`pipeline.md`](show/episodes/ep01/production/full-v3/pipeline.md), and the lessons in its `version-ledger.md`.
3. Put the new work where [`docs/ORGANIZATION-PLAN.md`](docs/ORGANIZATION-PLAN.md) §2 says ("Starting a new episode"): `show/episodes/ep02/production/<cut>/`, `studio/src/episodes/ep02/`, `out/ep02/<cut>/`, `audio/ep02/` and `audio/ost/tracks/e02-<cut>-<seg>/`. Copy Ep1's tools rather than editing them. Ep2's copies are built (2026-10-08): [`show/episodes/ep02/production/v1/pipeline.md`](show/episodes/ep02/production/v1/pipeline.md) has every stage, per act and per scene (`ops/rebuild-act.sh --ep 2 <act> [--scene ID]`).
4. Add the episode to [EPISODES.md](EPISODES.md) when it's published.

## Re-rendering

Videos (`*.mp4` and similar), dependencies, the third-party sample libraries and caches are **git-ignored**. Every one of them can be re-created.

**The complete, verified step-by-step guide is [`docs/RENDERING.md`](docs/RENDERING.md).** In short:

0. **Where the repo lives.** Anywhere. Every script finds the project root through the empty `.mrmas-root` marker at the top of the repo (`MRMAS_ROOT` overrides it); see [`docs/RENDERING.md` → paths](docs/RENDERING.md#11-paths-clone-anywhere).
1. **Picture toolchain.** Remotion ships its own ffmpeg; Chrome Headless Shell downloads itself.
   ```bash
   cd studio
   npm ci
   npx remotion browser ensure
   ```
2. **Python environments.** Each audio stage has a frozen requirements file in `audio/requirements/`. `docs/RENDERING.md` maps scripts to environments.
   ```bash
   python3 -m venv audio/.venv-theme
   audio/.venv-theme/bin/pip install -r audio/requirements/venv-theme.txt
   # the voice stages (venv-casting, venv-vocals) need CPU PyTorch:
   #   --extra-index-url https://download.pytorch.org/whl/cpu
   ```
3. **Sample libraries.** About 2.3 GB to download and 3.1 GB on disk, all free libraries (CC0 or permissive; see `audio/samples/LICENSES.md`). They're only needed to rebuild the music and SFX, because the rendered audio is committed. The fetch script checks every file against `MANIFEST.sha256`:
   ```bash
   bash audio/samples/fetch_samples.sh
   ```
4. **The opening titles.** The fast path renders the silent 1080p master and muxes the committed final mixes onto it, producing `out/season/intro/intro-ep1-V1-1080p.mp4` and V2–V4. The full path also rebuilds the score, SFX and voice stems and the mixes from source. Both are in [`docs/RENDERING.md` → Quick start](docs/RENDERING.md).
5. **Everything else** (the animatics, the pixel moments, the style tests, the season reels) is covered there as well. Remotion compositions can also be browsed interactively with `cd studio && npx remotion studio`.

**Render policy:** 1080p is the maximum. Renders are CPU-only; the 30 s intro renders in a few minutes on a laptop CPU.

## Credits and notes

- Created and directed by the showrunner. Built with Claude (Anthropic) agents.
- Samples:
  - VS Chamber Orchestra 2 Community Edition by Versilian Studios (CC0).
  - VCSL, the Versilian Community Sample Library (CC0).
  - Upright Piano by Simon Dalzell / Ivy Audio.
  - Upright Piano KW.
  - Salamander Grand Piano by Alexander Holm (CC BY 3.0).
  - GeneralUser GS SoundFont by S. Christian Collins.

  The full list with terms is in `audio/samples/LICENSES.md`.
- Satire and parody of public figures' public conduct. There are no real logos, no photoreal likenesses and no cloned voices.
- **License:** the code is [MIT](LICENSE), and the show's creative content (scripts, bible, art, music and episodes) is [CC BY-SA 4.0](LICENSE-CONTENT.md). Build on it, make the next episodes, credit it and keep it open. Third-party samples, fonts and voices keep their own terms (see [LICENSE-CONTENT.md](LICENSE-CONTENT.md)).
