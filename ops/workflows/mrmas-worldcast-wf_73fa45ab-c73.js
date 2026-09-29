export const meta = {
  name: 'mrmas-worldcast',
  description: 'Find missing world-news figures (Trump admin, intl leaders, industry) for Mr. Mas, verify, name them, and redesign the flashback map',
  phases: [
    { title: 'Sweep', detail: '3 web-verified sweeps: US politics, international/culture, industry' },
    { title: 'Integrate', detail: 'cast additions + Trump-equivalent arc; flashback architect' },
    { title: 'Check', detail: 'completeness + fairness critic' },
  ],
}

const R = '/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/research'
const PLAN = '/home/jgon/.claude/plans/i-want-to-try-snuggly-axolotl.md'
const BASE = `
CONTEXT: Writers' room for "MR. MAS", an animated parody series about Sam Altman ("Mas Manalt") and the AI race. Read the current show bible + season outline at ${PLAN} (sections 1-3), and the verified research timeline at ${R}/gaps.md (plus ${R}/recent.md, ${R}/mid.md, ${R}/early.md as needed). Today is 2026-09-25.
Naming scheme: reversal or anagram of real names (Sam Altman->MAS MANALT, Greg Brockman->GERG MOCKBRAN, Jensen->NESNEJ, Sundar->RADNUS, Larry Ellison->YRRAL, Paul Graham->LUAP, Helen Toner->NELEH, OpenAI->NOPEAI, Twitter->RETTIWT, Apple->ELPPA, Amazon->NOZAMA, TIME->EMIT). Companies/products get parody names too.
Personas are EXAGGERATED versions of real PUBLIC personas; technology is used as visual spectacle. Satire must be even-handed across political sides and companies.
HARD EXCLUSIONS: family/private life, sexuality as a joke, health, violence against real people, deaths/suicides/wrongful-death suits (incl. the OpenAI whistleblower death), war/military casualties, CSAM, criminal allegations not adjudicated, Epstein-related claims. Politics = public statements, public policy actions, public feuds only.
This is RESEARCH/WRITING only: do NOT create or edit files. Use WebSearch/WebFetch (load via ToolSearch "select:WebSearch,WebFetch") to VERIFY dates and quotes, especially 2025-2026. Mark unverified items [UNVERIFIED]. Final message = dense markdown for another agent.
For each figure give: real name | role in the AI story | 3-8 dated key moments (with the verified quote if any) | exaggerated persona trope | signature visual/tech gag | proposed parody name (+1-2 alternates, following the scheme; avoid names that mock ethnicity — for non-Western names prefer a title/trope-based name like "THE WHALE") | importance (MAJOR recurring / RECURRING / CAMEO) | which episodes (ep1 Nov2022-Dec2023, ep2 Jan-Aug2024, ep3 Jul-Dec2024, ep4 Jan-Apr2025, ep5 May-Aug2025, ep6 Sep-Dec2025, ep7 Jan-Mar2026, ep8 Apr-Jun2026, ep9 Jul-Sep2026, ep10-12 speculative).`

