# Ep2 v1: delivery note (read before watching)

> **Episode 2, `ep1.1_her.wav`, is finished and has not been published.** Everything below was measured from the files or checked by AI on stills. **No human has watched it in motion or heard it.** The watch-through is the first time anyone will.

## What is delivered

- **The film:** `out/ep02/v1/ep02-v1.mp4` (git-ignored), **23:31.00** (33,864 frames at 24 fps; the story 22:44.00). 1080p24 H.264, AAC 256 kb/s. 136,523,617 bytes, md5 `2a6affb88c14f25ff3735935639bc15a`. Assembled at commit **0136292**, with the record in [assembly.md](assembly.md).
- **Nine chapters:** Cold open 00:00 · Intro 00:55 · `ep1.1_her.wav` 01:25 · Act One · the séance 01:27 · Act Two · stage right 07:31 · Act Three · leave them up 12:10 · Act Four · as a guest 17:30 · Tag · august 22:39 · Outro · credits 23:16.
- **The release copy** (title, description with chapters, thumbnail choice, open choices): [show/episodes/ep02/release.md](../../release.md).
- **Five thumbnails:** `out/ep02/v1/thumbnails/` (1280 × 720; `thumb-5-orb.png` is the primary).
- **To read along:** the transcript on the film's clock, [assembly/transcript-film.txt](assembly/transcript-film.txt) (175 lines and 215 on-screen texts), and the contact sheet `out/ep02/v1/ep02-v1-sheet.png` (one frame every 10 s).

## Measured

