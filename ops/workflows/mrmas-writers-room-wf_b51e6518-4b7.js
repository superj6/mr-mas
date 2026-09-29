export const meta = {
  name: 'mrmas-writers-room',
  description: 'Write the organized show/ foundation: bible, naming, guardrails, world, gags, characters, timeline + flashback map, 12 episode folders, intro docs; then a consistency pass',
  phases: [
    { title: 'Write', detail: 'bible/world/gags, characters x2, timeline+flashbacks, episodes x3, intro' },
    { title: 'Consistency', detail: 'cross-check names, dates, flashback placement, guardrails; fix in place' },
  ],
}

const SHOW = '/home/jgon/project/art/mrmas/show'
const SRC = SHOW + '/_sources'
const COMMON = `You are a staff writer building the WRITERS' ROOM FOUNDATION for the animated satire "MR. MAS" (Sam Altman -> MAS MANALT; the AI race 2015-2026, 12-episode season; eps 10-12 speculative RSI endgame). Today is 2026-09-25.
Read ${SHOW}/README.md (folder layout + rules of the room). SOURCES (read what you need):
- ${SRC}/plan-v1.md — the approved creative package v1 (show bible, season outline, intro, music, style).
- ${SRC}/design/final.md — full-detail v1 (longer bible, frame-accurate intro table, music cue sheet, guardrails).
- ${SRC}/research/gaps.md — verified master timeline 2015->2026-09-24 + corrections + exclusions.
- ${SRC}/research/early.md, mid.md, recent.md — detailed research dossiers with persona tropes.
- ${SRC}/research/worldcast-cast-integration.md — NEW canonical name registry (incl. President DLANOD J. PMURT and ~30 new figures), Pmurt's arc, per-episode insertions, intro impact.
- ${SRC}/research/worldcast-flashback-map.md — NEW flashback map (backstory distributed across episodes where it motivates the present-day plot).
- ${SRC}/research/worldcast-critic.md — corrections to the two files above (APPLY THEM; they override).
- ${SRC}/research/worldcast-sweep-*.md — raw verified sweeps (US politics, intl/culture, industry).
USER NOTES (binding): flashbacks must be spread through several episodes where they give info/motivation — not front-loaded; a Trump equivalent (PMURT) must be incorporated; don't miss big names in current world news; the broad plot follows real events, filler is obviously comedic; personas exaggerated from real public personas; tech used as visual spectacle.
GUARDRAILS: no private/family life, sexuality as a joke, health, violence against real people (incl. the attack on Altman's home), deaths/suicides/wrongful-death suits, war/military casualties, CSAM, Epstein, unadjudicated crimes. Even-handed satire across companies AND political parties. Mark invented dialogue as [INVENTED]; only verified lines get quotation marks as real quotes, with a source tag.
Write polished, well-organized Markdown files (headers, tables where useful, cross-links like [Mas](../characters/mas-manalt.md)). Use the canonical names from the worldcast registry (with critic corrections). Write ONLY the files assigned to you. Final message: list of files written + any unresolved conflicts you noticed.`

