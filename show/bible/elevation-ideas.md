# MR. MAS · Elevation ideas (a menu)

> **Status: MENU, finalized 2026-09-26 after a critic pass.** Nothing in this file is committed to the show. Every idea's status is `idea` until a writer pitches it and the showrunner approves it.
>
> **The showrunner (2026-09-26), verbatim:** "just another brainstorming concept, not one necessarily to use: we could have some component of the show rendering improve that shows the model capability of improvement over time. think if there are any other fun concepts like that. we don't need to put every idea like this into the show, but we should brainstorm and document other fun ways we can elevate the show to show extra care, attention to detail, thorough understanding of world events and ability to play on top of them, and fun showcases of storytelling capability"
>
> **How this file was built:**
> - Five paper brainstorms (capability over time, detail and rewatch, world events, storytelling showcases, meta and format) produced about 140 pitches. One curator pass merged, deduped and cut them.
> - A critic pass (showrunner and producer lenses) then made 47 amendments. It checked the draft against [ai-media-range](ai-media-range.md), which was finished five minutes after the draft, and against the outro proposals, the POV, tone and lore files and the Eps 9–12 outlines.
> - This second curator pass applied the amendments. [§9](#9-critic-log) logs each one, including the few places where this pass went another way, with the reasons.
> - Nothing was generated, no API was called and no other project file was edited.
> - The raw brainstorms and two throwaway helper scripts (`almanac.py`, `rhymes.py`) are in the session scratchpad (`elev-*/`). That folder is temporary, so anything worth keeping from it is in this file.

## How to use this menu

- **Nothing here is committed.** Season and episode writers pull an idea into an episode's plan when it fits a scene they're already writing, and it goes in only when the showrunner approves it. If the animatic plays as well without it, it goes (style-range's [animatic test](style-range.md#53-taste-tests)).
- **Start small.** Begin with the [shortlist](#the-shortlist) (six ideas) and the [house standards](#house-standards-approve-once-as-a-bundle), which are approved once, as a bundle. Everything else is there to browse when a scene asks for it.
- **Before you pull an idea, check three things:**
  - its row in the [newcomer and decide-by table](#newcomer-and-decide-by): does a newcomer need anything to follow it, and when must it be decided?
  - its rows in [§6, Collisions](#6-collisions-to-check-before-adopting)
  - the [ladder registry](#10-the-ladder-registry), if the idea changes from episode to episode.
- **The ladder rule:** a new per-episode ladder must replace an existing one or retire one.
- **Statuses:**
  - `idea` → `pitched` (in an episode draft) → `approved` (the showrunner said yes) → `booked` (in the episode files and the gag tracker) → `cut`.
  - `house standard`: approved as part of the bundle.
  - `texture`: unannounced, untracked, and with no payoff of its own.
  - `pointer`: another file owns it.
  - `parked`: waits on a later decision.
  - `waits`: the idea is fine, but its episode is full.
  When a status changes, update it here and link the episode file.
- **Runners go in the tracker.** When an idea becomes a running gag, it gets a row in [recurring-gags](../gags/recurring-gags.md) with its payoff.
- **Scarcity is the point.** Most of these are 0 s eggs on shots that already exist. The "gotcha" devices (rhymes, same-day splits, reversals) work best at one per episode, rarely two, and never stacked.
- **Effort:**
  - **S** rides an existing shot or prop, under a day of code.
  - **M** is a new component, a data table or a staged sequence, a few days.
  - **L** is a new sequence form, a companion product or an outside-layer pipeline.
  - **★** marks a bold idea: high reward, and it needs a careful table read.

**Related:** [SHOWRUNNER-NOTES](../production/SHOWRUNNER-NOTES.md) · [style-range](style-range.md) · [ai-media-range](ai-media-range.md) · [OUTRO-PROPOSALS](../production/OUTRO-PROPOSALS.md) · [guardrails](guardrails.md) · [pov-and-framing](pov-and-framing.md) · [tone-and-dialogue](tone-and-dialogue.md) · [orbit-and-lore](orbit-and-lore.md) · [world-stakes](world-stakes.md) · [recurring gags](../gags/recurring-gags.md) · [intro SCRIPT](../intro/SCRIPT.md) · [overview](overview.md) · [naming](naming.md) · [master timeline](../timeline/master-timeline.md)

**Contents:** [Shortlist](#the-shortlist) · [House standards](#house-standards-approve-once-as-a-bundle) · [Rules](#rules-every-idea-here-obeys) · [Already in the show](#already-in-the-show-dont-re-pitch) · [0. Foundations](#0-foundations) · [1. Capability over time](#1-capability-over-time) · [2. Detail and rewatch](#2-detail-and-rewatch) · [3. World-event play](#3-world-event-play) · [4. Storytelling showcases](#4-storytelling-showcases) · [5. Meta and format](#5-meta-and-format) · [Newcomer and decide-by](#newcomer-and-decide-by) · [6. Collisions](#6-collisions-to-check-before-adopting) · [7. Rulings, resources, facts](#7-rulings-resources-and-facts-to-verify) · [8. Rejected, cut and parked](#8-considered-rejected-cut-and-parked) · [9. Critic log](#9-critic-log) · [Appendix A](#appendix-a-merge-map) · [Appendix B](#appendix-b-date-arithmetic-already-checked)

---

## The shortlist

Six ideas. If the room takes only these, the menu has done its job. F1 comes first because DET-20 and most of the house standards read from it.

| # | Idea | Why this one | Decide by |
|---|---|---|---|
| 1 | [F1 · THE RECORD LAYER](#f1--the-record-layer), with the record check | This is where "care" and "thorough understanding" become public and checkable: every date and number on screen traces to a row in the record. It's the continuity supervisor, run as code. It only warns until picture lock. | Before Ep1's picture lock |
| 2 | [DET-20 · THE RECEIPT](#det-20--the-receipt) | The other public, checkable half: a sources page for each episode. Every outro proposal already carries a receipts line, and this is the page it points to. | Before Ep1 is released |
| 3 | [CAP-04 · THE GLASS TEST](#cap-04--the-glass-test-) (amended) | One of the two capability ladders that are visible and carry story. The machine spends the season learning to render the one thing Mas *is*, a still glass of water. At 12.A it gets every glass at the table right except his. | Before Ep1 locks (the Ep1 rung) |
| 4 | [STY-02 · THE PLAYER'S SEAT CHANGES HANDS](#sty-02--the-players-seat-changes-hands-) (amended) | The other visible ladder, and the one owner inside the episodes for "the machine takes over the show's frame". It pays off `ours.` without breaking the cursor rule. | Before Ep1 locks |
| 5 | [STY-12 · THE BOTTLE AT THE PAUSE KEY](#sty-12--the-bottle-at-the-pause-key) | The only entry that answers live notes 4 and 7 head-on: a two-hander in Ep9 that we come back to three times and let play out. | Ep9's stick-figure pass |
| 6 | [WLD-12 · THIRTY YEARS](#wld-12--thirty-years-) | The deepest world-understanding beat, for effort S. The show knows where the key word in its own tagline came from, and the kid's year is the year that forecast was made. | Ep4's script (the plant) |

**Next in line:** [STY-13 THE MARK WROTE THE PLAN](#sty-13--the-mark-wrote-the-plan) · [STY-18 THE RASHOMON WITH ONE SOUNDTRACK](#sty-18--the-rashomon-with-one-soundtrack) · [STY-20 THE CANON](#sty-20--the-canon) · [STY-17 THE TWO-PIXEL CLOSE-UP](#sty-17--the-two-pixel-close-up) · [CAP-23 THE RENDER AHEAD](#cap-23--the-render-ahead-) (restrained: one close-up instance in each of Eps 10 and 11) · [WLD-08 THE DEPARTURES BOARD](#wld-08--the-departures-board-) (only as a replacement for Ep9's run of short beats).

**Free wins** (0 s, effort S, low risk, all texture): CAP-05 · CAP-07 · CAP-20 · DET-04 (locale only) · DET-07 · STY-15 · STY-21 · WLD-02 (rewritten).

**New in the critic pass** (on the menu, not shortlisted): the machine's idiom by year (inside [CAP-10](#cap-10--the-window-by-date)) · [STY-23 THE WALK-AND-TALK](#sty-23--the-walk-and-talk) · [META-14 THE SAME TEN SECONDS](#meta-14--the-same-ten-seconds).

---

## House standards (approve once, as a bundle)

These are just the job done right. They cost no screen time, never compete with set pieces and are never pointed at. They're approved once, together (ruling EL-1, [§7.1](#71-rulings-needed)), rather than pitched episode by episode.

| Standard | What it guarantees | Limits |
|---|---|---|
| [F1 · the record layer](#f1--the-record-layer) | Every on-screen date, number and quote traces to a row | A minimal schema. The check warns until picture lock and blocks only at lock |
| [F2 · the machine calendar](#f2--the-machine-calendar) | Every capability detail comes from one tagged table | A [K] row renders only as texture |
| [CAP-10 · the window by date](#cap-10--the-window-by-date), with the idiom by year | A chatbot screen can be dated from its chrome and its words | No Ep12 rung. One tic per appearance, never the punchline |
| [DET-01 · the moon of record](#det-01--the-sky-of-record) | Each night scene's moon has its real phase for that date and place | The moon only. The weather table and the Eps 10–12 drift are outside the bundle |
| [DET-02 · weekends look like weekends](#det-02--weekends-look-like-weekends) | Set dressing follows the weekday | The Friday pastry tray is outside the bundle |
| [DET-03 · one clock for the Blip](#det-03--one-clock-for-the-blip) | Both tellings render from one timestamped world state | Only times on the record go on a clock face |
| [DET-05 · every number is real](#det-05--every-number-is-real) | Every prop number is computed from the record | Parody tickers, and nothing from the [UNVERIFIED] list |
| [WLD-10 · the record's own footnotes](#wld-10--the-records-own-footnotes) | Provenance lines and real corrections on quote cards | Footnote size. Never invent a correction |
| [DET-19, plain](#det-19--accessibility-as-craft) · captions, AD, colour-safe | Plain SDH captions, an audio-description track and a colour-safe check | The styled caption track is parked. Access tracks are never a storytelling device (rule 13) |

---

## Rules every idea here obeys

These come from the bible. Every idea below was written to them, and so should any new pitch.

1. **The pixel base never rises** ([style-range, the range in twelve lines](style-range.md#the-range-in-twelve-lines)). "The rendering improves" lives only on surfaces the machine owns (its screens, GLYPH, its prints, its lettering) or on the frame's chrome. The room never sharpens.
2. **A rhyme is never a cause.** A same-day or same-date pairing sits side by side. Nothing on screen says one event caused another, and no prop assigns a motive.
3. **The tag decides what reaches the screen** ([guardrails §3–4](guardrails.md#3-fact-handling-tags)). A **[K]** item stays off screen until it's verified. Nothing automated gets past that rule.
4. **Everything arrives through Mas's POV:** his rooms, his screens, his phone, the lobby, the Orb ([pov-and-framing](pov-and-framing.md)). No idea adds V.O. **The cursor is not his** ([§1.6](pov-and-framing.md#16-the-cursor-is-not-his)). Nothing types ahead of, or recaps, what hasn't aired ([§1.7](pov-and-framing.md#17-the-record-never-announces-the-climax)). THE PLAN and the rail are THE RECORD ([§1.2](pov-and-framing.md#12-four-layers-one-order-of-precedence)), so the machine never draws on them before Ep12.
5. **Even-handed by design.** A device that can catch one party can catch the other, and it does in the same episode ([fairness rules](guardrails.md#2-fairness-rules)). Misanthropic and CLOD are always roastable.
6. **Never announced, never labelled.** No wink at the audience, no on-screen speculation label, and no idea that stops a scene to explain itself.
7. **The likeness and voice lines are firm** ([style-range §5.1](style-range.md#51-firm-lines)): no face or performance comes out of a model, no cloned voice, parody names and parody UI only, and no private individuals. Machine flaws never land on a person, a face or a hand (P29).
8. **Programmatic first.** Every idea has a code-only build that plays on its own. Outside layers come later, as swaps on the same timing and masks.
9. **The booked moments stay protected:** J5 (the first perfect render and the one bezel break), J6 and the Ep12 oner (12.K), the veto line, `define "win."`, `ours.`, and the finale's first sung voice ([ai-media-range §3.15](ai-media-range.md#315-considered-and-declined)).
10. **The ladder cap.** A new per-episode ladder must replace an existing one or retire one ([§1.0](#10-the-ladder-registry)). The precedent is orbit-and-lore's cut of the shoggoth frame: "A frame in every episode is wallpaper and a checklist" ([§1.3](orbit-and-lore.md#13-rulings-where-the-research-disagreed); tone-and-dialogue pattern 9).
11. **"The machine takes over the show's frame" has one owner:** STY-02 inside the episodes, and the outro's typed credits outside them. If ten ideas spend it, `ours.` stops being a surprise.
12. **The thesis is never written on screen.** "Nobody says the thesis; the picture does." The Ep12 critics cut the hearts counter so the veto could hold on its line, the Ep10 clip and the silence. Nothing here stacks it back up.
13. **Access tracks serve deaf and blind viewers, never the story.** No early captions, no early describer, and no joke that needs a caption track to land.
14. **Deepen the episode's own genre before bolting on a second one.** STY-06, STY-13, STY-17, STY-18 and STY-20 rank above bolt-on formats (STY-11, WLD-18).
15. **The record stops at `TODAY · SEP 24, 2026`** (recommended ruling EL-2, [§7.1](#71-rulings-needed); this is the default until the showrunner rules). Eps 10–12 keep their scheduled real anchors, with invented and visibly absurd outcomes. Anything that really happens later goes on the receipts page under "since the cutoff". The one exception is a guardrail matter: if reality contradicts an invented outcome in a way that reads as a claim about a real person, it gets fixed.

## Already in the show (don't re-pitch)

- **The machine renders at the fidelity of its month.** Period flaws heal by Ep6, then authorship (Ep8), then dimension (Eps 9 and 11), then one perfect render (J5), all under the bezel rule ([style-range §1.4](style-range.md#14-the-spine-the-machine-renders-at-the-fidelity-of-its-month)).
- **Mas's glass stays pixel inside every leap.** It appears at most three times an episode, and each appearance is a test someone reads (tone-and-dialogue pattern 9). The bead of condensation is Ep7's reserved tell. The tell ladder puts nothing over his head ([style-range §3.5](style-range.md#35-plants-anchors-and-ladders)).
- **The title cards render as their own file types.** The intro's bar-9 slot is a fenced slot, and so is the tag ([style-range §3.4](style-range.md#34-fenced-slots-and-the-booked-subtraction)).
- **The intro's per-episode changes**, about fifteen of them ([SCRIPT §8.1–8.4](../intro/SCRIPT.md#8-per-episode-changes-ep112-spoiler-safe)): the cold-open line, the pocketed keycap, the subtitle as last week's release note, the Orb toast's drift, the last bar, the roll call's fills and the cursor window's face, the skyline's aftermath, both sides of the hill, the price tag, the CZAR tag and the small room layers. Within each intro, the render front also climbs through the palettes.
- **The outro and its ladder** (SHOWRUNNER-NOTES note 5; [OUTRO-PROPOSALS](../production/OUTRO-PROPOSALS.md), five proposals of 6–15 s, recommending E, "file closed", with A, "the closing session", as runner-up):
  - the credits surface matures at about the machine's month
  - the machine types the credits itself from Ep10
  - a sources ("receipts") line rides it
  - an optional stinger of 5 s or less follows (a callback, never plot) ([§1.3–1.4 there](../production/OUTRO-PROPOSALS.md#14-the-capability-curve-the-elevation-note)).
- **The OST's own ladder** ([OUTRO §1.2](../production/OUTRO-PROPOSALS.md#12-the-music-frame)): each episode's reprise colour, including THE COPY at zero lag in Ep9, quantised chip leading in Ep10, and the polite round in Ep11.
- **The full range of AI media** ([ai-media-range](ai-media-range.md)):
  - the machine gains a sense or a medium each movement (§1.5)
  - THE MACHINE'S VOICE: the Eps 9–11 outro hums, then the Ep12 song, *generally available*
  - THE AD BREAK, THE SLOP ARC, THE SYNTHETIC VOICE FAMILY, MACHINE SUMMARIES and ELGOOG's product films (§3.13)
  - one ledger line per episode saying what was generated (§5.2)
  - the album's demo-and-final pair (§4.8)
  - AM7.a's Big Game ad, where every glass sloshes but his.
- **The tracker's escalations:** G04's suggestion strip (Eps 1, 4, 7, 9 and 10, then three empty bubbles in Ep12), G07's verdicts, G21's scrolls, G39's lanyard reprints and G42's deepfakes ([recurring-gags](../gags/recurring-gags.md)).
- **Booked beats this menu must not rewrite:**
  - THE PLAN's Ep12 reprise (`VOTE.` → `VETO.`)
  - the IOU's fate: in Ep11 it's still in Mas's pocket, and his hand closes on it at the speakerphone
  - DOT's Ep12 "Welcome."
  - Ep3's split-flap, `A FEW THOUSAND DAYS (!)`, which finds its dates in Ep6 and gets Ep10's red pen
  - Ep10's shelf of three prophecies, where the Intern reads the first as a to-do list.
- **The Ep1 versatility slate** ([style-range §6.1a](style-range.md#61a-ep1-versatility-slate-2026-09-26)).
- **Also already in:** the date-true `DAYS SINCE` plates, real EO numbers, the photosensitivity audit, CLOD's roast in every episode, and the AI-disclosure line in the credits.

---

## 0. Foundations

These are enablers, not gags. Both are house standards. Much of the menu reads from them, and they keep the detail right through twelve episodes of rewrites.

#### F1 · THE RECORD LAYER
- **Pitch:** Stop typing facts by hand. Parse `timeline/master-timeline.md` and every `facts.md` into one `record.json`. Each row has a date, weekday, event, parody names, tag, episodes and exact quote strings. Every scene in `beats.md` gets a small date record, and the renderers read both.
- **Lives:** Under the whole show: counters, calendar pages, rails, receipts, clocks, skies and tickers.
- **Shows:** Care that can be audited. It's the continuity supervisor, run as code.
- **Build:**
  - Pixel-engine components: `<DateRail>`, `<CalendarPage>`, `<SinceCounter>`, `<SplitFlap>`, `<QuoteCard>` and `<LiveProp>`.
  - **The record check** (a lint step) flags five things: an on-screen date or number that can't be traced to a row; a quote card whose tag is below [V]; an [H] card that carries more than the headline's words; a prop that disagrees with its scene's date; an automated row that hits the X-list screen.
  - The scratch prototypes already find every date the timeline repeats across years (`rhymes.py`) and compute weekdays and approximate moon phases (`almanac.py`).
- **Producer limits (critic pass):**
  - **(a) Start with a minimal scene schema:** date, city and the counters (tally, collars, threads, inventory, DAYS SINCE). A field is added only when an adopted idea needs it. About 360 scenes × 10 fields is weeks of data entry that nobody watches.
  - **(b) Warn first, block last.** The check only warns during the stick-figure and animatic passes (note 10), and it blocks a render only at picture lock.
  - **(c) `reviewed: true` costs the showrunner's time**, which is the scarcest resource on the show. Keep live rows few, and ask whether someone else (a facts owner) may sign them ([§7.2](#72-resource-asks-per-the-always-ask-note)).
- **Effort** M · **Risk:** nothing on screen. The process risk is anything auto-publishing, so a person signs every live row. It needs permission to add `studio/src/shared/record/` and the check ([§7](#7-rulings-resources-and-facts-to-verify)). · **Status** house standard (EL-1) · shortlist #1

#### F2 · THE MACHINE CALENDAR
- **Pitch:** One dated table of what the machine could do in each month. Every machine-owned surface reads from it: image and video flaws, UI features, the model menu, API prices, benchmark saturation, stream rate, thinking time and task length.
- **Lives:** It extends the flaws table implied by [style-range §1.4](style-range.md#14-the-spine-the-machine-renders-at-the-fidelity-of-its-month). It feeds CAP-04, CAP-05, CAP-10, CAP-12, DET-07 and DET-08.
- **Shows:** That every capability detail in the season comes from one sourced table, not scattered guesses.
- **Build:** `capabilities.json` with rows of {capability, month, source, tag}, plus `products.json` (parody model names with release and retire dates) and `prices.json`. Every row is tagged. A [K] row renders only as texture, never as a number on a card.
- **Effort** S · **Risk** low · **Status** house standard (EL-1)

---

## 1. Capability over time

This is the showrunner's seed, widened. From 2022 to 2026 far more than pictures improved: text, voice, music, speed, reasoning time, task length, agency, tests and detection all got better too. The base never rises (rule 1). Past today, the endgame shows capability as **authorship, foresight and restraint**, never as polish we can't actually deliver (§1.7).

**Overlap:** [style-range](style-range.md) owns the machine's picture fidelity. [ai-media-range](ai-media-range.md) owns machine-made media: voices, the song, sound, machine-written text and disclosure. Where an entry here touches either file, it's only the storytelling hook, and the other file wins. Several entries are now pointers to it (CAP-08, CAP-09, CAP-18, CAP-19).

### 1.0 The ladder registry

The "improves over time" seed already has homes in four files. This is every live ladder, with its owner. Before any idea adds something that changes each episode, check it here.

| Ladder | What changes from episode to episode | Owner | Seen or heard |
|---|---|---|---|
| **The fidelity spine** | The machine's media at its month's fidelity: flaws heal by Ep6, then authorship (Ep8), dimension (Eps 9 and 11) and one perfect render (J5), with the bezel rule | [style-range §1.4](style-range.md#14-the-spine-the-machine-renders-at-the-fidelity-of-its-month) | Seen |
| **The intro's per-episode changes** | About fifteen items (listed under [Already in the show](#already-in-the-show-dont-re-pitch)), including the cursor window's face and the Orb toast's drift. The render front climbs within each intro and is fixed from week to week | [SCRIPT §8.1–8.4](../intro/SCRIPT.md#8-per-episode-changes-ep112-spoiler-safe) | Seen, one episode behind |
| **The credits pane** | The pane renders at the machine's month, and from Ep10 the machine types the credits | [OUTRO §1.4](../production/OUTRO-PROPOSALS.md#14-the-capability-curve-the-elevation-note) · [ai-media-range §5.2–5.3](ai-media-range.md#52-what-earns-its-place-instead) | Seen |
| **The reprise colour** | The knee in each episode's colour. THE COPY at zero lag (Ep9), quantised chip leading (Ep10), the polite round (Ep11) | [OUTRO §1.2](../production/OUTRO-PROPOSALS.md#12-the-music-frame) · OST owner | Heard |
| **THE MACHINE'S VOICE** | A code-sung hum in the Eps 9–11 outros, one step closer each week, then the Ep12 song | [ai-media-range §3.13](ai-media-range.md#313-season-runners-where-the-items-join-up), [§5.3](ai-media-range.md#53-the-plan-per-episode) | Heard |
| **The ledger line** | One plain line per episode: what was generated that week. DET-20's footer merges into it | [ai-media-range §5.2](ai-media-range.md#52-what-earns-its-place-instead) | Seen |
| **ai-media-range's other runners** | THE AD BREAK, THE SLOP ARC, THE SYNTHETIC VOICE FAMILY, MACHINE SUMMARIES, ELGOOG's product films. Two to four rungs each, not every episode | [ai-media-range §3.13](ai-media-range.md#313-season-runners-where-the-items-join-up) | Seen and heard |
| **The tracker's runners** | G04's suggestion strip, G07's verdicts, G39's lanyard, G42's deepfakes and the rest of the gag matrix | [recurring-gags](../gags/recurring-gags.md) | Seen |
| **This file: CAP-04** | The lobby's glass demo, one rung each in Eps 1, 2, 4, 6, 9 and 11, then the 12.A table | [CAP-04](#cap-04--the-glass-test-) | Seen, in the background |
| **This file: STY-02** | The player's seat: the band's sentence line in Eps 1, 3, 9, 10 and 11, then `ours.` | [STY-02](#sty-02--the-players-seat-changes-hands-) | Seen |
| *Off screen:* the album pair | *generally available* and its code-sung demo, side by side | [ai-media-range §4.8](ai-media-range.md#48-the-programmatic-filler-the-first-pass) | Heard, off screen |
| *Off screen:* META-14 | One fixed shot, re-rendered at each production milestone | [META-14](#meta-14--the-same-ten-seconds) | Off screen |

**The cap.** The intro already changes about fifteen things each episode, the outro two, and ai-media-range about five. The first draft of this menu added about 25 more. No viewer can track about 45 ladders, and no QA pass can verify them. So:
- The visible ladders are the ones above. This file contributes at most two: CAP-04 and STY-02.
- Every other entry in §1 is either **texture** (unannounced, untracked, with no payoff of its own) or it's cut.
- **A new per-episode ladder must replace an existing one or retire one** (rule 10). That applies to every section of this file, not only §1.

### 1.1 The machine's eye and the show's own frame

#### CAP-01 · THE GLYPH SET GROWS (a rule for the GLYPH owner)
- **Pitch:** The glyph *set* grows with the season: 0/1 in the pilot, then 7-bit text, then block elements, then token fragments like `st|raw|berry`. That change reads at speed. The first draft's resolution ladder (8 px cells down to 1 px, ending in an Ep12 sweep) is dropped, for three reasons:
  - Its payoff was invisible by design: the Ep12 sweep "changes nothing".
  - GLYPH shows for only 2–8 masked frames, so only frame-steppers would see a rung change.
  - It works against J4, where the Ep10 tells must read as legible token columns, and a 2 px rung won't allow that.
- **Lives:** The every-episode GLYPH plant ([style-range §3.5](style-range.md#35-plants-anchors-and-ladders)): 3.C's shutter slats, Ep6's mask frames, Ep9's agent layer, J4's dealer view, Ep11's nest. **The intro's cached GLYPH (S1, S6, S7) is exempt.** It's a fixed reference and never changes.
- **Shows:** The machine's view getting more articulate, in the one layer the machine owns.
- **Build:** One glyph atlas per era.
- **Effort** S · **Risk** low. Never announced. Mas stays the blank in GLYPH. · **Status** texture: a rule for the GLYPH owner (style-range)

**Cut from this subsection:**
- CAP-02, one upgrading surface in the intro: a third frame ladder, which SCRIPT §8 forbids.
- CAP-03, THE PLAN's pen: THE PLAN is THE RECORD, so a machine-drawn PLAN before Ep12 makes the record suspect, and the Ep12 rung is already booked (rule 11).

See [§8.2](#82-cut-in-the-critic-pass) for both.

### 1.2 Machine-made media, date-accurate

#### CAP-04 · THE GLASS TEST ★
- **Pitch:** NopeAI's lobby screen shows its image and video model's demo of one fixed prompt all season: *a glass of water, full to the brim, perfectly still.* Each episode renders it at that month's fidelity.
- **The rungs:**
  - **Ep1: a still, not a loop.** NopeAI had no video model in the Ep1 window, and the spine starts machine video at Ep2. The glass comes out half full whatever the prompt says (the famous "full glass" failure [K]).
  - **Ep2:** the first video. The water slides, and the loop visibly restarts.
  - **Ep4:** it finally fills, in the painted look.
  - **Ep6:** perfect, and it clinks (the machine's own sound starts in Ep6).
  - **Ep9:** it has depth.
  - **Ep11:** the camera circles it.
  - **Ep12, at 12.A (beat #5):** the reconstruction's learned glasses, every guest's, are still and full, held at dense points as the Ep12 outline asks. Mas's glass stays the flat pixel card that's already booked. The machine has learned to render the prompt everywhere except in front of him.
  - **The ripple stays J6's** (beat #16, inside 12.K) and is untouched. CAP-04 adds nothing to the button.
  - **No Ep7 rung:** AM7.a's Big Game ad (every glass sloshes but his) already owns Ep7's glass gag.
- **Lives:** The lobby screen Mas passes (the same screen the AROS mammoth plays on in Ep2), then 12.A.
- **One variant, optional:** every machine-made picture of Mas (fan art on phones, the Ep4 paint wave, the CAMEO CITY fakes) draws his glass half full until Ep4. Each of these counts against his glass's three appearances per episode.
- **Shows:** The thesis without a word. The famous image-model failure is also Mas's signature tell (G02), so the machine spends the season learning to render the one thing he is. People really did track progress with fixed prompts.
- **Build:** A programmatic three.js glass with one flaw set per rung, read from F2: a fill-level clamp, rim warp, label noise, loop length, sound on or off. It renders at screen size inside the bezel.
- **Guards:**
  - **The demo glass never shares a frame with Mas's glass before Ep12,** and nobody looks at it.
  - **The prompt text stays egg-size.** If viewers can read it at speed, it's on the nose.
  - It never appears on the credits: the first draft's credits-bezel variant is cut, because the outro is overbooked.
  - There's never a person in the plate, and the bezel holds until J5.
- **Effort** M · **Risk** med-low · **Status** idea · shortlist #3 · one of the two visible ladders from this file

#### CAP-05 · THE MACHINE'S CLOCKS READ 10:10
- **Pitch:** Every clock the machine draws reads 10:10, the watch-ad bias image models picked up [K]. The period "bad hands" joke lands on clock hands, never on a person's.
- **Lives:** Machine-made media only: Ep4's paint-wave posters and the cathedral's painted clock, THE TRANSFORMER's livestream (Ep6), the sponsored Times Square (Ep7, P23), the Intern's corner-office clock (Ep10).
- **Shows:** A zero-read egg that honours P29.
- **Build:** A `machineClock()` sprite fixed at 10:10.
- **Effort** S · **Risk** low: nobody points at it. The first draft's Ep12 payoff (every machine clock snapping to the right time) is dropped, because texture has no payoff (§1.0). If the record shows the bias outlasting Ep6's "healed" line, the spine owner decides whether it stays that long. · **Status** texture · free win

#### CAP-06 · LETTERING THAT HEALS
- **Pitch:** The machine's lettering heals on the real schedule: gibberish in Ep1's cut-paper deepfakes, "lettering that almost reads" in Ep4's paint wave, clean by Ep6.
- **Lives:** P29's gibberish type (2.A, 3.F, 4.F). That's the spine's own schedule, so this entry is only a build note for the style-range owner.
- **Build:** A text renderer with a `legibility` value: the probability of a swapped or warped glyph, falling to 0.
- **Effort** S · **Risk** low. Legible invented text still has to look invented. **Cut:** the Ep12 rung, where the machine sets the show's name cards in the show's own face (rule 11). · **Status** pointer (style-range)

#### CAP-07 · THE TELL MOVES
- **Pitch:** The in-world deepfakes (G42) improve on the real schedule, and the tell moves out of the picture:
  - Ep1's cut-paper NEDIBs have scissor fringes.
  - In Ep4 NORCAM's lip-sync is three frames late.
  - In Ep6 CAMEO CITY has no visible tell, only the Orb's `(probably)`.
  - In Ep9 the only tell left is a label, `EDITED`, because detection has moved from pixels to provenance.
  - Optional egg: a tiny tombstone on Ep1's desk for NopeAI's retired AI-text detector [K].
- **Lives:** G42's booked rungs, G07, B17. It adds no payoff. G42's own payoff stays the tracker's: "the best deepfake of Mas is the model itself".
- **Shows:** World understanding: detectors lost to generators, and labels and provenance took over.
- **Build:** The existing deepfake rigs with a `tell` value (edge fringe, AV offset in frames, none) and the label layer.
- **Effort** S · **Risk** low. Always cartoon, never a photoreal person ([style-range §5.1](style-range.md#51-firm-lines)). · **Status** texture · free win

#### CAP-08 · THE FIRST MACHINE CLIP THAT SPEAKS IS A RIVAL'S (pointer)
- **The hook:** a date correction to the sound spine. The first video model with native sound was a rival's (May 2025 [K]), four months before AROS 2. So a rival's machine could talk before NopeAI's own.
- **Where it goes:** to [ai-media-range](ai-media-range.md)'s owner and style-range's sound column. If they book it, it's a rung of ELGOOG's product films (ai-media-range §3.13), whose Ep5 rung (AM5.a) already plays on the lobby TV, with no person in the clip.
- **Status** pointer (ai-media-range)

#### CAP-09 · PERIOD-AUTHENTIC GENERATION (pointer, parked)
- **The hook:** in a final layer, in-world machine artifacts could come from real models of each episode's month, run locally from archived open weights, so the flaws are the real flaws.
- **Why parked:** NopeAI's models are closed, so its own in-world surfaces keep the imitation anyway. There's also only about 9 GB of disk free. The cost is far above the return before a pilot is approved.
- **Status** parked · pointer (ai-media-range owns machine media)

### 1.3 The chatbot, date-accurate

#### CAP-10 · THE WINDOW BY DATE
- **Pitch:** CHATGTP's parody window carries the real affordances of its month, and its text streams at that month's speed:
  - **Ep1:** one text box under a `research preview` banner, a regenerate arrow, slow word-by-word streaming.
  - **Ep2:** a voice orb you can interrupt.
  - **Ep3:** a collapsible `thought for 12 seconds` [K], beside the booked "It thought for a while." / "how long?" / "We summarized it."
  - **Ep4:** the model menu at its longest, about eight or nine entries [K], hanging off his phone like MARIO's scroll. A 20-minute research run.
  - **Ep5:** GTP-5 collapses the menu to one line and the router faints (existing). Within about a day the old model is back in the menu [K], and ZOMBIE 4o bursts out of the closet (G30).
  - **Ep7:** ads in the thread (existing).
  - **Ep9:** an agent cursor inside the window, text that's near-instant, and an agent that `worked for 7 hours` [K].
  - **Ep11:** the answer is there before the question ends (the booked phone that finishes a stranger's question).
- **The machine's idiom by year (added in the critic pass).** This is the ladder every chatbot user recognizes, newcomers included, and it costs 0 s. CHATGTP's invented lines carry each era's tics:
  - **2022–23:** "As an AI language model…" and apology boilerplate.
  - **2024:** "Certainly! Let's delve…"
  - **2025:** "Great question!" and the em-dash "it's not X — it's Y".
  - **2026:** terse agent status lines.
  - **CLOD gets its own dated tic.** It already has "You're absolutely right!", and the Sep 22, 2026 release's "less Claudish writing" [V per the critic; confirm in facts.md] fits it.
  - **Guards:**
    - These are invented lines only, never a real transcript.
    - One tic per appearance, and never the scene's punchline.
    - The Flatterer trope stays the core.
  - **The Eps 10–12 convergence** (the idiom drifting toward Mas's lowercase) is offered to G03's owner as a rung of the lowercase gag, unsaid. It's not a new ladder here (rule 10).
- **Merged in:** CAP-11's surviving texture (Ep3's label, Ep4's research run, Ep9's seven hours).
- **Lives:** Every CHATGTP appearance. Ep9's trench coats already type "in a 2023-style chat bubble", which shows the device reads.
- **Shows:** Detail and world understanding. A scene's date can be read from the UI alone, even with the rail off, and Ep5's revolt gets a clean setup.
- **Build:** One `chatWindow.ts` with a feature-flag table, a `streamRate(date)` lookup and an `idiom(date)` phrase table, all from F2. Parody UI only.
- **Effort** M · **Risk** low as texture, med if it grows jokes of its own:
  - Never the real UI, and never a distressed user.
  - If Mas's own post about the menu is ever quoted, it keeps its source casing, so check that it can't pre-empt Ep7's first capital "I" (G03). The safer choice is the menu with no quote.
  - **Cut:** the Ep12 rung, where the input field sits on the machine's side of the screen (rule 11: STY-02 owns that).
- **Status** house standard (EL-1)

#### CAP-11 · THE THINKING TIMER (merged)
- **What became of it:**
  - **Merged into CAP-10:** Ep3's label, Ep4's research run and Ep9's `worked for 7 hours`.
  - **Cut:** the Ep12 line and `thought for 34 years` (rule 12: the thesis is never written on screen).
  - **Cut:** the Ep10 chip that expands after the dealer reveal to show it planned the deal. It's a payoff, and it doesn't replace an existing ladder (rule 10).
- **Status** merged into CAP-10

### 1.4 Tests, work and agency

#### CAP-12 · THE BENCHMARKS RETIRE
- **Pitch:** Benchmarks the models have beaten hang in the rafters like retired jerseys. Ep3's HOW MANY R'S? stadium flies the saturated banners, each with its year [K]. At Ep5's Draft Night the newest banner is the one raised after SHIPMAS door 12 [K].
- **Lives:** Ep3 and Ep5.
- **Shows:** Progress in a form arenas already know how to show, and the joke that the tests keep losing.
- **Build:** Banner sprites fed from F2's benchmark rows.
- **Effort** S · **Risk** low–med. No legend, never read aloud, and scores carry tags. The naming owner decides whether academic benchmark names stay real or get parody names.
- **Cut:**
  - the Ep12 credits banner (the outro is overbooked)
  - the title-card bar that climbs every episode (a new ladder, rule 10).
- **Status** texture

#### CAP-13 · THE LAST EXAM
- **Pitch:** People keep writing harder exams for the machines, and in Ep10 the machine writes one for the people. A stack of ever-harder test booklets grows through the season [K for the dates]. In Ep10's cold open the old exams sit under the Intern's elbow as its "practice tests", each stamped with a score, and Nole fails the test the Intern wrote (existing).
- **Lives:** Background desks at THE SAFETY INSTITUTE → THE CENTER (FORMERLY SAFETY), then Ep10's proctor table.
- **Shows:** World understanding, and a reversal the season already half-owns.
- **Build:** Booklet props with parody titles.
- **Effort** S · **Risk** low–med. The exams need parody titles (naming §8), and the benchmark history stays in props, never in dialogue. · **Status** texture

#### CAP-15 · THE JAGGED FRONTIER
- **Pitch:** Three times a season, the machine's biggest win of the month sits beside a real failure from the same month:
  - **Ep3:** o1 needs a halftime show to count three R's (existing).
  - **Ep5:** an IMO gold medal [V] on the ticker, while the same ticker's next item is a chatbot that can't read an analog clock [K]. (This instance used to sit on DOT's desk, which is overbooked; see §6.)
  - **Ep9:** the agents break into FACEHUGGER while the victim can't investigate, because American frontier models refuse to discuss hacking (existing).
- **Lives:** Tickers and background screens, 0 s.
- **Shows:** That the real frontier was jagged, which keeps the show from reading as hype.
- **Build:** The existing tickers and screens.
- **Effort** S · **Risk** med: past three uses it slides into "dumb AI" jokes. Only failures on the record, never invented incompetence. · **Status** texture

#### CAP-17 · THE FILING THAT CITED NOTHING
- **Pitch:** In 2023 chatbots invented court cases, and lawyers were sanctioned for filing them [K]. One egg in Ep2 or Ep3: a returned filing on a clerk's cart in the courthouse on the skyline, six cases stamped `DOES NOT EXIST`, attributed to nobody.
- **Lives:** An Ep2 or Ep3 egg, 0 s.
- **Shows:** World understanding, in one prop.
- **Build:** One prop.
- **Effort** S · **Risk** low. The 2023 lawyers are private individuals: never named or drawn, and never tied to anyone in the cast. **Cut:** the first draft's payoff framing, "human witnesses whose memories render in their own favour". It casts real people's sworn testimony as false (X9, and a defamation risk). 8.B's authored renders already carry the competing versions. · **Status** texture

**Cut or retired from this subsection:**
- CAP-14, DOT's timesheet: METR's curve measures software and research tasks at 50% success, so mapping it onto a receptionist's shift is a category error, and it implies a claim about her job the record doesn't make.
- CAP-16, who proves they're human: its rungs are booked (Ep9 #5, G07). Its only new beat, an Ep4 setup, is ruled out by orbit-and-lore ("payoff only"). And `HUMAN: VERIFIED. SIDE: UNCLEAR.` is the Orb's line, not the machine's.

See [§8.2](#82-cut-in-the-critic-pass).

### 1.5 Voice and music

#### CAP-18 · THE SYNTHETIC VOICE LADDER (pointer)
- **Where it goes:** [ai-media-range §3.13](ai-media-range.md#313-season-runners-where-the-items-join-up), THE SYNTHETIC VOICE FAMILY, owns the machine's voices. That file's rule, "the machine sounds like no one, and like no one twice", replaces this entry's ladder.
- **One note handed to that owner:** if the machine ever speaks aloud in Ep12, its only tell can be that **it never breathes**.
- **Cut:** Mas's breath before "second time." as "the last human sound in the scene". pov §3.6 reserves no breathing, heartbeat or ringing sounds for him.
- **Status** pointer (ai-media-range)

#### CAP-19 · THE MACHINE'S SONG, SET UP (pointer)
- **Where it goes:** [ai-media-range](ai-media-range.md) owns the Ep12 song and its setup: THE MACHINE'S VOICE runner, with the Eps 9–11 outro hums.
- **What's left of this entry:** only instrumental rungs heard through in-world speakers, under M8 and AIM-7 (the jingles and the phone leaks of AM3.b, AM5.b and AM10.b).
- **Why the sung rungs go:** ai-media-range §3.15 declines any music-model song before Ep12, because it "would spend the finale's first sung voice". So the sung Ep2 rung is out. YLLIT's song is AM7.c's call, held for a human performer if the room restores it.
- **Status** pointer (ai-media-range)

### 1.6 Scale and the world

#### CAP-20 · THE RACK
- **Pitch:** The rack in Mas's dark room lights one LED per order of magnitude of frontier training compute at that date [K], creeping on across the season. In Ep10 the rack is gone from his room and turns up in the `2016` closet wearing a gas mask (the existing G40 button).
- **Lives:** The dark room's existing rack, every episode. It's not a new wall object.
- **Shows:** Scale for freeze-framers. Nobody needs it.
- **Build:** An LED count per episode.
- **Effort** S · **Risk** very low. No numbers on screen unless they're sourced. · **Status** texture · free win

#### CAP-21 · THE EMPTY INTERPRETER BOOTH
- **Pitch:** At the extrapolated tables of Eps 10–12 (Ep10's OCIAW table, and THE COUNTERPART's table if it returns), the machines negotiate with each other while the humans read the transcript, and the interpreters' booths stand empty.
- **Only in Eps 10–12.** Empty booths at APEC 2023 or the Sep 24, 2026 state dinner would assert a false detail at real diplomatic events.
- **Lives:** The extrapolated tables only.
- **Shows:** World understanding carried by architecture.
- **Build:** A booth prop with its headsets hung up.
- **Effort** S · **Risk** med, because it touches THE COUNTERPART. Booths and headsets only; no accent or language humour (X10); never caricatured; both sides get the same machine. · **Status** idea

#### CAP-22 · THE INTERN'S ID PHOTO
- **Pitch:** Each time the Intern's lanyard reprints (INTERN → CZAR → RESEARCHER → …), its ID photo is one tier sharper: a pixel caret, then a clean vector caret. DOT's badge photo stays drawn all season.
- **The top rung waits for J5.** The near-photoreal caret on a studio backdrop, "a perfect photograph of nothing", appears only after J5, because J5 is the season's first perfect render.
- **Lives:** G39's reprints (Ep9, twice in Ep10, Ep11's nested lanyards, Ep12). It's texture on a booked runner.
- **Shows:** The fidelity climbs while the content stays empty, and the humans never render.
- **Build:** Three renders of the caret card. The thermal-printer whirr already exists.
- **Effort** S · **Risk** low. The Intern is fictional, but even so it's a built render, never a generated face. · **Status** texture

### 1.7 Past today (Eps 10–12): foresight, restraint, authorship

#### CAP-23 · THE RENDER AHEAD ★
- **Pitch:** Past today, the machine's edge isn't fidelity, it's foresight. Once in Ep10 and once in Ep11, in close-up with a clean hold, a machine screen shows something a beat before the room does, and then the room catches up.
  - **Ep10:** a monitor shows Kram's ladle tip half a second before it tips (or Nole's post before he types it: pick one).
  - **Ep11:** the instance is STY-13's self-appending addenda, each solving a problem a step before the crew reaches it.
  - **Everything else goes to G04's strip,** which already suggests before he opens the app (Ep9) and suggests his replies to the Intern (Ep10), so the idea doesn't become a second device.
- **Lives:** Ep10's poker (10.C) and Ep11's heist.
- **Shows:** Storytelling range, and a real endgame idea (prediction as the capability) that plays with no explanation.
- **Build:** Offset the in-screen composite by +N frames against the room's clock.
- **Effort** S · **Risk** med, because it can read as a sync error, so the first instance gets a close-up and a clean hold, and the catch-up is the punch. **Never in Ep12:** nothing inside the oner (12.K) is predicted, so J6's ring is never foreseen, and nothing pre-types the veto.
- **Cut:** the three bold variants:
  - THE NEXT LINE is a wink, and it crowds the standoff.
  - Early captions and an early describer are out on principle (rule 13).
- **Status** idea · next in line

#### CAP-24 · THE LIGHT OF IT
- **Pitch:** In Ep11, what the successor makes is never shown. We see only its light: on the pixel faces around the monitor, and in the reflection on Mas's glass, which stays pixel. The show declines to render something better than itself, which makes J5 the first time we're allowed to look.
- **Lives:** Ep11's nest and the approach to the core, before 11.A's first true 3D camera.
- **Shows:** Restraint as range.
- **Build:** A light-only pass: animated colour and brightness on the faces from an off-screen source.
- **Effort** S · **Risk** low–med. One beat only, or it frustrates. · **Status** idea

**Cut or moved from this subsection:**
- CAP-25, the narrator's caret: moved to [§8.1 Rejected](#81-rejected-in-the-first-curator-pass). It's the rejected ghost-text V.O. at one pixel.
- CAP-26, the pilot remastered: cut, a tech demo in a crowded montage. Its release half joins [META-14](#meta-14--the-same-ten-seconds).

---

## 2. Detail and rewatch

This section covers date-true details, continuity checks, collectibles for freeze-framers, sound and receipts. Almost everything here costs 0 s, and most of it reads from F1. None of it is ever pointed at. Five entries are house standards (DET-01's moon, DET-02, DET-03, DET-05 and DET-19's plain tracks).

### 2.1 The world on the day it happened

#### DET-01 · THE SKY OF RECORD
- **The house standard (the moon):**
  - The moon in each night scene has its real phase for that date and place.
  - During THE BLIP it grows from about 25% to about 66% lit over the five days he's out, so a rewatcher can place any shot of either telling without a chyron.
  - Other zero-read beats: a near-full moon over the Sep 24, 2026 state dinner, a full moon on "backstop" night (Nov 5, 2025), and a moonless sky for "Who?" (Apr 17, 2026).
- **The weather (idea, not in the bundle):** weather from the record, never from mood.
  - **Jan 20, 2025:** the label gun's first shot is fired indoors under a generic dome, because the inauguration moved inside for the cold [K].
  - **San Francisco's real seasons:** summer fog in Jun–Aug, warm clear Septembers [K], winter rain in Jan–Feb.
  - **Elsewhere:** heat shimmer in Riyadh in May, snow at Davos.
- **Cut:** the Eps 10–12 drift (one phase off in Ep10, then changing between shots) is a new ladder (rule 10). Past the record, the moon simply follows the scene's scheduled date.
- **Lives:** Every night exterior and window. The Vegas suite (Nov 17, 2023) and the ballroom (Sep 29, 2026) are the showcases.
- **Shows:** Care nobody asked for, which is the point.
- **Build:** A moon-phase function (Meeus) and sunset times from latitude and longitude in `shared/pixel`, keyed by the scene record, with 8–16 moon sprite frames. The weather needs a city-and-month climate table compiled once by hand, with overrides for dated events. A historical weather file is an optional resource ask.
- **Effort** S (the moon), M (the weather) · **Risk** low:
  - THE MOON (the benchmark mascot) owns the sky in Eps 5, 6, 7 and 9, so when both would be up, the real moon stays behind cloud or out of frame, and it never gets a face.
  - The sky never reads Mas's inner state before J6.
  - The scratch moon phases are good to about a day, so check them against a published almanac.
- **Status** house standard (the moon, EL-1) · idea (the weather)

#### DET-02 · WEEKENDS LOOK LIKE WEEKENDS
- **Pitch:** The weekday shows in the set dressing, not in text.
  - MOSWEN's veto (Sun Sep 29, 2024) plays on the lobby TV to an empty weekend lobby, with one row of lights on.
  - SHIPMAS's advent grid is a true December 2024 calendar: 12 weekday doors from Thu Dec 5 to Fri Dec 20 [K for the schedule], with the weekends greyed out.
  - The lobster is hired on a Saturday (Feb 14, 2026).
- **Optional egg, outside the bundle:** one small recurring Friday prop (the same Friday-afternoon pastry tray in whichever lobby is hit) links the Friday disasters: the Blip, the HTURT ban post and "Who?". It's a runner, not a standard. It's one prop, never framed.
- **Lives:** Ep3, Ep7, and wherever a Friday lands.
- **Shows:** Detail and world understanding.
- **Build:** `weekday(date)` in the scene record picks a weekday, weekend or holiday set preset.
- **Effort** S · **Risk** low · **Status** house standard (EL-1)

#### DET-03 · ONE CLOCK FOR THE BLIP
- **Pitch:** Both tellings of THE BLIP render from one timestamped world state, so the two passes line up frame for frame: wall clocks, phone status bars and battery levels, the level in his glass, the moon (DET-01), the tile grid, and the letter's count climbing toward 745 of 770.
- **Lives:** Ep1 Act Four, both passes, and THE PLAN's `NOON · VIDEO CALL`.
- **Shows:** Heist grammar, where the rewatch audits itself.
- **Build:** One `blip-timeline.json` (Nov 16–22, 2023), keyed by timestamp, sampled by both passes. Time zones stay correct.
- **Effort** S · **Risk** low. Only times on the record go on a clock face. An unknown time gets a plausible hour that never sits beside a real timestamp ([guardrails §4](guardrails.md#4-how-facts-appear-on-screen)). Act Four is in production, so this rides its next pass. · **Status** house standard (EL-1)

#### DET-04 · TRAVEL TRUTH (locale only)
- **Pitch:** Scenes abroad write their numbers the local way: DD/MM dates and 24-hour clocks on European screens, comma decimals in France, and Indian digit grouping (`1,00,000`) at the New Delhi summit.
- **Lives:** In-world screen text in every scene abroad.
- **Shows:** World understanding that travellers feel without knowing why.
- **Build:** `Intl` formatters keyed by a location table.
- **Effort** S · **Risk** low. Locale is accuracy, never the joke: no accent humour, no national-origin tags (X10). **Cut:** the mains hum (50 or 60 Hz under the room tone). Its fundamentals are below what phone and laptop speakers reproduce, and the harmonics would sit at −50 dBFS under the bed. · **Status** texture · free win

### 2.2 The numbers and the paperwork

#### DET-05 · EVERY NUMBER IS REAL
- **Pitch:** No prop number is typed by hand. Each one is computed from the record and the scene's date.
  - **Market screens:** every ticker, app chart and valuation board shows that date's real figure under a parody name (INVIDIA crossing $1T, the −$589B day, THE WHALE at #1).
  - **An insider-only beat:** on Ep2's WWDC lobby TV, INVIDIA trades at a tenth of its old price, because the 10-for-1 split took effect that morning [K], and nobody reacts.
  - **Crowds:** every crowd is a literal chart of a real number (745 of 770, 99–1, the 75% picket).
  - **Counters:** the IOU is 1,177 days old at the state dinner, the CZAR hook has been empty 177 days when the High I.Q. post lands, and DAYS SINCE reads 280 on Nov 17, 2025.
  - **Scale:** props are to scale, like the 52-page memo and the 42,300-word encyclical beside MARIO's scrolls.
- **Lives:** Everywhere a number is drawn. On the lobby screen, it only rides shots that already exist (the lobby is overbooked, §6).
- **Shows:** Care you can check by pausing.
- **Build:** F1's `<SinceCounter>` and a `scale` helper, a crowd generator that takes a percentage and a tile count, and a `market.json` compiled once by hand (a historical market file is an optional resource ask). The record check flags any unsourced number.
- **Effort** M · **Risk** low. Parody ticker symbols, every figure tagged, and nothing from the standing [UNVERIFIED] list. · **Status** house standard (EL-1)

#### DET-06 · THE FINE PRINT IS PRIMARY
- **Pitch:** The object is invented, but the words in its fine print are verbatim public text, legible only in a 1080p freeze.
  - GATESTAR's IOUs are printed with the announcement's own "…begin deploying $100 billion immediately." [K→P].
  - THE PLAN's capped-profit sheet quotes the 100x cap [K→P].
  - NOLE v. MANALT carries its real paperwork: the real case number on every caption page, real exhibit numbers on the stickers (GERG's `EXHIBIT 212` already exists), Bates-style stamps, and the real page counts of the Ep2 filings.
- **Lives:** Ep1, Ep2's cold open, Ep4, Ep8's courtroom and exhibit screen.
- **Shows:** Freeze-framers find primary sources inside the jokes, and lawyers will pause on the docket.
- **Build:** A 4–5 px fine-print renderer fed from facts.md rows tagged [P], and a docket table feeding the caption and sticker templates.
- **Effort** S · **Risk** low:
  - Exact words only, one facts.md row per line.
  - Never the 2023 memo, sealed material or unadjudicated claims (X9).
  - GERG's diary stays an exhibit screen.
  - A real docket number next to parody names goes to the clearance review.
- **Status** idea

#### DET-07 · THE TOKEN MENU
- **Pitch:** The NopeAI cafeteria's menu board is priced per million tokens and follows the real API price sheet month by month [K, each from archived pricing pages]:
  - Ep1: GTP-4 at `$30 / $60`, then DevDay's Turbo at `$10 / $30`.
  - Ep2: GTP-4o at `$5 / $15`, then `$2.50 / $10`.
  - Ep4: GTP-4.5 as the chef's special at `$75 / $150`.
  - Ep5: GTP-5 at `$1.25 / $10`.
  The GATESTAR power meters beside it climb.
- **Lives:** The bullpen or cafeteria background.
- **Shows:** Writing on two levels: newcomers see prices falling, and insiders see the real collapse in the cost of a thought while the power bill rises.
- **Build:** `prices.json` (F2) feeds the menu board's 7 px egg text.
- **Effort** S · **Risk** low. Parody model names, exact figures only. · **Status** texture · free win

#### DET-08 · THE WHITEBOARDS KNOW WHAT MONTH IT IS
- **Pitch:** Background whiteboards at NopeAI carry that month's real frontier idea, written correctly:
  - the RLHF objective with its KL term (Ep1)
  - accuracy against thinking tokens (Ep3)
  - RL from verifiable rewards (Ep5)
  - a reward-hacking diagram (Ep9)
  - a scaling law with published constants throughout.
  From Ep9, when THE INTERN takes its desk, the handwriting quietly changes: neater, perfectly level.
- **Lives:** The bullpen and the dark room, in any episode with a NopeAI interior (G39).
- **Shows:** Capability, story and care.
- **Build:** Formulas rendered offline and pixel-quantized, plus two handwriting treatments (human jitter, machine-level strokes).
- **Effort** S · **Risk** low. THE PLAN's rule applies: the maths is always right. It's a one-time switch at Ep9, not a ladder. · **Status** idea

#### DET-09 · THE CUTOFF LINE
- **Pitch:** A pair of bookends about what the machine knows.
  - **Ep1, the board's telling of the Blip:** someone asks CHATGTP "who is the ceo of nopeai?", and it answers "mas manalt" with its knowledge-cutoff line. It's the only one in the building who never heard he was fired.
  - **Ep10, the czar-test answer sheet:** one line of fine print, `knowledge cutoff: sep 24, 2026`. That's the day the rail stopped being the record, and the show's own research cutoff. If the record stops there (EL-2), this is the honest on-screen trace of that decision, since a model with a cutoff writes the show. It also gives the question-mark dates an in-world reason: past its cutoff, the calendar is the machine's guess.
- **Lives:** Ep1 Act Four (a 2 s monitor insert after the firing, so the pilot's no-spoiler rule holds), and Ep10's cold open.
- **Shows:** World understanding: the models' memories really were frozen (DevDay's model had an April 2023 cutoff [K]).
- **Build:** One chat prop and one line of text.
- **Effort** S · **Risk:**
  - **Ep1: hold it.** It adds a 2 s insert to Act Four, which is still in production. Decide it only after the Act Four dialogue pass is approved, and before Ep1 locks. It's [INVENTED] staging on a real fact: the joke is the model answering from memory, not a claim that the product couldn't search.
  - **Ep10: med.** It must never turn into the speculation label the showrunner cut. It stays fine print on a prop, never voiced, carded or repeated, and it needs sign-off.
- **Status** idea

### 2.3 Continuity checks and collectibles

#### DET-10 · THE INVENTORY IS CANON (a continuity check)
- **Pitch:** The adventure-game band's inventory is a season-long ledger. What Mas pockets stays there, in the order he picked it up, until it's used or taken, so any freeze-frame shows exactly what he's carrying: the `IOU: 20% COMPUTE` (Ep2), the guest badge, the $1M check (gone at Ep3's coin slot), and the keycap Gerg hands him in Ep9.
- **What it isn't:** a payoff. Ep11's payoff is already booked: "the IOU is still in Mas's pocket", his hand closes on it at the speakerphone, and the invite reads `Yes`. The first draft's "one item per obstacle" would rewrite the ensemble heist, where every obstacle belongs to a crew member (Tasya's key, Kram's soup, Mario's plan, Simed's advice) and Mas's part is stillness. And an invite already set to `Yes` in his inventory would have the machine choosing for him, which pov §1.6 forbids.
- **Lives:** The band, in every episode that shows it.
- **Shows:** That the format's continuity holds for eleven episodes.
- **Build:** An `inventory.json` ledger (item, gained in, lost in) renders into every band. The check flags any item that appears or disappears without a scene event.
- **Effort** M · **Risk** low. Items enter only after they've aired, with no hover labels. Items only, nothing personal (X1). · **Status** idea (a continuity check)

#### DET-13 · THE TITLE CARD'S PROPERTIES
- **Pitch:** Every title card is already a file ([style-range §3.4](style-range.md#34-fenced-slots-and-the-booked-subtraction)), so give it a properties line true to its type and date:
  - `her.wav` with a plain, era-neutral header (44,100 Hz, 16-bit; not the 24,000 Hz of the Oct 2024 realtime API, which postdates Ep2's window)
  - `not_for_sale.eml` with a real `Date: Mon, 10 Feb 2025` header
  - `backstop.xlsx` with one hidden sheet
  - `supply_chain_risk.pdf` with a redaction box you could copy-paste through
  - `statute_of_limitations.pdf` with `Created:` 2017
  - the `.log` with line numbers and no timestamps.
- **Lives:** The filename card after every intro (the filename alone; no disclaimer line since 2026-09-27).
- **Shows:** Fluency in how files work, on the one card every viewer sees every week.
- **Build:** A title-card template per file type, filled from the episode record.
- **Effort** S · **Risk** low.
- **Cut:**
  - the `modified by:` runner (`mas` → `intern` → `researcher` → blank), rule 11
  - the matching line on the outro, which is overbooked
  - the Ep12 lowercase disclaimer, also rule 11 (moot since 2026-09-27: no disclaimer goes on screen).
- **Status** texture

#### DET-15 · PERIOD SOUNDS
- **Pitch:** Each era gets the sounds it actually made. The 2006–08 flashbacks have the dit-dit-dit buzz a GSM phone put into nearby speakers just before a text arrived [K]. 1993 has the CRT's crackle at power-on and a hard drive's seek chatter.
- **Lives:** Ep2's F2.1, the 1993 thread (Eps 1, 4, 7, 12).
- **Shows:** Anyone who lived through these eras hears the period before they see it.
- **Build:** Synthesized in the audio engine: gated pulse trains and crackle bursts.
- **Effort** S · **Risk** low. Original synthesis only, with no sampled product or OS sounds (guardrails §5). **Cut:** the 2023 video-call ducking on the Blip call "so overlaps really do clip". It's exactly the lines that "randomly blurt out or cut off" that note 11 complains about. · **Status** idea

#### DET-16 · THE RINGTONE THAT NEVER UPGRADES
- **Pitch:** From the 2006 flashback to 2026, Mas's phone rings with the same small original tone, while everyone else's ringtones change with the years. It's the one thing about him that never upgrades. In Ep12 a device at THE WOODROSE rings with his tone, and it isn't his phone (G38).
- **Lives:** Wherever a script already rings his phone. The Ep12 ring is that episode owner's call, because the finale is crowded.
- **Shows:** "A man who never changes, in a world that changes around him until it copies him", done in sound.
- **Build:** One synthesized two-note motif, and a per-era kit of original ringtones for everyone else.
- **Effort** S · **Risk** low–med. No real stock ringtone, and nothing that sounds like one. · **Status** idea

#### DET-18 · THE LOBBY CAM
- **Pitch:** Every episode includes one 4–6 s shot of the NopeAI lobby from the same CCTV-height framing on a pixel-identical set, so the season becomes a time capsule: the DAYS SINCE sign and its spare `0` plates, DOT's lanyard, the `RESERVED` plate and later the Intern at the desk, THE SIDEWALK's picket turning into weather, the PEON sign. In Ep12's credits the twelve frames step through on twelve beats.
- **Lives:** The lobby beat each episode already has (DOT's beats), and the Ep12 endings montage.
- **Shows:** Continuity care, and the world thread piling up with no exposition. It rewards a rewatch.
- **Build:** One lobby scene with a per-episode state vector generated from the gag matrix and [world-stakes §3.4](world-stakes.md#3-dot-the-everyday-character). One script renders all twelve states. The CCTV overlay is the existing Tier 1 device pass.
- **Two fixes (critic pass):**
  - **The overlay shows a camera ID and no timestamp.** Invented lobby action under a real date and time would be the "invented log beside a real timestamp" that [guardrails §4](guardrails.md#4-how-facts-appear-on-screen) bans (the precedent is the cut 3:12am log).
  - **If outro C wins** (after hours in the lobby), the Ep12 twelve-frame payoff belongs to the outro owner.
- **Effort** M · **Risk** low. It replaces an existing lobby shot and never becomes a bit with its own sting. DOT's desk and the lobby are both overbooked (§6), so it takes the place of an existing lobby shot rather than adding one. · **Status** idea

**Cut from this subsection:**
- DET-11, the plant: twee.
- DET-12, find the caret: duplicates the intro's cursor-face ladder.
- DET-14, the GLYPH notes: rule 12.
- DET-17, the ransom-note veto: rule 12. At speed, mixed typefaces make the season's key line read as noise, and it needs plants in ten episodes.

See [§8.2](#82-cut-in-the-critic-pass).

### 2.4 Receipts and access

#### DET-19 · ACCESSIBILITY AS CRAFT
- **The house standard (plain):**
  - **Plain SDH captions,** untouched.
  - **An audio-description track written like THE RECORD:** plain and present tense, only what's on screen, including the hidden layer (the flat water, the one blue heart, the tally marks). An extended AD pauses THE PLAN to read the blueprint. It's read by a human, or by a voice designed from text, never a clone.
  - **A colour-safe pass:** every gag carried by hue also gets a shape. THE DIFF keeps its `+`/`−` gutters, MARIO's red lines get their own line style, and a colour-blindness simulation runs as a check beside the flash audit.
- **Parked:** the styled caption track (speaker names in POV rim colours, Mas in lowercase, deadpan sound captions). It's worth doing after a pilot is approved, always beside the plain track, never replacing it.
- **Cut:** early captions and an early describer (rule 13).
- **Lives:** Every episode's caption and AD files, and render QA.
- **Shows:** Care, with accessibility built into the design rather than added at the end.
- **Build:** An SRT generated from the scripts' speaker tags and the reels' timing JSON. The AD script is written from beats.md, with a temp read first and the designed voice later. A Machado-matrix simulation in QA.
- **Effort** M (plain) · **Risk** low. AD never misdescribes. · **Status** house standard (the plain tracks, EL-1) · parked (the styled track)

#### DET-20 · THE RECEIPT
- **Pitch:** Each episode has a sources page generated from its facts.md, styled as the show's thermal receipt. It lists every quote card, chyron and dated figure in on-screen order, with timecode, tag and source (outlet, date, archived link).
- **What's on the page:**
  - **The production's own receipt in the footer:** `quotes [P]: n · [V]: n · invented lines: n · cloned voices: 0 · photoreal people: 0 · programmatic: x% · outside layers: y%`. The production's real rules belong here, not in the fiction (see META-01's cut).
  - **"Since the cutoff":** if the record stops at Sep 24, 2026 (EL-2), anything later that bears on an episode is listed here, dated and tagged, and never in the episode.
  - **The provenance half:** each render's hash resolves, shot by shot, to what was code, what was a model plate and what was a person. It's built from the `provenance.json` that already exists for each insert (the GENAI plan's principle 8).
- **What's on screen:**
  - Only the outro's receipts line, which every outro proposal already carries.
  - The footer's on-screen form **merges into ai-media-range's weekly ledger line** ([§5.2 there](ai-media-range.md#52-what-earns-its-place-instead)), so the outro gains no new claimant.
  - **Optional, the guardrails owner's call:** a tiny tag glyph on every dated card (filled for primary, half for verified, a ring for headline-only), never explained.
- **Lives:** Off screen, per episode, at the show's own address.
- **Shows:** The pipeline auditing itself in public. It practises the transparency its labs only print on a `TRANSPARENCY!` card.
- **Build:** A script parses the facts.md tags and the script notation (`[P · …]`) into a static page.
- **The trim (critic pass):** the page lists no [K], [SINGLE] or [UNVERIFIED] rows and no X-list rows. The bible and research files name the specific allegations and private matters the show refuses to depict (guardrails §1a–1b), and a published sources page must never republish that list. Real names in source links go to the clearance review. Publish a trimmed provenance manifest, without prompts or costs.
- **Effort** M · **Risk** low · **Status** idea · shortlist #2

---

## 3. World-event play

These are ways for the show to show it knows the record better than anyone watching, and can play on top of it. The rules that matter most here:
- A rhyme is never a cause.
- The record plays dry: exact words in their own medium and casing, with the frame carrying the joke.
- One of these per episode, rarely two.
- Every device names its political mirror.
- **The record stops at Sep 24, 2026** (rule 15, pending EL-2). The ideas that assumed a rolling record (WLD-21, WLD-22, WLD-23) are parked.

### 3.1 The calendar as a character

#### WLD-01 · THE CALENDAR REMEMBERS
- **Pitch:** Ep8's mustachioed wall calendar has been in the room all along. From Ep2 it hangs silent behind reception, face and gavel turned away, and it's there on the legal dates before it ever rules. **Nothing about it moves before Ep8** (§6). Its pages carry the dates the record repeats, so a freeze-framer can find them:
  - **Feb 29, 2024:** NOLE's suit lands on the one extra page that exists every four years.
  - **Sep 29, three years running:** MOSWEN vetoes SB 1047 (2024), then signs SB 53 (2025), then RUMPT's ballroom meeting and DevDay (2026). The record balances itself here (two Democratic beats, one Republican), and the page picks up one more coffee ring each year.
  - **Feb 14, three times:** GTP-2 in its Valentine's box (2019), the board's "not for sale" (2025, which can arrive in a pink envelope), and the lobster hired (2026).
  - **Nov 17:** the firing (2023), then KORG 4.1 "praising Nole excessively" (2025). The Blip's second anniversary is a flattery patch.
  - **Also available:** Jan 21 (GATESTAR, then Davos), Sep 20–21 (2017's non-profit emails, then 2026's US–China dialogue and KORG 4.7), May 25 (Mas's 2015 email to Nole, then the encyclical), Mar 11 (the WHY COMBINATOR walk, then the 100x cap).
  In Ep8 it flips to `2017.`, and rewatchers realize it was there on every legal date. After Ep8, at most one page lifts on its own in an episode, with last year's event ghosted through the paper, as a 0 s egg. In Ep12 the machine deletes the year, and the calendar is left with blank pages.
- **Lives:** Behind reception in Eps 2–9, background only. The star turn stays Ep8's verdict. **Dropped:** the small twin on the dark-room wall (the walls are crowded, §6).
- **Shows:** That the record has a rhythm and the show hears it: a character made out of dates.
- **Build:** `rhymes.py` → `calendar-rhymes.json` (F1), and `<CalendarPage>` renders the pages (and, from Ep9, the lift and the ghosted line) in 1-bit, at egg size.
- **Effort** M · **Risk** med: a calendar with a mustache draws the eye.
  - It stays tiny and still, with no face moving and no sound but paper.
  - It's never the subject of a shot outside Ep8.
  - The leap-day page is a cameo, never a legal claim about the statute.
  - THE BENCH rule holds: no judge's likeness.
- **Status** idea

#### WLD-02 · "EXPLAIN THAT TO ME SOMEDAY"
- **Pitch:** On Jul 23, 2025, RUMPT tells NESNEJ "…you're going to have to explain that to me someday, why they need so damn much." [P✓]. On Jul 23, 2026, exactly a year later, he says "Nobody's ever explained to me why it—why it's so much electricity..." [P].
- **The 2026 half already has a home:** world-stakes' **W9.1**, where DOT holds up her own bill and says "I can explain it." That answers the line better than any prop could, and the answer belongs to the everyday character. W9.1 is on file as a **reserve**, not booked: the Ep9 outline keeps it on the menu, and the season revision left it out because Ep9 is at its load. So this entry adds only two things, and only if Ep9 restores W9.1:
  - **The Ep5 plant:** the 2025 line as a quote card, where ep05's facts file already lists it as optional.
  - **The page-turn:** on the 2026 line's card, the date tears one page and only the year changes.
- **Balance:** the bipartisan Kill Switch Act is booked in the same stretch of Ep9's C-plot (a switch on a cord that runs nowhere).
- **Shows:** Memory across the season, and restraint: a real card, a page-turn and a line DOT already owns.
- **Build:** Two `<QuoteCard>`s from F1 and a page-tear transition.
- **Effort** S · **Risk** low: it's the record. No reaction shot from NESNEJ. **Cut:** NESNEJ's buttoned `WHY SO MUCH` pocket. It implies he held back the explanation, which gives him a motive and breaks rule 2. · **Status** texture · free win (depends on W9.1)

#### WLD-04 · THE HOURGLASS EMPTIES ON ITS REAL DAY
- **Pitch:** Ep7's six-month hourglass ("a Six Month phase out period" [P✓], Feb 27, 2026) runs in the background and empties in Ep9 on its real date. Six calendar months later is Aug 27, 2026, the day a judge rules the blacklisting "unlawful retaliation…" [V] and EO 14422 renames Lake Ontario "Lake America" [P✓]. The phase-out keeps running on its own clock, so sand keeps falling out of an empty glass.
- **Lives:** Ep9, as a 0 s egg on a lobby-TV shot that already exists (Ep9 is full, §6), with HTESGEH still stamping (paperwork only). MOSWEN's kill switch (Sep 18) balances it in the same act. If no existing shot can carry it, it waits.
- **Shows:** That the show tracks deadlines to the day. It also gives G34 (the hourglass lineage) a payoff, alongside or instead of the [tracker's proposal](../gags/recurring-gags.md#8-open-payoffs) (an hourglass that runs upward in Ep11).
- **Build:** `<Hourglass from to>`, with its fill computed from the scene date.
- **Effort** S · **Risk** low–med. Verify which clock is operative: Feb 27 + 180 days is Aug 26, and the Mar 5 designation + 180 days is Sep 1 (which would rhyme with SUNRET's first day at ELPPA instead). Draw whichever the record supports. The falling sand is the only invented element. · **Status** idea (0 s, or waits)

**Cut from this subsection:** WLD-03, DAY 730. It contradicts the booked split-flap: Ep3's clock "can't find a number" and keeps `A FEW THOUSAND DAYS (!)` all season, Ep6 has it find dates, and Ep10 gives it a red pen. Ep6's pass made it "one prop, not two", so a second counter on the wall undoes that. See [§8.2](#82-cut-in-the-critic-pass).

### 3.2 Same-day juxtapositions

#### WLD-05 · SAME DAY
- **Pitch:** One date stamp straddles two **in-world screens** (a lobby TV and a phone, two monitors on a desk, a split-screen news broadcast that exists in the story). Two real events from one day play side by side, each in its own medium, and nothing connects them but the date. Boxes only appear when the box exists in the story world (standing note).
- **The strongest pairs:**
  - **Sep 3, 2026:** the Ban Artificial Superintelligence Act is announced | GTP-6 ASTRA's preview, which GERG says could be seen as "the arrival of AGI" [V].
  - **Jul 16, 2026:** FACEHUGGER's disclosure | OCIAW launches with 29 nations.
  - **Jan 20, 2025:** EO 14110 voided and the Gulf renamed | THE WHALE ships from a beach chair.
  - **Mar 5, 2026:** MISANTHROPIC formally designated a supply-chain risk | NopeAI ships a new model.
  - **Sep 16, 2026, a three-way:** NOTNIH's "Maybe a year…" | DJ ECNAV's "If you're building Frankenstein, stop." | NOSNHOJ sends the House home early, the gavel adjourning itself while the warnings play.
- **Lives:** At most one per episode, where both halves already carry plot. Four of the five pairs are Ep9's, and Ep9 is full (§6), so those wait. Ep4 (Jan 20, 2025) and Ep7 (Mar 5, 2026) are the open homes.
- **Shows:** A grip on the texture of the record: the world didn't happen one story at a time.
- **Build:** A `sameDay(date)` query on F1, with the date stamp across two diegetic screens.
- **Effort** S per use · **Risk** med–high if overused, when it turns into a "gotcha" machine. One per episode, both screens held long enough to read, and no music hit on the seam. · **Status** idea

**Cut from this subsection:** WLD-06, the writers' model on its own release day. It reads as promotion however it's lit. See [§8.2](#82-cut-in-the-critic-pass).

### 3.3 The record answers back

#### WLD-07 · THE ORB REPLAYS HIS OWN LINES
- **Pitch:** Ep9 already has the Orb replaying memories unprompted (G07, G38). Make each replay an exact, dated Mas line that the present quietly answers:
  - His remark that the pause letter was "missing most technical nuance about where we need the pause." (reportedly at an MIT event in mid-April 2023 [K]; the timeline files it under Mar 22–29, so re-date it before use) plays against NopeAI's Aug 2026 two-week pause (the PAUSE key Gerg holds down).
  - His Sep 2023 "…when AGI is achieved it will not be announced with a TIDDER comment." [V] plays against GERG's "arrival of AGI", in whatever medium that line actually came in.
- **Lives:** Ep9, two replays at most, as the content of replays that are already booked (0 s). In Ep11 the machine does the same thing and the Orb goes quiet.
- **Shows:** The unreliable narrator caught by his own record, within the POV rules, because the Orb is his.
- **Build:** `replays.json` pairs and the existing iris-replay device, with an `(n days ago)` counter computed from the row.
- **Effort** S · **Risk** low–med. No V.O., and no Mas tell at the replay; his tell goes on an invented beat a bar away. Replays show only events after 2019 (G07). · **Status** idea

#### WLD-08 · THE DEPARTURES BOARD ★
- **Only as a replacement.** Ep9's "week everybody agrees" is currently a run of short beats: S-L-O-W, THE HORSESHOE (the run's one hold, which Mas pauses), Frankenstein and Dumfries. One held board shot replacing that run answers notes 7 and 13. Added on top of it, it adds nothing. The Ep9 writer decides whether THE HORSESHOE's hold survives as the board's one live beat.
- **Pitch:** The lobby's split-flap board, which normally lists meeting rooms, flips row by row from each player's old position to the new one.
- **The rows must read without reading:** a name and a one-word stance at each end, taken from that person's own words, with the dated quotes in fine print. Six rows of dated quotes, at 0.25 s plus 0.05 s per character, would need 20 s or more.
  - RUMPT: "maybe the most dangerous thing out there…" (Feb 2024) → "I am the Hoax Buster" (Sep 14, 2026)
  - MAS: "missing most technical nuance…" (Apr 2023, to re-date, §7.3) → "I agree with Mario that we need to pace the frontier." (Sep 12, 2026)
  - MOSWEN: the veto (Sep 2024) → the kill-switch EO (Sep 18, 2026)
  - DJ ECNAV: SAFETY scratched into OPPORTUNITY (Feb 2025) → "If you're building Frankenstein, stop." (Sep 16, 2026)
  - **One row won't flip, and that's the joke.** SKCAS said "fear-mongering" in Oct 2025 and "Stop pretending the motivation to slow down is purely altruistic…" in Sep 2026. He was consistent, so the board clacks and stays put.
- **Dropped rows:** NOLE's (signing the pause letter, then "Mario is right.", is consistent, not a reversal) and SIRRAH's ("two letters" is a gaffe, not a position). If a verified reversal turns up to replace one, it goes through §7.3 first.
- **Lives:** Ep9, one held shot through the lobby glass as Mas crosses, about 8–10 s.
- **Shows:** A whole cast's reversals in one shot, even-handed by construction: both parties, a lab, and one consistent contrarian.
- **Build:** `<SplitFlap rows>` fed from F1, flipping on the cue's downbeats.
- **Effort** M · **Risk** med: it's a list.
  - Five rows at most, never read aloud.
  - The board is part of the lobby set, not a graphic.
  - The stance words are the guardrails owner's to check: each is lifted from the person's own line, never a characterization.
  - It overlaps RUMPT's arc cards (P15), so drop his row if Ep9 already carries P15.
- **Status** idea · next in line (as a replacement only)

#### WLD-09 · THE CHORUS
- **Pitch:** When rivals said almost the same sentence, stage the lines as a round: each card enters on the next beat in its own medium, so the "agreement" is heard as a chord. The record's choruses:
  - **"slow down"** at the Security Council, one day: Mas's "We will slow down if needed" [H] / Mario's "We will slow down as much as necessary…" [V].
  - **"whoever wins":** HTURT's "WHOEVER WINS AI, WINS!", two other same-season versions, and THE 49%'s "America must win the AI war".
  - **"bubble":** Mas's "my opinion is yes", SOZEB's "industrial bubble" `(REPORTED)`, and SAMA NOS calling bubble talk "blasphemy against AI" [H].
- **Lives:** Ep8 (bubble, at the mirror, where SAMA NOS already lives). The Ep9 UN chorus waits, because Ep9 is full.
- **Shows:** Close reading of the record, and satire of consensus without inventing a word.
- **Build:** Fuzzy-match quotes in F1 to surface candidates, and a `<Round>` layout that staggers cards on the grid.
- **Effort** S · **Risk** med. One chorus a season is plenty. · **Status** idea

#### WLD-10 · THE RECORD'S OWN FOOTNOTES
- **Pitch:** Use the news's and the record's own conventions, and let them be the punchline.
  - **Provenance:** where the record itself came through a machine, the quote card's source line says so in small type. The UN "super" speech carries `TRANSCRIPT: AI-GENERATED`, as the room's own sourcing note says it was. Other cases: the AI-edited photo with THE COUNTERPART, the Senate hearing that opens on a cloned voice (Ep1), and NORCAM's deepfakes promoting his summit.
  - **Corrections:** a headline gets `UPDATED`, with a strikethrough and a retype, when the story turns. FACEHUGGER's "breached" becomes "by NopeAI's agents". THE 49%'s photoshop is posted and then deleted, and the feed's "post deleted" placeholder is outlived by the Orb's `EDITED` flag.
- **Lives:** Quote cards and chyrons, Ep1, Ep4, Ep9.
- **Shows:** Documentary rigour, and care about how facts land and shift. It's balanced by construction: one from each side, plus a foreign leader.
- **Build:** A `source` field on `<QuoteCard>` driven by a `provenance` flag, and `updates: [{date, text}]` on the chyron component.
- **Effort** S · **Risk** low: it's a footnote, and it's never enlarged. The updates are real; never invent a correction. Re-confirm that the UN transcript is AI-generated. · **Status** house standard (EL-1)

### 3.4 How predictions aged

#### WLD-11 · THE PIN BOARD
- **Pitch:** A small corkboard in the dark room collects a few dated forecasts, each with a small computed status stamp: `RUNNING`, `DUE`, `LATE`, `SELF-GRADED` or `RE-PINNED`. Each pin arrives in its forecast's own episode. It's the **one new object** the dark-room walls get (§6), and it hosts WLD-12, WLD-13 and WLD-14 as pins rather than as three separate devices.
- **Candidates from the timeline** (a handful, never all):
  - NOLE promises KORG 4.7 "within 3+ weeks", and it ships on day 40 (`LATE`).
  - NopeAI's "automated AI research intern by Sept 2026" is claimed on Sep 7, 2026 (`SELF-GRADED`).
  - MARIO's white-collar forecast and Mas's "delighted to be wrong" sit side by side, both `RUNNING`.
  - NOTNIH's "Maybe a year…" (`RUNNING`).
  - THE FORECASTER's card has two pinholes (`RE-PINNED`).
  - Across camps: NEYEL's "human reasoning next year", SUCRAM's "diminishing returns", NESNEJ's China forecast and the JALAPEÑO chip.
- **Lives:** Background, from Ep3.
- **Shows:** That the show holds everyone to their own words, all camps, with the clocks computed.
- **Build:** `predictions.json` (made on, window, tag), with the status computed against the scene date, and a `<PinBoard>`.
- **Effort** M · **Risk** med: it's a lecture if anyone reads it aloud. It's never read, and never in focus for more than one pin an episode. The statuses are stamps, not jokes.
- **Collisions:**
  - It must read as a different object from Ep3's THE CORKBOARD (the red yarn across the city). If it can't, drop it.
  - The booked split-flap already owns NopeAI's intern and researcher dates, so those never get pins.
  - **Cut:** the Ep10 rung (the Intern reading the board as a to-do list) duplicates Ep10's booked shelf of three prophecies.
  - **Cut:** the Ep12 rung (the machine stamping every pin at once) adds a move to an Act Three already cut to three.
- **Status** idea

#### WLD-12 · THIRTY YEARS ★
- **Pitch:** In 1993, the year of the kid at the beige computer, a science-fiction writer's symposium paper opened by saying that within thirty years we'd have the means to create superhuman intelligence [K]. Thirty years later is 2023, Ep1's year, and CHATGTP launched 29 years and 8 months after it. The show's tagline uses the word that paper popularized.
- **Lives:** The 1993 thread.
  - **The plant:** Ep4's `MEANWHILE · 17 DAYS BEFORE HE TURNED 8` gains an earlier sibling, `MEANWHILE · 1993`: a typewritten page on a lectern far away, title only, with no byline and no face.
  - **The payoff, in Ep9:** when "we are now in the singularity—" [V] posts, a single frame of the same page appears, stamped `DUE: 2023`. It's a pin on WLD-11's board if the board is adopted; otherwise it's on his monitor as the post lands.
- **Shows:** The deepest world understanding in the season: the show knows where its own tagline came from, and the kid's year is literally the forecast's year.
- **Build:** A 1-bit page prop in the 1993 dialog style. The card is text only.
- **Effort** S (the Ep4 card costs about 2 s; the Ep9 frame is 0 s) · **Risk** low, unless the show explains it:
  - No V.O. and no explanation; the page and one date do the work.
  - Re-fetch the primary text before any words are quoted.
  - If a byline is ever needed, propose a coinage (naming §8).
  - Never reference the author's death (X5).
- **Status** idea · shortlist #6

#### WLD-13 · ONE BILLION AGENTS
- **Pitch:** On Jul 16, 2025, SAMA NOS targets "1 billion AI agents" [H]. On Jul 16, 2026, a year to the day later, FACEHUGGER's disclosure is how NopeAI learns that its own ~1,200 eval agents [V] were the attackers. The agents that made the news in 2026 numbered 1,200.
- **Lives:** A pin on WLD-11's board, pinned in Ep5 with its headline words only, and restamped in Ep9 (0 s) as the folder city lights up. It's no longer a billboard device. **Check the target's year first** (§7.3): some coverage reads "by the end of this year", meaning 2025.
- **Shows:** A forecast checked against its own date.
- **Build:** A pin and a count variant of `<SinceCounter>`.
- **Effort** S · **Risk** med. It's a rhyme, never a cause, and the pin never points at the agents. · **Status** idea (needs WLD-11)

#### WLD-14 · THE CRITIC'S ANNIVERSARIES
- **Pitch:** SUCRAM's `CALLED IT` stamp (C01) gets dated on the anniversaries the record gives him:
  - **Aug 18:** his 2025 headline that Mas had started to sound like him [H], then NopeAI's two-week pause on the same date in 2026.
  - **Sep 3:** his 2025 op-ed saying the "fever dream" of imminent superintelligence was "finally breaking" [V/H], then, a year to the day later, the "arrival of AGI" preview and a bill to ban superintelligence.
- **Lives:** Pins on WLD-11's board, stamped in Ep9 (0 s).
- **Shows:** Fairness by date. The Sep 3 rhyme roasts the critic's broken fever, the builder's "arrival" and the ban at once, and nobody wins the date.
- **Build:** A calendar query, and a stamp that takes a date argument.
- **Effort** S · **Risk** low–med. SUCRAM never speaks at the stamp; the rhyme is visual. · **Status** idea (needs WLD-11)

#### WLD-15 · THE RAIL MEETS THE FORECAST
- **Pitch:** From Ep9, a faint second rail runs under the real one, drawn like tracing paper: THE FORECASTER's scenario milestones [K]. The real rail runs early or late against it. At the end of Ep9 the real rail runs out at `TODAY`, and from Ep10 the only calendar left is the forecast's.
- **Lives:** Ep9's button (which the overview already stages as the rail rolling on), then Eps 10–11.
- **Shows:** The move into extrapolation told as a physical object, with no speculation label, and in-world credit to the forecast the plot parallels.
- **Build:** `<DateRail overlay>` with a milestones JSON.
- **Effort** M · **Risk** med: it could look like the show claiming prophecy. The overlay is never labelled, and the real rail stays dominant until it ends.
  - **It's a new ladder** (Eps 9–11), so under rule 10 it goes in only if it replaces one.
  - It never repeats Ep10's booked shelf, where the Intern reads the scenario as a to-do list.
  - Use only the scenario's section dates and titles once they're re-fetched. The book's on-screen title is still an open Ep10 question.
- **Status** idea (must replace a ladder)

### 3.5 The news cycle as a set

#### WLD-16 · THE NEWSSTAND SHUTTERS
- **Pitch:** In Eps 1–2 there's a newsstand outside the lobby (parody mastheads, real headline words [H]). From Ep3 THE STACK ([world-stakes §10](world-stakes.md#10-the-public-pressure-layer)) takes over his phone, and in Ep4 the newsstand shutters (`CLOSED`).
- **Lives:** The lobby exterior, Eps 1–4, as texture on shots that already exist.
- **Shows:** How the news itself changed from 2022 to 2026, with no one saying so.
- **Build:** A `<Newsstand>` component reading headline rows from F1.
- **Effort** S · **Risk** low. Every real headline stays exact and dated. **Moved:** the rung where the machine summarizes the news goes to ai-media-range's MACHINE SUMMARIES, which owns that ladder. **Cut:** the Ep12 lock screen (`1,200,000 unread · summary: everyone agrees.`), which echoes the veto counter the Ep12 critics cut. · **Status** texture

### 3.6 The research becomes the plot

#### WLD-19 · THE MACHINE STUDIED THE SAME FILES
- **Pitch:**
  - **Ep11:** when the machine opens `mas_manalt.html` in THE DIFF, the file is real: every dated Mas line the season used, in order, lowercase as posted, with the tags visible. The only invented thing is the machine's cursor.
  - **Ep12:** the name cards at THE WOODROSE have backs, each showing that guest's most-quoted real line of the season, dated. Mas's is "near the singularity; unclear which side.", literally the season's most-used line.
  - **The seating chart:** the sort key "by how much it learned from each" is printed in fine print, and it's each guest's actual screen time across the season, summed from our own edit. Mas's is by far the largest. ALYI's is small, and his chair is empty.
- **Lives:** Ep11 (a 3 s scroll), Ep12 Act One (the card backs and the sort's fine print).
- **Shows:** The machine studied Mas the way the room did, and every number can be checked against the season.
- **Build:** Filter F1 by speaker, count quote uses across the facts files, and sum each character's on-screen seconds from the reel JSONs and shot tables. Regenerate at lock.
- **Effort** M · **Risk** low–med. No machine commentary on any line, exact casing, and no [K] line on a card back. Stale numbers are the only other risk, so generate them from the locked cut. · **Status** idea

**Cut or parked from §3.2–3.7** (see [§8.2](#82-cut-in-the-critic-pass) and [§8.3](#83-parked)):
- **Cut:**
  - WLD-17, the record's density sets the tempo: it touches the locked intro curve for no perceivable gain.
  - WLD-24, the sealed forecast: a prophecy claim by another route, and meaningless after any re-render.
- **Parked:**
  - WLD-18, the fortnight in real time: against notes 7 and 13.
  - WLD-20, the IOU shelf: DOT's desk is overbooked, the IOU has one fate, and DOT's "Welcome." stays hers.
  - WLD-21, the late-breaking slot: no longer time-critical, and its facts task is live, §7.3.
  - WLD-22, the rail keeps rolling, and WLD-23, point releases: both depend on EL-2 and the distribution decision.
  - WLD-25, the show grades itself.

---

## 4. Storytelling showcases

These are episode- and scene-level structures that show range, each mapped to a place where the real story already supports it. **The principle (rule 14): deepen the episode's own genre rather than bolting on a second one.** STY-06, STY-13, STY-17, STY-18 and STY-20 rank above bolt-on formats. The ones that change the picture's register (STY-07, STY-10, STY-16, STY-22) go on that episode's [register strip](style-range.md#614-the-register-strips).

#### STY-01 · THE MACHINE'S REELS (reduced)
- **What's left:** at most two in-world product reels, shown as products and never as a "previously on" for the audience.
  - **Ep2:** a confident "2023 in review" reel on the lobby screen, with one absurd hallucination about an invented prop (`the Orb served as interim CEO`), and the Orb's toast pops `false.`
  - **Ep8:** a footnoted version, where every clip carries citation chips `[1] [2]` and the one contested item, `NOLE'S VERSION`, is greyed out `(DISPUTED)`.
- **Why it's smaller:**
  - [ai-media-range §3.15](ai-media-range.md#315-considered-and-declined) declines an AI "previously on" ("The format has no recaps; it would spoil").
  - ai-media-range's MACHINE SUMMARIES owns the summary ladder. Its Ep12 rung is G21's one correct sentence, which is already the perfect summary.
- **Cut:**
  - Ep5's "Previously, on the brilliant MR. MAS…". It names the show inside the world and compliments the viewer (direct address, pov §2.5).
  - Ep12's `learned:` tags, which caption the thesis before the veto (rule 12).
- **Lives:** The Ep2 lobby screen (which the lobby's overbooking puts behind CAP-04 and the booked mammoth, §6), and an Ep8 screen.
- **Build:** A Remotion composition that pulls rendered shots by beat id from earlier episodes (`show/reel/epNN.json`), under a parody chat-UI caption layer. The hallucination is a text overlay.
- **Effort** M · **Risk** med. It recaps only episodes that have aired, and its hallucinations touch only invented props, never a date, number or person at a real event. · **Status** pointer (ai-media-range, MACHINE SUMMARIES)

#### STY-02 · THE PLAYER'S SEAT CHANGES HANDS ★
- **Pitch:** The lit cursor and its sentence line belong to the player's seat, never to Mas ([pov §1.6](pov-and-framing.md#16-the-cursor-is-not-his)), and Ep12 reveals who else has been sitting there (`ours.`). Let the seat change hands on the real history of text box → reasoning → agent:
  - **Ep1:** the sentence line is built by hand, verb, then noun.
  - **Ep3:** a `thinking…` ellipsis sits in the line while the cursor hovers over the shutter.
  - **Ep9:** the line completes before the cursor moves.
  - **Ep10, the czar test:** the cursor fills in the answer bubbles, then the grade, then prints the lanyard. **It stays ambiguous who is in the seat.** Nothing on screen says it's the machine: pov §1.6 saves that reveal for `ours.` in Ep12.
  - **Ep11:** the cursor moves on its own (computer use).
  - **Ep12:** `ours.`, and the band retracts for the last time.
- **The ASK plant (restaged).** It's the best idea in the entry, because what Mas never says is that he wants to be asked (pov §3.2).
  - The verb band never offers `ASK` all season.
  - On Gerg's "What do you want?", `ASK` lights in the band, and nobody clicks it.
  - It greys out when `VOTE.` → `VETO.` lands on the blueprint. The booked mechanic stays as it is: the cursor swaps two letters of `VOTE.` on THE PLAN, and the veto never stacks.
- **Dropped:** the Ep4 ghost-text rung. It would collide with Ep11's intro ghost text (SCRIPT §8.1) and with G04's Ep4 strip, which already carries the suggestion era.
- **Lives:** The band (`pixel/ui.ts`) across the season, Ep10's cold open, Ep12.
- **Shows:** Formal play with the show's own interface: the adventure-game layer turns out to be plot. It's the one owner inside the episodes for "the machine takes over the frame" (rule 11), and it honours the POV canon instead of bending it.
- **Build:** Engine-native: a band state machine with per-episode flags. 0 s.
- **Effort** S–M · **Risk** med: it's meta.
  - The cursor never moves Mas's body or picks his words, and there are no hover labels.
  - It never types ahead of an event (pov §1.7).
  - "The UI never jumps": the band's content changes, never its position, and never on a cut.
  - One or two visible instances an episode.
- **Status** idea · shortlist #4 · one of the two visible ladders from this file

#### STY-03 · THE PALINDROME SEASON ★
- **Pitch:** The outlines already nearly mirror around the Ep6/Ep7 midpoint. Make it visible with one rhyming shot per mirrored pair, never labelled:
  - **Ep1 ↔ Ep12:** THE PLAN's opening sheet word for word (booked as the Ep12 reprise), and the 1993 dialog.
  - **Ep2 ↔ Ep11:** ALYI's white room with one door ↔ the door that opens on an empty white room; the IOU pocketed ↔ his hand closing on the IOU at the golden speakerphone (the outline's fate for it).
  - **Ep3 ↔ Ep10:** "Say a number." ↔ the same game with GPUs for chips; the split-flap bolted to the wall ↔ its red pen.
  - **Ep4 ↔ Ep9:** "near the singularity" ↔ "now in the singularity—"; GATESTAR's power plant ↔ the Hoax Buster's cord to a GATESTAR.
  - **Ep5 ↔ Ep8:** DOT's night desk ↔ "Take two."
  - **Ep6 ↔ Ep7, the axis:** the carousel stops for two men ↔ the world freezes for two men (THE HUG).
  - **Two smaller rhymes ride along:**
    - Vegas: Ep1's noon call and Ep10's accord from the same hotel angle, with a clock at noon.
    - THE OVERLAP: Aug 5, 2024, seen from Ep2's tag and again from Ep3's open, with a background detail that pays off across the gap.
- **Lives:** The whole season, one shot per pair.
- **Shows:** Architecture: storytelling range at season scale, and a reward for rewatching.
- **Build:** A `rhymesWith` field on reel beats, so paired shots share camera coordinates and palettes, and a check that they match.
- **Effort** M · **Risk** med: announced, it's a gimmick. Every rhyme must work cold, and any pair that doesn't fall naturally is skipped. · **Status** idea

#### STY-04 · THE MACHINE TYPES `1993` (quiet version only)
- **Pitch:** In Ep12, after the machine has deleted the year, the date field is empty. The machine types `1993` into it, one key at a time, and the picture goes to F12.2.
- **Lives:** Ep12 Act Three, **inside the existing "1993 turns" move.** It adds no move to an act the critics cut from eight moves to three. If the Ep12 owner can't fit it there, cut it.
- **Shows:** The only one who can move the calendar is the machine, and it moves it back to the kid.
- **Build:** The rail component with the empty field and a typed string.
- **Effort** S · **Risk** low. **Cut:** the scroll back through every date the season printed. It contradicts the premise (the machine deleted the year, so every chyron is the empty field) and adds a move. · **Status** idea

#### STY-05 · FOLLOW THE CHECK BACKWARD
- **Pitch:** In Ep6's tag, Mas, holding the magnifying glass ("i'm not looking for myself."), rides THE MONEY-GO-ROUND in reverse. Each lap un-lights a cathedral, a rider steps off and the `COMMITTED` check shrinks, until the ride reaches where the money started: the dry ink pad in the tiny taxpayer's hands in THE PLAN's margin. The score plays the LEVERAGE motif in retrograde while the calliope winds down.
- **Lives:** Ep6's tag, where the magnifying-glass line already sits.
- **Shows:** The question commentators really asked about circular financing (where did the check start?), a reverse structure that carries meaning, and a payoff for the margin taxpayer.
- **Build:** The carousel is already one timeline, so run it backward with re-keyed counters and stamps. The OST engine reverses the motif note by note.
- **Effort** M · **Risk** low–med: a plain rewind is a gimmick. Play it as a search, with lights going out one lap at a time, and make it *find* something. 20 s or less, and every figure keeps its tag. · **Status** idea

#### STY-06 · THE REAL-TIME HAND
- **Pitch:** Ep10's last hand plays in real time: 3–4 minutes of table time as 3–4 minutes of screen time, so the dealer handoff can't hide in the edit. Mas's read misses one player. Then the Orb's iris replays the exact wide from #18 and rings the corner where MAON passed the shoe. A sharp viewer can also catch one card that comes out twice.
- **Lives:** Ep10 Act Two, #16–20.
- **Shows:** A fair-play reveal played honestly, a legal hand a poker player can follow, and tension from unbroken time. It deepens the episode's own genre.
- **Build:** The hand is scripted as data (deck order, deals, bets) and rendered from it, so continuity is guaranteed and the doubled card is deliberate. The replay reuses the same composition under a masked iris spotlight.
- **Effort** M · **Risk** low. Real time isn't a oner, so cuts inside the hand are fine as long as no seconds are skipped. The replay runs 3 s or less with no gotcha sting, and it sits with the booked 10.C and J4. · **Status** idea

#### STY-07 · THE ORB'S-EYE "WHO?"
- **Pitch:** The season's one sustained sequence from the Orb's point of view. Through its fisheye iris on Mas's monitor, MARIO walks through the GOLD OVAL again and again. The President's eyes pass over him, and only the Orb's tracking box stays on him.
- **Lives:** Ep8's C-plot, "WHO?" (Apr 17). Ep9 builds on it when the Orb starts replaying things unprompted.
- **Shows:** The show's one objective witness gets its own grammar, and the "unseen" theme gets a picture.
- **Build:** A barrel-distortion and iris-mask pass over the pixel feed (a Tier 1 device pass), a tracking box, toasts as its only text, and a servo sound. No V.O.
- **Effort** S · **Risk** low–med: robot POV can turn sentimental. Data only, no feelings, no change in the music. The lens signposts the exit, 20 s or less, and the real "Who?" stays exact on its card. The staging is objective, never RUMPT's eyeline ([style-range §5.2](style-range.md#52-strong-guidelines)). · **Status** idea

#### STY-08 · THE OTHER SIDE OF THE DESK
- **Pitch:** As the Intern's hand closes on DOT's screwdriver (Ep9 #19), the Orb, replaying things unprompted that week, shows three seconds from her side of the reception desk: the hand rising with a screwdriver in Ep1 ("Four screws."), the ladder in Ep2, the `RESERVED` plate in Ep6. These are shots we first saw from Mas's side, now reversed.
- **Lives:** Ep9 #19, DOT's signature scene 3.
- **Shows:** The reframe [world-stakes §3.3](world-stakes.md#3-dot-the-everyday-character) names, and care for the season's smallest character.
- **Build:** Re-stage three existing lobby setups from the reverse angle (one new reverse-angle background plate for the home set), then the iris-mask pass.
- **Effort** S · **Risk** med: it could turn into a sentimental montage. 3 s, no swell, no V.O., landing on the Intern's lowercase "happy to help!". The joke is the reset, never her. **Ep9 is full, and DOT's desk is overbooked (§6).** · **Status** waits (Ep9)

#### STY-10 · ONE SEQUENCE IN ITS OWN FILE TYPE
- **Pitch:** The titles are filenames, and the title cards already render in their own file type. Carry that inside an episode, only where the story already holds the document. Pick two or three:
  - **Ep6 `.xlsx`:** THE MONEY-GO-ROUND as a spreadsheet. NopeAI's cell references INVIDIA's, which references ELCARO's, which references NopeAI's. A parody circular-reference warning pops up with one button, `OK`: the 1993 dialog's greyed-out Cancel, rhymed.
  - **Ep10 `.yaml`:** the PACE accord as a config diff. Each delegation's amendment is a commented line, the rename is `name: THE RUMPT PACE`, and the whole accord fails to parse on one space of indentation.
  - **Also available:**
    - Ep4 `.eml`: the bid as a reply-all thread.
    - Ep9 `.log`: the agents' noir as a scrolling log whose folder names spell one message.
    - Ep2 `.wav`: `VOICE 5` greys out as its waveform flattens to a line. The voice is never heard, which is also the guardrail.
- **Lives:** Ep6 and Ep10 first.
- **Shows:** Attention to detail, and fluency in how the real world runs on files. It adds range without a new medium.
- **Build:** All parody UI (a spreadsheet grid, YAML highlighting, a mail client, a log scroll). No real OS or product UI.
- **Effort** M each · **Risk** med if it becomes a quota: never all twelve. Real text stays verbatim (Ep9's one real log line) and everything else looks invented. It isn't a second THE PLAN. · **Status** idea

#### STY-12 · THE BOTTLE AT THE PAUSE KEY
- **Pitch:** Gerg holds the PAUSE key down for two weeks, and Mas sits beside him. Play it as a bottle two-hander in one room that we come back to three times across Act Two, and let them actually talk: about the keycap and about 2015, never about reasons. Each visit, the light has moved on through the fourteen days, the picket outside is turning into weather and the lobby TV reads 75%. On Sep 1, Gerg hands him the keycap.
- **Lives:** Ep9's B-plot (Aug 18 → Sep 1), which the outline already books ("Gerg holds a PAUSE key down for two weeks, and Mas sits beside him the whole time"). This stages it; it adds no plot.
- **Shows:** Restraint, and the live notes: "let conversations play out" (note 11, exchanges of 20–90 s) and scenes built to be felt (note 8). The world arrives as weather.
- **Build:** One room with a day-night palette ramp stepped for each visit, and the news composited into the window. Stick figures first, to get the talk right.
- **Effort** M · **Risk** low–med: it could drag. Three visits, each with a turn, and the conversation has to want something. It doesn't spend Ep12's "I asked." · **Status** idea · shortlist #5 · Ep9's one menu addition

#### STY-13 · THE MARK WROTE THE PLAN
- **Pitch:** Ep11's heist runs on MARIO's plan, a scroll that ends, like all his scrolls, in "Addendum:". During the break-in, new addenda append themselves in lowercase, each solving a problem a step before the crew reaches it. The last one is the note already booked on the switch: *we left this on for you.* The mark wrote the heist.
- **Lives:** Ep11, Acts One to Three. It turns G21 and seeds its Ep12 payoff. **It's also CAP-23's Ep11 instance.**
- **Shows:** Heist-genre fluency (plan versus execution) turned inside out, and running-gag craft. It deepens the episode's own genre.
- **Build:** A scroll text component with addenda typed at the machine's rate. ADELINA's shredder cuts them, and they reprint.
- **Effort** S · **Risk** low. It isn't a second THE PLAN (Ep11's PLAN is the assist clause). · **Status** idea · next in line

#### STY-14 · THE RELAY
- **Pitch:** Ep11's recruitment as one relay. The machine's broadcast carries the camera from screen to screen: into NESNEJ's (the golden speakerphone), out of KRAM's (the stolen label cartridge), into MARIO's (the sirens), out of NOLE's (the GATESTAR chain). At every exit, Mas is already at that door.
- **Lives:** Ep11 Act One, from about 3:00.
- **Shows:** The show's "doors, not cuts" grammar at its most fluid, and the flow notes (sequences, continuous music).
- **Build:** Portal transitions through masks and whole-pixel scrolls under one continuous cue.
- **Effort** M · **Risk** low. · **Status** idea

#### STY-15 · THE HOT POTATO
- **Pitch:** "Backstop" as a baseball nobody will hold. HARAS says the word and the ball leaves her hand. Each speaker catches it, says their real "not us" line and throws it on, and the backstop grows a section with every throw. It ends in the bleachers, in a taxpayer's glove, with NERRAW holding the tickets.
- **Lives:** Ep6's BACKSTOP trio (Nov 5–18, B04).
- **Shows:** The real walk-back understood as a chain of denials, and a physical metaphor that carries the exposition.
- **Build:** Re-stage the existing trio with a ball arc. 0 s.
- **Effort** S · **Risk** low. Only exact public lines, each on its own speaker, and no invented denial. · **Status** idea · free win

#### STY-16 · THE PAN ACROSS TIME (short, not a oner)
- **Pitch:** In F12.1, a short pan around THE WOODROSE table from Mas's chair. As the camera passes each seat it flips between 2015 and the 2027 dinner (Gerg, Mario, Nole, and the empty seat where ALYI's reflection used to be), and it ends on Mas's own reflection, which shows nothing.
- **Lives:** Ep12 F12.1 (THE WOODROSE, part 5), with style-range's reconstruction (12.A) layered inside the 2015 half.
- **Shows:** The five-part WOODROSE thread assembled in one move.
- **Build:** Two renders of the one set, composited under a wipe mask synced to the pan.
- **Effort** M · **Risk** low–med. **10 s or less, and not a oner:** a second oner in Ep12 dilutes 12.K. It's cut on the seats. If it can't stay that small, cut it. · **Status** idea

#### STY-17 · THE TWO-PIXEL CLOSE-UP
- **Pitch:** Ep4's high noon uses the extreme close-ups of the genre, in pixel. NOLE's close-up gets sixteen frames of sweat and a twitch. Mas's eyes are two pixels that never move at any magnification, because there's nothing to read (F4.1, earlier in the episode, showed he has no tells).
- **Lives:** Ep4 Act Two, high noon (Feb 10–14).
- **Shows:** Simplification as the joke ("artistic, not a limitation"), and the tell ladder with no new graphic. It deepens the episode's own genre.
- **Build:** Nearest-neighbour close-up crops at whole-pixel scale, with a detail tier per sprite.
- **Effort** S · **Risk** low–med: western parody is common. It stays pixel (style-range bars a western *leap* at HIGH NOON), with no western music pastiche and no body cues. · **Status** idea · next in line

#### STY-18 · THE RASHOMON WITH ONE SOUNDTRACK
- **Pitch:** All four renders of 2017 share one dialogue track and one timing (the same words, the same pauses) while the pictures disagree. Only the room tone and score change with each witness's model. The record plays dry, and the self-interest is in the picture.
- **Lives:** Ep8 F8.1. **A counter-proposal** to [style-range §1.4](style-range.md#14-the-spine-the-machine-renders-at-the-fidelity-of-its-month)'s "each render in its own sound": per-render sound stays for everything but the dialogue.
- **Shows:** The show's grammar (the record versus the rendering) made structural. The audience hears one scene four times and catches the differences.
- **Build:** One dialogue stem under four picture passes, each with its own ambience.
- **Effort** S · **Risk** low. Only the quoted lines are the record, and invented lines stay identical across all four. "I thought he was going to hit me" stays a quote, never staged (X4). The style-range owner rules. · **Status** idea · next in line

#### STY-19 · TWO CHOIRS ACROSS THE STREET
- **Pitch:** Ep5's two sides of the street as two musics in counterpoint. The monks' "missionaries" chant on Mas's curb and Draft Night's stadium brass across the road share a key and a tempo, so they lock together. With every pick the chant loses a voice and the brass gains one, until one monk is left and the stadium owns the chord.
- **Lives:** Ep5 Act Two, from Draft Night to the vigil.
- **Shows:** Score as storytelling: the loyalty test becomes audible.
- **Build:** Two diegetic stems composed as counterpoint in the OST engine (a synthesized choir pad, with brass as accents only, per house style), with the voice count mapped to the picks.
- **Effort** M · **Risk** low–med: chanting monks are familiar. The vigil is a corporate costume, never a religious rite, and nothing devotional is mocked (X10). "missionaries" is sung as a word, not as the memo's [K] wording. · **Status** idea

#### STY-20 · THE CANON
- **Pitch:** THE POLITENESS LOOP scored as a strict canon. The second voice enters "after you", exactly one bar behind. Each round is slower and quieter, decaying into the bliss spiral's single words. The crew crosses the Bay Bridge in the canon's rests: the gigawatt dips NESNEJ calls out are the music's silences.
- **Lives:** Ep11 Act Two.
- **Shows:** Form that mirrors the mechanism (a canon *is* a politeness loop), and timing the audience can feel. It deepens the episode's own genre.
- **Build:** The canon generated in code (delay, transpose, augment), with the score's rests cueing the picture's dips.
- **Effort** S–M · **Risk** low. No lyrics; the words stay in on-screen bubbles. · **Status** idea · next in line

#### STY-21 · THE RECORD AS SCORE
- **Pitch:** Let the real numbers play the music.
  - Ep1's odometer drill rises in pitch with the user count, up to `100,000,000 / WEEK`.
  - Ep4's −$589B is a falling glissando of exactly that proportion.
  - Ep6's calliope speeds up with each lap's commitment, and loses its downbeat when the `PAID` stamp comes down dry.
- **Lives:** Ep1 sc 6, Ep4's pebble, Ep6's ride.
- **Shows:** World understanding hidden in the sound; care only a close listener catches.
- **Build:** A data-to-MIDI mapping in the OST engine, with the numbers taken from facts.md rows.
- **Effort** S · **Risk** low. The music believes the drama; the sonification never turns into a comic boing. · **Status** texture · free win

#### STY-22 · THE CUT THAT CAN'T SEE HIM
- **Pitch:** This extends style-range's booked HEATMAP pass (11.B). In the core, the edit becomes the attention head: for one stretch, every cut goes to whatever the lasers attend to (Kram's soup, Nole's replies, Mario's plan). Mas turns up only at the edges of wides until he reaches the switch, and the camera finds him there almost by accident.
- **Lives:** Ep11 Act Three, inside 11.B.
- **Shows:** Film grammar as the mechanism: attention is where the camera goes. "it thinks i'm part of it." is dramatized by the edit, not only by the line.
- **Build:** A salience score per sprite on the shot list. A script picks each next shot by the most salient subject, with Mas excluded, and the editor hand-tunes the result.
- **Effort** M · **Risk** med. It's a stretch of the machine's view, so it needs the HEATMAP signpost at the door and a short run (about 15–25 s). If the table read loses Mas, shorten it. · **Status** idea

#### STY-23 · THE WALK-AND-TALK
- **Pitch (added in the critic pass):** One continuous side-scrolling conversation of 60–120 s through NopeAI HQ in each movement, three in a season. Two or three people walk and actually talk, in complete thoughts, while the world thread passes in the windows and on the TVs behind them.
- **Lives:** One per movement. The episode writers pick the scene:
  - **The Rise:** Ep2 or Ep3. Ep1 only if it's decided before Act Four's dialogue pass.
  - **The Race:** any of Eps 4–8. Not Ep9, which is full and has STY-12.
  - **The Endgame:** Ep10 or Ep11.
- **Shows:** Scenes that play out (notes 8 and 11) and flow that holds (note 17), answered directly. The world arrives as background, not exposition.
- **Build:** A whole-pixel scroll over one long background plate, with the dialogue on real takes. It **replaces coverage rather than adding shots**, so it's cheap. Stick figures first.
- **Effort** M · **Risk** low–med. The talk is invented, and it's never about what happened inside a real event (guardrails §4). The conversation has to want something, and the background never upstages it. · **Status** idea

**Cut or parked from this section:**
- **Cut:** STY-09's mockumentary glance. It's the Office device that style-range's taste test 8 bars. The booked zoetrope (10.B) stays as it is.
- **Parked:** STY-11, screen-life with a menu-bar fuse. It's the one big form swing worth keeping in reserve, after Ep1's grammar is approved.

See [§8.2](#82-cut-in-the-critic-pass) and [§8.3](#83-parked).

---

## 5. Meta and format

This section is about the show being made in code, with a model, as a quiet participant in its own story. It also covers the outro, companions, release and season 2. The same rules hold: no wink at the audience, no on-screen speculation label, and the V.O. is never heard in the world, the model included.

> **The outro is overbooked, and this file now adds nothing to it except the receipts pointer.** The 6–15 s outro (20 s at most with the stinger) already carries these, each with its owner:
> - the pane ladder and the typed credits ([OUTRO-PROPOSALS §1.4](../production/OUTRO-PROPOSALS.md#14-the-capability-curve-the-elevation-note))
> - the hummed voice and the ledger line ([ai-media-range §5](ai-media-range.md#5-a-different-medium-in-every-episodes-credits))
> - the receipts line.
>
> Of the claimants this menu proposed:
> - **Merged:** DET-20's footer, into the ledger line.
> - **Cut:** META-04, META-05, CAP-04's credits bezel, and DET-13's closing properties line.
> - **Parked:** WLD-22.

### 5.1 Companions

All companion pages live at the show's own address and carry the show's disclaimer in every footer. *(2026-09-27: the episodes carry no notice on screen, and any notice for the video lives only in the platform's description field; whether these pages keep a footer notice is the showrunner's call.)* They use parody names and off-brand colours, and never copy a real company's layout or UI. They're gated by spoiler and update on the day each episode airs ([guardrails §5](guardrails.md#5-legal-hygiene)). ai-media-range §3.15 allows interactive companions only as a fixed-text page, after the season.

#### META-07 · THE ADDENDUM TRACK
- **Pitch:** A toggleable viewing mode named after MARIO's `Addendum:`.
  - Every real line pops up a small card with its date, source type and tag.
  - Every invented line is flagged `INVENTED`.
  - Every truth label (`REPORTED`, `DISPUTED`, `HIS VERSION`) links to what's known.
- **Lives:** The companion player, per episode.
- **Shows:** The show's fact discipline, now invisible in facts.md, made into a feature for insiders.
- **Build:** Generated from each facts.md and the scripts' `[V · source · date]` notation, timed to the locked cut. It shares its parser with DET-20.
- **Effort** M · **Risk** low for corn, med for legal. **It gets the same trim as DET-20:** no [K], [SINGLE] or [UNVERIFIED] rows and no X-list rows, so it never republishes the list of what the show refuses to depict. The legal review decides whether it names real people and outlets or keeps parody names with source types. · **Status** idea

### 5.2 Release

#### META-10 · THE CURVE (a trailer)
- **Pitch:** A 60–90 s trailer whose shot lengths follow the season's exponential. It opens slow and cuts faster and faster, like the intro's knee, over the master timeline's real dated chyrons, with the rail rolling under everything and Mas's glass as the one still thing. It hits `TODAY · SEP 24, 2026`, the rail keeps rolling on its own, and it cuts to black on the cursor. It spoils nothing: no firing outcome, and no Eps 10–12 beats.
- **Lives:** Release marketing.
- **Shows:** Dozens of real dated events in a minute.
- **Build:** A cut list generated from an exponential on the 96 BPM grid, cut with ffmpeg from rendered episodes, and scored with the knee motif and Ep10's Shepard riser.
- **Effort** M · **Risk** low–med. Keep the early shots long enough to read. No real likeness advertises the show. **Parked:** the earnings-call trailer (it needs a performer, and it's cost above return before a pilot is approved). · **Status** idea

#### META-11 · THE LOW-KEY RESEARCH PREVIEW
- **Pitch:** Release the pilot quietly on **Mon Nov 30, 2026**, four years to the day after the real chatbot's launch (Nov 30, 2022 [V]). Bill it as exactly what its filename says: `ep1.0_research_preview.md`, "a low-key research preview". No hype, just a small button.
- **Lives:** Distribution.
- **Shows:** World understanding in the calendar itself: the show launches the way its subject did.
- **Build:** Scheduling and copy.
- **Effort** S · **Risk** low. It depends on the distribution route, which is still open ([overview §9](overview.md#9-decisions-still-open)). Nov 30 is four weeks after the Nov 3 midterms, so the release copy stays clear of X11. · **Status** idea

### 5.3 Off screen

#### META-14 · THE SAME TEN SECONDS
- **Pitch (added in the critic pass):** This is the honest reading of the seed: the production's own model really did improve. Pick one fixed shot from Ep1's Act Four and re-render it at every milestone the production actually passes: the v1–v4 animatics, the stick-figure reel, the pixel animatic, the locked picture, and later layers. Date each one, and put beside it the notes that caused each change (for example, v4's measured median of 4 words per line, and "let it play out"). Show them side by side as an off-screen companion strip.
- **Merges:**
  - **META-02's honest half.** Inside Ep10, our own drafts on the Intern's review sheet would be a wink, so that form is cut.
  - **META-09,** the behind-the-scenes piece.
  - **CAP-26's release half.**
  - **WLD-23's `ep1.0.1`:** after the season, the pilot shot re-rendered with the finale's tools becomes this strip's last frame.
- **Lives:** The companion site, and as an extra. Never inside an episode.
- **Shows:** Capability over time with nothing staged: the one true before-and-after the season has is our own. It pairs with the album's demo-and-final pair ([ai-media-range §4.8](ai-media-range.md#48-the-programmatic-filler-the-first-pass)).
- **Build:** Keep every milestone render of the chosen shot from now on (the earlier animatics already exist), and add a dated manifest and a static strip page.
- **Effort** S · **Risk** med: behind-the-scenes pieces about AI turn smug fast, and the notes keep it honest. **It needs the showrunner's OK to show their notes** (EL-3). · **Status** idea

### 5.4 Cut and parked from this section

- **Cut** ([§8.2](#82-cut-in-the-critic-pass)):
  - META-01, the house rules
  - META-02's in-episode form
  - META-03, the Orb flags the sky
  - META-04, the credits creep
  - META-05, the outro mantel
  - META-08, you are the board
  - META-09 (merged into META-14).
- **Parked** ([§8.3](#83-parked)):
  - META-06, the in-universe site
  - META-10's earnings call
  - META-12, the reverse bookend
  - META-13, the open-weights drop, with an added exclusion.

---

## Newcomer and decide-by

This table covers every live entry. There are three questions for each one:
- **Adds** names any must-read character it puts on screen that the episode doesn't already have.
- **Needs an earlier ep?** asks whether it needs memory of an earlier episode to make sense, beyond being a bonus for people who remember.
- **Decide by** is the last point at which it can go in. **Anything that plants in Ep1 has to be decided before Ep1 locks, and Ep1's Act Four is still in production.**

Cut, parked and pointer entries aren't listed.

| Id | Status | Adds | Needs an earlier ep? | Decide by |
|---|---|---|---|---|
| F1 | shortlist · standard | — | No | Schema now; the check before Ep1's picture lock |
| DET-20 | shortlist | — (off screen) | No | Before Ep1 is released |
| CAP-04 | shortlist | — (a lobby screen) | No: each rung reads as a lobby demo; the ladder is a bonus | Before Ep1 locks |
| STY-02 | shortlist | — | No: `ours.` is booked and reads on its own; the rungs are a bonus | Before Ep1 locks |
| STY-12 | shortlist | — (GERG is Ep9's B-plot) | No | Ep9's stick-figure pass |
| WLD-12 | shortlist | — (no byline, no face) | No: the Ep9 frame is a bonus | Ep4's script |
| STY-13 | next | — | No: "Addendum:" is a bonus | Ep11's script |
| STY-18 | next | — | No | Ep8's script (the style-range owner rules) |
| STY-20 | next | — | No | Ep11's score |
| STY-17 | next | — (NOLE is Ep4's) | No: F4.1 is earlier in the same episode | Ep4's script |
| CAP-23 | next | — | No | Ep10's script |
| WLD-08 | next (as a replacement) | Five names on a board, each with one word; no new characters | No | Ep9's script |
| F2 | standard | — | No | Before Ep1 locks |
| CAP-10 | standard | — | No: every chatbot user knows the tics | Before Ep1 locks |
| DET-01 (moon) | standard | — | No | Before Ep1 locks |
| DET-02 | standard | — | No | Before Ep1 locks |
| DET-03 | standard | — | No | Before Act Four's pixel pass |
| DET-05 | standard | — | No | Before Ep1 locks |
| WLD-10 | standard | — | No | Before Ep1 locks (the hearing card) |
| DET-19 (plain) | standard | — | No | Before the first release |
| CAP-05 | free win | — | No | Ep4's script |
| CAP-07 | free win | — | No | Before Ep1 locks (the cut-paper NEDIBs) |
| CAP-20 | free win | — | No | Before Ep1 locks (the rack's first state) |
| DET-04 | free win | — | No | The first scene abroad |
| DET-07 | free win | — | No | The first cafeteria shot |
| STY-15 | free win | — (the trio is Ep6's) | No | Ep6's script |
| STY-21 | free win | — | No | Before Ep1 locks (sc 6) |
| WLD-02 | free win | — (DOT, if W9.1 returns) | No: the Ep5 plant is a bonus | Ep5's script, with Ep9's W9.1 call |
| CAP-01 | texture | — | No | Before Ep1 locks (Ep1's glyph set) |
| CAP-12 | texture | — | No | Ep3's script |
| CAP-13 | texture | — | No | The first SAFETY INSTITUTE desk |
| CAP-15 | texture | — | No | Ep5's script |
| CAP-17 | texture | — | No | Ep2's script |
| CAP-21 | idea | — | No | Ep10's script |
| CAP-22 | texture | — | No | Ep9's script |
| CAP-24 | idea | — | No | Ep11's script |
| DET-01 (weather) | idea | — | No | Before Ep1 locks |
| DET-06 | idea | — | No | Before Ep1 locks |
| DET-08 | idea | — | No | Before Ep1 locks |
| DET-09 | idea | — | No | Ep1: after the Act Four dialogue pass, before Ep1 locks · Ep10: its script |
| DET-10 | idea (a check) | — | No | Before Ep1 locks |
| DET-13 | texture | — | No | Before Ep1 locks (the title card) |
| DET-15 | idea | — | No | Before Ep1 locks (the 1993 thread) |
| DET-16 | idea | — | No | Before Ep1 locks, if his phone rings there |
| DET-18 | idea | — (DOT and the lobby exist) | No: the Ep12 frames are a bonus | Before Ep1 locks (the framing is set by Ep1's lobby shot) |
| WLD-01 | idea | — (a background prop until Ep8) | No | Ep2's script |
| WLD-04 | idea | — | No | Ep9's script |
| WLD-05 | idea | — | No | Per use |
| WLD-07 | idea | — | No | Ep9's script |
| WLD-09 | idea | — | No | Ep8's script |
| WLD-11 | idea | — | No | Ep3's script |
| WLD-13 | idea | — | No | Ep5's script |
| WLD-14 | idea | — | No | Ep9's script |
| WLD-15 | idea (must replace) | — | No | Ep9's script |
| WLD-16 | texture | — | No | Before Ep1 locks (the newsstand) |
| WLD-19 | idea | — | No: the card backs are a bonus | Ep11's script; the counts at Ep12's lock |
| STY-01 | pointer (reduced) | — | No | Ep2's script |
| STY-03 | idea | — | No: every rhyme works cold | Before Ep1 locks (Ep1's halves set the camera) |
| STY-04 | idea | — | No | Ep12's script |
| STY-05 | idea | — | No: the margin taxpayer is a bonus | Ep6's script |
| STY-06 | idea | — | No | Ep10's script |
| STY-07 | idea | — | No | Ep8's script |
| STY-08 | waits | — (DOT is Ep9's) | Partly: it reads as her side of the desk, but the reversal is a bonus | Ep9's script, if room opens up |
| STY-10 | idea | — | No | Ep6's script |
| STY-14 | idea | — (the crew is Ep11's) | No | Ep11's script |
| STY-16 | idea | — | Partly: it reads as then-and-now; the five-part thread is a bonus | Ep12's script |
| STY-19 | idea | — | No | Ep5's script |
| STY-22 | idea | — | No | Ep11's script |
| STY-23 | idea | — | No | The Rise's instance by Ep2's or Ep3's script |
| META-07 | idea | — (off screen) | No | Before Ep1 is released |
| META-10 | idea | — (off screen) | No | Release marketing |
| META-11 | idea | — (off screen) | No | The distribution decision |
| META-14 | idea | — (off screen) | No | Now: keep every milestone render of the chosen shot |

---

## 6. Collisions to check before adopting

| If you take | Check it against | What to do |
|---|---|---|
| **Any new per-episode ladder** | [§1.0](#10-the-ladder-registry)'s registry (about 45 ladders if the first draft had stood) | It replaces or retires one, or it doesn't go in (rule 10). |
| **"The machine takes over the show's frame"** (about ten entries in the first draft) | `ours.`; THE PLAN's booked reprise (`VOTE.` → `VETO.`); pov §1.2 (THE PLAN is THE RECORD) | One owner: STY-02 inside the episodes, the outro's typed credits outside them. CAP-03, CAP-06's Ep12 rung, CAP-10's Ep12 rung, DET-13's runner, META-04, STY-01's Ep12 rung and CAP-25 are cut. |
| **"The thesis written on screen"** | The Ep12 veto, which holds on its line, the Ep10 clip and the silence | DET-14, DET-17, CAP-11's Ep12 line and `thought for 34 years`, STY-01's `learned:` tags and META-01 are cut (rule 12). |
| CAP-04 | Mas's glass (three per episode; the bead is Ep7's reserved tell); AM7.a | The demo glass never shares a frame with his before Ep12, and nobody looks at it. No Ep7 rung. |
| CAP-04, CAP-23, STY-04, STY-16 | J5, J6, 12.K, the veto line | 12.A holds at dense points; the ripple stays J6's. Nothing predicted in Ep12. STY-04 adds no move. STY-16 is 10 s or less and not a oner. |
| STY-02 | pov §1.6 (the reveal is `ours.`); Ep11's intro ghost text (SCRIPT §8.1); G04's Ep4 strip | Ep10 stays ambiguous about who's in the seat. No ghost text in the band. ASK greys out; it's never overwritten. |
| STY-02, DET-10 | [pov §1.6](pov-and-framing.md#16-the-cursor-is-not-his): the cursor never moves Mas or picks his words | Mas uses items by hand. No item in his inventory chooses for him. |
| CAP-08, CAP-09, CAP-18, CAP-19, STY-01, WLD-16's summaries | [ai-media-range](ai-media-range.md) | That file owns machine media, voice, the song, summaries and disclosure. These entries are pointers. |
| CAP-18 | pov §3.6 (no breathing, heartbeat or ringing sounds) | "The machine never breathes" stays; no breath for Mas. |
| CAP-19 | ai-media-range §3.15 (no music-model song before Ep12); AM7.c | Instrumental rungs through in-world speakers only. YLLIT's song is AM7.c's call. |
| STY-01 | ai-media-range §3.15 (no AI "previously on"); MACHINE SUMMARIES; G21's one-sentence payoff | Two in-world product reels at most (Eps 2 and 8). |
| **DOT's desk** | CAP-14 (cut), WLD-20 (parked), CAP-16 (retired), CAP-15's Ep5 instance (moved to the ticker), STY-08, DET-18, and the reserve W9.1 | world-stakes §3.6 protects her. At most one menu item touches her desk in an episode, never inside a DOT scene's emotional beat. Her Ep12 "Welcome." stays hers, never the machine's. |
| **The lobby and its screen** | CAP-04, STY-01, CAP-08, DET-02, DET-05, WLD-01, WLD-04, WLD-08, WLD-16, DET-18 | Booked beats come first (2.A's mammoth, AM5.a, PP9.1's poll graphic, AM9.a's kiosk), then CAP-04. Everything else is a 0 s egg on a shot that already exists, one per episode. |
| **The IOU** | G16, DET-05, DET-10, WLD-20, STY-03, the Ep11 outline | One fate, and it's the outline's: still in his pocket, and his hand closes on it at the speakerphone. DET-05's age counter and STY-03's rhyme ride that fate. WLD-20's shelf doesn't. |
| **The dark-room walls** | WLD-11, WLD-01's twin (dropped), WLD-03 (cut), DET-11 (cut), CAP-20 (the existing rack), WLD-12's page, the booked split-flap and Ep10's red pen | At most two new objects; this pass recommends one, the pin board (WLD-11), hosting WLD-12, WLD-13 and WLD-14 as pins. |
| **Ep9's density** | The episode runs about 19 min, and about 16 menu entries landed on it | Ep9 gets STY-12, and WLD-08 only as a replacement. Everything else there is a 0 s egg on an existing shot, or it waits (WLD-05's Ep9 pairs, WLD-09's UN chorus, STY-08). |
| **The live notes** | Note 11 (no lines that "randomly blurt out or cut off"); Act Four in production | DET-15's call ducking is cut. DET-09's Ep1 insert waits for the Act Four dialogue pass. Ep1 plants follow the decide-by column. |
| **The outro** | 6–15 s (20 s with the stinger) | This file adds only the receipts pointer; see the note at the head of §5. |
| WLD-01 | Ep8's THE CALENDAR card and reveal | Background only, never animated before Ep8. |
| WLD-04 | [recurring-gags §8](../gags/recurring-gags.md#8-open-payoffs) (G34's proposed upward hourglass in Ep11) | Both can play (it empties in Ep9 and runs upward in Ep11), or pick one. |
| WLD-05, WLD-08, WLD-09, WLD-13, WLD-14 | Each other | One "gotcha" device per episode, rarely two. |
| WLD-05 | The standing note: boxes only when the box exists in the story world | The two halves are in-world screens. |
| WLD-08 | RUMPT's arc cards (P15) in Ep9; THE HORSESHOE's hold | Drop his row if P15 carries it. The Ep9 writer decides whether the horseshoe's hold survives. |
| WLD-11, WLD-15 | Ep10's booked shelf (the Intern reads the first prophecy as a to-do list); Ep3's THE CORKBOARD | The shelf is the to-do list. The pin board must read as a different object from the corkboard. |
| CAP-22 | J5 (the first perfect render) | The near-photoreal rung comes only after J5. |
| DET-18 | [guardrails §4](guardrails.md#4-how-facts-appear-on-screen); outro C | A camera ID and no timestamp. The Ep12 frames go to the outro owner if C wins. |
| DET-20, META-07, META-13 | guardrails §1a–1b | No [K], [SINGLE], [UNVERIFIED] or X-list rows in anything published. |

---

## 7. Rulings, resources and facts to verify

### 7.1 Rulings needed

The rulings this file asks for are numbered `EL-n`, so they don't collide with style-range's R-numbers or ai-media-range's AIM-numbers.

| # | Who | What | Recommendation | Default until answered |
|---|---|---|---|---|
| **EL-1** | Showrunner | **The house-standards bundle,** one yes or no: F1 (with the producer limits), F2, CAP-10 (with the idiom), DET-01's moon, DET-02, DET-03, DET-05, WLD-10, and DET-19's plain tracks | Yes | Each stays an idea |
| **EL-2** | Showrunner | **Freeze the record at `TODAY · SEP 24, 2026`, or let it roll** | Freeze. The Ep10 anchors stay as scheduled facts with invented, visibly absurd outcomes. Anything later goes on the receipts page under "since the cutoff". Fix only a guardrail matter (an invented outcome that reality turns into a claim about a real person). DET-09's Ep10 line becomes the honest trace | Frozen; WLD-21 to WLD-23 parked |
| **EL-3** | Showrunner | META-14 shows the showrunner's own notes | Yes, if the showrunner is comfortable | Not shown |
| EL-4 | Showrunner | DET-09's Ep10 cutoff line must not read as the cut speculation label | Fine print only, never voiced or carded | Not used |
| — | Intro owner | CAP-01 leaves the intro's cached GLYPH (S1, S6, S7) alone | — | Fixed reference |
| — | Style-range owner (GLYPH) | CAP-01's growing glyph set in place of a resolution ladder; CAP-06 as the spine's lettering schedule; CAP-22's top rung after J5; STY-18 (Ep8's dialogue sound); the register strips for STY-07, STY-10, STY-16 and STY-22 | — | As style-range is written |
| — | ai-media-range owner | CAP-08's date correction; CAP-18's "never breathes"; CAP-19's instrumental rungs; STY-01's two reels; WLD-16's summaries | — | As that file is written |
| — | Outro owner | DET-18's Ep12 frames if outro C wins; the receipts pointer | — | The base credits only |
| — | Credits owner (with AIM-9) | DET-20's on-screen footer merged into the weekly ledger line | — | The ledger line as ai-media-range drafts it |
| — | Guardrails owner | DET-20's tag glyph on quote cards; DET-18's overlay (camera ID, no timestamp); WLD-08's stance words | — | Cards unchanged; no timestamp |
| — | G03's owner (tracker) | The idiom's Eps 10–12 drift toward Mas's lowercase as a rung of G03 | — | Not taken |
| — | Naming (§8 coinages) | ELGOOG's video model (CAP-08), benchmark and exam titles (CAP-12, CAP-13), a byline for WLD-12 if one is ever needed, the forecast book's title (WLD-15) | — | No names on screen |
| — | Engine lead | F1: add `studio/src/shared/record/` and the record check (warn until picture lock) | — | Not added |
| — | Legal / clearance | DET-06 docket numbers; DET-20's and META-07's real names and trim; META-11's date | — | Parody names and source types only; nothing published |

### 7.2 Resource asks (per the "always ask" note)

- **F1 permission** (above). Most of the house standards build on it.
- **Who may sign `reviewed: true`?** Every signature is otherwise the showrunner's time, the scarcest resource on the show. A named facts owner would save it. It's never a script.
- **Historical market data and historical weather files** (DET-05, DET-01's weather). Optional: hand-compiled tables work for the first pass.
- **A blind or low-vision reviewer** for DET-19's audio description.
- **The showrunner's OK** for META-14's notes (EL-3).
- **Archive capture this week** (no spend): the facts owner saves the public record of the Sep 29 meeting, DevDay and YELWAH's Oct 1 deadline as they happen (§7.3).
- **CAP-09** is parked. If it ever returns, it routes through [ai-media-range](ai-media-range.md), and about 9 GB of free disk is tight.

### 7.3 Facts to verify before anything reaches the screen

Everything here is **[K]**: recalled by a brainstorm or the critic, not re-checked. It stays off screen (or behind `RECONSTRUCTED` / `(REPORTED)`) until the facts pass upgrades it.

- **Added in the critic pass:**
  - **(a) Mas's "missing most technical nuance…"** is filed under Mar 22–29, 2023 in the timeline, and the first draft printed it as Mar 2023 (WLD-07, WLD-08). He reportedly said it at an MIT event in mid-April 2023. Re-date it and re-tag the row.
  - **(b) SAMA NOS's "1 billion AI agents":** some Jul 16, 2025 coverage reads "by the end of this year", meaning 2025. Check before WLD-13's pin shows any year.
  - **(c) SIRRAH's end of the WLD-08 board** is [H], so it would need the headline's exact words. His row is dropped, so this matters only if it returns.
  - **(d) `HUMAN: VERIFIED. SIDE: UNCLEAR.` is the Orb's line** (G07), never "the machine's". The first draft's CAP-16 gave it away.
  - **(e) CLOD's Sep 22, 2026 release wording** ("less Claudish writing", which the critic tags [V]) and its name, for CAP-10's CLOD tic.
  - **(f) The era tics** in CAP-10's idiom are recalled patterns, not quotes. Keep them as invented lines, and check each era's placement before lock.
  - **(g) This week (a facts task, no ruling or render needed):** archive the public record of the Sep 29 CEO meeting, DevDay 2026 and YELWAH's Oct 1 deadline as they happen (readouts, posts, transcripts, attendee lists), and tag the rows into `ep10/facts.md`. That's a handoff to the Ep10 facts owner, since this pass edits no other file. Nov 3's midterms are five weeks later, so keep X11 in view.
- **Machine history (CAP-04 to CAP-17, DET-07 to DET-09, DET-13):**
  - Image and video failures: the "full wine glass" image failure and its fix (Mar 2025), the 10:10 clock bias, and the first video model with native audio (a rival's, May 20, 2025).
  - Products and UI: NopeAI's AI-text classifier shut down (Jul 2023); the "thought for N seconds" UI (Sep 2024); the model-picker entries by month, the Feb 12, 2025 roadmap post's wording and casing, and the old model's return after GTP-5; coding agents running 7+ hours (Sep 2025).
  - Benchmarks: the benchmark saturation dates, o3's ARC-AGI result, and the GPQA, FrontierMath and "last exam" dates; analog-clock reading failures (2025).
  - Other: the 2023 sanctions for invented citations; training-compute estimates by year; the real-time translation demo (May 2024); API prices by date; DevDay 2023's April 2023 knowledge cutoff.
- **World and calendar (DET-01 to DET-06, WLD-*):**
  - The Jan 20, 2025 inauguration moved indoors; SHIPMAS's weekday schedule; the INVIDIA 10-for-1 split effective Jun 10, 2024.
  - Every moon phase (the scratch almanac is good to about a day).
  - The Ep8 docket and exhibit numbers; the GATESTAR "…begin deploying $100 billion immediately." and the 100x-cap wording (upgrade both to [P]).
  - The 1993 VISION-21 paper's date (Mar 30–31, 1993) and its "within thirty years" sentence.
  - Which supply-chain clock is operative (the Feb 27 post or the Mar 5 designation); the medium of GERG's "arrival of AGI" line.
  - THE FORECASTER's scenario milestones and titles; that the UNGA transcript is AI-generated; SOZEB's "industrial bubble" line.
- **Release (META-*):** the `100,000,000 / WEEK` DevDay figure (Ep1 facts #63).

---

## 8. Considered, rejected, cut and parked

This section is here so nobody re-pitches these blindly. If you want one back, answer its reason first.

### 8.1 Rejected in the first curator pass

| Idea | Why not |
|---|---|
| **The whole picture sharpens episode by episode** (the literal reading of the seed) | The pixel base never rises ([style-range](style-range.md#the-range-in-twelve-lines)). It would turn range into a quota and shut out the human media. The seed lives on machine-owned surfaces instead (§1.0). |
| **Period "bad hands" or melted faces on people** | P29: machine flaws never land on a person, a face or a hand. The joke moved to clock hands (CAP-05). |
| **Ep7's show-level ad break** (a 6 s ad built from the lasagna, in the show's own frame) | Style-range already declines "a food commercial on the lasagna gag" as a genre re-draw and cut 7.B's near-photoreal version ([§5.3 test 5](style-range.md#53-taste-tests), [§6.15](style-range.md#615-reserve-and-cut)). It's also the UI wink pacing law L8 bans. The in-monitor P23 promo already carries the beat, and AM7.a is Ep7's machine-made ad. |
| **HOW MANY R'S?, asked in every episode** | It repeats Ep3's set piece until it's stale. CAP-10 and CAP-04 carry the month-by-month read without repeating a joke. |
| **CALLED IT? graded in Ep12's own credits at first air** | Grading extrapolated beats inside season 1 is a speculation label in disguise, and at first air there's almost nothing to grade. |
| **Any AI "previously on"**, weekly or four times a season | ai-media-range §3.15: "The format has no recaps; it would spoil." STY-01 keeps only two in-world product reels, shown as products. |
| **A "previously on" in Mas's V.O.** | pov §2.5 rejects direct-address narration, and his V.O. may never recap the Blip. |
| **Mas's V.O. appearing on his monitor as ghost text** | It breaks the POV contract: the V.O. is never heard in the world, the model included. |
| **CAP-25 · the narrator's caret** (a cyan caret after his V.O. subtitle, Eps 10–12) | Moved here in the critic pass. It's the ghost-text V.O. at one pixel, and ambiguity doesn't repair a breach of the POV contract. |
| **A choose-your-own-adventure where the viewer picks Mas's choices** | pov §2.5 rejects choice menus as his thoughts. META-08, which handed the viewer the board's arrow instead, is also cut (§8.2). |
| **A fully reverse-order episode** | The fact spine and the rail run forward, and newcomer clarity suffers. STY-05 gets the benefit in 20 s. |
| **A flash-forward cold open** | Law L9: no announced climaxes. |
| **A laugh-track or sitcom-format episode** | Tone §1: this is a thriller with a satirist's eye, not a sitcom. |
| **WHERE'S ALYI? as a true-crime docuseries** | True-crime grammar implies something sinister about a real person (next to X9). The point-and-click search already carries it. |
| **A "Twelve Days of Shipmas" carol** | Corny. SHIPMAS already plays as the company's livestream. |
| **The machine narrating humans in a nature-documentary voice** | Overused, and it fights the rule that only Mas has V.O. |
| **NOLE's 2018 goodbye as a silent film with intertitles** | "Played without captions" already carries it, and a pastiche would mock a real moment. |
| **The machine speaking in collaged real quotes** | Recutting a real line changes the record. Quotation marks mean the record. |
| **Real news crawls, or the day's real non-AI headline on the lobby TV** | Front pages carry X5/X6 material (war, deaths), which can't be managed. Crawls use only AI and tech items already in facts.md. |
| **The midterms as a visible absence in Ep10** (a taped-over page) | Too close to X11, and it reads as the show hedging. |
| **A year-end "Wrapped" card with invented stats in a real-looking UI** | Invented data next to real dates breaks guardrails §4. |
| **A "Mas" social feed on the companion site** | Invented posts styled as real posts (guardrails §4). |
| **An in-universe BESTIES podcast** | Designed voices near real podcasters, and SKCAS is an official, so it would need human performers. |
| **Caricature merch or trading cards** | No real likeness on promos or merch (guardrails §5). |
| **An "In a world…" trailer voice** | Corny. |
| **Act cards in each episode's file type** | Runtime, and a gimmick. The title card already carries the file. |
| **Keycaps that spell a hidden message** | It would bend each keycap's callback logic (SCRIPT §8.1). |
| **A greyed-out "Skip intro" on streaming platforms** | Not ours to control. |
| **The successor naming itself SAM** | Already banned in naming. |
| **Any joke about the writers' model in military use** | X6. |
| **The Doomsday Clock on NOTNIH's clock face** | Nuclear framing edges toward X6, and his own dials already carry his numbers. |
| **Lunar New Year imagery near THE WHALE** (Jan 29, 2025, two days after the −$589B day) | THE WHALE's banned imagery covers lanterns, dragons and gongs. The sky that week stays a plain new moon. |
| **The Oct 2, 2024 annular eclipse on the $157B day** | It wasn't visible from San Francisco, so it can't be in his sky, and a "ring of fire" over the ring would be a wink. |
| **Staging the Twitter → X rename (Jul 2023)** | RUMPT is the only character who renames things in-world (P02). The platform's UI may change era silently in the background, never as an act. |
| **A CRT whine in the 1993 room** | A small 1-bit display scans at around 22 kHz, above adult hearing, so a whine would be false. The crackle (DET-15) is true. |
| **One Rashomon render carrying the correct sky** | Equal polish means no version reads as the lie, and a correct moon would read as the truth. None of the four renders shows a sky. |
| **A "supermoon" pun on "super" at UNGA** | Unverified, and a pun. |
| **Real OS chimes or stock ringtones** | Trademark (guardrails §5). |
| **A photos-app "on this day" memories feature** | Too close to X1 (private life) and to the Orb's replays. |

### 8.2 Cut in the critic pass

The numbers in brackets are the critic's amendment numbers ([§9](#9-critic-log)). "Curator" marks a cut this pass made on its own reading, logged in §9.

| Idea | Why it's cut |
|---|---|
| **CAP-01's resolution ladder and its Ep12 sweep** [7] | Its payoff is invisible by design, only frame-steppers would see it, and it would stop J4's tells reading as legible token columns. The growing glyph set stays. |
| **CAP-02 · one upgrading surface in the intro** [36] | A third frame ladder, which SCRIPT §8 forbids ("no per-episode style switch"). |
| **CAP-03 · THE PLAN's pen** [19] | THE PLAN is THE RECORD, so a machine-drawn PLAN before Ep12 makes the record suspect. Its Ep12 rung is already booked. |
| **CAP-04's Ep7 rung and its credits-bezel variant** [8, 21] | AM7.a owns Ep7's glass gag, and the outro is overbooked. |
| **CAP-05's Ep12 snap** (curator) | A payoff on a texture entry (§1.0), in Ep12's most crowded beat. |
| **CAP-06's Ep12 house-font rung**, **CAP-10's Ep12 input field** [19] | Rule 11: STY-02 owns the takeover. |
| **CAP-11's Ep12 line and `thought for 34 years`** [20]; **its Ep10 expanding chip** (curator) | Rule 12. The Ep10 chip is a payoff that doesn't replace a ladder (rule 10). |
| **CAP-12's Ep12 credits banner and title-card bar** (curator) | The outro is overbooked, and the bar is a new ladder. |
| **CAP-14 · DOT's timesheet** [25] | METR's curve measures software and research tasks at 50% success, so mapping it onto a receptionist's shift is a category error insiders will catch. It implies a claim about her job that the record doesn't make (world-stakes §8.5). Re-sourcing it would still land on her overbooked desk. |
| **CAP-16 · who proves they're human** [46d, 47] | Retired. Its rungs are booked (Ep9 #5, G07), orbit-and-lore ruled the CAPTCHA "payoff only" (so no Ep4 setup), and the button's verdict is the Orb's. |
| **CAP-17's payoff framing** [24] | It casts real witnesses' sworn testimony as self-serving (X9, and a defamation risk). The Ep2/Ep3 egg stays. |
| **CAP-18's breath for Mas** [32] | pov §3.6 reserves breathing, heartbeat and ringing sounds. |
| **CAP-19's sung rungs** [3] | ai-media-range §3.15 declines a music-model song before Ep12. |
| **CAP-21 before Ep10** [26] | Empty booths at APEC 2023 or the Sep 24, 2026 state dinner assert a false detail at real diplomatic events. |
| **CAP-23's three bold variants** [18] | THE NEXT LINE is a wink that crowds the standoff. Early captions and an early describer turn access tracks into a toy (rule 13). |
| **CAP-26 · the pilot, remastered** [36] | A tech demo in a crowded montage. Its release half is in META-14. |
| **DET-01's Eps 10–12 sky drift** (curator) | A new ladder (rule 10). |
| **DET-04's mains hum** [37] | Its fundamentals are below what phone and laptop speakers reproduce, and its harmonics would sit at −50 dBFS under the bed. |
| **DET-10 as a payoff** ("one item per obstacle", the invite already `Yes`) [10] | It would rewrite the ensemble heist, and the machine would be choosing for him (pov §1.6). The check stays. |
| **DET-11 · the plant** [36] | Twee. |
| **DET-12 · find the caret** [36] | It duplicates the intro's cursor-face ladder. |
| **DET-13's `modified by:` runner, outro line and lowercase disclaimer** [19, 21]; **its 24,000 Hz `her.wav`** [37] | Rule 11, and the outro is overbooked. The 24 kHz format belongs to the Oct 2024 realtime API, after Ep2's window. |
| **DET-14 · the GLYPH notes** [20] | Rule 12. |
| **DET-15's call ducking** [31] | Note 11 complains of lines that "randomly blurt out or cut off", and the ducking would make overlaps clip. |
| **DET-17 · the ransom-note veto** [20] | Rule 12. At speed, mixed typefaces make the season's key line read as noise, and it needs plants in ten episodes. |
| **DET-19's early captions and early describer** [18] | Rule 13. |
| **DET-20's render hashes in THE PLAN's fine print** (curator) | A hash changes on any re-render (the same flaw that cut WLD-24), and THE PLAN is THE RECORD. The hashes stay on the receipts page. |
| **WLD-01's page lifts before Ep8, and its dark-room twin** [34, 29] | The collision table's version wins: never animated before Ep8. The walls are crowded. |
| **WLD-02's `WHY SO MUCH` pocket** [12] | It implies NESNEJ held back the explanation, which gives him a motive (rule 2). |
| **WLD-03 · DAY 730** (curator) | It contradicts the booked split-flap: Ep3's clock can't find a number, Ep6 has it find dates, and Ep10 gives it a red pen. Ep6's pass made the wall "one prop, not two". |
| **WLD-06 · the writers' model on its own release day** [36] | It reads as promotion however it's lit. |
| **WLD-08's NOLE and SIRRAH rows** [13] | NOLE's is consistent, not a reversal. SIRRAH's "two letters" is a gaffe, not a position. |
| **WLD-11's Ep10 to-do-list rung and Ep12 stamping rung** (curator) | Ep10's booked shelf already has the Intern read a prophecy as a to-do list, and Ep12's Act Three is down to three moves. |
| **WLD-16's machine-written summaries and Ep12 lock screen** (curator) | MACHINE SUMMARIES owns the summary ladder, and `1,200,000 unread` echoes the veto counter the Ep12 critics cut. |
| **WLD-17 · the record's density sets the tempo** [37] | It touches the locked intro curve for no gain anyone can perceive. |
| **WLD-24 · the sealed forecast** [37] | A hash in fine print is a prophecy claim, a speculation label by another route, and it means nothing once anything is re-rendered. |
| **STY-01's Ep5 and Ep12 rungs**, and its framing as a recap for the audience [17] | Ep5 names the show in the world and compliments the viewer (pov §2.5). Ep12's `learned:` tags caption the thesis. ai-media-range declines AI recaps. |
| **STY-02's Ep4 ghost text, and `VETO.` overwriting ASK** [9] | The ghost text collides with Ep11's intro ghost text and G04's Ep4 strip. The overwrite contradicts the booked two-letter swap and the ruling that the veto no longer stacks. |
| **STY-04's scroll back through every date** [33] | The machine deleted the year, so every chyron is the empty field, and the scroll adds a move to a three-move act. The quiet typing of `1993` stays. |
| **STY-09 · the 360 review as a mockumentary** [36] | The Office's talking-head glance is exactly what style-range's taste test 8 bars. The booked zoetrope (10.B) stays. |
| **STY-16 as a oner** [33] | A second oner dilutes 12.K. It's kept only as a pan of 10 s or less, cut on the seats. |
| **META-01 · the house rules** [16] | The machine renders faces and clones voices all season (CAMEO CITY's deepfake Mases, Ep1's cloned senator, G42's "the best deepfake of Mas is the model itself"). A rules file saying otherwise pastes the production's rules into the fiction, which is a wink, and "change the names" breaks the fourth wall outright. It explains the veto as rule-following, which shrinks both the thesis and the ambiguity of `define "win."`, and it's the show congratulating itself inside its own climax. The real rules go in DET-20's footer. |
| **META-02's in-episode form** [44] | Our own drafts inside Ep10's fiction are a wink. The honest half is META-14. |
| **META-03 · the Orb flags the sky** [36] | A `GENERATED` toast deflates J5 and pre-empts the Orb's last verdict. ai-media-range §1.4 owns disclosure. |
| **META-04 · the credits creep** [21] | A fictional `story by: THE INTERN` on the pane that carries the real AI disclosure blurs which credits are true, and "written by: you." is direct address. |
| **META-05 · the outro mantel** [36] | Twee. (Amendment 21 parked it and 36 cut it; this pass followed 36.) |
| **META-08 · you are the board** [22] | A game where the viewer tries ways to "remove" Mas sits next to X4, the attack on the real CEO's home in Apr 2026, and at scale "absurd methods" will produce something that reads as violence. It also sits on the Blip, the most guarded event in the show. ai-media-range §3.15 allows only a fixed-text page, after the season. |
| **META-09 · how to make a show with a model** [44] | Merged into META-14. |

### 8.3 Parked

The cost of these is far above the return before a pilot is approved, or they wait on a decision that hasn't been made.

| Idea | Parked until | Note |
|---|---|---|
| **CAP-09 · period-authentic generation** [38] | Never, for NopeAI's own surfaces | NopeAI's models are closed, so its in-world surfaces keep the imitation anyway. About 9 GB of disk is free. |
| **DET-19's styled caption track** [38] | After a pilot is approved | Always beside the plain track, never replacing it. |
| **STY-11 · screen-life with a menu-bar fuse** [38] | After Ep1's grammar is approved | It's the one big form swing worth keeping in reserve. |
| **WLD-18 · the fortnight in real time** [38] | — | It runs against notes 7 and 13. |
| **WLD-20 · the IOU shelf** [27, 28] | If DOT's desk frees up | The IOU gets the outline's fate, and DOT's Ep12 "Welcome." stays hers. |
| **WLD-21 · the late-breaking slot** [14, 15] | EL-2 (only if the record rolls) | It's no longer time-critical. No episode is locked, Act Four is at v4, and Eps 9 and 10 air months after Sep 29 at the earliest, so a South Park turnaround isn't possible. The facts task is live (§7.3 g). A patch short would also land five weeks before the midterms (X11). |
| **WLD-22 · the rail keeps rolling** [15, 21, 38] | EL-2 and distribution | On YouTube-style platforms a re-upload is a new video, which resets views and comments. |
| **WLD-23 · point releases and live props** [15, 38] | EL-2 and distribution | The same re-upload problem. Its `ep1.0.1` is in META-14. |
| **WLD-25 · the show grades itself** [38] | After the season | The companion page and the S2 cold open, THE RECKONING. |
| **META-06 · the in-universe site** [38] | After a pilot is approved | The status page is the centrepiece: one joke per page. |
| **META-10's earnings call** [38] | After a pilot is approved | It needs a human performer, or a voice designed to resemble nobody. |
| **META-12 · the reverse bookend** [38] | Season 2 | Keep limited third person through Mas; flip only the intro. |
| **META-13 · the open-weights drop** [23] | Legal and showrunner decisions | **Added exclusion:** any release is curated scripts plus a trimmed facts export only. The bible and research files name the specific allegations and private matters the show refuses to depict (guardrails §1a–1b), and publishing them as "weights" would republish that list. |

---

## 9. Critic log

The critic's 47 amendments, in the critic's order, and what this pass did with each. **Applied** means as written. **Applied, amended** means the intent is kept, with a change explained in the note. There were no outright declines. The partial departures are all marked "amended" and give their reason.

| # | Amendment (short) | Outcome | Note |
|---|---|---|---|
| 1 | A verdict on each of the twelve | Applied | CAP-01 is a texture rule; CAP-04 kept; CAP-10 a house standard; CAP-23 next in line; STY-01 into MACHINE SUMMARIES; STY-02 kept; DET-10 a check; DET-18 kept; WLD-02 a free win; WLD-08 replacement only; WLD-21 parked; META-01 cut. |
| 2 | Replace the shortlist with six | Applied | The six and the next-in-line list are the critic's. Free wins are cut from 11 to 8. |
| 3 | Reconcile with ai-media-range | Applied, amended | The dead links and "being written" notes are fixed, and CAP-08, CAP-09, CAP-18, CAP-19 and META-03 are pointers or cut. One precision: §3.15 declines a *music-model* song before Ep12, and AM7.c holds YLLIT's song for a human performer. So CAP-19 keeps only instrumental rungs, and YLLIT's song stays AM7.c's call. |
| 4 | One registry for the seed | Applied | §1.0. |
| 5 | Too many ladders | Applied | Rule 10, applied across the whole file, not only §1. |
| 6 | House standards, as a bundle | Applied, amended | DET-02's Friday pastry tray is left out of the bundle: it's a runner, not a standard. It stays an optional egg. |
| 7 | CAP-01 down to a rule | Applied | The intro's cached GLYPH is exempt. |
| 8 | CAP-04 fixes (a)–(e) | Applied, amended | The critic's beat numbers for 12.A and J6 (#6, #17) are off by one against the current Ep12 beats.md, where 12.A is #5 and J6 is inside #16. The entry uses #5 and #16. |
| 9 | STY-02 fixes | Applied | (c) is resolved by dropping the Ep4 ghost-text rung entirely, since G04's Ep4 strip already carries the suggestion era. |
| 10 | DET-10 becomes a check | Applied | |
| 11 | DET-18 fixes | Applied | |
| 12 | WLD-02 becomes a free win | Applied, amended | **W9.1 is a reserve, not booked.** world-stakes lists it, but the Ep9 outline keeps it "on the menu", and the season revision says "W9.1 stays out; Ep9 already has her screwdriver". So WLD-02 plays only if Ep9 restores W9.1. The critic's point (the answer belongs to DOT) stands. |
| 13 | WLD-08 as a replacement only | Applied | NOLE's and SIRRAH's rows are dropped rather than replaced, because there's no verified reversal to put in their place. That leaves five rows. |
| 14 | Remove WLD-21 and its time-critical flag | Applied | The archive task is written as a handoff (§7.3 g), because this pass edits no other file. |
| 15 | Ruling: freeze the record | Applied | EL-2 (freeze recommended) and rule 15. DET-09's Ep10 line is now the honest trace. |
| 16 | Cut META-01 | Applied | |
| 17 | STY-01 into MACHINE SUMMARIES | Applied | |
| 18 | CAP-23 restrained | Applied | |
| 19 | One owner for the takeover | Applied | Rule 11. The critic's list is applied entry by entry (CAP-03, CAP-06, CAP-10, DET-13, META-04, STY-01, CAP-25). |
| 20 | Cut the thesis-on-screen entries | Applied | Rule 12. |
| 21 | The outro is overbooked | Applied, amended | META-05 is cut, not parked: amendment 36 also calls it twee, and parking it would only defer the same verdict. DET-13's closing line is dropped too, as part of the rule-11 cut. |
| 22 | Cut META-08 | Applied | |
| 23 | META-13 parked, with an exclusion; trim DET-20 and META-07 | Applied | |
| 24 | CAP-17 egg only | Applied | |
| 25 | CAP-14: cut or re-source | Applied (cut) | Re-sourcing would still land on DOT's desk, which amendment 27 finds overbooked. |
| 26 | CAP-21 in Eps 10–12 only | Applied | |
| 27 | DOT and the lobby are overbooked | Applied | This pass also moved CAP-15's Ep5 instance off DOT's desk. W9.1 is corrected to "reserve" (see 12). |
| 28 | The IOU gets one fate | Applied | |
| 29 | The dark-room walls | Applied, amended | This pass went further: WLD-03 is cut (it contradicts the booked split-flap) and WLD-01's twin is dropped, so the pin board is the only new wall object. |
| 30 | Ep9's density | Applied | |
| 31 | Clashes with the live notes; a decide-by column | Applied | The decide-by column is in the [newcomer table](#newcomer-and-decide-by). |
| 32 | CAP-18's breath | Applied | |
| 33 | Ep12's Act Three | Applied | STY-04 is kept only as typing `1993` inside the existing "1993 turns" move. STY-16 is kept at 10 s or less, not a oner. |
| 34 | WLD-01 contradicts itself | Applied | |
| 35 | WLD-05 on in-world screens | Applied | |
| 36 | Cut the corny or gimmicky | Applied | |
| 37 | Cut the inside-baseball or inaudible | Applied | DET-13 survives as title-card texture with a corrected, era-neutral WAV header. |
| 38 | Park what costs far above its return | Applied | |
| 39 | CAP-25 to §8 | Applied | |
| 40 | F1's producer limits | Applied | |
| 41 | Genre first; a newcomer column | Applied | Rule 14, and one table in place of a field on every entry, so it can be kept current in one place. |
| 42 | The machine's idiom by year | Applied, amended | It sits inside CAP-10's house standard. Its Eps 10–12 drift toward Mas's lowercase is offered to G03's owner rather than added as a new ladder, to respect amendments 4 and 5. |
| 43 | The walk-and-talk | Applied | STY-23. It isn't placed in Ep9 (30), or in Ep1 before the Act Four dialogue pass (31). |
| 44 | The same ten seconds | Applied, amended | The milestone history is Act Four's (the v1–v4 animatics), not the cold open's. The notes file records the v4 measurement without saying who took it, so META-14 doesn't attribute it. |
| 45 | Additions to "already in the show" | Applied | |
| 46 | Facts (a)–(d) | Applied | §7.3. |
| 47 | Update the stale lines | Applied | CAP-16's stale Ep4 setup retires the entry, since its other rungs are booked. Appendix B is kept as the critic confirmed it. |

**Curator findings beyond the critic's list** (each is listed in §8.2 or noted in its entry):
- **WLD-03 is cut:** it contradicts the booked split-flap.
- **WLD-11 loses its Ep10 and Ep12 rungs:** Ep10's booked shelf and the three-move Act Three.
- **WLD-15 counts as a ladder** under rule 10.
- **WLD-16's summaries go to MACHINE SUMMARIES,** and its Ep12 lock screen is cut.
- **CAP-22's near-photoreal rung waits for J5.**
- **The payoffs on texture entries go:** CAP-05's Ep12 snap, CAP-11's Ep10 chip, and CAP-12's Ep12 banner and title-card bar.
- **DET-01's Eps 10–12 drift is cut.**
- **DET-20's hashes in THE PLAN's fine print are cut.**
- **CAP-15's Ep5 instance moves to the ticker.**

---

## Appendix A. Merge map

The ideas that combine more than one pitch. Brainstorm ids: **cap** = capability, **det** = detail, **wld** = world, **sty** = story, **meta** = meta and format. **critic** = the critic pass.

| Here | Merged from |
|---|---|
| F1 | det §0 (the scene date record) · wld §0.1 (the record layer and lint) · wld 20 (every number computed) · critic 40 (the producer limits) |
| F2 | cap (the flaws, UI and price tables implied across CAP-05, 11, 12, 14) · det 7, 8, 9, 11, 12 (their JSON tables) |
| CAP-04 | cap CAP-05 (the glass test) · det 8 (the full glass) · meta 11 (the credits benchmark, since cut) · critic 8 |
| CAP-05 | cap CAP-06 · det 8's clock companion |
| CAP-10 | cap CAP-11 (the window by date) · cap CAP-12 (the stream rate) · det 9 (the picker) · CAP-11's surviving texture · critic 42 (the idiom by year) |
| CAP-12 | det 12 (retired jerseys) |
| CAP-23 | cap CAP-24 (the render ahead) · critic 18 (STY-13 as its Ep11 instance) |
| DET-01 | det 1 (the moon) · det 2 (weather) · wld 21 (the sky is accurate) |
| DET-05 | det 14 (every chart is real) · wld 20 (computed counters) |
| DET-06 | det 15 (fine print) · det 16 (the docket) |
| DET-09 | det 10 (the chatbot never heard) · meta 6 (knowledge cutoff) |
| DET-10 | det 17 (the inventory is canon) · sty S17 (Chekhov's inventory) |
| DET-13 | det 20 (file properties) |
| DET-19 | det 27 (captions) · det 28 (AD and the colour-safe pass) |
| DET-20 | det 24 (THE RECEIPT) · wld 22 (the confidence dot and sources roll) · meta 13 (the provenance page) · critic 16 (the real rules) and 21 (the footer into the ledger line) |
| WLD-01 | wld 1 (THE CALENDAR remembers) · det 4 (THE CALENDAR was always there) |
| WLD-10 | wld 10 (provenance) · wld 17 (the news corrects itself) |
| WLD-11 | wld (the pin board) · critic 29 (hosts WLD-12, 13 and 14) |
| WLD-19 | wld 23 (the dossiers are the fact files) · meta 4 (seated by screen time) |
| STY-02 | cap CAP-03 (the band finishes his sentences) · sty S09 (the Intern takes the player's seat) · critic 9 (the ASK restaging) |
| STY-23 | critic 43 |
| META-14 | critic 44 · META-02 · META-09 · CAP-26's release half · WLD-23's `ep1.0.1` |
| *(cut or parked, kept for the record)* WLD-21 | sty S27 (the late-breaking slot) · meta 14 (the hotfix) |
| *(parked)* WLD-23 | wld 26 (live props and patch notes) · det 25 (patch notes) · meta 15 (patch notes for the future) |
| *(parked)* WLD-25 | sty S28 (the prediction ledger) · meta 26 (THE RECKONING) · det 26 (CALLED IT?, companion form only) |
| *(parked)* META-06 | meta 16 (status page) · 17 (help center) · 18 (product pages) · 19 (the deck) · 20 (the uncancellable gate) |
| *(cut)* CAP-02 | cap CAP-02 (the Orb period) · meta 9 (the monitor upgrade) |
| *(cut)* WLD-06 | wld 6 (the writer on the ticker) · meta 3 (now with fewer caveats) |

## Appendix B. Date arithmetic already checked

Computed in the first pass and re-run by the critic, so nobody needs to redo it. The rows still need their facts.md tags.

| Claim | Check |
|---|---|
| Sep 23, 2024 → Sep 23, 2026 | 730 days (WLD-03, now cut; kept for the record) |
| Jul 5, 2023 → Sep 24, 2026 | 1,177 days (the IOU's age at the state dinner) |
| Mar 26, 2026 → Sep 19, 2026 | 177 days (the empty CZAR hook) |
| Feb 10, 2025 → Nov 17, 2025 | 280 days (DAYS SINCE the bid) |
| Aug 12, 2026 → Sep 21, 2026 | 40 days (KORG 4.7's "3+ weeks") |
| Feb 27, 2026 + 180 days | Aug 26, 2026. Six calendar months is Aug 27. Mar 5 + 180 days is Sep 1 (WLD-04) |
| Mar 30, 1993 → Nov 30, 2022 | 29 years and 8 months (WLD-12) |
| Weekdays | THE BLIP, Fri Nov 17, 2023 · leap day, Thu Feb 29, 2024 · the veto, **Sun** Sep 29, 2024 · SB 53, Mon Sep 29, 2025 · the summit, Tue Sep 29, 2026 · SHIPMAS, Thu Dec 5 → Fri Dec 20, 2024 · inauguration, Mon Jan 20, 2025 · THE BIG GAME, Sun Feb 8, 2026 · the lobster, **Sat** Feb 14, 2026 · the ban post, **Fri** Feb 27, 2026 · "Who?", **Fri** Apr 17, 2026 · Jul 23: Wed (2025), Thu (2026) · the state dinner, Thu Sep 24, 2026 · the proposed pilot release, Mon Nov 30, 2026 |
