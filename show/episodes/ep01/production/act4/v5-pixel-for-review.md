# Ep1 · Act Four · v5 pixel preview, for review

| | |
|---|---|
| **Watch first** | `out/ep01/act4/animatic/act4-animatic-v5-finalmix.mp4`: 1080p, 8:38, the pixel picture with the finished sound (the score written for this cut, the effects, the room tones and the 101 v5 takes). |
| **Then** | `out/ep01/act4/animatic/act4-v5-cancel-compare.mp4`: 35 s, the Cancel click done both ways, first GLYPH and then J1. **It needs your ruling** (§6). |
| **The cut** | Lock v5: 83 shots, 8:38.46 (TC 12:31:00 → 21:09:11). It follows the stick reel you approved shot for shot and line for line (`show/reel/ep01-act4-v5.json`, with the takes in `audio/ep01/act4/dialogue/lines-v5.json`). The script is the `## ACT FOUR` section of `show/episodes/ep01/script.md`, draft 5.1. This pass didn't change it. |
| **Status** | **Nobody has watched this at speed or listened to it, me included, because I can't.** Everything below is either a measurement taken by decoding the files or one reader's judgement from still frames. §7 lists what only a person can check. |
| **Who, when** | The supervising editor's closing note, 2026-09-27 at about 04:30. I wrote it from the passes' own records: the lock, the art, the lip-sync, the render, the mix, the picture audit and the finishing pass. I also ran a few light checks myself: file times, source checksums and stream headers. I rendered nothing. Nothing is committed; the lead commits. |

**Clocks.** *Act* time is the player's clock in every v5 film, where 0:00 is the act's first frame. *TC* is the episode timecode (mm:ss:frames). The review film's margin shows TC, and the shot list uses it. TC = act + 12:31:00. In the stick reel, add 3 s for its title card.

---

## 1. The short version

- **The pixel preview is rebuilt on the timing you approved.** Nothing was re-timed. Each film is 12,443 frames long, the same as the lock. 78 of the 82 cuts show a picture change on the lock's own frame, and the other four are explained in §5. The sound is 0 samples off the approved mix at all 101 line starts.
- **The conversations play out now:**
  - v4 had 45 lines and 176 words, and its longest conversation lasted 10 s.
  - v5 has 101 lines and 836 words. The longest conversation is 61 s (Gerg and Mas at 2 AM), and three run past 30 s.
  - The median shot went from 2.75 s to 4.0 s. Each conversation is held in one to three setups, with no cutting line by line.
- **It's pixel art throughout.** No stick figures and no text labels stand in for art. One shot still has a drawn stand-in: S7.06, Terb's entrance, which uses v4's look-around.
- **The sound is finished and on the picture in the final-mix film:**
  - the score the OST engine rendered for this cut (six continuous cues), 196 effects and 19 room beds
  - measured: −16.5 LUFS; music audible for 95.6% of the act in 6 runs, none shorter than 2 s; the only hole is the designed silence after the Cancel click
  - The review film with the margin and the picture-only film still play the stick reel's temporary bed, on purpose, until the switch in §9.1.
- **The first v5 picture went through four checks:** a fresh newcomer read, an insider read, a picture audit and a facts check. A finishing pass fixed what they found (§3.3) without moving a cut, line, mouth track or story mark.
- **Your decisions:** J1 or GLYPH at the Cancel click (§6), plus a few smaller ones (§8).
- **The laptop:**
  - Every heavy step went through `ops/heavy.sh`, one at a time, at low priority, on 2 workers.
  - The full render took 237 s. Load stayed under 5, and the temperature sensors read about 82 °C at the busiest point.
  - Free disk stayed at 7.3 GB or more; it's 7.3 GB now.

## 2. What to watch

Films are in `out/ep01/act4/animatic/` and documents in `show/episodes/ep01/production/act4/`, unless a path says otherwise.

