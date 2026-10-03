# Ep1 · Act Four · Edit plan v4 (THE SUPERVISING EDITOR)

| | |
|---|---|
| **Who** | The supervising editor, 2026-09-26. **Final plan**: the critic's 13 amendments are applied (what was taken, changed or rejected, and why, is the [Critic log](#9-critic-log), §9), and the script's `## ACT FOUR` is now draft 4.0 to match it. A plan only: no lock, render, mix or cue was made for it, and the v3 outputs are untouched. |
| **Why** | The showrunner on the v3 animatic: "there are two many cuts, pauses, its hard to follow what's happening… it should be fluid and coherent, and there should [not] be random pauses of silence. the ost should not be playing for just half a second at a time then stopping." Then: "there should be no hard cutoffs for rules on episode handling… the practical flow and user entertainment is always priority"; "it should still be clear the overarching storyline to someone with minimal familiarity with the real world events"; "you need to balance clarity with engaging/suspenseful storytelling with not dragging on unnecessary/inferrable info for people with more background knowledge." |
| **Binding guidance** | [flow-and-continuity](../../../../bible/flow-and-continuity.md) (read in full), the live [SHOWRUNNER-NOTES](../../../../production/SHOWRUNNER-NOTES.md) (read at the start and again at the end of this pass; nothing newer than the brief), the [guardrails](../../../../bible/guardrails.md). |
| **Inputs** | The `## ACT FOUR` section of [script.md](../../script.md) (draft 3.2) and the setups before it (the cold open's invite, Act One sc 9's `TASYA / THE LANDLORD`, sc 11's split); [diagnosis-v3](history/diagnosis-v3.md); [sound-diagnosis-v3](history/sound-diagnosis-v3.md); the cold-viewer (newcomer) and insider reports on v3; [shots-locked-v3.json](shots-locked-v3.json) (v3 shot lengths); `lines.json` (take lengths); the animatic code (`studio/src/episodes/ep01/act4/animatic/`) and the shared pixel kits, for what is buildable. |
| **Ears and eyes** | **I haven't watched or listened to anything for this plan**, and I can't play video or audio in real time. Every length here is a planned length, summed by script from this plan's §3 tables; nothing is measured from a v4 cut, because none exists. Read times are checked against the floor of 0.25 s + 0.05 s per character (flow-and-continuity §2), with take lengths from `lines.json` and label widths measured in the pixel font. Nothing below "flows", "reads" or "sounds" right until a human has watched and listened (§8). |
| **Numbers** | Every number is a starting point for judging the cut, never a gate (flow-and-continuity, "How to use this file"). When the watching disagrees with a number here, the watching wins; change it and say why in a line. |

**Clock.** v3 times are on the act clock (`A m:ss`), as in the diagnosis. Episode timecode = act clock + 12:31:00. v4 shots are numbered `S<sequence>.<shot>`.

---

## 0. The short version

- **Structure.** v3 played as about 20 mini-sequences. v4 plays as **8 sequences in three chapters and a coda**, keeping the script's order, which is the act's suspense engine:
  - HIS SIDE, the blow: S1–S2
  - THE BOARD'S SIDE, blind: S3–S4
  - HIS SIDE, what they didn't know: S5–S7
  - the lobby and after: S8

  Each sequence has one place (or one clearly bridged pair), one time, one question, one turn and one continuous music cue.
- **Cutting.** 119 shots become **82**. The average shot goes from 2.09 to about 3.3 s and the median from 1.88 to about 2.75 s. There are no runs of three or more shots under 1.6 s anywhere (v3 had six); the only run of short shots is the avalanche montage's four beats under one continuous cue. The method is cutting on story, holding a shot while things change inside it, and replacing strings of inserts with held frames. Examples:
  - THE PLAN is one drawing under one short tilt, then one held detail where both zeros sit side by side, not seven shots.
  - The call is one screen whose layout changes in the app.
  - Rima's exchange is one close-up.
  - Mario's two calls are one split, Act One's device.
  - The letter is one page on his monitor.
  - Gerg's call is one over-the-shoulder.
  - The avalanche is one locked view with its beats.
  - Terb's entrance, the freeze and "…Ah." are one held boardroom wide, and the calm-off is one two-shot with one cut to Mas.
- **Sound.** One performance per sequence, re-rendered to v4's lengths. It thins and ducks under words, posts and cards instead of stopping. Every location gets an audible room (beds at about −38 to −40 dBFS). There are **four deliberate stops** (Cancel, Gerg's glance, Mada's label, "Terms?"), a handful of short rests inside cues, and the Cancel drop-out stays the act's only digital silence (§5). The return (S7) has two music-off windows, not five.
- **Clarity without explaining.** Every newcomer gap the must-understand list names (§1) is closed with a label, a prop, a plate, a rail or a staging change: a tagged cursor, a sign in Tasya's hand, the check's own lettering, the term sheet's one legible line, Rima placed in the boardroom's CEO chair. **No new voiced line is added.** One line is trimmed by editing its existing take.
- **For the insider.** Anything told twice, or told before it lands, is cut:
  - the stamp that spoiled "Good question."
  - "Nine seats."
  - the `CONTROLS` label
  - the second `EQUITY: 0` stamp
  - the double Gerg toast
  - `HIS SIDE` in the rail
  - the stand-alone letter card and counter
  - two Orb inserts
  - the `72 HOURS` plate
  - the Q\* rail's "breakthrough called"
  - the typed dialogue boxes
  - the repeated blueprint insert, the pin insert, a third night rail, the sticky note that doubled Ttemme's plate, and "colleagues" on Tasya's sign (pass two's "Everyone is welcome." says it)
- **Runtime, as an outcome: about 4:28 (268 s), against v3's 4:09.** Shot by shot, about 43 s is added for orientation, reading and held reactions, and about 24 s of v3 is cut as padding or repetition. Every second is accounted for in §6, with the trims to take first if the showrunner wants it shorter.

---

## 1. Must-understand list (final)

What someone who has never followed AI news must leave Act Four with, in story order. The v4 carrier is the cheapest in-show setup, and never a stop-and-explain.

Several of these already have setups earlier in the episode:
- the cold open's invite, with its four circles (a doorway, a page, a spinner, a black square)
- Act One sc 9's `TASYA / THE LANDLORD` card, with the ~$10B Macrosoft check and the pocketed pen
- Act One sc 11's meanwhile split with the lighthouse
- the `GUEST` lanyards at 3:20

So in the full episode Act Four's job is often a **recall**. The act-alone newcomer test is harsher than the real one, and the fixes still have to pass it.

| # | The beat a newcomer must get | v3's gap (newcomer read, diagnosis) | v4 carrier | Where |
|---|---|---|---|---|
| 1 | **This board can fire the CEO, and four of its members are about to.** Mas and Gerg, his co-founder, are the two left outside. | The chair labels were about 7 px. Nothing said who Gerg is to Mas. "Whose plan is THE PLAN?" | The chairs walk off, and the ring draws round the four, who take the cold open's invite icons. `MAS` / `CEO` and `GERG` / `CO-FOUNDER` (two-line nameplates) sit together outside the ring. "Three left this year. Four of us vote." The box round the six and the arrow into the company are drawn at the same scale on the same sheet. The walkers on THE PLAN's path are the same four icons. | S1.03, S1.05 |
| 2 | **The big investor has no vote, and the CEO owns no shares.** So who owns him? | The key ring and `VOTES: 0` were up for 0.5–1.25 s, and the title stamp for 1.25 s. | One held 2× detail with the key ring just outside the company's wall and the CEO box just inside it: `MACROSOFT · ~$10B IN (REPORTED)` readable, `VOTES: 0` slams on "gets" and holds, then "And the CEO owns—" / "Good question." and `EQUITY: 0 (HIS TESTIMONY)` lands beside it. The two zeros side by side are the act's question in one picture; the stamp `WHO OWNS A CEO?` has already asked it. | S1.03–S1.04 |
| 3 | **The noon call is that vote. Alyi clicks Cancel on him, and he's out.** | The cursor was nobody's. Nobody said "fired". | The cursor carries a collaborator tag, `ALYI`, and steps out of Alyi's pinned tile. The click, the drop-out, the falling tile, then `+1 FIRING` over his still face. (The tag appears at noon only: the lobby's arrow in S8.03 has an empty tag.) | S1.07–S1.10 |
| 4 | **He shows nothing ("super."), but it has happened before, and he counts.** | TPOOL meant nothing. The 2005 rail sat over "tonight", and the flashback floated between scenes. | The tally, with its two old marks. On the Orb's count the old marks open into the frosted boardroom door under `2005–08 · TPOOL, HIS FIRST COMPANY · (REPORTED)`, and the count lands on the new mark. | S2 |
| 5 | **The same day from the board's side. Their plan was call, blog post, interim CEO, and step four is blank.** Their public reason is that he "wasn't consistently candid". Rima is the stand-in CEO. | "EARLIER than what?" The steps were up for 1.1 s. Rima spoke before we knew who she was. | Rail `NOV 17 · ~NOON PT`, the same moment as the act's first rail, and the side badge flips. The steps are held while Neleh's pen runs down them. Step 2 ticks and her laptop shows the blog post. Step 3 ticks (off picture) as we cut to Rima under the spotlight in the boardroom's CEO chair (its high back in frame), and her plate says CEO. | S3.01–S3.04 |
| 6 | **Gerg quits over it. The staff smell a coup, and Alyi owns the word.** | Gerg "left" a call he wasn't on. The all-hands was a new place, entered cold. | Gerg's own post arrives as the call's notification (the fuller casing, `"…based on today's news, i quit."`, if facts confirm it), and his role was set in S1. A match cut from Alyi's doorway tile to the real doorway takes us into the all-hands. | S3.05–S3.08 |
| 7 | **Mas plays it in public, the public floods him with love, and by the weekend the board is under siege.** | The equity joke needed the second stamp. The boardroom was established in 0.62 s. The phones read as teal rectangles. "The bylaws allow it": allow what? | One overhead holds his 9:32 post (its own `9:32 PM PT` and the lamp say night; no rail) and the `EQUITY: 0` stamp from THE PLAN, and her pen taps it. The hearts bury the call on the boardroom's screen, then a cut to a held wide of the room shows the phones ringing with caller IDs (`STAFF`, `INVESTORS`). Against those calls, "The bylaws allow it" means "we were allowed to do it". | S3.09, S4.01–S4.06 |
| 8 | **The board flails for step four.** They offer the company to the rival lab (no), install a second temporary CEO on a clock, and watch Mas walk back into HQ as a guest. | Mario, Adelina and Ttemme arrived as strangers. The lobby post was mirrored. "What happened to Rima?" | Act One's split, in one shot: the board's speakerphone on the left, the lighthouse on the right. Mario's plate, the throne on his handset, "no", the click, and the `(REPORTED)` rail as the reveal while the left pane hears a dial tone and Mario, on the right, grabs the money call. `TTEMME · INTERIM CEO #2`, with the spotlight swinging off the CEO chair we saw Rima in. The lobby camera on the boardroom's own screen, `NOPEAI HQ · LOBBY`, with `GUEST` legible and his post the right way up. (Rima is withheld on purpose here; her post opens pass two and answers it.) | S4.08–S4.11 |
| 9 | **The landlord opens a door: a new team at Macrosoft for Mas and Gerg. That's step four, and someone else wrote it.** | The newcomer read's one MUST. Tasya was never tied to Macrosoft, and the post never said for whom. | Plate `TASYA · THE LANDLORD · MACROSOFT` lands first and clears; the key ring (the blueprint's key ring) jangles; the script's sign, now lettered `MAS · GERG →` (no quotation marks: a cartoon prop); his real line, unchanged. Then she writes `?` on step 4 as she asks "Step four?", and Mada's silence. | S4.12–S4.15 |
| 10 | **What the board didn't know: nearly all the staff have signed a letter telling the board to resign, and Alyi has signed it too.** The staff's big payout is void without Mas, Gerg is already rebuilding the company, and Macrosoft's door is open to everyone, not just the two names on the sign. | The letter's demand wasn't shown. The counter didn't say *staff*. `ALYI` was up 1.9 s. "Tender offer" is jargon. | One monitor page: `STAFF LETTER · TO THE BOARD`; `SIGNED` rolls to `745 / 770` under the insult line; then the demand, `"…unless all current board members resign…"`. The scroll stops on `ALYI`, beside his call thumbnail, whose vote icon is still flipped from noon, and the Orb's chime and servo land on the stop (off picture). The check reads `PAY TO: NOPEAI STAFF` and is stamped `VOID IF CEO MISSING`. Gerg: "The company. Again. Just in case." The slate door: "Everyone is welcome." | S5 |
| 11 | **The staff push the board out, and only Mada is left. Alyi publicly regrets it.** | The counter restarted at 0/770, which read as a timeline error. | The letter's `745 / 770` stays static in the monitor's corner, so the tiles are the signers. Mada's label. Alyi's post, and Mas's three hearts. | S6, S7.01 |
| 12 | **A fixer brokers terms, and Mas is CEO again.** Gerg comes back, the temp's clock runs out, and nobody can cancel him now: "okay." | Nothing said he was CEO again. The greyed Cancel read as "another attempt". "Are we back in Vegas?" | The term sheet: `1. CEO: MAS MANALT`, and the rest folded under, like THE PLAN's fold. The dialog: Cancel greys out, an arrow with an **empty** name tag (someone, as the sign says) tries it, *bonk*, and the dialog shakes, refused. The lobby is established around him at the reception desk, and the glass goes down on that desk's own stone top (the tray of GUEST lanyards is the fallback, §3 S8.05). | S7.10–S8.05 |
| 13 | **The cost, and a hook.** Alyi is off the board, Macrosoft gets a seat with no vote, and there's a vault the staff warned the board about. | The chair's owner was named only in a production note. | `MACROSOFT · OBSERVER (NON-VOTING)`, plus Tasya's key ring. The screwdriver takes the plate off a chair scorched by sc 30's fire, so it reads as the boardroom. `REPORTED: STAFF WARNED THE BOARD ABOUT "Q*"`. | S8.06–S8.10 |

**Withheld on purpose (suspense, not gaps). Keep these unexplained:**
- what he wasn't candid about (`ANSWERS GIVEN: 0` makes the withholding part of the story)
- what was said on the call (Alyi's mouth moves; the caption types `…`)
- whether the four froze on "super." or his Wi-Fi did (the told-twice irony)
- where Rima went, until her post opens pass two
- the terms beyond line one
- what Q\* is

**Cut as over-telling (the insider read):**
- the 1.5 s blank grid, and the riddle stamp that gave away "Good question." 9 s early
- "Nine seats."
- the `CONTROLS` label
- the second `EQUITY: 0` stamp
- the "has left" toast doubling Gerg's post
- `EARLIER` and `HIS SIDE` in the rails (the badge names the side)
- the stand-alone letter card and its separate counter
- the Orb inserts at 29.04 and 29.09
- the `72 HOURS` plate, which spent the payoff early
- "a breakthrough called" in the Q\* rail
- the typed dialogue boxes over on-screen speakers
- the avalanche's restarting counter
- the static seconds at the vault
- the second blueprint insert (27.19): her `?` is now written in the one overhead that asks "Step four?"
- the pin insert (30.10): the pull is visible in the held wide
- the `NOV 17 · NIGHT` rail over her desk (the lamp and the post's `9:32 PM PT` already say night)
- the sticky note's `CEO (TEMP)` (the plate says `INTERIM CEO #2`)
- "colleagues" on Tasya's sign (pass two's "Everyone is welcome." is the escalation)
- the meters' `(SEP)` / `(OCT)` ("already full" says they're old news)
- "and a merger" in Mario's rail

**Protected two-level moments (the insider's list; v4 changes none of their content):**
- the chairs DIRE, NOVIHS and DRUH walking off
- "The investor gets—" / `VOTES: 0`
- "Good question." and its echo
- `EQUITY: 0 (HIS TESTIMONY)`, used once
- OK/Cancel at noon and the greyed Cancel at the end
- the glass bookend
- the smart replies that all say `super`
- "i don't keep score." over the tally
- "More. Soon." with `CEO (WEEKEND EDITION)`
- "You can call it this way"
- the heart rain and the one blue heart
- the step-four thread
- "That is the company telling us."
- Mario and Adelina
- "Chat… for how long?"
- the EVIRHT check
- "The company. Again. Just in case."
- the door and "leave it open."
- the charter runner's third beat
- `LAST FIRER STANDING`
- "below them, above them, around them"
- Terb
- the box of spare zeros
- the Q\* vault
- the screwdriver under "zero ill will"
- the observer chair
- THE QUIET VOTE's camera, always off
- `IOU: 20% COMPUTE`
- the lowercase

### 1.1 Where the two reads conflicted, and the third way taken

| Beat | Newcomer read | Insider read | v4 |
|---|---|---|---|
| The title stamp | Up too briefly, but it framed the whole act for them ("nobody owns him, his people do") | Cut it: it spoils "Good question." | Keep a question, shorter: `WHO OWNS A CEO?`. It frames the act and leaves the joke unspoiled. |
| "Nine seats. Three left this year. Four of us vote." | Understood the majority | It narrates the drawing | Cut "Nine seats." (nine chairs are countable). "Three left this year" says they *left*, and "us" says the voice is one of the four. Neither is in the picture. |
| "This board controls the company." + `CONTROLS` | The lower box had no label | The line and the label say the same thing | Keep the line and a readable box label; drop `CONTROLS`. |
| Gerg quits | Who is he to Mas? He "left" a call he wasn't on | Toast and post are the same beat | One item: his post as the call's notification, with the fuller casing if confirmed. His role is set once, on the blueprint. |
| The shares joke | Got the joke from the second stamp | The second stamp explains the punchline | No new stamp. Her pen taps the stamp THE PLAN already put there, in the same frame as his post. |
| TPOOL | Label it, or cut it | Three cues already say "again"; trim it | Put it inside the Orb's count, so it answers "the old marks are what?", with one rail naming it his first company. |
| Mario | Strangers; the plot doesn't need them | Protect the whole beat | One split shot (Act One's grammar) holds both calls: a plate, "no", the click, and the `(REPORTED)` rail moved after it, where it becomes the reveal, while the board's pane hears a dial tone and Mario's pane grabs the money call. |
| Ttemme | What happened to Rima? | `72 HOURS` gives away three later beats | Plate `INTERIM CEO #2`, a small laugh that says "the second one". The spotlight swings off the CEO chair we saw Rima in (S3.04), so it reads as a replacement. Rima is answered by her post in pass two. |
| Tasya's door | The act's one MUST | Fine as it is; "colleagues" on the sign tells pass two's news early | A plate and a lettered sign, `MAS · GERG →` (an invented prop, no quotation marks), with the real line unchanged. The board sees a door for two men; in pass two Mas hears it's for everyone. No line of explanation. |
| The letter and ALYI | Show the demand; the reversal is easy to miss | Fold the card and counter away; the signature doubles the regret post | One monitor page: the counter rolls under the insult line, then the demand fragment, and ALYI held beside his flipped vote icon, with the Orb's chime heard off picture. No separate card, counter or Orb insert. The signature is the private turn and the regret post the public one, so both stay. |
| "gerg never waits to be asked." | — | The clearest case of explaining | Kept, and flagged (§4.3): it's the Ep12 plant, and its "asked" cues the door. It now plays over the door rising, so the picture moves on under it. |
| Q\* | Link it to the board with one word | The rail explains under `DO NOT EXPLAIN` | `REPORTED: STAFF WARNED THE BOARD ABOUT "Q*"`: linked to the board, and still unexplained. |
| The terms | Keep them withheld | Diagnosis: nothing says he's CEO again | Line 1 legible, `CEO: MAS MANALT`, and the rest under a fold that rhymes with step four. |
| Typed dialogue boxes | The newcomer took names from them | No rule for when they appear | Only where the world has captions (the call's live caption). First appearances get plates. The v4 cold test also drops the review frame's speaker-name band (§8, check 13), so it tests the plates, not the chrome. |

---

## 2. Sequences

**The told-twice device, as clear chapters.** The act keeps the script's three-part telling, and the chapters are signposted once each:
- **The blow (HIS SIDE):** S1–S2.
- **Pass one (THE BOARD'S SIDE):** S3–S4. The chapter door is the Orb's `rewinding…` and the whip, and the badge flips on the whip's frame.
- **Pass two (HIS SIDE):** S5–S7. The chapter door is `WHAT THEY DIDN'T KNOW`, and the badge flips on the first frame after the card.
- **The lobby and after:** S8.

The board's pass ending on "Step four?", followed by the reveal of what he held, is the suspense. Telling his whole side first would spoil the return (diagnosis §0). The two chapter doors are the only cross-side moves. Within a chapter, the four invented beats seen from both sides ("super.", the hearts, the badge, the slate door) play as signposted matches, not cross-cuts.

**Rails and the badge (a guideline for this act).**
- The **side badge** carries the side and persists.
- The **rail** carries time and place only. It types on at a change of time or place, holds for its read plus about a second, then clears.
- A rail can therefore never go stale over a new scene. That was v3's `2005–08` over the dark room and `~2:06 AM` over the daylit bullpen.
- No frame stacks a card, a rail and a plate at once. Where two text items share a shot, the plate lands first and clears before the rail types (§8, check 7).

| # | Chapter | Place · time | The question the audience holds | The turn | Orienting opening | Visual register | Bridge into the next sequence |
|---|---|---|---|---|---|---|---|
| **S1** | HIS SIDE | The Vegas suite, Nov 17 at noon. THE PLAN and the call both live inside his laptop. | What does this board want with him? | Cancel; `+1 FIRING`; "super." | The suite wide, drifting in: Vegas, noon, alone, his glass the only one not shivering. Rail `NOV 17, 2023 · ~NOON PT · LAS VEGAS`. | The room, then the blueprint (entered through the laptop's glow and left by the tear), then his laptop screen held as one view with room cutaways | The "super." over-the-shoulder steps down into darkness (fallaway). The dark room's drone pre-laps under it. |
| **S2** | HIS SIDE | His dark room, that night | Has this happened before? How does he take it? | The Orb counts three marks, then rewinds | The desk under the cyan key, the pen carving. Rail `NOV 17 · NIGHT`. | The room, with one EARLY-WEB16 flashback bracketed inside the Orb's count | The toast `rewinding…`, the whip and the badge flip. The room's tail rings under the whip. |
| **S3** | THE BOARD'S SIDE | Neleh's desk, Nov 17 noon into night: her laptop is the call, her blueprint the plan, her phone his posts. One bridged trip to the all-hands. | They've done it. Can they run it? | Steps 1–3 are done, Gerg is gone and "coup" is owned. By night Mas is answering in public. | The same call on her laptop, with his tinny "super." Nobody looks up. Rail `NOV 17 · ~NOON PT`. | Her desk: its screens and its paper. One shot of Rima's spotlight. The all-hands, entered by a doorway match cut. | Her phone at night, then rail `NOV 18`, then the call buried in hearts |
| **S4** | THE BOARD'S SIDE | The boardroom, Nov 18 night to Nov 19 at 11:53 PM. Everything reaches the board inside this room. | What's step four? | Macrosoft's door opens with Mas's name on the sign. Mada has no answer. | The hearts on the room's wall screen, then a held wide of the room around it | One room: its screens (the call, the lobby camera), its table, its window. The lighthouse appears only inside Act One's split. | Mada's silence over the pizzicato's one held note (the procedure has run out of steps), then the card `WHAT THEY DIDN'T KNOW` on 09x's REVERSAL |
| **S5** | HIS SIDE | His dark room, Nov 20 at about 2 AM | Does he have anything left? | Every card: the staff, Alyi, the money, Gerg, the open door | The glass and the GUEST lanyard on the desk. Rail `NOV 20, 2023 · ~2:06 AM PT`; the badge reads HIS SIDE. | The room, with his phone and his monitor as POVs | "leave it open." and the rack to the door; the swing's first downbeat lands the first tile on his monitor |
| **S6** | HIS SIDE | His monitor, showing the board's call from his side | How does the board fall? | Only Mada is left | The grid we watched from their side, as the first employee tile lands | The screen, with one cutaway to Mas | The band's dead stop on Mada's label; the dark room's air crossfades into the bullpen |
| **S7** | HIS SIDE | NopeAI HQ: the bullpen on Monday, Nov 20, then the boardroom on Tuesday, Nov 21 at about 10 PM | Will they take him back, and on whose terms? | "Good question." The terms say CEO. Gerg is back. The clock runs out. | The deliberate box with rail `NOV 20 · NOPEAI HQ`; later, Mada among the fires with rail `NOV 21 · ~10 PM PT` | Two rooms, each held, joined by one rail and a pre-lap of the fires' crackle | The hourglass shatters; the lobby's neon buzz pre-laps under the shatter's tail |
| **S8** | HIS SIDE, then the coda | The lobby that night, then the bullpen's back wall, Nov 22 to Nov 29 | Is he safe now? What did it cost? | "okay."; Alyi's plate comes off; Macrosoft gets a chair with no vote | The sign lighting up, seen from low | The lobby, then the bullpen, with one boardroom insert | The vault's F hum carries into the tag |

---

## 3. Shot plan

**How to read the tables.**
- *From v3* names the shots each v4 shot replaces. All 119 are accounted for: 116 are merged, kept, lengthened or moved, and three are cut: 29.20 and 29.27 (S6) and the pin insert 30.10 (S7).
- *~s* is an approximate length, chosen for comprehension and entertainment. The lock sets the exact frames from the takes and the re-rendered cues, and the cue is rendered to the picture, not the picture cut to the cue.
- Sizes and tags are the script's. Mas stays in the left third. On the board's side, anyone framed alone faces from the right.
- **"Move" in pixel art** is one of:
  - a whole-pixel pan, slide, tilt or drift on held drawings (`drift`, `shiftRoom`, the tall-sheet `oy` pan of 25.02b)
  - a cut in to an integer 2× crop (the method of `macro2x` and the blueprint details)
  - a palette step-down (`fallaway`)
  - a rack between held soft levels

  It is never a scaled sprite (script framing notes). A "pull back" is always a cut to a wider drawing. Every whole-pixel move has a pixel budget in §7, because at the 4× upscale one base pixel is four output pixels.
- *~s* also clears the read-time floor (0.25 s + 0.05 s per character) for the text that must be read, **in the order it lands**: a shot with a plate, two lines and a rail needs the sum, not the longest item.

### S1 · NOON, LAS VEGAS: THE PLAN AND THE CALL · v3 A 0:00–0:35.1 · 20 shots → 12 · ≈ 41.4 s

| # | From v3 | Shot · size · angle · move | What it does | ~s | Change |
|---|---|---|---|---|---|
| S1.01 | 24.01 | [W] the suite at eye level; a slow whole-pixel **drift** toward the desk | Where, when and who. The crane truck grinds past and every glass shivers except his. The rail types, holds and clears. | 3.0 | lengthened (2.5); still → drift |
| S1.02 | 24.02 | [ECU] his hand and the glass | The nudge, one pixel true. His hand goes to the trackpad, and the laptop's glow floods the frame and turns to blueprint. The act's bookend image, and the bridge. | 1.75 | lengthened (1.25) so the bridge registers |
| S1.03 | 25.01, 25.02, 25.02b | [GFX·sheet] **THE PLAN as one tall sheet, all at the section's scale, with one short tilt**: the stamp in the sheet's top margin over the chair row, then the box round the six, then a 60 px tilt down the arrow | `WHO OWNS A CEO?` stamps at about 0.3 s over an already-drawn grid, in the top margin, and stays in frame over the nine chairs. The nameplates are two-line: `MAS` / `CEO` and `GERG` / `CO-FOUNDER`. "Three left this year." Three walk off, one per waltz beat. "Four of us vote." The ring draws, and the four take the invite icons (door, page, spinner, black square). Mas and Gerg sit together outside the ring. `NOPEAI · THE NONPROFIT` draws round the six. "This board controls the company." The tilt follows the arrow down (the stamp leaves the top of frame) into `NOPEAI · THE COMPANY (CAPPED PROFIT)`, with the CEO box and, outside the company's wall, the fence and key ring small at the bottom of the frame. | 9.0 | 3 shots → 1; the blank grid is gone. Reads in order: stamp 1.0 s, line and walk-offs, box, then the company label (2.05 s) as the tilt lands. |
| S1.04 | 25.02c, 25.02d | [GFX·detail 2×] **a cut in to one held 2× frame** (240 × 135 sheet px) holding the CEO box just inside the company's wall and the fence and key ring just outside it. No slide. | The key ring jangles, hopeful. "The investor gets—", and `VOTES: 0` slams down on "gets". `MACROSOFT · ~$10B IN (REPORTED)` reads (1.8 s) while the stamp holds. "And the CEO owns—" / MADA (overlapping) "Good question.", and `EQUITY: 0 (HIS TESTIMONY)` stamps beside the empty equity box on "question". The moth flies out of the box. The two zeros hold side by side for a beat. | 5.25 | 2 shots → 1; the zeros in one picture replace the slide (§9, amendment 3) |
| S1.05 | 25.03, 25.04 | [GFX·sheet] cut back out to the path | The four icon figures walk onto `1. NOON · VIDEO CALL` and stop. The path runs on under the fold (no spoiler). The corner curls, the neon bleeds through, and the sheet tears back into the suite. | 3.5 | 2 → 1 |
| S1.06 | 25.05 | [ECU] his hand; the laptop shows `BOARD · VIDEO CALL · JOIN` | He clicks on the downbeat, and the tape-stop reaches zero on the click | 1.5 | lengthened (1.25) |
| S1.07 | 26.01, 26.02, 26.03 | [POV] his laptop as **one locked screen whose layout changes inside the app** | The five tiles connect. Four vote icons are already flipped, and the Wi-Fi egg shows one bar. NELEH's card rides the grid for about 3 s. The app pins ALYI in speaker view (an in-app change, not a cut): his mouth moves and the live caption types `…` and stops. The dialog pops up over Mas's tile: `MAS MANALT` · `OK` · `Cancel`. | 6.0 | 3 shots → 1 |
| S1.08 | 26.04 | [ECU] the eyes strip | His pupils move one pixel toward the dialog. Nothing else on him moves. | 1.25 | lengthened (0.62) so it registers |
| S1.09 | 26.05, 26.06, 26.06b | [POV] the same screen | A cursor tagged `ALYI` steps out of Alyi's pinned tile toward Cancel, one step a beat, and clicks on the downbeat. **D6: digital silence.** His tile drops out and comes apart into tokens (the GLYPH dissolve), and the four tiles slide together. | 3.75 | 3 → 1; the 2× macro is cut |
| S1.10 | 26.07 | [CU] Mas, one silent drawing | Quiet beat 1. `+1 FIRING` types on its second beat. The still face is the joke, and the rail the punchline. | 2.25 | lengthened (1.88) |
| S1.11 | 26.08 | [ECU] the phone and the laptop's corner | The buzz brings the room back. `[super] [super] [super]`; the tap comes at once, and the mic icon is still lit. | 1.9 | as v3 |
| S1.12 | 26.09 | [OTS] over his shoulder onto the laptop | "super." The four tiles freeze on the word, held long enough to see, because S3 answers it. Then the room **falls away** in held steps to night. | 2.25 | lengthened (1.38); the step-down is the bridge |

- **Built from.**
  - **S1.03–S1.04** are one new 480 × 330 tall sheet **drawn at the section's scale**. v3 drew this content twice at two scales: the chairs in section view (`bpChair`, 48 px pitch, 7 px caps) on the 480 × 270 sheet, and the structure in plan view (`bpChairTop`, micro text at 4 px a character, names about 5 base px tall) on the tall sheet. Nothing may be scaled, so the box, the arrow and the company are redrawn around the section chairs:
    - the stamp: `bpStamp` at `big` (not `huge`), one line, in the top margin (about y 20–50)
    - the chair row as v3 (`FOOT` 150), with a second nameplate line under `MAS` (`CEO`, 17 px) and `GERG` (`CO-FOUNDER`, 58 px; measured in the pixel font, it clears `CEO` by about 11 px and `ALYI` by about 9 px at the 48 px pitch). One line, `GERG · CO-FOUNDER` is 94 px and can't fit. If the two-line plates crowd in motion, the six survivors shuffle apart after the walk-off (a whole pixel a frame), which also rhymes with the call's tiles closing the gap.
    - `bpRing` round the four, then `bpBox` round the six (about x 166–472, y 95–190), `bpArrow` down to the company box's top edge (about y 232), the company label under it, and at the company's right wall the CEO box (inside) with `bpFence` and `bpKeyRing` just outside
    - the tilt is `bpComposite`'s `oy`, 0 → 60 px, **1 px a frame** (4 output px at 24 Hz; v3's 25.02b moved 2 px every 2 frames, 8 output px at 12 Hz)
    - S1.04 is 25.02c/d's crop code with **one fixed `x0`/`y0`** around the CEO box and the key ring (about x 200–440, y 195–330), the lettering at 1× on top. v3's slide from the key ring (sheet x ≈ 414) to the CEO box (x ≈ 130) was 230 sheet px: 19 s at 1 px every 2 frames, about 9.6 s at 1 px a frame, with about 2 s available. It can't be built, so it is gone.
    - The icons are `bpWalker`'s four kinds, drawn small over the nameplates.
    - **Fallback** if the section-scale redraw fights the drawings: keep one cut, on "This board controls the company.", from the section sheet to v3's plan-view tall sheet (with the key ring moved beside the CEO box as above). It costs one cut and a change of scale a newcomer has to map.
  - **S1.05** is 25.03/25.04's path sheet, as v3.
  - **S1.07/S1.09** chain the 26.01, 26.02 and 26.05 layouts on one clock (`gridLayout`, the speaker view, `callDialog`, `drawPointer`). The cursor tag is `pt()` beside the pointer, in Alyi's accent colour.
  - **S1.12** is 26.09 with `fallaway()` over its last 20 frames.
- **Why no macro on Cancel.** The tag makes "whose hand" legible at 1×. The 0.62 s macro was one of the six sub-1.6 s cuts in a row.

### S2 · THAT NIGHT: THE THIRD MARK · v3 A 0:35.1–0:47.0 · 4 shots → 5 · ≈ 13.25 s

| # | From v3 | Shot · size · angle · move | What it does | ~s | Change |
|---|---|---|---|---|---|
| S2.01 | 26A.01 | [ECU] the dark desk under the cyan key | Rail `NOV 17 · NIGHT`. The pen's clip (the pen from the Macrosoft check) carves the third mark, one stroke a beat. MAS (V.O.) "i don't keep score." from the second beat. He brushes away the shavings, and his thumb rests on the new mark. | 4.0 | lengthened (3.75); the rail is restored in short form |
| S2.02 | 26A.02 (first half) | [2S] Mas and the Orb in the cyan cone | The Orb's iris steps onto mark 1 | 1.75 | split around the flashback |
| S2.03 | 26.10 | [F1.2 · EARLY-WEB16] the render front sweeps **out of the mark**: the frosted boardroom door with two shadows leaning together; then the front sweeps back into the wood grain | Rail `2005–08 · TPOOL, HIS FIRST COMPANY · (REPORTED)`, on this shot only. It **types on while the front sweeps in** and clears before the front sweeps back (its floor is 2.6 s; the two fronts take about 1 s of the shot). The old marks are old ousters. A style switch with a motive, and long enough to register. | 3.5 | **moved** from between S1 and S2 into the Orb's count |
| S2.04 | (26A.02, second half) | [2S] as S2.02 | The iris steps to 2, then 3, and stops on his thumb | 1.5 | the bracket's return |
| S2.05 | 26A.03 | [ECU·Orb] the iris | It lifts from his thumb to his face. The toast `rewinding…`, then a whip right to left. The badge flips on the whip's frame. | 2.5 | as v3 |

- **Script rules kept.**
  - Only the Orb's look touches marks 1 and 2, and his hand never does.
  - No V.O. sits within a bar of the `(REPORTED)` plate: at these lengths the V.O. ends about 3.3 s before the render front.
  - The flashback has no whisper and no POV rim.
- **The fallback** (if the writers or the POV owner rule against moving F1.2) is diagnosis §4's: F1.2 as the bridge out of S1, with the dark room's drone pre-lapped under it, its rail cleared before the grain, and the extended rail text kept.

### S3 · FRIDAY, THE BOARD'S SIDE: STEPS ONE TO THREE · v3 A 0:47.0–1:14.9 · 13 shots → 9 · ≈ 31.25 s

| # | From v3 | Shot · size · angle · move | What it does | ~s | Change |
|---|---|---|---|---|---|
| S3.01 | 27.01 | [SCR] Neleh's laptop, bezel in frame | Rail `NOV 17 · ~NOON PT`: the same moment as the act's first rail. His "super." comes out of the laptop speaker, and the call's caption types it. **Nobody looks up:** footnotes keep orbiting, the spinner keeps turning, and Alyi looks at his own doorway. The contrast with S1.12 must be visible. | 3.0 | lengthened (2.5) |
| S3.02 | 27.02, 27.03 | [HIGH] Neleh's desk from above: the laptop's edge with the call running, the charter, THE PLAN unfolded | `1. NOON · VIDEO CALL` ticks ✓. Her pen runs down what the fold hid, `2. BLOG POST · 3. INTERIM CEO · 4. ______`, and ticks 2. This is the act's spine, held until it reads. | 4.25 | 2 → 1 |
| S3.03 | 27.04 | [SCR] her laptop, full frame: the NopeAI blog in its own UI | `"…not consistently candid in his communications with the board…"` · NOV 17, 2023 [V]. The words are the same; the medium is now in-world. | 3.75 | card → the laptop; lengthened (3.25): the quote alone is 64 characters, a 3.45 s floor, and it's the board's public reason |
| S3.04 | 27.05, 27.05b, 27.05c | [MCU] RIMA, right third, under the hard spotlight, **in the boardroom's CEO chair, its high back in frame** (the chair S4.10's spotlight swings off): **one setup for the exchange** | A pencil tick off picture (step 3) on the cut. "We'll share more soon." / NELEH (O.S., through the call, overlapping) "Share what?" / (0.5–0.7 s) "More. Soon." The plate `RIMA TAMURI · CEO (WEEKEND EDITION)` lands on the last. | 4.5 | 3 setups in 2 registers → 1; the void is now a place, and it previews the boardroom |
| S3.05 | 27.06 | [SCR] her laptop: the call | Gerg's post arrives as the call's notification: `GERG MOCKBRAN · "…based on today's news, i quit."` (casing to be re-fetched; see §4). Keycaps pop and rain across the grid. Nothing on the blueprint ticks: he wasn't on the plan. | 3.0 | toast + post → one item |
| S3.06 | 27.07 | [W] **a match cut** from Alyi's doorway tile to the real doorway: the all-hands from the back of the crowd | The tiled employees, and Alyi half cut off by the frame, in the doorway's screen position. TILED EMPLOYEE (one hand up) "Is this a coup?" | 2.75 | lengthened (1.54): a new place |
| S3.07 | 27.08 | [MCU·door] ALYI, right third, the jamb cutting him | (0.6–0.9 s) "You can call it this way" | 2.75 | — |
| S3.08 | 27.09 | [W] as S3.06 | The hand is still up. Alyi steps back out of the doorway one whole pixel at a time, and it holds empty. | 1.75 | — |
| S3.09 | 27.10, 27.11 | [HIGH] Neleh's desk at night, the lamp on | **No rail**: the lamp and the post's own `9:32 PM PT` say night. Her phone lies face-up beside the blueprint with his post: `"…the nopeai board should go after me for the full value of my shares"` · 9:32 PM PT. Her pen taps the CEO box's `EQUITY: 0`, the stamp THE PLAN put there. Nothing new is stamped. | 5.5 | 2 → 1; the post's floor is 3.75 s, plus the tap |

- **Built from.**
  - S3.02 and S3.09 are 27.03's and 27.10's `drawTableInsert` overheads. The laptop's edge in S3.02 is the call grid at 1:2 inside a bezel rectangle, as 29.20 shows its monitor.
  - To keep her desk from reading as the boardroom table (both use `drawTableInsert`), Neleh's desk always carries the charter and her laptop, and at night the lamp. The boardroom table carries the phones and the speakerphone.
  - S3.03 is `quoteCard` drawn inside `bezel()`.
  - S3.04 is 27.05's `rimaMCU` held for the whole exchange, with the boardroom's CEO chair back drawn behind her in the boardroom's chair colours (the same chair design as S4.02's wide, S4.10 and S8.09's scorched back), the spotlight falling on it.
  - S3.05 is 27.06 with the toast removed and the post placed in the notification.
  - For S3.06, frame the all-hands plate so the doorway sits where Alyi's tile had its doorway in S3.05. That match is the bridge.
- **Neleh's side.** Her singles stay in the right third, facing left, through both board sequences: this is the board's-side rule, and v3 flipped her in the boardroom (diagnosis §2). If `drawBoard2S` can't be re-blocked to match, keep the singles right anyway and let S4.02's held wide carry the geography. That needs a check in motion.

### S4 · THE WEEKEND, THE BOARDROOM: STEP FOUR · v3 A 1:14.9–1:57.1 · 23 shots → 15 · ≈ 49 s

| # | From v3 | Shot · size · angle · move | What it does | ~s | Change |
|---|---|---|---|---|---|
| S4.01 | 27.12, 27.12b | [SCR] the boardroom's wall screen, bezel in frame: the board's call | Rail `NOV 18`. A heart appears in the corner of Neleh's tile, then ten, then hundreds, burying the grid. His post scrolls across and holds to read: `"…sorta like reading your own eulogy while you're still alive"`. The one blue heart lands last on Mada's spinner, in this frame (an egg for whoever spots it). | 4.75 | the macro is cut; lengthened (4.25): the hearts build (about 1.2 s), then the post's 3.35 s floor |
| S4.02 | 27.13 (with 27.20's wide as its drawing) | [W] the boardroom at night, **held**; a **cut** from the screen, not a pull-back (a pull-back would be a scale) | The same buried call on the wall screen, now small in the room. Four phones buzz and step toward the table's edge, caller IDs lit: `STAFF`, `STAFF`, `INVESTORS`, `STAFF`. The blueprint lies on the table (1–3 ✓, 4 blank). The laptop on a chair shows the black tile. The CEO chair at the table's head, the one Rima sat in, is empty. NELEH stands with a marker, MADA sits, and ALYI is a reflection in the window. | 3.0 | lengthened (0.62): the establishing shot |
| S4.03 | 27.13b | [MCU] NELEH, right third | "The bylaws allow it. Footnote three." The phones ringing under it are what "it" answers. | 2.75 | — |
| S4.04 | 27.14 | [OTS] over Neleh onto the dark window: Alyi's reflection | "Step four will reveal itself." / NELEH (overlapping) "When?" A buzz; one phone's corner hangs over the edge. | 3.0 | — |
| S4.05 | 27.15 | [HIGH] the table | The phones walk, and the first tips off: *clack*. Nobody picks it up. | 1.5 | — |
| S4.06 | 27.16, 27.17 | [2S] NELEH looking down, MADA, and ALYI's reflection between them | "The company is calling us." / (0.4–0.6 s) ALYI "That is the company telling us." The reflection flickers for two frames. | 4.75 | 2 → 1; lengthened (4.25): the two lines and their gap fill 4.25 s before the flicker |
| S4.07 | 27.18 | [MCU·PF] NELEH at the blank line, the room stepping down | Her one real moment of doubt. The speakerphone's first dial tone pre-laps under its last frames. | 1.5 | lengthened (0.62) |
| S4.08 | 27.20, 27.21, 27.22a, 27.22b, 27.23 | [SPLIT] **Act One's meanwhile split** (two 240 × 203 panes), **both calls in one shot**. LEFT: the boardroom speakerphone, Neleh and Mada leaning in. RIGHT: the lighthouse, Mario at a desk buried in paper, the two meters behind him through the window. | The four dial tones on the left, and the ring carries across. A small throne sits on Mario's handset. The plate `MARIO · THE RIVAL LAB (EX-NOPEAI)` lands over the ring and clears (1.9 s). "I've written up some thoughts—" / ADELINA takes the phone (overlapping) "In plain English: no." *Click.* The throne falls off, and the left pane hears a dial tone. On the click the rail types, `(REPORTED) · THE BOARD OFFERED MARIO THE JOB` (2.45 s), while the second phone rings on the right. Mario grabs it: "Hi. Yes. We're very worried. How much?" Behind him the meters are **already full**: `NOZAMA · UP TO $4B` · `ELGOOG · UP TO $2B`, no dates and no RENT tags. The board listens to a dial tone while Mario takes the money call. | 8.5 | 5 shots in 2 places → 1 (the draft's separate Mario MCU, 27.23, is folded in: the lighthouse now appears only inside the split) |
| S4.09 | 27.24 | [SCR] the lobby camera, on the boardroom's screen | Rail `NOV 19`. The CCTV chrome reads `NOPEAI HQ · LOBBY`. A familiar figure walks in wearing `GUEST`, lettering legible (the figure nearer the camera, or a 2× crop). His post, the right way up: `"first and last time i ever wear one of these"`. | 3.75 | — |
| S4.10 | 27.25 | [W] the boardroom | The spotlight swings off the empty CEO chair (Rima's, from S3.04) onto TTEMME: hoodie, headset, hourglass, and a **blank** sticky note for a nameplate. Plate `TTEMME · INTERIM CEO #2`. | 2.25 | plate changed; the sticky note's `CEO (TEMP)` is cut (the plate says it) |
| S4.11 | 27.26, 27.27 | [LOW·desk] the hourglass big in the foreground | He flips it (three held drawings) and the sand starts. His chat spams `F` up the frame's edge. "Chat… for how long?" | 2.5 | 2 → 1 (fallback: keep 27.26's overhead flip as a 1.25 s insert) |
| S4.12 | 27.28 | [2S] NELEH and MADA | Rail `NOV 19 · 11:53 PM PT` types at once and clears inside the shot (1.25 s + about a second). The wall steps to slate, and a door appears in it and opens. | 2.5 | — |
| S4.13 | 27.29 | [MCU·door] TASYA in the new doorway, slate light behind him, key ring jangling | The plate `TASYA · THE LANDLORD · MACROSOFT` lands first and clears (1.85 s). Then he holds up the script's small sign, arrow pointing out, lettered `MAS · GERG →` (a cartoon prop, no quotation marks), and reads his post with pleasure: "a new advanced AI research team". | 4.5 | lengthened (2.5): the plate, then the sign and the 2.04 s line, in order. The act's one MUST. |
| S4.14 | 27.19, 27.30 | [HIGH] the blueprint: 1–3 ✓, 4 blank | (0.6–0.9 s) NELEH (O.S.) "Step four?", and her marker writes `?` on step 4 as she asks it | 1.75 | 2 → 1: 27.19's separate `?` insert is folded in (it repeated this overhead 23 s earlier) |
| S4.15 | 27.31 | [MCU] MADA, spinner turning | He doesn't answer. The pizzicato slows and hangs on one held note. Pass one ends on his face. | 2.0 | lengthened (1.25) |

- **Built from.**
  - The wall screen in S4.01 and S4.09 is a bezel rectangle on the boardroom plate. The hearts pile (`planPile`/`drawPile`) and `drawLobbyCam`/`drawLobbyCamWide` (which already has a `label` option) are drawn into it; at full frame they are 27.12's and 27.24's layouts. S4.02 is a separate drawing of the room with the screen small in it, reached by a cut.
  - The caller IDs are `pt()` on 27.15's phone shapes.
  - S4.08 composes two 240 × 203 crops: the boardroom plate on the left, and `lighthouseRoom` with the Mario and Adelina sprites, `throneImg`, the second phone and the meters on the right. That's Act One sc 11's pane geometry. The meters must fit the right pane's window: `NOZAMA · UP TO $4B` and `ELGOOG · UP TO $2B` in `pt()` are about 70 px each. If they can't be legible there, they're texture (the joke is the second call, not the numbers).
  - S4.11 is 27.27 with the flip drawings from `kits/props` `hourglass`. If those drawings don't exist at the large size, use the fallback.
  - S4.13's sign is a flat card in Tasya's hands, lettered with `pt()`.
  - The post in S4.09 is no longer flipped.
- **Read order in S4.08** (the act's busiest text shot): the plate over the ring, the two lines, the click, the rail over the second ring, Mario's answer as the rail finishes. The rail and his line overlap by about a second; that is the one place in the act where a rail is read under a voice, and it needs a check in motion (§8, check 6). If it overloads, let the second phone ring twice before he grabs it (+0.75 s): it costs a little of "at once".
- **The "boxes for people talking" note.** The board's side is the world's view, so its screens keep their bezels. But every exchange in the room plays on people: close-ups, an over-the-shoulder, a two-shot. The split is a device the audience learned in Act One, not a talking box.

### S5 · HIS SIDE, 2 AM: WHAT THEY DIDN'T KNOW · v3 A 1:57.1–2:41.8 · 19 shots → 12 · ≈ 44.5 s

| # | From v3 | Shot · size · angle · move | What it does | ~s | Change |
|---|---|---|---|---|---|
| S5.01 | 28.01 | [GFX] black, with cream type: `WHAT THEY DIDN'T KNOW` | The chapter door | 2.0 | (2.5) |
| S5.02 | 29.01 | [ECU] the dark desk from above: the glass, its water line flat, and the `GUEST` lanyard laid square beside it | Rail `NOV 20, 2023 · ~2:06 AM PT`, and the badge reads HIS SIDE. The home shot, and the badge is in it. | 2.5 | lengthened (1.88); the lanyard joins the home shot |
| S5.03 | 29.02 | [ECU] his phone and thumb | **RIMA TAMURI's post first, name and avatar legible:** `"NopeAI is nothing without its people"`. He hearts it on the downbeat. The same words come again from another avatar, then two, four, a flood, and he hearts every one on the beat. This answers where Rima went. | 4.0 | (5.0); the stack becomes a flood |
| S5.04 | 29.03, 29.04 | [2S] Mas and the Orb, with the lanyard in frame on the desk | The iris steps off the phone onto the lanyard. MAS (V.O.) "the badge was a joke." | 3.0 | 2 → 1; the ECU·Orb is cut |
| S5.05 | 29.05 | [MCU] MAS, left third, turned toward the Orb | (0.7–1.0 s) "mostly." Rack to the Orb, which doesn't look away. | 2.25 | — |
| S5.06 | 29.06, 29.07, 29.08, 29.09 | [POV] his monitor: **the staff letter as one page**, with a whole-pixel scroll | The header types: `STAFF LETTER · TO THE BOARD` (1.6 s). Then the insult line, `"…unable to work for or with people that lack competence, judgment and care…"` (4.1 s), **with the counter rolling under it** in the page's corner, `SIGNED` 505 · 650 · 700 · 745 / 770, stopping with the launch-night *clunk* as the line finishes. Then the demand, `"…unless all current board members resign…"` (2.4 s). The page scrolls down the signatures and stops on `ALYI (REPORTED)`, highlighted, beside his call thumbnail in the monitor's corner, whose vote icon is still flipped from noon. **On the stop, the Orb's chime and servo, off picture**: the Orb is still the one who notices, without a cut back to it. | 10.25 | 4 shots in 3 registers → 1; lengthened (9.0): read in order, the page needs about 10 s |
| S5.07 | 29.10 | [2S] DELIVERY | The rack's slot ejects a giant check across the desk | 2.0 | (3.12) |
| S5.08 | new (29.10's check) | [ECU·insert] the check | `PAY TO: NOPEAI STAFF` · `~$86B VALUATION` · `EVIRHT` · memo `TENDER OFFER`, with `VOID IF CEO MISSING` stamped beside the figure, not over it. Why the staff care, in the check's own words. **Must read:** `PAY TO: NOPEAI STAFF` and `VOID IF CEO MISSING` (a 2.25 s floor); the payer, figure and memo are the insider's layer and can be half-read. | 3.0 | new insert |
| S5.09 | 29.11a, 29.11b, 29.12, 29.14 | [OTS] **over Mas's shoulder onto the monitor**, Gerg's tile large | GERG "One sec. Compiling—" / MAS (overlapping) "what are you building?" / (0.3–0.4 s) GERG "The company. Again. Just in case." Then he glances up into his camera, at Mas, and holds. **The Build and his keys stop together on the glance** (stop 2): room tone only. He starts typing again, and the keys' return motivates the cut. | 6.5 | 4 shots → 1; the quiet beat becomes one held look |
| S5.10 | 29.13, 29.15 | [MCU·PF] MAS | He looks back. The room has fallen away to the monitor's green and his cyan, and on the monitor Gerg is typing again, the keys back under the pedal. | 1.75 | 2 flashes → 1 |
| S5.11 | 29.16 | [2S] the dark room's back wall | MAS (V.O.) "gerg never waits to be asked." On "asked", the slate door steps up out of the shadow in three held steps, a key already in its lock. A beat later, TASYA (O.S.) "Everyone is welcome." | 4.75 | — |
| S5.12 | 29.17 | [MCU] MAS, not turning, the slate door soft behind him | (overlapping) "leave it open." Rack to the door. | 2.5 | — |

- **Built from.**
  - S5.02 is `drawDarkDesk` with `lanyard: true` (the lanyard card "reads in inserts", per the room's own comment).
  - S5.03 is 29.02's timeline, with `postCard(… who: 'RIMA TAMURI' …)` for the first post.
  - S5.06 composes 29.05's odometer (`odoRoll`, small, in the page's top-right corner so it can roll under the quote), 29.08's signature list and the quotes in `pt()` on one tall page, scrolled with `shiftRoom`; the thumbnail is `drawAlyiTile` at mini size. Lay the page out so the scroll to ALYI is at most about 48 px (§7's budget).
  - S5.08 is a 2× crop of 29.10's two-shot around the check, with the lettering at 1× on top: the blueprint details' method.
  - S5.09 lays `shoulder(masPortrait)` over Gerg's full POV tile, the way 26.09 lays it over the laptop insert.
- **The Gerg look.** v3 made it three 0.62 s flashes. Now it's a held glance in the over-the-shoulder and one look back. The stop lands on the glance, and the keys stop with it: the script's "only keys" is struck, because the keys coming back are what cut us to Mas.

### S6 · THE AVALANCHE · v3 A 2:41.8–3:01.8 · 13 shots → 6 · ≈ 15.5 s

| # | From v3 | Shot · size · angle · move | What it does | ~s | Change |
|---|---|---|---|---|---|
| S6.01 | 29.18, 29.19, 29.22, 29.25, 29.26 | [POV] his monitor full-bleed, **locked** | The board's grid, the one we watched from their side. One employee tile appears at the top edge, then ten, then hundreds, stacking on **one continuous clock**, with no jump cuts. The letter's `745 / 770` sits static in the corner. | 4.5 | 5 → 1 |
| S6.02 | 29.21, 29.28 | [MCU·PF] MAS, left, watching | Each landing steps the room's light, never his face | 1.5 | 2 → 1 |
| S6.03 | 29.23 | [POV·half] ALYI's tile | Shoved sideways; it resists one beat, then slides off | 1.9 | — |
| S6.04 | 29.24 | [POV·half] NELEH's tile | Footnotes scattering. "Has anyone read the char—" Gone. | 1.9 | — |
| S6.05 | (inside 29.25) | [POV] the grid | THE QUIET VOTE's black tile is pushed out without a sound | 1.25 | given its own beat |
| S6.06 | 29.29, 29.30 | [POV·half] MADA, wedged in the last gap | Every tile presses, and he doesn't move. A beat's hold, then on the downbeat his label flips: `MADA · LAST FIRER STANDING · ANSWERS GIVEN: 0`. The band stops dead (stop 3), and the label holds. | 4.5 | 2 → 1 |
| — | 29.20, 29.27 | *cut* | The reversed-axis over-the-shoulder and the glass cutaway both stopped the build (insider read). The glass keeps its two bookends: S1.02 and S8.05. | — | cut |

- **Built from.** S6.01 is `planGridStack`/`drawGridStack` sampled on one clock. v3 re-sampled the stack per shot, which made the jump cuts. The rest are v3's own layouts.
- **Why this runs longer than the insider's 10–11 s** (it plans 15.5 s). Each board member's exit is a beat the story needs, and v3's 20 s is the ceiling it comes down from. Under one continuous cue it plays as a montage, and the flow guide allows 1–2.5 s beats in a montage. S6.02–S6.05 are the act's only run of shots under 2 s, and it's the montage.

### S7 · THE RETURN: MONDAY AT HQ, TUESDAY IN THE BOARDROOM · v3 A 3:01.8–3:41.3 · 17 shots → 13 · ≈ 43.5 s

| # | From v3 | Shot · size · angle · move | What it does | ~s | Change |
|---|---|---|---|---|---|
| S7.01 | 30.01 | [P2 BOX] **the act's one deliberate box**: MAS in his window at his end desk, **the GUEST lanyard lying on the desk in front of him, not worn**; ALYI in the gap of the conference-room door | Rail `NOV 20 · NOPEAI HQ`, replacing the stale 2:06 AM rail. ALYI (post) "I deeply regret my participation in the board's actions." Three hearts rise from Mas's window, cross the gap and hang at Alyi's edge. The violin's last note is held and left to decay under the hearts and the one-beat hold. The `IOU: 20% COMPUTE` note flutters. | 6.0 | (6.25); the rail places him in the building; the lanyard on the desk says he's still a visitor without contradicting his "first and last time" post |
| S7.02 | 30.03 | [W] the bullpen, one still wide | Coats on, and a packed box on every desk. MAS small at his end desk (left). TASYA in the middle of the floor: "We are below them, above them, around them." The floor, ceiling and walls step to slate on the three words, and Tasya's Rhodes enters on "below". | 5.75 | (6.25) |
| S7.03 | 30.06 | [MCU·PF] MAS, eyes down | "hi." | 1.25 | lengthened (0.92) |
| S7.04 | 30.06b | [HIGH] his eyeline: the slate floor from above | His shoe tips at the top edge, with a box corner and a coat hem at the frame's edges, so it reads as a floor. TASYA (O.S., from the floor; overlapping) "Hello." | 1.75 | lengthened (1.04); it now reads as a floor |
| S7.05 | 30.07 | [M] MADA among small fires, perfectly still | Rail `NOV 21, 2023 · ~10 PM PT` (the script's wording). The fires' crackle pre-laps under the rail, and c1 fades in under the shot. | 2.0 | — |
| S7.06 | 30.08, 30.09, 30.11a, 30.11b | [W] **the boardroom, one held wide** | The door bangs open (inside c1): TERB, the extinguisher, the helmet popping on. CARD (FULL FREEZE) on the wide: `TERB / CHAIRS BOARDS ON FIRE` · `EXTINGUISHERS: 1` (2.6 s). Mas walks through the freeze in colour and pulls the pin, in frame. The room unfreezes. TERB "Which room is on fire?" Everyone looks around. (0.8–1.0 s) "…Ah." | 7.0 | 4 shots → 1: the entrance, the card, the pull and the look-around all need the same wide, and it holds while they change inside it |
| — | 30.10 | *cut* | The pin insert: texture, and the pull reads in the wide. `DO NOT REMOVE` goes with it. | — | cut |
| S7.07 | 30.12, 30.13 | [2S] **THE CALM-OFF**: MAS left, MADA right, Terb spraying behind them (the extinguisher works: the pin is out) | TERB (O.S.) "Terms?" The cue drops out (stop 4). (0.4–0.6 s) MADA "Good question.", in the same frame. | 2.75 | 2 → 1: Mada is already in the two-shot, and the stillness of two men is the point |
| S7.08 | 30.14 | [MCU] MAS | One beat late: "good question." | 1.75 | — |
| S7.09 | 30.15 | [2S] the same two-shot as S7.07 | HOLD 2 beats while the chaos runs. Mada's spinner stops, and he nods once. Terb's hand stamps a term sheet and hands it to both. c2's low C pedal enters under the stamp. | 3.25 | lengthened (2.42); it returns to S7.07's setup |
| S7.10 | new | [ECU·insert] the term sheet | `TERMS` · `1. CEO: MAS MANALT`, with the rest folded under, THE PLAN's fold again | 2.0 | new insert |
| S7.11 | 30.16 | [POV] his phone lit green, keycaps popping | GERG (post) `"Returning to NopeAI & getting back to coding tonight."` The Build restarts on the keycaps. | 3.25 | lengthened (3.0): the post's floor is 3.0 s, after the keycaps land |
| S7.12 | 30.17 | [MCU·PF] MAS, reading | His face doesn't change | 1.25 | lengthened (0.62) |
| S7.13 | 30.18 | [HIGH] the boardroom table | The last grain runs out of the hourglass. TTEMME (post) `"I am deeply pleased by this result, after ~72 very intense hours of work."` On the post's last beat the glass shatters, and the sand holds the hourglass's shape for a beat (the Build's one rest), then falls. | 5.5 | (5.0): the grain, the 75-character post (a 4.0 s floor), the shatter, the sand's beat and the fall |

- **Built from.**
  - The lanyard on the desk in S7.01 is the lanyard sprite from `drawDarkDesk`'s `lanyard: true`, at desk scale.
  - S7.04 is 30.06b plus the bullpen's own box and coat colours at the frame's edges.
  - S7.06 is 30.08's wide held for the whole shot: 30.09's freeze card over it, Mas's walk-through and pull drawn in it, then 30.11's unfreeze and look-around. Terb's line plays on the wide (no MCU).
  - S7.07 and S7.09 are one setup (30.12's calm-off), so the return from Mas's MCU is to the same frame.
  - S7.10 is a flat paper card lettered in `pt()`, with the blueprint kit's `fold` drawn in paper colours.
  - S7.13's table must read as a table: draw the hourglass overhead at insert scale (diagnosis §3 #35).
- **The Terb block** is 10 shots in v3's plan and 6 here (S7.05–S7.10). The busiest ten seconds of the whole act were in S7 (six cuts at the old 204–223 s); now no ten-second window in S7 holds more than five cuts, and none of those shots is under 1.75 s.
- **Staging question for the writers (§4.3).** v3 left Mas unplaced in the bullpen ("where is he? did he take the offer?"). The rail answers where; the lanyard on the desk, not worn, answers as what. He's at HQ, still a visitor, with the staff packed to follow him out, so the suspense holds. The badge as a through-line, told once per step:
  - `GUEST` worn on the lobby camera, and his post: "first and last time" (Sun)
  - the lanyard on his desk: "the badge was a joke." / "mostly." (2 AM Mon)
  - the lanyard on his desk at HQ, not worn (Mon)
  - no lanyard in the lobby (Tue)

### S8 · THE LOBBY, AND AFTER · v3 A 3:41.3–4:08.9 · 10 shots → 10 · ≈ 29.5 s

| # | From v3 | Shot · size · angle · move | What it does | ~s | Change |
|---|---|---|---|---|---|
| S8.01 | 30.19 | [LOW] the lobby at night | The sign lights up: `DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0`. MAS stands at the reception desk, no lanyard, glass in hand. | 2.75 | — |
| S8.02 | 30.20 | [ECU] | A maintenance hand (drawn) sets a small box of spare `0` plates under the sign | 1.5 | the stand-in is drawn |
| S8.03 | 30.21 | [OTS-W] over Mas's shoulder onto the lobby | The dialog pops up: `OK` · `Cancel`. Cancel greys out a dither step a beat. The noon arrow's design steps in, **its name tag empty** (someone, as the sign says; never `ALYI`), and clicks it: *bonk*, and **the dialog shakes, refused**. Somebody tries again, and it fails. | 3.0 | + the shake; the tag is emptied |
| S8.04 | 30.22 | [CU] MAS, the lobby's tungsten behind him | Silent, like the first | 1.75 | lengthened (1.25) |
| S8.05 | 30.23 | [ECU] his hand sets the glass down on **the reception desk's own top** (pale stone with a brass edge, under the lobby's tungsten, unlike the suite's dark wood), and nudges it one pixel true | "okay." | 2.5 | the surface places it in the lobby, not the suite; the tray of GUEST lanyards is the fallback if a watch still asks "are we back in Vegas?" |
| S8.06 | 31.01 | [ECU] the vault, stencilled `Q*`, humming on F | Rail `NOV 22, 2023 · REPORTED: STAFF WARNED THE BOARD ABOUT "Q*"`, carried into S8.07 | 3.5 | (4.38): the static seconds are cut |
| S8.07 | 31.02 | [MCU-2] MAS left, already past it; the Orb looking at it; GERG right; the sticky note `DO NOT OPEN. DO NOT EXPLAIN.` | "What's in there?" / (0.25–0.4 s) "it's a preview." Rack to the vault; Gerg reads the note and walks out. | 3.75 | — |
| S8.08 | 31.03 | [MCU] MAS at his desk | Rail `NOV 29, 2023`. He reads his memo aloud: "i love and respect alyi… i harbor zero ill will towards him." | 5.25 | — |
| S8.09 | 31.04 | [ECU] **the boardroom chair back, scorched by sc 30's fire** | A screwdriver (drawn hand) takes off the `ALYI` nameplate: four screws, four beats | 2.5 | the scorch places it in the boardroom |
| S8.10 | 31.05 | [W] the bullpen's window corner | A Macrosoft-blue folding chair unfolds: `MACROSOFT · OBSERVER (NON-VOTING)`. Tasya's key ring drops onto the seat: *jangle*. | 3.0 | lengthened (2.5): the chair's owner, in the picture |

- **Built from.**
  - The shake in S8.03 is `shakeAt` (as `doorShake`). The arrow is `drawPointer` with the collaborator-tag box drawn and left empty (fallback: no box at all). If the facts fallback `THE BOARD` replaces `ALYI` at noon, the lobby tag stays empty just the same.
  - The reception desk's top in S8.05 is the lobby plate's desk material at insert scale, lit by the tungsten of S8.04. Fallback: the lanyard sprite repeated as a tray on it.
  - The drawn hands and the chair replace the red-labelled stand-ins. Even crude drawings beat labels: the cold viewer read the labels as noise.

---

## 4. Script changes

The script's `## ACT FOUR` is now **draft 4.0 (the flow pass)**, written from this plan; it is the text of record, and draft 3.2 stays in the repository history. These changes are **for coherence and flow only**, and each rides on picture or text rather than new dialogue.

- **No new voiced line is added,** and every real `[V]` voiced line keeps its words and its take.
- **One voiced line is trimmed**, by editing its existing take.
- **Record text on screen** keeps exact words, with ellipses where it is trimmed (guardrails §4).

### 4.1 Voiced lines

| # | Where | Draft 3.2 | v4 | Take |
|---|---|---|---|---|
| V1 | sc 25, NELEH (`a4-25-10`) | "Nine seats. Three left this year. Four of us vote." | "Three left this year. Four of us vote." | **An edit of the existing take** at the breath after "seats." Needs an ear check on the cut; re-take only if the edit isn't clean. |
| V2 | sc 27, NELEH (`a4-27-23`) | "Share what?" on the call's two-up | The same take, heard O.S. through the call over Rima's MCU | None (it's already call-filtered) |
| V3 | sc 27, MARIO (`a4-27-16`) | "Hi. Yes. We're very worried. How much?" on his own MCU | The same take, inside the split's right pane, panned a touch right with the lighthouse room | None (placement and mix only) |
| V4 | sc 27, NELEH (`a4-27-21`) | "Step four?" (O.S.) over the blueprint | The same take, now under her marker writing the `?` | None |
| V5 | sc 30, MADA (`a4-30-08`) | "Good question." on an over-the-shoulder | The same take, in the calm-off two-shot | None |

Every other line plays as recorded. The gaps between lines change (§5.6). **Only V1 touches a take**, and only as an edit. Two unvoiced posts change their on-screen text (T9, T10): `lines.json` and the pop-up holds need updating, not a recording.

### 4.2 On-screen text, props, plates and rails

| # | Where | Draft 3.2 | v4 | Why | Facts |
|---|---|---|---|---|---|
| T1 | sc 25 stamp | `WHO OWNS A CEO WHO OWNS NOTHING?` | `WHO OWNS A CEO?` | Keeps the act's question without spoiling "Good question." (§1.1). Fallback: the original, held 2.5 s. | — |
| T2 | sc 25 arrow | `CONTROLS` | *(no label)*; the company box label stays and must read | The line says it | — |
| T3 | sc 25 chairs | `MAS`, `GERG` | two-line nameplates `MAS` / `CEO` and `GERG` / `CO-FOUNDER` (one line doesn't fit the 48 px pitch); the four ringed chairs take the invite icons | Introduce people by what they are to Mas; ties the path's walkers to the four | `CHAIR` is the alternative second line for Gerg if facts prefer it |
| T4 | sc 26 pointer | the unlit arrow, nobody's | the arrow tagged `ALYI`, starting from his pinned tile, **at noon only** (the lobby's arrow is T30) | Whose hand; "someone did this to him" | Check against facts #46/#47 and Gerg's own Nov 17 account (Alyi told him on the call). Fallback: tag it `THE BOARD`. |
| T5 | F1.2 rail | `2005–08 · TPOOL · (REPORTED)` | `2005–08 · TPOOL, HIS FIRST COMPANY · (REPORTED)` | What TPOOL is to him | "His first company": confirm |
| T6 | 26A rail | none | `NOV 17 · NIGHT` | The newcomer read took the dark room for 2005 | — (S3.09's night needs no rail: T28) |
| T7 | the rewind rail | `NOV 17 · EARLIER · THE BOARD'S SIDE` | `NOV 17 · ~NOON PT`; the badge flips on the whip's frame | "Earlier than what?" The side was announced three times. | — |
| T8 | step 2 | a full-screen quote card | the blog post on Neleh's laptop, same words | One register | [V] unchanged |
| T9 | Gerg | toast `GERG MOCKBRAN has left.` + post `"…I quit."` | one item: `GERG MOCKBRAN · "…based on today's news, i quit."` as the call's notification | Says *why* in the record's own words, told once. Fallback: `"…I quit."` alone, no toast. | **Re-fetch the casing** (the script already names this reading) |
| T10 | the 9:32 post | the full post, then a new `EQUITY: 0` stamp | `"…the nopeai board should go after me for the full value of my shares"`; her pen taps the existing stamp | Read time; the punchline isn't explained twice | An exact-words trim |
| T11 | boardroom phones | four flat shapes | ringing screens with caller IDs `STAFF` · `STAFF` · `INVESTORS` · `STAFF` | "The company is calling" becomes visible, and "it" gets a referent | Invented props |
| T12 | step 4 | a tumbleweed | *(cut)* | It read as a grey blob; the `?` carries it | — |
| T13 | Mario | a cross-cut, and the rail before the scene | the split, both calls in it; plate `MARIO · THE RIVAL LAB (EX-NOPEAI)`; the rail after the click, as `(REPORTED) · THE BOARD OFFERED MARIO THE JOB`; meters `NOZAMA · UP TO $4B` · `ELGOOG · UP TO $2B`, already full | Who he is; the "no" gets a second of mystery; "already full" says the money is old news without dates; the shorter rail fits the read (2.45 s against 3.15 s) | The merger stays in the record and the script's tags; the rail just doesn't carry it. Meter tags stay [V · SEP 25] and [V · OCT 27] in the script |
| T14 | the lobby camera | the post upside-down | the post the right way up; chrome `NOPEAI HQ · LOBBY`; `GUEST` legible | Both reads lost this beat | — |
| T15 | Ttemme's plate | `TTEMME · CEO (72 HOURS)` | `TTEMME · INTERIM CEO #2` | Saves the 72 for the post; tells a newcomer he's the second | — |
| T16 | Tasya | no plate; a blank sign | plate `TASYA · THE LANDLORD · MACROSOFT`, which lands first and clears; then the sign `MAS · GERG →` | The newcomer read's MUST. "Colleagues" is left to pass two's "Everyone is welcome.", so the board sees a door for two men and Mas hears it's for everyone. The sign is invented and styled as a cartoon prop, never in quotation marks, because a real post is read aloud beside it. | The sign paraphrases no quote. The `11:53 PM PT` rail must clear before the sign appears |
| T17 | after card 28 | `NOV 20, 2023 · ~2:06 AM PT · HIS SIDE` | `NOV 20, 2023 · ~2:06 AM PT` | The badge carries the side | — |
| T18 | Rima's post | generic avatars | the first post's name and avatar legible as `RIMA TAMURI` | Answers "what happened to Rima?" | [V] unchanged |
| T19 | the letter | counter `THE LETTER` → full-screen card → a list | one page: `STAFF LETTER · TO THE BOARD`; `SIGNED 505 · 650 · 700 · 745 / 770`, rolling under the next line; `"…unable to work for or with people that lack competence, judgment and care…"`; **new record fragment** `"…unless all current board members resign…"`; `ALYI (REPORTED)` highlighted | The demand is the mechanism, and it sets up the avalanche's image | **Re-fetch and log the new fragment** [V · NOV 20, 2023]; the first line is an exact-words trim. **Spelling:** `facts.md` has "judgment"; some published copies print "judgement". Confirm against the letter itself before lock, since the page shows it at reading size (not checked in this pass: no source could be fetched) |
| T20 | the check | `EVIRHT · TENDER OFFER @ ~$86B VALUATION` / `VOID IF CEO MISSING` over the figure | `PAY TO: NOPEAI STAFF` · `~$86B VALUATION` · `EVIRHT` · memo `TENDER OFFER` · the stamp beside the figure | "Tender offer" is jargon; insiders want the figure | [V/K]: re-verify before lock, as the script already asks |
| T21 | the avalanche | a counter from 0/770 | the letter's `745 / 770`, static | v3's restart read as a timeline error | — |
| T22 | the return's rail | `~2:06 AM` still showing | `NOV 20 · NOPEAI HQ`; the `GUEST` lanyard lies on his desk in 30.01, **not worn** | Where he is, and as what, without contradicting his real "first and last time i ever wear one of these" (S4.09) | Staging (§4.3) |
| T23 | the term sheet | unreadable | `TERMS` · `1. CEO: MAS MANALT`, the rest folded under | He's CEO again; the rest stays withheld | [V]: return as CEO agreed Nov 21 |
| T24 | the lobby | Cancel greys, bonk | + the dialog shakes, refused; the glass goes down on the reception desk's own stone top (fallback: a tray of `GUEST` lanyards) | "Another attempt?" "Are we back in Vegas?" | — |
| T25 | the Q\* rail | `NOV 22, 2023 · REPORTED: STAFF WROTE TO THE BOARD ABOUT A BREAKTHROUGH CALLED "Q*"` | `NOV 22, 2023 · REPORTED: STAFF WARNED THE BOARD ABOUT "Q*"` | Linked to the board, still unexplained, under `DO NOT EXPLAIN` | Consistent with the report that staff wrote to the board warning of a discovery; facts to confirm the verb |
| T26 | the chair | `OBSERVER (NON-VOTING)` | `MACROSOFT · OBSERVER (NON-VOTING)`; the nameplate's chair back scorched | The payoff of `VOTES: 0`, in the picture | [V] |
| T27 | throughout | typed boxes for EMPLOYEE, ADELINA, NELEH (O.S.), TASYA (O.S.), TERB (O.S.) | only the call's live caption (Alyi's `…`, the laptop "super."); plates on first appearances | Inconsistent in both reads | Not the show. The v4 cold test is picture-only (§8, check 13): no speaker-name band and no side panel |
| T28 | S3.09 | a `NOV 17 · NIGHT`-style rail over her desk | *(no rail)* | The lamp and the post's `9:32 PM PT` already say night; a rail would be the third telling | — |
| T29 | Ttemme's nameplate | a sticky note, `CEO (TEMP)` | a blank sticky note | The plate `INTERIM CEO #2` says it in the same 2.25 s shot | — |
| T30 | the lobby arrow | "the same arrow" (with T4, it would read `ALYI`) | the noon arrow's design, **its tag box empty** | A newcomer would read an `ALYI` arrow as "Alyi tries again", and an invented act by a real person's parody at a real event breaks the guardrails ("never invent intent at a real event"). Empty, it's "someone", like the sign | Guardrails §4 (cartoon dialogue row) |
| T31 | Rima's spotlight | a spotlight in a void | the spotlight on the boardroom's CEO chair, its high back behind her | Places her; previews the boardroom; S4.10's swing off her empty chair then reads as a replacement | — |

### 4.3 Calls for other owners (flagged, not decided here)

- **Writers / POV owner:**
  - moving F1.2 into the Orb's count (S2; fallback given)
  - the GUEST lanyard on his desk, not worn, in the Monday bullpen (S7.01)
  - the term sheet's fold (S7.10)
  - Rima's spotlight on the boardroom's CEO chair (S3.04)
  - the violin's held, decaying note under the three hearts in place of 3.2's dead stop (S7.01; fallback in §5.1)
- **Writers:** D8, "gerg never waits to be asked.", is **kept**. The insider read flags it as the act's clearest piece of explaining. It is the Ep12 plant, and its "asked" cues the door, so cutting it (−2.5 s) needs another carrier for the plant.
- **Writers + facts:** the insider suggests burying Neleh on "destroying the company would be consistent with the mission" instead of "Has anyone read the char—". **Not adopted.** It is a reported line (it would need a `(REPORTED)` tag inside a burial gag), and the charter runner's third beat already lands. It is offered, not taken.
- **Naming registry** (`show/bible/naming.md`): the insider notes that "Mario" breaks the reversal and anagram pattern. That isn't this pass's call.
- **Sound departures from script calls** (R16 under D8, the memo's hum): see the sound supervisor's §9.9, adopted in §5.

---

## 5. Sound plan

The sound supervisor's draft ([sound-diagnosis-v3 §9](history/sound-diagnosis-v3.md)) is **adopted**, refined to v4's sequences and edits. The shape is one continuous piece of music and one continuous room per sequence. The music thins and ducks under words, posts and cards instead of stopping. There are four real stops, each on a story beat with the room still audible under it (except D6), and a few short designed rests inside cues (§5.2).

**Measure the file that gets muxed.** v3's mp4 carried a different mix from the WAV on disk (sound diagnosis §1). mix_v4 writes the EDL and the WAV in the same run, and the mp4 is muxed from that WAV.

### 5.1 By sequence

| v4 seq | Cue: one performance, in order | Room bed(s) | Stops and rests | Thins under (melody, chip, brass and hits out; a pedal holds, ducked) |
|---|---|---|---|---|
| **S1** | **MM-07**: the felt bar → **WORD** (its hit on the shorter stamp) → the waltz, one take under the single move (the musical-chairs rest lands as the three walk off) → the held chord under "Good question." → PLAN → BREAK, with the **tape-stop reaching zero on the JOIN click** (the alternate from `render/alt/`, aligned so its 48.75 s falls on the click; v3 aligned 50.0 s and stopped 1.25 s early). **Then MM-08 LEVERAGE**, first eighth on the click or the next beat, **one take from the connect to Cancel** → b8.1, the hard stop. | The suite (HVAC, the Strip far below, the truck), about −38 dBFS; about −40 under THE PLAN (the blueprint is the laptop's glow; −44 would sit under the hole threshold wherever the waltz thins) | **Stop 1: D6**, digital silence on every bus for about 5 beats. The phone's buzz brings the suite back, audibly. "super." sits in suite air, with no score. | NELEH's read, ducked −10 to −12 dB (v3's −3 dB left her 7.4 dB over the waltz) |
| **S2** | **MM-08 26A**: the felt's open fifth on the first stroke, which is the music's re-entry after D6, as a new phrase. One sustained note under "i don't keep score." **Under the TPOOL insert, the felt thins to its pedal** (the drone F1 + C2 and the low fifth), so `(REPORTED)` material carries no Mas motif. The felt resumes on mark 3, and the Rewind (the felt retrograded through the chip) lands on S3's downbeat. | The dark room (drone, air, the rack's fans), −38 to −40; pre-lapped 1 s under S1.12's fallaway. **TPOOL:** a frosted office (HVAC, voices muffled behind glass) in the EARLY-WEB16 colour, −40, crossfaded in and out on the render fronts (0.5 s). The dark room's tail rings 0.5 s under the whip. | — | the V.O. (one note); the TPOOL insert (pedal only) |
| **S3 + S4** | **MM-09 a → h → 09x as one performance.** Its sections change on the rails and rooms: a NOON (S3.01–S3.08) · a's night bars (S3.09) · b NOV 18 (S4.01) · c the boardroom at night (S4.02–S4.07, with its "out before the four dial tones" rest now falling on the split's opening) · d LIGHTHOUSE (S4.08, Mario's quartet, through both calls) · e the lobby camera (S4.09) · f TTEMME (S4.10–S4.11) · g 11:53 PM (S4.12–S4.13; Tasya's Rhodes, one step, on the door) · h Step four? (S4.14–S4.15): **the clockwork pizzicato slows, as if winding down, and hangs on one held note** (a pedal, not silence) under "Step four?" and Mada's silence · 09x REVERSAL on the card's downbeat (S5.01), re-entering on the hit. The procedure runs out of steps and the music runs out with it, so the chapter gets a musical button without adding a stop. The section changes tell a newcomer "new day, new room" without another card. | Neleh's office by day, −40; at night, −40 (quieter HVAC, other phones buzzing off, but not quieter in level: −42 would sit on the hole threshold under the thinned pizzicato). The all-hands crowd, −36 (it hushes for the question and stirs after Alyi). The boardroom (HVAC, the city through glass), −38 to −40. **The split:** boardroom air under the left pane and lighthouse wind, surf and the lamp's motor under the right, panned a touch left and right, for the whole shot (both calls play in it); the left pane's dial tone after the click sits under Mario's money call, and the boardroom air takes over again on the cut to the lobby camera. The lobby camera: CCTV hum and big-lobby air from the screen, −40. | **No stop.** The procedure goes on, which is the board's side. Two designed rests inside the performance: the pizzicato goes out for the four dial tones at the split's opening (boardroom air and the tones under it), and the hang on one held note under "Step four?" and Mada (a pedal, not a rest in level). | the blog post; Gerg's post; "You can call it this way"; the 9:32 post; the eulogy post; the lobby post; TASYA's line. The laptop "super." keeps the pizzicato at −9 dB under it (4.8 dB clear, by design: the tiny voice under the procedure going on is the joke). |
| **S5** | 09x's felt F4 **rings into MM-10 a** as a continuous DARK ROOM pedal: an F/C fifth, low strings sul tasto over the drone. The felt surfaces for "the badge was a joke." and holds, not moving, for "mostly.". The pedal alone runs under the letter page and the check; the counter's `odometer_ratchet` and *clunk* (SFX) carry the launch-night callback over it. **The Build first appears with Gerg's tile** (4 notes, then 8): no 2 s cell of his motif on the counter, which would be a blip and would blur whose motif it is. The pedal returns under D8. | The dark room, −38 to −40 | **Stop 2: Gerg's glance.** The Build and his keys stop together, leaving room tone only. His keys come back first, and their return cuts us to Mas (S5.10); the pedal follows under D8. | the letter; ALYI; the check; RIMA's post (the eight heart ticks keep their rhythm on top of the pedal, not over an empty floor) |
| **S6** | **MM-10 b, re-rendered to v4's avalanche (about 5 to 6 bars at 96 bpm, the composer's call)**, each phrase arriving whole: the Build compiling (the stack) → Step Four displaced, holding a beat as Alyi resists → the Water Line augmented, with THE QUIET VOTE's layer dropping out silently → the full band, one bar at most → **dead stop on MADA's label**. | The dark room (the monitor's world) | **Stop 3: MADA's label.** The label holds on audible dark-room air. | "Has anyone read the char—" (duck −10 dB inside the cue's composed window) |
| **S7** | **One dead stop in this span, not three** (after stop 3, which ends S6). Dark-room air crossfades 0.5 s into the bullpen. **The STRAIGHT violin** enters under Alyi's post; on the first heart it **holds its note and lets it decay** (about 2–3 s) under the three hearts and the one-beat hold, instead of stopping dead. Its tail meets **Tasya's Rhodes floor**, which enters as a soft sustained pad **on "below"** with the first palette step (a pad, no melody or hit on the real line), blooms after the line, and rings under "hi." / "Hello." and the `NOV 21` rail. **MM-11 c1 LEVERAGE** (rendered and never used by v3) fades in under S7.05, crossfading from the Rhodes as the fires' crackle pre-laps, **so the door bang lands inside it**; it runs through the held wide (the card, the pull, "Which room is on fire?", "…Ah."), ducked −8 dB, and drops out on "Terms?". The long hold plays in the room. **c2's low C pedal** enters under the stamp and carries the term-sheet insert. **The Build restarts** on Gerg's keycaps, thins under his post and Ttemme's, and resumes after the sand's held beat, the only rest. **Fallback,** if the writers keep 3.2's violin dead stop: make stop 3 on Mada's label a ring-out instead, so no two dead stops sit about 6 s apart. | The bullpen by day (low murmur, packing rustle, keyboards), −38 to −40. The boardroom with fires and the extinguisher, crackle raised to about −36. | **Stop 4: "Terms?" → the long hold**, about 5–6 s of room: fires, the extinguisher, keycaps, a key ring. (v3 was music-free for 16 s here.) One rest inside a cue: the sand's beat. From stop 3 to the sign, that's two music-off windows (about 3 s and about 5.5 s) instead of the draft plan's five. | Alyi's post (the violin *is* the thinned colour: one line, no comedy); Tasya's line (the pad arrives on "below", with no melody on the line); Gerg's post; Ttemme's post |
| **S8** | **VICTORY LAP:** the brass stab on the sign's ignition → one chip note on the box of zeros → **the 1993 flat line F F F as one tenuto phrase** (or over a chip F pedal) under the greying, not three 0.3 s blips → the *bonk* and the shake (SFX) → the CU in the lobby's neon buzz (a quiet, not a stop) → "okay." → the felt cadence C4 → F4, settling onto **the vault's F hum** (the same root), which runs as a pedal through the coda → thinned to the hum alone, ducked, under the memo → the screws (SFX) → the chair's *jangle* → into the tag (`server_hum` stands in until MM-12). | The lobby at night (the sign's neon on F, big dark air), −40, pre-lapped 0.5 s under the shatter. The bullpen by day, −40, under the whole coda, including the vault (v3 had no bed there). | Rests inside: the 2-beat CU before "okay." (the lobby's neon buzz under it) | the memo (the hum only; no motif) |

### 5.2 The deliberate stops (four, about right for four minutes) and the rests

| # | Where | Why it earns a stop | Under it | Re-entry |
|---|---|---|---|---|
| 1 | **The Cancel click (D6)**, S1.09 | The blow. It lands because LEVERAGE ran unbroken up to it. | Digital silence on every bus, about 5 beats: the act's only one | The phone's buzz brings the room back; the music returns on S2's felt fifth |
| 2 | **Gerg's glance**, S5.09 | His real face, and the quiet the door and the avalanche come out of | The dark room only (his keys stop too) | His keys return and cut us to Mas; the pedal under D8; then the swing's downbeat on the first tile |
| 3 | **MADA's label**, S6.06 | The stat is the joke, and the band stopping dead is the punchline | Dark-room air through the label's hold (about 2.5 s), crossfading to the bullpen | A new colour for a new sequence: the violin under Alyi's post, which now decays rather than stopping, so this stays the span's only dead stop |
| 4 | **"Terms?"**, S7.07 | The episode's one long hold: the chaos behind two still men is the scene | The room | c2's C pedal under the stamp, then the Build |

**Designed rests inside a cue** (short, on a story beat, with room under them; none is a stop):

| Where | What | Under it |
|---|---|---|
| S4.08, the split's opening | The pizzicato goes out for the four dial tones | Boardroom air and the tones; the quartet enters on the lighthouse's ring |
| S4.14–S4.15, "Step four?" and Mada | The pizzicato slows and hangs on one held note (a pedal, not silence) | The held note, the boardroom |
| S7.13, the sand's held beat | The Build rests one beat | The boardroom's fires; the shatter's tail |
| S8.04, the lobby CU | A quiet of about 2 beats before "okay." | The lobby's neon buzz on F |

The violin's dead stop on the first heart (draft plan and script 3.2) is **gone**: it decays instead (§5.1 S7).

Everything else v3 stopped for becomes thinning, a crossfade or a pre-lap: the 16 dry windows, the mutes baked into the renders that fall in picture, and the gaps between EDL segments.

**The one long music-free span** runs from D6 to the carve (about 8 s: the silence, the phone, "super.", the fallaway), over audible rooms. It's the drop-out's aftermath, a story beat, and **the first thing to check by ear**.

### 5.3 Beds, levels and crossfades (guides)

- **Level.** Beds sit about **−38 to −40 dBFS RMS in the mix**, never below −40 where they're exposed (under a thinned pedal, a rest or a stop), roughly 20–22 dB under the lines. v3's were −43 to −50, which read as silence and caused all 70 of v3's accidental holes. The draft plan's lowest beds (−42 for TPOOL and Neleh's desk at night, −44 under THE PLAN) sat at or under the −42 hole threshold, and would likely vanish on laptop speakers; in the sound supervisor's own what-if, a −38 floor left D6 as the only hole. With a thinned cue on top, the floor under a record item lands about −32 to −36.
- **Texture.** Beds are real ambience with movement, one per location: v3 used one `room_tone` file for five places. The TEMP beds to build are the Strip, TPOOL's frosted office, the lighthouse and the packing bullpen. Synth stand-ins marked TEMP-SYNTH will do for the animatic.
- **Crossfades.** 0.5–2 s at location changes, with the new room pre-lapping the old one's last half-second on a time jump. A hard cut only for D6, and where a whip's air pass carries the change.
- **An ear call.** Whether −38 reads as air or as hiss on laptop speakers and headphones (§8).

### 5.4 Ducking and thinning (for mix_v4)

- **Mix from stems, not stereo masters.** Every cue ships stems that sum to the master. That needs renders **without baked mutes**, because an engine mute zeroes every stem (§5.7).
- **Thinning.** Chip, brass, winds, percussion/harp and drums fade out over about a beat before the word or pop, and return on the next beat or downbeat after it. Strings, bass and piano/pad hold at about −6 dB, with the duck applied on top.
- **The duck.** Keyed from the dialogue bus, with about 40 ms look-ahead:
  - about −8 dB under invented lines
  - −10 to −12 dB under THE PLAN's read and under record items
  - attack about 60 ms, release 400–600 ms
  - **held through gaps under about 1.2 s**, so quick exchanges don't pump
- **Target (a guide).** Dialogue about 15 dB or more over the music while words play. v3's median was 10.8 dB.

### 5.5 Handoffs between cues

| From → to | v3 | v4 |
|---|---|---|
| MM-07 → MM-08 (JOIN → the connect) | The tape-stop stopped 1.25 s early, then 0.62 s with no music | The tape-stop reaches zero on the click; LEVERAGE comes in on the click or the next beat |
| MM-08 → D6 → the room → 26A | The designed stop, then about 1 s of accidental digital silence in F1.2 | The same stop, with rooms audible; the drone pre-laps the fallaway; the felt enters on the carve; F1.2 sits over the pedal |
| 26A → MM-09 (the Rewind) | A butt on sc 27's downbeat | Keep it, with the dark room's tail 0.5 s under the whip |
| MM-09 h → 09x | h's pizzicato ran straight into the card | h slows and hangs on one held note under "Step four?" and Mada; 09x REVERSAL re-enters on the card's downbeat |
| 09x → MM-10 a | 09x's F4 decayed into 6.9 s with no music | The F4 rings into S5's pedal |
| MM-10 a → the stop → MM-10 b | The Build stopped, then 8.5 s with no music | The Build and the keys stop (stop 2); the keys return, then the pedal under D8; the swing on the first tile |
| MM-10 b → the violin | A dead stop, then 2.5 s at −46 | A dead stop (stop 3) over audible air; a crossfade to the bullpen; the violin with Alyi's post |
| The violin → the floor | 5.7 s with no music, and Tasya's line on −47 | The violin holds its note on the first heart and decays; its tail meets the floor's first chord, a pad on "below" |
| The floor → LEVERAGE (c1) | The floor faded, then 16.3 s muted | The floor rings under "hi." / "Hello." and the rail; c1 fades in under S7.05, so the door bang is inside it; out on "Terms?" (stop 4), then c2 under the stamp |
| MM-11 e → the coda | The cadence, then 16.9 s with no music | The cadence settles onto the vault's F hum as a pedal |

### 5.6 Dialogue spacing (pace from the performance, never uniform)

- Quick replies about 0.2–0.5 s apart, loaded ones about 0.6–1.2 s, and the scripted overlaps kept. The duck and the bed hold through every gap, so a gap is room and music, never a hole.
- Long wordless stretches stay where the picture is telling the story under music: THE PLAN's drawings, the call, the avalanche, the posts.

| Exchange (v4 shot) | v3 gap | v4 guide | Why |
|---|---|---|---|
| NELEH's read, clause to clause (S1.03–S1.04) | 0.54 · 0.17 · 0.58 s | about 0.3–0.6 s, landing on the drawings | Brisk but readable; it's the exposition |
| "And the CEO owns—" / "Good question." (S1.04) | overlap 4 f | keep | The cut-off is the joke |
| RIMA → "Share what?" (S3.04) | overlap 6 f | keep (now O.S.) | She's interrupted |
| "Share what?" → "More. Soon." (S3.04) | 0.17 s | **0.5–0.7 s** | The identical non-answer is the joke; pleasant, unhurried |
| "Is this a coup?" → "You can call it this way" (S3.06 → S3.07) | 0.29 s | **0.6–0.9 s** | The first admission; the cut to the doorway carries it |
| "The bylaws allow it…" → "Step four will reveal itself." (S4.03 → S4.04) | 0.29 s | 0.3–0.5 s | A quick volley |
| ALYI → "When?" | overlap 4 f | keep | Heated |
| "The company is calling us." → "That is the company telling us." (S4.06) | 0.08 s | **0.4–0.6 s** | A loaded answer from a reflection |
| MARIO / ADELINA (S4.08) | overlap 7 f | keep | She takes the phone |
| ADELINA → "Hi. Yes. We're very worried. How much?" (inside S4.08) | 0.21 s | **about 1.0–1.5 s** | The click, the throne, the dial tone, the rail typing and the second ring need a clear moment, now inside one shot |
| TASYA's line → "Step four?" (S4.13 → S4.14) | 0.54 s | 0.6–0.9 s | The blank line; loaded |
| "the badge was a joke." → "mostly." (S5.04 → S5.05) | 0.71 s | 0.7–1.0 s | The one true word, said aloud |
| GERG / MAS "what are you building?" (S5.09) | overlap 4 f | keep | Talking over the keys |
| MAS → "The company. Again. Just in case." | 0.17 s | 0.3–0.4 s | He answers without stopping typing |
| D8 → "Everyone is welcome." (S5.11) | 0.625 s | 0.6–1.0 s | Scripted: at least a beat after the line |
| TASYA / "leave it open." (S5.12) | overlap 4 f | keep | On the tail of "welcome" |
| "hi." / "Hello." (S7.03 → S7.04) | overlap 1 f | keep | — |
| "Which room is on fire?" → "…Ah." (S7.06) | 0.79 s | 0.8–1.0 s | The look-around is the gag |
| "Terms?" → MADA "Good question." (S7.07, one two-shot) | 0.08 s | **0.4–0.6 s** | Mada is perfectly still; he takes his time |
| MADA → MAS "good question." (S7.07 → S7.08) | 0.625 s | keep: one beat late, the cut inside the beat | Scripted |
| "What's in there?" → "it's a preview." (S8.07) | 0.17 s | 0.25–0.4 s | "Already past": quick, not clipped |

### 5.7 How to build it

- **Re-render at v4 lengths into a new folder, `audio/ost/tracks/e01-act4-v4/`.** The engine and the batch-1 tracks are untouched. Use one small wrapper per cue on the pattern of `e01-s26-the-falling-tile`: it imports the track through `importlib`, re-lays the sections to v4's bar counts, and **replaces the dry-rule mutes with `stem_auto` thinning**, keeping only the designed stops.
  - The switches the supervisor read in the code (not yet run): MM-09 `SECTIONS`/`MUTES_BARS`; MM-10 `CARD_BAR`/`BUILD_STOP`; MM-08 `leverage(bars=…)` and `compose(form=…)`; MM-11 `SPOT`; the door's `STOPS`.
  - The wrappers, by v4 sequence:

    | Wrapper | Covers |
    |---|---|
    | `s1-plan` (MM-07) + `s1-leverage` (MM-08, bars 1–7, b8.1 on the click) | S1 |
    | `s2-26a` (MM-08 26A, with a pedal section of the TPOOL insert's length) | S2 |
    | `s3-boards-side` (MM-09 + 09x, one render; h written to slow and hang on a held note) | S3 + S4 |
    | `s5-his-side` (MM-10 a; only `BUILD_STOP` kept, on the glance; no Build cell on the counter) | S5 |
    | `s6-avalanche` (MM-10 b at v4's bars, `CARD_BAR` on the label frame) | S6 |
    | `s7-return` (the door + MM-11 b–d; the violin's first-heart stop replaced by a held, decaying note; c1 entering under S7.05) | S7 |
    | `s8-lobby-vault` (MM-11 e + the hum stand-in) | S8 |

  - The cue boundaries sit on the same story beats as the supervisor's, so the mapping is one to one.
- **Interim, if the re-renders aren't ready** (the supervisor's §9.7 list, all existing files):
  - the source in order only, never backwards
  - joins on bar lines with 1-beat equal-power crossfades, not 3 ms butts, except the designed stops
  - MM-09's part files and hold loops (e has none: use d's `hold3` or f's)
  - MM-08's LEVERAGE bed loop plus one crossfade into the to-picture render at 10.0 s
  - MM-07's tape-stop alternates aligned on 48.75 s
  - MM-11 c1–c2 (31.875–59.4 s)
  - the violin's held-note render (or its stop file with a long release laid over the stop), never the dead stop
  - wherever a baked mute would fall under a v4 line or post, a hold loop or the room pedal laid over it
  - for S2's TPOOL insert, the `room_drone` pedal (tuned F1 + C2) between the two felt pieces
- **mix_v4** (the editor's): mixes from stems, with the sidechain duck and the thin windows taken from the lock's lines, posts and cards; per-location beds with the crossfades above; D6 as the only all-bus mute. It writes the EDL and margin labels **in the same run as the WAV**, and the mp4 is muxed from that WAV.

### 5.8 Measure v4 the same way (spotting tools, never gates)

Measure on the audio extracted from the v4 mp4:
- holes (0.3 s or more under −42 dBFS): expect D6 and little else
- digital silences: expect exactly one
- jumps (over 15 dB between 50 ms windows)
- every music start and stop, and each run's length: expect a handful of long runs, and no fragment of a second or two that isn't a designed sting
- **the expected music stops and rests**, so the report can tell a designed one from an accident:
  - stops: D6 (the Cancel click), Gerg's glance, Mada's label, "Terms?"
  - rests inside a cue: the dial tones at the split's opening, the sand's beat, the lobby CU before "okay."
  - not a stop, though a meter may call it one: the pizzicato's held note under "Step four?" and Mada, and the violin's decay under the hearts
  - anything else is a spot to watch and listen
- music-off windows per sequence, not just stops: S7 should show two (after Mada's label, after "Terms?")
- dialogue over music, per line
- bed level per location (none exposed below about −40 dBFS)

Then go and watch and listen at every flagged spot, and decide there.

---

## 6. Runtime (an outcome)

**v4 ≈ 4:28 (268 s) against v3's 4:08.9 (248.9 s): +19 s, +8%.** 119 shots become 82. The average shot goes from 2.09 to about 3.3 s and the median from 1.88 to 2.75 s. 21 shots run under 2 s (v3: 72) and 4 under 1.5 s (v3: 48). No run of three or more shots is under 1.6 s (v3: six runs); the only run of three or more under 2 s is the avalanche montage (S6.02–S6.05). No ten-second window holds more than five cuts; the windows with five are the falling tile (S1.08–S1.12), the avalanche, the calm-off block (S7.07–S7.11, none of its shots under 1.75 s) and the lobby (S8.02–S8.06).

All of these are sums of this plan's planned lengths (computed by script from the §3 tables), not measurements of a cut. The critic's amendments (§9) cost about +1.75 s net: the cuts (the pin, the second blueprint insert, the merges) nearly pay for the read-time restores.

| Seq | v3 | v4 | Δ | Added (net, shot by shot), and why: orientation · reaction · read time | Cut as padding or repetition (including what the merged shots absorb) |
|---|---|---|---|---|---|
| S1 | 35.1 s (20 shots) | 41.4 s (12) | **+6.3** | The suite drift and rail read (+0.5); the glow bridge (+0.5); `VOTES: 0`, the Macrosoft label and `EQUITY: 0` legible and held together (+1.5); the NELEH card's read on the call (+1.0); the eyes strip long enough to register (+0.6); the cursor's approach as one readable move (+0.6); the CU (+0.4); the "super." freeze visible, since S3 answers it (+0.9); JOIN (+0.25) | The 1.5 s blank grid; "Nine seats." (about 0.8 s); the macro; the key ring-to-CEO slide; 8 cuts |
| S2 | 11.9 s (4) | 13.25 s (5) | **+1.35** | The TPOOL insert's read inside the count, at its rail's floor; the NIGHT rail | The stray 1 s of digital silence; the flashback's detached 3.75 s becomes a 3.5 s bracket |
| S3 | 27.9 s (13) | 31.25 s (9) | **+3.35** | The step list held until it reads (+1.75); the all-hands establishing shot and exit (+1.4); "nobody looks up" visible (+0.5); Gerg's post read (+0.5); the blog post and the 9:32 post at their floors (+1.0 over the draft plan) | The candor card (−0.5); Rima's three setups; the toast; the second EQUITY stamp and its shot (−1.25); the night rail |
| S4 | 42.2 s (23) | 49.0 s (15) | **+6.8** | The boardroom's establishing wide (+2.4); Neleh's doubt (+0.9); Tasya's plate, sign and line in order (+2.0); Mada's ending beat (+0.75); plates for Mario and Ttemme; the door (+0.6); the over-the-shoulder exchange (+0.7); the eulogy post and the loaded two-shot at their floors (+1.0 over the draft plan) | The blue-heart macro; the separate speakerphone wide; the hourglass flip shot; Mario's own MCU (folded into the split); the tumbleweed; the second blueprint insert (−1.75) |
| S5 | 44.7 s (19) | 44.5 s (12) | **−0.2** | The check insert, legible (+3.0); Gerg's held look (+0.5); the lanyard in the home shot (+0.6) | The letter's three registers (−1.65, after its page is timed for reading in order); two Orb inserts; the phone stack (−1.0); the card (−0.5); the check's long two-shot (−1.1) |
| S6 | 20.0 s (13) | 15.55 s (6) | **−4.45** | THE QUIET VOTE's own beat (+1.25) | Jump cuts on the grid; the reversed-axis over-the-shoulder; the glass; one of two Mas cutaways |
| S7 | 39.5 s (17) | 43.5 s (13) | **+4.0** | The term sheet (+2.0); "hi." / "Hello." readable (+1.0); the loaded "Good question." gaps (+0.6); the long hold's room (+0.8); Mas reading Gerg's post (+0.6); the held boardroom wide; Gerg's and Ttemme's posts at their floors | The regret post's extra hold (−0.25); the remap's tail (−0.5); Terb's separate MCU; the pin insert (−1.25); Mada's over-the-shoulder (into the two-shot); the entrance, card and look-around as separate shots |
| S8 | 27.6 s (10) | 29.5 s (10) | **+1.9** | The lobby's holds for the sign, the box, the refused dialog, the CU and "okay." (+2.4); the chair's name (+0.5) | The static vault (−0.9) |
| **Act** | **248.9 s (119)** | **≈ 268 s (82)** | **+19** | About 43 s added | About 24 s cut, plus the time the merges absorb inside their shots |

**If the showrunner wants it back near 4:10, cut in this order** (each has a cost):
1. The Mario split (about −8.5 s). The newcomer read's "the plot doesn't need it", but it costs a protected insider beat and the board's "flail".
2. The letter's insult line (about −3.9 s). It keeps the demand; it loses the act's best-known burn.
3. D8 (about −2.5 s). It needs another carrier for the Ep12 plant and for the door's cue.
4. The term-sheet insert (−2.0 s). The posts, the sign and Cancel then carry "he's back" on their own, as they did for the v3 cold viewer.

Don't recover time by shortening read-time holds or reaction beats. That is what made v3 jagged.

---

## 7. Build notes (for the lock and the animatic)

- **New files, the editor's; v3's stay reproducible:**
  - `tools/lock_v4.py`: from §3 and §5.6. Lines take their length from their takes, and the gaps come from §5.6, never a uniform default. **There is no beat-grid snapping and no one-setup-per-speaker rule.**
  - `data-v4.ts` and `shots4.ts` (layouts)
  - `sound-v4.ts`
  - `tools/mix_v4.py`
  - `tools/report_v4.py`: the §5.8 measures, plus the shot-length distribution and the runs of short shots
  - a new composition id, `ep01-act4-animatic-v4`
  - Continuous clocks (the avalanche stack, the call screen, THE PLAN's tilt) are sampled once per shot span, never restarted per shot.
- **Whole-pixel moves, budgeted in pixels.** The frame is 480 × 270 base pixels shown at 4× (1920 × 1080), so one base pixel is a 4-pixel step on screen. Every move below is small on purpose; each needs a human check for judder in motion (§8, check 14).

  | Shot | Move | Budget | On screen |
  |---|---|---|---|
  | S1.01 | the suite's drift toward the desk (`drift`/`shiftRoom`) | about 12 px over 3.0 s: 1 px every 6 frames | 4 px steps at 4 Hz (v3's 26A.01 drift ran 1 px every 8 frames) |
  | S1.03 | THE PLAN's tilt down the arrow (`bpComposite` `oy`) | 60 px over 60 frames (2.5 s): 1 px a frame | 4 px steps at 24 Hz (v3's 25.02b: 2 px every 2 frames, 8 px steps at 12 Hz) |
  | S1.04 | none: one held 2× frame | 0 | the draft's 230-sheet-px slide is gone (19 s at the stated rate) |
  | S2.01 | the carve insert's drift (as v3's 26A.01) | 11 px, 1 px every 8 frames | 4 px steps at 3 Hz |
  | S3.08 | Alyi steps back out of the doorway (a sprite, not the camera) | his width, in held whole-pixel steps | as v3 |
  | S5.06 | the letter page's scroll to `ALYI` (`shiftRoom`) | at most about 48 px, 1 px a frame (2 s) | 4 px steps at 24 Hz; lay the page out so the scroll stays this short |
  | S6.03–S6.04 | the tiles sliding off (sprites) | as v3 | — |
  | S4.02, S4.08 | none: the draft's "pull back" and split-line slide are cuts or gone | 0 | — |
- **New compositions and what they reuse.** Every one is a recomposition of existing kit pieces, listed under each sequence in §3:
  - THE PLAN's tall sheet, **redrawn at the section's scale** (`plan25v3`'s `bpChair` row, `bpRing`, `bpBox`, `bpArrow`, `bpFence`, `bpKeyRing`, `bpStamp` at `big`, two-line nameplates; `bpComposite` `oy` for the tilt; one fixed 2× crop for S1.04)
  - the call's single screen (`callgrid`)
  - the desk overheads with a laptop edge (`drawTableInsert` + the 1:2 screen)
  - the boardroom's wall screen (bezel + the hearts pile / `drawLobbyCamWide`)
  - the split (two 240 × 203 crops, as sc 11)
  - the letter page (`odoRoll` + the signature list + `shiftRoom`)
  - the check and term-sheet inserts (2× crop + `pt()`, and the blueprint `fold` in paper colours)
  - the Gerg over-the-shoulder (`shoulder(masPortrait)` over his POV tile)
  - the refused dialog (`shakeAt`)
  - the lanyard on his desk in the Monday bullpen (the existing lanyard sprite; the tray only if the fallback is needed)
  - the boardroom's CEO chair back behind Rima (the boardroom's chair design)
  - the lobby arrow with an empty tag box (`drawPointer` + the tag box)
- **Stand-ins to draw before the next cold test** (the red labels read as noise):
  - the throne on the handset
  - the box-of-zeros hand
  - the screwdriver hand
  - the observer chair
  - the check's lettering
  - the term sheet
  - the caller IDs
  - Tasya's sign (`MAS · GERG →`)
  - the reception desk's stone top at insert scale
  - the CEO chair back for S3.04
- **Render** at 1080p at most, `--concurrency=6` at most (the machine is shared). Delete scratch frames and superseded renders; the disk is 97–98% full. Keep the v3 outputs for comparison.

---

## 8. What a human must check (I could not)

None of these can be settled from stills or numbers.

1. **The told-twice "super."** In motion, do the four tiles visibly freeze in S1.12 and visibly carry on in S3.01?
2. **Cancel means fired.** Does the `ALYI` cursor, the click and the falling tile read as "he's fired" before `+1 FIRING` lands? Does the tag play as story, or as a label joke? In the lobby (S8.03), does the empty tag read as "someone tried again", not as a bug?
3. **THE PLAN.** Afterwards, can a newcomer say "four of them control the company and are going to vote him out, and he owns nothing"? Does about 14 s of blueprint (S1.03–S1.04) keep its energy under the waltz? Do the two-line nameplates crowd at the 48 px pitch? Do the two zeros side by side read as one picture?
4. **TPOOL inside the count.** Does the style switch get enough time (3.5 s) to register, does the rail read while the front sweeps in, and does it read as "the old marks are old ousters", not as a second timeline?
5. **Rima's single close-up.** Does Neleh's O.S. "Share what?" land as an interruption without seeing her? Does the chair back place her in the boardroom, so S4.10's empty chair reads as her replacement?
6. **The split** (S4.08). Is it legible in 240-pixel panes? Does the rail typing after the click, while the second phone rings and Mario answers, overload the frame (the one place a rail is read under a voice)? Does "the board hears a dial tone while Mario takes the money call" land as the joke?
7. **Text load.** Tasya's plate, then sign and line (4.5 s), and the letter page (about 10 s): are they readable in time without feeling like homework?
8. **The avalanche** at about 15.5 s under about 5–6 bars: does it still play as the set-piece?
9. **Sound.** Do the beds read as air rather than hiss at about −38 to −40? Do the four stops land as punctuation, and do the rests (§5.2) read as designed, not as holes? The 8 s music-free span after D6 comes first. Then S7: does the violin's decay into Tasya's Rhodes, and the Rhodes into c1 under the door bang, play as one continuous run? Does the pizzicato's hang under "Step four?" feel like an ending, not a stall?
10. **The Terb exchange.** Is the one-beat-late "good question." still funny with the loaded gaps, now that Mada's line plays in the two-shot and only the echo gets a cut? Does the 7 s held wide keep its energy through the freeze card?
11. **The term sheet's fold.** Does it read as a callback, or as an unfinished drawing?
12. **Mouths** on the edited `a4-25-10`, and on Mada's "Good question." now in the two-shot.
13. **Two cold reads on v4**, done as flow-and-continuity §5a describes: a **newcomer** who doesn't know the real events (not me: I know them, which is exactly the reading §5a warns about) retells it against §1; an **insider** marks drag and over-telling against §1's cut list.
    - **The newcomer test is picture-only.** Crop the review frame to the picture: no subtitle band with speaker names (v3's frame printed "NELEH: Nine seats…" at A 0:08.5) and no production side panel. Otherwise the newcomer learns names from the chrome, and the test can't show whether the plates work.
    - Give the newcomer a timed transcript that labels speakers **only as the show has identified them so far**: for example "VOICE ON THE BLUEPRINT" until Neleh's card names her on the call, and "A MAN IN THE CROWD" for the tiled employee. A name enters the transcript only after a plate, card, tag or nameplate has put it on screen and tied it to a face or voice.
14. **Judder.** Every whole-pixel move in §7's budget table (the suite's drift, THE PLAN's tilt, the letter's scroll) steps 4 screen pixels at a time. Watch each at full screen.
15. **The lobby's desk.** Does the glass on the reception desk's stone top read as the lobby, or does it still ask "are we back in Vegas?" If it asks, use the tray.

*No v3 output was changed. The only scratch files were two small scripts (one summed the planned lengths from the §3 tables, one measured label widths in the pixel font); both are deleted.*

---

## 9. Critic log

The critic's 13 amendments, and what this final plan did with each. The critic worked from this plan's planned lengths, `lines.json`, `plan25v3.ts` and three v3 stills, and watched and heard nothing; so did I. **None is rejected outright.** Where a part of one was changed or not taken, the reason is given. Every claim about flow or sound still needs the human watch in §8.

| # | Amendment | Verdict | What changed, and why |
|---|---|---|---|
| 1 | S7 is the most jagged stretch; consolidate picture and music | **Taken** | **Picture:** 30.08, 30.09 and 30.11 play as one held boardroom wide (S7.06, 7.0 s); the pin insert 30.10 is cut; Mada's "Good question." plays in the calm-off two-shot (S7.07), with one cut to Mas for the echo and back to the same setup for the hold. S7 goes from 17 shots to 13, the Terb block from 10 to 6. I checked the critic's evidence against the tables: 8 of the draft's 26 sub-2 s shots and 5 of its sub-1.6 s shots were in S7, as stated. **Music:** one dead stop in the span (Mada's label). The violin holds and decays under the three hearts; Tasya's Rhodes enters as a pad on "below" with the first palette step (not on the cut itself, about 0.8 s earlier: the palette step is the sync that motivates it, and the pad carries no melody on the real line); c1 fades in under S7.05 so the door bang lands inside it; "Terms?" stays stop 4. Fallback, as the critic proposed: if the writers keep 3.2's violin stop, stop 3 becomes a ring-out. |
| 2 | Don't let the `ALYI` tag carry into the lobby | **Taken** | S8.03's arrow has an **empty tag box**, chosen over no tag because it keeps the noon arrow's design (so it reads as "the same kind of attempt") while naming no one, which matches `DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0`. No tag is the fallback if the empty box reads as a bug. The guardrail reading is right: an `ALYI` arrow would invent an act and an intent for a real person's parody at a real event (guardrails §4, the cartoon-dialogue row). Same if the facts fallback `THE BOARD` is used at noon. T30. |
| 3 | THE PLAN's "one move" can't be built; labels won't read | **Taken, with the build choice made** | I confirmed the geometry in `plan25v3.ts`: the chairs are `bpChair` at a 48 px pitch on the 480 × 270 sheet; the structure is `bpChairTop` with micro text on the 480 × 330 tall sheet; S1.04's crop `x0` runs 240 → 10 (230 sheet px). **Chosen:** redraw the box, arrow and company at the section's scale on one 480 × 330 sheet, move the stamp to the top margin at `big` so it shares the frame with the chair row (the only way "stamp, then chairs" needs no long pan), and tilt 60 px at 1 px a frame (v3's own pan length). One-cut fallback kept. **Changed from the critic:** rather than moving the fence and key ring beside the CEO box (which would put the investor inside the company box), the CEO box moves to the company's right wall and the fence and key ring stay just outside it; the effect the critic wanted, both zeros in one 240 × 135 frame, is the same. **Labels:** measured in the pixel font, `GERG · CO-FOUNDER` is 94 px (can't fit 48); two-line `CO-FOUNDER` is 58 px and clears `CEO` and `ALYI` by about 11 and 9 px, so two-line plates are the plan and re-spacing the fallback. S4.02 is a cut. The pixel budgets are in §7, with a judder check (§8, 14). |
| 4 | Several shots are under the read-time floor | **Taken, all seven, and the check extended** | S4.09 + S4.10 merge into one split (S4.08, 8.5 s) with the rail trimmed to `(REPORTED) · THE BOARD OFFERED MARIO THE JOB` and the meters' dates dropped. S5.06 runs the counter under the insult line and puts the Orb's chime and servo on the ALYI stop; timed in order it's **10.25 s** (the critic named the order, not the length; the insult line as the plan trims it is 77 characters, a 4.1 s floor, not 88). S3.09 loses its rail and gets 5.5 s. S7.17 (now S7.13) is back to 5.5 s. S4.15 (now S4.13) gets 4.5 s. S2.03 types its rail during the sweep-in **and** runs 3.5 s (both halves: the type-on alone left no hold for the door after the rail cleared). S4.06 gets 4.75 s. **Added by the same check:** S3.03 3.25 → 3.75 s (the blog post is 64 characters, 3.45 s); S4.01 4.25 → 4.75 s (the eulogy post's 3.35 s after the hearts build); S7.11 (the draft's S7.15) 3.0 → 3.25 s (Gerg's post, 3.0 s, after the keycaps); S1.04 5.0 → 5.25 s (the label and both stamps in order). S5.08's check is left at 3.0 s: only `PAY TO: NOPEAI STAFF` and `VOID IF CEO MISSING` must be read (2.25 s); the payer, figure and memo are the insider's layer. |
| 5 | Give pass one a musical ending | **Taken** | MM-09 h slows and hangs on one held note under "Step four?" and Mada; 09x re-enters on the card. §5.1, §5.2, §5.5. |
| 6 | Tasya's sign `MAS · GERG →` | **Taken** | Must-understand #9 now says "for Mas and Gerg", and #10 carries "open to everyone". The `11:53 PM PT` rail clears inside S4.12, before S4.13's plate and sign; the sign has no quotation marks. T16. |
| 7 | Speaker names out of the newcomer test | **Taken** | §8, check 13: picture-only crop, and a transcript that names speakers only after the show has. T27. |
| 8 | Two S5 sound details | **Taken, both** | No Build cell on the counter (the ratchet and clunk carry the callback over the pedal; the Build first appears with Gerg's tile). The keys stop with the Build on Gerg's glance, and their return cuts to S5.10. §5.1, §5.2, S5.09–S5.10. |
| 9 | Cut the repeated blueprint insert | **Taken** | 27.19 folds into the one overhead (S4.14), where she writes the `?` as she asks "Step four?". −1.75 s and one cut. |
| 10 | Place Rima; drop a duplicate label | **Taken, both** | S3.04's spotlight is on the boardroom's CEO chair, its back in frame; S4.10's spotlight swings off that chair, now empty. The sticky note is blank. T29, T31. |
| 11 | Mas doesn't wear `GUEST` at HQ on Monday | **Taken; the desk, not the hand** | The lanyard lies on his desk in S7.01, not worn. Not in his hand: handling it during Alyi's real post would be a Mas tell on the record, where the script keeps his face and hands still. The tray in S8.05 is dropped for the reception desk's own stone top, with the tray as the fallback (§8, check 15). The lanyard now appears three times in the act after its setup, once per step of the through-line. |
| 12 | Raise exposed beds to about −40 dBFS | **Taken** | THE PLAN −44 → −40; TPOOL −42 → −40; Neleh's desk at night −42 → −40. §5.3 now says −38 to −40, never below −40 where exposed. |
| 13 | Verbatim and facts checks; plan text to correct | **Taken** | I re-read the record items I touched (T9, T10, T13, T19, T25) against the script's tags and `facts.md`: exact words, trims marked with ellipses, no new voiced line. **"judgment":** `facts.md` has it; I couldn't check the letter itself (no source could be fetched in this pass), so T19 flags it for facts before lock. **Plan text corrected:** the S6 note now says the avalanche runs *longer* than the insider's 10–11 s, and why; "the lighthouse appears only inside the split" is now true, because S4.10's MCU is folded into the split; §5.2 now lists the rests, and §5.8 lists every expected stop and rest (the violin's dead stop is gone, by amendment 1). |

**Net effect, planned (not measured):** 82 shots and about 4:28 (268 s), against the critic's estimate of about 82 and about 4:25. The extra 3 s are the four read-time restores the critic's list didn't include (+1.5 s) and the letter page timed in reading order (+1.25 s). Runtime is an outcome (flow-and-continuity §6); if the showrunner wants it shorter, §6's trim list comes first, never the read holds.

## 10. The finishing pass (v4.1), 2026-09-26

*Written by the finishing editor after three reads of animatic v4.0: a newcomer's retell (a reviewer setting aside the real events), an insider's read (drags, repeats, over-telling), and the flow audit ([audit-v4.md](audit-v4.md)). The reads worked from stills at 0.5 s and a timed transcript; the audit from the mix's buses and the encoded frames. **Nobody has watched or listened to v4.1 in real time**, me included: everything below is built, measured and checked on stills. The showrunner's live notes were re-read at the start and during the pass; nothing newer than the brief was there.*

### 10.1 How the two reads were balanced

The newcomer lost the thread where a fact was assumed rather than shown. The insider was bored where a fact was told twice, or told before its joke. Where they pulled in opposite directions I took a third way: the in-world version of the fact (the call's own notice, a call's "left" toasts), a plate that says what someone is to Mas, or the fact moved to just after the question it answers. Shot IDs are v4.0's, so both reads' notes still point at the right shots.

### 10.2 What changed, by sequence

| Shot | Change | Whose note, and why |
|---|---|---|
| S1.03 | Stamp `WHO OWNS A CEO?` → `HOW TO FIRE A CEO`; `(CAPPED PROFIT)` cut | Insider: the thesis stamp was on the nose. Newcomer: "THE PLAN" read as nobody's plan, and "Four of us vote" was ambiguous. The board's own title answers both and puts the audience a step ahead of Mas at JOIN. Capped profit: jargon, no load |
| S1.04 | 5.25 → 4.0 s; `EQUITY: 0` with `(HE TOLD THE SENATE)` under it | Insider: 2.4 s hold after the stamp. Newcomer: "his testimony" to whom? |
| S1.07 | 6.0 → 4.75 s; the speaker-view pin on Alyi cut | Newcomer: the tile blowing up and shrinking read as cuts piling up |
| S1.09–S1.10 | The call's notice `You've been removed from the meeting.` after the tile drops; the ALYI tag in the display face; `+1 FIRING` cut; S1.10 2.0 → 1.25 s | Newcomer: the firing rested on a tiny tag and a caption. Insider: `+1 FIRING` spent the tally joke. The in-world notice says it plainly and is a dry joke of its own. D6 stays 3.7 s |
| S2.02–S2.04 | The count drawn at insert scale: the marks ECU with the Orb's cyan eye-light stepping mark to mark; TPOOL rail `TPOOL, HIS FIRST COMPANY · TWO STAFF REVOLTS · (REPORTED)`; S2.03 3.5 → 4.0 s | Audit #5: the marks were a few pixels. Newcomer: what happened at Tpool, and why three marks for one story. "Two" covers marks 1 and 2 (the bible's Tpool revolts); the years read as a lifespan (insider) and are cut |
| S3.01 | Rail `NOV 17 · ~NOON PT` cut | Insider: three signals for one jump; the toast, the badge and the tinny "super." carry it |
| S3.02–S3.03 | No second tick; 4.25 → 3.4 s and 3.75 → 3.25 s | Insider: ticked, then shown. The blog quote sits 0.35 s under its full floor: the load is "not consistently candid", about 1.2 s |
| S3.04 | Plate `RIMA TAMURI · HIS CTO · CEO (WEEKEND EDITION)`, landing as she starts; the black box is a drawn laptop lid | Newcomer: who is she to Mas. Audit #10 |
| S3.07 | Plate `ALYI · HIS CO-FOUNDER, CHIEF SCIENTIST` | Newcomer: his flip only hurts if we know what he is to Mas |
| S3.08 | 1.75 → 1.25 s | Insider: the wide after the answer had landed |
| S3.09 | 5.5 → 4.5 s; no re-stamp: the pen taps the empty `EQUITY:` field | Insider: the re-stamp explained the callback |
| S4.05 | Cut; its *clack* plays out of frame in S4.06 | Insider: the phones were shown twice, then named a third time |
| S4.06 | Mada sits at a `MADA` plate (it said `ALYI`) | Newcomer: couldn't tell who was in the room |
| S4.08 | The offer moves onto Mario's plate, before the "no": `MARIO · THE RIVAL LAB (EX-NOPEAI) · (REPORTED) OFFERED MAS'S JOB`; the rail after the "no" is cut; the money call's caller ID `NOZAMA` | Insider: the rail explained the joke after it landed. Newcomer: who "How much?" is for |
| S4.09 | Rail `NOV 19 · RETURN TALKS AT HQ` | Newcomer: why is he at HQ in a guest badge; it also sets up "the badge was a joke" |
| S4.10–S4.11 | Plate `TTEMME · INTERIM CEO #2 · EX-STREAMING CEO`; the chat as a `LIVE · CHAT` panel; S4.10 2.25 → 2.7 s | Newcomer: "Chat…" and the F's needed streamer culture. Insider: the F column was too small |
| S4.13 | Plate `TASYA · THE LANDLORD · MACROSOFT · NOPEAI RUNS ON ITS SERVERS`; 4.8 → 5.5 s | Newcomer: why "the landlord" (also "below them, above them, around them" later) |
| S5.01 | 2.0 → 1.5 s | Insider: 2 s of black announcing a twist |
| S5.06 | 10.25 → 7.75 s: one quote (`"…people that lack competence, judgment and care…"`), the count, the demand, then `ALYI (REPORTED)` scrolled up from below the fold and held | Insider: 11 s of scrolling. Audit #2: the reveal was legible from the first frame. Newcomer: the highlight was easy to miss |
| S5.07 | Cut; S5.08 opens on the check sliding out of the slot; memo `STAFF SHARE SALE` | Insider: the check shown twice. Newcomer: "tender offer" is jargon |
| S5.09 → S5.09b | S5.09 ends on the glance; S5.09b is the cut-in (his tile fills the monitor) | Audit #3: the glance was a few pixels, so its stop fell on nothing visible |
| S5.11 | The V.O. D8 "gerg never waits to be asked." cut; 4.75 → 2.4 s | Insider: the clearest over-explanation. **Its Ep12 plant ("to be asked") now rests on pictures only: flagged for the Ep12 owner** |
| S6.03–S6.06 | Each member's own tile grows from its grid place (no doubled faces); the call's `… left the call` notices stack; S6.05 and S6.06 are one shot; `ANSWERS GIVEN: 0` cut | Audit #7. Newcomer: when did Neleh and the Quiet Vote go. Insider: the stat explained "Good question." 28 s early |
| S7.02 → S7.02b, S7.03 | The wide is establishing only (2.5 s); Tasya's line in his own MCU with the slate steps behind him; "hi." / "Hello." in Mas's MCU; S7.04 cut | Audit #4 and newcomer: the speaker couldn't be found, and the floor overhead read as abstract tiles |
| S7.06 | Card `TERB / THE NEW CHAIR` · `EXTINGUISHERS: 1` | Insider: `CHAIRS BOARDS ON FIRE` told the "Which room is on fire?" joke first. Newcomer: who is he |
| S7.09 | 3.25 → 2.5 s | Insider: the gap before the terms card |
| S7.11–S7.13 | Gerg's post on a drawn phone; S7.12 cut; the hourglass at 2× (a third of the frame); S7.13 5.5 → 4.6 s | Newcomer: a green screen, and a Mas close-up too short to register. Audit #8 |
| S8.06–S8.07 | The Q\* rail moves after "it's a preview.": `(REPORTED) STAFF HAD WARNED THE BOARD ABOUT Q*`; S8.06 3.5 → 2.75 s, S8.07 3.75 → 5.9 s | Insider: the rail answered Gerg before he asked and undercut `DO NOT EXPLAIN.`. Newcomer: Q\* now means something the board was warned about |
| S8.08–S8.09 | The memo plays across the cut: "i harbor zero ill will towards him." over the plate coming off, the screws on his words; the plate's clean outline holds; S8.08 5.4 → 2.6 s, S8.09 2.5 → 3.1 s | Newcomer: had Alyi left, or gone home? The line landing on the screwdriver says it, and saves 2 s of the coda |
| all | The `post-ui` tag is gone from every post card | Audit #9 |

### 10.3 Sound

- **No dip under silent posts** (audit #1). The melody still leaves under a post, a card or the letter, but the duck there is −3 dB (was −10) and the held families lift +2 dB. The duck holds across gaps up to 2.5 s (was 1.2 s). Where the cue is a pedal (S5, S7.01–S7.03, the coda), voiced lines duck −6.5 dB; THE PLAN's read −8, Alyi's post −5. Measured, louder channel: the change from the neighbouring shots to the post is now −0.5 to −2.6 dB (v4.0: −7 to −14). The exception is the blog post, −6.0 dB, kept as a hush under the board's public reason; check it by ear.
- **S5** (audit #2): the cue is laid −4 dB (was −8), with a soft upright-bass pulse on the pedal's own F and C that enters with the counter, tightens to the clunk and walks under the check. S5's wordless median: −24.6 dBFS (v4.0 −32.9; S4 is −23.0).
- **Stop 2 is a ring-out** (audit #3): the Build and the keys stop on the glance; the pedal holds into the avalanche.
- **THE PLAN** (audit #6): the felt rings through the blueprint's cut into WORD; the musical-chairs rest is gone.
- **Tasya** (audit #4): the pad pre-laps under the violin's decay from the establishing wide.
- **Cues:** all five re-rendered to lock v4.1 (`audio/ost/tracks/e01-act4-v4/`, README). v4.0's frame numbers are carried onto the new lock by a warp (`common.w()`, from the kept snapshot `lock-v4.0.json`); S4's third Step Four uses the drop-out into Neleh's sincere beat as its blank, now that S4.05 is gone; the 8-note Build "while he reads" went with S7.12.

### 10.4 Noted, not changed (and why)

- **"The bylaws allow it. Footnote three."** (newcomer: allow what?) Kept: it's Neleh's charter literalism, it plays over the ringing phones as a defence, and the runner pays off in "Has anyone read the char—". A re-record is out of scope.
- **Why he was fired.** Withheld on purpose: the board never explains, and the Q\* rail is the one hint. A question the show raises and holds, not a gap.
- **The nine chair names, the invite icons, `RENT` / `SAFETY`, Adelina's name, why Rima was replaced, the glass bookend, the Orb.** Texture or callbacks (the icons are Act Three's invite; the Orb is introduced in Act Three), none load-bearing; a plate for Adelina would crowd the split.
- **`GERG / CO-FOUNDER · CHAIR`** (insider). Not done: a third plate line adds read load on the one sheet the newcomer already found busy. For the writers.
- **The coda's several endings** (newcomer). Kept: the lobby ends the story, the bullpen coda is the cost. It is shorter by the memo crossing the cut, and the Q\* fact now lands as a sting.
- **Terb's 1-bit freeze, "How much?", `IOU: 20% COMPUTE`, `NOV 20 · NOPEAI HQ`.** Kept, as the insider suggested or allowed.
- **17 shots still carry drawn stand-ins** (listed in the report); none prints a label.

### 10.5 Numbers (measured by `report_v4.py`, v3 → v4.0 → v4.1)

| Measure | v3 | v4.0 | v4.1 |
|---|---|---|---|
| Runtime | 4:08.88 | 4:28.88 | 4:12.75 |
| Shots · median | 119 · 1.88 s | 82 · 2.83 s | 79 · 2.75 s |
| Shots under 2 s · runs of 3+ under 2 s | 72 · 7 | 21 · 1 | 19 · 1 (the avalanche) |
| Music: audible runs · stops of 0.2 s+ · shortest run | 22 · 21 · 0.10 s | 8 · 7 · 4.75 s | 5 · 4 · 17.9 s |
| Holes (mono downmix) | 78, 70.5 s | 2, 3.9 s | 1 (D6), 3.6 s |
| Abrupt jumps (mono / louder channel) | 107 / 86 | 62 / 38 | 54 / 33 |
| Change of level under silent posts | — | −7 to −14 dB | −0.5 to −2.6 dB (blog −6.0) |
| S5 wordless median | — | −32.9 dBFS | −24.6 dBFS |
| Loudness / peak | −16.6 LUFS / −1.0 | −16.5 / −1.2 | −16.5 / −1.2 |

### 10.6 What a human must still check (in real time, with sound)

1. The whole act once, with no notes: fluid, clear, a thriller?
2. The level under the silent posts: does it ride now, or does the thinned melody still read as a dip? The blog post's hush: tension or hole?
3. The S5 pulse under the letter and the check: a heartbeat, not a groove? Does "ALYI (REPORTED)" land?
4. Gerg's glance as a ring-out and a cut-in: does the beat still land?
5. `You've been removed from the meeting.` inside D6's silence: does it read as the firing, and does it stay dry?
6. `HOW TO FIRE A CEO`: suspense, or a spoiler of the next 20 s? (Act Four is the firing, so it's allowed; the question is whether it plays.)
7. The avalanche's notices: do they read in a montage, or clutter it?
8. Tasya's pad pre-lap and the MCU; "hi." / "Hello." in one shot.
9. The memo across the cut onto the nameplate.
10. A fresh newcomer read and insider read of v4.1, with `act4-animatic-v4-picture.mp4` (it now carries the mix) and the new transcript, which names speakers only once the picture has.

## 11. The closing pass (v4.2), 2026-09-26

*Written by the supervising editor after two fresh reads of animatic v4.1: a newcomer's retell (from stills every 0.5 s, about 40 full-size stills and the timed transcript, with the margin ignored) and an insider's read (507 stills and the transcript). **Nobody has watched or listened to v4.2 in real time**, me included. Everything below was built, measured by `report_v4.py` and checked on stills pulled from the encoded file. The showrunner's live notes were re-read at the start and the end of the pass, and nothing was newer than the brief. The scorecard, the drag list and the open decisions are in [v4-for-review.md](v4-for-review.md).*

### 11.1 The fresh newcomer read against §1

- **Got cleanly (6 of 13):** #2, #5, #6, #7, #11 and #13.
- **Got, with effort (3):**
  - #1: they read "Four of us vote" right but flagged it.
  - #4: they read the marks as "the third time", but found "staff revolts" unclear.
  - #9: "implies Macrosoft hired them, but nobody says so"; the plate was fully typed for under 2 s.
- **Partly (4):**
  - #3: they retold the click as **OK**, because the arrow's path ran beside OK. They also learned what Alyi is to Mas 43 s after he clicks.
  - #8: they lost Mario's second call and inferred that the talks failed.
  - #10: "Everyone is welcome": welcome where?
  - #12: the lobby's dialog was unclear. Both reads flagged it.

The overall line came through: fired, backlash, back as CEO, board out, a cost. Their stated main point matches the act's.

### 11.2 What changed

| Shot | Change | Whose note, and why |
|---|---|---|
| S1.09 | The arrow's third step lands on Cancel's right end, not beside OK. Cancel lights in Alyi's colour while the arrow is on it. The tag reads `ALYI` over `CO-FOUNDER`, the blueprint's name-and-role grammar. | Newcomer: read the click as OK, and learned who Alyi is to Mas 43 s late. The fact is told where it matters, and S3.07's plate confirms it on his face. |
| S3.08 | Cut: the all-hands wide after "You can call it this way" (−1.25 s). The Door over the GPU choir goes with it, so the cut lands in the 9:32 post's thin window. | Both reads: newcomer, "a 1.2 s wide", jagged; insider, air. |
| S4.08 | Mario's plate loses `(EX-NOPEAI)`: `MARIO · THE RIVAL LAB · (REPORTED) OFFERED MAS'S JOB`. | Both reads: too much to read before the "no". `(REPORTED)` stays (guardrails' truth labels). |
| S4.13 | Tasya's plate holds under his sign (hold 3.1 → 4.3 s; no change in length). | Newcomer: fully typed for under 2 s. Insider: cut the last clause. The newcomer needed that clause, so it is held, not cut. |
| S5.10 | Cut: Mas's silent look back after Gerg's glance (−1.5 s). S5.11's two-shot still has him at the desk. | Insider: two silent close-ups, about 3.5 s of air. The newcomer didn't mention it. |
| S5.11, S5.12 | Tasya's sign from S4.13 is taped to the slate door: `MAS` / `GERG` / `→`. It steps up with the door and softens with S5.12's rack. | Newcomer: "Everyone is welcome." welcome where? The prop says whose door it is and whom it was for, so the line widens it. No new words. |
| S8.03 | The empty-tagged arrow is the noon tag's size. It steps in on grey 2, onto Cancel a half-beat before the click, not in a 0.4 s glide. The greyed Cancel doesn't go down. | Both reads: the reprise was unclear. The newcomer never saw the attempt. |
| S8.07 | +0.5 s (5.9 → 6.4 s): the Q\* rail's read. | Newcomer: fully typed for about 2 s. Insider: cut the rail. Kept, because it carries #13. |
| S8.10 | +1 s (3.0 → 4.0 s): the act's last image. | Newcomer: the chair was gone before it landed. The insider protects the payoff. |
| review chrome | The margin's transcript band names a speaker only once the picture has (lock_v4 `SHOWN_AS`), as the timed transcript does. | Both reads learned NELEH, MADA and ADELINA from the band. |
| sound | LEVERAGE (S7) gets MM-11's fix 2b: the pizz is on `vc_lev`, notched, and the F pedal is re-bowed every 2 bars (the SHOWRUNNER-NOTES handoff; `s7s8` no longer fails the engine's F-major check). The lobby bed goes −40 → −39 dBFS. | The handoff. The lobby's rest read −43 dBFS in mono for 0.3 s after the re-render. |

### 11.3 Noted, not changed (and why)

- **The insider's cuts that the newcomer needs:**
  - "TWO STAFF REVOLTS": the newcomer read the marks from it.
  - `EX-STREAMING CEO`: the newcomer's "why F?".
  - The Q\* rail: must-understand #13.
  - Gerg's return post: #12.
  - "The company is calling us.": it sets up "That is the company telling us.".
  - The post holds (S3.09 is 80 characters, a 4.25 s floor; S4.01's post is read over the full screen of hearts).
  - THE PLAN's step 1: it tells the newcomer the noon call is the vote.
- **Designed beats:**
  - The toast inside D6's silence.
  - Mada alone under the dead stop.
  - "the badge was a joke." … "mostly." (a loaded 1.1 s gap).
  - The letter's `SIGNED 745 / 770`: it is the counter itself.
- **Not small, so taken to the showrunner as open decisions:**
  - The newcomer's MUSTs that need a story call: the board's "why" (the charter), Mario's second call and "RENT"/"SAFETY", the talks failing, and "…or we join Macrosoft" (a verbatim change).
  - The insider's structural asks: the `WHAT THEY DIDN'T KNOW` card, the lobby's sign/zeros/dialog triple, and `(REPORTED)` five times (a legal call).
  - All of these are in v4-for-review §7.
- **The level under two posts:**
  - Gerg's post (S3.05) and the lobby post (S4.09) now measure −3.3 and −3.8 dB against the neighbouring shots (v4.1: −1.3 and −2.6).
  - A re-render of the v4.1 S3/S4 cue in scratch reproduced v4.1 exactly. So about 0.9 dB of the S3.05 change comes from the re-rendered cue: removing the Door shifts the engine's level by up to ±1 dB across nearby shots. The rest comes from the neighbouring shots.
  - It is still far from v4.0's −7 to −14 dB. Left for an ear.

### 11.4 Numbers (measured by `report_v4.py`, v4.1 → v4.2)

| Measure | v4.1 | v4.2 |
|---|---|---|
| Runtime | 4:12.75 | 4:11.50 (12:31:00 → 16:42:12) |
| Shots · mean / median | 79 · 3.20 / 2.75 s | 77 · 3.27 / 2.75 s |
| Shots under 1.5 s / 2 s · runs of 3+ under 2 s | 3 / 19 · 1 | 2 / 17 · 1 (the avalanche) |
| Register switches | 28 / 78 cuts | 28 / 76 cuts |
| Music: runs · stops ≥0.2 s · shortest run | 5 · 4 · 17.9 s | 5 · 4 · 19.4 s |
| Holes, mono / louder channel | 1 / 1 (D6, 3.6 s) | 1 / 1 (D6, 3.6 s) |
| Abrupt jumps, mono / louder channel | 54 / 33 | 55 / 38: speech 45 / 31, D6 5 / 3, SFX 5 / 4, other 0 / 0 |
| Level change under silent posts | −0.5 to −2.6 dB (blog −6.0) | −0.5 to −3.8 dB (blog −5.9) |
| Loudness / peak · reply-gap median | −16.5 LUFS / −1.2 dBFS · 0.50 s | −16.5 / −1.2 · 0.50 s |
| Sync · cuts on the lock frame | 0 samples · 73 of 78 | 0 samples · 71 of 76 (S1.06 and S5.08 off by design; 3 untestable) |

The louder-channel jumps are 5 more, net, and each is speech or an SFX crossing the 15 dB line by about a dB: two more words in the memo, the onsets of "I've written up some thoughts—", "it's a preview." and "Is this a coup?", and the door bang, less one word in Mario's line. None is "other".

### 11.5 What a human must check

The list is in [v4-for-review.md](v4-for-review.md) §6.
