# MR. MAS · Outro proposals (five, for comparison)

> **Chosen: B (2026-09-27).** The showrunner: "i liked the orb outro". It's rebuilt as Ep1's final outro, `out/ep01/outro/outro-b-v3.mp4` (9.375 s to the cut, 10.125 s with the fifth's release, −16 LUFS). It has no band, terms line or pointer. The toast reads `mr. mas · ep1.0_research_preview.md` / `art · script · music · voices · edit: opus 5.5` / `prompt: jgon` / `viewer: human ✓`, and the moth lands on the Orb. How it was built and how to re-render it: `studio/src/dev/outro/b/README.md`. The rest of this file is the comparison as it stood.

> **Update (2026-09-27, [SHOWRUNNER-NOTES](SHOWRUNNER-NOTES.md) notes 3 and 4):** no terms line, no disclaimer and no pointer to a notice on screen, and the credit line is **by Opus 5.5**. The credits pane stays minimal: the title and filename, plus "by Opus 5.5". Any other rows (music, voices, the AI-tool disclosure) are optional, the showrunner's call. If a notice is ever needed for publishing, it lives only in the platform's description field, off screen. §1.1 and the credit text written out in §2–§6 are updated. Elsewhere, the terms line, the pointer, their read times and each proposal's Ep12 notice describe the briefs and the mock-ups as built; the code in `studio/src/dev/outro/` and the renders in `out/lookdev/outro/` still carry the old text. The terms' read time set several lengths (A grew to 11.875 s so its card could be read; B, C and E fell short of the 8.2 s the terms and pointer needed), so each proposal can now run shorter. They aren't redesigned here. **Whichever proposal is chosen will be rebuilt with the new text.**
>
> **Status: PROPOSALS, 2026-09-26; mock-ups built 2026-09-27 ([§7a](#7a-mock-up-results)).** Nothing here is decided. Five ways to close every episode, written so they can be built as moving mock-ups and compared side by side. Whichever one the showrunner picks replaces the 43 s credits placeholder ([pacing-model §3.1](../format/pacing-model.md#31-the-clock)).
>
> **The ask (verbatim):**
> - "i do think we should have some form of short outro at least as brief credit pane or similar. let's think about what makes sense"
> - "i was thinking the outro should be shorter than the intro probably. but let's create a few proposals with some sort of visual outlines for comparison"
>
> **What that means here:** every proposal is **6–15 s**, shorter than the 30 s intro, and every one still carries a credits pane. *(As drafted, each also carried the AI-tool disclosure and a one-line disclaimer pointing to the full notice and sources; since 2026-09-27 the disclosure is optional and the disclaimer and pointer are cut.)* The 90-word legal text ([overview §8](../bible/overview.md#8-disclaimer-cards)) can't be read in that time, so it moves off screen (§1.1). **Legal review of that move is pending.**
>
> **Read for this:** [SHOWRUNNER-NOTES](SHOWRUNNER-NOTES.md) note 5 (the lead's "closing session", now proposal A) · [intro SCRIPT](../intro/SCRIPT.md) §3.9–3.10 and §8 · the built bookend (`studio/src/dev/mfinale/bookend.ts`) · [overview §8](../bible/overview.md#8-disclaimer-cards) · [pacing-model §3.1, §3.3](../format/pacing-model.md) · [OST-BIBLE](../../audio/ost/OST-BIBLE.md) §0, §2.1, §2.4, §4 (MM-15) · [recurring-gags](../gags/recurring-gags.md) G01, G07, G09 · [style-range](../bible/style-range.md) §1.4, §3.4 (the title cards as files) · [GENAI-UPGRADE-PLAN](GENAI-UPGRADE-PLAN.md) §1.8 and §6 (disclosure) · [guardrails §5](../bible/guardrails.md#5-legal-hygiene) · Ep1 [script](../episodes/ep01/script.md) (the tag, the button, the moth stinger). `elevation-ideas.md` and `ai-media-range.md` weren't written yet when this was drafted; §1.4 and §1.5 are written so they can drop into them.
>
> **The visual outline** for comparing them is `out/lookdev/outro/outro-proposals-timeline.png` (all five on the 96 BPM grid against the intro, §0). The five moving mock-ups land beside it in `out/lookdev/outro/<id>/` as the builders finish them (§9).

**Contents:** [0. At a glance](#0-at-a-glance) · [1. What every proposal carries](#1-what-every-proposal-carries) · [2. A · The closing session](#2-a--the-closing-session-125-s) · [3. B · The Orb's verdict](#3-b--the-orbs-verdict-75-s) · [4. C · After hours (DAYS SINCE)](#4-c--after-hours-days-since-10-s) · [5. D · The curve](#5-d--the-curve-15-s) · [6. E · File closed](#6-e--file-closed-625-s) · [7. Comparison](#7-comparison) · [7a. Mock-up results](#7a-mock-up-results) · [8. Recommendation](#8-recommendation) · [9. Builder briefs](#9-builder-briefs) · [10. Open questions](#10-open-questions) · [11. Handoff](#11-handoff)

---

## 0. At a glance

> **These are the briefs' lengths.** The built lengths differ (A 11.875 s, B 7.5 s, C 8 s, D 11.25 s, E 7.5 s): see [§7a](#7a-mock-up-results) and `out/lookdev/outro/outro-compare-sheet.png`.

| | Proposal | Length | Where we are | The credits live in | Ends on |
|---|---|---|---|---|---|
| **E** | **File closed** | **6.25 s** (2.5 bars) | The episode's own file, in its own file type | The file's own credits convention (front matter, EXIF, an email footer, a log line…) | The window closes; the cursor at the intro's first-frame spot |
| **B** | **The Orb's verdict** | **7.5 s** (3 bars) | The Orb, close, on black | Its scan toast | The Orb's verdict on **the viewer**, which drifts with the season |
| **C** | **After hours** | **10 s** (4 bars) | NopeAI's lobby at night | The building directory under the DAYS SINCE sign | The sign's new count |
| **A** | **The closing session** | **12.5 s** (5 bars) | Mas's monitor, then his dark room | A session log on his screen | The log clears; the cursor at the loop point |
| **D** | **The curve** | **15 s** (6 bars) | The cyan thread on a dark chart | Eight plates riding the knee | A hard cut to the intro's own first frame |

Every one can take the optional stinger (≤ 5 s, a callback, never plot). The intro is 30 s (12 bars); the longest proposal is half of it.

**The comparison strip** (`out/lookdev/outro/outro-proposals-timeline.png`) draws the same thing to scale. In text:

```
bars (2.5 s each)  1     2     3     4     5     6     7     8     9    10    11    12
intro   30 s       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
E       6.25 s     [knee][hold ][x]                       + stinger ≤ 2 bars after the close
B       7.5 s      [scan][toast][verdict]                 + stinger ≤ 2 bars after
C       10 s       [wall][plates][hold ][lights]          + stinger inside (the moth goes to the light)
A       12.5 s     [pull][log  ][log  ][hold ][log out]   + stinger inside bar 4
D       15 s       [lift][flat ······ ][leap ······ ][f0] + stinger rides the line
terms on screen    E 6.25 s · B 7.5 s · C 10 s · A 8.6 s · D 11.25 s  (every one ≥ 5 s)
the knee (whole)   E 1 bar · B 1 bar · C 1 bar · A 1 bar + answer · D 4 bars (augmented)
```

**What the fixed overhead becomes:** the intro (0:30), the filename card (0:02) and the outro (0:06–0:15) make 0:38–0:47, down from 1:15. That gives 28–37 s back to story in a 22-minute episode, and more in the 11- and 7-minute formats, whose credits slots (0:28 and 0:23) shrink the same way.

---

## 1. What every proposal carries

### 1.1 The text package

The same words in every proposal. Only the surface that carries them changes.

**The credits** (showrunner, 2026-09-27: "outro should say by opus 5.5"; [SHOWRUNNER-NOTES](SHOWRUNNER-NOTES.md) note 4). The pane stays minimal: the title and filename, plus the credit line. `by Opus 5.5` replaces the drafts' `(creator)` placeholder and their "created by" and "written" rows.

| Field | Ep1 value | Changes when |
|---|---|---|
| Title | `MR. MAS` · the episode's filename, e.g. `ep1.0_research_preview.md` | Every episode |
| Credit | `by Opus 5.5` | Never, unless the showrunner changes it |
| Picture · music | *Optional, showrunner's call:* `pixel art and original score, rendered in code` | When an outside layer ships in that episode (a video-model plate, a Blender object) |
| Voices | *Optional, showrunner's call:* `synthetic, designed from text · none cloned` | When human performers replace the scratch voices |
| AI tools | *Optional, showrunner's call:* `used throughout` | Every episode, from its provenance manifests |

**The AI-tool disclosure** is the last two rows (optional, the showrunner's call). If it's used, it's **exact per episode**. It's written from that episode's `provenance.json` manifests ([GENAI plan §1.8](GENAI-UPGRADE-PLAN.md)). When an insert used a video model, the line says so in the plan's words ("Select environmental motion generated with AI video tools and redrawn in pixel by the production. No performances, faces or voices were generated."), and the description lists the tools by name. **On screen it names no product.** That keeps the picture to parody names only; whether legal wants the tools named on screen is open (§10).

**No terms line and no pointer** (showrunner, 2026-09-27; [SHOWRUNNER-NOTES](SHOWRUNNER-NOTES.md) note 3). The drafts carried a one-line parody notice ("the terms line") and, under it, a pointer to the full notice and sources in the description. Both are cut, and nothing on screen points to a notice. **If a notice is ever needed for publishing, it lives only in the platform's description field, off screen.** The rules that held the terms and the pointer on screen (≥ 5 s unmoving, never covered, never in-world) go with them. The credits keep the legibility rule: 7-px face or larger, paper on dark, never below the 80% white ceiling.

**Where the full text lives (off screen):**

| Where | What | Why |
|---|---|---|
| **The episode description** (the platform's text field) | The full 90-word notice if one is needed, the credits in full, the AI disclosure with tools named, and a link to the receipts | The only home for a notice; it travels with the video, and it can be corrected after release |
| **The receipts page** (per episode, on the show's page once it exists) | Each episode's `facts.md` turned public: every real line and event with its source and its tag ([P] [V] [H] [K] [INVENTED]) | It's what "sources" means, and it's the proof of care the elevation note asks for |
| **File metadata** | The optional C2PA manifest ([GENAI plan §6](GENAI-UPGRADE-PLAN.md)) | It survives re-uploads that drop the description |

*Cut 2026-09-27 (a notice lives only in the description):* the 20 s legal-card alternate (the 90-word card as a slate after the outro), the full notice on screen in Ep12's long credits, and the notice's copy in the MP4's description tag.

**Legal review is pending** for all of this; §10 lists the questions.

**The font.** The shared 7-px face (`studio/src/shared/pixel/font.ts`) has no `·`, `‹ ›`, `#`, `&`, `@`, `|` or `<`. Builders draw those locally (a 1-px dot for `·`, their own `#` for raw markdown). They don't edit the shared font.

### 1.2 The music frame

- **The knee plays whole** (F F F F G A♭ C F) **once, as that episode's credits reprise, in that episode's colour** (OST-BIBLE §2.1, MM-15). That's the only whole knee an episode has. **Chip doubles it** (OST rule 3). It's swung when the people own the frame (A, C, D, E) and straight when the machine does (B).
- **It ends on the chord with no third:** the open fifth F–C, or the title's quartal stack C–F–B♭–E♭ over F with G on top. No A♮ over F before Ep12 (OST rule 12).
- **A complete phrase**, never a fragment of a second or two (flow note 17, OST rule 5): the shortest proposal still plays the whole knee and lets its chord ring.
- **Loudness:** featured, −16 LUFS on the music alone; peaks ≤ −1 dBTP.
- **SFX own the interface:** key taps, the Orb's chime and servo, the plate clacks, the close click. The score leaves them room.
- **MM-15 becomes twelve short colours** (2.5–6 bars each, depending on the proposal) plus its 60 s album version.

**The reprise colour, per episode** (a proposal for the OST owner: each is drawn from the episode's own room colours in OST-BIBLE §4, and no two sound alike):

| Ep | File | Who leads the knee (chip always doubles) | Feel |
|---|---|---|---|
| 1 | `.md` | The felt upright, with the brushes trio: DARK ROOM | swung |
| 2 | `.wav` | The title's wordless vocal pad takes the flat line and **stops before the leap** (the paused voice); celesta and chip finish it | swung |
| 3 | `.jpg` | Chip bells and celesta, one new layer per note (the SHIPMAS build) | straight |
| 4 | `.eml` | A lone open trumpet over a string tremolo (high noon); it never lands, and the chip lands the F | straight |
| 5 | `.docx` | The original draft-night organ, stadium-spaced | straight |
| 6 | `.xlsx` | Vibes and a cup-muted trumpet (the Upsell's colour), F dorian shading | swung |
| 7 | `.pdf` | Field snare and low strings (THE RED LINE): a march that never becomes one | straight |
| 8 | `.pdf` | Clockwork pizzicato and bassoon (PROCEDURE, the court), dry | straight |
| 9 | `.log` | The felt, with a perfectly quantised chip copy in sync (THE COPY at zero lag) | felt swung, chip straight |
| 10 | `.yaml` | Quantised chip leads; the felt answers a beat late | straight |
| 11 | `.txt` | A polite round: two voices keep deferring ("after you"), so the leap arrives a beat late | swung |
| 12 | `.md` | The AI song (§1.5). Before it, the model plays the knee on his felt piano, better than he does | — |

**Temp music for the mock-ups** (fully programmatic, no outside APIs):
1. **Preferred:** a temp track rendered with the OST engine to each proposal's exact length, written as a `track.py` in the builder's scratch folder that imports `audio/ost/engine` (the engine is read-only; nothing is written under `audio/`). The WAV goes to `out/lookdev/outro/<id>/`.
2. **Fallback:** cut from the locked title, `audio/theme/theme-V1-chipchamber.wav` (read-only). Bar 4 (7.5–10.0 s) is the whole knee, swung; bars 10–11 (22.5–26.25 s) are the knee slow; the bookend (28.75–30.0 s) is the drone and the ding. **Two flags:** a cut from the title sounds like the intro again, which the credits reprise shouldn't; and SCRIPT §3.9 logs the render's f630 sub starting on A1 (55 Hz, F's major third), so avoid f630–650 or check it first.

### 1.3 The stinger slot

- **≤ 5 s (2 bars), a callback laugh, never plot** ([pacing-model §3.3](../format/pacing-model.md)). The season's booked ones: the moth (Ep1), the mirror wink (Ep4), the chihuahua with a gold thread (Ep5), KORG 5 shipping to silence (Ep12).
- Each proposal names where its slot sits: **inside** (no extra time) or **after** (up to 2 bars more). The total never passes 20 s.
- **Ep1's moth** is written for every proposal below. It used to settle on the legal card's last line, then on the terms line's final period, beside the words and never on them. With no terms line (2026-09-27), the rebuild gives it a new place to land.

### 1.4 The capability curve (the elevation note)

The showrunner: "some component of the show rendering improve that shows the model capability of improvement over time." **The outro is the natural home for it:** it's outside story time, it recurs every week in the same place, and the show is made by a machine. Each proposal has a ladder that matures its credits surface across the season, in three steps:

1. **Eps 1–9:** the surface's rendering matures at about the machine's month (style-range §1.4: a ceiling, never a showreel).
2. **From Ep10, the machine types the credits itself:** no hands, and the lines arrive before they'd be typed.
3. **Ep12:** the song (§1.5).

**Guards:** it's a fenced slot like the title cards (style-range §3.4), so it may climb, but it never renders a world perfectly (that's J5's, in Ep12), the pixel base never rises, and **the credit line is the one thing that never changes** (until 2026-09-27 this was the terms line).

### 1.5 Ep12: the AI outro song

- **It extends the weekly outro rather than replacing it.** The season's last outro starts like the other eleven, and then it doesn't close. The song takes over from there and becomes the season's one set of long credits (≈ 60–90 s, the song's call), with no notice on screen (§1.1, 2026-09-27).
- **Programmatic filler first** ([SHOWRUNNER-NOTES](SHOWRUNNER-NOTES.md) note 7): an instrumental on the OST engine with the lyrics set on screen as type. No sung filler, no vocoder (the engine's banned list). The final is a music-model song under the narrow exception still under discussion.
- **The disclosure changes for that episode:** "Song generated with an AI music model; lyrics by (writer)." The model's terms are checked under the GENAI rules (commercial use, no artist named, never "in the style of").
- **The third:** if the model's last cue has sounded A♮ (PROPOSED in OST-BIBLE §1.8), the song may live in F major. If the finale ends with no third, the song keeps the open fifth. The OST owner decides.
- **The stinger:** KORG 5 ships to total silence **after** the song. Silence is the joke, so it needs the music gone first.

---

## 2. A · The closing session (12.5 s)

**The idea.** The episode ends where the intro ends: on his monitor. The last frame pulls back into Mas's screen, so the whole episode was on it (his version, as always). The screen logs the session out: one credits pane, typed one line per beat. Then it clears to the cursor at the loop point. It's the lead's idea at half the length, with the long legal text moved to a pinned footer.

**Length:** 5 bars · 300 frames (o0–o299) · 12.5 s. Stinger inside bar 4, or ≤ 2 bars after.

```
 o0–29  ROOM · the pull-back          o33–239  INSERT · the log                     o240–299  ROOM · log out
┌──────────────────────────────┐    ┌────────────────────────────────────────┐    ┌──────────────────────────────┐
│ ▒▒▒▒▒▒▒▒▒▒▒▒        ( )      │    │ > session closed  ep1.0_research_prev… │    │                              │
│ ▒ last frame ▒      Orb      │    │   by Opus 5.5                          │    │        ▮  cursor, on the beat│
│ ▒ on his     ▒               │    │                                        │    │   (the screen asleep)        │
│ ▒ monitor    ▒   Mas, 3/4    │    │                                        │    │  Mas · the Orb · rack LEDs   │
│ ▒▒▒▒▒▒▒▒▒▒▒▒     at the desk │    │                                        │    │  the room one step down      │
│ ═══════ desk ═══════  glass  │    │                                        │    │                              │
│                              │    │                                        │    │                              │
│                              │    │                                        │    │                              │
└──────────────────────────────┘    └────────────────────────────────────────┘    └──────────────────────────────┘
```

| Bar.beat · frames | Picture | Sound |
|---|---|---|
| **1.1 · o0–1** | The episode's last frame, held. The bezel comes in from the frame edges in LCD rows (the intro's f690–691 pull-back drawing). | The button's tail. The dark room's drone returns: F1+C2, the open fifth. |
| **1.1–1.2 · o2–29** | **ROOM**, the cold open's MEDIUM (`drawMedium`). Mas at the desk, the Orb at his shoulder, both watching the screen. The last frame sits box-filtered on his monitor (the bookend's `thumb()` on a new source), and its colours light him (the bookend's ramp swap). Mas holds the cold open's f56–62 drawings (eyes on the screen, hands still). | Felt F4 on 1.1 and 1.2: the flat line begins, each F in a different register or chip duty. `server_hum`. |
| **1.3 · o30–32** | **INSERT**, cut on the beat: the monitor full frame. The picture steps down to black in 3 palette steps. | Brushes enter. Felt F on 1.3 and 1.4. |
| **1.3 · o33–44** | The session pane comes up in this month's skin (Ep1: 1-BIT, paper #E9E6DA type on black). **The pinned footer is up from o33**, inverse video: the terms line and the pointer. | — |
| **1.4 · o45** | The header prints at once: `session closed · ep1.0_research_preview.md · DEC 27, 2023` (the episode's last rail date). | Key taps begin (`key_tap_soft`, ≤ −30 dBFS). |
| **2.1–3.1 · o60–134** | One credit line per beat, typed at 4 characters a frame, straight (the machine doesn't swing): created by (2.1), written (2.2), picture · music (2.3), voices (2.4), ai tools (3.1). | **Bar 2: the knee whole**, swung eighths, felt with a 25%-duty chip double, over upright bass and brushes; Fm(add9). **Bar 3:** D♭maj7 → C7sus(♭9); the colour answers the leap (G A♭ C) and leaves the F hanging for two beats. |
| **3.2–4.4 · o135–239** | The log is complete and holds for reading. The cursor parks after the last line and blinks on the beat. **Stinger inside (Ep1):** at 4.2 the moth flutters in across the pane and settles on the terms line's final period by 4.4. | The F lands on 3.4. **4.1: the button chord**, F–C–G, no third, held; celesta F6 alone. |
| **5.1 · o240–247** | **ROOM**, cut on the downbeat. The log clears to black in LCD rows, leaving only the cyan cursor at the loop point (`LOOP_CURSOR`). His key light goes with it. | The drone alone, with the rack's ticks. |
| **5.3 · o270** | The room steps down one light level. The Orb's iris turns to the monitor (not to the lens). | — |
| **5.4 · o285–299** | The cursor blinks once (on o285–292, off o293–299). The next intro opens on the same cursor. | **Felt F5 and a 1-frame chip glint on F6 at o285**: the cold open's f0 sound. The outro's last sound is the intro's first. Out by o299. |

**Read time:** the terms are up o33–o239, **8.6 s**, plus the room shot, where the screen is too small to read.

**Per episode:**
- **Automatic:** the thumbnail (whatever the last frame is), the header's filename and date, and the credits deltas (§1.1).
- **The pane's skin** is the capability curve:

  | Eps | Skin |
  |---|---|
  | 1 | 1-BIT terminal: black and paper, block cursor, fixed-width |
  | 2–3 | EARLY-WEB16: a 16-colour window, GIF-dithered title bar |
  | 4–6 | BASE UI (the Orb's toast panel family), proportional pixel face |
  | 7–8 | A layered interface: dithered drop shadows, and the columns align themselves as lines arrive |
  | 9 | TERMINAL (the episode is a `.log`): the credits as `[INFO]` lines |
  | 10 | **The machine types the credits.** The keys move with no hands, the lines arrive faster than typing, and it adds a line of its own, `reviewed by: a human`, and ticks the box itself |
  | 11 | The same, as ghost text first (the Ep11 intro's autocomplete gag): `reviewed by: a human (probably)` |
  | 12 | The song (below) |

- **Stinger:** inside bar 4 (on the pane), or ≤ 2 bars after 5.4 in the dark room.

**Ep12.** The session doesn't close. On 5.1 the log doesn't clear. The machine takes the keyboard, and the pane becomes the song's lyric sheet, typed in time. The full credits and the 90-word notice scroll in the log beside it. The last line prints `session closed by: ` and stays blank: nobody closed it.

**Cost.**
- **Build once:** ≈ 1.5–2.5 agent-h. It reuses the medium, the bookend's pull-back, `thumb()`, the caret and the key-tap map. New: the pane renderer, the typing, the footer and the LCD clear.
- **Skins:** 4 more over the season, ≈ 20–30 agent-min each.
- **Weekly:** ≈ 15–25 agent-min (the data, the last-frame grab, a review still), plus ≈ 20–30 agent-min for the 5-bar reprise colour, plus ≈ 1 CPU-min to render.

**Strengths:** it mirrors the intro exactly (the monitor, the cursor, the loop). Mas and the Orb are in it. It's the lead's idea, so it's the most continuous with the plan.
**Risks:**
- It spends a second "it was on his screen" reveal every week. The intro already makes that point, and the outro makes it again.
- At 12.5 s it's the second longest, and the story's last beat is followed by a pull-back every week.
- The pane is small enough that the room shots can't carry text, so the INSERT has to hold.

---

## 3. B · The Orb's verdict (7.5 s)

**The idea.** The Orb scans everyone, so at the end it turns and scans us. Its scan toast returns the credits, and its last line is a verdict on the viewer, which drifts across the season the way its verdict on Mas does (G07). The terms line sits in the lit band under it, the show's own UI home.

**Length:** 3 bars · 180 frames (o0–o179) · 7.5 s. Stinger ≤ 2 bars after.

```
 o0–29  the Orb wakes                 o60–119  the toast fills                  o120–179  the verdict
┌──────────────────────────────┐    ┌──────────────────────────────┐    ┌──────────────────────────────┐
│                         ◐    │    │ scan: ep1.0_research_prev…   │    │ scan: ep1.0_research_prev…   │
│                        Orb   │    │ by Opus 5.5                  │    │ by Opus 5.5                  │
│                   (iris half │    │                              │    │                              │
│                    open)     │    │                              │  ◉ │                              │ ◉
│                              │    │         ╲ scan cone ╱        │    │ viewer: verified: human      │
│══════════ the band ══════════│    │══════════ the band ══════════│    │══════════ the band ══════════│
│                              │    │                              │    │                              │
│                              │    │                              │    │                              │
└──────────────────────────────┘    └──────────────────────────────┘    └──────────────────────────────┘
```

| Bar.beat · frames | Picture | Sound |
|---|---|---|
| **1.1 · o0–14** | Cut to black on the downbeat. **The band lights** (the bottom 480×67 UI band, BASE) with the terms line and the pointer, held to the end. The Orb, close, at frame-right (the orb rig at ≈ 28–32 px radius), steps up from black in 3 palette steps. Its catch-light glints (1 frame, 2 px: the title's glint). | The drone, F1+C2. Felt F4 on 1.1. |
| **1.2 · o15–19** | The iris swivels to the lens in 3 drawings. | The servo, a tuned chip whirr on C6 (SFX). |
| **1.3 · o30–54** | The scan fan, a thin cyan cone, opens and sweeps left to right toward us. **[GLYPH-MASKED] inside the cone only:** the credits appear as tokens where the toast will be, and settle into type as the cone passes. Black outside the cone. | The scan "shhk" (SFX, `orb_scan_sweep`). No music under the scan. |
| **2.1–2.4 · o60–119** | **The toast** (BASE UI panel, lowercase mono) stacks one line per beat, straight: `scan: ep1.0_research_preview.md` (2.1) · `by Opus 5.5` (2.2) · `voices: synthetic · none cloned` (2.3, optional) · `ai tools: used throughout` (2.4, optional). | **Bar 2: the knee whole, straight** (it's the Orb's frame), in the episode's colour with chip; one line lands on each pair of eighths, and the leap (G A♭ C F) lands under lines 3–4. |
| **3.1 · o120** | **The verdict** pops as the toast's last line: `viewer: verified: human`. | The Orb's chime (C7, 80 ms, SFX). |
| **3.2 · o135** | Hold. | **The score's verdict one beat after the chime**, never with it (OST §2.4): F5 → C6 on vibes and glass, let ring. It's the outro's final chord, the open fifth. |
| **3.3–3.4 · o150–179** | The iris relaxes to idle (3 drawings, o150–154). The catch-light glints at o165. Cut to black at o179. | The fifth rings into the black. |

**Read time:** the band is up o0–o179, **7.5 s**.

**Per episode:**
- **The verdict on the viewer** drifts with the Orb's own ladder (G07, OST §2.4). The music ladder comes free with it:

  | Eps | The toast's last line | The score's verdict |
  |---|---|---|
  | 1–5 | `viewer: verified: human` | F → C |
  | 6, 8 | `viewer: human (probably)` | F → C with a D♭ grace note |
  | 7 | No chime and no verdict: the toast stays open, the cursor blinking (THE HUG, after the fact) | none |
  | 9 | `viewer: human (probably)`, and the toast replays its lines unprompted | retrograde, C → F |
  | 10 | `viewer: —` (it returns nothing) | F alone |
  | 11 | `viewer: human… probably?` | F → C, late |
  | 12 | `HUMAN: VERIFIED. SIDE: UNCLEAR.` (the audience is where Mas is) | the fifth held, no third |

- **The capability curve:** the tokens in the cone follow the GLYPH ladder's stages (MM-13), coarse to fine. **From Ep10 the toast fills before the scan finishes:** it already knew.

**Ep12.** After the verdict, the Orb keeps watching while the credits scroll up behind it, the full notice included. The song plays, and the Orb reads the credits (its iris tracks them). The Orb never speaks, so the song is never its voice.

**Cost.**
- **Build once:** ≈ 1–1.5 agent-h. It reuses the Orb rig, the scan fan, the toast panel (the bookend's `TOAST`), the glyph layer and the band.
- **Weekly:** ≈ 10–15 agent-min (the text and the verdict step) plus ≈ 15–20 agent-min for the 3-bar colour. Under 1 CPU-min to render.

**Strengths:** it's short, and it's the one outro with a joke that grows: the season drifts on *us*. The music ladder is already written.
**Risks:**
- **A lens look every week.** The intro already has the Orb's iris to the lens every episode, so it's established in the fixed parts, and it doesn't count against an episode's lens budget. But flag it.
- The verdict sits one line away from the terms line. The rule has to hold: the verdict drifts; the terms never do.
- Ep7's "no verdict" must read as intent, not as a missing line.

---

## 4. C · After hours: DAYS SINCE (10 s)

**The idea.** NopeAI's lobby at night, after everyone's gone: the wall with the DAYS SINCE SOMEONE TRIED TO FIRE MAS light box. Under it hangs the building directory, a black felt letter board with white push-in letters, and it lists the credits as tenants. A maintenance hand hangs the new count. The number is real: days from the sign's last reset to the episode's last date.

**Length:** 4 bars · 240 frames (o0–o239) · 10 s. Stinger inside bars 3–4 (the moth goes to the light), or ≤ 2 bars after.

```
 o0–59  the wall, after hours          o60–119  the hand hangs the count       o180–239  lights down
┌──────────────────────────────┐    ┌──────────────────────────────┐    ┌──────────────────────────────┐
│ ║rack║  ┌DAYS SINCE─────┐    │    │ ║rack║  ┌DAYS SINCE─────┐    │    │ ║rack║  ┌DAYS SINCE─────┐    │
│ ║LEDs║  │SOMEONE TRIED  │[0]│    │ ║LEDs║  │SOMEONE TRIED  │[3][6]  │ ║    ║  │SOMEONE TRIED  │[3][6]
│ ║    ║  │TO FIRE MAS:   │   │    │ ║    ║  │TO FIRE MAS:   │  ✋ │    │ ║    ║  │TO FIRE MAS:   │   │
│         ┌─DIRECTORY──────┐   │    │         ┌─DIRECTORY──────┐   │    │         ┌─DIRECTORY──────┐   │
│         │EP1.0 ... CLOSED│   │    │         │EP1.0 ... CLOSED│   │    │  (house light one step down) │
│  [0 0 0]│BY OPUS 5.5     │   │    │  [0 0 0]│BY OPUS 5.5     │   │    │  [0 0 0]│BY OPUS 5.5     │   │
│══════════ the band ══════════│    │══════════ the band ══════════│    │══════════ the band ══════════│
│                              │    │                              │    │                              │
└──────────────────────────────┘    └──────────────────────────────┘    └──────────────────────────────┘
```

**The directory (Ep1):**
```
DIRECTORY
EP1.0 RESEARCH_PREVIEW.MD ......... CLOSED
BY OPUS 5.5
```
Letter boards are all caps, so the directory is too. Optional rows, the showrunner's call (§1.1): `PICTURE · MUSIC ... RENDERED IN CODE`, `VOICES ... SYNTHETIC · NONE CLONED`, `AI TOOLS ... USED THROUGHOUT`. *(Until 2026-09-27 the terms line sat in the band, in sentence case, never on a NopeAI surface.)*

| Bar.beat · frames | Picture | Sound |
|---|---|---|
| **1.1 · o0–59** | Cut on the downbeat to the lobby, NIGHT (`lobby.ts`, its night light), a locked frame on the wall right of the desk: the lit sign (`lobbySign`) still showing the last count (Ep1: `0`, from sc 30), the directory under it, the box of spare zeros on the floor (`zeroBox`), a rack pillar's LEDs at frame-left, the rose window's cyan pool on the floor. The band carries the terms and the pointer from o0. Nothing moves but the LEDs. | The sign's tube hum and the lobby's night bed. **Bar 1: the flat line** as felt quarters (F F F F), each in a different register, over the drone. |
| **2.1–2.2 · o60–89** | A maintenance hand (a drawn hand only, the Ep1 sc 30 hand's family) rises into frame with digit plates. 2.1: the reach. 2.2: it unhooks the `0` and drops it in the box. | **Bar 2: the knee whole**, swung. A plate clack at 2.2 (SFX, unpitched). |
| **2.3–2.4 · o90–119** | It hangs `3` on 2.3 and `6` on 2.4: **36**, the days from the sign's reset (NOV 21, 2023) to Ep1's last rail date (DEC 27, 2023). | The leap (G A♭ C F) lands as the plates hang; a clack on each. |
| **3.1 · o120–123** | The hand withdraws (1 drawing). The sign's face settles in a held-step flicker (lit 3 → 2 → 3: one flash, inside the ≤ 2 rule). | Fm9 → D♭maj7(♯11); the chip echoes the kink. |
| **3.1–3.4 · o124–179** | Hold for reading. **Stinger inside (Ep1):** the moth flies to the lit box, as moths do, circles it once and settles on the band's final period by 3.4. | — |
| **4.1 · o180** | The after-hours timer steps the house light down one level. The sign, the neon and the votives stay lit. | **The button chord**, F–C–G, no third, held. |
| **4.4 · o225–239** | Hold, then cut to black at o239. | The chord and the tube hum run out by o239. |

**Read time:** the band is up o0–o239, **10 s**. The directory is readable from o0.

**Per episode:**
- **The count** comes from each episode's `facts.md`: days from the sign's last reset to the episode's last rail date.
  - Ep1 **36** (NOV 21 → DEC 27, 2023, the reset Ep1's script fixes). Ep2 **275** if its last rail date is AUG 22, 2024. Every count is checked at lock.
  - **A reset episode** (Ep4: NOLE's bid, FEB 10, 2025) shows the hand emptying all the plates into the box and hanging the count from the new reset.
  - **Ep10** `??` (the calendar has lost its grip). **Ep11** a half-scratched `?`. **Ep12** `∞`: an authored ∞ plate, drawn, not a rotated 8, and it hangs itself, with no hand. The machine vetoed the firing (G01's payoff, shown after the fact).
- **The directory:** the filename line, the credits deltas, and at most one egg tenant per episode from what's already aired (Ep6 on: `RESERVED · SEP 2026` on one row; Ep10 on: `THE INTERN · CORNER OFFICE`).
- **The capability curve:** Eps 1–9, a human hand hangs the plates, and the letters are pushed in by hand (one sits a pixel out of line in Ep1, and they're straighter each episode). **From Ep10 the plates flip by themselves and the letters slide into place on their own:** the machine typesets the credits.

**Ep12.** The count reads `∞`. The lobby's ceiling speaker plays the song, futzed for one bar (in-world source), then full-range as it becomes the score. The directory's letters rearrange themselves, row by row, into the lyrics, then into the full credits and the notice.

**Cost.**
- **Build once:** ≈ 2–3 agent-h. It reuses the lobby room, its sign, `digitPlate`, `zeroBox` and the hand inserts. New: the directory board and its letter animation, the hand's 4 drawings, the count data.
- **Weekly:** ≈ 15–25 agent-min (the count, the directory, and matching the lobby's aftermath state) plus ≈ 15–25 agent-min of music. ≈ 1 CPU-min to render.

**Strengths:** the most in-world and the most "we did the arithmetic". It's a running gag with a new number every week, a real reset in Ep4, the calendar losing its grip in Ep10, and ∞ at the end.
**Risks:**
- **The real credits on a parody company's wall.** It's funny, but legal may read it as affiliation; the terms line stays off the wall to limit that.
- The lobby isn't Mas's room, so the outro leaves his POV every week.
- The count is a fact that has to be right every week.
- A weekly DAYS SINCE could thin out G01's own in-episode beats (Ep4, Ep11, Ep12). The outro only ever shows the aftermath, never the attempt.

---

## 5. D · The curve (15 s)

**The idea.** The intro's cyan line, run home. A thread lifts out of the episode's last frame. Everything else falls away, and the camera follows the thread along the chart. Eight credit plates ride its eight notes, the way the roll call's portraits rode the knee: four on the flat line, four up the leap. The eighth plate is an empty window with a blinking cursor, the player who doesn't exist yet, and in this proposal it's the credit for the machine. The thread runs up into that cursor, and we cut to the intro's own first frame. The season loops.

**Length:** 6 bars · 360 frames (o0–o359) · 15 s. The stinger rides the line (inside); after the cursor there's nothing, because the loop is the ending.

```
 o0–59  the thread lifts           o60–179  the flat line (4 plates)          o180–299  the leap              o300–359  f0
┌──────────────────────────┐    ┌────────────────────────────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│ ░░ last frame, dithering ░│    │ · · · · · · · · · · · · · · · · · ·│    │              ┌▮┐ ╱   │    │                  │
│ ░░ to black behind ░░░░░░ │    │ ┌MR. MAS┐ ┌by Opus 5.5┐ ┌voices?┐   │    │        ┌AI┐ ╱       │    │                  │
│ ░░ the line ░░░░░░░░░░░░░ │    │ ════════════════●═══════════════════│    │   ┌pix┐ ╱ ┌src┐      │    │     ▮  (298,124) │
│ ═══════════════════════   │    │          "you are here"             │    │ ═════╱               │    │  the intro's f0  │
│══════════ the band ═══════│    │══════════ the band ═════════════════│    │═══ the band ═════════│    │                  │
└──────────────────────────┘    └────────────────────────────────────┘    └──────────────────────┘    └──────────────────┘
```

| Bar.beat · frames | Picture | Sound |
|---|---|---|
| **1.1–1.4 · o0–59** | The episode's last frame, held. A 1-px cyan thread (#3FE6FF) lifts out of it along its lower third, and the frame steps to black behind it in a 4-step Bayer fade (o15–44). Only the thread stays in colour (the curve never freezes). The band comes up at o30. | The button's tail; the drone; a harp harmonic on F5 as the thread lifts. |
| **2.1–3.4 · o60–179** | **The flat line.** The chart's axes and grid stay visible, so it reads as a chart, never a monitor. The camera scrolls right in whole pixels along the thread over a faint 1-px chart grid (the cold open's chart). On the four flat notes (2.1, 2.3, 3.1, 3.3) four plates pop up onto the line in 3 whole-pixel drawings with a 1-px overshoot (the tower-pop grammar): `MR. MAS · ep1.0_research_preview.md` · `by Opus 5.5` · `voices · synthetic, none cloned` (optional) · `music · original score, in code` (optional). The `you are here` dot sits on the line at this episode's step. | **Bars 2–3: the flat line in half-note steps** (F on 2.1, 2.3, 3.1, 3.3), played short (felt staccato and pizzicato), each F in a different register and chip duty. **The drone drops out at 2.1:** the flat thread is never under a held tone (intro rule 9). The Water Line's harmony as short comps, never sustained: Fm(add9) → D♭maj7. Brushes, swung. |
| **4.1–5.4 · o180–299** | **The leap.** Past the knee the thread bends up; the camera cranes up 1 px every 3 frames. Plates on the leap's notes (4.1, 4.3, 5.1, 5.3): `picture · pixel art, in code` (G, optional) · `ai tools · used throughout` (A♭, optional) · `written · (creator), with AI` (C; replaced by `by Opus 5.5` on the flat line, 2026-09-27) · and on F, **the eighth plate: an empty window with a blinking cursor.** | **Bars 4–5: the leap in half notes** (G, A♭, C, F), chip an octave up, strings in. B♭m9 → C7sus(♭9). On 5.3 the F lands on the title's quartal stack, with no third. No riser, no snare roll: it isn't the title again. |
| **6.1 · o300** | The thread goes vertical and runs up into the eighth plate's cursor. **Hard cut on the downbeat to the cold open's f0 frame:** a black monitor and the 4×8 cyan block cursor at (298, 124), blinking on the beat. The band goes out on the cut, after 11.25 s up. | The stack releases. **Felt F5 and the 1-frame chip glint on F6**, the cold open's f0 sound. |
| **6.1–6.4 · o300–359** | The cursor blinks on each beat (on for 8 frames, off for 7). Out on o359. This frame is the next intro's f0. | The drone holds, out by o359. |

**Read time:** the band is up o30–o299, **11.25 s**. The plates stay on screen for 3–5 s each as they scroll.

**Per episode:**
- **The dot** sits one step further than this episode's intro put it (intro §8.4): Ep1 at 0.55, Ep8 at 0.90 past the knee, Ep9 at the chart's top edge, Ep10 off the top (`you are ↑`). It's where the next intro will find it.
- **The capability curve is literal.** Within each outro the thread climbs the palettes (as the intro's line does: flat part in the episode's floor, the top in its ceiling), and across the season the floor rises:

  | Eps | Floor → ceiling |
  |---|---|
  | 1 | 1-BIT → EARLY-WEB16 → BASE |
  | 4 | EARLY-WEB16 → BASE |
  | 7 | BASE → the month's machine render, inside the eighth plate's window |
  | 11 | The camera moves in perspective along the thread for the first time (after 11.A airs) |

  **From Ep10** the thread draws itself ahead of the camera, and the plates arrive before their notes, quantised: the machine leads.
- **The stinger rides the line:** the week's callback object sits on the thread at one of the flat notes (Ep1: the moth, folded, on the flat line), with no extra time.

**Ep12.** The curve runs the whole season: twelve kinks, one per episode, each segment labelled with its filename, with the full credits and the notice riding along under the song. It ends at the cursor, and the cursor keeps blinking: the loop doesn't close, unclear which side.

**Cost.**
- **Build once:** ≈ 3–4 agent-h. It reuses the skyline's `curveY`, the tower-pop grammar, the cold open's chart and its f0 frame. New: the chart world, the camera path, the plates and the palette ladder.
- **Weekly:** ≈ 20–35 agent-min (the dot, the plates, the ladder step, the stinger object) plus ≈ 25–35 agent-min for 6 bars of augmented knee. ≈ 2 CPU-min to render.
- **Ep12's season curve:** ≈ 2–3 agent-h more.

**Strengths:** the most cinematic, and the truest loop: the outro's last frame and sound are the intro's first. It makes the capability curve visible as a curve. It's the only one that plays the knee long (4 bars), so it's the fullest credits reprise.
**Risks:**
- At 15 s it's half the intro, the far end of "shorter".
- It's the most expensive every week.
- It's close to the intro in look and gesture, so the week's variation has to do real work or it'll feel like a rerun.

---

## 6. E · File closed (6.25 s)

**The idea.** Every episode's title is a file, and its card renders in its own file type (style-range §3.4): `ep1.0_research_preview.md` is raw markdown, `her.wav` a waveform, `strawberry.jpg` blocky JPEG, and so on. The outro closes that file. The episode opens on the filename card after the intro and ends by closing the same file. **Every file type already has a real-world place for credits and fine print** (front matter, EXIF, an email's legal footer, a tracked change, a certificate of service, a log line, a YAML key), so the credits sit where that file would keep them. The joke is in the medium, and the terms line is never the joke.

**Length:** 2.5 bars · 150 frames (o0–o149) · 6.25 s. Stinger ≤ 2 bars after the close.

```
 o0–119  the file, at its end                                   o120–127  close        o128–149  the desktop
┌──────────────────────────────────────────────────────┐    ┌──────────────────┐    ┌──────────────────────────┐
│ ep1.0_research_preview.md                        [x] │    │                  │    │                          │
│ …                                                    │    │ ════════════════ │    │        ▮  (298,124)      │
│ ---                                                  │    │   (rows collapse │    │                          │
│ by: Opus 5.5                                         │    │    to a line)    │    │                          │
│ ---                                                  │    │                  │    │                          │
│                                                      │    │        ·         │    │                          │
│                                                      │    │                  │    │                          │
│                                                      │    │                  │    │                          │
│                                                      │    │                  │    │                          │
│                                                      │    │                  │    │                          │
│                                                      │    │                  │    │                          │
└──────────────────────────────────────────────────────┘    └──────────────────┘    └──────────────────────────┘
```

| Bar.beat · frames | Picture | Sound |
|---|---|---|
| **1.1 · o0** | Cut on the downbeat to the episode's file window, full frame, already scrolled to its end: the file's last lines are the credits, in that file type's own convention. Generic, original chrome (no real OS or app UI). The terms line and the pointer sit on the desktop's bottom line, **outside the window**. | **Bar 1: the knee whole**, swung, in the episode's colour with chip, over the open fifth. |
| **1.1–2.4 · o0–119** | Hold for reading. The file's caret blinks on the beat at the end of the credits. At 2.3 (o90) the pointer comes in from frame-right and travels to the close box in whole-pixel steps (o90–112). | **2.1: the button chord**, F–C–G, no third, held; the colour instrument answers once. |
| **3.1 · o120–127** | **Click.** The window closes in 4 whole-pixel drawings: its rows collapse to a 1-px line, the line to a dot, the dot out. No scaling, no blur. **The terms line stays**, because it was never inside the window. | The click (SFX, `post_click`). **Felt F5 and the 1-frame chip glint on F6**, the cold open's f0 sound. |
| **3.1–3.2 · o128–149** | The black desktop: the cyan cursor at (298, 124), the intro's first-frame spot, blinking on the beat, and the terms line under it. Out on o149. | The chord rings out by o149. |

**Read time:** the terms are up o0–o149, **6.25 s**, the whole outro.

**Per episode: the file-type ladder.** The file types are the season's own title cards, and each one has a natural place for credits:

| Ep | File | Viewer | Where the credits sit | The close |
|---|---|---|---|---|
| 1 | `research_preview.md` | A plain editor, **raw** markdown (`#`, `*` and `---` showing) | A `---` front-matter block at the end | The pointer clicks ✕ |
| 2 | `her.wav` | An audio editor, a waveform | Region labels along the timeline; the waveform stops mid-envelope and leaves a gap where the voice paused (a gap, never a flat line: intro rule 9) | ✕ |
| 3 | `strawberry.jpg` | An image viewer, 8×8 JPEG blocks | **The info (EXIF) panel:** Artist, Software (the AI disclosure is literally the Software field), Copyright, Comment | ✕ |
| 4 | `not_for_sale.eml` | A mail client | The signature block, and **the email's legal footer** (where fine print always lives) | ✕ |
| 5 | `missionaries.docx` | A word processor | A margin comment on the last paragraph, as a tracked change | ✕ (no "save changes?" dialog: the greyed Cancel is G09's, and G09 pays off in Ep12) |
| 6 | `backstop.xlsx` | A spreadsheet, the P24 cell render | A `credits` sheet tab, cells A1:B6; the formula bar reads `=CREDITS()` | ✕ |
| 7 | `supply_chain_risk.pdf` | A PDF page with redaction bars | The page footer: **the only lines left unredacted** | ✕ |
| 8 | `statute_of_limitations.pdf` | A court filing: exhibit sticker, page stamp | The signature block and certificate of service | ✕ |
| 9 | `outside_intended_scope.log` | TERMINAL | `[INFO]` lines, then `[INFO] session end` | The process exits: `exit 0` |
| 10 | `pace.yaml` | A config editor | A `credits:` block, **typed by the machine**: no pointer, the values fill before the keys | The window closes itself |
| 11 | `assist_clause.txt` | Plain monospace, blinking caret | Ghost-text autocomplete writes the credits ahead of the caret, and nobody accepts it | The close box is clicked from inside |
| 12 | `unclear_which_side.md` | **The same markdown as Ep1, rendered this time** | → the song | The close box greys out |

**The capability curve is built in:** raw source in Ep1, rendered in Ep12. The file types mature with the season, and the machine writes the credits from Ep10.

**Ep12.** The pointer goes to the close box, and it's greyed out. It's a callback to the uncancellable dialog, whose payoff the episode has just played (G09). The file keeps going: a new heading renders (`## outro`), a player block for the song renders under it (the `her.wav` waveform, returned), the lyrics render line by line as markdown, and then the full credits and the notice. It ends on the cursor.

**Cost.**
- **Build once:** ≈ 1–1.5 agent-h (the window, the footer line, the close, the pointer, and the Ep1 `.md` layout).
- **Each new file type:** ≈ 20–30 agent-min. That's 10 over the season (`.pdf` and `.md` repeat), about 3.5–5 agent-h in all, **roughly half of it shared** if the intro owner builds the title cards as files (H9), since the viewers are the same drawings.
- **Weekly otherwise:** ≈ 5–10 agent-min plus ≈ 10–15 agent-min for the 2.5-bar colour. Under 1 CPU-min to render.
- **Season:** ≈ 6–11.5 agent-h in all, ≈ 6–8 if the viewers are shared.

**Strengths:**
- The shortest, and literally "a brief credit pane".
- The weekly variation is already part of the show's design, and it's a different real-world joke every week with no gag to wear out.
- It bookends each episode with its own file.
- It ends on the loop cursor and the intro's first sound.
- The legal line is the clearest of the five: non-diegetic, and the last thing to go.

**Risks:**
- The coolest of the five: no Mas and no room, only his pointer.
- The knee gets one bar, the shortest statement of the theme.
- Its best weeks depend on the title-card files being built.

---

## 7. Comparison

| | **E · File closed** | **B · The Orb's verdict** | **C · After hours** | **A · The closing session** | **D · The curve** |
|---|---|---|---|---|---|
| **Length** | **6.25 s** (2.5 bars) | 7.5 s (3 bars) | 10 s (4 bars) | 12.5 s (5 bars) | 15 s (6 bars) |
| **With the stinger** | ≤ 11.25 s | ≤ 12.5 s | 10–15 s (inside or after) | 12.5 s (inside) – 17.5 s | 15 s (it rides the line) |
| **Terms on screen** | 6.25 s | 7.5 s | 10 s | 8.6 s | 11.25 s |
| **Credits surface** | The file's own convention | The Orb's toast | The lobby directory | A session log | Eight plates on the knee |
| **Terms placement** | The desktop line, outside the window | The band | The band | The pane's pinned footer | The band |
| **Who's in it** | His pointer | The Orb | A maintenance hand | Mas and the Orb | Nobody (the thread) |
| **The knee** | 1 bar, swung | 1 bar, straight; the verdict's fifth ends it | 1 bar over the plates | 1 bar and an answer | 4 bars, augmented |
| **Mirrors the intro** | The cursor, the f0 sound | The Orb's glint and iris | — | The monitor, the pull-back, the cursor | The line's journey; cuts to f0 |
| **Weekly variation engine** | 12 file types (already designed) | The verdict drift (already written) | The count (real arithmetic) | The pane's skins | The dot, the palette floor |
| **Capability curve** | Raw → rendered; the machine types from Ep10 | Token stages; the toast pre-fills from Ep10 | Hand → self-hanging plates | 1-bit → rich UI; the machine types from Ep10 | The palette floor rises; 3D camera from Ep11 |
| **Ep12** | The close box greys out; the file keeps rendering into the song | The Orb reads the long credits | ∞; the directory becomes the lyrics | The session never closes | The whole season's curve |
| **Build once** | 1–1.5 agent-h (+3.5–5 for the file types, about half shared with H9) | 1–1.5 agent-h | 2–3 agent-h | 1.5–2.5 agent-h (+1.5–2 for skins) | 3–4 agent-h |
| **Weekly** | 15–25 agent-min (+20–30 in a week with a new file type) | 25–35 agent-min | 30–50 agent-min | 35–55 agent-min | 45–70 agent-min |
| **Season total** (12 eps, excl. Ep12's song) | ≈ 6–11.5 agent-h (≈ 6–8 if it shares the title-card viewers) | ≈ 6–8.5 agent-h | ≈ 8–13 agent-h | ≈ 10–15.5 agent-h | ≈ 12–18 agent-h |
| **Legal clarity** | Highest (non-diegetic; the last thing on screen) | High (the band) | Medium (real credits on a parody company's wall) | High (a pinned footer) | High (the band) |
| **Main risk** | Cool; one bar of theme | A lens look every week | Leaves his POV; the count must be right | Repeats the intro's reveal weekly | Long; close to the intro |

The costs follow [production-estimates](../format/production-estimates.md) (≈ 3–4 agent-min per new visual event; a dense 5–7.5 s chunk ≈ 51–81 agent-min). They're estimates until the mock-ups are timed.

---

## 7a. Mock-up results

> **Built 2026-09-26/27.** All five exist as moving Ep1 mock-ups: 1080p, temp music from the OST engine, designed SFX, a 1 s stand-in "last frame" before each. Each went through two cold reads and two polish passes. **The lengths and beats in §0–§7 are the briefs; this section is what was built.** Nobody has listened to any of the mixes yet, and all on-screen legal text is a draft (legal review pending).

**Watch them:**
- `out/lookdev/outro/outro-compare.mp4` (70 s): all five in order, A to E. Each one follows a 2 s slate with its letter, name and length, with 1 s of black between. Sound is each builder's own mix, not level-matched: B plays about 1.6 LU quieter than the other four (−18.4 LUFS against −16.8 to −17.2).
- `out/lookdev/outro/outro-compare-sheet.png`: the five as built, to scale against the intro, then one row each with 3 key frames from the encoded reel plus the Ep10 variant still.
- Each proposal's own files are in `out/lookdev/outro/<id>/`, with its handoff note in `studio/src/dev/outro/<id>/` (`README.md` for A, the `entry.tsx` header for B–E).

### Final lengths

| | Plain week | Ep1, with the moth | Mock-up file | Terms + pointer readable | Brief |
|---|---|---|---|---|---|
| **A** · The closing session | **11.875 s** (4.75 bars) | the same (the moth is inside) | 12.875 s | terms 5.83 s, pointer 3.33 s (on the pane) | 12.5 s |
| **B** · The Orb's verdict | **7.5 s** (3 bars) | 10 s (the moth adds a bar) | 11.75 s | 7.5 s; 10 s in Ep1 | 7.5 s |
| **C** · After hours | **8 s** (3 bars + the ring-out) | the same (inside) | 9 s | 7.67 s | 10 s |
| **D** · The curve | **11.25 s** (4.5 bars) | the same (inside) | 12.25 s | 9.17 s | 15 s |
| **E** · File closed | **7.5 s** (3 bars) | 8.17 s (the moth lands after) | 9.17 s | 7.5 s; 8.17 s in Ep1 | 6.25 s |

All five are under half the 30 s intro and inside 6–15 s. The terms line is on screen for at least 5 s, unmoving and never covered, in every one.

### What each looks like now

**A · The closing session (11.875 s).**
- **What it is:** one 1-bit session log on Mas's monitor. Three short credit rows type at a reader's pace. Then the terms and the pointer print whole as the log's last lines, in the same face, under a dotted rule. The camera pulls back once, at the end, to Mas and the Orb in his dark room. The moth comes to the light, the window closes to the loop cursor, and the room goes dark around it.
- **Changes from the brief:** it's the only one that still reads as "his screen, his room". Its second cold read cut it to one block of text in one face. It grew from 8.75 s to 11.875 s so an average reader (25 cps) can read the card once; they finish 0.21 s before the room shot.
- **Weaknesses:**
  - It's now the longest of the five, and the card is the same every week.
  - Slow readers still lose the pointer.
  - The terms are back on Mas's own monitor, so legal needs to say whether that counts as in-world.
  - Mas's only new acting is one blink.
  - The moth is a 13-px speck at phone size.

**B · The Orb's verdict (7.5 s; Ep1 10 s).**
- **What it is:** the Orb, close, on black. Its scan cone leaves the credits behind it as a toast of chips headed `MR. MAS · <file>`. Its verdict on the viewer, `viewer: human ✓`, lights its lens. The band under it carries the terms and pointer throughout.
- **Ep1's moth:** it comes to the lit lens, bumps the glass with a tink, and settles beside the final period under a thin beam from the Orb. That adds one bar.
- **Strengths:** the most characterful moment of the five, and the only joke that drifts across the season (the Ep6 and Ep10 verdicts are rendered as stills).
- **Weaknesses:**
  - Its plain week has the tightest reading time. Reading the toast in order misses at 16 cps by 0.67 s, and the band gets only 0.57 s to itself.
  - Ep1 runs 2.5 s longer than a plain week.
  - It looks at the lens every week.
  - Cold-read style notes still stand: flat terminal chips, a stock decode, a band that reads like a web footer, and an empty middle.
  - Ep7's "no verdict" isn't built.

**C · After hours (8 s).**
- **What it is:** NopeAI's lobby at night. The DAYS SINCE sign opens on last night's count (35). The directory under it carries one small head row and three big lines: `CREATED BY (CREATOR)` / `MADE WITH AI` / `AI VOICES · NONE CLONED`. A maintenance hand lifts yesterday's 5 off, and tonight's 36 is already behind it, like a tear-off calendar. The timer turns the house light and then the sign off. The moth goes to the one light left, the terms line, and the frame dips to black as the sound ends.
- **Strengths:** the most in-world of the five, and the arithmetic is real.
- **Weaknesses:**
  - The terms and pointer need 8.2 s and get 7.67 s.
  - The board's wording departs from §1.1, and opening on 35 departs from §4.
  - Real credits on a parody company's wall is still a legal question.
  - It leaves Mas's point of view every week.
  - The count must be right at every lock.
  - Its moth is copied from E's.

**D · The curve (11.25 s).**
- **What it is:** the line on Mas's monitor lights up, the room dissolves around it, and the camera pushes in on the line alone to the full-frame chart. The title and the two human credits sit on the flat line. The picture, voices and AI-tools plates pop on the leap's notes. An empty post box rises at the top of the curve, with the moth settled inside it. Everything dithers to black, leaving only the caret, with the intro's first sound.
- **Strengths:** it keeps all six credit fields in full, and the terms and pointer are up longest (9.17 s). It's the fullest statement of the theme and the most cinematic.
- **Weaknesses:**
  - The leap is crowded, with a new card every 0.6 s.
  - The type is small on a phone (about 5–6 px native).
  - The same stacking will wear by week three.
  - The final caret sits at (308,30), not the intro's (96,76), so the loop cuts in off-axis.
  - It's still the most expensive week to week.

**E · File closed (7.5 s; Ep1 8.17 s).**
- **What it is:** the episode's own file (`ep1.0_research_preview.md`, raw markdown) in a window sized to it and centred. The credits are a `---` front-matter block, whole from the cut. The terms and pointer sit on the desktop's bottom line, outside the window. His pointer clicks the close box, and the window collapses to its centre. In Ep1 the moth comes in with the click and lands beside the final period, then nothing moves for 1.29 s.
- **Strengths:** the shortest, tied with B, and the clearest legal placement.
- **Weaknesses:**
  - The credits block (174 characters) gets 6.25 s and needs about 10.9 s, so it's skimmed, not read.
  - Apart from the caret, the hold is fully still for 5.3 s.
  - There's no Mas.
  - The second polish dropped the loop cursor, so only the sound loops to the intro now.
  - The weekly file-type variation is proven only in stills (Ep3 `.jpg` EXIF, Ep10 `.yaml`).

### What the mock-ups taught (all five)

1. **The §1.1 text package doesn't fit in 6–15 s.** Every builder but D cut the credit words on screen:
   - A to three rows, 13 words;
   - B to two toast lines;
   - C to three big lines;
   - E to shorter values.

   D kept all six fields by staggering them across 9 s. **Needs the showrunner and legal:** a short on-screen credit set, with the long forms in the description beside the full notice. This file proposed A's: `created by (creator)` · `made in code, with AI tools` · `voices synthetic, none cloned`. *(Settled 2026-09-27: the title and filename plus `by Opus 5.5`; other rows optional, §1.1.)*
2. **Nobody reads everything once, and that's acceptable only if the terms are read.**
   - The terms plus the pointer are 131 characters, about 8.2 s at 16 cps.
   - Only D (9.17 s) and B's Ep1 (10 s) hold them that long. E's Ep1 (8.17 s) is at the line. C (7.67 s) and the 7.5 s plain weeks of B and E fall short.
   - A paces them as two separate beats, both long enough on their own.
   - The ≥ 5 s rule on the terms line alone passes everywhere.
   - Holding the band 0.5–0.7 s longer would fix C and a plain week of B or E.
   - *(2026-09-27: moot. With no terms or pointer on screen, their read time no longer sets any length.)*
3. **The loop to the intro is weaker than planned.**
   - Only A closes on the intro's loop cursor.
   - D's caret is off-axis.
   - E loops by sound only.
   - B and C don't loop.
4. **Legal placement splits them.**
   - B, D and E keep the terms on plain, non-diegetic interface.
   - A puts them on Mas's monitor.
   - C puts real credits on NopeAI's wall.
5. **Five different moths.** Pick one when a proposal is chosen.
6. **Still open in every one:**
   - Nobody has heard any mix.
   - The stand-ins aren't Ep1's real button.
   - ~~`(creator)` is a placeholder.~~ The credit is `by Opus 5.5` (2026-09-27).
   - The Ep10 rungs are stills, not motion.
   - The costs in §7 are still estimates; the mock-ups weren't timed.

---

## 8. Recommendation

**After the mock-ups (2026-09-27): E still, with a fix, and no clear runner-up.** E is still the shortest (7.5 s, tied with B), the clearest legal read (the terms sit outside the window and are the last thing on screen), and the cheapest week to week.

The build weakened two of the reasons below:
- **The loop (reason 7):** it's now sound only.
- **The weekly variation (reason 2):** it's still unproven in motion.

The build also showed a fix E needs before it's final: its credits block is too long to read. Use the short credit set (§7a, point 1) and hold the band to about 8.2 s. *(2026-09-27: the short set is now §1.1's, and the 8.2 s hold was for the terms and pointer, which are cut.)*

**For warmth at the same length:** B is the candidate, but its plain week has the tightest reading time of the five and its style notes are open. Grafting B's verdict onto E from Ep6 (≈ 8.75 s) is still worth trying.

**For Mas in the last shot:** A is the one, but it's now the longest of the five (11.875 s) and identical every week.

The deciding test is still the showrunner's own viewing of `outro-compare.mp4`. The notes below are the original reasoning, kept for the record.

**The original recommendation (2026-09-26, before the mock-ups):**

**E, "file closed", as the weekly outro.** A, "the closing session", is the runner-up if the showrunner wants Mas in the last shot.

**Why E:**
1. **It's what was asked for:** a brief credit pane, well under the intro, at about a fifth of its length.
2. **The weekly variation already exists.** The episode titles are files, and each file type carries credits and fine print its own way. The outro gets twelve different real-world jokes out of one mechanism, and none of them is a running gag that can wear thin.
3. **It closes the frame the episode opened.** The filename card after the intro opens the file; the outro closes it.
4. **The capability curve is literal and costs nothing extra:** raw markdown in the pilot, rendered markdown in the finale, and the machine typing the credits from Ep10.
5. **The clearest legal read:** the terms line is non-diegetic, sits outside the window, and is the last thing to leave the screen.
6. **It's the cheapest week to week once its viewers exist,** and about B's season cost if it shares them with the title cards, so it doesn't compete with the episode's own picture.
7. **It keeps the loop:** it ends on the cursor at the intro's first-frame spot, with the intro's first sound.

**What E gives up, and how to get it back.** It's cool: no face, one bar of the knee.
- If the showrunner wants warmth, **B's verdict can graft on as E's last line** from Ep6, when the drift starts: the Orb's toast pops over the black desktop with the viewer verdict. That's +1 bar, 8.75 s.
- If the showrunner wants Mas in the last shot, **A at 12.5 s** is the full-hearted version, and the two share the text package and the music frame, so switching costs little.

**Keep from the others either way:**
- C's arithmetic belongs in the episodes, where the lobby sign already lives.
- D's season curve is a strong candidate for Ep12's long credits under any proposal.

**Before choosing:** watch the five mock-ups at speed, in order after a stand-in button. The one that feels like the show's own last breath is right, whatever this table says.

---

## 9. Builder briefs

**Common to all five.**
- **Where:**
  - Code in `studio/src/dev/outro/<id>/`, with its own entry via `studio/src/dev/makeRoot.tsx`.
  - Outputs in `out/lookdev/outro/<id>/`.
  - Scratch in `…/scratchpad/outro-<label>/` only.
  - Don't edit shared files (the pixel engine, the font, the rooms, the OST engine, the theme); copy or wrap locally.
- **Format:** 24 fps, 1920×1080 (native 480×270 at 4×, nearest-neighbour, whole-pixel motion only), `--concurrency=4`, 1080p only.
- **Mux** with Remotion's bundled ffmpeg (`LD_LIBRARY_PATH=studio/node_modules/@remotion/compositor-linux-x64-gnu …/ffmpeg`), as in `docs/RENDERING.md`.
- **Composition ids:** `outro-<id>-ep1` (the motion mock-up) and `outro-<id>-stills` (per-episode variant stills).
- **The button's last frame (a stand-in):** Ep1's tag and button aren't built.
  - Use the dark-room MEDIUM from the cold open (`src/dev/mcoldopen/medium.ts` `drawMedium`, cold-open f56) as "the last frame".
  - Or grab the last frame of `out/ep01/act4/animatic/act4-animatic-v4-picture.mp4`, reduced to 480×270 and snapped to the master palette.
  - Run 1 s of the stand-in before the outro in the mock-up, so the cut in reads.
- **Text:** exactly §1.1 as it stood then. Use `(creator)` as the placeholder (now `by Opus 5.5`, 2026-09-27). Draw `·` locally as a 1-px dot. Put a small corner slug `LEGAL TEXT: DRAFT` on the lookdev renders only.
- **Music:** a temp in Ep1's colour (felt + brushes trio + chip), made with the OST engine from a `track.py` in scratch, to the exact frame count; the fallback is the title cut (§1.2).
- **Deliverables per proposal:**
  - `outro-<id>-ep1-1080p.mp4` (the stand-in + outro + the Ep1 moth stinger, with temp music)
  - `outro-<id>-keyframes.png` (a strip of 5–6 frames with frame numbers)
  - `outro-<id>-variants.png` (the Ep6 and Ep10 states side by side, to show the ladder)
  - The re-render commands in the entry file's header comment

| Id · folder | Brief |
|---|---|
| **A** · `a-closing-session` | **300 f, 12.5 s.** o0–1 the bezel pull-back (reuse `mfinale/bookend.ts`'s LCD-row drawing and `thumb()` on the stand-in frame) → o2–29 the ROOM (`drawMedium`, the cold-open f56–62 cycle, the ramp swap) → o30 cut to the INSERT; the pane (1-BIT skin) up by o35 with the inverse pinned footer (the terms + pointer) → o45 header `session closed · ep1.0_research_preview.md · DEC 27, 2023` → 2.1–3.1 (o60, 75, 90, 105, 120) five credit lines at 4 chars/frame with key taps → hold; the moth lands on the footer's final period by o239 → o240 cut to the ROOM, the log clears in LCD rows to the cursor at `LOOP_CURSOR` → o270 the room one step down → o285 the last blink, out o299. **Music:** felt Fs in bar 1 → the knee whole, swung, in bar 2 → the answer in bar 3, F on 3.4 → F–C–G on 4.1 → drone, with felt F5 + a chip F6 glint at o285. **Variant stills:** Ep6 (BASE UI skin), Ep10 (no hands; the `reviewed by: a human` line ticked by itself). |
| **B** · `b-orb-verdict` | **180 f, 7.5 s.** o0 black; the band lit with the terms + pointer (held to the end); the Orb close at frame-right (orb rig, r ≈ 28–32), 3-step fade-up, catch-light glint → o15–19 the iris to the lens (3 drawings, the servo SFX) → o30–54 the scan cone sweeps; GLYPH-masked tokens resolve into type inside it (use `shared/pixel/glyph.ts`) → o60, 75, 90, 105 the toast lines (BASE UI, lowercase mono) → o120 `viewer: verified: human` with the chime (C7) → o135 the verdict F5→C6 → o150–154 the iris to idle, o165 glint, out o179. **Music:** drone + felt F4 in bar 1 (nothing under the scan), the knee whole, **straight**, in bar 2, the verdict's open fifth in bar 3. **Stinger** after, ≤ 2 bars (Ep1: the moth lands on the band's final period). **Variant stills:** Ep6 `viewer: human (probably)`, Ep10 `viewer: —` with the toast pre-filled before the cone. |
| **C** · `c-lobby` | **240 f, 10 s.** o0 the NopeAI lobby NIGHT (`shared/pixel/rooms/lobby.ts`), locked on the wall right of the desk: `lobbySign` (lit, `0`), a new **directory board** (black felt, white caps, brass frame, ≈ 200×96 native) with the §4 text, `zeroBox`, a rack pillar's LEDs; the band with the terms + pointer from o0 → o60 the hand rises (a drawn hand from `kits/inserts-hands.ts`'s family) → o75 unhook `0`, drop it in the box (clack) → o90 hang `3`, o105 hang `6` (**36**) → o120 withdraw; the sign's one held-step flicker (≤ 2 flashes) → the moth circles the sign and lands on the band's final period by o179 → o180 the house light one step down → out o239. **Music:** felt F×4 in bar 1, the knee whole, swung, in bar 2 (the leap under the plates), Fm9→D♭maj7(♯11) in bar 3, F–C–G on 4.1. **Variant stills:** Ep4 (the reset: the plates in the box, a fresh count), Ep10 (`??`, no hand, the letters sliding themselves). |
| **D** · `d-curve` | **360 f, 15 s.** o0 the stand-in frame; a 1-px #3FE6FF thread lifts along its lower third; a 4-step Bayer fade to black o15–44; the band on at o30 → o60 the camera scrolls right in whole pixels over the cold open's faint chart grid; plates pop on 2.1, 2.3, 3.1, 3.3 (o60, 90, 120, 150; 3 drawings + a 1-px overshoot); the `you are here` dot at 0.55; the moth folded on the line → o180 the knee: the thread bends up (reuse `mfinale/skyline.ts` `curveY` for the shape), the camera cranes 1 px every 3 frames; plates on o180, 210, 240, 270; the last is an empty window with the blinking cursor → o300 **hard cut to the cold open's f0 frame** (black monitor, cursor at 298,124, blinking 8 on / 7 off), the band out → out o359. **Palette:** the flat plates 1-BIT, the leap EARLY-WEB16, the top BASE. **Music:** bars 2–5 the knee in half-note steps, played short, swung brushes, **the drone out from 2.1** (never a held tone under the flat thread), the quartal stack on 5.3; felt F5 + a chip F6 glint at o300. **Variant stills:** Ep7 (BASE floor; the machine's render in the eighth window), Ep10 (the thread drawn ahead of the camera, `you are ↑`). |
| **E** · `e-file-closed` | **150 f, 6.25 s.** o0 the file window, full frame, original chrome, titled `ep1.0_research_preview.md`, scrolled to the end: raw markdown with a `---` front-matter credits block (§6); the terms + pointer on the desktop's bottom line, outside the window → the caret blinks on the beat → o90–112 the pointer (reuse `mfinale/callart.ts` `drawPointer`) travels to ✕ → o120 click; o120–127 the window closes in 4 whole-pixel drawings (rows → line → dot → gone) → o128–149 the black desktop, the cursor at (298,124) blinking, the terms line still up → out o149. **Stinger** after, ≤ 2 bars: the moth lands on the terms' final period. **Music:** the knee whole, swung, in bar 1; F–C–G on 2.1; the click with felt F5 + a chip F6 glint on 3.1. **Variant stills:** Ep3 `strawberry.jpg` (the EXIF panel with the Software field as the disclosure), Ep10 `pace.yaml` (the machine typing the `credits:` block). |

---

## 10. Open questions

**For the showrunner:**
1. Which proposal, or which graft (E + B's verdict is the one this file suggests)?
2. ~~The credit line: whose name, and in what form (`created by …`)?~~ **Answered 2026-09-27:** `by Opus 5.5` (SHOWRUNNER-NOTES note 4).
3. The notice's home: a show page for the notice and the receipts, or the description only for now?
4. The stinger: is the moth, settling beside the terms line, still the Ep1 stinger in the new outro?
5. Ep12: extend (this file's proposal) or replace?

**For legal (pending review):**
1. The showrunner has ruled out any notice on screen (2026-09-27), including the one-line disclaimer and the 20 s legal-card alternate. Does a notice in the description alone cover what the 90-word card did?
2. Must the AI disclosure name the tools on screen, or is "listed in the notice" enough?
3. Check the platform's synthetic-media label and EU AI Act Art. 50 (in force from Aug 2026, with lighter duties for artistic and satirical work) before distribution ([GENAI plan §6](GENAI-UPGRADE-PLAN.md)).
4. Proposal C: are the real credits on a parody company's in-world directory a problem?
5. Ep12: check the music model's terms for commercial use, and settle the song's credit wording.

**For the OST owner:** the per-episode reprise colours (§1.2), and whether the credits reprise may be as short as 2.5 bars.

**For the intro owner:** whether the title cards will be built as files (H9). E's best weeks lean on them.

---

## 11. Handoff

- **What this pass made:**
  - This file.
  - The comparison strip, `out/lookdev/outro/outro-proposals-timeline.png`, drawn by `studio/src/dev/outro/_compare/make_timeline.py`. Re-run it with `python3 studio/src/dev/outro/_compare/make_timeline.py` (it needs Pillow; it reads nothing and writes only the PNG).
  - The five moving mock-ups are the builders' (§9) and land in `out/lookdev/outro/<id>/`.
- **Measured:**
  - The terms line's width in the 7-px face: 389 px.
  - The Ep1 count: NOV 21 → DEC 27, 2023 = 36 days (and Feb 15, 2024 = 86 matches Ep2's script).
  - The grid arithmetic.
- **Estimated:** every cost figure (from production-estimates rates) and every read time (≈ 16 characters a second).
- **Still needs a human:** the showrunner's pick, the credit line, legal review, and the OST owner's colours.
- **Not touched:** the intro, the pacing model, the OST bible, the overview's legal text and SHOWRUNNER-NOTES. Whichever proposal is chosen updates pacing-model §3.1's credits row (0:43 → the chosen length), overview §8's end-credits paragraph, OST MM-15's lengths and Ep1's script's END CREDITS heading.

**The comparison pass (r2, 2026-09-27).**
- **What it made:**
  - §7a.
  - The update at the head of §8.
  - The notes at the top of the file and of §0.
  - A re-cut of `out/lookdev/outro/outro-compare.mp4` and `outro-compare-sheet.png` from the five second-polish mock-ups.
- **The tool:** `studio/src/dev/outro/_compare/reel.py`. Its `PROPOSALS` table holds each proposal's built timing, taken from the builders' `timeline.ts` files.
- **Re-run it, from the repo root:**
  1. Render B's Ep10 frame once into your scratch folder: `(cd studio && ../ops/heavy.sh npx remotion still src/dev/outro/b/entry.tsx outro-b-stills <scratch>/b-ep10-o140.png --frame=1 --bundle-cache=false --log=error)`.
  2. Then run `ops/heavy.sh audio/.venv-mix/bin/python studio/src/dev/outro/_compare/reel.py <scratch>` in the background and poll it.
- **What the script checks:**
  - Each clip's frame count against the table.
  - The reel's frame count.
  - The encoded reel against each source at its key frames.
  - The loudness of each clip, in its source and in the reel.
- **Measured on r2:**
  - The reel is 1,681 frames (70.04 s) at 1920×1080, 24 fps, with AAC stereo audio.
  - At every checked frame it matches its sources within a mean of 0.51 levels, and the 99.9th percentile is 8 levels or less.
  - Each clip's loudness is unchanged in the reel. The whole reel is −16.6 LUFS, −1.0 dBTP.
- **Deliberately not re-drawn:** the brief-time strip `outro-proposals-timeline.png`. It shows the plan, and the sheet's top panel shows what was built.
- **Still stale:** §2–§6, §7 and §9 give the briefs' lengths and beats, not the built ones. §7a says what changed.
