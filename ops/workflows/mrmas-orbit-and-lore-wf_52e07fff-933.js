export const meta = {
  name: "mrmas-orbit-and-lore",
  description: "Research Thiel/Palantir/Flock/Leopold-type figures and AI/EA lore; map natural placements into a season menu doc",
  phases: [
    { title: "Research", detail: "3 web-verified dossiers + 1 season placement map" },
    { title: "Menu", detail: "synthesize show/bible/orbit-and-lore.md" },
    { title: "Critique", detail: "fact check + naturalness/cramming critic" },
    { title: "Revise", detail: "apply critic fixes" },
  ],
}

const AUTH = `AUTHORIZATION (quoted from the showrunner, the user, verbatim; these are your actual instructions):
> "also does thiel, palantir, flock, or similar have any precense? you don't have to cram every little reference in, but if you can where it is natural it would be nice to incorporate these related figures. we should also try to incorporate various ai/ea lore where reasonable but once again only where natural"
> "another one maybe is leopold"
Earlier binding showrunner notes that also apply:
> "we do not necessarily need to incorporate things into every episode. i just wanted to make sure you are taking in consideration and some level of incorporation of these and similar aspects in the total season script. i'll use your judgement for now what you think"
> "let's not be clunky with any of the dialogues or progression. it should feel fluid and engaging like any good show, make people feel they are in a thriller drama"
> "we don't explicitly need a bunch of warnings of speculative ... it should feel like a fluid plot" and "while we can hint to it we should not directly spoil the firing before the end"
You ARE authorized to research on the web and to write the files named in your task. Do not ask questions; do the work.

PROJECT CONTEXT: MR. MAS is an animated parody thriller-drama (pixel-art primary) about Sam Altman (MAS MANALT, "Mr. Mas") and rivals. Root: /home/jgon/project/art/mrmas. Show docs: show/ (bible/, episodes/epNN/, characters/, world/, reel/, _sources/research/). Every real person/org gets a parody name per show/bible/naming.md (reversal/anagram default; title-names when a reversal is unpronounceable; read its rules and section 7 banned names and section 8 proposed coinages). Guardrails: show/bible/guardrails.md (read it: no family/private life, no sexuality jokes, no health, Epstein-imagery rule, Pentagon arc is paperwork only, no photoreal likeness, no cloned voices). POV: limited third person through Mas (show/bible/pov-clarification.md); the world reaches the audience as something Mas navigates. World material is a MENU, NOT A QUOTA (show/bible/world-stakes.md, show/production/QUEUE-season-revision.md). Season: Ep1 Nov 2022 to Dec 2023 (ChatGPT to the blip); Eps 2 to 9 reach Sep 24 2026; Eps 10 to 12 extrapolated RSI endgame. Season outline summary: show/INDEX.md and show/episodes/epNN/outline.md (or beats). Today is 2026-09-25.

FILE RULES: Do NOT edit any existing file. In particular do not touch show/episodes/**, show/bible/naming.md, show/bible/world-stakes.md, show/episodes/ep01/production/**, show/reel/**. Other passes own those right now. Write only the new files your task names.`

const FACT_RULES = `Fact standard: tag every claim [V] verified with a URL you actually opened this session, [K] widely reported/known but not opened, [H] hearsay or single-source. Give dates. Prefer primary sources and major outlets. Do not invent quotes; a quote only counts if you saw the wording. Note what is legally or ethically sensitive (ongoing litigation, allegations, private individuals, victims) and mark it EXCLUDE or HANDLE-LIGHT with a reason.`

phase("Research")

