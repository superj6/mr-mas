# Ep1 stick reel v2: for review

| | |
|---|---|
| **What this is** | The whole of Episode 1 as a stick-figure animatic, with a recorded voice on every line, temp music and sound, the finished intro and the approved Act Four, strung together on one clock. It's for you to watch and mark where it drags or confuses. **Nothing has been cut for length.** |
| **Watch** | `out/ep01/reel/ep01-full-v2.mp4` (22:51.4, 1280×720, any player). Follow along in [transcript-v2.txt](transcript-v2.txt) if you want the words. |
| **What you're asked for** | Timecodes (the `EP` clock in the right-hand margin) where it drags, where you get lost, and where a line sounds wrong. Then the rulings in §8: how much to cut, which outro, and a few smaller ones. |
| **How it got here** | The showrunner, 2026-09-26: "we should simultaneously begin the stickman outline of the entire episode 1", and "we should've been iterating on cheaper stick figure runs to nail down flow and dialogue before final render". The first v2 cut (22:20.5) was read three ways: a newcomer who reads only what the show says, an insider who knows the real events, and a dialogue-and-flow audit. Five fix passes then fixed what those reads found, for clarity and naturalness only. The lead's call on length stands: build the full episode at its current length, you mark the drag, then we cut. This is the re-render with every fix in. |
| **Built** | Fully programmatic: stock Kokoro voices as cast in `audio/voices/CASTING.md` (no clones), no external APIs, `.env` untouched. |
| **Who, when** | The `ep1s-close` pass (supervising editor), 2026-09-27, about 03:37 → 04:15. Nothing committed; the lead commits. |
| **Honesty** | **Nobody has watched or listened to this cut**, me included: I can't. Every number here comes from a tool (the timelines, the mixer, a decode of the finished file). How frames read is my judgment from stills. The newcomer and insider reads were of the *first* v2 cut; nobody has re-read this one. |

---

## 0. The short version

- **It runs 22:51.4.** Story (cold open through the tag) is **22:02.4**; the rest is the 3 s reviewer slate, the 30 s intro, the 4 s card and a 12 s outro placeholder.
- **It's 30.9 s longer than the first v2 cut**, and every second is a clarity or naturalness fix: new or reworded lines, slower reads where the voices rushed, and reading time for new on-screen text (§2). Act Four is unchanged.
- **Against the format**, the story is 47 s over the top of its band (20:45 ± 0:30). The first package of cuts in [length-v2.md](length-v2.md) (about −1:00, no protected beat, Act Four untouched) would bring it back inside. **No cut is applied**; that's your call after watching (§6, §8).
- **What the reads found, and what's fixed** (§4, §5):
  - The newcomer followed the spine ("Yes, the spine is clear to a newcomer"). What lost them was mostly small: unlabelled quotes in Act Three, a few cards that meant nothing, and a tag that ends on hooks only an insider can read. Those are fixed in the picture and the lines.
  - What's *not* fixed is inside Act Four, which you've approved: whether Mas actually joined Macrosoft, the return talks happening off screen, and the first 25 s of the firing from his side. Those are yours to reopen or leave (§8).
  - The audit's biggest finding was sound, not words: Acts One and Two had no sound effects, so the score stopped on sounds that weren't there and left holes. Both acts now have a full temp sound stem.
- **It decodes cleanly:** 32,913 of 32,913 frames, 0 errors, sound and picture the same length. Loudness is −17.73 LUFS, as before. The near-silent stretches the audit called "random pauses" are down from 86 to 35, and Act One's from 50 to 1 (§9). One new one is worth an ear: 2.5 s of near-silence in the black before Act Four (13:17.8).

---

## 1. How to watch it

- **The file:** `out/ep01/reel/ep01-full-v2.mp4`. The chapter list with start times is `out/ep01/reel/ep01-full-v2-chapters.json`; a frame every 15 s is `ep01-full-v2-sheet.png`.
- **The screen:** the picture sits top left. The amber margin on the right is reviewer notes (music cue, style, the `EP` clock and the chapter clock). The strip under the picture names who's speaking. The bar at the bottom is the whole episode, with the current chapter marked.
- **Please mark drag by the `EP` clock.** All timecodes in this note are on that clock.
- **Sound:** headphones or real speakers if you can. The room tone sits low in places, and laptop speakers lose the low end of it.
- **What to ignore:** the stick figures and text cards stand in for the pixel art (the set pieces will read richer in the final); many cues are temp pads because the score isn't rendered yet; the voices are stock text-to-speech, so pitch on questions is often flat; the 12 s outro is a placeholder; the first 3 s is the reviewer's slate.

---

## 2. Runtime per segment

