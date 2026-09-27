# Ep1 stick reel v2: dialogue and flow audit (`ep01-full-v2`)

| | |
|---|---|
| **What this is** | A conversation-by-conversation audit of the full Ep1 stick reel, `out/ep01/reel/ep01-full-v2.mp4` (22:20.5). It covers the dialogue (complete thoughts, real answers, blurts, cut-offs, whether each scene's want, obstacle, turn and cost come through), the coverage, how each take is delivered, the sound bed, and the chapter seams. Every spot that hurts has an episode timecode and a fix (§2). |
| **Why** | The showrunner, 2026-09-26: "we should've been iterating on cheaper stick figure runs to nail down flow and dialogue before final render". The notes this audit checks against: SHOWRUNNER-NOTES 8 (scenes to be felt), 11 (let conversations play out; no blurts or random cut-offs), 17 (no random pauses of silence; the score must not play in fragments) and 13 (clear to a newcomer). **The lead's call on length:** the fixes here are for clarity and naturalness, not length. Length is in [length-v2.md](length-v2.md) (the `ep1s-length` pass), and nothing here is a cut. |
| **Who, when** | The `ep1s-flowaudit` pass, 2026-09-27, about 02:30 → 03:00. |
| **State** | Report only. This is the only file I wrote in the repo. `script.md` was not touched, and nothing was committed. |
| **Honesty** | I can't watch or listen. Every number comes from a tool: the timelines, the take rows, pYIN pitch on every take, Whisper's transcripts (already in the take rows), a level pass over the episode mix, one decode of 6 s of the MP4's audio, and 18 frames from the MP4. **Question intonation** rests on two machine signals (pYIN contour and Whisper's punctuation). Where they agree I report it, but an ear decides. **Missing sound effects** are inferred from the bed labels and segment notes, and confirmed as flat room tone in the level measurements. Nobody has listened to them. |
| **Machine care** | Nothing here needed `ops/heavy.sh`: no render, no Kokoro. Every step ran one at a time on one thread at `nice 19` / `ionice -c3`. The pitch pass took 194 s and the mix pass about 1 min, while the other passes held the load at 15–31. Free disk was 9.1 GB at the end. My scratch folder is 5 MB. |

---

## 0. The short version

**The dialogue holds up.** Every conversation outside Act Four:
- speaks in complete thoughts;
- answers every question it asks (in words, or in a picture that reads, such as the wallet or the `PLEASE REGULATE ME` sheet);
- has no blurts, and no cut-offs or overlaps at all. Act Four's two cut-offs are both motivated.

The reply gaps vary naturally (no mechanical runs), no read is flat, and dialogue sits at the same level in every chapter. The coverage holds conversations in setups of 6–25 s and cuts on the turns the script writes.

**What hurts is mostly sound, plus a few questions that don't sound like questions:**

1. **Acts One and Two have no sound-effects stem.** So eight of the script's turns that are written as sounds are silent:
   - the pop, the THUD, KA-CHING and the bell, Sydney's tick, the underline's squeak, the tear's tsss and the siren's J-cut;
   - the anchor's murmur in the sc 14 bridge.

   The score is written to stop *on* four of those sounds (4:19.35, 5:33.0, 6:33.25, 10:14.5). With the sound missing, it just drops out to room tone: exactly the "random pauses of silence" of note 17.
2. **The room ducks to near-silence between lines.** In the room-tone scenes the mixer ducks the bed 10 dB under every line. Launch night (sc 5, the series' first scene) and Tasya's terms play with the room at about −48.5 dBFS in every gap, 10–17 dB below the gaps in scored scenes.
3. **Four of the nine chapter seams hurt:**
   - intro → Act One drops 25 LU into 8.9 s of bare room;
   - Act One → Two has no black: the act-out's sting blurs into Act Two's music;
   - Act Two → Three is 9 s of wind stand-in, then a +13.9 LU jump;
   - Act Three → Four: the crane pre-lap stops dead at the cut. That's measured in the MP4, at the frame whose caption says "a crane truck grinds past".
4. **Seven questions carry the question only in pitch, and both measures say they fall.** Among them are Alyi's "And if it wakes up?" (launch night's turn), Sirrah's "Just one?" (it flips the joke) and Act Four's "you're staying?".
5. **Two voice contrasts the script asks for don't happen:**
   - Radnus ("quick and apologetic") and Tasya ("unhurried") read at the same pace. The cast registry even gives both the same pace guide.
   - Tasya's pilot-defining terms run at 216 wpm against a 125–145 guide.
6. **The poster run re-types the whole poster on each item**, so the stamps never pile up.

**The fixes, grouped into seven packages** (each row in §2 names its package):

| Package | What | Owner | Fixes |
|---|---|---|---|
| **F1** | An **Act One sound stem**, `audio/reel/ep01-act1-v2/act1_bed.py`, in the pattern of `ep01-act3-v2/act3_bed.py`, played as Act One's bed with `lufs: null`: the bullpen bed from under the card, the squeak, the click, the ratchet and clunk, the tsss, the siren's J-cut, the revolving door, the pop, the key ring, Sydney's tick carried into sc 11, the THUD and the pen's scratch | Act One pass | #2, #6, #10, #13, #18, #20 |
| **F2** | An **Act Two sound stem**, `ep01-act2-v2/act2_bed.py`: the formal room, the clock and the tripods, the flash, **the anchor's murmur** (sc 14), the hearing room's air, the gasp and the moth, the stamps' thunks, **KA-CHING and the bell** decaying to the black, the rooftop wind | Act Two pass | #25, #29, #32 |
| **F3** | **A per-bed `duck`** in `studio/src/reel/tools/mixer.mjs` (for example `"duck": 0` on room-tone beds and `-4` on stems), so a room holds steady under talk the way a real room does | reel owner (shared code) | #3, #14, and the smaller holes in §5.1 |
| **F4** | **Seam settings in the manifest** (`show/reel/ep01-full/ep01-full-v2.manifest.json`): `"xfade": 0.05` on the Act Two 13.01 bed; MM-19 re-anchored to Nedib's door; `"xfade": 0.05` on the tag bed; the card at 4 s (that one is the showrunner's call, +2 s) | lead / assembler | #1, #21, #22, #38 |
| **F5** | **The crane**: Act Four's premix gains the crane truck and the glass tings at S1.01–S1.02 (`audio/reel/ep01-act4-v5/bed.py`, then rebuild `mix.wav`). Or, until then, Act Three's stem drops its pre-lap, so nothing is promised | Act Four owner, or Act Three pass | #37 |
| **F6** | **Takes:** the seven pitch-only questions; Rima's cost line; Tasya's terms and the Radnus/Tasya pace contrast (a `cast.json` band change plus re-reads) | segment passes, casting | #4, #5, #11, #15, #16, #17, #23, #35, A4-4 |
| **F7** | **Picture:** the poster run as one held shot; the `arms-up` pose so raised hands read | Act Two pass; reel owner (`Figure.tsx`) | #30, #33 |

