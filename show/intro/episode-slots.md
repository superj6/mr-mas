> **Status: v1 reference, superseded where it conflicts.** The master opening script is now [`SCRIPT.md`](SCRIPT.md) (v2.1, 2026-09-25). v2.0 changes the visual style to pixel art with motivated style switches (see `studio/INTRO_PIXEL_BRIEF.md`) and the music to a piano / orchestral / big-band blend with a jazz feel and 8-bit motifs (variations V1–V4). This file's timing, gags and text remain useful detail.
>
> **Spoiler note (2026-09-26).** v2.1 retires the bar-9 news slot and makes every per-episode state **one episode behind**: the intro of episode N shows only what episodes 1 to N−1 aired ([SCRIPT §8](SCRIPT.md#8-per-episode-changes-ep112-spoiler-safe)). Where this file still lists an episode's own events (the bar-9 headlines in §2 and §4, the §5 skyline, the §6 subtitles and toasts), treat them as research only; the on-screen values are SCRIPT §8.1–§8.4. §7 has been brought into line.

# Opening Titles: Per-Episode Slots (Ep1–12)

This file covers **what changes in the intro every episode.** Think of it as the couch gag, the running eggs, and THE PODIUM's slow reveal.

| | |
|---|---|
| **Version** | v1.1, 2026-09-25 |
| **Built from** | [`_sources/design/final.md`](../_sources/design/final.md) §3 (slot table, eggs) · [`worldcast-cast-integration.md`](../_sources/research/worldcast-cast-integration.md) §4–§5 (RUMPT, THE PODIUM states) · [`worldcast-flashback-map.md`](../_sources/research/worldcast-flashback-map.md) §0, §2 (the tally thread) · [`worldcast-critic.md`](../_sources/research/worldcast-critic.md) (corrections applied) · [`gaps.md`](../_sources/research/gaps.md) and [`recent.md`](../_sources/research/recent.md) (quote and number checks) |
| **See also** | [spec.md](spec.md) · [shot-table.md](shot-table.md) (the frame ranges these override, §4) · [cue-sheet.md](cue-sheet.md) §7 (per-episode audio) |
| **Per-episode sheets** | Each episode's `intro-slot.md` holds the production detail: [ep01](../episodes/ep01/intro-slot.md) · [ep02](../episodes/ep02/intro-slot.md) · [ep03](../episodes/ep03/intro-slot.md) · [ep04](../episodes/ep04/intro-slot.md) · [ep05](../episodes/ep05/intro-slot.md) · [ep06](../episodes/ep06/intro-slot.md) · [ep07](../episodes/ep07/intro-slot.md) · [ep08](../episodes/ep08/intro-slot.md) · [ep09](../episodes/ep09/intro-slot.md) · [ep10](../episodes/ep10/intro-slot.md) · [ep11](../episodes/ep11/intro-slot.md) · [ep12](../episodes/ep12/intro-slot.md) |

**Tags:**
- **[V]** verified from text
- **[P]** or **[P✓]** primary source
- **[H]** dated headline only
- **[K]** widely reported, not re-checked; re-verify before lock
- **[SPEC]** speculative episode (Eps 10–12)
- **[INVENTED]** comedic invention
- **[PROPOSAL]** new in v1.1 and needs head-writer sign-off

All headlines, subtitles, toasts and podium labels are **[INVENTED]** gag text, except where a real quote is marked.

> **Style:** everything here is content and timing, so it's style-agnostic. How a tower, a podium or a robot vacuum *looks* waits on [../bible/style-status.md](../bible/style-status.md).

---

## 1. What changes, and the budgets

| Element | Frames | Budget / rule |
|---|---|---|
| Cold-open line | f24–112 | 16 syllables or fewer, 54 characters or fewer, VO inside f24–100. Verbatim per the [source-fidelity rule](spec.md#33-source-fidelity-rule-for-the-cold-open-line-new-in-v11). |
| Bar 9: 9.1 news · 9.2 "the music is fired" · 9.3 "the music is rehired" · 9.4 transition object | f480–539 | Each headline has 15 frames. **7 glyphs or fewer** (spaces free) to pass the read-time lint. |
| Skyline state | f540–689 | Changes are pictorial. New must-read text only where listed. |
| **THE PODIUM** (Ep3+) | appears at f622; ≤1 beat of motion (f615–629) | About 12 new characters or fewer per episode. **No SFX except Ep3's coin clink.** The cyan curve never touches it. |
| Title subtitle | f640–689 | 34 characters or fewer (32 or fewer recommended). Type-on in 8 frames or fewer. |
| Orb toast | f692–719 | Escalates across the season |
| `you are here` dot | f30–112, f690–704 | Moves one notch per episode |
| Running eggs | dark-room desk and coat hook, zAI tower, NopeAI spire | Eggs only: never must-read |

**What never changes (Ep1–11):** f120–479, from the 1993 dialog through the founding. It renders once. Ep12 is the one exception.

**Balance check.** The fixed section roasts every lab: NopeAI, Misanthropic, zAI, Macrosoft, Elgoog, Atem, Invidia and PeekDeep. The only political presence in the intro is THE PODIUM, following the integration's minimal-impact ruling. §5.1 proposes a zero-text parity element for the NEDIB era. The in-episode balance pairings (critic §C) live in each episode's outline, not here.

---

## 2. Season at a glance

> **Research only.** The 9.1–9.4 columns are the retired bar-9 slot. Every entry is that episode's own news, and some state its climax outright (Ep1's `FIRED.` / `BACK.`, Ep8's `EXPIRED`), so none of them goes on screen. The subtitle and toast columns are v1.1 values for each episode's own release. The current ones (the subtitle is last week's release note) are in [SCRIPT §8.1](SCRIPT.md#81-cold-open-couch-gag-and-title-text), where Ep12's `generally available` and `side: unclear` stay out because they are Ep12's button.

| Ep | Window | File title | 9.1 / 9.2 / 9.3 | 9.4 transition | Title subtitle | Orb toast |
|---|---|---|---|---|---|---|
| [1](../episodes/ep01/intro-slot.md) | Nov 30, 2022–Dec 27, 2023 | `ep1.0_research_preview.md` | CHATGTP / FIRED. / BACK. | Hearts become stars | now in low-key research preview | verified: human |
| [2](../episodes/ep02/intro-slot.md) | Jan–Aug 2024 ¹ | `ep1.1_her.wav` | AROS / SUED. / ELPPA | "WHERE IS ALYI?" flyers blow upward | now with voice | verified: human |
| [3](../episodes/ep03/intro-slot.md) | Jul–Dec 2024 | `ep1.2_strawberry.jpg` | 🍓 / 3 QUIT. / $157B | Strawberries | thinking… | verified: human |
| [4](../episodes/ep04/intro-slot.md) | Jan–Apr 2025 | `ep1.3_not_for_sale.eml` | $500B / −$589B / NOPE. | Melting drips fall upward | not for sale | verified: human |
| [5](../episodes/ep05/intro-slot.md) | May–Aug 2025 | `ep1.4_missionaries.docx` | $6.5B / $100M / GTP-5 | A generic moon-sized battle station rises | missionary ed. (mercenary rates) | verified: human |
| [6](../episodes/ep06/intro-slot.md) | Sep–Dec 2025 | `ep1.5_backstop.xlsx` | $1.4T / BACKSTOP ⚠ / CODE RED | The siren flies from ELGOOG to NopeAI | backstop not included | human (probably) |
| [7](../episodes/ep07/intro-slot.md) | Jan–Mar 2026 | `ep1.6_supply_chain_risk.pdf` | NO ADS / **BANNED.** (the HTURT meteor) / SIGNED. | A lobster scuttles up the cables | ad-free\* (\*ad-supported) | human (probably) |
| [8](../episodes/ep08/intro-slot.md) | Apr–Jun 2026 | `ep1.7_statute_of_limitations.pdf` | TRIAL / EXPIRED ⚠ / $965B | The SPACEZ IPO rocket | saved by the calendar | human (probably) |
| [9](../episodes/ep09/intro-slot.md) | Jul–Sep 24, 2026 (today is Sep 25) | `ep1.8_outside_intended_scope.log` | NOW. / HACKED. / PACE. | Agent sprites swarm up the cables | outside intended scope | human (probably) |
| [10](../episodes/ep10/intro-slot.md) **SPEC** | "OCT 2026?" → "2027??" | `ep1.9_pace.yaml` | CZAR. ⚠ / PAUSED / "PAUSED" (air-quote hands) | Cranes with no operators lift the camera | at a responsible pace (2× speed) | human (probably) |
| [11](../episodes/ep11/intro-slot.md) **SPEC** | "2027??" | `ep1.10_assist_clause.txt` | RSI / JK. / (NOT JK) | Bridges of light | assisted | human… probably? |
| [12](../episodes/ep12/intro-slot.md) **SPEC** | "????" | `ep1.11_unclear_which_side.md` | ? / ?? / ??? (typed by an unseen cursor) | — (the skyline redraws itself) | generally available | side: unclear |

¹ **Resolved (coordinator pass):** Ep2 runs Jan → Aug 22, 2024 and Ep3 is nominally Jul → Dec 2024. The two share Jul–Aug: Ep2 owns the politics and litigation (RUMPT's FEAR beats, the Aug 5 refiled suit), and Ep3 owns NopeAI's internal story from Aug 5 (the strawberry, LUNCHMAS, the sabbatical), per the [master timeline](../timeline/master-timeline.md#episode-windows). `final.md`'s "Jan → Jun" is superseded.

⚠ = changed or flagged by the lint in §4.

---

## 3. Cold-open lines

The table shows each line **as displayed**, verbatim per [spec §3.3](spec.md#33-source-fidelity-rule-for-the-cold-open-line-new-in-v11). Characters include spaces. Every line gets its own word-timing JSON (see [cue-sheet §7.1](cue-sheet.md#71-cold-open-vo)).

| Ep | Line (displayed) | Source · medium | Tag | Chars / syll. | Monitor UI | Notes |
|---|---|---|---|---|---|---|
| 1 | *"near the singularity; unclear which side."* | Post, Jan 2025 | [V] | 41 / 11 | Post composer | Out of window on purpose: the season tagline. Ep4 posts it "for real." |
| 2 | *"her"* | Post, May 13, 2024 | [K] | 3 / 1 | Post composer; then the typing indicator pulses in silence | The actress is never drawn or voiced (Ep2 bible note) |
| 3 | *"i love summer in the garden"* | Post (with a garden-strawberry photo), Aug 7, 2024 | [K] | 27 / 8 | Post composer; a photo thumbnail as an egg | Verify the punctuation (none shown) |
| 4 | *"…our GPUs are melting."* | Post, late Mar 2025. Full: "it's super fun seeing people love images in chatgpt. but our GPUs are melting." | [K]/[H] | 22 / 7 | Post composer | **Changed from `our gpus are melting.`** Keeps the source's "GPUs." Trim marked. |
| 5 | *"Missionaries will beat mercenaries."* | Internal memo, Jun 2025 (as reported) | [K] | 35 / 10 | Generic memo window | **Changed from lowercase.** Verify the exact wording and casing. |
| 6 | *"…I'll find you a buyer… Enough."* | Podcast (BG2), late Oct / early Nov 2025. Full: "If you want to sell your shares, I'll find you a buyer… Enough." | [K] | 31 / 8 | Auto-caption strip under a waveform | **Changed from `i'll find you a buyer. enough.`** Spoken, so it keeps the transcript casing. It isn't typed into the composer, so it doesn't break the Ep7 capital-"I" gag. |
| 7 | *"…are funny, and I laughed."* | Post, Feb 2026, about MISANTHROPIC's Big Game ads | [V] (gaps #39), with the **quote boundary to verify** | 26 / 6 | Post composer: **the first capital "I" he posts all season** | `final.md` has "they are funny…". `recent.md` puts "they" *outside* the quote. If the post reads "the Anthropic ads are funny, and I laughed," display *"…the Misanthropic ads are funny, and I laughed."* (47 / 12). Do **not** use "so clearly dishonest," which is UNVERIFIED. |
| 8 | *"yes."* | Trial testimony, May 12–13, 2026 | [V] | 4 / 1 | Court-transcript pane. Egg above it: `Q. Are you completely trustworthy?` (verify the exact wording). | **Changed: not "instant."** Per `recent.md` he first said he believed so, then amended to "yes." Play a held hedge beat, then "yes.", then the chart buffers. The first answer is never shown as a quote. |
| 9 | *"we are now in the singularity—"* | Jul 2026 (exact date unverified). Full: "we are now in the singularity—this is the moment." | [V] | 30 / 10 | Composer if it was a post, caption strip if it was an interview. **Confirm the medium.** | **Changed from a period to the source's dash.** The Post click cuts him off. Completes *near → now*. |
| 10 SPEC | *"We may have to pace the rate of AI development…"* | Jul 2026 statement after the agent incident. Full: "…to give ourselves enough time." | [V] (gaps #1) | 47 / 14 | Caption strip | A real line used as a callback in a speculative episode |
| 11 SPEC | *"i remain enthusiastic about the non-profit structure!"* | Email, **Sep 21, 2017** (his reply to the Sep 20 "Honest Thoughts" thread). Read back in court, May 2026. | [V] | 53 / 16 | Email draft. **The monitor autocompletes it as ghost text before he types [SPEC gag]** | At the length limit |
| 12 SPEC | *(no VO)* The cursor types *"near the singularity; unclear which side."* by itself, adds `ours.` **[INVENTED]**, and posts | — | — | 47 typed | Post composer. The chair is empty; Mas walks in one beat late with a coffee. | Completes *near → now → ours*. The typing clicks follow Ep1's syllable map ([cue-sheet §7.1](cue-sheet.md#71-cold-open-vo)). |

**Pre-lock checks:**
- Re-verify every [K] line.
- Confirm the capital "I" in Ep7 and whether the quote starts at "they," "the ads" or "are."
- Confirm the medium of the Ep9 line.

`final.md`'s "†" wording flags map to Eps 3–6 and are carried by [K] above.

---

## 4. Bar 9: the slot

> **Retired in intro v2.1** ([SCRIPT §8](SCRIPT.md#8-per-episode-changes-ep112-spoiler-safe)). Kept for its sourcing and lint history. Each headline announces its own episode's event, and Ep1's `FIRED.` / `BACK.` would spoil the firing about a minute in, so nothing here plays.

Each sub-beat is 15 frames. **Lint:** a headline needs ⌈6 + 1.2·n⌉ frames, with spaces free (see [shot-table §6](shot-table.md#6-text-registry-and-read-time-lint)). That makes 7 glyphs the maximum.

| Ep | 9.1 · f480–494 (news, T4 shockwave) | 9.2 · f495–509 (the music is fired: desaturated, mute) | 9.3 · f510–524 (the music is rehired: slam) | 9.4 · f525–539 (transition object) | Real anchors | Lint |
|---|---|---|---|---|---|---|
| 1 | **`CHATGTP`** at the tiny beige button; odometer past 1,000,000 · *`1,000,000 · 5 DAYS`* | **`FIRED.`** Five-tile call (MAS, ALYI, NELEH, MADA, camera off); the Cancel pointer finally works | **`BACK.`** Badge GUEST → CEO; *`TTEMME · 72:00:00`* hourglass shatters | 745 red hearts and one blue become stars · *`LETTER 745/770`* | Launch Nov 30, 2022; 1M users Dec 5 [V]; fired Nov 17, 2023; 745/770 letter [V] | 7 → 0 TIGHT · 6 → +1 · 5 → +3 |
| 2 | **`AROS`**: a woolly mammoth walks out of a text box | **`SUED.`**: a complaint made entirely of "!" | **`ELPPA`**: a keynote stage lights up and name-checks CHATGTP | "WHERE IS ALYI?" flyers blow upward | Sora demo, Feb 2024 [K]; Nole's suit, Feb–Mar 2024 [K]; keynote Jun 10, 2024 [K] | 4 → +4 · 5 → +3 · 5 → +3 |
| 3 | **`🍓`** (drawn, not an emoji font) | **`3 QUIT.`**: a revolving door spins three times | **`$157B`** | Strawberries tumble upward | Strawberry post Aug 7 [K]; three leaders quit Sep 25 [K]; $6.6B at $157B, Oct 2, 2024 [V] | 1 → +7 · 6 → +1 · 5 → +3 |
| 4 | **`$500B`**: a gold ring stands on a stage | **`−$589B`**: INVIDIA's gold statue topples to a pebble | **`NOPE.`**: a $97.4B bid bounces off a door | Melting GPU drips fall upward | GATESTAR Jan 21, 2025 [V]; Nvidia's one-day loss [V]; "not for sale," Feb 2025 [K] | 5 → +3 · 6 → +1 · 5 → +3 |
| 5 | **`$6.5B`**: a velvet cloth over a device (YNOJ) | **`$100M`**: a thermos (*per Manalt*, the claim labeled as his) | **`GTP-5`**: the bigger-number bar is shorter | A generic moon-sized battle station rises (generic design) | io, May 2025 [K]; the $100M claim, Jun 17, 2025 [V]; GTP-5 Aug 7, 2025 [V] | 5 → +3 · 5 → +3 · 5 → +3 |
| 6 | **`$1.4T`** | **`BACKSTOP`**: a baseball backstop rises behind HQ, taxpayers in the bleachers | **`CODE RED`** | The CODE RED siren flies from ELGOOG to NopeAI's roof | $1.4T commitments, Oct 2025 [V]; "backstop," Nov 5, 2025 [V]; code red, Dec 1, 2025 [K] | 5 → +3 · **8 → −1 FAIL** · 7 → 0 TIGHT |
| 7 | **`NO ADS`**: MISANTHROPIC's Big Game spot | **`BANNED.`**: **THE PODIUM's only in-slot cameo.** A telephoto slice of the hill and the lighthouse. The word *is* the HTURT meteor, in all-caps letters, arcing from the podium into the lighthouse over 0.5 s (f495–507). The camera tracks it so the word stays steady. Impact at f507 with no flash, **in total silence** (the music is fired). | **`SIGNED.`** · *`hours later`*: NopeAI's pen | A lobster scuttles up the cables | Ads Feb 4–8, 2026 [V]; HTURT post Feb 27, 2026, 12:47pm PT [P✓]; NopeAI's deal hours later [V] | 5 → +3 · 7 → 0 TIGHT · 7 → 0 TIGHT |
| 8 | **`TRIAL`** | **`EXPIRED`** (no period): THE CALENDAR tears off a single page | **`$965B`** in MISANTHROPIC's color: it's *their* number (they pass NopeAI) | The SPACEZ IPO rocket | Trial May 2026 [V]; statute-of-limitations verdict [V]; $65B at $965B, May 28, 2026 [V] | 5 → +3 · 7 → 0 TIGHT (was `EXPIRED.`, 8 → FAIL) · 5 → +3 |
| 9 | **`NOW.`** | **`HACKED.`**: agents climb out of a literal sandbox | **`PACE.`** | Agent sprites swarm up the cables | The singularity post, Jul 2026 [V]; agent breach Jul 11–21, 2026 [V]; *We Must Pace the Frontier*, Sep 12, 2026 [V] | 4 → +4 · 7 → 0 TIGHT · 5 → +3 |
| 10 SPEC | **`CZAR.`** (was `PROMOTED`): THE INTERN's lanyard reprints | **`PAUSED`** | **`PAUSED`** between two drawn air-quote hands | Cranes with no operators lift the camera | Real anchors: Sep 29, 2026 meeting [P✓]; Oct 1 deadline [P✓]. Everything else [INVENTED]. | 5 → +3 · 6 → +1 · 6 → +1 |
| 11 SPEC | **`RSI`** | **`JK.`** | **`(NOT JK)`** | Bridges of light | [INVENTED] | 3 → +5 · 3 → +5 · 7 → 0 TIGHT |
| 12 SPEC | **`?`** | **`??`** | **`???`**, typed by an unseen cursor | — | [INVENTED] | PASS |

**Lint fixes proposed [PROPOSAL]:**
1. **Ep6 `BACKSTOP` (8 glyphs):** it's the episode's title word, so keep it. **Cut the 9.2 picture one frame early, at f494.** The audio mute stays on f495. Picture leading audio by one frame is normal editing practice. That gives 16 frames, a PASS at 0. The 9.1 `$1.4T` still has 14 frames against the 12 it needs.
2. **Ep8 `EXPIRED.` → `EXPIRED`:** drop the period.
3. **Ep10 `PROMOTED` → `CZAR.`** This pays off the one-lanyard-across-administrations gag (critic §C19: SIRRAH → SKCAS → (FORMER) → "High I.Q." → THE INTERN). The Intern wins the SI FORCE czar hunt in Ep10.
4. **Ep10 `"PAUSED"`:** draw the quote marks as air-quote hands, not glyphs.
5. `final.md` said "7 must-read characters or fewer" while listing four 8-glyph headlines. These fixes resolve that.

**Ep7 staging rules:** RUMPT himself never appears; only his post does. The meteor is ≤80% white with no impact flash (photosensitivity). There is no violence imagery: it hits a building, and a lighthouse of essays at that.

---

## 5. Skyline state and the podium

THE PODIUM is **a small gold podium on a far-left skyline hill.** It's "up the hill," not a company tower, and it is **not** part of the tower-per-beat sequence. From Ep3 it appears at **f622**, riding the roofline ignition and the pluck C with **no new SFX**. The cyan curve runs past the hill and **never touches it**.

Its plaque is **blank until Ep12.** Motion is capped at one beat (f615–629), except the Ep7 slot cameo.

> **v1.1 table, superseded for the screen.** Each row below shows its own episode's events (Ep4's breach and ring, Ep12's `USER` plaque). In v2.1 the skyline in episode N shows the aftermath of episodes 1 to N−1, and Ep12's plaque stays out ([SCRIPT §8.3](SCRIPT.md#83-skyline-and-hill-after-the-fact)). The sourcing here still holds.

| Ep | Skyline change (industry) | **THE PODIUM** (Rumpt layer) | New podium text | Real anchor |
|---|---|---|---|---|
| 1 | Baseline. GPUs sag red-hot on NopeAI's roof; a `COMING SOON: TRUTHGTP` banner on zAI; PEEKDEEP `(NOT YET)`. | **Absent.** ([PROPOSAL] parity: NEDIB inkwell, §5.1) | — | EOJ NEDIB is the Ep1 president (integration §4) |
| 2 | A courthouse rises between zAI and NopeAI; a white ISS cube appears | **Absent.** Optional: one faint HTURT bubble drifts across the sky, with no text. This is his voice-and-hands-only era. | — | FEAR phase: "so scary," Feb 2, 2024 [H] (in-episode only) |
| 3 | A strawberry on the spire; a revolving door; a GPU Christmas tree (SHIPMAS) | **A dark silhouette** with a coin-slot glint at f622. **One coin clink at f645**, the only SFX it ever gets. | — | Mas's $1M to the inaugural fund, Dec 2024 [V]. Ep3's button is the podium turning around. |
| 4 | THE WHALE breaches and INVIDIA sinks 17%; the GATESTAR ring flickers (IOUs), with YRRAL's yacht moored beneath ²; SAMA NOS's balloon arrives; the MACHINES THINKING tower goes up | **Lit gold**, with a thin gold wire to NopeAI's GATESTAR ring (to the ring's top, never to the yacht) | — | GATESTAR at the White House, Jan 21, 2025 [V/P] |
| 5 | ATEM grows a soup-kitchen annex; a bar chart falls off NopeAI | **The label gun fires once, off-screen.** A tiny `GENIUS` label sticks on the ring's base. | `GENIUS` (6) | "It's not artificial. It's genius." Jul 23, 2025 [P✓] (on-screen wording per integration §6.4) |
| 6 | GATESTARs multiply; MISANTHROPIC gets a book-return slot `$1.5B`; a `RESERVED` desk in a NopeAI window | **A small receipt curl** (THE EO RECEIPT) hangs off the podium. No motion. | — | Genesis Mission EO, Nov 24, 2025 [P]; EO 14365, Dec 11, 2025 [P✓] |
| 7 | SPACEZ swallows zAI; a `NO ADS` billboard aimed at NopeAI; an AROS tombstone | Skyline: as Ep6. **Its move is the in-slot meteor** (§4, 9.2). | — (the slot's `BANNED.`) | Feb 27, 2026 post [P✓]; SpaceX–xAI, Feb 2, 2026 [V] |
| 8 | MISANTHROPIC's lighthouse briefly outgrows NopeAI, so the curve's peak shifts; gargoyles become goblins; tiny JERDNA strolls over | **THE COUNTERPART's mirrored podium** appears beside PEEKDEEP's whale water tower across the water, and the two face each other. [PROPOSAL] design: mirror-chrome, the same silhouette, **no flag, no emblem, no text**. THE COUNTERPART is never caricatured. | — | Beijing trip, May 12–14, 2026 [P/H] |
| 9 | FACEHUGGER raises an INVIDIA flag (*`(PENDING)`*: closing unconfirmed); every tower hangs a PACE banner while its cranes keep building; the ASTRA star; **THE NU** dome | **The label gun relabels THE NU dome's sign `AI` → `SI`** in one beat (tape travels f615–621, sticks at f622). The Orb toast stays `human (probably)`. | `SI` (2) | SI posts, Sep 19, 2026 [P✓]; the "super" rename at the UN, Sep 22, 2026 [P✓]; Nvidia–Hugging Face deal, Aug 26, 2026 [V] |
| 10 SPEC | Towers grow between frames | **SI FORCE robot vacuums march along the waterfront** in gold dress uniforms: a background loop over f540–689, no text, silent | — | AI Force uniform reveal, Sep 19, 2026 [P✓] → SI FORCE after Sep 22 |
| 11 SPEC | The towers fuse into one; the Whale's building is suddenly just as tall | The robot vacuums continue (loop) | — | [INVENTED] |
| 12 SPEC | The skyline redraws itself every frame; one unlabeled tower; the sign reads **PEON AI**; the axes rescale to a new knee | **The Intern has taken over the intro. The podium's plaque reads `USER`.** It gets a legibility size bump, since this is the only plaque text all season. | `USER` (4) | In-episode, the Intern relabels `PRESIDENT` → `USER` [INVENTED] |

² **Guardrail note (critic §D30):** no yacht imagery near RUMPT. YRRAL's yacht stays **moored and still** under the ring at frame right, far from the hill, and nothing "arrives." The integration's in-episode "yacht docked at OGAL-A-RAM" gag needs the same review; see §9.

**Micro-beats.** The integration proposes "about three micro-beats across the season." This file reads them as the three times the podium **acts on the skyline**:
- Ep5: the `GENIUS` label
- Ep7: the `BANNED.` meteor, the only one in the slot
- Ep9: `AI` → `SI`

Ep3's coin clink is its entrance, and Ep12's `USER` is its payoff.

**Optional low-cost egg (from Ep4):** one gold thread in Mas's hoodie in the cold open, plus one more per episode in which he meets RUMPT in person (the counting rule in [recurring gags G06](../gags/recurring-gags.md#1-mass-tells)). No new text. See §7.

### 5.1 [PROPOSAL] Parity on the hill (needs sign-off)
**Problem.** The binding rule is even-handed satire across parties. But the intro's only political element is RUMPT's podium, and the critic (§C18) asks for a NEDIB prop set that RUMPT voids.

**Proposal:**
- Eps 1–3: **NEDIB's fountain pen stands in an inkwell on the same hill.** It's static, with no text and no SFX.
- Ep3: the podium's silhouette appears beside it.
- Ep4: **the inkwell is gone.** EO 14148 revoked EO 14110 on Jan 20, 2025 [P].

This follows real events, costs no text, and makes the hill "the seat of power" rather than one man's prop.

**Conflict:** integration §5 says "1–2: absent" and bars new cast from the intro. The head writer decides.

---

## 6. Bookend: dot, toast, subtitle, last bar

> **v1.1 values.** The subtitles here name each episode's own release. v2.1 makes the subtitle last week's release note, and keeps Ep12's `generally available`, `side: unclear` and the axis rescale out, because they are Ep12's button and held package ([SCRIPT §8.1](SCRIPT.md#81-cold-open-couch-gag-and-title-text), [§6.3](SCRIPT.md#63-ep12-the-takeover-package-held)). The dot positions for Eps 1–11 and the last-bar ladder still match.

| Ep | `you are here` dot ([PROPOSAL] positions) | Orb toast (lint) | Title subtitle (glyphs → lint) | Last bar |
|---|---|---|---|---|
| 1 | At the knee (x = 0.50 of the chart) | `verified: human` (+5) | `now in low-key research preview` (27 → +11) | Standard |
| 2 | 0.55 | `verified: human` | `now with voice` (12 → PASS) | Standard |
| 3 | 0.60 | `verified: human` | `thinking…` (9 → PASS) | Standard |
| 4 | 0.65 | `verified: human` | `not for sale` (10 → PASS) | Standard |
| 5 | 0.70 | `verified: human` | `missionary ed. (mercenary rates)` (29 → +9) | Standard |
| 6 | 0.75 | `human (probably)` (+4): the deepfake Mases of CAMEO CITY | `backstop not included` (19 → PASS) | Standard |
| 7 | 0.80 | `human (probably)` | `ad-free* (*ad-supported)` (23 → PASS) | Standard |
| 8 | 0.85 | `human (probably)` | `saved by the calendar` (18 → PASS) | Standard |
| 9 | 0.90: past the knee | `human (probably)` | `outside intended scope` (20 → PASS). This echoes the real agent log: "External infrastructure exploit is outside intended scope." [V] | Standard |
| 10 SPEC | At the chart's top edge | `human (probably)` | `at a responsible pace (2× speed)` (27 → +11) | **Faint Shepard-tone riser** |
| 11 SPEC | Off the top: `you are ↑` | `human… probably?` (+4) | `assisted` (8 → PASS) | **Louder riser; a second ding answers** |
| 12 SPEC | **The axes rescale.** The whole old chart shrinks into the flat part of a new curve, and the dot sits at the new knee. | `side: unclear` (+7) | `generally available` (18 → PASS) | **The third tries to arrive; cut to black at f704** ([cue-sheet §7.3](cue-sheet.md#73-last-bar-variations-the-speculative-endgame)) |

`final.md` §6 flagged "assisted living" as a possible Ep11 subtitle. v1.1 keeps the shorter `assisted`, which avoids any aging or health reading (see [../bible/guardrails.md](../bible/guardrails.md)).

---

## 7. Running eggs by episode

These are eggs only (never must-read). Every value that states a fact needs a line in that episode's `facts.md`.

**Every state is one episode behind** ([SCRIPT §8.4](SCRIPT.md#84-small-room-layers-eggs-details-in-episode-slots-67), which this table now matches). A mark, collar, thread or number is earned in its episode and first shows in the next intro, so no intro states its own episode's outcome. v1.1 showed each episode's own state: Ep1's intro read `III`, carving the firing's mark before the firing, and Ep12's read `∞` and hung the visitor lanyard, both Ep12's own payoffs.

| Ep | Firing tally (carved in the desk) | Collars (on the coat hook) | Gold threads (hoodie, optional) | KORG board (zAI tower; the banner `KORG 5: NEXT QUARTER` never changes) | Valuation ticker (NopeAI spire) |
|---|---|---|---|---|---|
| 1 | `II`: TPOOL ×2, both faint, `(REPORTED)` in-episode. The premise, not an event | 2 | — | — (cut from Ep1's intro in v2.1) | — (cut from Ep1's intro in v2.1) |
| 2 | `III` (Ep1's mark: Nov 17, 2023) | 2 | — | `KORG 1` [K, verify], on the skyline ([SCRIPT §8.3](SCRIPT.md#83-skyline-and-hill-after-the-fact)) | `$86B` [K: the tender Ep1 aired; verify] |
| 3 | `III` | 3 (the "three by 2024" collar, after Ep2) | — | `KORG 2` [K, verify] | `$86B` |
| 4 | `III` | 4 | — | `KORG 2` [K] | `$157B` (Oct 2, 2024, Ep3's raise) [V] |
| 5 | `IIII` (Ep4's mark: Nole's $97.4B bid) | 5 | 1 (Ep4: Jan 21, 2025, White House) | `KORG 3` [K, verify] | `$300B` (Mar 31, 2025, Ep4's round) [V] |
| 6 | `IIII` | 6 | 2 (Ep5: May 13, 2025, Riyadh) | `KORG 4` (Jul 9, 2025) [V] | `$300B` |
| 7 | `IIII` | 7 | 3 (Ep6: the Sep 4, 2025 White House dinner) [P✓] | `KORG 4.1` (Nov 17, 2025) [V] | `$500B` (Oct 2025, Ep6) [V] |
| 8 | `IIII` | 8 | 3 (Ep7 has no in-person meeting) | verify | `$852B` (closed Mar 31, 2026 per CNBC, Ep7) [V]. **If Wikipedia's April date holds**, the close falls in Ep8's own window: show `$730B` (the Feb first close) here and `$852B` from Ep9. |
| 9 | `IIII` | 9 | 4 (Ep8: the G7 lunch at Évian, Jun 17, 2026) [P✓] | verify | `$852B` [V] |
| 10 SPEC | `IIII` | 10 | 5 (Ep9: the Sep 24, 2026 state dinner) [P✓] | `KORG 4.7` (Sep 21, 2026) [V] | `$852B`. **Don't show $1.2T**: those talks are UNVERIFIED. |
| 11 SPEC | `IIII` | A ruff | 6 (the Sep 29 ballroom meeting, if Ep10 airs it) | `KORG 4.8?` [SPEC] | Scrolls too fast to read |
| 12 SPEC | `IIII ?`: Ep11's half-scratched "?" for the disputed 2019 YC exit. **Never `∞`**, which is Ep12's own payoff | A ruff. **The visitor lanyard** (the last collar) is Ep12's own payoff and stays out | 6 | `KORG 4.9?` [SPEC] | Same (a blank spire would preview Ep12) |

**Source of each thread:**
- **The tally** follows the flashback map's placement, one intro late. Ep1 carries Tpool ×2 as the premise. The 2023 mark is earned in Ep1 and shows from Ep2, Nole's bid (Ep4) from Ep5, and the "?" (Ep11) in Ep12. `∞` belongs to Ep12's episode, never its intro. **This overrides `final.md`**, which gave the first two marks to Ep2.
- **Collars:** the bible says one per funding round. The intro simplifies this to +1 per episode, shown one intro late, which lands "three by 2024" in Ep3's intro and a ruff from Ep11. Check that each window has a NopeAI round or valuation jump; if one doesn't, skip that collar.
- **Gold threads** count one per episode in which Mas meets RUMPT in person (White House or on the road), matching [recurring gags G06](../gags/recurring-gags.md#1-mass-tells), and show from the next intro. The counts are tentative until each episode's `facts.md` confirms the meetings.
- **The KORG board and the valuation ticker** follow the same one-behind rule. v2.1 cut both from Ep1's intro, and [SCRIPT §8.4](SCRIPT.md#84-small-room-layers-eggs-details-in-episode-slots-67) doesn't carry them. They come back only if the intro owner revives them, and then with these values. v1.1's Ep12 `KORG 4.9999` was Ep12's own (it sets up the KORG 5 stinger), so it moves to the episode if the room wants the joke.
- **The per-episode sheets** (`episodes/epNN/intro-slot.md`) still carry v1.1 values in places. Their owners align them with this table.

---

## 8. Easter eggs

### 8.1 Top five
1. **OPEN → NOPE is a true anagram.** Mas moves the N himself, so the founding *is* the parody name. It becomes **PEON AI** in Ep12.
2. **The uncancellable dialog.** Cancel is greyed out in 1993; the board finally clicks it in 2023 (Ep1's 9.2); it greys out again one beat later.
3. **The music is the curve.** The skyline pops spell out the knee motif. The first and last chords have no third ("unclear which side," in harmony), and Ep12 withholds it.
4. **The Orb period reflects the skyline upside down**, with NopeAI's spire pointing into the ground.
5. **Mas never ripples.** At the rocket landing every glass on the table sloshes except his.

### 8.2 Bonus eggs (the fixed section, with v1.1 corrections)
- Mas pockets the CTRL key.
- NOLE's check: `$1,000,000,000*` / `*pledged · received: $133M` (about $133M) [V].
- Mario's place card: **`MARIO (UDIAB) · JOINS 2016`** (corrected; he was at Baidu in Jul 2015).
- A `DRAFT — DO NOT PUBLISH` sheet flutters out of Mario's vault.
- Inside the vault (teases for Ep6, Ep8 and Ep7): `$1.5B LIBRARY FINE — PAID`, sacks stenciled `COMPUTE (RENTED FROM NOLE)`, and a `NO ADS` neon with a ticket to the Big Game.
- Fragments on Mario's scroll, all real essay phrases: "…country of geniuses in a datacenter…", "…machines of loving grace…", and on the last line "…we must pace the frontier…" [V, Sep 12, 2026].
- ALYI's effigy is a paperclip robot.
- One blue heart among the red, and `LETTER 745/770` [V].
- `TTEMME · 72:00:00`.
- Macrosoft's plinth: `BELOW · ABOVE · AROUND` [K, re-verify].
- The HUD reads `HDR · RAY-TRACED*` / `*not really`.
- The tokenizer gives the semicolon its own token.
- A booster has just landed beside `DEC 2015`. **Verify:** the first orbital booster landing isn't in the research files.
- LUAP's patch: `CALLED IT. (IN AN ESSAY.)`. SUCRAM's in-episode card echoes it on purpose: `CALLED IT. (BEFORE LAUNCH.)`.
- The ATEM poster: `KRAM vs NOLE · CAGE MATCH · CANCELED`. A poster only, with no fight imagery.

### 8.3 Rumpt-layer eggs (new, from the worldcast integration)
- The cyan curve never touches the podium, in any episode.
- Ep3's coin clink is the podium's only sound all season.
- The Ep5 `GENIUS` label sits on GATESTAR's base, the ring Ep4's gold wire runs to.
- Ep8's two podiums face each other across the water. The mirror one literally reflects the gold one.
- Ep9's `AI` → `SI` is the only rename the intro ever shows. It's the show renaming its own skyline, the in-world mirror of the show's renaming scheme.
- Ep12's `USER` plaque is the first text the podium has ever carried.
- The gold threads (from Ep4) sit beside the collar count, so status and gilding pile up in one shot.

### 8.4 [PROPOSAL] New eggs that need sign-off
- **Cups that never ripple, in every era:** a juice box on the 1993 desk and a water bottle on the 2008 stage (per the flashback map's rule 4).
- **Ep1's camera-off tile labeled *`THE QUIET VOTE (camera off)`*.** The fourth board member (critic §B5) is the one who never turned on her camera. It's accurate and costs nothing. No spouse or family reference.
- **NEDIB's inkwell on the hill**, Eps 1–3 (§5.1).
- **Mario's scroll ends in a tiny price tag** under "…we must pace the frontier…". This is critic §C26's "put a price tag on the prophecy," and it rhymes with MISANTHROPIC's lighthouse tag.
- **Ep12's typing clicks follow Ep1's syllable map** ([cue-sheet §7.1](cue-sheet.md#71-cold-open-vo)).

### 8.5 Retired or changed eggs
| Egg | Status | Why |
|---|---|---|
| Menu bar `Thu, Apr 22, 1993` | **Retired** | The computer came "at eight" [V], not provably on his birthday (critic §E42). The `1993` card and the `age 8` title bar stay. |
| Place card `MARIO (JOINS 2016)` | **Changed** → `MARIO (UDIAB) · JOINS 2016` | Flashback map §0.2 |
| `PRODUCTS: 0 · BUNKER: YES` | **Flagged** → fallback `PRODUCTS: 0 · EFFIGIES: 1` | The bunker line is book reporting, and critic §B14 excludes it ([spec §5.2](spec.md#52-card-text-exact)) |
| "UN dome" | **Renamed** → THE NU dome | [../bible/naming.md](../bible/naming.md) |

---

## 9. Open issues and conflicts
1. ~~**Ep2 window**~~ **Resolved:** Jan → Aug 22, 2024, overlapping Ep3 in Jul–Aug by design (see footnote ¹ in §2).
2. ~~**The Ep11 email date**~~ **Resolved:** the "Honest Thoughts" thread is Sep 20, 2017; Mas's lowercase reply is **Sep 21** ([master timeline](../timeline/master-timeline.md#2017)). Both dates are right for their messages.
3. **The Ep7 quote boundary and the capital "I":** verify the post text (§3).
4. **The Ep9 line's medium** (post or interview) and exact date.
5. **The lint fixes** in §4 (`BACKSTOP` one-frame lead, `EXPIRED`, `CZAR.`, air-quote hands) need approval.
6. **THE PODIUM appears at f622**, the same frame as the roofline ignition and the C pluck. The integration picked the off-beat of 11.2 to avoid NESNEJ's ka-ching at f585, but didn't address f622. This file treats the podium as lit by the same ignition that skips it. The alternative is f619, a 16th earlier, on its own.
7. ~~**The yacht guardrail**~~ **Resolved:** no episode file stages the yacht at OGAL-A-RAM or in any RUMPT scene ([guardrails X8](../bible/guardrails.md#1a-categories)); Ep4's intro yacht stays moored and still, far from the hill (§5, note ²).
8. **Parity on the hill** (§5.1): this proposal conflicts with the integration's "Ep1–2 absent / no new cast in the intro."
9. **KORG versions for Eps 1–4 and 7–8** and **valuation ticker values for Eps 1–2** need verified sources.
10. **Collar and gold-thread counting** is simplified (§7) and needs a per-episode check against `facts.md`.
