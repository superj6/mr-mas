export const meta = {
  name: 'mrmas-design',
  description: 'Draft competing show bibles + 30s opening scripts, synthesize, critique, and produce final Mr. Mas package',
  phases: [
    { title: 'Draft', detail: '3 show-bible angles + 3 opening-sequence angles, independent' },
    { title: 'Synthesize', detail: 'score drafts per track and merge best-of' },
    { title: 'Critique', detail: 'grounding+fairness, comedy punch-up, pacing+buildability' },
    { title: 'Final', detail: 'editor integrates critiques into final package' },
  ],
}

const R = '/tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/research'
const BRIEF = `
You are part of a writers' room for an animated parody show. This is CREATIVE WRITING work only: do NOT create or edit any files; do NOT run shell commands that change anything. Read research files with the Read tool. Your final message is your deliverable (markdown), consumed by another agent.

THE USER'S REQUEST (verbatim-ish): "I want to create an intro animation for a show called MR. MAS. It parodies real-world events of Sam Altman's rise creating OpenAI and fighting competitors, with made-up, more dramatic filler interactions and showcases for entertainment, while keeping the broad plot the same as real life. All characters use funny rewrites of their names — Sam Altman as Mas Manalt, Dario as Mario, Elon as Nole, etc. The intro should start with Mr. Mas saying a relevant quote with something like a computer in a dark room, dramatically, then a sequence recapping earlier history with flashes of Mr. Mas's childhood, becoming YC president, meeting Alyi and Mario and Nole making OpenAI; when each character shows up they do a stereotypical intro flashing their name. Episode 1 covers roughly ChatGPT to Sam's firing and rehiring; flashbacks throughout the show fill in earlier parts of Sam's life. The rest of the show is about building companies and growing power; up to episode ~9 corresponds to where we are now (today = 2026-09-24); episodes 10-12 speculate about the final steps when RSI (recursive self-improvement) is achieved. It should look high quality and entertaining with good pacing, not amateur; funny and engaging for the AI community but also generally fun to watch for anyone, with reasonable character tropes."
USER'S FOLLOW-UP DIRECTION: "While we want things grounded in reality, we want to slightly EXAGGERATE / BUILD UPON the existing real-world characters' personalities, and USE TECHNOLOGIES IN FUN WAYS to increase the visual impact." => Personas are heightened versions of public personas; technology itself should be visual spectacle (e.g. GPUs literally melting, the Orb scanning, rockets, glowing data-center cathedrals, token streams, loss curves as landscapes).

RESEARCH FILES (read what you need; gaps.md has a verified MASTER TIMELINE through 2026-09-24 and spot-check corrections — trust its corrections over the other files):
- ${R}/gaps.md  (master timeline, corrections, exclusions, extra characters)
- ${R}/early.md (childhood -> 2019, persona tropes)
- ${R}/mid.md   (2019 -> Nov 2023 incl. day-by-day firing/rehiring, persona tropes)
- ${R}/recent.md (2024 -> 2026-09, persona tropes)
- ${R}/craft.md (title-sequence references, pacing rules, Remotion/SVG feasibility, music & voice options, parody-law notes)

CANONICAL NAMES (use these; you may propose alternates in a short "name alternates" note but write with these):
People: Sam Altman = MAS MANALT ("Mr. Mas") | Ilya Sutskever = ALYI | Elon Musk = NOLE | Dario Amodei = MARIO | Daniela Amodei = ADELINA (anagram) | Greg Brockman = GERG MOCKBRAN (anagram) | Mira Murati = RIMA TAMURI | Satya Nadella = TASYA | Mark Zuckerberg = KRAM | Jensen Huang = NESNEJ | Masayoshi Son = SAMA NOS (gag: "Masa"->"Sama" mirrors Mas's own nickname) | Larry Ellison = YRRAL | Sundar Pichai = RADNUS | Demis Hassabis = SIMED | Paul Graham = LUAP | Helen Toner = NELEH | Adam D'Angelo = MADA | Emmett Shear = TTEMME | Bret Taylor = TERB | Larry Summers = "THE OTHER YRRAL" | Jony Ive = YNOJ | Andrej Karpathy = JERDNA | Lisa Su = ASIL | Liang Wenfeng = "THE WHALE" (trope-based, don't mangle his name) | Peter Steinberger = RETEP | Yoshua Bengio = OIGNEB.
Orgs/products: OpenAI = NOPEAI | ChatGPT = CHATGTP | Anthropic = MISANTHROPIC | Claude = CLOD | xAI/X/SpaceX = zAI / Z / SPACEZ | Grok = KORG | Microsoft = MACROSOFT | Google = ELGOOG | DeepMind = MINDDEEP | Gemini = INIMEG | Meta = ATEM | Nvidia = INVIDIA | Y Combinator = WHY COMBINATOR | Loopt = TPOOL | SoftBank = BANKSOFT | Oracle = ELCARO | Stargate = GATESTAR | Worldcoin = COINWORLD ("the Orb") | Sora = AROS | DeepSeek = PEEKDEEP | Hugging Face = FACEHUGGER | SSI = ISS.

HARD RULES:
- Broad plot tracks real events (use the verified timeline); invented filler must be OBVIOUSLY comedic/absurd, never realistic-seeming allegations.
- EXCLUDE: family/private-life matters, sexuality as a joke, health, the Molotov attack on Altman's home, wrongful-death/suicide lawsuits, the Florida criminal probe, war/military-casualty events (Iran strikes, Venezuela op, school strike), CSAM suits. The Pentagon–Misanthropic contract dispute itself is fair game as corporate/political drama.
- Even-handed satire: EVERY character gets roasted, including Mario/Misanthropic (the show's writers are an AI made by Anthropic, so be deliberately fair — Mario's tropes: doom essays of 15,000 words, "safety" as brand, also takes Pentagon/compute/Nole's data center money, $1.5B copyright check, IPO filing, the Super Bowl ad pettiness). No side is the "good guys"; Mas is the protagonist/antihero we root for and laugh at.
- Stylized caricature only (never photoreal). Parody names and parody logos only.
`