const TASKS = [
  { key: 'bible', prompt: `${COMMON}
YOUR FILES:
- ${SHOW}/bible/overview.md — logline, tagline, tone, theme, what makes it fun for non-AI viewers, season shape (12 eps), the "THE PLAN" device, disclaimer card text.
- ${SHOW}/bible/naming.md — THE canonical naming registry: people (parody | real | tier | faction | first ep), orgs/products/places/media, naming scheme rules, alternates, collision rulings, names deliberately NOT used.
- ${SHOW}/bible/guardrails.md — exclusions (with reasons), fairness rules (every episode roasts >=3 camps; political even-handedness), fact-handling tags ([V]/[P]/[K]/[UNVERIFIED]/[INVENTED]) and how they appear on screen, legal hygiene (parody marks, no cloned voices, no photoreal), per-character "never do" list.
- ${SHOW}/bible/style-status.md — current state of visual style exploration (v1 plan proposed 'scaling fidelity' ink/cut-paper; showrunner found it too cartoony; now exploring STRUCTURAL options: anime cel, paper-puppet diorama, satire latex-puppet caricature, retro adventure-game pixel art, screenlife UI-native, graphic-shape cinema, semi-real painterly, noir motion comic; sparing style switches as an artistic device e.g. engraving for money flashbacks, glyph for AI POV, 1-bit for 1993). Mark as PENDING DECISION.
- ${SHOW}/world/locations.md, ${SHOW}/world/orgs-and-products.md, ${SHOW}/world/props.md — recurring places (the dark room, NOPEAI HQ cathedral, THE WOODROSE, the skyline, the Oval-equivalent, courtrooms, Colossal...), parody orgs/products with their visual identity and real counterpart, signature props (the Orb, the water glass, the guest badge, Mario's scrolls, Nesnej's register, the podium, the kill switch...).
- ${SHOW}/gags/recurring-gags.md — tracker table: gag | setup ep | escalations per ep | payoff ep | notes; include Pmurt gags (renaming things, giant pen, HTURT posts).` },
  { key: 'chars-core', prompt: `${COMMON}
YOUR FILES: one file per character in ${SHOW}/characters/ (kebab-case filename of parody name) for the CORE + TECH cast: Mas Manalt, Gerg Mockbran, Alyi, Nole, Mario, Adelina, Luap, Rima Tamuri, Tasya, Nesnej, Sama Nos, Yrral, Kram, Radnus, Simed, Jerdna, Neleh, Mada, Ttemme, Terb, The Whale, The Orb, The Intern, plus product-characters in one file products-as-characters.md (ChatGTP, Clod, Korg, Sydney, Zombie 4o, the Goblins, Q*), and any NEW industry figures from the worldcast registry marked MAJOR/RECURRING (e.g. Mustafa-, Tim Cook-, Andreessen-, Karp-, Friar-, Simo- equivalents) — cameo-tier industry figures go into ${SHOW}/characters/cameos-industry.md.
Each character file: header (parody name, real counterpart, tier, faction, first/last episode), PUBLIC-PERSONA BASIS (verified traits/quotes with tags), EXAGGERATED TROPE, VISUAL DESIGN NOTES (silhouette, 1-2 signature features, palette, signature prop, style-agnostic), VOICE & DIALOGUE NOTES (cadence, catchphrases — invented ones tagged), NAME-CARD SUBTITLE(s), SEASON ARC (per-episode table: what they want, what happens, flashback involvement), RELATIONSHIPS, RUNNING GAGS, NEVER DO (guardrails specific to them).` },
  { key: 'chars-world', prompt: `${COMMON}
YOUR FILES: one file per character in ${SHOW}/characters/ (kebab-case parody name) for the GOVERNMENT, INTERNATIONAL, MONEY, CRITICS/ACADEMIA, CULTURE/MEDIA casts from the worldcast registry marked MAJOR or RECURRING — definitely including DLANOD J. PMURT (full treatment: arc FEAR->LOVE->DENIAL->RENAME, HTURT posts, THE PODIUM, AI Force, the "super" rename, relationships with each tech king, per-episode table ep1-12), EOJ NEDIB (Ep1 president), and the others the registry names (Vance-, Sacks-, Hegseth-, Lutnick-, Hawley-, Newsom-, Sanders-, Xi-equivalent handled as an offscreen/trope-based presence if the registry says so, Macron-, Modi-, Pope-equivalent, Bengio-, Hinton-, Yudkowsky-, Marcus-, etc.). Cameo-tier figures go into ${SHOW}/characters/cameos-world.md. Same per-file structure as the core cast: header, PUBLIC-PERSONA BASIS (tagged), EXAGGERATED TROPE, VISUAL DESIGN NOTES, VOICE, NAME-CARD SUBTITLE, SEASON ARC table, RELATIONSHIPS, RUNNING GAGS, NEVER DO. Political satire must be even-handed and about public conduct only.` },
  { key: 'timeline', prompt: `${COMMON}
YOUR FILES:
- ${SHOW}/timeline/master-timeline.md — merged, deduplicated, chronological master timeline 1985 -> 2026-09-25 from gaps.md + the worldcast sweeps + critic corrections, grouped by year, each line: date · event · who · source tag · EPISODE it appears in (present-day or flashback). Include a legend. Flag [UNVERIFIED] items clearly and list 'dropped as unverified' at the end.
- ${SHOW}/timeline/flashback-map.md — the final flashback map: (1) backstory chapter list (Mas + other characters), (2) per-episode table ep1-12 with 1-3 flashbacks each: WHEN · POV · WHAT WE SEE · WHY HERE (the present-day beat it motivates) · transition device · era rendering tier, (3) multi-part flashbacks (e.g. THE WOODROSE dinner told from different POVs across episodes; the 1993 screen reveal) with their escalating reveal, (4) a coverage check that no episode is front-loaded and every chapter is used once or deliberately repeated. Apply critic corrections.` },
  ...[['01','04'],['05','08'],['09','12']].map(([a,b]) => ({ key: `eps-${a}-${b}`, prompt: `${COMMON}
YOUR FILES: episode folders ep${a} through ep${b} in ${SHOW}/episodes/ (epNN/). For EACH episode write:
- outline.md — title (Mr. Robot filename style from plan-v1), date span, logline, A/B/C plots, cast list (with links), themes, which camps get roasted (>=3), speculative flag for 10-12.
- beats.md — a semi-detailed beat sheet (~900-1400 words): COLD OPEN, ACT 1, ACT 2, ACT 3, TAG, with numbered beats; mark each beat REAL (with date) or INVENTED; include THE PLAN blueprint segment topic; the tech-as-spectacle set-pieces; where each flashback lands and what it motivates.
- flashbacks.md — this episode's flashbacks from the new flashback map (apply critic corrections): when/POV/what/why-here/transition/era tier.
- facts.md — every real event, quote and figure used, with date, source tag, and notes on what's dramatized; unverified items listed separately.
- gags.md — the episode's jokes/gag bank: running-gag escalations (link ../../gags/recurring-gags.md), one-liners, visual gags, name-card subtitles for newcomers.
- intro-slot.md — this episode's variant of the intro's changing slot (cold-open quote, bar-9 words, skyline change, Orb toast, title subtitle, Pmurt podium beat if any).
- open-questions.md — decisions still needed.
INTEGRATE the new cast (esp. PMURT's arc and the worldcast per-episode insertions) into the v1 outline; keep the v1 season structure; keep flashbacks spread per the new map.` })),
  { key: 'intro', prompt: `${COMMON}
YOUR FILES in ${SHOW}/intro/:
- spec.md — the 30s opening concept ("THE CURVE. Everything scales."), structure by bar, the cold-open line and alternates, the fidelity-tier concept, NOTE that the visual style is pending (structure options being explored — see ../bible/style-status.md) and which parts of the spec are style-agnostic.
- shot-table.md — the frame-accurate shot table (0.0-30.0 s, 96 BPM, 24 fps, 15 frames/beat) from design/final.md, with the read-time rule and text registry notes.
- cue-sheet.md — music concept, the "knee" motif, tier instrumentation, cue sheet with frame hits, production routes (code-composed recommended), SFX list, voice plan.
- episode-slots.md — the per-episode changing slot table ep1-12 updated with the new cast (Pmurt's small gold podium on the skyline hill from Ep3 on, and the ~3 micro-beats the worldcast integration proposes), plus the easter-egg list.` },
]

