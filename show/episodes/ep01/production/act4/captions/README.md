# Ep1 · Act Four v5 · Captions, audio description and the disclaimer line

| | |
|---|---|
| **Who / when** | The facts and access editor, 2026-09-27, in parallel with the pixel preview pass (which owns `studio/src/episodes/ep01/act4/animatic/**` and the art-v5 modules; nothing there was edited). |
| **Built from** | The locked v5 timing: `show/reel/ep01-act4-v5.json` (the approved stick timeline) and `audio/ep01/act4/dialogue/lines-v5.json` (the 101 takes). Cross-checked against the pixel lock `show/episodes/ep01/production/act4/shots-locked-v5.json`. |
| **Facts** | The lock checks behind the quoted words are in [`../../../facts.md`](../../../facts.md), section "Act Four v5 lock checks". The required script and page changes are listed there (§ "Required changes") and below. |
| **Honesty** | I can't listen or watch. Everything here is measured from the timing data. No caption or description has been read against the picture or heard against the mix. |

## Files

| File | What |
|---|---|
| `ep01-act4-v5.en-sdh.act.srt` / `.vtt` | Plain SDH captions, **act clock**: 00:00:00.000 is the act's first frame (episode 12:31:00). Use for the pixel preview if it starts on act frame 0. |
| `ep01-act4-v5.en-sdh.reel.srt` / `.vtt` | The same cues **+3.000 s**, for `out/reel/ep01-act4-v5.mp4` and `audio/reel/ep01-act4-v5/mix.wav`, which both open on a 72-frame title card. Drop the `.srt` next to the MP4 with the same base name to play it in VLC or mpv. |
| `ep01-act4-v5.ad.act.vtt` / `.ad.reel.vtt` | The audio-description cues as a WebVTT `descriptions` track, on the two clocks. |
| `ep01-act4-v5.ad-script.md` | The AD script a describer reads from: each cue's time, shot, the gap it has and its estimated read time, plus the choices a reviewer should know and what didn't fit. |
| `qa-v5.json` | The measurements quoted below. |
| `tools/build_access.py` | The generator (standard library only; about a second of CPU). |
| `tools/access_v5_src.json` | **The hand-written part:** Mas's sentence case, text fixes, speaker-label overrides, the sound captions and the AD cues. Edit this, then re-run. |

All caption, AD and QA files are generated. Never hand-edit them.

## Re-run

```sh
cd /home/jgon/project/art/mrmas
python3 show/episodes/ep01/production/act4/captions/tools/build_access.py            # act + reel clocks
python3 show/episodes/ep01/production/act4/captions/tools/build_access.py --episode  # also the episode clock (+12:31)
```

It's light (no audio or video is opened), so it doesn't need `ops/heavy.sh`. Re-run it after any change to the stick timeline, the takes or the source JSON. If the pixel preview ends up with its own offset, add it to `OFFSETS` in the tool.

## The caption style (plain SDH, elevation-ideas DET-19)