| Segment | Starts (EP) | Length now | First v2 cut | Change | Why it changed |
|---|---|---|---|---|---|
| Slate (reviewer only) | 0:00.0 | 3.0 s | 3.0 s | — | |
| Cold open (sc 1–4) | 0:03.0 | **30.2 s** | 30.2 s | 0 | Picture and sound fixes only |
| Intro (V1, finished) | 0:33.2 | 30.0 s | 30.0 s | — | |
| Card (filename + disclaimer) | 1:03.2 | **4.0 s** | 2.0 s | +2.0 s | Held long enough to read (§8, decision 3) |
| Act One (sc 5–12) | 1:07.2 | **5:59.7** | 5:41.1 | +18.6 s | Two new lines for the Atem leak, Sydney's first line, Tasya read slower, Gerg's question and "Oh, yes.", small holds |
| Act Two (sc 13–17) | 7:06.8 | **3:39.8** | 3:37.4 | +2.4 s | Reworded questions, the poster as one held shot, Nedib's "Longer." as its own read |
| Act Three (sc 18–23) | 10:46.6 | **2:33.7** | 2:28.0 | +5.7 s | Every monitor item now says whose it is; two lines reworded |
| Act Four (sc 24–31) | 13:20.3 | **8:38.5** | 8:38.5 | 0 | Approved; reused unchanged, with its own mix |
| Tag (sc 32–33) | 21:58.8 | **40.6 s** | 38.4 s | +2.2 s | Reading time for the new text |
| Outro (placeholder) | 22:39.4 | 12.0 s | 12.0 s | — | |
| **Episode** | | **22:51.4** | 22:20.5 | **+30.9 s** | |
| **Story** (cold open → tag) | | **22:02.4** | 21:33.5 | **+28.9 s** | |

---

## 3. The dialogue, per act

Counted from the timelines (a "conversation" is a run of lines in one scene with no gap over 3 s).

| Act | Lines | Words | Median words a line | Lines of ≤ 3 words | Longest conversation | Conversations over 20 s |
|---|---|---|---|---|---|---|
| Cold open | 3 | 33 | 10 | 1 | 11.8 s (the host's question, Mas's answer) | 0 |
| Act One | 59 (was 56) | 478 (437) | 6 (5) | 16 (18) | **44.3 s**, 12 lines: launch night, 1:14 | 5 |
| Act Two | 39 | 289 (284) | 7 (6) | 8 (9) | **41.1 s**, 10 lines: the Senate, 8:38 | 2 |
| Act Three | 22 (21) | 147 (142) | 5.5 (6) | 7 (6) | **21.9 s**, 6 lines: the executive order and the deepfakes, 12:27 | 1 |
| Act Four | 101 | 836 | 5 | 27 | **61.0 s**, 19 lines: Gerg's 2 a.m. call, 18:19 | 5 |
| Tag | 2 | 2 | 1 | 2 | — (two one-word buttons) | 0 |
| **Episode** | **226** (222) | **1,785** (1,734) | | | | **13** |

Plus the intro's one voice-over line. Act Four's numbers match its own approved report exactly.

---

## 4. The newcomer's must-understand scorecard, and what was fixed

The newcomer read the first v2 cut cold (frames every 1.5 s plus the transcript, no script or bible) and retold it. Their verdict: **"Yes, the spine is clear to a newcomer.** A 'low-key preview' becomes a phenomenon. It is paid for by a landlord whose servers it can't leave. Its CEO courts regulators while having no equity. His board has the power to fire him, and it does, without a reason it can say out loud. The staff and the landlord force him back within days, with a new board and a review of nothing in particular."

"Got it" means they retold it right with no confusion on the part that matters. "With effort" means right, but flagged as confusing or filled in from outside knowledge. Timecodes are on the new clock. Their full report: [read-v2-newcomer.txt](read-v2-newcomer.txt).