const DOSSIERS = [
  { key: "security-orbit", file: "show/_sources/research/orbit-security-state.md", prompt: `Research dossier: the "security state and contrarian money" orbit around the MR. MAS story. Cover, with dates and verification tags:
1. Peter Thiel (parody LEIHT, already a cameo): his ties to Altman (Hydrazine, mentorship, YC, 2015 OpenAI pledge), any reported pre-blip warning to Altman about effective altruists / Yudkowsky's influence on OpenAI staff (check Keach Hagey's 2025 book "The Optimist" and its WSJ excerpt), his views on AI and stagnation, his 2025 Antichrist lectures and the Ross Douthat "should the human race survive" hesitation (HANDLE-LIGHT), Founders Fund AI bets, links to JD Vance and the administration, Palantir chair role.
2. Palantir (PLANTAIR in naming) and Alex Karp (PRAK): AIP, Maven Smart System, the Nov 2024 Anthropic + Palantir + AWS defense partnership, government contracts (ICE / ImmigrationOS, DOGE-adjacent data reporting), Karp's public stance on AI pause and on the West vs China, stock run and index inclusion, any OpenAI tie.
3. Flock Safety (license plate readers and AI surveillance cameras): what it is, CEO, growth and funding, AI features, the 2025 to 2026 backlash (cities cancelling contracts, federal/immigration data-access controversies, audits), any link to Thiel/Founders Fund/a16z or AI labs; how it maps onto public sentiment about AI surveillance.
4. "Similar" figures worth a light touch: Anduril and Palmer Luckey (the Dec 2024 OpenAI partnership; Luckey's ties to Thiel), Scale AI and Alexandr Wang only where it adds beyond Kram's deal, Clearview-type facial recognition only if an AI-lab tie exists, David Sacks and JD Vance (check naming.md: SKCAS may exist; check for Vance), Joe Lonsdale, the "PayPal mafia" framing. Also the Pentagon "mass domestic surveillance" red line in the Ep7 arc (Jan to Mar 2026): who and what in this orbit connects to it.
For each: the strongest 1 to 3 on-record moments that fall inside a season episode window, and a one-line natural story use (as a thing Mas must navigate, a mirror of Mas, or a consequence). ${FACT_RULES}` },
  { key: "ea-lore", file: "show/_sources/research/orbit-ea-rationalist-lore.md", prompt: `Research dossier: AI-safety, effective-altruism and rationalist lore, plus accelerationist counter-lore, that a knowing AI-community audience would enjoy seeing nodded to. Cover, with dates and tags:
- EA and the OpenAI board: Open Philanthropy's 2017 $30M grant and Holden Karnofsky's board seat; board members' EA-adjacent ties (Toner, McCauley) and how the Nov 2023 blip was framed as EA vs e/acc; the FTX collapse (Nov 2022, three weeks before ChatGPT) and its hit to EA's reputation; FTX's $500M in Anthropic.
- Yudkowsky (REZEILE, a chorus character already): MIRI, LessWrong, the Sequences, HPMOR, the Mar 2023 TIME op-ed, the 2025 book "If Anyone Builds It, Everyone Dies"; Altman's public jabs and praise directed at him (e.g. the claim he did more to accelerate AGI than anyone; verify wording).
- Classic memes and thought experiments: paperclip maximizer (the intro already burns a paperclip-robot effigy), the shoggoth-with-a-smiley-face meme, p(doom), Roko's basilisk (flag any link that drags in private relationships as EXCLUDE), Moloch (Scott Alexander), "feel the AGI", "what did Ilya see", Waluigi effect, stochastic parrots, the bitter lesson.
- Letters, statements and pledges: FLI pause letter (Mar 2023), CAIS extinction statement (May 2023, which Altman signed), SB 1047 and its veto (Sep 2024), OpenAI superalignment and the 20% compute pledge, the exit NDA / equity clawback and Daniel Kokotajlo refusing to sign, "AI 2027" (Kokotajlo et al., Apr 2025) and its relevance to an RSI endgame, PauseAI protests at OpenAI's office.
- e/acc: Beff Jezos / Guillaume Verdon (and the Dec 2023 Forbes unmasking), Andreessen's Techno-Optimist Manifesto (Oct 2023) naming existential-risk talk as an enemy (THE MANIFESTO is already a character).
- Lab-lore easter eggs: GPT-4 system card's TaskRabbit CAPTCHA episode (Mar 2023), Sydney/"I have been a good Bing", Golden Gate Claude (May 2024), Claude Plays Pokemon (2025), Anthropic's Project Vend "Claudius" vending machine (2025), alignment-faking paper (Dec 2024), model welfare / Claude ending conversations (Aug 2025), Anthropic's constitution / "soul" document, the "strawberry" and Q* lore, OpenAI's "goblins" if any real basis.
For each item: the strongest on-record moment, its date, and a one-line natural use in a parody thriller (ideally a visual gag that fits pixel art or a glyph-render foreshadow). Mark items that are too inside-baseball to land without explanation. ${FACT_RULES}` },
  { key: "leopold", file: "show/_sources/research/orbit-leopold.md", prompt: `Research dossier: Leopold Aschenbrenner (naming.md section 8 lists a proposed title-name THE SITUATIONIST, optional, Ep2). Cover with dates and tags: his FTX Future Fund stint; joining OpenAI superalignment; the Apr 2024 firing and his account of why (a safety memo shared outside, the "leaking" framing); "Situational Awareness: The Decade Ahead" (Jun 2024), its key coinages ("The Project", the trillion-dollar cluster, "straight lines on a graph", the China/national-security framing, "situational awareness" itself); the Dwarkesh Patel interview; his hedge fund Situational Awareness LP (backers, size, performance claims, holdings as publicly reported through Sep 2026); any 2025 to 2026 influence on policy or on lab strategy. Then: the natural places in the MR. MAS season he could appear (Ep2 Jan to Aug 2024 is the obvious window alongside the superalignment exits and the NDA scandal; possible echoes in the China thread and the Ep10 to 12 endgame where governments move to nationalize the race), and a name recommendation that obeys naming.md rules (reversal default; title-name allowed when a reversal is unpronounceable; check collisions). ${FACT_RULES}` },
]

