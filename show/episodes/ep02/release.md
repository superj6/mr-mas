# ep02 · release (YouTube)

**The final film:** `out/ep02/v1/ep02-v1.mp4`, 23:31.00, assembled at commit fb0efde. Its md5 and the checks are in [production/v1/DELIVERY.md](production/v1/DELIVERY.md); read that before watching.

**Published:** not yet. The showrunner publishes (LEARNINGS M5). Add the link here and in [EPISODES.md](../../../EPISODES.md). This file sits beside Ep1's `release.md`; LEARNINGS M5 had named `production/v1/release.md`.

**Nothing here may spoil the episode:** not the title, the thumbnails or the description. Alyi's departure and his posts, the empty reserved seat, the white room and its slot, the `WHERE IS ALYI?` flyers, the paused voice, the exit papers and everything after an act's turn stay out of all three. **Nothing may spoil Ep1 either:** no firing, no return and no `DAYS SINCE SOMEONE TRIED TO FIRE MAS` sign.

## Title

MR. MAS — Ep. 2: her.wav | an AI-made pixel parody of the AI race

## Thumbnail

`out/ep02/v1/thumbnails/thumb-5-orb.png` is the primary. It uses Ep1's thumb-5 design: the intro's title-sequence frame 4.59 s in (film f1430, 0:59.58), with Mas, the Orb and the curve, a blank post box, "unclear which side." large, and `ep1.1_her.wav` cut from the episode's own card (f2087). The other four spoiler-free options are in the same folder:

| File | Frame | What it shows | Caption |
|---|---|---|---|
| `thumb-1-mammoth.png` | the cold open, 1.02, f240 (0:10.00) | Selbeep beside the wall screen, the near-photoreal mammoth in it and its pixel foot stepping out over the lip. The DAYS SINCE sign is not in this setup | "it understands physics." |
| `thumb-2-seance.png` | Act One, 4.02's wide, f2200 (1:31.67) | the candlelit table: hands joined, the letter board, Mas with his water at the head, the Orb above | "is there anyone here… from 2016." |
| `thumb-3-knobs.png` | Act One, 4.22, f5198 (3:36.58) | the Go board (`MAR 2016 · GAME 2 · MOVE 37`) and the knob wall turning cyan with its own games | "nobody wrote it." |
| `thumb-4-demo.png` | Act Two, 11.04's wide, f14700 (10:12.50) | the demo stage: Rima in her spot, the chatbot's big face on the screen, `LIVE` (before the blimp) | "is it ready?" |

- **Ep1's recipe, unchanged:** the captions are set in VT323, in Mas's cyan for his own lines and in cream for anyone else's (the V.O. band's colour is his). The tag `MR. MAS · EP. 2` is set in Silkscreen. Every image is a single frame decoded from the final film.
- **Checked by eye** at 1280 × 720 and at 320 × 180. Every caption reads at the small size. None of them shows a real person's likeness, Alyi, the seat, a flyer, the white room or a turn.

## Description

```
MR. MAS is a parody thriller about the AI race. It's spring 2024. A co-founder is suing, a rival has a keynote on the calendar, and Mas Manalt has a launch, a podcast and a plan for each. People are harder to schedule.

Also in this one: the 2016 Go move nobody wrote, and what "learned, not programmed" actually means.

Everything was made by Claude Opus 5.5 working in Claude Code: script, pixel art, animation, score, sound design, casting and edit. Direction and prompts are by jgon.
- Voices are synthetic library voices (Kokoro-82M, ElevenLabs), and none are cloned.
- The near-photoreal shots show objects and one mammoth (a Veo 3.1 Fast clip, via Runway). The 3D is rendered in Blender.
- Piano samples: Salamander Grand Piano by Alexander Holm (CC BY 3.0).

00:00 Cold open
00:55 Intro
01:27 Act One · the séance
07:31 Act Two · stage right
12:10 Act Three · leave them up
17:30 Act Four · as a guest
22:39 Tag · august
23:16 Outro · credits

Build the next episode. The whole show is open: the pipeline, the show bible, and outlines for Episodes 3–12: https://github.com/superj6/mr-mas
- Start with README.md and the show bible.
- Fork it, make an episode, and open a PR.
- The guardrails apply: parody names, no cloned voices, no photoreal likenesses of real people.
- Code is MIT, and story and art are CC BY-SA 4.0.

A work of parody and commentary. Names are changed and events are dramatized.

#AI #animation #pixelart #parody
```

**What changed from the draft, and why:**
- **Voices.** Mario speaks on his Kokoro-82M takes (`am_liam`), and the intro's sung layers are Kokoro voicepacks (`audio/intro/vocals/README.md`), so both engines are named, as in Ep1.
- **Inserts.** The cold open's insert is a woolly mammoth, an animal, so "objects only" was not true. The source is named as D-100 and assembly.md §8.2 ask, since the outro no longer names tools: `out/ep02/v1/runway/clips/a1-veo31fast-t2v-mammoth-s215.provenance.json` (no person, face or hand) and manifest §4 2.H (Blender; nobody in the 3D).
- **Salamander.** Act Three's score plays the Salamander Grand Piano (`e02-10-the-bridge`). Its licence is CC BY 3.0, and `audio/samples/LICENSES.md` says "attribution required in credits". The film's credits don't carry it, so the description has to.
- **Checked and left as drafted:** "spring 2024" (the acts run Mar 5 to Jun 19; the cold open is February and the tag August); "a co-founder" (Nole, ex-co-chair); the repo URL (`git remote`); outlines for Episodes 3–12 (each folder has `outline.md`, and Ep3 has a full script); the licences (`LICENSE`, `LICENSE-CONTENT.md`).

**Open choices for the showrunner:**
- **The credit name:** jgon, superj6, or none.
- **The thumbnail:** thumb-5-orb keeps the series look. `thumb-4-demo` shows the demo's `VOICE 5` badge. That is the voice paused later, but the badge says nothing about the pause. For no link at all, use another option.
- **"People are harder to schedule."** This is a soft tease about people, in the spirit of Ep1's "Mostly." For zero hints, end the paragraph at "a plan for each."
- **The chapter subtitles** are the act titles, already checked under M1 (D-16, D-45, D-97). "leave them up" is Mas's line in Act Three's first minute and names no outcome. For zero hints, use just "Act One" to "Act Four". YouTube needs chapters of at least 10 s, so the 2 s card (01:25) is folded into the intro, as in Ep1.
- **The tools by name:** Claude Code, ElevenLabs, Kokoro-82M, Veo via Runway and Blender are named. To name the rest, add "Made with Remotion and FFmpeg." On-screen tool chips were cut from the outro (D-100), pending OUTRO-PROPOSALS §10.
- **The outro's voice-cast page** (23:23:18, 5.5 s): keep it, or move the cast into the description and end the outro on page 1. That would be a timing change for the outro's lock and score (back to Ep1's 10.1 s).