const SWEEPS = [
  { key: 'us-politics', prompt: `${BASE}
SWEEP: US POLITICS & GOVERNMENT. The show currently has NO Trump-equivalent on screen (it used an offscreen "THE PODIUM") — the user explicitly wants a Trump equivalent incorporated as a real character. Research exhaustively every AI-relevant Donald Trump moment 2023-2026: Stargate White House announcement (Jan 21 2025), EO 14179, the "Preventing Woke AI" order and AI Action Plan (Jul 2025), EO 14365 state-law preemption, Genesis Mission EO, EO 14409, chip export policy (Nvidia H20 / revenue-share deal, tariffs on chips), US government equity stake in Intel, TikTok, the Musk alliance -> DOGE -> the public June 2025 Musk–Trump feud and any reconciliation, renaming the Pentagon "Department of War", ordering agencies off Anthropic (Feb 27 2026), the "AI Force" and AI czar (Sep 2026), the UN "globalist scheme" speech (Sep 22 2026), AI-generated images/videos he posted, his relationships with Altman, Ellison, Son, Huang, Zuckerberg, Cook, Nadella (White House dinners, the tech-CEO dinner Sep 2025, gold Oval Office, pledges of US investment). Also: JD Vance (Paris AI Action Summit speech Feb 2025, etc.), Joe Biden (Oct 2023 AI EO, May 2023 CEO meeting), Kamala Harris (AI role), David Sacks, Pete Hegseth, Howard Lutnick, Scott Bessent, Michael Kratsios, Sriram Krishnan, Emil Michael, Gavin Newsom (SB 1047 veto 2024, SB 53 2025), Scott Wiener, Josh Hawley, Richard Blumenthal, Chuck Schumer (AI Insight Forums), Ted Cruz (moratorium), Marsha Blackburn, Bernie Sanders (Ban ASI act), Alex Bores, Lina Khan, Jerome Powell, any others significant. Propose the Trump-equivalent's parody name options (reversal/anagram, e.g. "DLANOD PMURT") and a season-long ARC for him (what he wants from the AI kings, how each episode's real events feature him).` },
  { key: 'intl-culture', prompt: `${BASE}
SWEEP: INTERNATIONAL LEADERS, INSTITUTIONS & CULTURE figures connected to the AI story 2022-2026: Xi Jinping (symposium with tech founders Feb 2025, chip war), Liang Wenfeng/DeepSeek (already "THE WHALE"), Moonshot/Kimi, Huawei; Emmanuel Macron (Paris AI Action Summit Feb 2025, Mistral, the Sep 2026 UN session France organized); Arthur Mensch (Mistral); Rishi Sunak (Bletchley Park summit Nov 2023 + his Musk interview), Keir Starmer; Narendra Modi (India AI Impact Summit Feb 2026 — check for any viral moment involving Altman/Amodei); Ursula von der Leyen / the EU AI Act (and Altman's "cease operating" threat); MBS / Saudi Humain; UAE (Sheikh Tahnoon, MGX, G42, Stargate UAE); South Korea/Japan deals (Samsung/SK Stargate, SoftBank); Pope Leo XIV (his statements on AI, name choice, any encyclical/documents 2025-2026); King Charles if relevant; Taylor Swift (TIME Person of the Year 2023 over Altman's CEO of the Year; AI deepfake episode — handle only as public news, no sexualized content); Hollywood (SAG-AFTRA/WGA 2023 AI strikes, Disney deals, Tilly Norwood AI actress 2025); the NYT lawsuit (A.G. Sulzberger); authors' suits; Studio Ghibli/Hayao Miyazaki's old "insult to life itself" quote in the Ghibli craze; podcasters/interviewers who became part of the story (Lex Fridman, Joe Rogan, Theo Von, Tucker Carlson — exclude the whistleblower-death topic); Yoshua Bengio, Geoffrey Hinton (Nobel 2024), Fei-Fei Li, Yann LeCun, Eliezer Yudkowsky (2025 book "If Anyone Builds It, Everyone Dies"), Gary Marcus. Verify and report.` },
  { key: 'industry', prompt: `${BASE}
SWEEP: INDUSTRY / FINANCE FIGURES the show may be missing (check which already exist in the plan's cast): Mustafa Suleyman (Microsoft AI), Kevin Scott, Bill Gates, Tim Cook (Apple–OpenAI then Gemini-for-Siri; any 2026 succession news), Andy Jassy (Amazon–Anthropic, Amazon's $50B into OpenAI 2026), Jeff Bezos (any AI venture e.g. Project Prometheus), Sergey Brin (back at Google, Gemini), Larry Page, Marc Andreessen & Ben Horowitz (a16z, Leading the Future super PAC, "Techno-Optimist Manifesto"), Peter Thiel, Alex Karp (Palantir; dissent on pacing letter), Reid Hoffman, Vinod Khosla, Joshua Kushner (Thrive), Brian Chesky (Altman ally during the Blip), Ron Conway, Aravind Srinivas (Perplexity; $34.5B Chrome bid), Michael Truell (Cursor, acquired by SpaceX), Amjad Masad (Replit), Alexandr Wang (Meta/Scale), Nat Friedman & Daniel Gross, Sarah Friar (OpenAI CFO, "backstop"), Fidji Simo (left Jul 2026), Mark Chen, Jakub Pachocki, Noam Brown, Kevin Weil, Bill Peebles, Jan Leike, John Schulman, Hock Tan (Broadcom), C.C. Wei (TSMC), Lip-Bu Tan (Intel), Lisa Su (already ASIL), Sam Bankman-Fried (FTX's 2022 Anthropic stake; the "other Sam" — adjudicated conviction is public record but keep it light), Shivon Zilis (public testimony only; NO personal-life content), Mark Cuban?, Chamath/All-In podcast hosts (Sacks, Chamath, Friedberg, Calacanis) as a chorus, Garry Tan (YC CEO), any new 2026 power players (e.g. heads of new labs, the new DeepMind CEO after Hassabis moved up, SpaceXAI leadership). Verify and report.` },
]