| # | File | What it is | Use it for |
|---|---|---|---|
| 1 | `act4-animatic-v5-finalmix.mp4` | The picture only (the 480×270 show frame at 4×), with the final mix | The cold watch. It's the closest thing to the finished act |
| 2 | `act4-v5-cancel-compare.mp4` | 35.3 s: the click with GLYPH, then with J1 | The J1 ruling (§6) |
| 3 | `act4-animatic-v5.mp4` | The review frame: the picture at 3×, the editor's margin (TC, story marks, who is speaking and whether their mouth is drawn, the sound under the frame) and a transcript band, on the stick temp mix | Notes by timecode. The temp mix is missing six beats' sounds; the margin shows `NOT IN THE TEMP MIX` as each one passes. All six are in the final mix |
| 4 | `act4-animatic-v5-picture.mp4` | The picture only, on the stick temp mix | Checked to be the same picture as #1. It has the sound you approved the timing on, so it can tell a picture problem from a mix problem |
| 5 | `act4-v5-contact.png`, `act4-v5-contact-native.png` | One still per shot | A map of the act. The native sheet shows the pixel art at 1× |
| — | Comparison | v4: `act4-animatic-v4.mp4` (4:11) · the approved stick reel: `out/reel/ep01-act4-v5.mp4` (8:41 with its 3 s head) · the stick reel with the final mix: `act4-stick-v5-finalmix.mp4` | Before and after |
| — | Reading | `transcript-v5.txt` (every line and every on-screen text of more than 3 words, on both clocks) · `shotlist-v5.md` · `report-v5.md` | Following along |
| — | Captions (optional) | `captions/ep01-act4-v5.en-sdh.act.srt` (or `.vtt`); the `.reel` versions fit the stick reel | Load in the player with #1 or #4 |

## 3. What changed

### 3.1 From v4

**Script and timing.** v4 was draft 4.2, cut to its own board. v5 is draft 5.1, the conversation pass, cut to your approved stick reel. It keeps v4's shape: the same eight sequences, plus the chapter card.

