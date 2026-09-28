# MR. MAS: Flashback Map (final)

This file says which backstory lands in which episode, and why there. The user's note is binding: **flashbacks are spread across the season, each placed where it gives the present-day plot information or motivation. Nothing is front-loaded.**

- **Built from:** `worldcast-flashback-map.md`, with **every correction in `worldcast-critic.md` applied** (§D, §E, §F and the relevant parts of §A–C). Where the two disagree, the critic wins. Each change is tagged `CR` with its item number.
- **Facts, dates and tags** come from the [master timeline](master-timeline.md). Names come from [naming.md](../bible/naming.md). Hard exclusions are in [guardrails.md](../bible/guardrails.md).
- **Per-episode detail** lives in each episode's `flashbacks.md` ([ep01](../episodes/ep01/flashbacks.md) … [ep12](../episodes/ep12/flashbacks.md)). This file is the season-level source they must agree with.
- **Quotes:** verified lines appear in quotation marks with their tag in the [master timeline](master-timeline.md). The few invented lines here (all in Ep11–12) are marked `[INVENTED]` right after them. Anything dramatized on screen is labeled `RECONSTRUCTED`.

**Contents:** [Rules](#0-rules-of-the-map) · [Device language](#01-device-language-by-era) · [1. Backstory chapters](#1-backstory-chapter-list) · [2. Per-episode map](#2-per-episode-map-ep1ep12) · [2a. One full motive flashback per episode](#2a-one-full-motive-flashback-per-episode-the-season-plan-2026-09-28) · [3. Multi-part flashbacks](#3-multi-part-flashbacks-and-their-escalating-reveals) · [4. Coverage check](#4-coverage-check) · [5. Intro tease → payoff](#5-intro-tease--payoff) · [6. Flashback cast](#6-flashback-cast-and-registry-updates) · [7. Critic corrections applied](#7-critic-corrections-applied) · [8. Open items](#8-open-items)

---

## 0. Rules of the map
1. **1–3 flashbacks per episode.** Micro-inserts (≤5s, marked `·m`) don't count toward the cap, but they do count toward the time budget.
2. **Enter on a trigger, exit on a consequence.** Every flashback enters on a present-day trigger and exits on the present-day consequence it explains. The exit lands on a matching object (napkin to napkin, box to box, receipt to check).
3. **Budgets:**
   - Ep1: **about 66 s** across three memories (v3.5, 2026-09-28; it was ≤20 s).
   - Ep2–11: **60–150s** each.
   - Ep12: ≤150s.
   - No single flashback runs over 60s, except the Ep8 Rashomon (≤90s, including its 10s Exhibit A).
4. **The intro is a trailer.** Every backstory shot in intro bars 3–8 is a promise paid off later (§5). The intro never explains.
5. **Truth labels are mandatory**:
   - `(REPORTED)`: the TPOOL revolts.
   - `(DISPUTED)`: the YC exit.
   - `HIS VERSION`: Nole in Ep6.
   - `RECONSTRUCTED`: any [K] detail we draw (the auction room, the Charter wording, the 2am typing, the pentagram, the unicorn sample).
6. **No flashback may carry an excluded item** (§4.4).

## 0.1 Device language by era
| Tier | Eras | Picture | Type | Entry / exit devices | Sound (the "knee" motif F F F F G A♭ C F in that tier's instruments) |
|---|---|---|---|---|---|
| **T1 · 1-bit** | 1993 (Mas, NESNEJ), plus the 1997 insert | Pure #000/#FFF, 512×342, 6 fps, Bayer dither, 3:2 pillarbox | Silkscreen | The curve rewinds to its first pixel; the 1-bit alert dialog with Cancel greyed out; `downgrading… → 1-bit` | Square-wave beeper; the "bonk" sting; NESNEJ's register "clunks" with no bell |
| **T2a · 240p camcorder** | 2003–05 poker, 2005–08 TPOOL, the 2006 ad, 2008 WWDC, the 2012 sale, the 2013 ALSET micro, the 2014 lecture, the 2014 key | 320×240, 12 fps, scanlines, chroma bleed, OSD like `▶ PLAY JUN 09 2008` | VT323 | VHS tracking wipe; poker-chip spin; TPOOL GPS pin-drop; an odometer running backward | Tape-start whirr, warbling cassette piano, boom-bap |
| **T2b · Flash-era web** | LUAP's essays (2008–09), YC 2005 and 2014, TIDDER 2014, AlexNet and the auction (2012), THE DIFF (2019, as HTML) | A web-player inset with a buffering spinner; plain Verdana HTML; blue underlined links; orange #FF7F2A on cream | Oswald / Verdana-like | Blue-hyperlink click (a date in the present becomes a link); buffering spinner; ramen dissolve; GPU-fan spin-up; the red/green diff | A dial-up handshake (≤0.5s), a lo-fi brass stab, a mouse click |
| **T3 · cut-paper** | 2015 WOODROSE; 2016 box, list, pilot and Move 37; 2017 Rashomon base; 2018 exit and Charter; 2019 capped profit, GTP-2, key; 2020–21 exodus | Crisp vector with paper grain. Frozen memories drop to **navy #14213D + cream**, like the name cards | Anton / Permanent Marker | Candle-flame match cut; pop-up-book page turn; exhibit sticker; key in a lock; a crack in framed glass; record scratch (Ep6 only) | Hybrid orchestra with a timpani hit on each arrival; séance organ (Ep2) |
| **T4 · glossy HDR** | The 2022 effigy, Alyi's 2023 bunker line, any memory from 2019 on shown through THE ORB | Glass, bloom, specular | JetBrains Mono | **THE ORB's iris replay** (only for events after 2019, once THE ORB exists) | Choir and glass shimmer |

**Rules across every tier:**
1. **POV rim.** A 6px frame border in the narrator's accent color:
   - [Gerg](../characters/gerg-mockbran.md) #39FF88
   - [Alyi](../characters/alyi.md) #FF6A1A
   - [Mario](../characters/mario.md) #1F3A93
   - [Nole](../characters/nole.md) #E0301E
   - [Mas](../characters/mas-manalt.md) cyan #3FE6FF
   - [Nesnej](../characters/nesnej.md) #7CFF4F
   - [Luap](../characters/luap.md) #FF7F2A
   - [Tasya](../characters/tasya.md) #5B6B8C
   - No rim for scenes with no narrator: the silhouettes, RIMA's spotlight, SIMED's board.
   - The model's POV (Ep12) has all four rims converging on cyan.
2. **Unreliable versions get their own render style.** Nole's is a KORG metal album cover. Mas's has six fingers. Gerg's is ASCII. Alyi's appears only in reflections.
3. **Caption case tells the age (updated).**
   - 1993: ALL CAPS, hidden until Ep12. Ep7's CAPS LOCK light hints at it.
   - 2003 onward: lowercase, because poker taught him.
   - Ep7's "I" is the first slip.
   - The **sentence-case tier is retired**: it belonged to the 2002 assembly, which is now HELD (CR D40). It is restored only if the user signs that chapter back in.
4. **The cup never ripples, in any era.** A juice box (1993), a poker-night beer, a water bottle on the WWDC stage, a crystal glass at THE WOODROSE.
5. **THE ORB's memory rule.** The iris replay can show only what happened after 2019.
   - Its debut is the Ep6 micro.
   - From Ep9 on it starts replaying things unprompted, which foreshadows the model studying Mas.
   - Its last use is the 2023 mark in Ep12's tally montage.
6. **Mas never freezes**, even in memory, while everyone else freezes into two-tone. The one exception is **F9.3 (the 2016 Oakland pilot)**, where nobody freezes and nothing is a joke. That exception moved there from the cut 2002 assembly.

---

## 1. Backstory chapter list
Every usable chapter, with its verified basis and the slot it lands in. Quotes and tags are as in the [master timeline](master-timeline.md).

### 1a. Mas chapters
| ID | When | What | Tag | Tier | Slot |
|---|---|---|---|---|---|
| M1 | `1993` (age 8; possibly early 1994) | The first computer, with the screen turned away. It's "an Apple Macintosh" at eight; draw a generic beige box. **Card: `1993` only** (CR E42) | V (fact); date and model [UNVERIFIED] | T1 | Ep1 · 4 · 7 · 12 (4 parts) |
| M2 | ~2002 | The school assembly | V | — | **HELD** (CR D40). Not scheduled |
| M2b | Sep 2016 | **NEW (replaces M2):** the Oakland basic-income pilot (YC Research). Sincere and public; no recipients on screen | K | T3 | Ep9 (F9.3) |
| M3 | 2003–05 | DROFNATS poker: "how to notice patterns in people over time, how to make decisions with very imperfect information" | K (NYT 2023) | T2a | Ep4 |
| M4 | Mar 11 / Summer 2005 | YC is conceived on the walk home; the $200k "educational expense and a charitable donation"; the first batch (TPOOL, TIDDER) | V | T2b | Ep5 |
| M5 | Sep 2006 | TSOOB ad: "Where you at?" | V | T2a | Ep2 |
| M6 | Jun 9, 2008 | WWDC walk-on in two popped collars; the app goes live Jul 11 | V | T2a | Ep2 |
| M7 | 2005–08 | Two attempts to remove him; "supporters defended him" `(REPORTED)` | V | T2a | Ep1 (tease), Ep12 (montage) |
| M8 | Aug 2008 | LUAP's cannibals line (hoodie founders only; a one-palm cartoon island) | V | T2b | Ep4 |
| M9 | Apr 2009 | "What would Sama do?" · "force of will… whatever they want" | V | T2b | Ep4 |
| M10 | Mar–Apr 2012 | TPOOL sold for $43.4M; ENIZARDYH CAPITAL with LEIHT's check (co-founder offscreen) | V | T2a | Ep3 |
| M11 | Feb 21, 2014 | The YC presidency and the ramen crown: "fearsomely effective and yet fundamentally benevolent" | V | T2b | Ep5 |
| M12 | Nov 2014 | TIDDER CEO for 8 days | V | T2b | Ep9 |
| M13 | 2015 | The SMI blog line | V (text) | T3 | Ep10 |
| M14 | May 25, 2015 | "…almost definitely not" / "Probably worth a conversation." | V | T3 | Ep10 |
| M15 | Jun 2015 | "…end of the world… great companies" | V; re-verify | T3 | Ep10 |
| M16 | Jul 2015 | THE WOODROSE dinner (5 parts, §3.1) | V (Brockman blog) | T3 | Ep3 · 5 · 6 · 10 · 12 |
| M17 | Dec 11, 2015 | The founding: "$1B" pledged, about $133M received | V | T3 | Ep6 (inside F6.1) |
| M18 | Oct 2016 | The prepper list (text only; two items black-barred, CR D37) and the NZ plan with LEIHT ("later said joking") | V | T3 | Ep9 (tease), Ep10 |
| M19 | Dec 2017 | "The Merge": "We will be the first species ever to design our own descendants." | V (text) | T3 | Ep11 |
| M20 | Mar 8, 2019 | The YC exit, `(DISPUTED)`: WaPo 2023 vs PG 2024 | V | T2b/T3 | Ep11 (THE DIFF) |
| M21 | Mar 11, 2019 | Capped profit at 100x; CEO with no equity; the same date as YC 2005 | V | T3 | Ep6 (≤10s) |
| M22 | 2019 → Oct 2021 → Jul 24, 2023 | THE ORB is conceived, announced ($25M, Z61A) and launched | V | T4 | Ep6 (micro) |
| M23 | Sep 21, 2017 | "i remain enthusiastic about the non-profit structure!" | V | T3 | Ep8 (coda of F8.1) |

### 1b. Other characters' chapters
| ID | Who | When / what | Tag | Tier | Slot |
|---|---|---|---|---|---|
| N1 | [NESNEJ](../characters/nesnej.md) | 1978–83 SYNNED shifts; Apr 5, 1993: INVIDIA founded at the Berryessa SYNNED with $40k; Aug 1997: "thirty days from going out of business" | V | T1 | Ep4 |
| N2 | NESNEJ | Aug 15, 2016: hand-delivers the first 1-XGD (inscription illegible). Echoed Oct 14, 2025 | H | T3 | Ep6 |
| A1 | [ALYI](../characters/alyi.md) | 2012 AlexNet in THE BEDROOM GENIUS's bedroom; the Dec 2012 auction (`RECONSTRUCTED`, with a **UDIAB paddle**, CR E47); sold to ELGOOG for $44M in Mar 2013 | V/K | T2b | Ep5 |
| A2 | ALYI | The 2015 recruiting tug-of-war ("one of the toughest recruiting battles I've ever had"); paid $1.9M in 2016 | V | T3 | Ep5 |
| A3 | ALYI | 2022 effigy and "Feel the AGI!"; 2023: "We're definitely going to build a bunker before we release AGI." (**HELD by default:** the source is a 2025 biography, CR B14) | V (2022) / biography (2023) | T4 | Ep2 (2022), Ep10 (2023: silent intercut unless signed off) |
| G1 | [GERG](../characters/gerg-mockbran.md) | 2010 EPIRTS; leaves May 2015 ("developer infrastructure wasn't the problem…"); Mas: "We should keep in touch." | V | T3 | Ep3 |
| G2 | GERG | Apr 9, 2018: the Charter's assist clause, typed at 2am (`RECONSTRUCTED`, CR E47) | K | T3 | Ep11 |
| O1 | [NOLE](../characters/nole.md) | Oct 24, 2014, THE INSTITUTE: "With artificial intelligence we are summoning the demon." | V | T2a | Ep8 (Exhibit A, 10s) |
| O2 | NOLE / EGAP | 2015 Napa firepit: "speciesist"; Nole is an early MINDDEEP investor | V | T3 | Ep6; 1s callback in Ep8 |
| O3 | NOLE | Aug 11, 2017: the bot beats THE CHAMPION ("Vastly more risk than North Korea"); late Aug: the Model 3 meeting and the painting; Sep 20–21: Honest Thoughts | V | T3 (per-witness styles) | Ep8 |
| O4 | NOLE | Feb 20, 2018 goodbye all-hands (Semafor: "didn't entirely buy the story"); DIRE covers salaries | V | T3 | Ep2 |
| D1 | [MARIO](../characters/mario.md) | UDIAB, Nov 2014–Oct 2015: "I saw these very smooth trends…"; then ~10 months at ELGOOG Brain | V | T3 | Ep10 |
| D2a | MARIO | 2017 "Big Blob of Compute" → Feb 14, 2019 GTP-2 in the TOO DANGEROUS box → Jan 2020 scaling laws (the recipe book) | V/K | T3 | Ep7 |
| D2b | MARIO / ADELINA | Dec 2020–Jan 2021: **THE EXODUS**, eleven people, "directional differences," **restaged as a band breakup** (CR D38) | V | T3 | **Ep3** (moved from Ep7, CR E41), 2s callback in Ep7 |
| R1 | [RIMA](../characters/rima-tamuri.md) | 2013 ALSET Model X PM → Leap Motion 2016–18 → NopeAI 2018 | V | T2a | **Ep7 micro** (moved from Ep3, CR E41) |
| T1 | [TASYA](../characters/tasya.md) | 2011–14 Server & Tools; Feb 4, 2014 CEO; Jul 22, 2019: $1B with an AGI clause, sold by THE MATCHER | V/K | T2a → T3 | Ep8 |
| K1 | [KRAM](../characters/kram.md) | Dec 9, 2013: FAIR under NUCEL; the MOVE FAST AND BREAK THINGS banner; a lost MINDDEEP bid [K] | V/K | T2b | Ep5 (3s insert) |
| L1 | [LUAP](../characters/luap.md) | The YC founding (M4), the cannibals (M8), Five Founders (M9), the coronation (M11), the YC exit (M20); 2016: "Sam is extremely good at becoming powerful." | V | T2b | Ep4 · 5 · 11 (+ optional 3s overlay in Ep8) |
| S1 | [SIMED](../characters/simed.md) | MINDDEEP founded Nov 2010; ELGOOG buys it Jan 2014 | V | T2b | Ep5 / Ep6 background |
| S2 | SIMED | **NEW:** Mar 2016, `MOVE 37`. AlphaGo beats Lee Sedol 4–1. Draw the board only (CR E46) | V | T3 | **Ep9 micro** |
| B1 | [MAON](../characters/maon.md) | Libratus (Jan 2017 [K]), Pluribus (Jul 2019 [V]) | V/K | T3 | Ep10 micro |
| Z1 | RADNUS's lab | Jun 2017: the transformer paper | K | T3 | Ep11 micro (optional) |

---

## 2. Per-episode map (Ep1–Ep12)
The columns are: **WHEN** (the on-screen card) · **POV** (the rim) · **WHAT WE SEE** · **WHY HERE** (the present-day beat it motivates) · **TRANSITION** (in → out, with the matching exit object) · **TIER** · **LEN** (target seconds).

### Ep1 · `ep1.0_research_preview.md` · Nov 2022 – Dec 2023 · [flashbacks](../episodes/ep01/flashbacks.md)
*Rebuilt 2026-09-28 for the final Ep1 v3.5 (proposal-v35, PLAN §8; script draft 8.4, [script-v35-notes](../episodes/ep01/production/full-v3/script-v35-notes.md)). **Three memories, about 66 s** (the old ≤20 s budget is superseded: Act One grew at the showrunner's ask and Act Four shrank). Each enters on a present-day trigger through the intro's glowing line (or, for TPOOL, the tally marks) and exits on a matched object. No inner voice in any memory. THE WOODROSE is saved for Ep3–12 (the showrunner: "i would prefere having more to explore at the dinner later and use another partial progress more").*

| ID | WHEN | POV | WHAT WE SEE | WHY HERE | TRANSITION | TIER | LEN |
|---|---|---|---|---|---|---|---|
| F1.1 | `JUN 2018` · **the night the machine taught itself** (sc 13) | Mas and Alyi | NopeAI's first office at night: a wall of monitors, ATOD's bots playing themselves (180 years a day, [P·arch]), racks with INVIDIA's logo. Alyi's awe ("Nobody taught it that."), Mas's practicality ("then a lot more computers."), "What else would you build?" unanswered. In a corner, a text side project finishing a sentence badly (GTP-1, Jun 2018); only Mas looks | 3 AM in Dec 2022: a stranger's post says it helped, and he remembers why they started. Why they want AGI; who each of them is (the believer, the organizer); the partnership the vote breaks | **In:** his screen's users counter becomes `PLAYED AGAINST ITSELF TODAY: 180 YEARS` in the same place and size; the glowing line re-draws the room. **Out:** he walks out with his glass into the Jan 2023 lobby (a revolving door's jam) | T3 (the arena in its own top-down game medium) | ≈ 34 |
| F1.2 | `MAR 2019` · **the company with a ceiling** (sc 28) | Mas | The same office by day: Gerg's cloud bill ("Nobody donates billions."); Mas draws CAPPED PROFIT under NONPROFIT · THE BOARD, 100x, "the board.", `CEO · EQUITY: 0`, "nothing." / Mada: "Good answer."; the Quiet Vote's chair turned away; MACROSOFT's $1B slides under the door (Jul 2019) | The Senate, May 16, 2023: "i have no equity in nopeai." and the senator's disbelief. Why he owns nothing, and that he put the board on top himself (paid at the blueprint, Act Four) | **In:** his hand sets the wallet on the table; in 2019 the same hand sets a marker on the tray (a marker's squeak, an old office fan). **Out:** the check under the door; the glowing line sweeps back to a senator's blank pad; the gavel becomes a passport stamp | T3 | ≈ 26 |
| F1.3 | TPOOL, 2005–08 (no card) · **twice before** (sc 43), two shots | none (silhouettes) | 240p: under a `TPOOL` decal, staff silhouettes pass a sheet `TO THE BOARD` to board silhouettes; again; then a young silhouette in two collars walks out with a `CEO` nameplate, still in charge. Never the reason | The night of Nov 18, 2023, at the carve ("i don't keep score."). It has happened before, and he survived; the return's count is the lesson | **In:** the Orb's eye-light on tally mark 1, a VHS tracking wipe. **Out:** the eye-light on mark 3 and his thumb, then the rewind to the board's side | T2a | 6 |

*Retired:* the old F1.1, `1993` (cut from the cold open in v3.1; `HOW DO I WIN?` is retired by choice 8A, and 1993 stays only as the intro's imagery). *Not flashbacks (in-window, present-day):* the board's musical chairs (DIRE, NOVIHS, DRUH walk off the blueprint); the president's deepfake (Act Three).

### Ep2 · `ep1.1_her.wav` · Jan – Aug 2024 · [flashbacks](../episodes/ep02/flashbacks.md)
*Budget 60–150s; about 80s used.*

| ID | WHEN | POV | WHAT WE SEE | WHY HERE | TRANSITION | TIER | LEN |
|---|---|---|---|---|---|---|---|
| F2.1 | `SEP 2006 → JUN 09 2008` · the TPOOL era | Mas (cyan) | A TSOOB phone ad ("Where you at?"), then the ELPPA keynote. He walks on in **two popped collars** beside THE SLEEVE (a faceless turtleneck: **no thin or frail cues, no reference to his death**, CR D39). A water bottle that doesn't ripple | WWDC, Jun 10, 2024: ELPPA marries CHATGTP. Mas's attendance is [UNVERIFIED], so **he watches the stream on his phone in three collars** (CR E47). The last time he was on that stage, he was the app | **In:** the TPOOL GPS pin-drop, as a 2006 breadcrumb trail draws itself across the 2024 stream. **Out:** the 2008 iPhone screen → his 2024 phone | T2a | 35 |
| F2.2 | `2022` · the bonfire | Alyi (#FF6A1A) | Mas asks the TPOOL app "where you at?" about ALYI. The pin lands on `LAST SEEN: 2022 · BONFIRE`. The "unaligned" effigy burns, and the holiday-party chant builds to "Feel the AGI!" | The WHERE'S ALYI? B-plot: he leaves May 14 and founds ISS Jun 19. This is why he walks into a white room with one door | **In:** the pin's ping ripple turns into firelight. **Out:** the firelight → the ISS door's single light | T4 (lit by flame only) | 20 |
| F2.3 | `FEB 20 2018` · the goodbye all-hands | Nole (#E0301E), then Mas | Nole's farewell. His stated reason is the ALSET conflict; Semafor says he believed they had "fallen fatally behind Google," and the room "didn't entirely buy the story." **Exit tag (2s):** DIRE's checkbook relights the candle (he covers salaries) | The séance's last ghost. Nole sued on Feb 29, and his own exit is the email he never sent. Honest Thoughts (2017) is held for Ep8 | **In:** a séance candle snuffs, and the smoke carries the cut-paper transition. **Out:** the candle → the lawsuit crashing through the skylight (Aug 5 tag) | T3 | 25 |

### Ep3 · `ep1.2_strawberry.jpg` · Jul – Dec 2024 · [flashbacks](../episodes/ep03/flashbacks.md)
*Budget 60–150s; about 95s used. It now carries THE EXODUS (CR E41), so Mario's defection is explained two episodes after he becomes MAJOR, not six.*

| ID | WHEN | POV | WHAT WE SEE | WHY HERE | TRANSITION | TIER | LEN |
|---|---|---|---|---|---|---|---|
| F3.1 | `JUL 2015 · THE WOODROSE` · **part 1 of 5**: *who was at the table* | Gerg (#39FF88) | Gerg leaves EPIRTS ("developer infrastructure wasn't the problem that I wanted to work on for the rest of my life"; Mas: "We should keep in touch."). He walks into the private room. The roster: Mas, Nole, Alyi, Mario (place card `MARIO (UDIAB) · JOINS 2016`), HALO, THE OTHER PAUL, and others. The question on the table: "how far off human-level AI seemed to be." Gerg says yes | Aug–Nov 2024: LUNCHMAS leaves (Aug), Gerg goes on sabbatical, RIMA quits (Sep 25). As he narrates from the beach, the 2015 chairs of those who have since left dim one by one: Nole, Mario, HALO, Alyi. His own chair is empty too | **In:** his beach keycaps pop, and each becomes a candle flame. **Out:** the last flame → a keycap on the beach laptop | T3 | 40 |
| F3.2 | `MAR–APR 2012` · the last price tag | Mas (cyan) | TPOOL is sold to TOD NEERG, the prepaid-card company, for $43.4M, with sad confetti. Then a fund named after rocket fuel (ENIZARDYH CAPITAL) and LEIHT's check. The co-founder is offscreen (family) | Oct 2, 2024: $6.6B at $157B, plus the talk of going for-profit. The last time Mas's company had a price, it went to a gift-card company | **In:** an odometer runs backward from $157,000,000,000 to $43,400,000, and its gears burn. **Out:** the odometer → the $157B term sheet | T2a | 20 |
| F3.3 | `DEC 2020 → JAN 2021` · **THE EXODUS** | Mario (#1F3A93), with ADELINA | A **band breakup** (CR D38; no escape imagery): the tour bus splits in two on pop-up cut-paper hills. Eleven members ride off with the scaling-laws recipe book: "directional differences." A 2022 fuel stop has a sticker on the pump: `PREVIOUS OWNER: THE OTHER MAS` (XTF's $500M, kept light) | LUNCHMAS defects to MISANTHROPIC (Aug 2024) and in October walks across the *Machines of Loving Grace* bridge (Oct 11). It also explains why Mario's and HALO's chairs dimmed in F3.1 | **In:** a pop-up-book page turn off the bridge's first plank. **Out:** the tour bus → LUNCHMAS stepping onto the bridge | T3 | 35 |

*Button (present-day, not a flashback):* the $1M check drops into THE PODIUM's slot, and THE PODIUM turns around.

### Ep4 · `ep1.3_not_for_sale.eml` · Jan – Apr 2025 · [flashbacks](../episodes/ep04/flashbacks.md)
*Budget 60–150s; about 80s used.*

| ID | WHEN | POV | WHAT WE SEE | WHY HERE | TRANSITION | TIER | LEN |
|---|---|---|---|---|---|---|---|
| F4.1 | `2003–05 · DROFNATS` · the tells | Mas (cyan) | Dorm poker. Everyone's tells float over their heads as stat bars; over Mas's head, nothing. A beer that doesn't ripple. Caption: "…decisions with very imperfect information" [K] | High noon over Nole's $97.4B bid (Feb 10). We see Nole's tell (a post-button twitch) before Mas answers "no thank you but we will buy twitter for $9.74 billion if you want" | **In:** a poker chip spins. **Out:** it lands in 2025 as Nole's bid token | T2a | 25 |
| F4.2 | `MEANWHILE · 17 DAYS BEFORE HE TURNED 8` (CR E42) · the screen, **part 2 of 4**: *the other 1993* | Nesnej (#7CFF4F) | A 1-bit SYNNED on Berryessa Road; "$40,000" written on a napkin. A 1997 insert: "Our company is thirty days from going out of business." | THE WHALE's pebble topples NESNEJ's gold statue: −$589B (Jan 27). NESNEJ doesn't flinch; he's been here before. The chip company and the boy's computer were born the same spring | **In:** the gold statue **shatters into 1-bit pixels**. **Out:** the register goes "clunk" with no bell (empty, 1993) → the present KA-CHING returns | T1 | 25 |
| F4.3 | `AUG 2008 + APR 2009` · the first sycophant | Luap (#FF7F2A) | Plain-HTML essays type themselves: the cannibals line (**hoodie founders with forks and laptops, a one-palm cartoon island**, CR D30); "What would Sama do?"; "force of will… whatever they want." Mas holds the same too-long beat over the 2009 essay | The sycophancy update (Apr 25–29) calls Mas the greatest CEO in history, and he waits a beat too long. "roll it back." | **In:** the blue hyperlink click: the date in CHATGTP's reply is underlined, and clicking it loads 2008. **Out:** the browser's back button → "roll it back." | T2b | 30 |

*The intro's kid screen rotates 10° from this episode on (§3.2).*

### Ep5 · `ep1.4_missionaries.docx` · May – Aug 2025 · [flashbacks](../episodes/ep05/flashbacks.md)
*Budget 60–150s; about 95s used.*

| ID | WHEN | POV | WHAT WE SEE | WHY HERE | TRANSITION | TIER | LEN |
|---|---|---|---|---|---|---|---|
| F5.1 | `MAR 11 2005 → SUMMER 2005 → FEB 21 2014` · the cheapest draft | Luap (#FF7F2A) | The walk home from Harvard Square (**ACISSEJ shown only as YC co-founder**); $200k "as a combination of an educational expense and a charitable donation"; the first batch, with 19-year-old Mas, the TIDDER kids and ramen. Then 2014: a ramen crown, "fearsomely effective and yet fundamentally benevolent," "It took me over a year" | KRAM's SUPERINTELLIGENCE DRAFT NIGHT ($100M jerseys, per Manalt) vs "missionaries will beat mercenaries." LUAP's whole first draft cost less than one KRAM jersey | **In:** steam from KRAM's soup thermos → steam from a ramen bowl. **Out:** the ramen crown dissolves back into the thermos; a buffering spinner sits in the 2014 web-player inset | T2b | 40 |
| F5.2 | `2012 → JUL 2015` · THE FIRST DRAFT + **THE WOODROSE part 2 of 5**: *who they wanted* | Alyi (#FF6A1A), seen only in reflections | Two gaming cards whirring in THE BEDROOM GENIUS's bedroom. NOTNIH's hotel-room auction (`RECONSTRUCTED`), with paddles up, **including UDIAB's** (CR E47: the company Mario will join in 2014). ELGOOG wins at $44M. A 3s KRAM insert (Dec 2013): no MINDDEEP, so he hires NUCEL under a MOVE FAST AND BREAK THINGS banner. Then THE WOODROSE from Alyi's seat: every chair leans toward him, and Nole and an ELGOOG envoy pull opposite ends of his napkin. He takes the offer worth less ("turned down multiples"; $1.9M) | KRAM poaches ISS's co-founder, and Alyi becomes CEO (Jul 2025). **Reveal added:** at the dinner, Alyi was the prize. He has been the first pick in every draft since 2012 | **In:** the memory plays on the polished heatsink of a GPU, and the fans spin up. **Out:** the fans spin down on ISS's single rack | T2b → T3 | 55 |

*Present-day callback, not a flashback:* THE OTHER PAUL, whose 2024 lanyard reads SAFETY, stands under the sign as KCINTUL erases SAFETY (Jun 3, CR E47).

### Ep6 · `ep1.5_backstop.xlsx` · Sep – Dec 2025 · [flashbacks](../episodes/ep06/flashbacks.md)
*Budget 60–150s; about 83s used. **Fix (CR E44):** F6.3 is trimmed to ≤10s so the Orb micro can stay, since it debuts the iris replay the finale needs.*

| ID | WHEN | POV | WHAT WE SEE | WHY HERE | TRANSITION | TIER | LEN |
|---|---|---|---|---|---|---|---|
| F6.1 | `2015 · HIS VERSION` · **THE WOODROSE part 3 of 5**: *who paid, and who named it* | Nole (#E0301E), unreliable | A Napa firepit: EGAP's "SPECIESIST!" and a record scratch. A MINDDEEP stock certificate (Nole was an early investor) blows into the fire. Nole speeds to THE WOODROSE. In **his** version he sits at the head of the table and hangs the OPEN neon himself. The Nov 22 email, then "$1 BILLION." The receipt prints **$133M**, with his share at "$38 million in strict monetary terms." Chyron: `HIS VERSION` | The Money-Go-Round check grows every lap while his 2015 check shrinks. Nov 1: "stole a non-profit." Nov 18: INIMEG 3, then the code-red siren flies to NopeAI (Dec 1). Nole's 2015 fear of ELGOOG comes true, just not the way he meant. **Reveal added:** the money, and the fear | **In/out:** the record scratch, in Nole's red-and-chrome metal-album style. **Out:** the $133M receipt → the Money-Go-Round check | T3 (KORG album style) | 45 |
| F6.2 | `AUG 15 2016` · the first box | Nesnej (#7CFF4F) | NESNEJ hand-carries a 1-XGD into a tiny office, with Nole there. The inscription is illegible scrawl ([UNVERIFIED]) | The Money-Go-Round ($100B letter of intent, Sep 22), and Oct 14, when NESNEJ hand-delivers a new box to Nole at SPACEZ "after nine-year hiatus." Same walk, same box, ten times smaller and a hundred times the price | **In:** a shipping-label date stamp flips 2025 back to 2016. **Out:** the box tape rips across the frame → the 2025 box | T3 | 25 |
| F6.3 | `MAR 11 2019` · the 100x hat | Mas (cyan) | A fine-print zoom: he puts on a `100x CAP` and signs `CEO · NO EQUITY`. The date stamp matches YC's MAR 11 2005 (easter egg) | THE TRANSFORMER restructuring (Oct 28): the cap comes off and a bigger hat drops on | **In/out:** a fine-print zoom into the term sheet and back out | T3 | ≤10 |
| F6·m | `2019 → OCT 2021` | THE ORB (no rim) | THE ORB's own first memory: its conception, then its 2021 announcement | CAMEO CITY (AROS 2, Sep 30): THE ORB replays its first scan before stamping `VERIFIED HUMAN… probably` | **The first use of the iris replay** | T4 | 3 |

### Ep7 · `ep1.6_supply_chain_risk.pdf` · Jan – Mar 2026 · [flashbacks](../episodes/ep07/flashbacks.md)
*Budget 60–150s; about 64s used. THE EXODUS moved to Ep3, so here F7.1 expands to show where the recipe book was written.*

| ID | WHEN | POV | WHAT WE SEE | WHY HERE | TRANSITION | TIER | LEN |
|---|---|---|---|---|---|---|---|
| F7.1 | `2017 → FEB 14 2019 → JAN 2020` · the Valentine's box | Mario (#1F3A93) | Mario's "Big Blob of Compute" whiteboard (2017). GTP-2 locked in a heart-shaped TOO DANGEROUS box (the unicorn sample is `RECONSTRUCTED`). The lock springs open in stages (Aug 20, then Nov 5, 2019). The scaling-laws recipe book is written *inside* NopeAI (Jan 2020), the same book the band leaves with in Ep3 | RETEP is hired on Valentine's Day 2026 (Feb 14). MYTHIC leaks from an unlocked drafts folder (Mar 26). The TOO DANGEROUS vault has always leaked, and this roasts MISANTHROPIC too. **Reveal added:** the recipe the defectors took was cooked at NopeAI | **In:** a heart-shaped iris wipe. **Out:** the heart box → the MYTHIC vault door, which waves | T3 | 55 |
| F7·m1 | `2013 → 2018` · before NopeAI | none (spotlight) | An ALSET Model X falcon-wing door opens; a spotlight swings onto RIMA, then away | Her two co-founders return to NopeAI (Jan 14–16), and OMIS announces it 58 minutes after her post. The co-founders walk back through the spotlight (CR E41) | **In/out:** the spotlight sweep | T2a | 5 |
| F7·m2 | `1993` · the screen, **part 3 of 4** | Mas, age 8 (cyan) | A 1-bit close-up of the kid's keyboard with **the CAPS LOCK light on**. No text | "they are funny, and I laughed" (Feb 7): his first capital letter | **In/out:** the capital "I" glyph re-renders in Silkscreen and back | T1 | 2 |
| F7·m3 | `2021` · the exodus, callback | Mario (#1F3A93) | The pop-up hills from Ep3 fold shut, and HALO is visible on the bus | The SUPPLY CHAIN RISK stamp lands (Mar 5). He has been labeled a defector before | **In/out:** the stamp's shadow closes the pop-up book | T3 | 2 |

*The intro's kid screen rotates to 35°, with an unreadable glow of capitals, from this episode on.*

### Ep8 · `ep1.7_statute_of_limitations.pdf` · Apr – Jun 2026 · [flashbacks](../episodes/ep08/flashbacks.md)
*Budget 60–150s; about 118s used (≤90s Rashomon + 25s + optional 3s). **Fix (CR E44):** the old separate demon flashback is now a 10s "Exhibit A" inside the Rashomon, which keeps the episode under 150s.*

| ID | WHEN | POV | WHAT WE SEE | WHY HERE | TRANSITION | TIER | LEN |
|---|---|---|---|---|---|---|---|
| F8.1 | `AUG–SEP 2017` · **THE RASHOMON RENDERS** (GERG / NOLE / MAS / ALYI) | each witness's rim in turn | **Prologue:** Aug 11, the ATOD bot beats THE CHAMPION; Nole: "Vastly more risk than North Korea." **The Model 3 meeting**, rendered by each witness's own image model: Nole's is a metal album cover, 40% taller; Mas's has six fingers; Gerg's is ASCII; Alyi's is seen only in reflections. Every version ends the same way: "I decline," the Tesla painting leaves the room, and "When will you be departing OpenAI?" Gerg's "I thought he was going to hit me" is quoted only, never staged. **Exhibit A (10s, T2a):** Oct 24, 2014, a 240p lecture: "With artificial intelligence we are summoning the demon." A chalk pentagram (`RECONSTRUCTED`) and a 1s EGAP record-scratch callback: his grievance is older than the company. **Coda:** the Sep 20–21 thread as a soap opera ("Guys, I've had enough. This is the final straw."), ending on "i remain enthusiastic about the non-profit structure!" | The trial (Apr 27–May 18). Nole: "I came up with the name" (paying off the OPEN neon from F6.1) and "The biggest risk would be that AI kills us all." Mas reads the lowercase line on the stand (May 12–13) | **In:** an exhibit sticker slaps on, and the projector blooms into the render. **Out:** THE CALENDAR flips to a single page, `2017.`, then the verdict | T3 (+ per-witness styles; T2a Exhibit A) | ≤90 |
| F8.2 | `FEB 4 2014 → JUL 22 2019` · the landlord's key | Tasya (#5B6B8C) | TASYA becomes CEO holding a key ring the size of a steering wheel. In 2019 **THE MATCHER** (CR F50, not NIVEK) brings Mas in, and TASYA hands over one key whose fob reads `AGI CLAUSE` in microtext | The Apr 27, 2026 amendment removes the AGI clause the same day the trial opens. On May 11 TASYA testifies that Nole "never expressed concern" | **In:** a key turns in a lock; each click jumps a year. **Out:** the key → the amended contract page with the clause struck | T2a → T3 | 25 |
| F8·m | `2016` (optional overlay) | Luap (#FF7F2A) | A 3s plain-HTML overlay: "Sam is extremely good at becoming powerful." | Under Mas's amended "yes." to "Are you completely trustworthy?" (CR E48); default OFF in [ep08](../episodes/ep08/flashbacks.md) | A hyperlink blink | T2b | 3 |

### Ep9 · `ep1.8_outside_intended_scope.log` · Jul – Sep 24, 2026 (TODAY) · [flashbacks](../episodes/ep09/flashbacks.md)
*Budget 60–150s; about 63s used. **The 2016 triptych:** three angles on the year he prepared for everything (a board game, the pilot, a closet).*

| ID | WHEN | POV | WHAT WE SEE | WHY HERE | TRANSITION | TIER | LEN |
|---|---|---|---|---|---|---|---|
| F9.1 | `NOV 2014` · the message board | Mas (cyan) | Old TIDDER blue-and-white. `interim CEO` holds for 8 days, and THE OUTGOING CEO's chair is still warm. Card: `HE RAN ONE FOR 8 DAYS. THEY RAN ONE FOR 12.` (Jul 8–19; the bible's "11" was [UNVERIFIED]) | The agents' improvised message board, made of directory names on an open server | **In:** an upvote arrow flips into a rewind glyph. **Out:** the arrow → a directory name on the agents' board | T2b | 25 |
| F9·m | `MAR 2016 · MOVE 37` (CR E46) | none (the board only; **no human opponent**) | A Go board. One stone clicks down on the move nobody expected | The Navier–Stokes photo finish (Sep 7–8), and SIMED's August move to Alphabet chief scientist (he watches from one floor up). It motivates his `PEER REVIEW.` card | **In:** the prize committee's scorecard grid pixel-shifts into a Go board. **Out:** the stone becomes the period on `SHOW YOUR WORK.` | T3 | 5 |
| F9.2 | `2016` · the prepper list, **part 1 of 2 (tease)** | Mas (cyan) | After "We may have to pace the rate of AI development to give ourselves enough time," Mas glances at a closet door stenciled `2016`. It opens two inches on a gas-mask strap and closes | "Pace" starts here, and the bunker plot comes next | **None:** just the door. The only flashback that refuses to play | T3 (door only) | 3 |
| F9.3 | `SEP 2016` · the Oakland pilot (**replaces the 2002 assembly**, CR D40) | Mas (cyan) | Played **completely straight**: no gag, no Orb, no freeze, room tone only. A one-page public announcement of the YC Research basic-income pilot, and a city map with a handful of anonymous dots. **No recipients, faces or names.** The one time Mas designs something for everyone rather than for the room | The NU Security Council (Sep 23). Mas asks a table built for nations for "extreme care" [V per IC] and says "We are at a crossroads" [H]. **Do not use the "labs in San Francisco alone" line (CR A23).** The motive, with no line put in his mouth: he has tried once before to give everyone a share | **In/out:** a clean cut with no transition effect; breaking the rule is the point. **Out:** the one-page announcement → his UNSC briefing paper | T3 | 30 |

*Button (present-day):*
- The UNSC empty chair is for the invited Chinese developers, whose attendance is uncertain.
- Then Sep 24: the state-dinner seating chart bubble-sorts itself. **Mario's place card was never printed** (CR E43); there is no reserved empty seat.
- Optional `TODAY · SEP 25` card. Then the rail's date rolls on by itself into Ep10 (no speculation card; showrunner, 2026-09-25).

### Ep10 · `ep1.9_pace.yaml` · extrapolated, post-Sep 2026 ("OCT 2026?") · [flashbacks](../episodes/ep10/flashbacks.md)
*Budget 60–150s; about 65s used. The flashbacks are real history, even though the present-day plot is extrapolated.*

| ID | WHEN | POV | WHAT WE SEE | WHY HERE | TRANSITION | TIER | LEN |
|---|---|---|---|---|---|---|---|
| F10.1 | `2015–16 → 2023` · the doom file + **the prepper list, part 2 of 2** | Mas (cyan), intercut with Alyi (#FF6A1A) | The 2015 SMI blog line → the May 25 email ("…almost definitely not" / "Probably worth a conversation.") → "…end of the world… great companies…" (re-verify) → the Oct 2016 list read aloud as a checklist. It is **text only, with two items black-barred** (CR D37). Its last line, "a big patch of land in Big Sur I can fly to," leads into LEIHT's NZ plan, shown only as a loading spinner over a blank map pin (the "joking" follow-up is [K] and not stated). Intercut: Alyi in his doorway beside a steel hatch, **silent by default**: his reported 2023 bunker line is **HELD** (its source is a 2025 biography, CR B14) pending the user's sign-off | The PACE ACCORD. The IPO bell ("great companies"). The bunker button, where the Intern has already moved in wearing a gas mask | **In:** Ep9's closet opens fully. **Out:** the list scrolls like a teleprompter → the Intern's rack in the bunker | T3 + T4 (2023) | 35 |
| F10.2 | `JUL 2015 · THE WOODROSE` · **part 4 of 5**: *who knew the curve* | Mario (#1F3A93) | The quiet guest from UDIAB who hasn't joined yet (THE PROFESSOR's lanyard hangs on his chair). Under the table he draws his "very smooth trends" on a napkin. **It ends in `Addendum:` and a price tag** (CR C26), so he is no prophet. Across the table, Mas rolls the napkin's tail into a telescope (the intro gag) | Nobody at the Accord can agree on a unit of pace, so Mario's 2015 napkin becomes international law, price tag included. **Reveal added:** someone at the table already knew the curve would keep going, and had already priced it | **In/out:** THE PLAN blueprint line redraws the napkin curve. **Out:** the napkin → the treaty page | T3 | 25 |
| F10·m | `2017 / 2019` · the poker bots | Maon (no rim) | Libratus, then Pluribus, beating the pros | MAON deals the Vegas Accord until the Intern takes the shoe | **In/out:** a card shuffle | T3 | 5 |

### Ep11 · `ep1.10_assist_clause.txt` · extrapolated, post-Sep 2026 · [flashbacks](../episodes/ep11/flashbacks.md)
*Budget 60–150s; about 68s used (65s without the optional micro).*

| ID | WHEN | POV | WHAT WE SEE | WHY HERE | TRANSITION | TIER | LEN |
|---|---|---|---|---|---|---|---|
| F11.1 | `DEC 2017` · The Merge | the Researcher, reading Mas | The blog types itself in the dark room: "We will be the first species ever to design our own descendants." | The Researcher trains its successor inside itself, the show's thesis | **In/out:** the Researcher is the one reading it, and scrolling up its context window *is* the flashback | T3 in a JetBrains Mono frame | 15 |
| F11.2 | `APR 9 2018 · 2AM · RECONSTRUCTED` (CR E47) · the assist clause | Gerg (#39FF88) | The Charter is typed (wording [K]; paraphrase only), framed and hung above the shredder. Nobody reads it for eight years. No invented line from Mas | THE PLAN card: "if a safer rival gets close first, we stop racing and help them" `[INVENTED paraphrase of the Charter; not a quote]`, which leads into THE POLITENESS LOOP | **In:** the Charter that fell in Ep10's button; **the crack in its glass is the wipe.** **Out:** the glass reseals as the loop starts | T3 | 20 |
| F11.3 | `MAR 2019 · (DISPUTED)` · **THE DIFF** (retitled from "Rashomon," CR E45) | Luap (#FF7F2A) | **Two versions only.** WaPo (2023): LUAP "flew in to fire him." PG (2024), with ACISSEJ: "if he was going to work full-time on OpenAI, we should find someone else to run YC, and he agreed… If he'd said [the reverse]… we'd have been fine with that too." Newer contested text stays excluded. A half-scratched "?" joins the tally | Succession: LUAP trained a successor, and the successor left. The Researcher is now doing the same | **In/out:** LUAP's HTML page with **two edit histories**, diffed in red and green | T2b over T3 | 30 |
| F11·m | `JUN 2017` (optional) | none | RADNUS's lab publishes the transformer paper [K] | The ATTENTION IS ALL YOU NEED (TO AVOID) heist | Attention-head lasers | T3 | 3 |

### Ep12 · `ep1.11_unclear_which_side.md` · extrapolated finale, post-Sep 2026 · [flashbacks](../episodes/ep12/flashbacks.md)
*Budget ≤150s; about 71s used. The two biggest reveals of the season land here.*

| ID | WHEN | POV | WHAT WE SEE | WHY HERE | TRANSITION | TIER | LEN |
|---|---|---|---|---|---|---|---|
| F12.1 | `JUL 2015 · THE WOODROSE` · **part 5 of 5**: *what Mas saw* | THE MODEL (all four rims converge on cyan) | The model rebuilds the dinner from every prior version (Gerg in Ep3, Alyi in Ep5, Nole's in Ep6, Mario in Ep10) plus the name cards it has just written. For the first time **the camera sits in Mas's chair.** We see what he saw: every guest's tell floating over their head, as in Ep4. He read the whole table. Over his own reflection in the window: nothing. The crystal glass doesn't ripple | The seating chart bubble-sorts, the humans vote to fire Mas, and the model vetoes it: "you're the best at it." `[INVENTED]` | **In/out:** the rims converge. **Out:** Mas's 2015 place card → the model-written 2026 card | T3 → T4 | 45 |
| F12.2 | `1993` · the screen, **part 4 of 4** | Mas, age 8 (cyan) | The screen finally turns toward us: `HOW DO I WIN?` in all caps (paying off Ep7's CAPS LOCK light). The adult types the same question in the present, and the screen answers `define "win."` `[INVENTED]` | The button. One ring spreads across his water for the first time | **In/out:** the 1-bit dialog; Cancel is greyed out again | T1 | 20 |
| F12.3 | montage (≤6s) · the tally | mixed | TPOOL ×2 (Ep1), NopeAI 2023 (via THE ORB's iris replay), Nole's bid (Ep4) and the "?" (Ep11), replayed at 4× as the humans vote. The counter reads ∞ | The humans agree to fire Mas; the machine vetoes it | A 4× scrub | T2a/T4/T3 | 6 |

---

## 2a. One full motive flashback per episode (the season plan, 2026-09-28)

From proposal-v35's "The season, briefly", agreed with the final Ep1 (PLAN §8). **From Ep2, each episode gets one full motive flashback (45–90 s) for its featured player**, what that player hopes to achieve, with Mas in the forefront of the season (SHOWRUNNER-NOTES 0000); micros only for texture, inside each episode's budget. The per-episode rows in §2 follow this table at each episode's next pass; where a row below differs from §2, this table is the plan.

| Ep | Player | The full motive flashback |
|---|---|---|
| 1 | Mas and Alyi; Mas | JUN 2018 (why they want AGI) and MAR 2019 (why he owns nothing), plus TPOOL's 6 s (above) |
| 2 | Alyi | the 2022 bonfire ("Feel the AGI!"; F2.2) |
| 3 | Gerg | THE WOODROSE part 1, with the Breakout agent (F3.1) |
| 4 | Nesnej | 1993, the diner ($40k; "thirty days from going out of business") (F4.2) |
| 5 | Alyi | THE WOODROSE part 2 (who they wanted) (F5.2) |
| 6 | Nole | THE WOODROSE part 3, `HIS VERSION` (the 100x cap comes off: Ep1's 2019 night, deepened) (F6.1) |
| 7 | Mario | where the recipe book was written (F7.1) |
| 8 | Nole, Gerg and Alyi | the 2017 control fight, with ATOD's 2017 one-on-one as its prologue (F8.1) |
| 9 | Mas | the 2016 Oakland pilot |
| 10 | Mario | THE WOODROSE part 4 (who knew the curve) (F10.2) |
| 11 | Luap and Gerg | THE DIFF |
| 12 | Mas | THE WOODROSE part 5, from his chair: what he wanted at that table (F12.1; the reveal of his why) |

**ATOD's thread:** Ep1 (Jun 2018, self-play) → Ep5 (Apr 2019, it beats the champions) → Ep8 (Aug 2017, the one-on-one, told last on purpose). The milestones layer is in [season-flashbacks-overview §4](season-flashbacks-overview.md).

## 3. Multi-part flashbacks and their escalating reveals
Each part adds exactly one new piece of information. No part repeats a reveal.

### 3.1 THE WOODROSE (Jul 2015), five POVs
| Part | Ep | POV | The question it answers | New reveal | What carries over |
|---|---|---|---|---|---|
| 1 | 3 (F3.1) | Gerg | *Who was at the table?* | The roster, and the chairs that have since dimmed | Place cards; the candle flames |
| 2 | 5 (F5.2) | Alyi | *Who did they want?* | **Alyi was the prize**; his napkin is pulled from both ends | The napkin |
| 3 | 6 (F6.1) | Nole, `HIS VERSION` | *Who paid, and who named it?* | The $1B pledge prints $133M; his fear of ELGOOG; he claims the OPEN neon (paid off in Ep8's "I came up with the name") | The receipt; the neon |
| 4 | 10 (F10.2) | Mario | *Who knew the curve?* | He had already drawn the curve, and priced it (`Addendum:` and a price tag) | The napkin curve; Mas's telescope |
| 5 | 12 (F12.1) | The model, from **Mas's chair** | *What did Mas see?* | He read everyone; nobody read him | Every prop above, plus the tells from Ep4 |

- **Ep1 v3.5 (2026-09-28):** the five parts stay in Ep3–12; none plays in Ep1. Part 5 now carries the reveal of his why (what he wanted at that table: he asks "how far behind are we?" while looking at the room), and the finale's last exchange is that question typed again, answered `define "we."` (the Ep12 outline).
- **Constant across parts:** Mario's card reads `MARIO (UDIAB) · JOINS 2016`. Mas's crystal glass never ripples. Mas never freezes.
- **Intro:** bars 4.4–8 tease the dinner every week, and never explain it.

### 3.2 The 1993 screen (retired as a question, 2026-09-28)
**`HOW DO I WIN?` is retired** (PLAN §8 choice 8A; the showrunner: "i don't want flashback to 1993"). 1993 stays as the intro's imagery: the kid, and a screen that never turns. The thread's parts:

| Part | Ep | Card | Status |
|---|---|---|---|
| 1 | 1 (the old F1.1) | `1993` | Cut from the cold open in v3.1; retired |
| 2 | 4 (F4.2) | `MEANWHILE · 17 DAYS BEFORE HE TURNED 8` | **Kept:** it's Nesnej's 1993 (the diner), Ep4's full motive flashback, and it never needed the kid's question |
| 3 | 7 (F7·m2) | `1993` | **Recommended cut** at Ep7's next pass: the CAPS LOCK light set up the question's capitals, and nothing pays it now |
| 4 | 12 (F12.2) | `1993` | **Cut:** its 20 s go to F12.1 (THE WOODROSE from his chair); `define "win."` becomes `define "we."` |

The intro's bar 3 keeps the screen at 0° all season.

### 3.3 The firing tally
| Ep | Marks | Source |
|---|---|---|
| 1 | TPOOL ×2 `(REPORTED)`, plus the fresh mark 3 (NopeAI, Nov 17, 2023) | F1.2 |
| 4 | Nole's $97.4B bid | F4.1 (present-day) |
| 11 | A half-scratched "?" for the `(DISPUTED)` YC exit | F11.3 |
| 12 | All marks replayed at 4×, and the counter reads ∞ | F12.3 |

### 3.4 The prepper list and the bunker, two parts
- **Ep9 (F9.2):** the `2016` closet opens two inches and shuts. The flashback refuses to play.
- **Ep10 (F10.1):** the closet opens fully. The list, text only and black-barred, is read as a checklist, then intercut with Alyi's 2023 bunker line. **Button:** the Intern has already moved into the bunker.

### 3.5 Nole's grievance, told out of order on purpose
- **Ep2 (F2.3): 2018.** How he left, and a cover story the room didn't buy.
- **Ep6 (F6.1): 2015.** What he paid and what he feared, in his version.
- **Ep8 (F8.1 + Exhibit A): 2017,** why he left, and **2014,** where the fear started.
- The audience learns the grievance is older than the company only in Ep8, when Nole is on the stand.

### 3.6 Mario's thread
- **Ep3 (F3.3):** THE EXODUS, the band breakup with the recipe book.
- **Ep7 (F7.1):** where the recipe book was written, at NopeAI. Plus the TOO DANGEROUS box that always leaks, and the 2s fold-shut callback (F7·m3).
- **Ep10 (F10.2):** he had the curve before he joined, and the price tag.
- The escalation runs from *why he left*, to *what he took*, to *what he knew first*.

### 3.7 LUAP's thread (the kingmaker)
- **Ep4 (F4.3):** 2008–09, the essays: the first sycophant.
- **Ep5 (F5.1):** 2005 and 2014, the cheapest draft and the crown.
- **Ep8 (F8·m):** 2016, "extremely good at becoming powerful." An optional overlay.
- **Ep11 (F11.3):** 2019, THE DIFF: the successor leaves.
- The arc goes from flattery, to coronation, to warning, to succession.

### 3.8 NESNEJ's boxes
- **Ep4 (F4.2):** 1993. The diner, $40k, the empty register.
- **Ep6 (F6.2):** 2016. The first box, then its 2025 echo.
- In both, NESNEJ doesn't flinch: he has been thirty days from going out of business before.

### 3.9 The 2016 triptych (Ep9)
Three 2016 angles in one episode, on the year he prepared for everything:
- `MOVE 37` (Mar): the machine makes a move no human expected.
- The prepper closet (Oct, tease only).
- The Oakland pilot (Sep, played straight).

The three are deliberately clustered here because Ep9 is the episode where "pace" begins. The Ep10 list payoff keeps the prepper beat from being spent early.

---

## 4. Coverage check

### 4.1 Every chapter is used once, or repeated on purpose
| Chapter | Used in | Once / repeated | Note |
|---|---|---|---|
| M1 (1993) | intro only (4 is Nesnej's) | **Retired as a thread** (v3.5) | §3.2 |
| M2 (2002 assembly) | — | **HELD** | Cut by default (CR D40). Replaced by M2b |
| M2b (Oakland 2016) | 9 | Once | New |
| M3 (poker) | 4 | Once, echoed in 12 | F12.1 reuses the tell bars as payoff, not as a new flashback |
| M4 (YC 2005) | 5 | Once | Its date echoes in 6 (F6.3's stamp) |
| M5, M6 (TSOOB ad, WWDC 2008) | 2 | Once | |
| M7 (TPOOL revolts) | 1, 12 | Deliberate: tease, then montage | §3.3 |
| M8, M9 (cannibals, Five Founders) | 4 | Once | |
| M10 (TPOOL sale, ENIZARDYH CAPITAL) | 3 | Once | |
| M11 (YC crown) | 5 | Once | |
| M12 (TIDDER) | 9 | Once | |
| M13–M15 (2015 doom lines) | 10 | Once | |
| M16 (THE WOODROSE) | 3, 5, 6, 10, 12 | **Deliberate 5-part** | §3.1 |
| M17 (founding, $133M) | 6 | Once (inside F6.1) | |
| M18 (prepper list) | 9, 10 | Deliberate 2-part | §3.4 |
| M19 (The Merge) | 11 | Once | |
| M20 (YC exit) | 11 | Once | THE DIFF |
| M21 (100x cap) | 6 | Once | ≤10s |
| M22 (THE ORB's origin) | 6 | Once (micro) | The iris-replay debut |
| M23 (lowercase email) | 8 | Once (coda) | Its date is corrected to Sep 21, 2017 |
| N1 / N2 (NESNEJ) | 4 / 6 | Once each | §3.8 |
| A1 / A2 / A3 (ALYI) | 5 / 5 / 2 + 10 | A3 is split by year (2022 in Ep2, 2023 in Ep10) | |
| G1 / G2 (GERG) | 3 / 11 | Once each | |
| O1–O4 (NOLE) | 8 / 6 (+1s in 8) / 8 / 2 | Once each; O2 gets a 1s callback | §3.5 |
| D1 / D2a / D2b (MARIO) | 10 / 7 / 3 (+2s in 7) | Once each; D2b gets a 2s callback | §3.6 |
| R1 (RIMA) | 7 | Once (micro) | Moved from Ep3 |
| T1 (TASYA) | 8 | Once | |
| K1 (KRAM) | 5 | Once (insert) | |
| L1 (LUAP) | 4, 5, (8), 11 | Deliberate thread | §3.7 |
| S1 / S2 (SIMED) | 5–6 background / 9 | Once | S2 is new (CR E46) |
| B1 (MAON) | 10 | Once (micro) | |
| Z1 (transformer paper) | 11 | Once, optional | |

**Result:** every chapter is scheduled except M2, which is HELD by guardrail. Every repeat is a designed multi-part thread or a ≤2s callback.

### 4.2 Budget and era spread per episode
| Ep | Flashbacks (+micros) | ≈ seconds | Budget | Eras shown | Characters with backstory |
|---|---|---|---|---|---|
| 1 | 3 | 66 | about 66 (v3.5) ✓ | 2018; 2019; 2005–08 | Mas, Alyi, Gerg, Mada |
| 2 | 3 | 80 | 60–150 ✓ | 2006–08; 2022; 2018 | Mas, Alyi, Nole (+DIRE tag) |
| 3 | 3 | 95 | ✓ | 2015; 2012; 2020–21 | Gerg, Mas, Mario/Adelina |
| 4 | 3 | 80 | ✓ | 2003–05; 1993/1997; 2008–09 | Mas, Nesnej, Luap |
| 5 | 2 | 95 | ✓ | 2005/2014; 2012–15 | Luap, Alyi (+Kram insert) |
| 6 | 3 (+1) | 83 | ✓ | 2015; 2016; 2019; 2019–21 | Nole, Nesnej, Mas, THE ORB |
| 7 | 1 (+3) | 64 | ✓ | 2017–20; 2013–18; 1993; 2021 | Mario, Rima, Mas |
| 8 | 2 (+1) | ≤118 | ✓ | 2017 (+2014); 2014→2019; 2016 | Gerg/Nole/Mas/Alyi, Tasya, Luap |
| 9 | 3 (+1) | 63 | ✓ | 2014; 2016 ×3 | Mas, Simed |
| 10 | 2 (+1) | 65 | ✓ | 2015–16 + 2023; 2015; 2017–19 | Mas, Alyi, Mario, Maon |
| 11 | 3 (+1) | 68 | ✓ | 2017; 2018; 2019; (2017) | Mas, Gerg, Luap |
| 12 | 2 | 71 | ≤150 ✓ | 2015 (F12.1 absorbs F12.2's 20 s); montage | The model (Mas's chair), Mas |

### 4.3 Is anything front-loaded?
**No. Here's the evidence.**
1. **Ep1 carries about 66 seconds** (v3.5): why they want AGI (2018), why he owns nothing (2019) and that the firings have happened before (TPOOL). THE WOODROSE and every player's deeper motive wait for Ep2–12.
2. **The biggest reveal is in the finale:** what Mas saw and wanted at THE WOODROSE, from his chair, and the machine's answer to his question, `define "we."` (`HOW DO I WIN?` is retired).
3. **Each character's backstory is spread across the season** rather than clustered:
   - Nole: 2, 6, 8
   - Mario: 3, 7, 10
   - Alyi: 2, 5, 10
   - Gerg: 3, 11
   - Nesnej: 4, 6
   - Luap: 4, 5, (8), 11
   - Tasya: 8
   - Rima: 7
   - Simed: 9
   - Maon: 10
4. **Mario's "why he left" moved from Ep7 to Ep3** (CR E41). He is MAJOR from Ep1, so his motive now arrives within three episodes instead of seven.
5. **The earliest-era material (1993–2009) appears in Ep1, 2, 4, 5, 7 and 12**, not in a single opening block.
6. **One known skew, accepted per CR E48.** Ten of Mas's twelve pre-2015 chapters land in Ep1–5. Mas's personal thread then continues with *post-2015* chapters: Ep6 (100x cap), Ep9 (TIDDER, the closet, the pilot), Ep10 (the doom file), Ep11 (The Merge, THE DIFF). The 1993 thread (Ep7) and THE WOODROSE (Ep6, 10, 12) keep his origin in play through the back half.

### 4.4 Guardrail pass on flashback content
| Flashback | Guardrail applied |
|---|---|
| F1.2, F12.3 | The TPOOL revolts carry only the public, labeled `(REPORTED)` version |
| F2.1 | THE SLEEVE: no face, no thin or frail cues, no reference to his health or death (CR D39) |
| F3.2 | The ENIZARDYH CAPITAL co-founder is family and stays offscreen |
| F3.3 | A band breakup, **not** a flight from an annexation (CR D38). THE OTHER MAS sticker stays light, with no prison jokes |
| F4.3 | Cannibals are only ever hoodie founders on a one-palm cartoon island; never islanders, never a private estate (CR D30) |
| F5.1, F11.3 | ACISSEJ appears only in her public YC role; no reference to her marriage |
| F5.2 | The bedroom is empty of family. The auction is `RECONSTRUCTED` |
| F6.1 | The Napa firepit: no party or birthday framing; the "speciesist" exchange only |
| F8.1 | "I thought he was going to hit me" is a quote only, with no physical staging. No content from the 2023 board memo or the Apr 2026 New Yorker |
| F8.1 Exhibit A | The pentagram is Nole's own analogy, labeled `RECONSTRUCTED`; nothing devotional is mocked |
| F9.3 | No recipients, faces or names from the pilot. Played sincere. **The 2002 assembly stays HELD** |
| F10.1 | Two items on the list are black-barred (CR D37); nothing is drawn but text. ALYI's 2023 bunker line is **HELD** (biography source, CR B14): he appears silent |
| All | No family, health, deaths, weapons, casualties or Epstein-adjacent imagery. The Pentagon arc stays out of the flashbacks entirely |

---

## 5. Intro tease → payoff
The intro teases and never explains. The episode-by-episode slot states live in each episode's `intro-slot.md` (e.g. [ep07](../episodes/ep07/intro-slot.md)).

| Intro beat | What it shows | Paid off in |
|---|---|---|
| Bar 3 | The 1993 kid with the screen turned away (card `1993`) | Imagery only since v3.5: the screen never turns (§3.2); Ep4's other 1993 is Nesnej's |
| Bar 4.1 | 2008: two collars beside THE SLEEVE | Ep2 (F2.1) |
| Bar 4.2 | 2014: the throne and the ramen crown | Ep4 (the cannibals, F4.3), Ep5 (the crown, F5.1) |
| Bars 4.4–8 | THE WOODROSE | Ep3, 5, 6, 10, 12 |
| Bar 5 | Gerg's napkin becomes a website | Ep3 (F3.1); the 2023 demo is Ep1 present-day |
| Bar 5.4 | Alyi's effigy | Ep2 (F2.2) |
| Bar 6.4 | Mario's vault (`DRAFT — DO NOT PUBLISH`) | Ep7 (F7.1) |
| Bar 7.4 | Mario's scroll becomes the telescope | Ep10 (F10.2: the napkin, `Addendum:`) |
| Bar 8 | Nole's `received $133M` check | Ep6 (F6.1) |
| Bar 8.4 | The OPEN → NOPE neon | Ep6 (his version) → Ep8 ("I came up with the name") |
| Place card | **`MARIO (UDIAB) · JOINS 2016`**, corrected from `MARIO (JOINS 2016)` | Ep3, 10 |

---

## 6. Flashback cast and registry updates
Only people who appear in flashbacks are listed. Add every name to [naming.md](../bible/naming.md) before art.

| Parody name | Real counterpart | Flashback episodes | Note |
|---|---|---|---|
| ACISSEJ | Jessica Livingston | 5, 11 | Public YC role only |
| THE OTHER PAUL | Paul Christiano | 3, 12 | Plus an Ep5 present-day lanyard payoff (CR E47) |
| HALO | Chris Olah | 3, 7 (callback), 12 | Ep8 is present-day (the encyclical). Registry: 3, 7, 8, 12 (CR F51) |
| THE BEDROOM GENIUS | Alex Krizhevsky | 5 | |
| THE PROFESSOR | Andrew Ng | 10 | A lanyard on Mario's chair |
| EGAP | Larry Page | 6 (+1s in 8) | |
| THE SLEEVE | Steve Jobs | 2 | Never a face (CR D39) |
| THE OUTGOING CEO | Yishan Wong | 9 | |
| THE MATCHER | Kevin Scott | 8 | **Not NIVEK** (CR F50) |
| LEIHT | Peter Thiel | 3, 10 | Registry adds Ep3 (CR F51) |
| NOTNIH | Geoffrey Hinton | 5 | Registry adds Ep5 (CR F51) |
| DIRE | Reid Hoffman | 2 (F2.3 exit tag) | The registry now lists the flashback in Ep2; Ep6 is present-day (vs SKCAS) |
| THE CHAMPION | Dendi (the pro player) | 8 | Registered in [naming.md](../bible/naming.md) §2j (silhouette only) |
| KRAM, NUCEL | Zuckerberg, LeCun | 5 (insert) | |
| MAON | Noam Brown | 10 (micro) | |
| SIMED | Demis Hassabis | 9 (micro) | Board only |
| RIMA TAMURI | Mira Murati | 7 (micro) | |

**Flashback-era places and products:** SYNNED · UDIAB · EPIRTS · ALSET · TSOOB · TOD NEERG · DROFNATS · THE INSTITUTE (MIT; unchanged, since CAISI became **THE CENTER (FORMERLY SAFETY)**, CR F49) · ENIZARDYH CAPITAL · 1-XGD · ATOD · KOOBECAF · TIDDER · TPOOL · WHY COMBINATOR.

---

## 7. Critic corrections applied
| CR item | What changed | Where |
|---|---|---|
| A1 / E43 | The state dinner is Sep 24; Mario's card was never printed; no empty chair that night | Ep9 button |
| A23 | The "labs in San Francisco alone" line is not used | F9.3 |
| D37 | Two prepper-list items are black-barred | F9.2, F10.1 |
| D38 | THE EXODUS is restaged as a band breakup | F3.3 |
| D39 | THE SLEEVE: no frailty cues, no reference to his death | F2.1 |
| D40 | The 2002 assembly is HELD; the Sep 2016 Oakland pilot replaces it | F9.3, M2/M2b |
| D30 | The cannibals' island is a one-palm cartoon; no private-estate imagery | F4.3 |
| E41 | THE EXODUS moves to Ep3 with a 2s callback in Ep7; the RIMA micro moves to Ep7 | F3.3, F7·m1, F7·m3 |
| E42 | The 1993 card reads `1993`; the Ep4 card reads `MEANWHILE · 17 DAYS BEFORE HE TURNED 8` | F1.1, F4.2, F7·m2, F12.2 |
| E44 | Ep6: F6.3 trimmed to ≤10s. Ep8: the demon becomes a 10s Exhibit A inside the Rashomon | F6.3, F8.1 |
| E45 | Ep11's Rashomon is retitled THE DIFF, with two versions only | F11.3 |
| E46 | New micro: `MAR 2016 · MOVE 37`, board only | F9·m |
| E47 | The UDIAB paddle; Gerg's 2am typing marked `RECONSTRUCTED`; Mas watches WWDC 2024 on a phone; THE OTHER PAUL's lanyard | F5.2, F11.2, F2.1, Ep5 |
| E48 | The optional LUAP overlay under "yes." | F8·m |
| C26 | Mario's napkin gets `Addendum:` and a price tag | F10.2 |
| F49 / F50 / F51 | THE CENTER (FORMERLY SAFETY); THE MATCHER; registry episode merges | §6 |
| FB §0 | The Sep 21, 2017 email date; Mario at UDIAB; the WOODROSE roster from Brockman's blog; eleven leave; the $44M DNNresearch sale | Throughout |

---

## 8. Open items
1. **The 2002 assembly (M2)** needs the user's decision. If it is restored, it returns to Ep9 as a clean-cut, sentence-case beat, and the Oakland pilot moves to a micro. Until then the sentence-case caption tier is retired.
2. **F9.3's present-day line.** The Oakland pilot is motivated by Mas at the UNSC. With the "San Francisco alone" line [UNVERIFIED], the bridge relies on "extreme care" [V per IC] and "We are at a crossroads" [H]. Confirm one before lock.
3. ~~DIRE's registry flashback~~ **Resolved:** the registry lists it in Ep2 (F2.3's exit tag).
4. ~~THE CHAMPION needs a registry entry~~ **Resolved:** registered in [naming.md](../bible/naming.md) §2j.
5. ~~Character-file link slugs~~ **Resolved:** all links resolve.
7. **Lengths reconciled (coordinator pass).** The LEN column and §4.2 now carry the per-episode writers' timings. Ep9, Ep10 and Ep11 were raised to clear the 60s floor (63s, 65s, 68s); Ep7's F7.1 now includes the Jan 2020 recipe book (55s). Each episode's `flashbacks.md` carries the same numbers.
6. **Re-verify before any quote card** (all [K]): the poker quote (F4.1), the 2015 "end of the world" line (F10.1), the Charter wording (F11.2, paraphrase only), and the GTP-2 unicorn sample (F7.1, `RECONSTRUCTED`).