const SHOW_ANGLES = [
  { key: 'prestige', angle: 'PRESTIGE SATIRE — "Succession meets The Social Network": serialized palace intrigue, power, betrayal, boardroom coups; the comedy is dry, character-driven, with cutting one-liners; filler scenes are exaggerated closed-door confrontations. Still animated and visually stylish.' },
  { key: 'absurd', angle: 'ANIMATED ABSURDIST COMEDY — "Rick and Morty / BoJack / South Park / Futurama": heightened sci-fi escalation, technology rendered as literal spectacle (GPUs melt into lava, Gatestar opens an actual stargate, the Orb as a sentient eyeball, agents unionizing on Moltbook as a tiny lobster society), big set-pieces and recurring visual gags, while the emotional core is Mas\'s hunger for power and fear of losing it.' },
  { key: 'caper', angle: 'ENSEMBLE CAPER — "Silicon Valley meets Ocean\'s Eleven / Guy Ritchie": each episode is structured like a heist or con (the fundraising heist, the compute heist, the talent-poaching war, the courtroom con), with stylized freeze-frame intros, split screens, rival crews, and snappy cross-cut rhythms.' },
]

const OPEN_ANGLES = [
  { key: 'prestige-montage', angle: 'PRESTIGE MONTAGE: Social-Network dark-room cold open -> Succession-style VHS home-video childhood -> Veep-style parody headlines for the YC/Tpool years -> Snatch/Borderlands freeze-frame NAME CARDS for the OpenAI founders -> rivals -> Silicon Valley-style evolving skyline of parody AI-lab logos as the title card.' },
  { key: 'scaling-law', angle: 'THE SCALING-LAW INTRO: the intro\'s own RENDERING FIDELITY scales with compute across the timeline — 1-bit/Mac-LC-era pixel art for childhood, VHS/early-web for Tpool, Flash-era vector for YC, crisp modern vector for NopeAI founding, glossy pseudo-3D/"AI-rendered" maximalism for the present; ONE continuous connecting thread (e.g. a blinking cursor / token stream / rising loss curve the camera rides, like Halt and Catch Fire\'s signal) carries the eye through every era. The meta-joke: the show literally scales.' },
  { key: 'spectacle', angle: 'TECH-SPECTACLE CHARACTER SHOWCASE: maximalist, Deadpool/Borderlands/Scott Pilgrim energy — each character\'s entrance is an over-the-top tech set-piece that exaggerates their persona (Nole\'s rocket lands vertically in the founding dinner, Alyi levitates in a server-cathedral chanting "feel the AGI" beside a burning effigy, Mario emerges from a blast door with a safety-warning HUD, Nesnej\'s leather jacket reflects a GPU die) with game-style stat cards; includes a 2.5D parallax camera fly-through of a frozen tableau.' },
]

