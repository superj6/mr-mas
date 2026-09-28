# Ep1 v3: the moods a viewer feels (`v31-mood`, 2026-09-27)

> **The ask (showrunner, 2026-09-27):** "while you're fixing the new final variant i want you to do analysis on various moods viewer will feel throughout from the different visual, story, an sound aspects amd make sure it is desireable". The same day's notes this reads against: the beginning of Act One's score was "slightly corny"; "we want to make sure we're keeping a unique sound, not toning down to overly generic"; a few transitions "come out of nowhere"; Act Four should open as "a sudden shock to viewer he's fired".
>
> **Nobody watched or listened.** Every judgement below rests on four things, and each claim says which:
> - **measured:** the picture (every frame) and the sound (the final mix) of `out/ep01/full-v3/ep01-v3.mp4`;
> - **looked at:** 651 sampled frames (one every 3 s, plus every shot's start) and the film's contact sheet;
> - **read:** the transcript, script draft 6 and the first-round cue sheets;
> - **judged:** story tension, valence and the likely feeling.
>
> Nothing else in the repo was edited, and nothing was committed. The chart is [`out/ep01/full-v3/mood-curve.png`](../../../../../out/ep01/full-v3/mood-curve.png).

**The film measured.** The Kokoro film is 21:25.75 long and was built at 14:47. It carries:
- **the first-round score**, which the v3.1 round restores as its base (cue sheets at `851243f` and `7d7a99f`);
- **the old cold open** (30.67 s), which still ends on the 1993 dialog.

Times below are film time. The v3.1 lock will move them: the cold open loses 4.0 s, and Act Four is being re-cut. The ElevenLabs film wasn't measured. Its picture and score are the same and only the voices differ.

---

## 0. The short version

**What's already right, and must be kept.**
- **The first-round score is varied.** By the cue sheets, over the 20:44 of story time:

  | Mood family | Share of story time |
  |---|---|
  | dry (pomp, procedure, THE PLAN) | 29% |
  | warm | 20% |
  | intimate | 18% |
  | suspense or dread | 11% |
  | comic or caper | 10% |
  | exhilarating | 4% |
  | no score | 9% |

  v2 was about four-fifths minor-key suspense, so this is the variety the showrunner asked for, in the show's own sound.
- **Some sequences land as intended**, with the channels agreeing or contrasting on purpose:
  - Act Two's comedy;
  - the rooftop act-out;
  - Act Three's intimacy;
  - 2 AM;
  - the calm-off;
  - the tag.
- **From the cold open to the tag, 73% of the running time plays as desirable.** The rest is 16% flat, 7.5% mis-toned and 3% conflicting (judged, by scene).

**The three biggest mood problems.**
1. **The firing isn't a shock. It's a briefing.**
   - THE PLAN's blueprint stamps `HOW TO FIRE A CEO` about 30 s before the call. It's the most saturated, bluest image in the film, set to a featured waltz.
   - Then the call on his side has no words for 9 s, and its one event is an abstract `Cancel`.
   - The viewer learns he's fired from the explainer, not from the blow.
   - The sound's subtraction does work: the mix drops 31 dB into 3.7 s of room tone at −49 LUFS. But it lands on news we already have. v3.1's restructure is the fix; §4 #1, #6 and #7 add what it needs.
2. **Launch night's warmth lives only in the score, and in a lounge colour.**
   - The picture is dark (8.6% luma), cool (R−B −17.8) and the stillest scene in the film (motion 0.11).
   - The talk runs 87% of the time.
   - The one warm channel is an A♭-major jazz trio (Rhodes, felt, brushes, upright), arriving two seconds after the main title's own chamber jazz.
   - Across Act One, jazz-trio or swing textures cover about 53% of the runtime, and THE JOB family plays four times in the episode against the bible's guide of about three.
   - The showrunner's "slightly corny" is most likely that stack.
3. **The peaks don't stand out, and the faces that matter are in near-black.**
   - The mix is levelled to the talk. 34 of the 45 story scenes (87% of story time) sit within −15.5 to −18.0 LUFS. The odometer (−16.5) and the one full band (−15.5) are no louder than launch night's conversation (−15.7).
   - The picture's median luma is 11%, and 34% of story time is under 8%. The non-joke close-ups are among the darkest shots: "alyi voted." at 4.3%, Gerg's look up at 4.9%, Neleh's real face at 4.8%, Alyi in the glass at 4.4%.
   - Add a story plateau (tension 3.8 on average from 6:25 to 11:58, with one real rise, the crack) and the dominant feeling is "amused" for about two-thirds of the episode.

**The top fixes** (§4 has all thirteen):
1. **Act Four:** do v3.1's shock opening, and add to it:
   - a bright, hard-cut, literal dialog;
   - Alyi's sentence clearly heard over a thinned LEVERAGE;
   - a floor of 10–15 s in the suite before the blow.
2. **The launch-night score:** for the first 68 s, only Gerg's Build (chip) and Mas's felt. The trio comes in when the chat flatters him, then the swing on the counter. Play the pause letter straight. Don't use round 2's generic pad.
3. **The mix:** +2–3 LU for the two story set-pieces, the odometer and the avalanche.
4. **The picture:** a face light on eight non-joke close-ups.
5. **The story:** one V.O. line at the bay. Make each restored beat (the hands runner, Rezeile, Sydney, the Atem crate) Mas's problem, with no new music colours.

---

## 1. What was measured, looked at and judged

| Channel | Source | What | How |
|---|---|---|---|
| Picture | the film, every frame (30,858) | brightness (mean Rec.709 luma), saturation, warmth (mean R−B), motion (mean abs luma change per frame), cuts | decoded at 320×180 through the Remotion ffmpeg (`ops/heavy.sh`), measured at 160×90, per second |
| Cuts | the same | a histogram jump (>0.20, or >0.10 with motion >10) | **calibrated against the lock: 188 of its 216 story shot changes found (87%)**. The 28 extra hits are in-shot changes (freezes, flashes, the blueprint, the avalanche). |
| Picture, by eye | 651 frames and the film's contact sheet | framing, legibility, register, where the warm light is | ten contact sheets at 256×144 |
| Sound | the film's audio (the final Kokoro mix, −16.07 LUFS integrated as measured) | short-term (3 s) and momentary (400 ms) loudness every 100 ms, spectral centroid, the share of 50 ms windows under −60 dBFS | BS.1770 K-weighting (pyloudnorm's filters), since this ffmpeg has no `ebur128` |
| Music | the first-round cue sheets (`git show 851243f:` cold open, Acts One and Two, the tag; `7d7a99f:` Acts Three and Four) | 105 cue sections on the episode clock, each with its palette and its measured loudness (the score alone, before the duck) | each section tagged to one of seven mood families (§3.2) |
| Story | [the transcript](assembly/transcript.txt), the SRTs (line spans) and [the script](../../script.md) | talk share and V.O. share per scene; tension (0–10), valence and POV per scene | **judged**, from the script's `SCENE:` lines and what the picture and sound deliver |