phase('Write')
const written = await parallel(TASKS.map(t => () =>
  agent(t.prompt, { label: `write:${t.key}`, phase: 'Write' }).then(r => ({ key: t.key, report: r }))
))
const rep = written.filter(Boolean).map(w => `== ${w.key} ==\n${w.report}`).join('\n\n')

phase('Consistency')
const check = await agent(`${COMMON}
YOU ARE THE SCRIPT COORDINATOR. All writers have finished (reports below). Read EVERY file under ${SHOW} except _sources/. Check and FIX IN PLACE (edit the files directly):
1. Names match bible/naming.md everywhere (people, orgs, products); fix drift.
2. Dates/facts consistent between timeline/master-timeline.md, episodes/*/facts.md and character arcs; apply worldcast-critic corrections.
3. Flashbacks: each episode's flashbacks.md matches timeline/flashback-map.md; no episode front-loaded.
4. Every episode roasts >= 3 camps; Mario/Misanthropic and both political parties get roasted; guardrail exclusions respected everywhere.
5. Cross-links resolve (relative links to files that exist); add missing character files as stubs if an episode references a major/recurring character without one.
6. Write ${SHOW}/INDEX.md — a navigable table of contents: every file with a one-line description, plus a 'start here' reading order and a status line per episode.
Final message: a concise list of fixes made and remaining open issues.

WRITER REPORTS:
${rep}`, { label: 'coordinator', phase: 'Consistency' })

return { written: written.filter(Boolean).map(w => w.key), check }