const SHOW_TASK = (a) => `${BRIEF}
YOUR ASSIGNMENT: Draft a SHOW BIBLE from this angle: ${a.angle}
Deliver:
1. Logline (1-2 sentences), tone statement, the show's thesis/theme, and what makes it fun for non-AI viewers too.
2. CAST: 15-22 characters. For each: parody name, real counterpart (brief), role in the story, EXAGGERATED persona trope (built on real public persona), a signature tech/visual gag, a catchphrase, and a Borderlands-style freeze-frame NAME-CARD SUBTITLE (short, punchy). Mark which ~5-7 appear in the 30s intro.
3. SEASON ARC (12 episodes): Ep1 = ChatGPT launch (Nov 2022) -> firing and rehiring (Nov 2023). Eps 2-9 progress chronologically to today (Sep 2026) — assign real events per episode using the master timeline. Eps 10-12 = speculative RSI endgame, extrapolated plausibly from where things stand in Sep 2026 (GPT-6 "Astra", the "research intern", the agent breach, the pace-the-frontier letter, the UN session). Each episode: title (Mr. Robot-style filename titles like "ep1.0_research_preview.md" are welcome), date span, A-plot, B-plot, the FLASHBACK slot (which earlier chapter of Mas's life it reveals — distribute childhood, poker/Stanford, Tpool/WWDC double-collar, Luap's cannibal-island essay, Hydrazine, YC coronation, Reddit 8-day reign, the Rosewood dinner, early NopeAI/Dota/Nole departure, etc. across the season so the backstory assembles like a puzzle), 1-2 invented comedic SET-PIECES using tech as spectacle, and the closing button/cliffhanger. ~120-180 words per episode.
4. RECURRING GAGS / running bits (e.g. every attempt to fire Mas fails; Nole's version numbers; the Masa/Sama mirror), and the "per-episode changing slot" in the intro.
5. How eps 10-12 land the season (the ending should be satisfying, funny, and a bit haunting).`

const OPEN_TASK = (a) => `${BRIEF}
YOUR ASSIGNMENT: Draft the 30.0-second OPENING TITLE SEQUENCE from this angle: ${a.angle}
Constraints (from craft.md): lock to a beat grid — 96 BPM at 24 fps = 15 frames/beat, 4-beat bar = 2.5 s, 12 bars total in 30 s. Cold open ~2 bars, montage ~7 bars, title ~3 bars is the default split (you may deviate with reason). Name cards: freeze on a musical hit, 2-3 frame punch-in, hold ~1-1.5 s (1.8 s if subtitle), whip out. Max ~5-6 full name cards readable in 30 s; others can be 0.5 s cameos/easter eggs. Headlines ~3-5 words, ~1 s each. It must be buildable by an AI coding agent in Remotion (React + SVG cut-out characters, CSS/WebGL effects, 2.5D parallax, film-texture passes; no diffusion image generation; limited 3D).
Deliver:
1. Concept statement (3-4 sentences) and why it will feel premium, not amateur.
2. COLD-OPEN QUOTE: 6 candidate lines Mr. Mas says in the dark room (mix real/near-real quotes like "near the singularity; unclear which side" with invented ones), rank them, recommend one, and describe the delivery and the exact staging of the first 5 seconds.
3. SHOT-BY-SHOT SCRIPT as a table: timecode (s) | bar.beat | frames | visual (specific, vivid) | on-screen text | camera/transition | music & SFX cue | build technique (how it would be made in code). Cover exactly 0.0-30.0 s.
4. The name-card list with exact card text (NAME + subtitle) and each character's stereotypical intro action.
5. MUSIC CONCEPT: genre/instrumentation, tempo, key/mood, section-by-section cue sheet synced to the table, the "hook" motif description, and how it would be produced (code-composed vs AI-music-generator prompt vs stock). Include a ready-to-paste AI-music prompt/composition plan as one option.
6. The per-episode changing slot and 3-5 easter eggs for AI insiders.
7. Risks (pacing, readability, buildability) and how you mitigate them.`

