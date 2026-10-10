# Ep2 v1: the full episode film (`ep1.1_her.wav`, the assembly pass, 2026-10-10)

> **Status: v1 BUILT AND MEASURED (2026-10-10): ONE film, `out/ep02/v1/ep02-v1.mp4`, 23:41.00 (34,104 frames).** It has nine titled chapters. Every QA check passes: 0 decode errors, 0 A/V lag in every chapter, 0 codec bursts, −16.05 LUFS, −1.06 dBTP, at most 1 flash in any second, 0 red flashes.
>
> **Nothing here was watched in real time or listened to [R8].** Every number is measured from the files [M]. I looked at stills only [J]: the contact sheet, every seam's two frames, the card, the tag's end and the outro (§5). §7 lists what a human must check.

**Contents:** [1. The film](#1-the-film) · [2. Chapters](#2-chapters) · [3. How it was built](#3-how-it-was-built) · [4. QA](#4-qa-measured) · [5. Looked at](#5-looked-at-j) · [6. The other passes' notes](#6-the-other-passes-notes-and-what-the-assembly-did) · [7. For a human](#7-for-a-human) · [8. Open issues and asks](#8-open-issues-and-asks) · [9. How to rebuild](#9-how-to-rebuild) · [10. Files](#10-files) · [11. LEARNINGS rules checked](#11-learnings-rules-checked)

## 1. The film

- **File:** `out/ep02/v1/ep02-v1.mp4` (git-ignored). **23:41.00** (34,104 frames at 24 fps), 135.7 MB, md5 `39d06afa6c4d…`.
- **Video:** H.264 High, CRF 18, `-tune animation`, 1920 × 1080, with a keyframe on every chapter's first frame.
- **Audio:** AAC-LC 256 kb/s, 48 kHz stereo, encoded with **libfdk_aac**.
- **Chapters:** nine titled chapters, each matching the assembly to the millisecond.
- **The lock:** the EL-timed v1 lock (`show/reel/ep02-v1-el/`, key `ep02-v1-el-stick`) and its pixel locks (`production/v1/lock/<seg>.json`).
- **Voices:** the ElevenLabs cast (set A), with MARIO on his Kokoro takes.
- **The chapters' sources:**
  - **The picture:** the picture passes' renders, concatenated per scene. Every scene's cache key was re-checked against today's code and lock (`scenes --dry`, §3).
  - **The sound:** the sound pass's mixes (495db18).
  - **The intro:** the titles pass's variant (09e604c), at the manifest's −3 dB.
  - **The card:** rendered here.
  - **The outro:** the titles pass's 15.0 s outro B with the cast page. It plays the mix's `outro-mix.wav` at −1 dB.
- **Records** (in `production/v1/assembly/`):
  - `v1-assembly.json`: every input, its length, its head md5 and the seams;
  - `v1-qa.json`;
  - `seam-frames-v1.json`;
  - the transcript, [assembly/transcript-film.txt](assembly/transcript-film.txt) (174 lines);
  - the contact sheet, `out/ep02/v1/ep02-v1-sheet.png` (143 frames, one every 10 s; committed, as Ep1's are).

## 2. Chapters

| # | Chapter | Start · length | Frames |
|---|---|---|---|
| 1 | Cold open | 0:00.00 · 55.00 | 1,320 |
| 2 | Intro | 0:55.00 · 30.00 | 720 |
| 3 | ep1.1_her.wav | 1:25.00 · 2.00 | 48 |
| 4 | Act One · the séance | 1:27.00 · 6:04.00 | 8,736 |
| 5 | Act Two · her | 7:31.00 · 4:39.00 | 6,696 |
| 6 | Act Three · leave them up | 12:10.00 · 5:20.00 | 7,680 |
| 7 | Act Four · as a guest | 17:30.00 · 5:19.00 | 7,656 |
| 8 | Tag · august | 22:49.00 · 37.00 | 888 |
| 9 | Outro · credits | 23:26.00 · 15.00 | 360 |

**As YouTube timestamps** (paste into the description). YouTube needs every chapter to be 10 s or longer, so the 2 s card rides with the intro (32 s), as in Ep1. Every other chapter is 15 s or more, and every start falls on a whole second.

```
00:00 Cold open
00:55 Intro
01:27 Act One · the séance
07:31 Act Two · her
12:10 Act Three · leave them up
17:30 Act Four · as a guest
22:49 Tag · august
23:26 Outro · credits
```

The chapter titles are the proposal's act names, already checked for spoilers ([proposal.md](proposal.md#marketing-pre-check-m1), D-16, D-45; LEARNINGS M1). None names Alyi's departure, the white room or a turn's outcome.

## 3. How it was built

1. **The pictures were checked current [M].** I bundled each segment and ran `render.ts scenes --dry` on it. Every scene of the cold open, Acts One to Four and the tag is **cached** under its current key, so the act pictures are today's code on today's lock. Two scenes, 11 and 15, differ only in the `glyph` part: a dry run has no GLYPH frames to hash, and their committed renders spliced the GLYPH frames.
2. **The card was rendered:** `ops/rebuild-act.sh --ep 2 card --only picture`, giving `out/ep02/v1/picture/card.mp4` (48 f). It didn't exist yet.
   - Flash 0.
   - Looked at frames 5, 16, 20 and 47 [J]: the name types on, the cursor follows it, and frame 47 has the cursor off.
3. **Each segment's picture was muxed with its mix:** `ops/rebuild-act.sh --ep 2 <seg> --only mux` for the cold open, the card, the four acts and the tag. The muxes are in `out/ep02/v1/picture-mux/<seg>.mp4` (`-c:v copy`, libfdk_aac 256k).
   - [M] Each mux's video and AAC durations are equal: 55.000, 2.000, 364.000, 279.000, 320.000, 319.000 and 37.000 s.
   - These are the review copies. The film itself is built from the silent pictures and the WAVs, encoded once.
4. **The film:** `assemble.py v1` (`--dry` first). Every chapter's sound is exactly its picture's length; the tool refuses to pad or trim.
   - The picture is decoded and concatenated frame for frame, then encoded once.
   - The sound is built sample-exact in numpy, with the intro at −3 dB and the outro at −1 dB.
   - At intro → card, the card's room is led in under the intro's last 0.3 s.
   - No seam needed a de-click: every sample jump is ≤ 0.01. The encode took 161 s.
5. **Measured:** `qa.py v1` (170 s) and `seam_frames.py v1`.

**One decision, judged [J]: no hum hold at the tag → outro seam.** Ep1's v3.2 seam held the tag's last frame for 18 frames over the vault's hum, because Ep1's tag ended on 1.25 s of black. Ep2's tag doesn't end on black. It ends on Mas's face, and the cut to the outro's black is the downbeat:
- proposal seam 30: "cut on the downbeat to black";
- shots-tag.md 23.09: "his reaction, not a freeze frame";
- E02-13's cue sheet: "every voice stops dead … no ring-out (the outro starts on its own music, E02-14)".

Ep1's hold would have frozen his face for 0.75 s and put the outro's first hit late. So the film cuts straight from the tag's frame 887 to the outro's frame 0.

The tag's room still carries across: the sound pass's `outro-mix.wav` lays the tag-tail stem under the outro's first 2 s. The seam measures +1.2 dB, with a sample jump of 0.0009.

The lock's episode clock counted the 18-frame hold. The film doesn't have it (§8).

## 4. QA (measured)

| Check | ep02-v1 |
|---|---|
| **Full decode** | **0 error lines**, 34,104 frames |
| **A/V lag per chapter** | **0 samples in all nine** (correlation 0.9997–1.0) |
| **Codec fidelity** (decoded against source, sample for sample) | **0 bursts in every chapter** (a burst is a run more than 0.2 of full scale off the source). Worst difference 0.116, in Act One (Ep1: 0.144) |
| **Integrated loudness** | **−16.05 LUFS** |
| **True peak** (4× oversampled) | **−1.06 dBTP** (the tag), sample peak −1.35 dBFS |
| Chapters (LUFS-I) | cold open −16.02 · intro −16.86 · card −22.18 · Act One −16.01 · Two −16.03 · Three −16.03 · Four −16.02 · tag −16.03 · outro −17.75 |
| Chapters (true peak, dBTP) | −1.91 · −4.25 · −9.23 · −1.46 · −1.08 · −1.24 · −1.48 · −1.06 · −4.09 |
| Max short-term | −11.6 LUFS (Act Three) |
| Digital zero over 5 ms / holes (under −60 dBFS for 0.3 s or more) | **none / none** |
| **Flashes** (the whole film, streamed, 160 × 90) | **max 1 in any second** (the intro at 0:59.92, Act Three at 16:19.04); **red 0**. **Pass** (limit 3) |
| Largest mean-luminance step | 0.653 at 1:00.00: the intro's own cut at f120, the same value Ep1 aired at its intro's f120 |
| Chapters / edge frames | nine, matching the assembly / every chapter's first and last frame against its source: at most 0.15 of 255 |
| Audio against picture length | +13.33 ms (the AAC tail; Ep1: +5.33) |

**Seams** (on the decoded film):

| Join | At | Step (200 ms RMS) | Sample jump | |
|---|---|---|---|---|
| cold open → intro | 0:55.00 | **−14.8 dB** | 0.0003 | the knee's fourth note on the smash, into the intro's quiet open (Ep1 aired −11.3); for an ear (§7) |
| intro → card | 1:25.00 | +0.4 | 0.0 | the card's room led in |
| card → Act One | 1:27.00 | +0.8 | 0.005 | continuous (the séance's pre-lap under the card) |
| **Act One → Two** | 7:31.00 | **+12.5** | 0.0016 | the act-out black against the Water Line's act-in hit, already softened 7 dB (sound-v1.md §7) |
| **Act Two → Three** | 12:10.00 | **+7.4** | 0.0009 | the midpoint's designed stop against THE CLOCK |
| Act Three → Four | 17:30.00 | −2.5 | 0.0097 | the DREAD ringing into the black, then the quartet's pre-lap and the beacon |
| Act Four → tag | 22:49.00 | +0.2 | 0.0038 | continuous |
| tag → outro | 23:26.00 | +1.2 | 0.0009 | the cut on the downbeat; the tag's room under the outro's first 2 s |

These match the sound pass's predictions (sound-v1.md §7) to 0.1 dB, so the assembly adds nothing at the seams.

**The decoded encode against the mixes (S8):** every chapter decodes to its source within 0.116 of full scale, with no burst. Loudness holds through the codec: each story chapter is within 0.03 LU of its mix's −16.0. Most true peaks move by under 0.1 dB from the mix QA's. The exception is Act Two, −1.37 → −1.08 dBTP: the codec adds 0.29 dB there, and the film stays under −1.0.

The card measures −22.18 LUFS (Ep1 −36.0) because Act One's séance pre-lap plays under its last 1.0 s, by design.

## 5. Looked at [J]

At native size or half size, decoded from the film:

- **The contact sheet** (all 143 frames): every chapter in order, with nothing black that shouldn't be. The only black frame on the sheet, 7:30, is Act One's act-out.
- **Every seam's last and first frame:**
  - the cold open's door → the intro's first frame;
  - the intro's `verified: human` toast → the card's cursor;
  - the card's `ep1.1_her.wav` → the séance wide;
  - Act One's black → Mas's back at the monitor;
  - Act Two's Mas at the window → the lobby and `DAYS SINCE … 176`;
  - Act Three's black → the war room;
  - Act Four's white room → the tag's desk;
  - the tag's last frame (Mas's face at the monitor) → the outro's black with the Orb.
- **The card:** frames 5, 16, 20 and 47.
- **The tag's last 48 frames** (840, 870, 885, 887): the narrowed eyes hold to the cut.
- **The outro:** o0, o3, o9, o60, o186, o250, o344 and o359. Both pages read: the credits, then the cast in two columns and the tools.

## 6. The other passes' notes, and what the assembly did

| Note | Done |
|---|---|
| Mix: `outro-mix.wav` is built from the 15.0 s outro WAV; `assemble.py --dry` stopped while it didn't exist | It exists (the sound pass, 08:11). The film plays it at −1 dB: 360 frames of picture, 720,000 samples |
| Lock: the manifests still say `dur` 10.125, and the lock clock counts the outro as 243 f | `assemble.py` takes every length from the picture's frame count and refuses a sound that doesn't match it. The manifest's `dur` is a record only, and the film's outro is 15.000 s. The manifests, `build_timeline.py` and `lock_report.py` are the lock pass's files, so I left them alone (§8) |
| Lock: the transcript's outro row doesn't list the cast and tools page | **The film's transcript does** (`qa.py` now reads the outro's words from `studio/src/episodes/ep02/outro/timeline.ts`): page 1 at 23:26:00, the cast page at 23:33:18. The lock pass's `lock_report.py` row is still open (§8) |
| The intro master is at `audio/intro/ep02/intro-ep2-mix-V1-chipchamber.wav` | Used from there, at −3 dB, as the manifest says |
| `scene_cut.py` goes up 6 folders where 7 are needed | **Fixed** (7). Tested: `scene_cut.py tag 23` writes `out/ep02/v1/review/scenes/tag-sc-23.mp4` (888 f, AAC) |
| Release: the Salamander Grand Piano (Act Three's score, CC BY 3.0) needs attribution; real tool names on screen are an open question | For the release pass (§8). The cast page shows `tools: claude code · remotion · elevenlabs · kokoro-82m` / `blender · veo 3.1 fast via runway · ffmpeg`; the film carries what the titles pass rendered |
| Human checks: the typing indicator, the designed silence, ESC, the vocal pad, the cast page's 5.5 s | Listed in §7 with their film timecodes |
| The verdict reads `viewer: verified: human` (Ep1 aired `viewer: human ✓`) | Kept as rendered: the proposal's wording. It's one string (`VERDICT`) if the showrunner wants Ep1's |
| Assembly: the decoded-encode check (S8) and the A/V lag | **Done:** 0 bursts, 0 lag in all nine chapters (§4) |
| Re-run the mix, `sound_audit.py` and `pocket.py` after any timing or score change | No timing or score changed in this pass; nothing was re-mixed |
| The ear list (sound-v1.md §9), the act-in seams, the score's act-in hits | Measured in the film (§4: they match the mix's numbers) and listed for an ear (§7) |

## 7. For a human

Nobody has watched or listened. In order, with episode timecodes (MM:SS:FF):

1. **Watch the whole film once at speed.** No measurement covers whether it plays as a story.
2. **The seams by ear:**
   - cold open → intro at 00:55:00 (−14.8 dB; Ep1 aired −11.3);
   - Act One → Two at 07:31:00 (+12.5 dB, the Water Line's hit);
   - Act Two → Three at 12:10:00 (+7.4 dB, THE CLOCK);
   - Act Three → Four at 17:30:00;
   - tag → outro at 23:26:00 (the cut on the downbeat, now with no hold). **Does it land, or does it want air?** If it wants air, the fix is the lock's (a beat of black at the tag's end), not a held frame.
3. **The intro:**
   - Does the typing indicator (00:56:14–00:59:15) read as "still typing"?
   - Does the silence under it feel designed? The music stays ducked from Ep1's stems.
   - Is the ESC keycap legible at speed (about 01:04:09–01:09:08)?
4. **The outro:**
   - Does the vocal pad's flat line (from 23:28:12) stopping before the leap (23:29:18) read as the paused voice?
   - Is the cast page's 5.5 s (23:33:18 to the cut at 23:40:09) long enough? It's a page to pause on, not to read in order.
5. **The sound pass's ear list** (sound-v1.md §9), at film times:
   - the synthesized crowds: the demo house's laughs in sc 11 (09:52–11:30), the lobby's cheer and the stream's roar in sc 19 (19:05–21:19), the party chant 14:09–14:11;
   - the ENGINEER's laugh under "Careful. The new one can hear you laugh." (08:32:22);
   - Alyi's far "Six years and eleven months." (13:46:21);
   - Rima's "and that's the demo." (10:55:20);
   - **the crosscut call (20:00:08–20:15:22).** Does it read as a phone call? Is Gerg's "You ever miss being up there?" (20:14:04) heard over the cheering lobby? If not, dip `bed_lobby_cheer`.
6. **The true peak** is −1.06 dBTP, inside −1.0 but with 0.06 dB to spare (Ep1: −1.29). A platform's re-encode can add a little. If the release wants more headroom, it comes from the tag's and Act Two's limiters, not from the assembly.

## 8. Open issues and asks

1. **For the lock pass:**
   - **The manifests' outro.** `show/reel/ep02-v1[-el]/*.manifest.json` say `dur: 10.125`; the film's outro is 15.000 s.
   - **The episode clock.** proposal.md's lock clock ends at 23:36.88 with the 18-frame hum hold; the film has no hold and ends at **23:41.00**. The arithmetic: 23:36.88 − 0.75 − 10.125 + 15.0 = 23:41.00, with the rest frame for frame.
   - **The transcript.** `lock_report.py`'s outro row still lacks the cast page.
   - None of this changes the film, which reads every length from the files.
2. **For the release pass** (`production/v1/release.md`, LEARNINGS M3–M5):
   - **The description** carries:
     - the chapters (§2);
     - the Salamander Grand Piano attribution (CC BY 3.0; Act Three's score);
     - the credit;
     - "library voices, none cloned".
   - **On-screen tool names:** whether real names (ElevenLabs, Veo, Runway) belong on the cast page stays open (OUTRO-PROPOSALS §10).
   - **The verdict's wording:** `viewer: verified: human` against Ep1's `viewer: human ✓`.
3. **The cold open → intro step** (−14.8 dB) belongs to the intro master. If the ear wants it closer to Ep1's −11.3, the fix goes in `audio/ep02/intro/` (the master's f0–24) or the cold open's last bar, not in the assembly.
4. **Resource asks (R16, non-blocking):**
   - **Human viewers and listeners for §7.** This is the one thing no pass here can supply.
   - A recorded crowd library, if the synthesized crowds read thin (sound-v1.md §13).

## 9. How to rebuild

From the repo root. `PY=audio/.venv-casting/bin/python`, `A=show/episodes/ep02/production/v1/assembly`, `S` = your scratch folder. Every heavy step goes through `ops/heavy.sh`, one at a time (MRMAS_MAX_LOAD=40 while another project holds the load).

```sh
ops/rebuild-act.sh --ep 2 card --only picture                         # the card (only if its timeline changes)
for s in coldopen card act1 act2 act3 act4 tag; do ops/rebuild-act.sh --ep 2 $s --only mux; done   # review muxes
ASM_SCRATCH=$S bash ops/heavy.sh $PY $A/tools/assemble.py v1 --dry    # every length, every seam, no encode
ASM_SCRATCH=$S setsid bash ops/heavy.sh $PY $A/tools/assemble.py v1 < /dev/null   # -> out/ep02/v1/ep02-v1.mp4 (about 3 min)
ASM_SCRATCH=$S setsid bash ops/heavy.sh $PY $A/tools/qa.py v1 < /dev/null         # -> v1-qa.json, transcript-film.txt, the sheet (about 3 min)
bash ops/heavy.sh $PY $A/tools/seam_frames.py v1                                   # -> seam-frames-v1.json
# or, after a changed act: ops/rebuild-act.sh --ep 2 <act> --only film
```

- **Gotcha:** run as a background job, `heavy.sh`'s memory-capped scope stopped at once (exit 147) until it was detached from the terminal (`setsid … < /dev/null`). In the foreground it runs as written.
- **Tool changes in this pass:**
  - `assemble.py`: v1's transcript is `transcript-film.txt`, and there is no hum hold (`hum_gap=None`, with the reason in a comment; `hum_gap()` is kept).
  - `qa.py`: the transcript's intro row adds Mas's "her" (intro f23). The outro gets two rows, read from the outro's `timeline.ts`.
  - `scene_cut.py`: the repo root is 7 folders up.

## 10. Files

- **New:**
  - this file;
  - `assembly/transcript-film.txt`, `assembly/v1-assembly.json`, `assembly/v1-qa.json`, `assembly/seam-frames-v1.json`;
  - `out/ep02/v1/ep02-v1-sheet.png`.
- **Changed:**
  - `assembly/tools/assemble.py`, `qa.py`, `scene_cut.py`;
  - [pipeline.md](pipeline.md) §7.1 (two lines: the film is built, and there is no hum hold).
- **Generated, git-ignored:**
  - `out/ep02/v1/ep02-v1.mp4`;
  - `out/ep02/v1/picture/card.mp4` (and its `.render.json` and `.srt`) and the scene cache `out/ep02/v1/scenes/card/`;
  - `out/ep02/v1/picture-mux/*.mp4`;
  - `out/ep02/v1/review/scenes/tag-sc-23.mp4`.
- **Untouched:**
  - every Ep1 path (`sha1sum -c ops/reorg/ep01-final.sha1` after the pass: 31 OK, 0 differ);
  - all shared code;
  - the locks, manifests, pictures, score and mixes;
  - `out/season/intro/` and `audio/intro/mix/`.

## 11. LEARNINGS rules checked

- **S8** [M]: measured on the decoded film.
  - −16.05 LUFS and −1.06 dBTP.
  - 0 decode errors and 0 A/V lag.
  - 0 codec bursts with libfdk_aac.
- **P15** [M]: at most 1 flash in any second over the whole film, 0 red.
- **P16** [M, J]: the frame around the acts.
  - The cold open hands off to the Ep2 intro.
  - The card is the filename alone, 2 s.
  - The outro is B, with `art · script · music · voices · edit: opus 5.5` / `prompt: jgon`, and no disclaimer, terms line or pointer.
- **P1** [M]: 1080p.
- **P5** [J]: the stills of §5.
- **M1** [J]: the chapter titles are spoiler-free (§2).
- **M4** [M]: the chapters are at least 10 s, with the card folded into the intro.
- **R1** [M]: no Ep1 path or shared file touched; Ep1's final sha1 is unchanged.
- **R8**: every claim is tagged, and §7 lists what a human must check.
- **R10**: every heavy job went through `ops/heavy.sh`, one at a time; the flash check is streamed.
- **R11**: keyscan before the commit and the push.
- **R13**: this note.
- **R14**: scratch only in this session's scratchpad.
- **Broken on purpose:** none.
- **Changed from the pipeline's plan:** the hum hold (§3, with its reason).
