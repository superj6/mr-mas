export const meta = {
  name: "mrmas-style-range",
  description: "Two-tier style range: reference study, capability audit, season opportunity map, style-range bible, then prototypes of drastic leaps (HD anime, low-poly 3D, claymation) and a treatment-pass reel, each critiqued and polished",
  phases: [
    { title: "Research", detail: "reference shows, our capabilities, season opportunities" },
    { title: "Design", detail: "style-range bible + season map, taste critic, finalize" },
    { title: "Prototype", detail: "4 prototypes, each built, critiqued blind, polished" },
    { title: "Reel", detail: "assemble the range reel and the showrunner summary" },
  ],
}

const ROOT = "/home/jgon/project/art/mrmas"
const AUTH = `AUTHORIZATION. The showrunner (the user) said, verbatim:
> "also to be clear on jump ideas, what i meant is we can have some style changes that are more like filter passes, and then rarer some that are drastic changes like high definition anime, 3d, near photorealistic, extra blocky, etc. we want to show off throughout the show the capabilities of what range we're able to do, but not in a forced manner either, only where it makes sense. surely you have other existing shows for reference. and more generally, try to be creative and break boundaries while still being tasteful and generally faithful to the shows tone and flow"
> "some of these may be hard to be done programatically, hence the reason for giving access to video model or similar for the final draft (but still put fully programatic fillers for now)"
> "generally, there should be no hard cutoffs for rules on episode handling. there can be guidelines, but the practical flow and user entertainment is always priority"
Earlier: "we want any simplification to look artistic, not like a limitation of our capability"; "don't make anything too corny"; "high quality and entertaining with good pacing, not amateur"; pixel art is the primary style, glyph rendering for dark foreshadowing.
You are AUTHORIZED to research, write the files your task names, install what your task names, build, render and look at the result. Do not ask questions and do not stop at a proposal. Nothing gets committed.

PROJECT: MR. MAS, an animated parody thriller-drama about Sam Altman (MAS MANALT, "Mr. Mas") and his rivals, 2022 to 2026 plus an RSI endgame. Root ${ROOT}. Show docs ${ROOT}/show (bible/, episodes/epNN/outline.md and beats.md, INDEX.md, characters/). Existing style docs: show/bible/style-status.md (pixel primary), show/bible/style-jumps.md (an older plan of 6 "jumps" with a strict budget: it is being SUPERSEDED by the two-tier range this pass designs; keep its good ideas such as J1 the engraved CANCELLED certificate, J3 the sky opening, J6 the ring in his water; do not edit that file, another pass owns it), show/bible/flow-and-continuity.md (guidance on fluid, coherent cutting and continuous sound; every style change must enter and exit fluidly), show/bible/guardrails.md, show/bible/naming.md (parody names only), show/production/GENAI-UPGRADE-PLAN.md (video-model inserts, pending a Runway key). Engines: studio/ (Remotion 4.0.529, React 19, TypeScript), studio/src/shared/pixel/ (480x270 indexed pixel engine), studio/src/shared/tonal/ (paint, soft, noir, riso, engrave, glyph, pixel, dither, stipple renderers), studio/tools/genvideo/ (video to pixel/glyph converters), studio/src/dev/* (earlier lookdev including anime, animescene, realism, puppet, collage, comic), studio/PIXEL_GUIDE.md and ART_GUIDE.md. Bundled ffmpeg: ${ROOT}/studio/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg (set LD_LIBRARY_PATH to that folder). Machine: CPU only, 14 cores shared with other running renders (use --concurrency=4 at most), disk about 97 to 98 percent full (about 10 GB free): keep scratch small and delete it. Render 1080p max.
FIRM GUARDRAILS: never photoreal or near-photoreal on any caricature of a real person (Mas and every rival included); near-photoreal is for environments, objects, machines, crowds of nobody-in-particular and fictional characters. Anime, clay, low-poly and other stylized treatments of caricatures are fine. No imitation of a named studio's trademarked look on screen (evoke, do not copy). Parody names and logos only. Never clone a voice.
OTHER PASSES RUNNING (do not edit their files): show/episodes/** (season revision), show/episodes/ep01/production/** and studio/src/episodes/ep01/** (Act Four v4), studio/src/dev/jumps/** and show/bible/style-jumps.md (jump fixes), audio/ost/** (soundtrack fixes).`

