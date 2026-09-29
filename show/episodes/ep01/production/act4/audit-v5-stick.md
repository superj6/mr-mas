# Act Four v5 stick-figure reel: dialogue and flow audit

*Auditor pass, 2026-09-26. Reel: `out/ep01/act4/reel/ep01-act4-v5.mp4` (8:41.5 = 3 s title + 8:38.5 act). Inputs: `show/reel/ep01-act4-v5.json`, `audio/ep01/act4/dialogue/lines-v5.json` and its `v5/wav` takes, `audio/reel/ep01-act4-v5/mix.wav` and `bed.py`, the reel transcript, and Act Four draft 5.1 in `script.md`.*

**Times are act clock (reel = act + 3.0 s), matching the transcript's middle column.**

> **I haven't watched this reel in real time or listened to any of it.** Everything below comes from measurements: timing, word alignments, pitch tracks, UTMOS and ASR from the takes manifest, level envelopes, onset strength, and a rebuild of the bed's separate buses. For each spot, the report gives the evidence and says what a human needs to listen for. Nothing here means the cut is locked.

---

## 0. Verdict in one paragraph

Structurally, the conversations now play out. The v4 note is answered: 101 lines, 836 words, a 61 s Gerg scene, three more scenes of 30 s or longer, and dialogue on 52% of the runtime. The writing mostly holds up line by line (§2). There are no real blurts in the text, and the two cut-offs are motivated.

What still risks the showrunner's "unnatural / blurt / cut off" reaction is mostly **delivery and sound, not words**:
- about a dozen takes run well above their character's own pace;
- three one-word takes are weak or misread ("Okay.", "Hello.", "…Ah.");
- a pause-opening method cuts through words the TTS ran together;
- the turn line "Alyi signed it." is the tail of a cheerful read;
- the call chain turns placeholder inhales into loud puffs;
- the temp bed's loop method knocks the pulse off the beat about 35 times, most of them in the metronomic PROCEDURE cue.

All of these can be fixed without touching the script's structure. §5 lists them in priority order.

---

## 1. Re-measured statistics (my own count, from the reel JSON and takes)

| Measure | v4 | v5 reel (reel team) | v5 (this audit) |
|---|---|---|---|
| Lines / words | 45 / 176 | 101 / 836 | **101 / 836** (841 by plain whitespace split) |
| Median words a line | 4 | 5 | **5** (mean 8.3) |
| Lines of ≤ 3 words | 21 | 27 | **27** (20 of ≤ 2, 9 of one word) |
| Dashes / overlaps | 5 / — | 2 / 1 | **2** ("hypothetically—", "char—") / **1** (Adelina 0.32 s over Mario) |
| Exchanges (≤ 3 s gaps, split at place/time changes) | 21, avg 2 lines | 24, 4.2 lines, median 11.2 s, 15 multi-speaker | **24, 4.21 lines, median 11.2 s, 15 multi-speaker** |
| Longest conversation | 10 s | 61.0 s | **61.0 s** (Gerg, 19 lines); then the committee 33.1 s, the terms 31.9 s, the rival lab 24.0 s. With a 5 s gap: **75.1 s** (Gerg + Tasya at the door) |
| Dialogue share (union of line spans) | < 26% | 269 s, 51.9% | **269.3 s, 51.9%** |
| Gap between lines | — | median 0.9 s | **median 0.9 s.** 27 fall in [0.2, 0.6), 37 in [0.6, 1.6), 23 in 1.6–6 s, 12 over 6 s, 1 overlap. The reel team's 31/34 differs only in how it counts the edges (twelve gaps sit exactly on 0.6 or 1.2) |
| Pickups on a change of speaker (< 3 s) | — | — | 56, **median 0.6 s**; values quantised to 0.1 s (0.5 s ×12, 0.4 s ×8, 0.6 s ×7, 0.7 s ×6) |

**Words by speaker:**

| Speaker | Lines | Words | Median words |
|---|---|---|---|
| Neleh | 26 | 272 | 9.5 |
| Gerg | 13 | 116 | 7 |
| Tasya | 6 | 100 | 11.5 |
| Mas | 23 | 97 | 3 (by design, inside real conversations) |
| Alyi | 12 | 95 | 5.5 |
| Terb | 5 | 62 | 6 |
| Mada | 2 | 4 | 2 |

**The numbers agree with the reel report.** The gap spread isn't mechanically uniform, but every value is a round planned number. The ear should tell whether the quick volleys (0.4–0.5 s pickups on four- or five-line runs) feel natural.

**Wordless stretches over 6 s:** there are 12, and all of them are designed set pieces with picture and music carrying them:

| Act time | Length | What fills it |
|---|---|---|
| 0:26.3 | 21.0 s | JOIN, the call, the Cancel click, the drop-out, the notice |
| 0:52.6 | 12.8 s | TPOOL, the rewind, "Waiting for…" |
| 2:30.2 | 7.1 s | Hearts, the eulogy post, phones |
| 3:54.7 | 6.0 s | The lobby exit, Ttemme's plate |
| 4:17.5 | 6.5 s | The rail, the door appears |
| 4:46.0 | 12.6 s | Mada, the act-out card, the 2 AM rail, Rima's posts |
| 6:13.7 | 9.5 s | The avalanche build |
| 6:24.6 | 14.3 s | Mada's label, Alyi's silent post, the hearts |
| 7:04.3 | 6.3 s | The fires, Terb's card |
| 7:42.5 | 12.2 s | The hold, two record posts, the hourglass |
| 7:56.0 | 10.0 s | The lobby sign, the dialog |
| 8:15.4 | 6.6 s | The Q* rail, the Nov 29 rail |