**Fix first, before the showrunner watches:** F1, F2, F3 and F4's two seam settings. They are the items that will read as the notes he has already given twice ("random pauses of silence", "the score must not play in fragments"). Next come F5, F7's poster run and the F6 questions.

---

## 1. How to read §2

- **EP** is the episode clock of `ep01-full-v2.mp4`, matching [transcript-v2.txt](transcript-v2.txt).
- **Tier:**
  - **A**: it will hurt the showrunner's watch; fix it before he watches.
  - **B**: it hurts clarity or naturalness; fix it in the next pass.
  - **C**: an ear or eye check. It may be fine.
- **Measured** gives the tool's number. §4–§5 have the method and the full tables.
- Act Four is reused unchanged in this pass. Its items are in §6 as notes for its owner (A4-1 …), except the crane seam (#37), which is shared.

---

## 2. Every spot that hurts, in episode order

| # | EP | Where | What hurts | Measured | Fix | Tier · pkg |
|---|---|---|---|---|---|---|
| 1 | 1:03.2–1:05.2 | card | 13 words of disclaimer in 2 s. The text finishes drawing about 0.5 s in, leaving about 1.5 s to read (about 9 words a second) | frames 1516 (blank) → 1528 (full) | `"durs": {"card.01": 4}` on the card chapter. It adds 2 s, so it's the showrunner's call (the assembler proposed the same) | B · F4 |
| 2 | 1:03.2–1:12.1 | intro → card → sc 5 | After the intro's final hit, the sound drops to bare room for **8.9 s** before Gerg's first line. The picture is busy (the button, the wide, the lit band), but the ear gets a hole | −16 → −42 dBFS within 1.5 s, then flat −42 until 1:12.1; short-term −15.8 → −41.5 LUFS | F1: the bullpen bed (server hum, the buzzing tube, **Gerg's keys**) from under the card, at about −32 LUFS, so the launch-night room arrives with its sound | A · F1 |
| 3 | 1:12.1–2:32.0 | sc 5, launch night (both halves) | The room tone ducks 10 dB under every line and holds, so each gap between lines sits near silence. That's 52 of the assembler's 86 holes. It is the series' first scene | gaps median **−48.5 dBFS** against speech −18.9. The worst runs are 2:21.6–2:24.0 (2.46 s) and 2:25.7–2:27.7 (2.03 s), the chat beat, where Mas's typing has no keys under it. Scored scenes' gaps sit at −31 to −39 | F3 (`"duck": 0` on room beds). Stems are ducked too (the cold open's and Act Three's are), so F1 alone doesn't fix it | A · F3 |
| 4 | 1:41.05 | sc 5, RIMA | "And if it works? If people actually use it, it's going to cost us a fortune." is the line that plants "it's the bill.". It is rushed for a "calm, diplomatic" Rima, and it's her one outlier: her other long lines read 4.17–4.67 syll/s at the same voice and speed | **5.53 syll/s** (guide 4.0–4.6), 208 wpm (140–160), at speed 0.90 = her band floor | Make the second clause its own whole read (`use it,{s0.3} it's going to cost us a fortune.`), because Kokoro compresses it when it runs on. If that isn't enough, lower her band floor to 0.85 in `cast.json` (casting) | B · F6 |
| 5 | 1:48.09 | sc 5, ALYI | "And if it wakes up?" is the turn from cost to dread. It is heard as a statement, and "And if it wakes up." sounds like an aside, not a question to the room | Whisper: "…it wakes up." "wakes" −0 → −3 st; "up" unvoiced | See §4.2 for the method: a wording variant from the writers first ("And what if it wakes up?"), then a pitch lift on "up" as a last resort. Seeds won't help: fastrec's README says a seed changes texture, not reading | A · F6 |
| 6 | 1:53.2–1:55.4 | sc 5, the cost | Rima's third underline is the scene's written cost ("the marker squeaks"). It's silent, so the cost exists only in the caption | no SFX in the mix; the room is at −42/−48 | F1: the squeak on her underline | B · F1 |
| 8 | 2:33.0–3:54.9 | sc 6–8, the drill | 82 s of a **two-chord temp pad** (Fm11 and Bbm9, alternating every 5 s) under the set piece, with no ratchet and no clunk. If the showrunner marks drag here, the pad may be the cause, not the picture | bed span; a pad at −27 dBFS median | Tell the showrunner which stretches play on programmatic pads (§5.3). F1's ratchet and clunk give it its written rhythm | C · F1 |
| 9 | 3:00.73 | sc 6, RIMA | "Low-key." comes 0.65 s into a new shot, after 21.9 s with no voice. A one-word callback that close to a cut may land before the viewer has found her at the hole | lead after the cut 0.65 s | Give beat 6.08 about 0.5 s more before the line, so the lead is about 1.2 s | C |
| 10 | 3:16.8–3:26.8 | sc 7 → 8 | The tear's *tsss* and the siren's whine (the J-cut the script writes into sc 8) are silent. Ten seconds of pad between "it's the bill." and Radnus | no SFX | F1: the tsss, then the siren through the phone's small speaker, from under the last puff | B · F1 |
| 11 | 3:26.8 → 7:34.7 | RADNUS vs TASYA | The script (dialogue pass 5) wants "the pilot's two calm corporate 'we' voices" to differ by ear, Radnus quick and apologetic, Tasya unhurried. **They read at the same pace.** Radnus mostly reads at the top of his speed band (0.96–0.99) and Tasya at or below the bottom of his (0.85–0.91), and Tasya's long lines are still the faster | medians: Radnus 4.33 / 4.58 syll/s (Acts One / Two), Tasya 4.33 / 4.55. F0 131 Hz against 145 Hz (1.7 st apart). `cast.json` gives **both** the same 3.8–4.4 syll/s guide | Casting: give Radnus a quick guide (about 4.6–5.2 syll/s, speed band up to about 1.05) and re-read his 6 lines, keeping the 0.6 s beat in "It is ours. / We published it.". For Tasya, see #15 | B · F6 |
| 12 | 4:13.4, 4:21.5 | sc 9 | "It's stuck." was heard as "It's stocking.", and "Suits you." as "So do you.", on both seeds. "Suits you." is the landlord's first look at the collar | ASR on both seeds (act1-notes §3.2) | Ear first. If they misread by ear: another speed, or the Act One notes' script fallback ("It's jammed.") | C · F6 |
| 13 | 4:16.1–4:19.35 | sc 9, LEVERAGE and the pop | LEVERAGE re-attacks on the check-slide cut (a loop wrap), then stops dead 3.3 s later on the pop, **but the pop isn't laid**. So the turn (Mas steps onto the money) plays as the music cutting out | wrap at 4:16.09: spectral flux 9.4× local, +7 dB. Stop at 4:19.35: −28 → −42 dBFS in one 0.25 s step | F1: the pop (and the collar's hop) exactly on the stop. Optionally move the loop's re-attack off the last 5 s before the stop (for example `in: 11.8` puts the wrap on Tasya's freeze card at 4:04.3) | A · F1 |
| 14 | 4:19.35–4:44.2 | sc 9, the terms | Tasya's terms play on bare room ducked to near-silence: 24.9 s of the pilot's key setup with nothing under it. The script already asks the OST owner to "confirm by ear, or give it a low pad" | gaps median **−48.6 dBFS**; 57 % of the bed frames under −45 | F3, plus the script's low-pad option (or the lobby bed from F1: a reception phone, footsteps on stone) | A · F3 |
| 15 | 4:25.31, 4:41.05 | sc 9, TASYA | The terms are "warmly, **unhurried**": a courteous paragraph that is really a lease. They run as the fastest long line of Act One. "Everyone is welcome. Rent is due on the first." is the lease clause's button, and it is quick too | **216 wpm, 5.28 syll/s** (guide 125–145 wpm, 3.8–4.4), already at speed 0.85, below his band's 0.88 floor. The button is 4.72 syll/s | Read each of the terms' four sentences as its own whole read (`{s0.5}`), because Kokoro rushes long multi-clause reads. Give the button a 0.7 s beat at its full stop. If it still runs over 190 wpm, try a slower Tasya blend (casting). Act Four's approved Tasya runs 199 wpm (a4 v5), so match that at least | B · F6 |
| 16 | 4:47.94 | sc 9, GERG | "You're going after Elgoog with it?" is a statement in form, so only the pitch makes it a question. It is heard as a statement, "…with it." Tasya's quote still answers it, but it turns a question into an accusation | "with" −3 → −4 st; "it" unvoiced; Whisper "with it." | §4.2: the writers' variant "Are you going after Elgoog with it?" puts the question in the words | B · F6 |
| 17 | 5:31.19 | sc 10, SYDNEY | "Remember me? 😊" is heard as "Remember me.", which turns her sweet exit into an order. The emoji isn't voiced (the `say` strips it) | "me" −4 → −11 st; Whisper "Remember me." | §4.2 (or the writers' "Will you remember me? 😊") | B · F6 |
| 18 | 5:33.0–5:38.9 | sc 10 → 11 | "The tick carries over the cut, still in tempo", and "the pre-beat is never silent". Instead, LEVERAGE ends and 5.9 s of bare room plays under Kram's crate before the duel's pad | −42 dBFS flat from 5:33.0; the bed label says "the tick itself is not laid" | F1: Sydney's egg-timer tick in LEVERAGE's tempo from 5:31 through the pre-beat, counting in the MM-04 pad | A · F1 |
| 19 | 5:52.9–6:25.4 | sc 11–12 | 32.5 s with no voice (the duel's phrases 3–4, then the letter's push) on a two-chord MM-04 pad. The duel's punchline, the memo shipped as a website, reads only in the caption and the SPLIT | the longest voiceless stretch in Act One | Nothing to cut here (length-v2 owns cuts). For the watch: say it's a pad, as in #8 | C |
| 20 | 6:33.25–6:44.35 | sc 12, the act-out | The THUD, the act-out's turn, is silent. MM-17 is cut dead by a sound that isn't there, and then **11.1 s of bare room** plays under the headline, `PLEASE` and Alyi's reflection (the pen's scratch isn't laid) | −32 → −42 dBFS at 6:33.25, then flat −42 | F1: the THUD on 6:33.25 (the room layer's 2 px shake is its picture), then the pen's scratch under 12.04–12.06 | A · F1 |
| 21 | 6:44.35–6:47.3 | Act One → Two | **No black.** MM-14's sting (the act-out's last shot, "CUT TO BLACK on its tail") gets 1.9 s. Then MM-19 fades in from 6:45.25, a 2 s crossfade centred on Act Two's first frame, so the sting and Act Two's pomp blur into one sound across the act break: a music fragment | MM-14 in at 6:44.35, −40 → −31 dBFS; MM-19's default `xfade` of 2.0 s starts 1 s before the seam | F4: `"xfade": 0.05` on the 13.01 bed, so Act Two's music starts on its first frame and MM-14 rings over the black. Optionally 1 more second of black on 12.07 (a length proposal) | A · F4 |
| 22 | 6:46.25–7:54.1 | sc 13, MM-19 | The temp bed is **loop A of MM-19, Nedib's own Fountain Pen motif** (bars 1–8). It plays from the first frame and loops 3.4 times, about 50 s before Nedib walks in. The script gives the motif to the door ("NEDIB's Fountain Pen motif … takes it over on the door"). The third pass restarts **0.2 s into Radnus's barb** | wraps at 7:06.25 (on the photographer's cut: +16 dB, but it reads as a hit), **7:26.25 under "They ask it the things…"** (flux 5.6×) and 7:46.25 under "Longer than that." (2.8×). The render is 90 s long; only 0–20 s is used | F4: a quiet temp pad (or the room stand-in at −36 LUFS) for 13.01–13.10. Then a new bed at `{chapter: "act2", beat: "13.11"}` with `mm19-renamed-it-fountainpen-loop.wav` from bar 1, so the motif arrives with Nedib. One pass covers 7:37–7:54 | B · F4 |
| 23 | 6:56.19, 7:00.34 | sc 13, SIRRAH | "Questions, before we take the picture?" and "Just one?" are heard as statements. **"Just one."** flips the joke: she seems to limit Mario, where she is meant to tease him | "picture" −1 → −7 st; "one" +8 → −2 (it rises, then falls away). Whisper "…the picture." and "Just one." | §4.2. "Just one?" is the priority: an echo question has only its pitch | B · F6 |
| 24 | 7:40.40 | sc 13, NEDIB | "Whatever you promise in here today, put it in writing. Longer." The button "Longer." rides in on the sentence | 5.41 syll/s (guide 4.2–4.8). The 0.44 s beat before "Longer." is there | "Longer." as its own read (`{s0.5}`); the band floor is 0.93, so the speed can't drop without a band change | C · F6 |
| 25 | 7:52.2–8:03.9 | sc 14, the bridge | The scene exists to carry "a fake, too-smooth voice" from the clip in Mas's hand to the lit window and into the Senate. **No voice is laid**, so the clone's real line pre-laps cold over black after 11.6 s of room, and the bridge's device doesn't happen | −42 dBFS room, no voice; act2-notes §8.1 | F2: an anchor murmur (a stock Kokoro voice reading neutral copy through fastrec's `tv` chain, low-passed to about 1.5 kHz so no words are made out, at about −34 LUFS) from 7:54.1 through the black. Let it hand off to the clone's line (act2-notes asks the room whether the murmur *becomes* the clone; if not, it stops under the clone's first word). Invented anchor, no clone | A · F2 |
| 26 | 8:37.0, 8:41.4 | sc 15, the CLONE and the CHAIRMAN | The joke needs two men. The script: "The takes must also differ: the clone's gloss process against the chairman's plain read". The two voices are the same blend about 1 st apart, so a newcomer may hear one man ask and answer | F0 95 Hz (clone) against 100 Hz (chairman); `lahtnemulb-clone` derives from `lahtnemulb` with a gloss chain only | Casting: +2 st (or a brighter second blend) on `lahtnemulb-clone` in `cast.json`; re-read the clone's 3 lines | B · F6 |
| 27 | 8:41.4 | sc 15, "I am, a little." | A short burst after "little" (ASR "littles" on every seed and wording) | act2-notes §3.3: the envelope rises −39 → −18 dB about 0.1 s after the word | Ear first; trim the tail by hand if it's audible | C |
| 28 | 8:44.3 / 9:07.4 | sc 15, the senators | The script lights two different microphones, but one A SENATOR voice speaks for both | act2-notes §8.2 | Casting: a second stock senator for 15-15 ("Is there anything…") | C · F6 |
| 29 | 8:57.75–9:04.25 | sc 15, the wallet | The stop on the wallet is designed ("the music stops … the room's air under it"), but the gallery's gasp (the rail lands with it) and the moth aren't laid, so the 6.5 s of room drops further in every gap | room median −42 dBFS; the gaps between the three lines after it, median −47.3 | F2: the room's air (unducked, F3), the gasp on the rail, the moth's flutter | B · F2 |
| 30 | 9:19.75–9:39.75 | sc 16, the poster run | "One poster, the stamps piling up … The camera holds; the stamps come to it." Instead **each item re-types the whole poster**. At 9:24.9 it reads `MAS MANALT / EU: CANCE`; at 9:30.0 it reads `MAS MANALT: THE` with the stamps gone. The accumulation, which is the joke, never builds, and each 5 s item is half-typed for about 1–1.5 s | frames at 9:20.4, 9:24.9, 9:25.4, 9:30.0, 9:35.2; the transcript lists the title four times | Build 16.01–16.04 as one held shot: one beat whose `onscreen` entries arrive at timed offsets (the pattern of Act One's 5.12 counter fix). Or confirm that `cont` beats with one `shotId` carry their text without re-typing | A · F7 |
| 31 | 9:50.2–9:59.5 | sc 17, the pen | The scene's want is visual: Mas holds out his hand for the pen, and Mario keeps writing. The stick frame doesn't draw it, so "we'll read it." lands without the want it knifes | stills; the 17.02 two-shot | A `point` or reach pose on Mas in 17.02 (Act Three used `point` for the same problem at 21.07), or a strip note | C |
| 32 | 10:08.3–10:23.7 | sc 17 → Act Three | **KA-CHING** (the turn) and **the bell** (the act's out: "leaving only the register's bell, decaying … CUT TO BLACK on the bell's last partial") aren't laid. So MM-05 stops hard at 10:14.5 into 9.2 s of wind stand-in, and Act Three's stem then enters 13.9 LU louder. The midpoint act-out ends on nothing | −31 → −40 dBFS at 10:14.5, flat −40 until 10:23.7, then −25 to −29 | F2: the register key and KA-CHING on 17.07, the bell decaying under phrase 4 to the black. Act Three's 0.3 s fade-in can stay | A · F2 |
| 33 | 11:08.76 | sc 19, REMUHCS | "Every single person raised their hand." pays off on the forum's hands going up, but the `arms-up` pose draws the hands behind the head, so the payoff doesn't read in the reel | act3-notes §4 and §10 | Reel owner: the one-line `arms-up` fix in `studio/src/reel/Figure.tsx` that act3-notes §10 gives. It is shared code, so re-run the reel byte checks (reel README) | B · F7 |
| 34 | 11:12.04 | sc 19, NOLE | "It's important for us to have a referee." is rushed. Nole's other line ("Great sign. Love the font.", 6:25.4) reads 3.73, so the same man is 2.5 syll/s apart in two lines | **6.19 syll/s** (guide 4.8–5.6), at the lowest speed QA allows | Casting: widen Nole's band floor, then re-read | C · F6 |
| 35 | 11:47.43 | sc 20, MAS | "is that the build?" The script says "a yes/no question: the take must rise". The word order still marks it, and Whisper hears "?" | "build" −3, +2, −2, −6 st | §4.2; ear first | C · F6 |
| 36 | 12:33.2–12:34.2 | sc 22, TASYA | "We love you guys." is written "a hearty laugh first". There is no laugh: 1.0 s of silent mouth, then the real line lands flat and late, and the "hug in words" reads deadpan | gap 0.99 s; the line at 3.42 syll/s | A laugh in the gap: a programmatic laugh, or a stock-voice "Ha! Ha ha." read through Tasya's own preset (no clone), in the Act Three stem or as a line | B |
| 37 | 12:49.5–12:51.7 | Act Three → Four | The crane truck's diesel grind pre-laps under sc 23's black (the Act Three pass took the script's handoff). It then **stops dead at the cut**, on the frame whose caption says "A crane truck grinds past; every glass shivers except his". Act Four's premix has no crane | **In the MP4:** the low band (< 250 Hz) sits at −26 dB from 12:49.5, then falls 14 dB at 12:51.5 and stays there | F5: the crane and the tings at Act Four's S1.01–S1.02 in `bed.py`, then rebuild `mix.wav` (Act Four owner; `mix.wav` must still start at 3.000 s). Until then, drop the pre-lap from `act3_bed.py`; the script allows "otherwise they start on the cut" | A · F5 |
| 38 | 21:29.6–21:30.7 | Act Four → tag | The script has MM-12 "pick up sc 31's F pedal from the vault" and the dark room's bed "crossfaded in from the bullpen's": continuity across the join. Instead Act Four's gate fades out while the tag stem fades in, and the mix dips to near-black | about 0.5 s at −54 to −62 dBFS | F4: `"xfade": 0.05` on the tag bed, with `tag_bed.py`'s F pedal at level from its first sample. Or a shorter `edge` on Act Four's gate (plan `gates`, from the mixer) | B · F4 |
| 39 | 21:55.9–22:04.5 | sc 33, the thud → "noted." | 8.5 s of room and SFX only, by the script's design (tag-notes §8) | RMS −37.6 dBFS | Watch it. If it plays as dead air, the tag notes' fixes: tighten 33.03, and add a paper-settle under the stamp | C |

(#7 was merged into #3 while the list was being built, so there is no #7.)

---

## 3. Conversation by conversation

A **conversation** is a run of lines in one scene with no gap over 3 s, the definition `report.py` and the assembler use. "Setups" are the shots it plays across.

| EP | Scene | Lines · length · setups | As the reel plays it (want → obstacle → turn → cost) | Hurts |
|---|---|---|---|---|
| 0:04.0 | 1, the panel | 2 · 11.8 s · a held close shot (+ the plink insert) | The host wants a warm answer; Mas gives the calm one, in one unbroken real sentence. The turn (the hailstone) is picture. Complete and answered | — |
| 0:21.4 | 2, the invite | 1 | "noted." answers the invite we see | — |
| 1:12.1 | 5, launch night | **12 · 43.3 s** · 5 setups: the two-shot, 11.4 s; the over-the-shoulder on Rima, 24.5 s; 3 short cuts on the written turns | The strongest scene in Acts One–Three on paper and in the timeline. Gerg ships; Rima bargains and then presses on cost; Gerg waves both away; Alyi turns cost into dread; Mas decides by answering "preview". Every line is a whole thought, and every question gets an answer. **The cost (the underline) is silent**, and the room ducks to near-silence under all of it | #3, #4, #5, #6 |
| 2:00.6 | 5, the count and the chat | **11 · 31.4 s** · 3 setups | Alyi's private count; the chat flatters him; "it likes me." is deflated off picture. Good | #3 (the worst holes) |
| 2:37.6 | 6, the drill | set piece: the V.O., 2 posts, "Low-key." / "Very low. Basement." | Montage buttons, kept short on purpose | #8, #9 |
| 3:12.1 | 7, the bill | 2 · 3.7 s | Rima reads a tear as sentiment; he corrects her to money. It turns. The tsss and the siren are silent | #10 |
| 3:26.8 | 8, Elgoog | **6 · 22.8 s** · one point-of-view shot held 20 s | The founders ask a real question and get a real answer, and "It is ours. We published it." turns it. The phone framing is caption-only in the stick reel; the phone chain on the voices carries it | #11 |
| 4:09.4 | 9, the partnership | 3 · 6.0 s · 1 | The partnership / stuck / long-term rhythm gag. Works | #12 |
| 4:21.5 | 9, the terms | **5 · 22.6 s** · 1 held two-shot | Mas takes the money, *then* asks the price, and Tasya answers with a welcome that is a lease. The words are all there. **The turn is a music dropout with no pop, and the "unhurried" paragraph is the act's fastest read**, on a room at near-silence | #13, #14, #15 |
| 4:47.9 | 9, the TV | 2 · 6.7 s, + "ours does that too." | Gerg's question and Tasya's real line answer each other; the button is Gerg's closed laptop | #16 |
| 5:11.4 | 10, Sydney | **5 · 20.7 s** · 3 setups | A cause we can see (the date stamp), her whole real line, his compliment as a knife, the landlord's leash. Good. Her exit reads as an order, and the tick that should carry into sc 11 is missing | #17, #18 |
| 5:41.2 | 11, the duel | 3 · 11.7 s · the SPLIT | The memo, the clay bot's "You're absolutely right!", "Addendum." (3.2 s after the cut, on Mario's look at the same-day plate: motivated). Then 32 s with no voice | #19 |
| 6:25.4 | 12, the letter | 3 · 7.1 s · 1 wide | Nole deflects to the font; Oigneb says the ask; "Next quarter." A short volley, but whole and answered. **Then the turn (THUD) is silent, and the act-out is 11 s of bare room** | #20, #21 |
| 6:49.9 | 13, the lesson | 1 + 4 · 8.7 s · 1 held two-shot | "I have one concern." / "Just one?" / "It has sub-concerns…". Three quick 0.28–0.32 s replies, which suit a comedy volley. "Just one." (heard as a statement) turns the tease into a limit | #22, #23 |
| 7:15.3 | 13, the photo, Radnus, Nedib | **12 · 36.9 s** · 6 setups | The best ensemble exchange in the pilot: the photographer's wide, the held Mas/Radnus two-shot (4 lines, 14.7 s: congratulations, thanks, the barb dressed as courtesy, the knife), the flame, Nedib's entrance and his three lines, the photo. MM-19 restarts under the barb | #22, #24 |
| 7:52.2 | 14, the bridge | 0 lines · 11.6 s | A bridge "on a too-smooth voice" with no voice in it | **#25** |
| 8:03.9 | 15, the Senate | 2 + **10 · 40.6 s** + 3 · 6 setups | The act's anchor, and it holds. Sucram's thread gets a listener; the chairman's question and Mas's real answer; the clone takes the card; the hold before "I am, a little."; the agency, the pay, the wallet. The committee's last question is answered by the sheet, which reads (`PLEASE REGULATE ME`, frame 9:12.2) | #26, #27, #28, #29 |
| 9:19.8 | 16, the poster run | 0 lines · 20 s | It should accumulate, but it re-types | **#30** |
| 9:50.2 | 17, the sheet | 4 · 9.2 s + 2 · 1 held two-shot | Mario writes what the sentence leaves out; "we'll read it." is the knife; "It has an appendix."; the salesman answers the cost. Whole. The want (the pen) isn't drawn, and **the turn (KA-CHING) and the out (the bell) are silent** | #31, #32 |
| 10:37.8 | 18, the Orb | 3 lines, all Mas · 6.6 s | "thanks." (1.1 s after the toast lands), the V.O., "you can stay.". Each answers something the Orb has just done, so they read as reactions, not blurts. This is the check the script's second pass asked the stick reel to make | — |
| 11:08.8 | 19, the monitor | 2 real lines | The hands runner in one held room frame; the payoff line's hands don't read | #33, #34 |
| 11:29.9 | 20, Gerg's call | **8 · 25.9 s** · a held two-shot and the one written cut (the edit) | Act Three's anchor conversation plays as two night owls: the crowd's reading, the edit, the build status, "go to sleep, gerg." / "When it compiles.". Whole and answered | #35 |
| 12:00.4 | 21, the order | 4 · 15.2 s, + "that one." | Nedib finishes his thought; the copies add to it, not over it; the real line; the Orb picks the real one. Good | — |
| 12:31.4 | 22, DevDay | 2, + "super." | The question and the real answer. The laugh is missing. "super." answers the prompt we see (0.54 s after the tap) | #36 |
| 12:41.7 | 23, the clock | 0 lines | The clock arrives, and the crane pre-lap is cut at the seam | #37 |
| 12:51.7 | Act Four | see §6 | 101 lines; the longest conversation is 61 s (Gerg at 2 AM) | §6 |
| 21:30.1 | 32–33, the tag | 2 one-word buttons | By design (a witness that never speaks) | #38, #39 |

**What this says against the showrunner's note 11:**
- Acts One–Three have 4 conversations over 30 s (43.3, 40.6, 36.9 and 31.4 s) and 4 more over 20 s (Gerg's call, Elgoog, the terms, Sydney).
- The median line is 5–6 words, and 33 of 116 lines are three words or fewer. Most of the short ones are buttons or quick replies inside longer exchanges, not stand-alone blurts.
- The one act that is structurally short on talk is Act Three: 30 % speech, against 41–44 % in Acts One and Two. That's by the script's design (Mas and a silent witness), and Gerg's call holds it together.

---

## 4. The takes: delivery

### 4.1 Pace against each character's guide

The guides are the take rows' own (`pace.intended`: articulation in syllables a second, turn wpm), from `cast.json` and `lines_v5.BANDS`. **"Far off"** means a line of 4+ words more than 0.3 syll/s outside the articulation guide, or a line of 6+ words over 1.3× the top of its wpm guide. On short lines of monosyllables, wpm reads high while articulation is normal, so articulation decides.

**Acts One–Three, far off and worth a re-read** (Act Four in §6):

| EP | Speaker | Line | syll/s (guide) | wpm (guide) | Note |
|---|---|---|---|---|---|
| 1:30.04 | GERG | It'll have a banner. Nobody reads banners either. | 6.14 (5.0–5.8) | 211 | Gerg is quick by design; minor |
| **1:41.05** | **RIMA** | And if it works? … a fortune. | **5.53 (4.0–4.6)** | 208 (140–160) | #4 |
| 2:15.43 | GERG | Autocomplete that read the internet, Rima. All of it. | 6.25 (5.0–5.8) | 214 | minor |
| **4:25.31** | **TASYA** | the terms (47 words) | **5.28 (3.8–4.4)** | **216 (125–145)** | #15 |
| 4:41.05 | TASYA | Everyone is welcome. Rent is due on the first. | 4.72 (3.8–4.4) | 177 | #15 |
| 7:40.40 | NEDIB | Whatever you promise … Longer. | 5.41 (4.2–4.8) | 175 | #24 |
| 11:12.04 | NOLE | "It's important for us to have a referee." | 6.19 (4.8–5.6) | 213 | #34 |

**Slow reads:** none that hurt. Every line under its guide is a short button or a written beat: Nirb's split reads "shading his eyes", "I have one concern.", "which one am i?", "I am, a little.", Alyi's slow counts.

**Consistency across chapters** (median syll/s on lines of 4+ words):
- Mas holds 3.76–4.11 in every chapter (guide 3.6–4.2).
- Gerg holds 5.18–5.52 (guide 5.0–5.8).
- Alyi holds 3.43–3.54 (guide 3.4–4.0).
- The outliers:
  - Tasya: 4.33 in Act One, 5.15 in Act Four;
  - Mario: 4.35 in Act One, 4.72 in Act Two, 5.47 in Act Four (the eleven-pages line, flustered by design);
  - Nole's two lines, 3.73 and 6.19.

### 4.2 Questions that play as statements

I measured pitch on every take with **pYIN** (16 kHz, 10 ms hop, voiced frames only): each question's last two words, in four slices each, in semitones relative to the line's median. I set that against **Whisper's own punctuation** in the take rows' ASR text.

A falling yes/no question with inverted word order ("Is it ready?") still sounds like a question in English, and so does a falling wh-question ("How much?"). The ones that hurt are questions **whose question lives only in the pitch**: declaratives, echoes and elliptical questions. Both signals say these seven fall:

| EP | Speaker | Line | Last word(s), st vs line median | Whisper heard | # |
|---|---|---|---|---|---|
| 1:48.09 | ALYI | And if it wakes up? | wakes −0, +0, −1, −3 · up (unvoiced) | "…it wakes up." | #5 |
| 4:47.94 | GERG | You're going after Elgoog with it? | with −3, −4, −4, −4 · it (unvoiced) | "…with it." | #16 |
| 5:31.19 | SYDNEY | Remember me? | me −4, −6, −8, −11 | "Remember me." | #17 |
| 6:56.19 | SIRRAH | Questions, before we take the picture? | picture −1, −0, −7, −7 | "…the picture." | #23 |
| 7:00.34 | SIRRAH | Just one? | one +8, +5, −1, −2 | "Just one." | #23 |
| 17:36.98 | NELEH (Act Four) | Step four? | four +2, −1, −4, −5 | "Step 4" | A4-4 |
| 20:19.97 | MAS (Act Four) | you're staying? | staying +7, +2, −2, −1 | "you're staying." | A4-4 |

Also "is that the build?" (11:47.43), where the script asks for a rise: "build" −3, +2, −2, −6. Whisper still hears "?", so it's an ear check (#35).

**How to fix them, in order:**
1. **Seeds won't help.** fastrec's README: "Kokoro's seed moves only the vocoder noise, so takes differ a little in texture, not in reading."
2. **Put the question into the words** (a writers' call; none of these is in `## ACT FOUR` except the last two, which go to the Act Four owner): "And what if it wakes up?", "Are you going after Elgoog with it?", "Will you remember me? 😊". "Just one?" and "Questions, before we take the picture?" are best kept as written, and they need item 3 or 4.
3. **`say` variants that change Kokoro's reading:** the question word or phrase as its own short read (`{s0.12}` before it); a speed step of ±0.03. Keep a read only if Whisper ends it with "?" and `--prosody` measures a final move of +2 st or more.
4. **Last resort:** a formant-preserving pitch glide of +3 to +4 st over the last 150–200 ms of voicing. That would be new code in `house.py`, and it may sound processed, so only with an ear.

### 4.3 Flat reads, starts, ends and gaps (measured, and fine)

- **Flat reads: none.**
  - Every line of 6+ words spans at least 5.4 st (p10–p90). The chapter medians are 8.8–15.6 st.
  - The one narrow read is Act Four's "Alyi signed it." (18:30.3, 1.0 st), which may be meant as a flat statement of fact (A4-5).
- **Abrupt starts: none.**
  - Every take has 0.35 s room-tone handles (QA checks at least 0.30 s) and its own onset.
  - In the mix, one line starts within 0.25 s of its cut: REMUHCS at 11:08.76, 0.09 s into beat 19.09b. That's by design (the hands go up on his words), and it's a continuation of the same shot.
- **Abrupt ends: none cut by a cut or a seam.**
  - Every line that runs past its beat is a written L-cut or pre-lap: the cold open's one-read sentence, the clone over black, Neleh's post, Tasya's statement, Terb's statement, Mas's closing quote.
  - Four takes decay in 35–55 ms (QA's `decay_ms`), three of them on the call chain: 11:46.8, 18:16.4 and 18:31.0, plus "Step four?" at 17:37.8. QA passes them (at least 20 ms). They're an ear check if a line sounds chopped.
- **Uniform gaps: none.**
  - Reply gaps inside conversations have a median of 0.70–0.78 s per chapter and an interquartile range of about 0.45–1.3 s.
  - No run of 4 or more consecutive gaps sits within ±0.06 s of each other.
  - Quick replies (0.24–0.30 s) are Gerg's cheerful volleys, the lesson's comedy volley, and Gerg's "Still running." / "When it compiles."
  - Loaded replies (0.9–1.5 s) sit on the written beats: Alyi's dread, "…still a preview.", the Orb settling.
- **Cut-offs and overlaps.** Acts One–Three have none: the script writes none, and the showrunner calls them rare seasoning. Act Four has two, both motivated: Neleh's "Has anyone read the char—" as she leaves the call, and Adelina over Mario's "hypothetically—".
- **Level.** Dialogue sits at a median 50 ms RMS of −18.3 to −19.3 dBFS in every chapter (the tag −17.4), so no jumps come from the takes. The intro's V.O. is −24.

### 4.4 Voices the script says must differ

| Pair | What the script asks | Measured | # |
|---|---|---|---|
| RADNUS / TASYA | differ by ear: quick and apologetic against unhurried | the same pace; F0 131 / 145 Hz (1.7 st); the same guide in `cast.json` | #11, #15 |
| THE CLONE / LAHTNEMULB | "the takes must also differ" | F0 95 / 100 Hz; the same blend, plus a gloss chain on the clone | #26 |
| A SENATOR / a second senator | two lit microphones | one voice | #28 |
| DEEPFAKE NEDIB ×2 / NEDIB | "the same cadence, a shade too smooth" | F0 108–110 Hz, the same blend plus the gloss chain. As designed | — |

---

## 5. The sound bed

### 5.1 Holes: the room ducks to near-silence between lines

**Method.** I took a 10 ms level envelope (50 ms RMS, louder channel) of the episode mix, `mix.wav`, the file the MP4's AAC was encoded from. I measured the median level in the gaps between lines inside each conversation, leaving out 0.15 s either side of speech.

| Conversation | Bed | Gaps, median dBFS | Speech, dBFS |
|---|---|---|---|
| 1:12.1 sc 5, launch night | room stand-in | **−48.5** | −18.9 |
| 2:00.6 sc 5, the count and the chat | room stand-in | **−48.5** | −18.4 |
| 4:21.5 sc 9, the terms | room only (LEVERAGE out) | **−48.6** | −17.5 |
| 9:02.5 sc 15, after the wallet | room (MM-20 stopped) | **−47.3** | −18.5 |
| 12:31.4 sc 22, DevDay | Act Three stem | −43.0 | −17.8 |
| 9:50.2 sc 17, the sheet | MM-03's held pad | −41.2 | −17.9 |
| every scored conversation | a cue or a stem | −31 to −39 | about −18.5 |

**Why.** The mixer ducks every bed −10 dB under speech and holds the duck across gaps under 2.5 s. A room-tone stand-in at −42 LUFS then rests at about −48 to −51 dBFS, the floor plus a ducked room. That's how the assembler's 52 group-B holes arise. A real room doesn't drop 10 dB when someone speaks.

**Fix:** F3. The stems (the cold open's, Act Three's, the tag's) are ducked too, so the stems in F1/F2 need F3 as well.

### 5.2 Turns written as sounds that the stick mix doesn't have

These are all in Acts One and Two, which have no stem (the cold open, Act Three and the tag built one). Each is a turn or an out the script builds on a sound:

| EP | Sound | What it carries | What plays instead | # |
|---|---|---|---|---|
| 1:53–1:55 | the marker's squeak (the third underline) | sc 5's cost | room | #6 |
| 3:16–3:26 | the tear's *tsss*; the siren's whine through the phone | sc 7's cost; the J-cut into sc 8 | the pad | #10 |
| 4:19.35 | the *pop* (the third collar) | sc 9's turn; LEVERAGE stops on it | the music cuts to room | #13 |
| 5:31–5:39 | Sydney's egg-timer tick | the count-in to the duel; "the pre-beat is never silent" | 5.9 s of room | #18 |
| 6:33.25 | the **THUD** | Act One's act-out turn; MM-17 is cut dead by it | the music cuts to room for 11 s | #20 |
| 7:54–8:04 | the anchor's too-smooth murmur | sc 14's whole device | 11.6 s of room | #25 |
| 9:02 | the gallery's gasp | the wallet's landing | ducked room | #29 |
| 10:08–10:23 | **KA-CHING**; the bell decaying to the black | sc 17's turn and the midpoint act-out | the music cuts to 9 s of wind stand-in | #32 |

The act notes list the smaller ones too (the click, the ratchet, the clunk, the revolving door, the key ring, the pen's scratch, the tripods, the flash, the moth, the stamps' thunks): act1-notes §4, act2-notes §8.1.

### 5.3 Music: fragments, loops and temp pads

| EP | What | Measured | Hurts? | # |
|---|---|---|---|---|
| 6:44.35–6:47.3 | MM-14's act-out sting (1.9 s) blurring into MM-19 across the act break | MM-19's default 2 s crossfade starts 1 s before the seam | **yes: a fragment, and no black** | #21 |
| 6:46.25–7:54.1 | MM-19 loop A (Nedib's motif) × 3.4 passes, from 50 s before Nedib | wraps at 7:06.25 (on a cut, +16 dB), **7:26.25 (under Radnus's barb)** and 7:46.25 (under Nedib) | yes | #22 |
| 4:16.1 → 4:19.35 | LEVERAGE re-attacks on a cut, then stops 3.3 s later on a silent pop | flux 9.4×, +7 dB; then −14 dB in 0.25 s | yes, with #13 | #13 |
| 5:01.74, 5:19.24 | LEVERAGE's second-run wraps | 0.43 s before the two-shot's cut; under Sydney's line (flux 1.7×, mild) | ear check | — |
| 3:54.9–3:58.6 | 3.7 s of room between MM-16's ring-out and LEVERAGE | as designed; the revolving door's pre-lap would fill it (F1) | minor | — |
| 4:19.35, 6:33.25, 10:14.5, 5:33.0 | cues stopping on sounds that aren't there | see §5.2 | **yes** | #13, #20, #32, #18 |
| 2:33–3:55, 5:39–6:19, 8:05–9:20, 9:20–10:00 | programmatic two-chord temp pads (MM-16 82 s, MM-04 40 s, MM-20 53 + 15.5 s, MM-03 20 + 20 s) under the voiceless set pieces | pads alternate two chords every 2–5 s | **a caveat for the drag marks:** these stretches will feel longer on a static pad than on the real cue | #8, #19 |

### 5.4 The chapter seams

Audio is from the envelope in 0.5 s steps. Picture is from the assembler's seam sheet, plus my frames.

| Seam | EP | Audio | Picture | Verdict |
|---|---|---|---|---|
| title → cold open | 0:03.0 | slate silence → the hall | the stage; the rail is up by frame 84 | fine |
| cold open → intro | 0:33.2 | −27 → −22 | 1993's alert → the intro's cursor | fine |
| intro → card | 1:03.2 | **−16 → −42 within 1.5 s; flat −42 for 8.9 s** | the intro's `verified: human` → the card | **hurts (#2)** |
| card → Act One | 1:05.2 | room → room | two text-on-dark frames in a row: the card, then the button insert typing `research preview`. A newcomer may read the insert as a second title card | minor (stick-reel look) |
| Act One → Two | 6:46.25 | **no black: MM-14 → MM-19 crossfade** | the void set → the White House | **hurts (#21)** |
| Act Two → Three | 10:23.67 | **9.2 s of wind at −40, then +13.9 LU** | the void → the dark room | **hurts (#32)** |
| Act Three → Four | 12:51.67 | **the crane's low band −26 → −40 dB at the cut** (MP4) | the void (the crane under it) → the suite, captioned with the crane | **hurts (#37)** |
| Act Four → tag | 21:30.12 | **about 0.5 s dip to −54 to −62 dBFS** | the observer chair → the dark room | **hurts (#38)** |
| tag → outro | 22:08.5 | −25/−31 → the pad at −27 | black → the placeholder card | fine |

---

## 6. Act Four (reused unchanged in this pass): notes for its owner

The showrunner called Act Four's dialogue and pacing "much better", and this pass reuses its timeline and premix unchanged. These are ear checks for its owner, not changes for this pass.

| # | EP | What | Measured | Suggestion |
|---|---|---|---|---|
| A4-1 | 12:59.03, 13:01.50 | THE PLAN's first two lines, which carry the firing's mechanics for a newcomer ("Leave out Mas and Gerg, and the four of us are a majority."), are the fastest long lines in the episode | 271 and 269 wpm (guide 150–170); 13:01.5 at 5.73 syll/s (4.2–4.8) | A 0.4 s beat at the comma after "Gerg", and read it at the band floor. It's the one line a newcomer must follow |
| A4-2 | 16:55.15 | TTEMME, "You already have an interim CEO." | **7.27 syll/s** (4.4–5.2), the fastest articulation in the episode | Re-read at the band floor |
| A4-3 | 21:05.74 | GERG, "You said that about the last one.", the act's last exchange before the closing quote | 333 wpm, 6.35 syll/s (5.0–5.8) | A slower read; it's a button, and it should land |
| A4-4 | 17:36.98, 20:19.97 | "Step four?" and "you're staying?" play as statements (§4.2). "you're staying." turns Mas's surprise into a pronouncement | Whisper "Step 4", "you're staying."; both fall | §4.2 |
| A4-5 | 18:30.29 | "Alyi signed it." has a 1.0 st range, the only flat read in the episode | pYIN | Probably meant flat; ear |
| A4-6 | 12:51.7 | the crane (#37) | — | F5 |

Neleh's pace across 22 lines has a median of 218 wpm (guide 150–170), which is consistent enough to be her voice. I'm not suggesting a change.

---

## 7. Measured fine: leave these alone

- **Complete thoughts and real answers** in every conversation (§3).
- **No blurts.** Every line of three words or fewer has a visible trigger and at least 0.5 s after its cut. The one-word lines after long voiceless stretches ("Low-key.", "thanks.", "close.", "noted.") each answer something on screen. #9 is the one timing tweak.
- **Coverage holds.** Conversations play in held setups of 6–25 s (Act One's over-the-shoulder on Rima is 24.5 s, the terms 24.8 s, the Elgoog point-of-view shot 20.2 s, the Mas/Radnus two-shot 14.7 s, Gerg's call 10.2 + 15.1 s). The only runs of 4 cuts on 4 lines are the ones the script writes on its turns: sc 5's Alyi / Rima's wait / the button, sc 13's photographer into the two-shot, sc 15's dais.
- **The stick-reel limits** the segment passes already list (Alyi's reflection drawn as a figure, sc 8's phone framing, the check and the scroll as captions) are only noted here where they cost a line its payoff: #31, #33.
- **No flat reads, no uniform gaps, no clipped starts or ends**, and dialogue at one level throughout (§4.3).
- **The seams' picture** is right at all nine joins (the assembler's seam sheet; my frames at 1:05.6, 12:51.9).

---

## 8. How this was measured, and how to re-run it

The scripts are in my scratch folder, `/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/ep1s-flowaudit/`, which is temporary. Each is short, and this section says what each does, so they can be rebuilt. They read the assembler's `plan.json` and `mix.wav` (in `scratchpad/ep1s-assemble/work/`).

If those are gone:
- re-make `plan.json` with `node src/reel/tools/episode.mjs ../show/reel/ep01-full/ep01-full-v2.manifest.json --plan --no-sync --work <dir>` (run from `studio/`);
- take the audio from the MP4 with the bundled ffmpeg (`-vn -ac 2 -ar 48000`).

| Step | Script | What it does | Cost |
|---|---|---|---|
| Line table | `lines_table.py` | Every voiced line at its episode time (chapter start + beat offsets + `t` + word timings), joined to its take row (pace, guides, QA). It matches the transcript's times within 0.05 s | JSON only, < 1 s |
| Pace, gaps, cut-ins | `pace_gaps.py` | §4.1 and §4.3's tables | < 1 s |
| Coverage | `cover_check.py` | Conversations (gaps ≤ 3 s), setups per conversation, speakers out of frame without a tag, cut-every-line runs. (Not named `coverage.py`: that name shadows a module numba imports) | < 1 s |
| Pitch | `f0.py`, `f0_report.py`, `contour.py` | pYIN on every take (16 kHz, 60–420 Hz, 10 ms): median F0, p10–p90 range, final move; question contours with Whisper's punctuation from the rows | 194 s on one thread, `nice 19`, `OMP_NUM_THREADS=1` |
| Mix envelope | `mix_env.py`, `bed_report.py` | One sequential read of `mix.wav`: 50 ms RMS, the < 250 Hz band and spectral flux on a 10 ms hop. Then gap levels, seams, loop wraps (from the plan's bed loops) and the stops | about 1 min, one thread |
| MP4 checks | ffmpeg | 6 s of the MP4's audio at the Act Three → Four seam (the crane); 18 frames scaled to 640 px | seconds |

---

## 9. Needs a person, and open questions

| Measured here | Needs a person |
|---|---|
| Where the room drops and the score stops on nothing (§5) | **Listening:** whether F1–F3 fix the feel, and whether the room at −48 dBFS reads as silence on real speakers |
| Question contours on two machine signals (§4.2) | **Listening** to the seven questions, and to "is that the build?" |
| Pace against the guides (§4.1); the paired voices (§4.4) | Whether Tasya's terms sound unhurried after F6, and whether Radnus and Tasya sound like two different men |
| The poster run re-types (frames) | Watching the fixed run, and whether the stamps read as piling up |
| The crane stops at the cut (MP4) | Hearing the fixed join (F5) |

**Open questions for the room:**
1. Does sc 14's murmur *become* the clone's voice across the black, or stop under it? (act2-notes §8.1; #25)
2. Is MM-19's first half (13.01–13.10) meant to be MM-19's podium palette without the Fountain Pen motif? The render has no such section, so the stick reel needs a stand-in (#22).
3. For the pitch-only questions: may the writers reword #5, #16 and #17 outside Act Four, or should the fix stay in the recording (§4.2)?
4. Should the card grow to 4 s (#1)? It's +2 s of runtime, so it's the showrunner's call.