| # | What a newcomer must leave with | First v2 cut | What the fix passes did | Now |
|---|---|---|---|---|
| 1 | Mas runs NopeAI; the board meets Friday at noon; he says "noted." | Got it | — | — |
| 2 | We rewind a year, to the launch | **With effort.** "I couldn't tell what was being OK'd" in the 1993 box; no year on screen until Act One's first scene was over | The rewind's year counter stops on `2022` for a second, then slips on to 1993 ("too far"), 0:22.7; the 1993 box asks `Are you sure?` with Cancel struck out, 0:27.7; `NOV 30, 2022` on Act One's opening wide, 1:09 | Fixed on paper |
| 3 | Who's who at NopeAI: Gerg the co-founder, Rima the CTO, Alyi the chief scientist | Got it, except Alyi: "I couldn't tell whether he is physically in the room or a conscience figure" | Alyi is a real man in the doorway, seen in the glass. After "Someone should." he walks out; footsteps, the glass empty (2:11–2:14) | Fixed on paper |
| 4 | A "low-key research preview" becomes a phenomenon: a million users in five days, and a huge bill | Got it. Two snags: the typed "is anyone there?" contradicted "Nobody asked one."; "That's for them, isn't it?" was vague | The typed line now comes after Rima's joke, as Mas typing, 2:25.8; "A million people, Mas. You're actually crying for them." / "it's the bill.", 3:16 | Fixed on paper |
| 5 | Elgoog, the rival, panics | Got it | — | — |
| 6 | Macrosoft is the landlord: it pays about $10B, and NopeAI runs on its servers | Got it, but `KEYS: ONE PER TENANT` "means nothing" and "Suits you." had nothing visible to suit | Card `TASYA / THE LANDLORD · RUNS MACROSOFT`, 4:09.8; `THE CHECK · JAMMED IN THE REVOLVING DOOR`, 4:14.6; "That collar suits you." with a `COLLAR #3` card, 4:26.9 | Fixed on paper |
| 7 | Macrosoft puts NopeAI's model in its search engine to go after Elgoog; Elgoog's demo flops and it loses $100B | **With effort.** GNIB never called Macrosoft's search engine; the Drab demo not tied to Elgoog; Tasya's reply "plays like a clip" | TV `MACROSOFT UNVEILS THE NEW GNIB`, 4:54.4; Gerg: "That's our model in your search engine. Are you really going after Elgoog with it?"; "Oh, yes." before Tasya's real line, 5:00.7; ticker `ELGOOG'S DRAB DEMO GETS A TELESCOPE FACT WRONG`, 5:08.6 | Fixed on paper |
| 8 | The race is on: the landlord's clingy chatbot, a rival's leaked model, a rival launching the same day, the pause letter | **With effort.** The `5`, "Remember me?", the Atem beat ("no dialogue and no stakes"), `website: working`, who Rezeile is, who wrote `PLEASE` | Sydney opens "Hi! Isn't 2022 a lovely year?", 5:21.8; `5 TURNS`; "Will you remember me?", 5:44.9; Gerg: "Somebody leaked Atem's model…" / Mas: "give it a minute. it'll be open source.", 5:49.6; `NAPKIN → WEBSITE`, `MEMO → WEBSITE`; Oigneb and Rezeile plates, 6:47–6:54; Mas shown writing `PLEASE`, 6:58.5 | Fixed on paper |
| 9 | He charms every government into letting him help write the rules (White House, Senate with "no equity", Europe, the extinction statement) | Got it. Snags: the May 12 skyline ("no event I could read"), who is nervous at the Senate, where "cease operating" came from, that Invidia makes chips | `NEWS CLIP · ⚠ ALTERED AUDIO` on the phone and the reposts, with a wordless anchor murmur, 8:15.7–8:26.7; the chairman now says "Speaking for myself, a little." and the clone's voice sits higher, 8:58.9–9:03.2; `— MAS MANALT, ON THE EU'S DRAFT AI RULES`, 9:43.6; `AI CHIPS · QTY: MORE`, 10:35.5. The crack in the sky (10:38) stays unexplained on purpose: it's the act-out's omen | Fixed on paper |
| 10 | Act Three: in his dark room, the year piles up while he gets verified, trolls the internet and is loved on stage | **With effort.** "Act Three is a string of unattributed fragments" | Every monitor item now says whose it is: `FROM: COINWORLD · PROOF YOU'RE HUMAN`, 10:51.2; "i made it for everyone else.", 11:03.5; `MAS, ON $10M STARTUPS:`, 11:11.8; `VP SIRRAH:`, 11:19.5; `SIGNED: 7 AI COMPANIES`, 11:26.3; the lighthouse plate `MISANTHROPIC · MARIO'S LAB`; `OCT 16 · AN INVESTOR'S MANIFESTO`, 12:22.5; "which one's real?" / "the one with the pen.", 12:44.8; `MARIO'S MEMO` | Fixed on paper |
| 11 | The board fires him over a video call | Got it, from both sides. But the first 25 s from his side "are a puzzle" (the date, `TPOOL` and "i don't keep score" come before it's clear he's fired), 13:56–14:25 | Not touched: Act Four is approved and locked | **Open** (§8) |
| 12 | The weekend: the board flails (the rival lab says no, a second interim CEO, Mas in the lobby with a guest badge) | Got it, with effort: nobody said Gerg chaired the board (15:41.6); the return talks are off screen (17:03.6); "F F F F" needs the meme | Not touched (Act Four) | **Open** (§8) |
| 13 | Macrosoft offers him and Gerg a home | **Missed the outcome:** "I couldn't tell whether he actually joined" (17:47 → 19:33 → the GUEST badge) | Not touched (Act Four) | **Open** (§8) |
| 14 | What the board didn't know: 745 of 770 staff threaten to quit, Alyi signed too, the share sale is void without him | Got it | — | — |
| 15 | He's back in five days; the board is gone; Alyi's off it; Macrosoft gets a seat with no vote | Got it (Alyi's fate "implied, not stated", minor) | — | — |
| 16 | The tag: December, CEO of the Year, and the newspaper suing Macrosoft and NopeAI | **Missed:** "the episode ends on its least readable beat". Whose demo, close to what, the drawer, who the Grey Lady is, the glass | `ELGOOG DEMO: "What the quack!"`, 22:00.6; a `re-scanning the cover…` toast before "close.", 22:14.9; the drawer's contents in brackets, 22:16.9; `[ a newspaper, front page up ]`, then `COMPLAINT · THE GREY LADY v. MACROSOFT & NOPEAI · COPYRIGHT`, 22:27.4; the glass: `[ the water line: flat. Not a ripple. ]`, 22:32.5 | Fixed on paper |

**"Fixed on paper"** means the fix is in the reel and I checked it in stills, but no fresh newcomer has watched this cut. A fresh newcomer read of this render is the real test, and it's the first thing I'd run after your watch.

**Where they leaned on outside knowledge**, and it didn't cost them the thread: nearly every caption in the intro; the transformer paper behind "We published it."; the chat-turn cap; the napkin-to-website demo; the VP's "two letters"; Q\*; the duck demo; the glass-of-water ripple. These are two-level texture, left as they are.

---

## 5. The insider's drag list

The insider (knows the real events) said the first cut "runs long by about 2.5–3.5 min, and Act Four is where most of that sits", from three habits: text on screen that a character also reads aloud, typewriter reveals of long quotes, and silent dwells after a joke has landed. Their rough total was 150–230 s. Here's each note, where it sits now (their first-cut timecodes converted to this cut's clock: same beat, same offset), and what happened to it. Their full notes: [read-v2-insider.txt](read-v2-insider.txt). **"On the cut list"** means it's in [length-v2.md](length-v2.md) §3 as a proposal; nothing is applied.