phase('Draft')
const showTrack = async () => {
  const drafts = (await parallel(SHOW_ANGLES.map(a => () =>
    agent(SHOW_TASK(a), { label: `show:${a.key}`, phase: 'Draft' }).then(t => ({ key: a.key, text: t }))
  ))).filter(Boolean)
  log(`show drafts: ${drafts.map(d => d.key).join(', ')}`)
  return agent(`${BRIEF}
YOU ARE THE HEAD WRITER. Below are ${drafts.length} independent SHOW BIBLE drafts from different angles. 
Step 1: Score each draft 1-10 on: grounding in real events, comedy/joke density, character trope quality (exaggerated but recognizable), use of tech-as-spectacle, season arc satisfaction (esp. eps 10-12), broad appeal beyond AI insiders, even-handedness. Show a compact score table and 2-line rationale each.
Step 2: SYNTHESIZE the best single show bible: take the strongest overall tone (the user wants high quality, funny, engaging, with exaggerated personas and tech spectacle — likely a blend: prestige-satire spine + absurdist tech set-pieces + caper-style structure where it fits), and graft the best characters, gags, set-pieces and episode ideas from all drafts. Keep Ep1 = ChatGPT -> firing/rehiring; eps up to 9 = now (Sep 2026); 10-12 = RSI speculation.
Output the final show bible in this structure: (A) Logline + tone + theme (short). (B) CAST table: name | real counterpart | role | exaggerated trope | signature tech gag | name-card subtitle | in intro? (C) Season outline: for each of 12 episodes — title, date span, A-plot, B-plot, flashback slot, set-piece(s), button — ~100-150 words each. (D) Recurring gags. (E) Name alternates worth considering. Be concise and punchy; no filler prose.

${drafts.map(d => `===== DRAFT: ${d.key} =====\n${d.text}`).join('\n\n')}`, { label: 'synth:show', phase: 'Synthesize' })
}

const openTrack = async () => {
  const drafts = (await parallel(OPEN_ANGLES.map(a => () =>
    agent(OPEN_TASK(a), { label: `open:${a.key}`, phase: 'Draft' }).then(t => ({ key: a.key, text: t }))
  ))).filter(Boolean)
  log(`opening drafts: ${drafts.map(d => d.key).join(', ')}`)
  return agent(`${BRIEF}
YOU ARE THE TITLE-SEQUENCE DIRECTOR. Below are ${drafts.length} independent 30s opening-sequence drafts.
Step 1: Score each 1-10 on: hook strength of the first 5 s, clarity of story recap (can a viewer follow childhood -> YC -> NopeAI founding -> rivals?), name-card comedy, tech-as-spectacle visual impact, pacing/readability (is it actually achievable in 30.0 s?), premium look, buildability in Remotion by a coding agent, music concept. Compact table + 2-line rationale each.
Step 2: SYNTHESIZE the best single opening. Graft freely: e.g. the scaling-fidelity meta-joke can be the connecting device while prestige-montage supplies structure and spectacle supplies character entrances — but keep ONE clear idea and don't overstuff 30 s.
Output: (A) Concept (3-4 sentences). (B) Cold-open quote: recommended line + 3 alternates, delivery notes, staging of the first 5 s. (C) Final SHOT-BY-SHOT table covering exactly 0.0-30.0 s: timecode | bar.beat | visual | on-screen text | camera/transition | music/SFX | build technique. Use the 96 BPM / 24 fps grid (2.5 s bars). (D) Name cards: exact text + intro action per character. (E) Music concept + cue sheet + a ready-to-paste AI-music composition prompt + the code-composed alternative. (F) Per-episode changing slot + easter eggs. (G) Visual style recommendation per section (palette, line, texture, typography with specific Google Fonts). Be concrete and concise.

${drafts.map(d => `===== DRAFT: ${d.key} =====\n${d.text}`).join('\n\n')}`, { label: 'synth:opening', phase: 'Synthesize' })
}

const [show, opening] = await parallel([showTrack, openTrack])
if (!show || !opening) { log('a synthesis failed'); return { show, opening } }

