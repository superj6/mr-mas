export const meta = {
  name: 'mrmas-tone-guide',
  description: 'Thriller-drama tone + dialogue + progression guide for the show: 3 independent craft perspectives, synthesized into show/bible/tone-and-dialogue.md',
  phases: [{ title: 'Panel', detail: '3 craft perspectives' }, { title: 'Guide', detail: 'synthesize the guide' }],
}
const ROOT = '/home/jgon/project/art/mrmas'
const SHOW = ROOT + '/show'
const COMMON = `You work on "MR. MAS", an animated pixel-art satire of the AI race (Sam Altman -> MAS MANALT), told in limited third person through Mas (${SHOW}/bible/pov-and-framing.md, ${SHOW}/bible/pov-clarification.md), 12 x ~22 min. Read ${SHOW}/bible/overview.md, ${SHOW}/format/pacing-model.md, ${SHOW}/characters/mas-manalt.md and skim ${SHOW}/episodes/ep01/script.md and ep02/script.md to see the current writing (do NOT edit them; another writer is revising Ep1 right now).
SHOWRUNNER NOTE (binding, 2026-09-25): "I think the whole outline is looking good, but let's not be clunky with any of the dialogues or progression. It should feel fluid and engaging like any good show; make people feel they are in a THRILLER DRAMA." Keep: the comedy (it is still a satire with high laugh density), the real-event spine, the POV rules, the no-spoiler rule (hint, never announce the climax), guardrails (${SHOW}/bible/guardrails.md), pixel-production realism.`
phase('Panel')
const P = [
  { key: 'prestige', a: "PRESTIGE THRILLER CRAFT (Succession, The Social Network, Michael Clayton, Industry, House of Cards, Mr. Robot): tension engines, dramatic irony, secrets and withholding, power reversals, scene construction (enter late, leave early, end on a turn), dialogue subtext and overlap, the weaponized pause." },
  { key: 'comedy', a: "COMEDY INSIDE DRAMA (Barry, Veep, Silicon Valley, BoJack, The Thick of It, In the Loop, Better Call Saul): how jokes come from character under pressure instead of bolted-on gags; keeping laugh density high without deflating stakes; when a scene must play straight; running gags that escalate tension rather than interrupt it." },
  { key: 'flow', a: "FLOW AND PROGRESSION (editorial craft in animation and thrillers: Breaking Bad, The Bear, Arcane, Death Note, serialized Rick and Morty): transitions (sound bridges, pre-laps, match cuts, smash cuts on reveals), montage that feels propulsive not listy, delivering macro real-event progression inside scenes (consequences, phones buzzing, a character walking in with news) instead of cards, rails and chyrons, cold opens and act-outs that pull forward, and how the pixel adventure-game staging and our devices (the date rail, THE PLAN, name cards, the Orb) can be used sparingly so they never feel clunky." },
]
const d = (await parallel(P.map(x => () => agent(`${COMMON}
YOUR LENS: ${x.a}
Deliver: (1) the 10-15 most important craft rules for this show through your lens, each with a concrete BEFORE -> AFTER example rewritten from the current Ep1/Ep2 scripts (quote the original line or scene, then the improved version); (2) the top clunky patterns you see in the current scripts (with counts/examples) and how to fix each; (3) guidance per character voice for the main cast (Mas, Nole, Gerg, Alyi, Mario, RUMPT, Nesnej, Tasya, Neleh, Mada): how each talks under pressure, what they never say directly; (4) a checklist a writer can run on each scene.`, { label: `tone:${x.key}`, phase: 'Panel' }).then(r => ({ key: x.key, r }))))).filter(Boolean)
phase('Guide')
const g = await agent(`${COMMON}
ROLE: HEAD WRITER. Synthesize the three lenses below into ${SHOW}/bible/tone-and-dialogue.md: the show's tone statement (a thriller drama with a satirist's eye; define the balance), the craft rules (merged, deduplicated, prioritized, each with a short BEFORE -> AFTER from our scripts), clunky patterns to eliminate with the fix for each (e.g. over-use of rail items, cards and chyrons; characters announcing facts; jokes that stop the scene; stacked one-liners without reaction; scenes without a turn; transitions that reset momentum), a transitions toolkit, how to deliver real events inside drama, a per-character voice guide under pressure, a per-scene checklist and a per-episode checklist (tension curve, dramatic irony, reversals, act-outs that pull forward, fluid handoffs). Link it from ${SHOW}/bible/overview.md (one line near the top) and from ${SHOW}/format/pacing-model.md (one line). Final message: the guide in 12 lines.
LENSES:\n${d.map(x => `===== ${x.key} =====\n${x.r}`).join('\n\n')}`, { label: 'tone:synthesize', phase: 'Guide' })
return g