**Acts One to Three and the tag**

| Now (EP) | The insider's note | Their save | What happened |
|---|---|---|---|
| 2:36–3:04 | The user counter, then two typed posts, with only "nobody noticed." | ~10 s | Partly on the cut list (#5, the drill's kitchen bar, −2.5 s). The typing speed is a reel setting, not a cut |
| 3:06–3:16 | A silent server corridor before "A million people…" | ~5 s | Not on the list |
| 4:00–4:14 | Three Macrosoft labels in a row | ~5 s | The card now says `RUNS MACROSOFT` (a clarity fix); the folds are cut #5 |
| 4:31–4:46 | Tasya's landlord speech spells out a metaphor the scene shows | ~6 s | Cut #13 (the last sentence, −3.3 s). His terms now read slower, at Act Four's approved pace, so this speech is about 3 s longer than they saw |
| 6:12–6:39 | The duel's silent stretch after "Addendum." has landed | ~15 s | Cut #1 (−10 s) |
| 6:53–7:06 | The op-ed typed out, a `PLEASE` card that didn't read, Alyi's reflection | ~7 s | `PLEASE` now shows Mas writing it (clarity). Not on the list |
| 7:16–7:28 | Mario's "sub-concerns": the weakest of four long-document gags | ~9 s | Cut #19 (package 2; Ep3's callback depends on it) |
| 7:47 | Radnus's "And it tells them what a great question it was." re-explains the launch-night joke | ~2 s | Kept: the newcomer needs the callback. Your call |
| 7:58–8:12 | Nedib's "Longer." / "I've got a big desk." | ~5 s | Not on the list |
| 8:12–8:26 | The class photo card, then a silent skyline | ~6 s | The bridge now carries the altered-audio tag and the murmur (clarity). The cut list keeps it (it balances the clone) |
| 8:45–8:59 | A straight replay of the jobs-and-tasks testimony | ~6 s | Not on the list (the Senate is never-cut) |
| 9:29–9:59 | The stamps, then a poster that retyped itself four times | ~12 s | **Fixed** as picture: one held poster, the stamps pile up. Cuts #3 and #7 trim it further |
| 9:59–10:12, 10:35–10:46 | A silent window and the signers card; Invidia after its line has landed | ~12 s | Cut #11 (NOTNIH's plate) |
| 11:03 | "i didn't need to be verified" explains the card | the line | **Replaced** by "i made it for everyone else." |
| 11:09–11:30 | "catching up: 7 weeks", then 20 s of text-only cards | ~10 s | Every card now says whose it is (clarity); cuts #2 and #4. The signpost stays: the newcomer used it |
| 12:07 | "Rima's going to wake up to forty emails about it" | ~4 s | Not on the list |
| 22:05–22:27 | `CEO OF THE YEAR` three times | ~8 s | Cut #6. The fixes added reading time here |

**Act Four** (approved; every cut there means a re-lock, a re-mix and a pixel re-render)