phase("Research")
const [refs, caps, opps] = await Promise.all([
  agent(`${AUTH}

TASK: reference study. Write ${ROOT}/show/_sources/research/style-range-references.md: 30 to 45 concrete moments from existing shows and films where the style or medium changes, for example Spider-Verse (each character's medium; Gwen's watercolor responding to emotion), Mob Psycho 100 (painted-glass emotional peaks), JoJo (palette-inversion hits), Kaguya-sama (inner-war parodies, genre pastiche), Death Note (the potato chip), FLCL (manga-panel episode), Adventure Time ("A Glitch is a Glitch", "Food Chain"), Community ("Digital Estate Planning" 8-bit, the stop-motion Christmas, "G.I. Jeff"), WandaVision (era sitcom formats), Mr. Robot (the sitcom episode, the single-take episode), Legion, BoJack ("Fish Out of Water", "Time's Arrow"), The Simpsons ("Homer cubed" 3D, guest couch gags), South Park ("Make Love, Not Warcraft"), Gumball (mixed media), The Mitchells vs the Machines (2D doodles on 3D, an AI story), Arcane, Love Death + Robots, Undone and A Scanner Darkly (rotoscope), Satoshi Kon (match cuts between realities), Severance (the corporate orientation cartoons), Scott Pilgrim (game UI), Everything Everywhere All at Once, The Lego Movie (the live-action reveal), Who Framed Roger Rabbit, Chainsaw Man's endings, Serial Experiments Lain, Pantheon, Secret Level, Bandersnatch if useful. Verify details (web search may be exhausted; use RSS or direct page fetches, and mark anything unverified).
For each: the moment, the medium change, WHY it happens (the motivation type: whose perception, whose medium, a diegetic device, an emotional state, memory, genre pastiche for comedy, a reality intrusion), how it enters and exits, how long it lasts, and whether it feels earned or gimmicky. End with 12 lessons for MR. MAS on making range feel motivated, fluid and premium, not forced or corny. Return a 250-word summary.`, { label: "research:references", phase: "Research" }),
  agent(`${AUTH}

TASK: capability audit. Write ${ROOT}/show/production/style-range-capabilities.md: for every candidate medium, what our pipeline can do TODAY at a premium quality level, what it would take, and an honest quality ceiling on this CPU-only machine.
Media to assess: treatment passes on existing scenes (palette inversion, duotone, riso/newsprint, engraving, noir, glyph, 1-bit, Game Boy 4-shade, CRT/VHS/archive, security-camera and thermal, video-call compression breakdown, "AI video tells" such as morphing hands and gibberish text, spreadsheet-cell render, blueprint, ASCII); extra blocky (mega-pixel and voxel); HD cel anime (line art, flat plus shadow shading, speed lines, impact frames, lens flares) with our cast designs; low-poly 3D and real 3D (three.js via @remotion/three, headless WebGL via SwiftShader or ANGLE, render speed per frame at 1080p; check the Remotion docs for the right --gl flag); claymation and stop-motion looks (clay materials, fingerprints, boiling on 2s or 3s); paper cut-out; watercolor and painted; rotoscope-like; near-photoreal (what three.js can honestly reach on CPU; what Blender Cycles on CPU would reach and cost in time and disk if installed; what the video-model route in GENAI-UPGRADE-PLAN.md gives).
Read the existing lookdev in studio/src/dev/ and studio/src/shared/tonal/ and run tiny timing tests where useful (delete scratch). You MAY install three and @remotion/three pinned to Remotion's exact version 4.0.529 into studio/ with npm (no other upgrades; run the Remotion bundle for one existing composition afterwards to prove nothing broke). Do not install Blender; estimate it. Return a 250-word summary with a table: medium, feasible now (yes, partly, needs resource), quality ceiling, cost per 5 s shot, and the resource that would lift it.`, { label: "research:capabilities", phase: "Research" }),
  agent(`${AUTH}

TASK: season opportunity map. Read show/INDEX.md, every show/episodes/epNN/outline.md and beats.md, show/bible/style-jumps.md (the season map section), show/bible/orbit-and-lore.md, show/bible/world-stakes.md section 10 headings, and show/characters/ for the rivals. Find every moment in the season where a style change would be MOTIVATED, in two tiers:
- TIER 1 (passes): a treatment over the same scene (a filter, palette or texture change), motivated by a diegetic device (a security camera, a phone, a video call, a broadcast), an emotional state, how an event will be remembered, or the machine's view.
- TIER 2 (leaps): a drastic medium change (HD anime, 3D, near-photoreal environments, extra blocky, claymation, painted, rotoscope-like and so on), motivated by story: whose perception or product it is, a real event in the record that was itself about media (the lead's seeds to evaluate, not to accept blindly: the Mar 2025 wave when a new image model turned the internet into soft painted anime portraits, which is also when "our GPUs are melting" was said; KRAM's metaverse with low-poly legless avatars; NESNEJ's keynotes where the stage and a digital twin are near-photoreal renders; CLOD the polite clay golem as claymation; the "Claude plays Pokemon" stream as a 4-shade handheld pass; zAI's anime companion app as the lens for a Nole scene, kept strictly non-sexual; Ep8's Rashomon renders where each witness's version is drawn by their own company's image model; a Kaguya-sama or Death Note style inner war for a psychological duel such as THE HUG or the trial; Ep9's agents' sandbox city as a voxel or 3D world; the endgame, where the machine can render anything, as the season's near-photoreal environments).
Consider a season spine: the show renders at the fidelity of the machine (the intro already renders each era at its fidelity), so the range could widen as the models do, peaking in the endgame. Test that idea; keep it only if it helps.
Write ${ROOT}/show/_sources/research/style-range-opportunities.md: a per-episode table of candidate moments (episode, scene or beat, tier, medium, motivation, how it enters and exits, rough length, risk of feeling forced), and your ranking of the 12 strongest Tier 2 leaps. Return a 250-word summary.`, { label: "research:opportunities", phase: "Research" }),
])

