# Ep1 · Act Four · v4 for review

| | |
|---|---|
| **What to watch** | `out/ep01/act4/animatic/act4-animatic-v4.mp4`: 1080p, with the editor's margin and a transcript band, and the mix. For a cold watch, use `act4-animatic-v4-picture.mp4`: the picture only, with the mix. |
| **Cut** | Lock v4.2: 77 shots, 4:11.50 (12:31:00 → 16:42:12). The v3 files are untouched for comparison. |
| **Status** | **Nobody has watched this in real time or listened to it**, me included; I can't. Everything below is measured (`report_v4.py`, [report-v4.md](report-v4.md)) or checked on stills from the encoded file. Two fresh reviewers read v4.1 from stills and a timed transcript: a newcomer, setting aside the real events, and an insider. v4.2 is their fixes, and nobody has read v4.2 yet. Nothing here says the act "flows", "reads" or "sounds" right. That is §6's job, for a person. |
| **Detail** | Shot by shot: [edit-plan-v4.md](edit-plan-v4.md) §3 (the plan), §10 (v4.1) and §11 (v4.2); [shotlist-v4.md](shotlist-v4.md); the script's `## ACT FOUR`, draft 4.2. |

---

## 1. The short version

You said v3 had too many cuts and pauses, was hard to follow, had the score stopping every half second, and was jagged. v4 is rebuilt around that:
- **Structure:** eight sequences, each with one place, one time and one question, and one continuous piece of music under it.
- **Cutting:** about a third fewer cuts. The only run of quick cuts is the avalanche montage.
- **Room tone:** under everything. The one real silence is the designed one after the Cancel click.
- **Dialogue:** spaced like people talk.

Then two fresh reads tested your newest notes:
- **The newcomer** could retell the whole storyline without outside knowledge: fired, backlash, back as CEO, the board out, a cost. They stumbled in four places. v4.2 fixes those with small in-picture changes and no new lines.
- **The insider** found about 30–40 s of drag and over-telling. v4.2 cuts two of those beats: one both reads flagged, and one the insider flagged that the newcomer didn't need. Most of the rest is kept, either because the newcomer needs it or because it's a designed beat.

A few real story questions remain. They're yours to decide (§7).

## 2. What changed from v3, and why

**The shape.** v3 played as about 20 mini-scenes that changed place and look almost every shot. v4 plays as 8 sequences in three chapters and a coda, in the script's order:

| Chapter | Sequences |
|---|---|
| HIS SIDE, the blow | S1: noon, the plan and the call · S2: that night |
| THE BOARD'S SIDE, blind | S3: steps one to three · S4: the weekend, and step four |
| HIS SIDE, what they didn't know | S5: 2 AM, the reveals · S6: the avalanche · S7: the return |
| The lobby and after | S8 |

A sequence opens by showing where and when, and stays in one room or one screen until it has a reason to move.

**Cutting on story, not on a quota.**
- 119 shots became 77. The median shot went from 1.9 to 2.75 s.
- Strings of inserts became single held frames that change inside themselves:
  - THE PLAN is one drawing.
  - The call is one screen.
  - Mario's two calls are one split.
  - The letter is one page.
  - Terb's entrance is one held wide.