| Now (EP) | The insider's note | Their save | On the cut list? |
|---|---|---|---|
| 13:26 | **The big one:** the `HOW TO FIRE A CEO` blueprint lays out the coup before the call happens. "Hit the call cold, then run the blueprint afterwards as the 'how'" | — (a re-order) | No. It's a structure call for you (§8) |
| 13:53–14:44 | The firing shown twice; "super." three times in 95 s | ~15–20 s | No (told-twice is the act's design) |
| 14:48–15:04 | Neleh reads the post aloud while it's on screen | ~7 s | No |
| 15:57–16:33 | The talkiest scene, mostly recap | ~15 s | #21 (package 3) |
| 17:04–17:10 | "He's been in the building for hours…" | ~6 s | No |
| 17:47–18:04 | Tasya reads the whole statement | ~6 s | #16 (package 2) |
| 18:37–19:05 | Gerg reads the letter's quotes while each is on screen | ~15 s | No |
| 19:28 | "a desk for every one of them" repeats "a lot of desks" | ~3 s | No |
| 19:33–19:42, 21:15–21:31 | Silent dwells | ~12 s | #14 (−2 s, package 2) |
| 15:04, 16:33, 17:42 | Intro cards shown again (Rima, Mario, Tasya) | — | No |
| 13:45.9, 18:09.6, 21:37 | `(HE TOLD THE SENATE)`, `WHAT THEY DIDN'T KNOW` and the Q\* rail each explain a joke that already works | — | No |

**Everywhere:** typewriter reveals cost about 30 s across the episode. Speeding them up 1.5–2× is a reel setting (shared code), not a story cut. Not done.

**The insider's protect list** (the bookends, "it's a preview" → "You said that about the last one", the counting runner, the badge thread, "Everyone is welcome", the hearing's jokes, Gerg's build thread, Alyi "did both", and more) is untouched by every fix pass.

---

## 6. Length: the proposed packages (none applied)

From [length-v2.md](length-v2.md) §4, measured on the first v2 cut. Each one includes the one before. The fixes added 28.9 s of story, so every result lands about 29 s later than that report printed.

| | Cut | Story after (now) | Against the story band (20:15–21:15) | Touches Act Four |
|---|---|---|---|---|
| **Now** | — | **22:02.4** | 47 s over the top | — |
| **P1** (≈ −1:00) | −57.9 s | ≈ 21:04.5 | **inside**, ≈ 20 s over the centre | No |
| **P2** (≈ −2:00) | −2:02.3 | ≈ 20:00.1 | ≈ 15 s under the floor | Yes (4 cuts) |
| **P2-alt** | −2:00.3 | ≈ 20:02.1 | ≈ 13 s under the floor | No, but loses Act Three's raised-hands runner |
| **P3** (≈ −3:00) | −2:59.9 | ≈ 19:02.5 | ≈ 1:12 under the floor | Yes (6 cuts) |

- **P1** is mostly empty time and things told twice: the duel's wordless phrases shorter, the India item and NOTERB's stamp in the poster run, Act Three's holds, Act One's folds, three small jokes ("visionary", Gerg's TV question, Tasya's last sentence), NOTNIH's plate. It cuts no protected beat and doesn't touch Act Four.
- **P2 and P3** reopen Act Four, which you've approved and whose pixel preview is locked to it shot for shot.
- **Re-measure before applying.** A few items changed size in the fix passes: the poster run is now one held shot, the Atem crate now carries the leak's two lines (cut #17 would now take them too), Sydney's scene is 3.6 s longer, Gerg's TV question 1.2 s longer.
- **The band itself is open** (decision 1): the format's 22:00 assumed 43 s of credits. With a 6–15 s outro, a story at the band's centre makes a 21:23–21:32 episode.

---

## 7. What to watch and listen for

Timecodes are the `EP` clock. Everything here was measured or seen in stills, never heard.

**Cold open and intro**
- **0:17–0:22** the freeze: the hall drops to a low hum. It's now pitched where a laptop speaker can play it (−39 LUFS). Too present, or right?
- **0:22.7–0:27.7** the rewind: does the hold on `2022` read as "it tried to stop here", and do the drag and lurch sound like tape? The reel's own `◀◀ REW` label overlaps the toast for about 1.5 s (cosmetic).
- **0:27.7** 1993: does `Are you sure?` land? (`Continue?` is the noted alternative.)
- **0:33.2–1:03.2** the intro, at a −3 dB trim that's still a proposal.

**The card and Act One**
- **1:03.2** the card, now 4 s (decision 3). Its room now sits at the level of the bullpen that follows (−37.9 LUFS). The first cut dropped from the intro's last hit into 8.9 s of near-silence here.
- **1:14–2:35** launch night: the room now holds under the talk. In the first cut the gaps between lines sank to about −48.5 dBFS; now no gap anywhere in Act One falls under −42 dBFS. Alyi walks out at 2:11–2:14.
- **1:50.8** "And what if it wakes up?": it's worded as a question now, but the voice still falls.
- **3:16** Rima's tear line reads slightly fast.
- **3:31–3:53 vs 4:14–4:52** Radnus quick, Tasya unhurried: the contrast the script asks for. Tasya's terms are four separate whole reads; natural, or four breaths?
- **4:18.9** "It's stuck.": the speech-to-text still hears "It's stocking." Fallback: "It's jammed."
- **4:24.5** LEVERAGE stops on the pop of the collar.
- **5:21.8–5:47** Sydney. Her 😊s are on screen only; the voice doesn't read them.
- **5:59–6:39** the duel: 33 s with no voice (on the cut list).
- **7:03.3–7:06.8** the act-out: a felt-piano sting rings over the black, and Act Two's music starts on its first frame (the first cut blurred the two).

**Act Two**
- **7:16.8, 7:21.2** Sirrah's questions now carry the question in the words.
- **7:57.7** Nedib's door: his fountain-pen theme starts here.
- **8:15.7–8:26.7** the altered clip: the anchor's murmur is a made, wordless sound (no voice). It stops on the clone's first word.
- **8:32–9:03** the Senate: the clone's voice now sits about 1.8 semitones above the chairman's. Do they read as two people?
- **9:20.2–9:26.7** the wallet: the music stops on it, a moth flies out, the gallery gasps.
- **9:42–9:59** the poster, one held shot, stamps piling up.
- **10:31.3–10:46.6** KA-CHING, then the register's bell decaying over wind, under the crack in the sky, into the black.

**Act Three**
- **10:46.6** the join into Act Three: the first cut had 9 s of bare wind, then a 13.9 LU jump. Now the bell decays to the black and Act Three's room comes in 10 LU up.
- **13:02** "Ha ha ha! We love you guys.": the laugh is the part to check. Three spoken "ha"s, or a laugh?
- **13:17.8–13:20.3** the black before Act Four: **2.5 s of near-silence**, its last half-second near digital black (−75 dBFS) as the mixer hands over to Act Four's own mix. The first cut had the crane truck pre-lapping here; Act Three held it out because Act Four's stick mix has no crane, so the sound stopped dead at the cut. A deliberate pause, or a hole? Decision 5 would fill it.

**Act Four** (approved, unchanged)
- **13:20–21:58.8** as you approved it, with its own stick mix. The newcomer's Act Four notes are in §4 rows 11–13.

**The tag and outro**
- **21:58.8** the join from Act Four: the vault's hum now carries into the tag. The dip is down from 1.0 s to 0.7 s (the rest is Act Four's own fade-out).
- **22:14.9** "close." now answers a near miss on the scan.
- **22:25–22:35** the thud, the complaint, the glass, "noted.": about 8.5 s of room and effects only, by design. Dead air, or tension?
- **22:39.4** the outro placeholder (decision 2).