The two I'd watch for drag are **6:24.6–6:38.9** (the dead stop, then a 6 s silent post before "You sent three.") and **7:42.5–7:54.7** (the long hold, then two silent posts back to back). Both are by design; only a watch can tell whether they hold.

---

## 2. Conversation by conversation

"Plays out?" asks: complete thoughts, real answers, a shape (ask, push-back, turn), no blurts, cut-offs rare and motivated.

| # | Act time | Conversation (length, lines) | Plays out? | What hurts | Fix |
|---|---|---|---|---|---|
| 1 | 0:07.4 | THE PLAN: Neleh and Mada's dodge (18.9 s, 6) | Yes. A voiced sheet, with a real question and a real dodge | 0:09.8 "Leave out Mas and Gerg…" and 0:22.7 "And the CEO? What does he own?" are read about 20% over Neleh's pace (§3.1). The second is also spliced through a run-together "CEO-what" (§3.4) | Retake both inside her band. Record "And the CEO?" and "What does he own?" as two whole reads joined in room tone |
| 2 | 0:47.3 | "super." on his side (1 line) | Designed button after the 21 s set piece | none | none |
| 3 | 1:05.4 | Noon from the board's side (18.9 s, 5) | Yes, and it's the best new beat: a question nobody answers, then "Is his feed frozen?" | (a) Alyi's firing line runs at 4.46 syl/s against his 3.4–4.0 band. Alyi is meant to be the act's slow voice. (b) Only 1.5 s between "Do you have any questions?" and "Is his feed frozen?", where the script asks for "a held beat, long enough to wonder". That reads as call latency. (c) Mas's tile connects with no sound (Rima's gets a chime), so the first voice of the pass has no audible lead-in | (a) Retake at about 0.82–0.84 speed. (b) Open the gap to about 2.5–3 s; the 12:00 tick sits inside it. (c) Add the call's join chime at 1:04.4 |
| 4 | 1:27.9 | Step two: the post read once (13.9 s, 3) | Yes. It has a reason, and "Any objections?" gets real silence | In the 3 s silence after "Any objections?", the full cue swells back up by 9 dB (1:42.7). The script wants the pedal and the tick only (§4.3) | Hold the thin and duck through the silence |
| 5 | 1:44.8 | Rima's appointment (20.8 s, 9) | Yes. Every question gets an answer, and "More. Soon." has its run-up | "What should I tell them?" and "More. Soon." have very hard vowel and nasal attacks (5–10 ms, §3.6). Otherwise clean | Give both onsets a 15–25 ms fade, or softer takes |
| 6 | 2:07.6 | The all-hands (11.3 s, 2) | Yes. A question, then the record's answer as a defence | Alyi is 15% over his band. The script's pause after "You can call it this way." is there (0.85 s), but "I disagree with this." runs straight into "This was the board…" (0.08 s) | Retake slower, with about 0.4 s after "I disagree with this." |
| 7 | 2:22.7 | Gerg quit, that evening (7.5 s, 2) | A clean two-line button with its trigger (the post) on screen | none | none |
| 8 | 2:37.3 | The committee (33.1 s, 8) | Yes: the best-written scene in the act | (a) "What they actually want to know…" is marked *quieter* but is Neleh's fastest speech in the scene (5.41 syl/s). (b) "When?" is the flattest take in pass one (pitch range about 3 st, UTMOS 2.64). (c) "All we've given the staff since yesterday is *more soon*." Without audible quote marks, "is more soon" may sound like a garble. Ear check | (a) Retake at about 0.90. (b) Retake "When?" with a lift. (c) Record it with a small pause before the quoted phrase, as a quotation; if it still garbles, the writer can phrase it as "…is 'more, soon.'" |
| 9 | 3:15.2 | The rival lab (24.0 s, 5) | Yes. The cut-off is seasoning done right: the thought lands ("hypothetically" is complete, and the file stops after it), and Adelina comes in 0.32 s over its last syllable, with Mario already about 10 dB down | "It's Nozama. About the money." is 30% over Adelina's band and ends rising. Two quick lines in a row read as rushed | Retake at about 0.9, falling |
| 10 | 3:43.7 | Sunday on the lobby camera (11.0 s, 3) | Yes, as a button. The failed talks are said plainly | "It's the correct badge. \| He doesn't work here." is a splice through a run-together (§3.4). The music has near-dropouts of 0.3 s at 3:48.9 and 4:06.9, under speech (§4.1) | Two whole reads for Neleh's line |
| 11 | 4:00.7 | The second interim CEO (16.8 s, 6) | **The shape works, but the opening is the act's most rushed volley:** "Ttemme, we'd like…" (Neleh, 19% over), then 0.4 s, then "You already have an interim CEO." (**7.27 syl/s, 40% over Ttemme's band, the fastest take in the act**), then 0.6 s, then "We'd like a different one." (25% over). Three lines in 6.3 s. After the folder, **"Okay." is the weakest take in the act** (UTMOS 1.48, about 2 st of pitch, and the pitch tracker loses voicing through most of it). It lands cold after 3 s of music that has swelled back up 10 dB (4:12.2) | Retake all three opening lines inside the bands, with pickups of about 0.6 s and 0.8 s (the non-reason is a loaded reply). Re-render "Okay." (new seeds, or an alternative stock voice for Ttemme, whose voice has the lowest median UTMOS, 2.65). Keep the music thin under the folder beat |
| 12 | 4:21.6 | Tasya's statement (16.9 s, 2) | It works as a read with a reason. Nobody answers, and that is the joke | (a) No door sound: the wall opens a door silently, and "Good evening." has only the plate for a lead-in. (b) The 46-word statement runs at 5.28 syl/s against Tasya's 3.8–4.4, with a single 0.69 s pause. The act's biggest reveal is rushed. (c) There's a 0.4 s pickup from "You'll want to hear our statement." to the reading. (d) The bed loops a 4 s piece of PROCEDURE six times under it (§4.1) | (a) Door steps and the key ring at 4:18.5–4:21.4, as used at his door in S5.11. (b) Retake at about 0.86–0.88, with about 0.6 s at the sentence break. (c) About 0.9 s for him to lift the phone |
| 13 | 4:45.3 | "Step four?" | Designed ender | **It falls** about 9 st across "four", and ASR transcribes it without a question mark ("Step 4"). It reads as a label, not the one question put to Mada | Retake with a rise |
| 14 | 4:58.6 | 2 AM: the Orb, then Gerg (61.0 s, 19) | **Yes: the act's real conversation.** Gerg talks in full, Mas answers every time, and the turn ("alyi voted." / "He did both.") lands | (a) **"Alyi signed it." is the second half of one brisk read with "Scroll to the bottom."**: both files' ASR is "Scroll to the bottom, Ali signed it." It runs at 7.14 syl/s (23% over Gerg's band) with about 4 st of pitch, while the script asks for "the cheer gone, for once". (b) Four splices through run-together words in Gerg's lines (§3.4). (c) Six loud call-chain inhales on Gerg (§3.5). (d) "So. Do I tell everyone to pack?", the quiet beat, runs 6.16 syl/s, carries the loudest inhale in the act and is spliced after "So". (e) The looped bed replays two strong v4 hits under "Alyi signed it." (5:39.2) and just before "He did both." (5:41.6) (§4.4) | (a) Record "Alyi signed it." as its own whole read, lower and slower, after the 1.6 s scroll gap. (b) Whole reads per sentence. (c, d) Use the no-breath files. (e) Re-lay the bed so the pulse drops out on Alyi's name, as the script says |
| 15 | 6:02.6 | Tasya at his door (11.1 s, 4) | Yes. The lead-in (door steps, key) is audible, and "everyone." rises, so "Yes. You first." answers it | Tasya is 12–17% over his band. The splice "Don't get up, Mas. \| I won't keep you." cuts through near-peak voice (§3.4). Just before it, the music swells 13 dB during the ring-out gap (6:00.6) | Slow Tasya overall (see §3.1); two whole reads; keep the pedal flat through the gap |
| 16 | 6:23.3 | "Has anyone read the char—" | Motivated by the avalanche, but **nothing audible causes the cut:** the voice fades in about 0.1 s partway through "charter" (file 1.90–2.00 s), S6.04 has no SFX, and "NELEH left the call" appears 0.26 s later | Put the tile-exit sound (the "left the call" blip, or a thock) exactly on the cut, and move the notice to it. Otherwise it's the "render error" dash the tone guide warns about |
| 17 | 6:38.9 | Mas and Alyi across the gap (7.8 s, 4) | Yes. Whole, literal sentences; short on purpose | The violin under it breaks into 1.75–4 s fragments (§4.2). "i'm not counting today." has a hard onset | See §4.2 |
| 18 | 6:51.0 | "Below, above, around" (13.3 s, 3) | Yes. A question the record answers | Tasya is 18% over his band. **"Hello." is the second-weakest take** (UTMOS 1.63) and lands 1.9 s after the real line as a voice from the floor | Retake "Hello." Slow the real line so "below / above / around" each get their palette step |
| 19 | 7:10.6 | The terms (31.9 s, 10) | Yes. A real negotiation, and "Good question." turns | **"…Ah." doesn't say "Ah":** ASR hears "All in." (CER 2.0). Terb's 40-word read runs 13% over his band in one breath (brisk by design; ear check). "you're staying?": my pitch track shows a big fall with a 3 st tick at the end, and the manifest reads +2.2 st; ear check that it is heard as a question. "we'll stand." comes 0.5 s after he loses his board seat: optional 0.8–1.0 s | Retake "Ah" (a longer vowel, then check ASR) |
| 20 | 7:54.7 | "Chat, we're so back." | Button with a listener (the chat panel) | none | none |
| 21 | 8:05.9 | "okay." | Button | none. My pitch track shows it falls and settles; the manifest's +2.3 st "final move" disagrees, so give it an ear check | none |
| 22 | 8:11.4 | The vault (4.0 s, 3) | A clean button | "Is it ready?" falls about 8 st (a yes/no question read as a statement). Gerg is 9% over his band | Optional retake with a lift |
| 23 | 8:22.0 | The memo | A real line to a listener | The first 10 ms is already at −3 dB below peak: a hard start on "i" | Give the onset a fade |

**No text blurts.** Every line has a trigger and a listener in the script and the reel. The blurt risk that remains is audible, not written:
- **no sound for the lead-in:** Alyi's first line (1:05.4) and Tasya's "Good evening." (4:24.0);
- **a rushed pickup:** "You already have an interim CEO." (4:03.5);
- **weak one-word takes after a silence:** "Okay." (4:14.3), "…Ah." (7:13.8) and "Hello." (7:03.7).

---

## 3. The takes: measured delivery problems

Pace is articulation rate (syllables per second of voiced span) from the manifest's word alignments. I checked it against each character's own guide band in `lines-v5.json`. Pitch comes from my own pYIN track of every take (librosa, 10 ms). Quality is the manifest's UTMOS and ASR.

### 3.1 Rushed against the character's own band

| Act time | Line | syl/s | Band | Over | Note |
|---|---|---|---|---|---|
| 4:03.5 | TTEMME "You already have an interim CEO." | **7.27** | 4.4–5.2 | +40% | the fastest take in the act, 0.4 s after Neleh |
| 3:35.0 | ADELINA "It's Nozama. About the money." | 6.25 | 4.2–4.8 | +30% | and it ends rising |
| 4:05.8 | NELEH "We'd like a different one." | 5.98 | 4.2–4.8 | +25% | the loaded non-reason |
| 5:38.7 | GERG "Alyi signed it." | 7.14 | 5.0–5.8 | +23% | the turn; see §3.3 |
| 0:22.7 | NELEH "And the CEO? What does he own?" | 5.77 | 4.2–4.8 | +20% | plus a splice |
| 4:27.0 | TASYA the statement (46 words) | 5.28 | 3.8–4.4 | +20% | the reveal |
| 0:09.8 | NELEH "Leave out Mas and Gerg…" | 5.73 | 4.2–4.8 | +19% | the key logic line |
| 4:00.7 | NELEH "Ttemme, we'd like you to serve…" | 5.71 | 4.2–4.8 | +19% | |
| 6:54.3 | TASYA "Oh, we'd be fine. …below… around them." | 5.20 | 3.8–4.4 | +18% | |
| 6:08.3 | TASYA "Yes. You first. And there's a desk…" | 5.15 | 3.8–4.4 | +17% | |
| 2:11.1 | ALYI the all-hands answer | 4.61 | 3.4–4.0 | +15% | 0.08 s between its second and third sentences |
| 2:45.3 | NELEH "What they actually want to know…" | 5.41 | 4.2–4.8 | +13% | marked *quieter* |
| 7:15.8 | TERB the announcement (40 words) | 5.67 | 4.4–5.0 | +13% | brisk by design; one breath |
| 1:05.4 | ALYI "Mas. The board has decided…" | 4.46 | 3.4–4.0 | +12% | turn pace 157 wpm against a 115–140 guide |
| 6:02.6 | TASYA "Don't get up, Mas…" | 4.91 | 3.8–4.4 | +12% | |
| 6:51.0 | MAS "what happens to you if nopeai disappears?" | 4.63 | 3.6–4.2 | +10% | minor |
| 5:55.4 | GERG "So. Do I tell everyone to pack?" | 6.16 | 5.0–5.8 | +6% | the quiet beat, marked *quieter* |

Mario's 6.11 (+13%) is motivated ("speeding up as he warms up"); keep it.

**Pattern:** Tasya is over his band on four of six lines, and on all three long ones. Neleh's rushes land on her logic lines and on the Ttemme scene.

**Fix:**
- Move Tasya's Kokoro speed down about 0.05 across the board (0.92 → about 0.87).
- Retake the listed lines at the bottom of their band.
- For the long real lines, open about 0.5–0.7 s at sentence breaks by recording each sentence whole and joining the reads in room tone. Don't time-stretch.

### 3.2 Weak or misread one-word takes

| Act time | Line | Evidence | Fix |
|---|---|---|---|
| 4:14.3 | TTEMME "Okay." | UTMOS **1.48** (the act's lowest; the median is about 3.5); pitch range 1.7–2.0 st; pYIN finds voicing in only about 0.2 s of a 0.6 s word | New seeds, speed 0.95–1.0, or audition another stock voice for Ttemme (median 2.65 over his 5 lines) |
| 7:03.7 | TASYA "Hello." | UTMOS **1.63** | New seeds; ear check |
| 7:13.8 | TERB "…Ah." | ASR hears **"All in."** (CER 2.0) | Retake with a longer open vowel; confirm with ASR |
| 2:54.7 | NELEH "When?" | pitch range about 3 st, UTMOS 2.64 | A take with a clear lift |
| 0:25.4 / 7:39.7 | MADA "Good question." | UTMOS 2.55; the same take twice, by design | Ear check that the reuse reads as the runner, not as a copied file |

**Voice-level note.** Neleh carries the pass: 26 lines and a third of the act's words. Her stock voice has the lowest median UTMOS of the principals (3.05; the plain reads score 2.95, so the chain isn't the cause). Mas is 3.98, Alyi 4.15 and Terb 4.11. Worth a short A/B with one or two other stock voices before the pixel build.

### 3.3 The split read at the turn of the 2 AM scene

"Scroll to the bottom." (5:36.1) and "Alyi signed it." (5:38.7) were rendered as **one** Kokoro read ("a-puck-quick", speed 1.04). A 1.6 s room-tone gap was then opened between them, with a synthetic inhale. The manifest's ASR for both files is the single sentence "Scroll to the bottom, Ali signed it."

- The second half runs at 7.14 syl/s with about 4 st of pitch.
- Its prosody carries on from the comma, so after the gap it resumes mid-phrase, at the same brisk cheer.
- The script's direction is "(the cheer gone, for once)", and this is the scene's turn.

**Fix:** record "Alyi signed it." as its own whole read, lower and slower (speed about 0.95, the bottom of Gerg's band or below), with no inhale. Keep the 1.6 s scroll gap and the Orb's chime inside it.

### 3.4 Pauses opened through words the TTS ran together

The method opens a pause at the quietest 5 ms, with a 60 ms fade-out and a 25 ms fade-in. Sixteen processing notes flag "Kokoro ran the words together here … ear check". Where the dip at the cut is only −20 to −25 dB and the voice sits within about 3 dB of its peak on both sides, the cut goes through connected speech. The next word then starts almost at full level, and its pitch carries on as if there had been no pause. That can sound like a dropout or an edit.

The risky ones:

| Act time | Line and cut | Level before / after the gap (dB re peak) | Dip |
|---|---|---|---|
| 5:08.8 | GERG "Best time there is. \| Nobody else…" | −2.5 / −1.5 | −20.0 dB |
| 5:08.8 | GERG "…why I called. \| You've got the staff letter open?" | −1.8 / −1.7 | −36 dB |
| 5:51.4 | GERG "The company. Again. \| Just in case." | −0.6 / −1.4 | −25.6 dB |
| 6:02.6 | TASYA "Don't get up, Mas. \| I won't keep you." | 0.0 / −2.9 | −22.3 dB |
| 0:22.7 | NELEH "And the CEO? \| What does he own?" | resumes at −2.2 | −20.5 dB |
| 3:37.1 | MARIO "Hi. Yes. \| We're very worried." | resumes at −1.6 | −34.8 dB |
| 3:52.3 | NELEH "It's the correct badge. \| He doesn't work here." | resumes at −5.5 | −31.2 dB |
| 3:24.2 | MARIO "Wow. \| I've actually…" | — | −21.1 dB |

**Fix:** do what "No. That is just him." and "Good evening. …" already do. Record each sentence as its own whole read and join the reads in room tone. Or keep Kokoro's run-on and drop the opened pause where it isn't needed.

### 3.5 Placeholder inhales: uniform, and loud on the call chain

- **Uniform.** 51 of 101 lines carry a synthetic inhale. 48 are head inhales of the same length (0.33–0.40 s), in the same place (0.4 s into the file, about 0.1 s before the first word).
- **Loud on the call chain.** On-mic, they sit about −24 dB under the speech RMS (median). On the call/monitor chain, the inhale passes through the chain's second compressor and lands **12.7–17 dB under the speech**. That will likely read as a burst of static before the line.

Call-chain lines with loud inhales:

| Act time | Line | Inhale re speech RMS |
|---|---|---|
| 1:05.4 | Alyi | −15.2 dB |
| 1:13.6 | Alyi | −14.6 dB |
| 5:04.3 | Gerg | −14.4 dB |
| 5:08.8 | Gerg (mid-line) | −16.7 dB |
| 5:17.9 | Gerg | −13.9 dB |
| 5:38.7 | Gerg (mid-line) | −17.1 dB |
| 5:44.7 | Gerg | −14.7 dB |
| 5:55.4 | Gerg | **−12.7 dB** |
| 6:23.3 | Neleh | −13.6 dB |

**Fix:**
- On the call chain, use the already-rendered `v5/nobreath/` files, or put the inhale after the chain at the on-mic level.
- On-mic, keep inhales only before long speeches that follow a pause, and vary their length and lead.

### 3.6 Hard onsets (a possible "blurt" sound)

These starts reach within about 5 dB of peak in the first 10–20 ms (manifest rise 5–10 ms), with no breath or consonant in front:

| Act time | Line |
|---|---|
| 1:56.4 | RIMA "What should I tell them?" |
| 2:04.4 | RIMA "More. Soon." |
| 5:06.9 | MAS "it's two in the morning, gerg." |
| 5:28.3 | MAS "and go to macrosoft." |
| 6:45.2 | MAS "i'm not counting today." |
| 7:37.4 | MAS "of what?" |
| 8:22.0 | MAS the memo |

**Fix:** a 15–25 ms onset fade in the edit, or pick softer takes. A human should listen to these seven.

### 3.7 Question and statement contours

| Act time | Line | Measured (pYIN, last word) | Verdict |
|---|---|---|---|
| 4:45.3 | NELEH "Step four?" | falls about 9 st; ASR "Step 4" | **Fix:** needs a rise |
| 8:11.4 | GERG "Is it ready?" | falls about 8 st | Optional retake |
| 1:16.9 | NELEH "Is his feed frozen?" | falls about 4 st | "Half to herself", so acceptable; ear check |
| 7:28.3 | MAS "you're staying?" | high onset and a big fall, then a 3 st tick at the end | Ear check that it reads as a question |
| 3:35.0 | ADELINA "…About the money." | ends rising | Fix with the retake in §3.1 |

**Where my measure and the manifest disagree:** "okay.", "mostly." and "Sorry, one sec. I've got a build compiling." The manifest's `final_move_st` says they rise (+2.3, +1.7, +5.5 st). My tracks show "okay." and "mostly." falling. On the Gerg line, my track loses voicing on "compiling", so I can't settle it. I don't flag these as problems; a human should hear them.

### 3.8 Gaps worth changing

| Act time | Where | Now | Suggest |
|---|---|---|---|
| 1:16.9 | "Do you have any questions?" → "Is his feed frozen?" | 1.5 s | About 2.5–3 s ("long enough to wonder") |
| 4:03.5, 4:05.8 | the Ttemme volley | 0.4 s / 0.6 s | About 0.6 s / 0.8 s |
| 4:27.0 | "You'll want to hear our statement." → the reading | 0.4 s | About 0.9 s |
| 7:33.3 | "…don't sit on the board." → "we'll stand." | 0.5 s | Optional 0.8–1.0 s: it's the cost of the deal |

Everything else sits inside the flow guide's 0.2–0.5 s (quick) and 0.6–1.2 s (loaded) ranges, or is a designed beat.

---

## 4. The temp bed: what might sound like a mistake

I rebuilt the bed with the reel's own `bed.py`, run from a copy in my scratch folder that writes only there, to get the music, room, dialogue and SFX buses separately. The rebuilt mix matches the delivered `mix.wav` to within 0.0003 dB in every 50 ms window. All the cues run at 96 BPM (beat 0.625 s), except the avalanche at 96.9.

### 4.1 Every loop wrap is 1 s short, so the pulse slips off the beat (the main bed problem)

**Cause.** In `bed.py`'s `render_part`, each loop pass fades out over the last 1 s *inside* the loop, and the next pass starts over it (`w += take - xf`). So the effective loop period is (end − start − 1 s), not (end − start). The PROCEDURE loops were chosen on bar lines (10, 22.5, 15 and 5 s), so every wrap loses 1 s. That is 1.6 beats, which leaves the pulse **0.4 of a beat (0.25 s) off the grid**. Two copies of the clockwork run 0.25 s apart through the 1 s crossfade.

**Evidence.**
- On the output, a 96 BPM comb fit before and after each wrap measures phase jumps of 0.24–0.31 s at every PROCEDURE wrap, in agreement with the arithmetic.
- An onset detector finds double attacks 35–60 ms apart at 3:41.1, 3:50.4, 3:59.4, 4:08.4 and 4:17.4.

PROCEDURE is the cue written with "0 ms humanisation on every track": a clock. A skip in a clock is exactly the "jagged" the showrunner heard in v3.

| Cue | Loop | Wraps (act time) | Slip per wrap |
|---|---|---|---|
| M4 PROCEDURE, Friday | src 15–25 s | 1:13.2, 1:22.2, 1:31.2, 1:40.2, 1:49.2, 1:58.2, 2:07.2, 2:16.2, 2:25.2 | 0.25 s |
| M4, Saturday | 40–62.5 | 2:57.5 | 0.25 s |
| M4, the split | 65–80 | 3:26.5, 3:40.5 | 0.25 s |
| M4, Sunday | 85–95 | 3:50.0, 3:59.0, 4:08.0, 4:17.0 | 0.25 s (double attacks measured) |
| M4, under Tasya's statement | 95–100 (a 5 s piece; source level swings 19 dB, so it re-attacks) | 4:22.5, 4:26.5, 4:30.5, 4:34.5, 4:38.5, 4:42.5 | 0.25 s, **and the same 4 s phrase six times** |
| M4, "Step four?" | 105–110 | 4:48.3 | 0.25 s |
| M5, 2 AM | 2.0–27.5 | 5:17.0, 5:41.5 | 0.125 s |
| M5, the glance | 27.9–29.6 (**0.7 s period**) | nine wraps, 5:54.9–6:00.5 | a smear. The source there is a steady pedal (±2 dB), so probably benign; ear check |
| M5, Tasya's door | 29.8–34.4 | 6:04.5, 6:08.1, 6:11.7 | 0.15 s; one note re-attacks every 3.6 s |
| M7a, the violin | 1.0–6.2 | 6:36.5, 6:40.7, 6:44.9 | 0.175 s; **the violin phrase restarts every 4.2 s** |
| M7a, the floor | 6.5–14.3 | 6:55.5, 7:02.3 | 0.075 s |
| M7b | 29.3–40.5 | 7:55.6 | 0.2 s |

About 35 wraps are off the grid. The loops that come out right are M3 (5 s = 2 bars) and M7a 15–23.5 (7.5 s = 3 bars): with the 1 s overlap removed, they happen to be whole bars.

**Part joins land off the beat too.** The same comb fit measures shifts of 0.2–0.3 s at:
- 0:17.5 (double attack 35 ms apart at 0:18.0, under the waltz, between Neleh's lines);
- 2:31.2 and 2:36.0 (Friday into Saturday);
- 4:18.5;
- 4:49.3 (into the act-out card);
- 7:57.2, 8:00.5, 8:03.5 and 8:05.2 (the lobby).

The ones on scene changes are partly masked.

**Fix (bed.py):**
- Read 1 s past the loop end for the fade-out (`chunk = x[pos : b + XF]`), so the period equals end − start; or choose end − start − 1 s as whole bars.
- For part joins, choose each new source point so that (new − old position) is a whole number of bars, or crossfade on a downbeat.
- Replace the 5 s and 4 s loops under the statement and under "Step four?" with a held chord, which is what the script asks for ("a held chord under his reading, re-voiced once").

### 4.2 The Monday violin breaks up (6:31–6:49)

The thin (a 500 Hz low-pass blend under talk) removes nearly all of a solo violin, and the 4.2 s loop restarts its phrase. So the only music under Alyi's post and the four-line exchange comes and goes:
- music-bus runs above −50 dBFS of 3.1, 4.1, 2.3 and 1.75 s, starting at 6:31.7, 6:34.9, 6:39.2 and 6:43.8;
- down to −58 dBFS under "You sent three.", below the bullpen bed (−35 to −48).

That is the v3 "plays for a second then stops" pattern again.

**Fix:** for M7a, duck without thinning (or thin to a sustained note, not a low-pass), and hold one violin note as the script says ("holds its note and lets it decay under the hearts and the exchange"), with no loop.

### 4.3 The music swells up inside silent beats

`bed.py` holds the duck only across gaps under 2.5 s. In the 2.5–3.5 s silences inside a scene, the full cue, melody included, comes back 9–16 dB for about 2 s and then ducks again:

| Act time | Beat | Swell |
|---|---|---|
| 1:25.2 | the pen tick after the laptop "super." | +14.7 dB, 2.65 s |
| 1:42.7 | the silence after "Any objections?" (the script: pedal and tick only) | +9.3 dB, 2.0 s |
| 4:12.2 | Ttemme reads the sealed folder | +10.2 dB, 1.95 s |
| 6:00.6 | after "ask me when it compiles." (the script: the pedal holds, a ring-out) | +13.1 dB, 1.95 s |
| 2:19.8 | the all-hands into the evening | +16.3 dB, 2.75 s (a scene change, so acceptable) |

A short swell in a held silence can sound like pumping, or like a hole in the mix.

**Fix:** hold the thin and duck across gaps up to about 4 s within one conversation, or add explicit keep-thin windows for these beats.

### 4.4 v4 cue material landing on the wrong moments

M5 loops the v4 S5 render, which was written to v4's picture. That render has two strong attacks (about 21× the median onset strength, at source 24.2 s and 26.6 s), and each loop pass replays them:
- at **5:14.7** and **5:17.1** (under Gerg's long line, and just before the letter);
- at **5:39.2** (under "Alyi signed it.") and **5:41.6** (just before "He did both.").

The script wants the opposite at the turn: the pulse "drops out for the scroll's stop on Alyi's name … and comes back on 'He did both.'".

**Fix:** re-lay M5 so these attacks fall away from the lines, and cut the pulse from the scroll stop to "He did both.".

### 4.5 Two loud spots

| Act time | What | Level |
|---|---|---|
| **1:00.5** | The end of the dark room: M3's source jumps the music from −42 to −16 dBFS in 0.25 s | +26 dB step; peaks −14 dBFS in 50 ms; the 1 s level at 1:01.0 is −19.1 dBFS, as loud as the avalanche |
| **8:00–8:04** | The lobby sign stab and the flat line | 1 s levels of −17.6 to −18.6 dBFS: the loudest music in the act, about 2 dB above the avalanche (−19.2 to −19.8), which is the "one full band" |

The first is probably MM-08's Rewind gesture, so it may be intended, but it's the loudest moment in the first two minutes and it arrives after a near-silent flashback.

**Fix:** ride the rewind down about 6 dB. Check by ear that the lobby stab should be louder than the avalanche; if not, −3 dB.

### 4.6 Missing sounds for things the picture does

| Act time | Missing | Fix |
|---|---|---|
| 1:04.4 | Mas's tile connecting on the board's call. Alyi's first words follow with no audible lead-in, while Rima gets `bell_ding_F6` | Add the call's join chime |
| 4:18.5–4:21.4 | The slate door appearing and opening in the boardroom wall | Door steps (`landing_thunk` ×3, as at his door in S5.11) and the key ring's jangle |
| 6:24.4 | Neleh's cut-off: the voice fades partway through "charter" with no sound | Put a "left the call" blip or a tile thock on the cut; move `NELEH left the call` onto it |
| 6:37.6 (optional) | The three hearts crossing the gap | Soft ticks like the 2 AM hearts' |

### 4.7 Checked and fine, or already known

| What | Finding |
|---|---|
| Holes under −42 dBFS (0.3 s or longer) | Only the title card and the post-Cancel silence (3.65 s) |
| The post-Cancel silence | Room tone at −47 dBFS, where the script asks for digital silence (already flagged by the reel team) |
| Level jumps over 15 dB | 117. Of those, 112 are dialogue edges against the ducked floor, which is natural. The other five are the title card, the Cancel click, the phone buzz (×2) and the 1:00.5 rewind (§4.5) |
| Music under talk / between talk | About −36 dBFS / about −26 dBFS. Dialogue −16 LUFS; the laptop "super." −22 LUFS, as designed |
| Near-dropouts of the music | 0.3–0.5 s dips below −50 dBFS at 3:48.9, 4:06.9 and 4:15.9 (a rest in the looped Sunday section), all under speech and under the room bed. Minor; they go away with the §4.1 re-lay |
| The rival-lab overlap | Clean. "Hypothetically" is complete in the file, which stops after it (−52 dBFS by 8.50 s), and Mario is already about 10 dB down when Adelina starts |
| Designed dead stops | Present where the script puts them: the JOIN click, the Cancel click, Mada's label, and "of what?" through the long hold (music off 7:38.3–7:45.3, the fires' room bed under it) |

---

## 5. Fix list, in priority order

**Voices** (re-render and re-lay; no script change):
1. "Alyi signed it.": its own lower, slower read (§3.3).
2. The Ttemme volley (4:00.7–4:05.8) and "Okay." (§3.1, §3.2).
3. Tasya slower overall; the statement with a real sentence break and a 0.9 s pickup (§3.1, §3.8).
4. "…Ah." (misread), "Hello." and "When?" (§3.2).
5. "Step four?" with a rise (§3.7).
6. Whole reads per sentence where the pause splice cuts connected speech: Gerg ×4, Tasya, Neleh ×2, Mario (§3.4).
7. No-breath files on the call chain; fewer and varied on-mic inhales (§3.5).
8. Alyi ("Mas. The board has decided…", the all-hands), Neleh ("Leave out…", "And the CEO?…", "What they actually want…"), and Adelina's second line inside their bands (§3.1).
9. Onset fades on the seven hard starts (§3.6).

**Bed** (bed.py):

10. Fix the loop period and the join phase (§4.1). Replace the 4–5 s loops under the statement with a held chord.
11. The violin in M7a: no thin, no loop (§4.2).
12. Hold the thin across silent beats of up to about 4 s (§4.3).
13. Re-lay M5 around the turn (§4.4).
14. Ride the rewind at 1:00.5; check the lobby stab (§4.5).
15. Add the join chime, the boardroom door, and the sound on Neleh's cut-off (§4.6).

**Timing** (reel JSON):

16. About 2.5–3 s before "Is his feed frozen?"; 0.6 s and 0.8 s in the Ttemme volley; 0.9 s before the statement (§3.8).

**Writer, optional:**

17. "…is *more soon*.": decide after hearing the retake (§2 #8).

None of these changes the structure, the conversation lengths or the guardrails. Every fix above keeps the words as written. The two optional wording alternatives (§2 #8, and "Step four, Mada?" if a rising take can't be had) would be `[INVENTED]` and are the writer's call.

---

## 6. What a human must check (listen and watch list)

1. **Watch the whole reel in real time.** Nothing here was watched or heard.
2. **Listen to these takes in context:**

   | Act time | Take |
   |---|---|
   | 4:03.5 | "You already have an interim CEO." |
   | 4:14.3 | "Okay." |
   | 5:38.7 | "Alyi signed it." |
   | 7:13.8 | "…Ah." |
   | 7:03.7 | "Hello." |
   | 4:45.3 | "Step four?" |
   | 4:27.0 | Tasya's statement |
   | 5:08.8 | Gerg's two splices |
   | 5:51.4 | "The company. Again. Just in case." |
   | 6:02.6 | Tasya's splice |
   | 6:23.3 | "char—" |
   | 7:28.3 | "you're staying?" |
   | 2:58.4 | "…more soon." |

3. **Listen to the bed:**

   | Act time | Where |
   |---|---|
   | 1:13–2:26 | The Friday tick: do the nine slips register? |
   | 3:50–4:18 | Sunday (the measured double attacks) |
   | 4:22–4:44 | The 4 s loop under the statement |
   | 6:31–6:49 | The violin |
   | 1:42.7, 4:12.2, 6:00.6 | The swells |
   | 1:00.5 | The rewind |
   | 8:00 | The lobby stab |
   | 5:54.9–6:00.5 | The 0.7 s smear |

4. **Hear the call-chain inhales** at 1:05.4, 5:17.9 and 5:55.4: static, or breath?
5. **Watch whether the two long wordless stretches hold:** 6:24.6–6:38.9 and 7:42.5–7:54.7.
6. **Rule on the post-Cancel silence:** room tone, or digital silence.

---

## 7. How this was measured (to re-run)

The scripts are in my scratch folder, `/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/dlg5-auditor/`. Small scripts are kept there, the large intermediates were deleted, and the session scratchpad may be cleared.

| Script | What it does | Environment |
|---|---|---|
| `lines.py`, `stats.py` | The line table on the reel clock (the same frame rounding as `bed.py`), word counts, gaps, exchanges and dialogue share | `python3` |
| `takes.py` | Onsets, inhale levels, tails and splice-edge levels from `v5/wav` | `audio/.venv-mix` |
| `f0.py` | pYIN pitch tracks | `audio/.venv-vocals` |
| `bed_copy.py` | `bed.py` with its outputs redirected to scratch and bus envelopes saved; its mix matches `mix.wav` | `audio/.venv-mix`, about 70 s |
| `joins.py` | Every loop wrap and part join; the slip arithmetic; the 96 BPM comb fit on the rebuilt music bus | `audio/.venv-vocals` |

The pace bands, UTMOS and ASR come from `audio/ep01/act4/dialogue/lines-v5.json`.

No project file was changed except this report. Nothing was committed, rendered or re-recorded.