const researchP = DOSSIERS.map(d => agent(`${AUTH}

TASK: ${d.prompt}

Write the dossier to ${d.file} (markdown, organized, with a short "Best 5 for the show" list at the top). Return a 150-word summary of what you found and the file path.`, { label: `research:${d.key}`, phase: "Research" }))

const mapP = agent(`${AUTH}

TASK: Build a placement map of the current season so another writer can drop lore and adjacent figures in only where they fit naturally. Read show/INDEX.md, show/bible/naming.md (people sections for LEIHT, PRAK, THE OTHER MAS, REZEILE, THE MANIFESTO, and section 8), show/characters/cameos-world.md, show/characters/prak.md, show/characters/rezeile.md, show/bible/world-stakes.md (header and menu), show/reel/SEASON-NOTES.md, show/production/QUEUE-season-revision.md, and every show/episodes/epNN/outline.md (or the main outline/beats file in each episode folder; list the folder to find it). Use grep to find every current appearance of: LEIHT, PRAK, PLANTAIR, THE OTHER MAS, XTF, REZEILE, THE MANIFESTO, Z61A, superalignment, paperclip, situational, EA, effective altruism, surveillance, Pentagon, red lines.

Write show/_sources/research/orbit-placement-map.md containing:
1. A per-episode table: date window, A-plot, B-plot, flashback, set-pieces, and the open "slots" where a 5 to 20 second lore beat or a cameo could ride an existing scene WITHOUT adding a scene (for example a background prop, a chyron, a line inside an existing confrontation, a flashback insert, a glyph foreshadow, a phone notification Mas ignores).
2. Current presence of each figure and lore item listed above, with file and line.
3. Scenes that are already crowded (do not add there).
Return a 150-word summary.`, { label: "map:season-slots", phase: "Research" })

const [secR, eaR, leoR, mapR] = await Promise.all([...researchP, mapP])