phase("Design")
const bible0 = await agent(`${AUTH}

TASK: write ${ROOT}/show/bible/style-range.md, the show's style-range bible (it supersedes style-jumps.md's budget and framework; keep and credit that file's good ideas and J-ids).
Inputs: the three research files and these summaries.
REFERENCES: ${refs}
CAPABILITIES: ${caps}
OPPORTUNITIES: ${opps}
Contents:
1. Philosophy: why the show changes medium (the season spine if it holds up; perception and POV through Mas; the medium is the message; showing range as part of the joke without forcing it). Quote the showrunner.
2. Tier 1 PASSES: the vocabulary (each pass, what it means in this show, where it can appear), and guidance on frequency (a few per episode where motivated, as a guide, never a quota).
3. Tier 2 LEAPS: the vocabulary (each medium, what it means, how it is made, its quality ceiling today, the resource that would lift it), and guidance on frequency (rarer; roughly one per episode or two, clustering where the story peaks; never forced).
4. Entering and exiting: how every change stays fluid with the flow guide (motivated bridges, sound carrying across, no crossfaded "filter on" moments unless that is the joke), and how long they tend to last.
5. Guardrails (the firm ones above) and taste tests (is it motivated, does it serve the scene, would it survive a cold viewer, is it corny, does it look premium).
6. The season map: per episode, the Tier 1 passes and Tier 2 leaps, each with scene, motivation, medium, rough length, status "proposed", and TWO build routes: the FILLER (fully programmatic, built now for the first pass, as good as code can make it) and the FINAL (the intended final-draft route: code, a video model or image model per GENAI-UPGRADE-PLAN.md, Blender, or a human artist). Hard media such as near-photoreal environments and high-end anime are expected to reach their final look through a video model later; the filler must still play well in the first pass and hold the moment's timing, framing and meaning so the final can drop in as a layer swap.
7. The prototype slate: exactly four prototypes to build now that show the most range with the highest quality we can reach today: (a) an HD cel-anime leap, (b) a low-poly or real 3D leap, (c) a claymation or other tactile leap (or extra blocky, if the capability audit says it's stronger), (d) a Tier 1 reel of 5 to 6 passes on existing scenes. For each: which season moment it prototypes, a frame-by-frame brief (about 4 to 8 s), how it enters and exits from pixel art, sound notes, and what "premium" means for it.
8. Resource asks that would unlock near-photoreal and higher-end 3D (for example a Blender install and disk, the video-model key), with what each would buy.
Return a 300-word summary.`, { label: "design:bible", phase: "Design" })

const critic = await agent(`${AUTH}

TASK: adversarial taste critic (do not edit files). Read ${ROOT}/show/bible/style-range.md, the research files and a few episode outlines. As a showrunner with taste, attack: which proposed moments are forced, gimmicky or corny; which ones crowd an episode or break its flow; which misread the tone (a thriller with a satirist's eye); where the map shows off range for its own sake; where a leap risks a guardrail; which great opportunities are missing; whether the four prototypes are the strongest proof of range, and whether each brief would really look premium. Bible summary: ${bible0}
Return a numbered list of concrete amendments, most important first.`, { label: "design:critic", phase: "Design" })

