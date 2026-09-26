# Ep1 · Act Four · Diagnosis of animatic v3 (THE EDITOR, for v4)

*2026-09-26. Diagnosis only: nothing else was edited. Inputs: [flow-and-continuity](../../../../bible/flow-and-continuity.md) (read in full), the live [SHOWRUNNER-NOTES](../../../../production/SHOWRUNNER-NOTES.md) (no newer note than the brief's), the `## ACT FOUR` section of [script.md](../../script.md) (draft 3.2), [shotlist-v3.md](shotlist-v3.md), [timing-v3.md](timing-v3.md) and [shots-locked-v3.json](shots-locked-v3.json). The act before it was checked for setups: the cold open, the intro roll call and Acts One to Three.*

**Method.** I pulled the first, middle and last frame of all 119 shots of `out/ep01/act4/animatic/act4-animatic-v3.mp4`, cropped them to the picture area and laid them out as strips per chunk. I pulled full-resolution frames where legibility mattered. I measured `act4-mix-v3.wav` in 50 ms windows, re-derived the music EDL from `act4-mix-v3.cues.json` (music segments minus dry windows), and measured the six OST underscore renders the mix cuts from.

**What I could not do.** I can't play the cut in real time or listen to it. Nothing below says a moment "flows", "reads" or "sounds" right or wrong by ear or eye in motion. Where a finding depends on motion or sound, it says what I measured and what a human has to check. The human checks are collected in §5.

**Clock.** Times are on the act clock (`A m:ss.ss`). To get episode timecode, add 12:31:00 (so A 0:47.00 is 13:18:00 on the episode clock).

---

## 0. The short version

v3 isn't one act of 5 to 8 sequences. It plays as **20 mini-sequences in 4:09**, and 9 of them run under 10 s. The picture changes place or register (room, screen UI, blueprint, card, flashback, box) on **58 of 118 cuts**, and it changes register outright on 45 of them.

Four mechanical causes stack on top of each other:

1. **Cutting by rule, not by story.** The v3 lock cut on every change of speaker, never let three shots of one size run in a row, and cut the set-pieces every 2 beats. A single exchange like Rima's gets three setups in two registers in 4.7 s (A 0:55.75–1:00.42).
2. **The music is shredded three times over:**
   - The mix cuts each cue into excerpts taken from different points in the cue, with no fades.
   - 16 dry windows then cut holes in those excerpts. That leaves **39 audible pieces**: 13 under 2.5 s and 5 under 1 s, including a 0.12 s blip at A 1:54.46.
   - **The OST underscore renders have old dry gaps baked into them** (digital zero). Of the 164 s of cue the mix uses, about 24 s is silence already inside the render. For example, `mm11-the-return-underscore.wav` is silent from 6.05 to 24.35 s, and the "Build restarts" excerpt at A 3:32.5 opens on about 2.4 s of silence with a further 4.3 s hole in its middle.
3. **The room tone is too quiet to be a bed.** Under the dry stretches, the mix sits at about −42 to −50 dBFS, roughly 30 dB under the dialogue. So the "bed" plays as silence: 78 holes of 0.3 s or more, 70.5 s in total. Most of the 106 abrupt level jumps are a dry line starting out of one of those holes (the worst are 31.03, 30.03, 27.08, 30.01, 30.21 and 30.23).
4. **The picture doesn't carry the story beats a newcomer needs,** for two reasons. Must-read text sits under its read time: the blueprint's four steps on Neleh's desk are up about 1.1 s at A 0:50.75, so the step-four spine is barely seen. And stand-in art hides the gag or the story point: the upside-down post on the lobby camera, phones that read as teal rectangles, a door with no sign, and a term sheet that doesn't say what the terms are.

**Order of the passes.** The brief describes the act as "HIS SIDE, then THE BOARD'S SIDE". The script (3.2) and v3 actually play three chapters:
1. HIS SIDE: the firing (A 0:00–0:47).
2. THE BOARD'S SIDE: Friday to Sunday, blind (A 0:47–1:57).
3. HIS SIDE: WHAT THEY DIDN'T KNOW, through to the return (A 1:59–4:09).

I recommend keeping that order. The board's pass ending on "Step four?", then the reveal of his leverage, is the act's suspense engine, and telling his whole side first would spoil the return. flow-and-continuity §1 ("HIS SIDE as one stretch, then THE BOARD'S SIDE") holds if the opening firing is read as a prologue. The fix is to make each chapter one legible stretch, not to reorder them.

---

## 1. MUST-UNDERSTAND: what a first-time viewer who knows nothing of the real events must leave with

These are in story order. Each row gives what the audience must know at that point, what v3 leans on outside knowledge (or on unreadable picture) for, and the cheapest in-show carrier. The carriers follow §5a: a prop, a label, a line said in anger, a THE PLAN drawing or a reaction, never a stop-and-explain. The insider layer (TPOOL, real quotes, parody names, eggs) stays, and nothing below needs to be explained to insiders.

| # | v3 at | What the audience must know here | What v3 leans on outside knowledge (or unreadable picture) for | Cheapest in-show carrier |
|---|---|---|---|---|
| 1 | A 0:03.8–0:20.0 (THE PLAN) | **This board can fire the CEO, and four of its members are about to.** Mas and Gerg are the two outside the circle. The big investor has no vote. Mas owns no shares. | Why a board can fire a founder at all is set up, but as four facts in 8 cuts over 16 s. The nameplates are about 7 px, the key ring's label and `VOTES: 0` get 1.25 s, and the title riddle (`WHO OWNS A CEO WHO OWNS NOTHING?`) is up about 1.3 s. Nothing says Gerg is Mas's partner: the intro's "ORG CHART: HIM." dinner is 12 minutes earlier. | Keep THE PLAN's content and **play it as one drawing under one continuous camera move** (§4, S1). Label the two outside the circle `MAS · CEO` and `GERG · CO-FOUNDER` (or `· CHAIR`, if facts prefers), standing together. The four inside take the cold open's invite icons (door, page, spinner, black square), which the script already does in 25.03, so the "four circles" payoff lands. |
| 2 | A 0:21.3–0:30.0 | **This noon call is that vote. Someone clicks Cancel on him, and he's out.** | Nothing outside. The one risk is that the dialog and his tile dropping could read as a dropped call until `+1 FIRING` lands. | `+1 FIRING` already carries it. Keep the CU long enough for the rail (it is: 1.9 s, and the rail persists). Keep the arrow's approach in one POV so "someone else is doing this to him" reads (§3 #5). |
| 3 | A 0:30.0–0:47.0 | **He shows nothing ("super."), but it has happened before, and he counts** (the third mark). | F1.2's `2005–08 · TPOOL · (REPORTED)` means nothing to a newcomer. Worse, the rail stays up over the dark room (26A.01–26A.02), which then reads as 2005–08. | The tally already carries "again": two old marks, `+1 FIRING` and "i don't keep score." Clear the TPOOL rail before the dark room. Tie F1.2 to the marks rather than letting it float between scenes (§4, S2). It stays as the insider layer. |
| 4 | A 0:47.0–1:00.4 | **The board had a three-step plan (call, post, replace) and step four is blank.** Their public reason is that he "wasn't candid". Rima is the stand-in CEO. | The steps (66 characters) are up about 1.1 s at 27.03, so the act's spine (the blank step four) is barely seen. Step 3 is linked to Rima only by an off-picture pencil tick. | Hold the blueprint until the four lines read (3.5 s or more), or let Neleh's pen travel down them. Tick step 3 in the same frame as Rima's plate. The blank step four is the question for the whole board's side, so make it **the** recurring image, not an insert. |
| 5 | A 1:00.4–1:08.6 | **Gerg, his partner, quits over it. The staff smell a coup, and Alyi (one of the four) owns it.** | `"…I quit."` doesn't say why. Who Gerg is to Mas comes from the intro and Act One. Alyi as "one of the four" is carried only by the doorway motif. | If the facts owner confirms the fuller casing (`…based on today's news, i quit.`), use it: it says "because of this" in the record's own words. Bridge into the all-hands through **Alyi's doorway tile → the real doorway** (a match cut), so the man who says "You can call it this way" is visibly the door from the call and from THE PLAN. |
| 6 | A 1:08.6–1:34.8 | **Mas plays the wronged man in public, the public and the staff side with him, and the board is swamped** ("The company is calling us."). | Nothing outside, but the picture under-delivers. The phones (27.15) are four teal rectangles, and the boardroom is established in 0.62 s. The `EQUITY: 0` payoff to his 9:32 "full value of my shares" post is up 1.25 s. | Make the phones read as calls: a ring, a screen, and a caller ID such as `NOPEAI STAFF (212)`. Hold the equity tap in the same overhead as the post, with no cut. |
| 7 | A 1:34.8–1:50.2 | **The board flails for step four.** They offer the company to the rival next door (Mario: no). They swap in a second temp CEO on a 72-hour clock. Mas is back in the building, as a guest. | The Mario offer rides a 57-character `(REPORTED)` rail over a stand-in (the throne on the handset isn't drawn), and Mario was set up in Acts One to Three. On the lobby camera, **his post is drawn upside-down and `GUEST` isn't legible**, so "he's back, negotiating, as a visitor" doesn't land. Rima's disappearance is unexplained (that's acceptable withholding: her post opens pass two). | The throne on the handset *is* the explanation ("they're offering him the throne"), so draw it and shorten the rail. Put the security feed **on the boardroom's own screen** and push in until `GUEST` and his post (the right way up) read. The board watching him walk in is the board's side. |
| 8 | A 1:50.2–1:54.6 | **The landlord (Tasya, the investor) opens a door: a new team for Mas, and for anyone who follows.** | `"a new advanced AI research team"` doesn't say for whom, and v3's art has no sign and no visible key ring. A newcomer can't tell this is the exit that will empty the company. | The script's sign, pointing *out*, needs words on it: `MAS'S NEW TEAM →` or a door plate `MACROSOFT · NEW TEAM · ALL WELCOME`. Or use the fuller record line, if facts clears the trim: `"…will be joining Macrosoft to lead a new advanced AI research team"`, with names swapped silently. Show his key ring and let it jangle: Act One's "THE LANDLORD" card does the rest. |
| 9 | A 1:59.6–2:41.8 | **What the board didn't know was that Mas held every card.** 745 of 770 staff sign a letter saying they can't work for this board. Alyi signs too. The staff's huge payout is void without Mas. Gerg is already rebuilding the company elsewhere. The landlord's door stays open. | "Tender offer" is jargon, and the check's words are about 6–8 px on a two-shot for 3.1 s. The counter's label `THE LETTER` doesn't say *staff*. That the letter is a threat to leave isn't in the excerpt: the door carries it later. `ALYI (REPORTED)` needs the viewer to remember he voted. | Label the counter `STAFF WHO SIGNED`. Make the check's own words do the work: `EVIRHT · BUYS STAFF SHARES · ~$86B`, with `TENDER OFFER` small for insiders and `VOID IF CEO MISSING` stamped. Give it an insert or a push-in, held about 3 s. When the Orb looks from `ALYI` to Alyi's thumbnail, the thumbnail shows his flipped vote icon from the noon call. |
| 10 | A 2:41.8–3:05.9 | **The board falls:** the staff push them off one by one, only Mada is left, and Alyi publicly regrets it. | Nothing outside. The counter at 745 makes the tiles read as the signers. | Keep. It's clear as long as the avalanche plays as one continuous build (§3 #30). |
| 11 | A 3:05.9–3:50.7 | **A fixer (Terb, the new chair) brokers terms: Mas is CEO again and the board is new.** Gerg returns, the temp CEO's clock runs out, and the Cancel button greys out: nobody can fire him now. "okay." | **Nothing on screen says he's CEO again.** The term sheet at 30.15 is unreadable. Terb's role rests on his card. Where Mas is in 30.01 (at his office desk before any deal) is unclear, because the rail still says 2:06 AM. | Put the terms on the term sheet, readable: `TERMS: MAS · CEO / BOARD: NEW (TERB, CHAIR)`. The sign, the missing lanyard and the greyed Cancel then confirm it, which is the show's way. Fix the rail for Monday in the office. |
| 12 | A 3:50.7–4:08.9 (coda) | **The cost, and a tease.** Alyi leaves the board. The landlord gets a (non-voting) seat. And there's a secret breakthrough nobody will explain. | Q* is deliberately withheld, which is fine (a question the show raises and answers later). The nameplate and the observer chair are stand-ins with red labels. | Keep as withholding. Draw the screwdriver and the chair. |

**Carried well already, so don't add anything:** the Orb as the one who notices; "super." as his mask; the hearts as public love; `WHAT THEY DIDN'T KNOW` as the act-out; Mada's `ANSWERS GIVEN: 0`; the lobby sign; the greyed Cancel as the final image. Adding explanation to any of these would drag for insiders.

---

## 2. Sequence map of v3

"Breaks" means the places where v3 jumps register, drops in a stray insert or cross-cuts inside what should be one stretch.

| # | Act clock | Shots | Place · time | Question the audience holds | Breaks |
|---|---|---|---|---|---|
| A | 0:00.0–0:03.8 | 24.01–24.02 (2) | Vegas suite · Nov 17 noon | Why is he alone in Vegas with a laptop? | The act's only establishing wide gets 2.5 s, with the rail typing on over it. The glow-to-blueprint bridge is good. |
| B | 0:03.8–0:20.0 | 25.01–25.04 (7) | THE PLAN (blueprint) | Who holds the power? | **One drawing cut into 7 shots at three scales** (sheet, section, detail) every 1.25–4.4 s. The tear back into the suite is a good bridge. |
| C | 0:20.0–0:35.1 | 25.05–26.09 (11) | His laptop POV and the suite · noon | What will they do to him? → Cancel, "super." | **A run of 6 shots under 1.6 s** (26.02–26.06b), including an eyes strip and a macro at 0.62 s each. The POV and the room alternate. |
| D | 0:35.1–0:38.9 | 26.10 (1) | F1.2 · 2005–08 (EARLY-WEB16) | — | **A stray insert:** a flashback style switch, silent, between "super." and the dark room, labelled with a reference only insiders know. |
| E | 0:38.9–0:47.0 | 26A.01–26A.03 (3) | Dark room · that night | How does he take it? | **The rail still says 2005–08.** The rewind is a good bridge, but the toast, the rail, the side badge and the whip all change in about 1 s. |
| F | 0:47.0–1:02.9 | 27.01–27.06 (8) | The board's call and Neleh's desk · Nov 17 noon onward | They've done it. Can they run it? | **Five registers in 16 s:** call UI, her desk, blueprint overhead, full-screen card, Rima's spotlight void, the call's two-up, the spotlight again, the call grid. |
| G | 1:02.9–1:08.6 | 27.07–27.09 (3) | Bullpen all-hands · Nov 17 | Is this a coup? | **A new place entered cold** from the call grid. A 1.54 s wide sits either side of Alyi. |
| H | 1:08.6–1:19.9 | 27.10–27.12b (4) | Neleh's desk at night → the call grid · Nov 17 night → Nov 18 | Mas fights back in public | Night is marked only by `9:32 PM` in the post, while the rail still says `NOV 17 · EARLIER`. The macro on the blue heart is 0.62 s. |
| I | 1:19.9–1:34.8 | 27.13–27.20 (9) | Boardroom · Nov 18 night | What's step four? | **Establishing shot 0.62 s.** The coverage cycles two-shot, MCU, OTS and overhead every 1.7 s on average. |
| J | 1:34.8–1:41.5 | 27.21–27.23 (4) | Lighthouse · Nov 18–19 | Will Mario take it? | **A cross-cut to a third place,** entered in a run of 3 shots under 1.6 s across the location change. |
| K | 1:41.5–1:45.2 | 27.24 (1) | Lobby security camera · Nov 19 | (He's back?) | **A fourth place for one shot,** and the story point isn't legible. |
| L | 1:45.2–1:57.1 | 27.25–27.31 (7) | Boardroom · Nov 19 → 11:53 PM | Step four? | Three shots for the one hourglass gag. The door beat has no readable sign. The ending gets 2.5 s. |
| — | 1:57.1–1:59.6 | 28.01 | Card | — | Good: this is the chapter door. |
| N | 1:59.6–2:41.8 | 29.01–29.17 (18) | Dark room · Nov 20 ~2 AM | Does he have any cards left? | Monitor → full-screen card → monitor, for one letter. **The Gerg exchange is six shots in 6.75 s,** three of them 0.62 s. |
| O | 2:41.8–3:01.8 | 29.18–29.30 (13) | His monitor (the avalanche) | How does the board fall? | **Jump cuts on the same grid framing** (29.18→29.19, 29.25→29.26), and two runs under 1.6 s. |
| P | 3:01.8–3:16.2 | 30.01–30.06b (4) | Bullpen by day · Nov 20 | Will the staff walk? | **The rail says ~2:06 AM over daylight.** Mas is at his office desk before any deal, so where is he? The floor POV is 1 s of flat blue. |
| Q | 3:16.2–3:32.5 | 30.07–30.15 (10) | Boardroom · Nov 21 ~10 PM | On whose terms? | Every line gets its own shot. A run of 3 under 1.6 s. **Plays dry for 16 s** (the script wants only the 2-beat calm-off in silence). |
| R | 3:32.5–3:41.3 | 30.16–30.18 (3) | His phone → the boardroom → the table overhead | Who comes back? | Phone stand-in, a 0.62 s reaction, and the overhead reads as a dark surface with a small hourglass. |
| S | 3:41.3–3:50.7 | 30.19–30.23 (5) | Lobby · night | Is he safe now? | Clean. It's the act's most coherent run. |
| T | 3:50.7–4:08.9 | 31.01–31.05 (5) | Bullpen back wall and boardroom · Nov 22 → Nov 29 | What did it cost? | Two dates in 18 s. Stand-in labels in the picture. |

**Screen direction and eyelines.** In the frames I checked, Mas stays left and faces right at every size, the calm-off geometry (Mas left, Terb centre, Mada right) holds from the two-shot to the OTS to the MCU, and the door in his wall stays frame-right from 29.16 to 29.17. I found no true eyeline break in stills; motion still needs checking. Two soft points:
- **Neleh changes sides between locations:** right third facing left at her desk (27.02), then left third facing right in the boardroom (27.13b onward). That's legitimate between rooms, but with a 0.62 s establishing shot it adds to the disorientation. In v4, either establish the boardroom properly or keep her on one side for the whole board's side.
- **The avalanche's over-the-shoulder (29.20) reverses the dark room's axis** for 1.25 s. That's fine as an OTS, but it's another angle inside a strobing run.

---

## 3. Every jagged or confusing point, by timecode

Cause codes:
- **CUT**: cut too soon, or cut where one shot would do.
- **READ**: text under its read time (the §2 floor is 0.25 s + 0.05 s per character, and story text should be generous).
- **ORIENT**: orientation missing or wrong.
- **REG**: too many registers.
- **IDEA**: the set-piece or beat loses its one idea.
- **DIR**: eyeline or screen direction.
- **SOUND**: music fragment, hole or level jump.
- **STAGE**: stand-in art hides the point.

| # | Act clock | Shots | What happens on screen | Cause |
|---|---|---|---|---|
| 1 | 0:00.0–0:03.8 | 24.01–24.02 | The act's one establishing wide gets 2.5 s, and the 35-character rail types on over it, then a 1.25 s insert. | ORIENT (minor): a slow push toward the laptop would give the suite more time without adding any |
| 2 | 0:03.8–0:05.0 | 25.01 | The title stamp lands mid-shot and is legible about 1.3 s (the floor for 32 characters is about 1.9 s). | READ |
| 3 | 0:06.3–0:16.3 | 25.02–25.02d | Four cuts across three scales for one diagram. The nine nameplates are about 7 px. The key ring's label (31 characters) gets 1.25 s and `VOTES: 0` about 0.4 s. `EQUITY: 0 (HIS TESTIMONY)` gets 2.5 s. | IDEA, CUT, READ |
| 4 | 0:18.8–0:21.3 | 25.04–25.05 | The tape-stop, then near-silent holes of 0.85 s and 0.55 s around the JOIN click before the call cue. | SOUND |
| 5 | 0:21.3–0:28.8 | 26.01–26.06b | Seven shots, six in a row under 1.6 s. The NELEH card (51 characters) is up about 1.9 s over a live grid (floor about 2.8 s). The arrow's approach is split across three shots. The music is four excerpts from cue positions 0, 10, 12.5 and 15 s, hard-spliced, so about 6 s of cue is skipped. | CUT, READ, SOUND, IDEA ("someone else's hand is coming for Cancel" is chopped up) |
| 6 | 0:28.9–0:38.9 | 26.06b–26.10 | The designed drop-out (3.0 s of digital silence) is good. But after "the room comes back with the phone" there's another 1.5 s hole (0:32.4), 0.9 s (0:34.5) and 2.95 s (0:35.9, F1.2 is silent). The returning room stays under −42 dBFS. **The one designed silence loses its edge because silence carries on for 7 more seconds.** | SOUND |
| 7 | 0:35.1–0:38.9 | 26.10 | F1.2: a style switch (EARLY-WEB16), a new place (a frosted boardroom door with two shadows) and a reference label, wedged between two moments of the same day. | REG, ORIENT |
| 8 | 0:38.9–0:44.5 | 26A.01–26A.02 | **The rail `2005–08 · TPOOL · (REPORTED)` stays over the dark room "that night".** The script clears it before the dither turns. | ORIENT (a bug) |
| 9 | 0:47.0–0:49.5 | 27.01 | The board's-side grid is framed almost identically to his-side grid at 26.09: the same four tiles and layout, with only the badge colour and a bezel different. The told-twice payoff ("nobody looked up" against "four frozen faces") needs a visible difference. | IDEA (human check: does his side visibly freeze?) |
| 10 | 0:49.5–0:52.0 | 27.02–27.03 | Neleh's MCU (1.25 s), then the blueprint with its four steps (66 characters) legible about 1.1 s (floor about 3.6 s). **This is the act's spine.** | READ, CUT |
| 11 | 0:52.0–0:55.8 | 27.04 | The candor card at 3.75 s is fine on read time. But it sits in 2.35 s and 1.25 s holes, and the bed is at −49 dBFS. | SOUND |
| 12 | 0:55.8–1:00.4 | 27.05–27.05c | One exchange ("We'll share more soon." / "Share what?" / "More. Soon.") in three setups across two registers: spotlight void, call two-up (0.75 s), spotlight void. Lines are 0.17 s apart. | REG, CUT (the old one-setup-per-speaker rule) |
| 13 | 1:00.4–1:02.9 | 27.06 | Gerg's toast and post. The music comes back for 0.42 s at 1:00.42 between dry windows. | SOUND (a "half a second" fragment); see must-understand #5 for the story side |
| 14 | 1:02.9–1:08.6 | 27.07–27.09 | Hard cut from the call grid into a new place (the bullpen all-hands). A 1.54 s wide, the doorway MCU, then a 1.54 s wide. Music fragments of 1.58 s and 1.67 s sit either side of Alyi's dry line. | ORIENT, REG, SOUND |
| 15 | 1:08.6–1:14.9 | 27.10–27.11 | Night is marked only inside the post (`9:32 PM`), while the rail says `NOV 17 · EARLIER`. The equity payoff (25 characters) gets 1.25 s. Holes of 1.2, 1.35, 1.7 and 0.55 s. | ORIENT, READ, SOUND |
| 16 | 1:14.9–1:19.9 | 27.12–27.12b | The hearts pour, then a 0.62 s macro of the blue heart landing on Mada's spinner: an idea with no time to register. Music pieces of 0.83 s and 0.62 s, with a 3.1 s hole between them. | CUT, SOUND |
| 17 | 1:19.9–1:20.5 | 27.13 | **The boardroom (new place, night) is established in 0.62 s.** | ORIENT |
| 18 | 1:20.5–1:33.5 | 27.13b–27.19 | Seven shots averaging 1.9 s cycling MCU, OTS, overhead, MCU, two-shot, MCU·PF, overhead. The phones (27.15) read as teal rectangles, with no ring and no caller ID. Alyi's reflection in the OTS is barely visible. Neleh's "real face" (27.18), the one moment of doubt, gets 0.62 s. | CUT, IDEA, STAGE |
| 19 | 1:33.5–1:36.0 | 27.20–27.22a | A run of 3 under 1.6 s across a location change (boardroom → lighthouse). The speakerphone dialling out, the bridge, isn't legible. 27.21 is a stand-in with a red `PLATE NEW` label, and the 57-character rail types on over it. | ORIENT, STAGE |
| 20 | 1:34.8–1:41.5 | 27.21–27.23 | Three text layers at once: the `(REPORTED)` rail, typed dialogue boxes on the wide, and the two rent meters. | REG, READ |
| 21 | 1:41.5–1:45.2 | 27.24 | A fourth place, for one shot. **His post is drawn upside-down** (the script asks for it; it makes a real line unreadable), and `GUEST` isn't legible on the tiny figure. | IDEA, READ |
| 22 | 1:45.2–1:50.2 | 27.25–27.27 | Three shots (1.88 s, 1.25 s, 1.88 s) for one gag: the flip and "Chat… for how long?". | CUT (minor) |
| 23 | 1:50.2–1:54.6 | 27.28–27.29 | Tasya's door: no sign, no key ring visible, and the line doesn't say for whom. A dry window leaves a **0.12 s music blip at 1:54.46**. | IDEA, STAGE, SOUND |
| 24 | 1:54.6–1:57.1 | 27.30–27.31 | Pass one's turn ("Step four?", Mada says nothing) gets 1.25 s + 1.25 s before the card. | CUT |
| 25 | 1:59.6–2:09.0 | 29.01–29.03 | The hearts rhythm game plays dry, with ticks over a bed at about −44 dBFS: eight holes of about 0.5 s, every tick gap a hole. | SOUND |
| 26 | 2:13.4–2:25.3 | 29.06–29.09 | The counter (`THE LETTER`, doesn't say *staff*), then a full-screen card, then the monitor's signature list, then the Orb: monitor, card, monitor for one letter. The card (5.6 s) sits in eight holes. | REG, SOUND |
| 27 | 2:25.3–2:28.4 | 29.10 | The check's words are about 6–8 px on a two-shot for 3.1 s, and "tender offer" is jargon. | READ, IDEA |
| 28 | 2:28.4–2:35.1 | 29.11a–29.15 | Six shots in 6.75 s alternating tile and MCU, with the "quiet beat" as three 0.62 s flashes. The look between the two men is chopped up. The Build plays 4.9 s, stops dead, then a 0.8 s hole. | CUT, SOUND |
| 29 | 2:35.1–2:41.8 | 29.16–29.17 | D8, the door, "Everyone is welcome." / "leave it open." This plays well in stills (one held two-shot, then the MCU with the door behind). Holes of 0.45 s and 1.2 s. | SOUND |
| 30 | 2:41.8–3:01.8 | 29.18–29.30 | 13 shots, with same-framing **jump cuts** on the grid (0 → 2 tiles, then 438 → 745) that read as stutter rather than a build. Runs 29.18–29.22 and 29.25–29.28 are all under 1.6 s. The one "continuous" swing is four excerpts (cue positions 58.75, 71.25, 78.75, 88.75 s) with 1.25–2.5 s of cue skipped at each splice. | IDEA, CUT, SOUND |
| 31 | 2:59.3–3:01.8 | 29.30→30.01 | 2.65 s of near-silence (−46 dBFS) after the band's dead stop on Mada's label, before the violin. A designed stop needs an audible bed under it. | SOUND |
| 32 | 3:01.8–3:16.2 | 30.01–30.06b | **The rail still says `NOV 20, 2023 · ~2:06 AM PT` over a daylit bullpen.** Mas is at his office desk (in the box) before any deal, so where is he? The floor POV for "hi." / "Hello." is a flat blue panel with no shoe tips for 1.04 s: the joke (the landlord *is* the floor) isn't in the picture. | ORIENT, IDEA |
| 33 | 3:16.2–3:32.5 | 30.07–30.15 | Ten shots averaging 1.6 s, and every line of the five-line exchange gets its own shot (run 30.11b–30.13 under 1.6 s). Whole scene dry: 11 holes at about −45 dBFS between lines, where the script only asks for the 2-beat calm-off hold in silence. The pin insert is a stand-in (`HAND NEW`). | CUT, SOUND, STAGE |
| 34 | 3:30.1–3:32.5 | 30.15 | The term sheet's content is unreadable, **so nothing says he's CEO again.** | IDEA (must-understand #11) |
| 35 | 3:32.5–3:41.3 | 30.16–30.18 | Gerg's post on a stand-in phone, a 0.62 s reaction, and the hourglass overhead. **The music is on, but the excerpt (MM-11 d at 60.6 s) opens on about 2.4 s of zero and has a 4.3 s zero in the middle,** so the "victory lap" has holes of 1.2 s and 3.4 s. | SOUND (render), STAGE |
| 36 | 3:50.7–3:55.0 | 31.01 | The Q* rail (82 characters) is up 4.38 s, which is right at the floor. | READ (minor) |
| 37 | 3:58.5–4:08.9 | 31.03–31.05 | The memo and after play dry over a bed at −41 to −48 dBFS. Four 0.5 s holes under the screwdriver ticks, and a 1.6 s hole on the act's last shot. The nameplate and the chair are stand-ins with red labels. | SOUND, STAGE |
| 38 | throughout | 27.21, 30.10, 30.16, 30.20, 31.04, 31.05 | Red stand-in labels in the picture (`PLATE NEW`, `HAND NEW`, `post-ui stand-in`, `PROP NEW`). Each hides the gag the shot exists for: the throne, the pin, the box of zeros, the screwdriver, the chair. In a cold-viewer test they read as noise. | STAGE |
| 39 | throughout | all conversation blocks | Replies are chained at a uniform 0.125–0.29 s (lock rule 2). Only two gaps are "considered" (the 1-beat "good question." and Tasya after D8). The talk is mechanical, then followed by wordless stretches of 18–19 s (A 0:15.7–0:33.8 and A 3:30.1–3:49.6). | SOUND/rhythm (§4 of the guidance) |

**What the numbers say about where to look first.** The strobing concentrates in four places, which match the runs under 1.6 s and the holes: the call (C), the board's first 30 seconds (F–H), the Gerg exchange (N), and the avalanche plus Terb (O, Q). The lobby (S) and the D8 door (N, 29.16–29.17) are the model to copy: held frames, one idea each, a clean bridge.

---

## 4. Proposed v4 structure: 8 sequences

Each sequence has one place (or one clearly bridged pair), one time, one question and one turn, and **one continuous cue** that ducks and thins under lines and record rather than stopping. The designed silences are only these: the Cancel drop-out, the band's dead stop on Mada (with room tone under it), and the calm-off hold. Numbers are guides, not gates. Runtime is an outcome: I'd expect v4 within about ±20 s of v3, since the merges below save roughly what the holds add. At a guess that's about 70–85 shots, against v3's 119.

**Cross-cutting fixes, for the passes that own them (I edited none of these):**
- **Sound.** Render continuous, per-sequence cue versions without baked-in dry gaps, in the new `audio/ost/tracks/e01-act4-v4/`. Raise the room beds to an audible level under the dry record: roughly −30 to −36 dBFS in the mix rather than −45, for a human ear to set. "Dry" becomes "thinned": a pad or pedal holds, melody out, ducked.
- **Rails.** Every rail clears or changes when the place or time changes: the TPOOL rail off before the dark room, the 2:06 AM rail off before the bullpen, and a night marker for Neleh's 9:32 PM desk.
- **Stand-ins.** Replace the red stand-in labels with even crude drawings of the gag before the next cold-viewer test.

### S1 · NOON, LAS VEGAS: THE CALL (HIS SIDE) · v3 A 0:00–0:35

- **Place and time:** the suite. The blueprint and the call UI both live inside his laptop, so the laptop is the bridge. Nov 17, noon.
- **Question:** what does this meeting want with him?
- **Turn:** Cancel; `+1 FIRING`; "super."

Coverage:
- **One longer shot:** the suite wide with a slow push toward the desk (4–5 s). The glass nudge plays inside it or as one ECU.
- **A camera move instead of cuts, for THE PLAN:** one sheet, one continuous move that follows the drawing as it draws itself.
  1. Hold on the title stamp until it reads.
  2. Track along the nine chairs as three walk off and the circle draws round the four. Mas and Gerg are labelled and stand together outside it.
  3. Tilt down the `CONTROLS` arrow to the company box.
  4. Slide to the key ring as `VOTES: 0` lands.
  5. Push into the CEO box (`EQUITY: 0`, the moth, "Good question.").
  6. Pull back to the path (`1. NOON · VIDEO CALL`) and the curling fold.

  That's 7 cuts down to 1 or 2. For the animatic it needs no new drawings, since the kit's detail shots are already integer 2× crops of the sheet. The waltz plays as one performance, ducked under Neleh.
- **Held coverage for the call:** the JOIN click insert, then **one locked POV of his screen** that carries:
  - the connect, with the Neleh card riding it for 3 s or more
  - the speaker view pinning Alyi, as an in-app layout change rather than a cut
  - the dialog popping up
  - the arrow's approach, with a slow push toward Cancel in place of the macro cut

  Cut out only to the eyes strip (held 1.2–1.5 s), and to the CU for `+1 FIRING` after the click. The phone insert and the "super." OTS stay: they're good and they're one idea each.
- **Sound:** MM-07 runs into MM-08 as one line (the tape-stop into JOIN is a phrase break, not a gap), with a hard stop on the click. That's the act's one digital silence. Then the room comes back audibly with the buzz.

### S2 · THAT NIGHT: THE THIRD MARK (HIS SIDE) · v3 A 0:35–0:47

- **Place and time:** the dark room, that night.
- **Question:** how does he take it?
- **Turn:** the Orb counts, and rewinds.

Coverage:
- **Fold F1.2 into the tally.** This is a recommendation that needs the writers' and POV owner's check. The carve plays first (the ECU with its drift), then the 2S as the Orb's iris steps along the marks. On mark 1 the dither render front brings in the frosted boardroom door (the show's `(REPORTED)` plate, 2–3 s, with its rail on that shot only). Then back to the iris landing on his thumb on mark 3. This keeps the script's rule that the Orb's look is the only thing that touches marks 1 and 2. It also turns a stray insert into the answer to "has this happened before?", and it's a style switch that is motivated (style-range note).
- **Fallback:** keep F1.2 as the transition out of S1, give it the dark room's sub drone pre-lap so it isn't silent, and clear its rail before the grain becomes the desk.
- **Held coverage:** otherwise 26A is already right (3 shots, 8 s). The rewind (toast, whip, `NOV 17 · EARLIER · THE BOARD'S SIDE`) is the bridge. Let the toast land before the rail changes rather than both at once.

### S3 · FRIDAY, THE BOARD'S SIDE: STEPS ONE TO THREE · v3 A 0:47–1:14

- **Place and time:** Neleh's desk. Her laptop is the call, her blueprint is the plan, her phone brings his posts. Friday, noon into night.
- **Question:** they've done it. Can they run it?
- **Turn:** step three is done, Gerg is gone, the staff ask "Is this a coup?", and by night Mas is fighting back in public.

Coverage:
- **One longer shot plus a move:** open on her laptop (bezel) with Mas's tinny "super." and nobody looking up. The tiles must visibly *move* here where they froze in S1. Then pull or pan off the laptop onto her desk and the blueprint: step 1 ticks, the fold opens, `2. BLOG POST · 3. INTERIM CEO · 4. ______` is held to read.
- **A push-in instead of a register jump:** she posts. Push into the laptop until the candor line fills the frame. The full-screen card can stay as the shot's end state, reached by a move rather than a cut. Music thins under it, and nothing stops.
- **Held coverage:** the Rima exchange plays on the call's two-up for all three lines, with her plate and step 3 ticking in the same frame or one cut (3 shots and 2 registers down to 1). Gerg's toast and post arrive on the same laptop (no new register).
- **Bridge into the all-hands:** push into Alyi's doorway tile and match-cut to the real doorway at the all-hands. Hold the wide (3.5–4 s) for "Is this a coup?", then the doorway MCU, then back to the wide as he steps out.
- **Night, same desk:** one overhead that holds her phone with the 9:32 post *and* the blueprint's CEO box, so the pen taps `EQUITY: 0` in the same frame. Mark night with light, lamp or rail.
- **Sound:** MM-09's pizzicato as one performance from the laptop to the pen tap.

### S4 · THE WEEKEND, THE BOARDROOM: STEP FOUR · v3 A 1:14–1:57

- **Place and time:** the boardroom, Nov 18 night into Nov 19 at 11:53 PM. Everything the board learns reaches them *in* this room.
- **Question:** what's step four?
- **Turn:** the landlord's door opens, and Mada has no answer.

Coverage:
- **Establish it:** a held wide of the boardroom (3 s or more) with the hearts already pouring over the grid on its wall screen or the laptop on a chair. The eulogy post rides it. Give the blue heart 1.5 s or cut it.
- **Held coverage for the committee:** the two-shot (Neleh, Mada, Alyi's reflection) carries most of it with a slow push-in. Cut to Neleh's MCU for "The bylaws allow it" and to the overhead only when the phones walk and for the `?`. Make the phones ring and show caller IDs. Hold Neleh's real face (27.18) for about 1.5–2 s: it's the one quiet beat the board gets.
- **One shot instead of a cross-cut, for Mario:** the speakerphone dials, and the frame splits, boardroom left and lighthouse right. That's the split the audience already learned in Act One's sc 11 duel. The throne falls off the handset, Adelina says "no", and the second phone rings with the rent meters, all while the board listens in the other pane. One 7–8 s shot replaces 4 cuts in 2 places, and the `(REPORTED)` rail can be shorter.
- **In-world screen, not a new place:** the security feed comes up on the boardroom's screen. The board watches him walk in wearing `GUEST`; push in until the badge and his post (the right way up) read.
- **Ttemme:** the spotlight swings off Rima's empty chair onto him (wide, plate), then one desk-level shot that holds the flip *and* "Chat… for how long?" (3 shots down to 2).
- **The door:** the wall steps to slate in the held two-shot, the door opens, and Tasya's MCU shows a readable sign and the key ring's jangle. Then "Step four?" over the blueprint, and Mada held 2 s or more into the card.
- **Sound:** MM-09 continues through the whole sequence. Mario's quartet is a phrase inside it and Tasya's Rhodes enters over it. Out on the REVERSAL into `WHAT THEY DIDN'T KNOW`.

### S5 · HIS SIDE, 2 AM: WHAT THEY DIDN'T KNOW · v3 A 1:59–2:42

- **Place and time:** the dark room (his desk and his monitor). Nov 20, about 2 AM.
- **Question:** does he have anything left?
- **Turn:** every card: the staff, Alyi, the money, Gerg, the door.

Coverage:
- **Held coverage:** the home shot, then the hearts rhythm game as one held ECU. The ticks sit on the felt bed now, not on silence. Then the Orb two-shot, the iris with "the badge was a joke.", and "mostly." (as v3).
- **A camera move instead of three registers, for the letter:** the counter rolls (`STAFF WHO SIGNED 745 / 770`), then push into the monitor until the letter's line fills the frame (held to read). The same page scrolls on down its signatures and stops on `ALYI`, and the Orb's look goes from name to thumbnail (with his flipped vote icon).
- **The check:** the delivery in the two-shot, then an insert or push-in so its words read.
- **One setup for Gerg:** an over-the-shoulder past Mas onto the monitor, with Gerg's tile large. It carries "One sec. Compiling—" / "what are you building?" / "The company. Again. Just in case." *and* the look: Gerg glances up into his camera, and Mas's head is in the foreground frame. Six shots in 6.75 s become 1 or 2, and the quiet beat becomes a held look instead of three flashes.
- **Keep:** the D8 two-shot with the door, and "leave it open." (v3's best-built passage).
- **Sound:** MM-10's felt line as a bed from the home shot, thinned (not stopped) under the letter and the check. The Build enters with Gerg and stops on his look, a designed stop with room tone under it. The felt comes back under D8.

### S6 · THE AVALANCHE · v3 A 2:42–3:02

- **Place:** his monitor, full-bleed, with the room around it.
- **Question:** how does the board fall?
- **Turn:** only Mada is left.

Coverage:
- **One longer shot:** a locked POV of the grid for most of the 8 bars. The staff tiles pour in and the counter climbs, as one continuous build.
- **Camera moves instead of cuts:** in-camera pushes onto Alyi's tile as it resists and slides off, onto Neleh's ("Has anyone read the char—"), onto the quiet vote's black square, and last onto Mada's half-frame and his label.
- **Only two cutaways:** Mas watching once the stack is built, and the glass with its flat water line. That's 13 shots down to about 6.
- **Sound:** SET-PIECE SWING as one continuous 8-bar performance (a render at length, not four excerpts), dead stop on Mada's label, room tone under the stop, then the violin's entrance as the clear re-entry.

### S7 · THE RETURN: MONDAY IN THE OFFICE, TUESDAY NIGHT IN THE BOARDROOM · v3 A 3:02–3:41

- **Place and time:** two stages with one bridge. The bullpen on Monday by day, with a proper rail, then the boardroom on Tuesday night.
- **Question:** will they take him back, and on whose terms?
- **Turn:** the terms, readable; Gerg is back; the hourglass shatters.

Coverage:
- **Monday:** the deliberate box (Alyi's regret, the three hearts, the hold), then **one still wide** for Tasya's remap (as v3). "hi." becomes a **tilt down** from Mas's MCU to the slate floor with his shoe tips in it, a move instead of a 1 s cut, and "Hello." comes up from the floor. Staging note for the writers: say in the picture where Mas is (the box is his desk "in his head", or he is in the office as a guest). v3 leaves it unplaced.
- **Tuesday, held coverage:**
  1. The M on Mada among the fires.
  2. Terb's entrance, then the full-freeze card, then the pin insert once it's drawn.
  3. "Which room is on fire?" / "…Ah." on **one wide**, as everyone looks round.
  4. The calm-off two-shot carrying "Terms?", with one OTS for "Good question." and Mas's MCU for the echo.
  5. The 2-beat hold.
  6. The term sheet, readable.

  About 10 shots down to about 6, with space kept for the echo's one-beat lateness.
- **The consequences:** Gerg's post and the hourglass with Ttemme's post as a short run under the Victory Lap. Draw the hourglass overhead so the table reads.
- **Sound:** the violin, then Tasya's Rhodes floor, then **a cue under Terb** (not 16 s dry). The only thing that drops out is the calm-off hold, to room tone and the chaos. Then the Build and the victory lap for the posts, from a render without holes.

### S8 · THE LOBBY, AND AFTER · v3 A 3:41–4:09

- **Place and time:** the lobby at night, then the back wall, Nov 22 → Nov 29.
- **Question:** is he safe now?
- **Turn:** "okay.", and then what it cost.

Coverage:
- **Keep the lobby as v3 has it:** the sign from low, the box of zeros, the OTS-W with Cancel greying out and the bonk, the CU, "okay." over the hands. It's the act's cleanest run; just give it an audible bed.
- **The coda as a short epilogue** with its own bed: the vault's hum at F becomes the bullpen's room tone, never dead air. Q*, the 50/50 with "it's a preview.", the memo, the nameplate, the chair. Give the Q* rail a little more than the floor.

---

## 5. What a human has to check (I could not)

These can't be settled from stills or numbers.

1. **The told-twice "super."** In motion, do the four tiles visibly freeze on his side (26.09), and visibly carry on on the board's side (27.01)? The stills of the two are nearly identical.
2. **Cancel = fired.** Does the click, and the tile falling, read as "he's fired" before `+1 FIRING`? Or as a dropped call?
3. **THE PLAN.** At its current pace and at the proposed single move, can a newcomer say afterwards "four of them control the company and voted him out; he owns nothing"?
4. **The bed.** At what level does room tone stop reading as a hole on normal speakers and headphones? My −30 to −36 dBFS is a starting point, not a measured judgement.
5. **The designed silences.** After the fixes, do the drop-out, the dead stop on Mada and the calm-off hold each land as punctuation?
6. **The Terb exchange.** Is the one-beat-late "good question." still funny when "Terms?" and "Good question." share a setup?
7. **A newcomer retell** of v4, done as in §5 and §5a of the guidance, checked against the must-understand list in §1. I know the real events, so my own reading of what's "clear" in this file is exactly the reading §5a warns about. Use a reviewer who doesn't know them.

*Scratch frames and strips made for this diagnosis were deleted. The v3 outputs are untouched.*