---

## 2. Sequence by sequence

**The columns:**
- **Channels:** *agree*, *productive contrast* (the gap is the point), or *conflict* (the gap works against the intent).
- **Verdict:** desirable, flat, conflicting or mis-toned.
- **Units:** luma is mean brightness as a percentage of white; R−B is warmth, negative for cool; "mix" is the short-term loudness's energy mean.

| # | Film time | Sequence | Intended (script) | Picture (measured · looked at) | Story (judged) | Sound (mix measured · score from the cue sheet) | Likely feeling | Channels | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0:00–0:31 | **Cold open**: APEC, the hailstone, the invite, "noted.", the rewind | poised, curious | The navy stage and the banquet's gold (27%, R−B −20). The freeze. **The 1993 dialog is the film's brightest long run** (56%, cream). | tension 3. A mystery (the lit window, the black square). No V.O., by rule. | 20 s with no score (the hall, the applause), then MM-06's 1-bit under the rewind. Mix −16.6. | curious; then puzzled by two 1993s six seconds apart (the dialog, then the intro's) | agree until the exit, then conflict | **desirable**; the exit **conflicting**. *v3.1 has fixed it: the rewind now collapses into the intro's cursor.* |
| 2 | 0:31–1:03 | **Title and card** | the show's energy; then a reset | The film's highest motion (5.3) and cut rate (52 a minute). Then 2 s of black. | — | The main title's chamber jazz; then the card's room tone at −36 LUFS. | energised, then reset | agree | desirable. *(Note: the title's jazz is followed 2 s later by launch night's trio: two jazz colours back to back.)* |
| 3 | 1:03–2:11 | **Launch night: ship it?** (sc 5, to the click) | warm, giddy, "will anyone notice?", with Rima's cost and Alyi's dread underneath | **8.6%, cool (R−B −17.8), motion 0.11: the stillest scene in the film.** 7 cuts a minute, including a 29 s over-the-shoulder on Rima. The hallway's tungsten is the only warm light. Alyi's reflection is barely legible. | tension 3; warm banter with an undertow. **The V.O. is at its densest** (25% of the time, 4 lines). | **Talk 87% of the time.** The A♭-major late-night trio (Rhodes, felt, brushes, upright) plus the Build, ducked 6 dB (the music section at −20.9). Mix −15.7. | amused, cosy, a little talky. The warmth arrives only as a jazz-lounge underscore. | **conflict**: the picture is cool and still, the score warm and cheerful; the story's undertow isn't in the score | **mis-toned** (the showrunner's "slightly corny") |
| 4 | 2:11–2:29 | **The click; Alyi's count** | tender, uneasy | Alyi in the glass at **4.4–4.6%** (murk). The finger on the button. | "Six years and eleven months." The first non-joke beat. | E♭13sus held through the click, then the felt alone with the Door. | tender, uneasy | agree (the face is hard to read) | desirable |
| 5 | 2:29–2:54 | **The chat flatters him** | amused; the first flicker of vanity | Dark laptop screens (9.5%). | "it likes me." / "i still read it twice." | The trio and the Build, with pizz. | amused | agree | desirable |
| 6 | 2:54–3:22 | **The odometer** (sc 6) | **exhilarating**, then the heat | 9%, motion 0.26. Small inserts on black (the counter, the hole). The red glow of the heat at 3:11–3:21 is the one strong image. | tension 5. "someone noticed."; the legible million. | **SET-PIECE SWING in A♭, the act's loudest cue (−17.1 music, featured)**, but **the mix sits at −16.5, level with the talk before it.** | pleased, not lifted | the music alone carries the lift | **flat** (under-lifted) |
| 7 | 3:22–3:34 | **The bill** (sc 7) | the sting: "it's the bill." | Mas's close-up, dark; the tear onto the red GPU. | "it's the bill." / "mostly the bill." | The Ache over F. The siren J-cuts in 4 s after the line. | a wry sting, gone quickly | agree | desirable, if brief |
| 8 | 3:34–4:09 | **Elgoog's code red** (sc 8, on his phone) | comic panic | **The brightest, most colourful stretch of Act One** (29%, motion 0.73): sunset gradient, primaries. | tension 3. The rival's founders. Nobody in Mas's room reacts until he locks the phone. | Pizz 16ths and the siren as a joke, through the phone's futz. **The brightest sound in the act** (centroid 1.09 kHz). | amused; the act's energy peak belongs to a rival | productive contrast: the rivals have the polish, the plain button wins (style-range §6.1a) | desirable, a little long |
| 9 | 4:09–5:25 | **The landlord's deal; weeks on** (sc 9) | caper, charming; the price | Grey-blue daylight (22%), sunbeams, still (0.23). A 28.5 s two-shot on the terms. The full-freeze card. | tension 4. The twelfth key, the lease; "ours does that too."; Gerg closes his laptop. | Talk 70%. THE JOB swing (F dorian); a dead stop on the collar's pop (8 s of room); Tasya's floor (−21.9); the swing back. | charmed and wary; then a small guilt | agree | desirable |
| 10 | 5:25–6:02 | **The duel** (sc 11, split) | rivalry, comic | A grey bullpen against warm brick (R−B −3.9). A match cut on the laptop. | tension 4. The memo becomes a website. | The Lighthouse, straight, in B♭ minor: the Build against the Addendum. Talk 42%. | amused, a bit busy | agree | desirable |
| 11 | 6:02–6:25 | **The pause letter** (sc 12, act-out 1) | a chill | **Nole's desk is the darkest shot in the film that isn't black** (3.9%, 10.7 s). Then the bright `PLEASE`. | tension 5. Two new faces, no V.O., the ask withheld. | MM-17's swung F-minor-blues walk (**THE JOB colour: its third use**); no score on the reflection; THREAT on the pen. | a chill, but not clear whose | the picture hides the new faces | **flat**: the act-out's stake isn't Mas's yet |
| 12 | 6:25–7:39 | **The White House** (sc 13) | pomp and comedy | **The warmest room in the film** (R−B +17.6, 26%): cream walls and wood. | tension 3. The class photo, Radnus's warning, the lens look. 3 V.O. lines. | B♭-major chamber pomp **from the first frame: a +20 dB step out of THREAT's black.** Talk 76%. | delighted | agree; his stillness against the pomp is the joke | desirable (the entry is abrupt) |
| 13 | 7:39–7:50 | **The bay** (sc 14) | a hush; the cold open's thread | **Near-black (5.8%).** A lit window in the dark. | tension 4. An anonymous repost and a hailstone. Talk 9%. | **−27 LUFS: the quietest scene on average**, quieter than the firing's (a designed hush: no score). | puzzled | the three channels all drop out at once | **flat**; reads as "out of nowhere" |
| 14 | 7:50–9:09 | **The Senate; the tour** (sc 15–16) | procedural comedy; momentum | Dark navy (13%); the wallet insert; the poster. | tension 4. "health insurance", "…i have no equity", the stamps. No V.O., by rule. | A lighter Under Oath; **the music stops for 11.8 s on the wallet**; THE RUN's 8 s. | amused, then brisk | agree | desirable |
| 15 | 9:09–9:50 | **The rooftop** (sc 17, the midpoint act-out) | grand, then uneasy | **The brightest scene in the story** (43%): the sky; the orange register graphics; the crack; the glass. | tension 5 to 6. "It doesn't say what it costs." | The Upsell (**THE JOB's fourth use**), a featured climb cut at the crack, then the bell alone for about 5 s at −35. | amused, then uneasy | agree | desirable: the episode's best-built act-out |
| 16 | 9:50–10:25 | **The Orb arrives; Mario's phone** (sc 18–19) | intimate, a little lonely | Dark teal (13%); the glyph face in the scan; a cream label. | tension 3. "i made it for everyone else." Sc 19 is 9.5 s with no speech. | **A +21 dB entry** (the bell's black, then the felt's D♭ bloom on the first frame). The Water Line, warm. | tender, wry; sc 19 idles | agree | desirable (sc 19 flat) |
| 17 | 10:25–11:06 | **The Tidder post; Gerg's call** (sc 20) | warm | 6.6%, motion 0.12: one held two-shot. | tension 4 to 2. "go to sleep, gerg." V.O. about Gerg. | The Build in A♭, in passes. Talk 65%. | warm | agree | desirable |
| 18 | 11:06–11:48 | **The order; DevDay; "super."** (sc 21–22) | amused; then small and at home | **The warm cream and orange of the order on his monitor** (R−B +10.8). DevDay dark. | tension 2 to 3. "which one's real?"; "thrilled is too much." | Held Water Line chords; the verdict; Tasya's Rhodes; the settle never comes. | amused, then wry and intimate | agree | desirable |
| 19 | 11:48–11:58 | **THE CLOCK** (sc 23, act-out 2) | dread | 30 cuts a minute, one step a beat. | tension 6. Friday. | P04: steps building by addition, a dead stop, 2.5 s of black, the crane pre-lap. | dread | agree | desirable |
| 20 | 11:58–12:37 | **Vegas → THE PLAN → JOIN** (sc 24–25) | "suspense, saved for this" | Vegas 23%, a red frame. **THE PLAN is the most saturated (0.80) and bluest (R−B −60) image in the film**, with `HOW TO FIRE A CEO` stamped on the sheet for about 12 s. | tension 6, then 7 to 8. **The viewer is told how he'll be fired before it happens**, so "…probably just the budget." is irony, not suspense. | Vegas at −19.7, quiet; the chip waltz featured (−19.7 music; the mix −16.0, as loud as the talk). Talk 73% (Neleh reads the sheet). | informed and amused | **conflict**: the explainer takes the shock | **mis-toned** for its slot (the showrunner's note). *v3.1 moves it to the board's side.* |
| 21 | 12:37–12:56 | **The call; the silence; "super."** (sc 26) | the blow | Tiles at 11%; the eyes strip; `OK`/`Cancel` with ALYI's pointer; `You've been removed from the meeting.`; the close-up on neon. | tension 9. **No words reach us for 9 s.** | LEVERAGE low (the mix −19). **Centroid 217 Hz, the darkest-sounding scene.** **The drop: 31 dB, into 3.7 s of room tone at −49 LUFS.** The buzz; "super." | puzzled by "Cancel", then stung | the sound's subtraction works; the story was pre-empted; the picture is a metaphor | **conflicting**. *v3.1 fixes the structure: Alyi's sentence reaches us and the dialog is literal.* |
| 22 | 12:56–13:09 | **That night** (sc 26A) | after the silence; hurt kept inside | Dark teal; the carve. **TPOOL is a 3.5 s bright-orange 16-colour flash**, then the Orb's iris and the whip. | tension 6. "i don't keep score." | The felt's re-entry after D6 (−21); the pedal under TPOOL; THE REWIND. | sad, then briefly lost (what's TPOOL?) | the flash is a reference dropped into the hurt | **conflicting** (minor) |
| 23 | 13:09–14:39 | **The board's side, Friday** (sc 27: the call, the post, Rima, the all-hands, Gerg quits) | dry, procedural comedy | Dim navy screens (14–22%). The blog in cream (15 s). **A 19 s static grid** for Rima's appointment. The all-hands crowd. | tension 6 to 5. No V.O., by design. "Is this a coup?" plays sincere. | PROCEDURE, lighter (−19.5, then −23.5 and −22.9 under Rima and the all-hands). Talk 72–84%. | dry and curious, then a little distant | agree | desirable, sagging in the middle |
| 24 | 14:39–16:33 | **The board's side, Saturday and Sunday** (the hearts, the phones, Mario, Ttemme, Tasya's door, "Step four?") | dry comedy with sincere beats | The hearts' red flood; the boardroom (7.5%); **Neleh's real face at 4.8%**; the lighthouse's warm brick; grey CCTV; the slate door. | tension 5 to 7. "Then we'll write step four ourselves." | The Door and the choir; the sincere viola; the Lighthouse; the hourglass; Tasya's floor; the hang on "Step four?". | amused, sympathetic, then turned | agree | desirable. **3:24 in all away from him** (§3.3). |
| 25 | 16:33–18:12 | **2 AM** (sc 29) | warm, loyal, funny | 5.8–10.6%, teal; **the key faces at 4.3–4.9%** ("alyi voted.", Gerg's look up); the letter is 23 s of dark text. | tension 5, with a hurt dip at 17:27. **Back inside him: 4 V.O. lines**, the first 3:41 after the last. | The Water Line, warm; the Build in A♭ (−18.3); a walking pulse; the rest on ALYI; Tasya's floor. Talk 76–80%. | relief, warmth, hurt, loyalty | the story and the sound agree; the picture dims the faces | desirable (the picture flat on the faces) |
| 26 | 18:12–18:28 | **The tile avalanche** (S6) | the one full band; a release | Busy tiles (motion 0.51, 15 cuts a minute). | tension 7. The label. | P11, the full band (−16.9 up to −14.9 music); **the mix −15.5, level with the talk**; a dead stop on the label, then about 4 s at −33. | exhilarated, laughing | agree | desirable, under-lifted in level |
| 27 | 18:28–19:05 | **Monday** (Alyi's regret; the landlord becomes the room) | bittersweet; then a quiet menace | The day bullpen (21%); the two boxes; the room stepping to slate. | tension 4 to 5. "It has been four days." | STRAIGHT (the violin decays under the hearts); Tasya's floor, a chord on each of below, above and around. | bittersweet, then amused and uneasy | agree | desirable |
| 28 | 19:05–19:58 | **Tuesday: the fires, Terb, the calm-off; the hourglass** | amused tension, then release | Dark (7.7%), small fires, the white freeze card. | tension 6, then release. "of what?" / "Good question." / "good question." | LEVERAGE; **a dead stop on "of what?"** (8 s in the room); the long hold; the Build restarts. | amused tension, then relief | productive contrast: the fires against two still men | desirable |
| 29 | 19:58–20:10 | **The lobby sign; "okay."** | triumph, one size too big | The close-up on warm tungsten; the refused dialog; the glass on the stone. | tension 3. `DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0`. | **VICTORY LAP, the loudest cue section in the episode (−14.3 music)**; the bonk; a rest under "okay." | triumph, and the irony | agree | desirable. *v3.1 must re-rhyme the dialog (§4 #7).* |
| 30 | 20:10–20:42 | **The coda** (sc 31) | quiet unease | The orange vault (warm); the day bullpen; the nameplate; the empty observer chair. | tension 3. | The vault's F at −26.6 (**the quietest long stretch of score**) with the Ache. Mix −18.4. | quiet unease, winding down | agree | **flat**: a second ending before the tag |
| 31 | 20:42–21:16 | **The tag** (sc 32–33) | quiet, wry, then unease | Dark teal; the EMIT cover; **the thud (motion 1.03)**; the Grey Lady in cream. | tension 3 to 4. "close."; "noted." | The Water Line, plain; the verdict; the thud cuts the line; the button with no third. Mix −18.7 and −19.5 (the dialogue guard). | wry, then quiet unease | agree | desirable |
| 32 | 21:16–21:26 | The Orb outro | a coda | 3.4%, the Orb's scan. | — | Its own master. | a quiet close | agree | desirable |

---

## 3. The episode's arc

### 3.1 Tension and release (judged, per scene; the story lane of the chart)

**Where the tension sits:**

| Tension | Share of story time |
|---|---|
| 4 or lower | **56%** |
| 6 or higher | 25% (5:13) |
| 8–9 | the call alone, about 25 s |

**The rhythm, act by act:**
- **Act One** runs small rise-and-release cycles every 30–60 s:
  - the click;
  - the million, and the bill;
  - the collar's pop;
  - the memo shipped as a website;
  - `PLEASE`.
- **Act Two** is comedy with one real rise: the crack at 9:40.
- **Act Three** sits at 2–4 until THE CLOCK.
- **Act Four:**
  - the peak (the call);
  - a 3:24 plateau at 5–7 on the board's side;
  - the hurt at 17:27;
  - the release at the avalanche's label (18:26);
  - the calm-off;
  - the lobby;
  - a 77 s decrescendo: the coda, the tag and the outro.

**The shape's three facts:**
1. **The 5:33 from 6:25 to 11:58 averages tension 3.8**, with one peak. It's pleasant, well varied in texture and low on jeopardy. The cold open's Friday invite is the only clock running under it until THE CLOCK.
2. **The peak, the firing, lands at 12:37, 59% into the film.** That's right for "the Blip" as the act. The problem is what precedes it (§2 #20), not where it sits.
3. **The film ends on two quiet endings in a row:** the coda (32 s, music at −26.6) and the tag (34 s). The thud is the one accent between them.

### 3.2 Variety

**The music is varied (from the cue sheets).** Shares of the 20:44 of story time, first-round score:

| Family | What's in it | Share |
|---|---|---|
| dry | the White House's pomp, the Senate, the board's side (PROCEDURE), THE PLAN | **28.7%** |
| warm | launch night's trio, Gerg's Build, Tasya's floor, 2 AM | 19.8% |
| intimate or curious | the felt, the Water Line, the 1-bit, the tag | 17.6% |
| suspense or dread | the Ache, the pause letter's chill, THREAT, THE CLOCK, LEVERAGE, the vault | 10.8% |
| comic or caper | code red, THE JOB, the duel, the Upsell | 10.4% |
| exhilarating | the odometer, THE RUN, the Upsell's climb, the avalanche, VICTORY LAP | 4.0% |
| no score | designed rests and unscored stretches | 8.7% |

**Suspense is now a colour, not the wallpaper.** The new wallpaper risk is *dry*: 204 s of it in one block (the board's side), before v3.1 adds THE PLAN to that block.

**The picture is dark and cool.**
- The story's median luma is 11%, and 34% of story time is under 8%.
- Only 15% of story time is warm (R−B > 0), and most of it is **other people's rooms**:
  - the White House;
  - the order on his monitor;
  - the lighthouse's brick;
  - Tasya's lobby light;
  - the vault.
- **Mas's own warm scenes are the dark ones:** launch night 8.6%, Gerg's call 6.6%, 2 AM 5.8–10.6%.
- The contrast is good design for the rivals' polish (style-range §6.1a). But it leaves the score to carry every warm feeling of his, and that's where launch night's score over-reaches.

**The sound is levelled to the talk.**
- 34 of 45 story scenes sit within 2.5 LU (−15.5 to −18.0 LUFS).
- The seven quieter ones are designed quiet:
  - the bay −27.0;
  - the silence and "super." −22.2;
  - that night −21.0;
  - Vegas −19.7;
  - the hourglass −19.6;
  - the tag −18.7 and −19.5;
  - the call −19.1.
- **No scene is louder than the talk.** The per-segment −16 LUFS master and the dialogue anchor are correct for dialogue, but they flatten the set-pieces.
- **The brightness of the sound** (spectral centroid) moves mostly with who's talking. Its extremes are story-true: code red, the brightest at 1.09 kHz; the call and the thud, the darkest at 217 and 236 Hz.

### 3.3 Where it's monotonous

- **The intensity lane:** there's no loudness peak above the conversations (§3.2).
- **The feeling:** the likely feeling is *amused, wry or dry* for about 65% of story time.
  - The comedy's textures vary well: the pomp, the procedure, the caper, the procedural board.
  - The emotional register repeats.
  - The variety comes from the non-joke beats (Rima's question, Alyi's count, Mario's cost, Neleh's blank line, Gerg's look, Tasya's door). Several of them are the darkest shots in the film.
- **The distance from Mas.** The longest runs without his inner voice:

  | Stretch | Length | What's in it |
  |---|---|---|
  | 13:00–16:38 | 3:41 | the board's side, silent by design |
  | 17:46–20:51 | 3:05 | the return, silent by design (real acts) |
  | 7:22–10:08 | **2:46** | the Senate (silent by rule), and the bay, the tour, the rooftop and the Orb's arrival, which no rule requires to be silent |

  v3.1 adds THE PLAN to the board's side, which makes it **about 3:49 away from him.**
- **The board's side's middle:** Rima's appointment is a 19 s static grid; the post is 15 s of cream text; the music is at −23.5.

### 3.4 The key beats: where they should land and where they do

| Beat | It should feel | It lands at | How it lands (measured · judged) | Verdict |
|---|---|---|---|---|
| **Launch-night wonder** | warm anticipation, then a lift | the click 2:11, the counter 2:51, the million 3:10 | The click is a held chord and "nothing happens", which is right. The counter's lift is in the score only; the mix stays level (−16.5 against −15.7) and the picture dark and still (9%, motion 0.26). **The wonder is mild**, and the warmth before it reads as lounge. | mis-toned, then flat |
| **The bill's sting** | a laugh with teeth | 3:25 | 12 s: the tear, "it's the bill.", "mostly the bill.", the Ache. The siren arrives 4 s later. | desirable, brief |
| **The White House and Senate comedy** | pomp and procedural comedy | 6:25–9:01 | The warmest picture (R−B +17.6); pomp in B♭; the lens look; the wallet's 11.8 s stop. The comedic high of the episode. | desirable |
| **The dark-room intimacy** | intimate, a little lonely | 9:50–11:58 | Teal, 7–13% luma; one continuous Water Line (125.6 s); 3 V.O. lines. The monitor's items keep it a little busy. | desirable |
| **THE firing shock** | a sudden shock, learned with him | 12:37–12:56 | Pre-empted by THE PLAN at 12:06. No words on his side. A 31 dB drop into 3.7 s of room tone. | **conflicting**; v3.1 covers the structure |
| **The 2 AM warmth and loyalty** | warm, loyal, funny, with the hurt | 16:33–18:12 | 4 V.O. lines (we're back in him); the Build; a 4.2 s hold on "alyi voted."; the faces at 4–5% luma. | desirable, apart from the faces |
| **The return's irony** | triumph, one size too big | 19:58–20:10 | VICTORY LAP at −14.3 (the loudest cue); the refused old dialog; "okay." on warm tungsten. | desirable; v3.1 must re-rhyme the dialog |
| **The tag's quiet unease** | quiet, wry, uneasy | 20:42–21:16 | Dark teal; the thud; "noted."; the no-third button. Preceded by a 32 s coda at −26.6. | desirable; the coda before it is flat |

---

## 4. Specific fixes, ranked

**How each fix is tagged:**
- **the channel:** picture, story or sound;
- **v3.1 status:** *covered* (the v3.1 plan already does it), *fits* (it slots into v3.1's work), or *v3.1 risk* (v3.1 could break something here, and this is the guard).

### 1. The Act Four shock: do v3.1's opening, and add three things (story · picture · sound) · *covered, with three additions*

[PLAN §5's design](PLAN.md#5-v31-the-finalizing-round-from-2026-09-27-1600) is the fix: his side first, Alyi's sentence heard, a literal removal dialog, THE PLAN moved to the board's side. Three additions:

- **(a) Picture: make the dialog the jolt.**
  - Hard-cut to it full frame, bright, in the 1993 dialog's cream. That look measured 56% luma in the cold open, against the call's 11%.
  - Hold it at least 1.5 s so `Remove MAS MANALT from the meeting?` is read.
  - Put ALYI's click on a downbeat, straight into the silence.
  - A brightness spike on a hard cut, then darkness and silence, is the shock.
- **(b) Sound: let Alyi's sentence be the loudest thing in the call.**
  - Round 1's LEVERAGE drops to its eighths under his silent mouth. Now there's a voice, so thin it to the pedal under the line and bring it back for the dialog.
  - Keep the D6 drop exactly as it measures: 31 dB, 3.7 s, −49 LUFS room.
- **(c) Story and picture: keep a floor.**
  - With THE PLAN gone, JOIN comes about 14 s into the act (Vegas 8.2 s plus the JOIN insert 5.9 s).
  - Keep 10–15 s of the suite (the crane, the glasses, his still glass) so the calm has somewhere to fall from.

### 2. Launch night's opening score (sound) · *fits (Composer X's round)*

- **The change, for the first 68 s** (1:03–2:11):
  - take out the rhythm section (the brushes, the walking upright, the Rhodes comping);
  - let **Gerg's Build on the chip** and **Mas's felt** carry it. Those are the show's identity colours (OST-BIBLE §0 rule 3). The Build is already written into the gaps and under Gerg's lines.
- **Where the trio comes in:** its warmth arrives when the chat flatters him (2:29, A3), as a payoff, and hands on to the swing on the counter. Anticipation, then release, and the giddiness is earned.
- **Keep as they are:**
  - A2 (the felt and the Door under Alyi);
  - every stop and hit.
- **The pause letter** (6:02–6:16): play it straight. A cold pedal and Nole's stack, with nothing walking. That's THE JOB colour's third use in 5 minutes, and a straight line sharpens act-out 1's chill.
- **Don't use round 2's "soft synth pad".** It is the "generic" failure the showrunner named.

### 3. Let the two story set-pieces rise (sound, the mix) · *fits (the mix already reads `duck_db` and gain rows)*

- **Where:** +2–3 LU short-term on the odometer (2:51–3:10) and the avalanche (18:12–18:26), measured against the talk scenes. They sit at −16.5 and −15.5 now, level with conversations at −15.7 and −16.2.
- **Leave VICTORY LAP as it is:**
  - it's already the loudest cue section (−14.3);
  - its irony depends on being one size too big, not two.
- **Why this doesn't make it goofier:** this is intensity, not genre, which is the showrunner's own axis.

### 4. A face light on the non-joke close-ups (picture) · *fits (the shot passes)*

- **The shots** (mean luma as measured):

  | Shot | What | Luma |
  |---|---|---|
  | S5.07b | "alyi voted." | 4.3% |
  | S5.05 | "mostly." | 4.4% |
  | 5.05 and v3-5.06b | Alyi in the glass | 4.4–4.6% |
  | 18.05 | the toast | 4.6% |
  | S4.07 | Neleh's real face | 4.8% |
  | S5.09b | Gerg's look up | 4.9% |
  | S4.15 | Mada | 4.9% |
  | S7.08 | "good question." | 5.0% |

- **The change:** a key or rim one or two ramp steps up, **on the face only**, so each expression reads at a glance on a TV or a phone. The night palette and the room stay as they are.
- **Why:** these are the beats the showrunner asked to be *felt*, and at present they're the murkiest shots in the film.

### 5. Keep Mas close through the middle, and make the restored beats his (story) · *fits*

- **One V.O. line at the bay** (14.01: he watches the altered clip).
  - It anchors the sequence that reads as "out of nowhere" (near-black, −27 LUFS, 9% talk).
  - It breaks the 2:46 gap.
  - [mas-inner-voice §5](../../../../bible/mas-inner-voice.md) allows it: the clip and its anchor are invented, and it's not a proceeding.
  - The kind the guide likes: a specific, present-tense read of the fake, never a wink at the real news. The script pass writes it.
- **The restored beats** (PLAN §5 item 2) all land in the stretches that already read as vignettes. Each needs to be Mas's problem:
  - **The hands runner:** one held room frame (draft 5's staging), inside the Water Line, and its one V.O. line is his read or his stake, not a framing caption.
  - **Rezeile's op-ed:** give it to **Alyi's reflection** in the pause-letter scene (what Alyi reads while Mas writes `PLEASE`). That gives act-out 1 the stake it lacks (§2 #11), Alyi's dread from launch night, and it needs no new music.
  - **Sydney and the Atem crate:** ride the running cues (lobby2, the duel's pre-beat) with no new colours. Sydney's timer ticking the duel in, as in v2, keeps the match cut's momentum. Each gets Mas's reaction or a V.O. line.
  - Act One is already the talkiest act (launch night 87%).

### 6. The rewind into the board's side: a door, not whiplash (picture · sound) · *v3.1 risk*

- **The risk:** in v3.1 the Orb's rewind lands on THE PLAN, and the jump is the largest tonal one in the film:
  - out of: the night (−21 LUFS, 11% luma, teal, "i don't keep score.");
  - into: the bluest, most saturated image in the film with a featured waltz (−16).
- **The fix:**
  - land on Neleh's office first: its room, its clock ticking, 11:5x;
  - make the blueprint her document on the desk;
  - let the waltz come in under her pointer at underscore (−20) and build.
- **The result:** the dry comedy arrives as her side, not as a joke at his expense.

### 7. Re-rhyme the lobby's old dialog (story · picture) · *v3.1 risk*

- **The problem:** S8.03's return gag (`OK · Cancel`, Cancel greying out, the empty-tag pointer's click refused, *bonk*) calls back the call's `Cancel`. v3.1 retires that.
- **The fix:** use the new dialog: `Remove MAS MANALT from the meeting?` with `[Remove]` greyed out, the empty-tag pointer, the refused click and the bonk. Otherwise the return's irony points at a dialog the viewer never saw.

### 8. Keep the board's side from growing (story) · *v3.1 risk*

- **The problem:** it's 3:24 with no V.O., and THE PLAN adds about 25 s, making about 3:49 away from him.
- **Trim about 20 s inside it:**
  - S3.00a's 11:59 wait: 20 s → about 10 s, since the blueprint now sets it up;
  - S3.04's static appointment grid: 19 s → about 14 s;
  - the lobby camera: 15 s → about 10 s.
- **Keep:** the sincere beats (Alyi's answer, Neleh's blank line) and the told-twice line.

### 9. Act breaks: lead with the room (sound) · *covered (PLAN §5 item 7, "the act-break level jumps")*

- **The steps measured:** +20.3 dB (THREAT's black into pomp on frame 1) and +21.1 dB (the bell's black into the felt's bloom).
- **The mood point:** lead each new act with its room for 1–2 s under the black (the mantel clock, the rack's fans). Bring the score in on the first cut or line.
- **What it buys:** `PLEASE`'s chill and the crack's unease each keep their breath before the next mood.

### 10. Warm launch night's picture a step (picture) · *fits (the Act One shot pass)*

- **The change:** bring the hallway's tungsten into the room, with a lamp and the laptop glows, one ramp step, so the picture carries some of the warmth.
- **Measured now:** R−B −17.8 at 8.6% luma. The White House gets +17.6.
- **Why it pairs with #2:** with the picture warmer, the score doesn't have to be literal.

### 11. TPOOL in 26A (story) · *fits*

- **The problem:** the 3.5 s flash is the only bright-orange frame in Act Four's first minutes, and it's a reference inside the hurt.
- **The fix:** keep it only if the newcomer read can place it. The two old marks already carry "this has happened before".

### 12. The coda (story · sound) · *fits*

- **The problem:** it's 32 s of the episode's quietest long stretch of score (−26.6), just before the tag's own quiet.
- **The fix:** trim 6–8 s (S8.09b's shut door, or the memo's drift) so the film ends once, not twice.

### 13. The bill (story) · *fits*

- **The fix:** hold the steam 1 s longer before the siren's J-cut (7.02). The sting gets 5 s, not 4.

**Not a fix: keep round 1's restraint where it is.**
- Round 2's "restrained" Act Three and Four would flatten peaks that already don't stand out:
  - the avalanche as an orchestral pulse;
  - no VICTORY LAP;
  - a sparse 2 AM;
  - the F-minor Act Three.
- The measurements favour round 1 everywhere except launch night's opening (#2) and the pause letter's walk.

---

## 5. v3.1: what it covers and what it might break

**Covered already:**
- **The firing's structure** (§4 #1): THE PLAN after the blow, Alyi's line heard twice, the literal dialog.
- **The cold open's exit:** the double 1993 measured here (the dialog at 56% luma, then the intro's dark room, then 1993 again) is gone.
- **The act-break jumps** (polish): §4 #9.
- **Restoring the first-round score:** it keeps the measured variety (§3.2).

**Might break, with the guard:**
- **The lobby's dialog callback:** §4 #7.
- **The rewind into THE PLAN:** §4 #6.
- **The board's side's length:** §4 #8.
- **The restored beats cluttering Act One and Act Three:** §4 #5.
- **Any of round 2's restraint surviving into Acts Three and Four:** §4, the last note.

---

## 6. For a person (what the measurements can't settle)

1. **Launch night's first minute:** does the trio read as a lounge, and does the Build-and-felt version read as curious rather than thin? The numbers show only the colour and that it sits under 87% talk.
2. **The dark faces:** do the 4–5% close-ups read on a TV and on a phone?
3. **The levelled mix:** does it feel flat or just well mixed? Is +2–3 LU on the odometer and the avalanche felt as a lift, or as loud?
4. **The one silence:** does 3.7 s of room at −49 LUFS read as the room holding its breath?
5. **After v3.1:** does THE PLAN's waltz after the rewind read as her side, or as a joke on him?

**This runs again on the final v3.1 film**, with the newcomer read (PLAN §5).

---

## 7. How it was made, and how to re-run it

The tools are in this pass's scratch folder, `/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/v31-mood/`. They weren't added to the repo, per the brief. The lead can copy them beside the assembly tools for the final check.

| File | What |
|---|---|
| `vis.py` | Picture, per frame. Needs `-c:v rawvideo -f image2pipe`, since this ffmpeg has no `rawvideo` muxer. |
| `aud.py` | Sound, per second. The K-weighting and the windows are computed in Python. |
| `musclass.py` | The mood family of each cue section. |
| `scenes.py` | The judged story and feeling values, per scene. |
| `chart.py` | The chart. |

```bash
R=/home/jgon/project/art/mrmas; M=<that scratch folder>; PY=$R/audio/.venv-theme/bin/python
cd $R
bash ops/heavy.sh $PY $M/vis.py out/ep01/full-v3/ep01-v3.mp4 $M/vis $M/sel.txt $M/frames   # ~2 min once it has a slot
bash ops/heavy.sh $PY $M/aud.py out/ep01/full-v3/ep01-v3.mp4 $M/aud                        # ~1 min
cd $M && $PY chart.py $R/out/ep01/full-v3/mood-curve.png                                   # light; reads the files above
```

**For a new film:**
- set the scene boundaries in `scenes.py` from the new lock (the shot starts come from `show/reel/ep01-v3/*.json`);
- re-judge its story and feeling columns;
- re-read the cue sheets into `music_rows.json`.

The 651 sampled frames were deleted afterwards (the disk is tight). The ten contact sheets cut from them (a few MB) are kept in the scratch folder's `sheets/`.