**Across the episode:** the near-silent stretches (under −42 dBFS for 0.3 s or more) fell from 86 runs, 60.8 s, to 35 runs, 26.2 s. What's left is the slate, Act Four's designed "Silence." after the Cancel click (14:01.9, 3.7 s, inside its approved mix), the black before Act Four (13:17.8, 2.5 s), the act-out blacks of Acts One and Two (0.5 s and 1.1 s), and short gaps between close lines where the mixer ducks the bed under the voices (none longer than 1.5 s). Every sudden jump in level (117) is a voice starting after a pause; no sound effect, cue or seam jumps out.

---

## 8. Open decisions

1. **The length ruling.** After watching: no cut, P1, P2, P2-alt or P3 (§6), or your own marks. Also: which frame governs now that the outro is short (the story band, or a runtime band restated with the new overhead)?
2. **The outro.** Five mock-ups, 7.5–11.9 s as built: `out/lookdev/outro/outro-compare.mp4` (side by side) and [OUTRO-PROPOSALS.md](../../../../production/OUTRO-PROPOSALS.md). The recommendation is **E, "file closed"**, with its credit block shortened; B for warmth at the same length; A if you want Mas in the last shot. The one-line disclaimer still needs a legal read. The reel carries a 12 s placeholder until you choose.
3. **The card: 4 s as rendered, or the printed 2 s?** At 2 s the 13-word disclaimer had about 1.5 s to be read. I held it 4 s here as a clarity fix. Going back is one line in the manifest.
4. **Act Four's three newcomer gaps** (§4 rows 11–13): did Mas join Macrosoft, the return talks off screen, the puzzle of the first 25 s. Plus the insider's structure note: the blueprint before the call, or after it. Act Four is approved, so each is yours to reopen or leave. Reopening means Act Four's owner edits, then a re-lock, a re-mix and a pixel re-render.
5. **Act Four's finished mix in this reel.** Act Four now has a final mix (score, 196 effects, rooms; `out/ep01/act4/animatic/act4-mix-v5-final.wav`), built for the pixel preview. This reel still plays the approved stick mix, as briefed. Swapping it in is a one-line change (`"audio": {"src": "out/ep01/act4/animatic/act4-mix-v5-final.wav", "in": 0}` on the act4 chapter) and a sound-only re-mix of about 2 min. Its mix has the crane truck, so Act Three could then turn its pre-lap back on (`PRELAP = True` in its builder, then its stem) and fill the 2.5 s near-silence at 13:17.8. Its finishing notes list three small on-screen fact fixes still to apply.
6. **Lines an ear should rule on:** the questions whose pitch still falls (1:50.8, 5:44.9, 4:55.9, 5:21.8); "It's stuck." or "It's jammed." (4:18.9); the laugh (13:02); Rima's tear line (3:16); Tasya's terms as whole reads (4:31).
7. **For other owners, not you** (listed so nothing is lost):
   - **The reel's shared mixer:** a per-bed duck, so room tone doesn't sink under every line (audit F3). Act One's stem works around it; when it lands, Act One's `ROOM_UNDUCK_DB` goes to 0. The typewriter reveal speed. Raised hands that don't read (`Figure.tsx`), and the Senate's `WITNESS` label drawn in front of the chairman (`Sets.tsx`).
   - **Casting:** a second senator voice; Nole's pace band (Act Three); ATEM's house pronunciation ("AY-tum" was used).
   - **Facts:** the tag's `COPYRIGHT`, Act Three's tagline, the $10M wording, the signers line and the manifesto attribution; Act One's invented "Oh, yes." and the −$100B figure.
   - **Character and bible files** that still quote old wording: `products-as-characters.md` ("Remember me?"), `open-questions.md` #72, `pov-and-framing.md` (Act Three's old voice-over).

---

## 9. Measured, and what still needs a person

Measured on the encoded file (`audio/reel/ep01-full-v2/measure.py`, a full decode), against the first v2 cut. The full list, with every remaining hole placed on its chapter, beat, bed and neighbouring lines, is `out/ep01/reel/ep01-full-v2-levels.json`.