const bible = await agent(`${AUTH}

TASK: finalize ${ROOT}/show/bible/style-range.md by applying the critic's valid amendments (log rejected ones with a reason at the end). CRITIC: ${critic}
Then return, as JSON-like plain text, the final four prototype briefs, each with: id (P1..P4), title, the season moment, medium, the frame-by-frame brief, entry and exit, sound notes, premium criteria, the folder to build in (studio/src/dev/range/p1 .. p4) and the output path (out/range/p1.mp4 .. p4.mp4).`, { label: "design:finalize", phase: "Design" })

phase("Prototype")
const PROTOS = ["P1", "P2", "P3", "P4"]
const built = await pipeline(PROTOS,
  (id) => agent(`${AUTH}

TASK: build prototype ${id} from the final briefs below. Build only in studio/src/dev/range/${id.toLowerCase()}/ (with its own dev entry using studio/src/dev/makeRoot.tsx, like other dev builders) and write outputs to out/range/ (create it): ${id.toLowerCase()}.mp4 (1080p, 24 fps, with sound if the brief has sound), 3 to 4 key stills, and a contact sheet. Reuse existing cast, rooms and palettes; the entry from and exit back to pixel art must match the real pixel frames. If ${id} needs three.js, use the packages the capability audit installed (check studio/package.json; if they are missing, install three and @remotion/three pinned to 4.0.529). Iterate at least 3 rounds of render, look (pull frames from the ENCODED mp4, at full size and downscaled to 480x270), fix. Aim for premium within what code can do: this is the fully programmatic FILLER for a moment whose final draft may come from a video model later, so it must hold the moment's timing, framing, meaning and entry and exit exactly, and still look intentional, never like a filter preset or a tech demo. Note in your report what the final-draft route would add. Delete scratch frames.
FINAL BRIEFS: ${bible}
Return: what you built, file paths, render time per frame, and honest weaknesses.`, { label: `build:${id}`, phase: "Prototype" }),
  (rep, id) => agent(`You are a COLD VIEWER with a sharp eye for animation quality. Do not read any design docs or source code. Look at out/range/${id.toLowerCase()}.mp4 in ${ROOT} by extracting frames with ${ROOT}/studio/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg (set LD_LIBRARY_PATH to that folder) into /tmp/claude-1000/-home-jgon-project-art-mrmas/a5e7723c-6ab4-4824-a1ed-8e367fdb82e5/scratchpad/range-cold-${id}/ (every 4th frame, plus every frame around any change of look), and at its key stills in out/range/. Also view them downscaled to 480x270 with system python3 and PIL. Answer plainly: what style or medium is each part in; does the change of style feel motivated or random; does it look premium, amateur, like a filter preset, like a tech demo, or corny; is anything unreadable or ugly; how does it enter and exit; what are the three things you would fix first. Delete your frames. Do not edit files.`, { label: `cold:${id}`, phase: "Prototype" }).then(c => ({ rep, c })),
  (x, id) => agent(`${AUTH}

TASK: polish prototype ${id}. You own studio/src/dev/range/${id.toLowerCase()}/ and out/range/${id.toLowerCase()}* only.
Builder's report: ${x.rep}
Blind cold-viewer review: ${x.c}
Fix every point where the viewer's read differs from the intent and the three things they would fix first, plus anything else that keeps it from looking premium. Re-render, re-check from encoded frames at full size and at 480x270, delete scratch. Return what changed, final paths, and honest remaining weaknesses.`, { label: `polish:${id}`, phase: "Prototype" }),
)

phase("Reel")
const reel = await agent(`${AUTH}

TASK: assemble ${ROOT}/out/range/range-reel.mp4 from out/range/p1.mp4 .. p4.mp4 (1 s of black between clips, a small slate before each with its id, tier, medium and season moment, 1080p, sound kept), plus out/range/range-sheet.png (one key still per prototype). Use the bundled ffmpeg (decode to frames and re-encode if its filters are limited; see studio/src/dev/jumps/tools/reel.sh for a working approach). Then append a "Prototype results" section to ${ROOT}/show/bible/style-range.md with each prototype's final state and weaknesses.
Polish reports: ${built.filter(Boolean).join("\n---\n")}
Return a 300-word plain summary for the showrunner: the idea of the two tiers, the season map highlights by episode, what each prototype shows and how good it honestly is, and the resource asks for near-photoreal and higher-end 3D.`, { label: "reel:assemble", phase: "Reel" })

return { bible, built, reel }
