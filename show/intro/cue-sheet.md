> **Status: v1 reference, superseded where it conflicts.** The master opening script is now [`SCRIPT.md`](SCRIPT.md) (v2.0, 2026-09-25). v2.0 changes the visual style to pixel art with motivated style switches (see `studio/INTRO_PIXEL_BRIEF.md`) and the music to a piano / orchestral / big-band blend with a jazz feel and 8-bit motifs (variations V1–V4). This file's timing, gags and text remain useful detail.

# Opening Titles: Music, Sound and Voice

**"The Knee (Main Title)"** is an original prestige-drama theme: felt piano against an 808.

| | |
|---|---|
| **Version** | v1.1, 2026-09-25 |
| **Built from** | [`_sources/design/final.md`](../_sources/design/final.md) §4 · [`_sources/plan-v1.md`](../_sources/plan-v1.md) §4 · [`worldcast-cast-integration.md`](../_sources/research/worldcast-cast-integration.md) §5 (the podium's single SFX) · [`worldcast-flashback-map.md`](../_sources/research/worldcast-flashback-map.md) §3 (the tiers reused in flashbacks) |
| **See also** | [spec.md](spec.md) · [shot-table.md](shot-table.md) · [episode-slots.md](episode-slots.md) |
| **Style dependency** | **None for the music itself.** The four instrument tiers are *motivated* by the picture's fidelity tiers. If the chosen visual structure drops those tiers ([../bible/style-status.md](../bible/style-status.md)), the score still works but loses half its joke. |

---

## 1. Concept

The theme **scales its own fidelity along with the picture.** The same notes are re-orchestrated for each era, so it stays one theme rather than becoming a medley.

- **The dark room:** a solo felt piano.
- **1993:** the same hook on a chiptune beeper.
- **2008–14:** a warbly cassette piano over boom-bap.
- **The dinner:** a full hybrid orchestra with an 808.
- **The launch and the skyline:** a choir joins.

It evokes a genre (Succession-style prestige main titles, with Social Network-style dread in the cold open) and **copies no melody.**

Two signature moves:
- **The music gets fired.** Every stem cuts to one dry piano note at f495.
- **The music gets rehired.** Everything slams back at f510.

## 2. Specs and the harmonic joke

| | |
|---|---|
| Tempo, meter | **96 BPM, 4/4**, locked to the 24 fps grid: 15 frames per beat, 60 per bar |
| Key | **F minor** |
| Length | 30.0 s = 12 bars = 720 frames (the pilot's alternate A3 cut would be 35.0 s; see [spec §3.4](spec.md#34-alternates)) |
| Timing source | `studio/src/shared/timing.ts` → `beats.json` (still to write) → `audio/compose.py` (still to write) |

**The harmonic joke is "unclear which side," played as harmony:**
- **The cold open uses open fifths only (F–C), with no third.** The major-or-minor question stays open.
- **The minor third arrives at the f120 drop**, when the story "picks a side."
- **The final chord at f630 has no third again.**
- **In Ep12** the third finally starts to arrive, and the picture cuts to black before we hear which one (§7.3).

## 3. The "knee" motif

One bar of eighth notes: **F F F F G A♭ C F**. The repeated F is the flat part of the exponential, and the widening leaps are the knee.

```
 eighths:  1  &  2  &  3  &  4  &
 pitch:    F  F  F  F  G  Ab C  F      flat ........ knee ↗
```

**Where it appears:**

| Section | Form |
|---|---|
| Cold open (bars 1–2) | Four piano Fs on beats (f0/15/30/45), then the knee as a quick run G5 A♭5 C6 F6 on **Post** (f105/108/112/116) |
| 1993 (bar 3) | The beeper hook (F F F … C … F) |
| 2008–14 (bar 4) | The tape-piano hook (±15 cents wobble) |
| Dinner (bars 5–8) | The card-hit roots spell a slow version: **F (f240) · D♭ (f300) · B♭ (f360) · C (f420)** |
| Skyline (bars 10–11) | One pluck per beat: **F F F F G A♭** (f540–615), then **C on the off-beat, f622**, when the roofline ignites |
| Title (bar 11.3) | **The final F**, f630, as an open fifth F–C |

---

## 4. Instrumentation by tier

| Tier | Where | Frames | Instruments | Tier fingerprint |
|---|---|---|---|---|
| **T0** | Cold open, bookend | f0–119, f690–719 | Felt piano, sub drone (F1+C2), server hum | Close, dry, intimate |
| **T1** | 1993 · 1-bit | f120–179 | Pulse-wave beeper, square bass, noise hats, **over a real sub** | Bitcrushed; the bonk sting |
| **T2** | Tape · 2008–14 | f180–239 | Lo-fi boom-bap, wow-and-flutter cassette piano, hiss, lo-fi brass | ±15 cents pitch wobble; low-pass; tape start and spin-up |
| **T3** | Full · the dinner | f240–479 | Sampled piano (Salamander), strings and brass (VSCO 2 CE), timpani, a synthesized 808, trap hats | Hybrid orchestra; half-time after each hit |
| **T4** | Max · slot onward | f480–689 | T3 plus a wordless choir pad, risers, 55→35 Hz sub drops, glass shimmer, celesta and bell | The widest; bloom in sound |

The flashbacks reuse these tiers in their eras: the T1 beeper for 1993, the T2 cassette for Tpool, and so on (see [../timeline/flashback-map.md](../timeline/flashback-map.md) §3). **Every tier must be able to play the knee alone,** because flashbacks quote it one tier at a time.

---

## 5. Production routes

### 5.1 Ranked options

| Rank | Route | Pros | Cons | Effort |
|---|---|---|---|---|
| **1 · recommended** | **Code-composed.** `compose.py` reads `beats.json` and writes one MIDI file per stem with `pretty_midi`. Each tier renders from the same MIDI: T1 as numpy pulse waves, bitcrushed; T2 as Salamander through a pitch wobble, low-pass and hiss; T3/T4 as Salamander plus VSCO 2 CE via `tinysoundfont` and a numpy 808. The mix is done in `pedalboard`. | **The only frame-exact route.** You own the result. Stems stay separate, so the fire/rehire and any retime are just gain curves. The fidelity-tier joke works by construction. | Quality is about 7/10. Handing the MIDI to a human composer gets about 9/10. | About 2–3 days |
| 2 | **AI generator plus a code-built hit layer** (ElevenLabs Music composition plan, Suno, Lyria). Time-stretch to the grid, then lay the hits, mute, stamp and ding in code. | The fastest route to a polished texture | Timing drifts. Licensing caveats (§5.4). The tier changes are hard to control. | About 1–2 days |
| 3 | **Stock** (Epidemic, Artlist) | The most production value per hour | Generic. Loses the tier joke. Cutting to the grid means stem surgery. Some libraries trigger Content ID claims. | About 1 day |

**Recommendation:** build a code-composed sketch for the animatic, and generate one AI version as a temp track for comparison. **Lock v1 as code-composed**, and upgrade through a composer working from the MIDI if needed.

**Humanization rule:** pads, ostinati and hats may be humanized ±8 ms. **Every listed hit in §6.2 stays sample-exact.**

### 5.2 ElevenLabs Music composition plan
This is paste-ready. **Check the field names against the current docs** before use. The durations sum to 30,000 ms.

```json
{
  "positive_global_styles": ["prestige TV drama main title", "instrumental", "96 BPM", "F minor", "classical felt piano versus heavy 808 hip-hop drums", "string ostinato", "brass stabs", "cinematic", "confident, slightly sinister", "same motif throughout: four repeated notes then a rising leap"],
  "negative_global_styles": ["vocals with words", "lyrics", "EDM build-drop cliches", "dubstep", "comedy or cartoon music", "ukulele", "whistling", "tempo changes", "fade-out"],
  "sections": [
    {"section_name": "Dark room", "duration_ms": 5000, "lines": [],
     "positive_local_styles": ["solo felt piano repeating one high note on each of the first four beats", "deep sub drone of open fifths", "server-room hum", "about one second of near-silence with one low piano note", "quick four-note rising piano run at the very end"],
     "negative_local_styles": ["drums", "bass line", "chords with a third", "melody"]},
    {"section_name": "Chiptune then cassette", "duration_ms": 5000, "lines": [],
     "positive_local_styles": ["deep sub hit on beat one", "first half: 8-bit square-wave chiptune beat, melody of four repeated notes then a rising leap", "second half: the same melody on a warbly lo-fi cassette piano over boom-bap drums with tape hiss"],
     "negative_local_styles": ["orchestra", "vocals"]},
    {"section_name": "Name cards", "duration_ms": 10000, "lines": [],
     "positive_local_styles": ["huge orchestral hit (timpani, brass, low piano, 808 boom) at the start of every 2.5 seconds", "half-time trap drums after each hit", "chords F minor, D-flat major, B-flat minor, C major", "classical strings and brass over hip-hop beat", "short fill before each hit", "rising intensity"],
     "negative_local_styles": ["key change", "vocals with words"]},
    {"section_name": "Launch and skyline", "duration_ms": 6250, "lines": [],
     "positive_local_styles": ["full hybrid orchestra with wordless choir pad", "sudden near-silence with one dry piano note, then everything slams back", "celesta glissando upward", "driving half-time 808 groove with glitchy synth arpeggios", "one plucked note per beat climbing upward", "riser and snare roll"],
     "negative_local_styles": ["four-on-the-floor kick", "vocals with words"]},
    {"section_name": "Title", "duration_ms": 3750, "lines": [],
     "positive_local_styles": ["one massive final hit: open fifth with no third", "wordless choir, brass, low piano cluster, sub drop", "long reverb tail", "single high bell near the end"],
     "negative_local_styles": ["major-key resolution", "melody after the hit", "fade-out"]}
  ]
}
```

### 5.3 Suno / Lyria one-liner
> *"[Instrumental] 30-second prestige TV main title, 96 BPM, F minor: lone felt piano repeated note over sub drone, then 8-bit chiptune beat, then lo-fi cassette piano, then heavy 808 hip-hop with classical strings and brass stabs, orchestral hit every 2.5 seconds, one beat of silence then full slam, climbing plucks, wordless choir, massive final open-fifth hit, bell."*

Do the tape spin-up in post, not in the prompt, because it conflicts with "no tempo changes."

### 5.4 Licensing caveats
These are as recorded in the sources, not legal advice. **Re-check before any use.**
- Purely AI-generated music isn't copyrightable in the US.
- ElevenLabs' film/TV terms need checking.
- Suno's commercial rights cover only tracks made while subscribed.
- Udio downloads were disabled at the time of the source.
- The distribution venue (YouTube, festival or private) changes the risk. This is an open question in `final.md` §6.

---

## 6. Cue sheet

### 6.1 By section

| Bars | Time (s) | Section · tier | Harmony | Exact hits (frames) |
|---|---|---|---|---|
| 1–2 | 0.0–5.0 | Dark room · T0 | F open-fifth pedal; D♭ color note in the longest VO pause | Piano F5 at f0/15/30/45; VO f24–91 (Ep1); D♭ f60 (Ep1); pluck f90; servo f97; scan f100; knee run f105/108/112/116; click f112; reverse swell f105–119 |
| 3 | 5.0–7.5 | 1993 · T1 | Fm | **Drop at f120**; beeper F at f120/127/135, then it pauses while the dialog is open; bonk at f150 as a wrong-note sting; OK and beeper C at f165; F at f172; tape start f168–179 |
| 4 | 7.5–10.0 | 2008–14 · T2 | D♭maj7 → Fm | Collar pops f180/187; brass stab f195; crowd "ohh"; re-pop f202; tape spin-up and keyboard roll f225–239 |
| 5–8 | 10.0–20.0 | Dinner cards · T3 | Fm, D♭, B♭m, C (E natural) | **Hits at f240 / f300 / f360 / f420**; chant f285/292; "A-G-I!" f300/303/307; klaxon f345–359, cut dead at f360; rocket roar to f419 with its boom folded into the f420 sub; stamp f435 (C); neon f465–474; letter clunk f473 |
| 9 | 20.0–22.5 | Slot · T4 | Fm → silence → D♭ | Shockwave f480; **mute f495–509** (10 ms fade; dry F4 and room tone on an unmuted bus); slam and crash f510; glissando f525–539 |
| 10–11.2 | 22.5–26.25 | Skyline · T4 | Fm → D♭ | Plucks F f540, F f555, F f570, F f585, G f600, A♭ f615, **C f622**; riser from f600; snare roll |
| 11.3–12 | 26.25–30.0 | Title and bookend | F–C, no third | **Final hit at f630**; `[Ep3]` coin clink f645; celesta F6 at f660 and f690; reverse whoosh f690; **ding F6 at f705**; tail out by f719 |

### 6.2 Hit list by frame (the `compose.py` event list)
`[SLOT]` = per-episode. `[P]` = THE PODIUM layer. Every other row is fixed.

| Frame | Beat | Event | Stem |
|---|---|---|---|
| f0 | 1.1 | Felt piano F5; sub drone F1+C2 fades in; server hum in | piano, fx |
| f15 | 1.2 | Piano F5 | piano |
| f24 | — | VO in `[SLOT]` (Ep1: "near the singularity;" f24–57) | vo |
| f30 | 1.3 | Piano F5 (−6 dB duck under the VO) | piano |
| f45 | 1.4 | Piano F5 (ducked) | piano |
| f58–71 | — | VO pause `[SLOT]` | vo |
| f60 | 2.1 | Low D♭ color note (Ep1 position; per episode it goes in the longest pause) `[SLOT]` | piano |
| f72–91 | — | VO "unclear which side." `[SLOT]` | vo |
| f90 | 2.3 | Pluck as the dot exits the monitor | fx |
| f97 | — | Orb servo | fx |
| f100 | — | Scan "shhk" | fx |
| f105 | 2.4 | Knee run G5; reverse-cymbal swell f105–119 | piano, fx |
| f108 | — | A♭5 | piano |
| f112 | — | C6 + the Post click | piano, fx |
| f116 | — | F6 | piano |
| **f120** | **3.1** | **DROP:** sub boom, square bass, noise hats; beeper F (the first minor third) | chip, 808 |
| f127 | — | Beeper F | chip |
| f135 | 3.2 | Beeper F, then the beeper pauses (dialog open) | chip |
| f150 | 3.3 | Bonk (wrong-note sting) | chip |
| f165 | 3.4 | OK click + beeper C | chip, fx |
| f168–179 | — | Tape-start whirr | fx |
| f172 | — | Beeper F | chip |
| f180 | 4.1 | T2 in: boom-bap, tape-piano hook, hiss; collar pop 1 (tuned) | drums, piano, fx |
| f187 | — | Collar pop 2 | fx |
| f195 | 4.2 | Lo-fi brass stab; crowd "ohh" | orch, fx |
| f202 | — | Collar re-pop | fx |
| f225–239 | 4.4 | Tape spins up to speed; mechanical-keyboard snare roll | fx, drums |
| **f240** | **5.1** | **HIT Fm:** timpani, brass, low piano, 808, camera shutter; kick goes half-time | orch, 808, drums, fx |
| f285 | 5.4 | Whispered "FEEL"; flame whoomph; organ swell | chant, fx, orch |
| f292 | — | Whispered "THE" | chant |
| **f300** | **6.1** | **HIT D♭**; shouted "A-G-I!" (f300/303/307); wordless choir enters | orch, chant |
| f345–359 | 6.4 | Two-tone klaxon on eighths; pizzicato; steam; triple chime | fx, orch |
| **f360** | **7.1** | **HIT B♭m**; klaxon cut dead; sighing violin glissando | orch |
| f405–419 | 7.4 | Rocket roar (its boom folds into f420); fuzz-guitar pickup | fx, orch |
| **f420** | **8.1** | **Biggest HIT, C major:** brass fanfare, power chord | orch, drums, 808 |
| f435 | 8.2 | Stamp thunk (tuned to C) | fx |
| f465–474 | 8.4 | Neon buzz; drum fill | fx, drums |
| f473 | — | Letter clunk (the N moves) | fx |
| **f480** | **9.1** | **T4 in:** full band, choir pad, sub boom, glass shimmer; shockwave; odometer ratchet `[SLOT]` | all |
| **f495** | **9.2** | **The music is fired:** every stem muted (10 ms fade); dry piano F4 and room tone on an unmuted bus `[SLOT]` | all → piano |
| **f510** | **9.3** | **The music is rehired:** slam back on D♭ + crash `[SLOT]` | all |
| f525–539 | 9.4 | Celesta and glockenspiel glissando; reverse swell `[SLOT]` | orch, fx |
| f540 | 10.1 | Pluck F; half-time 808 and glitchy arps in | fx, 808 |
| f555 | 10.2 | Pluck F; siren whoop tuned to F | fx |
| f570 | 10.3 | Pluck F; paint drip and clack | fx |
| f585 | 10.4 | Pluck F; **ka-ching** (NESNEJ) | fx |
| f600 | 11.1 | Pluck G; riser starts | fx |
| f615 | 11.2 | Pluck A♭ + plop (PEEKDEEP) | fx |
| **f622** | 11.2 & | **Pluck C** as the roofline ignites. `[P]` THE PODIUM appears (Ep3+) and **rides this pluck: no new SFX**. The riser peaks; snare roll. | fx, drums |
| **f630** | **11.3** | **FINAL HIT, F–C open fifth:** choir, brass, low piano cluster, sub drop 55→35 Hz | all |
| f645 | 11.4 | `[P]` **Ep3 only:** one coin clink (§7.2). THE PODIUM's only SFX, ever. | fx |
| f660 | 12.1 | Celesta F6 | orch |
| f690 | 12.3 | Reverse whoosh + celesta F6; drone returns | fx, orch |
| **f705** | **12.4** | **Ding (F6 bell)**: the post notification `[SLOT]` for Ep10–12 | fx |
| f719 | — | Drone out; the loop point | fx |

---

## 7. Per-episode audio changes

### 7.1 Cold-open VO
Each episode gets a **hand-keyed word-timing JSON**: word, in frame, out frame, the stressed word for the dot slide, and the longest pause for the D♭ color note.

**Constraints:**
- The VO sits inside **f24–100**.
- It is 16 syllables or fewer.
- Every line keeps the delivery rules in [spec §3.2](spec.md#32-delivery-and-timing).

The line list is in [episode-slots.md §3](episode-slots.md#3-cold-open-lines).

| Ep | VO notes |
|---|---|
| 2 | "her", one syllable, at about f24–33. **The rest is silence** under the pulsing typing indicator. The D♭ lands in that silence. |
| 8 | Hold a hedge beat first (cursor blinks), then "yes." (the source amended the answer to "yes"; not instant). The chart "buffering" gets no new sound, just a room-tone swell. |
| 9 | Cut the VO on the dash (`singularity—`) by the Post click, not by a breath |
| 11 | The monitor autocompletes the line as ghost text first **[SPEC gag]**, and the VO reads it about 2 frames behind the ghost text |
| 12 | **No VO.** The empty chair. Keyboard clicks are keyed to **Ep1's syllable map**, so the machine "speaks" in his rhythm. `ours.` gets three clicks and the Post click. Mas enters one beat late (a coffee-cup set-down Foley, dry) **[PROPOSAL]**. |

### 7.2 THE PODIUM
Per worldcast integration §5: **the coin clink is the only SFX it ever gets.**

| Ep | Podium event | Sound |
|---|---|---|
| 3 | A dark silhouette; the coin-slot glint at f622; **one coin clink on the last beat of bar 11** | **Coin clink at f645.** Proposed: pitched **C7** (the fifth, so there's still no third), dry, panned hard left (the hill), about −18 dBFS peak, under 80 ms. It sits in the tail of the f630 hit. |
| 4, 6, 8 | States with no motion | Silent |
| 5 | The label gun fires off-screen; `GENIUS` sticks on the ring's base | **Silent.** The f622 pluck C covers it. |
| 7 | **In-slot cameo:** the HTURT meteor streaks from the podium into MISANTHROPIC's lighthouse **inside 9.2** | **Silent.** It lands inside "the music is fired," so the only sound is the dry F4 and room tone. The year's loudest post arrives in total silence. |
| 9 | The label gun relabels THE NU dome `AI` → `SI` | Silent (rides f622) |
| 10–11 | SI FORCE robot vacuums march along the waterfront | Silent: no motor whine |
| 12 | The plaque reads `USER` | Silent |

### 7.3 Last-bar variations (the speculative endgame)

| Ep | Variation |
|---|---|
| 1–9 | Standard: final hit f630, celesta f660/f690, ding F6 at f705 |
| **10** | A faint **Shepard-tone riser** under the tail (f660–719), below −30 LUFS short-term. You feel it before you hear it. |
| **11** | The riser is louder, and **a second ding answers the first** (proposed: C6 at f712, the off-beat of 12.4; still no third) |
| **12** | **The third finally tries to arrive.** Proposed reading: at f630 a choir alto begins a slow portamento up from G, heading for either **A♭** (minor) or **A** (major) by f705. Both versions are scored; **neither is rendered.** Picture and sound cut to black and silence at **f704**, one frame before the arrival, and the f705 ding never sounds. Alternative reading of `final.md`: the chord contains the third and the cut lands one frame before it. The head writer picks. |

### 7.4 The slot (bar 9)
The four audio events are fixed in every episode: the shockwave and news sting at f480, **the mute at f495**, **the slam at f510**, and the glissando at f525.

**Budget [PROPOSAL]:** at most **one** new tuned "object sound" per episode, in 9.1 or 9.4, keyed to F, C or D♭. Nothing new anywhere else.

Candidates:
- Ep2: the AROS mammoth, as a low brass "trumpet" on F2
- Ep3: a strawberry "plip" on C6
- Ep7: a lobster-claw "clack" in 9.4

---

## 8. SFX list

### 8.1 Synthesized in numpy (about 36; all tuned to the key where pitched)

| Group | Sounds |
|---|---|
| Room and UI | Sub drone, server hum, Orb servo, scan "shhk", clicks (Post, OK) |
| Era | Bonk (T1), tape start, tape spin-up, collar pops (tuned) |
| Dinner | Camera shutter, two-tone klaxon, steam, triple chime, stamp thunk (C), rocket roar, neon buzz, letter clunk |
| Slot | Shockwave, glass shimmer, odometer ratchet, crash, shatter (the hourglass) |
| Skyline and title | 7 plucks (F F F F G A♭ C), siren whoop (F), paint clack, ka-ching, plop, riser, snare roll, sub drop 55→35 Hz, celesta, ding (F6) |
| **New in v1.1** | **Coin clink (C7), used only in Ep3 at f645.** Optional Shepard riser (Ep10–11), second ding (Ep11) |

### 8.2 Recorded (about 6)
- The Mas VO (§9)
- The "feel the AGI" gang chant: 4–6 friends, whispered "FEEL… THE…", then shouted "A-G-I!"
- Crowd "ohh"
- A mechanical keyboard, which also covers the Ep12 typing
- Room tone
- Flame whoomph

### 8.3 From a library
Only whooshes and whips (`@remotion/sfx`).

### 8.4 Banned
- **Meme sounds** (the vine boom and the like).
- **Any real operating-system sound.** The Mac startup chime is reportedly a registered sound mark.
- **Any lift from a franchise:** ring-gate chevrons (in-episode, GATESTAR uses cash-register clunks), transformation servos, dinosaur-movie ripples.
- **No real voices, rally audio or political crowd chants.** The intro never contains political audio. RUMPT has no voice in the intro.
- **No gunfire, explosion-on-person or impact-on-person sounds** anywhere near a real-person proxy (see [../bible/guardrails.md](../bible/guardrails.md)). The rocket landing hits furniture only.

---

## 9. Voice plan

| Item | Plan |
|---|---|
| **Who** | You or a friend performing a clearly cartoon sound-alike of the persona's *cadence*: soft, measured, earnest pauses. The fallback is a synthetic voice designed **from a text description only** (for example, ElevenLabs Voice Design). **Never clone the real voice.** Several states regulate this, such as Tennessee's ELVIS Act. |
| **Direction** | He's reading his own post aloud to an empty room. Stress no word. Let the last word hang (see [spec §3.2](spec.md#32-delivery-and-timing)). |
| **Session** | Record **all 11 episode lines in one session** so the tone matches, plus alternates A1–A4 and pickups. Record each line three ways: as written, 10% slower, and with a longer pause. |
| **Recording** | A closet and a phone is fine. Keep 2 s of room tone per take. |
| **Processing** | High-pass at 90 Hz → 2:1 compression → a small room reverb (about 0.3 s) → light saturation |
| **Lip sync** | 6–8 hand-keyed replacement mouths. This matches the studio's rig limits in `studio/ART_GUIDE.md`, which allows 6–9 shapes. Rhubarb is optional for a first pass. |
| **Other voices in the intro** | Only the gang chant and the crowd "ohh," both as groups. No character dialogue. **RUMPT is never voiced in the intro.** |

---

## 10. Stems, mix and delivery
- **Stems:** `piano`, `orch`, `drums`, `808`, `chip`, `tape`, `fx`, `chant`, `vo`. Each is a separate `<Audio>` layer in Remotion, so the fire/rehire, the per-episode VO and the Ep12 cut are gain curves, not re-renders.
- **Unmuted bus:** the dry F4 and the room tone live on a bus that skips the f495 mute.
- **Mix target:** about **−14 LUFS integrated, −1 dBTP**. Duck the piano 6 dB under the VO.
- **Delivery:** 48 kHz / 24-bit WAV stems plus a stereo print per episode (a recommendation).
- **Cache:** f120–479 audio is identical in Ep1–11 (Ep12 re-prints the tail anyway).

## 11. Open issues
1. **The Ep12 final chord:** which reading of "gains its third" (§7.3)?
2. **The coin-clink pitch:** C7, or unpitched? It must not add a third.
3. **Per-episode object sounds (§7.4):** approve the one-per-episode budget, or keep the slot's audio fixed?
4. **The distribution venue** decides the AI-music and Content ID risk (§5.4).
