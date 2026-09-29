export const meta = {
  name: 'mrmas-opening-script',
  description: 'Write the master A/V opening script (pixel-first, style switches, jazz/8-bit score, VO, SFX, blips, per-episode slot), verify with 3 critics, finalize',
  phases: [
    { title: 'Draft', detail: 'screenwriter consolidates all current decisions into SCRIPT.md' },
    { title: 'Verify', detail: 'timing/grid, tone+guardrails, audio sync' },
    { title: 'Final', detail: 'editor applies verified fixes' },
  ],
}

const ROOT = '/home/jgon/project/art/mrmas'
const SCRIPT = ROOT + '/show/intro/SCRIPT.md'
const SOURCES = `SOURCES (read all that exist; later decisions override earlier ones):
- ${ROOT}/studio/INTRO_PIXEL_BRIEF.md — LATEST visual decision: pixel art primary; the intro's moments and the motivated style switches (BASE, 1-BIT, EARLY-WEB16, 2-tone freeze, GLYPH, LEDGER). Binding.
- ${ROOT}/show/intro/shot-table.md, spec.md, cue-sheet.md, episode-slots.md — detailed v1 intro docs (frame-accurate, 96 BPM / 24 fps, 15 frames/beat); their visual-style and music-style descriptions are SUPERSEDED where they conflict with the pixel brief and the audio direction below, but their timing, gags, text, and per-episode slot content are the base.
- ${ROOT}/show/_sources/design/final.md §3-4 — original shot table + music cue sheet (hit frames).
- ${ROOT}/show/bible/naming.md and ${ROOT}/show/characters/*.md — canonical names/personas. The Trump-equivalent is DLANOD J. RUMPT ("President RUMPT") — the user's choice; files may still say PMURT (rename pending) — ALWAYS write RUMPT.
- ${ROOT}/show/bible/guardrails.md — exclusions and fairness rules.
- ${ROOT}/studio/notes/m*.md and ${ROOT}/out/pixel/ (if present) — pixel intro moments being built right now (mcoldopen 0-119, meras 120-239, mdinner1 225-359, mdinner2 345-479, mfinale 480-719); align with their choices where they exist.
- AUDIO DIRECTION (latest, binding): the score sits BETWEEN PIANO, ORCHESTRAL and BIG BAND (big-band brass only as accents), with SOME JAZZ FEEL (extended/quartal harmony, light swing — swung 2nd eighth = 10 frames after the beat at 96 BPM — walking bass in places, a muted-trumpet moment), and 8-BIT CHIP MOTIFS present throughout as the identity; the knee motif F F F F G Ab C F; four variations in progress: V1 'Chip Chamber Jazz' (recommended; piano 35 / orchestra 30 / big band 10 / chip 25), V2 'Orchestral Noir, Chip Heart', V3 'Pixel Swing', V4 'Piano & Pixels'. Hits: name cards f240/300/360/420; 'music fired' mute f495-509, slam f510; final quartal hit with NO third f630; ding f705. ${ROOT}/audio/theme/VARIATIONS.md may exist.
- VOICES: synthetic stock voices for now (no cloning, no accent humor); cold-open VO is Mas: "near the singularity; unclear which side." (real Jan 2025 post recast), soft close-mic, VO f24-91 with the semicolon pause; pixel dialogue BLIP voices per character in text boxes (${ROOT}/audio/sfx/manifest.json may exist); a whispered-then-shouted "feel… the… A-G-I!" gang chant at the Alyi card (f285-307); wordless close-harmony vocal pad under the title hit.
- User notes: nothing corny; simplifications must read as artistic choices; the title sequence should exercise a few style changes.`