**Picture.**
- **How the 83 shots were made** (the lock's verdicts): 38 reuse v4's layouts re-clocked, 35 change an existing layout, and 10 are new.
- **New art under the long conversations:**
  - the board's side of the noon call on Neleh's laptop, S3.00a–S3.05: Alyi tells Mas in plain words, Neleh reads the post once before it goes up, and Rima becomes interim CEO
  - the rival lab's phone call as one 28 s split (S4.08): the speakerphone, Adelina taking the phone, Nozama ringing
  - the lobby CCTV (S4.09)
  - Ttemme's interview with the sealed folder and the hourglass (S4.10b–S4.11)
  - Tasya's slate door and statement (S4.12–S4.13e)
  - the staff letter scrolling while its count rolls to 745 (S5.06)
  - Gerg on the monitor at 2 AM (S5.09)
  - Terb's terms (S7.06–S7.09)
  - the unpacked bullpen for the memo (S8.08)
  - the lobby from low, and the folding chair (S8.01, S8.10)
- **Mouths.** In 35 shots, 46 speaker-in-shot pairs have a mouth drawn to its take: 35 at lip scale and 11 at room scale.
  - The listener's mouth stays shut.
  - The drawing leads the sound by 1 frame (42 ms), the usual animation convention.
- **The GLYPH dissolve** at the Cancel click is drawn with the real glyph tokens. v4 drew 2-pixel marks there.
- **On the board's side of the call,** the Vegas neon behind his frozen tile moves on one clock, the picture's proof for "No. That is just him."
- **v4 is kept, and still renders exactly as before** (§5).

### 3.2 From the stick reel

**The same:**
- every cut. The stick's 84 beats make 83 shots, because S7.06-cont folds into S7.06; that is the only merge.
- every line and take, every story mark
- the temp mix under films #3 and #4

The pixel films start on the act's first frame, with no title card.

**Different:**
- **Pixel art replaces the stick figures and text cards.**
- **The on-screen text follows the facts check:**
  - Gerg's post reads `…i quit.`, lowercase, as he posted it.
  - The staff letter spells `judgement`.
  - Mas's eulogy post is dated NOV 17. That's Pacific time; NOV 18 was the UTC date.
  - The lock, the script, the takes' text and the stick timeline still have the old text. Their owners change it (§9.3).
- **The review band names a speaker only once the picture has.** Neleh is BLUEPRINT FIGURE until the S1.03 label names her.

### 3.3 The finishing pass (after the two reads, the audit and the facts check)

**Things that were broken:**
- **S5.06:** the letter never reached `ALYI (REPORTED)`, the scene's reveal. It now scrolls there before "Alyi signed it.", and his thumbnail appears only then, with no vote tick.
- **S8.03:** Mas no longer appears twice in the lobby.
- **S4.10b:** Neleh now stands left and Mada sits right, matching S4.10 and S4.12, so the scene no longer crosses the line.
- **S7.02:** Tasya now stands on the open floor to Mas's right, which matches the close-ups.
- **Tasya's lighting:** he stays warm in S4.12, S4.13e and S7.02b, and in S7.02b he turns slate only on "below".
- **The chair fire:** it goes out when Terb sprays it and stays out.
- **S4.12's nameplates:** they read NELEH and MADA. One had read ALYI at Mada's seat.

**Clearer for a newcomer:**
- **Alyi's call tile on the board's side** shows the man lit in an open doorway, not a navy reflection. That tile carries the firing line.
- **The blog post** (S3.03) underlines each word as Neleh reads it.
- **Her close-up** (S3.04b): her footnote slips circle her head.
- **Gerg's quit post** is a large popup with his profile line `president & chairman, nopeai`, so "just not the chair" has something on screen to point at.
- **The split** (S4.08): the rent meters stay dark until Nozama rings. After the hang-up, Neleh's side shows `CALL ENDED` and dims, so "How much?" no longer plays as if said to her.
- **S7.01:** the three hearts are drawn at icon size, since the next line counts them ("You sent three.").
- **S7.03:** a ripple runs across the floor under "Hello.".

**Easier to read:**
- `(HE TOLD THE SENATE)` sits clear of the border line.
- `MADA · LAST FIRER STANDING` is a large plate under his tile.
- Tasya's third plate line is at full brightness.
- The tally marks can be counted.
- The noon dialog is fully in frame.
- The falling tile drops behind the grid and the notice.
- The toasts have a door-with-arrow icon, and "rewinding…" has a rewind icon.
- Gerg's typing is calm while Mas talks.
- The lobby sign reads NOPE AI, not NOPE I.
- The keycaps pop out and fall away instead of settling on the tiles.

**Stand-ins replaced with the extra art:**
- S3.02 and S4.14: Neleh's pen hand and marker hand
- S5.01: the chapter card
- S8.01: the lobby from low
- S8.05: the stone desk
- S8.09: the screwdriver hand
- S8.10: the folding chair

Every change is logged shot by shot in [timing-v5 §9](timing-v5.md) and module by module in [art-built-v5 §5b](art-built-v5.md).

## 4. The numbers: v3, v4, v5

These are measured the same way on each cut (`report_v5.py`; the mix rows are noted). They show where to look. They aren't pass marks, and more words or longer shots aren't goals in themselves.

| | v3 | v4 | **v5** |
|---|---|---|---|
| Runtime | 4:08.88 | 4:11.50 | **8:38.46** |
| Shots | 119 | 77 | **83** |
| Mean / median shot | 2.09 / 1.88 s | 3.27 / 2.75 s | **6.25 / 4.00 s** |
| Shortest / longest shot | 0.62 / 6.25 s | 1.25 / 9.08 s | **1.00 / 28.04 s** (S4.08, the split) |
| Shots under 1.5 s / under 2 s | 48 / 72 | 2 / 17 | **2 / 12** |
| Shots over 10 s (over 20 s) | 0 | 0 | **16 (2)** |
| Most cuts in any 10 s | 8 | 5 | **5** |
| Voiced lines (+ silent posts) | 46 (+7) | 45 (+7) | **101 (+7)** |
| Words of dialogue · median a line | 184 · 4 | 176 · 4 | **836 · 5** |
| Lines of three words or fewer | 21 (46%) | 21 (47%) | **27 (27%)** |
| Dialogue's share of the act | 27% | 25% | **53%** |
| Longest conversation (3 s gap) | 12.0 s | 10.0 s | **61.0 s** (Gerg and Mas, 19 lines, 138 words) |
| Conversations of 30 s or more | 0 | 0 | **3** |
| Music: runs · audible · shortest run | 22 · 47% · 0.10 s | 5 · 92.6% · 19.4 s | **6 · 95.6% · 17.8 s** (final mix) |
| Near-silent holes, mono | 78, 70.5 s | 1, 3.6 s | stick temp mix: 2, 4.2 s · **final mix: 1, 3.6 s** (the designed silence) |
| Abrupt jumps over 15 dB, louder channel | 86 | 38 | stick temp mix: 88 · **final mix: 59, none unexplained** |
| Dialogue over music, median / lowest | — | 15.5 / 7.1 dB | **14.6 / 11.4 dB** (final mix) |
| Loudness · peak | −16.6 LUFS · −1.0 | −16.5 · −1.2 | **−16.5 LUFS · −3.2 dBTP** (final mix) |

The final-mix rows come from the mixer's own meter (`mix-v5.md`, same thresholds). `report-v5.md` measures the stick temp mix, because films #3 and #4 play it.

## 5. What was measured on the films

Measured by the render and finishing passes (`verify_v5.py`, `verify-v5.json`, the render log). I re-checked the file times, the source checksums and the stream headers at 04:30.

- **Length.** Each film has 12,443 frames (8:38.46), the same as the lock. This includes the final-mix film.
- **Cuts.** In both films, 78 of 82 cuts show their biggest picture change on the lock's own frame. The other four:
  - S2.02, S2.03 and S2.04 are one setup continuing, so the cut barely changes the picture.
  - S5.08's biggest change lands 2 frames in, as its check slides out.
  - The picture auditor's separate check agrees.
- **Same picture, same frames.** Films #3 and #4 were compared at every frame, and no frame differs by more than 1.0 on a 0–255 grey scale. A one-frame slip would show tens at every cut.
- **Sound.**
  - Films #3 and #4 are 0 samples off `mix.wav` at all 101 line starts (lowest correlation 0.9993).
  - The final-mix film is muxed onto this render of the picture (04:22:58). It is 0 samples off at the mixer's 12 check points and decodes at −16.52 LUFS and −3.25 dBTP.
- **Every frame was drawn by its own layout.** None fell back to stick marks, and no layout threw an error. The 28 GLYPH frames were spliced in from the browser renderer in both films, and outside the room area they match what Node drew. The render used the sources now on disk: the checksums of `shots5.ts`, `lipsync5.ts`, `frame5.ts` and `data-v5.ts` match the render log.
- **The comparison clip.**
  - It has 848 frames. The two passes differ only on act frames 998–1056, where J1 plays.
  - The GLYPH pass matches the main picture, GLYPH frames included.
  - Both passes are within 2 samples of the mix, and the slates are silent.
- **v4 is unchanged.** 812 of 812 test frames are identical against commit `76ea5ba`. HEAD is no longer v4's baseline, because the lead's commit `9e1df60` took in this pass's early edits.
- **Type check.** Only the 11 old `bake.ts` errors.

## 6. J1 or GLYPH at the Cancel click: the clip and the decision

**The clip** (`act4-v5-cancel-compare.mp4`, 35.3 s). Each pass runs from the start of S1.07 to the end of S1.12 (act 0:32.4–0:49.1): 9.1 s before the click and 7.5 s after, starting and ending on cuts.

| Clip time | What plays |
|---|---|
| 0:00–0:01 | Slate A |
| 0:01–0:17.7 | **A: GLYPH, as in the main cut.** The click is at 0:10.1 |
| 0:17.7–0:18.7 | Slate B |
| 0:18.7–0:35.3 | **B: J1.** The click is at 0:27.8, and J1 plays from 0:27.8 to 0:30.3 |

**In A (GLYPH):**
1. The arrow tagged `ALYI` / `CO-FOUNDER` steps onto **Cancel**, which lights up, and clicks. All sound stops.
2. His tile comes apart into glyph tokens as it drops, behind the grid (about 1.2 s).
3. `You've been removed from the meeting.` appears at 0:10.6, and the four close ranks.
4. The one-pixel smile. The phone buzzes, the room comes back, and he says "super.".

**In B (J1):**
1. The click, then a 2-frame paper flash.
2. An engraved share certificate fills the room area: a banknote bust with `THIS CERTIFIES THAT MAS MANALT HOLDS ____ SHARES`.
3. 0.6 s in, `CANCELLED` is punched through it, and the call grid shows through the holes. His engraved pupils step toward the holes.
4. It snaps back to the call. His tile, greyed with one scar row, falls through its slot, and the four close ranks.
5. J1 lasts 59 frames (2.5 s), then S1.10.

**What the measurements say:**
- The J1 pass never shows `You've been removed from the meeting.`, because J1 covers the frames where the notice appears.
- J1 runs 2 frames into S1.10, so that cut lands 2 frames late and the smile starts 2 frames late.
- J1's punch sound isn't in any mix, so both passes play the designed silence under it.

**The case for GLYPH** (style-range §6.1a, which withdrew J1 at this click):
- J1 was meant to fix a newcomer reading the click as OK. v4.2 already fixed that: the arrow lands on Cancel and Cancel lights.
- GLYPH is your device for dark foreshadowing, and this dissolve is its only readable use in the pilot. It gives the Orb's 5-frame scan earlier in the episode its rhyme. The vault's GLYPH at the end is only a hum.
- J1 adds a new medium at the climax, in a minute that already runs through the blueprint, the call, the flashback and the board's side.
- With J1, the firing is told three times in about 2 s: the certificate, the drop, then the notice.

**The case for J1:**
- The newcomer who read the first v5 picture retold the click as "they hesitated, cancelled, and he was removed anyway". They got that he was out, but not at first that the Cancel click *was* the vote; the pun came to them later. J1's `CANCELLED` says it outright.
- The blank share line calls back to `EQUITY: 0`, which is a joke for insiders.
- It's a real style leap early in the pilot, which is part of the versatility preview you asked for.

**What the decision needs** (one of these):
1. **GLYPH, as cut.** Nothing more to do. J1 goes back to style-jumps for a later home.
2. **J1.** Then also decide whether the notice survives:
   - carry `You've been removed from the meeting.` into J1's last beat, or let `CANCELLED` replace it
   - After that: J1 goes into the main render in place of the dissolve (never both), its punch is placed inside the silence and the mix re-run, and the 2-frame overlap into S1.10 is either accepted or trimmed.
   - style-range §6.1a's owner updates the slate.
3. **Not yet.** A blind read: two or three people who haven't seen either version watch the clip, in both orders, and retell the click. It's the test style-range asks for, and it takes minutes.

**My lean** (judgement from stills only): GLYPH for Ep1. It tells the firing once, in the world's own words, and a blind read can test the pun before we add a medium at the climax. The newcomer's evidence is real, though, and the call is yours.

## 7. What a person must check by watching and listening

### 7.1 Picture: watch the final-mix film at speed

| Act | TC | Shot | Check |
|---|---|---|---|
| 0:39–0:45 | 13:10:04–13:16:00 | S1.09–S1.10 | The Cancel click in motion. The dialog is fully in frame, the tile falls behind the grid and the notice, and the GLYPH dissolve should read as his tile breaking apart, not as a glitch |
| 0:49–1:00 | 13:20:02–13:31:12 | S2.01–S2.04 | Can you count the three marks as the Orb's light steps onto each one? |
| 1:03–1:22 | 13:34:00–13:52:23 | S3.00a | Alyi, now lit in his doorway, gives the firing line. Does his face read, and does the plain-words firing land? |
| 1:28–1:44 | 13:59:06–14:14:18 | S3.03 | 15.5 s on the blog page. Does the underline keep pace with her voice, or does the shot feel dead? |
| 3:12–3:40 | 15:43:11–16:11:12 | S4.08 | The 28 s split. Can you tell who's talking in each pane? Neleh's room-scale mouth is the weakest in the act. At 3:33.3 (16:04:07) her side should read as hung up before Nozama rings at 3:33.9 (16:04:21) |
| 3:56–4:16 | 16:26:21–16:46:03 | S4.10 → S4.10b | The re-staged two-shot: Neleh left, Mada right, as in the wide. Any jump in screen direction? |
| 4:18–4:44 | 16:49:12–17:15:08 | S4.12–S4.13e | Tasya stays warm. Can you read his three-line plate in its 3.1 s (from 4:21.6, 16:52:14)? S4.13d (4:33.9, 17:04:22, 7.4 s) is still almost static: held, or dead? |
| 4:58–6:00 | 17:29:15–18:31:00 | S5.04–S5.09b | The longest conversation (61 s, Gerg and Mas). Does it play? Is Gerg's calmer typing still alive, without looking like he's talking? |
| 5:17–5:40 | 17:48:02–18:10:21 | S5.06 | The letter. The scroll runs fast from 5:36.1 (18:07:03), so `ALYI (REPORTED)` lights at 5:37.6 (18:08:15), just before "Alyi signed it.". Is it too fast to follow? |
| 5:48.1 | 18:19:03 | S5.08 | `VOID IF CEO MISSING` is up 1.08 s before the cut. Can you read it? (§8) |
| 6:15–6:31 | 18:46:01–19:01:16 | S6.01–S6.06 | The avalanche, and `MADA · LAST FIRER STANDING` on the dead stop at 6:29.2 (19:00:05) |
| 6:31–6:49 | 19:01:16–19:20:00 | S7.01 | Can you count the three hearts before "You sent three."? |
| 6:49–7:05 | 19:20:00–19:36:05 | S7.02–S7.03 | Tasya right of Mas in the wide. Mas's room-scale mouth among the staff. The slate turns on "below" (6:59.3, 19:30:06). The floor ripple under "Hello." (7:03.7, 19:34:16): does it read as the floor talking? |
| 7:07–7:15 | 19:38:10–19:46:01 | S7.06 | The one stand-in left, v4's look-around. Is it acceptable for now? |
| 7:15–7:43 | 19:46:01–20:14:02 | S7.07–S7.09 | The fire goes out on the spray (7:19.3, 19:50:07) and stays out. "we'll stand." (7:33.3, 20:04:08) is still said sitting down, a known gap |
| 7:57–8:06 | 20:28:05–20:36:22 | S8.01–S8.05 | The lobby: `NOPE AI` readable, Mas only once, the greyed Cancel refused |
| 8:20–8:29 | 20:51:09–20:59:18 | S8.08 | Can you find who's talking, when the memo sits on a one-pixel mouth in a room? |
| Whole act | | | The lip-sync in motion. The mouths lead the sound by one frame by design; flag any that look early. The held-step rhythms (the neon, the door key, the dial) come from the notes, not from anyone watching |

### 7.2 Sound: listen to the final-mix film

This is the mixer's list; the details are in `mix-v5.md`.

| Act | TC | Check |
|---|---|---|
| 0:41.5–0:45.3 | 13:12:13 | The designed silence: the click, 3.5 s of nothing, then the room on the phone's buzz and "super." |
| 1:02.4–1:03.0 | 13:33:09–13:34:00 | The Rewind's reverse swell into the whip. Does it sound like a rewind, or clutter? |
| 3:10.6 · 6:29.2 · 8:02.9 | 15:41:15 · 19:00:05 · 20:33:22 | The three rests where the room tone is lifted 2 dB. A held quiet, or a hole? |
| 3:12–3:40 | 15:43:11–16:11:12 | The split's slight left/right lean. Enough to tell the panes apart? |
| 6:15–6:31, "char—" at 6:23.3 | 18:46:01–19:01:16, 18:54:06 | The full band, and the leave chime cutting Neleh off. That is on purpose: it's the act's one cut-off by the world |
| 4:58–6:00 and 6:31–7:42 | 17:29:15–18:31:00 and 19:01:16–20:13:00 | 16 lines where the music ducks deeper to keep the dialogue on top, mostly short replies over S5's pedal and in S7. Does the music breathe with the talk, or can you hear it dip? |
| Throughout | | The rooms. Do the voices sit in the suite, the office, the boardroom and the lobby? Do the device voices (Alyi and Rima on Neleh's laptop, Gerg on the monitor) sound like small speakers in a room, or like a filter? |
| Throughout | | The score's choir, reed organ and Rhodes are General MIDI SoundFont voices, played very quietly, and they may sound dated. The composers' own checklists are in `audio/ost/tracks/e01-act4-v5/README.md` |

### 7.3 Reads

- **A fresh newcomer read of this cut.** The reads so far were of the first v5 picture, before the finishing fixes.
- An insider read would help too.
- Act Four's newcomer read at the stick stage is part of the full Ep1 stick animatic's checks.

## 8. Other decisions waiting

- **`VOID IF CEO MISSING`** (S5.08, act 5:48.1, TC 18:19:03) is up 1.08 s. The fix is to move the S5.08 → S5.09-back cut about 10 frames later.
  - No line would be clipped: "what are you building?" starts 14 frames into the next shot.
  - But it moves one cut off the approved timing. The composer and the mixer would re-check that spot, because the score and the effects are placed to the current cut.
  - Or accept it as it is.
- **The landlord moment in S7.02b** (ruling R25) has three options:
  - keep the palette steps, as now
  - use the E1-P3 prototype clip, which lines up frame for frame
  - use the pixel remap, which is built but not wired in
  - If the clip wins, the optional podcast boom goes.
- **The soft far-end tiles** (STYLE-1G-SOFT): the board's tiles drawn one step softer, as a bad-connection look. It's built but switched off, pending a blind read, because it might read as our own low quality.
- **Alyi's missing clause** (facts L9, "And I can understand why you chose this word, but"). Restoring it is accurate and follows the script's own rule. But it's a re-record of about 2.5 s in S3.07, which moves everything after it, so it's best done together with any other re-lock.
- **Tasya's "IP rights"** (facts L19). Someone listens to the source podcast. If he says "all the rights", `a5-30-06` changes and is re-recorded.
- **Story questions the reads raised.** They belong to the script, which was read-only in this pass:
  - why the board fired him (open on purpose?)
  - what the Orb is
  - `YRRAL (NOT THAT YRRAL)`
  - Q\* and "it's a preview"
- **The episode master's loudness.** The act is at −16.5 LUFS and the intro master at −14. The act has about 2 dB of headroom before its limiter would work.

## 9. Next steps

### 9.1 Sound: make the score the preview's own track

**The score written for this cut already exists.** Two composers rendered six continuous to-picture cues with the OST engine from the Ep1 material (MM-07 to MM-11), written to the lock's frames (`audio/ost/tracks/e01-act4-v5/README.md`). The mixer combined them with the effects and the room tones (`mix-v5.md`). It plays in the two final-mix films.

What's left:
1. **A listen** (§7.2).
2. **Put it under the review films too.**
   - `render5.ts` takes the mix's path from `$MIX` but its offset from `data-v5.ts`: 72 frames, the stick reel's title card. The final mix has no title card, so change both. Either have `lock_v5.py` write the final mix with offset 0, or add an offset override to `render5.ts`. Otherwise the sound runs 3 s ahead of the picture.
   - Empty `MIX_MISSING` in `frame5.ts`: all six missing beats are in the final mix.
   - Re-render both films and the comparison clip.
   - Re-run verify and the report, so the numbers measure the final mix.
3. **If J1 is chosen,** place its punch inside the silence and re-run the mix.
4. **The margin's music line** lists the whole sequence's cues, not the cue under the frame. A per-shot `cues` field in the lock's `data-v5.ts` output would fix it.

### 9.2 Remaining art

None of this blocks a watch.

- **S7.06:** Terb's entrance still uses v4's look-around, the one stand-in left. It needs head turns in the shared cast rigs, which belong to the cast owner.
- **"we'll stand."** (S7.07-cont): Mas says it sitting. It needs a standing pose for the calm-off.
- **Bigger room-scale mouths** (a two-row jaw drop) for S4.08, S7.02 and S8.08. Those rigs are shared with v4, so this needs the pinned v4 check. The alternative is to stage it: listeners turn their heads to the speaker, or a slow push into the right pane.
- **S4.13d's flat composition** needs a slow push on Neleh, a clear head turn for Alyi, and a pen that visibly stops.
- **Mas's end desk** sits right of centre in the bullpen (S7.02, S8.08), where the script says left. That's a room re-staging.
- **Small things not drawn yet:**
  - Neleh's set-down pose (S1.05)
  - Rima's spotlight (S4.01)
  - the hourglass on the rack (S4.11)
  - Gerg's small typing tile (S5.11), and Gerg small in his tile (S5.09)
  - Terb's stamping hand (S7.09)
- **Taste calls:**
  - Mas's pale-teal hands read a little robotic at 1×.
  - S1.04's 2× zeros detail breaks PIXEL_GUIDE's "never scale a sprite". Both are inherited from v4.
- **The asset stills sheet** is one step behind in three stills (UI-POST, UI-LETTER-V5, ROOM-LOBBY-LOW) until the next `sheet.cjs all`.

### 9.3 Text, reads, housekeeping

- **The facts fixes are in the picture only.** The script, the takes' text, the stick timeline and the lock still read `judgment`, `…I quit.` and `NOV 18`.
  - Their owners re-run `build_timeline.py` and then `lock_v5.py`.
  - Then they diff the timeline to confirm that no frame moved.
- **Owed to a person:**
  - a watch at speed of every changed shot
  - a fresh newcomer read
  - a check that no caption covers a post or the letter
- **The older 20.2 s comparison clip,** `act4-v5-cancel-glyph-vs-j1.mp4`, is superseded. The lead can delete it; this pass didn't make it.

## 10. How to rebuild

**Laptop rules:**
- Run every heavy step through `ops/heavy.sh`, one at a time.
- Start each in the background with a log (`nohup … > $S/<step>.log 2>&1 &`) and poll the log.
- Keep Remotion at `--concurrency=4` or lower.
- Stop if free disk falls under 5 GB. It's 7.3 GB now. The v5 films take about 230 MB, plus temporary segments while rendering.

`S` is your own scratch folder.

```sh
cd /home/jgon/project/art/mrmas/studio
S=/tmp/claude-1000/-home-jgon-project-art-mrmas/<session>/scratchpad/<your-pass>

# The renderer (light)
npx esbuild src/episodes/ep01/act4/animatic/tools/render5.ts --bundle --platform=node --outfile=$S/r5.cjs
node $S/r5.cjs check          # every shot has a layout; fallbacks; the temp track; MIX_MISSING (exit 1 on a problem)

# Heavy, one at a time (measured: bundle ~10 s-1 min, glyphs ~10 s, compare ~45 s, both ~4 min on 2 workers)
../ops/heavy.sh node $S/r5.cjs bundle $S/bundle
BUNDLE=$S/bundle ../ops/heavy.sh node $S/r5.cjs glyphs $S/glyph 2
SEGDIR=$S BUNDLE=$S/bundle ../ops/heavy.sh node $S/r5.cjs compare ../out/ep01/act4/animatic/act4-v5-cancel-compare.mp4 2
GLYPH_DIR=$S/glyph SEGDIR=$S X264_THREADS=1 ../ops/heavy.sh node $S/r5.cjs both \
  ../out/ep01/act4/animatic/act4-animatic-v5.mp4 ../out/ep01/act4/animatic/act4-animatic-v5-picture.mp4 2

# Sheets, ledger, shot list, transcript (light)
node $S/r5.cjs contact ../out/ep01/act4/animatic/act4-v5-contact.png
node $S/r5.cjs contact ../out/ep01/act4/animatic/act4-v5-contact-native.png native
node $S/r5.cjs ledger ../out/ep01/act4/animatic/layout-v5.json && python3 src/episodes/ep01/act4/animatic/tools/shotlist_v5.py
python3 src/episodes/ep01/act4/animatic/tools/transcript_v5.py ../show/episodes/ep01/production/act4/transcript-v5.txt

# Checks, report, and the final-mix film (from the repo root)
cd /home/jgon/project/art/mrmas
ops/heavy.sh audio/.venv-mix/bin/python studio/src/episodes/ep01/act4/animatic/tools/verify_v5.py     # ~45 s, one decode thread
ops/heavy.sh audio/.venv-mix/bin/python studio/src/episodes/ep01/act4/animatic/tools/report_v5.py     # ~20 s
ops/heavy.sh audio/.venv-mix/bin/python studio/src/episodes/ep01/act4/animatic/tools/mix_v5_final.py --mux-only
#   (it skips a picture written in the last 3 minutes, so run it after that)

# v4 must still render exactly as before. Compare against 76ea5ba, not HEAD, which already holds v5 edits:
# a copy of studio/src/episodes/ep01/act4/art-v5/tools/v4check.mjs with `HEAD:` changed to `${process.env.REF ?? 'HEAD'}:`
# and its esbuild import made absolute (the finishing pass's copy: scratchpad/a4p5-finish/v4check-ref.mjs)
cd studio
REF=76ea5ba ../ops/heavy.sh node $S/v4check-ref.mjs $S/v4check \
  $(git diff --name-only 76ea5ba -- src/shared src/episodes/ep01/act4/animatic/plan4.ts | sed 's#^studio/##')   # prints IDENTICAL
../ops/heavy.sh npx tsc --noEmit      # expect only the 11 old bake.ts errors
```

**When to re-render:**
- after any change to `shots5.ts`, `frame5.ts`, `lipsync5.ts` or the art modules
- after `lock_v5.py` rewrites `data-v5.ts`
- Re-run `glyphs` as well if S1.09 or the margin changed. The render reports any spliced frame that no longer matches.
- A Node-only render without `GLYPH_DIR` draws v4's 2-pixel marks for those 28 frames, and says so.

## 11. Where everything is

- **Films and data** (`out/ep01/act4/animatic/`):
  - `act4-animatic-v5-finalmix.mp4`, `act4-animatic-v5.mp4`, `act4-animatic-v5-picture.mp4`, `act4-v5-cancel-compare.mp4`
  - the contact sheets
  - `layout-v5.json` (the ledger), `verify-v5.json`, `report-v5.json`, `act4-animatic-v5.mp4.render.json`
  - the final mix and its stems: `act4-mix-v5-final*.wav`, `.flac`, `.cues.json`
- **Records** (beside this file):
  - [report-v5](report-v5.md): the numbers and the render
  - [timing-v5](timing-v5.md): the lock; §9 is the finishing pass, shot by shot
  - [art-built-v5](art-built-v5.md): the assets and J1; §5b is the finishing pass
  - [lipsync-v5](lipsync-v5.md)
  - [audit-v5-pixel](audit-v5-pixel.md): the picture audit
  - [mix-v5](mix-v5.md) and [finish-v5](finish-v5.md): the sound and the finishing status
  - [shotlist-v5](shotlist-v5.md), [transcript-v5.txt](transcript-v5.txt)
  - [edit-plan-v5](edit-plan-v5.md): the plan
  - [v5-stick-for-review](v5-stick-for-review.md): the stick reel
- **Code** (`studio/src/episodes/ep01/act4/animatic/`):
  - `shots5.ts` (the 83 layouts), `frame5.ts`, `lipsync5.ts`
  - `data-v5.ts`, generated by `tools/lock_v5.py`; never hand-edit it
  - `Animatic5.tsx`, `Cancel5.tsx`, `compare5.ts`
  - `tools/render5.ts`, `verify_v5.py`, `report_v5.py`, `transcript_v5.py`, `shotlist_v5.py`, `mix_v5_final.py`
  - v4's `shots4.ts`, `frame4.ts` and `tools/*_v4.*` are untouched
- **Art:**
  - `studio/src/episodes/ep01/act4/art-v5/`: the stills registry, `j1/` and `extra/`
  - `studio/src/shared/pixel/`: the assets. Every change to a file v4 also uses is opt-in, with v4's drawing as the default.
- **Handoff:** [PREP-2026-09-26](../PREP-2026-09-26.md) marks INF-FRAME5, INF-LIPSYNC5 and INF-RENDER5 done and carries the finishing pass's one-line update.
  - INF-LOCK5 and INF-SHOTS5 are built, and timing-v5 records them.
  - Their rows in PREP §4.1 aren't marked done yet; the lead may want to tick them.
- **Scratch** (session scratchpad, may not last):
  - `a4p5-finish/`: the job scripts, the Remotion bundle, the 28 GLYPH frames, `v4check-ref.mjs`
  - `a4p5-render/`: the earlier bundle and the re-rendered frames
- **Nothing is committed.**
