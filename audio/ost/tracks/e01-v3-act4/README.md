# E01 v3 · Act Four · the Blip, told twice (score)

**What this is (pass `v3-score-b`, track A1 of [PLAN.md](../../../../show/episodes/ep01/production/full-v3/PLAN.md); v3.3 refit 2026-09-28).** Seven cues, rendered by the OST engine and laid on Act Four's own clock (0 = the segment's first frame) on the **final v3.3 lock** (`show/reel/ep01-v33/` a756708, EL `ep01-v33-el/` a170aaa; record in `lock-v33.md`, notes `script-v33-notes.md`) into one stem: `render/music.wav`, 48 kHz / 24-bit stereo, exactly the segment's length. It sits at underscore level (the avalanche at featured level) and is dry of dialogue; the mixer ducks it. **Nothing here has been listened to.** Every number below is measured.

**The first round, restored.** The lead relayed the showrunner: "i liked the initial ost that was presented… we want to make sure we're keeping a unique sound, not toning down to overly generic". So this is the first-round score (commit 7d7a99f), restored after a restrained revision was withdrawn, with one change: **the avalanche's peak is about 2 dB down**. The last two phrases are ridden −2 dB and the cue's target goes −16 → −17, because the engine normalises each cue to its target. Phrases 3–4 read −16.9 / −16.8 LUFS, against −14.9 / −15.1 before. The rest is kept:
- the Build stops dead on Gerg's look at 2 AM;
- the VICTORY LAP stays (the bible's "one size too big", one wrong element: the old dialog undercuts it);
- the board's side keeps its clockwork.

**v3.1: the refit.** The first-round material is re-spotted to the final lock, and the new beats are scored in the same voices:
- **His side opens on the shock** (`cue_noon.py`, rewritten):
  - 10–15 s of the suite's ordinary life: the sul-tasto pedal, and his felt Water Line bar with its nudge on his glass. "gerg's not on it…" sits inside it.
  - JOIN: LEVERAGE, low, from the click.
  - Alyi's sentence: LEVERAGE thins to its pedal, a soft downbeat and a grand cluster.
  - The bright hard cut to the Remove dialog: the 1-bit F F F, the cluster up a semitone, and Step Four on the pointer.
  - **DEAD STOP on the Remove click (D6).** No score through the buzz and "super.": the one silence.
- **THE PLAN moves to the board's side** (`cue_plan.py`, new):
  - Neleh's desk at 11:52: her office clock first (SFX), then her clockwork on her card and a sul-tasto pad under "Once more, before the others join."
  - Then the Blueprint as before: the waltz's walk-offs, one note per label, the held chord for "Good question.", the moth, the path and the stuck loop.
  - The tape-stop now reaches zero on **the 11:59 tick**, where PROCEDURE's first chord takes over.
- **The Sunday reversal** (`cue_board.py` f): the phones picked up and set in a row (STAFF · STAFF · INVESTORS · INVESTORS) get one dry cello pizz each, in pairs. Her clockwork then plays only in the gaps between her lines (v3.2 cuts "The staff want him back…"; "…we're no closer." stays).
- **Tuesday's invite:** one felt F4 on his Accept tap: his move, over Tasya's floor.
- **The pin:** LEVERAGE skips the pizz eighth nearest the extinguisher pin's click, so the click has its beat to itself.
- **S7.13, Ttemme's hourglass** (264 frames, full-v3/runway.md §11), in the show's voice:
  - the stamp's C pedal under his stream;
  - **THE TURN on the chat's "we're so back"** (k167): the pedal steps up to E♭ and Gerg's Build comes in;
  - **the shatter** (k173): a dead stop. The sand stands, and the music holds its breath with it (marked digital zero, to k208);
  - **the slump** (k208): the E♭ pedal back, swelling, and the Build compiling through the pour;
  - the timpani from the boardroom (k252) into the sign's VICTORY LAP.

**v3.2: the refit** (script draft 8.1; notes §3.4, §5, §10.8). v3.1's shock opening is unchanged, and so is the rest of the score. The new beats:
- **His 1:46 PM post after the blow (v32-S1.13): no score** (notes §5). The one silence now runs from the Remove click through the buzz, "super.", his thumb, his post and the fall to night, to the carve. The suite's air and then the dark room's drone (SFX) carry it. It's marked, digital zero.
- **The lobby, told twice, inside the board's side (v32-S5.00): no score, then one felt note on his look up.**
  - The split's B♭ pedal holds under the dial tone and leaves on the cut to the lobby by day. The lobby's room J-cuts in under the dial tone.
  - The lanyard, the selfie and his post get nothing.
  - On his look up at their camera (the one-pixel smile), one felt note: the nudge's G4, his small move from the glass at noon. It rings as the picture steps out into their camera's frame.
  - PROCEDURE resumes under S4.09: the phones in a row, one pizz each, and her clockwork only in the gaps.
- **The MACROSOFT badge under the door (S5.11).**
  - Tasya's floor holds through the slide and the tick against his chair leg.
  - When he sets the badge down beside the GUEST lanyard, square, and doesn't put it on, the floor's third (the violins' C5) leaves. The chord is already open when, after "leave it open.", the felt takes it back without its third.
- **Retimed beats:**
  - **Her pen runs down the list faster** (S3.02 is 1.6 s): Step Four goes in eighths, one step on each item.
  - The blog post is read silently now; the blank's F holds under it.
  - "gerg never waits to be asked." is cut: the pad alone holds Gerg's look.

**v3.3 (the refit; lock-v33.md, script-v33-notes.md).** The act is about 3.6 s shorter. The score is the same, re-spotted, with these changes:
- **S4.10b: "Okay." is cut.** Ttemme turns the page over toward us, and its back is blank. The folder's held chord leaves its F alone at that moment (the pixel pass's frame, S4.10b + 326 f): Step Four's blank, the list's "4. ____", once more.
- **S7.02–S7.03:**
  - the employee's new line (v33-a4-0001) carries the floor's pre-lap;
  - Tasya's line is a TV clip (v33-a4-0002), and its three words keep their chords (below, above, around);
  - the Rhodes bloom sits in the clip's 1.35 s hold;
  - with "Down here." cut, the floor goes home under his look down at the slate floor (S7.03).
- **Unchanged beats:** S4.02's push-in and its phones on "That is the company telling us." (their pizz follow the buzzes, as before), and the S7.13 hourglass (264 frames).
- **Kept:** X2's 5 ms rest fades, X3's early re-entry, the lobby, the badge, the shock opening and the avalanche at −2 dB.

**v3.3 polish (PLAN §6 X2, X3; audit-v32 #5, #6).** Two measured fixes, in the cue code so they carry into the v3.3 refit:
- **X2, the stop on ALYI** (film 17:13.27): the 2 AM rest went from −13 dBFS to digital zero in one sample, so it would tick. The lay now takes every designed rest and every marked silence to zero through a 5 ms fade (`v3lay.py`, shared with Act Three), like the other dead stops. On the stem, the largest sample step there is now −39.4 dBFS (was −17.2) and the second difference 0.002 (was 0.144, 474× local; now 7×).
- **X3, the night's re-entry** (film 12:45.29): the felt fifth now starts 0.4 s before the cut, under the post's last palette step to night. It's ridden 3 dB down until the nudge, so it lands as a return, not a jolt. Its velocity is 0.33 → 0.28, and the felt is notched at 442 and 218 Hz: the softer layer's sympathetic ring read as an A over the fifth. The one silence now ends at the re-entry. On the stem, the step at the cut is now −9.1 dB (the fifth is already decaying; it was an entry from digital zero on the cut). Its first 400 ms read −18.3 LUFS (v3.2: −16.2). `cues.json` lists it under `designed_hit`.

**The material.** The cues are Act Four v5's score (`../e01-act4-v5/`, read and imported read-only, never edited) and the v3 sample's 2 AM cue (`audio/reel/ep01-v3-sample/music/`, read-only). Both are copied here and re-spotted to the v3 lock, with v3's changes:
- the cuts C13–C16;
- the new V.O. (the suite, JOIN, 2 AM);
- a **lighter PROCEDURE** for the board's side;
- the script's sc 29 calls for 2 AM;
- a **bigger VICTORY LAP** at the sign.

**The moods, in order (v3-plan §6):**
- suspense where it's earned (Vegas, noon: the shock first);
- felt (that night);
- the plan, dry, on her desk (the Blueprint);
- dry procedural comedy (the board's side);
- warm, loyal and funny (2 AM);
- the one full band (the avalanche);
- a triumph one size too big (Monday and the return);
- settling into the vault's F (the coda), handing off to the tag.

## Files

| File | What |
|---|---|
| `track.py` | The CLI: it renders the seven cues, lays them, measures and writes the cue sheet. Its docstring is the map. |
| `cue_noon.py`, `cue_night.py`, `cue_plan.py`, `cue_board.py`, `cue_two_am.py`, `cue_avalanche.py`, `cue_return.py` | The seven scores. Each docstring gives its spotting and its sources. |
| `a4common.py` | v5's two cue APIs (frames for S1–S4, seconds for S5–S8) on the v3 clock. |
| `v3clock.py`, `v3lay.py`, `v3music.py` | The clock, the lay-and-measure code and the small helpers. They're identical copies of the ones in `../e01-v3-act3/`. |
| `render/music.wav`, `render/music-ringout.wav` | The Kokoro-lock stem, and the vault pedal's release past the act's last frame (4.2 s). Both git-ignored. |
| `render/music-el.wav`, `render/music-el-ringout.wav` | The same score on the ElevenLabs-timed lock. |
| `cues.json`, `cues-el.json` | The cue sheet. It has every cue's window and lay-in, every sync point, the sections with their measured levels, the marked silences and rests, and the full measurement: loudness per cue and section, digital-silence runs, holes, fragments and each cue's engine QA. |
| `render/_work/<variant>/` | The engine's outputs per cue: the underscore master, `.cue.json` (its QA), `.mid`, `-pianoroll.png` and `.lay.json`. Git-ignored. |

## Re-run

From the repo root. The render is a heavy job, so it goes through `ops/heavy.sh`: two workers, in its own 8 GB scope, one heavy job at a time. All seven cues take about 4–5 minutes once there's a slot.

```bash
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --render                  # Kokoro lock
OST_WORKERS=2 bash ops/heavy.sh audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --render --variant el     # ElevenLabs lock
... --render noon board        # only those cues (noon night plan board two_am avalanche return), then re-assemble
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --dry [--variant el]        # light: build + note QA
audio/.venv-theme/bin/python audio/ost/tracks/e01-v3-act4/track.py --assemble [--variant el]   # light: re-lay + measure
```

**Timing is parametric.** Every sync point is read from the timeline:
- the beat starts (cumulative `reelDur`, frame-rounded as `timeEpisode` does with head 0);
- the line spans and word times;
- the sounds and the on-screen texts.

The default reads `show/reel/ep01-v33/ep01-v33-act4.json`, and `--variant el` reads `show/reel/ep01-v33-el/ep01-v33-el-act4.json`. `--timeline PATH` reads any timeline with the same ids. `MRMAS_V3_LOCK=v32` (or `v31`) points the clock at an earlier lock. The cues check for the new and cut beats, so those still build (dry-built; not rendered). The v3.1 renders are at commit 14c7ec1, the first round at 7d7a99f.

A few marks aren't in the timeline:
- **v5's pixel-lock offsets from their beat:** the glass nudge, the moth, the fold's curl, mark 3, the hourglass flip, the slate door and Cancel's greying. These beats have no lines, and the ElevenLabs builder leaves such beats frame for frame, so the offsets hold.
- **His look up in the lobby** is the v3.2 pixel pass's frame: v32-S5.00's `post_click` + 26 frames (`studio/src/episodes/ep01/pixel/act4/shots.ts`).
- **S7.13's key frames** (k128 the stream, k167 the turn, k173 the shatter, k208 the slump, k252 the boardroom) are frames from S7.13's first frame, per runway.md §11.

Where a re-timed lock moves Mada's label, the avalanche's stop follows the label.

## The cue sheet

The times are the Kokoro v3.3 lock's (segment seconds). The ElevenLabs lock moves them with its beats and lines.

| s | Sequence (picture) | Palette · motif | Hits (story sounds and turns) | Thins under | Stops · transitions |
|---|---|---|---|---|---|
| 0–16.2 | **Vegas, noon: the suite's ordinary life** (S1.01–S1.02) | P01 · **the Water Line bar** (MM-07 sc 24) | an F3/C4 sul-tasto pedal bows in as air (0.04); the felt bar, swung (7.96), its **nudge G4 on his glass nudge** (9.83) with the chip square on that note only; the C4 hangs on D♭maj7 (10.46): the settle never comes | "gerg's not on it. alyi set it up. probably just the budget." sits inside the felt | the pedal holds to the JOIN click |
| 16.2–25.9 | **The call; the Remove dialog** (S1.07, v31-S1.08d) | **P03 LEVERAGE** (MM-08), low (−3 dB) | LEVERAGE's first eighth on the JOIN click (16.17); **thinned to its pedal** under Alyi's sentence (18.82: a soft downbeat and a grand cluster); his calm, one felt F4 (23.32); **the bright hard cut**: the 1-bit F F F on the dialog, the cluster up a semitone (24.17); **Step Four on Alyi's pointer** (24.02 · 24.65 · 25.27) | "Mas. The board has decided…" | **DEAD STOP on the Remove click (25.90): D6**, every stem and tail to digital zero |
| 25.9–41.0 | his tile falls; the buzz; **"super."**; **his 1:46 PM post**; the fall to night (S1.09–S1.12, v32-S1.13) | — | — | — | **no score** (marked, digital zero): the suite's air holds "super." and his post, then the dark room's drone (SFX) the fall to night, to the night's re-entry |
| 41.0–50.6 | **That night: the third mark** (S2) | P01 (MM-08 26A) | **the re-entry**: the felt's open fifth 0.4 s before the carve's cut, under the post's last palette step, 3 dB down (41.02; a designed hit); the nudge G4 before "i don't keep score." (42.67); an F3/C4 pedal under the count (45.28); the felt back on mark 3 (47.04); the settle C4 → F4 (48.12 / 48.75); **THE REWIND** (E4, B♭3: 49.38 / 50.00) | the V.O. (the G4 alone) | the whip lands on Neleh's desk |
| 50.6–79.3 | **THE PLAN at Neleh's desk, 11:52** (v31-S3.00p, S1.03–S1.05) | Neleh's clockwork · **P14 BLUEPRINT** (MM-07): the chip music box, straight, 0 ms | her office clock first (SFX; a designed rest); **her clockwork on her card** (51.14) and a sul-tasto pad; the waltz walks the three chairs off on its F F F (56.96 · 57.58 · 58.21), then the empty chairs; the 4/4 returns (60.71); **one Blueprint note per label** (the four 60.71 · NONPROFIT 62.27 · "controls" 62.90 · "company" 63.52 · THE COMPANY 66.33 · VOTES: 0 71.33 · CEO 71.96); one held chord for "Good question." (74.46); the moth's flutter (75.67); the harp draws the path, tick 1 on "1. NOON" (77.27); **the stuck G–A♭ loop** on the fold (78.52); **the tape-stop** (78.81) reaches zero **on the 11:59 tick** (79.29) | "Once more, before the others join." (the pad); Neleh's reading (the box alone, the roots, a pencil tick) | PROCEDURE's first chord on the same frame |
| 79.3–109.0 | **The board's side, 11:59** (S3.00a–S3.03) | **P02 PROCEDURE, lighter** (MM-09) | B♭m(add9) and harp harmonics on the tick; the pedal (cello B♭2 + viola F3, an octave up) from the connect (79.50), the whisper stepping down in Alyi's gaps; Neleh's clockwork under the wait (79.60); the clockwork creeping back under the tinny "super." (95.53); **Step Four on her pen's run, in eighths** (98.66 · 98.97 · 99.28); the blank's F (99.60) under the silent post; a tick under "Any objections?" (105.83); **the Post click on a tick** (108.96) | the firing (the pedal only); the post, read silently (the F alone) | — |
| 109.0–146.5 | **Rima; the all-hands; the evening** (S3.04–S3.05) | P02, lighter | one soft pizz figure after her join chime (109.45); the pedal alone under the all-hands (123.17); the spiccato pulse returns with Gerg's keycaps (136.91) | every line; the record dry | — |
| 146.5–175.4 | **NOV 18: the hearts, the boardroom, the sincere beat** (S4.01–S4.07) | P02 · **the Door + the GPU choir** · **Step Four** | a D♭ bed and the hearts' falling harp cascade (146.46); the blue heart (150.75); a pizz burst on each phone buzz (151.54 · 159.58); **the Door's head** (A♭4 → D♭5) through the door (165.96), the choir ppp under Alyi's line; the clack (166.45); **the sincere beat**: the solo viola's F E♭ D♭ over Step Four (170.17) | Neleh's speeches (the tick only); Alyi's line (the choir) | **a designed rest for the four dial tones** (173.3–175.6) |
| 175.4–194.0 | **The split: Mario** (S4.08) | P02 · **the Lighthouse** · **the Addendum** | the Lighthouse on the first ring (175.37), thinned under the talk; the Addendum on "some thoughts" (186.33); **"no." cuts its tail** (192.26) and nothing lands after it | the offer; the eleven pages | the B♭ pedal holds under the dial tone and leaves on the cut to the lobby |
| 194.0–202.0 | **The lobby by day, his side** (v32-S5.00: the GUEST lanyard, the selfie, his post, his look up at their camera) | — · **one felt note** | **no score** under the lanyard, the shutter and his post (the lobby's room; marked, digital zero); **ONE FELT NOTE, the nudge's G4, on his look up** (199.24), ringing as the picture steps out into their camera's frame | — (no lines) | the CCTV hum L-cuts into S4.09 |
| 202.0–213.3 | **Sunday: the reversal** (S4.09: the phones in a row, the ticker, the lobby camera) | P02 | **one dry cello pizz per phone** (B♭ B♭ F F: STAFF STAFF INVESTORS INVESTORS, 202.08); the pedal; her clockwork only in the gaps (212.22); a soft tick | "…we're no closer.", the badge lines (the pedal and the tick) | — |
| 213.3–234.8 | **Ttemme, the folder, the hourglass** (S4.10–S4.11) | P02 · **the hourglass** | the straight-mute accent F4 → B♭4 and the pulse on the spotlight (213.29); a held chord under the sealed folder's long beat (229.19), **leaving its F alone when the page's back turns out blank** (231.17: Step Four's blank again); **one pizz grain a beat, falling**, from the flip (232.96) | the offer (a tick) | — |
| 234.8–253.8 | **Tasya's door** (S4.12–S4.13e) | **Tasya's floor** (the landlord's mediants) + his Rhodes | A♭maj9 on the slate (silent attack, 234.88), Cmaj9 as the door opens (236.29), the Rhodes on the beats as he appears (237.79; the jangle owns the offbeats), **Emaj9 on the statement [V]** (242.52: a colour, not a swell), home to A♭maj9 and one Rhodes chord on the sign (250.83) | "You'll want to hear our statement." (the floor settles); the statement (the held chord) | — |
| 253.8–259.0 | **"Step four, Mada?"** (S4.14–S4.15) | P02 · **Mada's spinner** | the clockwork winds down (253.79) and **hangs on one held C over the blank's F** (254.62); the spinner under his silence (256.71) | "Step four, Mada?" | **the door back:** the F leaves before the dark room's drone J-cuts in; the C rings on into S5.02 and becomes the major seventh of his D-flat chord |
| 259.0–289.6 | **2 AM: the home shot (the glass, the GUEST lanyard), the hearts, the Orb, Gerg rings** (S5.02–S5.09) | **P01 warm** (D♭ lydian / A♭) · **the Water Line** · **the Build** | the felt alone in the dark (259.15); the Water Line, warm (259.78); the felt's count, quarters on the hearts' tempo on varied pitches (264.16); one held chord for the Orb's look (269.51); A♭maj9 on the ring (274.81); **the Build (chip + felt) in compile passes** (278.06 · 282.44 · 284.94 · 287.44) | "four hundred and six…" (inside the count); "the badge was a joke." / "mostly." (one chord); Mas's lines (nothing starts) | — |
| 289.6–324.2 | **The letter; ALYI; "He did both."; the check** (S5.06–S5.08) | P01 · a sul-tasto D♭3/A♭3 pedal + **a soft walking pulse** | the pedal and the walk from the letter (292.28); **out on the scroll's stop at ALYI** (310.14); **back on "He did both."** (314.29: the pedal alone); the felt returns softly with the check (318.68) | the quoted lines: only the pedal and the walk | the rest (310.14 → 314.29) is marked, digital zero |
| 324.2–335.6 | **The Build returns; the look** (S5.09-back–S5.09b) | the Build | the Build with his keys (324.31); 8 under "The company. Again. Just in case." (326.19); a soft A♭3/E♭4 pad; **a pass cut dead on his look up** (328.53 → 329.58), the pad holding | "So. Do I tell everyone to pack?" / "keep building." (the pad) | — |
| 335.6–351.2 | **The door; the badge** (S5.11) | **Tasya's floor** + his Rhodes | the floor's silent steps A♭ → C → E → A♭ (335.64 · 338.56 · 340.10 · 342.42); **one soft Rhodes chord on the door** (335.65), **a second on "desk"** (342.42); the floor holds as **the MACROSOFT badge slides under the door** (348.02); **he sets it down unworn: the floor's third leaves** (350.52) | Tasya's lines, pre-lapped through the door (the floor) | — |
| 351.2–356.8 | **"leave it open."** (S5.12) | P01 | nothing under the line; then the felt takes the landlord's chord back **without its third** (E♭3 A♭3 B♭3) and settles C4 → F4 over it (353.08) | "leave it open." | it rings out to the avalanche's first frame |
| 356.8–370.9 | **The avalanche** (S6) | **P11 SET-PIECE SWING** (MM-10 b): **the one full band**, featured, its peak ~2 dB down | MM-10's own bars at exactly 96 BPM: the compile (356.75), the Build at 16 (359.25) and the brass kick, Step Four's G-flat (361.75), **Alyi resists one beat** (363.00), Neleh's window (364.97), the board's bowed F pedal (365.81) ending silently on THE QUIET VOTE (367.62), the Water Line augmented (366.75), **the full band on C7(♯9♭13)** (369.25) | Neleh's "Has anyone read the char—" (a window with no lead) | **DEAD STOP on MADA's label** (370.92; the swung "and" of beat 3, bar 6); marked silence to the violin |
| 372.9–408.3 | **Monday: Alyi's regret; the landlord becomes the room; Tuesday's invite** (S7.01–v31-S7.03b) | **STRAIGHT** → **Tasya's floor** | **the Door on the senza-vibrato solo violin, under the post only** (375.06); on the first heart its G3 holds and decays (380.21); the floor pre-laps under it (391.76); a chord on each of **"below", "above", "around"** (398.29 · 399.55 · 400.78); the Rhodes bloom (402.02); the TV clip's 1.35 s hold; home to A♭maj9 under his look down at the slate floor (403.48); **one felt F4 on his Accept** (407.11) | the exchange (the decay); the employee's line and Tasya's TV clip (the floor, silent attacks) | — |
| 408.3–444.6 | **Tuesday night: the fires, Terb, the terms** (S7.05–S7.08) | **P03 LEVERAGE** | LEVERAGE fades in under Mada (408.88); the door bang inside it (410.12); the pin's click gets its eighth to itself; thinned to its F pedal under Terb's reading and the terms (419.75) | Terb's reading [V]; the terms | **DEAD STOP on "of what?"** (444.64 → the stamp): Mada's pause, both "good question"s and the long hold play in the room (marked, digital zero) |
| 452.6–468.4 | **The stamp; Gerg's post; Ttemme's hourglass** (S7.09–S7.13, 264 frames) | the stamp's **C pedal** · **the Build** | a low C pedal bows in on the stamp (452.66); **Gerg's Build restarts on his post** (453.31, soft, A-flat, F4–C5 under the keycaps); one pizz grain on the last grain (456.75); the pedal under his stream; **THE TURN on "we're so back"** (463.42: the pedal up to E♭, the Build comes in); **the shatter** (463.67): a dead stop, the sand stands; **the slump** (465.12): the E♭ pedal swells back and the Build compiles through the pour; the timpani rolls from the boardroom (466.96) | the posts (the pedal alone) | **the held beat** (463.67 → 465.12) is marked digital zero |
| 468.4–473.9 | **The lobby sign; the old dialog** (S8.01–S8.03) | **P09 VICTORY LAP**, one size too big | **the brass stab on the sign** (468.37) and a bar and a half of A-flat major: strings tutti, horns, a timpani roll, the Build at full, the top line E♭5 → A♭5 → C6 on violins and chip (469.30); **one chip note hangs** (470.87: the undercut); the 1993 flat line F5 · F4 · F5 under the Remove dialog (471.66); the bonk (the SFX's E3) | — | **no score from the bonk to "okay."** (marked, digital zero): the CU "silent like the first" on the lobby's neon F |
| 477.6–505.8 | **"okay."; the vault; the memo; the chair** (S8.05–S8.10) | P01 → **P05 (diegetic)**: **the vault's F** | the felt C4 → F4 over an open fifth after "okay." (477.69 / 478.11); **the vault's F**: a glass pedal F3/C4 matched to the hum's fan tones (479.46); **the Ache** (G4 + D♭5, pure beating tones) for the vault's own shot, cut with the picture (479.76–482.25) | Gerg and Mas; **the memo [V]** (the pedal alone) | **the act ends on the pedal**; its release is `render/music-ringout.wav` (4.2 s) |

## Measured

Measured on `render/music.wav` (the Kokoro v3.2 lock) and on each cue's engine cue sheet. **Nothing was heard.**

- **Length:** 24,276,000 samples, 505.7500 s: the segment's 12,138 frames exactly. 48 kHz, 24-bit, stereo.
- **Loudness, the whole act:** **−20.22 LUFS-I**, −3.15 dBTP; short-term p95 −17.41, median −21.06, max −13.96 (the VICTORY LAP).
- **Per cue** (each cue's master is normalised by the engine to its target; the window is its span on the act clock):

| Cue | Window (s) | Target | LUFS-I (window) | ST p95 | Engine: rule 12 · spectral F-major · knee | Balance p·o·b·c |
|---|---|---|---|---|---|---|
| S1 noon (the suite → LEVERAGE → the Remove dialog → D6) | 0.00–25.90 | -20 | −20.02 | −17.72 | OK · OK · 0 | 44·35·0·22 |
| S2 that night | 41.01–50.62 | -22 | −22.10 | −21.13 | OK · OK · 0 | 88·7·0·5 |
| THE PLAN (Neleh's desk, 11:52 → the 11:59 tick) | 50.62–79.29 | -20 | −19.98 | −18.06 | OK · OK · 0 | 0·60·0·40 |
| S3–S4 the board's side (lighter; the lobby, his side, inside it) | 79.29–262.15 | -21 | −20.94 | −17.76 | OK · OK · 0 | 5·72·23·0 |
| 2 AM (the badge under the door) | 259.08–356.75 | -20 | −19.92 | −18.07 | OK · OK · 0 | 70·26·0·4 |
| S6 the avalanche (featured; the peak ~2 dB down) | 356.75–370.92 | -17 | −16.91 | −15.16 | OK · OK · 0 | 18·42·18·22 |
| S7–S8 the return, the hourglass, the coda | 372.88–505.75 | -20 | −19.99 | −17.55 | OK · OK · 0 | 4·85·2·10 |

- **Silence:**
  - The 7 marked silences are all digital zero in the stem:
    - 25.90 → 41.00: D6, the Remove click → the carve (the buzz, "super.", his post, the fall to night);
    - 195.46 → 199.22: the lobby by day, his side → his look up;
    - 310.14 → 314.29: the scroll stops on ALYI → "He did both.";
    - 370.92 → 375.06: Mada's label → the violin;
    - 444.64 → 452.66: "of what?" → the stamp;
    - 463.67 → 465.12: the hourglass's held beat (k173 → k208);
    - 474.11 → 477.67: after the bonk → "okay." (the lobby CU);
  - There is no other digital silence.
  - Every hole of 0.3 s or more under −60 dBFS is one of those, or a designed rest (the act's first frames, Neleh's desk at 11:52, the four dial tones).
  - **No music run is shorter than 2 s.**
- **Rule 12** (a written A-natural over an F bass, every note boundary): 0 in all seven cues. **The knee:** 0 completions by pitch class, 0 whole.
- **The spectral F-major check** passes in all seven cues.
- **The V.O. windows** (LUFS, the bible's −24 ±2): "i don't keep score." −30.3, quieter than the window (the cue is almost all felt; v5 read −27.8); 2 AM −20.9, −25.5 (the count a little over: the V.O. sits inside the felt's pulse, as in v3.1 and the first round).
- **Sub under the room drone** (the dark room): −32.3 dB, −34.5 dB (limit −18); nothing below C3 in the night and 2 AM cues.
- **2–6 kHz band:** −16.5 dB (the avalanche) to −37.1 dB (the night); the limit is −15.
- **Cut steps** (the v3.1 audit's method: the stem's level 0.5 s either side of every cut): all eight steps of 12 dB or more sit on a cue mark, a marked silence or a designed rest: the D6 click, Neleh's desk, the first ring, the reversal's first pizz, the Orb's look, Gerg's ring, the avalanche and the bonk. **X3:** the night's fifth starts 0.405 s before the carve's cut; the stem steps −9.1 dB at the cut (the fifth already decaying), and its first 400 ms read −18.3 LUFS (v3.2 before X3: −16.2, entering from digital zero on the cut). **X2:** the ALYI stop's largest sample step is −39.4 dBFS (v3.2 before X2: −17.2).
- **Onsets:** every sync point is written on its frame. The ones read outside ±10 ms are soft bowed or sustained entries, the GM Rhodes, and v5's muted horns (as in v5).
- **Hot spots to hear** (sections louder than −17.5 LUFS-I or with ST p95 over −17, apart from the featured avalanche):
  - PLAN the path (76.6–78.5 s, −16.8 LUFS-I);
  - the held C into the dark room (259.1–260.8 s, −17.1 LUFS-I);
  - S5 the check: the felt returns (318.4–324.2 s, −17.4 LUFS-I, ST p95 −20.7);
  - S8 e VICTORY LAP, one size too big + one chip note (468.4–471.7 s, −14.3 LUFS-I).
- **Render variance:** the sampler picks its samples per note, so a held note can land 2–3 dB apart between renders.

**Every section:**

| Section | s | LUFS-I | ST p95 |
|---|---|---|---|
| S1 the suite: the pedal, the felt Water Line bar, the V.O. | 0.0–16.2 | −21.0 | −17.6 |
| S1 LEVERAGE (low): the connect, Alyi's sentence (thinned), the dialog | 16.2–25.9 | −18.6 | −18.4 |
| S2 26A: the carve and the V.O. | 41.0–45.3 | −21.8 | −21.6 |
| S2 the count and TPOOL: the pedal | 45.3–47.0 | −31.0 | — |
| S2 mark 3, the settle, the Rewind | 47.0–50.6 | −21.8 | −21.2 |
| PLAN Neleh's desk, 11:52: the clockwork, the pad | 50.6–55.2 | −23.3 | −23.1 |
| PLAN WORD + the waltz (3/4) | 55.2–60.7 | −18.7 | −18.1 |
| PLAN the labels (4/4 Blueprint, thinned under the reading) | 60.7–74.5 | −20.6 | −19.7 |
| PLAN "Good question.": the held chord | 74.5–76.6 | −22.1 | — |
| PLAN the path | 76.6–78.5 | −16.8 | — |
| PLAN the fold: stuck, the tape-stop into 11:59 | 78.5–79.3 | −17.6 | — |
| a NOON: the call, the list, the post | 79.3–109.0 | −19.7 | −17.0 |
| b Rima | 109.0–123.2 | −22.9 | −20.6 |
| c the all-hands and the evening | 123.2–146.5 | −22.6 | −20.5 |
| d NOV 18 hearts | 146.5–151.2 | −19.0 | −18.4 |
| d the boardroom: the phones, the glass | 151.2–170.2 | −22.3 | −20.5 |
| d the sincere beat | 170.2–173.6 | −17.6 | — |
| rest: the dial tones | 173.6–175.4 | −27.8 | — |
| e the rival lab (the split) | 175.4–194.0 | −22.2 | −20.3 |
| the lobby, his side: no score; one felt note on his look up | 194.0–202.0 | −20.8 | −23.9 |
| f Sunday: the reversal (the phones), the lobby camera | 202.0–213.3 | −22.5 | −21.9 |
| f Ttemme, the folder, the hourglass | 213.3–234.9 | −21.5 | −19.6 |
| g the door: Tasya's floor | 234.9–253.8 | −20.0 | −17.9 |
| h Step four? (the hang) | 253.8–259.1 | −18.2 | −17.5 |
| the held C into the dark room | 259.1–260.8 | −17.1 | — |
| S5 the dark room at 2 AM: the felt, the Water Line warm | 259.1–264.2 | −18.8 | −18.4 |
| S5 the count (the felt's pulse under the V.O.) | 264.2–269.5 | −21.2 | −20.4 |
| S5 the Orb exchange: one held chord | 269.5–274.7 | −21.3 | −20.3 |
| S5 Gerg's call: the Build in A-flat major (chip + felt) | 274.7–289.6 | −18.7 | −17.2 |
| S5 the letter: the pedal and the pulse | 289.6–310.1 | −20.4 | −19.2 |
| S5 the rest: ALYI -> "He did both." | 310.1–314.3 | −45.3 | −54.1 |
| S5 "He did both.": the pedal alone | 314.3–318.4 | −22.6 | −22.3 |
| S5 the check: the felt returns | 318.4–324.2 | −17.4 | −20.7 |
| S5 the Build returns; the look (the held note) | 324.2–335.6 | −20.4 | −17.6 |
| S5 the door: Tasya's floor (Ab -> C -> E -> Ab), two Rhodes chords; the badge (the third leaves) | 335.6–351.2 | −20.4 | −19.4 |
| S5 "leave it open.": warm, open (no third), the ring-out to the first tile | 351.2–356.8 | −18.7 | −18.1 |
| S6 phrase 1: the compile (A1, A4) | 356.8–361.8 | −17.4 | −16.6 |
| S6 phrase 2: Step Four, Alyi, Neleh (A6-A7) | 361.8–366.8 | −16.9 | −15.9 |
| S6 phrase 3: the Water Line, the quiet vote (A9) | 366.8–369.2 | −16.9 | — |
| S6 phrase 4: the full band (A13) -> the stop | 369.2–370.9 | −16.8 | — |
| S7 a the STRAIGHT violin, then its decay | 372.9–391.8 | −21.2 | −18.6 |
| S7 b Tasya's floor (pre-lap -> below/above/around -> bloom -> home) | 391.8–408.2 | −18.4 | −17.5 |
| S7 c1 LEVERAGE (fade-in -> the bang) | 408.2–419.8 | −19.0 | −18.3 |
| S7 c1 thinned to the F pedal | 419.8–444.6 | −19.5 | −18.1 |
| S7 STOP: "of what?" -> the stamp (the room) | 444.6–452.7 | −51.8 | — |
| S7 c2 the C pedal (the posts, his stream); the turn | 452.7–463.7 | −19.9 | −19.2 |
| S7 d the held beat (the sand stands), then the Build into the sign | 463.7–468.4 | −17.5 | −17.3 |
| S8 e VICTORY LAP, one size too big + one chip note | 468.4–471.7 | −14.3 | — |
| S8 e the flat line | 471.7–473.9 | −23.8 | — |
| S8 designed rest: the lobby CU, "okay." | 473.9–477.7 | −46.0 | −52.1 |
| S8 the felt settle | 477.7–479.5 | −20.8 | — |
| S8 f the vault's F (the coda) | 479.5–505.8 | −26.7 | −26.2 |

**The ElevenLabs-timed variant** (`render/music-el.wav`, `cues-el.json`, from `show/reel/ep01-v33-el/ep01-v33-el-act4.json` as it stood at 07:11 on 2026-09-28; re-run the one command if that lock changes):
- **Length:** 24,796,000 samples, 516.5833 s: its 12,398 frames exactly.
- **Loudness:** −20.23 LUFS-I, −3.15 dBTP; ST p95 −17.36.
- **Silence:** the 7 marked silences are digital zero. There is no unmarked digital silence, no undesigned hole and no fragment.
- **Checks:** rule 12 and the knee pass in every cue; the spectral F-major check passes in every cue but THE PLAN (the same tape-stop window).
- **The V.O. windows:** −29.3; 2 AM −21.7, −23.1.
- **Cut steps:** all eight steps of 12 dB or more sit on a cue mark, a marked silence or a designed rest (S4.13e, the sign's Rhodes chord, in place of the D6 click). X3: the fifth starts 0.405 s before the cut, −9.1 dB step at the cut, first 400 ms −18.3 LUFS. X2: largest sample step −43.1 dBFS.
- **The avalanche:** Mada's label lands before the swung "and" (`label_on_swing: false`), and the stop follows it.


## What a human must hear

1. **0–26 s.** The suite's pedal and the felt bar with its nudge on his glass nudge: air and one gesture, not a drone effect. Then LEVERAGE thinned under Alyi's sentence, and the bright dialog.
2. **25.9–41.4 s.** The click takes everything. Nothing plays under "super.", his post or the fall to night. Does 15 s of no score hold (the suite's air, then the drone)? The felt's fifth comes back 0.4 s before the carve's cut (41.0): a return, not a jolt?
3. **50.6–79.3 s, THE PLAN at her desk.** The clockwork on her card, the waltz and the labels, then the stuck loop and the tape-stop reaching zero on the 11:59 tick. The plan failing, not a playback fault?
4. **79–259 s, the board's side, lighter.** Do the clockwork between lines and the pedal an octave up read as dry comedy, and dignified, never a nag?
   - **98.7–99.6 s:** Step Four in eighths on her pen's run: quick, not hurried.
   - **After "no.":** only the dial tone on the pedal, which leaves on the cut to the lobby.
   - **194–202 s, the lobby:** no score, then one felt G4 on his look up at their camera. His one move inside their side, not a sting?
   - **202 s:** the four phones as four pizz: a joke about procedure, not a cartoon?
   - **231 s:** the folder's chord leaving its F alone as the page's back turns out blank: the list's blank step, not a sting?
5. **253.8–262 s.** The hang on "Step four, Mada?", with its C carried into the dark room. Does the room's first felt chord make the C its major seventh?
6. **2 AM.**
   - The walking pulse under the letter: a walk, never a heartbeat.
   - Out on ALYI and back on "He did both.": designed, not a hole?
   - The Build cut dead on his look.
   - Two Rhodes chords at the door.
   - **The badge:** the floor's third leaving as he sets it down. Felt, not heard as an event?
   - The open A-flat 6/9 ringing into the first tile.
7. **357–371 s.** The avalanche out of the ring-out with no pickup, and the dead stop on the label: the laugh, never a glitch.
8. **452.6–468.4 s, the hourglass.** THE TURN on "we're so back", the held beat as the sand stands, then the Build through the pour. The show's voice, not a trailer?
9. **468.4–471.7 s.** VICTORY LAP one size too big for a lobby sign, then the old dialog undercutting it. A laugh from scale, not a fanfare gag?
10. **479.8 s to the end.** The Ache on the vault's own shot: dread, not a sting. The pedal under the memo, and the hand-off into the tag.

## Where this departs from the brief, the script or v5, and why

1. **The board's side is lighter than v5's** (v3-plan §6, "PROCEDURE, lighter"):
   - the pedals sit an octave up, with no contrabass under the talk;
   - the viola whisper plays only under the firing, and it steps down diatonically;
   - Neleh's clockwork is the connective tissue between lines;
   - Step Four's inner voices are strings, with no bassoon.
   The Door, the choir, the sincere beat, the Lighthouse and the Addendum are v5's.
2. **C13–C16 in the music.**
   - The Door's head and the choir move into the boardroom wide under Alyi's moved line.
   - "no." cuts the Addendum's tail, and nothing lands after it: v5's "How much?" landing went with C14.
   - The floor steps to E on the one-sentence statement (C15).
   - With no card (C16) there's no REVERSAL cue. Mada's held C rings into the dark room instead, where the felt's first chord makes it a major seventh.
3. **The lobby's one felt note is the nudge's G4, not the Water Line's F.** The lock asks for "one felt note on his look up". The G4 is his glass nudge at noon, one pixel true: the same small move, now made at their camera. It's the only piano on the board's side (the exit rule keeps Mas there as record only), because this shot is his.
4. **Step Four goes in eighths on the list** (v3.2). Her pen runs the four items in 0.85 s, and Step Four is written one step per item. In quarters its blank would land in the blog post.
5. **The badge takes the floor's third, not a new sound.** The script gives the badge its SFX (the slide, the tick, the wood). The score's only move is the third leaving as he sets it down, which prepares the felt's no-third chord after "leave it open.".
6. **2 AM follows the script where it differs from the v3 sample.**
   - There's a walking pulse under the letter.
   - The music comes back on "He did both.", not at the check.
   - Tasya's Rhodes gives two chords (the door, "desk") instead of playing on the beats.
7. **The Build restarts on Gerg's post** at 453.31. OST-BIBLE §2.6 says the post restarts it; v5 kept it for the pickup only.
8. **VICTORY LAP is bigger than v5's single stab.** It's a bar and a half of A-flat major on strings, horns, a timpani roll and a chip-doubled top line, for a lobby sign, then undercut by the old dialog. That's the plan's "one size too big". The script's "a brass stab on the sign" is its downbeat. It's ridden −3.5 dB to the OUTS/stab level.
9. **The Ache sits on the vault's own shot**, because v3 has no Q\* rail. P05 makes the vault's F the score's root.
10. **The act ends on the pedal, not a fade.** The script's L-cut carries the vault's F into the tag. Its natural release past the act's last frame is `render/music-ringout.wav`, for the mix to lay at the tag's first frame if the tag's own cue doesn't carry the pedal.
11. **The avalanche is laid at exactly 96 BPM from S6.01.**
    - On the Kokoro lock the label falls on the swung "and" of beat 3, bar 6, as in v5.
    - On the ElevenLabs lock it comes earlier. The stop follows the label, so the full band plays a little less (flagged `label_on_swing: false` in `cues-el.json`).

## Hand-offs

- **To the mix (A3):**
  - Lay `render/music.wav` at 0 dB from Act Four's first frame and duck it under the dialogue (−8 to −12 dB; the V.O. windows less).
  - The marked silences are digital zero in the stem:
    - D6, the Remove click → the carve (through "super.", his post and the fall to night). The mix mutes every bus from the click to the buzz.
    - The lobby by day, his side → his look up.
    - ALYI → "He did both."
    - Mada's label → the violin.
    - "of what?" → the stamp.
    - The hourglass's held beat (k173 → k208).
    - After the bonk → "okay.".
  - `render/music-ringout.wav` is the vault pedal's release (4.2 s). Lay it at the tag's first frame if the tag's cue doesn't start on the same F pedal.
- **To the tag's composer:** the act ends on a glass F3/C4 pedal, the vault's F, at about −27 LUFS, still sounding at the last sample. The tag's MM-12 can pick it up as its root.
- **To the SFX pass (A2):** the score is tuned to the bible's SFX pitches:
  - the stamps on C;
  - the Orb's chime and the vault's hum on F;
  - the bonk on E3;
  - the keycaps at F5–C7, with the Build kept at F4–C5 under them.
  OST-BIBLE §6.8's request 1 (tune the four DTMF tones to F4 E♭4 D♭4 C4) still stands; the score rests there. The lobby's felt G4 sits over the lobby's room tone: keep the shutter and the post pop off G.
- **The pixel pass:** v5's pixel-lock offsets are used for the few marks the timeline doesn't carry (see Re-run), plus v3.2's look-up frame in the lobby. If the shots move the glass nudge, the moth, the fold's curl, mark 3, the hourglass flip, the slate door, Cancel's greying or his look up, change the offset in the cue module; the docstrings name them.