| Check | Result |
|---|---|
| Loudness | **−15.81 LUFS** integrated (target −16 ± 0.5; a second meter agrees) |
| True peak, on the encoded film | **−1.11 dBTP** (Act Three). All 142 ten-second windows are at or under −1.11; none is over −1.0 |
| Flash | at most **1** flash in any second (the limit is 3); **0** red flashes |
| Decode | **0** errors over all 33,864 frames |
| A/V lag | **0** samples in all nine chapters; the codec added **0** bursts against the mixes |
| Seams (200 ms RMS step) | cold open → intro −11.6 dB (Ep1's size) · intro → card +0.6 · card → Act One +0.8 · One → Two +12.7 (the act-in hit) · Two → Three −3.0 · Three → Four −3.2 · Four → tag +0.2 (a 0.0110 sample step, measured as continuous signal, not a click) · tag → outro +0.1. Each matches the mix's own QA to 0.1 dB |
| Transcript | `transcript-film.txt` agrees with the lock's `transcript-v1.txt` row for row (394 rows) |
| Stills | 82 frames from the film at 1080p, at least one per scene and every changed shot: no blocker |
| Ep1 untouched | `sha1sum -c ops/reorg/ep01-final.sha1`: **31 OK** (re-run 2026-10-11 for this note) |

## Human gates replaced by measurement

| A person would normally… | What was done instead | What that shows | What it doesn't show |
|---|---|---|---|
| **Watch it in motion** | AI eyes on stills: 82 from the film, plus each pass's own frames. `scenecheck` compares rendered frames against the renderer. The flash check is streamed over every frame | Every sampled frame is drawn as intended, nothing is broken or black, and the picture is photosensitivity-safe | Pacing, whether a gag lands, whether text reads in its time, acting at speed, hands and faces in motion |
| **Listen** | Loudness and true-peak meters, the sound audit (each sound and line's level against everything else, in bands), seam steps and sample jumps, and a speech recogniser on every take (verbatim checks) | Levels are in spec, nothing is masked by the numeric test, and every line says its words | Whether the voices sound natural or in character, whether the mix is pleasant, whether the synthesized crowds read as people, whether a join clicks to an ear |
| **The newcomer read** ("why did Alyi leave?") | Two AI newcomer reads of the transcript and pictures (fixes-v1.md, Act Two and Act Three) | The film's text and pictures never state or chain a reason | Whether a human newcomer infers one, follows the ten new names, or gets the story at all |
| **Fact-check** | The pull pass (W26): every on-screen quote opened at its primary (the posts' own data, archived pages, the transcripts and their audio through a recogniser, the docket, the papers); four texts were corrected | Every quote on screen is verbatim against a source | Three primaries were unreachable (the Aug 21 broadcast, the Jun 12 state-court docket, Bloomberg's two reports): they rest on two press outlets each. No legal review |
| **Guardrails** | AI reviewers on the script, the picture and the film, with the FIRM rules as checks (`lock_report.py`'s marks) | Each checked item passes as written and drawn | A human's read of tone, especially X4 in the tag and the departure's neighbourhood in Act Two |

## For an ear and an eye (at the final film's timecodes, MM:SS:FF)

Every human check from fixes-v1.md and assembly.md §7, deduplicated and in film order. **E** = for an eye, **A** = for an ear.

- **The whole film, once, at speed** (E, A): no measurement covers whether it plays as a story.
- 00:23:18–00:47:10: the cold open's THUDs. Gerg answers one ("That's not the mammoth." 00:33:13): is it heard as what the line says? (A)
- 00:55:00: the smash into the intro, now −11.6 dB (Ep1's size): still a cut, not a fade? (A)
- 00:55:23–00:59:09: the pointer hidden while he types; it shows as his hand takes the mouse (00:59:10) and rests on Post in the bookend (01:24:09–01:24:22). Does it read at speed? (E)
- 01:04:16–01:05:13: is the ESC keycap legible? (E)
- 01:07:15–01:09:03: Alyi's card `EFFIGIES: 1`: a joke, with no hint about his leaving? (E)
- 01:27:00–07:31:00: Act One sits at −15.0 LUFS (1 LU over the others, for its lines). Does the séance's score sit right at that level? (A)
- 01:44:12–01:49:01: 4.04's `RE: NOLE · 2016`: is the rising ghost Nole's at a glance? GHOST-NOLE's voice chain (01:47:21, 02:55:22): a ghost, and still Nole? (E, A)
- 02:35:18–02:40:07: 4.12's three hands rest 2.4 s on the planchette. Does the lift still land? The cow's moo after it (4.13): low and ghostly, not a cartoon? (E, A)
- 03:22:22–03:39:12: the knob wall warms with people's games, then turns cyan with its own. Does it read without the dialogue? (E)
- 04:01:13–04:10:10 (and 14:30:12, 14:59:01): Alyi at room scale has open eyes, never glasses? (E)
- 05:13:00–05:21:23: 4B.01's V.O. in three rows in the wood margin: his thought, not a caption? (E)
- 05:22:00–06:43:00: XEL's studio room is 2 dB up and mostly mono. Is the padded near-silence still the joke, not a hiss? (A)
- 06:49:06–07:20:07: the Humanist's whole hands (7.04) and Tasya's clasped hands and ring hand (7.03–7.06) at speed: warm, not prayerful? (E)
- 07:31:00: Act One → Two, +12.7 dB on the Water Line's hit (already softened 7 dB). (A)
- 07:43:00–07:50:11: 8.03's shoulder rim fading toward the frame's foot: invisible, or a visible step? (E)
- 07:55:02–08:08:11: the cyan Monday MCU, the phone ECU, then the warmer call MCU, a change of key across two cuts (E). V.O. 5 (07:55:15) runs at 172 wpm, quick for his inner voice: still his thought? (A)
- 08:30:20: the engineer's laugh under Gerg's "Careful. The new one can hear you laugh." (A)
- 08:46:14–08:51:22: 9.04b, a 2.2 s look, then "everyone gets it free." (08:48:18), re-recorded and shortened. A decision already made, not a slogan, with no dead air around it? (E, A)
- 09:55:00–11:30:00 (and 14:11:08–14:16:14, 19:06:00–21:08:23): the synthesized crowds: the demo house's laughs, the party chant (Alyi's lead 14:11:08, the room 14:13:00), and the lobby's cheer and the stream's roar. Do they read as people? The demo's PA on every line against the off-mic pair at 11.15: does Rima's "and that's the demo." (10:58:15) sit close enough? (A)
- 10:11:15–10:24:21: 11.04's three framings. Does "Thanks." (10:21:04, over CHATGTP's ducked tail) land as the cut-off, and is the one-second single long enough to register his face? (E, A)
- 11:39:06–11:42:15: 12.03's memory. Are Alyi's open eyes warm, and is the out-of-focus banner read as a party banner, not as censorship? Do two seconds and the `SEP 2023` rail read as Mas remembering? Does anything in sc 12 still offer a reason he left (W8)? (E)
- 11:43:16–11:56:05: 12.05's `NOPEAI · TRENDING` read beside the bigger `OMNI` in its 4 s; 12.06's thumb rising with the post as it scrolls. (E)
- 11:56:06–12:10:00: the departure in silence: his post held 10.5 s, his face 2.8 s, then the stop. Midpoint weight, or a gap? At 11:58–11:59 the thumb covers the middle of his typed post as he taps Post (it reads whole from about 12:00). (E, A)
- 12:10:00: Act Two → Three, −3.0 dB: the midpoint's stop, then THE CLOCK. (A)
- 12:22:21–12:33:19: 13.03's stopped hand on the upside-down flyer: a choice? "Did his post say why?" / "No." (12:30:20): plain, low, heard? (E, A)
- 12:33:19–12:38:04: 13.04's push in on the lobby TV, the staffers' heads under it. Do the presser's plate and lower third read on the glass? (E)
- 12:45:00–13:39:00: sc 14. Does `> lunch?` (greyed, his face silent in the fins, 12:52:19–13:03:01) carry the beat without naming it, and is the screen's dim visible? The thumb, DOT's working loop, and the domino at his shoe straight into Pivot door (13:34:09): does Ekiel's exit land before the door turns? THE CLOCK's two ticks over the Ache into the creak's stop (13:28:09–13:39:00). (E, A)
- 13:45:09–13:55:13: Alyi's far "Six years and eleven months… to that click." (13:45:21, down a corridor at −19.5 LUFS: understood?), then V.O. 7, "eight years and five months." (13:52:09; 134 wpm; 0.5 dB under the whole-line floor). One count carried on, never a correction? A newcomer has no anchor for the first count, and next to "almost a decade" the three can sound like counts that disagree. (A, E)
- 14:09:13–14:43:17: F2.2. The party bed is 6 dB down and the score 4–5 dB down under the chant lead and the exchange: does the party still read, and is "You're not chanting." (14:17:15) heard whole? Alyi's smiling eyes without rims (warm, not sleepy?); Ekiel's open eyes at the screen (14:34:00). (A, E)
- 14:59:01–15:03:15: 15.15, the catch's MCU on Alyi in the doorway. (E)
- 15:23:00–17:25:10: the bridge. Does the synthesized traffic read as traffic? Phone taps as a phone, horns as horns, the thunder? The driver's arm (15:52:10, 16:52:02). The Forecaster's rust hoodie at dusk (from 15:35:00), and the plum extra in the lobby (21:43:00): does either read as anyone else? (A, E)
- 16:21:16–16:38:05: "the post. the post." (16:22:13, brisk at 175 wpm), the forecast, then 3.6 s of a held thumb with no voice. Does it read as "not yet", and not as a reply? (E, A)
- 17:14:14–17:20:00: 17.19's press push (`re: VOICE 5`, 1.7 s): read before it slides away? Does the pause now read as caused? (E)
- 17:30:00: Act Three → Four, −3.2 dB. (A)
- 17:37:16–17:49:10: 18.03's push onto the TV and the guest line. Neleh as a person on a podcast before she speaks? "…on Rett—TWIT." (end of her first line, caption 17:46:21): the name, not "Reddit" and not a stumble? (E, A)
- 17:59:13–18:03:07: 18.06. The TV goes off on the cut, his still face (the standard head), then "First item." (18:01:22): procedure, not a reply? (E)
- 18:19:07–19:02:16: 18.09–18.14. His eyes drop to the card and blink twice: waiting, not reacting to Mario? `MARIO · EX-NOPEAI` (18:33:23–18:42:07, 2.4 s): read, and with the `SAFETY` lamp, enough to place the lighthouse? (E)
- 19:45:09: the Jun 10 post's lowercase `elppa` / `chatgtp`: still read as the companies at a glance? (E)
- 19:59:01–20:20:17: the crosscut call. One arm each, rising from below the frame? Does it read as a phone call? The cheer comes down 9 dB under Gerg's two lines and 6 under the rest: focus, or a pumping bed? Is "You ever miss being up there?" (20:14:20) heard? (E, A)
- 20:22:18–20:32:10: F2.1's rails, 2006 and 2008, 4.7 s apart: dates for a memory, or a calendar again? 19.13's high toss and push onto the collars in 5 s; the match on the pin. (E)
- 20:39:07–20:42:20: 19.15's phone held from behind, at speed. (E)
- 20:42:21–21:05:17: the garden, 10 s shorter. Listen across the cut at 20:52:21 (GUEST walking in → Mas outside the hedge; the quartet loses exactly 4 bars). Does "as a guest." (20:58:09) land without the flower beds? Arrival, turn and aftermath, not a detour? 19.19's garden side (21:01:13). (E, A)
- 21:09:00–21:29:22: 20.01–20.02's padlock at its real size, a padlock now? 20.04's caged phone. (E)
- 21:35:22–21:40:18: 20.07. His shoe stops Haras's tape and he writes `SEP` (21:39:10, 1.4 s): one plan made an action, not a gag? Does the rhyme with 17.11's shoe land? (E)
- 21:47:00–21:55:14: 20.10–20.11. The ISS card cropped to its plate; Jun 19 reads as "a week later" from the face-down phone and the post's own date (21:49:14)? (E)
- 22:01:00–22:34:04: the re-toned ISS plate: in the 3D, or pasted? 22.07's arm on the plate (story note 6). (E)
- 22:15:00–22:19:00: 22.03's band, a single dim flick: enough to answer sc 14's verbs, not a wink? (E)
- 22:23:14–22:27:05: 22.05 at speed. The bowed head (13 px) reads as a man absorbed in his page, never as a look toward the slot or the flyer? (E, FIRM-adjacent)
- 22:27:05–22:28:10: 22.06's designed stop: the flap's spring in the lot's wind only, then the felt's return. (A)
- 22:39:00: **Act Four → tag**, +0.2 dB, the 0.0110 step measured continuous, no de-click laid. Is it clean? (A)
- 22:39:04: does August read as weeks after June at the tag's head (the `AUG 5` rail and the suit landing)? (E)
- 23:01:21–23:07:11: the tag's lower third read in its 4.15 s. Does "perfectly on AI" make the danger the fakes? (E)
- 23:07:12–23:14:00: **X4, watched cold.** From "dangerous out there" through the hook, does anything read as rally violence? The hands low at his own podium (the speaker's-eye framing), the green pump as a party pump (never a syringe), 23.07's quicker pumping clear, and the balloon lifting its string as the hook. (E, FIRM-adjacent)
- 23:16:00: tag → outro, a cut on the downbeat with no hold. If it wants air, the fix is the lock's (a beat of black at the tag's end), not a held frame. (A)
- 23:18:12–23:19:18: the outro's vocal pad going flat before the leap: does it read as the paused voice? The celesta's flat line under the still page: a memory, or does the page want a small event? (A)
- 23:23:18–23:30:09: the cast page's 5.5 s: enough to pause on? (E)
- **Across the film** (A): the biggest SFX rides and the marginal sounds (each one number in `audio/reel/ep02-v1/sfx-rides.json`): too present, or still lost? The beds' realism at their levels: the séance's candles, the studio, the bridge, the garden.
- **The true peak** is −1.11 dBTP, inside −1.0 with 0.11 dB to spare (Ep1 aired −1.29). A platform's re-encode can add a little. If you want more headroom, it comes from Act Three's limiter, not the assembly.

## Story notes left for the showrunner

Each was weighed and left as it is. Costs are in the terms of the next section.
1. **The name load:** about ten new people get plates or cards (Selbeep, Xel, the Humanist, Remuhcs, Bukaj, Ekiel, the Forecaster, Haras, Sirrah, and Neleh's guest line). *Fix:* keep the role and drop the name on the ones Mas never deals with again (for example `NEW CHIEF SCIENTIST.` alone). *Cost:* a lock-text change, i.e. a text-only relock and one scene per plate; no timing, score or mix change.
2. **Act Two's second technical explainer:** THE PLAN is about 48 s of Rima's V.O. (09:09–09:57), in the episode that already explains "learned, not programmed" at the knob wall. *Fix:* keep BEFORE/NOW (one model, nothing falls out) and let the numbered steps ride as a quick montage. *Cost:* a timing change in Act Two: re-lock Act Two (later chapters move unless the seconds go back into the act's air).
3. **Three small winks stacked:** the coupon on the exit papers (`SAVE 0% ON YOUR NEXT EXIT`, 15:32:07), the Humanist moving in downstairs (06:49–07:24) and Gerg's call (19:59–20:20). *Fix:* if one goes, the coupon is the cheapest (one on-screen text: a text relock and one scene). The Humanist's scene or the call are timing changes.
4. **The political-balance pair's weights:** RUMPT gets the tag's hook and three beats before it: his Aug 11 "A.I.'d" post (22:49:12), the Orb's scan that answers it (22:53–22:58) and his own words on the lower third (23:03:06). The other side is REMUHCS's `BIPARTISAN SENATE AI ROADMAP` lectern on the lobby TV (12:33:19–12:42:04) and its callback with `0 BILLS` (19:10:16). The guardrails matrix's pair was kept as agreed. *Fix,* if you want them evener: trim one RUMPT beat. *Cost:* the tag's timing, which must hold 888 f (its score's last bar line; a 38 s tag failed the score check).
5. **Alyi's empty reserved seat after the demo** (12.02, 11:36:02). One reviewer wanted it before the demo, as the house fills. It was kept after, so "her" and the departure never share a frame (FC-2, D-63). *Fix:* move it into 11.01's arrival. *Cost:* re-lock Act Two.
6. **22.07's ISS plate** (22:28:10–22:31:00) is re-toned in 2D but still sits in the wall's steep perspective, narrow. *Fix:* a Blender pass (a bigger plate, squared to the door): the art's seven plates and the act's 37 (`iss22.py`), then sc 22. *Cost:* Blender CPU time, one scene and the film.
7. **About 60 lines under the +6 dB whole-line audibility floor** (`sound_audit.py` WHOLE, `line_whole`), and V.O. 7 0.5 dB under. These are measurements, not hearings. *Fix:* the per-line room dip and score ride already used on F2.2 and the call (`ROOM_LINE_DIP`, `SCORE_RIDE`), only where an ear finds a line lost. *Cost:* a mix re-run and the film; no picture.
8. **The ten-second garden cut and V.O. 6 shortened** (the lock owner's last fixes). Listen at 20:52:21: the quartet loses exactly 4 bars there; does the music join, and does "as a guest." land? Listen at 08:48:18: V.O. 6 is now only "everyone gets it free.", re-recorded, with 2.2 s of look before it and 1.4 s after. *Cost to undo either:* re-lock the act.
9. **12.05's news list next to the departure (a judgement call the orchestrator kept),** at 11:43:16–11:48:11. The monitor's `TOP STORIES` (1 `OMNI · NOPEAI · TRENDING`, 2 `ELGOOG'S KEYNOTE`) is minimised about 1.2 s before Alyi's post lights his phone (11:50:01), and about 10 s after the empty seat. It never shares a frame with the post and says nothing about Alyi; it is the real news of that day. But it sits near the shape the FIRM rule guards against (a product beside his departure). *Smallest fix:* drop the word `OMNI` and keep the ring mark and `NOPEAI · TRENDING` (one scene, picture only). Or hold 12.05 on his work 2–3 s longer after the minimise (a timing change).

**Other open items** (still open after the final commits; none blocks the release):
- **The outro's voice-cast page** (keep, or move the cast to the description) and **tools on screen** (cut by D-100, pending OUTRO-PROPOSALS §10's legal question). Both are in release.md's open choices.
- **Three unreachable primaries** (above). A human with access can upgrade them; nothing on screen depends on more than the press they rest on.
- **Records only:** the EL manifest still gives the outro `dur` 10.125 (the film's outro is 15.000 s). sound-v1.md §7's seam table predates the fixes. The untracked render by-products (`out/ep02/v1/picture/*.render.json`, `*.srt`, `out/ep02/v1/scenes/`) want a `.gitignore` decision. The scene caches are unpruned.
- **The sound owner's `REFERRED` list:** sounds a line refers to, such as the cold open's THUD and the game's bonks, beyond the bridge's honks already checked.
- **Resource asks:** human viewers and listeners for the list above; a recorded crowd library, if the synthesized crowds read thin.
- **Ep1's live description** has no Salamander credit, though Ep1's score uses the piano too (its cue sheets list it). Adding the credit line on YouTube changes nothing in the repo or the locked film.

## How to request changes

Per-scene editing exists, so name the shot and the change. For example: "change shot 12.05 so that the list shows the ring mark without the word OMNI", or "in 20.07, hold `SEP` a beat longer". Shot ids and their film times are in the shots docs (`shots-<act>.md`) and the transcript.

- **A picture-only change** (a drawing, a framing, a colour) re-renders one scene: edit its module, then run `ops/rebuild-act.sh --ep 2 <act> --scene <id> --from picture` (the scene plus a review cut with its sound). Then `ops/rebuild-act.sh --ep 2 <act> --only picture` (only the changed scene renders; the act is re-joined losslessly), then the film step, `ops/rebuild-act.sh --ep 2 <act> --only film` (assemble about 7 min, QA about 4). A scene takes 25 s to 5 min to render.
- **An on-screen text the lock carries** (a plate, a card, a post) adds a text-only relock first (`_spec.py` → `_build.py --write` → `--only lock`). Timing, score and mix stay as they are.
- **A line or timing change** re-locks the act: `ops/rebuild-act.sh --ep 2 <act>` runs lock → score → mix → picture → mux → film. New words also need a take through the ElevenLabs route, which costs credits. If the act's length changes, every later chapter moves, and the script re-derives their locks.
- Every heavy step goes through `ops/heavy.sh`, one at a time. The full map is [pipeline.md](pipeline.md) §4 (per-scene editing) and §7.2 (the one-command rebuild).

## Continuity handed to Ep3

- **The podium hook:** [show/episodes/ep03/open-questions.md](../../../ep03/open-questions.md) item 20, "Ep2's hook as built". Ep2's tag ends in a studio. Nobody is behind the podium; the balloon lifts and its string snaps taut, straight up; the balloon carries no `SO SCARY` lettering. Ep3's draft still has a slack string and a gold-cuff hand behind the podium. Reconcile before Ep3's lock, under the narrowed X4.
