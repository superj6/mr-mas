# MR. MAS · AI media range

> **Status: PROPOSED. Finalized 2026-09-26 after the critics' pass (taste and guardrails).** [§8](#8-critic-log) logs every amendment and what happened to it. This is a paper plan: no generation API was called, no key was read and nothing was spent. The only other file this pass touched is [OST-BIBLE](../../audio/ost/OST-BIBLE.md) §6.10, which gained a one-line pointer to the proposed exception. Every item below is **proposed** and belongs to its episode's or area's owner. Anything that would change a locked rule is listed as a ruling ([§6](#6-rulings-and-resource-asks)). **Every number here is a guide**, per the showrunner's "no hard cutoffs" note: break one when it plays better, and say why in a line.
> - **What this file covers:** everything the season can show of AI media *beyond* the visual style range. That means music and singing, voices, podcasts, sound, 3D reconstruction, machine-written text and the credits.
> - **What it doesn't cover:** passes, leaps, bezels and the season's picture range stay in [style-range](style-range.md). This file complements it and never overrides it. Where the two touch (12.A, the bezel rule, the fenced slots), style-range's rule wins and this file only adds a route.

| | |
|---|---|
| **The ask** (showrunner, 2026-09-26, verbatim) | "also, i think it'd be fun to make an outro song with lyrics using a music model only for the season finale. we can think about something like that. let's consider if there is any other ways we can show the full range of ai media generated capabilities throughout the season we're not considering yet" |
| **Standing notes** | "we want to show off throughout the show the capabilities of what range we're able to do, but not in a forced manner either, only where it makes sense" · "as stated before, we want to first create a version fully programatically, then we can consider the outside layers as quality additions to replace components" · "try to be creative and break boundaries while still being tasteful and generally faithful to the shows tone and flow" · "generally, there should be no hard cutoffs for rules on episode handling. there can be guidelines" |
| **Live notes applied** ([SHOWRUNNER-NOTES](../production/SHOWRUNNER-NOTES.md), read first) | Note 1: a short outro every episode, 6–15 s, shorter than the intro, with a credits pane that matures across the season and the machine typing the credits from Ep10; **"Ep12: the full AI outro song replaces the pane."** Note 2: some part of the show should visibly improve over time. Note 5: fully programmatic first, with outside layers replacing components later. Note 6: stick figures first, and ask for resources. Note 16: never clone real voices, and no photoreal likenesses of real people |
| **Firm lines** | [guardrails](guardrails.md) §1 and §5: no cloned or imitated voice or singing voice, ever; no "in the style of" and no real artist's name in any prompt; nothing near-photoreal on a real person's likeness; parody names only. [GENAI principle 4](../production/GENAI-UPGRADE-PLAN.md#1-principles): no person, face, hand, mouth, lip sync or performance comes out of a model. [pov-and-framing](pov-and-framing.md) §1.3: the V.O. is never heard in the world. AI generation is disclosed ([GENAI §6](../production/GENAI-UPGRADE-PLAN.md#6-pipeline)). Pixel art is primary; 1080p max |
| **Built from** | [ai-media-census](../_sources/research/ai-media-census.md) (20 families, current tools, prices and terms, [V] as fetched 2026-09-26) and the season scan (the session scratchpad's `aimedia-scan/scan.md`, which read every beat for a moment where the thing on screen is machine-made). Their ids are kept: the scan's `AMn.x` and the census's `N1–N10`. Then the two critics' reviews of the first draft, applied here ([§8](#8-critic-log)) |
| **Also read** | [style-range](style-range.md) · [pov-and-framing](pov-and-framing.md) §1.3 and §10 · [elevation-ideas](elevation-ideas.md) CAP-18 and CAP-19 · [OUTRO-PROPOSALS](../production/OUTRO-PROPOSALS.md) §1.4–1.5 and §8 · [OST-BIBLE](../../audio/ost/OST-BIBLE.md) §0, §1.7–1.8, §2.1–2.5, §4, §6.10, §8 · [GENAI-UPGRADE-PLAN](../production/GENAI-UPGRADE-PLAN.md) §1, §5, §6, §9–10 · [ep12 beats](../episodes/ep12/beats.md), [outline](../episodes/ep12/outline.md), [intro slot](../episodes/ep12/intro-slot.md) and [open questions](../episodes/ep12/open-questions.md) · [vocals README](../../audio/vocals/README.md) · [naming](naming.md) |

**Contents:** [The plan in ten lines](#the-plan-in-ten-lines) · [1. Principles](#1-principles) · [2. The capability palette](#2-the-capability-palette) · [3. The season map](#3-the-season-map) · [4. The Ep12 outro song](#4-the-ep12-outro-song-generally-available) · [5. The credits device](#5-the-credits-device) · [6. Rulings and resource asks](#6-rulings-and-resource-asks) · [7. Handoffs, and how to pick this up](#7-handoffs-and-how-to-pick-this-up) · [8. Critic log](#8-critic-log) · [9. Sources](#9-sources)

---

## The plan in ten lines

1. **Use a model only where the story says a machine made the thing,** and only where a viewer can see or hear it. If an item is true but invisible, it may still be a good production tool, but it doesn't count as range.
2. **Programmatic first, always.** Every item has a code filler built on the final's timing, so the final is a layer swap.
3. **The headliner is the finale's closing song, *generally available*.** The machine sings Mas's own lines back to him over THE ENDINGS: first a beat behind him, then with him, then a sixteenth ahead. **Every word is found text**: things Mas said aloud or typed, or that were printed on screen. The machine never sings the V.O., because it never heard it. That is the one thing the audience keeps, and nothing ever says so.
4. **The song's payoff is plain: his version becomes the official one.** The KEYNOTE REEL's D♭ finally gets a voice, and the Water Line cadences on F over D♭. The F chord's third, which the button cut away from, stays withheld.
5. **The machine's speaking voice improves over time**, at no extra length: flat and ringing (Ep1), breathing (Ep2), fluent (Ep9), then flawless and breathless (Ep12, the song). Its one tell is that it never breathes.
6. **The in-story additions that earn their place:** the cameo feed merged into CAMEO CITY's CCTV beat (Ep6) and its funeral slideshow (Ep7); DOT's greeting outliving her desk as the lobby kiosk (Ep9); the two AI hosts as an Ep3 stinger; 12.A's room rebuilt from many views (Ep12); the machine's flawed paint on 4.F's pictures (Ep4).
7. **The credits don't get a new medium every week.** The pane changes on five real events only, the on-screen `ai tools` line stays plain, and the per-episode ledger lives in the notice. The one ledger on screen is the season's, in the finale's crawl.
8. **Showreel energy gets its own home outside the episodes:** a companion page or making-of short after the season, showing every code filler beside its final. That lets the episodes stay unforced.
9. **Three rulings for the showrunner:** M9 (the one-song exception to OST §6.10), who the singer is (AIM-12), and whether the song reveals the button's third (AIM-3, default no). The other calls go to counsel, casting, credits and the guardrails owner.
10. **Cost:** about **$15–90** of generation, inside the GENAI plan's ceiling, plus unquoted human time. **The first step costs nothing and needs no ruling:** lay the lyric over the Ep12 endings as timed captions in the stick reel.

---

## 1. Principles

### 1.1 The machine-made rule: three homes, never a tech demo

The showrunner's test is "only where it makes sense." AI media needs a stricter version of that test than picture range does, because a generated voice or song is easy to spot as a flex. So every candidate needs one of three homes.

| Home | What qualifies | Examples | What it may never do |
|---|---|---|---|
| **1. Machine-made in the story** | Something on screen or in the air that a machine made, in the record or in the invented story: a feed, a podcast, a kiosk, a machine's song | AM3.a the podcast (stinger) · AM6.a the feed · AM9.a the kiosk · AM12.a the song | Look or sound better than that month's real models could (style-range §1.4's ceiling); carry a person, face, mouth or performance |
| **2. A fenced slot** | Outside the story, where the show already licenses range: the outro and credits, the title cards, the intro's bar 9, and the companion page after the season | The Ep12 song; the pane's five rungs; the season ledger | Preview a reserved reveal; become a weekly quota |
| **3. Hidden structure** | A model does work underneath and our look sits on top: geometry, timing, alignment | AM12.b's reconstruction under 12.A · faster-whisper timing under code mouths | Replace the pixel look it serves. **It never counts as range by itself.** |

**The unforced test**, run on the script and again on the stick reel:
- **Would the scene play as well without it?** Cut it both ways. If it would, the item goes.
- **Can a viewer see or hear it?** A capability nobody watching can perceive is a production note, not range.
- **Would a newcomer know why it's there?** The machine-made thing must read as machine-made from the story alone, never from a caption.
- **Does it add a register or a beat?** Most items here ride an existing shot at 0 s. Anything that adds seconds says where they come from.
- **Is the capability the joke's subject, or decoration on a joke that works without it?** Only the first counts.

### 1.2 Programmatic first; the outside layer replaces one component

- **Every item has a FILLER** built now with tools already in the repo: the OST engine, `audio/vocals/scripts/sing.py` (Kokoro plus WORLD), faster-whisper alignment, the `mouthFor()` swaps, the three.js PBR, clay and voxel kits, Blender 4.5.3 and the genvideo converter.
- **The filler holds** the final's timing, grid (96 BPM), framing, masks and meaning. The **FINAL** replaces one component (a vocal, a plate, a voice), never the edit. Where a final fails its gate, the filler ships. Nothing is re-edited to fit a take ([GENAI principle 1](../production/GENAI-UPGRADE-PLAN.md#1-principles)).
- **Stick figures first** (SHOWRUNNER-NOTES note 6). Every item goes into its episode's stick reel as a labelled placeholder at its planned length (`KIOSK`, `FEED`, `SONG CAPTIONS`), so the flow is judged with it in.
- **Kokoro is a neural TTS model, not "code".** Its output is generated speech. Anything Kokoro voices that ships, or that goes into another model as a guide, is disclosed and passes the blind panel. **The stock packs named after real product voices are banned** from anything that ships or conditions a model: `af_alloy`, `af_nova`, `am_echo`, `am_onyx` and `bm_fable` share OpenAI's stock voice names, `af_aoede`, `af_kore`, `am_fenrir` and `am_puck` share Google Gemini's, and `af_sky` stays banned as before. Kokoro's model card says it was trained partly on "synthetic audio generated by closed TTS models from large providers" (checked locally by the guardrails critic), so every other pack is blind-paneled before it ships too. The current picks in `audio/vocals/scripts/coldopen.py` and `lines.py` (`am_echo` and `am_puck`, including the `designed` blend) go to the vocals owner to replace ([§7](#7-handoffs-and-how-to-pick-this-up)).

### 1.3 The firm lines, applied to every family

| Line | What it means for AI media |
|---|---|
| **No cloned or imitated voice, speaking or singing** | Voices are human performers or are designed from a text description. Never feed a real person's audio to a model as a reference or target. **Licensed singing voicebanks are models of real singers, so they are OUT** (guardrails §5, "No cloned voices, ever"). The one narrow door is speech-to-speech from a consenting, paid performer into a *designed* voice (AIM-8), which [§6.2](#62-routed-to-other-owners) names as an exception to GENAI principles 4 and 7 |
| **Officials and depicted clones** | **No official goes through any generative voice model**: no TTS, no voice design, no speech-to-speech. Analysis models (ASR, denoise) are fine. Kokoro scratch for an official never ships. Depicted AI voices of real people (Ep1's hearing clone, Ep11's call "in RUMPT's cadence") are human performances in the show's cartoon register, never an impression ([CASTING §6.1](../../audio/voices/CASTING.md)), and the notice says so |
| **No artist in any prompt** | Prompts use genre grammar, instruments, tempo, key, material, light and camera. No artist, band, song title, studio, film, director, "like X", "in the style of", or era-plus-name. No one else's lyric goes into an input |
| **No likeness** | Nothing near-photoreal on a caricature or a real person. No face, mouth, hand or performance from a model (principle 4). No realistic real room at a real event (principle 5). The humans never render |
| **No stand-ins for real ads or products** | Any machine-made ad or clip uses generic imagery no campaign owns: no livery, mascot, signature shot or format name. Flaws stay generic to that month's models, never a claim about a real ad. The record tie stays at [H]/[V] headline level. Real apps' UI and format names are never copied (guardrails §5) |
| **Parody names** | Every product, brand and person on screen comes from [naming](naming.md). Real vendors are named only in production files like this one |
| **The X list** | Nothing generated touches X1–X12, in any medium ([guardrails §1](guardrails.md#1-hard-exclusions)) |
| **Disclosure** | Every generated element has a `provenance.json` and a line in the notice (§1.4) |
| **Broadcast safety** | Every generated clip passes the flash audit. Every generated voice passes the blind panel against a fixed reference list (§1.6, test 4) |

### 1.4 Disclosure is part of the design

- **Provenance per take:** model, version, date, prompt, seed, input hashes, cost, a terms snapshot (including the training opt-out setting), watermark status, and the authorship chain (§1.7). Generated sources are archived outside git on the day they're made.
- **Content credentials:** invisible marks (SynthID, C2PA) can't survive our code layers, stems, EQ, the loudness pass or pixel conversion. So:
  - archive the signed originals as received;
  - re-sign our masters with the production's own C2PA manifest listing the AI ingredients;
  - adopt GENAI §6's plain disclosure that conversion strips invisible marks.
  - We never remove a *visible* watermark. Under [GENAI principle 8](../production/GENAI-UPGRADE-PLAN.md#1-principles), a provider whose terms forbid altering marks is out for any take we edit. That rules out Suno (§4.9) unless counsel reads its clause otherwise.
- **The credit line lists what was generated, by family, in plain words.** It names the one consented voice conversion if it ships, credits arrangement and performance to the model for whichever song route ships, and keeps only the negative claims that stay true: *no real person's voice was cloned or imitated; no real person's face was generated.* Proposed wording for the notice (the credits owner and legal fit it to what actually ships, AIM-9):
  > *AI tools used in this season, then edited or redrawn by the production: video and still images shown inside on-screen devices; sound effects; a 3D reconstruction; fictional machine voices, designed from written descriptions or voiced by a stock text-to-speech model (Kokoro); a podcast script drafted with a language model and edited by the writers; one kiosk line converted, with the performer's written consent, from her recording into a designed voice; and episode 12's closing song, arranged and performed by an AI music model from the production's demo. Converting clips to pixel art strips invisible watermarks; the full ledger is in the notice. No real person's voice was cloned or imitated. No real person's face was generated.*
- **Where it sits, and read time:** guardrails §7's rate is 0.25 s + 0.05 s per character. The wording above (about 700 characters) needs about 35 s, so it lives in the notice and in Ep12's crawl, never in a weekly pane. The weekly pane carries only its plain `ai tools` line ([§5](#5-the-credits-device)), budgeted by the same rate. About 70 characters is about 3.8 s.
- **No joke at the disclosure's expense,** anywhere. No `generated: nothing.` gag, and no disclosure dressed as an in-world log.
- **Accessibility is disclosure's twin:** SDH captions carry the song's lyric (♪ lowercase ♪). Any audio-description track is written by the writers and voiced by a human or a blind-paneled designed voice.

### 1.5 How it serves the season's spine: the machine's range widens

style-range §1.4's spine says the machine renders at the fidelity of its month. For AI media the same spine runs along a second axis: **the machine gains a sense or a medium each movement, and the humans never gain one.** Without anyone saying it, the season should feel like the machine learning to do everything a studio does, ending with the one thing Mas never does: sing.

| Movement | What the machine can now do (on screen or in the air) | Where |
|---|---|---|
| **The Rise** (Eps 1–3) | Talk, first flat and ringing, then with breath. Silent clips in screens. Two cheerful hosts who summarize anything | Ep1's depicted clone (human-performed, §3.1) · CHATGTP (Ep2) · 2.A and 3.F (style-range) · the Ep3 podcast stinger |
| **The Race** (Eps 4–9) | Paint; move with its own sound; fill a feed, then a funeral; speak fluently from a desk it replaced | AM4.a · AM6.a the feed (sound effects only) · AM7.b the slideshow · AM9.a the kiosk |
| **The Endgame** (Eps 10–12) | Type the credits itself, train its successor, rebuild a room from many views, and sing his tune better than he does | The Ep10 pane · 11.A · AM12.b · AM12.a the song |

Two rules keep the spine honest:
- **A ceiling, not a floor.** A machine-made thing never looks or sounds better than that month's real models could. It may look worse when its owner is cheap (THE WHALE) or when the joke is the flaw.
- **The humans never render. There is one machine with one voice, and every other synthetic voice sounds like no one.** Each fictional voice is designed from text and checked blind against the reference list *and against the others* (§3.13).

### 1.6 Taste tests for AI media

Run these alongside [style-range §5.3](style-range.md#53-taste-tests), which still applies.
1. **Owner.** Who made this thing in the story? If the answer is "the show", it needs a fenced slot.
2. **The cut-both-ways test.** Does the scene play better with it?
3. **The ceiling.** Could that month's machines really have made it?
4. **Sounds like no one.** A blind panel hears each voice beside a **fixed reference list**. The list is played to people and never fed to a model. It includes:
   - Mas's real counterpart and the other parody targets;
   - Mas's and THE INTERN's actors;
   - OpenAI's and Google's stock voices;
   - the notebook app's two real hosts (for AM3.a);
   - famous singers in the close-miked piano-ballad register (for the song);
   - the real synthetic performer behind YLLIT.
   
   Any match is an automatic reject. ElevenLabs' Music Terms separately bar mimicking "any recording artist".
5. **Corn.** No "AI voice" tropes: no vocoder robot, no glitch stutter, no HAL, no "evil AI" growl ([OST §1.7](../../audio/ost/OST-BIBLE.md#17-nothing-corny-the-banned-list)). The machine is polite and exact; that's the dread.
6. **Fair to the source.** A machine summary or podcast of a real document may compress and cheer, but it never states a claim the document doesn't make, and never goes beyond the claim's tag ([guardrails §3–4](guardrails.md#3-fact-handling-tags)). The facts owner checks every LLM-drafted line against the document.
7. **Visible.** Would a viewer who wasn't told notice it? If not, it's a production tool, not range.
8. **Disclosed.** Is it in the provenance manifest and the notice?

### 1.7 Vendors, uploads and authorship

**Pre-upload checklist.** Run it before anything unreleased goes to a vendor, including the lyric, the demo, DOT's performer's take or any guide singer:
- a paid tier only;
- the training opt-out set, and captured in the provenance terms snapshot;
- private settings on;
- no human voice ever uploaded to Suno (its terms ban uploading "an audio recording of another person's voice");
- the vendor's licence over outputs noted in provenance.

The checklist also protects the song's spoiler hold (§4.3). What the terms say, as the guardrails critic read them on 2026-09-26:
- **ElevenLabs** Terms (31 Mar 2026): Input and Output are used for training unless you opt out under "Data use", and ElevenLabs keeps a perpetual, sublicensable licence over Output.
- **Suno** (effective 3 Sep 2026): uploads and outputs are licensed for "artificial intelligence and machine learning models" and for distribution, and outputs are public by default.
- **The Gemini free tier** trains on inputs.

**Authorship, recorded honestly.**
- The first-draft lyric was written by an AI agent in this production's pipeline. Draft 2 (§4.4) is found text: lines selected from the show's scripts by an AI agent (the taste critic). The scripts' own authorship chain is recorded with each episode [to confirm, by the writers].
- The OST engine is code written in the same pipeline. "Composer of record" doesn't establish human authorship, and it doesn't protect a model's arrangement.
- Suno promises no copyright vests, Google may make "similar content for others", and ElevenLabs says Output "may not be unique".
- **So:** record the real chain in provenance and in this file. Have named humans revise and adopt the lyric if protectability matters. Disclaim the AI material in any copyright registration. The ElevenLabs finetune option (§4.9) waits on this question as well as on the Salamander CC BY one.

### 1.8 A home for range outside the episodes

Every item already has a code filler and a final, so the before-and-after pairs come for free.
- **After the season:** a companion page or making-of short shows each pair side by side: the song's demo and final, the reconstruction resolving, the kiosk, the feed. The album's two versions of the song sit beside them. Showreel energy belongs here, so the episodes can stay unforced.
- **Promos** are a second fenced home, after air only. They spoil nothing reserved, the song stays out until Ep12 has aired, and no clip isolates a caricature speaking synthetic speech (guardrails §5).

---

## 2. The capability palette

What each family means in this show, and when to reach for it. The verdicts are:
- **USE:** motivated homes exist.
- **NARROW:** only in the stated form.
- **SUPPORT:** a production tool, never shown as range.
- **RULING:** not used until ruled.
- **OUT:** never used.

Tools, prices and terms are in [the census §2](../_sources/research/ai-media-census.md#2-the-census-family-by-family).

| Family | What it means in MR. MAS | Use it when | Never | Verdict · where |
|---|---|---|---|---|
| **Song generation** (lyrics, sung vocals, stems, inpainting) | THE MACHINE's voice at its last stage: it performs his tune better than he does | Once, in the finale's credits, on the engine's melody and a found-text lyric | Before Ep12; any campaign song; any artist in a prompt; a voice that resembles anyone | **RULING (M9)** · AM12.a |
| **Singing voice synthesis** (licensed voicebanks) | Models of real singers | — | — | **OUT** (guardrails §5). Only the showrunner and the guardrails owner could amend §5 to allow it (AIM-5) |
| **Voice design** (TTS from a text description) | The fictional machine voices, each resembling nobody | CHATGTP (candidate, GENAI ruling 6), the hosts, the kiosk, THE HUMANIST's assistant, the singer | Officials; any real person's cadence; impressions; a real product's stock voice | **USE** · AM3.a, AM9.a, AM11.a, AM12.a |
| **Stock TTS** (Kokoro) | Scratch, fillers, and the song's guide | Packs with no product name, after the blind panel | The product-named packs (§1.2); officials | **SUPPORT; ships only after the panel** |
| **Multi-speaker dialogue / AI podcasts** | Summary as a medium: the machine flattens a document into a cheerful chat | The Ep3 stinger only | The real product's voices, branding or format name; any claim the document doesn't make | **USE, NARROW** · AM3.a |
| **Speech-to-speech** (voice conversion) | A consenting human's timing in a designed voice | Optional polish on AM9.a; the song's route A guide | An unconsented or unpaid performer; a real person's timbre as the target | **NARROW (AIM-8)** · AM9.a, AM12.a route A |
| **Translation and dubbing** | — | Distribution dubs, by the distributor's rules | Auto-dub tools that clone the source speaker; any official; any language as the joke (X10) | **SUPPORT (distribution only)**; nothing in the episodes |
| **Lip-sync timing** (ASR and forced alignment) | Hidden structure: the model times the mouths, code draws them | Every line on a sprite | A lip-sync model drawing or moving a mouth | **SUPPORT** |
| **Sound effects and video-native audio** | The machine's clips carry their own sound from Ep6 (the sound spine) | Raw SFX layers (GENAI §5.4); native audio on SYNTH bezel clips from Ep6, **SFX and ambience only**, band-limited through the device speaker | Any take with speech, singing, vocalising or melody (rejected, not muted); identity sounds (chip, blips, the Orb, the KA-CHING) | **USE (SFX) · AIM-6 (GENAI owner)** · AM6.a |
| **Diegetic machine music** (beds, a lounge through a wall) | Machine-made music heard as machine-made | Only if M8 passes, and then instrumental with no voice at all | Lyrics; vocalising; a melody that competes with the score; any real song, jingle or band | **RULING (M8)** · AM10.b opt |
| **Video** (text, image or video to video; first and last frame) | Covered by [style-range](style-range.md) and [GENAI](../production/GENAI-UPGRADE-PLAN.md) | Environments and objects inside a bezel, until J5 | People, faces, legible text, stand-ins for real ads | **USE (as scoped there)** · AM6.a, AM7.b |
| **World models** | The machine's sandbox; it forgets what's behind the camera | — (AM5.a is cut; 12.A's re-roll grammar is dropped) | Generated people | **PARK** |
| **3D reconstruction** (photogrammetry; Gaussian splats; image-to-3D) | The machine's memory: rebuilding from many views is what reconstruction is | 12.A's learned objects, invented props only | A character, caricature, face, or a real room | **USE (local) · NARROW (meshes)** · AM12.b |
| **Image generation and editing** | The machine's flawed painted copy (Ep4) | Non-face pictures inside 4.F; concept boards (SUPPORT) | Faces, caricatures, legible text; any named or described studio, film or director | **NARROW** · AM4.a |
| **Compositing aids** (depth, segmentation, relighting) | Makes a plate sit under pixel figures | Masks and depth for contact | — | **SUPPORT** |
| **Machine-written text** (LLMs) and **live code** | Drafting help | Drafting candidates the writers choose from (AM3.a, AM12.c) | Invented words presented as a real person's; a real quote "summarized" beyond its tag; hacker-typing corn | **SUPPORT** (invisible, so not counted as range) · AM9.b opt egg |
| **Provenance and watermarks** | The show verifies itself, the way the Orb verifies people | Every take; the notice; the season ledger in Ep12's crawl; our own C2PA on masters | Removing a visible mark; a disclosure played for laughs | **USE** · §1.4, AM12.e |
| **Accessibility** (captions, audio description) | Lyrics in SDH; an AD track | Distribution | An AD voice that imitates anyone | **SUPPORT** |
| **Interactive and branching media** | — | Off-platform only, after the season (§1.8) | A live model playing THE INTERN, the Orb or any caricature | **PARK** |
| **Lip-sync and talking-head models, avatars, face restyles, motion capture of anyone real, upscaling pixel art** | They are what the show satirizes, or they break the grid | — | — | **OUT** |

---

## 3. The season map

**How to read it.**
- **Id** is the scan's `AMn.x`. **★** marks the recommended set, and **opt** plays only if the stick reel asks for it. Cut ids are listed in §3.15.
- **Size** says what an item costs the episode:
  - **0 s:** it rides an existing shot;
  - **+n s:** it adds time, and the row says where the seconds come from;
  - **bezel/speaker:** it lives inside a device in the pixel room, so it isn't a register change.
- **FILLER** is the fully programmatic version, built now. **FINAL** is the outside layer that replaces one component: a model (named) or a human.
- **Cost** is generation only, at the census's prices. **Status** is **proposed** for every row. Beat numbers are the 2026-09-26 `beats.md` numbers.

### 3.1 Ep1 · `ep1.0_research_preview.md`

The pilot's versatility slate is full ([style-range §6.1a](style-range.md#61a-ep1-versatility-slate-2026-09-26)). **Add nothing to the episode body.** The pilot's AI-media statement is the one it already makes by refusal. The hearing opens on a cloned voice (1.F, #16–17). The production performs that clone with a human, captions it `[AI-GENERATED AUDIO]`, and never imitates the senator or the anchor.

| Id | Scene or slot | Capability | Motivation | Size | FILLER | FINAL | Cost | Status |
|---|---|---|---|---|---|---|---|---|
| (existing) | #16–17, the Senate's cloned voice | Voice cloning *as a subject*; **rung 1 of the voice ladder** (§3.13) | The record (May 16, 2023) | Broadcast bezel | A human scratch read, captioned | **A human performer**, never an imitation of the senator or the anchor, with DSP giving the 2023 clone's artifacts (flat prosody, a ring on the esses). The notice says it is a human performance | — | proposed. **Flag to the style-range owner:** 1.F still allows a voice "designed from text" for a real senator, which conflicts with GENAI principle 7 |
| (existing) | #33, 1.H ELGOOG's duck film | Near-photoreal video in a bezel | The record | Monitor | Blender | VIDEO (the pilot's first outside-layer test) | per GENAI | per style-range 1.H |
| Outro | **Pane rung 1:** the terminal ([§5](#5-the-credits-device)) | — | — | 6–15 s | Code | CODE | $0 | proposed |

### 3.2 Ep2 · `ep1.1_her.wav`

This is the voice episode. CHATGTP's voice (a designed-voice candidate or a human actor, GENAI ruling 6) is **rung 2 of the voice ladder: it breathes.** Nothing else is added.

| Id | Scene or slot | Capability | Motivation | Size | FILLER | FINAL | Cost | Status |
|---|---|---|---|---|---|---|---|---|
| (guardrail) | Any AI voice in Ep2 | Voice design | — | — | Kokoro, **never `af_sky` or any product-named pack** (§1.2). The "her" read is what Ep2 must avoid | Voice Design, text only, then the blind panel | — | proposed |
| (lyric source) | sc 17, Mas: *take your time.* | — | A line the song sings (§4.5) | — | — | — | — | Ep2 #28 decides whether the line stays. If it goes, the Ep12 writer takes an alternate |

### 3.3 Ep3 · `ep1.2_strawberry.jpg` · THOUGHTS SUMMARIZED

**★ AM3.a · THE PODCAST, as the Ep3 stinger only** (N2). Ep3 #15 already has "Fifteen thousand words." / "It has footnotes." / "It ends well." Putting the hosts in the body would tell that joke twice inside the episode's one exit. As a stinger it's a callback that adds 0 s to the body, and it still shows two-host TTS.

| | |
|---|---|
| **What we see and hear** | After the outro: Mas's phone on the dark desk wakes by itself and resumes at `2×`. The player shows a waveform, two host blobs and a parody format name, not the real product's (proposed `QUICK DIP · 11:42`; the naming owner decides). Host A: *So it's fifteen thousand words—* Host B: *—and honestly? It ends well.* [INVENTED hosts; paraphrase only]. It runs 5 s or less and cuts on the overlap |
| **Capability** | Document to two-host podcast: an LLM drafts candidate banter from the essay's structure, the writers edit it, and multi-speaker TTS voices it. The overlaps, the backchannels and the unearned cheer are the format's grammar |
| **Motivation** | Machine-made in the record: ELGOOG's notebook app launched two-host audio overviews in Sep 2024 [V·wiki], weeks before the essay (Oct 11, 2024). It's the machine-side twin of ADELINA's shredder (G21) |
| **FILLER** | The writers' edit of an LLM-drafted script; two Kokoro packs with no product name and no cast use, blind-paneled; scripted overlaps; the phone speaker's EQ |
| **FINAL** | ElevenLabs v3 multi-speaker dialogue or Gemini TTS (two speakers), with **two text-designed host voices** checked against the reference list, which includes the real product's two hosts |
| **Guardrails** | The flaw is compression and cheer only, never a claim the essay doesn't make. The facts owner checks every line against the essay. The only real quotation in the episode stays "a country of geniuses in a datacenter" [P], and the hosts don't repeat it |
| **Cost · risk** | Under $1. **Low.** |

| Id | Scene or slot | Capability | Motivation | Size | FILLER | FINAL | Cost | Status |
|---|---|---|---|---|---|---|---|---|
| Outro | **Pane rung 2:** the chat window, with the log arriving as a reply under a folded `thought for 2 seconds` line | — | The o1 month | Outro | Code | CODE | $0 | proposed |

### 3.4 Ep4 · `ep1.3_not_for_sale.eml`

This is the busiest register strip. **Add no moment.** There is one route note:

| Id | Scene or slot | Capability | Motivation | Size | FILLER | FINAL | Cost | Status |
|---|---|---|---|---|---|---|---|---|
| ★ AM4.a | #21, 4.F's wave repaints the city's *pictures* | Image-to-image | The machine's copy, made by a machine. The image craze was a record about a medium | 0 s (a route for a planned leap) | Tonal `paint` plus the watercolour shader | **A real image model paints the non-face pictures** (pets, food, cars, objects) from our pixel originals, kept in its native flawed look. **No prompt names or describes the studio behind the real craze, its films or its director**; prompts describe the medium only. No face, caricature or legible text in inputs or outputs. Faces stay on the anime rig. No landscape (R7) | ≈ $2–5 | proposed |

### 3.5 Ep5 · `ep1.4_missionaries.docx`

"The season's most crowded window." Add nothing that needs a model.

| Id | Scene or slot | Capability | Motivation | Size | FILLER | FINAL | Cost | Status |
|---|---|---|---|---|---|---|---|---|
| AM5.b opt | #14, the night desk: DOT's phone player reads `1,000,000 MONTHLY LISTENERS · (SYNTHETIC)` between rating clicks | — (text only; the sound is too faint to matter) | An AI band passed a million monthly listeners, Jul 2025 [V·wiki] (headline level only) | Phone, 0 s | An engine source cue through a phone EQ, barely audible | = filler. **No model, so no M8 ruling is needed.** Never the real band's name or songs (naming owner) | $0 | proposed (a plant, not range) |

### 3.6 Ep6 · `ep1.5_backstop.xlsx`

**★ AM6.a · THE CAMEO FEED, merged with 6.E.** This is style-range's sanctioned form of 6.F: "only inside a bezel: the cameo app's own feed on a phone".

| | |
|---|---|
| **Scene** | CAMEO CITY (#16). As Mas walks through, unseen, his phone lights up: `YOUR CAMEO WAS USED 1,000,000 TIMES`. The feed opens by itself on **6.E's CCTV GPU clip** (P1 CCTV, drawn, as style-range has it). Then his thumb swipes through **3–4 more cameos**: the pixel Mas composited into generated plates, **each held at least 1.5 s**. Then comes the Orb's `human (probably)` |
| **The clips** | All of him. No other people, no animals-and-food filler, and no recreation of a real viral clip. The plates are places and objects only (an empty award stage, a storm at sea, a wedding cake with no one near it; the Ep6 owner picks), and the pixel Mas sits in each with contact. The deepfake gag stays drawn |
| **Capability** | Video generation with the clip's own sound: **sound effects and ambience only**, through the phone speaker (AIM-6). A take with speech, singing, vocalising or melody is rejected. There's no model comparison, because that is what a tech demo is |
| **Size** | His phone at P7 PHONE bezel size, with the city staying pixel. **About +4–6 s over 6.E's 3–4 s**, paid by the Ep6 owner. The stick reel decides between 3 and 4 cameos |
| **FILLER** | three.js and engine plates; the pixel Mas composited; numpy SFX through the speaker EQ |
| **FINAL** | VIDEO SYNTH inside the bezel (environments only), each clip with provenance |
| **Cost · risk** | ≈ $6–15. **Low–medium.** The risk of it reading as a showreel is held down by the fact that every clip is him and every clip holds long enough to read |

| Id | Scene or slot | Capability | Motivation | Size | FILLER | FINAL | Cost | Status |
|---|---|---|---|---|---|---|---|---|
| AM6.c (N6) | **The machine's own sound begins.** From Ep6, SYNTH bezel clips of the machine's output may carry the model's native audio: SFX and ambience only, band-limited through the device speaker, conformed to F | Video-native audio | style-range §1.4's sound spine | Device speakers | numpy SFX through the speaker EQ | The video model's own audio, with any speech, singing or melody rejected | in the clip | **AIM-6 (GENAI owner)** |
| Outro | **Pane rung 3:** sound. The pane gains a speaker meter and the reprise plays "through" it, the first week the machine has its own sound | — | The sound spine | Outro | Code | CODE | $0 | proposed |

### 3.7 Ep7 · `ep1.6_supply_chain_risk.pdf`

| Id | Scene or slot | Capability | Motivation | Size | FILLER | FINAL | Cost | Status |
|---|---|---|---|---|---|---|---|---|
| ★ AM7.b | #21, THE AROS FUNERAL. Beside the tombstone, a memorial screen on an easel runs a slow slideshow (about 2 s a slide, with dissolves) of AROS's life in callbacks: 2.A's mammoth, 3.A's strawberry, the Ep6 feed. **SELBEEP's line lands first** (*It generated a million videos. Most of them were him.*), **then the last slide pays it off:** a drawn Mas cameo | Reuse of AM6.a's clips | A funeral has a slideshow, and the eulogy's line needs a picture | Easel screen, bezel, 0 s | AM6.a's fillers | AM6.a's finals; at most two new plates if the slideshow needs them | ≈ $0–5 | proposed |
| AM7.c | YLLIT's song (on the ticker since the second pass) | — | — | — | — | **Held.** If the room restores it: a human performer (yllit.md), an original melody and lyric, never a music model | — | held |

### 3.8 Ep8 · `ep1.7_statute_of_limitations.pdf`

| Id | Scene or slot | Capability | Motivation | Size | FILLER | FINAL | Cost | Status |
|---|---|---|---|---|---|---|---|---|
| AM8.a | #22, "TAKE TWO": DOT records `TEACH AN AGENT · GREETING · TAKE 1`, then `TAKE 2`. Nothing changes in Ep8. **The takes are the kiosk's source** (AM9.a) | Speech-to-speech (its source) | The beat's own basis: workers paid to teach AI their jobs [H] | 0 s (the scene as written) | DOT's scratch take | DOT's performer's take, recorded under AIM-8's consent terms only if the kiosk's STS polish is wanted | $0 | proposed |
| (existing) | 8.B, each witness's render by a different real model (the GENAI plan's optional in-joke) | Multi-model video | style-range 8.B | Projector | Planned | Planned. If a zAI-owned model renders NOLE's environment, the guardrails owner sees the pairing first | per GENAI | per style-range |
| Outro | **Pane rung 4:** the agent log. The pane is a task, `task: credits · step 3/5`, and it updates itself | — | The agent month | Outro | Code | CODE | $0 | proposed |

### 3.9 Ep9 · `ep1.8_outside_intended_scope.log`

**★ AM9.a · THE GREETING.** This is the best in-story item on the list. PP9.1's lobby crossing (#16) is one continuous move over a run of mornings. A new lobby kiosk greets him on every crossing: *Welcome to NopeAI! Happy to help!* [INVENTED]. It's identical every time: the take nobody has to redo.
- **The words carry it.** The kiosk finishes Ep8's cut-off "Happy to—" perfectly. It rhymes with #19's *happy to help!* and pays off in Ep12's cold open, when DOT, reprinted `FRONT DESK`, says *Welcome.* in her own voice, flat. A lay viewer won't hear a cadence transfer, so the design doesn't rest on one.
- **Staging (the DOT owner's call):** the default keeps DOT's desk out of frame. The alternative puts DOT in frame, with the kiosk greeting him a beat before she can: the copy in miniature.
- **Voice ladder rung 3: fluent.**
- **FILLER:** the kiosk's designed voice reads the line from text (a Kokoro pack with no product name, blind-paneled). Any prosody transfer in code uses a TTS scratch as its source until DOT's consent is signed, and never an unconsented human take.
- **FINAL:** a text-designed kiosk voice (ElevenLabs Voice Design). **Optional polish:** speech-to-speech from DOT's performer's own take into that designed voice, only under AIM-8 (specific written consent and pay). If it ships, the notice names it, credits her take with her consent, and the credit line drops any claim that no performance was converted (§1.4).
- **Size · cost · risk:** 0 s. Under $1. **Low.** The DOT owner signs off, and nothing ties it to a jobs statistic.

| Id | Scene or slot | Capability | Motivation | Size | FILLER | FINAL | Cost | Status |
|---|---|---|---|---|---|---|---|---|
| AM9.b opt (N4) | CO #2, the push into the monitor before 9.A: for about a second, the real three.js source that renders the folder city | Live code | True on its face | Monitor, 0 s | = final | CODE | $0 | **optional easter egg**, not range. It risks the hacker-screen cliché right before a code world. Writers' call |
| Stinger | After the outro: the kiosk greets the empty lobby at night. *Welcome to NopeAI! Happy to help!* | Designed voice | The callback | ≤ 5 s | AM9.a's filler | AM9.a's final | $0 | proposed |

**Declined here:** machine interpreters dubbing the Security Council (#30–31). It's a real session with real officials, and it would put translated words in real mouths.

### 3.10 Ep10 · `ep1.9_pace.yaml`

**#2 stays exactly as written:** his DevDay hologram's ovation on the phone in his hand, and the V.O. *i'm here in person. i think that matters.* The eight-language grid (AM10.a) is cut (§3.15).

| Id | Scene or slot | Capability | Motivation | Size | FILLER | FINAL | Cost | Status |
|---|---|---|---|---|---|---|---|---|
| AM10.b opt | THE PACE ACCORD: the casino lounge heard through a wall | Diegetic machine music | A lounge the machine runs | Wall-filtered source | Engine lounge cue | An M8 bed, instrumental, no voice | < $1 | proposed (only if M8 passes) |
| Outro | **Pane rung 5:** the machine types the credits itself (the showrunner's idea), its caret in sync with the reprise | — | — | Outro | Code | CODE | $0 | proposed |
| Stinger opt | One empty keynote hall still applauding after its lights go off | — | The #2 callback | ≤ 5 s | Code | CODE | $0 | proposed (optional) |

### 3.11 Ep11 · `ep1.10_assist_clause.txt`

11.A is the episode's leap and 11.B its pass. **Add nothing new to the body.**

| Id | Scene or slot | Capability | Motivation | Size | FILLER | FINAL | Cost | Status |
|---|---|---|---|---|---|---|---|---|
| AM11.a | #7, THE HUMANIST's assistant: *Confirm you're not a person.* / *i might be.* | Voice design | A fictional machine voice, already a line | Phone speaker, 0 s | Kokoro (no product-named pack) | A text-designed voice, distinct from the machine's | < $1 | proposed |
| (rule) | #5, the Researcher calls RUMPT "in RUMPT's cadence" | — | — | — | — | **The show's RUMPT performer, in cartoon register, never an impression** (CASTING §6.1). Never a model. The notice says it is a human performance | — | firm |
| N5 (reserve) | A world-model walk inside his monitor that forgets the room behind the camera | World model | The machine's sandbox | — | — | — | — | **reserve.** The body is full, and 11.A owns the first perspective camera |

### 3.12 Ep12 · `ep1.11_unclear_which_side.md`

| Id | Scene or slot | Capability | Motivation | Size | FILLER | FINAL | Cost | Status |
|---|---|---|---|---|---|---|---|---|
| ★ AM12.a | **The closing song, *generally available*,** under THE ENDINGS ([§4](#4-the-ep12-outro-song-generally-available)) | A music model: lyrics and a sung vocal. **Voice ladder rung 4: flawless, and breathless** | The showrunner's ask; the OST's Endgame | The credits (replaces the pane) | Captions first, then the OST engine band plus the code-sung guide (§4.8) | A music model performs our demo (route C) | ≈ $5–60 (bake-off) | proposed (M9, AIM-12) |
| ★ AM12.b (N3) | **#5, 12.A THE RECONSTRUCTION, rebuilt from many views.** We render our own table props (invented objects only; no guests, no room, no hotel décor) from about 100 cameras and reconstruct them. **The reconstruction is the shot.** Mas's glass isn't in the capture, so it stays a flat pixel card: "the model learned everything at that table but him." **Decide the stopping point first:** <br>• **Default: stop at dense points** (the beat's own request, "only as far as dense points, short of near-photoreal", which also protects J5). The honest tool is then a photogrammetry point cloud, sparse then dense, from an open SfM/MVS tool such as COLMAP [K; licence to check]. No splat training is needed. <br>• **Resolved objects** (style-range's current row) need the guardrails owner's sign-off, and would use a Brush splat rendered with Spark | 3D reconstruction | Reconstruction from several views is literally what this is, and the four versions are four views | Full frame (the planned leap), 0 s added | three.js points resolving (Prototype 3) | **CODE plus a local reconstruction.** COLMAP-class photogrammetry for dense points. Brush (Apache-2.0, WebGPU [V]) and Spark (licence [UNVERIFIED]) only for resolved objects. **F12.1 is already carrying enough** (four disagreeing versions, stat bars, the first camera in Mas's chair, the reflection, the candle, the CTRL key), so the world-model re-roll grammar is dropped unless it *replaces* the current layering method | $0 | proposed |
| AM12.c | The endings: the machine summarizes Mario's last essay in one sentence, and the sentence is correct | — | — | 0 s | **The writers' sentence.** An LLM may draft candidates. Tagged [INVENTED], with no quotation marks and never beside a real date | = filler | $0 | proposed (a production tool, not range) |
| AM12.e | The crawl's disclosure as the season's ledger: from the provenance files, what was generated, by family, and what never was (people, faces, real voices) | Provenance | The show verifies itself, the way the Orb verifies people | The crawl | Code from `provenance.json` | CODE | $0 | proposed. Budgeted at guardrails §7's read rate |
| AM12.f | THE OTHER FACE: the season's one generated face | A generated face | — | — | The caret face, as written | — | — | **denied (AIM-11)** |

### 3.13 Season runners

| Runner | Rungs | What it says without saying it |
|---|---|---|
| **THE VOICE LADDER** (CAP-18, booked here) | Ep1: flat and ringing (the depicted clone, human-performed with DSP) → Ep2: breathing (CHATGTP) → Ep9: fluent (the kiosk) → Ep12: flawless and breathless (the song). Every one of these lines already exists; only the fidelity changes | The machine's voice improves in public, honest to the timeline, at 0 s. It also sets up the song's one tell: it never breathes |
| **THE SLOP ARC** | Ep6 AM6.a (the feed is born, and it's all him) → Ep7 AM7.b (eulogized: "Most of them were him.") | One clip set pays off twice |
| **ONE MACHINE, ONE VOICE** | The singer is THE MACHINE. Under AIM-12 (a), the song is the first time anyone hears it. The other synthetic voices (CHATGTP, the hosts, the kiosk, THE HUMANIST's assistant) are other products, each designed from text and each resembling no one, the machine included | Whatever voice passes the blind panel is, by definition, its voice |
| **THE MELODY GETS WORDS** | MM-15's knee plays whole in every week's credits → in Ep12 the credits' melody finally has words | The weekly reprise is the plant. No earlier singing, not even a hum |
| **MACHINE SUMMARIES** | Ep3 stinger (cheerful, at 2×) → Ep12 #9 (the Pope's encyclical, `SUMMARY: declined.`, existing) → the Ep12 ending (one correct sentence) | The machine learns to summarize, and then to decline |

### 3.14 Coverage at a glance (the recommended set)

| Capability | Where the season shows it | Status |
|---|---|---|
| A song with lyrics and a sung vocal | AM12.a, once | M9 |
| A machine voice improving over time | The voice ladder (Eps 1, 2, 9, 12) | 0 s; DSP plus designed voices |
| Designed voices | CHATGTP (candidate), AM3.a, AM9.a, AM11.a, the singer | GENAI ruling 6 |
| Two-host podcast from a document | The Ep3 stinger | — |
| Video with its own sound | AM6.a, and SYNTH clips from Ep6 | AIM-6 (SFX only) |
| Video in bezels | 2.A, 3.F, 8.B (planned in style-range); AM6.a; AM7.b | SYNTH ruling |
| Image-to-image | AM4.a | — |
| 3D reconstruction | AM12.b | Local, free |
| Speech-to-speech from a consenting performer | AM9.a (optional polish) | AIM-8 |
| Provenance as design | The season ledger in Ep12's crawl (AM12.e); the notice | — |
| The credits' own curve | The five pane rungs | — |
| Range side by side | The companion page after the season (§1.8) | — |

Multilingual dubbing and the ad ladder drop out, and nothing the season needs goes with them.

### 3.15 Considered and declined

| Idea | Why not | What would bring it back |
|---|---|---|
| **AM2.a, AM3.b, AM6.b and THE AD BREAK ladder** (flawed then pulled ads in background tabs and pre-rolls) | Ads of 2–3 s in the background across several episodes. No viewer will follow them as a ladder; it's writer's-room architecture. They were also near-photoreal stand-ins for real brands' ads at dated events, which undoes GENAI §6's "no depiction of real events" (and AM3.b's snowy trucks are a campaign's trade dress) | A single ad the story needs, in generic imagery (§1.3) |
| **AM7.a, the first all-AI Big Game ad** | #7 already has CLOD's clay spot, the doorbell-grid spot (O7.1), a 1993 micro and the season's Ep7 glass beat. A third ad, with a third glass beat and paid for by shortening a booked drastic moment, is crowding. A "flawless" AI ad also can't be read as AI-made in 2–3 s, so it fails the newcomer test | — |
| **AM5.a, the world-model hallway on the lobby TV** | A background demo nobody tracks | — |
| **AM10.a, the hologram in eight languages** | A multilingual grid in a cold open buries the V.O., adds X10 exposure and eight native-speaker checks, and is a textbook feature demo. A caricature speaking synthetic speech in eight languages, with ASR-timed mouths, is also the grammar of a deepfake dub | Only as a visibly drawn hologram, with an [INVENTED] line and no event branding or standalone promo clip. Not recommended |
| **AM12.d, the ballroom assembling from its own source** | A code scroll in a 4–5 s ending under a sung line is one read too many, and the `BUILDING CODE: IT.` sign is already the gag | — |
| **The Eps 9–11 code-sung hum** | Humming is singing, so it spends the finale's "singing is last". A resynthesized "oo" at a 2020 level is close to the banned robot-voice trope, and Kokoro is a model, so it would be a sung model performance before the finale | — (AIM-2 retires) |
| **A weekly ledger line in the pane** | A disclosure inside an in-world log reads as fiction, which weakens its legal job. The 6–15 s read budget is already full, and a line like `generated: nothing.` is the joke at the disclosure's expense | — (AIM-10 retires) |
| **A new medium in every episode's credits (THE DESK)** | A quota at 6–15 s (§5) | A still-life outro of 10 s or more (§5.4) |
| **Licensed singing voicebanks; the OpenUtau voicebank step** | Models of real singers (guardrails §5) | An amendment to guardrails §5 by the showrunner and the guardrails owner (AIM-5). Not recommended |
| **A campaign song** (a rally tune, a super PAC jingle) | X11, OST §1.7, fairness | Nothing in Season 1 |
| **Any official's voice through any generative voice model**, including the depicted clones | GENAI principle 7; ElevenLabs' own policy | — |
| **Model-made lip sync, talking heads or avatars** | Principle 4; it would make the show the thing it mocks | — |
| **Generated "street interviews" or any generated person** | People from a model | — |
| **The real notebook app's output, voices, UI or format name** | Not parody (guardrails §5) | — |
| **Recreating any real ad or viral clip** | Evoke, don't copy | — |
| **Any music-model song, sung jingle or vocal bed before Ep12**, including CAP-19's sung rungs and YLLIT's song | "only for the season finale"; it would spend the finale's first sung voice | The showrunner extends M9 on purpose |
| **An AI "previously on" recap** | The format has no recaps, and a recap would spoil | A fenced slot, if the format ever adds one |
| **Interactive or branching episodes; a live INTERN chatbot** | A live model playing a caricature is a likeness and fairness risk, and the Orb is non-verbal by canon | Off-platform only, after the season (§1.8) |
| **Upscaling or interpolating pixel frames** | It destroys the grid | — |
| **A world-model walk through the folder city (9.A)** | 9.A is orthographic on purpose, as the plant for 11.A | — |

---

## 4. The Ep12 outro song: *generally available*

### 4.1 The concept: who sings it, and why only in the finale

**In the world, the machine sings it.** After the one-take button cuts to black, THE ENDINGS play under the credits, and for the first time in the season a song with words plays. The singer is THE MACHINE. Its lyric is Mas's own lines from the season, sung back to him by the thing that learned them.

**What it can sing, by rule.** The machine may sing only what reached the world: what Mas said aloud or typed, what the machine itself said, or what was printed on screen. Mas has four versions ([pov-and-framing §1.3](pov-and-framing.md)): to the room, to us, to the Orb, and to no one. The song gives the machine three of them:
- **his room lines** are the verses;
- **the Orb exchange** is the bridge;
- **"to no one"** is the melody itself, because the Water Line is what his hands do.

The one version it can't sing is the V.O. The audience still holds the one thing the machine never learned. **That is never stated, anywhere, only kept.**

**Why only here:**
- **The showrunner asked for exactly that:** "only for the season finale".
- **The score has been building to it for twelve episodes.** OST §1.8's Endgame: "In Ep12 the model completes every unfinished motif… Last of all it plays Mas's tune on his felt piano, better than he does". THE COPY has closed its gap all season (OST §2.5): a beat late in Ep1, in sync by Ep9, swung like him in Eps 10–11, and in Ep12 "Ahead". The song is that curve, with words.
- **Mas never sings.** He talks in short answers, lowercase, a poker face he learned at eleven. The machine gives his words the melody he never gave them.
- **Singing is the one capability the season held back.** The machine talked, painted, filmed and rebuilt rooms. Singing is last.
- **It lives in a fenced slot.** The credits are outside the story, and the knee already plays whole there every week (MM-15). The song can be as full as it likes without touching the episode's flow or the one-take ending.

**Who is singing has to be audible (AIM-12, the showrunner's pick).** A brand-new voice would read as "the credits song", not "the machine". The obvious fix, THE INTERN's voice, is out: GENAI casts THE INTERN on Mas's actor's contract, so a model singing in that voice would be a clone.
- **(a) Recommended.** The monitor's Ep12 lines (*it was your idea.*, the veto) become on-screen text, like `define "win."`. The song is then the first time the model is heard at all, and verse 3 is the first time its lines are heard aloud. There's no casting change and no voice-matching problem: whatever voice passes the blind panel is, by definition, its voice.
- **(b)** The monitor speaks at the table in the same designed voice that sings. This needs a casting ruling and a route that can hit a set timbre: route C for the band plus route A (speech-to-speech) for the vocal. Test it in the bake-off.

### 4.2 Title

**Proposed: *generally available*.** It's the finale's own subtitle (#16) and the industry's term for a model's public release. It cuts both ways, and that's the point: the machine is now released to everyone, and so is he. The song won't say which of them is the product. The lyric's `it's a preview.` sets up the release arc without saying so, and the title is the only place the word appears; it's never sung.

Alternates: *side: unclear* · *after you*.

### 4.3 What the lyric is about

- **A list song made 100% of found text.** It's the season's arc, told in the order the machine learned it. The timing arc (behind, with, ahead) is audible, so no line explains it. That's also the better joke: a model can only recombine what it learned.
- **Every line must gain a second meaning in the machine's mouth.** `super.` becomes flattery, `good student.` is now about the machine, and `roll it back.` is impossible now and sung as praise. `you can stay.` is exactly what the veto says to him.
- **Verse 3 is the turn.** His lines and its lines alternate, the listener can't tell which are whose, and nothing says so.
- **The last line is his question in the machine's voice:** `how do i win?` The kid typed it in 1993, Mas typed it at the table, and now the machine asks it too. On the flat line it refuses to rise. Nothing answers it.
- **What it never does:** name anyone, pun on a company, say "AI", reach for a sentiment word, wink, state a fact, or sing a V.O. line.
- **Spoilers:** nothing, since it plays after the last scene. The lyric, the demo and the album cut stay out of promos, trailers and the soundtrack release until Ep12 has aired. Uploads follow the pre-upload checklist (§1.7), which keeps them private.

### 4.4 The lyric, draft 2

*Draft 2, 2026-09-26: found text only, lowercase. The facts owner confirms every line's tag (§4.5) before lock. Draft 1 is superseded (§8). The sheet shows the default picture cut; lines marked `+` play in the long cut and on the album.*

```
generally available

[intro · 2 bars · bar 1: the piano's bare F · bar 2: the D♭ bass enters under the voice's pickup, on the flat line]
after you.

[verse 1 · a beat behind · piano alone, half-time · one line on each phrase's settle (C→F)]
noted.
super.                 (the longest, most beautiful hold)
+ good question.
(stop: one bar, where the next settle is due. NESNEJ's register rings once more)
it's a preview.

[verse 2 · in unison · bass in a light two-feel, brushes · whole phrases]
+ good student.
roll it back.
i'll hold on to it.
we keep everything.

[bridge · the knee, whole]
verified: human.
+ human, probably.
human: verified. side: unclear.
mostly.                (on the Orb's fifth, F→C)

[verse 3 · a sixteenth ahead, swung · his lines and its lines alternate]
you can stay.
+ it was your idea.
take your time.
you're the best at it.

[tag · the voice alone, on the flat line F F F F: the question refuses to rise]
how do i win?
(three beats of nothing: the three empty reply bubbles)

[ring-out · the Orb's fifth on vibes]
```

- **Alternates** (found text too):
  - for verse 1: `thanks.` (Mas to the Orb, Ep1, right after `verified: human`) and `close.` (Ep1's tag);
  - for verse 3: `i might be.` (THE HUMANIST's assistant, Ep11) and `took the liberty.` (THE INTERN's lanyard, Ep10). **The Ep10 outline cut `took the liberty.`**, so it's eligible only if it's restored.
- **Never eligible:** any V.O. line, including `i don't keep score.` and `second time.`. That holds even if pov-and-framing §10's optional Ep12 TERMINAL `i don't keep score.` ships: the song keeps the V.O. as the one version the machine never sings.

### 4.5 Lyric sources and checks

Every line is the show's own invented dialogue or on-screen text. A sung real quote would bend the source-fidelity rule (guardrails §4: [V] and [P] lines keep their exact form and context), so any line that turns out to be [V], [P] or [K] is swapped for an alternate.

| Line | Who, where | How it reached the world | Tag as found (the facts owner confirms) |
|---|---|---|---|
| `after you.` | The machines' politeness loop, Ep11 (*after you. / no, after you.*); Ep12's title subtitle `assisted (after you)` | Aloud; on screen | [INVENTED] |
| `noted.` | Mas, Ep1 (the cold open and the button) | Aloud | [INVENTED] (ep01 script) |
| `super.` | Mas, Ep1 #27, into a live mic | Aloud | [INVENTED]. **It has a [P] twin:** an official's "super." at the Sep 22, 2026 UNGA (guardrails §4's example). The facts owner confirms the sung line reads as Mas's Ep1 answer |
| `good question.` | Mas, Ep1 #30 | Aloud | [INVENTED] |
| `it's a preview.` | Mas, Ep1 Act Four (sc 31) and Ep3's door 3 (the drifting sleigh) | Aloud | [INVENTED] |
| `good student.` | Mas, Ep3 (sc 16–17) | Aloud | [INVENTED] |
| `roll it back.` | Mas to CHATGTP, Ep4's button (the sycophancy rollback) | Aloud | [INVENTED] (the rollback is real [K]) |
| `i'll hold on to it.` | Mas to Gerg, Ep3 | Aloud | [INVENTED] |
| `we keep everything.` | Mas to NOLE, Ep2 | Aloud | [INVENTED; ruled in by the facts pass] |
| `verified: human.` · `human, probably.` · `human: verified. side: unclear.` | The Orb's toasts, Eps 1, 6 and 12 | On screen | [INVENTED] UI text. Only the Orb's form, `side: unclear`, is sung, never the real post's wording |
| `mostly.` | Mas to the Orb, Ep1 sc 29; the Orb replays it aloud in Ep9 | Aloud | [INVENTED] |
| `you can stay.` | Mas to the room as the Orb settles, Ep1 sc 20 | Aloud | [INVENTED] |
| `it was your idea.` | The model, Ep12 (the relabelled card) | On screen under AIM-12 (a); aloud under (b) | [INVENTED] (ep12 facts). The facts owner confirms that, out of context, it doesn't read as a claim about a real person |
| `take your time.` | Mas to THE FORECASTER, Ep2 sc 17 | Aloud | [INVENTED]. It depends on Ep2 open question 28, whose fallback is that Mas says nothing |
| `you're the best at it.` | The model's veto, Ep12 #12 | On screen under (a); aloud under (b) | [INVENTED] (ep12 open question 3) |
| `how do i win?` | The kid in 1993 (typed) and Mas at the table, Ep12 | Typed; on screen | [INVENTED] |

**Automated checks:** a transcript of every take (faster-whisper) is scored against the lyric sheet, so we know the model sang our words and nothing else. A lyric-originality search confirms no line matches a published song's lyric.

### 4.6 The musical brief

**It grows out of cues the season already has. Nothing is borrowed from outside the score.**

| From the score | Becomes, in the song |
|---|---|
| **MM-02, the KEYNOTE REEL** (his version: a too-clean felt piano in D♭ major, pedal down) | The song's key and piano. The reel already plays uncut once, in Ep8's Rashomon (OST §2.3), so an uncut reel isn't news. **What's new is only this: it is sung, and his version becomes the official one** (decision 10, "Ep12: his version wins") |
| **MM-01, THE WATER LINE** (F F F G F │ C F) | The verse melody, note for note, reharmonized in D♭, so it cadences on F over D♭ |
| **THE COPY** (MM-13's lag table) | The vocal's timing: a beat behind in verse 1, in unison in verse 2, a sixteenth ahead in verse 3 |
| **THE KNEE** (MT, MM-15: F F F F G A♭ C F′) | The bridge's melody, whole, and the only time it has words |
| **THE ORB** (the open fifth, F–C) | `mostly.` in the bridge, and the song's last sound |
| **The Harmon trumpet** (M1) | The bridge's obbligato, playing the knee a sixteenth *behind* the voice: the human is the copy now |
| **The chip** | Back in verse 3, on the nudge note only |

**Key, tempo and feel.**
- **D♭ major, with a lydian colour** (the KEYNOTE REEL's harmony). D♭ is one of the score's colour keys (OST rule 2), so this isn't a finale key change (§1.7's ban).
- **96 BPM**, the house grid. A bar is 2.5 s.
  - **Verse 1** is in half-time with the piano alone, and the montage gets air.
  - **From verse 2**, the upright bass plays a light two-feel and the brushes swing lightly. A half-time ballad all the way through would drag under the comic endings.
- **Straight, then swung.** The machine plays straight (rule 6). The voice stays straight until verse 3, where it takes his swing: from Ep10 the copy swings like him.

**The harmony, sold at its real size.**
- **D♭ major has carried F as its third all season.** The song adds only two things: the voice, and a Water Line that finally *cadences* on F over the machine's D♭. The machine doesn't choose major or minor for his chord; it moves the root under him. The intro shows this: the piano's bare F sits alone for a bar, so "which side" stays open, and then the D♭ bass slides in under `after you.`
- **The knee, finally sung.** The knee plays whole in the credits every week (OST rule 4, §2.1). What's new is the words. Its pitches over a D♭ bass (F, G, A♭, C) are the third, the raised eleventh, the fifth and the major seventh, so the machine doesn't change a note of the show's melody, only what's under it.
- **The button's secret stays kept.** Beat #16 cuts to black "one frame before we hear which one". The song never plays an A♮ or an A♭ over an F root or bass, and the engine's F-major check runs on it as a real fault check. The tag drops the D♭ bass and leaves the voice on F alone, and a single F with nothing under it could be his root or the machine's third. The Orb's open fifth plays once after it.
- **If the showrunner wants the third revealed**, that's AIM-3, and the default is no. OST decision 1 (A♮ "on `ours.`") and OUTRO-PROPOSALS §1.5's F-major option both predate beat #16. The OST owner reconciles them.
- **Nothing corny** (§1.7): no key change, no choir, no gospel lift, no "epic", no inspirational-corporate gloss. A small band and one voice, played straight.

**Prosody: where the joke lands.**
- In verse 1 the voice sings only the two-note settle of each Water Line phrase (C→F), a beat late. The piano carries the flat line. Longer lines (`it's a preview.`) take their pickup on the flat line's last notes.
- **The emptiest word gets the most expensive note:** `super.` has the longest, most beautiful hold. That's where the laugh is.
- **The knee:** put the long note on `ver`, so that `fied` doesn't land stressed on the step. `clear` on the octave is right, because the brightest note falls on "unclear".
- **The one-bar stop replaces a word; it doesn't sit between two.** It comes where the next settle is due, the ear expects a word and gets NESNEJ's register instead, and the line resumes after it. The stop is its own bar.

**Form (fit the song to the montage, not the other way round).**

| Section | Default picture cut: **29 bars, ≈ 72.5 s** (28 plus the stop) | Long cut: **35 bars, ≈ 87.5 s** | The voice |
|---|---|---|---|
| Intro | 2 bars: the bare F, then the D♭ bass | 2 | `after you.` (pickup, bar 2) |
| Verse 1 | 6 bars + the 1-bar stop · piano alone, half-time | 8 + 1 | A beat behind; the settles only |
| Verse 2 | 6 bars · bass in a light two-feel, brushes | 8 | In unison, whole phrases |
| Bridge | 4 bars · the knee; the Harmon trumpet a sixteenth behind; low strings on a D♭ pedal | 4 | The Orb's verdicts; `mostly.` on the fifth |
| Verse 3 | 6 bars · strings low; the chip on the nudge note only | 8 | A sixteenth ahead, swung |
| Tag | 2 bars · everything drops out on the downbeat; no bass | 2 | `how do i win?` on F F F F; then three beats of nothing. Optionally the last note gets the season's one vibrato (±15 cents, once): the ring in his water, learned by the machine (the writers' call) |
| Ring-out | 2 bars · the Orb's open fifth, F5 → C6, on vibes | 2 | — |

- The default fits today's credits slot (≈ 65 s, [outline](../episodes/ep12/outline.md)) at about +7 s. The editor may lengthen or shorten a verse by a phrase to fit the montage.
- **Album cut (≈ 3:00):** a longer intro, an instrumental verse where the trumpet takes the Water Line, and a longer ring-out. It uses no extra words beyond the long cut, and it keeps the stop.
- **Loudness:** featured at −16 LUFS in picture; album at −14 LUFS-I; ≤ −1 dBTP (OST rule 14).

**The voice.**
- **An arc, not a tone:** exact in verse 1, warmer in verse 2, with phrasing and swing in verse 3. It should be warm, close-miked, and resemble no one. The blind panel judges it; there's no gender spec. The range is about C4–F5. No vibrato except, optionally, the last note, and no ad-libs, runs or backing vocals.
- **The one tell is CAP-18's: it never breathes.** Breaths are stripped from the vocal stem in code, in every route.
- **One machine, one voice:** it resembles no real singer, no product voice, and no other synthetic voice in the show.
- **Never Mas's actor and never THE INTERN's voice** through a model (CASTING §6.1).
- **A plain-terms prompt, for every route** (no names, ever):
  > *A slow ballad at 96 BPM, D-flat major with a raised fourth. It opens on a single bare piano note. A felt upright piano played very evenly with the sustain pedal down, alone and in a half-time feel for the first verse; upright bass in a light two-feel and brushed drums from the second verse; a Harmon-muted trumpet counter-line in the bridge; low sustained strings in the last verse. One close-miked lead voice, warm and intimate: exact and even at first, warmer in the second verse, relaxed phrasing and a light swing in the last. No audible breaths, no vibrato, no ad-libs, no backing vocals. Sing the lyrics exactly as given. End on a single held note with nothing under it.*
  
  Negative styles: choir, gospel, key change, belting, breathy, riffs and runs, drum fills, risers, EDM, trap, inspirational corporate, ukulele, whistling.

### 4.7 How it plays against picture

- **Out of black.** The button's take ends on the cut to black, one frame before the third. Hold one beat of true silence. Then the first sound is the piano's bare F, not a bright chord that would be heard as the answer. The crawl fades up in bar 2, as the D♭ bass slides in.
- **THE ENDINGS stay on phrase boundaries,** mixing 1-bar (2.5 s) and 2-bar (5 s) endings rather than stretching all of them. About 14 endings fill the song up to the tag. The credits crawl rides beside them.
- **No spoken ending plays under a sung word.** ADELINA's line (*In plain English: it already did the plain English.*), and any other spoken ending, goes in the intro's first bar, the one-bar stop or the gap between two verses. Otherwise the line is cut. The editor decides.
- **Sync points to aim for** (the editor decides; most of them reorder the endings):
  - `it's a preview.` over YNOJ's `NEXT YEAR` cloth;
  - the stop on NESNEJ's register, "rings once more. Then silence.";
  - `we keep everything.` over the empty Q\* vault;
  - the bridge on SAMA NOS and his reflection (*human: verified. side: unclear.* over a man and a reflection that is the machine);
  - `you can stay.` over the DAYS SINCE sign landing on ∞, moved from its current slot as the first ending;
  - the sirens switching off on the tag's downbeat, as the band drops out, "not by anyone's hand".
- **The last image is black.** Hold the silent sirens for a beat, then go to black under `how do i win?`. **Don't go back to the glass:** showing the ring settled would undo J6 ("he loses composure once"), tell a newcomer he recovered, and give the season a second ending after "the only cut is to black". The voice's lone F over nothing is the last thing we get.
- **Read time over black:** the one-line disclaimer and the one-line AI disclosure hold over black through the tag and the ring-out: 4 bars, 10 s, which is enough for about 195 characters at guardrails §7's rate. If the approved wording runs longer, add ring-out bars rather than shrinking the type. The full notice and the season ledger (AM12.e) ride the crawl earlier, budgeted at the same rate.
- **Then** KORG 5 ships to total silence (beat #18). The ring-out ends clean first, so the designed silence still lands.
- **No on-screen lyrics in the final,** and no karaoke bounce. SDH captions carry the lyric.

### 4.8 The programmatic filler (the first pass)

1. **The cheapest first test, before any `sing.py` work:** lay the lyric over the Ep12 endings as timed captions in the stick reel, on a temp MM-15 bed. This checks density, the sync points and the stop's placement. It's also OUTRO-PROPOSALS §1.5's filler (an instrumental with the lyric set as type), so the two plans meet here.
2. **The OST engine composes and renders the band** as a new track, proposed **MM-37 *generally available***. It covers the felt piano in the KEYNOTE REEL voicing, upright bass, brushes, the engine's Harmon trumpet, strings, the chip nudge and the Orb's fifth on vibes, at 96 BPM, to the default and long cuts plus the album cut. It goes through `analysis` like any cue.
3. **A code-sung guide vocal: "the machine's demo."** `audio/vocals/scripts/sing.py`, extended from syllables to lyric words:
   - Kokoro speaks each phrase in a pack with no product name that no cast member uses, and the pack passes the blind panel first (§1.2);
   - faster-whisper's word timestamps and a syllabifier cut the phrases into syllables;
   - WORLD time-stretches each syllable to its note and re-pitches it to the melody's MIDI;
   - the timing arc and the prosody rules are written into the MIDI, and breaths are stripped.
   
   It will sound like a machine singing at a 2020 level. It's the guide that conditions route C. **Whether it plays in picture in the first pass is the showrunner's call on hearing it.** If it reads as the banned robot-voice trope, the first pass plays the instrumental with the captions from step 1.
4. **QA:**
   - the engine's `analysis`: the grid, D♭ home, **the F-major check (no A♮ or A♭ over an F root or bass)**, the knee counter expecting exactly one sung statement, and loudness;
   - the transcript scored against the lyric sheet;
   - a melody-similarity check against OST §1.7's list;
   - **before release,** an audio-fingerprint and cover-detection pass on the final take against commercial catalogues (§4.11).
5. **Picture:** the endings on phrase boundaries; the crawl in code; SDH captions from the lyric sheet. Cut it both ways: the song against the plain MM-15 reprise.

**The album can keep both versions**: *generally available* and *generally available (the machine's demo)*. That's the same song rendered twice, a year of capability in two tracks. The demo track ships only if its Kokoro voice passes the blind panel, and it's disclosed as a neural TTS voice resynthesized in code. That qualifies the "only sung model performance" claim: the finale's song is **the season's only music-model performance**, and its demo is the one other generated singing, heard only on the album and the companion page unless the first pass uses it in picture.

### 4.9 The final route

| | **A · The engine writes, a model sings exactly** | **B · The model writes from our lyric** (the control) | **C · The model performs our demo** (recommended) |
|---|---|---|---|
| **What the model does** | The vocal only: **a consenting, paid guide singer's take converted by speech-to-speech into the machine's designed voice** (AIM-8's terms). No licensed voicebanks (OUT) | The whole song, from a composition plan with our lyric and the plain-terms prompt | The whole performance, band and voice, conditioned on the programmatic demo |
| **Melody control** | Exact | Loose; the engine's checks pick the takes | High: the demo carries melody, form and timing |
| **Authorship, honestly** | Melody from the engine (code); lyric assembled from the scripts; the vocal performance by a human singer, converted by a model | The model composes and arranges | **Melody from the engine; the model arranges and performs** |
| **Use** | Needed for AIM-12 (b), or as a fallback if every C take drifts | The bake-off's control only; never shipped | The picture and album cut |

**What code keeps in every route:** the chip nudge, the Orb's fifth, the one-bar stop, the tag's bass drop, the ring-out timing and the breath strip, all laid over or edited into the model's take so it stays "one score". If the M1 trumpet session happens, the human trumpet overdubs the bridge.

**One technical need decides the tool: a clean vocal stem.** The timing arc, the transcript check, the breath strip and the code layers all need the voice separable from the band. Prefer a tool that renders the vocal over our own uploaded instrumental or returns stems (ACE-Step). Otherwise, run an open separation model on the model's mix [K].

**Candidate tools and their terms.** Prices are as the census listed them on 2026-09-26 [V]. Terms are as the guardrails critic read them that day, and they are rechecked against [GENAI §5.3](../production/GENAI-UPGRADE-PLAN.md) before any spend.

| Tool | Price | What it gives the song | Terms that matter | Verdict |
|---|---|---|---|---|
| **ElevenLabs Music v2.5** | API $0.15/min; commercial use from Starter ($6/mo) up | Custom lyrics per section, with section lengths locked in a composition plan; positive and negative styles; **inpainting** (regenerate one section, or condition on an uploaded file); a ~30 s audio reference; finetunes on our own catalogue | Music Terms (26 May 2026):<br>• no artist, song or label names and no one else's lyrics in inputs;<br>• **no mimicking "any recording artist"**;<br>• "Output … may not be unique";<br>• `sign_with_c2pa`;<br>• **a sector clause** excluding customers who "operate in" political advocacy, campaigning, electoral services "or other political causes".<br>ToS (31 Mar 2026): Input and Output train its models unless you opt out; a perpetual, sublicensable licence over Output | **Candidate, after counsel reads the sector clause (AIM-4)**, with the opt-out set. No stem endpoint is documented. The finetune waits on §1.7's authorship question and the Salamander CC BY question |
| **ACE-Step 1.5** | $0 (MIT) plus ≈ $5–25 of cloud GPU | Lyrics; **cover and repaint** over our demo; stem extraction; LoRA | MIT; its authors ask users to verify originality and disclose AI involvement | **Candidate.** Its authors rate its quality below the others, and it's untested on this Intel iGPU |
| **Lyria 3.5** (Gemini API) | $0.08 a song | Custom lyrics with section tags and timestamps | GENAI §5.3 lists its commercial terms as "unstated". "Google won't claim ownership" is **not** a commercial licence. The Gemini API terms (28 Apr 2026) require users to be 18+, require the paid tier when serving the EEA and the UK, and let the free tier train on inputs. Google may make "similar content for others". The Prohibited Use Policy bars presenting generated content as "created solely by a human". SynthID is on every output | **Route B's control only.** No stems and no editing. It goes to counsel with ElevenLabs as the second vendor |
| **ElevenLabs Voice Changer** (route A) | $0.12/min | A consenting singer's guide → the machine's designed voice | Only under AIM-8 | Route A only |
| **Suno v6** | Premier $24/mo | Vocals over an upload; stems | Terms (effective 3 Sep 2026): "You agree not to remove, alter, obscure or circumvent any fingerprint, watermark or metadata"; uploads and outputs licensed for AI training and distribution; outputs public by default; no uploads of another person's voice; no promise that copyright vests. GENAI §5.3: "Not used" | **Out** for any take we edit or ship (GENAI principle 8), unless counsel reads the clause otherwise |
| **Out** | — | — | — | Licensed voicebanks (ACE Studio, Synthesizer V, OpenUtau banks: cloned singing voices); MiniMax (the paid API closed to new users from Aug 20, 2026); Udio (downloads disabled [K]); Stable Audio 3.0 (vocals not stated) |

**The human alternative.** If M9 is denied, or no take passes the gate, **a session singer** performs the engine's melody over the engine band, recorded to the grid, with breaths edited out. In the world it's still the machine singing. In the credits it says a human sang it, which is the Ep1 statement again: the show depicts machine voices and performs them with humans. It's unquoted, and it would sit beside the M1 trumpet session. A human take is also the best guide for route A.

### 4.10 Disclosure

- **The song's credit, beside the crawl (route C):** *"generally available. Lyric assembled from the series' dialogue. Melody from the production's score engine. Arranged and performed by an AI music model from the production's demo. The voice is AI-generated and imitates no one."* Route A instead reads *"Sung by [singer], converted with AI into a designed voice, with the singer's consent."* The human alternative instead reads *"Sung by [singer]."*
- **The legal card's voice line** becomes: *"Voices are performed or designed from written descriptions; no real voice was cloned or imitated. The closing song's voice is AI-generated."*
- **The season credit line** is §1.4's, fitted to what shipped (AIM-9).
- **Provenance:** every kept take is logged; the signed originals are archived; the master is re-signed with our own C2PA manifest listing the AI ingredients; the notice says mixing and conversion strip invisible marks.
- **Content ID:** don't register the song. "Output … may not be unique", and OST decision 13 already defaults to not registering. Keep provenance to dispute third-party claims. Any copyright registration disclaims the AI material (§1.7).

### 4.11 Bake-off and gate (once M9, counsel's read and access exist)

- **Before any upload:** the pre-upload checklist (§1.7).
- **Bake-off, ≈ $60 cap:**
  - route C × 2 tools (ElevenLabs Music, ACE-Step) × 5 takes;
  - route B × Lyria × 5 takes, as the control;
  - route A × 1, if a consenting guide exists (required for AIM-12 (b)).
- **Automated gate:**
  - the engine's `analysis`;
  - the transcript against the lyric sheet;
  - melody similarity against OST §1.7;
  - **a broad audio-fingerprint and cover-detection pass against commercial catalogues** on every final mix, since a model's arrangement can add hooks close to published songs.
- **Blind panel with the fixed reference list** (§1.6, test 4). Any named match is an automatic reject. The panel also answers "does it sound like any other voice in the show?" and "would you guess it was generated?".
- **The showrunner listens in picture,** over THE ENDINGS, against the programmatic demo and the captions reel, before anything is mixed.

### 4.12 The rulings this needs

> **M9 (AIM-1):** allow one AI music model to perform the Ep12 closing song (picture and album cut) as the only exception to OST §6.10. It is fenced to: a designed voice that resembles no one; a found-text lyric; the OST engine's melody and form; the engine's checks, the fingerprint pass and the blind panel; and plain disclosure.

> **AIM-12:** who the singer is. Option (a), recommended: the monitor's Ep12 lines become on-screen text and the song is the first time the model is heard. Option (b): the monitor speaks in the singer's voice, which needs a casting ruling and route A.

> **AIM-3:** whether the song reveals the button's third. Default: withheld.

---

## 5. The credits device

### 5.1 The verdict: no new medium each week

The scan proposed THE DESK: every episode's credits would hold the same still life, drawn in that episode's medium. In a 6–15 s outro it doesn't earn its place:
- **The outro has one job:** a calm pane that carries the credits and a one-line disclaimer long enough to read.
- **It would be a third weekly range slot**, beside the intro's bar 9 and the title card. That's a quota, which "not in a forced manner" rules out.
- **Most weeks it would only recap** the episode's own leap.

### 5.2 What earns its place instead

1. **The pane changes on five real events only,** and every other week repeats the last rung:
   - Ep1: the terminal;
   - Ep3: the chat window;
   - Ep6: sound;
   - Ep8: the agent log;
   - Ep10: the machine types the credits.
   
   This is the showrunner's own idea of a pane rendered at the machine's quality for its month. It applies to whichever outro proposal is chosen. Under OUTRO-PROPOSALS' recommended E ("file closed"), the same five events change the file's own rendering.
2. **The `ai tools` line stays plain.** The pane already carries it (`ai tools: used throughout · see notice`). If the credits owner wants detail, the line can name the week's families in plain words, with no counts and no wit, budgeted at guardrails §7's rate.
3. **The full per-episode ledger goes in the notice,** off screen. Where the story says the audio is AI and it isn't (Ep1's hearing clone, Ep11's call), the ledger says it's a human performance.
4. **The season ledger goes on screen once,** in the finale's crawl (AM12.e).
5. **Two or three AI-media stingers for the season** (≤ 5 s each, callbacks, never plot):
   - Ep3: the podcast resumes;
   - Ep9: the kiosk greets an empty lobby at night;
   - optionally Ep10: an empty hall still applauding.
   
   The outro owner's other stingers (Ep1's moth, Ep12's KORG 5) are theirs.

### 5.3 The plan per episode

| Ep | The pane | AI-media stinger | The notice's ledger (example; the real one comes from provenance) |
|---|---|---|---|
| 1 | **Rung 1: the terminal.** 1-bit monospace, typed at a human's rate | — | The hearing's cloned voice is a human performance. A product film inside a monitor (if 1.H ships as video) |
| 2 | Rung 1 repeats | — | CHATGTP's voice (designed, or human if cast) |
| 3 | **Rung 2: the chat window.** The log arrives as a reply under a folded `thought for 2 seconds` | **The podcast resumes at 2×** | Two fictional host voices, designed from text; a podcast script drafted with a language model and edited by the writers |
| 4 | Rung 2 repeats | — | Still images repainted inside the city's pictures |
| 5 | Rung 2 repeats | — | Nothing new |
| 6 | **Rung 3: sound.** A speaker meter; the reprise plays "through" the pane | — | Video clips inside a phone, with generated sound effects |
| 7 | Rung 3 repeats | — | The Ep6 clips, reused on an easel |
| 8 | **Rung 4: the agent log.** `task: credits · step 3/5` | — | Per style-range 8.B |
| 9 | Rung 4 repeats | **The kiosk, at night** | One kiosk voice, designed from text (plus the consented conversion, if it ships) |
| 10 | **Rung 5: the machine types the credits itself** | opt: the empty hall | Nothing new (or the M8 bed, if it ships) |
| 11 | Rung 5 repeats | — | THE HUMANIST's assistant, designed from text; RUMPT's call is a human performance |
| 12 | **The song replaces the pane** (§4) | KORG 5 ships to total silence (existing) | The season's ledger, on screen in the crawl (AM12.e) |

- **Every rung is a callback.** Nothing in a pane previews a reserved reveal.
- **The ledger entries are guides for the credits owner.** The real wording comes from provenance and legal review, and stays plain.

### 5.4 What would bring THE DESK back

If the chosen outro proposal is a still life of 10 s or more, THE DESK can live *inside* the pane's frame as its background: callbacks only, the glass always pixel, one designed move a week. The scan's twelve rungs are kept in its §4 for that case. Default: not taken.

---

## 6. Rulings and resource asks

Numbered `AIM-n` so they don't collide with style-range's R-numbers or the OST's decisions. Nothing changes until the named owner writes the ruling into their own file.

### 6.1 Three for the showrunner

| # | Ruling | Recommendation | Default until decided |
|---|---|---|---|
| **AIM-1 (M9)** | The one-song exception to OST §6.10 (§4.12). The OST owner writes it into §6.10 and §8; a pointer is already there | **Yes, as asked**, fenced as written. Separate from M8 | The ban stands; the programmatic first pass ships |
| **AIM-12** | Who the singer is: (a) the song is the model's first voice, or (b) the monitor speaks in it (§4.1) | **(a)** | (a) |
| **AIM-3** | Does the song reveal the button's third? Reconcile OST decision 1 (`ours.`) and OUTRO-PROPOSALS §1.5's F-major option with beat #16 | **No.** F cadences over D♭; the F chord's third stays withheld | Withheld |

### 6.2 Routed to other owners

| # | Ruling | Owner | Recommendation | Default |
|---|---|---|---|---|
| **AIM-4** | Legal read of ElevenLabs Music's sector clause ("operate in" political advocacy, campaigning, electoral services "or other political causes") for a political satire; the second music vendor's terms; the Gemini paid-tier and 18+ terms; Suno's watermark clause | Counsel | Ask before any spend | Test on ACE-Step locally |
| **AIM-5** | Licensed singing voicebanks. **This is an amendment to guardrails §5, not an ordinary ruling**, and only the showrunner and the guardrails owner can make it | Showrunner + guardrails owner | **Don't amend** | OUT |
| **AIM-6** | Native model audio on SYNTH bezel clips from Ep6, **SFX and ambience only**; any take with speech, singing, vocalising or melody is rejected. It's an exception to GENAI principle 9 | GENAI owner | Yes, after the SYNTH ruling | Model audio off |
| **AIM-7** | *Folded into M8 as it stands.* The only remaining use is AM10.b (opt), which is instrumental with no voice | OST owner | — | The ban stands |
| **AIM-8** | Speech-to-speech of a real performer (DOT's performer for AM9.a; any route-A guide singer). **It names the two exceptions it makes: GENAI principles 4 and 7.** Consent must be specific: the one line, the tool, the output voice, no training, no reuse, and a term. The performer is paid. Counsel checks union digital-alteration terms and state digital-replica laws (e.g., California AB 2602 [K]). Until consent is signed, any prosody transfer uses a TTS scratch | Casting, with counsel | Yes, at casting, if the polish is wanted | A designed voice from text |
| **AIM-9** | The disclosure wording: §1.4's credit line, §4.10's song credit and legal-card line, the notice's ledger, GENAI §6's "conversion strips invisible marks" line; and the EU AI Act Art. 50(4) read of GENAI §6's deepfake note | Credits owner, with legal review | Yes | The current draft stands while nothing ships |

### 6.3 Retired or denied

| # | What | Why |
|---|---|---|
| **AIM-2** | The Eps 9–11 reprise voice | Retired: the hum is cut (§3.15) |
| **AIM-10** | The weekly ledger line as the credits' range device | Retired: the ledger moves to the notice (§5.2) |
| **AIM-11** | THE OTHER FACE (AM12.f) | **Denied:** it breaks principle 4 on purpose, and a generated face can resemble someone by accident |

### 6.4 Resource asks (nothing is spent now)

| # | Ask | Why | Estimate |
|---|---|---|---|
| 1 | **The three rulings** (§6.1) and **your ears on the captions reel, then the demo**, in picture, before any spend | The approval gate | Free |
| 2 | **Music-model access for a capped bake-off**, after counsel's read: an ElevenLabs plan (already GENAI ask 6) and/or a paid Gemini API key (Lyria as the control) | The song's final | **≈ $60 cap** |
| 3 | **Counsel:** AIM-4, AIM-8's consent and replica-law check, AIM-9 and Art. 50(4), and §1.7's authorship and registration question | Before any spend and before distribution | Unquoted |
| 4 | **The M1 Harmon trumpet session** (already GENAI ask 4) | The bridge's human counter-line | Inside what's already asked |
| 5 | *Optional:* **a session singer** | The human alternative, and the guide for route A (required for AIM-12 (b)) | Unquoted |
| 6 | **A blind listening panel** of 5–10 people outside the production, **plus the fixed reference list** (§1.6) assembled for them to hear | Every designed voice, every Kokoro voice that might ship, and the singer | Your help finding them |
| 7 | **Video generation** for AM6.a and AM7.b | The feed and the slideshow | ≈ $6–20 |
| 8 | **Free, local tools:** an open photogrammetry tool (COLMAP-class; licence to check). Brush and Spark only if 12.A stops at resolved objects | AM12.b | $0 |
| 9 | **Consent clauses at casting** (AIM-8) | AM9.a's polish; any guide singer | — |

### 6.5 Cost summary

| Area | Items | Generation estimate |
|---|---|---|
| The song | AM12.a bake-off | $5–60 |
| Voices | AM3.a, AM9.a, AM11.a | under $5 |
| Video in bezels | AM6.a, AM7.b | $6–20 |
| Images | AM4.a | $2–5 |
| 3D | AM12.b | $0 (local) |
| **Total** | | **≈ $15–90**, inside the GENAI plan's ceiling; human sessions unquoted |

---

## 7. Handoffs, and how to pick this up

**What changed and why.**
- **Draft 1 (earlier on 2026-09-26)** answered the showrunner's note on the finale song and the full range of AI media. It turned the census and the season scan into one plan and reconciled it with the live outro note.
- **This finalization** applies the taste and guardrails critics' amendments ([§8](#8-critic-log)). The main changes:
  - the lyric is now found text only and never sings the V.O.;
  - the singer's identity is a ruling;
  - the voice spec is an arc, and it never breathes;
  - the song opens on a bare F and ends on black;
  - half the per-episode items are cut, and the rest are tightened;
  - the ledger is off screen, the hum is cut, and the stingers are down to 2–3;
  - the voice ladder is booked;
  - the guardrails are tightened (Kokoro product-named packs, voicebanks, watermarks, uploads, credits, authorship, the panel, officials, AIM-8).
- It also added the pointer under OST-BIBLE §6.10. That line is the only change outside this file.

**Handoffs** (the owners edit their own files):

| To | What |
|---|---|
| **OST owner** (`audio/ost/OST-BIBLE.md`) | §6.10 now has a one-line pointer to the proposed exception (added in this pass; nothing else changed). If M9 is approved: its wording in §6.10 and §8; MM-37 *generally available* in the track list (default 29 bars, long 35, album ≈ 3:00); MM-15's Ep12 colour becomes the song. Reconcile decision 1 and OUTRO §1.5's F-major option with beat #16 (AIM-3). `analysis` gains a lyric-transcript score and a hook for the release-time fingerprint pass. No Eps 9–11 hum |
| **Vocals owner** (`audio/vocals/`) | Replace the product-named Kokoro packs in `scripts/coldopen.py` and `scripts/lines.py` (`am_echo`, `am_puck`, and the `designed` blend that uses them) for anything that ships or conditions a model; blind-panel every Kokoro voice that might ship; credit Kokoro and note the CC BY training data its card lists. Extend `sing.py` from syllables to lyric words, with the breath strip, for the song's guide |
| **Ep12 writer and editor** | Lyric draft 2 (§4.4) and its source table (§4.5). AIM-12 (a) turns the monitor's *it was your idea.* and the veto into on-screen text. The endings go on phrase boundaries, spoken endings stay clear of sung words, the sync points apply, and the picture ends on black (§4.7). AM12.b's stopping point (default: dense points). AM12.c is the writers' sentence. AM12.d is cut |
| **Eps 2, 3, 6, 7, 9 and 10 writers** | Ep2: `take your time.` is a lyric source (tell the Ep12 writer if #28 cuts it). Ep3: AM3.a is the stinger only. Ep6: AM6.a merges into 6.E (+4–6 s). Ep7: AM7.b (0 s; SELBEEP's line first). Ep9: AM9.a (0 s; DOT in frame is the DOT owner's call), and the stinger. Ep10: #2 as written; the optional stinger. Ep10's cut `took the liberty.` is an alternate only if restored |
| **Credits and outro owner** ([OUTRO-PROPOSALS](../production/OUTRO-PROPOSALS.md)) | The five pane rungs; the plain `ai tools` line; the notice's ledger; the 2–3 stingers; §4.10's song credit. Reconcile with OUTRO §1.5: "extends the weekly outro" versus note 1's "replaces the pane"; its filler (an instrumental with the lyric as type) is this file's first test; its disclosure line "lyrics by (writer)" should follow §1.7's authorship chain |
| **GENAI plan owner** | AIM-6 as narrowed; Suno's watermark clause under principle 8; the own-C2PA re-signing; the credit line (AIM-9); the register changes the census lists (the Sora 2 API shutdown on 2026-09-24, MiniMax's closure to new users, Lyria 3.5's price, ElevenLabs Music v2.5's features and clauses, Suno's new terms) |
| **Style-range owner** | AM12.b as 12.A's route, with the dense-points default and photogrammetry; the re-roll grammar dropped. AM6.a merged into 6.E as 6.F's sanctioned form. **1.F's "designed from text" voice for a real senator conflicts with GENAI principle 7**; add "never an imitation of the senator or the anchor". AM4.a's prompt rule |
| **Casting** (`audio/voices/CASTING.md`) | AIM-8's consent terms; AIM-12 (b) would need a casting ruling for the monitor's voice; THE INTERN's voice is never used by a model |
| **Guardrails owner** | The Kokoro product-named ban; voicebanks OUT (AIM-5 only as a §5 amendment); the officials scope (no generative voice model; analysis models fine); the generic-imagery rule for any ad stand-in; the fixed reference list; sign-off if 12.A goes to resolved objects |
| **Facts owner** | Every lyric line's tag (§4.5), especially `super.`'s [P] twin and `it was your idea.` out of context; AM3.a's lines against the essay; AM12.c's [INVENTED] handling |
| **Naming owner** | A parody format name for AM3.a (proposed `QUICK DIP`); the descriptor for ELGOOG's notebook app; the synthetic band's descriptor for AM5.b |
| **Elevation-ideas owner** ([elevation-ideas](elevation-ideas.md)) | CAP-18 is booked here as THE VOICE LADDER (§3.13). CAP-19's sung rungs are declined (singing is last); its instrumental rungs in speakers stay code, and only if M8 allows |

**How to pick this up.**
1. Read [SHOWRUNNER-NOTES](../production/SHOWRUNNER-NOTES.md), then this file, then [pov-and-framing](pov-and-framing.md) §1.3, [style-range](style-range.md) §1.3–1.4, and [OST-BIBLE](../../audio/ost/OST-BIBLE.md) §1.8, §2.1–2.5 and §6.10.
2. **The first measurable step needs no ruling and no spend:** the captions reel. Put the draft 2 lyric as timed captions over the Ep12 endings in the stick reel, on a temp MM-15 bed, at the default 29-bar length. Check density, the stop and the sync points, and show it to the showrunner.
3. **Then the programmatic demo.** Start a track folder from `audio/ost/tracks/_template/` (as `mm37-generally-available/`) in the `audio/.venv-theme` venv, render the band to the default and long cuts, build the guide with an extended `audio/vocals/scripts/sing.py` on a blind-paneled, non-product Kokoro pack, run `analysis`, and cut it both ways under the endings.
4. Re-verify every tool's price and terms before any spend, and run the pre-upload checklist (§1.7).

**Measured vs needs a human.** Nothing was generated, rendered or heard. Every quality statement is a vendor's claim or [K]. The Kokoro pack list was checked locally (the cached `hexgrad/Kokoro-82M` voices folder). The lyric sources were checked against the episode files by grep (§4.5), but their tags still need the facts owner. The song, every designed voice, the podcast and the reconstruction all need ears and eyes: first the showrunner's on the captions reel and the demo, then the blind panel's.

**Open issues.**
- Whether ElevenLabs Music can render a vocal alone over our instrumental, or return stems [UNVERIFIED].
- The photogrammetry tool's licence; Spark's licence [UNVERIFIED].
- ACE-Step on this Intel iGPU is untested.
- The outro proposal isn't chosen yet (OUTRO-PROPOSALS recommends E), and "extends" versus "replaces" is open for Ep12.
- OST decision 1 and OUTRO §1.5's F-major option both predate beat #16 (AIM-3).
- Ep2 #28 decides whether `take your time.` survives.
- The exact bar placement of the knee's syllables and of the stop is the OST owner's call.

---

## 8. Critic log

Two critics reviewed the first draft on 2026-09-26: **taste** (T1–T31) and **guardrails** (G1–G19).
- **Accepted:** applied as written.
- **Accepted, changed:** applied with the change given and its reason.
- **Moot:** the item it targeted was cut by another amendment; the rule is kept for any revival.
- **Declined in part:** the declined part and its reason are given.

No amendment was declined outright.

### 8.1 Taste

| # | Amendment | Outcome | Where |
|---|---|---|---|
| T1 | The draft breaks the POV contract; fix it by rule: the machine sings only what was said aloud, typed or printed | Accepted. `i don't keep score.` and `second time.` are out. **Also:** pov §10's optional Ep12 TERMINAL `i don't keep score.` stays ineligible even if it ships, so the V.O. remains the one version the machine never sings | §4.1, §4.4 |
| T2 | Cut every invented connecting line; 100% found text | Accepted | §4.3–4.4 |
| T3 | The second-meaning test: keep, drop and add lines | Accepted, changed. `after you.` is attributed to Ep11's machines' politeness loop and Ep12's on-screen subtitle, not to THE RESEARCHER (the episode files have no such line from him). `take your time.` is flagged as dependent on Ep2 #28 | §4.4–4.5 |
| T4 | Draft 2 lyric, the 28-bar cut, alternates | Accepted, changed. **Declined in part:** `took the liberty.` is kept as an alternate only if restored, because the Ep10 outline cut it. `thanks.` is sourced to Ep1 sc 20 (Mas to the Orb). The four cut lines are marked `+` so one sheet serves both cuts | §4.4 |
| T5 | Prosody: settles only; `super.` gets the longest hold; the long note on `ver`; the stop replaces a word | Accepted, changed. With four settles and four lines in verse 1, a stop that silenced a settle would drop a line, so the stop is **its own bar, placed where the next settle is due**. The ear still hears it where a word should be | §4.4, §4.6 |
| T6 | The singer must be audible as the machine; (a) or (b); "one machine, one voice" | Accepted. It is AIM-12, with (a) recommended | §4.1, §3.13, §6.1 |
| T7 | Fix the voice-spec contradiction: an arc; it never breathes; drop "gender-neutral" | Accepted, and the prompt is rewritten to match | §4.6 |
| T8 | Open on the bare F, not the D♭ chord | Accepted | §4.4, §4.6–4.7 |
| T9 | Stop overselling the harmony | Accepted. "His version becomes the official one"; the F-major check and AIM-3 are unchanged | §4.6 |
| T10 | Tempo: half-time verse 1 only; mixed ending lengths; 28 bars by default | Accepted, changed. The default is **29 bars** (28 plus the stop's bar, per T5), and the long cut is 35 | §4.6–4.7 |
| T11 | Spoken endings clear of sung words; the sync points | Accepted, as the editor's call | §4.7 |
| T12 | Don't go back to the glass; end on black | Accepted | §4.7 |
| T13 | A fingerprint and cover-detection pass; the second vendor's terms to counsel | Accepted | §4.8, §4.11, AIM-4 |
| T14 | The cheapest first test: captions in the stick reel | Accepted. It is also where OUTRO §1.5's filler and this file meet | §4.8, §7 |
| T15 | AM3.a to the Ep3 stinger only | Accepted | §3.3 |
| T16 | AM6.a merged with 6.E; no per-model comparison; no animals or food; clips ≥ 1.5 s | Accepted. The size is stated honestly as +4–6 s over 6.E | §3.6 |
| T17 | AM7.b: keep; SELBEEP's line first, the last slide after | Accepted. The slides are AROS callbacks, so the line still has something to land on now that the feed is all him | §3.7 |
| T18 | Cut AM7.a | Accepted | §3.15 |
| T19 | Cut AM2.a, AM3.b, AM5.a and AM6.b; retire THE AD BREAK; AM5.b as text only | Accepted | §3.5, §3.15 |
| T20 | AM9.a: keep; the words carry it; STS is optional; DOT in frame; the credit rewrite | Accepted. DOT in frame is left to the DOT owner, as the critic asked | §3.9 |
| T21 | Cut the AM10.a grid; #2 as written | Accepted | §3.10, §3.15 |
| T22 | AM12.b: approve the route, not the addition; decide the stopping point first | Accepted. The default is dense points via photogrammetry, and the re-roll grammar is dropped | §3.12 |
| T23 | AM12.c, AM12.d and AM9.b are invisible: not range | Accepted. AM12.d is cut, AM9.b is an optional egg, and AM12.c is the writers' sentence | §3.9, §3.12 |
| T24 | Pane rungs on 4–5 real events | Accepted, changed. Generalised to whichever outro proposal is chosen, because OUTRO-PROPOSALS now recommends E, not A | §5.2 |
| T25 | The weekly ledger line off screen | Accepted. AIM-10 retires | §1.4, §5.2 |
| T26 | Cut the Eps 9–11 hum | Accepted. AIM-2 retires, and the weekly knee reprise is the plant | §3.13, §3.15 |
| T27 | Two or three stingers; cut Ep6's | Accepted | §5.2 |
| T28 | The machine's speaking voice improves over time (CAP-18) | Accepted, as THE VOICE LADDER. Ep1's rung is human-performed with DSP (per G10), never designed | §3.13 |
| T29 | A home for range outside the episodes | Accepted | §1.8 |
| T30 | Three rulings for the showrunner | Accepted. AIM-6 goes to the GENAI owner and AIM-7 folds into M8, since the critic didn't route them | §6 |
| T31 | Revised coverage; cost ≈ $30–90 | Accepted, changed. With the reconstruction local at $0, the recomputed cost is ≈ $15–90 | §3.14, §6.5 |

### 8.2 Guardrails

| # | Amendment | Outcome | Where |
|---|---|---|---|
| G1 | Kokoro packs named after real product voices | Accepted. Verified locally: the nine packs are in the cached set, and `am_echo` and `am_puck` are used in `coldopen.py` and `lines.py` | §1.2, §7 |
| G2 | Licensed voicebanks are cloned singing voices | Accepted. The family is OUT, the OpenUtau step is dropped, route A is STS only, and AIM-5 is reworded as a §5 amendment | §1.3, §2, §4.9, §6.2 |
| G3 | Model music and voices before the finale | Accepted. AIM-6 is limited to SFX and ambience; M8 beds are instrumental with no voice; AM5.b is text only; the "only sung performance" claim is qualified. The hum part is moot (cut per T26) | §2, §3.6, §4.8 |
| G4 | Watermarks and content credentials | Accepted. Archive the originals, re-sign with our own C2PA, adopt the "conversion strips" line, and Suno is out for edited takes | §1.4, §4.9–4.10 |
| G5 | Vendor data use and uploads | Accepted, as the pre-upload checklist | §1.7, §4.11 |
| G6 | The credit lines are inaccurate | Accepted. The line now lists families, names the consented conversion, credits the model's arrangement and keeps only the true negatives | §1.4, §4.10 |
| G7 | Authorship and copyright | Accepted | §1.7, §4.9–4.10 |
| G8 | The voice-likeness gate is too loose | Accepted. There is now a fixed reference list. The "closer each week" part is moot (the hum is cut) | §1.6, §4.11 |
| G9 | AIM-8 must name its exceptions and specify consent | Accepted | §6.2, §3.9 |
| G10 | Officials and depicted clones | Accepted. The 1.F clause and the flag to the style-range owner; RUMPT's cadence means the show's performer in cartoon register; the notice says both are human performances; the scope rule | §1.3, §3.1, §3.11, §5.3 |
| G11 | Stand-ins for real ads | Moot for AM2.a, AM3.b, AM6.b and AM7.a (all cut). The generic-imagery rule is kept for any future ad, and Art. 50(4) goes to counsel under AIM-9 | §1.3, §3.15 |
| G12 | AM10.a's hologram | Moot (cut per T21). The critic's conditions are kept as the only terms for any revival | §3.15 |
| G13 | AM3.a: compression and cheer only; rename DEEP DIVE | Accepted. A proposed parody name goes to the naming owner | §3.3 |
| G14 | AM4.a: no named or described studio; medium only | Accepted | §3.4 |
| G15 | AM12.b: dense points by default; invented props only; sign-off for resolved objects; Spark [UNVERIFIED] | Accepted | §3.12 |
| G16 | Read time | Accepted. The weekly ledger is moot (off screen); the `ai tools` line and the credit line are budgeted by formula; the over-black hold is computed | §1.4, §4.7, §5.2 |
| G17 | The originality check is too narrow | Accepted | §4.8, §4.11 |
| G18 | The lyric's text tags | Accepted. `super.`'s [P] twin goes to the facts owner; the Orb's form only; AM12.c is [INVENTED] with no quotation marks and no real date | §4.5, §3.12 |
| G19 | Corrections to the terms table | Accepted | §4.9 |

---

## 9. Sources

**Project** (read 2026-09-26):
- [SHOWRUNNER-NOTES](../production/SHOWRUNNER-NOTES.md) · [style-range](style-range.md) · [pov-and-framing](pov-and-framing.md) · [elevation-ideas](elevation-ideas.md) · [guardrails](guardrails.md) · [naming](naming.md)
- [OST-BIBLE](../../audio/ost/OST-BIBLE.md) · [GENAI-UPGRADE-PLAN](../production/GENAI-UPGRADE-PLAN.md) · [OUTRO-PROPOSALS](../production/OUTRO-PROPOSALS.md) · [vocals README](../../audio/vocals/README.md) and `audio/vocals/scripts/coldopen.py` and `lines.py`
- Ep12: [beats](../episodes/ep12/beats.md), [outline](../episodes/ep12/outline.md), [intro slot](../episodes/ep12/intro-slot.md), [open questions](../episodes/ep12/open-questions.md), [facts](../episodes/ep12/facts.md) and [gags](../episodes/ep12/gags.md)
- Eps 1–11: the scripts, beats and gags searched for the lyric's sources (§4.5); [ep10 outline](../episodes/ep10/outline.md) (the cut `TOOK THE LIBERTY`); [the-intern](../characters/the-intern.md)
- The cached Kokoro-82M voices folder, listed locally.

**Research inputs:**
- [ai-media-census](../_sources/research/ai-media-census.md). Its §8 lists every vendor page opened on 2026-09-26.
- The season scan (`aimedia-scan/scan.md` in the session scratchpad).
- The two critics' reviews. The guardrails critic read these terms directly on 2026-09-26: the ElevenLabs Music Terms (26 May 2026), the ElevenLabs Terms of Service (31 Mar 2026), the ElevenLabs Use Policy (17 Aug 2026), Suno's terms (effective 3 Sep 2026), the Gemini API terms (28 Apr 2026), the Lyria docs and Google's Generative AI Prohibited Use Policy.

Tags [V], [K], [H] and [UNVERIFIED] are carried over from those files as they stood.