phase('Sweep')
const sweeps = (await parallel(SWEEPS.map(s => () =>
  agent(s.prompt, { label: `sweep:${s.key}`, phase: 'Sweep' }).then(t => ({ key: s.key, text: t }))
))).filter(Boolean)
log(`sweeps done: ${sweeps.map(s => s.key).join(', ')}`)
const SW = sweeps.map(s => `===== SWEEP: ${s.key} =====\n${s.text}`).join('\n\n')

phase('Integrate')
const [cast, flash] = await parallel([
  () => agent(`${BASE}
YOU ARE THE HEAD WRITER integrating new characters. Using the sweeps below and the existing bible in the plan:
1. CANONICAL NAME REGISTRY: a single table of ALL characters (existing + new) — parody name | real counterpart | tier (MAJOR/RECURRING/CAMEO) | faction (NopeAI, Misanthropic, zAI/SpaceZ, Macrosoft, Elgoog, Atem, Invidia, Government-US, Government-Intl, Money, Critics/Academia, Culture/Media, Agents/Products) — plus a table of org/product/place parody names. Resolve naming collisions (e.g. two YRRALs is an intentional gag; avoid other accidental duplicates). Pick ONE Trump-equivalent name (recommend and justify; list 2 alternates).
2. THE TRUMP-EQUIVALENT: full character entry (exaggerated persona built on public persona — superlatives, gold, signing ceremonies with giant pens, posting, deal-making, loyalty tests; even-handed satire, no health/family/violence/Epstein), signature tech gags (e.g. an AI-generated gold podium, executive orders printed on a giant receipt, a gold "AI Force" uniform reveal), catchphrases built from real public verbal style without fabricating quotes as real, his relationships with each tech king, and a per-episode ARC ep1-ep12 grounded in the verified events (ep1 can feature the Biden-equivalent instead; when does the Trump-equivalent enter? how does his relationship with Nole evolve — alliance, DOGE, feud, etc.).
3. For every other NEW figure worth adding (target 15-30): a compact entry (trope, gag, name-card subtitle, episodes).
4. Per-episode insertion list: for ep1-ep12, which new characters appear and in which beat (1-3 lines each), grounded in dated events.
5. Intro impact: should the Trump-equivalent (and anyone else) appear in the 30s intro skyline/slot? Propose a minimal, high-impact way (e.g. a gold podium tower or a Truth-style post bubble in certain episodes' slot) without overstuffing.

${SW}`, { label: 'integrate:cast', phase: 'Integrate' }),
  () => agent(`${BASE}
YOU ARE THE FLASHBACK ARCHITECT. The user's note: "the flashbacks should be throughout several episodes to give further info/motivation where relevant, not all put in the first." Redesign the season's FLASHBACK MAP so backstory is revealed gradually, each flashback placed in the episode whose present-day plot it explains or motivates (thematic rhyme: e.g. the Tpool board revolt placed right where the 2023 board fires him; the Rosewood/"Woodrose" dinner told in pieces from different POVs across multiple episodes; Nole's 2018 departure revealed when he sues; the poker tells when Mas negotiates; the prepper list when the bunker/pace plot starts).
Deliver:
1. A BACKSTORY CHAPTER LIST: every usable real backstory chapter (Mas: childhood Mac ~1993, school assembly speech (keep sincere, not a joke about sexuality), Stanford poker, Tpool founding/YC 2005 batch, "Where you at?" Boost ad 2006, WWDC 2008 double collar, Tpool board revolts, Luap's cannibal essay 2008, "Five Founders"/"What would Sama do?" 2009, Tpool sale 2012, Hydrazine 2012, YC presidency 2014, Reddit 8-day CEO 2014, "Machine intelligence" blog 2015, Musk email May 2015, Rosewood dinner Jul 2015, founding Dec 2015, the 2016 prepper profile, Jensen's DGX-1 delivery 2016, Dota bot 2017, the Model 3 / "I decline" / painting meeting 2017, "Honest Thoughts" email 2017, Musk departure 2018, the Charter 2018, GPT-2 withheld 2019, YC exit 2019 (disputed), capped-profit 2019, Microsoft $1B 2019, Mario's exodus 2020-21, Alyi's effigy + "feel the AGI" 2022, plus OTHER characters' backstories: Nole's "summoning the demon" 2014 and Larry Page "speciesist" argument, Mario at Baidu/Google Brain and the scaling-laws insight, Alyi's AlexNet 2012 and Google years, Gerg at Stripe, Rima at Tesla, Nesnej's early GPU bets / Denny's origin, Kram's "move fast", Luap's YC founding, Tasya's cloud pivot — only what's verifiable and relevant).
2. The MAP: for each episode ep1-ep12, 1-3 flashbacks (label: WHEN · WHO'S POV · WHAT WE SEE · WHY HERE — the present-day beat it motivates · the transition device, e.g. the curve rewinding, the 1-bit dialog, the Orb's iris replay, a VHS tracking wipe). Multi-part flashbacks (the Woodrose dinner, the 1993 screen) should be split across episodes with an escalating reveal. Keep ep1's flashbacks minimal and teasing; the intro teases the backstory montage only.
3. A short note on the device language (how flashbacks look/sound per era, matching the intro's fidelity tiers: 1-bit, 240p camcorder, Flash-era web, cut-paper).
Use the verified research; mark anything [UNVERIFIED].

${SW}`, { label: 'integrate:flashbacks', phase: 'Integrate' }),
])

phase('Check')
const critic = await agent(`${BASE}
YOU ARE THE COMPLETENESS + FAIRNESS CRITIC. Review the integration outputs below.
(1) Using WebSearch, check for any MAJOR world-news figure connected to the AI race 2022-2026 still missing (think: who would a well-informed viewer expect to see?). (2) Spot-check 10 of the most important new dated claims (esp. Trump-related 2025-2026 items) — CONFIRMED / CORRECTED / UNVERIFIED. (3) Check political even-handedness (Biden-era and Trump-era figures both roasted; Democrats and Republicans both; no partisan halo) and the hard exclusions. (4) Check the flashback map: is backstory well distributed, does each flashback motivate its episode, is anything front-loaded? Output a numbered list of concrete corrections/additions.

===== CAST INTEGRATION =====
${cast}

===== FLASHBACK MAP =====
${flash}`, { label: 'critic:worldcast', phase: 'Check' })

return { cast, flash, critic, sweeps }