**Music as performances.** v3 cut 33 fragments out of finished tracks, some under a second, with no fades. v4 has five pieces written to the picture, one per sequence or chapter.
- Under real lines and posts they thin (the melody leaves, a held note stays) instead of stopping.
- There are three dead stops, each on a story beat (the Cancel click, Mada's label, "Terms?"), and one designed rest: the lobby's quiet before "okay.".

**No accidental silence.** Every location has an audible room. The act's only digital silence is the designed one after the Cancel click.

**Dialogue like talk.** v3 packed lines 0.12 s apart, then left holes up to 19 s. v4 replies land about half a second apart, with longer loaded pauses, and every long wordless stretch has music under most of it.

**Clarity for a newcomer, without lectures.** Every load-bearing fact is set up in the picture, with a label, a prop, a plate or an in-world notice:
- The blueprint is titled `HOW TO FIRE A CEO`.
- The call says `You've been removed from the meeting.`
- Plates say what people are to Mas: `HIS CTO`, `HIS CO-FOUNDER`, `THE LANDLORD · MACROSOFT`.
- The check reads `VOID IF CEO MISSING`.

No new voiced line was added.

**Patience for an insider.** Things told twice or explained before the joke were cut. For example:
- `+1 FIRING`
- `ANSWERS GIVEN: 0`
- `CHAIRS BOARDS ON FIRE`
- the "gerg never waits to be asked." voice-over
- the repeated inserts

**v4.2, this pass** (from the two fresh reads of v4.1):
- **The firing click is unmistakable.** The arrow now lands on **Cancel**, which lights in Alyi's colour. The newcomer had read the click as OK, because the arrow passed beside it.
- **The tag says who he is at the click.** It reads `ALYI` / `CO-FOUNDER`, where before the newcomer learned what Alyi is to Mas 43 s later.
- **"Everyone is welcome." has a where.** Tasya's `MAS · GERG →` sign is taped to the door that appears in Mas's room, so the line widens an offer we've already seen. The newcomer had asked "welcome where?"
- **Longer reads where they were short:** Tasya's plate stays up under his sign, the Q\* line holds half a second longer, and the last image (Macrosoft's non-voting chair) holds a second longer.
- **The lobby's second Cancel attempt is visible.** The arrow is the noon arrow's size with an empty tag, steps in on the beat, and the greyed Cancel doesn't go down when clicked. The newcomer never saw the attempt in v4.1.
- **Two beats the insider marked as air are cut:** the all-hands wide after "You can call it this way" (the newcomer also marked it as jagged) and Mas's silent look back after Gerg's glance (−2.75 s). Mario's plate loses "(EX-NOPEAI)".
- **The review band stops naming speakers early.** It names a speaker only once the picture has (both reads had learned NELEH, MADA and ADELINA from it).
- **Music:** the return's LEVERAGE section gets MM-11's fix: the cello pizz is notched and the F pedal re-bowed. It now passes the engine's F-major check, which it failed in v4.1.

## 3. The numbers, v3 against v4

Measured the same way on every cut (`report_v4.py`). They show where to look, and they aren't pass marks.