- **Timing follows the lock's own frame rule.** A cue starts on the frame its first sound falls in and its speech ends after the frame of its last sound. It then holds 0.5 s, stays up at least 1 s (or length ÷ 17 characters a second when there's room), and ends 2 frames before the next cue.
- **Layout:** at most 2 rows of 42 characters. Long turns split at sentence ends, then at clause breaks, using the takes' word times, so a row break falls on a sentence or clause wherever one fits.
- **Speaker IDs only where needed:** `NAME:` in capitals when the speaker is off screen, on a call tile or monitor, a reflection, the shoulder we're looking over, or on a changed turn inside an exchange that's already labelled. There are a few forced ones: Mada's icon, the employee, the split-screen call, both "Good question."s, Mas's wide shots. Manner in parentheses only three times: `MAS (voice-over):`, `MAS (through the laptop):`, `TASYA (from the floor):`.
- **Mas is in sentence case.** The lowercase subtitle convention belongs to the parked styled track (DET-19), so the plain track reads like everyone else. The map is in the source JSON.
- **The record's words** are captioned as the take says them, with the script's print ellipses kept where the record is trimmed. They follow the verified spelling, so the letter reads **"judgement"** (facts L1) although the script and page still say "judgment". It's a homophone, so the take stands.
- **Sound captions** are bracketed, lowercase, and only for sounds the stick bed actually contains (bed.py's sound spots and room beds): the D6 `[click, then silence]`, the three `[music stops]`, the phones, rings, dial tones, stamps, the key, the door, the fire, the shatter, the refused Cancel's `[error tone]` and the vault's `[low hum]`. They're placed only in free time. `[phone clatters]` rides as its own row on top of Alyi's answer to it.
- **On-screen text isn't captioned** (posts, rails, plates, the letter): it's already on screen. When the pixel preview renders, check that no caption covers a post or the letter page. The captions sit at the default bottom position; where one collides, move that cue up (in WebVTT, a `line:10%` cue setting).

## Measured (qa-v5.json)

- **Coverage:** 149 cues: 126 for speech (all 101 lines) and 23 sound captions, with one more sound caption attached to a line. None were dropped.
- **Speaker labels:** 57.
- **Lock agreement:** every line's in and out frame agrees with `shots-locked-v5.json` to within 1 frame (0 differences).
- **Overlaps:** none.
- **Shortest cue:** 0.875 s ("Step three.").
- **Reading speed:** the maximum is 27.3 characters a second. Eight cues are over 20 cps, all because the take itself is fast:
  - Tasya's statement, 2 cues
  - Mario's eleven pages, 2 cues
  - Gerg reading the letter
  - Terb reading the announcement
  - "He's been in the building for hours."
  - "That isn't a time, Alyi."

  Verbatim captions can't slow the voice. A human should judge whether any of them needs an edited (non-verbatim) caption.
- **One designed overlap:** Mario's `…hypothetically—` cue ends 0.46 s before his voice does, because Adelina's `In plain English: no.` comes in over his last syllable.
- **Audio description:** 58 cues, 432 words.
  - Every cue fits its gap at a conservative 4.0 syllables a second, with 0.15 s of air before the next word.
  - Five are tight (AD14, AD23, AD24, AD37, AD56). They fit at an ordinary describer's pace, but not at 4.0.
  - Thirteen cues start up to 0.9 s before the cut they describe, bridging into it. The script lists them.

## The one-line on-screen disclaimer (proposal, **for legal review**)

> **A parody. Events dramatized, scenes invented. No one depicted took part in or endorsed it.**

- **Where it comes from.** It's the season's terms line from `show/production/OUTRO-PROPOSALS.md` §1.1, with one grammar fix: "took part **in** or endorsed it" (the drafted "took part or endorsed it" drops the preposition).
  - It's 90 characters, about 402 px in the 7-px face, so it still sets on one row of the 480-px frame.
  - It opens with the words of the card after the intro, "A parody. Events dramatized; scenes invented."
- **For this act's standalone previews** (the stick reel and the pixel preview), which have neither the intro's card nor an outro: hold the line on the head title card for at least 5 s. Put it on UI chrome, never on an in-world surface (outro rule 3). The pointer line `Full notice and sources: in the description.` goes under it once there's a description to point to.
- **An alternate, if legal wants companies named:**

  > **A parody. Events dramatized, scenes invented. No person or company shown took part in or endorsed it.**

  It's 101 characters, about 452 px: one row, but only 14 px of margin each side. The first version is the recommendation.
- **Questions for legal** (specific to what Act Four does):
  1. Does one line on screen, plus the 90-word notice in the description and metadata, cover a standalone clip of this act?
  2. The act voices real people's public words (the board's post, the letter, Microsoft's statement, the memo) in synthetic stock voices under parody names. Does the on-screen line need "voices synthetic, none cloned", or is the credits disclosure enough?
  3. Is `(REPORTED)` enough for items that rest on anonymous-source reporting? That covers the Q\* rail, the Loopt rail, Mario's CEO approach and Alyi's signature.
  4. Tasya's "IP rights" wording is at present sourced to a party's court filing quoting a podcast (facts L19). Should it be held off until the audio is confirmed? (It's on hold anyway.)
  5. Invented conversations are staged at real, dated events: the board's call, the all-hands, the Nozama call and the terms. `(REPORTED)` covers some of them. Does "scenes invented" cover the rest?

## What a human still has to do

1. **Watch the stick reel with the `.reel.srt` loaded.** Check the speaker IDs (too many or too few), the row breaks, and the eight fast cues.
2. **Read the AD script aloud against the mix** (start `mix.wav` at 3.000 s), time it by ear, and fix any cue that crowds a line.
3. **Get a Deaf or hard-of-hearing reviewer for the captions, and a blind or low-vision reviewer for the AD** (DET-19).
4. **When the pixel preview renders:** confirm its clock (act frame 0, or a title card first?) and check caption placement against the posts and the letter page. Re-check each AD cue against the pixel staging.
5. **Listen to the Nadella episode** for "IP rights" versus "rights" (facts L19). If it's "rights", change a5-30-06, re-record it and re-run this tool.
6. **Re-run this tool after the script changes in facts.md land:**
   - The letter's spelling is already applied here.
   - If Gerg's post is restored in full, nothing changes here, because posts aren't captioned. It changes AD19.
   - If Alyi's bridge is re-recorded, the timeline moves.

## Open issues

- The music captions (`[waltz music]`, `[music winds down]`, `[swing band music]`, the stops) describe the **temp** bed. Re-check them when the real Act Four score and mix land. The stops are designed beats and should survive.
- The AD voice isn't chosen: a human describer, or a voice designed from text, never a clone.
- The extended-AD candidates (the ones that don't fit a gap) are listed at the end of the AD script. The biggest is THE PLAN's blueprint (S1.03): the four names in the ring can't be described without pausing the picture.
