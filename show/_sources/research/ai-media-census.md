# MR. MAS · AI media capability census (September 2026)

> **Status: RESEARCH, paper only, 2026-09-26.** No generation API was called, no key was read and nothing was spent. This file changes no rule, script or locked file. Anything that would change one is listed as a ruling ([§6](#6-rulings-this-raises)) or a handoff ([§7](#7-handoffs-and-how-to-pick-this-up)). Every number here is a guide, per the showrunner's "no hard cutoffs" note.

| | |
|---|---|
| **The ask** (showrunner, 2026-09-26, verbatim) | "also, i think it'd be fun to make an outro song with lyrics using a music model only for the season finale. we can think about something like that. let's consider if there is any other ways we can show the full range of ai media generated capabilities throughout the season we're not considering yet" |
| **Standing notes** | "we want to show off throughout the show the capabilities of what range we're able to do, but not in a forced manner either, only where it makes sense" · "as stated before, we want to first create a version fully programatically, then we can consider the outside layers as quality additions to replace components" · "try to be creative and break boundaries while still being tasteful and generally faithful to the shows tone and flow" · "generally, there should be no hard cutoffs for rules on episode handling. there can be guidelines" |
| **Firm lines this file works inside** | [guardrails §5](../../bible/guardrails.md#5-legal-hygiene): no cloned or imitated voice or singing voice; no "in the style of" and no real artist's name in any prompt; nothing near-photoreal on a real person's likeness; parody names only. [GENAI principle 4](../../production/GENAI-UPGRADE-PLAN.md#1-principles): no face, hand, mouth, lip sync or performance out of a model. Disclose AI generation in the credits ([GENAI §6](../../production/GENAI-UPGRADE-PLAN.md#6-pipeline)). Pixel primary; 1080p max. |
| **Project context read** | [SHOWRUNNER-NOTES](../../production/SHOWRUNNER-NOTES.md) · [GENAI-UPGRADE-PLAN](../../production/GENAI-UPGRADE-PLAN.md) (§1, §5, §10) · [style-range](../../bible/style-range.md) (twelve lines, §1.3–1.4, §3.2–3.4, §5, §6.1a, §6.12, §8–9) · [OST-BIBLE](../../../audio/ost/OST-BIBLE.md) (§0, §2.1–2.3, §6.10, §8) · [CASTING](../../../audio/voices/CASTING.md) (§0, §6) · [recurring-gags](../../gags/recurring-gags.md) (C07, C09, G21) · [ep12 flashbacks and gags](../../episodes/ep12/) |

**Tags.**
- **[V]**: a primary page (vendor docs, pricing, terms, model card or repo) was opened this session, 2026-09-26. Web search was exhausted, so every [V] is a direct page fetch; §8 lists them.
- **[K]**: known but not re-verified this session. **[K·GENAI]** means taken from the GENAI plan's own fetch of 2026-09-25 and not re-opened here.
- **[UNVERIFIED]**: looked for this session and not confirmed.

**Verdicts.**
- **USE**: fits the guardrails and has a motivated home in the season.
- **NARROW**: usable only in the stated narrow form.
- **SUPPORT**: a production tool. It never shows on screen as "range".
- **RULING**: needs a showrunner ruling first. The default is not used.
- **OUT**: conflicts with a firm line, or has no honest home.

**Contents:** [0. At a glance](#0-at-a-glance) · [1. Method](#1-method) · [2. The census](#2-the-census-family-by-family) · [3. The finale's outro song](#3-the-season-finales-outro-song) · [4. What we aren't considering yet](#4-what-we-arent-considering-yet) · [5. The season's AI-media calendar](#5-the-seasons-ai-media-calendar) · [6. Rulings](#6-rulings-this-raises) · [7. Handoffs](#7-handoffs-and-how-to-pick-this-up) · [8. Sources](#8-sources-opened-this-session)

---

## 0. At a glance

1. **Almost every family can now be shown off credibly from a prompt, a document or a still.** That covers songs with sung lyrics, two-host podcasts, designed voices, sound effects, video with sound, and 3D worlds you can walk through. Three things are still weak everywhere: **exact control** (this melody, this frame, this pose), **consistency over minutes**, and **matching an existing look**. Those three are exactly what our code does well. So the strongest showcase pairs the two: code sets the melody, frame or geometry, and the model performs inside it.
2. **The finale song is feasible now and cheap** ([§3](#3-the-season-finales-outro-song)). There are three honest routes. The best fit is "**the model covers our own demo**": the OST engine writes and renders the song, then a music model performs it with a voice that belongs to nobody. That keeps the engine as composer of record, lets the song pass the engine's checks (F home, the 96 grid, the third), and still has a model singing. Generation for a 50-take bake-off costs roughly **$5–60**.
3. **It collides with one rule: [OST §6.10](../../../audio/ost/OST-BIBLE.md#610-licences-and-rights)** ("No generative-AI music models and no voices"). The pending **M8** exception is narrower: non-melodic beds only. The showrunner's note reads as a request for a new, fenced exception, proposed here as **M9: the Ep12 credits song** (optionally, "the machine's songs"). The GENAI credit line ("No performances, faces or voices were generated") would also have to change.
4. **The plans don't yet use six families that have motivated homes:**
   - **The machine's songs:** YLLIT's song in Ep7 as the middle rung, Ep12's credits as the top.
   - **The AI podcast:** Ep3 turns Mario's 15,000-word essay into a nine-minute two-host show. It pays off C07 in Ep12.
   - **Gaussian-splat reconstruction for 12.A:** local, free and open-source, with no outside generator.
   - **Live code on screen** that really renders the next shot (the TERMINAL register; Ep12's "BUILDING CODE: IT." ballroom).
   - **A world-model walk inside the monitor** (Ep10–11): the room builds ahead of the camera and forgets behind it.
   - **The machine's own sound inside its bezel** from Ep6, the sound spine style-range already describes.
5. **Some families stay out:** lip sync and talking heads, avatars and synthetic presenters, restyles of faces, motion capture of anyone real, and upscaling or interpolation on pixel art. The reasons are principle 4, the likeness line and the pixel grid.
6. **What changed since the GENAI plan's 2026-09-25 fetch:**
   - The Sora 2 API shut down on 2026-09-24 [V].
   - MiniMax's paid music API closed to new users on 2026-08-20 [V].
   - Lyria 3.5 is in the Gemini API at **$0.08 a song** with custom lyrics [V].
   - ElevenLabs Music v2.5 now has inpainting, audio reference, **finetunes on your own catalogue** and C2PA signing [V]. Its terms also exclude customers in "political advocacy … or other political causes" [V], so it needs a legal read for a political satire.
   - Suno's terms were updated (effective 2026-09-03) [V].
7. **Programmatic first holds for every family.** Every USE row has a code filler built on the final's timing. In three cases (splats, live code, dubbed pixel mouths) the programmatic version *is* the final.

---

## 1. Method

- **Scope:** every family of generative media the brief lists, plus the adjacent tools a production uses (provenance, stems, alignment, agents).
- **For each family:** what it can do today; the leading tools with access, price and terms; what it looks or sounds like when shown off well; the specific risks for MR. MAS; the verdict, the programmatic filler, and where it could live.
- **Sources:** vendor pages were fetched directly (§8). A price is **as listed on 2026-09-26**, and the billing period is shown where the page gave one. Terms quotes are verbatim where marked.
- **Not measured:** nothing was generated or heard. Quality claims are the vendors' own or [K].

---

## 2. The census, family by family

### 2.1 Music with vocals and lyrics (song generation, stems, extend, covers)

**Today.** A prompt plus your own lyrics produces a finished song with a sung vocal, 2–10 minutes long. Structure is steerable by section tags or timed sections. Current tools can also regenerate one section and keep the rest (inpainting), extend a song, "cover" an uploaded track in a new arrangement, add a vocal to your own instrumental, split the result into stems, and fine-tune on your own catalogue so that output sounds like *your* music.

| Tool | Access · price | What it adds · terms | Tag |
|---|---|---|---|
| **ElevenLabs Music v2.5** (`music_v2_5`) | API **$0.15/min**. Commercial use from **Starter ($6/mo)** up; the Free plan has no commercial use | Vocals or instrumental; the docs say songs run 3 s–5 min, while the API reference accepts `music_length_ms` up to 600,000. **Composition plans:** ordered chunks with text/lyrics, `duration_ms`, positive and negative styles, and `respect_sections_durations`. **Inpainting** (keep, regenerate or condition on stored sections, including an *uploaded* file). **Audio reference** (about 30 s, copyright-screened, "does not copy or remix"). **Finetunes** (up to 50 tracks and 250 minutes; "Fully original compositions you created and own outright", screened). `sign_with_c2pa`. No stem endpoint documented. **Music terms, 26 May 2026:** no artist, songwriter, song-title or label names and no "substantial" lyrics in inputs; "Output … may not be unique"; bars customers in "political advocacy or campaigning … or other political causes" | [V] |
| **Lyria 3.5** (Google) | Gemini API **$0.08 per full song**; `lyria-3-clip-preview` $0.04 per 30 s clip. Also in the Gemini app, Flow Music, YouTube Shorts and Vids | Custom lyrics with `[Verse]`/`[Chorus]`/`[Bridge]` tags and timestamped sections; up to 10 images as input ("compose music inspired by the visual content"); 44.1 kHz stereo, MP3 or WAV. **No stems and no multi-turn editing.** Every output carries a **SynthID** watermark. Filters block "specific artist voices or the generation of copyrighted lyrics". The Gemini API terms say "Google won't claim ownership over that content", and free-tier inputs are used to improve products | [V] |
| **Suno v6** (v6, v6-wild; v6-mini free) | **Pro $8/mo** (2,500 credits, **20 downloads/mo**) · **Premier $24/mo** (10,000 credits, 60 downloads/mo, **Suno Studio**, a browser DAW with MIDI) · Free is non-commercial. No public API [K·GENAI] | Stems (2 types on Pro, 3 on Premier), **add vocals / add instrumental** to an upload, audio upload, "custom models" (what they train on is [UNVERIFIED]). Studio exports "full songs, stems, or selected ranges". **Terms (updated 10 Aug 2026, effective 3 Sep 2026):** paid-plan outputs are assigned to you; commercial use applies only to approved downloads; bans creating "a Voice Model of another person" and uploading "another person's voice"; "no representation … that any copyright will vest in any Output" | [V] |
| **ACE-Step 1.5** (open) | $0; local or rented GPU | **MIT.** Lyrics in 50+ languages; 10 s–10 min; **cover, repaint, track separation, multi-track, stem extraction, LoRA**. An XL 4B model (Apr 2026). Runs on CUDA, MLX, ROCm and **Intel XPU**; on CPU only with quantization. The authors' own claim puts quality "between Suno v4.5 and Suno v5". It asks users to verify originality and disclose AI involvement | [V] |
| **Stable Audio 3.0** | API, enterprise, or open weights (Small, Medium) | Full tracks up to 6 min, section edit and extend; "trained on fully licensed data"; enterprise indemnity. Vocals aren't stated | [V] |
| **MiniMax Music 3.0** | "Starting August 20, 2026, the paid APIs … will no longer be available to new users" | Vocals, covers | [V] → **OUT** |
| **Udio** | Pages returned no content | After its Oct 2025 settlement with a major label, Udio disabled downloads [K] | [UNVERIFIED] → **OUT** (no downloads) |
| Other open song models (YuE, DiffRhythm, LeVo and similar) | Local | Research-grade; licences vary | [K] |

**Shown off well.** On first listen you'd take it for a studio record: a real vocal performance with breath, phrasing and a lyric that lands, in the show's own harmonic language. Only the credit card tells you the voice belongs to nobody. By 2026, "AI can sing" is no longer the flex. The flex is *"the machine sang his tune, better than he does"*, which is the OST bible's own Ep12 thesis ([§2.3, "The Endgame"](../../../audio/ost/OST-BIBLE.md)).

**Risks for MR. MAS.**
- **OST §6.10** bans generative music and voices. M8's exception covers non-melodic beds only.
- **Melody originality.** A model can land near an existing tune, so check against OST §1.7 and run a melody-similarity check.
- **Prompt hygiene.** Genre grammar only. ElevenLabs forbids artist names, and Lyria filters them.
- **ElevenLabs' political-sector clause.** A satire isn't advocacy, but the clause is broad ("other political causes"). Get a legal read before using ElevenLabs Music.
- **Copyright may not vest in model output** (Suno says so outright). The human-written lyric and the engine-composed melody stay protectable only if the model doesn't write them.
- **Content ID.** "Output … may not be unique", so don't register the song (OST §8 decision 13 already defaults to not registering).
- **The voice itself** must resemble no real singer. Run a blind panel with an automatic reject, as in CASTING's CHATGTP test.

**Verdict: RULING (M9, [§6](#6-rulings-this-raises)).** Filler and routes are in [§3](#3-the-season-finales-outro-song). Homes: Ep12's credits (the top), YLLIT's song in Ep7 (the middle rung), and an optional 3 s plant in Ep2 ([§4](#4-what-we-arent-considering-yet)).

### 2.2 Singing voice synthesis (score-driven singers)

**Today.** You enter notes and lyrics, as MIDI or in a piano roll, and a neural singer sings them exactly: pitch, timing, vibrato, breath, even choirs. This is the one vocal family with **exact melodic control**, which the prompt-driven song models lack.

| Tool | Access · price | Notes | Tag |
|---|---|---|---|
| **ACE Studio** | Web app plus the ACE Bridge 2.1 plugin (VST3/AU/AAX) | "140+ Voices" in "8 Languages", choir and ensemble modes. "Every AI voice … is built on real performances - recorded, licensed, and shared with the artists behind them"; royalty shares to performers; outputs "Royalty-Free". Also offers training on your own samples. Price [UNVERIFIED] | [V] |
| **Synthesizer V Studio 2** (Dreamtonics) | Desktop, with a Linux build [K] | Licensed voice databases, cross-lingual singing, rap. The vendor page returned 403 | [K] |
| **OpenUtau** + ENUNU/NNSVS or DiffSinger voicebanks | Free; **MIT**; Windows, macOS and **Linux** | An open score editor. Each voicebank carries its own licence, and some forbid commercial use | [V] (editor) · [K] (voicebanks) |
| Vocaloid 6 | Desktop | Licensed voicebanks | [K] |
| Singing voice *conversion* (a guide vocal → another voice) | Various | See §2.4 | [K] |

**Shown off well.** A choir that doesn't exist singing close harmony dead in tune, or a lead vocal that hits the exact melody the composer wrote, note for note.

**Risks.** A licensed voicebank is a model of a **real, consenting and paid** singer. That is not an impersonation, but it is a model of a real person's voice, and the house rule reads "never clone or imitate". Allow only voicebanks whose vendor documents consent and compensation, and never one marketed as a soundalike (RULING, folded into M9). Prompt-designed vocals (§2.1) avoid the question entirely.

**Verdict: RULING, NARROW.** The best use is route A of the finale song, where the engine's melody has to survive note for note. Temp for M5's vocal PAD needs the same ruling, because §6.10 bans "voices".

### 2.3 Speech and voice design (TTS)

**Today.** Voices can be designed from a text description alone, performed with emotion tags (laughs, sighs, whispers), and rendered as two-speaker dialogue in one request. Quality at the top end is conversational and expressive. Comic timing is still the weak point (CASTING §6).

| Tool | Access · price | Notes | Tag |
|---|---|---|---|
| **ElevenLabs v3 + Voice Design** | TTS v3 **$0.10 per 1K characters**, Flash $0.05. Plans: Starter $6 · Creator $22 ($11 the first month) · Pro $99 | Voice Design returns three options and charges only for the preview text. **Use policy (17 Aug 2026):** no replicating a voice "without consent or legal right"; no impersonating "political candidates or elected government officials, regardless of whether authorization was obtained" | [V] |
| **Gemini 3.8 Flash TTS / Flash-Lite TTS** | About **$0.00225 per 10 s** (Flash) until 31 Dec 2026 | **Two speakers in one request**; 30 prebuilt voices plus an extended library; `speech_metadata.style` and inline tags such as `<sigh>`; 130+ languages; stored custom voices (up to 200 a project) | [V] |
| **OpenAI `gpt-4o-mini-tts`** | API | 13 voices. Instructions can steer "accent, emotional range, intonation, **impressions** …". Custom voices require a consent recording. Requires "a clear disclosure to end users that the TTS voice … is AI-generated" | [V] |
| **Qwen3-TTS VoiceDesign** (local, Apache-2.0) · **Kokoro-82M** (current scratch) | $0 | As in the GENAI plan and CASTING | [K·GENAI] |
| Others: Hume Octave, Cartesia Sonic, Fish Audio, Resemble Chatterbox, Dia | Various | Not evaluated | [K] |

**Shown off well.** A voice nobody has ever heard gives a performance with subtext: a pause before the noun, a laugh it swallows.

**Risks.**
- Never prompt "impressions", a real name or "sounds like".
- Officials stay human-only, per ElevenLabs policy and GENAI principle 7.
- A designed voice can drift toward a real one; the blind-panel reject catches it.
- Designed voices are no substitute for the human cast where performance carries the joke.

**Verdict: USE, as the GENAI plan already scopes it** (scratch, temp, and CHATGTP as a final candidate). The new uses are the podcast hosts (§2.15) and YLLIT's speaking voice. Filler: Kokoro.

### 2.4 Speech-to-speech (voice conversion)

**Today.** A human performance goes in and comes out in another voice, keeping the timing, breath and inflection. It works for singing too.

| Tool | Price | Notes | Tag |
|---|---|---|---|
| **ElevenLabs Voice Changer** | **$0.12/min** | Converts into any library or designed voice | [V] |
| Eleven Multilingual STS v2, via the Runway API | 1 credit (1¢) per 3 s | The same engine through the Runway key | [V] |
| Open: Seed-VC, the RVC ecosystem | $0 | The RVC ecosystem is built around voice models of real people. Use it only with a *designed* target | [K] |

**Shown off well.** A consenting human's comic timing, or a human's sung phrasing, in a voice that belongs to nobody.

**Risks.** The source performer must consent (and be paid). The target voice must be designed, never a real person's.

**Verdict: USE, NARROW.** The timing-read use is already in CASTING §6.3. The new use: a consenting singer's guide vocal for the finale song, converted into the machine's designed voice. That gives human phrasing with nobody's timbre; it's route A's variant (§3.3). Filler: the code-sung demo.

### 2.5 Dubbing and translation with voice preservation

**Today.** You upload a finished episode and get it back in another language, with each speaker's voice carried across, speakers separated automatically and, on some tools, the video re-lip-synced.

| Tool | Price | Notes | Tag |
|---|---|---|---|
| **ElevenLabs Dubbing v2** | **$2.20/min** (v1 $0.33/min, watermarked) | 90+ languages; up to 32 speakers; voice preservation by "cloning strength" (0–10, default 7); v2 has no in-app editor; free-tier dubs are watermarked | [V] |
| **HeyGen video translation** | Creator $29/mo · Pro $49 · Business $149 | "175 languages & dialects", with lip-sync and voice cloning | [V] |
| **sync.so** | $0.04–0.05 per second | Visual dubbing in 29 languages; "even animations" | [V] |
| `eleven_voice_dubbing` on Runway | 1 credit per 2 s | — | [V] |

**Shown off well.** The same actor, speaking Japanese, with the mouth matching.

**MR. MAS's advantage.** Our mouths are code ([`cast/talk.ts`](../../episodes/ep01/production/act4/art-needs-v5.md) visemes from alignment). A dub needs no visual lip-sync model: re-align the dubbed track and every pixel mouth re-times itself, so the pixel version is also the final.

**Risks.**
- "Voice preservation" is a clone of whoever voiced the original. For human actors, that needs the separate consent and pay CASTING §6.1 requires. For designed voices, it's fine.
- **RUMPT and every official need human dub actors.**
- Translated [V] quotes must keep their fidelity.

**Verdict: SUPPORT** (distribution dubs, and a nice proof of the pipeline). No diegetic use recommended: the obvious one, live translation in Ep2's voice-demo era, sits next to the "her" guardrail.

### 2.6 Lip sync and talking-head animation of drawn characters

**Today.** One still of any character, photoreal or cartoon, plus an audio file gives a talking or singing clip with blinks, head motion and gesture. Performance transfer moves a real actor's performance onto a drawing. Real-time, interactive versions exist.

| Tool | Price | Notes | Tag |
|---|---|---|---|
| **Runway Act-Two** · **GWM-1 Avatars / Runway Characters** | Act-Two 5 credits/s; Avatars 2 credits plus 2 credits per 6 s | Characters: "audio-driven interactive video … for arbitrary photorealistic or **stylized** characters", with lip sync and gesture | [V] |
| **Hedra** | Basic $20 · Pro $50 · Ultra $100 a month; commercial use on all plans | Image plus audio to a talking character | [V] |
| **sync.so** (Sync-3, lipsync-2-pro, react-1) | $0.04–0.05/s | Re-lip-syncs existing video | [V] |
| **HeyGen Avatar IV** | See §2.5 | Photo to avatar | [V] |
| **Wan-Animate-2** (Apache-2.0) · OmniHuman, Kling Avatar | Open / API | Motion and performance transfer | [V] (repo) · [K] |
| **Rhubarb Lip Sync** (programmatic) | Free | Audio to a mouth chart: A–F, plus G, H and X, "from classic 2D animation studios"; English PocketSphinx or a phonetic recognizer; TSV/XML/JSON output | [V] |

**Shown off well.** A still drawing sings a full verse with breath and a head tilt on the high note.

**Verdict: OUT for every character.** That's GENAI principle 4 and twelve-lines 11: "No character ever comes out of a model." The show's deepfake gags stay visibly drawn. **Programmatic route (already built):** `cast/talk.ts` visemes from forced alignment, with Rhubarb as an optional second aligner. If anything "sings" on screen in the finale, its mouth comes from the song's alignment, in code.

### 2.7 Sound effects (and video-to-audio)

**Today.** Text to 0.5–30 s effects, seamless loops, 48 kHz. Video models also produce synced sound with the picture.

| Tool | Price | Notes | Tag |
|---|---|---|---|
| **ElevenLabs Sound Effects** | **$0.12/min** | Up to 30 s; loop mode; 48 kHz WAV for non-looping effects. The use policy bans reselling SFX output "on a standalone basis" (as a library) | [V] |
| **Seed Audio** (Runway) | 0.25 credits/s | TTS plus SFX | [V] |
| **Stable Audio 3.0 Small SFX** (open weights) | $0 | Licensed-data claim | [V] |
| Native audio in Veo 3.1 / Kling 3.0 | Veo 3.1: 10–40 credits/s with or without audio (Runway), $0.40/s with audio (Gemini API). Kling $0.126/s with audio | Dialogue, SFX and ambience generated with the picture | [V] |
| MMAudio (CC-BY-NC) · HunyuanVideo-Foley | — | Video-to-audio. MMAudio is non-commercial | [K·GENAI] · [K] |

**Shown off well.** A clip whose own sound is truly synced to its physics, generated together.

**Verdict: USE, as GENAI §5.4 scopes it** (raw layers, re-pitched to F; identity sounds stay procedural). **New NARROW idea:** style-range §1.4's sound spine says that from Ep6 "the machine's clips carry their own sound through each phone's speaker". The honest source for *the machine's own sound* is the model's native audio. That means a narrow exception to GENAI principle 9 ("model audio is always off"): allowed only on SYNTH bezel clips of the machine's own output, from Ep6, band-limited through the device speaker, with no intelligible speech, and conformed to F. Filler: numpy SFX through the speaker EQ (RULING; [§6](#6-rulings-this-raises) R-C).

### 2.8 Video (text, image or video to video; first and last frame; restyle; extend)

**Today.** The GENAI plan covers this family in depth, and its register stands. Re-verified this session:

| Model (access) | Price as listed | Capability notes | Tag |
|---|---|---|---|
| **Runway API**: WAN3 · H3 Max · Gen-4.5 · Aleph 2 · Veo 3.1 · Hailuo3 · Seedance 2 / 2.5 · Grok Imagine 1.5 · Happyhorse 1.0 · Gemini Omni Flash | $0.01/credit. WAN3 5–20 cr/s (480p–1080p) · H3 Max 5–8 · Gen-4.5 12 · **Aleph 2 28 (56-credit minimum)** · Veo 3.1 10–40 · Hailuo3 10–15 · Seedance 2.5 20–68 plus input fees · Grok Imagine 1.5 10–29 · Gen-4 Turbo 5 · Multi-Shot 13–17 | Gen-4.5 and Aleph 2 deliver **ProRes, PNG sequences and HDR** (5 cr/s ProRes surcharge); PNG sequences feed `pixelize.py` losslessly | [V] |
| **Veo 3.1** (Gemini API) | Standard $0.40/s · Fast $0.10 (720p), $0.12 (1080p) · Lite $0.05 (720p) | T2V, I2V, **first and last frame**, **up to 3 reference images**, **extension to 148 s total (720p only)**, 4/6/8 s clips, native audio, SynthID, 2-day server retention | [V] |
| **Kling 3.0 Standard** (fal) | $0.084/s audio off | `end_image_url`, elements; an "o3" variant is listed | [V] |
| **Moonvalley Marey** | API waitlist; fal | "Trained on licensed data", "Commercially safe"; camera control, **motion transfer, pose transfer, trajectory control** | [V] |
| **Decart Lucy 2.5** | API | **Real-time** video-to-video transformation, "live at 30 FPS" | [V] |
| **Sora 2** | — | "The Sora 2 models and Videos API were shut down on September 24, 2026" | [V] → OUT |
| Luma Ray3.2 | — | Terms forbid altering watermarks | [K·GENAI] → OUT |
| **Wan 2.1 / 2.2** (open, Apache-2.0), Wan-Dancer, Wan-Animate-2 | Local or rented GPU | The open route (GENAI ask 9) | [V] (repos) |

**Shown off well.**
- A near-photoreal shot that holds up at full frame for 8 s.
- A **restyle** that turns our own animatic into another medium while keeping its timing.
- An **extend** that grows one shot into a continuous minute.
- A **first/last-frame** move that lands exactly on our end frame.

**Verdict: USE, as the GENAI plan and style-range scope it** (environments, elements, the machine's clips in bezels, J5). Nothing new is needed. Worth adding to the GENAI register:
1. **Gen-4.5 and Aleph 2's PNG-sequence delivery** for a lossless ingest.
2. **Veo's 148 s extension**, a candidate for one long machine take (for example 9.A's folder-city flight, or the Ep12 intro takeover), inside the bezel rule.
3. **Grok Imagine**, if 8.B's "each witness's own model" in-joke is kept: environment only, never labelled. It is zAI's model, and X7's controversy is about what it depicts, not about the tool, but the guardrails owner should see the pairing.

### 2.9 World models and interactive worlds

**Today.** A text prompt or a still becomes a world you move through in real time. The world is generated frame by frame as you look, holds for minutes, remembers recent changes, and takes "events" mid-walk (rain, a new object).

| Tool | Access | Notes | Tag |
|---|---|---|---|
| **Genie 3** (Google DeepMind) | "Project Genie", "an experimental research prototype" | "20-24 frames per second", "720p"; "largely consistent for several minutes", with memory of changes "for up to a minute"; **promptable world events**; weak on real places and text | [V] |
| **Runway GWM-1 Worlds** | API (early access) | Autoregressive on Gen-4.5; 720p; up to 2 min; controlled by camera pose and events | [V] |
| **World Labs Marble** | Web app | Text, image, video or 360° pano in; **editable, persistent 3D worlds**; exports for game engines and Blender; mesh and Gaussian-splat export pages | [V] |
| **HunyuanWorld** 1.0 → 1.1 WorldMirror → 1.5 WorldPlay (real time) → 2.0 (Apr 2026) | Open weights; H100-class, with a lite build for a 4090 | Text or image to an explorable world with mesh export. The licence's territory terms are [UNVERIFIED] | [V] |
| **Decart Oasis** · Odyssey · Matrix-Game | Various | Real-time interactive worlds | [V] (Oasis) · [K] |

**Shown off well.** A first-person walk through a room that assembles itself just ahead of the camera. Turn around, and the room behind you has quietly changed.

**Why MR. MAS has a home for it.** The machine's worlds are already a family ([style-range §1.4](../../bible/style-range.md#14-the-spine-the-machine-renders-at-the-fidelity-of-its-month)): Ep9, "agents act inside worlds"; Ep11, "a model trains its successor inside itself". A world model's defining flaw, **forgetting what's behind you**, is dread in this show's language.
- **Home:** Ep10 or Ep11, inside the monitor, the machine's own sandbox. THE INTERN "walks" a generated copy of a room Mas knows. When the camera turns back, one chair is empty that wasn't. The humans stay drawn: no people are generated, only the room.
- **Rules:** it must respect R9 (the pixel world never moves in perspective until 11.A) and the bezel rule (R13). A walk inside the monitor is the machine's medium in its own frame, so it respects both.

**Verdict: RULING (it rides on SYNTH, R6).**
- **Filler:** a three.js scene with a code "generate-ahead" front (the room resolves in a cone ahead of the camera and dissolves to GLYPH behind), plus a memory decay on tiles out of view.
- **Final:** a GWM Worlds or Genie capture conditioned on our own plate, recorded as video. Environment only, SYNTH in the bezel.
- **Risk:** world models add people and text uninvited, so prompt empty rooms and reject any take with a figure. Project Genie's commercial terms are [UNVERIFIED].

### 2.10 3D generation (meshes, Gaussian splats)

**Today.** One image gives a textured, PBR-ready mesh in seconds. Photos or video give a **Gaussian splat**: a photoreal, view-dependent 3D capture that renders in real time, including in three.js.

| Tool | Access · price | Notes | Tag |
|---|---|---|---|
| **TRELLIS.2** (Microsoft) | Open; **MIT**; needs an NVIDIA GPU with 24 GB+ on Linux | Image to GLB with PBR (base colour, roughness, metallic, opacity), up to 1536³ | [V] |
| **Meshy** | Free 100 credits/mo (**CC BY 4.0** outputs) · Pro 1,000 credits/mo ("you own all assets") | Text or image to 3D, texturing, auto-rigging; exports FBX, OBJ, USDZ, GLB, STL, `.blend` | [V] |
| Hunyuan3D, Tripo, Rodin, SAM 3D Objects | Various | Image to mesh | [K] |
| **Brush** (splat training) | Free; **Apache-2.0**; Linux; **AMD, Nvidia and Intel** GPUs via WebGPU | Trains splats from COLMAP or Nerfstudio data; live view while training | [V] |
| **Spark** (World Labs) | Free | "An advanced 3D Gaussian Splatting renderer for THREE.js": `.ply`, `.spz`, `.splat`, `.ksplat`, `.sogs`; splats mix with meshes; "programmable dynamic splat effects" | [V] (licence terms [UNVERIFIED]) |
| **Depth Anything 3** | Small and Base Apache-2.0 · Large and Giant CC BY-NC 4.0 | Multi-view depth, camera pose and **3D Gaussian prediction** from images | [V] |
| **Marble** | See §2.9 | Worlds exported as splats or meshes | [V] |

**Shown off well.** A real, messy object (linen, glass, candle wax) that you can orbit and that sparkles correctly as the camera moves. Or a splat *training live*: blurred points sharpening into a room.

**Why this is the best new fit for MR. MAS.** 12.A, THE RECONSTRUCTION, is "the model rebuilds the 2015 WOODROSE from every version the season has shown (Gerg's, Alyi's, Nole's airbrush, Mario's)". **Reconstruction from several views is literally what a Gaussian splat is.** The four versions are four views.
- Render our own Blender or three.js table set (objects only; no guests) from about 100 cameras.
- Train a splat with **Brush** on the Intel iGPU (local, Apache-2.0).
- Render it with **Spark** inside the scene we already use.
- The **training itself is the shot**: points, then blur, then learned objects. That's style-range's "point cloud → learned objects" done for real.

It needs no outside generator, has no likeness risk (the guests stay sprites with contact) and costs nothing. Mas's glass stays pixel, because it isn't in the capture: "the model learned everything at that table but him."

**Verdict.**
- **USE (splats):** a final-route candidate for 12.A, and optionally for 11.A's depth. Its **filler** is the existing three.js points (Prototype 3).
- **NARROW (generated meshes):** props and set dressing only (a cup, a plinth, a GPU). **Never a character or a caricature**, per twelve-lines 11.
- Meshy's Free plan outputs carry CC BY attribution, so use a paid plan or none.

### 2.11 Image generation and editing

**Today.** Photoreal and stylized stills with reliable text, multi-image reference and in-context editing that keeps a subject consistent. Vector (SVG) output exists.

| Tool | Price | Notes | Tag |
|---|---|---|---|
| **Gemini 3 Pro Image** ("Nano Banana Pro") · **Gemini 3.1 Flash Image** | $0.134 per 1K/2K image · $0.067 per 1K | Also on Runway at 20–40 credits | [V] |
| **GPT Image 2 / 2.5**, **Seedream 5 Pro/Lite**, Grok Imagine Image 2, Gen4 Image (via Runway) | 1–76 credits per image | One key covers them | [V] |
| **Recraft V4 / V4.1** | Paid plans: "full ownership and commercial rights"; Free: images "owned by Recraft", public, not commercial | Vector and SVG generation, inpaint, outpaint | [V] |
| **Retro Diffusion** | $0.03–0.18 per image | Pixel art with palette lock; **licence still unverified** | [K·GENAI] |
| Midjourney, FLUX.2, Qwen-Image-Edit | — | — | [K] |

**Shown off well.** A character sheet that stays on-model across twenty poses, or a scene edit that changes one object and nothing else.

**Verdict: SUPPORT, as GENAI §5.5 scopes it** (concept boards, REF drafts, plates). Never cast, never caricatures, never a face restyle (R5), and no legible text from a model on screen. Nothing new is recommended on screen: 4.F's paint wave is the month's *flawed* image look, and it stays code, because faces on the pictures are caricatures.

### 2.12 Depth, relighting and segmentation (compositing)

| Tool | Price | Use for us | Tag |
|---|---|---|---|
| **SAM 3** (Meta) | Open; SAM License; needs a CUDA GPU | Text- or exemplar-prompted masks and **video tracking**: masks for figures in generated plates (`--protect`) | [V] |
| **Depth Anything 3** (Small/Base Apache-2.0) | Free | Depth for occlusion and contact when pixel figures stand in a generated plate | [V] |
| **Beeble** (SwitchX, VFX Pass Generator) | Creator $16/mo · Pro $60/mo (billed annually) | Relight and replace; "PBR, depth & alpha"; "Every asset belongs to you … full commercial license" | [V] |
| Runway Ruby (SDR to HDR) | 20–40 cr/s | Not needed: our delivery is SDR, 1080p | [V] |

**Verdict: SUPPORT.** These make SYNTH and CONVERT plates sit under the pixel UI (contact, grade within a stop, masks). The engine's own layer and depth export (H6) comes first, because it is exact.

### 2.13 Motion capture from video

| Tool | Notes | Tag |
|---|---|---|
| **Move.ai** | Markerless; no public price ("Book A Demo") | [V] |
| **Moonvalley Marey** motion and pose transfer · **Wan-Animate-2** | A performance video drives a generated subject | [V] |
| Rokoko Vision, Autodesk Flow Studio, DeepMotion; open GVHMR, WHAM | Monocular video to a skeleton (FBX/BVH) | [K] |

**Shown off well.** A performer's real weight and timing retargeted onto a stylized figure.

**Verdict: RULING (style-range R11)**, default not used. The only acceptable form is a consenting performer's reference driving our own rig (the anime key animator's reference for 10.C; CLOD's stop-motion timing), never footage of the real person. Filler: hand-keyed poses.

### 2.14 Upscaling and frame interpolation

| Tool | Notes | Tag |
|---|---|---|
| **Topaz Video** (Starlight, Proteus, Iris; Apollo and Chronos interpolation to 120 fps) | Personal $39–59/mo; Pro $58–74; **no Linux** | [V] |
| Magnific video and image upscalers; Runway `enhance_frame_rate` | Via the Runway key | [V] |

**Verdict: OUT for pixel art** (they destroy the grid, and "held on 2s" is our grammar, as GENAI §5.1 already rules). **NARROW:** a SYNTH plate or a Blender still that has to fill a bezel larger than its source. Rarely needed, given 1080p delivery.

### 2.15 AI podcasts (two synthetic hosts discussing a document)

**Today.** You upload a document and get back a warm, overlapping two-host show that sounds like real radio, backchannels ("Right." "Exactly.") and all. Formats range from a deep dive to a debate, and listeners can interrupt with a question.

| Tool | Notes | Tag |
|---|---|---|
| **NotebookLM Audio Overviews** (the site now calls itself "Gemini Notebook") | "Deep Dive", "The Brief", "The Critique", "The Debate"; 80+ languages; **interactive mode** ("join a conversation and interact with the AI hosts"); downloadable audio | [V] |
| **Gemini 3.8 Flash TTS**, two speakers per request | Build our own two-hander from a script | [V] |
| ElevenLabs v3 dialogue, GenFM; open "notebook" clones | — | [K] |

**Shown off well.** A dense document becomes a cheerful nine-minute chat whose hosts are sure of themselves, charming, and slightly wrong.

**Why MR. MAS has a home for it.**
- **Ep3 (Aug–Dec 2024) is the podcast format's period-true window.** The Audio Overviews craze was Sep–Oct 2024 [K]. Mario's *Machines of Loving Grace* lands in the same window: Ep3 beat 89's own joke is "Fifteen thousand words." / "It has footnotes." The machine turns 15,000 words into a breezy two-host show that ends, "So basically? It ends well."
- It's a joke about **summarization as a medium**, not about the author. It also rhymes with G21 (ADELINA shreds his scrolls to three bullets) and with Ep12's G21 payoff ("the machine summarizes his last essay in one sentence, and it's correct").
- **C07, THE PODCAST CIRCUIT,** is still open ([recurring-gags §8](../../gags/recurring-gags.md)). The Ep12 payoff ("the model gives the same lowercase answer in all four studios at once") gets a second rung: by then the model is the host.

**Risks.**
- The hosts are fictional. Their voices are **designed from text**, never the real product's stock voices (trade dress), and the product gets a parody name from the naming registry.
- The script is written by the writers and tagged [INVENTED]. It must not misstate the essay beyond its tag (guardrails §3–4).

**Verdict: USE (new).** A device pass (P6 PODCAST, or audio on his phone), 20–40 s in scene, with the format's grammar written in.
- **Filler:** Kokoro, two stock packs not used by the cast, scripted backchannels.
- **Final:** ElevenLabs v3 or Gemini 3.8 TTS custom voices, designed from text.

### 2.16 AI avatars and influencers

| Tool | Notes | Tag |
|---|---|---|
| **HeyGen** (Avatar IV, 700+ stock avatars, photo avatars), **Runway Characters**, **Hedra** | Photoreal or stylized presenters from a photo, audio-driven and real-time | [V] |
| Synthesia, Captions; synthetic performers and AI anchors in the real world | — | [K] |

**Shown off well.** A presenter nobody can tell from a person.

**Verdict: OUT as picture.** The show satirizes this. Principle 4 and R5 keep YLLIT, the PAC's AI reporters and Ep1's anchor visibly drawn. **The honest exception is sound:** YLLIT is fictional *and* synthetic, so her speaking and singing voice may be designed from text (resembling no one, and never the real synthetic performer's voice). That makes her song the natural middle rung of the music ladder ([§4](#4-what-we-arent-considering-yet)).

### 2.17 AI-made ads

| Tool | Notes | Tag |
|---|---|---|
| **Runway Recipes**: "Product Ad", "Swap", "UGC"; Multi-Shot | 192–228 credits base plus per-second; Multi-Shot 13–17 cr/s | [V] |
| Veo, Kling, Seedance multi-shot spots; brand AI holiday ads (2024–25) | Real ads made largely with models | [K] |

**Shown off well.** A 30-second multi-shot spot with product continuity and ad gloss, made in an afternoon.

**Verdict: NARROW, and mostly already covered.** In-world ads already have owners: CLOD's clay ad (7.A), the P23 promo grade, the duck film (1.H), the sleigh stream (3.F). The one unclaimed idea is **the machine making its own maker's ad**, at the fidelity of its month: objects and environments only, in a bezel, no people. Only take it if a script already has an ad beat; no new beat should be invented for it.

### 2.18 Live code generation

**Today.** Coding agents write, run and fix real software in minutes. Live-coding tools turn code into music and visuals as it's typed (Strudel, TidalCycles, Hydra) [K].

**Shown off well.** Code types itself, and the thing it describes appears, runs and is right. Or it fails, and the failure is the joke.

**Why MR. MAS has a home for it.** The show *is* code (the engine, three.js, the OST engine). A moment where the machine writes the shot we're watching is **true**: the code on screen is the real code that renders the next frame. That makes it both verifiable and programmatic by nature.
- **Homes:** the TERMINAL register (8.F, 9.G); Ep12's credits gag "THE BALLROOM … finished overnight by agents. `BUILDING CODE: IT.`" (the ballroom assembles from its own visible source); the intro takeover (12.I).
- **In sound:** the Endgame's "the machine's orchestration takes over" could be literally live-coded, the OST engine's pattern text scrolling as it plays.

**Risks.** The "hacker typing" trope is corny. The code must be real, legible for a beat, and short. The "no legible text from a model" rule covers image and video models; this text is ours.

**Verdict: USE (new).** $0. The filler is the final.

### 2.19 Interactive and branching media

| Tool | Notes | Tag |
|---|---|---|
| World models (Genie 3, GWM Worlds), NotebookLM's interactive mode, voice agents (ElevenLabs Agents), Runway Characters | Real-time, viewer-driven media | [V] |
| Branching video on streaming platforms | Largely wound down [K]. YouTube has no branching [K] | [K] |

**Shown off well.** The viewer's choice changes the story, or the viewer talks to a character and it answers in character.

**Verdict: PARK** (outside the episodes; distribution is still open per overview §9).
- If ever: a static companion page, fenced like the title cards. THE PLAN with its blank step 4, or `define "win."` with scripted answers.
- **Never a live LLM playing THE INTERN or the Orb in public:** it could say things about real people that the guardrails forbid. The Orb is also non-verbal by canon.

### 2.20 Anything else notable

| Family | What it is | Verdict for us | Tag |
|---|---|---|---|
| **Provenance and watermarks** | C2PA signing (ElevenLabs `sign_with_c2pa`), SynthID in Veo and Lyria, detectors | **USE:** an idea is in §4 (the disclosure card as the Orb's own verification toast) | [V] |
| **Stem separation and cleanup** | Suno stems, ACE-Step stem extraction, ElevenLabs Voice Isolator ($0.12/min) | SUPPORT (live sessions, dialogue clean-up) | [V] |
| **Speech-to-text and alignment** | ElevenLabs Scribe v2 ($0.22/h); faster-whisper (already used) | SUPPORT: it drives subtitles, mouths and the dub re-time | [V] |
| **Image-to-music** | Lyria 3.5 takes up to 10 images | NARROW: the machine could "score its own montage" in route B of the song | [V] |
| **Real-time voice agents** | ElevenLabs Agents, speech engines | PARK (see §2.19) | [V] |
| **AI mastering, spatial upmix** | — | SUPPORT, optional | [K] |
| **Model critics** (video-understanding models reviewing an animatic) | — | SUPPORT; the production already uses agent critics | [K] |

---

## 3. The season finale's outro song

This section is the capability input for the song. If a separate song-design pass exists, it owns lyric, melody and placement; this section says what is possible, what it collides with and how to build it programmatic-first.

### 3.1 Why it isn't forced (the home is already built)

- **The slot exists.** Every episode already ends on MM-15, the knee's end-credits reprise "in that episode's colour" ([OST §2.1](../../../audio/ost/OST-BIBLE.md#21-the-knee-show-identity-locked)). Ep12's colour can be *sung*. The knee's whole eight notes are already licensed there, outside the story.
- **The picture exists.** "The endings montage now plays under the credits" ([ep12 flashbacks](../../episodes/ep12/flashbacks.md)): the lobby sign on ∞, every siren off "not by anyone's hand", the ballroom "finished overnight by agents", Mario's essay summarized "in one correct sentence". It's the machine's world after it picks a side, so the machine sings over it.
- **The thesis exists.** The OST's Endgame: "Last of all it plays Mas's tune on his felt piano, **better than he does**." The finale is PROPOSED to carry the season's first third (A♮ on `ours.`, OST §8 decision 1). A song in which the machine sings Mas's melody with words, and lands the third, is that thesis made audible.
- **The owner exists.** THE MACHINE, at the fidelity of its month (style-range §1.4). By Ep12's "????" the machine can do anything. The first perfect *picture* is J5; the first perfect *voice* is the credits.
- **The humans never render.** The singer is nobody. That matches "the humans never render" (style-range §1.4 item 6) and the voice guardrail at the same time.

### 3.2 The register (taste)

- **Played dead straight.** A sincere, beautiful, faintly chilling late-night ballad, in the show's palette: felt piano, open fifths, Harmon trumpet, brushes. It is not a novelty song, a recap song, a charity-single pastiche, or a parody of any genre's famous song. OST rule 1 applies: "the score is the thriller; the picture is the joke."
- **Lyrics** are written by the writers. They're original, in parody names only, touch nothing on the X list, and state no fact claim beyond the tags. They may lean on the finale's words (`define "win."`, `ours.`, "unclear which side"). **Singing a real Mas post verbatim** is a facts-owner call: it would put his [V] words in the machine's mouth.
- **One human in the mix, if M1 lands:** the live Harmon trumpet (GENAI ask 4) playing the knee as the obbligato. The human plays his melody, and the machine sings the words over it.

### 3.3 Three routes

| | **A. The engine writes, a model sings** | **B. The model writes from our lyrics** (the literal ask) | **C. The model covers our own demo** (recommended) |
|---|---|---|---|
| **What the model does** | Vocal only. Either a score-driven singer sings the engine's MIDI melody and lyric (§2.2), or a consenting human's guide vocal is converted into a designed voice (§2.4) | The whole song: a composition plan with our lyrics section by section, an optional **Finetune on 20–50 OST engine renders** (our own catalogue), and a genre-grammar prompt with no names | The whole performance, conditioned on our programmatic demo (engine instrumental plus code-sung guide vocal): ElevenLabs audio reference or inpainting from the uploaded demo, Suno "add vocals"/cover of our upload, or ACE-Step cover/repaint |
| **Melody control** | Exact, note for note | Loose. The engine's checks pick the takes | High: the demo carries melody, form and timing |
| **Passes the engine checks** (F home, 96 grid, the third, the knee) | By construction | Some takes | Most takes |
| **Authorship** | Engine plus writers; the model is a performer | Writers only; the model composes (copyright may not vest) | Engine plus writers; the model performs and arranges |
| **"Using a music model"?** | Partly (a singer model) | Fully | Fully, and it shows the model's range most honestly: same song, new performance |
| **Tools** | ACE Studio or Synthesizer V (RULING on licensed voicebanks); ElevenLabs Voice Changer | ElevenLabs Music v2.5 (+ Finetune, + inpainting); Lyria 3.5 ($0.08, no editing); Suno v6 (manual, capped downloads) | ElevenLabs v2.5 (audio reference, inpainting); Suno Pro/Premier (add vocals, cover, stems); ACE-Step 1.5 (MIT; local on the Intel XPU is untested, so budget cloud GPU hours) |
| **Generation cost** (≈ 50 takes of 3 min) | Tool subscription | ≈ $22 (ElevenLabs) · ≈ $4 (Lyria) · $24/mo (Suno Premier) | Same as B; ACE-Step $0 plus about $5–25 of GPU |

**Why C.** It is the GENAI pipeline's own logic: condition the model on our frame, let it add what code can't, and swap the layer. The programmatic demo is both the filler and the conditioning input, so nothing gets re-edited to fit a take. Route B stays as the bake-off's control ("what does the model do left alone?"). Route A is the fallback if every C take drifts off the melody.

### 3.4 The programmatic filler (first pass)

1. **The OST engine composes and renders it:** the melody (the knee as the chorus hook), harmony, form and stems, at 96 BPM in the Ep12 colour, to the credits' length. It goes through `analysis` like any cue.
2. **A code-sung guide vocal, "the machine's demo".** Kokoro speaks each lyric phrase in an uncast stock pack. The existing faster-whisper alignment cuts it into syllables. Each syllable is time-stretched to its note and re-pitched to the melody's F0 with a WORLD-style analysis and resynthesis vocoder (for example `pyworld`, MIT [K]), then doubled on the chip for the knee's notes. It will sound like a machine singing at a 2020 level. That is honest for a demo, and diegetically fine: it's the machine rehearsing.
3. **An optional mid-step:** OpenUtau (MIT) with a commercially licensed DiffSinger or NNSVS voicebank sings the same MIDI locally (voicebank licence check first).
4. **The picture** is the endings montage. If the lyrics show at all, they are code text in the machine's register (TERMINAL), never a karaoke bounce.

The final (C) replaces layer 2, and optionally the band, on the same stems, grid and lyric timing.

### 3.5 Rules it touches

| Rule | Status | What the song needs |
|---|---|---|
| **OST §6.10:** no generative-AI music models and no voices | Firm, in the bible's own words | A new, fenced exception, **M9** ([§6](#6-rulings-this-raises)) |
| **M8** (non-melodic beds and diegetic source music) | Pending; "the ban stands" | M9 is separate and narrower in place (one cue), wider in kind (melodic, vocal) |
| **OST §0 rule 4 and §2.1:** the knee whole only in the title and credits | Locked | The song lives in the credits, so it's compliant |
| **OST §0 rule 12 and §8 decision 1:** the third reserved for Ep12, A♮ on `ours.` | PROPOSED | Build two variants: modal if decision 1 fails, F major if it passes |
| **OST §0 rule 5:** 96 BPM | Guide | State BPM in the plan; reject off-grid takes |
| **Loudness:** featured −16 LUFS, album −14 LUFS-I | Guide | Standard mastering |
| **Guardrails §5:** no cloned voice; no artist names; music "in the spirit of", copying no melody | Firm | A designed voice that resembles nobody (blind panel, automatic reject); genre-grammar prompts; melody-similarity check |
| **The voice's owner** | — | **Not THE INTERN's or Mas's actor** unless that actor consents and is paid (CASTING §6.1 bars model training on their takes). Never an official's voice |
| **Disclosure** (GENAI §6) | The credit line says "No performances, faces or voices were generated" | Rewrite it: see R-E in §6 |
| **ElevenLabs Music terms:** sector clause | Legal read | If it's a no, use Lyria, Suno or ACE-Step |
| **Copyright and Content ID** | OST §8 decision 13 defaults to not registering | Keep that default; archive the provenance |

### 3.6 Test plan (once M9 and access exist)

- **Bake-off, about $60 cap:** route C × 3 tools × 5 takes; route B × 2 tools × 5 takes; route A × 1.
- **Automated gate:** the engine's `analysis` (F home, no stray A♮ before `ours.`, the grid, knee matching) and a melody-similarity check against OST §1.7.
- **Blind panel:** "does this voice sound like anyone?" Any match is an automatic reject. Also: "would you guess this was generated?"
- **Showrunner:** listens in picture, over the endings montage, against the programmatic demo.
- **Provenance:** a `provenance.json` per kept take, as for video.

---

## 4. What we aren't considering yet

These are new motivated homes, each tested against the owner rule (style-range §1.3) and the "only where it makes sense" note, and ranked by fit ÷ risk.

| # | Family | Where | Why it's motivated (the owner) | Filler now | Final later | Risk · verdict |
|---|---|---|---|---|---|---|
| **N1** | **The machine's songs, a three-rung ladder** | (a) *optional plant*, Ep2: 3 s of a spring-2024 AI jingle through a phone speaker, with that year's audible flaws (smeared consonants, a shimmer) [K: Suno v3 and Udio launched Mar–Apr 2024]. (b) **Ep7 #21, YLLIT's song** (Mar 2026; the real music video credited "18 real humans" [V per worldcast]). (c) **the Ep12 credits** (§3) | THE MACHINE at the fidelity of its month; YLLIT is synthetic, so a synthetic voice is honest. The ladder makes the finale *earned*: flawed, then polished and hollow, then beautiful and on his melody | Engine track plus the code-sung vocal (the flaws are code; YLLIT's hollowness is hard pitch quantization) | (a) and (b): a music model, deliberately generic for YLLIT; (c): route C | YLLIT's song must be original ([genai-candidates §8](../../production/genai-candidates.md)): no melody or lyric from the real one, and no imitation of the real performer's voice. **RULING (M9)** |
| **N2** | **The AI podcast** | **Ep3 #89**, Mario's essay → a two-host "deep dive". C07 gains a rung, and the Ep12 payoff gets its host | THE MACHINE's summary of THE BRANDS' words; period-true (Audio Overviews, fall 2024 [K]) | Kokoro two-hander, scripted | Designed voices (ElevenLabs v3 or Gemini 3.8 TTS) | Parody product name; hosts resemble no one; the script is [INVENTED] and fair to the essay. **USE** |
| **N3** | **Splat reconstruction** | **12.A** (and optionally 11.A's depth) | THE MACHINE's memory; the four versions are the four views | three.js points (Prototype 3) | Brush + Spark, local, from our own renders; the training progress is the shot | Objects only. **USE**, and $0 |
| **N4** | **Live code that really renders** | TERMINAL beats (8.F, 9.G); Ep12's `BUILDING CODE: IT.` ballroom; optionally 12.I | THE MACHINE authoring the show; true on its face | = final | = final | Corn (hacker-typing). Keep it short and real. **USE** |
| **N5** | **World-model walk that forgets** | Ep10 or Ep11, inside his monitor | THE MACHINE's sandbox; forgetting is dread | three.js generate-ahead front plus memory decay | GWM Worlds or Genie capture, environment only | Rides on SYNTH (R6); no figures. **RULING** |
| **N6** | **The machine's own sound** | Ep6 onward, the machine's clips in bezels (6.E and later, 8.B) | The sound spine (style-range §1.4) | numpy SFX through a speaker EQ | The video model's native audio, band-limited, no speech | Needs a principle 9 exception. **RULING** |
| **N7** | **The disclosure card as the Orb's toast** | The end credits, every episode | The Orb verifies; the show verifies itself. For example: `verified: human (performances).` `generated: some (listed).` plus a C2PA manifest on masters | Code | Code | Must still be plain and complete (the legal text beneath). Not a joke at the disclosure's expense. **USE** (credits owner) |
| **N8** | **A dubbed pilot** | Distribution, not diegetic | Proves the pipeline: every pixel mouth re-times itself from the dub | Subtitles | ElevenLabs Dubbing v2 on designed voices; human dub actors for officials; actors' consent for voice preservation | **SUPPORT** |
| **N9** | **Speech-to-speech singing** | Route A's variant for the finale | Human phrasing, nobody's timbre | The code-sung demo | A consenting singer's guide → a designed voice | **RULING** (with M9) |
| **N10** | **The machine scores its own montage** | Route B's option: Lyria 3.5 with 10 frames of the endings montage as input | The machine composes from the images it made | Engine | Lyria 3.5 | A curiosity; only if route B wins. **NARROW** |

**Considered and not recommended:** a talking or singing drawn character from a lip-sync model (principle 4); an AI anchor or avatar as picture (R5); a restyled face for 4.F (R5); a live INTERN chatbot (guardrail risk, canon); a mocap dance in the credits (R11, and corn); upscaling pixel art (the grid); a brand-new ad beat just to show a model making ads (forced).

---

## 5. The season's AI-media calendar

The spine rule is that the machine renders at the fidelity of its month. This table lines each family's real milestone up with the episode window it falls in, so every showcase can be period-true. Dates are [K] unless marked.

| Ep · window | What the machines could do in that window (families) | Where the show already uses it | New in this file |
|---|---|---|---|
| 1 · Nov 2022 → Dec 2023 | Chat; cloned-voice hearings and viral voice fakes (2023); early image models | 1.F's cloned voice (a human performer), 1.I the copy, 1.H the duck film | — |
| 2 · Jan → Aug 2024 | The first minute-long video previews (Feb); **song models with vocals go public (Mar–Apr)**; real-time voice demos (May) | 2.A the silent mammoth | N1(a), the 3 s flawed jingle, optional |
| 3 · Aug → Dec 2024 | **Two-host AI podcasts from documents (Sep)**; public video (Dec); AI-made holiday ads (Nov) | 3.F the sleigh | **N2, the podcast** |
| 4 · Jan → Apr 2025 | The image craze (Mar) | 4.F | — |
| 5 · May → Aug 2025 | **Video with native sound (May)**; AI-made TV ads (Jun); **real-time world models (Aug)**; music APIs with licensed-content deals | 5.B, 5.J | — |
| 6 · Sep → Dec 2025 | **A video app with sound and cameos (Sep 30)**; synthetic performers (YLLIT, late Sep); label settlements with song models (Oct–Nov); editable 3D worlds (Nov); commercial world models (Dec) | 6.E CCTV; YLLIT's debut | N6, the machine's own sound, begins |
| 7 · Jan → Mar 2026 | Public world-model prototypes (Jan); **YLLIT's music video (Mar)** | 7.A, J2, YLLIT's song (Ep7 #21) | **N1(b)** |
| 8 · Apr → Jun 2026 | Every lab has image and video models | 8.B the Rashomon renders | Grok Imagine's optional in-joke (§2.8) |
| 9 · Jul → Sep 24, 2026 | Agents in worlds; the video API shutdown (Sep 24) [V] | 9.A the folder city; J3 | N4 (TERMINAL) |
| 10–11 · "OCT 2026?" → "2027??" | Speculative: worlds a model walks, and forgets | 10.C, 11.A | **N5** |
| 12 · "????" | Anything | 12.A, J5, J6, 12.K | **N3** (splats), **N4** (the ballroom), **§3's song** |

---

## 6. Rulings this raises

None of these changes a file. Each is for the showrunner, routed through the named owner.

| # | Ruling | Owner | Recommendation | Default until decided |
|---|---|---|---|---|
| **M9** | **An exception to OST §6.10 for the Ep12 credits song**, and optionally "the machine's songs" (N1: YLLIT in Ep7, an Ep2 plant) | Showrunner; the OST owner writes it in | **Yes, as asked** ("only for the season finale"), fenced to: the credits; a designed voice that resembles nobody; human-written lyrics; engine-composed melody (route C); disclosure; `analysis` checks. Extend it to N1(a) and (b) only if the showrunner wants the ladder. The note said "only for the season finale", so the default is Ep12 alone | Ban stands; the code-sung demo ships |
| R-A | Licensed singing voicebanks (a consenting, paid real singer's voice model), as in §2.2 | Showrunner + guardrails | Allow only with documented consent and compensation, never a soundalike; prefer designed voices | Not used |
| R-B | Legal read of ElevenLabs Music's "political advocacy … or other political causes" customer clause for a political satire | Showrunner (counsel) | Ask before any ElevenLabs Music spend | Use Lyria, Suno or ACE-Step for M9 tests |
| R-C | A narrow exception to GENAI principle 9 (model audio off): native audio allowed only on SYNTH bezel clips of the machine's own output from Ep6, band-limited, no speech (N6) | Showrunner + GENAI owner | Yes, after SYNTH (R6) | Model audio off |
| R-D | The AI podcast in Ep3 (N2): a designed-voice two-hander in a device pass | Ep3 writer + showrunner | Yes; parody product name from the naming registry | Not written |
| R-E | **Credit-line wording.** GENAI §6's draft says "No performances, faces or voices were generated", which becomes false if M9, designed voices or N2 ship | Credits owner | List what was generated by family (motion, sound layers, designed voices, the credits song's vocal) and keep "No faces or performances of real people were generated", plus N7's toast | The current draft stands while nothing ships |
| R-F | Voice-preserving dubs of human actors (N8) | Casting + showrunner | Only with separate consent and pay in the contract | No dubs |

---

## 7. Handoffs, and how to pick this up

**What changed and why.** This is a new research file answering the 2026-09-26 note. It edits no other file.

**Handoffs** (the owners edit their own files):

| To | What |
|---|---|
| **OST owner** (`audio/ost/OST-BIBLE.md`) | M9's wording in §6.10 and §8 if it's approved; MM-15's Ep12 colour as the song; the code-sung vocal as a new engine module (`engine/sing`?: Kokoro phrases → alignment → per-note time-stretch and WORLD re-pitch); an `analysis` melody-similarity check |
| **GENAI owner** (`show/production/GENAI-UPGRADE-PLAN.md`) | §5.3: Lyria 3.5 is now $0.08/song in the Gemini API with ownership terms [V]; MiniMax is out [V]; ElevenLabs v2.5 adds inpainting, audio reference, Finetunes and C2PA, plus the sector clause (R-B); Suno's terms are updated. §5.1: PNG-sequence delivery (Gen-4.5, Aleph 2) and Veo's 148 s extension. R-C. R-E |
| **Style-range owner** | N3 as 12.A's final route (Brush + Spark); N5 as a candidate for Ep10–11; N4 in TERMINAL; §2.8's Grok Imagine note for 8.B |
| **Ep3 writer** | N2 at beat 89 (the podcast), if R-D is yes |
| **Ep7 writer, audio** | YLLIT's song as N1(b): original melody and lyric, a designed voice, deliberately generic |
| **Ep12 writer, credits owner** | §3's slot, register and lyric notes; N7's disclosure toast; `BUILDING CODE: IT.` as N4 |
| **Casting** | The finale singer's voice (designed, resembling nobody); CASTING §6.1's consent clause extended to singing and dubbing |
| **Guardrails owner** | R-A; the "impressions" prompt ban (OpenAI TTS offers it); Grok Imagine's pairing with X7 (§2.8) |

**How to re-run this census.** Re-fetch the §8 pages. Prices, terms and model names move monthly (two vendors changed access in the last five weeks). Re-verify every [K] before any spend.

**Measured vs needs a human.** Nothing was generated or heard. Every quality statement is the vendor's claim or [K]. The song, the podcast voices and every splat test need ears and eyes. The first measurable step is the code-sung demo (§3.4), which needs no ruling and no spend.

**Open issues.**
- Udio's current state [UNVERIFIED].
- Synthesizer V's page returned 403.
- The licence terms for Spark, the HunyuanWorld territory clause and Project Genie's commercial use are [UNVERIFIED].
- ACE-Step on this Intel iGPU is untested.
- Suno's "custom models" are undocumented.

---

## 8. Sources opened this session

All fetched 2026-09-26. Each is [V] where cited above.

**Music and singing**
- ElevenLabs Music capabilities: https://elevenlabs.io/docs/overview/capabilities/music
- ElevenLabs Music compose API: https://elevenlabs.io/docs/api-reference/music/compose
- ElevenLabs Music Finetunes: https://elevenlabs.io/docs/eleven-creative/products/music/finetunes.md
- ElevenLabs Music inpainting: https://elevenlabs.io/docs/eleven-api/guides/how-to/music/inpainting.md
- ElevenLabs Audio Reference: https://elevenlabs.io/docs/help-center/product/core-capabilities/music/what-is-audio-reference.md
- ElevenLabs Music Terms (26 May 2026): https://elevenlabs.io/music-terms
- Suno pricing: https://suno.com/pricing · Suno terms (10 Aug 2026): https://suno.com/terms · Suno Studio: https://suno.com/studio
- Lyria models: https://deepmind.google/models/lyria/ · Lyria in the Gemini API: https://ai.google.dev/gemini-api/docs/music-generation
- ACE-Step 1.5: https://github.com/ace-step/ACE-Step-1.5
- Stable Audio: https://stability.ai/stable-audio
- MiniMax music: https://platform.minimax.io/docs/guides/music-generation
- ACE Studio: https://acestudio.ai/ · OpenUtau: https://github.com/stakira/OpenUtau
- Udio (no content returned): https://www.udio.com/ · Synthesizer V (403): https://dreamtonics.com/synthesizerv/

**Voice, dubbing, lip sync**
- ElevenLabs API pricing: https://elevenlabs.io/pricing/api · plans: https://elevenlabs.io/pricing
- ElevenLabs use policy (17 Aug 2026): https://elevenlabs.io/use-policy
- ElevenLabs Voice Design: https://elevenlabs.io/docs/eleven-creative/voices/voice-design.md
- ElevenLabs Dubbing: https://elevenlabs.io/docs/overview/capabilities/dubbing
- ElevenLabs Sound Effects: https://elevenlabs.io/docs/overview/capabilities/sound-effects
- ElevenLabs docs index: https://elevenlabs.io/docs/llms.txt
- Gemini speech generation: https://ai.google.dev/gemini-api/docs/speech-generation
- OpenAI TTS: https://developers.openai.com/api/docs/guides/text-to-speech
- NotebookLM Audio Overviews help: https://support.google.com/notebooklm/answer/16212820
- HeyGen: https://www.heygen.com/pricing · Hedra: https://www.hedra.com/pricing · sync.so: https://sync.so/pricing
- Rhubarb Lip Sync: https://github.com/DanielSWolf/rhubarb-lip-sync

**Video, worlds, 3D, compositing**
- Runway API models: https://docs.dev.runwayml.com/guides/models/ · pricing: https://docs.dev.runwayml.com/guides/pricing/
- Runway GWM-1: https://runway.com/research/introducing-runway-gwm-1
- Gemini API Veo: https://ai.google.dev/gemini-api/docs/veo · Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing · Gemini API terms (23 Mar 2026): https://ai.google.dev/gemini-api/terms
- The Sora shutdown banner: https://developers.openai.com/api/docs/guides/video-generation
- Kling 3.0 on fal: https://fal.ai/models/fal-ai/kling-video/v3/standard/image-to-video
- Moonvalley: https://www.moonvalley.com/ · Decart: https://decart.ai/ · Wan-Video: https://github.com/Wan-Video
- Genie: https://deepmind.google/models/genie/ · World Labs: https://www.worldlabs.ai/ and https://docs.worldlabs.ai/ · Spark: https://sparkjs.dev/
- Brush: https://github.com/ArthurBrussee/brush · HunyuanWorld: https://github.com/Tencent-Hunyuan/HunyuanWorld-1.0
- TRELLIS.2: https://github.com/microsoft/TRELLIS.2 · Meshy: https://www.meshy.ai/pricing
- SAM 3: https://github.com/facebookresearch/sam3 · Depth Anything 3: https://github.com/ByteDance-Seed/Depth-Anything-3
- Beeble: https://beeble.ai/ · Topaz Video: https://www.topazlabs.com/topaz-video · Move.ai: https://www.move.ai/
- Recraft: https://www.recraft.ai/pricing

**Project files** are linked in the header.