| Measure | v3 | v4.0 | v4.1 | **v4.2** |
|---|---|---|---|---|
| Runtime | 4:08.88 | 4:28.88 | 4:12.75 | **4:11.50** |
| Shots · mean / median | 119 · 2.09 / 1.88 s | 82 · 3.28 / 2.83 s | 79 · 3.20 / 2.75 s | **77 · 3.27 / 2.75 s** |
| Shots under 1.5 s / 2 s | 48 / 72 | 4 / 21 | 3 / 19 | **2 / 17** |
| Runs of 3+ shots under 1.6 s / under 2 s | 6 / 7 | 0 / 1 | 0 / 1 | **0 / 1** (the avalanche montage) |
| Most cuts in any 10 s | 8 | 5 | 5 | **5** |
| Changes of look (room / screen / blueprint / card), per cut | 42 / 118 | 26 / 81 | 28 / 78 | **28 / 76** |
| Music: runs · stops of 0.2 s+ · shortest run | 22 · 21 · 0.10 s | 8 · 7 · 4.75 s | 5 · 4 · 17.9 s | **5 · 4 · 19.4 s** |
| Music audible · big steps (drops over 20 dB) | 47% · 76 (16) | 91.5% · 33 (8) | 92.6% · 26 (4) | **92.6% · 27 (4)** |
| Near-silent holes (mono, the lead's measure) | 78, 70.5 s (28%) | 2, 3.9 s | 1, 3.6 s | **1, 3.6 s** (the designed silence after Cancel) |
| Abrupt level jumps, mono / louder channel | 107 / 86 | 62 / 38 | 54 / 33 | **55 / 38**; none is "other" (all speech, SFX or the designed silence) |
| Level change under silent posts | — | −7 to −14 dB | −0.5 to −2.6 dB (blog −6.0) | **−0.5 to −3.8 dB** (blog −5.9) |
| Wordless stretches of 6 s+ · with music under less than half | 10 · 6 | 11 · 0 | 11 · 0 | **11 · 0** |
| Reply gap (median) | 0.12 s | 0.50 s | 0.50 s | **0.50 s** |
| Loudness / peak | −16.6 LUFS / −1.0 | −16.5 / −1.2 | −16.5 / −1.2 | **−16.5 / −1.2** |

- **Sync:** the mp4's sound lines up with the mix to the sample. 71 of the 76 cuts land on the lock's frame: 2 are off by design, and 3 join near-identical frames.
- **The two posts that measure lower than in v4.1:**
  - Under Gerg's resignation post and Mas's guest-badge post, the drop against the neighbouring shots is −3.3 and −3.8 dB (v4.1: −1.3 and −2.6).
  - For Gerg's post, about 0.9 dB of that comes from re-rendering the S3/S4 music after cutting S3.08. I checked it against an exact re-render of v4.1. The rest, and the badge post's change, come from the neighbouring shots.
  - It's far from v4.0's dips of 7–14 dB, but an ear should check it.

## 4. The must-understand scorecard

What someone who has never followed AI news should leave with, in story order.
- **The v4.0 newcomer:** that first read's retell wasn't saved, only the gaps it raised, which are logged beat by beat in edit-plan §10.2. v4.1 fixed each of them.
- **The v4.1 newcomer** was a fresh reviewer.

"Got it" means retold correctly with no confusion on the part that matters. "With effort" means retold correctly but marked as confusing, or filled in from outside knowledge.

| # | Beat | v4.0 newcomer (gaps raised) | v4.1 fresh newcomer | v4.2 |
|---|---|---|---|---|
| 1 | The board can fire the CEO; four vote; Mas and Gerg sit outside | Whose plan? "Four of us vote" ambiguous | **With effort:** read it as "the four outnumber Mas and Gerg", but flagged the line | Unchanged; the ring and the `HOW TO FIRE A CEO` stamp carry it |
| 2 | The investor has no vote, the CEO no shares | "His testimony" to whom? | **Got it.** `(HE TOLD THE SENATE)`: who, and why? That part is texture | Unchanged |
| 3 | The noon call is the vote: Alyi clicks Cancel; Mas is out | The firing rested on a tiny tag | **Partly.** Retold the click as **OK**. "Removed from the meeting" read first as being dropped from a call. Learned that Alyi is his co-founder 43 s later | The arrow lands on Cancel, which lights; the tag reads `ALYI` / `CO-FOUNDER` |
| 4 | He shows nothing ("super."), but it has happened before (TPOOL) | What happened at Tpool? | **With effort:** "the third time staff or a board have come for him"; "staff revolts" against whom? | Unchanged |
| 5 | The same day from the board's side: the call, the post, interim Rima, step four blank | Who is Rima to Mas? | **Got it** | — |
| 6 | Gerg quits; the staff smell a coup; Alyi owns the word | His flip only hurts if we know who he is | **Got it** | — |
| 7 | Mas plays it in public; love floods in; the board is besieged | — | **Got it.** "The bylaws allow it": allow what? (minor) | — |
| 8 | The board flails: the rival lab says no, a second temp CEO on a clock, Mas at HQ as a guest | Who is "How much?" for? Why the badge? Why "F"? | **Partly.** Got the "no", "interim CEO #2" and the badge. Lost on Mario's second call; inferred that the talks failed and that Rima was replaced | Mario's plate is shorter; the rest is open (§7) |
| 9 | Macrosoft opens a door for Mas and Gerg: step four, written by someone else | Why "the landlord"? | **With effort:** "someone else has written step four", but "nobody says Macrosoft hired them"; the plate was up under 2 s | The plate holds under the sign |
| 10 | What they didn't know: 745 of 770 demand the board resign, Alyi too; the payout is void without Mas; Gerg rebuilding; the door open to everyone | Alyi's name easy to miss; "tender offer" jargon | **Partly.** Got all of it except "Everyone is welcome.": welcome where? | The sign on the door |
| 11 | The staff push the board out; only Mada is left; Alyi regrets it | When did they go? | **Got it.** "Left the call": resigned, or hung up? (minor) | — |
| 12 | A fixer brokers terms: Mas is CEO again, Gerg returns, the clock runs out, a new Cancel attempt fails: "okay." | A green screen; a close-up too short | **Partly.** Got the terms, CEO, Gerg and the 72 hours; the lobby's Cancel reprise was unclear (the insider agreed) | Noon's click now reads as Cancel; the lobby attempt is visible |
| 13 | The cost: Alyi off the board, Macrosoft's chair with no vote, a Q\* vault the staff warned about | Had Alyi left, or gone home? | **Got it**, but the chair and the Q\* line were short reads, and Q\* "means nothing without outside knowledge" | +1 s and +0.5 s |

**Their main point, in their words:** on paper the nonprofit board had total control and Mas had nothing. They fired him with no step four. Within five days the staff, the money and the landlord showed where the power really was. The firers were pushed out, Mas came back, Alyi lost his seat, and Macrosoft got a chair with no vote. A late hint suggests the board had a reason it never explained. That is the act's intended throughline.

**Where they still leaned on outside knowledge.** Each of these is a story call rather than a fix, so it's in §7:
- **Why the board fired him.** They had only "not consistently candid" and an unexplained "READ THE CHARTER".
- **Mario's second call** (Nozama, Elgoog, "How much?", the woman who takes the phone).
- **That the return talks failed**, and why Rima was replaced. Both were inferred.
- **The staff letter's threat** (quit and follow him).
- **What Q\* is.**

Minor texture that didn't cost them the thread:
- the Vegas racetrack
- the floating Orb (it's introduced in Act Three)
- `RENT` / `SAFETY`
- "F" in the chat
- `IOU: 20% COMPUTE`

## 5. The insiders' drag list, and what was done

The insider's verdict: clear and often very funny for them. They lose time where a post is read two or three times, where three signals do one job, and where a caption explains a joke that has already landed.

| Where | Their note | Done |
|---|---|---|
| The all-hands wide after "You can call it this way" | Air | **Cut** (the newcomer also marked it as jagged) |
| Gerg's glance, then Mas's silent look back | 3.5 s of air; one reaction is enough | **Cut** Mas's look; the glance stays (it carries the music's ring-out) |
| Mario's plate | Too much to read before the "no"; `RENT`/`SAFETY` add nothing | **Cut** "(EX-NOPEAI)". `(REPORTED)` stays (a guardrail truth label). `RENT`/`SAFETY` belong to Act One's lighthouse room, so they're flagged for its owner |
| Review captions name speakers early | Spoils whose voice is on the blueprint | **Fixed**: the band names a speaker only once the picture has |
| The narration on THE PLAN repeats the drawing | Let the picture carry it | Kept: those lines set up the newcomer's #1 and #2, and the stamps finishing the interrupted lines are the fun |
| THE PLAN's "1. NOON · VIDEO CALL" | The board's checklist does it better | Kept: it tells the newcomer that the noon call is the vote |
| The removed-notice holds too long | ~1 s over | Kept: it sits inside the designed silence after the click |
| "full value of my shares" 4.5 s; the hearts flood | Hold 3 s; cut when full | Kept: the posts need their read (the first is 80 characters, a 4.25 s floor) |
| "The company is calling us." | The phones already say it | Kept: it's the setup for "That is the company telling us." |
| Tasya's plate explains its own metaphor | Drop "RUNS ON ITS SERVERS" | Kept, and held longer: the newcomer needed it, and it sets up "below them, above them, around them" |
| "the badge was a joke." … "mostly." | No gap | Kept: a loaded 1.1 s pause; for the ear (§6) |
| Mada alone 4 s | Hold 2 s | Kept: it's a designed dead stop on his label; for the ear |
| Alyi's regret post 6 s | Bring the hearts forward | Kept for now: his reading is 3.9 s and the hearts are Mas's answer. The next trim to take if the act wants to be shorter (−1 s) |
| Gerg's return post | Already paid off | Kept: "Gerg returns" is beat #12, and the newcomer used it |
| The lobby: sign + box of zeros + dialog | One idea three times | Kept and clarified (the dialog now reads); a real choice for you, in §7 |
| `WHAT THEY DIDN'T KNOW` card | Announces the twist | Kept; open (§7). The newcomer asked "didn't know what?", which is the suspense the card is meant to raise |
| The Q\* line after "DO NOT EXPLAIN." | Explains the joke | Kept: it's beat #13, and the newcomer needs it; open (§7) |
| `EXTINGUISHERS: 1` | Steps on "Which room is on fire?" | Kept: it's the setup for "…Ah." (one extinguisher, every room on fire). A writers' call |
| `TWO STAFF REVOLTS`, `EX-STREAMING CEO` | Over-telling | Kept: the newcomer read the marks from the first and asked "why F?" without the second |
| `(REPORTED)` five times | A speed bump each time | Kept (guardrails); open for legal (§7) |

**What the insider protects** is all unchanged in content. Among the moments they listed:
- the tally under "i don't keep score."
- "super." heard twice, bookended by "okay."
- Alyi's cursor hovering Cancel
- the step-four runner
- "Chat… for how long?" and the hourglass
- "VOID IF CEO MISSING"
- "leave it open."
- the avalanche's exits
- "Terms?" / "Good question." / "good question."
- the memo over the nameplate
- the observer chair

## 6. What a human must still check, watching and listening

1. **The whole act once, with no notes.** Is it fluid, clear, and a thriller? Can you follow where, when and who in each sequence?
2. **The firing (0:28–0:34).**
   - Does the arrow landing on the lit Cancel, with `CO-FOUNDER` under his name, read as "his co-founder cancels him"?
   - Is the tag's second line readable at speed?
   - Is the lit ring UI, or a label?
   - Then: the 8 s after the click (digital silence, then the room).
3. **The cut from "You can call it this way" straight to Neleh's desk at night (1:15).** Is it clean, or abrupt, now that the wide and its music are gone?
4. **Tasya (2:00–2:05).** The plate and the sign together: readable, or crowded?
5. **The door (2:40–2:45).**
   - Is the sign legible at that size?
   - Does "Everyone is welcome." now say where?
   - Does losing Mas's look back cost the moment between him and Gerg?
6. **The lobby (3:41–3:53).**
   - Does the empty-tagged arrow read as "someone tried again and couldn't", and the dialog as "nobody can cancel him now"?
   - Is sign + zeros + dialog one joke too many?
7. **The ending.** The Q\* line's extra half second; 4 s on the observer chair: does it land, or linger?
8. **Sound.**
   - LEVERAGE with the notched pizz and the re-bowed pedal: inaudible bow changes, still woody?
   - The level under Gerg's post and the badge post (§3).
   - The blog post's hush.
   - Do the rooms sound like air or hiss (the lobby is now −39 dBFS)?
   - Do the three stops and the lobby's rest land as punctuation?
9. **Still unheard from v4.1's list:**
   - does the level ride under the silent posts
   - the pulse under the letter and the check
   - Gerg's glance as a ring-out
   - Tasya's pad under the violin
   - the avalanche's notices
   - the memo across the cut
   - whether `HOW TO FIRE A CEO` plays as suspense
   - the judder on the whole-pixel moves
10. **A fresh newcomer and a fresh insider, ideally people.** They watch `act4-animatic-v4-picture.mp4` in real time. `report_v4.py --transcripts <dir>` writes a transcript that names speakers only as the picture does. Note that AI reviewers know the real events and fill gaps from memory.

## 7. Open decisions (yours)

1. **Why the board fired him.** A newcomer gets *who* is against Mas, but *why* is only "not consistently candid" plus an unexplained "READ THE CHARTER. LITERALLY." The newcomer's takeaway ("a reason it never explained") is the intended one. But the bible's newcomer test asks for "who is against him and why". Options:
   - Keep it withheld (current).
   - Add one sub-line to Neleh's call card that states the board's duty, for example `OUR DUTY: THE MISSION, NOT THE COMPANY`. It would also set up "That is the company telling us." and "Has anyone read the char—". A writers' and facts call.
2. **The `WHAT THEY DIDN'T KNOW` card.** The newcomer found it puzzling and the insider found it a spoiler. Options:
   - Keep it (current).
   - The Orb's mirror of "rewinding…" (for example "fast-forwarding…").
   - A hard cut to the GUEST badge on his desk.
3. **Mario's second call** ("We're very worried. How much?"). It's the newcomer's most confusing stretch and one of the insider's favourites. In the full episode, Act One sets up Mario and NOZAMA. The script already lists it as a −5 s trim. Keep it, or trim it?
4. **Q\*.** Options:
   - Keep the reported line (current; it's beat #13).
   - Cut it (the insider).
   - Name it in two words, for example `Q*: A NEW MODEL` (the newcomer).

   The Q\* verb is still to be confirmed by facts.
5. **The lobby's three beats** (sign, box of zeros, refused dialog). Options:
   - Keep them all (current, now clearer).
   - Fold the sign and the box into one shot (about −1.5 s).
   - Drop the dialog (this loses the bookend with noon's Cancel and "okay.").
6. **`(REPORTED)` five times.** A single disclaimer or a smaller consistent mark would read faster. The guardrails require the truth labels, so this is legal's call.
7. **Mas's cyan skin and segmented hand.** The newcomer briefly wondered whether Mas is an AI. Is that intended, as a series-level question?
8. **The staff letter's threat.** The newcomer inferred "quit and follow him" from the door and the boxes. Showing it (`…or we join Macrosoft`) would change a verbatim quote, so it's for facts.
9. **Carried from v4.1:**
   - **Facts before lock:** "judgment" in the letter, Gerg's casing, the letter's demand, the Q\* verb, and "two staff revolts".
   - **The episode header, runtime table and engagement map** sit outside Act Four. They still need updating: the act now ends at 16:42.
   - **Ep12's "to be asked" plant** now rests on pictures only.
   - **`RENT` / `SAFETY`** belong to Act One's lighthouse room.

## 8. Files

- **Watch:** `out/ep01/act4/animatic/act4-animatic-v4.mp4`, `act4-animatic-v4-picture.mp4`, `act4-mix-v4.wav` (and `.cues.json`), `act4-v4-contact.png`, `act4-v4-contact-native.png`, `layout-v4.json`. The v3 files are untouched.
- **Read:**
  - this folder: [report-v4.md](report-v4.md), [shotlist-v4.md](shotlist-v4.md), [edit-plan-v4.md](edit-plan-v4.md) §11, [timing-v4.md](timing-v4.md) (header note)
  - `script.md` (`## ACT FOUR`, draft 4.2, and its 4.2 notes)
  - `show/bible/flow-and-continuity.md` (the closing-pass notes)
- **Built from:**
  - `studio/src/episodes/ep01/act4/animatic/`: `shots4.ts`, `data-v4.ts`, `sound-v4.ts`, and in `tools/`: `board_v4.py`, `lock_v4.py`, `mix_v4.py`, `report_v4.py`, `shotlist_v4.py`
  - `audio/ost/tracks/e01-act4-v4/`: `s3s4_boards_side.py`, `s7s8_the_return.py`, `README.md`, `render/`
- **Session scratch** (`/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/act4v4/close/`):
  - `transcript-v4.txt`: the v4.2 timed transcript for the next reads.
  - `bak41/`: the v4.1 sources and lock, kept for a rollback.