| | First v2 cut | Now |
|---|---|---|
| Length, frames | 22:20.5, 32,172 | **22:51.4, 32,913** (0 decode errors) |
| Loudness, whole file | −17.74 LUFS, peak −4.14 dBFS | **−17.73 LUFS, peak −3.91 dBFS** (the limiter never engaged) |
| By chapter (LUFS) | cold open −18.7 · intro −17.1 · card −41.4 · One −18.2 · Two −17.4 · Three −19.2 · Four −17.1 · tag −26.3 · outro −26.2 | cold open −18.7 · intro −17.1 · **card −37.9** · One −17.9 · Two −17.6 · Three −19.1 · Four −17.1 · tag −26.0 · outro −26.1 |
| Digital silence (0.5 s or more) | the 3 s slate only | the 3 s slate only |
| Near-silent stretches (under −42 dBFS, 0.3 s or more) | 86 runs, 60.8 s | **35 runs, 26.2 s** |
| … in Act One | 50 runs, 35.3 s (the room ducking between lines) | **1** (0.5 s, its act-out black) |
| … in Act Two | 16, 9.1 s | 13, 7.7 s (12 short ducked gaps and its black) |
| … in Act Three | 9, 3.9 s | 11, 8.0 s (10 short ducked gaps, and **the 2.5 s black before Act Four**, which dips to −75 dBFS as the mixer hands over to Act Four's own mix) |
| … the cold open, the tag | 5 (3.7 s), 2 (0.7 s) | 4 (1.6 s), 3 (1.0 s) |
| … Act Four (its own mix) | 3.7 s "Silence." + 1.0 s at the tag join (down to −77 dBFS) | 3.7 s "Silence." + **0.7 s** at the tag join (down to −65 dBFS) |
| Intro → card | −15.8 → −41.5 LUFS (short-term), then 8.9 s of near-silence | −15.8 → −37.8, then the card's room into Act One's bullpen (−35.7) |
| Act Two → Three | 9 s of wind, then +13.9 LU at the seam | −37.2 → −27.1 (+10.1 LU) |
| Act Three → Four | the crane pre-lap: −27.8 → −26.7 | **−35.0 → −26.7**, with the black's last second at −50 LUFS |
| Act Four → tag | −32.4 → −26.9 | −32.4 → −26.4 |
| Sudden jumps (20 LU inside 0.4 s) | 107, all voices after a pause | 117, all voices after a pause |


| Measured | Needs a person |
|---|---|
| The file: 32,913 of 32,913 frames decode, 0 errors; picture 1,371.375 s, sound 1,371.392 s; loudness, holes, jumps and seams (above), from a full decode of the encoded file | **Watching it through and marking drag** (§6) |
| Runtime per segment and the dialogue counts (§2, §3), from the timelines | **Listening**: the stems, the room under the talk, the seams, the temp pads, the questions, the laugh (§7) |
| Every fix in §4 is present and legible, from stills (by the fix passes, and my contact sheet) | **A fresh newcomer read** of this cut, to confirm §4's "fixed on paper" |

---

## 10. What this closing pass changed

- **`show/reel/ep01-full/ep01-full-v2.manifest.json`:** Act One's eleven beds and Act Two's nine became each act's one temp sound stem (pasted from `audio/reel/ep01-act{1,2}-v2/manifest-part.json`); Act Two's stem starts on its first frame (`xfade` 0.05); the tag's bed too (`xfade` 0.05) with its new label; the card at 4 s (`durs`) with its room raised from −42 to −38 LUFS to meet Act One's bullpen. The previous manifest is kept in the scratch folder below.
- **`studio/src/reel/data/`:** re-synced (`sync.mjs`). Only the five v2 timelines and the manifest changed; Act Four's timeline and every other reel's data were already identical.
- **Re-rendered, re-mixed, re-measured:** `out/ep01/reel/ep01-full-v2.mp4` and its sidecars (`-chapters.json`, `-measure.json`, `-levels.json`, `-dialogue.json`, `-sheet.png`, `-seams.png`), all replaced.
- **Transcript:** [transcript-v2.txt](transcript-v2.txt), regenerated for this cut.
- **The two reads saved:** [read-v2-newcomer.txt](read-v2-newcomer.txt) and [read-v2-insider.txt](read-v2-insider.txt), verbatim (they were only in the session scratch). [assemble-v2-notes.md](assemble-v2-notes.md) gained one header row saying its numbers are the first cut's.
- **Not changed:** `script.md`, every segment's timeline, takes and stems (I checked that Act One's stem is sample-identical to a fresh build from its current timeline), Act Four, the shared reel code.
- **The machine** (the showrunner's "try not to cook/freeze my laptop"): every heavy step went through `ops/heavy.sh`, one at a time. The render started at 2 jobs × 2 browser tabs, the setting the first cut used; the CPU reached 92–95 °C with the fans at about 8,100 rpm, so I stopped it after four segments and restarted at **1 job × 3 tabs**. That ran at a load average of 3–4.5 on 14 threads, with 22–23 GB of memory free and the CPU at 78–95 °C, and it was **just as fast**: 880 s of wall time for 22:51 of reel (93.5 s of reel a minute; the first cut's 2 × 2 did 95.5). The four finished segments didn't carry over, because the Act Four pixel pass edited the shared drawing code at 03:48 and that changes the cache key (§11). The measuring decode took 47 s and peaked at 6.3 GB of memory. Free disk is 7.6 GB.

---

## 11. How to rebuild

From the repo root unless marked. Always run heavy steps through `ops/heavy.sh`, in the background, and poll the log.