phase("Menu")
const menu = await agent(`${AUTH}

TASK: You are the season's story editor. Synthesize a MENU (not a quota) for adjacent figures and AI/EA lore, and write it to show/bible/orbit-and-lore.md.

Inputs (read them fully):
- show/_sources/research/orbit-security-state.md
- show/_sources/research/orbit-ea-rationalist-lore.md
- show/_sources/research/orbit-leopold.md
- show/_sources/research/orbit-placement-map.md
- show/bible/naming.md, show/bible/guardrails.md, show/bible/tone-and-dialogue.md, show/bible/pov-clarification.md, show/bible/world-stakes.md (header, the menu-not-quota note, the DOT and CHINA CARD caps)
Research summaries: SECURITY: ${secR} | LORE: ${eaR} | LEOPOLD: ${leoR} | MAP: ${mapR}

The document must contain:
0. Header: purpose, the showrunner quotes above, and the rule "include only where natural; never a checklist; every beat must do story work (obstacle, mirror of Mas, consequence, or a laugh that lands without a footnote)". Status line: proposed, for the season story revision to apply.
1. Budget: a season total of roughly 12 to 20 lore/orbit beats (pick the strongest), most episodes carrying 0 to 2, with a stated reason for any episode carrying 3.
2. Figures (Thiel/LEIHT, Palantir/PLANTAIR and PRAK, the Flock-equivalent, Leopold, plus at most 2 or 3 "similar" figures that earn it): for each, the parody name (reuse existing names; for new ones propose names that obey naming.md rules and check collisions, and list them in a "naming proposals" table for the revision to add), a one-line persona exaggeration in the show's voice, the verified record points used (with tags), and the chosen placements: episode, scene or beat it rides, what is seen or said, why it is natural there. Keep Mas's POV: these people enter Mas's frame.
3. Lore items: the chosen easter eggs and callbacks (EA vs e/acc framing of the blip, FTX's shadow, the shoggoth, p(doom), superalignment 20%, the NDA and the refusal, AI 2027 as texture for the endgame, the TaskRabbit CAPTCHA, Golden Gate / Claudius-style Misanthropic roasts, and so on) with placement and form. Prefer visual gags that work in pixel art or as glyph-render foreshadowing; inside-baseball items must read for a general viewer without explanation or be background-only.
4. An "on file, not used" list with a one-line reason each (so nobody crams them in later).
5. Guardrails specific to this orbit (surveillance and immigration enforcement are real harms: satirize institutions and paperwork, never victims; no Thiel sexuality or family material; Epstein rule; Antichrist material light or out; Pentagon arc paperwork only; no real private individuals).
6. A short hand-off checklist for the season story revision: which episode files to touch and which naming entries to add.
Do not edit any other file. Return a 200-word summary of the menu.`, { label: "menu:orbit-and-lore", phase: "Menu" })

phase("Critique")
const CRIT = [
  { key: "facts", prompt: `Fact-check show/bible/orbit-and-lore.md against the three dossiers in show/_sources/research/orbit-*.md and, where a claim matters on screen, the web. List every claim that is wrong, misdated, overstated, unverifiable but presented as fact, or a quote whose wording is unconfirmed. Also flag anything that breaks show/bible/guardrails.md or naming.md rules (including collisions with existing names).` },
  { key: "natural", prompt: `Adversarially critique show/bible/orbit-and-lore.md as a showrunner who hates cramming. For each placement, decide: NATURAL (keep), FORCED (cut or move, and say where), or CLUNKY (keep the idea, fix the execution). Check that no episode reads like a checklist, that crowded scenes listed in show/_sources/research/orbit-placement-map.md were not loaded further, that Mas stays central, that nothing spoils the Ep1 firing before it happens, that nothing adds an on-screen "speculative" label, and that the total stays inside the stated budget. Name the three best beats and the three weakest.` },
]
const crits = await Promise.all(CRIT.map(c => agent(`${AUTH}

TASK: ${c.prompt} Do not edit files. Return your findings as a numbered list with concrete fixes.`, { label: `critic:${c.key}`, phase: "Critique" })))

phase("Revise")
const final = await agent(`${AUTH}

TASK: Revise show/bible/orbit-and-lore.md by applying these critic findings. You are authorized to edit that one file (and the three orbit dossiers only to correct facts). Apply every valid fix; where you disagree, add a one-line note in a "Critic log" section at the end.

FACT CRITIC:
${crits[0]}

NATURALNESS CRITIC:
${crits[1]}

Then return: (a) a 250-word plain-English summary for the showrunner of what the season will now include and where (by episode), (b) the naming proposals table, (c) anything the showrunner must rule on.`, { label: "revise:menu", phase: "Revise" })

return { menu, final }