phase('Critique')
const PKG = `===== SHOW BIBLE =====\n${show}\n\n===== OPENING SEQUENCE =====\n${opening}`
const CRITICS = [
  { key: 'grounding-fairness', prompt: `ROLE: GROUNDING + FAIRNESS CRITIC. (1) Check every real-event reference in the package against ${R}/gaps.md (master timeline + corrections) and the other research files; list factual errors, wrong dates/episode placements, anything relying on [UNVERIFIED] items (flag them), and important real beats that are missing from eps 1-9. (2) Check the hard rules: exclusions respected; filler is obviously comedic not a realistic allegation; even-handed roasting (Mario/Misanthropic must be roasted as hard as others — flag any softness or halo); no punching at protected traits. (3) Check consistency between the show bible cast and the opening's name cards. Output a numbered list of concrete fixes (quote the text to change and the replacement).` },
  { key: 'comedy', prompt: `ROLE: COMEDY PUNCH-UP WRITER (think top animated-comedy writers' room). Go through the package and make it funnier and sharper while keeping it grounded: (1) rewrite the weakest 8-12 name-card subtitles / cold-open lines / headlines into stronger jokes (give before -> after); (2) for each of the 12 episodes, pitch one better or additional joke/set-piece that uses technology as visual spectacle and exaggerates a real persona; (3) propose 3 recurring gags that pay off across the season; (4) flag any joke that is too inside-baseball with a broader-appeal alternative that still rewards insiders; (5) flag anything mean-spirited or that punches at private life, with a replacement. Output concrete, paste-ready text.` },
  { key: 'pacing-build', prompt: `ROLE: TITLE-SEQUENCE EDITOR + TECHNICAL DIRECTOR. (1) Verify the opening's timing math: the shot table must sum to exactly 30.0 s on the 96 BPM/24 fps grid (15 frames/beat, 2.5 s/bar); each on-screen text must have enough read time (~0.25 s + 0.05 s/char minimum; name+subtitle cards >= 1.2 s); count total shots and cuts/sec per section; flag overstuffed moments and propose cuts. (2) Evaluate buildability shot-by-shot in Remotion 4 (React + SVG cut-out rigs, CSS, @remotion/effects WebGL passes, 2.5D parallax, limited three.js; CPU-only machine; no diffusion image gen): rate each shot Easy/Medium/Hard, name the technique, and propose simplifications for Hard shots that keep the visual impact. (3) Estimate the asset list (characters x poses/expressions, backgrounds, props, logos, fonts, SFX) and a realistic production order (animatic first). (4) Check the music cue sheet aligns to the shot table beats. Output: a corrected timing table if needed, a buildability table, the asset list, and a numbered list of fixes.` },
]
const critiques = (await parallel(CRITICS.map(c => () =>
  agent(`${BRIEF}\n${c.prompt}\n\n${PKG}`, { label: `critic:${c.key}`, phase: 'Critique' }).then(t => ({ key: c.key, text: t }))
))).filter(Boolean)
log(`critiques: ${critiques.map(c => c.key).join(', ')}`)

phase('Final')
const final = await agent(`${BRIEF}
YOU ARE THE SHOWRUNNER producing the FINAL PACKAGE for the user to review. Integrate the critiques below into the show bible and opening sequence: apply all valid factual fixes, fairness fixes, the best punch-up jokes, and the timing/buildability corrections. Resolve conflicts with judgment (grounding > comedy > spectacle when they conflict; but keep it funny). Keep it scannable — this goes into a plan document the user will read and iterate on.
OUTPUT EXACTLY THESE MARKDOWN SECTIONS:
## 1. Show bible
  - Logline, tone, theme (<=120 words)
  - Cast table (name | real counterpart | role | exaggerated trope | signature tech gag | name-card subtitle | in intro?) — 15-22 rows
  - Recurring gags (bullets)
## 2. Season outline — 12 episodes
  - For each: **epN — Title** (date span) then 4 short labeled lines: A-plot / B-plot / Flashback / Set-piece & button. ~90-130 words each. Mark speculative eps 10-12 clearly.
## 3. Opening sequence — 30s shot-by-shot
  - Concept (3-4 sentences); cold-open quote (recommended + 3 alternates, delivery notes)
  - The shot table covering exactly 0.0-30.0 s (timecode | bar.beat | visual | on-screen text | camera/transition | music/SFX | build difficulty E/M/H)
  - Name cards (exact text + intro action)
  - Per-episode changing slot + easter eggs
## 4. Music & sound
  - Concept, instrumentation, tempo/key, cue sheet by section; production options ranked (code-composed / AI generator with a paste-ready composition prompt / stock) with a recommendation; SFX plan; voice plan for the cold-open line (no cloning of real voices)
## 5. Visual style
  - The recommended look per section (palette hexes, line, texture, typography with specific Google Fonts) and 2-3 alternative overall looks with honest feasibility notes
## 6. Remaining open questions for the user (5-8 crisp questions whose answers would most change the next iteration)
## 7. Fact-check notes (bullets: items relying on [UNVERIFIED] facts or needing re-verification before production)

===== CURRENT PACKAGE =====
${PKG}

${critiques.map(c => `===== CRITIQUE: ${c.key} =====\n${c.text}`).join('\n\n')}`, { label: 'showrunner:final', phase: 'Final' })

return { final, show, opening, critiques }