phase('Draft')
const draft = await agent(`You are the SCREENWRITER / title-sequence writer of "MR. MAS" (animated pixel-art satire of the AI race; Sam Altman -> MAS MANALT). Write the MASTER OPENING SCRIPT to ${SCRIPT} — the single source of truth for the 30.0 s opening (720 frames @ 24 fps, 96 BPM, 12 bars of 2.5 s).
${SOURCES}
FORMAT (Markdown):
1. Header block: title, version (v2.0 pixel/jazz), date 2026-09-25, runtime, grid, what it supersedes, legend of STYLE TAGS ([BASE], [1-BIT], [EARLY-WEB16], [2-TONE FREEZE], [GLYPH], [GLYPH-MASKED], [LEDGER]) and AUDIO TAGS (MUS, SFX, VO, BLIP, CHANT, PAD).
2. The opening in one paragraph (what the viewer experiences; the 'THE CURVE — everything scales' idea in pixel terms).
3. THE A/V SCRIPT: a two-column screenplay rendered as a table per SCENE (Cold Open; 1993; 2008-2014; THE WOODROSE — Gerg, Alyi, Mario, Nole; The Founding; Episode Slot (Ep1 shown); Skyline; Title; Bookend). Columns: TC (s) · frames · bar.beat | VIDEO (style tag, action, camera as whole-pixel scrolls/cuts, on-screen text in quotes) | AUDIO (MUS cue for V1 with brief V2/V3/V4 notes where they differ; SFX; VO/dialogue with character + delivery direction; BLIP; CHANT; PAD). Every row must be concrete and shootable. Cover every frame 0-719 with no gaps/overlaps.
4. DIALOGUE & VO sheet (every spoken/typed line, speaker, frames, delivery, source tag: real quote vs [INVENTED]).
5. ON-SCREEN TEXT REGISTRY (every must-read text item: text, frames in/out, char count, required read time 0.25 s + 0.05 s/char, PASS/FAIL) and EASTER EGGS (non-must-read).
6. NAME CARDS (exact text + intro action + freeze behaviour + Mas's background gag + card audio).
7. STYLE-SWITCH LOG (each switch: frames, style, story motivation, why it is not a gimmick, exit).
8. PER-EPISODE SLOT (Ep1-12): cold-open quote, bar-9 words and action, skyline change, Orb toast, title subtitle, any RUMPT beat (e.g. his small gold podium on the skyline hill from Ep3), speculative flag for 10-12.
9. PRODUCTION NOTES: what is placeholder (synthetic voices, code-composed music), dependencies on pixel moments in progress, open questions for the showrunner (max 6).`, { label: 'script:draft', phase: 'Draft' })

phase('Verify')
const CR = [
  { key: 'timing', p: `ROLE: TIMING + CONTINUITY CHECKER. Verify in ${SCRIPT}: rows cover frames 0-719 exactly (no gaps/overlaps); TC = frames/24; bar.beat labels = frame/15 math; every music hit and card freeze lands on the stated frames; VO timing fits (≈5 syllables/s soft delivery); the on-screen text registry math (0.25 s + 0.05 s/char) is correct and every must-read item passes; consistency with the pixel moment specs in ${ROOT}/studio/INTRO_PIXEL_BRIEF.md and any ${ROOT}/studio/notes/m*.md. Output numbered, concrete fixes (quote the row, give the corrected text).` },
  { key: 'tone', p: `ROLE: COMEDY + TONE + GUARDRAILS EDITOR. Check ${SCRIPT}: is anything corny, over-explained, or winking in a way that breaks rhythm? Are style switches motivated and brief? Are jokes sharp and grounded in real persona/events, readable to non-insiders while rewarding insiders? Names canonical (RUMPT, never PMURT); guardrails respected (${ROOT}/show/bible/guardrails.md); satire even-handed (Mario/Misanthropic and both political sides roasted across the per-episode slots). Output numbered, concrete fixes with replacement text (punch-ups welcome).` },
  { key: 'audio', p: `ROLE: MUSIC SUPERVISOR + SOUND EDITOR. Check ${SCRIPT}'s AUDIO column against the audio direction: piano/orchestral/big-band blend with brass only as accents, jazz feel, chip motifs present throughout, the four variations V1-V4 described consistently, the swing grid (10-frame swung eighths), hits on the stated frames, VO intelligibility (music ducks under VO f24-91), SFX not cluttering the music, blips only where text boxes appear, chant/pad placement. If ${ROOT}/audio/theme/cues.json or ${ROOT}/audio/sfx/manifest.json exist, align names/frames with them. Output numbered, concrete fixes.` },
]
const reviews = (await parallel(CR.map(c => () => agent(`${SOURCES}\n\n${c.p}`, { label: `script:${c.key}`, phase: 'Verify' }).then(t => ({ key: c.key, text: t }))))).filter(Boolean)

phase('Final')
const fin = await agent(`You are the SCRIPT EDITOR of "MR. MAS". Apply every valid fix below to ${SCRIPT} (edit it in place). Resolve conflicts with judgment: timing correctness first, then guardrails, then tone/comedy, then audio detail. Keep it concise and shootable. Then append a short 'Revision notes (v2.0)' section. Do NOT edit any other file.
${SOURCES}
${reviews.map(r => `===== ${r.key.toUpperCase()} REVIEW =====\n${r.text}`).join('\n\n')}
Final message: a 10-line summary of the finished script (structure, style switches, audio plan, open questions).`, { label: 'script:final', phase: 'Final' })
return { draft, reviews: reviews.map(r => r.key), fin }