```sh
# 0. After a segment's fix: rebuild that segment first, with the commands in its own notes
#    (coldopen-notes §9, act1-notes §9.5, act2-notes §10, act3-notes §11, tag-notes §5). Each timeline rebuild
#    must be followed by its stem script (coldopen_bed.py, act1_bed.py, act2_bed.py, act3_bed.py, tag_bed.py),
#    or the sound drifts off the picture. Act Four: never edit here; its owner rebuilds it.

# 1. Sync the timelines into the studio, and look at the plan (from studio/)
cd studio
node src/reel/sync.mjs
node src/reel/tools/episode.mjs ../show/reel/ep01-full/ep01-full-v2.manifest.json --plan --no-sync

# 2. Render, mix and mux (from studio/). One job, three browser tabs: the gentler setting this pass used
nohup ../ops/heavy.sh node src/reel/tools/episode.mjs ../show/reel/ep01-full/ep01-full-v2.manifest.json \
  --no-sync --jobs 1 --conc 3 > /tmp/ep01-full-v2.log 2>&1 &
#    -> out/ep01/reel/ep01-full-v2.mp4 (+ -chapters.json, -measure.json); work files in studio/out/reel-work/ep01-full-v2/
#    A sound-only change (a bed, a level, a mix swap): add --mix-only (about 1 min of mix, 30 s of mux).
cd ..

# 3. Measure the encoded file and rebuild the transcript (repo root; M = any scratch folder)
PLAN=studio/out/reel-work/ep01-full-v2/plan.json; M=<scratch>/meas
nice -n 15 ionice -c3 audio/.venv-casting/bin/python audio/reel/ep01-full-v2/measure.py out/ep01/reel/ep01-full-v2.mp4 $PLAN $M
python3 audio/reel/ep01-full-v2/transcript.py $PLAN $M
cp $M/measure-audio-video.json out/ep01/reel/ep01-full-v2-levels.json
cp $M/dialogue.json out/ep01/reel/ep01-full-v2-dialogue.json
cp $M/sheet.png out/ep01/reel/ep01-full-v2-sheet.png; cp $M/seams.png out/ep01/reel/ep01-full-v2-seams.png
cp $M/transcript.txt show/episodes/ep01/production/stick/transcript-v2.txt
```

- **Timing:** a full render is about 15 min at `--jobs 1 --conc 3` (880 s here), the mix 9 s, the mux 26 s, the measuring decode 47 s (it holds about 6 GB of memory, so run it alone).
- **"Only changed chapters re-render" has two catches.** The segment cache is keyed on the whole episode's layout, so any change in a chapter's length re-renders every chapter. It's also keyed on the studio's shared drawing code (`studio/src/shared/**`), which the Act Four pixel pass edits, so an edit there re-renders everything too. A sound-only change never re-renders picture.
- **This pass's work folder** (bundle, 21 segments, `plan.json`, `mix.wav`) is in the session scratch below, which may not last; the default work folder starts from nothing, so the first run there is a full render.

---

## 12. Files

| What | Where |
|---|---|
| The reel | `out/ep01/reel/ep01-full-v2.mp4` |
| Chapters, render timings | `out/ep01/reel/ep01-full-v2-chapters.json`, `-measure.json` |
| Levels (every hole, jump and seam, placed on its chapter, beat, bed and neighbouring lines) | `out/ep01/reel/ep01-full-v2-levels.json` |
| Dialogue counts | `out/ep01/reel/ep01-full-v2-dialogue.json` |
| Contact sheet (every 15 s), seam sheet | `out/ep01/reel/ep01-full-v2-sheet.png`, `-seams.png` |
| Transcript | [transcript-v2.txt](transcript-v2.txt) |
| The manifest | `show/reel/ep01-full/ep01-full-v2.manifest.json` |
| Segment timelines and their builders | `show/reel/ep01-full/ep01-{coldopen,act1,act2,act3,tag}-v2.json`; `audio/reel/ep01-<seg>-v2/`; Act Four `show/reel/ep01-act4-v5.json` + `audio/reel/ep01-act4-v5/mix.wav` |
| Takes | `audio/ep01/<seg>/dialogue/` (fastrec) |
| The reads (of the first v2 cut) | [read-v2-newcomer.txt](read-v2-newcomer.txt) and [read-v2-insider.txt](read-v2-insider.txt) (verbatim, first-cut timecodes), [audit-v2.md](audit-v2.md) (dialogue and flow), [length-v2.md](length-v2.md) (length and packages) |
| Each segment's handoff | [coldopen](coldopen-notes.md) §9 · [act1](act1-notes.md) §9 · [act2](act2-notes.md) §10 · [act3](act3-notes.md) §11 · [tag](tag-notes.md) §3a · [assembly](assemble-v2-notes.md) (the first v2 cut) · Act Four [edit-plan-v5](../act4/edit-plan-v5.md), [finish-v5](../act4/finish-v5.md) |
| Scratch (temporary) | `/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/ep1s-close/`: `before/` (the first v2 cut's reel, sidecars, manifest and transcript), `work/` (bundle, segments, plan, mix), `meas/`, `tcmap.py` (maps a first-cut timecode to this cut), `compare.py`, the render logs |
